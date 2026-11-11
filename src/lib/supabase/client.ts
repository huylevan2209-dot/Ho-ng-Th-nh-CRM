import { createBrowserClient } from "@supabase/ssr";

// Client phía trình duyệt. Chỉ tạo thật khi đã cấu hình env; nếu không, các màn
// hình phải tự chuyển sang gọi lớp src/lib/data/* (lớp này tự rơi về demo-data).
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase chưa được cấu hình — đang ở chế độ demo.");
  }
  return createBrowserClient(url, key);
}
