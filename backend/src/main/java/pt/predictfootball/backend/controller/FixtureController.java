package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.model.Fixture;
import pt.predictfootball.backend.model.FixtureEvent;
import pt.predictfootball.backend.model.FixtureStatus;
import pt.predictfootball.backend.repository.FixtureEventRepository;
import pt.predictfootball.backend.repository.FixtureRepository;
import pt.predictfootball.backend.repository.LeagueRepository;
import pt.predictfootball.backend.repository.TeamRepository;

import java.util.List;

@RestController
@RequestMapping("/fixtures")
@RequiredArgsConstructor
public class FixtureController {
    private final FixtureRepository fixtureRepository;
    private final LeagueRepository leagueRepository;
    private final TeamRepository teamRepository;
    private final FixtureEventRepository eventRepository;

    @GetMapping
    public ResponseEntity<List<Fixture>> getAllFixtures() {
        return ResponseEntity.ok(fixtureRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fixture> getFixtureById(@PathVariable Long id) {
        return fixtureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<Fixture>> getFixturesByLeague(@PathVariable Long leagueId) {
        return leagueRepository.findById(leagueId)
                .map(league -> ResponseEntity.ok(
                        fixtureRepository.findByLeagueAndStatus(league, null)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<Fixture>> getFixturesByTeam(@PathVariable Long teamId) {
        return teamRepository.findById(teamId)
                .map(team -> ResponseEntity.ok(fixtureRepository.findByTeam(team)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Fixture>> getFixturesByStatus(@PathVariable FixtureStatus status) {
        return ResponseEntity.ok(fixtureRepository.findByStatusOrderByKickoffTimeAsc(status));
    }

    @GetMapping("/live")
    public ResponseEntity<List<Fixture>> getLiveFixtures() {
        return ResponseEntity.ok(fixtureRepository.findByStatusOrderByKickoffTimeAsc(FixtureStatus.LIVE));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<FixtureEvent>> getFixtureEvents(@PathVariable Long id) {
        return fixtureRepository.findById(id)
                .map(fixture -> ResponseEntity.ok(eventRepository.findByFixtureOrderByTimeAsc(fixture)))
                .orElse(ResponseEntity.notFound().build());
    }
}
