package pt.predictfootball.backend.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record SeasonResponse(
        Long id,
        Long competitionId,
        String competitionName,
        Integer year,
        LocalDate startDate,
        LocalDate endDate,
        Boolean current
) {}
