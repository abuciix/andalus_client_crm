import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getInvoice } from "@/lib/data/invoices";
import { readUploadedFile } from "@/lib/storage";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ invoiceId: string }> }
) {
  const { invoiceId } = await params;
  const session = await getSessionUser();
  if (!session) return new NextResponse(null, { status: 401 });

  try {
    const invoice = await getInvoice(invoiceId, session);
    if (!invoice.paymentProofKey) return new NextResponse(null, { status: 404 });

    const buffer = await readUploadedFile(invoice.paymentProofKey);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="payment-proof-${invoice.id}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) return new NextResponse(null, { status: 404 });
    if (error instanceof ForbiddenError) return new NextResponse(null, { status: 403 });
    throw error;
  }
}
