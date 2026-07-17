import Link from "next/link";
import { Topbar } from "./Topbar";
import { logoutAction } from "@/lib/actions/auth";

const NAV_LINKS = [
  { href: "/staff/dashboard", label: "Dashboard" },
  { href: "/staff/pipeline", label: "Pipeline" },
  { href: "/staff/users", label: "Users" },
];

export function StaffNav({ name }: { name: string }) {
  return (
    <Topbar
      right={
        <nav className="flex items-center gap-6 font-meta text-xs uppercase tracking-wide">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-muted">
              {link.label}
            </Link>
          ))}
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
