package com.musicstreaming.app.dto;

/**
 * Request DTO for creating a playlist
 */
public class PlaylistRequest {
    private String name;

    public PlaylistRequest() {
    }

    public PlaylistRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
