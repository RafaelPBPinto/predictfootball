package pt.predictfootball.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.dto.response.CountryResponse;
import pt.predictfootball.backend.exception.ResourceNotFoundException;
import pt.predictfootball.backend.mapper.CountryMapper;
import pt.predictfootball.backend.repository.CountryRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CountryService {

    private final CountryRepository countryRepository;

    public List<CountryResponse> findAll() {
        return countryRepository.findAll().stream()
                .map(CountryMapper::toResponse)
                .toList();
    }

    public CountryResponse findById(Long id) {
        return countryRepository.findById(id)
                .map(CountryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Country", id));
    }

    public CountryResponse findByCode(String code) {
        return countryRepository.findByCode(code)
                .map(CountryMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Country not found with code: " + code));
    }
}
