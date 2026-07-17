import "server-only";
import { prisma } from "@/lib/prisma";
import { NotFoundError, ForbiddenError } from "@/lib/errors";
import type { SessionUser } from "@/lib/session";
import type { ProjectStage } from "@/app/generated/prisma/client";
import {
  toClientProjectView,
  toStaffProjectView,
  type ProjectWithRelations,
} from "./mappers/project";
import { notifyWhatsApp } from "@/lib/adapters/whatsapp";
import { provisionClientAccount } from "./users";

const PROJECT_INCLUDE = {
  documents: { orderBy: { createdAt: "desc" as const } },
  invoices: { orderBy: { createdAt: "desc" as const } },
  tasks: { include: { checklistItems: { orderBy: { sortOrder: "asc" as const } } } },
  messages: { include: { sender: true }, orderBy: { createdAt: "asc" as const } },
};

async function fetchProject(projectId: string): Promise<ProjectWithRelations | null> {
  return prisma.project.findUnique({
    where: { id: projectId },
    include: PROJECT_INCLUDE,
  });
}

export async function getProject(projectId: string, session: SessionUser) {
  const project = await fetchProject(projectId);
  if (!project) throw new NotFoundError();

  if (session.role === "STAFF") {
    return toStaffProjectView(project);
  }
  if (project.clientId !== session.id) {
    throw new ForbiddenError();
  }
  return toClientProjectView(project);
}

// Staff-only pages call this instead of getProject to get a non-union return type —
// the caller has already asserted STAFF via requireStaff() before reaching here.
export async function getStaffProject(projectId: string, session: SessionUser) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  const project = await fetchProject(projectId);
  if (!project) throw new NotFoundError();
  return toStaffProjectView(project);
}

export async function getClientProject(projectId: string, session: SessionUser) {
  if (session.role !== "CLIENT") throw new ForbiddenError();
  const project = await fetchProject(projectId);
  if (!project) throw new NotFoundError();
  if (project.clientId !== session.id) throw new ForbiddenError();
  return toClientProjectView(project);
}

export async function listProjectsForSession(session: SessionUser) {
  if (session.role === "STAFF") {
    return prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  }
  return prisma.project.findMany({
    where: { clientId: session.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function listPublicProjects() {
  return prisma.project.findMany({
    where: { stage: { in: ["CONSTRUCTION", "COMPLETE"] } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPublicProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || !["CONSTRUCTION", "COMPLETE"].includes(project.stage)) {
    throw new NotFoundError();
  }
  return { id: project.id, title: project.title, city: project.city, stage: project.stage };
}

export async function createLeadFromContact(data: {
  name: string;
  email: string;
  phone?: string;
  city: string;
  message: string;
}) {
  return prisma.project.create({
    data: {
      stage: "LEAD",
      clientId: null,
      staffId: null,
      city: data.city,
      title: `Inquiry — ${data.name}`,
      contactName: data.name,
      contactEmail: data.email,
      contactPhone: data.phone ?? null,
      notes: data.message,
    },
  });
}

export async function updateProjectStage(
  projectId: string,
  newStage: ProjectStage,
  session: SessionUser
) {
  if (session.role !== "STAFF") throw new ForbiddenError();

  const project = await prisma.project.update({
    where: { id: projectId },
    data: { stage: newStage },
  });

  if (project.clientId) {
    await notifyWhatsApp(project.clientId, `Your project "${project.title}" moved to stage: ${newStage}`);
  }

  return project;
}

// Distinct from updateProjectStage — provisions a client account and invite.
// Idempotent: re-invoking after a project already has a client is a no-op.
export async function markContractSigned(projectId: string, session: SessionUser) {
  if (session.role !== "STAFF") throw new ForbiddenError();

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError();

  if (project.clientId) {
    return project;
  }
  if (!project.contactName || !project.contactEmail) {
    throw new Error("Project is missing contact info required to provision a client account.");
  }

  const client = await provisionClientAccount({
    name: project.contactName,
    email: project.contactEmail,
    invitedById: session.id,
  });

  return prisma.project.update({
    where: { id: projectId },
    data: { clientId: client.id, staffId: session.id, stage: "CONTRACT" },
  });
}
