package pt.predictfootball.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TeamLineup {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String formation;

    @ManyToMany
    @JoinTable(
            name = "lineup_starting_xi",
            joinColumns = @JoinColumn(name = "lineup_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    @JsonIgnoreProperties("currentTeam")
    private List<Player> startingXI;

    @ManyToMany
    @JoinTable(
            name = "lineup_substitutes",
            joinColumns = @JoinColumn(name = "lineup_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    @JsonIgnoreProperties("currentTeam")
    private List<Player> substitutes;
}
