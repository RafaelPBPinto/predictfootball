import apiClient from "../api-client";
import { MatchResponse } from "@/types";

export const matchesApi = {
  getByDate: async (date: string) => {
    const { data } = await apiClient.get<MatchResponse[]>("/matches", {
      params: { date },
    });
    return data;
  },

  getBySeasonId: async (seasonId: number) => {
    const { data } = await apiClient.get<MatchResponse[]>("/matches", {
      params: { seasonId },
    });
    return data;
  },

  getByTeamId: async (teamId: number) => {
    const { data } = await apiClient.get<MatchResponse[]>("/matches", {
      params: { teamId },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<MatchResponse>(`/matches/${id}`);
    return data;
  },
};
