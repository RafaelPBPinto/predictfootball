export interface SeasonResponse {
  id: number;
  competitionId: number;
  competitionName: string;
  year: number;
  startDate: string;
  endDate: string;
  current: boolean;
}
