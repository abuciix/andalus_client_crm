"use server";

import { ContactFormSchema, type ContactFormState } from "@/lib/validation/contact";
import { createLeadFromContact } from "@/lib/data/projects";

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const validated = ContactFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    city: formData.get("city"),
    message: formData.get("message"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors as Record<string, string[]> };
  }

  await createLeadFromContact(validated.data);

  return { success: true, message: "Thanks — we'll be in touch shortly." };
}
