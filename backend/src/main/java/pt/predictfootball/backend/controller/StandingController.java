package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.StandingResponse;
import pt.predictfootball.backend.service.StandingService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/standings")
@RequiredArgsConstructor
public class StandingController {

    private final StandingService standingService;

    @GetMapping
    public List<StandingResponse> findBySeasonId(@RequestParam Long seasonId) {
        return standingService.findBySeasonId(seasonId);
    }
}
