"use client";

import { useState } from "react";
import { Card, PageHeader, Toggle } from "@/components/ui";
import { useParchi } from "@/lib/store";

const OPTIONS = [
  { k: "sound", label: "Sound alert for new orders", sub: "Play a bell when a Parchi arrives" },
  { k: "autoAccept", label: "Auto-accept regular customers", sub: "Skip review for customers with 5+ orders" },
  { k: "sms", label: "SMS customers when ready", sub: "In addition to the in-app ready screen" },
  { k: "packing", label: "Charge packing fee (₹5)", sub: "Added to every accepted order" },
];

export default function Settings() {
  const { actions } = useParchi();
  const [s, setS] = useState<Record<string, boolean>>({ sound: true, autoAccept: false, sms: true, packing: true });
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" subtitle="Notifications and order preferences." />
      <Card className="divide-y divide-line">
        {OPTIONS.map((o) => (
          <div key={o.k} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="font-medium">{o.label}</p>
              <p className="text-sm text-ink/55">{o.sub}</p>
            </div>
            <Toggle checked={s[o.k]} onChange={(v) => { setS({ ...s, [o.k]: v }); actions.toast("Preference saved"); }} />
          </div>
        ))}
      </Card>
      <Card className="mt-4 p-5">
        <p className="font-medium">Demo data</p>
        <p className="text-sm text-ink/55">Restore all orders, products and staff to the starting state.</p>
        <button onClick={actions.resetDemo} className="mt-3 text-sm font-semibold text-red-600">Reset demo</button>
      </Card>
    </div>
  );
}
