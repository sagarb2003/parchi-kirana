"use client";

import { ClipboardList, LayoutDashboard, PackageCheck, Settings, ShoppingBasket, Store, Users, ScanLine } from "lucide-react";
import { AccountChip, AppShell } from "@/components/app-shell";
import { OWNER_STORE_ID, useParchi } from "@/lib/store";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { orders } = useParchi();
  const mine = orders.filter((o) => o.storeId === OWNER_STORE_ID);
  const waiting = mine.filter((o) => o.status === "placed").length;
  const picking = mine.filter((o) => o.status === "preparing").length;
  const ready = mine.filter((o) => o.status === "ready").length;

  return (
    <AppShell
      homeHref="/owner"
      maxWidth="max-w-6xl"
      nav={[
        { href: "/owner", label: "Overview", icon: LayoutDashboard },
        { href: "/owner/orders", label: "Orders", icon: ClipboardList, badge: waiting },
        { href: "/owner/picking", label: "Picking", icon: PackageCheck, badge: picking },
        { href: "/owner/pickup", label: "Pickup", icon: ScanLine, badge: ready },
        { href: "/owner/products", label: "Products", icon: ShoppingBasket, mobile: false },
        { href: "/owner/staff", label: "Staff", icon: Users, mobile: false },
        { href: "/owner/store", label: "Store", icon: Store },
        { href: "/owner/settings", label: "Settings", icon: Settings, mobile: false },
      ]}
      account={<AccountChip name="Sharma General Store" sub="Owner account · Amit" initials="SG" />}
    >
      {children}
    </AppShell>
  );
}
