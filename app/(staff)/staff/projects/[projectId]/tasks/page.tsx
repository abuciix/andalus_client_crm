import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/session";
import { getStaffProject } from "@/lib/data/projects";
import { NotFoundError } from "@/lib/errors";
import { KiremtWarningBadge } from "@/components/kiremt/KiremtWarningBadge";
import { CreatePermitTaskForm } from "./CreatePermitTaskForm";

export default async function StaffTasksPage({
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
    <div className="max-w-3xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Tasks — {project.title}</h1>

      <div className="mb-8">
        <CreatePermitTaskForm projectId={project.id} />
      </div>

      <div className="flex flex-col divide-y divide-line border-y border-line">
        {project.tasks.length === 0 && <p className="py-4 text-sm text-muted">No tasks yet.</p>}
        {project.tasks.map((task) => (
          <Link
            key={task.id}
            href={`/staff/projects/${project.id}/tasks/${task.id}`}
            className="flex items-center justify-between py-3 hover:bg-black/[0.02]"
          >
            <div>
              <div className="font-medium text-sm">{task.title}</div>
              <div className="font-meta text-[10px] uppercase tracking-wide text-muted">
                {task.type} · {task.status}
              </div>
            </div>
            {task.overlapsKiremt && <KiremtWarningBadge />}
          </Link>
        ))}
      </div>
    </div>
  );
}
