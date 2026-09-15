import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get(ROLE_COOKIE)?.value;

  // /admin/login and /b2b/login still exist (they just redirect to /login,
  // see app/admin/login/page.tsx and app/b2b/login/page.tsx) so they stay
  // excluded here to avoid a redirect loop for anyone hitting an old link.
  const isB2bProtected = pathname.startsWith("/b2b") && pathname !== "/b2b/login";
  const isAdminProtected = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isB2bProtected && role !== "b2b") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAdminProtected && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/b2b/:path*", "/admin/:path*"],
};