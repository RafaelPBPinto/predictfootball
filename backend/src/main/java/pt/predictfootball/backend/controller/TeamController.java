package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.model.Player;
import pt.predictfootball.backend.model.Team;
import pt.predictfootball.backend.repository.PlayerRepository;
import pt.predictfootball.backend.repository.TeamRepository;

import java.util.List;

@RestController
@RequestMapping("teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;

    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/country/{country}")
    public ResponseEntity<List<Team>> getTeamsByCountry(@PathVariable String country) {
        return ResponseEntity.ok(teamRepository.findByCountry(country));
    }

    @GetMapping("/{id}/players")
    public ResponseEntity<List<Player>> getTeamPlayers(@PathVariable Long id) {
        return teamRepository.findById(id)
                .map(team -> ResponseEntity.ok(playerRepository.findByCurrentTeam(team)))
                .orElse(ResponseEntity.notFound().build());
    }
}
