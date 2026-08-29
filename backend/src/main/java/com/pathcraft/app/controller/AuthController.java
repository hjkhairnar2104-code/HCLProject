package com.pathcraft.app.controller;

import com.pathcraft.app.model.UserAccount;
import com.pathcraft.app.model.UserLearningProfile;
import com.pathcraft.app.repository.UserAccountRepository;
import com.pathcraft.app.repository.UserLearningProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserAccountRepository userAccountRepository;
    private final UserLearningProfileRepository userLearningProfileRepository;

    public AuthController(UserAccountRepository userAccountRepository,
                          UserLearningProfileRepository userLearningProfileRepository) {
        this.userAccountRepository = userAccountRepository;
        this.userLearningProfileRepository = userLearningProfileRepository;
    }

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<Map<String, Object>> registerUser(@RequestBody Map<String, Object> request) {
        String email = String.valueOf(request.getOrDefault("email", "")).trim().toLowerCase();
        String fullName = String.valueOf(request.getOrDefault("fullName", "")).trim();
        String password = String.valueOf(request.getOrDefault("password", "")).trim();
        String targetRole = String.valueOf(request.getOrDefault("targetRole", "Software Engineer")).trim();

        if (email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (fullName.isBlank()) {
            fullName = email.split("@")[0];
        }

        Optional<UserAccount> existing = userAccountRepository.findByEmail(email);
        UserAccount account;
        if (existing.isPresent()) {
            account = existing.get();
            account.setFullName(fullName);
            if (!password.isBlank()) account.setPassword(password);
        } else {
            account = new UserAccount(
                    UUID.randomUUID().toString(),
                    email,
                    fullName,
                    password,
                    null,
                    "https://api.dicebear.com/7.x/bottts/svg?seed=" + email,
                    LocalDateTime.now()
            );
        }

        userAccountRepository.save(account);

        // Also ensure learning profile exists for user in Supabase
        Optional<UserLearningProfile> profileOpt = userLearningProfileRepository.findByUserEmail(email);
        if (profileOpt.isEmpty()) {
            UserLearningProfile profile = UserLearningProfile.builder()
                    .id(UUID.randomUUID().toString())
                    .userEmail(email)
                    .fullName(fullName)
                    .targetRole(targetRole)
                    .overallReadinessPercentage(15.0)
                    .currentStreakDays(1)
                    .totalCoins(10)
                    .profileCompleted(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            userLearningProfileRepository.save(profile);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User registered and synced to Supabase database successfully.");
        response.put("user", Map.of(
                "id", account.getId(),
                "email", account.getEmail(),
                "fullName", account.getFullName(),
                "targetRole", targetRole,
                "streakDays", account.getCoins() + 1
        ));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody Map<String, Object> request) {
        String email = String.valueOf(request.getOrDefault("email", "")).trim().toLowerCase();
        String password = String.valueOf(request.getOrDefault("password", "")).trim();

        if (email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }

        Optional<UserAccount> accountOpt = userAccountRepository.findByEmail(email);
        UserAccount account;

        if (accountOpt.isPresent()) {
            account = accountOpt.get();
            if (account.getPassword() != null && !account.getPassword().isBlank() && !account.getPassword().equals(password)) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid password for " + email));
            }
        } else {
            // Auto-provision account on first login
            account = new UserAccount(
                    UUID.randomUUID().toString(),
                    email,
                    email.split("@")[0],
                    password,
                    null,
                    "https://api.dicebear.com/7.x/bottts/svg?seed=" + email,
                    LocalDateTime.now()
            );
            userAccountRepository.save(account);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login verified with database.");
        response.put("user", Map.of(
                "id", account.getId(),
                "email", account.getEmail(),
                "fullName", account.getFullName(),
                "targetRole", "Software Engineer"
        ));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all-users")
    public ResponseEntity<Map<String, Object>> getAllUsers() {
        List<UserAccount> users = userAccountRepository.findAll();
        return ResponseEntity.ok(Map.of(
                "totalUsers", users.size(),
                "users", users
        ));
    }
}
