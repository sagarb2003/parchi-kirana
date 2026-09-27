"use client";

import Link from "next/link";
import { X, Check, Info, AlertCircle } from "lucide-react";
import { useEffect, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn, STATUS_META } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";
import { useParchi } from "@/lib/store";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "dark";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-900/10",
  dark: "bg-ink text-white hover:bg-ink/90",
  secondary: "bg-white text-ink border border-line hover:bg-stone-50",
  ghost: "text-ink/70 hover:bg-stone-100 hover:text-ink",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg gap-1.5",
  md: "h-11 px-4 text-[15px] rounded-xl gap-2",
  lg: "h-14 px-6 text-base rounded-2xl gap-2",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn(
    "inline-flex items-center justify-center font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
    variants[variant],
    sizes[size],
    extra,
  );
}

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function LinkButton({ href, variant = "primary", size = "md", className, children }: { href: string; variant?: Variant; size?: Size; className?: string; children: ReactNode }) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-2xl border border-line bg-white", className)} {...rest}>
      {children}
    </div>
  );
}

const tones = {
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  blue: "bg-sky-50 text-sky-800 ring-sky-200",
  violet: "bg-violet-50 text-violet-800 ring-violet-200",
  green: "bg-brand-50 text-brand-800 ring-brand-200",
  gray: "bg-stone-100 text-stone-700 ring-stone-200",
  red: "bg-red-50 text-red-700 ring-red-200",
};

export function Badge({ tone = "gray", dot, children, className }: { tone?: keyof typeof tones; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tones[tone], className)}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full bg-current", tone === "green" && "animate-pulse")} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: OrderStatus; className?: string }) {
  const m = STATUS_META[status];
  return (
    <Badge tone={m.tone} dot className={cn("animate-pop", className)} key={status}>
      {m.label}
    </Badge>
  );
}

export function Input({ className, icon, ...props }: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return (
    <div className="relative">
      {icon && <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40">{icon}</span>}
      <input
        className={cn(
          "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-[15px] text-ink placeholder:text-ink/40 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
          !!icon && "pl-10",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export const selectClass =
  "h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] text-ink outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export function Modal({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-[2px] animate-fade" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-md rounded-t-3xl bg-white shadow-2xl animate-sheet sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-ink/50 hover:bg-stone-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-5">{children}</div>
        {footer && <div className="flex gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-12 text-center animate-fade-up">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-stone-100 text-ink/50">{icon}</div>
      <h3 className="font-semibold text-ink">{title}</h3>
      {text && <p className="mt-1 max-w-xs text-sm text-ink/55">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-stone-200/70", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="h-4 w-72" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 font-bold tracking-tight text-ink", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-brand-600 text-white shadow-sm">
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M7 3h10v18l-2.5-1.8L12 21l-2.5-1.8L7 21z" />
          <path d="M10 8h4M10 12h4" />
        </svg>
      </span>
      <span className="text-xl">Parchi</span>
    </Link>
  );
}

export function PageHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-[15px] text-ink/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Toaster() {
  const { toasts } = useParchi();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-2.5 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-xl animate-toast">
          <span className={cn("grid h-5 w-5 place-items-center rounded-full", t.tone === "success" ? "bg-brand-500" : t.tone === "error" ? "bg-red-500" : "bg-white/20")}>
            {t.tone === "success" ? <Check size={12} strokeWidth={3} /> : t.tone === "error" ? <AlertCircle size={12} /> : <Info size={12} />}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function Stepper({ value, onChange, min = 0 }: { value: number; onChange: (v: number) => void; min?: number }) {
  return (
    <div className="inline-flex h-9 items-center rounded-lg border border-line bg-white">
      <button className="h-full w-9 text-lg font-medium text-ink/70 hover:bg-stone-50 rounded-l-lg" onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease">
        −
      </button>
      <span key={value} className="w-7 text-center text-sm font-semibold tabular-nums animate-pop">{value}</span>
      <button className="h-full w-9 text-lg font-medium text-brand-700 hover:bg-stone-50 rounded-r-lg" onClick={() => onChange(value + 1)} aria-label="Increase">
        +
      </button>
    </div>
  );
}

export function QrPlaceholder({ seed, size = 168 }: { seed: string; size?: number }) {
  // Deterministic pseudo-QR pattern (visual only).
  const n = 21;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = (h * 1103515245 + 12345) >>> 0;
    cells.push(((h >> 16) & 1) === 1);
  }
  const finder = (x: number, y: number) => {
    for (const [fx, fy] of [[0, 0], [n - 7, 0], [0, n - 7]]) {
      if (x >= fx && x < fx + 7 && y >= fy && y < fy + 7) {
        const dx = x - fx, dy = y - fy;
        return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0;
      }
    }
    return -1;
  };
  const s = size / n;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Pickup QR code">
      {Array.from({ length: n * n }, (_, i) => {
        const x = i % n, y = Math.floor(i / n);
        const f = finder(x, y);
        const on = f === -1 ? cells[i] : f === 1;
        return on ? <rect key={i} x={x * s} y={y * s} width={s + 0.3} height={s + 0.3} fill="#1c1917" /> : null;
      })}
    </svg>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={cn("relative h-6 w-11 rounded-full transition", checked ? "bg-brand-600" : "bg-stone-300")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}
