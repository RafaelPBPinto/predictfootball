export interface PlayerSeasonStatsResponse {
  id: number;
  playerId: number;
  playerName: string;
  seasonId: number;
  teamId: number;
  teamName: string;
  appearances: number;
  starts: number;
  minutesPlayed: number;
  goals: number;
  assists: number;
  penaltyGoals: number;
  yellowCards: number;
  redCards: number;
  xg: number | null;
  xag: number | null;
}

export interface TeamSeasonStatsResponse {
  id: number;
  teamId: number;
  teamName: string;
  seasonId: number;
  goalsScored: number;
  goalsConceded: number;
  cleanSheets: number;
  avgPossession: number | null;
  shotsPerGame: number | null;
  shotsOnTargetPerGame: number | null;
  passAccuracy: number | null;
  tacklesPerGame: number | null;
  interceptions: number | null;
  foulsPerGame: number | null;
  xg: number | null;
  xga: number | null;
}
