import { useQuery } from "@tanstack/react-query";
import { competitionsApi } from "@/lib/api/competitions";

export function useCompetitions() {
  return useQuery({
    queryKey: ["competitions"],
    queryFn: () => competitionsApi.getAll(),
  });
}

export function useCompetition(id: number) {
  return useQuery({
    queryKey: ["competitions", id],
    queryFn: () => competitionsApi.getById(id),
    enabled: !!id,
  });
}
