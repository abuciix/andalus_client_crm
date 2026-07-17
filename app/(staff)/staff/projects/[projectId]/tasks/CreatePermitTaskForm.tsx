"use client";

import { useRef, useTransition } from "react";
import { createPermitTaskAction } from "@/lib/actions/tasks";

export function CreatePermitTaskForm({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await createPermitTaskAction(projectId, formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-end gap-3 border border-line p-4"
    >
      <div className="flex flex-col gap-1">
        <label className="font-meta text-xs uppercase tracking-wide text-muted">Title</label>
        <input name="title" required placeholder="e.g. MoUDI Submission" className="border border-line px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-meta text-xs uppercase tracking-wide text-muted">Start date</label>
        <input name="startDate" type="date" className="border border-line px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-meta text-xs uppercase tracking-wide text-muted">Due date</label>
        <input name="dueDate" type="date" className="border border-line px-3 py-2" />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {isPending ? "Creating…" : "Create permit task"}
      </button>
    </form>
  );
}
