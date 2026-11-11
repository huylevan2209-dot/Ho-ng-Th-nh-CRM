import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Marketing & Cộng tác viên" description="Chiến dịch, CTV và tỷ lệ chuyển đổi" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Marketing & Cộng tác viên" />
      </main>
    </>
  );
}
