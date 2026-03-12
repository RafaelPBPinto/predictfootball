import { CountryResponse } from "./common";

export interface TeamResponse {
  id: number;
  name: string;
  shortName: string | null;
  code: string | null;
  country: CountryResponse;
  logoUrl: string | null;
  venue: string | null;
  founded: number | null;
}
