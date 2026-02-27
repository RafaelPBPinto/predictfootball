package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.MatchEventResponse;
import pt.predictfootball.backend.model.MatchEvent;

public class MatchEventMapper {

    private MatchEventMapper() {}

    public static MatchEventResponse toResponse(MatchEvent event) {
        if (event == null) return null;
        return MatchEventResponse.builder()
                .id(event.getId())
                .matchId(event.getMatch().getId())
                .type(event.getType().name())
                .minute(event.getMinute())
                .extraMinute(event.getExtraMinute())
                .playerId(event.getPlayer() != null ? event.getPlayer().getId() : null)
                .playerName(event.getPlayer() != null ? event.getPlayer().getName() : null)
                .relatedPlayerId(event.getRelatedPlayer() != null ? event.getRelatedPlayer().getId() : null)
                .relatedPlayerName(event.getRelatedPlayer() != null ? event.getRelatedPlayer().getName() : null)
                .teamId(event.getTeam().getId())
                .teamName(event.getTeam().getName())
                .build();
    }
}
