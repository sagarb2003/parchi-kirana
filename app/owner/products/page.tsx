"use client";

import { useState } from "react";
import { PackageSearch, Pencil, Plus, Search } from "lucide-react";
import { Button, Card, Toggle, EmptyState, Field, Input, Modal, PageHeader, PageSkeleton, selectClass } from "@/components/ui";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";
import { CATEGORIES, type Category, type Product } from "@/lib/types";
import { cn, inr } from "@/lib/utils";

const EMOJI: Record<Category, string> = { "Atta & Rice": "🌾", Dal: "🫘", "Oil & Ghee": "🫙", Dairy: "🥛", Snacks: "🍪", Beverages: "🍵", Household: "🧴" };

export default function Products() {
  const { products, hydrated, actions } = useParchi();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  if (!hydrated) return <PageSkeleton />;

  const mine = products.filter((p) => p.storeId === OWNER_STORE_ID);
  const list = mine.filter((p) => (cat === "All" || p.category === cat) && (!q || p.name.toLowerCase().includes(q.toLowerCase())));

  return (
    <div>
      <PageHeader title="Products" subtitle={`${mine.length} products · ${mine.filter((p) => !p.available).length} disabled`} action={<Button onClick={() => setEditing("new")}><Plus size={18} /> Add Product</Button>} />
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1"><Input value={q} onChange={(e) => setQ(e.target.value)} icon={<Search size={17} />} placeholder="Search products" /></div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className={cn(selectClass, "sm:w-52")}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState icon={<PackageSearch />} title="No products found" text="Try a different search or add a new product." />
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[1fr_160px_100px_130px_150px] gap-4 border-b border-line bg-stone-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink/50 md:grid">
            <span>Product</span><span>Category</span><span className="text-right">Price</span><span>Availability</span><span className="text-right">Actions</span>
          </div>
          <ul className="divide-y divide-line">
            {list.map((p) => (
              <li key={p.id} className={cn("grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 px-5 py-3.5 md:grid-cols-[1fr_160px_100px_130px_150px]", !p.available && "bg-stone-50/60")}>
                <div className="flex min-w-0 items-center gap-3">
                  <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-stone-100 text-xl", !p.available && "grayscale")}>{p.emoji}</span>
                  <div className="min-w-0">
                    <p className={cn("truncate font-medium", !p.available && "text-ink/45")}>{p.name}</p>
                    <p className="text-xs text-ink/45">{p.unit}<span className="md:hidden"> · {p.category}</span></p>
                  </div>
                </div>
                <span className="hidden text-sm text-ink/60 md:block">{p.category}</span>
                <span className="text-right font-semibold tabular-nums">{inr(p.price)}</span>
                <span className="md:block">
                  <span className={cn("inline-flex items-center gap-1.5 text-sm font-medium", p.available ? "text-brand-700" : "text-ink/45")}>
                    <span className={cn("h-2 w-2 rounded-full", p.available ? "bg-brand-500" : "bg-stone-300")} />
                    {p.available ? "In stock" : "Disabled"}
                  </span>
                </span>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" variant="secondary" onClick={() => setEditing(p)}><Pencil size={14} /> Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => { actions.updateProduct(p.id, { available: !p.available }); actions.toast(`${p.name} ${p.available ? "disabled" : "enabled"}`, "info"); }}>
                    {p.available ? "Disable" : "Enable"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <ProductModal key={editing === "new" ? "new" : editing?.id ?? "none"} product={editing} onClose={() => setEditing(null)} />
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product | "new" | null; onClose: () => void }) {
  const { actions } = useParchi();
  const existing = product && product !== "new" ? product : null;
  const [f, setF] = useState({
    name: existing?.name ?? "",
    category: existing?.category ?? ("Atta & Rice" as Category),
    price: existing?.price.toString() ?? "",
    unit: existing?.unit ?? "",
    available: existing?.available ?? true,
  });
  const valid = f.name.trim() && Number(f.price) > 0 && f.unit.trim();
  const save = () => {
    const data = { name: f.name.trim(), category: f.category, price: Number(f.price), unit: f.unit.trim(), available: f.available };
    if (existing) {
      actions.updateProduct(existing.id, data);
      actions.toast(`${data.name} updated`);
    } else actions.addProduct({ ...data, storeId: OWNER_STORE_ID, emoji: EMOJI[f.category] });
    onClose();
  };
  return (
    <Modal open={!!product} onClose={onClose} title={existing ? "Edit product" : "Add product"} footer={<><Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button><Button className="flex-1" disabled={!valid} onClick={save}>{existing ? "Save" : "Add Product"}</Button></>}>
      <div className="space-y-4">
        <Field label="Product name"><Input autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Patanjali Cow Ghee" /></Field>
        <Field label="Category">
          <select className={selectClass} value={f.category} onChange={(e) => setF({ ...f, category: e.target.value as Category })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price (₹)"><Input type="number" min={1} value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="0" /></Field>
          <Field label="Unit"><Input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })} placeholder="e.g. 1 kg" /></Field>
        </div>
        <label className="flex items-center justify-between rounded-xl border border-line p-3.5">
          <span className="font-medium">Available for customers</span>
          <Toggle checked={f.available} onChange={(v) => setF({ ...f, available: v })} />
        </label>
      </div>
    </Modal>
  );
}
