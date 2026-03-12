import apiClient from "../api-client";
import { MatchEventResponse } from "@/types";

export const matchEventsApi = {
  getByMatchId: async (matchId: number) => {
    const { data } = await apiClient.get<MatchEventResponse[]>(
      `/matches/${matchId}/events`
    );
    return data;
  },
};
