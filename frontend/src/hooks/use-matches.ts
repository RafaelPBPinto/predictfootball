import { useQuery } from "@tanstack/react-query";
import { matchesApi } from "@/lib/api/matches";

export function useMatchesByDate(date: string) {
  return useQuery({
    queryKey: ["matches", { date }],
    queryFn: () => matchesApi.getByDate(date),
    enabled: !!date,
  });
}

export function useMatchesBySeason(seasonId: number) {
  return useQuery({
    queryKey: ["matches", { seasonId }],
    queryFn: () => matchesApi.getBySeasonId(seasonId),
    enabled: !!seasonId,
  });
}

export function useMatchesByTeam(teamId: number) {
  return useQuery({
    queryKey: ["matches", { teamId }],
    queryFn: () => matchesApi.getByTeamId(teamId),
    enabled: !!teamId,
  });
}

export function useMatch(id: number) {
  return useQuery({
    queryKey: ["matches", id],
    queryFn: () => matchesApi.getById(id),
    enabled: !!id,
  });
}
