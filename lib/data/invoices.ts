import "server-only";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { SessionUser } from "@/lib/session";
import { saveUploadedFile } from "@/lib/storage";

async function assertProjectAccess(projectId: string, session: SessionUser) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError();
  if (session.role === "CLIENT" && project.clientId !== session.id) {
    throw new ForbiddenError();
  }
  return project;
}

export async function getInvoice(invoiceId: string, session: SessionUser) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new NotFoundError();
  await assertProjectAccess(invoice.projectId, session);
  return invoice;
}

export async function submitPaymentProof(
  session: SessionUser,
  params: { invoiceId: string; paymentMethod: string; proofFile: File }
) {
  const invoice = await prisma.invoice.findUnique({ where: { id: params.invoiceId } });
  if (!invoice) throw new NotFoundError();
  const project = await assertProjectAccess(invoice.projectId, session);
  if (session.role === "CLIENT" && project.clientId !== session.id) throw new ForbiddenError();

  const { storageKey } = await saveUploadedFile(params.proofFile, `invoices/${invoice.projectId}`);

  return prisma.invoice.update({
    where: { id: params.invoiceId },
    data: {
      status: "PAYMENT_SUBMITTED",
      paymentMethod: params.paymentMethod,
      paymentProofKey: storageKey,
    },
  });
}

export async function verifyInvoice(invoiceId: string, session: SessionUser) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) throw new NotFoundError();

  return prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "VERIFIED", verifiedById: session.id },
  });
}
