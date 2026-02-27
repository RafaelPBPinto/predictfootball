package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.CountryResponse;
import pt.predictfootball.backend.model.Country;

public class CountryMapper {

    private CountryMapper() {}

    public static CountryResponse toResponse(Country country) {
        if (country == null) return null;
        return CountryResponse.builder()
                .id(country.getId())
                .name(country.getName())
                .code(country.getCode())
                .flagUrl(country.getFlagUrl())
                .build();
    }
}
