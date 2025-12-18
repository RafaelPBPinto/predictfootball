package pt.predictfootball.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pt.predictfootball.backend.exception.ClubNotFoundException;
import pt.predictfootball.backend.model.Club;
import pt.predictfootball.backend.repo.ClubRepo;

import java.util.List;

@Service
public class ClubService {
    private final ClubRepo clubRepo;

    @Autowired
    public ClubService(ClubRepo clubRepo) {
        this.clubRepo = clubRepo;
    }

    public Club addClub(Club club) {
        return clubRepo.save(club);
    }

    public List<Club> findAllClubs() {
        return clubRepo.findAll();
    }

    public Club updateClub(Club club) {
        return clubRepo.save(club);
    }

    public Club findClubById(Long id) {
        return clubRepo.findClubById(id)
                .orElseThrow(() -> new ClubNotFoundException("Club by id " + id + " not found"));
    }

    public void deleteClub(Long id) {
        clubRepo.deleteClubById(id);
    }
}
