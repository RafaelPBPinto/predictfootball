import apiClient from "../api-client";
import { TeamResponse } from "@/types";

export const teamsApi = {
  getAll: async (countryId?: number) => {
    const { data } = await apiClient.get<TeamResponse[]>("/teams", {
      params: countryId ? { countryId } : undefined,
    });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<TeamResponse>(`/teams/${id}`);
    return data;
  },
};
