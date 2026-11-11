import { getDataMode } from "./mode";
import { demoVehicles } from "../demo-data";
import type { Vehicle } from "../types";

export async function listVehicles(): Promise<Vehicle[]> {
  if (getDataMode() === "demo") return demoVehicles;
  throw new Error("Chưa triển khai truy vấn Supabase cho phương tiện.");
}

// Chỉ xe ở trạng thái 'ready' mới được phép hiện trong danh sách phân xe —
// quy tắc này phải được lặp lại ở ràng buộc/CHECK phía server khi nối Supabase.
export async function listAssignableVehicles(): Promise<Vehicle[]> {
  const all = await listVehicles();
  return all.filter((v) => v.status === "ready");
}
