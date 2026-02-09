package com.musicstreaming.app.service;

import com.musicstreaming.app.dto.AuthResponse;
import com.musicstreaming.app.dto.LoginRequest;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.repository.UserRepository;
import com.musicstreaming.app.security.jwt.JwtService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public void printEncodedPassword() {
        System.out.println("ENCODED = " + passwordEncoder.encode("Admin@12345"));
    }

    @PostConstruct
    public void init() {
        printEncodedPassword();
    }


    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getEncodedPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer");
    }
}
