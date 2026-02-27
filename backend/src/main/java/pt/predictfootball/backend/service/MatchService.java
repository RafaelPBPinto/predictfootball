package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.MatchResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.MatchMapper;
import pt.predictfootball.backend.repository.MatchRepository;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final MatchRepository matchRepository;

    public List<MatchResponse> findAll() {
        return matchRepository.findAll().stream()
                .map(MatchMapper::toResponse)
                .toList();
    }

    public MatchResponse findById(Long id) {
        return matchRepository.findById(id)
                .map(MatchMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Match", id));
    }

    public List<MatchResponse> findBySeasonId(Long seasonId) {
        return matchRepository.findBySeasonId(seasonId).stream()
                .map(MatchMapper::toResponse)
                .toList();
    }

    public List<MatchResponse> findBySeasonIdAndDate(Long seasonId, LocalDate date) {
        return matchRepository.findBySeasonIdAndKickoffBetween(
                        seasonId, date.atStartOfDay(), date.plusDays(1).atStartOfDay()).stream()
                .map(MatchMapper::toResponse)
                .toList();
    }

    public List<MatchResponse> findByTeamId(Long teamId) {
        return matchRepository.findByHomeTeamIdOrAwayTeamId(teamId, teamId).stream()
                .map(MatchMapper::toResponse)
                .toList();
    }
}
