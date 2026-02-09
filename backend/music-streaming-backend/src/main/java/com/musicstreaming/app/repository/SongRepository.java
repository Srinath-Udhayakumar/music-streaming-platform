package com.musicstreaming.app.repository;

import com.musicstreaming.app.model.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface SongRepository extends JpaRepository<Song, UUID> {

    @Query("SELECT s FROM Song s WHERE s.active = true ORDER BY s.createdAt DESC")
    List<Song> findAllActive();

    List<Song> findByArtistIgnoreCaseAndActiveTrue(String artist);

    List<Song> findByTitleContainingIgnoreCaseAndActiveTrue(String title);

    List<Song> findByGenreIgnoreCaseAndActiveTrue(String genre);
}
