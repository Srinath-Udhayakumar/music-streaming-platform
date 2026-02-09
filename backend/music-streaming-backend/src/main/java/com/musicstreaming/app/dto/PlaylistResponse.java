package com.musicstreaming.app.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PlaylistResponse(
        UUID id,
        String name,
        LocalDateTime createdAt,
        List<SongResponse> songs
) {}
