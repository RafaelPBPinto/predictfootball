package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.CompetitionResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.CompetitionMapper;
import pt.predictfootball.backend.repository.CompetitionRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompetitionService {

    private final CompetitionRepository competitionRepository;

    public List<CompetitionResponse> findAll() {
        return competitionRepository.findAll().stream()
                .map(CompetitionMapper::toResponse)
                .toList();
    }

    public CompetitionResponse findById(Long id) {
        return competitionRepository.findById(id)
                .map(CompetitionMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Competition", id));
    }

    public List<CompetitionResponse> findByCountryId(Long countryId) {
        return competitionRepository.findByCountryId(countryId).stream()
                .map(CompetitionMapper::toResponse)
                .toList();
    }
}
