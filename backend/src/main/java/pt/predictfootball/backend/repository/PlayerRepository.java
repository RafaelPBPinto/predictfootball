package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.Player;
import pt.predictfootball.backend.model.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    Optional<Player> findByApiFootballId(Long apiFootballId);
    List<Player> findByCurrentTeam(Team team);
    List<Player> findByNationality(String nationality);
    boolean existsByApiFootballId(Long apiFootballId);
}
