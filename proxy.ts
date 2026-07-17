import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const role = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/staff") && role !== "STAFF") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (pathname.startsWith("/portal") && role !== "CLIENT") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/staff/:path*", "/portal/:path*"],
};
