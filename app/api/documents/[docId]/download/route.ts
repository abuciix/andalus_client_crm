import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { getDocument } from "@/lib/data/documents";
import { readUploadedFile } from "@/lib/storage";
import { NotFoundError, ForbiddenError } from "@/lib/errors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;
  const session = await getSessionUser();
  if (!session) return new NextResponse(null, { status: 401 });

  try {
    const document = await getDocument(docId, session);
    const buffer = await readUploadedFile(document.storageKey);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${document.fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    if (error instanceof NotFoundError) return new NextResponse(null, { status: 404 });
    if (error instanceof ForbiddenError) return new NextResponse(null, { status: 403 });
    throw error;
  }
}
