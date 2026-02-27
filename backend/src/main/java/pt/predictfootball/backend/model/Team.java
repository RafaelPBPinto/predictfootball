package pt.predictfootball.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "team", indexes = {
        @Index(name = "idx_team_external_id", columnList = "externalId")
})
public class Team extends BaseEntity {

    @Column(nullable = false)
    private String name;

    private String shortName;

    private String code;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    private String logoUrl;

    private String venue;

    private Integer founded;

    private String externalId;
}
