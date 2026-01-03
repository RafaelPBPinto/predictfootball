package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pt.predictfootball.backend.model.*;

import java.util.List;

@Repository
public interface FixtureEventRepository extends JpaRepository<FixtureEvent, Long> {
    List<FixtureEvent> findByFixtureOrderByTimeAsc(Fixture fixture);

    List<FixtureEvent> findByFixtureAndType(Fixture fixture, EventType type);

    List<FixtureEvent> findByPlayerOrderByFixtureDesc(Player player);

    @Query("SELECT e FROM FixtureEvent e WHERE e.fixture = :fixture AND e.team = :team " +
            "ORDER BY e.time ASC")
    List<FixtureEvent> findByFixtureAndTeam(Fixture fixture, Team team);
}
