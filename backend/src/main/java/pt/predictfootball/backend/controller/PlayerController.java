package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.PlayerResponse;
import pt.predictfootball.backend.dto.response.PlayerSeasonStatsResponse;
import pt.predictfootball.backend.service.PlayerSeasonStatsService;
import pt.predictfootball.backend.service.PlayerService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/players")
@RequiredArgsConstructor
public class PlayerController {

    private final PlayerService playerService;
    private final PlayerSeasonStatsService playerSeasonStatsService;

    @GetMapping
    public List<PlayerResponse> findAll(@RequestParam(required = false) Long teamId) {
        if (teamId != null) {
            return playerService.findByTeamId(teamId);
        }
        return playerService.findAll();
    }

    @GetMapping("/{id}")
    public PlayerResponse findById(@PathVariable Long id) {
        return playerService.findById(id);
    }

    @GetMapping("/{id}/stats")
    public List<PlayerSeasonStatsResponse> getPlayerStats(
            @PathVariable Long id,
            @RequestParam Long seasonId) {
        return playerSeasonStatsService.findByPlayerAndSeason(id, seasonId);
    }
}
