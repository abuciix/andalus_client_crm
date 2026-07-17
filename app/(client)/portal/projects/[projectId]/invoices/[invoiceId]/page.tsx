import { notFound } from "next/navigation";
import { requireClient } from "@/lib/session";
import { getInvoice } from "@/lib/data/invoices";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import { InvoiceDetail } from "@/components/invoices/InvoiceDetail";
import { toClientInvoiceView } from "@/lib/data/mappers/invoice";

export default async function ClientInvoiceDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; invoiceId: string }>;
}) {
  const { projectId, invoiceId } = await params;
  const session = await requireClient();

  let invoice;
  try {
    const raw = await getInvoice(invoiceId, session);
    invoice = toClientInvoiceView(raw);
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ForbiddenError) notFound();
    throw error;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Invoice detail</h1>
      <InvoiceDetail invoice={invoice} projectId={projectId} role="CLIENT" />
    </div>
  );
}
