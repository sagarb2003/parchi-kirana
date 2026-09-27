"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "./ui";
import { cn } from "@/lib/utils";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
  mobile?: boolean;
}

/** Sidebar on desktop, top bar + bottom tab bar on mobile. */
export function AppShell({
  nav, account, children, homeHref, topRight, maxWidth = "max-w-5xl",
}: {
  nav: NavItem[];
  account: ReactNode;
  children: ReactNode;
  homeHref: string;
  topRight?: ReactNode;
  maxWidth?: string;
}) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === homeHref ? pathname === href : pathname.startsWith(href));
  const mobileNav = nav.filter((n) => n.mobile !== false);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center px-6">
          <Logo href={homeHref} />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition",
                isActive(n.href) ? "bg-brand-50 text-brand-800" : "text-ink/60 hover:bg-stone-50 hover:text-ink",
              )}
            >
              <n.icon size={19} strokeWidth={isActive(n.href) ? 2.3 : 2} />
              <span className="flex-1">{n.label}</span>
              {!!n.badge && <span className="rounded-full bg-saffron-500 px-2 py-0.5 text-[11px] font-bold text-white">{n.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="border-t border-line p-4">{account}</div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Logo href={homeHref} className="[&_span:last-child]:text-lg" />
        {topRight}
      </header>

      <div className="lg:pl-64">
        {topRight && (
          <div className="sticky top-0 z-20 hidden h-16 items-center justify-end border-b border-line bg-canvas/85 px-8 backdrop-blur lg:flex">{topRight}</div>
        )}
        <main className={cn("mx-auto px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8", maxWidth)}>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-lg">
          {mobileNav.map((n) => (
            <Link key={n.href} href={n.href} className={cn("relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold", isActive(n.href) ? "text-brand-700" : "text-ink/45")}>
              <n.icon size={22} strokeWidth={isActive(n.href) ? 2.3 : 1.8} />
              {n.label}
              {!!n.badge && <span className="absolute right-[calc(50%-20px)] top-1.5 h-4 min-w-4 rounded-full bg-saffron-500 px-1 text-[10px] leading-4 text-white">{n.badge}</span>}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function AccountChip({ name, sub, initials }: { name: string; sub: string; initials: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-100 text-sm font-bold text-saffron-600">{initials}</span>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{name}</p>
        <p className="truncate text-xs text-ink/50">{sub}</p>
      </div>
    </div>
  );
}
