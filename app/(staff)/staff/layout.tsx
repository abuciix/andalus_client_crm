import { requireStaff } from "@/lib/session";
import { StaffNav } from "@/components/layout/StaffNav";

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
  const session = await requireStaff();

  return (
    <div className="flex min-h-full flex-col">
      <StaffNav name={session.name} />
      <main className="flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
