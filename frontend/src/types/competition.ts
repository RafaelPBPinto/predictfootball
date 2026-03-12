import { CountryResponse } from "./common";

export type CompetitionType = "LEAGUE" | "CUP";

export interface CompetitionResponse {
  id: number;
  name: string;
  code: string;
  type: CompetitionType;
  country: CountryResponse;
  logoUrl: string | null;
}
