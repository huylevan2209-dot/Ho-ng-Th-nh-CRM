import { Topbar } from "@/components/topbar";
import { Card, DemoNotice, KpiCard } from "@/components/ui";
import { getDashboardSummary } from "@/lib/data/dashboard";
import { getDataMode } from "@/lib/data/mode";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

function formatVnd(amount: number) {
  return amount.toLocaleString("vi-VN") + " đ";
}

export default async function DashboardPage() {
  const summary = await getDashboardSummary();
  const isDemo = getDataMode() === "demo";
  const maxRevenue = Math.max(...summary.revenueTrend.map((d) => d.revenue), 1);

  return (
    <>
      <Topbar title="Tổng quan hoạt động" description={summary.periodLabel} />
      <main className="flex-1 overflow-y-auto p-6">
        {isDemo && (
          <DemoNotice>
            Đang hiển thị DỮ LIỆU DEMO vì chưa cấu hình kết nối Supabase (xem file .env.example). Số liệu dưới đây
            không phải doanh thu thực tế.
          </DemoNotice>
        )}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <KpiCard label="Doanh thu thực thu" value={formatVnd(summary.revenueCollected)} hint="Trong kỳ đã chọn" />
          <KpiCard label="Số đơn" value={String(summary.ordersCount)} />
          <KpiCard label="Số khách" value={String(summary.customersCount)} />
          <KpiCard label="Xe đang hoạt động" value={String(summary.activeVehicles)} />
          <KpiCard label="Khách đang chờ" value={String(summary.waitingCustomers)} tone="warning" />
          <KpiCard label="Cảnh báo cần xử lý" value={String(summary.alertsCount)} tone="danger" />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-ht-text">Xu hướng doanh thu theo ngày</h2>
              <Link href="/tai-chinh" className="flex items-center gap-1 text-sm text-ht-teal hover:underline">
                Xem chi tiết đối soát <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex h-48 items-end gap-3">
              {summary.revenueTrend.map((d) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-ht-teal/80"
                    style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 4)}%` }}
                    title={formatVnd(d.revenue)}
                  />
                  <span className="text-xs text-ht-muted">{d.date}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-medium text-ht-text">Tỷ trọng nguồn khách</h2>
            <ul className="space-y-3">
              {summary.sourceBreakdown.map((s) => {
                const total = summary.sourceBreakdown.reduce((sum, x) => sum + x.value, 0) || 1;
                const pct = Math.round((s.value / total) * 100);
                return (
                  <li key={s.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-ht-text">{s.name}</span>
                      <span className="text-ht-muted">{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-ht-bg">
                      <div className="h-1.5 rounded-full bg-ht-navy" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <Card>
            <h2 className="mb-3 flex items-center gap-2 font-medium text-ht-text">
              <AlertTriangle size={16} className="text-ht-amber" /> Cảnh báo cần xử lý
            </h2>
            <ul className="space-y-2">
              {summary.alerts.map((a) => (
                <li
                  key={a.id}
                  className={`rounded-md border px-3 py-2 text-sm ${
                    a.severity === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {a.message}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="mb-3 font-medium text-ht-text">Hoạt động gần đây</h2>
            <ul className="space-y-3">
              {summary.recentActivity.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <span className="font-medium text-ht-text">{a.actor}</span>
                    <span className="text-ht-muted"> — {a.content}</span>
                  </div>
                  <div className="shrink-0 text-right text-xs text-ht-muted">
                    {a.at}
                    <div>{a.status}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </main>
    </>
  );
}
