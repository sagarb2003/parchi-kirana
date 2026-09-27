"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ImageIcon, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button, EmptyState, Stepper, buttonClass } from "./ui";
import { CustomItemModal } from "./custom-item-modal";
import { useLookups, useParchi } from "@/lib/store";
import { hasUnpriced, inr, itemsSubtotal } from "@/lib/utils";

export function CartDrawer() {
  const { cart, cartOpen, actions } = useParchi();
  const { storeById } = useLookups();
  const router = useRouter();
  const [custom, setCustom] = useState(false);
  const store = cart.storeId ? storeById(cart.storeId) : undefined;
  const subtotal = itemsSubtotal(cart.items);
  const unpriced = hasUnpriced(cart.items);
  const hasContent = cart.items.length > 0 || !!cart.listImage;

  useEffect(() => {
    if (!cartOpen) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && actions.setCartOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [cartOpen, actions]);

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/30 animate-fade" onClick={() => actions.setCartOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl animate-drawer">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="text-lg font-bold">Your Parchi</h2>
            {store && <p className="text-sm text-ink/55">{store.name}</p>}
          </div>
          <button onClick={() => actions.setCartOpen(false)} className="rounded-full p-2 hover:bg-stone-100" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!hasContent ? (
            <EmptyState
              icon={<ShoppingBag />}
              title="Your Parchi is empty"
              text="Pick a store and add items, or upload a photo of your list."
              action={
                <Link href="/customer/stores" onClick={() => actions.setCartOpen(false)} className={buttonClass("primary", "sm")}>
                  Find a store
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {cart.listImage && (
                <li className="flex items-center gap-3 py-3 animate-fade-up">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cart.listImage} alt="Your list photo" className="h-14 w-14 rounded-xl border border-line object-cover" />
                  <div className="flex-1">
                    <p className="flex items-center gap-1.5 font-medium"><ImageIcon size={14} /> List photo</p>
                    <p className="text-xs text-ink/50">Store will read and price it</p>
                  </div>
                  <button onClick={() => store && actions.setListImage(store.id, undefined)} className="rounded-lg p-2 text-ink/40 hover:bg-stone-100 hover:text-red-600" aria-label="Remove photo">
                    <Trash2 size={16} />
                  </button>
                </li>
              )}
              {cart.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3 animate-fade-up">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-stone-100 text-2xl">{i.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{i.name}</p>
                    <p className="text-sm text-ink/50">
                      {i.unit} · {i.price === null ? <span className="text-saffron-600">Price by store</span> : inr(i.price * i.qty)}
                    </p>
                  </div>
                  <Stepper value={i.qty} onChange={(v) => actions.setQty(i.id, v)} />
                </li>
              ))}
            </ul>
          )}
          {store && (
            <button onClick={() => setCustom(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm font-semibold text-brand-700 hover:bg-brand-50">
              <Plus size={16} /> Add item manually
            </button>
          )}
        </div>

        {hasContent && (
          <div className="space-y-3 border-t border-line bg-canvas px-5 py-4">
            <div className="flex justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span className="tabular-nums">{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Estimated total</span>
              <span key={subtotal} className="tabular-nums animate-pop">{inr(subtotal)}{unpriced && "+"}</span>
            </div>
            {unpriced && <p className="text-xs text-ink/50">Some prices will be confirmed by the store.</p>}
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                actions.setCartOpen(false);
                router.push("/customer/order/review");
              }}
            >
              Review Parchi
            </Button>
          </div>
        )}
      </aside>
      {store && <CustomItemModal open={custom} onClose={() => setCustom(false)} storeId={store.id} />}
    </div>
  );
}
