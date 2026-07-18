import Link from "next/link";
import type { ReactNode } from "react";

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/andalus-logo.svg" alt="Andalus Architecture" className="h-14 w-auto" />
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
