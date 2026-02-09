package com.musicstreaming.app.controller;

import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.service.AdminSongService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/songs")
@PreAuthorize("hasRole('ADMIN')")
public class AdminSongController {

    // Check
    private final AdminSongService adminSongService;

    public AdminSongController(AdminSongService adminSongService) {
        this.adminSongService = adminSongService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Song uploadSong(
            @RequestParam String title,
            @RequestParam String artist,
            @RequestParam(required = false) String album,
            @RequestParam String genre,
            @RequestParam int durationSec,
            @RequestParam MultipartFile audioFile,
            @RequestParam(required = false) MultipartFile coverImage
    ) throws IOException {

        return adminSongService.uploadSong(
                title,
                artist,
                album,
                genre,
                durationSec,
                audioFile,
                coverImage
        );
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable UUID id) {
        adminSongService.deleteSong(id);
    }
}
