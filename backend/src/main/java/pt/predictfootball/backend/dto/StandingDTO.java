package pt.predictfootball.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class StandingDTO {
    private League league;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class League {
        private Long id;
        private String name;
        private String country;
        private String logo;
        private String flag;
        private Integer season;
        private List<List<StandingEntry>> standings;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StandingEntry {
        private Integer rank;
        private TeamInfo team;
        private Integer points;
        private Integer goalsDiff;
        private String group;
        private String form;
        private String status;
        private String description;
        private All all;
        private All home;
        private All away;
        private String update;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TeamInfo {
        private Long id;
        private String name;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class All {
        private Integer played;
        private Integer win;
        private Integer draw;
        private Integer lose;
        private Goals goals;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Goals {
        @JsonProperty("for")
        private Integer goalsFor;
        @JsonProperty("against")
        private Integer goalsAgainst;
    }
}
