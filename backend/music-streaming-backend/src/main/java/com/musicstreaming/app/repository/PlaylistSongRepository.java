package com.musicstreaming.app.repository;

import com.musicstreaming.app.model.Playlist;
import com.musicstreaming.app.model.PlaylistSong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, UUID> {
    List<PlaylistSong> findByPlaylistOrderByPositionAsc(Playlist playlist);
    void deleteByPlaylistAndSongId(Playlist playlist, UUID songId);
}
