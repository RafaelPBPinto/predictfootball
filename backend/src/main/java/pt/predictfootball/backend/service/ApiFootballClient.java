package pt.predictfootball.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import pt.predictfootball.backend.dto.*;

import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class ApiFootballClient {
    @Value("${apifootball.api.key}")
    private String apiKey;

    @Value("${apifootball.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public ApiFootballClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-apisports-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    private <T> ApiFootballResponse<T> makeRequest(String endpoint, Map<String, String> params, ParameterizedTypeReference<ApiFootballResponse<T>> typeRef) {
        try {
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(apiUrl + endpoint);

            if (params != null) {
                params.forEach(builder::queryParam);
            }

            String url = builder.toUriString();
            log.info("Making API request to: {}", url);

            HttpEntity<?> entity = new HttpEntity<>(createHeaders());
            ResponseEntity<ApiFootballResponse<T>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    entity,
                    typeRef
            );

            ApiFootballResponse<T> body = response.getBody();

            if (body != null && body.getErrors() != null && !body.getErrors().isEmpty()) {
                log.error("API returned errors: {}", body.getErrors());
            }

            return body;
        } catch (Exception e) {
            log.error("Error making API request to {}: {}", endpoint, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch data from API Football", e);
        }
    }

    public ApiFootballResponse<LeagueDTO> getLeagues(String country, Integer season) {
        Map<String, String> params = new HashMap<>();
        if (country != null) params.put("country", country);
        if (season != null) params.put("season", season.toString());

        return makeRequest("/leagues", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<LeagueDTO> getLeagueById(Long leagueId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("id", leagueId.toString());
        if (season != null) params.put("season", season.toString());

        return makeRequest("/leagues", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<TeamDTO> getTeamsByLeague(Long leagueId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("league", leagueId.toString());
        params.put("season", season.toString());

        return makeRequest("/teams", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<TeamDTO> getTeamById(Long teamId) {
        Map<String, String> params = new HashMap<>();
        params.put("id", teamId.toString());

        return makeRequest("/teams", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<FixtureDTO> getFixturesByLeagueAndSeason(Long leagueId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("league", leagueId.toString());
        params.put("season", season.toString());

        return makeRequest("/fixtures", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<FixtureDTO> getFixturesByTeam(Long teamId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("team", teamId.toString());
        params.put("season", season.toString());

        return makeRequest("/fixtures", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<FixtureDTO> getFixtureById(Long fixtureId) {
        Map<String, String> params = new HashMap<>();
        params.put("id", fixtureId.toString());

        return makeRequest("/fixtures", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<FixtureDTO> getLiveFixtures() {
        Map<String, String> params = new HashMap<>();
        params.put("live", "all");

        return makeRequest("/fixtures", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<StandingDTO> getStandings(Long leagueId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("league", leagueId.toString());
        params.put("season", season.toString());

        return makeRequest("/standings", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<PlayerDTO> getPlayersByTeam(Long teamId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("team", teamId.toString());
        params.put("season", season.toString());

        return makeRequest("/players", params,
                new ParameterizedTypeReference<>() {});
    }

    public ApiFootballResponse<PlayerDTO> getPlayerById(Long playerId, Integer season) {
        Map<String, String> params = new HashMap<>();
        params.put("id", playerId.toString());
        params.put("season", season.toString());

        return makeRequest("/players", params,
                new ParameterizedTypeReference<>() {});
    }
}
