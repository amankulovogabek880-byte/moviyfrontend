import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { AuditLogEntry, AuditLogFilters } from "@/types/audit";
import type { Paginated } from "@/types/tour";

export function useAuditLog(filters?: AuditLogFilters) {
  return useQuery({
    queryKey: ["admin", "auditLog", filters],
    queryFn: () =>
      proxyApi.get<Paginated<AuditLogEntry>>(
        "admin/audit-log",
        filters as Record<string, unknown>
      ),
  });
}
