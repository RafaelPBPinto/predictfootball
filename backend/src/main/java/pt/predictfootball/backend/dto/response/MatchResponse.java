package pt.predictfootball.backend.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record MatchResponse(
        Long id,
        Long seasonId,
        Integer matchday,
        TeamResponse homeTeam,
        TeamResponse awayTeam,
        Integer homeScore,
        Integer awayScore,
        String status,
        LocalDateTime kickoff,
        String venue,
        String referee
) {}
