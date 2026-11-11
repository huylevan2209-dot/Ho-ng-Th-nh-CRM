import { getDataMode } from "./mode";
import { buildDemoDashboard } from "../demo-data";
import type { DashboardSummary } from "../types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (getDataMode() === "demo") {
    return buildDemoDashboard();
  }
  // TODO (khi có Supabase thật): tổng hợp từ payments/orders/queue_entries/vehicles
  // bằng view hoặc RPC Postgres, không tính lại thủ công ở client.
  throw new Error("Chưa triển khai truy vấn Supabase cho dashboard.");
}
