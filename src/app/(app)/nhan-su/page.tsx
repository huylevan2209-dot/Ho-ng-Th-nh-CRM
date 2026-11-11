import { Topbar } from "@/components/topbar";
import { PlannedModule } from "@/components/ui";

export default function Page() {
  return (
    <>
      <Topbar title="Nhân sự & Ca làm" description="Hồ sơ, ca làm, chấm công, phân công" />
      <main className="flex-1 overflow-y-auto p-6">
        <PlannedModule name="Nhân sự & Ca làm" />
      </main>
    </>
  );
}
