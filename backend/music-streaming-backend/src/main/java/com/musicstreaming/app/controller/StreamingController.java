package com.musicstreaming.app.controller;

import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.repository.SongRepository;
import com.musicstreaming.app.repository.UserRepository;
import com.musicstreaming.app.service.StreamingAccessService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@RestController
@RequestMapping("/api/stream")
public class StreamingController {

    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final StreamingAccessService streamingAccessService;

    public StreamingController(
            SongRepository songRepository,
            UserRepository userRepository,
            StreamingAccessService streamingAccessService
    ) {
        this.songRepository = songRepository;
        this.userRepository = userRepository;
        this.streamingAccessService = streamingAccessService;
    }

    @GetMapping("/songs/{id}")
    public ResponseEntity<byte[]> streamSong(
            @PathVariable UUID id,
            HttpServletRequest request
    ) throws IOException {

        // 1️⃣ Fetch song
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Song not found"));

        // 2️⃣ Get authenticated user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        UUID userId = UUID.fromString(authentication.getName());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Authorization check (IMPORTANT)
        if (!streamingAccessService.userHasAccess(song, user)) {
            throw new AccessDeniedException("No access to this song");
        }

        // 4️⃣ Prepare audio file
        Path audioPath = Paths.get(song.getAudioPath());
        long fileSize = Files.size(audioPath);

        String rangeHeader = request.getHeader(HttpHeaders.RANGE);

        // 5️⃣ No Range header → full file (rare but valid)
        if (rangeHeader == null) {
            byte[] fullFile = Files.readAllBytes(audioPath);
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(fileSize)
                    .body(fullFile);
        }

        // 6️⃣ Handle HTTP Range (Partial Content)
        String[] ranges = rangeHeader.replace("bytes=", "").split("-");
        long start = Long.parseLong(ranges[0]);
        long end = (ranges.length > 1 && !ranges[1].isEmpty())
                ? Long.parseLong(ranges[1])
                : fileSize - 1;

        if (end >= fileSize) {
            end = fileSize - 1;
        }

        long contentLength = end - start + 1;
        byte[] data = new byte[(int) contentLength];

        try (RandomAccessFile file =
                     new RandomAccessFile(audioPath.toFile(), "r")) {
            file.seek(start);
            file.readFully(data);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_RANGE,
                "bytes " + start + "-" + end + "/" + fileSize);
        headers.set(HttpHeaders.ACCEPT_RANGES, "bytes");
        headers.setContentLength(contentLength);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(data, headers, HttpStatus.PARTIAL_CONTENT);
    }
}
