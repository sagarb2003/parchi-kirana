"use client";

import { useState } from "react";
import { Camera, Save } from "lucide-react";
import { Button, Card, Field, Input, PageHeader, PageSkeleton, Toggle, selectClass } from "@/components/ui";
import { OWNER_STORE_ID, useLookups, useParchi } from "@/lib/store";
import type { Store } from "@/lib/types";

export default function StoreSettings() {
  const { hydrated } = useParchi();
  const { storeById } = useLookups();
  const store = storeById(OWNER_STORE_ID);
  if (!hydrated || !store) return <PageSkeleton />;
  return <StoreForm store={store} />;
}

function StoreForm({ store }: { store: Store }) {
  const { actions } = useParchi();
  const [f, setF] = useState(store);
  const dirty = JSON.stringify(f) !== JSON.stringify(store);
  const set = <K extends keyof Store>(k: K, v: Store[K]) => setF({ ...f, [k]: v });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Store" subtitle="This is what customers see when they choose your store." />
      <Card className="p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl bg-brand-600 text-2xl font-bold text-white">
            SG
            <button onClick={() => actions.toast("Logo upload arrives with storage", "info")} className="absolute -bottom-1.5 -right-1.5 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-ink text-white" aria-label="Change logo"><Camera size={14} /></button>
          </div>
          <div>
            <p className="font-semibold">Store logo</p>
            <p className="text-sm text-ink/55">Square image, at least 200×200</p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Field label="Store name"><Input value={f.name} onChange={(e) => set("name", e.target.value)} /></Field>
          <Field label="Address"><Input value={f.address} onChange={(e) => set("address", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
            <Field label="Opening hours"><Input value={f.hours} onChange={(e) => set("hours", e.target.value)} /></Field>
          </div>
          <Field label="Average preparation time">
            <select className={selectClass} value={f.prepMinutes} onChange={(e) => set("prepMinutes", Number(e.target.value))}>
              {[10, 15, 20, 25, 30, 45].map((m) => <option key={m} value={m}>~{m} minutes</option>)}
            </select>
          </Field>
          <Field label="Pickup instructions">
            <textarea value={f.pickupInstructions} onChange={(e) => set("pickupInstructions", e.target.value)} rows={3} className="w-full rounded-xl border border-line px-3.5 py-3 text-[15px] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10" />
          </Field>
          <label className="flex items-center justify-between rounded-xl border border-line p-4">
            <div>
              <p className="font-medium">Accepting orders</p>
              <p className="text-sm text-ink/55">Turn off to show your store as closed.</p>
            </div>
            <Toggle checked={f.isOpen} onChange={(v) => set("isOpen", v)} />
          </label>
        </div>
      </Card>
      <div className="sticky bottom-[72px] mt-5 lg:bottom-4">
        <Button size="lg" className="w-full shadow-lg" disabled={!dirty} onClick={() => actions.updateStore(store.id, f)}><Save size={18} /> Save Changes</Button>
      </div>
    </div>
  );
}
