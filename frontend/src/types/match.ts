import { TeamResponse } from "./team";

export type MatchStatus = "SCHEDULED" | "FINISHED" | "POSTPONED" | "CANCELLED";
export type MatchEventType =
  | "GOAL"
  | "OWN_GOAL"
  | "PENALTY_GOAL"
  | "YELLOW_CARD"
  | "RED_CARD"
  | "SUBSTITUTION";

export interface MatchResponse {
  id: number;
  seasonId: number;
  competitionId: number;
  competitionName: string;
  competitionLogoUrl: string | null;
  matchday: number | null;
  homeTeam: TeamResponse;
  awayTeam: TeamResponse;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  kickoff: string;
  venue: string | null;
  referee: string | null;
}

export interface MatchEventResponse {
  id: number;
  matchId: number;
  type: MatchEventType;
  minute: number;
  extraMinute: number | null;
  playerId: number | null;
  playerName: string | null;
  relatedPlayerId: number | null;
  relatedPlayerName: string | null;
  teamId: number;
  teamName: string;
}
