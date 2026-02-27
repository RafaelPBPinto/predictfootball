package pt.predictfootball.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByExternalId(String externalId);

    List<Team> findByCountryId(Long countryId);
}
