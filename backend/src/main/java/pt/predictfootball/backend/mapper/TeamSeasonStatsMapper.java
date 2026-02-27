package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.TeamSeasonStatsResponse;
import pt.predictfootball.backend.model.TeamSeasonStats;

public class TeamSeasonStatsMapper {

    private TeamSeasonStatsMapper() {}

    public static TeamSeasonStatsResponse toResponse(TeamSeasonStats stats) {
        if (stats == null) return null;
        return TeamSeasonStatsResponse.builder()
                .id(stats.getId())
                .teamId(stats.getTeam().getId())
                .teamName(stats.getTeam().getName())
                .seasonId(stats.getSeason().getId())
                .goalsScored(stats.getGoalsScored())
                .goalsConceded(stats.getGoalsConceded())
                .cleanSheets(stats.getCleanSheets())
                .avgPossession(stats.getAvgPossession())
                .shotsPerGame(stats.getShotsPerGame())
                .shotsOnTargetPerGame(stats.getShotsOnTargetPerGame())
                .passAccuracy(stats.getPassAccuracy())
                .tacklesPerGame(stats.getTacklesPerGame())
                .interceptions(stats.getInterceptions())
                .foulsPerGame(stats.getFoulsPerGame())
                .xg(stats.getXg())
                .xga(stats.getXga())
                .build();
    }
}
