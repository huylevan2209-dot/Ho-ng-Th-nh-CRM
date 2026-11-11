// DỮ LIỆU DEMO — dùng để xem thử giao diện và luồng nghiệp vụ khi chưa kết nối
// Supabase thật (xem src/lib/data/mode.ts). KHÔNG dùng số liệu này làm số liệu
// kinh doanh thật. Khi NEXT_PUBLIC_SUPABASE_URL / ANON_KEY được cấu hình, toàn
// bộ các hàm trong src/lib/data/* sẽ đọc/ghi Supabase thay vì mảng bên dưới.

import type { Customer, DashboardSummary, Order, Payment, QueueEntry, Trip, Vehicle } from "./types";

export const demoCustomerSources = [
  { id: "src-ctv", code: "ctv", name: "Cộng tác viên" },
  { id: "src-tiktok", code: "tiktok", name: "TikTok" },
  { id: "src-walkin", code: "walk_in", name: "Khách tự đến" },
  { id: "src-group", code: "group", name: "Khách đoàn" },
  { id: "src-other", code: "other", name: "Nguồn khác" }
];

export const demoCustomers: Customer[] = [
  {
    id: "cus-1",
    fullName: "Nguyễn Thị Hồng",
    phone: "0905123456",
    sourceId: "src-ctv",
    sourceName: "Cộng tác viên",
    referralCtvName: "Trần Văn Lộc",
    note: "Khách quen, hay đi đoàn gia đình",
    createdAt: "2026-11-09T08:12:00+07:00",
    createdByName: "Lê Thị Quầy"
  },
  {
    id: "cus-2",
    fullName: "Phạm Minh Tuấn",
    phone: "0912345678",
    sourceId: "src-tiktok",
    sourceName: "TikTok",
    referralCtvName: null,
    note: null,
    createdAt: "2026-11-10T09:40:00+07:00",
    createdByName: "Lê Thị Quầy"
  },
  {
    id: "cus-3",
    fullName: "Đoàn khách Công ty ABC",
    phone: "0988777456",
    sourceId: "src-group",
    sourceName: "Khách đoàn",
    referralCtvName: null,
    note: "Đoàn 25 khách, liên hệ trước 1 ngày",
    createdAt: "2026-11-10T13:05:00+07:00",
    createdByName: "Nguyễn Văn Quầy 2"
  },
  {
    id: "cus-4",
    fullName: "Hoàng Thị Mai",
    phone: "0977123456",
    sourceId: "src-walkin",
    sourceName: "Khách tự đến",
    referralCtvName: null,
    note: null,
    createdAt: "2026-11-11T07:55:00+07:00",
    createdByName: "Lê Thị Quầy"
  }
];

export const demoOrders: Order[] = [
  {
    id: "ord-1",
    orderCode: "DH-261111-001",
    customerId: "cus-1",
    customerName: "Nguyễn Thị Hồng",
    customerPhone: "0905123456",
    status: "confirmed",
    paymentStatus: "paid",
    reconciliationStatus: "pending",
    paxCount: 4,
    vehiclesRequested: 1,
    totalAmount: 480000,
    paidAmount: 480000,
    note: null,
    createdAt: "2026-11-11T08:00:00+07:00"
  },
  {
    id: "ord-2",
    orderCode: "DH-261111-002",
    customerId: "cus-2",
    customerName: "Phạm Minh Tuấn",
    customerPhone: "0912345678",
    status: "confirmed",
    paymentStatus: "partial",
    reconciliationStatus: "pending",
    paxCount: 2,
    vehiclesRequested: 1,
    totalAmount: 240000,
    paidAmount: 120000,
    note: null,
    createdAt: "2026-11-11T09:10:00+07:00"
  },
  {
    id: "ord-3",
    orderCode: "DH-261111-003",
    customerId: "cus-3",
    customerName: "Đoàn khách Công ty ABC",
    customerPhone: "0988777456",
    status: "pending_confirmation",
    paymentStatus: "unpaid",
    reconciliationStatus: "pending",
    paxCount: 25,
    vehiclesRequested: 5,
    totalAmount: 3000000,
    paidAmount: 0,
    note: "Chờ xác nhận số xe cuối cùng",
    createdAt: "2026-11-11T10:30:00+07:00"
  },
  {
    id: "ord-4",
    orderCode: "DH-261111-004",
    customerId: "cus-4",
    customerName: "Hoàng Thị Mai",
    customerPhone: "0977123456",
    status: "draft",
    paymentStatus: "unpaid",
    reconciliationStatus: "pending",
    paxCount: 3,
    vehiclesRequested: 1,
    totalAmount: 0,
    paidAmount: 0,
    note: "Đang chờ chốt dịch vụ",
    createdAt: "2026-11-11T11:02:00+07:00"
  }
];

export const demoVehicles: Vehicle[] = [
  { id: "veh-1", vehicleCode: "XD-01", vehicleName: "Xe điện 01", capacity: null, status: "in_trip", currentDriverName: "Trần Văn Hùng", lastInspectedAt: "2026-11-08", note: null },
  { id: "veh-2", vehicleCode: "XD-02", vehicleName: "Xe điện 02", capacity: null, status: "ready", currentDriverName: null, lastInspectedAt: "2026-11-09", note: null },
  { id: "veh-3", vehicleCode: "XD-03", vehicleName: "Xe điện 03", capacity: null, status: "maintenance", currentDriverName: null, lastInspectedAt: "2026-10-28", note: "Thay ắc quy, dự kiến xong 12/11" },
  { id: "veh-4", vehicleCode: "XD-04", vehicleName: "Xe điện 04", capacity: null, status: "ready", currentDriverName: null, lastInspectedAt: "2026-11-09", note: null },
  { id: "veh-5", vehicleCode: "XD-05", vehicleName: "Xe điện 05", capacity: null, status: "out_of_service", currentDriverName: null, lastInspectedAt: "2026-09-15", note: "Chờ thanh lý" }
];

export const demoQueue: QueueEntry[] = [
  {
    id: "q-1", orderId: "ord-2", orderCode: "DH-261111-002", customerName: "Phạm Minh Tuấn",
    phoneMasked: "091*****78", queueNumber: 101, arrivedAt: "2026-11-11T10:40:00+07:00",
    paxCount: 2, vehiclesNeeded: 1, status: "waiting", waitMinutes: 38, note: null
  },
  {
    id: "q-2", orderId: "ord-3", orderCode: "DH-261111-003", customerName: "Đoàn khách Công ty ABC",
    phoneMasked: "098*****56", queueNumber: 102, arrivedAt: "2026-11-11T10:55:00+07:00",
    paxCount: 25, vehiclesNeeded: 5, status: "waiting", waitMinutes: 23, note: "Chờ đủ 5 xe sẵn sàng"
  },
  {
    id: "q-3", orderId: "ord-1", orderCode: "DH-261111-001", customerName: "Nguyễn Thị Hồng",
    phoneMasked: "090*****56", queueNumber: 100, arrivedAt: "2026-11-11T10:10:00+07:00",
    paxCount: 4, vehiclesNeeded: 1, status: "assigned", waitMinutes: 0, note: null
  }
];

export const demoTrips: Trip[] = [
  {
    id: "trip-1", orderId: "ord-1", orderCode: "DH-261111-001", vehicleId: "veh-1", vehicleCode: "XD-01",
    driverId: "emp-driver-1", driverName: "Trần Văn Hùng", status: "in_progress",
    assignedAt: "2026-11-11T10:25:00+07:00", startedAt: "2026-11-11T10:30:00+07:00", endedAt: null
  }
];

export const demoPayments: Payment[] = [
  { id: "pay-1", paymentCode: "TT-001", orderId: "ord-1", orderCode: "DH-261111-001", customerName: "Nguyễn Thị Hồng", amount: 480000, methodName: "Tiền mặt", direction: "collection", status: "confirmed", reconciliationStatus: "pending", paidAt: "2026-11-11T08:05:00+07:00" },
  { id: "pay-2", paymentCode: "TT-002", orderId: "ord-2", orderCode: "DH-261111-002", customerName: "Phạm Minh Tuấn", amount: 120000, methodName: "Chuyển khoản/QR", direction: "collection", status: "confirmed", reconciliationStatus: "pending", paidAt: "2026-11-11T09:15:00+07:00" }
];

export function buildDemoDashboard(): DashboardSummary {
  const revenueCollected = demoPayments
    .filter((p) => p.direction === "collection" && p.status === "confirmed")
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    periodLabel: "Hôm nay — 11/11/2026 (DỮ LIỆU DEMO)",
    revenueCollected,
    ordersCount: demoOrders.length,
    customersCount: demoCustomers.length,
    activeVehicles: demoVehicles.filter((v) => v.status === "in_trip" || v.status === "ready").length,
    waitingCustomers: demoQueue.filter((q) => q.status === "waiting").length,
    alertsCount: 2,
    revenueTrend: [
      { date: "05/11", revenue: 1250000 },
      { date: "06/11", revenue: 980000 },
      { date: "07/11", revenue: 1420000 },
      { date: "08/11", revenue: 1100000 },
      { date: "09/11", revenue: 1760000 },
      { date: "10/11", revenue: 1530000 },
      { date: "11/11", revenue: revenueCollected }
    ],
    sourceBreakdown: [
      { name: "Cộng tác viên", value: 1 },
      { name: "TikTok", value: 1 },
      { name: "Khách đoàn", value: 1 },
      { name: "Khách tự đến", value: 1 }
    ],
    alerts: [
      { id: "al-1", kind: "queue", message: "Đơn DH-261111-002 đã chờ 38 phút — vượt ngưỡng cấu hình (20 phút)", severity: "warning" },
      { id: "al-2", kind: "vehicle", message: "Xe XD-03 đang bảo trì quá 10 ngày — cần kiểm tra lại tiến độ", severity: "error" }
    ],
    recentActivity: [
      { id: "ac-1", at: "11:02", actor: "Lê Thị Quầy", content: "Tạo đơn DH-261111-004 cho khách Hoàng Thị Mai", status: "Nháp" },
      { id: "ac-2", at: "10:55", actor: "Hệ thống", content: "Đơn DH-261111-003 vào hàng chờ, số thứ tự 102", status: "Đang chờ" },
      { id: "ac-3", at: "10:30", actor: "Nguyễn Văn Điều phối", content: "Bắt đầu chuyến cho đơn DH-261111-001 bằng xe XD-01", status: "Đang chạy" }
    ]
  };
}
