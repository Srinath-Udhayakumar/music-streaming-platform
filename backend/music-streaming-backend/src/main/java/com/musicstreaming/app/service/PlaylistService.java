package com.musicstreaming.app.service;

import com.musicstreaming.app.model.Playlist;
import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.repository.PlaylistRepository;
import com.musicstreaming.app.repository.SongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final SongRepository songRepository;

    public PlaylistService(
            PlaylistRepository playlistRepository,
            SongRepository songRepository
    ) {
        this.playlistRepository = playlistRepository;
        this.songRepository = songRepository;
    }

    public Playlist createPlaylist(String name, User owner) {
        Playlist playlist = new Playlist(name, owner);
        return playlistRepository.save(playlist);
    }

    public List<Playlist> getUserPlaylists(User owner) {
        return playlistRepository.findByOwner(owner);
    }

    @Transactional
    public void addSongToPlaylist(UUID playlistId, UUID songId, User user) {

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new IllegalArgumentException("Playlist not found"));

        if (!playlist.getOwner().getId().equals(user.getId())) {
            throw new SecurityException("Not allowed to modify this playlist");
        }

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        int nextPosition = playlist.getSongs().size() + 1;
        playlist.addSong(song, nextPosition);
    }

    @Transactional
    public void removeSongFromPlaylist(UUID playlistId, UUID songId, User user) {

        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new IllegalArgumentException("Playlist not found"));

        if (!playlist.getOwner().getId().equals(user.getId())) {
            throw new SecurityException("Not allowed to modify this playlist");
        }

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song not found"));

        playlist.removeSong(song);
    }
}
