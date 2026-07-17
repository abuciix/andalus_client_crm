import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StageBadge } from "@/components/projects/StageBadge";

export default async function StaffDashboardPage() {
  const [totalProjects, leadCount, activeInvoicesPending, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { stage: "LEAD" } }),
    prisma.invoice.count({ where: { status: "PENDING" } }),
    prisma.project.findMany({ orderBy: { updatedAt: "desc" }, take: 6 }),
  ]);

  const metrics = [
    { label: "Total projects", value: totalProjects },
    { label: "Open leads", value: leadCount },
    { label: "Invoices pending", value: activeInvoicesPending },
  ];

  return (
    <div>
      <h1 className="font-brand text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {metrics.map((m) => (
          <div key={m.label} className="border border-line p-5">
            <div className="font-meta text-xs uppercase tracking-wide text-muted mb-2">{m.label}</div>
            <div className="font-brand text-3xl font-semibold">{m.value}</div>
          </div>
        ))}
      </div>

      <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-4">Recent activity</h2>
      <div className="flex flex-col divide-y divide-line border-y border-line">
        {recentProjects.map((project) => (
          <Link
            key={project.id}
            href={`/staff/projects/${project.id}`}
            className="flex items-center justify-between py-4 hover:bg-black/[0.02]"
          >
            <div>
              <div className="font-medium">{project.title}</div>
              <div className="text-sm text-muted">{project.city}</div>
            </div>
            <StageBadge stage={project.stage} />
          </Link>
        ))}
      </div>
    </div>
  );
}
