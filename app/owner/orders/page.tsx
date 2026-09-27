"use client";

import { useState } from "react";
import { ClipboardList, Search } from "lucide-react";
import { EmptyState, Input, PageHeader, PageSkeleton } from "@/components/ui";
import { OwnerOrderCard } from "@/components/owner-bits";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";
import type { OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const TABS: { label: string; match: OrderStatus[] }[] = [
  { label: "New", match: ["placed"] },
  { label: "Preparing", match: ["preparing", "packed"] },
  { label: "Ready", match: ["ready"] },
  { label: "Completed", match: ["completed", "rejected"] },
];

export default function OwnerOrders() {
  const { orders, hydrated } = useParchi();
  const [tab, setTab] = useState(0);
  const [q, setQ] = useState("");
  if (!hydrated) return <PageSkeleton />;
  const mine = orders.filter((o) => o.storeId === OWNER_STORE_ID);
  const list = mine.filter(
    (o) => TABS[tab].match.includes(o.status) && (!q || `${o.id} ${o.customerName} ${o.token ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  );
  return (
    <div>
      <PageHeader title="Orders" subtitle="Every Parchi sent to Sharma General Store." />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-white p-1 no-scrollbar">
          {TABS.map((t, i) => (
            <button key={t.label} onClick={() => setTab(i)} className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition", tab === i ? "bg-ink text-white" : "text-ink/55 hover:text-ink")}>
              {t.label} <span className="ml-1 opacity-60">{mine.filter((o) => t.match.includes(o.status)).length}</span>
            </button>
          ))}
        </div>
        <div className="sm:w-72"><Input value={q} onChange={(e) => setQ(e.target.value)} icon={<Search size={17} />} placeholder="Order, customer or token" /></div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={<ClipboardList />} title={tab === 0 ? "No orders waiting" : "Nothing here yet"} text="Orders will show up here as they move through your store." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{list.map((o) => <OwnerOrderCard key={o.id} order={o} />)}</div>
      )}
    </div>
  );
}
