import apiClient from "../api-client";
import { StandingResponse } from "@/types";

export const standingsApi = {
  getBySeasonId: async (seasonId: number) => {
    const { data } = await apiClient.get<StandingResponse[]>("/standings", {
      params: { seasonId },
    });
    return data;
  },
};
