package pt.predictfootball.backend.dto.response;

import lombok.Builder;

@Builder
public record CompetitionResponse(
        Long id,
        String name,
        String code,
        String type,
        CountryResponse country,
        String logoUrl
) {}
