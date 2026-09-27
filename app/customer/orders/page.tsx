"use client";

import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { EmptyState, LinkButton, PageHeader, PageSkeleton } from "@/components/ui";
import { CustomerOrderCard } from "@/components/order-bits";
import { useParchi } from "@/lib/store";
import { CUSTOMER } from "@/lib/mock-data";
import { cn, isActive } from "@/lib/utils";

const FILTERS = ["All", "Active", "Completed"] as const;

export default function MyOrders() {
  const { orders, hydrated } = useParchi();
  const [f, setF] = useState<(typeof FILTERS)[number]>("All");
  if (!hydrated) return <PageSkeleton />;

  const mine = orders.filter((o) => o.customerName === CUSTOMER.name);
  const list = mine.filter((o) => (f === "All" ? true : f === "Active" ? isActive(o.status) : !isActive(o.status)));

  return (
    <div>
      <PageHeader title="My Orders" subtitle={`${mine.length} orders from your local stores`} />
      <div className="mb-5 inline-flex rounded-xl border border-line bg-white p-1">
        {FILTERS.map((x) => (
          <button key={x} onClick={() => setF(x)} className={cn("rounded-lg px-4 py-2 text-sm font-semibold transition", f === x ? "bg-ink text-white" : "text-ink/55 hover:text-ink")}>
            {x}
            {x === "Active" && <span className="ml-1.5 opacity-60">{mine.filter((o) => isActive(o.status)).length}</span>}
          </button>
        ))}
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<PackageOpen />} title={f === "Active" ? "No active orders" : "No orders yet"} text="Orders you send to a store will show up here." action={<LinkButton href="/customer/stores" size="sm">Start a new order</LinkButton>} />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {list.map((o) => (
            <CustomerOrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
}
