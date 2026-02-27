package pt.predictfootball.backend.dto.response;

import lombok.Builder;

@Builder
public record StandingResponse(
        Long id,
        Long seasonId,
        TeamResponse team,
        Integer position,
        Integer played,
        Integer won,
        Integer drawn,
        Integer lost,
        Integer goalsFor,
        Integer goalsAgainst,
        Integer goalDifference,
        Integer points,
        String form
) {}
