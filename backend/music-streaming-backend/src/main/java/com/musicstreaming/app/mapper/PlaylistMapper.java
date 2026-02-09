package com.musicstreaming.app.mapper;

import com.musicstreaming.app.dto.PlaylistResponse;
import com.musicstreaming.app.dto.SongResponse;
import com.musicstreaming.app.model.Playlist;

import java.util.List;

public class PlaylistMapper {

    public static PlaylistResponse toResponse(Playlist playlist) {

        List<SongResponse> songs = playlist.getSongs()
                .stream()
                .map(ps -> SongMapper.toResponse(ps.getSong()))
                .toList();

        return new PlaylistResponse(
                playlist.getId(),
                playlist.getName(),
                playlist.getCreatedAt(),
                songs
        );
    }
}
