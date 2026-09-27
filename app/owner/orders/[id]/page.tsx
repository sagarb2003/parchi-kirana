"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Check, Clock, ImageIcon, Phone, StickyNote, X, XCircle } from "lucide-react";
import { Button, Card, EmptyState, LinkButton, Modal, PageSkeleton, StatusBadge } from "@/components/ui";
import { useParchi } from "@/lib/store";
import { cn, inr, itemsSubtotal } from "@/lib/utils";

export default function OwnerOrderReview() {
  const { id } = useParams<{ id: string }>();
  const { orders, hydrated, actions } = useParchi();
  const router = useRouter();
  const [confirmReject, setConfirmReject] = useState(false);
  const [zoom, setZoom] = useState(false);
  if (!hydrated) return <PageSkeleton />;
  const order = orders.find((o) => o.id === id);
  if (!order) return <EmptyState icon={<XCircle />} title="Order not found" />;

  const editable = order.status === "placed";
  const available = order.items.filter((i) => i.available);
  const unpriced = available.some((i) => i.price === null);
  const total = itemsSubtotal(available) + order.packingFee;

  const priceCell = (i: (typeof order.items)[number]) => (editable && i.price === null ? (
                      <input
                        type="number"
                        placeholder="Set ₹"
                        onBlur={(e) => e.target.value && actions.setItemPrice(order.id, i.id, Number(e.target.value))}
                        className="h-9 w-24 rounded-lg border border-saffron-400 bg-saffron-50 px-2 text-right text-sm outline-none focus:ring-2 focus:ring-saffron-400/30"
                      />
                    ) : i.price === null ? (
                      <span className="text-sm text-saffron-600">—</span>
                    ) : (
                      <button disabled={!editable || i.productId !== undefined} onClick={() => actions.setItemPrice(order.id, i.id, null)} className="font-semibold">
                        {inr(i.price * i.qty)}
                      </button>
                    ));

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/owner/orders" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-ink/55 hover:text-ink"><ArrowLeft size={16} /> Orders</Link>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Order #{order.id}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-ink/65">
            <span>Customer: <span className="font-semibold text-ink">{order.customerName}</span></span>
            <span className="flex items-center gap-1"><Clock size={15} /> Pickup: <span className="font-semibold text-ink">{order.pickupTime}</span></span>
            <a href={`tel:${order.customerPhone}`} className="flex items-center gap-1 text-brand-700"><Phone size={15} /> Call</a>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.note && (
        <div className="mt-5 flex gap-2 rounded-xl bg-saffron-50 p-3 text-sm text-saffron-600"><StickyNote size={17} className="shrink-0" /> <span><b>Customer note:</b> {order.note}</span></div>
      )}

      {order.listImage && (
        <Card className="mt-5 flex items-center gap-4 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.listImage} alt="Customer list" onClick={() => setZoom(true)} className="h-20 w-20 cursor-zoom-in rounded-xl border border-line object-cover" />
          <div>
            <p className="flex items-center gap-1.5 font-semibold"><ImageIcon size={16} /> Handwritten list attached</p>
            <p className="text-sm text-ink/55">Read the photo and add any extra items to the bill at the counter.</p>
          </div>
        </Card>
      )}

      <Card className="mt-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full  text-left">
            <thead className="border-b border-line bg-stone-50 text-xs font-semibold uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3 sm:px-5">Item</th>
                <th className="hidden px-3 py-3 text-right sm:table-cell">Qty</th>
                <th className="hidden px-3 py-3 text-right sm:table-cell">Price</th>
                <th className="px-4 py-3 text-right sm:px-5 sm:text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {order.items.map((i) => (
                <tr key={i.id} className={cn(!i.available && "bg-stone-50/70")}>
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className={cn("flex items-center gap-2.5 font-medium", !i.available && "text-ink/40 line-through")}>
                      <span className="text-xl">{i.emoji}</span>
                      <div>
                        {i.name}
                        {i.category === "Other" && <span className="ml-2 rounded bg-saffron-50 px-1.5 py-0.5 text-[11px] font-semibold text-saffron-600 no-underline">Custom</span>}
                        <p className="text-xs font-normal text-ink/45">{i.unit}<span className="sm:hidden"> × {i.qty}</span></p>
                        <div className="mt-1 text-sm sm:hidden">{priceCell(i)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-3 py-3.5 text-right tabular-nums sm:table-cell">× {i.qty}</td>
                  <td className="hidden px-3 py-3.5 text-right tabular-nums sm:table-cell">{priceCell(i)}</td>
                  <td className="px-4 py-3.5 sm:px-5">
                    {editable ? (
                      <div className="inline-flex rounded-lg border border-line p-0.5 text-xs font-semibold">
                        <button onClick={() => actions.setItemAvailable(order.id, i.id, true)} className={cn("flex items-center gap-1 rounded-md px-2.5 py-1.5", i.available ? "bg-brand-600 text-white" : "text-ink/50")}><Check size={13} /> <span className="hidden sm:inline">Available</span></button>
                        <button onClick={() => actions.setItemAvailable(order.id, i.id, false)} className={cn("flex items-center gap-1 rounded-md px-2.5 py-1.5", !i.available ? "bg-red-600 text-white" : "text-ink/50")}><X size={13} /> <span className="hidden sm:inline">Out</span></button>
                      </div>
                    ) : (
                      <span className={cn("text-sm font-medium", i.available ? "text-brand-700" : "text-red-600")}>{i.available ? "Available" : "Out of stock"}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-1 border-t border-line bg-stone-50 px-5 py-4 text-sm">
          <div className="flex justify-between text-ink/60"><span>{available.length} of {order.items.length} items available</span><span className="tabular-nums">{inr(itemsSubtotal(available))}</span></div>
          <div className="flex justify-between text-ink/60"><span>Packing charge</span><span>{inr(order.packingFee)}</span></div>
          <div className="flex justify-between pt-1 text-lg font-bold"><span>Final bill</span><span className="tabular-nums">{inr(total)}</span></div>
        </div>
      </Card>

      {editable ? (
        <div className="sticky bottom-[72px] z-10 mt-6 flex gap-3 lg:bottom-4">
          <Button variant="danger" size="lg" className="flex-1 sm:flex-none" onClick={() => setConfirmReject(true)}>Reject Order</Button>
          <Button
            size="lg"
            className="flex-[2] shadow-lg"
            disabled={unpriced}
            onClick={() => {
              actions.acceptOrder(order.id);
              router.push(`/owner/picking?order=${order.id}`);
            }}
          >
            <Check size={20} /> {unpriced ? "Set prices for custom items" : "Accept Order"}
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex gap-3">
          {(order.status === "preparing" || order.status === "packed") && <LinkButton href={`/owner/picking?order=${order.id}`} size="lg" variant="dark" className="w-full">Go to picking</LinkButton>}
          {order.status === "ready" && <LinkButton href={`/owner/pickup?q=${order.token}`} size="lg" className="w-full">Go to pickup · Token {order.token}</LinkButton>}
        </div>
      )}

      <Modal
        open={confirmReject}
        onClose={() => setConfirmReject(false)}
        title="Reject this order?"
        footer={
          <>
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmReject(false)}>Cancel</Button>
            <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { actions.rejectOrder(order.id); router.push("/owner/orders"); }}>Reject</Button>
          </>
        }
      >
        <p className="text-ink/65">{order.customerName} will be told the store can&apos;t fulfil #{order.id}. Tip: you can mark individual items as out of stock instead.</p>
      </Modal>
      <Modal open={zoom} onClose={() => setZoom(false)} title="Customer's list">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {order.listImage && <img src={order.listImage} alt="Customer list" className="w-full rounded-xl" />}
      </Modal>
    </div>
  );
}
