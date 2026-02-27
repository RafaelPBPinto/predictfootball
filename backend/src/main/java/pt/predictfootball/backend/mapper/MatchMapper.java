package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.MatchResponse;
import pt.predictfootball.backend.model.Match;

public class MatchMapper {

    private MatchMapper() {}

    public static MatchResponse toResponse(Match match) {
        if (match == null) return null;
        return MatchResponse.builder()
                .id(match.getId())
                .seasonId(match.getSeason().getId())
                .matchday(match.getMatchday())
                .homeTeam(TeamMapper.toResponse(match.getHomeTeam()))
                .awayTeam(TeamMapper.toResponse(match.getAwayTeam()))
                .homeScore(match.getHomeScore())
                .awayScore(match.getAwayScore())
                .status(match.getStatus().name())
                .kickoff(match.getKickoff())
                .venue(match.getVenue())
                .referee(match.getReferee())
                .build();
    }
}
