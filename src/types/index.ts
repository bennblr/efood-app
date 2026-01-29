export type UserRole = "customer" | "employee" | "admin";

export type ReservationStatus = "new" | "confirmed" | "cancelled" | "completed";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "in_progress"
  | "ready"
  | "completed"
  | "cancelled";

export interface User {
  id: string;
  telegramId: string | null;
  phone: string | null;
  name: string | null;
  username: string | null;
  role: UserRole;
  createdAt: string;
}

export interface Category {
  id: string;
  title: string;
  description: string | null;
  products?: Product[];
}

export interface Product {
  id: string;
  categoryId: string;
  title: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  available: boolean;
  category?: Category;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  comment?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  status: ReservationStatus;
  startTime: string;
  endTime: string;
  personsCount: number;
  createdAt: string;
  user?: User;
  orders?: Order[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  quantity: number;
  priceAtTime: number;
  comment?: string | null;
}

export interface Order {
  id: string;
  reservationId: string | null;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  reservation?: Reservation | null;
  user?: User;
  items?: OrderItem[];
}

export interface MenuSchedule {
  id: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  user?: User;
}
