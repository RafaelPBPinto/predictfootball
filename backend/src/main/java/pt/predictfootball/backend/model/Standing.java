package pt.predictfootball.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "standing", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"season_id", "team_id"})
}, indexes = {
        @Index(name = "idx_standing_season_position", columnList = "season_id, position")
})
public class Standing extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(nullable = false)
    private Integer position;

    @Column(nullable = false)
    @Builder.Default
    private Integer played = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer won = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer drawn = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer lost = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goalsFor = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goalsAgainst = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goalDifference = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer points = 0;

    private String form;
}
