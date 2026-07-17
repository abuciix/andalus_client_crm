"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser, requireStaff } from "@/lib/session";
import { createPermitTask, toggleChecklistItem, setApprovalStatus } from "@/lib/data/tasks";
import { redirect } from "next/navigation";

export async function createPermitTaskAction(projectId: string, formData: FormData) {
  const session = await requireStaff();
  const title = formData.get("title") as string;
  const startDateRaw = formData.get("startDate") as string;
  const dueDateRaw = formData.get("dueDate") as string;

  if (!title) return { error: "Please enter a task title." };

  await createPermitTask(session, {
    projectId,
    title,
    startDate: startDateRaw ? new Date(startDateRaw) : undefined,
    dueDate: dueDateRaw ? new Date(dueDateRaw) : undefined,
  });
  revalidatePath(`/staff/projects/${projectId}/tasks`);
}

export async function toggleChecklistItemAction(itemId: string, projectId: string, taskId: string) {
  const session = await requireStaff();
  await toggleChecklistItem(session, itemId);
  revalidatePath(`/staff/projects/${projectId}/tasks/${taskId}`);
}

export async function setApprovalStatusAction(
  taskId: string,
  projectId: string,
  status: "APPROVED" | "CHANGES_REQUESTED"
) {
  const session = await getSessionUser();
  if (!session) redirect("/login");
  await setApprovalStatus(session, taskId, status);
  revalidatePath(`/portal/projects/${projectId}`);
  revalidatePath(`/staff/projects/${projectId}`);
}
