import { Bell, ChevronDown, Search } from "lucide-react";

export function Topbar({ title, description }: { title: string; description?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-ht-line bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-ht-text">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-ht-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="focus-ring flex items-center gap-2 rounded-md border border-ht-line bg-ht-bg px-3 py-1.5 text-sm text-ht-muted">
          <Search size={15} />
          <span>Tìm mã đơn, khách, xe, CTV…</span>
        </div>
        <button className="focus-ring relative rounded-md p-2 text-ht-muted hover:bg-ht-bg" aria-label="Thông báo">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-ht-red" />
        </button>
        <button className="focus-ring flex items-center gap-2 rounded-md border border-ht-line px-2.5 py-1.5 text-sm">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ht-navy text-xs font-medium text-white">
            LQ
          </span>
          Lê Thị Quầy
          <ChevronDown size={14} />
        </button>
      </div>
    </header>
  );
}
