package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.model.*;
import pt.predictfootball.backend.service.DataPopulationService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/populate")
@RequiredArgsConstructor
@Slf4j
public class DataPopulationController {
    private final DataPopulationService populationService;

    @PostMapping("/league/{leagueId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populateLeague(
            @PathVariable Long leagueId,
            @PathVariable int season
    ) {
        log.info("Request to populate league {} for season {}", leagueId, season);

        try {
            League league = populationService.populateLeague(leagueId, season);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "League populated successfully");
            response.put("league", league);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error populating league: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/teams/league/{leagueId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populateTeams(
            @PathVariable Long leagueId,
            @PathVariable int season) {

        log.info("Request to populate teams for league {} season {}", leagueId, season);

        try {
            List<Team> teams = populationService.populateTeamsForLeague(leagueId, season);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Teams populated successfully");
            response.put("count", teams.size());
            response.put("teams", teams);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error populating teams: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/players/team/{teamId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populatePlayers(
            @PathVariable Long teamId,
            @PathVariable int season) {

        log.info("Request to populate players for team {} season {}", teamId, season);

        try {
            List<Player> players = populationService.populatePlayersForTeam(teamId, season);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Players populated successfully");
            response.put("count", players.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error populating players: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/fixtures/league/{leagueId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populateFixtures(
            @PathVariable Long leagueId,
            @PathVariable int season) {

        log.info("Request to populate fixtures for league {} season {}", leagueId, season);

        try {
            List<Fixture> fixtures = populationService.populateFixturesForLeague(leagueId, season);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Fixtures populated successfully");
            response.put("count", fixtures.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error populating fixtures: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/standings/league/{leagueId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populateStandings(
            @PathVariable Long leagueId,
            @PathVariable int season) {

        log.info("Request to populate standings for league {} season {}", leagueId, season);

        try {
            List<Standing> standings = populationService.populateStandingsForLeague(leagueId, season);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Standings populated successfully");
            response.put("count", standings.size());
            response.put("standings", standings);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error populating standings: ", e);
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/full-league/{leagueId}/season/{season}")
    public ResponseEntity<Map<String, Object>> populateFullLeague(
            @PathVariable Long leagueId,
            @PathVariable int season) {

        log.info("Request to fully populate league {} for season {}", leagueId, season);

        Map<String, Object> results = new HashMap<>();

        try {
            // 1. Populate League
            League league = populationService.populateLeague(leagueId, season);
            results.put("league", "Populated: " + league.getName());

            // 2. Populate Teams
            List<Team> teams = populationService.populateTeamsForLeague(leagueId, season);
            results.put("teams", "Populated " + teams.size() + " teams");

            // 3. Populate Players for each team
            int totalPlayers = 0;
            for (Team team : teams) {
                try {
                    List<Player> players = populationService.populatePlayersForTeam(team.getApiFootballId(), season);
                    totalPlayers += players.size();
                    Thread.sleep(500); // Avoid rate limiting
                } catch (Exception e) {
                    log.warn("Could not populate players for team {}: {}", team.getName(), e.getMessage());
                }
            }
            results.put("players", "Populated " + totalPlayers + " players");

            // 4. Populate Fixtures
            //List<Fixture> fixtures = populationService.populateFixturesForLeague(leagueId, season);
            //results.put("fixtures", "Populated " + fixtures.size() + " fixtures");

            // 5. Populate Standings
            //List<Standing> standings = populationService.populateStandingsForLeague(leagueId, season);
            //results.put("standings", "Populated " + standings.size() + " standings");

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Full league population completed");
            response.put("results", results);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in full population: ", e);
            results.put("error", e.getMessage());

            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Partial completion - some errors occurred");
            error.put("results", results);

            return ResponseEntity.badRequest().body(error);
        }
    }
}
