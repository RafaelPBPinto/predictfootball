package pt.predictfootball.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import pt.predictfootball.backend.model.enums.Position;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "player", indexes = {
        @Index(name = "idx_player_external_id", columnList = "externalId")
})
public class Player extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private LocalDate dateOfBirth;

    @ManyToOne
    @JoinColumn(name = "nationality_id")
    private Country nationality;

    @Enumerated(EnumType.STRING)
    private Position position;

    @ManyToOne
    @JoinColumn(name = "current_team_id")
    private Team currentTeam;

    private String photoUrl;

    private Integer height;

    private Integer weight;

    private Integer shirtNumber;

    private String externalId;
}
