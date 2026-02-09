package com.musicstreaming.app.service;

import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.repository.SongRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SongService {

    private final SongRepository songRepository;

    public SongService(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    public Song addSong(Song song) {
        return songRepository.save(song);
    }

    public List<Song> getAllActiveSongs() {
        return songRepository.findAll()
                .stream()
                .filter(Song::isActive)
                .toList();
    }

    public Song getSongById(UUID songId) {
        return songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));
    }

    public List<Song> searchByArtist(String artist) {
        return songRepository.findByArtistIgnoreCase(artist);
    }

    public List<Song> searchByTitle(String title) {
        return songRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Song> searchByGenre(String genre) {
        return songRepository.findByGenreIgnoreCase(genre);
    }
}
