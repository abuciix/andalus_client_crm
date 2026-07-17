"use client";

import { useRef, useTransition } from "react";
import { submitPaymentProofAction } from "@/lib/actions/invoices";

export function PaymentInstructions({ invoiceId, projectId }: { invoiceId: string; projectId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <div className="border border-line p-4">
      <h3 className="font-medium mb-2">Payment instructions</h3>
      <ul className="text-sm text-muted mb-4 flex flex-col gap-1">
        <li>Telebirr: pay to short code 8206, reference this invoice ID.</li>
        <li>CBE Birr: pay to account 1000-XXXXXXX, reference this invoice ID.</li>
        <li>Bank transfer: Commercial Bank of Ethiopia, ANDALUS Architecture PLC.</li>
      </ul>
      <form
        ref={formRef}
        action={(formData) => {
          startTransition(async () => {
            await submitPaymentProofAction(invoiceId, projectId, formData);
            formRef.current?.reset();
          });
        }}
        className="flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="font-meta text-xs uppercase tracking-wide text-muted">Payment method</label>
          <select name="paymentMethod" required className="border border-line px-3 py-2">
            <option value="telebirr">Telebirr</option>
            <option value="cbe_birr">CBE Birr</option>
            <option value="bank_transfer">Bank transfer</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-meta text-xs uppercase tracking-wide text-muted">Proof of payment</label>
          <input name="proofFile" type="file" required className="text-sm" />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="border border-foreground px-4 py-2 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          {isPending ? "Submitting…" : "Submit payment"}
        </button>
      </form>
    </div>
  );
}
