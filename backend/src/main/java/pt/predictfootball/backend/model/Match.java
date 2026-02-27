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
import pt.predictfootball.backend.model.enums.MatchStatus;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "match", indexes = {
        @Index(name = "idx_match_season_kickoff", columnList = "season_id, kickoff"),
        @Index(name = "idx_match_external_id", columnList = "externalId")
})
public class Match extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    private Integer matchday;

    @ManyToOne
    @JoinColumn(name = "home_team_id", nullable = false)
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id", nullable = false)
    private Team awayTeam;

    private Integer homeScore;

    private Integer awayScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status;

    @Column(nullable = false)
    private LocalDateTime kickoff;

    private String venue;

    private String referee;

    private String externalId;
}
