package com.musicstreaming.app.mapper;

import com.musicstreaming.app.dto.SongResponse;
import com.musicstreaming.app.model.Song;

public class SongMapper {

    public static SongResponse toResponse(Song song) {
        return new SongResponse(
                song.getId(),
                song.getTitle(),
                song.getArtist(),
                song.getGenre(),
                song.getDurationSec()
        );
    }
}
