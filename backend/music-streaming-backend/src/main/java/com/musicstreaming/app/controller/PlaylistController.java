package com.musicstreaming.app.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.musicstreaming.app.dto.ErrorResponse;
import com.musicstreaming.app.dto.PlaylistRequest;
import com.musicstreaming.app.dto.PlaylistResponse;
import com.musicstreaming.app.mapper.PlaylistMapper;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.service.PlaylistService;
import com.musicstreaming.app.service.UserService;

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

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping
    public ResponseEntity<?> createPlaylist(@RequestBody PlaylistRequest request) {
        try {
            // Validate playlist name
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                    new ErrorResponse("Playlist name is required")
                );
            }
            
            PlaylistResponse playlist = PlaylistMapper.toResponse(
                    playlistService.createPlaylist(request.getName(), currentUser())
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(playlist);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ErrorResponse("Error creating playlist: " + e.getMessage())
            );
        }
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping
    public List<PlaylistResponse> myPlaylists() {
        return playlistService.getUserPlaylists(currentUser())
                .stream()
                .map(PlaylistMapper::toResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/{playlistId}/songs/{songId}")
    public void addSong(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId
    ) {
        playlistService.addSongToPlaylist(playlistId, songId, currentUser());
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @DeleteMapping("/{playlistId}/songs/{songId}")
    public void removeSong(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId
    ) {
        playlistService.removeSongFromPlaylist(playlistId, songId, currentUser());
    }
}
