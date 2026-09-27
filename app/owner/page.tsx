"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardList, Inbox, PackageCheck, ShoppingBag } from "lucide-react";
import { Card, EmptyState, PageHeader, PageSkeleton } from "@/components/ui";
import { OwnerOrderCard } from "@/components/owner-bits";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";
import { COMPLETED_TODAY_BASELINE, OWNER } from "@/lib/mock-data";
import { greeting, inr } from "@/lib/utils";

export default function OwnerOverview() {
  const { orders, hydrated } = useParchi();
  if (!hydrated) return <PageSkeleton />;
  const mine = orders.filter((o) => o.storeId === OWNER_STORE_ID);
  const by = (s: string) => mine.filter((o) => o.status === s);
  const completedToday = COMPLETED_TODAY_BASELINE + mine.filter((o) => o.status === "completed" && new Date(o.createdAt).toDateString() === new Date().toDateString()).length;
  const revenue = 38420;

  const stats = [
    { label: "New Orders", value: by("placed").length, icon: Inbox, tone: "bg-amber-50 text-amber-700", href: "/owner/orders" },
    { label: "Preparing", value: by("preparing").length + by("packed").length, icon: ShoppingBag, tone: "bg-sky-50 text-sky-700", href: "/owner/picking" },
    { label: "Ready", value: by("ready").length, icon: PackageCheck, tone: "bg-brand-50 text-brand-700", href: "/owner/pickup" },
    { label: "Completed", value: completedToday, icon: CheckCircle2, tone: "bg-stone-100 text-ink/70", href: "/owner/orders" },
  ];
  const waiting = by("placed");
  const inProgress = [...by("preparing"), ...by("packed"), ...by("ready")];

  return (
    <div>
      <PageHeader title={`${greeting()}, ${OWNER.first} 👋`} subtitle="Here's what's happening at your store today." />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="p-4 transition hover:shadow-sm sm:p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink/55">{s.label}</p>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.tone}`}><s.icon size={18} /></span>
              </div>
              <p key={s.value} className="mt-3 text-3xl font-bold tabular-nums animate-pop">{s.value}</p>
            </Card>
          </Link>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            Orders waiting for action
            {waiting.length > 0 && <span className="rounded-full bg-saffron-500 px-2 py-0.5 text-xs text-white">{waiting.length}</span>}
          </h2>
          <Link href="/owner/orders" className="flex items-center gap-1 text-sm font-semibold text-brand-700">All orders <ArrowRight size={14} /></Link>
        </div>
        {waiting.length === 0 ? (
          <EmptyState icon={<ClipboardList />} title="No orders waiting" text="New Parchis from customers will appear here instantly." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {waiting.map((o) => <OwnerOrderCard key={o.id} order={o} />)}
          </div>
        )}
      </section>

      {inProgress.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">In progress</h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {inProgress.map((o) => <OwnerOrderCard key={o.id} order={o} />)}
          </div>
        </section>
      )}

      <Card className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-ink/55">Today&apos;s Parchi sales</p>
          <p className="text-2xl font-bold">{inr(revenue)}</p>
        </div>
        <p className="text-sm text-ink/55">Avg. prep time <span className="font-semibold text-ink">17 min</span> · Counter wait saved <span className="font-semibold text-brand-700">~6 hrs</span></p>
      </Card>
    </div>
  );
}
