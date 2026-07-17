import { requireClient } from "@/lib/session";
import { ClientNav } from "@/components/layout/ClientNav";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await requireClient();

  return (
    <div className="flex min-h-full flex-col">
      <ClientNav name={session.name} />
      <main className="flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
