"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, CheckCircle2, Clock, Package, PackageCheck, PartyPopper } from "lucide-react";
import { Button, Card, EmptyState, LinkButton, PageHeader, PageSkeleton } from "@/components/ui";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";
import type { OrderItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const GROUP: Record<string, string> = {
  "Atta & Rice": "Grains",
  Dal: "Grains",
  "Oil & Ghee": "Grocery",
  Dairy: "Dairy (fridge)",
  Snacks: "Snacks",
  Beverages: "Beverages",
  Household: "Household",
  Other: "Special requests",
};

export default function Picking() {
  const { orders, hydrated, actions } = useParchi();
  const [selected, setSelected] = useState<string | null>(null);
  const [justReady, setJustReady] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(new URLSearchParams(window.location.search).get("order"));
  }, []);

  if (!hydrated) return <PageSkeleton />;
  const queue = orders.filter((o) => o.storeId === OWNER_STORE_ID && (o.status === "preparing" || o.status === "packed" || o.id === justReady));
  const order = queue.find((o) => o.id === selected) ?? queue[0];

  if (!order)
    return (
      <div>
        <PageHeader title="Pick Orders" />
        <EmptyState icon={<PackageCheck />} title="No orders to pick" text="Accept an incoming order and it will show up here." action={<LinkButton href="/owner/orders" size="sm">View new orders</LinkButton>} />
      </div>
    );

  const items = order.items.filter((i) => i.available);
  const picked = items.filter((i) => i.picked).length;
  const pct = items.length ? (picked / items.length) * 100 : 0;
  const groups = items.reduce<Record<string, OrderItem[]>>((g, i) => {
    (g[GROUP[i.category]] ??= []).push(i);
    return g;
  }, {});

  return (
    <div>
      <PageHeader title="Pick Orders" subtitle={`${queue.filter((o) => o.status === "preparing").length} orders being picked`} />

      {queue.length > 1 && (
        <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:px-0">
          {queue.map((o) => (
            <button key={o.id} onClick={() => setSelected(o.id)} className={cn("shrink-0 rounded-xl border px-4 py-2.5 text-left text-sm transition", o.id === order.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-ink/30")}>
              <span className="font-bold">#{o.id}</span>
              <span className={cn("ml-2", o.id === order.id ? "text-white/60" : "text-ink/50")}>{o.status === "packed" ? "Packed" : o.status === "ready" ? "Ready" : o.customerName.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      )}

      {order.status === "ready" ? (
        <Card key="ready" className="mx-auto max-w-lg p-8 text-center animate-sheet">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-brand-600 animate-check"><PartyPopper size={32} /></div>
          <h2 className="mt-4 text-2xl font-bold">Ready for pickup</h2>
          <p className="mt-1 text-ink/55">Order #{order.id} · {order.customerName}</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">Pickup token</p>
          <p className="text-7xl font-extrabold tracking-tight text-saffron-500">{order.token}</p>
          <p className="mx-auto mt-4 max-w-xs text-sm text-ink/55">Customer will now see the ready state in their dashboard. Keep the bag on the Parchi shelf.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <LinkButton href={`/owner/pickup?q=${order.token}`} variant="secondary" className="flex-1">Go to pickup</LinkButton>
            <Button className="flex-1" onClick={() => { setJustReady(null); setSelected(null); }}>Next order</Button>
          </div>
        </Card>
      ) : order.status === "packed" ? (
        <Card key="packed" className="mx-auto max-w-lg p-8 text-center animate-sheet">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-violet-50 text-violet-600 animate-check"><Package size={30} /></div>
          <h2 className="mt-4 text-2xl font-bold">Order packed</h2>
          <p className="mt-1 text-ink/55">Order #{order.id} · {items.length} items · {order.customerName}</p>
          <Button size="lg" className="mt-8 w-full" onClick={() => { actions.markReady(order.id); setJustReady(order.id); setSelected(order.id); }}>
            <CheckCircle2 size={20} /> Mark Ready for Pickup
          </Button>
        </Card>
      ) : (
        <Card key="pick" className="overflow-hidden">
          <div className="border-b border-line p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">Order #{order.id}</h2>
                <p className="text-ink/60">{order.customerName} · {items.length} items</p>
              </div>
              <span className="flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-1.5 text-sm font-medium"><Clock size={15} /> Pickup {order.pickupTime}</span>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-sm font-semibold">
                <span key={picked} className="animate-pop">{picked} / {items.length} items picked</span>
                <span className="text-ink/50">{Math.round(pct)}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
                <div className="h-full rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          <div className="grid gap-x-8 p-5 sm:p-6 md:grid-cols-2">
            {Object.entries(groups).map(([g, list]) => (
              <section key={g} className="mb-6">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/45">{g}</h3>
                <ul className="space-y-2">
                  {list.map((i) => (
                    <li key={i.id}>
                      <button
                        onClick={() => actions.togglePicked(order.id, i.id)}
                        className={cn("flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition active:scale-[0.99]", i.picked ? "border-brand-200 bg-brand-50/60" : "border-line hover:border-ink/25")}
                      >
                        <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 transition", i.picked ? "border-brand-600 bg-brand-600 text-white" : "border-stone-300")}>
                          {i.picked && <Check size={16} strokeWidth={3} className="animate-check" />}
                        </span>
                        <span className="text-xl">{i.emoji}</span>
                        <span className={cn("flex-1 font-medium", i.picked && "text-ink/45 line-through")}>{i.name}</span>
                        <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 text-sm font-semibold">{i.qty > 1 ? `${i.qty} × ` : ""}{i.unit}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="sticky bottom-[64px] border-t border-line bg-white/95 p-4 backdrop-blur lg:bottom-0">
            <Button size="lg" className="w-full text-lg" disabled={picked < items.length} onClick={() => actions.markPacked(order.id)}>
              <PackageCheck size={22} /> {picked < items.length ? `Pick ${items.length - picked} more to pack` : "Mark as Packed"}
            </Button>
          </div>
        </Card>
      )}
      <p className="mt-6 text-center text-sm text-ink/45">
        Tip: tap an item to tick it off. <Link href="/owner/orders" className="font-semibold text-brand-700">Back to orders</Link>
      </p>
    </div>
  );
}
