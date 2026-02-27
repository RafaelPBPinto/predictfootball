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
@Table(name = "player_season_stats", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"player_id", "season_id", "team_id"})
})
public class PlayerSeasonStats extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "player_id", nullable = false)
    private Player player;

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Column(nullable = false)
    @Builder.Default
    private Integer appearances = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer starts = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer minutesPlayed = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer goals = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer assists = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer penaltyGoals = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer yellowCards = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer redCards = 0;

    private BigDecimal xg;

    private BigDecimal xag;
}
