package pt.predictfootball.backend.mapper;

import pt.predictfootball.backend.dto.response.PlayerResponse;
import pt.predictfootball.backend.model.Player;

public class PlayerMapper {

    private PlayerMapper() {}

    public static PlayerResponse toResponse(Player player) {
        if (player == null) return null;
        return PlayerResponse.builder()
                .id(player.getId())
                .name(player.getName())
                .dateOfBirth(player.getDateOfBirth())
                .nationality(CountryMapper.toResponse(player.getNationality()))
                .position(player.getPosition() != null ? player.getPosition().name() : null)
                .currentTeam(TeamMapper.toResponse(player.getCurrentTeam()))
                .photoUrl(player.getPhotoUrl())
                .height(player.getHeight())
                .weight(player.getWeight())
                .shirtNumber(player.getShirtNumber())
                .build();
    }
}
