import {
  ArrowRight, Bell, CheckCircle2, ClipboardList, Clock, IndianRupee, LayoutList, MapPin, PackageCheck,
  Receipt, Repeat, ShoppingBag, Store, Timer, Users, Zap,
} from "lucide-react";
import { Logo, LinkButton } from "@/components/ui";

const steps = [
  { n: "01", icon: ClipboardList, title: "Make your list", text: "Search products or add your grocery items. Or just snap a photo of your handwritten parchi." },
  { n: "02", icon: Store, title: "Your store prepares it", text: "The shop receives your order and starts picking." },
  { n: "03", icon: Bell, title: "Get notified", text: "We'll show you when your order is ready." },
  { n: "04", icon: PackageCheck, title: "Pick it up", text: "Show your token and collect your groceries." },
];

const customerBenefits = [
  { icon: Timer, title: "Skip the queue", text: "Your order is already being prepared before you reach the store." },
  { icon: Receipt, title: "Know the price", text: "Review your bill before pickup." },
  { icon: Repeat, title: "Reorder easily", text: "Save your monthly grocery list and reuse it." },
  { icon: MapPin, title: "Shop local", text: "Keep buying from your neighborhood store without wasting time." },
];

const ownerBenefits = [
  { icon: LayoutList, title: "Organized incoming orders" },
  { icon: Zap, title: "Faster picking" },
  { icon: IndianRupee, title: "Clear pricing" },
  { icon: Users, title: "Less counter congestion" },
  { icon: PackageCheck, title: "Easy pickup management" },
  { icon: CheckCircle2, title: "Better staff workflow" },
];

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-ink/65 md:flex">
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#customers" className="hover:text-ink">For Customers</a>
            <a href="#stores" className="hover:text-ink">For Stores</a>
          </nav>
          <div className="flex items-center gap-2">
            <LinkButton href="/customer" variant="ghost" size="sm" className="hidden sm:inline-flex">Login</LinkButton>
            <LinkButton href="/customer" size="sm">Get Started</LinkButton>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-brand-50),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-20">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-ink/70">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron-500" /> Made for India&apos;s kirana stores
            </span>
            <h1 className="mt-6 text-[42px] font-extrabold leading-[1.05] tracking-tight text-ink sm:text-6xl">
              Your grocery list.
              <br />
              <span className="text-brand-600">Ready before you arrive.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink/60">
              Send your list to your local store, let them prepare it, and skip the queue when you arrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/customer" size="lg">
                Start Shopping <ArrowRight size={18} />
              </LinkButton>
              <LinkButton href="/owner" size="lg" variant="secondary">
                <Store size={18} /> For Shop Owners
              </LinkButton>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-ink/55">
              <span className="flex items-center gap-1.5"><Clock size={16} className="text-brand-600" /> ~20 min prep</span>
              <span className="flex items-center gap-1.5"><Receipt size={16} className="text-brand-600" /> Bill before pickup</span>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-16 border-t border-line bg-canvas py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand-600">How it works</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">From list to pickup in minutes.</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-line bg-white p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700"><s.icon size={22} /></span>
                  <span className="text-3xl font-extrabold text-stone-200">{s.n}</span>
                </div>
                <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-ink/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customers */}
      <section id="customers" className="scroll-mt-16 py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">For customers</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your neighbourhood store, without the wait.</h2>
            <p className="mt-4 text-lg text-ink/60">Same shop, same shopkeeper you trust. Parchi just gets your bag ready before you walk in.</p>
            <LinkButton href="/customer/stores" className="mt-8">Find your store <ArrowRight size={16} /></LinkButton>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {customerBenefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-line p-6">
                <b.icon className="text-brand-600" size={24} />
                <h3 className="mt-4 font-semibold">{b.title}</h3>
                <p className="mt-1 text-[15px] text-ink/60">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stores */}
      <section id="stores" className="scroll-mt-16 px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-white sm:px-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-brand-300">For shop owners</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Turn waiting customers into ready orders.</h2>
              <p className="mt-4 text-lg text-white/60">Orders arrive on your phone, your staff picks from a clear list, and customers collect with a token. No crowd at the counter.</p>
              <LinkButton href="/owner" size="lg" className="mt-8 bg-white !text-ink hover:bg-white/90">
                Set Up Your Store <ArrowRight size={18} />
              </LinkButton>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {ownerBenefits.map((b) => (
                <div key={b.title} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10">
                  <b.icon size={20} className="shrink-0 text-brand-300" />
                  <span className="text-sm font-medium">{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-ink/50 sm:flex-row sm:px-6">
          <Logo />
          <p>Your list. Their prep. Zero waiting.</p>
          <p>© 2026 Parchi · Made in India</p>
        </div>
      </footer>
    </div>
  );
}

function HeroVisual() {
  const journey = [
    { icon: ClipboardList, label: "List sent", done: true },
    { icon: ShoppingBag, label: "Preparing", done: true },
    { icon: Bell, label: "Ready", done: true, active: true },
    { icon: PackageCheck, label: "Pickup", done: false },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md animate-fade-up [animation-delay:120ms]">
      {/* Handwritten-ish list */}
      <div className="rotate-[-3deg] rounded-2xl border border-line bg-[#fffdf6] p-5 shadow-lg">
        <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Rahul&apos;s Parchi</p>
        <ul className="mt-3 space-y-2 text-[15px]">
          {["Aashirvaad Atta — 5 kg", "Tata Salt — 1 kg", "Fortune Oil — 1 L", "Toor Dal — 1 kg", "Maggi — 4 pack"].map((t) => (
            <li key={t} className="flex items-center gap-2 border-b border-dashed border-line pb-2 last:border-0">
              <CheckCircle2 size={16} className="text-brand-500" /> {t}
            </li>
          ))}
        </ul>
      </div>

      {/* Journey strip */}
      <div className="relative -mt-6 ml-6 rounded-2xl border border-line bg-white p-4 shadow-xl sm:ml-12">
        <div className="flex items-center justify-between">
          {journey.map((j, i) => (
            <div key={j.label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${j.active ? "bg-brand-600 text-white ring-4 ring-brand-100" : j.done ? "bg-brand-50 text-brand-700" : "bg-stone-100 text-ink/40"}`}>
                  <j.icon size={16} />
                </span>
                <span className="text-[11px] font-semibold text-ink/60">{j.label}</span>
              </div>
              {i < journey.length - 1 && <div className={`mx-1 mb-5 h-0.5 flex-1 rounded ${j.done && journey[i + 1].done ? "bg-brand-400" : "bg-stone-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Order card */}
      <div className="relative -mt-4 mr-auto w-64 rotate-[2deg] rounded-2xl bg-ink p-5 text-white shadow-2xl sm:-ml-6">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/50">Order #PCH-1024</span>
          <span className="flex items-center gap-1 rounded-full bg-brand-500/20 px-2 py-0.5 text-[11px] font-semibold text-brand-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300" /> Ready for pickup
          </span>
        </div>
        <p className="mt-4 text-xs text-white/50">Pickup token</p>
        <p className="text-5xl font-extrabold tracking-tight text-saffron-400">A23</p>
        <p className="mt-2 text-xs text-white/50">Sharma General Store · ₹653</p>
      </div>
    </div>
  );
}
