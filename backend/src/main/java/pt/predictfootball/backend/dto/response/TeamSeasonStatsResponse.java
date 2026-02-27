package pt.predictfootball.backend.dto.response;

import lombok.Builder;

import java.math.BigDecimal;

@Builder
public record TeamSeasonStatsResponse(
        Long id,
        Long teamId,
        String teamName,
        Long seasonId,
        Integer goalsScored,
        Integer goalsConceded,
        Integer cleanSheets,
        BigDecimal avgPossession,
        BigDecimal shotsPerGame,
        BigDecimal shotsOnTargetPerGame,
        BigDecimal passAccuracy,
        BigDecimal tacklesPerGame,
        Integer interceptions,
        BigDecimal foulsPerGame,
        BigDecimal xg,
        BigDecimal xga
) {}
