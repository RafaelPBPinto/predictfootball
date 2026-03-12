import apiClient from "../api-client";
import { CompetitionResponse } from "@/types";

export const competitionsApi = {
  getAll: async (countryId?: number) => {
    const { data } = await apiClient.get<CompetitionResponse[]>(
      "/competitions",
      { params: countryId ? { countryId } : undefined }
    );
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<CompetitionResponse>(
      `/competitions/${id}`
    );
    return data;
  },
};
