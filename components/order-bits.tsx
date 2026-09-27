"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, RotateCcw } from "lucide-react";
import { Button, Card, StatusBadge, buttonClass } from "./ui";
import { useLookups, useParchi } from "@/lib/store";
import type { Order, OrderStatus } from "@/lib/types";
import { cn, fmtDate, inr, orderTotal } from "@/lib/utils";

export function useReorder() {
  const { actions } = useParchi();
  const router = useRouter();
  return (o: Order) => {
    actions.loadIntoCart(
      o.storeId,
      o.items.map(({ available: _a, picked: _p, ...rest }) => rest),
    );
    actions.toast(`${o.items.length} items added to your Parchi`);
    router.push("/customer/order/review");
  };
}

export function CustomerOrderCard({ order }: { order: Order }) {
  const { storeById } = useLookups();
  const reorder = useReorder();
  const store = storeById(order.storeId);
  return (
    <Card className="p-4 transition hover:shadow-sm sm:p-5 animate-fade-up">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{store?.name}</p>
          <p className="mt-0.5 text-sm text-ink/50">
            #{order.id} · {fmtDate(order.createdAt)} · {order.items.length} items
          </p>
        </div>
        <p className="font-bold tabular-nums">{inr(orderTotal(order))}</p>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2">
        <StatusBadge status={order.status} />
        <div className="flex gap-2">
          <Link href={`/customer/order/${order.id}`} className={buttonClass("secondary", "sm")}>View</Link>
          {!["placed", "preparing", "packed", "ready"].includes(order.status) && (
            <Button size="sm" variant="secondary" onClick={() => reorder(order)} className="text-brand-700">
              <RotateCcw size={14} /> Reorder
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

const STEPS = [
  { label: "Order sent", sub: "Your Parchi reached the store", now: "" },
  { label: "Store accepted", sub: "Prices confirmed by the store", now: "Waiting for store confirmation" },
  { label: "Preparing your order", sub: "Items picked and packed", now: "Staff are picking your items" },
  { label: "Ready for pickup", sub: "Token issued", now: "" },
  { label: "Picked up", sub: "Enjoy your groceries!", now: "Show your token at the counter" },
];
const PROGRESS: Record<OrderStatus, number> = { placed: 1, preparing: 2, packed: 2, ready: 4, completed: 5, rejected: 1 };

export function OrderTimeline({ status }: { status: OrderStatus }) {
  const p = PROGRESS[status];
  return (
    <ol className="relative">
      {STEPS.map((s, i) => {
        const done = i < p;
        const current = i === p;
        const last = i === STEPS.length - 1;
        const now = status === "packed" && i === 2 ? "Packed — handing over shortly" : s.now;
        return (
          <li key={s.label} className="relative flex gap-4 pb-7 last:pb-0">
            {!last && <span className={cn("absolute left-[15px] top-8 h-[calc(100%-32px)] w-0.5 rounded transition-colors duration-500", done ? "bg-brand-500" : "bg-stone-200")} />}
            <span
              className={cn(
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-500",
                done && "border-brand-600 bg-brand-600 text-white",
                current && "border-brand-600 bg-white",
                !done && !current && "border-stone-200 bg-white",
              )}
            >
              {done ? <Check size={16} strokeWidth={3} className="animate-check" /> : current ? <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-600" /> : null}
            </span>
            <div className="pt-1">
              <p className={cn("font-semibold", !done && !current && "text-ink/40")}>{s.label}</p>
              <p className={cn("text-sm", current ? "font-medium text-brand-700" : "text-ink/45")}>{current ? now || s.sub : s.sub}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
