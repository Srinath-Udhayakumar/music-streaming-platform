package com.musicstreaming.app.controller;

import com.musicstreaming.app.dto.SongResponse;
import com.musicstreaming.app.mapper.SongMapper;
import com.musicstreaming.app.service.SongService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public List<SongResponse> getAllSongs() {
        return songService.getAllActiveSongs()
                .stream()
                .map(SongMapper::toResponse)
                .toList();
    }


    // USER + ADMIN
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{id}")
    public SongResponse getSong(@PathVariable UUID id) {
        return SongMapper.toResponse(songService.getSongById(id));
    }

    // USER + ADMIN
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/search/artist")
    public List<SongResponse> searchByArtist(@RequestParam String artist) {
        return songService.searchByArtist(artist)
                .stream()
                .map(SongMapper::toResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/search/title")
    public List<SongResponse> searchByTitle(@RequestParam String title) {
        return songService.searchByTitle(title)
                .stream()
                .map(SongMapper::toResponse)
                .toList();
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/search/genre")
    public List<SongResponse> searchByGenre(@RequestParam String genre) {
        return songService.searchByGenre(genre)
                .stream()
                .map(SongMapper::toResponse)
                .toList();
    }
}
