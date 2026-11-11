import clsx from "clsx";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={clsx("rounded-card border border-ht-line bg-ht-card p-5", className)}>{children}</div>;
}

export function KpiCard({
  label,
  value,
  hint,
  tone = "default"
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "warning" | "danger";
}) {
  return (
    <Card className="flex flex-col gap-1">
      <span className="text-sm text-ht-muted">{label}</span>
      <span
        className={clsx(
          "text-2xl font-semibold",
          tone === "warning" && "text-ht-amber",
          tone === "danger" && "text-ht-red",
          tone === "default" && "text-ht-text"
        )}
      >
        {value}
      </span>
      {hint && <span className="text-xs text-ht-muted">{hint}</span>}
    </Card>
  );
}

export function StatusBadge({ label, tone }: { label: string; tone: "green" | "amber" | "red" | "grey" | "blue" }) {
  const toneMap: Record<string, string> = {
    green: "bg-ht-tealSoft text-ht-teal",
    amber: "bg-amber-50 text-ht-amber",
    red: "bg-red-50 text-ht-red",
    grey: "bg-gray-100 text-ht-muted",
    blue: "bg-blue-50 text-blue-700"
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", toneMap[tone])}>
      {label}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-ht-line bg-ht-bg py-14 text-center">
      <p className="font-medium text-ht-text">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-ht-muted">{description}</p>
    </div>
  );
}

export function DemoNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 rounded-md border border-ht-amber/30 bg-amber-50 px-3 py-2 text-xs text-amber-800">
      {children}
    </div>
  );
}

export function PlannedModule({ name }: { name: string }) {
  return (
    <EmptyState
      title={`Phân hệ "${name}" thuộc giai đoạn mở rộng`}
      description="Đây chưa phải chức năng hoàn thiện — nền tảng dữ liệu (bảng, quan hệ) đã có sẵn trong migration, giao diện sẽ được xây sau khi phiên bản cốt lõi ổn định. Xem README mục Lộ trình triển khai."
    />
  );
}
