import { Topbar } from "@/components/topbar";
import { Card, DemoNotice, StatusBadge } from "@/components/ui";
import { listCustomers } from "@/lib/data/customers";
import { listOrders } from "@/lib/data/orders";
import { getDataMode } from "@/lib/data/mode";
import { Plus } from "lucide-react";

const ORDER_STATUS_LABEL: Record<string, { label: string; tone: "green" | "amber" | "red" | "grey" | "blue" }> = {
  draft: { label: "Nháp", tone: "grey" },
  pending_confirmation: { label: "Chờ xác nhận", tone: "amber" },
  confirmed: { label: "Đã xác nhận", tone: "blue" },
  completed: { label: "Đã hoàn tất", tone: "green" },
  cancelled: { label: "Đã hủy", tone: "red" }
};

const PAYMENT_STATUS_LABEL: Record<string, { label: string; tone: "green" | "amber" | "red" | "grey" | "blue" }> = {
  unpaid: { label: "Chưa thanh toán", tone: "red" },
  partial: { label: "Thanh toán một phần", tone: "amber" },
  paid: { label: "Đã thanh toán", tone: "green" },
  refund_pending: { label: "Chờ hoàn", tone: "amber" },
  refunded: { label: "Đã hoàn", tone: "grey" }
};

export default async function CustomersPage() {
  const [customers, orders] = await Promise.all([listCustomers(), listOrders()]);
  const isDemo = getDataMode() === "demo";

  return (
    <>
      <Topbar title="Khách hàng & Bán vé" description="Tra cứu khách, tạo đơn, theo dõi thanh toán" />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && (
          <DemoNotice>
            DỮ LIỆU DEMO. Tìm kiếm phía dưới minh họa tra cứu theo họ tên, số điện thoại đầy đủ hoặc 3 số cuối —
            logic thật cần kiểm tra quyền xem số điện thoại trước khi trả kết quả.
          </DemoNotice>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <Card className="xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-ht-text">Khách hàng ({customers.length})</h2>
              <button className="focus-ring flex items-center gap-1.5 rounded-md bg-ht-teal px-3 py-1.5 text-sm font-medium text-white hover:bg-ht-teal/90">
                <Plus size={15} /> Thêm khách
              </button>
            </div>
            <input
              className="focus-ring mb-3 w-full rounded-md border border-ht-line px-3 py-2 text-sm"
              placeholder="Tìm theo tên, SĐT đầy đủ hoặc 3 số cuối…"
            />
            <div className="divide-y divide-ht-line">
              {customers.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-ht-text">{c.fullName}</p>
                    <p className="text-xs text-ht-muted">
                      {c.phone} · {c.sourceName}
                      {c.referralCtvName ? ` · CTV: ${c.referralCtvName}` : ""}
                    </p>
                  </div>
                  <span className="text-xs text-ht-muted">
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="xl:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-ht-text">Đơn / vé gần đây ({orders.length})</h2>
              <button className="focus-ring flex items-center gap-1.5 rounded-md border border-ht-line px-3 py-1.5 text-sm font-medium text-ht-text hover:bg-ht-bg">
                <Plus size={15} /> Tạo đơn
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ht-line text-left text-xs text-ht-muted">
                  <th className="pb-2 font-medium">Mã đơn</th>
                  <th className="pb-2 font-medium">Khách hàng</th>
                  <th className="pb-2 font-medium">Số khách</th>
                  <th className="pb-2 font-medium">Trạng thái đơn</th>
                  <th className="pb-2 font-medium">Thanh toán</th>
                  <th className="pb-2 text-right font-medium">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ht-line">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="py-2.5 font-medium text-ht-text">{o.orderCode}</td>
                    <td className="py-2.5">{o.customerName}</td>
                    <td className="py-2.5">{o.paxCount}</td>
                    <td className="py-2.5">
                      <StatusBadge {...ORDER_STATUS_LABEL[o.status]} />
                    </td>
                    <td className="py-2.5">
                      <StatusBadge {...PAYMENT_STATUS_LABEL[o.paymentStatus]} />
                    </td>
                    <td className="py-2.5 text-right">{o.totalAmount.toLocaleString("vi-VN")} đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </>
  );
}
