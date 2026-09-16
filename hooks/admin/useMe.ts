import { useMutation, useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { AdminMe } from "@/types/auth";
import type { ChangePasswordFormValues } from "@/lib/schemas/auth";

export function useAdminMe() {
  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => proxyApi.get<AdminMe>("admin/me"),
    staleTime: 60_000,
  });
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordFormValues) =>
      proxyApi.patch<{ ok: true }>("admin/me/change-password", input),
  });
}