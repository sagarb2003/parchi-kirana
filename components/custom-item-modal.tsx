"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { Button, Field, Input, Modal, selectClass } from "./ui";
import { useParchi } from "@/lib/store";

export const UNITS = ["kg", "g", "Litres", "ml", "Packets", "Pieces", "Dozen"];

export function CustomItemModal({ open, onClose, storeId }: { open: boolean; onClose: () => void; storeId: string }) {
  const { actions } = useParchi();
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [unit, setUnit] = useState("Packets");

  const submit = () => {
    if (!name.trim()) return;
    actions.addCustomItem(storeId, { name: name.trim(), qty, unit });
    actions.toast(`${name.trim()} added to your Parchi`);
    setName("");
    setQty(1);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add item manually"
      footer={
        <Button className="w-full" onClick={submit} disabled={!name.trim()}>
          Add to Parchi
        </Button>
      }
    >
      <div className="space-y-4">
        <Field label="Product name">
          <Input autoFocus placeholder="e.g. Fortune Rice Bran Oil" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Quantity">
            <Input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} />
          </Field>
          <Field label="Unit">
            <select className={selectClass} value={unit} onChange={(e) => setUnit(e.target.value)}>
              {UNITS.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="flex gap-2.5 rounded-xl bg-saffron-50 p-3 text-sm text-saffron-600">
          <Info size={18} className="mt-0.5 shrink-0" />
          <p><span className="font-semibold">Price will be confirmed by the store.</span> You&apos;ll see it on your bill before pickup.</p>
        </div>
      </div>
    </Modal>
  );
}
