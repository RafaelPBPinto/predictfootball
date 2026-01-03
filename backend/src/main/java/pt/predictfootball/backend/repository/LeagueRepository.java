package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.League;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueRepository extends JpaRepository<League, Long> {
    Optional<League> findByApiFootballId(Long apiFootballId);
    Optional<League> findByApiFootballIdAndSeason(Long apiFootballId, int season);
    List<League> findByCountry(String country);
    List<League> findBySeason(int season);
    boolean existsByApiFootballId(Long apiFootballId);
}
