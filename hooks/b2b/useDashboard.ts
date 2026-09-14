import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { B2BDashboardStats } from "@/types/dashboard";

export function useB2BDashboard() {
  return useQuery({
    queryKey: ["b2b", "dashboard"],
    queryFn: () => proxyApi.get<B2BDashboardStats>("b2b/dashboard"),
  });
}
