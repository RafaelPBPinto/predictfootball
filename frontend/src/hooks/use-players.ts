import { useQuery } from "@tanstack/react-query";
import { playersApi } from "@/lib/api/players";

export function usePlayer(id: number) {
  return useQuery({
    queryKey: ["players", id],
    queryFn: () => playersApi.getById(id),
    enabled: !!id,
  });
}

export function usePlayersByTeam(teamId: number) {
  return useQuery({
    queryKey: ["players", { teamId }],
    queryFn: () => playersApi.getByTeamId(teamId),
    enabled: !!teamId,
  });
}

export function usePlayerStats(playerId: number, seasonId: number) {
  return useQuery({
    queryKey: ["players", playerId, "stats", { seasonId }],
    queryFn: () => playersApi.getStats(playerId, seasonId),
    enabled: !!playerId && !!seasonId,
  });
}
