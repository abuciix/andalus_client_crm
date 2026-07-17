import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/session";
import { getClientProject } from "@/lib/data/projects";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export default async function ClientInvoicesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireClient();

  let project;
  try {
    project = await getClientProject(projectId, session);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) notFound();
    throw error;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Invoices — {project.title}</h1>
      <div className="flex flex-col divide-y divide-line border-y border-line">
        {project.invoices.length === 0 && <p className="py-4 text-sm text-muted">No invoices yet.</p>}
        {project.invoices.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/portal/projects/${project.id}/invoices/${invoice.id}`}
            className="flex items-center justify-between py-3 hover:bg-black/[0.02]"
          >
            <div>
              <div className="font-medium text-sm">
                {invoice.amountEtb.toLocaleString()} ETB
                <span className="text-muted"> (~${invoice.amountUsd.toLocaleString()})</span>
              </div>
              <div className="font-meta text-[10px] uppercase tracking-wide text-muted">
                Due {new Date(invoice.dueDate).toLocaleDateString()}
              </div>
            </div>
            <span className="font-meta text-[10px] uppercase tracking-wide text-muted">
              {invoice.status.replace("_", " ")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
