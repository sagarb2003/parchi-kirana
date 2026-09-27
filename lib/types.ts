// Domain types. These mirror the tables a future Supabase schema will expose
// (stores, products, orders, order_items, saved_lists, staff).

export type Category =
  | "Atta & Rice"
  | "Dal"
  | "Oil & Ghee"
  | "Dairy"
  | "Snacks"
  | "Beverages"
  | "Household";

export const CATEGORIES: Category[] = [
  "Atta & Rice",
  "Dal",
  "Oil & Ghee",
  "Dairy",
  "Snacks",
  "Beverages",
  "Household",
];

export interface Store {
  id: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  isOpen: boolean;
  opensAt?: string;
  prepMinutes: number;
  rating: number;
  phone: string;
  address: string;
  hours: string;
  pickupInstructions: string;
  owner: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  unit: string;
  price: number;
  category: Category;
  available: boolean;
  emoji: string;
}

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  unit: string;
  qty: number;
  /** null = custom item; the store confirms the price */
  price: number | null;
  category: Category | "Other";
  emoji: string;
}

export type OrderStatus =
  | "placed"
  | "preparing"
  | "packed"
  | "ready"
  | "completed"
  | "rejected";

export interface OrderItem extends CartItem {
  available: boolean;
  picked: boolean;
}

export interface Order {
  id: string;
  storeId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string; // ISO
  pickupTime: string; // "5:40 PM"
  token?: string;
  packingFee: number;
  listImage?: string;
  note?: string;
}

export interface SavedList {
  id: string;
  name: string;
  emoji: string;
  items: CartItem[];
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  active: boolean;
}
