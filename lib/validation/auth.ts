import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email." }),
  password: z.string().min(1, { error: "Password is required." }),
});

export type LoginState = { error?: string } | undefined;

export const AcceptInviteSchema = z
  .object({
    password: z.string().min(8, { error: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type AcceptInviteState = { errors?: Record<string, string[]>; success?: boolean } | undefined;
