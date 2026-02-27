package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.PlayerResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.PlayerMapper;
import pt.predictfootball.backend.repository.PlayerRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerResponse> findAll() {
        return playerRepository.findAll().stream()
                .map(PlayerMapper::toResponse)
                .toList();
    }

    public PlayerResponse findById(Long id) {
        return playerRepository.findById(id)
                .map(PlayerMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Player", id));
    }

    public List<PlayerResponse> findByTeamId(Long teamId) {
        return playerRepository.findByCurrentTeamId(teamId).stream()
                .map(PlayerMapper::toResponse)
                .toList();
    }
}
