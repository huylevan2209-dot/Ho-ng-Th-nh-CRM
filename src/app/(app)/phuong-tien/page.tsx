import { Topbar } from "@/components/topbar";
import { Card, DemoNotice, StatusBadge } from "@/components/ui";
import { listVehicles } from "@/lib/data/vehicles";
import { getDataMode } from "@/lib/data/mode";

const VEHICLE_STATUS_LABEL: Record<string, { label: string; tone: "green" | "amber" | "red" | "grey" | "blue" }> = {
  ready: { label: "Sẵn sàng", tone: "green" },
  in_trip: { label: "Đang chạy", tone: "blue" },
  maintenance: { label: "Bảo trì", tone: "amber" },
  out_of_service: { label: "Ngừng hoạt động", tone: "red" }
};

export default async function VehiclesPage() {
  const vehicles = await listVehicles();
  const isDemo = getDataMode() === "demo";
  const counts = vehicles.reduce(
    (acc, v) => ({ ...acc, [v.status]: (acc[v.status] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <>
      <Topbar title="Quản lý phương tiện" description="Trạng thái xe, kiểm tra và bảo trì" />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && <DemoNotice>DỮ LIỆU DEMO. Sức chứa xe (capacity) để trống vì chưa được doanh nghiệp cấu hình.</DemoNotice>}

        <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card>
            <span className="text-sm text-ht-muted">Sẵn sàng</span>
            <p className="text-2xl font-semibold text-ht-teal">{counts.ready ?? 0}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Đang chạy</span>
            <p className="text-2xl font-semibold text-blue-700">{counts.in_trip ?? 0}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Bảo trì</span>
            <p className="text-2xl font-semibold text-ht-amber">{counts.maintenance ?? 0}</p>
          </Card>
          <Card>
            <span className="text-sm text-ht-muted">Ngừng hoạt động</span>
            <p className="text-2xl font-semibold text-ht-red">{counts.out_of_service ?? 0}</p>
          </Card>
        </div>

        <Card>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ht-line text-left text-xs text-ht-muted">
                <th className="pb-2 font-medium">Mã xe</th>
                <th className="pb-2 font-medium">Tài xế hiện tại</th>
                <th className="pb-2 font-medium">Trạng thái</th>
                <th className="pb-2 font-medium">Sức chứa</th>
                <th className="pb-2 font-medium">Kiểm tra gần nhất</th>
                <th className="pb-2 font-medium">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ht-line">
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td className="py-2.5 font-medium text-ht-text">{v.vehicleCode}</td>
                  <td className="py-2.5">{v.currentDriverName ?? "—"}</td>
                  <td className="py-2.5">
                    <StatusBadge {...VEHICLE_STATUS_LABEL[v.status]} />
                  </td>
                  <td className="py-2.5 text-ht-muted">{v.capacity ?? "Chưa thiết lập"}</td>
                  <td className="py-2.5">
                    {v.lastInspectedAt ? new Date(v.lastInspectedAt).toLocaleDateString("vi-VN") : "—"}
                  </td>
                  <td className="py-2.5 text-ht-muted">{v.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </main>
    </>
  );
}
