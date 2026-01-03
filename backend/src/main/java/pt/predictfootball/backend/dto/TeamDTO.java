package pt.predictfootball.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class TeamDTO {
    private Team team;
    private Venue venue;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Team {
        private Long id;
        private String name;
        private String code;
        private String country;
        private Integer founded;
        private Boolean national;
        private String logo;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Venue {
        private Long id;
        private String name;
        private String address;
        private String city;
        private Integer capacity;
        private String surface;
        private String image;
    }
}
