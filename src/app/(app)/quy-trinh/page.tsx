import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Quy trình vận hành" description="Sơ đồ 6 bước và trạng thái từng đơn" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Quy trình vận hành" />
      </main>
    </>
  );
}
