"use client";

/**
 * Parchi demo state.
 *
 * Everything lives in React state and is mirrored to localStorage so the
 * customer and owner views stay in sync (even across browser tabs).
 * When Supabase is connected, each action below maps to a table mutation
 * (orders / order_items / products / staff / saved_lists) and the
 * `storage` listener becomes a realtime subscription.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { CUSTOMER, PRODUCTS, SEED_LISTS, SEED_ORDERS, SEED_STAFF, STORES } from "./mock-data";
import type { CartItem, Order, OrderItem, Product, SavedList, Staff, Store } from "./types";
import { uid } from "./utils";

interface Cart {
  storeId: string | null;
  items: CartItem[];
  listImage?: string;
}

interface State {
  stores: Store[];
  products: Product[];
  orders: Order[];
  lists: SavedList[];
  staff: Staff[];
  cart: Cart;
  nextOrderNo: number;
  nextToken: number;
}

const initialState = (): State => ({
  stores: STORES,
  products: PRODUCTS,
  orders: SEED_ORDERS,
  lists: SEED_LISTS,
  staff: SEED_STAFF,
  cart: { storeId: null, items: [] },
  nextOrderNo: 1027,
  nextToken: 23,
});

export interface Toast {
  id: string;
  message: string;
  tone: "success" | "info" | "error";
}

const KEY = "parchi-demo-v1";

function useParchiState() {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const skipSave = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      try {
        skipSave.current = true;
        setState(JSON.parse(e.newValue));
      } catch {}
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Quota (e.g. a large list photo) — keep working in memory.
    }
  }, [state, hydrated]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = uid();
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800);
  }, []);

  const updateOrder = (id: string, fn: (o: Order) => Order) =>
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? fn(o) : o)) }));

  const setCart = (fn: (c: Cart) => Cart) => setState((s) => ({ ...s, cart: fn(s.cart) }));

  const actions = {
    toast,
    setCartOpen,

    // ---------- Cart ----------
    addToCart(product: Product) {
      setCart((c) => {
        const base = c.storeId === product.storeId ? c : { storeId: product.storeId, items: [] };
        const existing = base.items.find((i) => i.productId === product.id);
        const items = existing
          ? base.items.map((i) => (i === existing ? { ...i, qty: i.qty + 1 } : i))
          : [...base.items, { id: uid(), productId: product.id, name: product.name, unit: product.unit, qty: 1, price: product.price, category: product.category, emoji: product.emoji }];
        return { ...base, items };
      });
    },
    addCustomItem(storeId: string, item: { name: string; qty: number; unit: string }) {
      setCart((c) => {
        const base = c.storeId === storeId ? c : { storeId, items: [] };
        return { ...base, items: [...base.items, { id: uid(), name: item.name, unit: item.unit, qty: item.qty, price: null, category: "Other", emoji: "📝" }] };
      });
    },
    setQty(itemId: string, qty: number) {
      setCart((c) => ({ ...c, items: qty <= 0 ? c.items.filter((i) => i.id !== itemId) : c.items.map((i) => (i.id === itemId ? { ...i, qty } : i)) }));
    },
    updateCartItem(itemId: string, patch: Partial<CartItem>) {
      setCart((c) => ({ ...c, items: c.items.map((i) => (i.id === itemId ? { ...i, ...patch } : i)) }));
    },
    removeFromCart(itemId: string) {
      setCart((c) => ({ ...c, items: c.items.filter((i) => i.id !== itemId) }));
    },
    setListImage(storeId: string, image: string | undefined) {
      setCart((c) => ({ ...(c.storeId === storeId ? c : { storeId, items: [] }), listImage: image }));
    },
    loadIntoCart(storeId: string, items: CartItem[]) {
      setCart(() => ({ storeId, items: items.map((i) => ({ ...i, id: uid() })) }));
    },
    clearCart() {
      setCart(() => ({ storeId: null, items: [] }));
    },

    /** Customer submits the Parchi. Returns the new order id. */
    placeOrder(pickupTime: string, note?: string): string {
      const id = `PCH-${state.nextOrderNo}`;
      setState((s) => {
        if (!s.cart.storeId) return s;
        const order: Order = {
          id,
          storeId: s.cart.storeId,
          customerName: CUSTOMER.name,
          customerPhone: CUSTOMER.phone,
          items: s.cart.items.map<OrderItem>((i) => ({ ...i, available: true, picked: false })),
          status: "placed",
          createdAt: new Date().toISOString(),
          pickupTime,
          packingFee: 5,
          listImage: s.cart.listImage,
          note,
        };
        return { ...s, orders: [order, ...s.orders], cart: { storeId: null, items: [] }, nextOrderNo: s.nextOrderNo + 1 };
      });
      return id;
    },

    // ---------- Owner: order workflow ----------
    acceptOrder(id: string) {
      updateOrder(id, (o) => ({ ...o, status: "preparing" }));
      toast(`${id} accepted — moved to Preparing`);
    },
    rejectOrder(id: string) {
      updateOrder(id, (o) => ({ ...o, status: "rejected" }));
      toast(`${id} rejected`, "info");
    },
    setItemAvailable(orderId: string, itemId: string, available: boolean) {
      updateOrder(orderId, (o) => ({ ...o, items: o.items.map((i) => (i.id === itemId ? { ...i, available } : i)) }));
    },
    setItemPrice(orderId: string, itemId: string, price: number | null) {
      updateOrder(orderId, (o) => ({ ...o, items: o.items.map((i) => (i.id === itemId ? { ...i, price } : i)) }));
    },
    togglePicked(orderId: string, itemId: string) {
      updateOrder(orderId, (o) => ({ ...o, items: o.items.map((i) => (i.id === itemId ? { ...i, picked: !i.picked } : i)) }));
    },
    markPacked(id: string) {
      updateOrder(id, (o) => ({ ...o, status: "packed" }));
      toast(`${id} packed`);
    },
    markReady(id: string) {
      setState((s) => ({
        ...s,
        nextToken: s.nextToken + 1,
        orders: s.orders.map((o) => (o.id === id ? { ...o, status: "ready", token: o.token ?? `A${s.nextToken}` } : o)),
      }));
      toast(`${id} is ready — customer notified`);
    },
    confirmPickup(id: string) {
      updateOrder(id, (o) => ({ ...o, status: "completed" }));
      toast(`${id} picked up. Order completed`);
    },

    // ---------- Owner: catalogue, staff, store ----------
    addProduct(p: Omit<Product, "id">) {
      setState((s) => ({ ...s, products: [{ ...p, id: uid() }, ...s.products] }));
      toast(`${p.name} added`);
    },
    updateProduct(id: string, patch: Partial<Product>) {
      setState((s) => ({ ...s, products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
    },
    addStaff(st: Omit<Staff, "id">) {
      setState((s) => ({ ...s, staff: [...s.staff, { ...st, id: uid() }] }));
      toast(`${st.name} added to staff`);
    },
    toggleStaff(id: string) {
      setState((s) => ({ ...s, staff: s.staff.map((m) => (m.id === id ? { ...m, active: !m.active } : m)) }));
    },
    updateStore(id: string, patch: Partial<Store>) {
      setState((s) => ({ ...s, stores: s.stores.map((st) => (st.id === id ? { ...st, ...patch } : st)) }));
      toast("Store details saved");
    },

    // ---------- Saved lists ----------
    createList(name: string, items: CartItem[], emoji = "📝") {
      setState((s) => ({ ...s, lists: [...s.lists, { id: uid(), name, emoji, items }] }));
      toast(`Saved “${name}”`);
    },
    deleteList(id: string) {
      setState((s) => ({ ...s, lists: s.lists.filter((l) => l.id !== id) }));
      toast("List deleted", "info");
    },

    resetDemo() {
      try {
        localStorage.removeItem(KEY);
      } catch {}
      setState(initialState());
      toast("Demo data reset", "info");
    },
  };

  return { ...state, hydrated, toasts, cartOpen, actions };
}

type Ctx = ReturnType<typeof useParchiState>;
const ParchiContext = createContext<Ctx | null>(null);

export function ParchiProvider({ children }: { children: ReactNode }) {
  const value = useParchiState();
  return <ParchiContext.Provider value={value}>{children}</ParchiContext.Provider>;
}

export function useParchi() {
  const ctx = useContext(ParchiContext);
  if (!ctx) throw new Error("useParchi must be used inside ParchiProvider");
  return ctx;
}

/** The store the demo owner manages. */
export const OWNER_STORE_ID = "s1";

export function useLookups() {
  const { stores, products } = useParchi();
  return useMemo(
    () => ({
      storeById: (id: string) => stores.find((s) => s.id === id),
      storeBySlug: (slug: string) => stores.find((s) => s.slug === slug),
      productsFor: (storeId: string) => products.filter((p) => p.storeId === storeId),
    }),
    [stores, products],
  );
}
