import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, REFRESH_COOKIE, ROLE_COOKIE } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";

function clearAuthCookies(res: NextResponse) {
  res.cookies.delete(SESSION_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  res.cookies.delete(ROLE_COOKIE);
}

function backendInit(
  method: string,
  accessToken: string,
  body: BodyInit | null,
  contentType: string | null
): RequestInit {
  return {
    method,
    headers: {
      // Multipart file-upload bodies (see §5 / TourImagesEditor) carry
      // their own `multipart/form-data; boundary=...` Content-Type —
      // forcing `application/json` on those breaks the boundary and
      // corrupts the upload. Everything else defaults to JSON like before.
      "Content-Type": contentType ?? "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    ...(body ? { body } : {}),
  };
}

/**
 * Tries to exchange the refresh-token cookie for a new access token. Returns
 * the new tokens on success, or null if there's no refresh token or the
 * backend rejects it (refresh token expired/revoked too — the person needs
 * to log in again).
 */
async function tryRefresh(refreshToken: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res
      .json()
      .catch(() => null as { accessToken?: string; refreshToken?: string } | null);
    if (!data?.accessToken) return null;
    return { accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken };
  } catch {
    return null;
  }
}

async function passthroughResponse(backendRes: Response) {
  const buffer = await backendRes.arrayBuffer();
  const contentDisposition = backendRes.headers.get("Content-Disposition");
  return new NextResponse(buffer.byteLength ? buffer : null, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
      ...(contentDisposition ? { "Content-Disposition": contentDisposition } : {}),
    },
  });
}

async function handle(req: NextRequest, params: { path: string[] }) {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Avtorizatsiyadan o'tilmagan" }, { status: 401 });
  }

  const targetPath = params.path.join("/");
  const search = req.nextUrl.search;
  const url = `${BACKEND_URL}/${targetPath}${search}`;

  const incomingContentType = req.headers.get("content-type");
  const isMultipart = incomingContentType?.toLowerCase().startsWith("multipart/form-data") ?? false;

  // Read the body once so it can be replayed on a refresh-and-retry below —
  // req's body stream can only be consumed a single time. Multipart
  // (file upload) bodies are read as raw bytes to stay binary-safe — a
  // .text() decode/re-encode roundtrip corrupts them; everything else is
  // read as text like before. An ArrayBuffer (unlike a stream) can safely
  // be reused across the initial attempt and the refresh-retry fetch.
  let body: BodyInit | null = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    if (isMultipart) {
      const buffer = await req.arrayBuffer();
      body = buffer.byteLength ? buffer : null;
    } else {
      const text = await req.text();
      body = text || null;
    }
  }
  const forwardedContentType = isMultipart ? incomingContentType : null;

  let backendRes: Response;
  try {
    backendRes = await fetch(url, backendInit(req.method, token, body, forwardedContentType));
  } catch {
    return NextResponse.json({ message: "Backend bilan bog'lanib bo'lmadi" }, { status: 502 });
  }

  if (backendRes.status === 401) {
    const refreshToken = cookieStore.get(REFRESH_COOKIE)?.value;
    const refreshed = refreshToken ? await tryRefresh(refreshToken) : null;

    if (refreshed) {
      let retryRes: Response;
      try {
        retryRes = await fetch(
          url,
          backendInit(req.method, refreshed.accessToken, body, forwardedContentType)
        );
      } catch {
        retryRes = backendRes;
      }

      const out = await passthroughResponse(retryRes);
      const isProd = process.env.NODE_ENV === "production";
      out.cookies.set(SESSION_COOKIE, refreshed.accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12,
      });
      out.cookies.set(REFRESH_COOKIE, refreshed.refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return out;
    }

    // No refresh token, or refresh itself failed — old behavior: clear
    // cookies and bubble the 401 up so the client redirects to /login.
    const res = NextResponse.json({ message: "Sessiya muddati tugadi" }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  // Binary-safe passthrough (JSON survives this unchanged; PDF/Excel document
  // downloads — see §6 — need the raw bytes rather than a text() decode/encode
  // roundtrip, which corrupts non-UTF8 binary content).
  return passthroughResponse(backendRes);
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