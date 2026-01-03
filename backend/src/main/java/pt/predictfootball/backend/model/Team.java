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
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String name;
    private String shortName;
    private String abbreviation;
    private String logo;
    private String country;
    private String stadium;
    private int foundedYear;

    @OneToMany(mappedBy = "currentTeam")
    @JsonManagedReference("team-players")
    private List<Player> currentSquad;

    @Column(unique = true)
    private Long apiFootballId; // External API ID

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;

    @PrePersist
    @PreUpdate
    public void updateTimestamp() {
        this.lastUpdated = LocalDateTime.now();
    }
}
