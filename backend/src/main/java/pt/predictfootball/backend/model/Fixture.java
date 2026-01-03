package pt.predictfootball.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Fixture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "league_id")
    private League league;

    @ManyToOne
    @JoinColumn(name = "home_team_id")
    private Team homeTeam;

    @ManyToOne
    @JoinColumn(name = "away_team_id")
    private Team awayTeam;

    private int homeScore;
    private int awayScore;

    @Enumerated(EnumType.STRING)
    private FixtureStatus status;

    private LocalDateTime kickoffTime;
    private String venue;
    private String round;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "home_lineup_id")
    private TeamLineup homeLineup;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "away_lineup_id")
    private TeamLineup awayLineup;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "home_statistics_id")
    private TeamStatistics homeStatistics;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "away_statistics_id")
    private TeamStatistics awayStatistics;

    @OneToMany(mappedBy = "fixture", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("fixture-events")
    private List<FixtureEvent> events;

    @Column(unique = true)
    private Long apiFootballId;

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    private Integer elapsed;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
}
