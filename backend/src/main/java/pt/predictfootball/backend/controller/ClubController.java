package pt.predictfootball.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pt.predictfootball.backend.model.Club;
import pt.predictfootball.backend.service.ClubService;

import java.util.List;

@RestController
@RequestMapping("/club")
public class ClubController {
    private final ClubService clubService;

    public ClubController(ClubService clubService) {
        this.clubService = clubService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Club>> getAllClubs() {
        List<Club> clubs = clubService.findAllClubs();
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }

    @GetMapping("/find/{id}")
    public ResponseEntity<Club> getClubById(@PathVariable Long id) {
        Club club = clubService.findClubById(id);
        return new ResponseEntity<>(club, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Club> addClub(@RequestBody Club club) {
        Club newClub = clubService.addClub(club);
        return new ResponseEntity<>(newClub, HttpStatus.CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Club> updateClub(@RequestBody Club club) {
        Club updatedClub = clubService.updateClub(club);
        return new ResponseEntity<>(updatedClub, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
