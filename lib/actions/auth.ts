"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { LoginSchema, type LoginState, AcceptInviteSchema, type AcceptInviteState } from "@/lib/validation/auth";
import { acceptInvite } from "@/lib/data/users";

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const validated = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { error: "Please enter a valid email and password." };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo: "/post-login",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirect: false });
  redirect("/login");
}

export async function acceptInviteAction(
  token: string,
  _prevState: AcceptInviteState,
  formData: FormData
): Promise<AcceptInviteState> {
  const validated = AcceptInviteSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const user = await acceptInvite(token, validated.data.password);
  if (!user) {
    return { errors: { _form: ["This invite link is invalid or has already been used."] } };
  }

  redirect("/login");
}
