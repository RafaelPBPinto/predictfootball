import { League } from "./league";
import { Team } from "./team";

export interface Standing {
    id: number;
    team: Team;
    league: League;
    rank: number;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form: string;
    lastUpdated: Date;
}
