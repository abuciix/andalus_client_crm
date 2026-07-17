import "server-only";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/adapters/email";
import { notifyWhatsApp } from "@/lib/adapters/whatsapp";
import type { SessionUser } from "@/lib/session";
import { ForbiddenError } from "@/lib/errors";

export async function listUsers(session: SessionUser) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  return prisma.user.findMany({ orderBy: { createdAt: "desc" } });
}

export async function provisionClientAccount(params: {
  name: string;
  email: string;
  invitedById: string;
}) {
  const inviteToken = randomUUID();
  const user = await prisma.user.create({
    data: {
      role: "CLIENT",
      name: params.name,
      email: params.email,
      passwordHash: null,
      inviteToken,
      inviteStatus: "PENDING",
      invitedById: params.invitedById,
      invitedAt: new Date(),
    },
  });

  await sendInviteEmail({ email: user.email, name: user.name, inviteToken });
  await notifyWhatsApp(user.id, `Welcome to ANDALUS. Set up your account: /invite/${inviteToken}`);

  return user;
}

// Non-contract path: staff manually adding a client via the User Management screen.
export async function createClientAccount(
  session: SessionUser,
  params: { name: string; email: string }
) {
  if (session.role !== "STAFF") throw new ForbiddenError();
  return provisionClientAccount({ ...params, invitedById: session.id });
}

export async function acceptInvite(token: string, password: string) {
  const user = await prisma.user.findUnique({ where: { inviteToken: token } });
  if (!user || user.inviteStatus !== "PENDING") return null;

  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, inviteStatus: "ACCEPTED" },
  });
}

export async function getUserByInviteToken(token: string) {
  return prisma.user.findUnique({ where: { inviteToken: token } });
}
