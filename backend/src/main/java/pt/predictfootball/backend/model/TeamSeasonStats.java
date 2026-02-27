package pt.predictfootball.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "team_season_stats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"team_id", "season_id"})
})
public class TeamSeasonStats extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @Column(nullable = false)
    @Builder.Default
    private Integer goalsScored = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goalsConceded = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer cleanSheets = 0;

    private BigDecimal avgPossession;

    private BigDecimal shotsPerGame;

    private BigDecimal shotsOnTargetPerGame;

    private BigDecimal passAccuracy;

    private BigDecimal tacklesPerGame;

    private Integer interceptions;

    private BigDecimal foulsPerGame;

    private BigDecimal xg;

    private BigDecimal xga;
}
