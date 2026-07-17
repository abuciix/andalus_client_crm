import Link from "next/link";
import { notFound } from "next/navigation";
import { requireClient } from "@/lib/session";
import { getClientProject } from "@/lib/data/projects";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { StageBadge } from "@/components/projects/StageBadge";
import { ApprovalStatusControl } from "@/components/tasks/ApprovalStatusControl";
import { KiremtWarningBadge } from "@/components/kiremt/KiremtWarningBadge";

const STAGES = ["LEAD", "CONTRACT", "DESIGN", "PERMITTING", "CONSTRUCTION", "COMPLETE"] as const;

export default async function ClientProjectPage({
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

  const currentIndex = STAGES.indexOf(project.stage);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="font-meta text-xs uppercase tracking-wide text-muted mb-1">{project.city}</div>
          <h1 className="font-brand text-3xl font-semibold">{project.title}</h1>
        </div>
        <StageBadge stage={project.stage} />
      </div>

      <div className="flex items-center gap-1 mb-10">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex-1 flex flex-col items-center gap-1">
            <div className={`h-1.5 w-full ${i <= currentIndex ? "bg-foreground" : "bg-line"}`} />
            <span className="font-meta text-[9px] uppercase tracking-wide text-muted">{stage}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 font-meta text-xs uppercase tracking-wide mb-8 border-b border-line pb-4">
        <Link href={`/portal/projects/${project.id}/documents`} className="hover:underline">
          Documents ({project.documents.length})
        </Link>
        <Link href={`/portal/projects/${project.id}/chat`} className="hover:underline">
          Chat
        </Link>
        <Link href={`/portal/projects/${project.id}/invoices`} className="hover:underline">
          Invoices ({project.invoices.length})
        </Link>
      </div>

      {project.tasks.some((t) => t.approvalStatus !== "NOT_REQUIRED") && (
        <div>
          <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">
            Awaiting your decision
          </h2>
          <div className="flex flex-col gap-2">
            {project.tasks
              .filter((t) => t.approvalStatus !== "NOT_REQUIRED")
              .map((t) => (
                <div key={t.id} className="flex items-center justify-between border border-line p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.title}</span>
                    {t.overlapsKiremt && <KiremtWarningBadge />}
                  </div>
                  <ApprovalStatusControl
                    taskId={t.id}
                    projectId={project.id}
                    status={t.approvalStatus}
                    canDecide={true}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
