import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { Partner, PartnerFormInput } from "@/types/partner";
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
