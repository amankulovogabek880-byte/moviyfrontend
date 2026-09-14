import { useQuery } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { PaymentTransaction, PaymentFilters } from "@/types/payment";
import type { Paginated } from "@/types/tour";

export function useAdminPayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: ["admin", "payments", filters],
    queryFn: () =>
      proxyApi.get<Paginated<PaymentTransaction>>(
        "admin/payments",
        filters as Record<string, unknown>
      ),
  });
}
