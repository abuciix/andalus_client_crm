import "server-only";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { SessionUser } from "@/lib/session";
import { getChecklistForCity } from "@/lib/adapters/checklist-templates";

async function assertProjectAccess(projectId: string, session: SessionUser) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError();
  if (session.role === "CLIENT" && project.clientId !== session.id) {
    throw new ForbiddenError();
  }
  return project;
}

export async function getTask(taskId: string, session: SessionUser) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { checklistItems: { orderBy: { sortOrder: "asc" } } },
  });
  if (!task) throw new NotFoundError();
  await assertProjectAccess(task.projectId, session);
  return task;
}

export async function listTasks(projectId: string, session: SessionUser) {
  await assertProjectAccess(projectId, session);
  return prisma.task.findMany({
    where: { projectId },
    include: { checklistItems: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function createPermitTask(
  session: SessionUser,
  params: { projectId: string; title: string; startDate?: Date; dueDate?: Date }
) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  const project = await assertProjectAccess(params.projectId, session);

  const task = await prisma.task.create({
    data: {
      projectId: params.projectId,
      title: params.title,
      type: "PERMIT",
      assigneeId: session.id,
      startDate: params.startDate,
      dueDate: params.dueDate,
    },
  });

  const checklistItems = getChecklistForCity(project.city);
  await prisma.taskChecklistItem.createMany({
    data: checklistItems.map((item, index) => ({
      taskId: task.id,
      label: item.label,
      required: item.required,
      sortOrder: index,
    })),
  });

  return getTask(task.id, session);
}

export async function toggleChecklistItem(session: SessionUser, itemId: string) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  const item = await prisma.taskChecklistItem.findUnique({ where: { id: itemId } });
  if (!item) throw new NotFoundError();

  return prisma.taskChecklistItem.update({
    where: { id: itemId },
    data: item.done
      ? { done: false, completedAt: null, completedById: null }
      : { done: true, completedAt: new Date(), completedById: session.id },
  });
}

export async function setApprovalStatus(
  session: SessionUser,
  taskId: string,
  status: "APPROVED" | "CHANGES_REQUESTED"
) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new NotFoundError();
  const project = await assertProjectAccess(task.projectId, session);
  if (session.role === "CLIENT" && project.clientId !== session.id) throw new ForbiddenError();

  return prisma.task.update({ where: { id: taskId }, data: { approvalStatus: status } });
}
