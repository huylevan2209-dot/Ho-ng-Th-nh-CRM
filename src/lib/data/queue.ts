import { getDataMode } from "./mode";
import { demoQueue } from "../demo-data";
import type { QueueEntry } from "../types";

export async function listQueue(): Promise<QueueEntry[]> {
  if (getDataMode() === "demo") {
    // sắp theo đến trước phục vụ trước, trừ khi có ưu tiên thủ công (không mô
    // phỏng ở demo) — việc đổi thứ tự thật phải ghi priority_changed_by/reason.
    return [...demoQueue].sort((a, b) => a.queueNumber - b.queueNumber);
  }
  throw new Error("Chưa triển khai truy vấn Supabase cho hàng chờ.");
}
