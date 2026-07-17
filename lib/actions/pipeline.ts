"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/session";
import { updateProjectStage, markContractSigned } from "@/lib/data/projects";
import type { ProjectStage } from "@/app/generated/prisma/client";

export async function changeStageAction(projectId: string, newStage: ProjectStage) {
  const session = await requireStaff();
  await updateProjectStage(projectId, newStage, session);
  revalidatePath("/staff/pipeline");
  revalidatePath(`/staff/projects/${projectId}`);
  revalidatePath("/portal");
}

export async function markContractSignedAction(projectId: string) {
  const session = await requireStaff();
  await markContractSigned(projectId, session);
  revalidatePath("/staff/pipeline");
  revalidatePath(`/staff/projects/${projectId}`);
}
