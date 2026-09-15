import { useMutation } from "@tanstack/react-query";
import type { LoginInput, UserRole } from "@/types/auth";

interface LoginResponse {
  ok: true;
  role: UserRole;
}

async function loginRequest(input: LoginInput): Promise<LoginResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message ?? "Kirishda xatolik yuz berdi");
  }
  return data as LoginResponse;
}

// Single unified login — the backend decides (and returns) the role, the
// caller (LoginForm) just redirects based on the response. No role is
// selected or sent by the client anymore.
export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => loginRequest(input),
  });
}

export async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST" });
}