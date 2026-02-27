package pt.predictfootball.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.predictfootball.backend.dto.response.CountryResponse;
import pt.predictfootball.backend.service.CountryService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/countries")
@RequiredArgsConstructor
public class CountryController {

    private final CountryService countryService;

    @GetMapping
    public List<CountryResponse> findAll() {
        return countryService.findAll();
    }

    @GetMapping("/{id}")
    public CountryResponse findById(@PathVariable Long id) {
        return countryService.findById(id);
    }

    @GetMapping("/code/{code}")
    public CountryResponse findByCode(@PathVariable String code) {
        return countryService.findByCode(code);
    }
}
