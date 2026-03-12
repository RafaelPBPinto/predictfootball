import { CountryResponse } from "./common";
import { TeamResponse } from "./team";

export type Position = "GK" | "DF" | "MF" | "FW";

export interface PlayerResponse {
  id: number;
  name: string;
  dateOfBirth: string | null;
  nationality: CountryResponse;
  position: Position | null;
  currentTeam: TeamResponse;
  photoUrl: string | null;
  height: number | null;
  weight: number | null;
  shirtNumber: number | null;
}
