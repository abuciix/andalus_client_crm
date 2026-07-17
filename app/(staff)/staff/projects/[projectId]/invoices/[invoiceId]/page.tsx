import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/session";
import { getInvoice } from "@/lib/data/invoices";
import { NotFoundError } from "@/lib/errors";
import { InvoiceDetail } from "@/components/invoices/InvoiceDetail";
import { convertEtbToUsd } from "@/lib/adapters/fx";

export default async function StaffInvoiceDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; invoiceId: string }>;
}) {
  const { projectId, invoiceId } = await params;
  const session = await requireStaff();

  let invoice;
  try {
    invoice = await getInvoice(invoiceId, session);
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-brand text-2xl font-semibold mb-6">Invoice detail</h1>
      <InvoiceDetail
        invoice={{ ...invoice, amountUsd: convertEtbToUsd(invoice.amountEtb) }}
        projectId={projectId}
        role="STAFF"
      />
    </div>
  );
}
