package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.PlayerSeasonStatsResponse;
import pt.predictfootball.backend.mapper.PlayerSeasonStatsMapper;
import pt.predictfootball.backend.repository.PlayerSeasonStatsRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerSeasonStatsService {

    private final PlayerSeasonStatsRepository playerSeasonStatsRepository;

    public List<PlayerSeasonStatsResponse> findByPlayerAndSeason(Long playerId, Long seasonId) {
        return playerSeasonStatsRepository.findByPlayerIdAndSeasonId(playerId, seasonId).stream()
                .map(PlayerSeasonStatsMapper::toResponse)
                .toList();
    }

    public List<PlayerSeasonStatsResponse> findBySeasonAndTeam(Long seasonId, Long teamId) {
        return playerSeasonStatsRepository.findBySeasonIdAndTeamId(seasonId, teamId).stream()
                .map(PlayerSeasonStatsMapper::toResponse)
                .toList();
    }
}
