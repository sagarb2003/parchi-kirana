"use client";

import { Home, ListChecks, Package, ShoppingBag, Store, User } from "lucide-react";
import { AccountChip, AppShell } from "@/components/app-shell";
import { CartDrawer } from "@/components/cart-drawer";
import { useParchi } from "@/lib/store";
import { CUSTOMER } from "@/lib/mock-data";
import { isActive } from "@/lib/utils";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { orders, cart, actions } = useParchi();
  const active = orders.filter((o) => o.customerName === CUSTOMER.name && isActive(o.status)).length;
  const count = cart.items.length;

  return (
    <AppShell
      homeHref="/customer"
      nav={[
        { href: "/customer", label: "Home", icon: Home },
        { href: "/customer/stores", label: "Shop", icon: Store },
        { href: "/customer/orders", label: "My Orders", icon: Package, badge: active },
        { href: "/customer/lists", label: "Saved Lists", icon: ListChecks },
        { href: "/customer/profile", label: "Profile", icon: User },
      ]}
      account={<AccountChip name={CUSTOMER.name} sub={CUSTOMER.area} initials="RS" />}
      topRight={
        <button onClick={() => actions.setCartOpen(true)} className="relative flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm font-semibold hover:bg-stone-50" aria-label="Open your Parchi">
          <ShoppingBag size={18} />
          <span className="hidden sm:inline">Your Parchi</span>
          {count > 0 && <span key={count} className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] text-white animate-pop">{count}</span>}
        </button>
      }
    >
      {children}
      <CartDrawer />
    </AppShell>
  );
}
