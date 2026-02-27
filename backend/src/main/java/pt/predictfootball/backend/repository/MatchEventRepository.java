package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.MatchEvent;

import java.util.List;

public interface MatchEventRepository extends JpaRepository<MatchEvent, Long> {

    List<MatchEvent> findByMatchIdOrderByMinuteAscExtraMinuteAsc(Long matchId);

    List<MatchEvent> findByPlayerId(Long playerId);
}
