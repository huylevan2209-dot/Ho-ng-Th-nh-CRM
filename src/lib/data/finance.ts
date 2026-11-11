import { getDataMode } from "./mode";
import { demoOrders, demoPayments } from "../demo-data";
import type { Payment } from "../types";

export async function listPayments(): Promise<Payment[]> {
  if (getDataMode() === "demo") return demoPayments;
  throw new Error("Chưa triển khai truy vấn Supabase cho thanh toán.");
}

export interface ReconciliationSummary {
  totalOrderValue: number;
  totalCollected: number;
  totalRefunded: number;
  difference: number;
  pendingCount: number;
}

export async function getReconciliationSummary(): Promise<ReconciliationSummary> {
  if (getDataMode() === "demo") {
    const totalOrderValue = demoOrders.reduce((s, o) => s + o.totalAmount, 0);
    const totalCollected = demoPayments
      .filter((p) => p.direction === "collection" && p.status === "confirmed")
      .reduce((s, p) => s + p.amount, 0);
    const totalRefunded = demoPayments
      .filter((p) => p.direction === "refund" && p.status === "confirmed")
      .reduce((s, p) => s + p.amount, 0);
    return {
      totalOrderValue,
      totalCollected,
      totalRefunded,
      difference: totalOrderValue - totalCollected + totalRefunded,
      pendingCount: demoPayments.filter((p) => p.reconciliationStatus === "pending").length
    };
  }
  throw new Error("Chưa triển khai truy vấn Supabase cho đối soát.");
}
