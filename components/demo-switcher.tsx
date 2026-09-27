"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FlaskConical, RotateCcw, ShoppingBasket, Store, X } from "lucide-react";
import { useParchi } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Floating control that lets evaluators hop between the two experiences without auth. */
export function DemoSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { actions } = useParchi();
  const [open, setOpen] = useState(false);
  const role = pathname.startsWith("/owner") ? "owner" : pathname.startsWith("/customer") ? "customer" : null;

  return (
    <div className={cn("fixed z-[55]", role ? "left-1/2 top-3 -translate-x-1/2 lg:left-[272px] lg:top-4 lg:translate-x-0" : "bottom-5 right-4")}>
      {open ? (
        <div className="w-64 rounded-2xl border border-line bg-white p-3 shadow-2xl animate-sheet">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-600">
              <FlaskConical size={14} /> Demo Mode
            </span>
            <button onClick={() => setOpen(false)} className="rounded-full p-1 text-ink/50 hover:bg-stone-100" aria-label="Close demo panel">
              <X size={14} />
            </button>
          </div>
          <p className="mb-3 px-1 text-xs text-ink/55">No login needed. Switch roles to see both sides of an order update live.</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { k: "customer", label: "Customer View", icon: ShoppingBasket, href: "/customer" },
              { k: "owner", label: "Shop Owner View", icon: Store, href: "/owner" },
            ].map(({ k, label, icon: Icon, href }) => (
              <button
                key={k}
                onClick={() => {
                  router.push(href);
                  setOpen(false);
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition",
                  role === k ? "border-brand-500 bg-brand-50 text-brand-800" : "border-line hover:bg-stone-50",
                )}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
          <button onClick={actions.resetDemo} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium text-ink/55 hover:bg-stone-50">
            <RotateCcw size={12} /> Reset demo data
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 rounded-full border border-saffron-400/40 bg-saffron-50 px-3 py-1.5 text-xs font-semibold text-saffron-600 shadow-sm transition hover:shadow-md"
        >
          <FlaskConical size={14} />
          Demo{role && <span className="hidden sm:inline">: {role === "owner" ? "Shop Owner" : "Customer"}</span>}
        </button>
      )}
    </div>
  );
}
