package pt.predictfootball.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class LeagueDTO {
    private League league;
    private Country country;
    private List<Season> seasons;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class League {
        private Long id;
        private String name;
        private String type;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Country {
        private String name;
        private String code;
        private String flag;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Season {
        private int year;
        private String start;
        private String end;
        private boolean current;
    }
}
