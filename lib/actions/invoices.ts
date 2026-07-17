"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser, requireStaff } from "@/lib/session";
import { submitPaymentProof, verifyInvoice } from "@/lib/data/invoices";
import { redirect } from "next/navigation";

export async function submitPaymentProofAction(invoiceId: string, projectId: string, formData: FormData) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const paymentMethod = formData.get("paymentMethod") as string;
  const proofFile = formData.get("proofFile") as File;

  if (!paymentMethod || !proofFile || proofFile.size === 0) {
    return { error: "Please select a payment method and attach proof of payment." };
  }

  await submitPaymentProof(session, { invoiceId, paymentMethod, proofFile });
  revalidatePath(`/portal/projects/${projectId}/invoices`);
  revalidatePath(`/staff/projects/${projectId}/invoices`);
}

export async function verifyInvoiceAction(invoiceId: string, projectId: string) {
  const session = await requireStaff();
  await verifyInvoice(invoiceId, session);
  revalidatePath(`/staff/projects/${projectId}/invoices`);
  revalidatePath(`/portal/projects/${projectId}/invoices`);
}
