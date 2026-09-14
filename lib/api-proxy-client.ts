/**
 * Authenticated API client for the B2B/Admin surfaces. Never touches the JWT
 * directly — calls same-origin /api/proxy/<path>, which forwards to the
 * backend with the token read from the httpOnly session cookie (see
 * app/api/proxy/[...path]/route.ts). On a 401 it redirects to the right
 * login page.
 */
import { ApiError } from "@/lib/api-client";

function toQueryString(params?: Record<string, unknown>): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function proxyRequest<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/proxy/${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch {
    throw new ApiError("Server bilan bog'lanishda xatolik yuz berdi.", 0, "NETWORK_ERROR");
  }

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      const isAdmin = window.location.pathname.startsWith("/admin");
      window.location.href = isAdmin ? "/admin/login" : "/b2b/login";
    }
    throw new ApiError("Sessiya muddati tugadi. Qayta kiring.", 401, "UNAUTHORIZED");
  }

  if (!res.ok) {
    let message = "Server xatosi yuz berdi.";
    let code = "UNKNOWN";
    try {
      const body = await res.json();
      message = body?.message ?? message;
      code = body?.code ?? code;
    } catch {
      // non-JSON error body — keep defaults
    }
    throw new ApiError(message, res.status, code);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const proxyApi = {
  get: <T,>(path: string, params?: Record<string, unknown>) =>
    proxyRequest<T>(`${path}${toQueryString(params)}`),
  post: <T,>(path: string, body?: unknown) =>
    proxyRequest<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T,>(path: string, body?: unknown) =>
    proxyRequest<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
};
