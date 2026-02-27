package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.StandingResponse;
import pt.predictfootball.backend.model.Standing;

public class StandingMapper {

    private StandingMapper() {}

    public static StandingResponse toResponse(Standing standing) {
        if (standing == null) return null;
        return StandingResponse.builder()
                .id(standing.getId())
                .seasonId(standing.getSeason().getId())
                .team(TeamMapper.toResponse(standing.getTeam()))
                .position(standing.getPosition())
                .played(standing.getPlayed())
                .won(standing.getWon())
                .drawn(standing.getDrawn())
                .lost(standing.getLost())
                .goalsFor(standing.getGoalsFor())
                .goalsAgainst(standing.getGoalsAgainst())
                .goalDifference(standing.getGoalDifference())
                .points(standing.getPoints())
                .form(standing.getForm())
                .build();
    }
}
