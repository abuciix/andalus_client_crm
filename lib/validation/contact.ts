import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters." }).trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  phone: z.string().trim().optional(),
  city: z.string().min(2, { error: "Please enter a city." }).trim(),
  message: z.string().min(10, { error: "Please tell us a bit more (10+ characters)." }).trim(),
});

export type ContactFormState =
  | { errors?: Record<string, string[]>; message?: string; success?: boolean }
  | undefined;
