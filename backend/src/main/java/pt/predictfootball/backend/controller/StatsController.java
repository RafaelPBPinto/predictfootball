package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.PlayerSeasonStatsResponse;
import pt.predictfootball.backend.dto.response.TeamSeasonStatsResponse;
import pt.predictfootball.backend.service.PlayerSeasonStatsService;
import pt.predictfootball.backend.service.TeamSeasonStatsService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/stats")
@RequiredArgsConstructor
public class StatsController {

    private final PlayerSeasonStatsService playerSeasonStatsService;
    private final TeamSeasonStatsService teamSeasonStatsService;

    @GetMapping("/players")
    public List<PlayerSeasonStatsResponse> getPlayerStats(
            @RequestParam Long seasonId,
            @RequestParam Long teamId) {
        return playerSeasonStatsService.findBySeasonAndTeam(seasonId, teamId);
    }

    @GetMapping("/teams")
    public TeamSeasonStatsResponse getTeamStats(
            @RequestParam Long teamId,
            @RequestParam Long seasonId) {
        return teamSeasonStatsService.findByTeamAndSeason(teamId, seasonId);
    }
}
