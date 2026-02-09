package com.musicstreaming.app.service;

import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.repository.SongRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Service
public class AdminSongService {

    private final SongRepository songRepository;
    private final FileStorageService fileStorageService;

    public AdminSongService(
            SongRepository songRepository,
            FileStorageService fileStorageService
    ) {
        this.songRepository = songRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public Song uploadSong(
            String title,
            String artist,
            String album,
            String genre,
            int durationSec,
            MultipartFile audioFile,
            MultipartFile coverImage
    ) throws IOException {

        String audioPath = fileStorageService.storeAudio(audioFile);

        String coverPath = null;
        if (coverImage != null && !coverImage.isEmpty()) {
            coverPath = fileStorageService.storeCover(coverImage);
        }

        Song song = new Song(
                title,
                artist,
                album,
                genre,
                durationSec,
                audioPath,
                coverPath
        );

        return songRepository.save(song);
    }

    public void deleteSong(UUID id) {
        songRepository.deleteById(id);
    }
}
