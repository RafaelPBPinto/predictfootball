package pt.predictfootball.backend.dto.response;

import lombok.Builder;

@Builder
public record TeamResponse(
        Long id,
        String name,
        String shortName,
        String code,
        CountryResponse country,
        String logoUrl,
        String venue,
        Integer founded
) {}
