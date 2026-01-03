package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.model.Standing;
import pt.predictfootball.backend.repository.LeagueRepository;
import pt.predictfootball.backend.repository.StandingRepository;

import java.util.List;

@RestController
@RequestMapping("/standings")
@RequiredArgsConstructor
public class StandingController {
    private final StandingRepository standingRepository;
    private final LeagueRepository leagueRepository;

    @GetMapping("/league/{leagueId}")
    public ResponseEntity<List<Standing>> getStandingsByLeague(@PathVariable Long leagueId) {
        return leagueRepository.findById(leagueId)
                .map(league -> ResponseEntity.ok(
                        standingRepository.findByLeagueOrderByRankAsc(league)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Standing>> getAllStandings() {
        return ResponseEntity.ok(standingRepository.findAll());
    }
}
