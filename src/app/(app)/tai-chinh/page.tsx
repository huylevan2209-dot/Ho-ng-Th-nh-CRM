import { Topbar } from "@/components/topbar";
import { Card, DemoNotice, StatusBadge } from "@/components/ui";
import { getReconciliationSummary, listPayments } from "@/lib/data/finance";
import { getDataMode } from "@/lib/data/mode";

function vnd(n: number) {
  return n.toLocaleString("vi-VN") + " đ";
}

export default async function FinancePage() {
  const [payments, recon] = await Promise.all([listPayments(), getReconciliationSummary()]);
  const isDemo = getDataMode() === "demo";

  return (
    <>
      <Topbar title="Tài chính & Đối soát" description="Giao dịch, chi phí và lợi nhuận tạm tính" />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && (
          <DemoNotice>
            DỮ LIỆU DEMO. "Lợi nhuận tạm tính" = doanh thu thực thu chưa hoàn − chi phí đã ghi nhận trong cùng kỳ;
            đây chưa chắc là lợi nhuận kế toán chính thức.
          </DemoNotice>
        )}

        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <span className="text-sm text-ht-muted">Tổng giá trị đơn</span>
            <p className="text-xl font-semibold text-ht-text">{vnd(recon.totalOrderValue)}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Đã thu</span>
            <p className="text-xl font-semibold text-ht-teal">{vnd(recon.totalCollected)}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Đã hoàn</span>
            <p className="text-xl font-semibold text-ht-red">{vnd(recon.totalRefunded)}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Chênh lệch cần kiểm tra</span>
            <p className="text-xl font-semibold text-ht-amber">{vnd(recon.difference)}</p>
          </Card>
        </div>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-medium text-ht-text">Giao dịch thanh toán</h2>
            <span className="text-xs text-ht-muted">{recon.pendingCount} giao dịch chưa đối soát</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ht-line text-left text-xs text-ht-muted">
                <th className="pb-2 font-medium">Mã giao dịch</th>
                <th className="pb-2 font-medium">Mã đơn</th>
                <th className="pb-2 font-medium">Khách hàng</th>
                <th className="pb-2 font-medium">Phương thức</th>
                <th className="pb-2 font-medium">Đối soát</th>
                <th className="pb-2 text-right font-medium">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ht-line">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-2.5 font-medium text-ht-text">{p.paymentCode}</td>
                  <td className="py-2.5">{p.orderCode}</td>
                  <td className="py-2.5">{p.customerName}</td>
                  <td className="py-2.5">{p.methodName}</td>
                  <td className="py-2.5">
                    <StatusBadge
                      label={p.reconciliationStatus === "pending" ? "Chưa đối soát" : "Đã đối soát"}
                      tone={p.reconciliationStatus === "pending" ? "amber" : "green"}
                    />
                  </td>
                  <td className="py-2.5 text-right">{vnd(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </>
  );
}
