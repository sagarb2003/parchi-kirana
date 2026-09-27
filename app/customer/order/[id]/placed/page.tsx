"use client";

import { useParams } from "next/navigation";
import { Check, Clock } from "lucide-react";
import { Card, LinkButton, PageSkeleton, StatusBadge } from "@/components/ui";
import { useLookups, useParchi } from "@/lib/store";

export default function OrderPlaced() {
  const { id } = useParams<{ id: string }>();
  const { orders, hydrated } = useParchi();
  const { storeById } = useLookups();
  if (!hydrated) return <PageSkeleton />;
  const order = orders.find((o) => o.id === id);
  if (!order) return null;
  const store = storeById(order.storeId);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center pt-6 text-center">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-brand-200 opacity-50 [animation-iteration-count:2]" />
        <div className="relative grid h-24 w-24 place-items-center rounded-full bg-brand-600 text-white shadow-xl shadow-brand-600/30 animate-check">
          <Check size={48} strokeWidth={3} />
        </div>
      </div>
      <h1 className="mt-8 text-[28px] font-bold leading-tight tracking-tight animate-fade-up [animation-delay:150ms]">Your Parchi is with the store.</h1>
      <p className="mt-2 text-ink/55 animate-fade-up [animation-delay:200ms]">We&apos;ll let you know as soon as it&apos;s ready.</p>

      <Card className="mt-8 w-full divide-y divide-line text-left animate-fade-up [animation-delay:250ms]">
        {[
          ["Order", `#${order.id}`],
          ["Store", store?.name],
          ["Estimated ready time", order.pickupTime],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm text-ink/55">{k}</span>
            <span className="font-semibold">{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-3.5">
          <span className="flex items-center gap-1.5 text-sm text-ink/55"><Clock size={14} /> Status</span>
          <StatusBadge status={order.status} />
        </div>
      </Card>
      <p className="mt-3 text-sm text-ink/50">Waiting for store confirmation</p>

      <LinkButton href={`/customer/order/${order.id}`} size="lg" className="mt-8 w-full">Track Order</LinkButton>
      <LinkButton href="/customer" variant="ghost" className="mt-2 w-full">Back to Home</LinkButton>
    </div>
  );
}
