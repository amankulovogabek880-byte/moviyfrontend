/**
 * Authenticated API client for the B2B/Admin surfaces. Never touches the JWT
 * directly — calls same-origin /api/proxy/<path>, which forwards to the
 * backend with the token read from the httpOnly session cookie (see
 * app/api/proxy/[...path]/route.ts). The proxy route itself tries a
 * refresh-token exchange before giving up (see §9 in the fix prompt); if it
 * still comes back 401 here, the session is genuinely dead and we send the
 * person to the single unified /login page.
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

  return handleProxyResponse<T>(res);
}

/**
 * File-upload variant of proxyRequest — used for `multipart/form-data`
 * requests (see components/admin/TourImagesEditor.tsx). Deliberately does
 * NOT set a Content-Type header: the browser sets
 * `multipart/form-data; boundary=...` itself from the FormData body, and
 * setting it manually here would drop the boundary and corrupt the upload.
 * See app/api/proxy/[...path]/route.ts for the matching binary-safe
 * passthrough on the server side.
 */
async function proxyRequestFormData<T>(path: string, formData: FormData): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api/proxy/${path}`, { method: "POST", body: formData });
  } catch {
    throw new ApiError("Server bilan bog'lanishda xatolik yuz berdi.", 0, "NETWORK_ERROR");
  }

  return handleProxyResponse<T>(res);
}

async function handleProxyResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
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
  delete: <T,>(path: string) => proxyRequest<T>(path, { method: "DELETE" }),
  postFormData: <T,>(path: string, formData: FormData) => proxyRequestFormData<T>(path, formData),
};