import type { Task, TaskChecklistItem } from "@/app/generated/prisma/client";
import { overlapsKiremt } from "@/lib/adapters/kiremt";

type TaskWithChecklist = Task & { checklistItems: TaskChecklistItem[] };

export function toClientTaskView(t: TaskWithChecklist) {
  return {
    id: t.id,
    title: t.title,
    type: t.type,
    status: t.status,
    approvalStatus: t.approvalStatus,
    startDate: t.startDate,
    dueDate: t.dueDate,
    overlapsKiremt: overlapsKiremt(t.startDate, t.dueDate),
    checklistItems: t.checklistItems.map((c) => ({
      id: c.id,
      label: c.label,
      required: c.required,
      done: c.done,
    })),
    // deliberately omitted: assigneeId (internal staffing detail)
  };
}

export function toStaffTaskView(t: TaskWithChecklist) {
  return {
    ...t,
    overlapsKiremt: overlapsKiremt(t.startDate, t.dueDate),
  };
}
