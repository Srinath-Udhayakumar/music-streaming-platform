package com.musicstreaming.app.dto;

import java.util.UUID;

public record SongResponse(
        UUID id,
        String title,
        String artist,
        String album,
        String genre,
        int durationSeconds,
        String audioPath,
        String coverPath
) {}
