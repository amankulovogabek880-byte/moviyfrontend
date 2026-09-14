import { useMutation } from "@tanstack/react-query";
import type { LoginInput, UserRole } from "@/types/auth";

async function loginRequest(input: LoginInput & { role: UserRole }) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message ?? "Kirishda xatolik yuz berdi");
  }
  return data as { ok: true };
}

export function useLogin(role: UserRole) {
  return useMutation({
    mutationFn: (input: LoginInput) => loginRequest({ ...input, role }),
  });
}

export async function logoutRequest() {
  await fetch("/api/auth/logout", { method: "POST" });
}
