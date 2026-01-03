package pt.predictfootball.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlayerDTO {
    private Player player;
    private List<Statistic> statistics;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Player {
        private Long id;
        private String name;
        private String firstname;
        private String lastname;
        private Integer age;
        private Birth birth;
        private String nationality;
        private String height;
        private String weight;
        private Boolean injured;
        private String photo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Birth {
        private String date;
        private String place;
        private String country;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Statistic {
        private TeamInfo team;
        private League league;
        private Games games;
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
    public static class League {
        private Long id;
        private String name;
        private String country;
        private String logo;
        private String flag;
        private Integer season;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Games {
        private String position;
        private Integer number;
    }
}
