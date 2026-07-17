import type { Invoice } from "@/app/generated/prisma/client";
import { convertEtbToUsd } from "@/lib/adapters/fx";

export function toClientInvoiceView(inv: Invoice) {
  return {
    id: inv.id,
    amountEtb: inv.amountEtb,
    amountUsd: convertEtbToUsd(inv.amountEtb),
    status: inv.status,
    dueDate: inv.dueDate,
    paymentMethod: inv.paymentMethod,
    hasPaymentProof: Boolean(inv.paymentProofKey),
    // deliberately omitted: paymentProofKey (raw), verifiedById
  };
}

export function toStaffInvoiceView(inv: Invoice) {
  return {
    ...inv,
    amountUsd: convertEtbToUsd(inv.amountEtb),
  };
}
