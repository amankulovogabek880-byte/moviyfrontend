import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { AdminMe } from "@/types/auth";

export function useAdminMe() {
  return useQuery({
    queryKey: ["admin", "me"],
    queryFn: () => proxyApi.get<AdminMe>("admin/me"),
    staleTime: 60_000,
  });
}
