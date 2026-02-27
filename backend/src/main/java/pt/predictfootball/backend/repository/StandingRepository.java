package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.Standing;

import java.util.List;
import java.util.Optional;

public interface StandingRepository extends JpaRepository<Standing, Long> {

    List<Standing> findBySeasonIdOrderByPositionAsc(Long seasonId);

    Optional<Standing> findBySeasonIdAndTeamId(Long seasonId, Long teamId);
}
