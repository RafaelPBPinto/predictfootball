package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.PlayerSeasonStatsResponse;
import pt.predictfootball.backend.model.PlayerSeasonStats;

public class PlayerSeasonStatsMapper {

    private PlayerSeasonStatsMapper() {}

    public static PlayerSeasonStatsResponse toResponse(PlayerSeasonStats stats) {
        if (stats == null) return null;
        return PlayerSeasonStatsResponse.builder()
                .id(stats.getId())
                .playerId(stats.getPlayer().getId())
                .playerName(stats.getPlayer().getName())
                .seasonId(stats.getSeason().getId())
                .teamId(stats.getTeam().getId())
                .teamName(stats.getTeam().getName())
                .appearances(stats.getAppearances())
                .starts(stats.getStarts())
                .minutesPlayed(stats.getMinutesPlayed())
                .goals(stats.getGoals())
                .assists(stats.getAssists())
                .penaltyGoals(stats.getPenaltyGoals())
                .yellowCards(stats.getYellowCards())
                .redCards(stats.getRedCards())
                .xg(stats.getXg())
                .xag(stats.getXag())
                .build();
    }
}
