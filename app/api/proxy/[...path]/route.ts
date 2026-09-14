import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, ROLE_COOKIE } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

async function handle(req: NextRequest, params: { path: string[] }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  const targetPath = params.path.join("/");
  const search = req.nextUrl.search;
  const url = `${BACKEND_URL}/${targetPath}${search}`;

  const init: RequestInit = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const bodyText = await req.text();
    if (bodyText) init.body = bodyText;
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(url, init);
  } catch {
    return NextResponse.json({ message: "Backend bilan bog'lanib bo'lmadi" }, { status: 502 });
  }

  if (backendRes.status === 401) {
    const res = NextResponse.json({ message: "Sessiya muddati tugadi" }, { status: 401 });
    res.cookies.delete(SESSION_COOKIE);
    res.cookies.delete(ROLE_COOKIE);
    return res;
  }

  const text = await backendRes.text();
  return new NextResponse(text || null, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function GET(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params);
}
export async function POST(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params);
}
export async function PATCH(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params);
}
export async function DELETE(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params);
}
export async function PUT(req: NextRequest, ctx: { params: { path: string[] } }) {
  return handle(req, ctx.params);
}
