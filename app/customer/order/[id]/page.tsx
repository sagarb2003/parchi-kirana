"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronDown, Clock, MapPin, Phone, RotateCcw, XCircle } from "lucide-react";
import { Button, Card, EmptyState, PageSkeleton, QrPlaceholder, StatusBadge } from "@/components/ui";
import { OrderTimeline, useReorder } from "@/components/order-bits";
import { useLookups, useParchi } from "@/lib/store";
import type { Order } from "@/lib/types";
import { cn, fmtDate, inr, itemsSubtotal, orderTotal } from "@/lib/utils";

export default function OrderPage() {
  const { id } = useParams<{ id: string }>();
  const { orders, hydrated } = useParchi();
  const { storeById } = useLookups();
  const reorder = useReorder();
  const [showBill, setShowBill] = useState(false);

  if (!hydrated) return <PageSkeleton />;
  const order = orders.find((o) => o.id === id);
  if (!order) return <EmptyState icon={<XCircle />} title="Order not found" />;
  const store = storeById(order.storeId)!;
  const total = orderTotal(order);

  const back = (
    <Link href="/customer/orders" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink/55 hover:text-ink">
      <ArrowLeft size={16} /> My Orders
    </Link>
  );

  if (order.status === "ready") {
    return (
      <div className="mx-auto max-w-md">
        {back}
        <div key="ready" className="overflow-hidden rounded-[28px] bg-ink text-white shadow-2xl animate-sheet">
          <div className="px-6 pb-6 pt-8 text-center">
            <p className="text-sm font-medium text-brand-300">{store.name}</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Your order is ready 🎉</h1>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Pickup token</p>
            <p className="text-[96px] font-extrabold leading-none tracking-tight text-saffron-400 animate-check">{order.token}</p>
          </div>
          <div className="relative mx-6 border-t-2 border-dashed border-white/15">
            <span className="absolute -left-9 -top-3 h-6 w-6 rounded-full bg-canvas" />
            <span className="absolute -right-9 -top-3 h-6 w-6 rounded-full bg-canvas" />
          </div>
          <div className="flex items-center gap-5 p-6">
            <div className="rounded-2xl bg-white p-2.5"><QrPlaceholder seed={order.id} size={112} /></div>
            <div className="space-y-3">
              <div><p className="text-xs text-white/50">Order</p><p className="text-xl font-bold">{order.id}</p></div>
              <div><p className="text-xs text-white/50">Amount</p><p className="text-xl font-bold">{inr(total)}</p></div>
            </div>
          </div>
          <div className="bg-white/[0.06] px-6 py-4 text-center text-sm font-semibold">Show this screen at the counter.</div>
        </div>
        <p className="mt-4 flex items-start gap-2 px-1 text-sm text-ink/55"><MapPin size={16} className="mt-0.5 shrink-0" /> {store.pickupInstructions}</p>
        <Button size="lg" variant="secondary" className="mt-5 w-full" onClick={() => setShowBill((v) => !v)}>
          View Order <ChevronDown size={18} className={cn("transition", showBill && "rotate-180")} />
        </Button>
        {showBill && <Bill order={order} className="mt-4" />}
      </div>
    );
  }

  if (order.status === "completed") {
    return (
      <div className="mx-auto max-w-md">
        {back}
        <Card className="p-8 text-center animate-fade-up">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-600 animate-check"><CheckCircle2 size={44} /></div>
          <h1 className="mt-5 text-2xl font-bold">Picked up successfully</h1>
          <p className="mt-2 text-ink/55">Order #{order.id} · {inr(total)}</p>
          <p className="text-ink/55">{store.name}</p>
          <p className="mt-1 text-sm text-ink/40">{fmtDate(order.createdAt)}</p>
          <Button size="lg" className="mt-6 w-full" onClick={() => reorder(order)}><RotateCcw size={18} /> Reorder</Button>
        </Card>
        <Bill order={order} className="mt-4" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {back}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Order #{order.id}</h1>
          <p className="mt-1 text-ink/55">{store.name} · {inr(total)}{order.items.some((i) => i.price === null) ? "+" : ""}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.status === "rejected" ? (
        <Card className="mt-6 border-red-200 bg-red-50/50 p-5">
          <p className="font-semibold text-red-700">The store couldn&apos;t take this order</p>
          <p className="mt-1 text-sm text-ink/60">This can happen when many items are out of stock. Try another nearby store.</p>
          <Button className="mt-4" variant="secondary" onClick={() => reorder(order)}><RotateCcw size={16} /> Try again</Button>
        </Card>
      ) : (
        <>
          <Card className="mt-6 flex items-center gap-3 bg-brand-50/60 p-4 ring-1 ring-brand-100 border-transparent">
            <Clock className="text-brand-700" size={22} />
            <div>
              <p className="font-semibold text-brand-900">Estimated ready by {order.pickupTime}</p>
              <p className="text-sm text-brand-800/70">This page updates automatically as the store works on your order.</p>
            </div>
          </Card>
          <Card className="mt-4 p-6">
            <OrderTimeline status={order.status} />
          </Card>
        </>
      )}

      <Bill order={order} className="mt-4" />
      <a href={`tel:${store.phone}`} className="mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium text-ink/55 hover:text-ink">
        <Phone size={15} /> Call store
      </a>
    </div>
  );
}

function Bill({ order, className }: { order: Order; className?: string }) {
  const accepted = order.status !== "placed";
  const available = order.items.filter((i) => i.available);
  return (
    <Card className={cn("p-5", className)}>
      <h2 className="font-semibold">{accepted ? "Bill" : "Your items"}</h2>
      <ul className="mt-3 space-y-2.5">
        {order.items.map((i) => (
          <li key={i.id} className={cn("flex items-center justify-between gap-3 text-sm", !i.available && "text-ink/35 line-through")}>
            <span className="flex min-w-0 items-center gap-2">
              <span>{i.emoji}</span>
              <span className="truncate">{i.name} <span className="text-ink/45">· {i.unit} × {i.qty}</span></span>
            </span>
            <span className="shrink-0 tabular-nums">{i.price === null ? <span className="text-saffron-600">Pending</span> : inr(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
      {order.listImage && <p className="mt-3 text-xs text-ink/50">+ items from your list photo</p>}
      <div className="mt-4 space-y-1 border-t border-dashed border-line pt-3 text-sm">
        <div className="flex justify-between text-ink/60"><span>Items</span><span className="tabular-nums">{inr(itemsSubtotal(available))}</span></div>
        <div className="flex justify-between text-ink/60"><span>Packing charge</span><span className="tabular-nums">{accepted ? inr(order.packingFee) : "—"}</span></div>
        <div className="flex justify-between pt-1 text-base font-bold"><span>{accepted ? "Total" : "Estimated total"}</span><span className="tabular-nums">{inr(itemsSubtotal(available) + (accepted ? order.packingFee : 0))}</span></div>
      </div>
      <p className="mt-2 text-xs text-ink/45">Pay at the counter · Cash / UPI</p>
    </Card>
  );
}
