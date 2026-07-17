"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/session";
import { postMessage } from "@/lib/data/messages";
import { redirect } from "next/navigation";

export async function postMessageAction(projectId: string, formData: FormData) {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  const body = (formData.get("body") as string)?.trim();
  if (!body) return { error: "Message cannot be empty." };

  await postMessage(session, { projectId, body });
  revalidatePath(`/portal/projects/${projectId}/chat`);
  revalidatePath(`/staff/projects/${projectId}`);
}
