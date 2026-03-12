import apiClient from "../api-client";
import { SeasonResponse } from "@/types";

export const seasonsApi = {
  getByCompetitionId: async (competitionId: number) => {
    const { data } = await apiClient.get<SeasonResponse[]>("/seasons", {
      params: { competitionId },
    });
    return data;
  },

  getCurrent: async (competitionId: number) => {
    const { data } = await apiClient.get<SeasonResponse>("/seasons/current", {
      params: { competitionId },
    });
    return data;
  },
};
