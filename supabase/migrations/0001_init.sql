-- HOÀNG THÀNH CRM — Migration 0001: Khởi tạo lược đồ cơ sở dữ liệu
-- Ghi chú: Các giá trị nghiệp vụ (giá vé, hoa hồng, ngưỡng cảnh báo, sức chứa xe...)
-- KHÔNG được đặt cứng trong migration này. Chúng nằm ở bảng system_settings /
-- price_catalog và phải được quản trị viên cấu hình sau khi triển khai.

create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- =========================================================================
-- 1. NGƯỜI DÙNG, VAI TRÒ, QUYỀN
-- =========================================================================

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text,
  status text not null default 'active' check (status in ('active', 'disabled')),
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table roles (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique, -- vd: admin, manager, counter, dispatcher, driver, marketing, accountant, hr
  name text not null,        -- tên hiển thị tiếng Việt
  description text,
  created_at timestamptz not null default now()
);

create table permissions (
  id uuid primary key default uuid_generate_v4(),
  module text not null,   -- vd: customers, queue, finance, vehicles...
  action text not null,   -- view, create, edit, approve, export, delete, disable
  unique (module, action)
);

create table role_permissions (
  role_id uuid not null references roles (id) on delete cascade,
  permission_id uuid not null references permissions (id) on delete cascade,
  primary key (role_id, permission_id)
);

create table user_roles (
  user_id uuid not null references profiles (id) on delete cascade,
  role_id uuid not null references roles (id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- =========================================================================
-- 2. DANH MỤC DÙNG CHUNG (cấu hình được, không hard-code)
-- =========================================================================

create table system_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references profiles (id),
  updated_at timestamptz not null default now()
);
comment on table system_settings is 'Cấu hình vận hành: ngưỡng cảnh báo hàng chờ, SLA sự cố, v.v. Giá trị khởi tạo phải được đánh dấu "Cần cấu hình" ở tầng ứng dụng, không set mặc định mang tính chính sách tại đây.';

create table customer_sources (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique, -- ctv, tiktok, walk_in, group, other...
  name text not null,
  is_active boolean not null default true
);

create table expense_categories (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true
);

create table payment_methods (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique, -- cash, transfer_qr, e_wallet, other
  name text not null,
  is_active boolean not null default true
);

-- =========================================================================
-- 3. KHÁCH HÀNG & BÁN VÉ
-- =========================================================================

create table customers (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  phone_last3 text generated always as (right(regexp_replace(phone, '\D', '', 'g'), 3)) stored,
  source_id uuid references customer_sources (id),
  referral_ctv_id uuid, -- fk thêm ở migration CTV bên dưới qua alter table
  note text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_customers_phone on customers (phone);
create index idx_customers_phone_last3 on customers (phone_last3);
create index idx_customers_full_name on customers using gin (to_tsvector('simple', full_name));

-- Cấu hình giá/dịch vụ — KHÔNG đặt giá mặc định thực tế, chỉ tạo khung quản trị
create table price_catalog (
  id uuid primary key default uuid_generate_v4(),
  service_name text not null,
  unit text not null, -- per_person | per_vehicle | per_package (cấu hình được)
  unit_price numeric(14, 2), -- null = "Chưa thiết lập"
  effective_from date,
  effective_to date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_code text not null unique,
  customer_id uuid not null references customers (id),
  status text not null default 'draft'
    check (status in ('draft', 'pending_confirmation', 'confirmed', 'completed', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'partial', 'paid', 'refund_pending', 'refunded')),
  reconciliation_status text not null default 'pending'
    check (reconciliation_status in ('pending', 'reconciled', 'flagged')),
  pax_count int not null default 1,
  vehicles_requested int,
  note text,
  total_amount numeric(14, 2) not null default 0,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_orders_customer on orders (customer_id);
create index idx_orders_code on orders (order_code);
create index idx_orders_status on orders (status);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  price_catalog_id uuid references price_catalog (id),
  description text not null,
  quantity numeric(10, 2) not null default 1,
  unit_price numeric(14, 2) not null,
  discount_amount numeric(14, 2) not null default 0,
  line_total numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

create table order_status_history (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references profiles (id),
  reason text,
  changed_at timestamptz not null default now()
);

-- =========================================================================
-- 4. MARKETING & CỘNG TÁC VIÊN
-- =========================================================================

create table campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  channel text,
  start_date date,
  end_date date,
  planned_budget numeric(14, 2),
  recorded_cost numeric(14, 2) not null default 0,
  goal text,
  status text not null default 'active' check (status in ('planning', 'active', 'ended')),
  note text,
  created_at timestamptz not null default now()
);

create table ctv_partners (
  id uuid primary key default uuid_generate_v4(),
  ctv_code text not null unique,
  full_name text not null,
  unit_name text,
  phone text,
  start_date date,
  status text not null default 'active' check (status in ('active', 'inactive')),
  note text,
  created_at timestamptz not null default now()
);

alter table customers
  add constraint fk_customers_ctv foreign key (referral_ctv_id) references ctv_partners (id);

create table referrals (
  id uuid primary key default uuid_generate_v4(),
  ctv_id uuid references ctv_partners (id),
  campaign_id uuid references campaigns (id),
  customer_id uuid not null references customers (id),
  order_id uuid references orders (id),
  referred_at timestamptz not null default now()
);
create index idx_referrals_ctv on referrals (ctv_id);
create index idx_referrals_campaign on referrals (campaign_id);

-- =========================================================================
-- 5. TÀI CHÍNH & ĐỐI SOÁT
-- =========================================================================

create table payments (
  id uuid primary key default uuid_generate_v4(),
  payment_code text not null unique,
  order_id uuid not null references orders (id),
  amount numeric(14, 2) not null,
  method_id uuid references payment_methods (id),
  direction text not null default 'collection' check (direction in ('collection', 'refund')),
  status text not null default 'confirmed' check (status in ('pending', 'confirmed', 'void')),
  reconciliation_status text not null default 'pending'
    check (reconciliation_status in ('pending', 'reconciled', 'flagged')),
  recorded_by uuid references profiles (id),
  reconciled_by uuid references profiles (id),
  reconciled_at timestamptz,
  note text,
  paid_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index idx_payments_order on payments (order_id);

create table expenses (
  id uuid primary key default uuid_generate_v4(),
  expense_date date not null,
  category_id uuid references expense_categories (id),
  content text not null,
  amount numeric(14, 2) not null,
  recorded_by uuid references profiles (id),
  approved_by uuid references profiles (id),
  status text not null default 'recorded' check (status in ('recorded', 'approved', 'rejected')),
  attachment_url text,
  note text,
  created_at timestamptz not null default now()
);

-- =========================================================================
-- 6. PHƯƠNG TIỆN
-- =========================================================================

create table vehicles (
  id uuid primary key default uuid_generate_v4(),
  vehicle_code text not null unique,
  vehicle_name text,
  capacity int, -- CẦN CẤU HÌNH theo thực tế, không mặc định
  status text not null default 'ready'
    check (status in ('ready', 'in_trip', 'maintenance', 'out_of_service')),
  current_driver_id uuid,
  note text,
  last_inspected_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table vehicle_inspections (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  inspected_by uuid references profiles (id),
  inspected_at timestamptz not null default now(),
  items_checked text,
  result text not null check (result in ('pass', 'fail')),
  follow_up_needed text
);

create table maintenance_records (
  id uuid primary key default uuid_generate_v4(),
  vehicle_id uuid not null references vehicles (id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  reason text not null,
  cost numeric(14, 2),
  performed_by text,
  note text
);

-- =========================================================================
-- 7. NHÂN SỰ & CA LÀM
-- =========================================================================

create table employees (
  id uuid primary key default uuid_generate_v4(),
  employee_code text not null unique,
  full_name text not null,
  phone text,
  position text, -- counter, dispatcher, driver, marketing, accountant, manager...
  department text,
  profile_id uuid references profiles (id),
  status text not null default 'active' check (status in ('active', 'on_leave', 'terminated')),
  created_at timestamptz not null default now()
);

-- xe->tài xế hiện tại, khai báo FK sau khi có bảng employees
alter table vehicles
  add constraint fk_vehicles_driver foreign key (current_driver_id) references employees (id);

create table shifts (
  id uuid primary key default uuid_generate_v4(),
  shift_name text not null,
  shift_date date not null,
  start_time time not null,
  end_time time not null,
  required_headcount int,
  lead_employee_id uuid references employees (id),
  created_at timestamptz not null default now()
);

create table shift_assignments (
  id uuid primary key default uuid_generate_v4(),
  shift_id uuid not null references shifts (id) on delete cascade,
  employee_id uuid not null references employees (id),
  assigned_by uuid references profiles (id),
  override_conflict boolean not null default false,
  override_reason text,
  created_at timestamptz not null default now(),
  unique (shift_id, employee_id)
);

create table attendance_records (
  id uuid primary key default uuid_generate_v4(),
  shift_assignment_id uuid not null references shift_assignments (id) on delete cascade,
  check_in_at timestamptz,
  check_out_at timestamptz,
  adjusted_by uuid references profiles (id),
  adjustment_note text
);

-- =========================================================================
-- 8. HÀNG CHỜ, ĐIỀU XE, CHUYẾN ĐI
-- =========================================================================

create table queue_entries (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders (id),
  queue_number serial,
  arrived_at timestamptz not null default now(),
  pax_count int not null,
  vehicles_needed int not null default 1,
  status text not null default 'waiting'
    check (status in ('waiting', 'ready', 'assigned', 'in_trip', 'completed', 'cancelled', 'no_show')),
  priority_changed_by uuid references profiles (id),
  priority_reason text,
  note text,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);
create index idx_queue_status on queue_entries (status);
create index idx_queue_arrived on queue_entries (arrived_at);

create table trips (
  id uuid primary key default uuid_generate_v4(),
  queue_entry_id uuid references queue_entries (id),
  order_id uuid not null references orders (id),
  vehicle_id uuid not null references vehicles (id),
  driver_id uuid references employees (id),
  assigned_by uuid references profiles (id),
  assigned_at timestamptz not null default now(),
  started_at timestamptz,
  ended_at timestamptz,
  actual_pax_count int,
  status text not null default 'assigned'
    check (status in ('assigned', 'boarding', 'in_progress', 'completed', 'cancelled')),
  note text,
  created_at timestamptz not null default now()
);
create index idx_trips_vehicle on trips (vehicle_id);
create index idx_trips_order on trips (order_id);

-- Ràng buộc nghiệp vụ "một xe không có 2 chuyến đang hoạt động cùng lúc"
-- được enforce ở tầng ứng dụng/transaction (kiểm tra trước khi insert) và bằng
-- một unique partial index chống chuyến trùng ở trạng thái đang hoạt động:
create unique index uq_trip_active_per_vehicle on trips (vehicle_id)
  where status in ('assigned', 'boarding', 'in_progress');

-- =========================================================================
-- 9. CHẤT LƯỢNG DỊCH VỤ
-- =========================================================================

create table feedback_incidents (
  id uuid primary key default uuid_generate_v4(),
  kind text not null check (kind in ('satisfaction', 'suggestion', 'complaint', 'vehicle_incident', 'service_incident')),
  customer_id uuid references customers (id),
  order_id uuid references orders (id),
  trip_id uuid references trips (id),
  severity text, -- cấu hình được
  description text not null,
  status text not null default 'new'
    check (status in ('new', 'in_progress', 'awaiting_reply', 'resolved', 'closed')),
  received_by uuid references profiles (id),
  assigned_to uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table incident_updates (
  id uuid primary key default uuid_generate_v4(),
  incident_id uuid not null references feedback_incidents (id) on delete cascade,
  update_text text not null,
  updated_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- =========================================================================
-- 10. NHẬT KÝ THAO TÁC
-- =========================================================================

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles (id),
  action text not null,
  entity_table text not null,
  entity_id uuid,
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_entity on audit_logs (entity_table, entity_id);

-- =========================================================================
-- 11. LỘ TRÌNH TRIỂN KHAI (dự án CRM, không thuộc luồng khách hàng)
-- =========================================================================

create table rollout_phases (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  owner_id uuid references profiles (id),
  start_date date,
  due_date date,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'done', 'blocked')),
  progress_percent int not null default 0 check (progress_percent between 0 and 100),
  note text
);

create table rollout_tasks (
  id uuid primary key default uuid_generate_v4(),
  phase_id uuid not null references rollout_phases (id) on delete cascade,
  title text not null,
  status text not null default 'not_started'
    check (status in ('not_started', 'in_progress', 'done', 'blocked')),
  due_date date,
  note text
);

-- =========================================================================
-- RLS — bật cho toàn bộ bảng nghiệp vụ. Policy chi tiết theo vai trò cần được
-- hoàn thiện cùng doanh nghiệp (xem README mục "Các giả định cần xác nhận").
-- Bên dưới là baseline: chỉ người dùng đã đăng nhập mới đọc được; ghi dữ liệu
-- tài chính/quyền hạn sẽ cần policy riêng theo role_permissions trước khi lên production.
-- =========================================================================

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'profiles','roles','permissions','role_permissions','user_roles',
      'system_settings','customer_sources','expense_categories','payment_methods',
      'customers','price_catalog','orders','order_items','order_status_history',
      'campaigns','ctv_partners','referrals',
      'payments','expenses',
      'vehicles','vehicle_inspections','maintenance_records',
      'employees','shifts','shift_assignments','attendance_records',
      'queue_entries','trips',
      'feedback_incidents','incident_updates',
      'audit_logs','rollout_phases','rollout_tasks'
    ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy %I on %I for select using (auth.role() = ''authenticated'');',
      t || '_select_authenticated', t
    );
  end loop;
end $$;

-- GHI CHÚ QUAN TRỌNG:
-- 1. Chưa tạo policy insert/update/delete theo vai trò cụ thể — PHẢI hoàn thiện
--    trước khi đưa vào production, dựa trên bảng role_permissions thực tế.
-- 2. Giá vé, hoa hồng CTV, sức chứa xe, ngưỡng cảnh báo hàng chờ, SLA sự cố đều
--    để trống/NULL — cần doanh nghiệp xác nhận và nhập qua màn hình Cài đặt.
-- 3. Không có dữ liệu mẫu (seed) nào được insert trong migration này; seed demo
--    nằm ở file riêng (xem supabase/seed_demo.sql trong README) để tách bạch
--    dữ liệu minh họa khỏi schema production.
