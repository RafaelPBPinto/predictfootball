package pt.predictfootball.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class TeamStatistics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int possession;
    private int shots;
    private int shotsOnTarget;
    private int corners;
    private int fouls;
    private int yellowCards;
    private int redCards;
    private int passes;
    private int passAccuracy;
}
