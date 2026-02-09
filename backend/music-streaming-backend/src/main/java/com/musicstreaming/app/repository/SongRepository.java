package com.musicstreaming.app.repository;

import com.musicstreaming.app.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface SongRepository extends JpaRepository<Song, UUID> {
    List<Song> findByArtistIgnoreCase(String artist);
    List<Song> findByTitleContainingIgnoreCase(String title);
    List<Song> findByGenreIgnoreCase(String genre);
}
