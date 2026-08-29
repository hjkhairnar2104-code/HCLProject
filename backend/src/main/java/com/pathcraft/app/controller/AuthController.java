package com.pathcraft.app.controller;

import com.pathcraft.app.model.UserAccount;
import com.pathcraft.app.repository.UserAccountRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final UserAccountRepository userAccountRepository;

    public AuthController(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String fullName = request.get("fullName");
        String password = request.get("password");

        if (email == null || email.isBlank() || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Valid email address is required"));
        }

        String cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail.endsWith("@gmail.com")) {
            log.warn("Signup rejected: email '{}' is not a @gmail.com address", cleanEmail);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Access Restricted: Only official @gmail.com email addresses are allowed to register."
            ));
        }

        if (password == null || password.trim().length() < 4) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 4 characters"));
        }

        Optional<UserAccount> existing = userAccountRepository.findByEmail(cleanEmail);
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", "An account with this email already exists. Please switch to Login."
            ));
        }

        String cleanName = (fullName != null && !fullName.isBlank()) ? fullName.trim() : cleanEmail.split("@")[0];
        UserAccount newUser = new UserAccount(
                UUID.randomUUID().toString(),
                cleanEmail,
                cleanName,
                password.trim(),
                null,
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
                LocalDateTime.now()
        );
        userAccountRepository.save(newUser);

        log.info("New user successfully registered: email='{}', name='{}'", cleanEmail, cleanName);

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Registration successful! Welcome to LearnPath AI.");
        resp.put("user", newUser);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        String cleanEmail = email.trim().toLowerCase();
        if (!cleanEmail.endsWith("@gmail.com")) {
            log.warn("Login rejected: email '{}' is not a @gmail.com address", cleanEmail);
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Access Restricted: Only official @gmail.com email addresses are allowed to sign in."
            ));
        }

        if (password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password is required"));
        }

        Optional<UserAccount> userOpt = userAccountRepository.findByEmail(cleanEmail);

        if (userOpt.isEmpty()) {
            log.warn("Login failed: User with email '{}' is not registered.", cleanEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                    "error", "No registered account found for this email. Please Sign Up / Register first."
            ));
        }

        UserAccount user = userOpt.get();
        if (user.getPassword() != null && !user.getPassword().equals(password.trim())) {
            log.warn("Login failed: Incorrect password for email '{}'", cleanEmail);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "error", "Invalid password. Please check your credentials and try again."
            ));
        }

        log.info("User successfully logged in: email='{}'", cleanEmail);
        return ResponseEntity.ok(Map.of(
                "message", "Welcome back, " + user.getFullName() + "!",
                "user", user
        ));
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, Object>> googleAuth(@RequestBody Map<String, String> request) {
        String email = request.getOrDefault("email", "google.user@example.com").trim().toLowerCase();
        String fullName = request.getOrDefault("fullName", "Google Learner");
        String googleId = request.getOrDefault("googleId", "google-oauth2-sub-991203");

        Optional<UserAccount> existing = userAccountRepository.findByEmail(email);
        UserAccount user;
        if (existing.isPresent()) {
            user = existing.get();
        } else {
            user = new UserAccount(
                    UUID.randomUUID().toString(),
                    email,
                    fullName,
                    "google_oauth_pass",
                    googleId,
                    "https://lh3.googleusercontent.com/a/default-user=s96-c",
                    LocalDateTime.now()
            );
            userAccountRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Google authentication successful", "user", user));
    }
}
