import { Team } from "./team";
import { League } from "./league";

export interface Match {
    id: number;
    league: League;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number | null;
    awayScore: number | null;
    status: MatchStatus;
    kickoffTime: Date;
    venue?: string;
    round?: string;
}

export enum MatchStatus {
    SCHEDULED = 'SCHEDULED',
    LIVE = 'LIVE',
    HALFTIME = 'HALFTIME',
    FINISHED = 'FINISHED',
    POSTPONED = 'POSTPONED',
    CANCELLED = 'CANCELLED'
}
