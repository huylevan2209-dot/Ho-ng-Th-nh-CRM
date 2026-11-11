import { getDataMode } from "./mode";
import { demoCustomers } from "../demo-data";
import type { Customer } from "../types";

export async function listCustomers(search?: string): Promise<Customer[]> {
  if (getDataMode() === "demo") {
    if (!search) return demoCustomers;
    const q = search.trim().toLowerCase();
    const last3 = q.replace(/\D/g, "");
    return demoCustomers.filter((c) => {
      const matchesName = c.fullName.toLowerCase().includes(q);
      const matchesFullPhone = c.phone.includes(q);
      const matchesLast3 = last3.length === 3 && c.phone.endsWith(last3);
      return matchesName || matchesFullPhone || matchesLast3;
    });
  }
  // TODO: truy vấn bảng customers qua Supabase, dùng index phone_last3 cho tra
  // cứu 3 số cuối; áp dụng che số điện thoại theo quyền ở tầng server.
  throw new Error("Chưa triển khai truy vấn Supabase cho khách hàng.");
}
