import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <Topbar
        right={
          <nav className="flex items-center gap-6 font-meta text-xs uppercase tracking-wide">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-muted">
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background"
            >
              Login
            </Link>
          </nav>
        }
      />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line px-6 py-6 font-meta text-xs uppercase tracking-wide text-muted">
        ANDALUS Architecture — Addis Ababa, Ethiopia
      </footer>
    </div>
  );
}
