package com.musicstreaming.app.model;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Entity
@Table(
        name = "songs",
        indexes = {
                @Index(name = "idx_songs_title", columnList = "title"),
                @Index(name = "idx_songs_artist", columnList = "artist")
        }
)
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 255)
    private String artist;

    @Column(length = 255)
    private String album;

    @Column(length = 100)
    private String genre;

    @Column(name = "duration_sec", nullable = false)
    private int durationSec;

    @Column(name = "audio_path", nullable = false)
    private String audioPath;

    @Column(name = "cover_path")
    private String coverPath;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Song() {
        // JPA only
    }

    /**
     * Domain constructor — used by ADMIN uploads only
     */
    public Song(
            String title,
            String artist,
            String album,
            String genre,
            int durationSec,
            String audioPath,
            String coverPath
    ) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Song title is required");
        }
        if (artist == null || artist.isBlank()) {
            throw new IllegalArgumentException("Artist is required");
        }
        if (durationSec <= 0) {
            throw new IllegalArgumentException("Song duration must be positive");
        }
        if (audioPath == null || audioPath.isBlank()) {
            throw new IllegalArgumentException("Audio path is required");
        }

        this.title = title;
        this.artist = artist;
        this.album = album;
        this.genre = genre;
        this.durationSec = durationSec;
        this.audioPath = audioPath;
        this.coverPath = coverPath;
        this.active = true;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Explicit domain behavior (future-safe)
    public void deactivate() {
        this.active = false;
    }
}
