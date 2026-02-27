package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.TeamResponse;
import pt.predictfootball.backend.service.TeamService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping
    public List<TeamResponse> findAll(@RequestParam(required = false) Long countryId) {
        if (countryId != null) {
            return teamService.findByCountryId(countryId);
        }
        return teamService.findAll();
    }

    @GetMapping("/{id}")
    public TeamResponse findById(@PathVariable Long id) {
        return teamService.findById(id);
    }
}
