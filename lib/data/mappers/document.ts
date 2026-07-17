import type { Document } from "@/app/generated/prisma/client";

export function toClientDocumentView(d: Document) {
  return {
    id: d.id,
    type: d.type,
    version: d.version,
    status: d.status,
    fileName: d.fileName,
    createdAt: d.createdAt,
    // deliberately omitted: storageKey, uploadedById, verifiedById
  };
}

export function toStaffDocumentView(d: Document) {
  return d;
}
