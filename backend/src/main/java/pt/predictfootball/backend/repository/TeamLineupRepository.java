package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.TeamLineup;

@Repository
public interface TeamLineupRepository extends JpaRepository<TeamLineup, Long> {
}
