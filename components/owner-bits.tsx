"use client";

import Link from "next/link";
import { Clock, ImageIcon, Package } from "lucide-react";
import { Card, StatusBadge, buttonClass } from "./ui";
import type { Order } from "@/lib/types";
import { hasUnpriced, inr, orderTotal } from "@/lib/utils";

export function OwnerOrderCard({ order }: { order: Order }) {
  const cta =
    order.status === "placed"
      ? { label: "Review Order", href: `/owner/orders/${order.id}`, v: "primary" as const }
      : order.status === "preparing" || order.status === "packed"
        ? { label: order.status === "packed" ? "Mark Ready" : "Start Picking", href: `/owner/picking?order=${order.id}`, v: "dark" as const }
        : order.status === "ready"
          ? { label: "Hand over", href: `/owner/pickup?q=${order.token}`, v: "secondary" as const }
          : { label: "View", href: `/owner/orders/${order.id}`, v: "secondary" as const };
  return (
    <Card className="flex flex-col p-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-bold">#{order.id}</p>
          <p className="font-medium text-ink/70">{order.customerName}</p>
        </div>
        {order.token ? <span className="rounded-lg bg-ink px-2.5 py-1 text-sm font-bold text-saffron-400">{order.token}</span> : <StatusBadge status={order.status} />}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-1.5 text-ink/60"><Package size={15} /> {order.items.length} items {order.listImage && <ImageIcon size={14} className="text-saffron-500" />}</div>
        <div className="text-right font-semibold tabular-nums">{inr(orderTotal(order))}{hasUnpriced(order.items) ? "+" : ""} <span className="font-normal text-ink/45">{order.status === "placed" ? "est." : ""}</span></div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-stone-50 px-3 py-2 text-sm">
        <Clock size={15} className="text-ink/45" /> Requested pickup: <span className="font-semibold">{order.pickupTime}</span>
      </div>
      <Link href={cta.href} className={buttonClass(cta.v, "md", "mt-4 w-full")}>{cta.label}</Link>
    </Card>
  );
}
