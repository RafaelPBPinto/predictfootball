package pt.predictfootball.backend.dto.response;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record PlayerResponse(
        Long id,
        String name,
        LocalDate dateOfBirth,
        CountryResponse nationality,
        String position,
        TeamResponse currentTeam,
        String photoUrl,
        Integer height,
        Integer weight,
        Integer shirtNumber
) {}
