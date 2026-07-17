import Link from "next/link";
import type { ReactNode } from "react";

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span aria-hidden="true" className="text-foreground">
        <svg viewBox="0 0 20 20" width="20" height="20">
          <rect x="1" y="1" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <line x1="1" y1="10" x2="19" y2="10" stroke="currentColor" strokeWidth="1.4" />
          <line x1="10" y1="1" x2="10" y2="19" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="10" cy="10" r="2.4" fill="currentColor" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-brand font-semibold tracking-wide text-base">ANDALUS</span>
        <span className="font-meta text-[10px] tracking-widest text-muted uppercase">
          Architecture&nbsp;™
        </span>
      </span>
    </Link>
  );
}

export function Topbar({ right }: { right?: ReactNode }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-3">
      <BrandMark />
      {right}
    </header>
  );
}
