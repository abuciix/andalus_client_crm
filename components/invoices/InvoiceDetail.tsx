import { VerifyInvoiceButton } from "./InvoiceActions";
import { PaymentInstructions } from "./PaymentInstructions";

type InvoiceItem = {
  id: string;
  amountEtb: number;
  amountUsd: number;
  status: string;
  dueDate: Date;
  paymentMethod: string | null;
  hasPaymentProof?: boolean;
  paymentProofKey?: string | null;
};

export function InvoiceDetail({
  invoice,
  projectId,
  role,
}: {
  invoice: InvoiceItem;
  projectId: string;
  role: "STAFF" | "CLIENT";
}) {
  const hasProof = invoice.hasPaymentProof ?? Boolean(invoice.paymentProofKey);

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-line p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-brand text-2xl font-semibold">
            {invoice.amountEtb.toLocaleString()} ETB
            <span className="font-meta text-sm text-muted ml-2">
              (~${invoice.amountUsd.toLocaleString()} USD)
            </span>
          </div>
          <span
            className={`font-meta text-[10px] uppercase tracking-wide border px-2 py-1 ${
              invoice.status === "VERIFIED"
                ? "border-green-700 text-green-700"
                : invoice.status === "OVERDUE"
                  ? "border-red-700 text-red-700"
                  : "border-line text-muted"
            }`}
          >
            {invoice.status.replace("_", " ")}
          </span>
        </div>
        <p className="text-sm text-muted">Due {new Date(invoice.dueDate).toLocaleDateString()}</p>
        {invoice.paymentMethod && (
          <p className="text-sm text-muted">Method: {invoice.paymentMethod}</p>
        )}
        {hasProof && (
          <a href={`/api/invoices/${invoice.id}/proof`} className="text-sm underline hover:text-foreground">
            View payment proof
          </a>
        )}
      </div>

      {role === "STAFF" && invoice.status === "PAYMENT_SUBMITTED" && (
        <VerifyInvoiceButton invoiceId={invoice.id} projectId={projectId} />
      )}

      {role === "CLIENT" && (invoice.status === "PENDING" || invoice.status === "OVERDUE") && (
        <PaymentInstructions invoiceId={invoice.id} projectId={projectId} />
      )}
    </div>
  );
}
