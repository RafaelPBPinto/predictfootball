package pt.predictfootball.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class FixtureEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "fixture_id")
    @JsonBackReference("fixture-events")
    private Fixture fixture;

    @Enumerated(EnumType.STRING)
    private EventType type;

    private int time;
    private String detail;

    @ManyToOne
    @JoinColumn(name = "player_id")
    @JsonIgnoreProperties("currentTeam")
    private Player player;

    @ManyToOne
    @JoinColumn(name = "assist_player_id")
    @JsonIgnoreProperties("currentTeam")
    private Player assistPlayer;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;
}
