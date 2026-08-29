package com.pathcraft.app.controller;

import com.pathcraft.app.model.UserAccount;
import com.pathcraft.app.repository.UserAccountRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/gamification")
public class GamificationController {

    private final UserAccountRepository userRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    public GamificationController(UserAccountRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(@RequestParam String email) {
        Optional<UserAccount> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        UserAccount user = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "coins", user.getCoins(),
            "badges", parseBadges(user.getBadges())
        ));
    }

    @PostMapping("/reward")
    public ResponseEntity<?> rewardCoins(@RequestBody Map<String, Object> req) {
        String email = (String) req.get("email");
        int amount = (Integer) req.get("amount");
        
        Optional<UserAccount> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        
        UserAccount user = userOpt.get();
        user.setCoins(user.getCoins() + amount);
        
        // Auto-assign badges based on thresholds
        List<String> badges = parseBadges(user.getBadges());
        String newBadge = null;
        if (user.getCoins() >= 100 && !badges.contains("Beginner")) {
            badges.add("Beginner");
            newBadge = "Beginner";
        }
        if (user.getCoins() >= 500 && !badges.contains("Pro")) {
            badges.add("Pro");
            newBadge = "Pro";
        }
        if (user.getCoins() >= 1000 && !badges.contains("Master")) {
            badges.add("Master");
            newBadge = "Master";
        }
        
        try {
            user.setBadges(mapper.writeValueAsString(badges));
        } catch(Exception e) {}
        
        userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
            "success", true, 
            "totalCoins", user.getCoins(),
            "newBadge", newBadge != null ? newBadge : ""
        ));
    }
    
    private List<String> parseBadges(String badgesJson) {
        if (badgesJson == null || badgesJson.isEmpty()) return new ArrayList<>();
        try {
            return mapper.readValue(badgesJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            return new ArrayList<>();
        }
    }
}
