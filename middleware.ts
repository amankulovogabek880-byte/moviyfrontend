import { NextRequest, NextResponse } from "next/server";
import { ROLE_COOKIE } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get(ROLE_COOKIE)?.value;

  const isB2bProtected = pathname.startsWith("/b2b") && pathname !== "/b2b/login";
  const isAdminProtected = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (isB2bProtected && role !== "b2b") {
    return NextResponse.redirect(new URL("/b2b/login", req.url));
  }
  if (isAdminProtected && role !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/b2b/:path*", "/admin/:path*"],
};
