package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.PlayerSeasonStats;

import java.util.List;
import java.util.Optional;

public interface PlayerSeasonStatsRepository extends JpaRepository<PlayerSeasonStats, Long> {

    List<PlayerSeasonStats> findByPlayerIdAndSeasonId(Long playerId, Long seasonId);

    List<PlayerSeasonStats> findBySeasonIdAndTeamId(Long seasonId, Long teamId);

    Optional<PlayerSeasonStats> findByPlayerIdAndSeasonIdAndTeamId(Long playerId, Long seasonId, Long teamId);
}
