package pt.predictfootball.backend.dto.response;

import lombok.Builder;

@Builder
public record CountryResponse(
        Long id,
        String name,
        String code,
        String flagUrl
) {}
