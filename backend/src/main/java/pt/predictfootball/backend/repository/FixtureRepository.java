package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.League;
import pt.predictfootball.backend.model.Fixture;
import pt.predictfootball.backend.model.FixtureStatus;
import pt.predictfootball.backend.model.Team;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FixtureRepository extends JpaRepository<Fixture, Long> {
    Optional<Fixture> findByApiFootballId(Long apiFootballId);

    List<Fixture> findByLeagueAndStatus(League league, FixtureStatus status);

    List<Fixture> findByHomeTeamOrAwayTeam(Team homeTeam, Team awayTeam);

    @Query("SELECT m FROM Fixture m WHERE m.homeTeam = :team OR m.awayTeam = :team")
    List<Fixture> findByTeam(Team team);

    @Query("SELECT m FROM Fixture m WHERE (m.homeTeam = :team OR m.awayTeam = :team) " +
            "AND m.status = :status ORDER BY m.kickoffTime DESC")
    List<Fixture> findByTeamAndStatus(Team team, FixtureStatus status);

    List<Fixture> findByLeagueAndKickoffTimeBetween(
            League league,
            LocalDateTime start,
            LocalDateTime end
    );

    List<Fixture> findByStatusOrderByKickoffTimeAsc(FixtureStatus status);

    boolean existsByApiFootballId(Long apiFootballId);
}
