package com.musicstreaming.app.dto;

public record AuthResponse(
        String token,
        String tokenType
) {}
