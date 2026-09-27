"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Check, Clock, MapPin, PackageSearch, PenLine, Plus, Search, ShoppingBag, Star } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, EmptyState, Input, PageSkeleton, Stepper } from "@/components/ui";
import { CustomItemModal } from "@/components/custom-item-modal";
import { useLookups, useParchi } from "@/lib/store";
import { CATEGORIES } from "@/lib/types";
import { cn, inr, itemsSubtotal } from "@/lib/utils";

export default function StorePage() {
  const { store: slug } = useParams<{ store: string }>();
  const { cart, hydrated, actions } = useParchi();
  const { storeBySlug, productsFor } = useLookups();
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [custom, setCustom] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const store = storeBySlug(slug);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("upload") && hydrated) {
      setTimeout(() => fileRef.current?.click(), 300);
    }
  }, [hydrated]);

  if (!hydrated) return <PageSkeleton />;
  if (!store) return <EmptyState icon={<PackageSearch />} title="Store not found" action={<Link href="/customer/stores" className="font-semibold text-brand-700">Back to stores</Link>} />;

  const products = productsFor(store.id).filter(
    (p) => (cat === "All" || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())),
  );
  const inThisCart = cart.storeId === store.id ? cart.items : [];
  const qtyOf = (pid: string) => inThisCart.find((i) => i.productId === pid);

  const onPhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      // Downscale so the demo can persist it in localStorage.
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 800 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = img.width * scale;
        c.height = img.height * scale;
        c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
        actions.setListImage(store.id, c.toDataURL("image/jpeg", 0.7));
        actions.toast("List photo attached — the store will price it");
        actions.setCartOpen(true);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Link href="/customer/stores" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink/55 hover:text-ink">
        <ArrowLeft size={16} /> All stores
      </Link>

      <Card className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{store.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-ink/55"><MapPin size={15} /> {store.area}, {store.city}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              {store.isOpen ? <Badge tone="green" dot>Open now</Badge> : <Badge>Closed · Opens {store.opensAt}</Badge>}
              <span className="flex items-center gap-1 font-semibold"><Clock size={14} /> ~{store.prepMinutes} min preparation</span>
              <span className="flex items-center gap-1 text-ink/55"><Star size={14} className="fill-saffron-400 text-saffron-400" /> {store.rating}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}><Camera size={16} /> Upload list photo</Button>
            <Button variant="secondary" size="sm" onClick={() => setCustom(true)}><PenLine size={16} /> Add manually</Button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => onPhoto(e.target.files?.[0])} />
        </div>
      </Card>

      <div className="sticky top-14 z-20 -mx-4 mt-5 bg-canvas/95 px-4 pb-3 pt-2 backdrop-blur sm:mx-0 sm:px-0 lg:top-16">
        <Input value={q} onChange={(e) => setQ(e.target.value)} icon={<Search size={18} />} placeholder="Search products" />
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {["All", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition", cat === c ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/65 hover:border-ink/30")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<PackageSearch />}
          title="No products found"
          text="Can't find it? Add it manually and the store will confirm the price."
          action={<Button size="sm" onClick={() => setCustom(true)}><Plus size={16} /> Add item manually</Button>}
        />
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => {
            const inCart = qtyOf(p.id);
            return (
              <Card key={p.id} className={cn("flex flex-col p-3 transition", !p.available && "opacity-50")}>
                <div className="grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-stone-50 to-stone-100 text-5xl">{p.emoji}</div>
                <p className="mt-3 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-tight">{p.name}</p>
                <p className="text-xs text-ink/50">{p.unit}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-bold tabular-nums">{inr(p.price)}</span>
                  {!p.available ? (
                    <span className="text-xs font-medium text-ink/50">Out of stock</span>
                  ) : inCart ? (
                    <Stepper value={inCart.qty} onChange={(v) => actions.setQty(inCart.id, v)} />
                  ) : (
                    <Button size="sm" variant="secondary" className="border-brand-200 text-brand-700 hover:bg-brand-50" onClick={() => actions.addToCart(p)} disabled={!store.isOpen}>
                      <Plus size={15} /> Add
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {inThisCart.length > 0 && (
        <div className="fixed inset-x-0 bottom-[68px] z-30 px-4 lg:bottom-6 lg:left-64 lg:px-8">
          <button onClick={() => actions.setCartOpen(true)} className="mx-auto flex w-full max-w-xl items-center justify-between rounded-2xl bg-brand-600 px-5 py-3.5 text-white shadow-xl shadow-brand-900/20 animate-sheet">
            <span className="flex items-center gap-3">
              <ShoppingBag size={20} />
              <span key={inThisCart.length} className="font-semibold animate-pop">{inThisCart.length} items · {inr(itemsSubtotal(inThisCart))}</span>
            </span>
            <span className="flex items-center gap-1 font-semibold">View Parchi <Check size={16} /></span>
          </button>
        </div>
      )}
      <CustomItemModal open={custom} onClose={() => setCustom(false)} storeId={store.id} />
    </div>
  );
}
