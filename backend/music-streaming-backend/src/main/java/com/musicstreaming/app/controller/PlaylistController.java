package com.musicstreaming.app.controller;

import com.musicstreaming.app.model.Playlist;
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
    public Playlist createPlaylist(@RequestParam String name) {
        return playlistService.createPlaylist(name, currentUser());
    }

    @GetMapping
    public List<Playlist> myPlaylists() {
        return playlistService.getUserPlaylists(currentUser());
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
