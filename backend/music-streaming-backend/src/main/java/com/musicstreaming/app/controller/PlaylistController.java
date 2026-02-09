package com.musicstreaming.app.controller;

import com.musicstreaming.app.dto.PlaylistResponse;
import com.musicstreaming.app.mapper.PlaylistMapper;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.service.PlaylistService;
import com.musicstreaming.app.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;
    private final UserService userService;

    public PlaylistController(
            PlaylistService playlistService,
            UserService userService
    ) {
        this.playlistService = playlistService;
        this.userService = userService;
    }

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.getById(UUID.fromString(auth.getName()));
    }

    @PostMapping
    public PlaylistResponse createPlaylist(@RequestParam String name) {
        return PlaylistMapper.toResponse(
                playlistService.createPlaylist(name, currentUser())
        );
    }

    @GetMapping
    public List<PlaylistResponse> myPlaylists() {
        return playlistService.getUserPlaylists(currentUser())
                .stream()
                .map(PlaylistMapper::toResponse)
                .toList();
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public void addSong(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId
    ) {
        playlistService.addSongToPlaylist(playlistId, songId, currentUser());
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public void removeSong(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId
    ) {
        playlistService.removeSongFromPlaylist(playlistId, songId, currentUser());
    }
}
