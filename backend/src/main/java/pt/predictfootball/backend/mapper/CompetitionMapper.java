package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.CompetitionResponse;
import pt.predictfootball.backend.model.Competition;

public class CompetitionMapper {

    private CompetitionMapper() {}

    public static CompetitionResponse toResponse(Competition competition) {
        if (competition == null) return null;
        return CompetitionResponse.builder()
                .id(competition.getId())
                .name(competition.getName())
                .code(competition.getCode())
                .type(competition.getType().name())
                .country(CountryMapper.toResponse(competition.getCountry()))
                .logoUrl(competition.getLogoUrl())
                .build();
    }
}
