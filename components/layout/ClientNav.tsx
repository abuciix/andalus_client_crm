import { Topbar } from "./Topbar";
import { logoutAction } from "@/lib/actions/auth";

export function ClientNav({ name }: { name: string }) {
  return (
    <Topbar
      right={
        <nav className="flex items-center gap-6 font-meta text-xs uppercase tracking-wide">
          <span className="text-muted">{name}</span>
          <form action={logoutAction}>
            <button type="submit" className="hover:text-muted">
              Log out
            </button>
          </form>
        </nav>
      }
    />
  );
}
