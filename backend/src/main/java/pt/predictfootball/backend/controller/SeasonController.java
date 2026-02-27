package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.SeasonResponse;
import pt.predictfootball.backend.service.SeasonService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/seasons")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;

    @GetMapping
    public List<SeasonResponse> findAll(@RequestParam(required = false) Long competitionId) {
        if (competitionId != null) {
            return seasonService.findByCompetitionId(competitionId);
        }
        return seasonService.findAll();
    }

    @GetMapping("/{id}")
    public SeasonResponse findById(@PathVariable Long id) {
        return seasonService.findById(id);
    }

    @GetMapping("/current")
    public SeasonResponse findCurrent(@RequestParam Long competitionId) {
        return seasonService.findCurrentByCompetitionId(competitionId);
    }
}
