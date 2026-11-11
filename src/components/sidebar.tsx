"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Users,
  Car,
  Megaphone,
  Wallet,
  UserCog,
  MessageSquareWarning,
  BarChart3,
  Settings,
  Bus,
  Workflow,
  Map
} from "lucide-react";

const NAV = [
  { href: "/", label: "Tổng quan", icon: LayoutDashboard, status: "core" as const },
  { href: "/khach-hang", label: "Khách hàng & Bán vé", icon: Users, status: "core" as const },
  { href: "/hang-cho", label: "Điều hành xe & Hàng chờ", icon: Car, status: "core" as const },
  { href: "/marketing", label: "Marketing & CTV", icon: Megaphone, status: "planned" as const },
  { href: "/tai-chinh", label: "Tài chính & Đối soát", icon: Wallet, status: "core" as const },
  { href: "/nhan-su", label: "Nhân sự & Ca làm", icon: UserCog, status: "planned" as const },
  { href: "/chat-luong", label: "Chất lượng dịch vụ", icon: MessageSquareWarning, status: "planned" as const },
  { href: "/bao-cao", label: "Báo cáo & Phân tích", icon: BarChart3, status: "planned" as const },
  { href: "/cai-dat", label: "Cài đặt & Phân quyền", icon: Settings, status: "core" as const },
  { href: "/phuong-tien", label: "Quản lý phương tiện", icon: Bus, status: "core" as const },
  { href: "/quy-trinh", label: "Quy trình vận hành", icon: Workflow, status: "planned" as const },
  { href: "/lo-trinh", label: "Lộ trình triển khai", icon: Map, status: "planned" as const }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-ht-navy text-white md:flex">
      <div className="px-5 py-6">
        <div className="text-lg font-semibold tracking-tight">HOÀNG THÀNH</div>
        <div className="text-xs text-white/60">CRM — Điều hành xe điện</div>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 pb-6">
        {NAV.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "focus-ring flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="flex items-center gap-2.5">
                <Icon size={17} strokeWidth={1.75} />
                {item.label}
              </span>
              {item.status === "planned" && (
                <span className="rounded-full bg-ht-amber/20 px-1.5 py-0.5 text-[10px] font-medium text-ht-amber">
                  Sắp có
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 px-5 py-4 text-[11px] text-white/50">
        Phiên bản cốt lõi — giai đoạn 1
      </div>
    </aside>
  );
}
