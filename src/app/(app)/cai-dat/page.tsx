import { Topbar } from "@/components/topbar";
import { Card, DemoNotice } from "@/components/ui";
import { demoCustomerSources } from "@/lib/demo-data";
import { getDataMode } from "@/lib/data/mode";

const ROLES = [
  "Quản trị hệ thống",
  "Ban lãnh đạo / Quản lý",
  "Quầy vé",
  "Điều phối",
  "Tài xế",
  "Marketing / CTV nội bộ",
  "Kế toán",
  "Nhân sự"
];

export default function SettingsPage() {
  const isDemo = getDataMode() === "demo";

  return (
    <>
      <Topbar title="Cài đặt & Phân quyền" description="Tài khoản, vai trò và danh mục cấu hình" />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && (
          <DemoNotice>
            DỮ LIỆU DEMO. Vai trò dưới đây là bộ gợi ý ban đầu (mục 9 của tài liệu nghiệp vụ) — có thể chỉnh sửa theo
            tổ chức thực tế. Mọi kiểm tra quyền thật phải thực hiện ở server/RLS, không chỉ ẩn menu ở giao diện.
          </DemoNotice>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 font-medium text-ht-text">Vai trò gợi ý ban đầu</h2>
            <ul className="space-y-2">
              {ROLES.map((r) => (
                <li key={r} className="flex items-center justify-between rounded-md border border-ht-line px-3 py-2 text-sm">
                  {r}
                  <button className="text-xs text-ht-teal hover:underline">Sửa quyền</button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="mb-3 font-medium text-ht-text">Danh mục nguồn khách</h2>
            <ul className="space-y-2">
              {demoCustomerSources.map((s) => (
                <li key={s.id} className="flex items-center justify-between rounded-md border border-ht-line px-3 py-2 text-sm">
                  {s.name}
                  <span className="text-xs text-ht-muted">{s.code}</span>
                </li>
              ))}
            </ul>
            <button className="focus-ring mt-3 w-full rounded-md border border-dashed border-ht-line py-2 text-sm text-ht-muted hover:bg-ht-bg">
              + Thêm nguồn khách
            </button>
          </Card>

          <Card className="lg:col-span-2">
            <h2 className="mb-3 font-medium text-ht-text">Thông số vận hành cần xác nhận</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ht-line text-left text-xs text-ht-muted">
                  <th className="pb-2 font-medium">Thông số</th>
                  <th className="pb-2 font-medium">Giá trị hiện tại</th>
                  <th className="pb-2 font-medium">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ht-line">
                <tr>
                  <td className="py-2.5">Ngưỡng cảnh báo khách chờ lâu</td>
                  <td className="py-2.5">{process.env.NEXT_PUBLIC_QUEUE_WARNING_MINUTES ?? 20} phút</td>
                  <td className="py-2.5 text-ht-amber">Giá trị tạm, cần xác nhận</td>
                </tr>
                <tr>
                  <td className="py-2.5">Đơn giá vé / dịch vụ</td>
                  <td className="py-2.5">—</td>
                  <td className="py-2.5 text-ht-red">Chưa thiết lập</td>
                </tr>
                <tr>
                  <td className="py-2.5">Hoa hồng CTV</td>
                  <td className="py-2.5">—</td>
                  <td className="py-2.5 text-ht-red">Chưa thiết lập</td>
                </tr>
                <tr>
                  <td className="py-2.5">Sức chứa mỗi xe</td>
                  <td className="py-2.5">—</td>
                  <td className="py-2.5 text-ht-red">Chưa thiết lập</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </main>
    </>
  );
}
