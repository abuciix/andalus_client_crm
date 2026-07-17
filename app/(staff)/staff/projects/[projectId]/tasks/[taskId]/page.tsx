import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/session";
import { getTask } from "@/lib/data/tasks";
import { NotFoundError } from "@/lib/errors";
import { ChecklistEditor } from "@/components/tasks/ChecklistEditor";
import { ApprovalStatusControl } from "@/components/tasks/ApprovalStatusControl";
import { KiremtWarningBadge } from "@/components/kiremt/KiremtWarningBadge";
import { overlapsKiremt } from "@/lib/adapters/kiremt";

export default async function StaffTaskDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  const session = await requireStaff();

  let task;
  try {
    task = await getTask(taskId, session);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-1">
        <h1 className="font-brand text-2xl font-semibold">{task.title}</h1>
        {overlapsKiremt(task.startDate, task.dueDate) && <KiremtWarningBadge />}
      </div>
      <p className="font-meta text-xs uppercase tracking-wide text-muted mb-6">
        {task.type} · {task.status}
      </p>

      <div className="mb-6">
        <ApprovalStatusControl
          taskId={task.id}
          projectId={projectId}
          status={task.approvalStatus}
          canDecide={false}
        />
      </div>

      {task.checklistItems.length > 0 && (
        <div>
          <h2 className="font-meta text-xs uppercase tracking-widest text-muted mb-3">Checklist</h2>
          <ChecklistEditor
            items={task.checklistItems}
            projectId={projectId}
            taskId={task.id}
            editable={true}
          />
        </div>
      )}
    </div>
  );
}
