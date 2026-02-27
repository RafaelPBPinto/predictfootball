package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.CompetitionResponse;
import pt.predictfootball.backend.service.CompetitionService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/competitions")
@RequiredArgsConstructor
public class CompetitionController {

    private final CompetitionService competitionService;

    @GetMapping
    public List<CompetitionResponse> findAll(@RequestParam(required = false) Long countryId) {
        if (countryId != null) {
            return competitionService.findByCountryId(countryId);
        }
        return competitionService.findAll();
    }

    @GetMapping("/{id}")
    public CompetitionResponse findById(@PathVariable Long id) {
        return competitionService.findById(id);
    }
}
