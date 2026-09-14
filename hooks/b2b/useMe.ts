import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { B2BMe } from "@/types/auth";

export function useB2BMe() {
  return useQuery({
    queryKey: ["b2b", "me"],
    queryFn: () => proxyApi.get<B2BMe>("b2b/me"),
    staleTime: 60_000,
  });
}
