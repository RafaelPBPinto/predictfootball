import { League } from "./league";
import { Team } from "./team";

export interface Fixture {
    id: number;
    league: League;
    homeTeam: Team;
    awayTeam: Team;
    homeScore: number;
    awayScore: number;
    status: FixtureStatus;
    kickoffTime: string;
    venue: string;
    round: string;
    elapsed?: number;
}

export enum FixtureStatus {
    SCHEDULED = 'SCHEDULED',
    LIVE = 'LIVE',
    HALFTIME = 'HALFTIME',
    FINISHED = 'FINISHED',
    POSTPONED = 'POSTPONED',
    CANCELLED = 'CANCELLED',
}
