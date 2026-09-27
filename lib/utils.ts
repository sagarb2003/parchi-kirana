import type { CartItem, Order, OrderStatus } from "./types";

export function cn(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const itemTotal = (i: Pick<CartItem, "price" | "qty">) =>
  (i.price ?? 0) * i.qty;

export const itemsSubtotal = (items: CartItem[]) =>
  items.reduce((s, i) => s + itemTotal(i), 0);

/** Packing charge is added once the store accepts and confirms prices. */
export const orderTotal = (o: Order) =>
  itemsSubtotal(o.items.filter((i) => i.available)) + (o.status === "placed" ? 0 : o.packingFee);

export function timeFromNow(min: number) {
  const d = new Date(Date.now() + min * 60000);
  return d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
}

export const itemCount = (items: { qty: number }[]) => items.length;

export const hasUnpriced = (items: CartItem[]) => items.some((i) => i.price === null);

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export const STATUS_META: Record<OrderStatus, { label: string; tone: "amber" | "blue" | "violet" | "green" | "gray" | "red" }> = {
  placed: { label: "Waiting for store", tone: "amber" },
  preparing: { label: "Preparing", tone: "blue" },
  packed: { label: "Packed", tone: "violet" },
  ready: { label: "Ready for pickup", tone: "green" },
  completed: { label: "Completed", tone: "gray" },
  rejected: { label: "Rejected", tone: "red" },
};

export const isActive = (s: OrderStatus) => ["placed", "preparing", "packed", "ready"].includes(s);

export const uid = () => Math.random().toString(36).slice(2, 9);

export function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}
