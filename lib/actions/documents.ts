"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { uploadDocument, verifyDocument } from "@/lib/data/documents";

export async function uploadDocumentAction(projectId: string, formData: FormData) {
  const session = await requireStaff();
  const type = formData.get("type") as string;
  const file = formData.get("file") as File;

  if (!type || !file || file.size === 0) {
    return { error: "Please select a document type and a file." };
  }

  await uploadDocument(session, { projectId, type, file });
  revalidatePath(`/staff/projects/${projectId}/documents`);
  revalidatePath(`/portal/projects/${projectId}/documents`);
}

export async function verifyDocumentAction(documentId: string, projectId: string) {
  const session = await requireStaff();
  await verifyDocument(documentId, session);
  revalidatePath(`/staff/projects/${projectId}/documents`);
  revalidatePath(`/portal/projects/${projectId}/documents`);
}
