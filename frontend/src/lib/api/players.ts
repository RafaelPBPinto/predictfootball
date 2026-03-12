import apiClient from "../api-client";
import { PlayerResponse, PlayerSeasonStatsResponse } from "@/types";

export const playersApi = {
  getByTeamId: async (teamId: number) => {
    const { data } = await apiClient.get<PlayerResponse[]>("/players", {
      params: { teamId },
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<PlayerResponse>(`/players/${id}`);
    return data;
  },

  getStats: async (id: number, seasonId: number) => {
    const { data } = await apiClient.get<PlayerSeasonStatsResponse>(
      `/players/${id}/stats`,
      { params: { seasonId } }
    );
    return data;
  },
};
