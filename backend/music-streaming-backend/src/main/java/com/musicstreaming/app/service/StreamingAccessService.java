package com.musicstreaming.app.service;

import com.musicstreaming.app.model.Role;
import com.musicstreaming.app.model.Song;
import com.musicstreaming.app.model.User;
import org.springframework.stereotype.Service;

@Service
public class StreamingAccessService {

    /**
     * Centralized authorization logic for audio streaming.
     * This is intentionally isolated from controller logic.
     */
    public boolean userHasAccess(Song song, User user) {

        // ADMIN → full access
        if (user.getRole() == Role.ADMIN) {
            return true;
        }

        // NORMAL USER → currently full access
        // (later you can restrict previews, subscriptions, etc.)
        if (user.getRole() == Role.USER) {
            return true;
        }

        return false;
    }
}
