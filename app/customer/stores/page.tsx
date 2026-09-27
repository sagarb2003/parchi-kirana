"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, MapPin, Search, Star, StoreIcon } from "lucide-react";
import { Badge, Card, EmptyState, Input, PageHeader, Skeleton, buttonClass } from "@/components/ui";
import { useParchi } from "@/lib/store";

export default function StoresPage() {
  const { stores, products, hydrated } = useParchi();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("q");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial) setQ(initial);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const term = q.trim().toLowerCase();
  const matchedStoreIds = new Set(products.filter((p) => term && p.name.toLowerCase().includes(term)).map((p) => p.storeId));
  const list = stores.filter((s) => !term || s.name.toLowerCase().includes(term) || s.area.toLowerCase().includes(term) || matchedStoreIds.has(s.id));

  return (
    <div>
      <PageHeader title="Choose your local store" subtitle="Stores near Majlis Park, New Delhi" />
      <Input value={q} onChange={(e) => setQ(e.target.value)} icon={<Search size={19} />} placeholder="Search stores or areas" className="h-12" />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading || !hydrated
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-44" />)
          : list.map((s) => (
              <Card key={s.id} className={`flex flex-col p-5 animate-fade-up ${!s.isOpen ? "bg-stone-50/60" : ""}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-lg font-bold ${s.isOpen ? "bg-brand-50 text-brand-700" : "bg-stone-100 text-ink/40"}`}>
                    {s.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold leading-tight">{s.name}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-ink/55"><MapPin size={14} /> {s.area}, {s.city}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-sm font-semibold">
                    {s.rating} <Star size={13} className="fill-saffron-400 text-saffron-400" />
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {s.isOpen ? <Badge tone="green" dot>Open</Badge> : <Badge tone="gray">Closed</Badge>}
                  <span className="flex items-center gap-1 text-sm text-ink/55">
                    <Clock size={14} /> {s.isOpen ? `~${s.prepMinutes} min preparation` : `Opens at ${s.opensAt}`}
                  </span>
                </div>
                <Link href={`/customer/store/${s.slug}`} className={buttonClass(s.isOpen ? "primary" : "secondary", "md", "mt-5 w-full")}>
                  {s.isOpen ? "Shop here" : "View Store"}
                </Link>
              </Card>
            ))}
      </div>
      {!loading && hydrated && list.length === 0 && (
        <EmptyState icon={<StoreIcon />} title="No stores found" text={`We couldn't find stores matching “${q}”. Try another area.`} />
      )}
    </div>
  );
}
