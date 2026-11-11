import { Topbar } from "@/components/topbar";
import { Card, DemoNotice, StatusBadge } from "@/components/ui";
import { listQueue } from "@/lib/data/queue";
import { listAssignableVehicles } from "@/lib/data/vehicles";
import { getDataMode } from "@/lib/data/mode";

const QUEUE_WARNING_MINUTES = Number(process.env.NEXT_PUBLIC_QUEUE_WARNING_MINUTES ?? 20);

const QUEUE_STATUS_LABEL: Record<string, { label: string; tone: "green" | "amber" | "red" | "grey" | "blue" }> = {
  waiting: { label: "Đang chờ", tone: "amber" },
  ready: { label: "Sẵn sàng", tone: "blue" },
  assigned: { label: "Đã phân xe", tone: "blue" },
  in_trip: { label: "Đang chạy", tone: "green" },
  completed: { label: "Hoàn tất", tone: "grey" },
  cancelled: { label: "Đã hủy", tone: "red" },
  no_show: { label: "Không có mặt", tone: "red" }
};

export default async function QueuePage() {
  const [queue, assignableVehicles] = await Promise.all([listQueue(), listAssignableVehicles()]);
  const isDemo = getDataMode() === "demo";

  return (
    <>
      <Topbar
        title="Điều hành xe & Hàng chờ"
        description={`Ngưỡng cảnh báo chờ lâu hiện cấu hình: ${QUEUE_WARNING_MINUTES} phút`}
      />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && (
          <DemoNotice>
            DỮ LIỆU DEMO. Khi phân xe thật, chỉ các xe ở trạng thái "Sẵn sàng" mới được hiển thị để chọn, và hệ
            thống phải chặn một xe có 2 chuyến hoạt động cùng lúc (xem ràng buộc uq_trip_active_per_vehicle).
          </DemoNotice>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <h2 className="mb-4 font-medium text-ht-text">Hàng chờ (đến trước, phục vụ trước)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ht-line text-left text-xs text-ht-muted">
                  <th className="pb-2 font-medium">STT</th>
                  <th className="pb-2 font-medium">Mã đơn</th>
                  <th className="pb-2 font-medium">Khách</th>
                  <th className="pb-2 font-medium">Số khách / xe cần</th>
                  <th className="pb-2 font-medium">Thời gian chờ</th>
                  <th className="pb-2 font-medium">Trạng thái</th>
                  <th className="pb-2 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ht-line">
                {queue.map((q) => (
                  <tr key={q.id}>
                    <td className="py-2.5 font-medium text-ht-text">{q.queueNumber}</td>
                    <td className="py-2.5">{q.orderCode}</td>
                    <td className="py-2.5">
                      {q.customerName}
                      <div className="text-xs text-ht-muted">{q.phoneMasked}</div>
                    </td>
                    <td className="py-2.5">
                      {q.paxCount} khách / {q.vehiclesNeeded} xe
                    </td>
                    <td className="py-2.5">
                      <span className={q.waitMinutes >= QUEUE_WARNING_MINUTES ? "font-medium text-ht-red" : ""}>
                        {q.waitMinutes} phút
                      </span>
                    </td>
                    <td className="py-2.5">
                      <StatusBadge {...QUEUE_STATUS_LABEL[q.status]} />
                    </td>
                    <td className="py-2.5">
                      <button className="focus-ring rounded-md border border-ht-line px-2.5 py-1 text-xs font-medium text-ht-text hover:bg-ht-bg">
                        Phân xe
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card>
            <h2 className="mb-4 font-medium text-ht-text">Xe sẵn sàng để phân ({assignableVehicles.length})</h2>
            <ul className="space-y-2">
              {assignableVehicles.map((v) => (
                <li key={v.id} className="flex items-center justify-between rounded-md border border-ht-line px-3 py-2 text-sm">
                  <span className="font-medium text-ht-text">{v.vehicleCode}</span>
                  <StatusBadge label="Sẵn sàng" tone="green" />
                </li>
              ))}
              {assignableVehicles.length === 0 && (
                <p className="text-sm text-ht-muted">Hiện không có xe sẵn sàng.</p>
              )}
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
