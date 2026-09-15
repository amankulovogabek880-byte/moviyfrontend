import { NextResponse } from "next/server";
import { SESSION_COOKIE, REFRESH_COOKIE, ROLE_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  res.cookies.delete(ROLE_COOKIE);
  return res;
}