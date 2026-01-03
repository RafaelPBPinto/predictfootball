package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByApiFootballId(Long apiFootballId);
    List<Team> findByCountry(String country);
    boolean existsByApiFootballId(Long apiFootballId);
}
