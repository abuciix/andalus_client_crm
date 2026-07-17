"use client";

import { useActionState } from "react";
import { submitContactForm } from "@/lib/actions/contact";

const inputClass = "border border-line px-3 py-2 focus:outline-none focus:border-foreground";
const labelClass = "font-meta text-xs uppercase tracking-wide text-muted";

export default function ContactPage() {
  const [state, action, pending] = useActionState(submitContactForm, undefined);

  if (state?.success) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24">
        <h1 className="font-brand text-2xl font-semibold mb-2">Thank you</h1>
        <p className="text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-24">
      <h1 className="font-brand text-2xl font-semibold mb-1">Start a project</h1>
      <p className="text-sm text-muted mb-8">
        Tell us about your project and we&apos;ll get back to you.
      </p>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" required className={inputClass} />
          {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required className={inputClass} />
          {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className={labelClass}>Phone (optional)</label>
          <input id="phone" name="phone" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="city" className={labelClass}>City</label>
          <input id="city" name="city" required placeholder="e.g. Addis Ababa" className={inputClass} />
          {state?.errors?.city && <p className="text-sm text-red-600">{state.errors.city[0]}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="message" className={labelClass}>Tell us about your project</label>
          <textarea id="message" name="message" required rows={5} className={inputClass} />
          {state?.errors?.message && <p className="text-sm text-red-600">{state.errors.message[0]}</p>}
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-2 border border-foreground px-4 py-2.5 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          {pending ? "Sending…" : "Send inquiry"}
        </button>
      </form>
    </div>
  );
}
