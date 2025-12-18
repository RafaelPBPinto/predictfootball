package pt.predictfootball.backend.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.predictfootball.backend.model.Club;

import java.util.Optional;

public interface ClubRepo extends JpaRepository<Club, Long> {
    void deleteClubById(Long id);

    Optional<Club> findClubById(Long id);
}
