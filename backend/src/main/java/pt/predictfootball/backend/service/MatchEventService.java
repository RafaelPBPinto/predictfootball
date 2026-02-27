package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.MatchEventResponse;
import pt.predictfootball.backend.mapper.MatchEventMapper;
import pt.predictfootball.backend.repository.MatchEventRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchEventService {

    private final MatchEventRepository matchEventRepository;

    public List<MatchEventResponse> findByMatchId(Long matchId) {
        return matchEventRepository.findByMatchIdOrderByMinuteAscExtraMinuteAsc(matchId).stream()
                .map(MatchEventMapper::toResponse)
                .toList();
    }
}
