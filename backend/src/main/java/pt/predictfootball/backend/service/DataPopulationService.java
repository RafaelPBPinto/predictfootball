package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pt.predictfootball.backend.dto.*;
import pt.predictfootball.backend.model.*;
import pt.predictfootball.backend.repository.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DataPopulationService {
    private final ApiFootballClient apiClient;
    private final LeagueRepository leagueRepository;
    private final TeamRepository teamRepository;
    private final PlayerRepository playerRepository;
    private final FixtureRepository fixtureRepository;
    private final StandingRepository standingRepository;

    @Transactional
    public League populateLeague(Long apiLeagueId, int season) {
        log.info("Populating league {} for season {}", apiLeagueId, season);

        ApiFootballResponse<LeagueDTO> response = apiClient.getLeagueById(apiLeagueId, season);

        if (response.getResponse() == null || response.getResponse().isEmpty()) {
            throw new RuntimeException("League not found: " + apiLeagueId);
        }

        LeagueDTO leagueDTO = response.getResponse().getFirst();

        return leagueRepository.findByApiFootballIdAndSeason(apiLeagueId, season)
                .map(existing -> updateLeague(existing, leagueDTO, season))
                .orElseGet(() -> createLeague(leagueDTO, season));
    }

    private League createLeague(LeagueDTO dto, int season) {
        League league = League.builder()
                .apiFootballId(dto.getLeague().getId())
                .name(dto.getLeague().getName())
                .country(dto.getCountry().getName())
                .logo(dto.getLeague().getLogo())
                .season(season)
                .build();

        return leagueRepository.save(league);
    }

    private League updateLeague(League league, LeagueDTO dto, int season) {
        league.setName(dto.getLeague().getName());
        league.setCountry(dto.getCountry().getName());
        league.setLogo(dto.getLeague().getLogo());
        league.setSeason(season);
        return leagueRepository.save(league);
    }

    @Transactional
    public List<Team> populateTeamsForLeague(Long apiLeagueId, int season) {
        log.info("Populating teams for league {} season {}", apiLeagueId, season);

        ApiFootballResponse<TeamDTO> response = apiClient.getTeamsByLeague(apiLeagueId, season);

        List<Team> teams = new ArrayList<>();

        if (response.getResponse() != null) {
            for (TeamDTO teamDTO : response.getResponse()) {
                Team team = teamRepository.findByApiFootballId(teamDTO.getTeam().getId())
                        .map(existing -> updateTeam(existing, teamDTO))
                        .orElseGet(() -> createTeam(teamDTO));
                teams.add(team);
            }
        }

        return teams;
    }

    private Team createTeam(TeamDTO dto) {
        Team team = Team.builder()
                .apiFootballId(dto.getTeam().getId())
                .name(dto.getTeam().getName())
                .shortName(dto.getTeam().getName()) // API doesn't provide short name
                .abbreviation(dto.getTeam().getCode())
                .logo(dto.getTeam().getLogo())
                .country(dto.getTeam().getCountry())
                .stadium(dto.getVenue() != null ? dto.getVenue().getName() : null)
                .foundedYear(dto.getTeam().getFounded() != null ? dto.getTeam().getFounded() : 0)
                .build();

        return teamRepository.save(team);
    }

    private Team updateTeam(Team team, TeamDTO dto) {
        team.setName(dto.getTeam().getName());
        team.setAbbreviation(dto.getTeam().getCode());
        team.setLogo(dto.getTeam().getLogo());
        team.setCountry(dto.getTeam().getCountry());
        if (dto.getVenue() != null) {
            team.setStadium(dto.getVenue().getName());
        }
        if (dto.getTeam().getFounded() != null) {
            team.setFoundedYear(dto.getTeam().getFounded());
        }
        return teamRepository.save(team);
    }

    @Transactional
    public List<Player> populatePlayersForTeam(Long apiTeamId, int season) {
        log.info("Populating players for team {} season {}", apiTeamId, season);

        ApiFootballResponse<PlayerDTO> response = apiClient.getPlayersByTeam(apiTeamId, season);

        Team team = teamRepository.findByApiFootballId(apiTeamId)
                .orElseThrow(() -> new RuntimeException("Team not found: " + apiTeamId));

        List<Player> players = new ArrayList<>();

        if (response.getResponse() != null) {
            for (PlayerDTO playerDTO : response.getResponse()) {
                Player player = playerRepository.findByApiFootballId(playerDTO.getPlayer().getId())
                        .map(existing -> updatePlayer(existing, playerDTO, team))
                        .orElseGet(() -> createPlayer(playerDTO, team));
                players.add(player);
            }
        }

        return players;
    }

    private Player createPlayer(PlayerDTO dto, Team team) {
        LocalDate birthDate = null;
        if (dto.getPlayer().getBirth() != null && dto.getPlayer().getBirth().getDate() != null) {
            try {
                birthDate = LocalDate.parse(dto.getPlayer().getBirth().getDate());
            } catch (Exception e) {
                log.warn("Could not parse birth date: {}", dto.getPlayer().getBirth().getDate());
            }
        }

        String position = null;
        Integer number = null;

        if (dto.getStatistics() != null && !dto.getStatistics().isEmpty()) {
            PlayerDTO.Statistic stat = dto.getStatistics().getFirst();
            if (stat.getGames() != null) {
                position = stat.getGames().getPosition();
                number = stat.getGames().getNumber();
            }
        }

        Player player = Player.builder()
                .apiFootballId(dto.getPlayer().getId())
                .name(dto.getPlayer().getName())
                .position(position)
                .nationality(dto.getPlayer().getNationality())
                .birthDate(birthDate)
                .image(dto.getPlayer().getPhoto())
                .currentTeam(team)
                .build();

        return playerRepository.save(player);
    }

    private Player updatePlayer(Player player, PlayerDTO dto, Team team) {
        player.setName(dto.getPlayer().getName());
        player.setNationality(dto.getPlayer().getNationality());
        player.setImage(dto.getPlayer().getPhoto());
        player.setCurrentTeam(team);

        if (dto.getPlayer().getBirth() != null && dto.getPlayer().getBirth().getDate() != null) {
            try {
                player.setBirthDate(LocalDate.parse(dto.getPlayer().getBirth().getDate()));
            } catch (Exception e) {
                log.warn("Could not parse birth date: {}", dto.getPlayer().getBirth().getDate());
            }
        }

        if (dto.getStatistics() != null && !dto.getStatistics().isEmpty()) {
            PlayerDTO.Statistic stat = dto.getStatistics().getFirst();
            if (stat.getGames() != null) {
                player.setPosition(stat.getGames().getPosition());
            }
        }

        return playerRepository.save(player);
    }

    @Transactional
    public List<Fixture> populateFixturesForLeague(Long apiLeagueId, int season) {
        log.info("Populating fixtures for league {} season {}", apiLeagueId, season);

        League league = leagueRepository.findByApiFootballIdAndSeason(apiLeagueId, season)
                .orElseThrow(() -> new RuntimeException("League not found: " + apiLeagueId));

        ApiFootballResponse<FixtureDTO> response = apiClient.getFixturesByLeagueAndSeason(apiLeagueId, season);

        List<Fixture> fixtures = new ArrayList<>();

        if (response.getResponse() != null) {
            for (FixtureDTO fixtureDTO : response.getResponse()) {
                Fixture fixture = fixtureRepository.findByApiFootballId(fixtureDTO.getFixture().getId())
                        .map(existing -> updateFixture(existing, fixtureDTO))
                        .orElseGet(() -> createFixture(fixtureDTO, league));
                fixtures.add(fixture);
            }
        }

        return fixtures;
    }

    private Fixture createFixture(FixtureDTO dto, League league) {
        Team homeTeam = teamRepository.findByApiFootballId(dto.getTeams().getHome().getId())
                .orElseThrow(() -> new RuntimeException("Home team not found: " + dto.getTeams().getHome().getId()));

        Team awayTeam = teamRepository.findByApiFootballId(dto.getTeams().getAway().getId())
                .orElseThrow(() -> new RuntimeException("Away team not found: " + dto.getTeams().getAway().getId()));

        LocalDateTime kickoffTime = LocalDateTime.ofInstant(
                Instant.ofEpochSecond(dto.getFixture().getTimestamp()),
                ZoneId.systemDefault()
        );

        Fixture fixture = Fixture.builder()
                .apiFootballId(dto.getFixture().getId())
                .league(league)
                .homeTeam(homeTeam)
                .awayTeam(awayTeam)
                .homeScore(dto.getGoals().getHome() != null ? dto.getGoals().getHome() : 0)
                .awayScore(dto.getGoals().getAway() != null ? dto.getGoals().getAway() : 0)
                .status(mapStatus(dto.getFixture().getStatus().getShortStatus()))
                .kickoffTime(kickoffTime)
                .venue(dto.getFixture().getVenue().getName())
                .round(dto.getLeague().getRound())
                .elapsed(dto.getFixture().getStatus().getElapsed())
                .build();

        return fixtureRepository.save(fixture);
    }

    private Fixture updateFixture(Fixture fixture, FixtureDTO dto) {
        fixture.setHomeScore(dto.getGoals().getHome() != null ? dto.getGoals().getHome() : 0);
        fixture.setAwayScore(dto.getGoals().getAway() != null ? dto.getGoals().getAway() : 0);
        fixture.setStatus(mapStatus(dto.getFixture().getStatus().getShortStatus()));
        fixture.setElapsed(dto.getFixture().getStatus().getElapsed());
        fixture.setRound(dto.getLeague().getRound());
        return fixtureRepository.save(fixture);
    }

    private FixtureStatus mapStatus(String apiStatus) {
        return switch (apiStatus) {
            case "TBD", "NS" -> FixtureStatus.SCHEDULED;
            case "1H", "2H", "ET", "P", "LIVE" -> FixtureStatus.LIVE;
            case "HT" -> FixtureStatus.HALFTIME;
            case "FT", "AET", "PEN" -> FixtureStatus.FINISHED;
            case "PST" -> FixtureStatus.POSTPONED;
            case "CANC", "ABD" -> FixtureStatus.CANCELLED;
            default -> FixtureStatus.SCHEDULED;
        };
    }

    @Transactional
    public List<Standing> populateStandingsForLeague(Long apiLeagueId, int season) {
        log.info("Populating standings for league {} season {}", apiLeagueId, season);

        League league = leagueRepository.findByApiFootballIdAndSeason(apiLeagueId, season)
                .orElseThrow(() -> new RuntimeException("League not found: " + apiLeagueId));

        // Delete existing standings for this league
        standingRepository.deleteByLeague(league);

        ApiFootballResponse<StandingDTO> response = apiClient.getStandings(apiLeagueId, season);

        List<Standing> standings = new ArrayList<>();

        if (response.getResponse() != null && !response.getResponse().isEmpty()) {
            StandingDTO standingDTO = response.getResponse().getFirst();

            if (standingDTO.getLeague().getStandings() != null &&
                    !standingDTO.getLeague().getStandings().isEmpty()) {

                List<StandingDTO.StandingEntry> entries = standingDTO.getLeague().getStandings().getFirst();

                for (StandingDTO.StandingEntry entry : entries) {
                    Team team = teamRepository.findByApiFootballId(entry.getTeam().getId())
                            .orElseThrow(() -> new RuntimeException("Team not found: " + entry.getTeam().getId()));

                    Standing standing = Standing.builder()
                            .team(team)
                            .league(league)
                            .rank(entry.getRank())
                            .playedGames(entry.getAll().getPlayed())
                            .won(entry.getAll().getWin())
                            .draw(entry.getAll().getDraw())
                            .lost(entry.getAll().getLose())
                            .points(entry.getPoints())
                            .goalsFor(entry.getAll().getGoals().getGoalsFor())
                            .goalsAgainst(entry.getAll().getGoals().getGoalsAgainst())
                            .form(entry.getForm())
                            .build();

                    standings.add(standingRepository.save(standing));
                }
            }
        }

        return standings;
    }
}
