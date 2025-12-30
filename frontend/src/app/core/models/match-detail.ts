import { Match } from "./match";

export interface MatchDetail extends Match {
    events: MatchEvent[];
    lineups?: Lineups;
    statistics?: MatchStatistics;
}

export interface MatchEvent {
    id: number;
    type: 'GOAL' | 'YELLOW CARD' | 'RED CARD' | 'PENALTY' | 'SUBSTITUTION';
    time: number;
    player: string;
    team: 'home' | 'away';
    detail?: string;
}

export interface Lineups {
    home: TeamLineup;
    away: TeamLineup;
}

export interface TeamLineup {
    formation: string;
    startXI: Player[];
    substitutes: Player[];
}

export interface Player {
    id: number;
    name: string;
    number: number;
    position: string;
}

export interface MatchStatistics {
    home: TeamStatistics;
    away: TeamStatistics;
}

export interface TeamStatistics {
    possession: number;
    shots: number;
    shotsOnTarget: number;
    corners: number;
    fouls: number;
    yellowCards: number;
    redCards: number;
}
