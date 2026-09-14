import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { proxyApi } from "@/lib/api-proxy-client";
import type { AdminTeamMember, AdminTeamMemberFormInput } from "@/types/auth";
import type { Paginated } from "@/types/tour";

export function useAdminTeam() {
  return useQuery({
    queryKey: ["admin", "team"],
    queryFn: () => proxyApi.get<Paginated<AdminTeamMember>>("admin/team"),
  });
}

export function useAddAdminTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AdminTeamMemberFormInput) =>
      proxyApi.post<AdminTeamMember>("admin/team", input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "team"] }),
  });
}
