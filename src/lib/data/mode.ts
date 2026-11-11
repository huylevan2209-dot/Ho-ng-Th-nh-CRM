// Quyết định ứng dụng chạy ở CHẾ ĐỘ DEMO hay đọc/ghi Supabase thật.
// Quy tắc: nếu thiếu URL hoặc ANON KEY, luôn rơi về DEMO — không bao giờ giả vờ
// đã lưu vào hệ thống thật khi chưa có kết nối.
export function getDataMode(): "demo" | "supabase" {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return "demo";
  return "supabase";
}
