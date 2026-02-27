package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.SeasonResponse;
import pt.predictfootball.backend.model.Season;

public class SeasonMapper {

    private SeasonMapper() {}

    public static SeasonResponse toResponse(Season season) {
        if (season == null) return null;
        return SeasonResponse.builder()
                .id(season.getId())
                .competitionId(season.getCompetition().getId())
                .competitionName(season.getCompetition().getName())
                .year(season.getYear())
                .startDate(season.getStartDate())
                .endDate(season.getEndDate())
                .current(season.getCurrent())
                .build();
    }
}
