"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, undefined);

  return (
    <div className="mx-auto max-w-sm px-6 py-24">
      <h1 className="font-brand text-2xl font-semibold mb-1">Sign in</h1>
      <p className="text-sm text-muted mb-8">
        Staff and client accounts use the same login. You&apos;ll be routed automatically.
      </p>

      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-meta text-xs uppercase tracking-wide text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-line px-3 py-2 focus:outline-none focus:border-foreground"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-meta text-xs uppercase tracking-wide text-muted">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border border-line px-3 py-2 focus:outline-none focus:border-foreground"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 border border-foreground px-4 py-2.5 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
