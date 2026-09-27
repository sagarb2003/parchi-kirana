import type { CartItem, Category, Order, OrderItem, Product, SavedList, Staff, Store } from "./types";

export const CUSTOMER = { name: "Rahul Sharma", first: "Rahul", phone: "+91 98110 42387", email: "rahul.sharma@example.in", area: "Majlis Park, New Delhi" };
export const OWNER = { name: "Amit Sharma", first: "Amit" };

export const STORES: Store[] = [
  { id: "s1", slug: "sharma-general-store", name: "Sharma General Store", area: "Majlis Park", city: "New Delhi", isOpen: true, prepMinutes: 20, rating: 4.7, phone: "+91 98100 12345", address: "Shop 14, Main Market, Majlis Park, New Delhi 110033", hours: "7:00 AM – 10:00 PM", pickupInstructions: "Show your token at the left counter near the billing desk.", owner: "Amit Sharma" },
  { id: "s2", slug: "gupta-general-store", name: "Gupta General Store", area: "Rohini Sector 7", city: "New Delhi", isOpen: true, prepMinutes: 15, rating: 4.6, phone: "+91 98111 22334", address: "B-4/12, Sector 7, Rohini, New Delhi 110085", hours: "8:00 AM – 10:30 PM", pickupInstructions: "Pickup counter is at the entrance.", owner: "Rakesh Gupta" },
  { id: "s3", slug: "verma-grocery", name: "Verma Grocery", area: "Janakpuri", city: "New Delhi", isOpen: false, opensAt: "4:00 PM", prepMinutes: 25, rating: 4.5, phone: "+91 98712 55667", address: "C-2 Market, Janakpuri, New Delhi 110058", hours: "9:00 AM – 1:00 PM, 4:00 PM – 9:30 PM", pickupInstructions: "Ask for Parchi orders at the counter.", owner: "Sunil Verma" },
  { id: "s4", slug: "bansal-kirana", name: "Bansal Kirana & Provisions", area: "Lajpat Nagar II", city: "New Delhi", isOpen: true, prepMinutes: 25, rating: 4.8, phone: "+91 99990 11223", address: "I-41, Central Market, Lajpat Nagar II, New Delhi 110024", hours: "7:30 AM – 10:00 PM", pickupInstructions: "Parchi pickup shelf is next to the dairy fridge.", owner: "Manoj Bansal" },
  { id: "s5", slug: "agarwal-provision-store", name: "Agarwal Provision Store", area: "Pitampura", city: "New Delhi", isOpen: true, prepMinutes: 18, rating: 4.4, phone: "+91 98730 99881", address: "LU Block Market, Pitampura, New Delhi 110034", hours: "8:00 AM – 9:30 PM", pickupInstructions: "Collect from the side window.", owner: "Deepak Agarwal" },
];

const CATALOG: [string, string, number, Category, string][] = [
  ["Aashirvaad Atta", "5 kg", 295, "Atta & Rice", "🌾"],
  ["India Gate Basmati Rice", "5 kg", 640, "Atta & Rice", "🍚"],
  ["Fortune Chakki Atta", "10 kg", 520, "Atta & Rice", "🌾"],
  ["Daawat Rozana Rice", "1 kg", 98, "Atta & Rice", "🍚"],
  ["Tata Sampann Toor Dal", "1 kg", 180, "Dal", "🫘"],
  ["Moong Dal", "1 kg", 150, "Dal", "🫘"],
  ["Chana Dal", "1 kg", 110, "Dal", "🫘"],
  ["Rajma Chitra", "500 g", 95, "Dal", "🫘"],
  ["Fortune Sunflower Oil", "1 L", 145, "Oil & Ghee", "🫙"],
  ["Amul Pure Ghee", "1 L", 610, "Oil & Ghee", "🧈"],
  ["Saffola Gold Oil", "1 L", 199, "Oil & Ghee", "🫙"],
  ["Tata Salt", "1 kg", 28, "Oil & Ghee", "🧂"],
  ["Amul Taaza Milk", "1 L", 56, "Dairy", "🥛"],
  ["Amul Butter", "500 g", 285, "Dairy", "🧈"],
  ["Mother Dairy Dahi", "400 g", 45, "Dairy", "🥣"],
  ["Amul Paneer", "200 g", 90, "Dairy", "🧀"],
  ["Maggi Masala Noodles", "Pack of 4", 56, "Snacks", "🍜"],
  ["Parle-G Biscuits", "800 g", 85, "Snacks", "🍪"],
  ["Haldiram's Aloo Bhujia", "400 g", 110, "Snacks", "🥨"],
  ["Lay's Magic Masala", "90 g", 30, "Snacks", "🥔"],
  ["Tata Tea Gold", "500 g", 285, "Beverages", "🍵"],
  ["Bru Instant Coffee", "100 g", 210, "Beverages", "☕"],
  ["Real Mixed Fruit Juice", "1 L", 120, "Beverages", "🧃"],
  ["Surf Excel Easy Wash", "1 kg", 140, "Household", "🧺"],
  ["Vim Dishwash Bar", "Pack of 3", 60, "Household", "🧽"],
  ["Harpic Toilet Cleaner", "500 ml", 99, "Household", "🧴"],
  ["Colgate Strong Teeth", "200 g", 110, "Household", "🪥"],
];

export const PRODUCTS: Product[] = STORES.flatMap((s, si) =>
  CATALOG.map(([name, unit, price, category, emoji], i) => ({
    id: `${s.id}-p${i + 1}`,
    storeId: s.id,
    name,
    unit,
    price: si === 0 ? price : price + ((i * 3 + si * 2) % 7) - 3,
    category,
    emoji,
    available: !(si === 0 && i === 22),
  })),
);

const p = (n: number) => PRODUCTS[n - 1]; // Sharma store products

const toItem = (pr: Product, qty = 1, extra: Partial<OrderItem> = {}): OrderItem => ({
  id: `${pr.id}-${Math.random().toString(36).slice(2, 6)}`,
  productId: pr.id,
  name: pr.name,
  unit: pr.unit,
  qty,
  price: pr.price,
  category: pr.category,
  emoji: pr.emoji,
  available: true,
  picked: false,
  ...extra,
});

const daysAgo = (d: number, h = 18) => {
  const t = new Date("2026-09-27T00:00:00+05:30");
  t.setDate(t.getDate() - d);
  t.setHours(h);
  return t.toISOString();
};

export const SEED_ORDERS: Order[] = [
  {
    id: "PCH-1024", storeId: "s1", customerName: "Rahul Sharma", customerPhone: CUSTOMER.phone, status: "placed", createdAt: daysAgo(0, 17), pickupTime: "5:40 PM", packingFee: 5,
    items: [toItem(p(1)), toItem(p(2)), toItem(p(12)), toItem(p(9)), toItem(p(5)), toItem(p(17), 2), toItem(p(13), 2), { ...toItem(p(1)), id: "c-1024", productId: undefined, name: "Fortune Rice Bran Oil", unit: "Litres", qty: 2, price: null, category: "Other", emoji: "📝" }],
  },
  {
    id: "PCH-1025", storeId: "s1", customerName: "Priya Verma", customerPhone: "+91 98999 22110", status: "placed", createdAt: daysAgo(0, 17), pickupTime: "6:00 PM", packingFee: 5,
    items: [toItem(p(3)), toItem(p(6)), toItem(p(7)), toItem(p(10)), toItem(p(14)), toItem(p(15), 2), toItem(p(16)), toItem(p(18)), toItem(p(21)), toItem(p(24)), toItem(p(25)), toItem(p(27))],
  },
  {
    id: "PCH-1026", storeId: "s1", customerName: "Anil Kapoor", customerPhone: "+91 97170 33445", status: "placed", createdAt: daysAgo(0, 16), pickupTime: "6:30 PM", packingFee: 5,
    items: [toItem(p(4), 2), toItem(p(5)), toItem(p(13), 3), toItem(p(19)), toItem(p(20), 4)],
  },
  {
    id: "PCH-1022", storeId: "s1", customerName: "Neha Gupta", customerPhone: "+91 98100 77889", status: "preparing", createdAt: daysAgo(0, 16), pickupTime: "5:15 PM", packingFee: 5,
    items: [toItem(p(2), 1, { picked: true }), toItem(p(8), 2, { picked: true }), toItem(p(11)), toItem(p(15)), toItem(p(22)), toItem(p(26))],
  },
  {
    id: "PCH-1021", storeId: "s1", customerName: "Vikram Singh", customerPhone: "+91 98181 66554", status: "packed", createdAt: daysAgo(0, 15), pickupTime: "5:00 PM", packingFee: 5,
    items: [toItem(p(1), 1, { picked: true }), toItem(p(12), 1, { picked: true }), toItem(p(21), 1, { picked: true })],
  },
  {
    id: "PCH-1019", storeId: "s1", customerName: "Sunita Rawat", customerPhone: "+91 99531 44120", status: "ready", token: "A21", createdAt: daysAgo(0, 14), pickupTime: "4:30 PM", packingFee: 5,
    items: [toItem(p(13), 4, { picked: true }), toItem(p(17), 2, { picked: true }), toItem(p(18), 1, { picked: true }), toItem(p(24), 1, { picked: true })],
  },
  {
    id: "PCH-1018", storeId: "s1", customerName: "Karan Mehta", customerPhone: "+91 98734 90011", status: "ready", token: "A22", createdAt: daysAgo(0, 14), pickupTime: "4:45 PM", packingFee: 5,
    items: [toItem(p(10), 1, { picked: true }), toItem(p(14), 1, { picked: true })],
  },
  // Rahul's history
  {
    id: "PCH-0987", storeId: "s1", customerName: "Rahul Sharma", customerPhone: CUSTOMER.phone, status: "completed", token: "B14", createdAt: daysAgo(3), pickupTime: "6:00 PM", packingFee: 5,
    items: [toItem(p(1), 1, { picked: true }), toItem(p(2), 1, { picked: true }), toItem(p(5), 1, { picked: true }), toItem(p(9), 1, { picked: true }), toItem(p(13), 2, { picked: true }), toItem(p(21), 1, { picked: true }), toItem(p(15), 1, { picked: true }), toItem(p(24), 1, { picked: true })],
  },
  {
    id: "PCH-0942", storeId: "s2", customerName: "Rahul Sharma", customerPhone: CUSTOMER.phone, status: "completed", token: "C07", createdAt: daysAgo(10), pickupTime: "7:30 PM", packingFee: 5,
    items: [toItem(PRODUCTS[27 + 16], 2, { picked: true }), toItem(PRODUCTS[27 + 18], 1, { picked: true }), toItem(PRODUCTS[27 + 19], 3, { picked: true }), toItem(PRODUCTS[27 + 22], 2, { picked: true })],
  },
  {
    id: "PCH-0911", storeId: "s1", customerName: "Rahul Sharma", customerPhone: CUSTOMER.phone, status: "completed", token: "A09", createdAt: daysAgo(18), pickupTime: "11:00 AM", packingFee: 5,
    items: [toItem(p(3), 1, { picked: true }), toItem(p(6), 1, { picked: true }), toItem(p(7), 1, { picked: true }), toItem(p(10), 1, { picked: true }), toItem(p(12), 2, { picked: true }), toItem(p(25), 2, { picked: true })],
  },
];

const cart = (pr: Product, qty = 1): CartItem => {
  const { available: _a, picked: _p, ...rest } = toItem(pr, qty);
  return rest;
};

export const SEED_LISTS: SavedList[] = [
  { id: "l1", name: "Monthly Ration", emoji: "🗓️", items: [cart(p(3)), cart(p(2)), cart(p(5)), cart(p(6)), cart(p(9), 2), cart(p(10)), cart(p(12)), cart(p(21))] },
  { id: "l2", name: "Household Essentials", emoji: "🧺", items: [cart(p(24)), cart(p(25), 2), cart(p(26)), cart(p(27)), cart(p(12)), cart(p(9)), cart(p(21)), cart(p(18))] },
  { id: "l3", name: "Weekend Snacks", emoji: "🍿", items: [cart(p(17), 2), cart(p(19)), cart(p(20), 3), cart(p(23))] },
];

export const SEED_STAFF: Staff[] = [
  { id: "st1", name: "Rajesh Kumar", role: "Picking & Packing", phone: "+91 98115 33221", active: true },
  { id: "st2", name: "Meena Devi", role: "Picking", phone: "+91 98730 11009", active: true },
  { id: "st3", name: "Sonu Yadav", role: "Counter & Pickup", phone: "+91 99101 55432", active: false },
];

/** Orders already completed today before the demo started (for stats). */
export const COMPLETED_TODAY_BASELINE = 31;

