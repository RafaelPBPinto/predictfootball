package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.Match;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findBySeasonId(Long seasonId);

    List<Match> findBySeasonIdAndKickoffBetween(Long seasonId, LocalDateTime start, LocalDateTime end);

    List<Match> findByHomeTeamIdOrAwayTeamId(Long homeTeamId, Long awayTeamId);

    List<Match> findByKickoffBetween(LocalDateTime start, LocalDateTime end);

    Optional<Match> findByExternalId(String externalId);
}
