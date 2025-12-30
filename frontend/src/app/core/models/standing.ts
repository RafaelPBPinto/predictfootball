import { Team } from "./team";
import { League } from "./league";

export interface Standing {
    position: number;
    team: Team;
    league: League;
    playedGames: number;
    won: number;
    draw: number;
    lost: number;
    points: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    form?: string;
}
