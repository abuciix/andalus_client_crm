import "server-only";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { SessionUser } from "@/lib/session";
import { notifyWhatsApp } from "@/lib/adapters/whatsapp";

async function assertProjectAccess(projectId: string, session: SessionUser) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError();
  if (session.role === "CLIENT" && project.clientId !== session.id) {
    throw new ForbiddenError();
  }
  return project;
}

export async function listMessages(projectId: string, session: SessionUser) {
  await assertProjectAccess(projectId, session);
  return prisma.message.findMany({
    where: { projectId },
    include: { sender: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function postMessage(session: SessionUser, params: { projectId: string; body: string }) {
  const project = await assertProjectAccess(params.projectId, session);

  const message = await prisma.message.create({
    data: { projectId: params.projectId, senderId: session.id, body: params.body },
    include: { sender: true },
  });

  const notifyUserId = session.role === "STAFF" ? project.clientId : project.staffId;
  if (notifyUserId) {
    await notifyWhatsApp(notifyUserId, `New message on "${project.title}": ${params.body.slice(0, 80)}`);
  }

  return message;
}
