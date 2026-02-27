package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.TeamResponse;
import pt.predictfootball.backend.model.Team;

public class TeamMapper {

    private TeamMapper() {}

    public static TeamResponse toResponse(Team team) {
        if (team == null) return null;
        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .shortName(team.getShortName())
                .code(team.getCode())
                .country(CountryMapper.toResponse(team.getCountry()))
                .logoUrl(team.getLogoUrl())
                .venue(team.getVenue())
                .founded(team.getFounded())
                .build();
    }
}
