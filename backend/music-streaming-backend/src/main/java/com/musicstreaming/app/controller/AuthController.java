package com.musicstreaming.app.controller;

import com.musicstreaming.app.dto.AuthResponse;
import com.musicstreaming.app.dto.LoginRequest;
import com.musicstreaming.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody @Valid LoginRequest request) {
        return authService.login(request);
    }
}
