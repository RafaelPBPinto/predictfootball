package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.TeamStatistics;

@Repository
public interface TeamStatisticsRepository extends JpaRepository<TeamStatistics, Long> {
}
