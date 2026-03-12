import { useQuery } from "@tanstack/react-query";
import { standingsApi } from "@/lib/api/standings";

export function useStandings(seasonId: number) {
  return useQuery({
    queryKey: ["standings", { seasonId }],
    queryFn: () => standingsApi.getBySeasonId(seasonId),
    enabled: !!seasonId,
  });
}
