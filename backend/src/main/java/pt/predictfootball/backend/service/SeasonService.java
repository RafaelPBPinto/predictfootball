package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.SeasonResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.SeasonMapper;
import pt.predictfootball.backend.repository.SeasonRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;

    public List<SeasonResponse> findAll() {
        return seasonRepository.findAll().stream()
                .map(SeasonMapper::toResponse)
                .toList();
    }

    public SeasonResponse findById(Long id) {
        return seasonRepository.findById(id)
                .map(SeasonMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Season", id));
    }

    public List<SeasonResponse> findByCompetitionId(Long competitionId) {
        return seasonRepository.findByCompetitionId(competitionId).stream()
                .map(SeasonMapper::toResponse)
                .toList();
    }

    public SeasonResponse findCurrentByCompetitionId(Long competitionId) {
        return seasonRepository.findByCompetitionIdAndCurrentTrue(competitionId)
                .map(SeasonMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No current season found for competition: " + competitionId));
    }
}
