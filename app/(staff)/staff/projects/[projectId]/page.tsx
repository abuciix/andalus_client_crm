import Link from "next/link";
import { notFound } from "next/navigation";
import { getStaffProject } from "@/lib/data/projects";
import { requireStaff } from "@/lib/session";
import { NotFoundError } from "@/lib/errors";
import { StageBadge } from "@/components/projects/StageBadge";
import { MessageThread } from "@/components/messages/MessageThread";
import { ApprovalStatusControl } from "@/components/tasks/ApprovalStatusControl";
import { KiremtWarningBadge } from "@/components/kiremt/KiremtWarningBadge";
import { MarkContractSignedButton } from "./MarkContractSignedButton";

export default async function StaffProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const session = await requireStaff();

  let project;
  try {
    project = await getStaffProject(projectId, session);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="font-meta text-xs uppercase tracking-wide text-muted mb-1">
            {project.city}
          </div>
          <h1 className="font-brand text-3xl font-semibold">{project.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <StageBadge stage={project.stage} />
          {!project.clientId && <MarkContractSignedButton projectId={project.id} />}
        </div>
      </div>

      <div className="flex gap-6 font-meta text-xs uppercase tracking-wide mt-6 mb-8 border-b border-line pb-4">
        <Link href={`/staff/projects/${project.id}/documents`} className="hover:underline">
          Documents ({project.documents.length})
        </Link>
        <Link href={`/staff/projects/${project.id}/tasks`} className="hover:underline">
          Tasks ({project.tasks.length})
        </Link>
        <Link href={`/staff/projects/${project.id}/invoices`} className="hover:underline">
          Invoices ({project.invoices.length})
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">
            Contact (internal)
          </h2>
          <dl className="text-sm flex flex-col gap-1">
            <div><dt className="inline text-muted">Name: </dt><dd className="inline">{project.contactName ?? "—"}</dd></div>
            <div><dt className="inline text-muted">Email: </dt><dd className="inline">{project.contactEmail ?? "—"}</dd></div>
            <div><dt className="inline text-muted">Phone: </dt><dd className="inline">{project.contactPhone ?? "—"}</dd></div>
          </dl>
        </div>
        <div>
          <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">
            Internal notes
          </h2>
          <p className="text-sm whitespace-pre-wrap">{project.notes || "—"}</p>
        </div>
      </div>

      {project.tasks.some((t) => t.approvalStatus !== "NOT_REQUIRED") && (
        <div className="mb-8">
          <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">Approvals</h2>
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
                    canDecide={false}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">Messages</h2>
        <MessageThread projectId={project.id} messages={project.messages} />
      </div>
    </div>
  );
}
