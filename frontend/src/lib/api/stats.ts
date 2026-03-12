import apiClient from "../api-client";
import { PlayerSeasonStatsResponse, TeamSeasonStatsResponse } from "@/types";

export const statsApi = {
  getPlayerStats: async (seasonId: number, teamId: number) => {
    const { data } = await apiClient.get<PlayerSeasonStatsResponse[]>(
      "/stats/players",
      { params: { seasonId, teamId } }
    );
    return data;
  },

  getTeamStats: async (teamId: number, seasonId: number) => {
    const { data } = await apiClient.get<TeamSeasonStatsResponse>(
      "/stats/teams",
      { params: { teamId, seasonId } }
    );
    return data;
  },
};
