package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.Season;

import java.util.List;
import java.util.Optional;

public interface SeasonRepository extends JpaRepository<Season, Long> {

    List<Season> findByCompetitionId(Long competitionId);

    Optional<Season> findByCompetitionIdAndYear(Long competitionId, Integer year);

    Optional<Season> findByCompetitionIdAndCurrentTrue(Long competitionId);
}
