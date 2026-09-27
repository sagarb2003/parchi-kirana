"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListChecks, Plus, Trash2 } from "lucide-react";
import { Button, Card, EmptyState, Field, Input, Modal, PageHeader, PageSkeleton } from "@/components/ui";
import { useParchi } from "@/lib/store";
import { inr, itemsSubtotal } from "@/lib/utils";

const EMOJIS = ["📝", "🗓️", "🧺", "🍿", "🥛", "🎉", "🍛"];

export default function SavedLists() {
  const { lists, cart, hydrated, actions } = useParchi();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📝");
  const [fromCart, setFromCart] = useState(true);
  if (!hydrated) return <PageSkeleton />;

  const create = () => {
    actions.createList(name.trim(), fromCart ? cart.items : [], emoji);
    setOpen(false);
    setName("");
  };

  return (
    <div>
      <PageHeader title="Saved Lists" subtitle="Your regular groceries, one tap away." action={<Button onClick={() => setOpen(true)}><Plus size={18} /> New list</Button>} />
      {lists.length === 0 ? (
        <EmptyState icon={<ListChecks />} title="No saved lists" text="Save your monthly ration or weekly essentials to reorder in seconds." action={<Button size="sm" onClick={() => setOpen(true)}>Create a list</Button>} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lists.map((l) => (
            <Card key={l.id} className="flex flex-col p-5 animate-fade-up">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-stone-100 text-2xl">{l.emoji}</span>
                <button onClick={() => actions.deleteList(l.id)} className="rounded-lg p-2 text-ink/30 hover:bg-stone-100 hover:text-red-600" aria-label="Delete list"><Trash2 size={16} /></button>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{l.name}</h3>
              <p className="text-sm text-ink/50">{l.items.length} items{l.items.length > 0 && ` · ~${inr(itemsSubtotal(l.items))}`}</p>
              <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink/60">{l.items.map((i) => i.name).join(", ") || "Empty list — add items from a store and save them here."}</p>
              <Button
                variant="secondary"
                className="mt-4 w-full text-brand-700"
                disabled={l.items.length === 0}
                onClick={() => {
                  actions.loadIntoCart(l.items[0]?.productId?.split("-")[0] ?? "s1", l.items);
                  actions.toast(`“${l.name}” added to your Parchi`);
                  router.push("/customer/order/review");
                }}
              >
                Shop this list
              </Button>
            </Card>
          ))}
        </div>
      )}
      <Modal open={open} onClose={() => setOpen(false)} title="Create a new list" footer={<Button className="w-full" disabled={!name.trim()} onClick={create}>Create list</Button>}>
        <div className="space-y-4">
          <Field label="List name"><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Diwali Shopping" /></Field>
          <div>
            <p className="mb-1.5 text-sm font-medium text-ink/80">Icon</p>
            <div className="flex gap-2">
              {EMOJIS.map((e) => (
                <button key={e} onClick={() => setEmoji(e)} className={`grid h-10 w-10 place-items-center rounded-xl border text-xl ${emoji === e ? "border-brand-500 bg-brand-50" : "border-line"}`}>{e}</button>
              ))}
            </div>
          </div>
          {cart.items.length > 0 && (
            <label className="flex items-center gap-3 rounded-xl border border-line p-3 text-sm">
              <input type="checkbox" checked={fromCart} onChange={(e) => setFromCart(e.target.checked)} className="h-4 w-4 accent-brand-600" />
              Include the {cart.items.length} items currently in your Parchi
            </label>
          )}
        </div>
      </Modal>
    </div>
  );
}
