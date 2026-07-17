"use client";

import { useTransition } from "react";
import { setApprovalStatusAction } from "@/lib/actions/tasks";
import type { ApprovalStatus } from "@/app/generated/prisma/client";

const LABELS: Record<ApprovalStatus, string> = {
  NOT_REQUIRED: "No approval required",
  PENDING_CLIENT: "Pending your decision",
  APPROVED: "Approved",
  CHANGES_REQUESTED: "Changes requested",
};

export function ApprovalStatusControl({
  taskId,
  projectId,
  status,
  canDecide,
}: {
  taskId: string;
  projectId: string;
  status: ApprovalStatus;
  canDecide: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (status === "NOT_REQUIRED") return null;

  return (
    <div className="flex items-center gap-3">
      <span
        className={`font-meta text-[10px] uppercase tracking-wide border px-2 py-1 ${
          status === "PENDING_CLIENT"
            ? "border-amber-600 text-amber-700"
            : status === "APPROVED"
              ? "border-green-700 text-green-700"
              : "border-red-700 text-red-700"
        }`}
      >
        {LABELS[status]}
      </span>
      {canDecide && status === "PENDING_CLIENT" && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() => setApprovalStatusAction(taskId, projectId, "APPROVED"))
            }
            className="border border-foreground px-3 py-1 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              startTransition(() => setApprovalStatusAction(taskId, projectId, "CHANGES_REQUESTED"))
            }
            className="border border-line px-3 py-1 font-meta text-xs uppercase tracking-wide hover:border-foreground disabled:opacity-50"
          >
            Request changes
          </button>
        </div>
      )}
    </div>
  );
}
