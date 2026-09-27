"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ScanLine, Search } from "lucide-react";
import { Button, Card, EmptyState, Input, PageHeader, PageSkeleton, StatusBadge } from "@/components/ui";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";
import { cn, inr, orderTotal } from "@/lib/utils";

export default function Pickup() {
  const { orders, hydrated, actions } = useParchi();
  const [q, setQ] = useState("");
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  if (!hydrated) return <PageSkeleton />;
  const mine = orders.filter((o) => o.storeId === OWNER_STORE_ID);
  const ready = mine.filter((o) => o.status === "ready");
  const term = q.trim().toUpperCase().replace(/^#/, "");
  const match = term ? mine.find((o) => o.token === term || o.id === term || o.id === `PCH-${term}` || (o.id.endsWith(term) && term.length >= 3)) : undefined;
  const shown = match ?? (done ? mine.find((o) => o.id === done) : undefined);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Pickup" subtitle="Verify the customer's token and hand over the bag." />
      <Input value={q} onChange={(e) => { setQ(e.target.value); setDone(null); }} icon={<Search size={20} />} placeholder="Search order number or token" className="h-14 rounded-2xl text-lg font-semibold uppercase placeholder:normal-case placeholder:font-normal" autoFocus />

      {shown ? (
        <Card key={shown.id + shown.status} className="mt-5 overflow-hidden animate-sheet">
          <div className="flex items-center gap-5 p-6">
            <div className={cn("grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-4xl font-extrabold", shown.status === "completed" ? "bg-stone-100 text-ink/40" : "bg-ink text-saffron-400")}>{shown.token ?? "—"}</div>
            <div className="min-w-0">
              <p className="text-xl font-bold">{shown.customerName}</p>
              <p className="text-ink/60">Order #{shown.id} · {shown.items.filter((i) => i.available).length} items</p>
              <p className="mt-1 text-2xl font-bold">{inr(orderTotal(shown))}</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <span className="text-sm text-ink/55">Status</span>
            <StatusBadge status={shown.status} />
          </div>
          <div className="border-t border-line p-4">
            {shown.status === "ready" ? (
              <Button size="lg" className="h-16 w-full text-xl" onClick={() => { actions.confirmPickup(shown.id); setDone(shown.id); setQ(""); }}>
                <CheckCircle2 size={24} /> Confirm Pickup
              </Button>
            ) : shown.status === "completed" ? (
              <p className="flex items-center justify-center gap-2 py-3 font-semibold text-brand-700 animate-fade-up"><CheckCircle2 size={20} /> Handed over · Completed</p>
            ) : (
              <p className="py-3 text-center text-sm text-ink/55">This order isn&apos;t ready yet.</p>
            )}
          </div>
        </Card>
      ) : term ? (
        <div className="mt-5"><EmptyState icon={<Search />} title="No matching order" text={`Nothing found for “${q}”. Check the token on the customer's screen.`} /></div>
      ) : null}

      <h2 className="mb-3 mt-10 font-bold">Waiting for pickup <span className="text-ink/40">({ready.length})</span></h2>
      {ready.length === 0 ? (
        <EmptyState icon={<ScanLine />} title="No orders waiting" text="Orders marked ready will line up here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {ready.map((o) => (
            <button key={o.id} onClick={() => { setQ(o.token ?? o.id); setDone(null); }} className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 text-left transition hover:shadow-sm">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-ink text-xl font-extrabold text-saffron-400">{o.token}</span>
              <div>
                <p className="font-semibold">{o.customerName}</p>
                <p className="text-sm text-ink/55">#{o.id} · {inr(orderTotal(o))}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
