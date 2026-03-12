package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.MatchEventResponse;
import pt.predictfootball.backend.dto.response.MatchResponse;
import pt.predictfootball.backend.service.MatchEventService;
import pt.predictfootball.backend.service.MatchService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;
    private final MatchEventService matchEventService;

    @GetMapping
    public List<MatchResponse> findAll(
            @RequestParam(required = false) Long seasonId,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (seasonId != null && date != null) {
            return matchService.findBySeasonIdAndDate(seasonId, date);
        }
        if (seasonId != null) {
            return matchService.findBySeasonId(seasonId);
        }
        if (teamId != null) {
            return matchService.findByTeamId(teamId);
        }
        if (date != null) {
            return matchService.findByDate(date);
        }
        return matchService.findAll();
    }

    @GetMapping("/{id}")
    public MatchResponse findById(@PathVariable Long id) {
        return matchService.findById(id);
    }

    @GetMapping("/{id}/events")
    public List<MatchEventResponse> getMatchEvents(@PathVariable Long id) {
        return matchEventService.findByMatchId(id);
    }
}
