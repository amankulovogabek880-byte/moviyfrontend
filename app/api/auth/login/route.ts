import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, ROLE_COOKIE } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password || !body?.role) {
    return NextResponse.json(
      { message: "Email, parol va rol talab qilinadi" },
      { status: 400 }
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
        role: body.role,
      }),
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

  const data = await backendRes.json().catch(() => ({}) as { token?: string });
  const token = data?.token;
  if (!token) {
    return NextResponse.json({ message: "Backend javobi noto'g'ri formatda" }, { status: 502 });
  }

  const res = NextResponse.json({ ok: true });
  const maxAge = 60 * 60 * 12; // 12 soat
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  res.cookies.set(ROLE_COOKIE, body.role, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return res;
}
