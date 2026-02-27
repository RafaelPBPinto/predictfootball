package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.TeamSeasonStatsResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.TeamSeasonStatsMapper;
import pt.predictfootball.backend.repository.TeamSeasonStatsRepository;

@Service
@RequiredArgsConstructor
public class TeamSeasonStatsService {

    private final TeamSeasonStatsRepository teamSeasonStatsRepository;

    public TeamSeasonStatsResponse findByTeamAndSeason(Long teamId, Long seasonId) {
        return teamSeasonStatsRepository.findByTeamIdAndSeasonId(teamId, seasonId)
                .map(TeamSeasonStatsMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Stats not found for team " + teamId + " in season " + seasonId));
    }
}
