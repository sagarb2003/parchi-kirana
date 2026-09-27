"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Camera, ChevronRight, MapPin, PackageOpen, Plus, Search, Store } from "lucide-react";
import { Card, EmptyState, Input, LinkButton, PageSkeleton, StatusBadge, buttonClass } from "@/components/ui";
import { CustomerOrderCard } from "@/components/order-bits";
import { useLookups, useParchi } from "@/lib/store";
import { CUSTOMER } from "@/lib/mock-data";
import { greeting, inr, isActive, orderTotal } from "@/lib/utils";

export default function CustomerHome() {
  const { orders, lists, hydrated, actions } = useParchi();
  const { storeById } = useLookups();
  const router = useRouter();
  const [q, setQ] = useState("");

  if (!hydrated) return <PageSkeleton />;

  const mine = orders.filter((o) => o.customerName === CUSTOMER.name);
  const active = mine.filter((o) => isActive(o.status)).sort((a, b) => (a.status === "ready" ? -1 : b.status === "ready" ? 1 : 0));
  const next = active[0];
  const recent = mine.filter((o) => !isActive(o.status)).slice(0, 4);

  return (
    <div className="space-y-10">
      <section className="animate-fade-up">
        <h1 className="text-[26px] font-bold tracking-tight sm:text-3xl">{greeting()}, {CUSTOMER.first} 👋</h1>
        <p className="mt-1 text-ink/55">What are you shopping for today?</p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/customer/stores${q ? `?q=${encodeURIComponent(q)}` : ""}`);
          }}
        >
          <Input value={q} onChange={(e) => setQ(e.target.value)} icon={<Search size={20} />} placeholder="Search products or stores..." className="h-14 rounded-2xl text-base shadow-sm" />
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Your next pickup</h2>
        {next ? (
          <Card className="overflow-hidden animate-fade-up">
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-xl font-extrabold ${next.token ? "bg-ink text-saffron-400" : "bg-brand-50 text-brand-700"}`}>
                  {next.token ?? <Store size={26} />}
                </div>
                <div>
                  <p className="text-lg font-semibold">{storeById(next.storeId)?.name}</p>
                  <p className="text-sm text-ink/55">Order #{next.id} · {next.items.length} items · {inr(orderTotal(next))}</p>
                  <StatusBadge status={next.status} className="mt-2" />
                </div>
              </div>
              <LinkButton href={`/customer/order/${next.id}`} size="lg" className="w-full sm:w-auto">
                View Order <ArrowRight size={18} />
              </LinkButton>
            </div>
            {active.length > 1 && (
              <Link href="/customer/orders" className="flex items-center justify-between border-t border-line bg-canvas px-5 py-3 text-sm font-medium text-ink/60 hover:text-ink">
                +{active.length - 1} more active {active.length - 1 === 1 ? "order" : "orders"} <ChevronRight size={16} />
              </Link>
            )}
          </Card>
        ) : (
          <EmptyState icon={<PackageOpen />} title="No active orders" text="Your next Parchi will show up here while the store prepares it." action={<LinkButton href="/customer/stores" size="sm">Start a new order</LinkButton>} />
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <Link href="/customer/store/sharma-general-store" className="group flex items-center gap-4 rounded-2xl bg-brand-600 p-5 text-white transition hover:bg-brand-700">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15"><Plus size={24} /></span>
          <div className="flex-1">
            <p className="font-semibold">Start a new order</p>
            <p className="text-sm text-white/70">At Sharma General Store</p>
          </div>
          <ArrowRight className="transition group-hover:translate-x-1" size={20} />
        </Link>
        <Link href="/customer/stores" className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:shadow-sm">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-saffron-50 text-saffron-600"><MapPin size={24} /></span>
          <div className="flex-1">
            <p className="font-semibold">Find a Store</p>
            <p className="text-sm text-ink/55">5 stores near you</p>
          </div>
          <ArrowRight className="text-ink/40 transition group-hover:translate-x-1" size={20} />
        </Link>
        <Link href="/customer/store/sharma-general-store?upload=1" className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition hover:shadow-sm sm:col-span-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-stone-100 text-ink/70"><Camera size={22} /></span>
          <div className="flex-1">
            <p className="font-semibold">Have a handwritten list?</p>
            <p className="text-sm text-ink/55">Upload a photo — the store will read and price it for you.</p>
          </div>
          <ArrowRight className="text-ink/40 transition group-hover:translate-x-1" size={20} />
        </Link>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Saved lists</h2>
          <Link href="/customer/lists" className="text-sm font-semibold text-brand-700">See all</Link>
        </div>
        <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
          {lists.slice(0, 3).map((l) => (
            <Card key={l.id} className="min-w-[220px] snap-start p-4">
              <span className="text-2xl">{l.emoji}</span>
              <p className="mt-2 font-semibold">{l.name}</p>
              <p className="text-sm text-ink/50">{l.items.length} items</p>
              <button
                onClick={() => {
                  actions.loadIntoCart("s1", l.items);
                  actions.toast(`“${l.name}” added to your Parchi`);
                  router.push("/customer/order/review");
                }}
                className={buttonClass("secondary", "sm", "mt-3 w-full text-brand-700")}
              >
                Shop this list
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent orders</h2>
          <Link href="/customer/orders" className="text-sm font-semibold text-brand-700">View all</Link>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {recent.map((o) => (
            <CustomerOrderCard key={o.id} order={o} />
          ))}
        </div>
      </section>
    </div>
  );
}
