import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api/stats";

export function useTeamStats(teamId: number, seasonId: number) {
  return useQuery({
    queryKey: ["stats", "teams", { teamId, seasonId }],
    queryFn: () => statsApi.getTeamStats(teamId, seasonId),
    enabled: !!teamId && !!seasonId,
  });
}

export function usePlayerStatsByTeam(seasonId: number, teamId: number) {
  return useQuery({
    queryKey: ["stats", "players", { seasonId, teamId }],
    queryFn: () => statsApi.getPlayerStats(seasonId, teamId),
    enabled: !!seasonId && !!teamId,
  });
}
