import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { PartnerUser, PartnerUserFormInput } from "@/types/partner";
import type { Paginated } from "@/types/tour";

export function useB2BTeam() {
  return useQuery({
    queryKey: ["b2b", "team"],
    queryFn: () => proxyApi.get<Paginated<PartnerUser>>("b2b/team"),
  });
}

export function useAddB2BTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PartnerUserFormInput) => proxyApi.post<PartnerUser>("b2b/team", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["b2b", "team"] }),
  });
}
