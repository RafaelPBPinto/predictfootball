package pt.predictfootball.backend.dto.response;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record PlayerSeasonStatsResponse(
        Long id,
        Long playerId,
        String playerName,
        Long seasonId,
        Long teamId,
        String teamName,
        Integer appearances,
        Integer starts,
        Integer minutesPlayed,
        Integer goals,
        Integer assists,
        Integer penaltyGoals,
        Integer yellowCards,
        Integer redCards,
        BigDecimal xg,
        BigDecimal xag
) {}
