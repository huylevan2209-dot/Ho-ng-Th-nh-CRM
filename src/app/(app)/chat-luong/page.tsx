import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Chất lượng dịch vụ" description="Phản hồi, khiếu nại và sự cố" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Chất lượng dịch vụ" />
      </main>
    </>
  );
}
