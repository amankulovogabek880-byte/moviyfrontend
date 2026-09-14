import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { AdminDashboardStats } from "@/types/dashboard";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => proxyApi.get<AdminDashboardStats>("admin/dashboard"),
  });
}
