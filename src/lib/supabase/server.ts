import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Client phía server (Server Components / Route Handlers). Dùng khi đã có
// Supabase thật. Mọi logic phân quyền/tài chính quan trọng phải kiểm tra lại ở
// đây hoặc ở Postgres (RLS), không chỉ dựa vào kiểm tra tại giao diện.
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase chưa được cấu hình — đang ở chế độ demo.");
  }
  const cookieStore = cookies();
  return createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        /* set trong route handler/middleware khi cần */
      },
      remove() {
        /* tương tự set() */
      }
    }
  });
}
