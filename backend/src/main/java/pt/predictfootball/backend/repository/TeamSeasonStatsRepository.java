package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.TeamSeasonStats;

import java.util.Optional;

public interface TeamSeasonStatsRepository extends JpaRepository<TeamSeasonStats, Long> {

    Optional<TeamSeasonStats> findByTeamIdAndSeasonId(Long teamId, Long seasonId);
}
