import { useMutation, useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { B2BMe } from "@/types/auth";
import type { ChangePasswordFormValues } from "@/lib/schemas/auth";

export function useB2BMe() {
  return useQuery({
    queryKey: ["b2b", "me"],
    queryFn: () => proxyApi.get<B2BMe>("b2b/me"),
    staleTime: 60_000,
  });
}

export function useChangeB2BPassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordFormValues) =>
      proxyApi.patch<{ ok: true }>("b2b/me/change-password", input),
  });
}