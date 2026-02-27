package pt.predictfootball.backend.dto.response;

import lombok.Builder;

@Builder
public record MatchEventResponse(
        Long id,
        Long matchId,
        String type,
        Integer minute,
        Integer extraMinute,
        Long playerId,
        String playerName,
        Long relatedPlayerId,
        String relatedPlayerName,
        Long teamId,
        String teamName
) {}
