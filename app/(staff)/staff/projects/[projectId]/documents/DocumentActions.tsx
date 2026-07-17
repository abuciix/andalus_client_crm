"use client";

import { useRef, useTransition } from "react";
import { uploadDocumentAction, verifyDocumentAction } from "@/lib/actions/documents";

export function UploadDocumentForm({ projectId }: { projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={(formData) => {
        startTransition(async () => {
          await uploadDocumentAction(projectId, formData);
          formRef.current?.reset();
        });
      }}
      className="flex flex-wrap items-end gap-3 border border-line p-4"
    >
      <div className="flex flex-col gap-1">
        <label className="font-meta text-xs uppercase tracking-wide text-muted">Type</label>
        <input name="type" required placeholder="e.g. Site Survey" className="border border-line px-3 py-2" />
      </div>
      <div className="flex flex-col gap-1">
        <label className="font-meta text-xs uppercase tracking-wide text-muted">File</label>
        <input name="file" type="file" required className="text-sm" />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {isPending ? "Uploading…" : "Upload"}
      </button>
    </form>
  );
}

export function VerifyDocumentButton({ documentId, projectId }: { documentId: string; projectId: string }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => verifyDocumentAction(documentId, projectId))}
      className="font-meta text-xs uppercase tracking-wide border border-line px-2 py-1 hover:border-foreground disabled:opacity-50"
    >
      {isPending ? "…" : "Verify"}
    </button>
  );
}
