import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { Role } from "@/app/generated/prisma/client";

export type SessionUser = {
  id: string;
  role: Role;
  name: string;
  email: string;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session.user;
}

export async function requireStaff(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== "STAFF") redirect("/login");
  return user;
}

export async function requireClient(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user || user.role !== "CLIENT") redirect("/login");
  return user;
}
