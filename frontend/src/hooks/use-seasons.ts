import { useQuery } from "@tanstack/react-query";
import { seasonsApi } from "@/lib/api/seasons";

export function useSeasons(competitionId: number) {
  return useQuery({
    queryKey: ["seasons", { competitionId }],
    queryFn: () => seasonsApi.getByCompetitionId(competitionId),
    enabled: !!competitionId,
  });
}

export function useCurrentSeason(competitionId: number) {
  return useQuery({
    queryKey: ["seasons", "current", { competitionId }],
    queryFn: () => seasonsApi.getCurrent(competitionId),
    enabled: !!competitionId,
  });
}
