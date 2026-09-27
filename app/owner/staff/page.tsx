"use client";

import { useState } from "react";
import { Phone, UserPlus, Users } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Input, Modal, PageHeader, PageSkeleton, Toggle, selectClass } from "@/components/ui";
import { useParchi } from "@/lib/store";

const ROLES = ["Picking", "Picking & Packing", "Counter & Pickup", "Manager"];

export default function StaffPage() {
  const { staff, hydrated, actions } = useParchi();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", role: ROLES[0] });
  if (!hydrated) return <PageSkeleton />;

  return (
    <div>
      <PageHeader title="Staff" subtitle="People who pick, pack and hand over Parchi orders." action={<Button onClick={() => setOpen(true)}><UserPlus size={18} /> Add Staff</Button>} />
      {staff.length === 0 ? (
        <EmptyState icon={<Users />} title="No staff yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((m) => (
            <Card key={m.id} className="p-5 animate-fade-up">
              <div className="flex items-start justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 font-bold text-brand-700">{m.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}</span>
                <Toggle checked={m.active} onChange={() => { actions.toggleStaff(m.id); actions.toast(`${m.name.split(" ")[0]} marked ${m.active ? "inactive" : "active"}`, "info"); }} />
              </div>
              <p className="mt-3 text-lg font-semibold">{m.name}</p>
              <p className="text-sm text-ink/55">{m.role}</p>
              <div className="mt-4 flex items-center justify-between">
                <Badge tone={m.active ? "green" : "gray"} dot>{m.active ? "Active" : "Inactive"}</Badge>
                <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-sm text-ink/55 hover:text-ink"><Phone size={14} /> {m.phone}</a>
              </div>
            </Card>
          ))}
        </div>
      )}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add staff member"
        footer={<Button className="w-full" disabled={!f.name.trim()} onClick={() => { actions.addStaff({ ...f, name: f.name.trim(), active: true }); setOpen(false); setF({ name: "", phone: "", role: ROLES[0] }); }}>Add Staff</Button>}
      >
        <div className="space-y-4">
          <Field label="Name"><Input autoFocus value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Pooja" /></Field>
          <Field label="Phone"><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+91" inputMode="tel" /></Field>
          <Field label="Role">
            <select className={selectClass} value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
        </div>
      </Modal>
    </div>
  );
}
