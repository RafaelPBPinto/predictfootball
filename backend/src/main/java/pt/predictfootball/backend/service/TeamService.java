package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.TeamResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.TeamMapper;
import pt.predictfootball.backend.repository.TeamRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;

    public List<TeamResponse> findAll() {
        return teamRepository.findAll().stream()
                .map(TeamMapper::toResponse)
                .toList();
    }

    public TeamResponse findById(Long id) {
        return teamRepository.findById(id)
                .map(TeamMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Team", id));
    }

    public List<TeamResponse> findByCountryId(Long countryId) {
        return teamRepository.findByCountryId(countryId).stream()
                .map(TeamMapper::toResponse)
                .toList();
    }
}
