"use client";

import { useTransition } from "react";
import { verifyInvoiceAction } from "@/lib/actions/invoices";

export function VerifyInvoiceButton({ invoiceId, projectId }: { invoiceId: string; projectId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => verifyInvoiceAction(invoiceId, projectId))}
      className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
    >
      {isPending ? "…" : "Verify payment"}
    </button>
  );
}
