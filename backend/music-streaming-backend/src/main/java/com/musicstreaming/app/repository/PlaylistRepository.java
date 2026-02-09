package com.musicstreaming.app.repository;

import com.musicstreaming.app.model.Playlist;
import com.musicstreaming.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {

    List<Playlist> findByOwner(User owner);
}
