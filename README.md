# HOÀNG THÀNH CRM — Hệ thống quản trị xe điện Hoàng Thành (Đại Nội Huế)

Trạng thái bàn giao: **nền tảng + luồng cốt lõi (giai đoạn 1)**. Đây là code nguồn thật,
không phải mô tả — nhưng được tạo trong môi trường không có kết nối internet, nên **chưa
được `npm install`, chưa build, chưa chạy thử và chưa kết nối Supabase thật**. Mục "Việc
cần làm trước khi dùng thật" bên dưới nêu rõ các bước còn thiếu.

## 1. Đã làm trong lần bàn giao này

- Lược đồ cơ sở dữ liệu đầy đủ cho cả 12 phân hệ: `supabase/migrations/0001_init.sql`
  (bảng, khóa ngoại, ràng buộc, index, RLS cơ bản). Không có giá vé/hoa hồng/sức chứa
  xe nào bị đặt cứng — tất cả để trống và đánh dấu "Chưa thiết lập".
- Khung ứng dụng Next.js (App Router + TypeScript + Tailwind): sidebar 12 phân hệ,
  topbar, design token theo đúng định hướng màu đã mô tả (sidebar xanh đậm, điểm nhấn
  xanh ngọc, cảnh báo vàng/đỏ).
- Lớp truy cập dữ liệu tách biệt (`src/lib/data/*`): mỗi hàm hiện đọc **DỮ LIỆU DEMO**
  (`src/lib/demo-data.ts`) và tự động chuyển sang gọi Supabase khi biến môi trường
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` được cấu hình — nhưng
  phần gọi Supabase thật chỉ có khung (`throw new Error("Chưa triển khai...")`), **chưa
  viết truy vấn thật**. Đây là điểm quan trọng nhất cần hoàn thiện tiếp.
- Giao diện đã có dữ liệu thật (không phải ảnh tĩnh) cho 5 phân hệ cốt lõi:
  Tổng quan, Khách hàng & Bán vé, Điều hành xe & Hàng chờ, Quản lý phương tiện,
  Tài chính & Đối soát, cùng Cài đặt (danh mục + vai trò gợi ý).
  7 phân hệ còn lại (Marketing/CTV, Nhân sự, Chất lượng dịch vụ, Báo cáo, Quy trình vận
  hành, Lộ trình triển khai) hiện là **trang giữ chỗ ghi rõ "thuộc giai đoạn mở rộng"**
  — không có nút nào tự nhận là "hoàn thành" khi chưa hoạt động, đúng yêu cầu của tài
  liệu nghiệp vụ.

## 2. Việc cần làm trước khi dùng thật (quan trọng)

1. `npm install` trong thư mục dự án (môi trường tạo file này không có mạng để làm
   bước này hoặc để chạy `next build`/`next dev` thử nghiệm).
2. Tạo project Supabase, chạy migration: `supabase db push` hoặc dán nội dung
   `supabase/migrations/0001_init.sql` vào SQL Editor.
3. Viết các câu lệnh Supabase thật thay cho `throw new Error(...)` trong
   `src/lib/data/*.ts` (dashboard, customers, orders, queue, vehicles, finance),
   và bổ sung các hàm ghi dữ liệu (tạo khách, tạo đơn, vào hàng chờ, phân xe, bắt đầu/
   kết thúc chuyến, ghi nhận thanh toán) — hiện mới có đọc (read), chưa có ghi (write).
4. Hoàn thiện RLS policy theo `role_permissions` thật (migration mới có policy đọc
   "authenticated" làm baseline, **chưa có policy ghi theo vai trò** — bắt buộc phải
   làm trước khi lên production).
5. Thiết lập xác thực (Supabase Auth), trang đăng nhập, middleware bảo vệ route.
6. Nhập các thông số cấu hình còn thiếu qua màn hình Cài đặt: đơn giá dịch vụ, hoa hồng
   CTV, sức chứa từng xe, ngưỡng cảnh báo hàng chờ, SLA sự cố.
7. Build các phân hệ còn ở dạng trang giữ chỗ, theo đúng thứ tự ưu tiên ở mục 4 dưới.

## 3. Các giả định cần doanh nghiệp xác nhận

- Công thức tỷ lệ chuyển đổi CTV (mặc định đề xuất: số khách có đơn / số khách được
  giới thiệu trong cùng kỳ) — cần xác nhận hoặc cấu hình công thức khác.
- Danh mục trạng thái đơn/thanh toán/sự cố trong migration là **tên gợi ý**, có thể đổi
  nhãn hiển thị miễn là giữ đúng ý nghĩa chuyển trạng thái.
- Ngưỡng cảnh báo chờ lâu tạm đặt 20 phút trong `.env.example`
  (`NEXT_PUBLIC_QUEUE_WARNING_MINUTES`) — chỉ là giá trị khởi tạo cho demo, cần quản lý
  xác nhận con số thật và chuyển vào bảng `system_settings`.
- Chi phí tham khảo ở lộ trình triển khai (20–25 triệu / 19–33 triệu / 850k–2,45 triệu
  mỗi tháng) là số liệu ước tính ban đầu, không phải báo giá — cần báo giá thực tế từ
  nhà cung cấp trước khi đưa vào hợp đồng.

## 4. Lộ trình đề xuất (theo đúng thứ tự ưu tiên của tài liệu gốc)

**Giai đoạn cốt lõi (đã có khung ở lần bàn giao này):** đăng nhập/phân quyền cơ bản,
khách hàng/bán vé, hàng chờ/điều xe, quản lý phương tiện, doanh thu/đối soát, dashboard
và báo cáo cơ bản, nhật ký thao tác, sao lưu.

**Mở rộng (sau khi cốt lõi ổn định):** Marketing/CTV nâng cao, Nhân sự/ca làm nâng cao,
Chất lượng dịch vụ và phân tích nâng cao, Lộ trình triển khai, báo cáo tùy chỉnh.

**Chỉ khi có yêu cầu + tích hợp rõ ràng:** GPS trực tiếp, thanh toán trực tuyến, AI,
tự động hóa phức tạp.

## 5. Chạy thử ở máy có mạng

```bash
npm install
cp .env.example .env.local   # để trống Supabase để chạy CHẾ ĐỘ DEMO trước
npm run dev
```

Mở `http://localhost:3000` — ứng dụng chạy ở chế độ demo (banner vàng "DỮ LIỆU DEMO"
hiển thị ở mỗi trang có dữ liệu minh họa). Khi đã điền `NEXT_PUBLIC_SUPABASE_URL` và
`NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env.local` **và** hoàn thiện bước 3 ở mục 2,
banner demo sẽ tự biến mất và ứng dụng đọc dữ liệu thật.

## 6. Cấu trúc thư mục

```
supabase/migrations/0001_init.sql   Lược đồ CSDL đầy đủ 12 phân hệ
src/lib/types.ts                    Kiểu dữ liệu dùng chung (demo ↔ Supabase)
src/lib/demo-data.ts                DỮ LIỆU DEMO — không dùng làm số liệu thật
src/lib/data/*.ts                   Lớp truy cập dữ liệu theo từng phân hệ
src/lib/supabase/*.ts               Khởi tạo Supabase client (browser/server)
src/components/*                    Sidebar, topbar, thẻ KPI, badge trạng thái
src/app/(app)/*/page.tsx            Giao diện từng phân hệ
```

## 7. Tính năng đã hoàn thiện / demo / còn thiếu (ghi theo đúng yêu cầu minh bạch)

| Phân hệ | Trạng thái |
|---|---|
| Tổng quan | Giao diện đầy đủ, dữ liệu demo |
| Khách hàng & Bán vé | Giao diện đọc + tìm kiếm, demo; **chưa có form ghi (tạo/sửa) nối thật** |
| Điều hành xe & Hàng chờ | Giao diện đọc, demo; **nút "Phân xe" chưa nối logic ghi** |
| Quản lý phương tiện | Giao diện đầy đủ, dữ liệu demo |
| Tài chính & Đối soát | Giao diện đọc, demo; **chưa có ghi nhận thanh toán/chi phí thật** |
| Cài đặt & Phân quyền | Danh mục + vai trò gợi ý, demo; **chưa có CRUD thật, chưa có RLS ghi** |
| Marketing/CTV, Nhân sự, Chất lượng dịch vụ, Báo cáo, Quy trình vận hành, Lộ trình | Trang giữ chỗ — **chưa xây dựng** |

Không có mục nào ở trên được gắn nhãn "hoàn thành" nếu chưa thực sự hoạt động.
