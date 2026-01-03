package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.model.League;
import pt.predictfootball.backend.repository.LeagueRepository;

import java.util.List;

@RestController
@RequestMapping("/leagues")
@RequiredArgsConstructor
public class LeagueController {
    private final LeagueRepository leagueRepository;

    @GetMapping
    public ResponseEntity<List<League>> getAllLeagues() {
        return ResponseEntity.ok(leagueRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<League> getLeagueById(@PathVariable Long id) {
        return leagueRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<League>> getLeaguesByCountry(@PathVariable String country) {
        return ResponseEntity.ok(leagueRepository.findByCountry(country));
    }

    @GetMapping("/season/{season}")
    public ResponseEntity<List<League>> getLeaguesBySeason(@PathVariable int season) {
        return ResponseEntity.ok(leagueRepository.findBySeason(season));
    }
}
