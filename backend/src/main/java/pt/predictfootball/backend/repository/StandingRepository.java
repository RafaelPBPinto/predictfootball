package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.League;
import pt.predictfootball.backend.model.Standing;
import pt.predictfootball.backend.model.Team;

import java.util.List;
import java.util.Optional;

@Repository
public interface StandingRepository extends JpaRepository<Standing, Long> {
    List<Standing> findByLeagueOrderByRankAsc(League league);

    Optional<Standing> findByTeamAndLeague(Team team, League league);

    void deleteByLeague(League league);

    @Query("SELECT s FROM Standing s WHERE s.league = :league ORDER BY s.rank ASC")
    List<Standing> findLeagueStandings(League league);
}
