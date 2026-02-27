package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.StandingResponse;
import pt.predictfootball.backend.mapper.StandingMapper;
import pt.predictfootball.backend.repository.StandingRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StandingService {

    private final StandingRepository standingRepository;

    public List<StandingResponse> findBySeasonId(Long seasonId) {
        return standingRepository.findBySeasonIdOrderByPositionAsc(seasonId).stream()
                .map(StandingMapper::toResponse)
                .toList();
    }
}
