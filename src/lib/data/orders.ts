import { getDataMode } from "./mode";
import { demoOrders } from "../demo-data";
import type { Order } from "../types";

export async function listOrders(): Promise<Order[]> {
  if (getDataMode() === "demo") return demoOrders;
  throw new Error("Chưa triển khai truy vấn Supabase cho đơn/vé.");
}
