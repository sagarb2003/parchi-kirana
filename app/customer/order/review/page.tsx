"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookmarkPlus, Check, ImageIcon, Pencil, Plus, Send, ShoppingBag, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, Field, Input, LinkButton, Modal, PageHeader, PageSkeleton, Stepper } from "@/components/ui";
import { CustomItemModal } from "@/components/custom-item-modal";
import { useLookups, useParchi } from "@/lib/store";
import type { CartItem } from "@/lib/types";
import { cn, hasUnpriced, timeFromNow, inr, itemsSubtotal } from "@/lib/utils";

const SLOTS = ["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"];

export default function ReviewPage() {
  const { cart, hydrated, actions } = useParchi();
  const { storeById } = useLookups();
  const router = useRouter();
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<CartItem | null>(null);
  const [custom, setCustom] = useState(false);
  const [saving, setSaving] = useState(false);
  const [listName, setListName] = useState("");
  const [sending, setSending] = useState(false);

  if (!hydrated) return <PageSkeleton />;
  const store = cart.storeId ? storeById(cart.storeId) : undefined;
  if (!store || (cart.items.length === 0 && !cart.listImage))
    return (
      <div className="pt-6">
        <EmptyState icon={<ShoppingBag />} title="Your Parchi is empty" text="Add some items from a store first." action={<LinkButton href="/customer/stores" size="sm">Find a store</LinkButton>} />
      </div>
    );

  const subtotal = itemsSubtotal(cart.items);
  const unpriced = hasUnpriced(cart.items);

  const send = () => {
    setSending(true);
    setTimeout(() => {
      const id = actions.placeOrder(slot ?? timeFromNow(store.prepMinutes), note || undefined);
      router.push(`/customer/order/${id}/placed`);
    }, 700);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link href={`/customer/store/${store.slug}`} className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink/55 hover:text-ink">
        <ArrowLeft size={16} /> Back to {store.name}
      </Link>
      <PageHeader title="Review your Parchi" subtitle={`${store.name} · ${cart.items.length} items`} />

      <Card>
        <ul className="divide-y divide-line">
          {cart.listImage && (
            <li className="flex items-center gap-3 p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cart.listImage} alt="" className="h-14 w-14 rounded-xl border border-line object-cover" />
              <div className="flex-1">
                <p className="flex items-center gap-1.5 font-medium"><ImageIcon size={15} /> Handwritten list photo</p>
                <p className="text-sm text-saffron-600">Store will read items and confirm prices</p>
              </div>
              <button onClick={() => actions.setListImage(store.id, undefined)} className="rounded-lg p-2 text-ink/40 hover:bg-stone-100 hover:text-red-600" aria-label="Remove photo"><Trash2 size={17} /></button>
            </li>
          )}
          {cart.items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-3 p-4 animate-fade-up">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-stone-100 text-2xl">{i.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{i.name}</p>
                <p className="text-sm text-ink/50">{i.unit}{i.price !== null && ` · ${inr(i.price)} each`}</p>
              </div>
              <div className="flex w-full items-center justify-between gap-2 pl-[60px] sm:w-auto sm:pl-0">
                <Stepper value={i.qty} onChange={(v) => actions.setQty(i.id, v)} />
                <span className="w-20 text-right font-semibold tabular-nums">{i.price === null ? <span className="text-xs font-medium text-saffron-600">By store</span> : inr(i.price * i.qty)}</span>
                <div className="flex">
                  <button onClick={() => setEditing(i)} className="rounded-lg p-2 text-ink/40 hover:bg-stone-100 hover:text-ink" aria-label="Edit"><Pencil size={16} /></button>
                  <button onClick={() => { actions.removeFromCart(i.id); actions.toast(`${i.name} removed`, "info"); }} className="rounded-lg p-2 text-ink/40 hover:bg-stone-100 hover:text-red-600" aria-label="Remove"><Trash2 size={16} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 border-t border-line p-3">
          <button onClick={() => setCustom(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50"><Plus size={16} /> Add item manually</button>
          <button onClick={() => setSaving(true)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold text-ink/60 hover:bg-stone-50"><BookmarkPlus size={16} /> Save as list</button>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <h2 className="font-semibold">Pickup preference</h2>
        <label className="mt-3 flex items-center gap-3 rounded-xl border border-brand-500 bg-brand-50/50 p-3.5">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-white"><Check size={12} strokeWidth={3} /></span>
          <span className="font-medium">I&apos;ll pick it up today</span>
          <span className="ml-auto text-sm text-ink/50">{slot ? `at ${slot}` : `Ready in ~${store.prepMinutes} min`}</span>
        </label>
        <p className="mb-2 mt-4 text-sm font-medium text-ink/65">Pickup time <span className="font-normal text-ink/45">(optional)</span></p>
        <div className="flex flex-wrap gap-2">
          {SLOTS.map((s) => (
            <button key={s} onClick={() => setSlot(slot === s ? null : s)} className={cn("rounded-xl border px-4 py-2.5 text-sm font-semibold transition", slot === s ? "border-brand-600 bg-brand-600 text-white" : "border-line hover:border-ink/30")}>
              {s}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <Field label="Note for the store (optional)">
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please pack atta separately" />
          </Field>
        </div>
      </Card>

      <Card className="mt-4 p-5">
        <div className="flex justify-between text-sm text-ink/60"><span>{cart.items.length} items</span><span className="tabular-nums">{inr(subtotal)}</span></div>
        <div className="mt-1 flex justify-between text-sm text-ink/60"><span>Packing charge</span><span>Added by store</span></div>
        <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-line pt-3">
          <span className="font-semibold">Estimated total</span>
          <span className="text-2xl font-bold tabular-nums">{inr(subtotal)}{unpriced || cart.listImage ? "+" : ""}</span>
        </div>
        <p className="mt-2 text-xs text-ink/50">You pay at the store after reviewing the final bill. No online payment needed.</p>
      </Card>

      <div className="sticky bottom-[72px] z-10 mt-6 lg:bottom-4">
        <Button size="lg" className="w-full text-lg shadow-lg" onClick={send} disabled={sending}>
          {sending ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Send size={20} />}
          {sending ? "Sending…" : "Send to Store"}
        </Button>
      </div>

      <EditItemModal item={editing} onClose={() => setEditing(null)} />
      <CustomItemModal open={custom} onClose={() => setCustom(false)} storeId={store.id} />
      <Modal
        open={saving}
        onClose={() => setSaving(false)}
        title="Save as list"
        footer={<Button className="w-full" disabled={!listName.trim()} onClick={() => { actions.createList(listName.trim(), cart.items); setSaving(false); setListName(""); }}>Save list</Button>}
      >
        <Field label="List name" hint={`${cart.items.length} items will be saved for quick reordering.`}>
          <Input autoFocus value={listName} onChange={(e) => setListName(e.target.value)} placeholder="e.g. Monthly Ration" />
        </Field>
      </Modal>
    </div>
  );
}

function EditItemModal({ item, onClose }: { item: CartItem | null; onClose: () => void }) {
  const { actions } = useParchi();
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [lastId, setLastId] = useState<string | null>(null);
  if (item && item.id !== lastId) {
    setLastId(item.id);
    setName(item.name);
    setUnit(item.unit);
  }
  return (
    <Modal
      open={!!item}
      onClose={onClose}
      title="Edit item"
      footer={<Button className="w-full" onClick={() => { if (item) { actions.updateCartItem(item.id, { name, unit }); actions.toast("Item updated"); } onClose(); }}>Save</Button>}
    >
      <div className="space-y-4">
        <Field label="Item name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Pack size / unit" hint="e.g. 5 kg, 2 packets, 1 L"><Input value={unit} onChange={(e) => setUnit(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
