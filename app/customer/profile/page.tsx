"use client";

import { Bell, ChevronRight, Globe, HelpCircle, LogOut, MapPin, Phone, Mail } from "lucide-react";
import { Card, PageHeader } from "@/components/ui";
import { CUSTOMER } from "@/lib/mock-data";
import { useParchi } from "@/lib/store";

export default function Profile() {
  const { actions } = useParchi();
  const rows = [
    { icon: Phone, label: "Phone", value: CUSTOMER.phone },
    { icon: Mail, label: "Email", value: CUSTOMER.email },
    { icon: MapPin, label: "Home area", value: CUSTOMER.area },
  ];
  const settings = [
    { icon: Bell, label: "Notifications", value: "When order is ready" },
    { icon: Globe, label: "Language", value: "English" },
    { icon: HelpCircle, label: "Help & support", value: "" },
  ];
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Profile" />
      <Card className="flex items-center gap-4 p-5">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-saffron-100 text-xl font-bold text-saffron-600">RS</span>
        <div>
          <p className="text-lg font-semibold">{CUSTOMER.name}</p>
          <p className="text-sm text-ink/55">Parchi member since March 2026</p>
        </div>
      </Card>
      {[rows, settings].map((group, gi) => (
        <Card key={gi} className="mt-4 divide-y divide-line">
          {group.map((r) => (
            <button key={r.label} onClick={() => actions.toast("Available once accounts are connected", "info")} className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-stone-50">
              <r.icon size={19} className="text-ink/45" />
              <span className="flex-1 font-medium">{r.label}</span>
              <span className="text-sm text-ink/50">{r.value}</span>
              <ChevronRight size={16} className="text-ink/30" />
            </button>
          ))}
        </Card>
      ))}
      <button onClick={() => actions.toast("Demo mode — no account to log out of", "info")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
