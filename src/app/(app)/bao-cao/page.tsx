import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Báo cáo & Phân tích" description="Báo cáo tổng hợp theo kỳ, nguồn khách, CTV" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Báo cáo & Phân tích" />
      </main>
    </>
  );
}
