package com.musicstreaming.app.dto;

import java.util.UUID;

public record SongResponse(
        UUID id,
        String title,
        String artist,
        String genre,
        int durationSeconds
) {}
