import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type {
  Partner,
  PartnerFormInput,
  PartnerTourDiscountFormInput,
  PartnerPaymentTermsInput,
  PartnerStatementEntry,
  PartnerUser,
  PartnerUserFormInput,
} from "@/types/partner";
import type { Paginated } from "@/types/tour";

export function useAdminPartners() {
  return useQuery({
    queryKey: ["admin", "partners"],
    queryFn: () => proxyApi.get<Paginated<Partner>>("admin/partners"),
  });
}

export function useAdminPartner(id: string) {
  return useQuery({
    queryKey: ["admin", "partner", id],
    queryFn: () => proxyApi.get<Partner>(`admin/partners/${encodeURIComponent(id)}`),
    enabled: Boolean(id) && id !== "new",
  });
}

export function useCreatePartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PartnerFormInput) => proxyApi.post<Partner>("admin/partners", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });
}

export function useUpdatePartner(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<PartnerFormInput>) =>
      proxyApi.patch<Partner>(`admin/partners/${encodeURIComponent(id)}`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "partner", id] });
    },
  });
}

export function useSetPartnerActive(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isActive: boolean) =>
      proxyApi.patch<Partner>(`admin/partners/${encodeURIComponent(id)}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "partner", id] });
    },
  });
}

export function useAddPartnerTourDiscount(partnerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PartnerTourDiscountFormInput) =>
      proxyApi.post(`admin/partners/${encodeURIComponent(partnerId)}/tour-discounts`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partner", partnerId] }),
  });
}

export function useDeletePartnerTourDiscount(partnerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (discountId: string) =>
      proxyApi.delete(
        `admin/partners/${encodeURIComponent(partnerId)}/tour-discounts/${encodeURIComponent(discountId)}`
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partner", partnerId] }),
  });
}

export function useSetPartnerPaymentTerms(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PartnerPaymentTermsInput) =>
      proxyApi.patch<Partner>(`admin/partners/${encodeURIComponent(id)}/payment-terms`, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "partners"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "partner", id] });
    },
  });
}

export function useAddPartnerUser(partnerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PartnerUserFormInput) =>
      proxyApi.post<PartnerUser>(`admin/partners/${encodeURIComponent(partnerId)}/users`, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partner", partnerId] }),
  });
}

export function useSetPartnerUserActive(partnerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      proxyApi.patch<PartnerUser>(
        `admin/partners/${encodeURIComponent(partnerId)}/users/${encodeURIComponent(userId)}`,
        { isActive }
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partner", partnerId] }),
  });
}

export function useDeletePartnerUser(partnerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      proxyApi.delete(
        `admin/partners/${encodeURIComponent(partnerId)}/users/${encodeURIComponent(userId)}`
      ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "partner", partnerId] }),
  });
}

export function useAdminPartnerStatement(partnerId: string) {
  return useQuery({
    queryKey: ["admin", "partner", partnerId, "statement"],
    queryFn: () =>
      proxyApi.get<Paginated<PartnerStatementEntry>>(
        `admin/partners/${encodeURIComponent(partnerId)}/statement`
      ),
    enabled: Boolean(partnerId) && partnerId !== "new",
  });
}
