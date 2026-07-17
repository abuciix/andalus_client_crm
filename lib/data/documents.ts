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

export async function getDocument(documentId: string, session: SessionUser) {
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) throw new NotFoundError();
  await assertProjectAccess(document.projectId, session);
  return document;
}

export async function uploadDocument(
  session: SessionUser,
  params: { projectId: string; type: string; file: File }
) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  await assertProjectAccess(params.projectId, session);

  const latest = await prisma.document.findFirst({
    where: { projectId: params.projectId, type: params.type },
    orderBy: { version: "desc" },
  });
  const nextVersion = (latest?.version ?? 0) + 1;

  const { storageKey } = await saveUploadedFile(params.file, params.projectId);

  return prisma.document.create({
    data: {
      projectId: params.projectId,
      type: params.type,
      version: nextVersion,
      status: "PENDING",
      fileName: params.file.name,
      storageKey,
      uploadedById: session.id,
    },
  });
}

export async function verifyDocument(documentId: string, session: SessionUser) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  const document = await prisma.document.findUnique({ where: { id: documentId } });
  if (!document) throw new NotFoundError();

  return prisma.document.update({
    where: { id: documentId },
    data: { status: "VERIFIED", verifiedById: session.id },
  });
}
