// Các kiểu dữ liệu dùng chung — phản ánh lược đồ ở supabase/migrations/0001_init.sql
// Đây là nguồn chân lý (source of truth) cho cả lớp demo-data và lớp gọi Supabase thật,
// để khi chuyển từ DEMO sang Supabase không phải đổi kiểu dữ liệu ở UI.

export type OrderStatus = "draft" | "pending_confirmation" | "confirmed" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refund_pending" | "refunded";
export type ReconciliationStatus = "pending" | "reconciled" | "flagged";
export type QueueStatus = "waiting" | "ready" | "assigned" | "in_trip" | "completed" | "cancelled" | "no_show";
export type VehicleStatus = "ready" | "in_trip" | "maintenance" | "out_of_service";
export type TripStatus = "assigned" | "boarding" | "in_progress" | "completed" | "cancelled";

export interface CustomerSource {
  id: string;
  code: string;
  name: string;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  sourceId: string | null;
  sourceName?: string;
  referralCtvName?: string | null;
  note: string | null;
  createdAt: string;
  createdByName?: string;
}

export interface Order {
  id: string;
  orderCode: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  reconciliationStatus: ReconciliationStatus;
  paxCount: number;
  vehiclesRequested: number | null;
  totalAmount: number;
  paidAmount?: number;
  note: string | null;
  createdAt: string;
}

export interface QueueEntry {
  id: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  phoneMasked: string;
  queueNumber: number;
  arrivedAt: string;
  paxCount: number;
  vehiclesNeeded: number;
  status: QueueStatus;
  waitMinutes: number;
  note: string | null;
}

export interface Vehicle {
  id: string;
  vehicleCode: string;
  vehicleName: string | null;
  capacity: number | null; // null = "Chưa thiết lập"
  status: VehicleStatus;
  currentDriverName: string | null;
  lastInspectedAt: string | null;
  note: string | null;
}

export interface Trip {
  id: string;
  orderId: string;
  orderCode: string;
  vehicleId: string;
  vehicleCode: string;
  driverId: string | null;
  driverName: string | null;
  status: TripStatus;
  assignedAt: string;
  startedAt: string | null;
  endedAt: string | null;
}

export interface Payment {
  id: string;
  paymentCode: string;
  orderId: string;
  orderCode: string;
  customerName: string;
  amount: number;
  methodName: string;
  direction: "collection" | "refund";
  status: "pending" | "confirmed" | "void";
  reconciliationStatus: ReconciliationStatus;
  paidAt: string;
}

export interface Expense {
  id: string;
  expenseDate: string;
  categoryName: string;
  content: string;
  amount: number;
  status: "recorded" | "approved" | "rejected";
}

export interface DashboardSummary {
  periodLabel: string;
  revenueCollected: number;
  ordersCount: number;
  customersCount: number;
  activeVehicles: number;
  waitingCustomers: number;
  alertsCount: number;
  revenueTrend: { date: string; revenue: number }[];
  sourceBreakdown: { name: string; value: number }[];
  alerts: { id: string; kind: string; message: string; severity: "warning" | "error" }[];
  recentActivity: { id: string; at: string; actor: string; content: string; status: string }[];
}

export type DataMode = "demo" | "supabase";
