package com.musicstreaming.app.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.musicstreaming.app.dto.AuthResponse;
import com.musicstreaming.app.dto.LoginRequest;
import com.musicstreaming.app.dto.RegisterRequest;
import com.musicstreaming.app.model.Role;
import com.musicstreaming.app.model.User;
import com.musicstreaming.app.repository.UserRepository;
import com.musicstreaming.app.security.jwt.JwtService;

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


    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.password(), user.getEncodedPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user);
        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse register(RegisterRequest request) {
        // Validate email doesn't already exist
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        // Validate password matches confirmation
        if (!request.password().equals(request.confirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Create new user with USER role by default
        String encodedPassword = passwordEncoder.encode(request.password());
        User newUser = new User(
                request.email(),
                encodedPassword,
                Role.USER  // Default role
        );

        userRepository.save(newUser);

        // Generate and return JWT token
        String token = jwtService.generateToken(newUser);
        return new AuthResponse(token, "Bearer");
    }
}
