import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "@/lib/api/teams";

export function useTeam(id: number) {
  return useQuery({
    queryKey: ["teams", id],
    queryFn: () => teamsApi.getById(id),
    enabled: !!id,
  });
}

export function useTeams(countryId?: number) {
  return useQuery({
    queryKey: ["teams", { countryId }],
    queryFn: () => teamsApi.getAll(countryId),
  });
}
