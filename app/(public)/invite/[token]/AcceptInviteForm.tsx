"use client";

import { useActionState } from "react";
import { acceptInviteAction } from "@/lib/actions/auth";
import type { AcceptInviteState } from "@/lib/validation/auth";

const inputClass = "border border-line px-3 py-2 focus:outline-none focus:border-foreground";
const labelClass = "font-meta text-xs uppercase tracking-wide text-muted";

export function AcceptInviteForm({ token }: { token: string }) {
  const action = acceptInviteAction.bind(null, token);
  const [state, formAction, pending] = useActionState<AcceptInviteState, FormData>(action, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className={labelClass}>Password</label>
        <input id="password" name="password" type="password" required minLength={8} className={inputClass} />
        {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="confirmPassword" className={labelClass}>Confirm password</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className={inputClass} />
        {state?.errors?.confirmPassword && (
          <p className="text-sm text-red-600">{state.errors.confirmPassword[0]}</p>
        )}
      </div>
      {state?.errors?._form && <p className="text-sm text-red-600">{state.errors._form[0]}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 border border-foreground px-4 py-2.5 font-meta text-xs uppercase tracking-wide hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {pending ? "Setting up…" : "Set password & sign in"}
      </button>
    </form>
  );
}
