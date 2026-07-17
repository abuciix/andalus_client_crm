"use client";

import { useTransition } from "react";
import { markContractSignedAction } from "@/lib/actions/pipeline";

export function MarkContractSignedButton({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => markContractSignedAction(projectId))}
      className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
    >
      {isPending ? "Provisioning…" : "Mark Contract Signed"}
    </button>
  );
}
