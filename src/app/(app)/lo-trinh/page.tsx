import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Lộ trình triển khai" description="Các giai đoạn và công việc triển khai CRM" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Lộ trình triển khai" />
      </main>
    </>
  );
}
