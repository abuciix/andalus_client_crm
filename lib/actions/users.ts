"use server";

import { redirect } from "next/navigation";
import { requireStaff } from "@/lib/session";
import { createClientAccount } from "@/lib/data/users";
import { z } from "zod";

const NewClientSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }),
  email: z.email({ error: "Please enter a valid email." }),
});

export async function createClientAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const session = await requireStaff();

  const validated = NewClientSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!validated.success) {
    return { error: "Please enter a valid name and email." };
  }

  await createClientAccount(session, validated.data);
  redirect("/staff/users");
}
