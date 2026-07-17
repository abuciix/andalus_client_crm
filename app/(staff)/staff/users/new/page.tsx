"use client";

import { useActionState } from "react";
import { createClientAction } from "@/lib/actions/users";

export default function NewClientPage() {
  const [state, action, pending] = useActionState(createClientAction, undefined);

  return (
    <div className="max-w-sm">
      <h1 className="font-brand text-2xl font-semibold mb-1">Add client</h1>
      <p className="text-sm text-muted mb-8">
        Creates a client account and sends an invite (email + WhatsApp).
      </p>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-meta text-xs uppercase tracking-wide text-muted">Name</label>
          <input id="name" name="name" required className="border border-line px-3 py-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-meta text-xs uppercase tracking-wide text-muted">Email</label>
          <input id="email" name="email" type="email" required className="border border-line px-3 py-2" />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 border border-foreground px-4 py-2.5 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create & invite"}
        </button>
      </form>
    </div>
  );
}
