package com.musicstreaming.app.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Path AUDIO_DIR = Path.of("storage/audio");
    private static final Path COVER_DIR = Path.of("storage/covers");

    public FileStorageService() throws IOException {
        Files.createDirectories(AUDIO_DIR);
        Files.createDirectories(COVER_DIR);
    }

    public String storeAudio(MultipartFile audioFile) throws IOException {
        String originalName = Objects.requireNonNullElse(
                audioFile.getOriginalFilename(),
                "audio.mp3"
        );

        String filename = UUID.randomUUID() + "_" + originalName;
        Path target = AUDIO_DIR.resolve(filename);

        Files.copy(
                audioFile.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING
        );

        return target.toString();
    }

    public String storeCover(MultipartFile coverImage) throws IOException {
        String originalName = Objects.requireNonNullElse(
                coverImage.getOriginalFilename(),
                "cover.png"
        );

        String filename = UUID.randomUUID() + "_" + originalName;
        Path target = COVER_DIR.resolve(filename);

        Files.copy(
                coverImage.getInputStream(),
                target,
                StandardCopyOption.REPLACE_EXISTING
        );

        return target.toString();
    }
}
