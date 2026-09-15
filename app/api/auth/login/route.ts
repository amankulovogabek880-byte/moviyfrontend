import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, REFRESH_COOKIE, ROLE_COOKIE, type UserRole } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

// Backend role -> our internal (cookie/routing) role.
function mapRole(backendRole: unknown): UserRole | null {
  if (backendRole === "ADMIN") return "admin";
  if (backendRole === "PARTNER") return "b2b";
  return null;
}

/**
 * Single login endpoint for both admin and hamkor (partner) accounts.
 * The frontend no longer picks admin/partner up front — it always calls
 * backend `POST /auth/login` and reads `role` back from the response to
 * decide which cookie/panel to send the user to.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ message: "Email va parol talab qilinadi" }, { status: 400 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: body.email, password: body.password }),
    });
  } catch {
    return NextResponse.json({ message: "Backend bilan bog'lanib bo'lmadi" }, { status: 502 });
  }

  if (!backendRes.ok) {
    const errBody = await backendRes.json().catch(() => ({}));
    return NextResponse.json(
      { message: errBody?.message ?? "Email yoki parol noto'g'ri" },
      { status: backendRes.status }
    );
  }

  const data = await backendRes.json().catch(
    () => ({}) as { accessToken?: string; refreshToken?: string; role?: string }
  );

  const role = mapRole(data?.role);
  const token = data?.accessToken;
  if (!token || !role) {
    return NextResponse.json({ message: "Backend javobi noto'g'ri formatda" }, { status: 502 });
  }

  const res = NextResponse.json({ ok: true, role });
  const isProd = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 12; // 12 soat — access token

  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  if (data.refreshToken) {
    res.cookies.set(REFRESH_COOKIE, data.refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 kun
    });
  }

  res.cookies.set(ROLE_COOKIE, role, {
    httpOnly: false,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return res;
}