import { useQuery } from "@tanstack/react-query";
import { matchEventsApi } from "@/lib/api/match-events";

export function useMatchEvents(matchId: number) {
  return useQuery({
    queryKey: ["matches", matchId, "events"],
    queryFn: () => matchEventsApi.getByMatchId(matchId),
    enabled: !!matchId,
  });
}
