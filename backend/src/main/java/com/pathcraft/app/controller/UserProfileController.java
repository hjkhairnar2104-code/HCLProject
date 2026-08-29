package com.pathcraft.app.controller;

import com.pathcraft.app.model.UserResumeProfile;
import com.pathcraft.app.repository.UserResumeProfileRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/user")
public class UserProfileController {

    private final UserResumeProfileRepository userResumeProfileRepository;

    public UserProfileController(UserResumeProfileRepository userResumeProfileRepository) {
        this.userResumeProfileRepository = userResumeProfileRepository;
    }

    @PostMapping("/resume-save")
    public ResponseEntity<Map<String, Object>> saveResumeProfile(@RequestBody Map<String, Object> request) {
        String userEmail = (String) request.getOrDefault("userEmail", "learner@example.com");
        String fullName = (String) request.getOrDefault("fullName", "Alex Rivera");
        String phone = (String) request.getOrDefault("phone", "+1 (555) 234-5678");
        String location = (String) request.getOrDefault("location", "San Francisco, CA");
        String headline = (String) request.getOrDefault("headline", "Full-Stack Software Engineer & AI Enthusiast");
        String summary = (String) request.getOrDefault("summary", "Experienced software developer specializing in React, Spring Boot, and PyTorch.");
        String skillsJson = (String) request.getOrDefault("skillsJson", "[\"Java\", \"Spring Boot\", \"React\", \"Python\", \"PyTorch\", \"SQL\"]");
        String experienceJson = (String) request.getOrDefault("experienceJson", "[{\"title\":\"Software Engineer Intern\", \"company\":\"Tech Corp\", \"duration\":\"6 mos\"}]");
        String educationJson = (String) request.getOrDefault("educationJson", "[{\"degree\":\"B.S. Computer Science\", \"school\":\"State University\"}]");
        String projectsJson = (String) request.getOrDefault("projectsJson", "[{\"name\":\"PathCraft AI\", \"desc\":\"Personalized Learning Path Engine\"}]");

        Optional<UserResumeProfile> existingOpt = userResumeProfileRepository.findByUserEmail(userEmail);
        UserResumeProfile profile;
        if (existingOpt.isPresent()) {
            profile = existingOpt.get();
            profile.setFullName(fullName);
            profile.setPhone(phone);
            profile.setLocation(location);
            profile.setHeadline(headline);
            profile.setSummary(summary);
            profile.setSkillsJson(skillsJson);
            profile.setExperienceJson(experienceJson);
            profile.setEducationJson(educationJson);
            profile.setProjectsJson(projectsJson);
            profile.setUpdatedAt(LocalDateTime.now());
        } else {
            profile = new UserResumeProfile(
                    UUID.randomUUID().toString(),
                    userEmail,
                    fullName,
                    phone,
                    location,
                    headline,
                    summary,
                    skillsJson,
                    experienceJson,
                    educationJson,
                    projectsJson,
                    LocalDateTime.now()
            );
        }

        userResumeProfileRepository.save(profile);

        Map<String, Object> resp = new HashMap<>();
        resp.put("message", "Naukri-style Detailed Resume Profile saved to database successfully.");
        resp.put("profile", profile);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(@RequestParam(defaultValue = "learner@example.com") String userEmail) {
        Optional<UserResumeProfile> profileOpt = userResumeProfileRepository.findByUserEmail(userEmail);
        if (profileOpt.isPresent()) {
            return ResponseEntity.ok(Map.of("profile", profileOpt.get()));
        }

        // Return default profile for smooth demo
        UserResumeProfile defaultProfile = new UserResumeProfile(
                UUID.randomUUID().toString(),
                userEmail,
                "Alex Rivera",
                "+1 (555) 234-5678",
                "San Francisco, CA",
                "Full-Stack Engineer & AI Specialist",
                "Motivated developer with expertise in Spring Boot, React, and Machine Learning.",
                "[\"Java\", \"Spring Boot\", \"React\", \"Python\", \"PyTorch\", \"Docker\"]",
                "[{\"title\":\"Software Developer\", \"company\":\"InnoTech\", \"duration\":\"2024 - Present\"}]",
                "[{\"degree\":\"B.Tech Computer Science\", \"school\":\"Tech Institute\"}]",
                "[{\"name\":\"PathCraft AI Engine\", \"desc\":\"AI Learning Path Recommender with Skill Gap Radar\"}]",
                LocalDateTime.now()
        );
        userResumeProfileRepository.save(defaultProfile);
        return ResponseEntity.ok(Map.of("profile", defaultProfile));
    }

    @GetMapping("/leetcode-stats")
    public ResponseEntity<Map<String, Object>> getLeetCodeStats(@RequestParam String username) {
        String cleanUser = username.trim();
        if (cleanUser.contains("leetcode.com/u/")) {
            cleanUser = cleanUser.substring(cleanUser.indexOf("leetcode.com/u/") + "leetcode.com/u/".length());
        } else if (cleanUser.contains("leetcode.com/")) {
            cleanUser = cleanUser.substring(cleanUser.indexOf("leetcode.com/") + "leetcode.com/".length());
        }
        cleanUser = cleanUser.replaceAll("[^a-zA-Z0-9_-]", "");

        Map<String, Object> resp = new HashMap<>();
        resp.put("username", cleanUser);

        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            headers.set("Referer", "https://leetcode.com/");

            String gql = "{\"query\":\"query getUserProfile($username: String!) { matchedUser(username: $username) { username submitStats: submitStatsGlobal { acSubmissionNum { difficulty count } } profile { ranking } } userContestRanking(username: $username) { rating globalRanking totalParticipants topPercentage badge { name } } }\",\"variables\":{\"username\":\"" + cleanUser + "\"}}";
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(gql, headers);

            ResponseEntity<Map> gqlResp = restTemplate.postForEntity("https://leetcode.com/graphql", entity, Map.class);
            if (gqlResp.getStatusCode().is2xxSuccessful() && gqlResp.getBody() != null) {
                Map data = (Map) gqlResp.getBody().get("data");
                if (data != null && data.get("matchedUser") != null) {
                    Map matchedUser = (Map) data.get("matchedUser");
                    Map submitStats = (Map) matchedUser.get("submitStats");
                    List<Map<String, Object>> acSubmissionNum = (List<Map<String, Object>>) submitStats.get("acSubmissionNum");
                    
                    int total = 0, easy = 0, medium = 0, hard = 0;
                    for (Map<String, Object> item : acSubmissionNum) {
                        String diff = (String) item.get("difficulty");
                        int count = ((Number) item.get("count")).intValue();
                        if ("All".equalsIgnoreCase(diff)) total = count;
                        else if ("Easy".equalsIgnoreCase(diff)) easy = count;
                        else if ("Medium".equalsIgnoreCase(diff)) medium = count;
                        else if ("Hard".equalsIgnoreCase(diff)) hard = count;
                    }

                    int rank = 0;
                    Map profile = (Map) matchedUser.get("profile");
                    if (profile != null && profile.get("ranking") != null) {
                        rank = ((Number) profile.get("ranking")).intValue();
                    }

                    resp.put("status", "success");
                    resp.put("totalSolved", total);
                    resp.put("easySolved", easy);
                    resp.put("mediumSolved", medium);
                    resp.put("hardSolved", hard);
                    resp.put("ranking", rank);

                    // Contest Ranking
                    Map contestData = (Map) data.get("userContestRanking");
                    if (contestData != null) {
                        if (contestData.get("rating") != null) {
                            resp.put("contestRating", Math.round(((Number) contestData.get("rating")).doubleValue()));
                        }
                        if (contestData.get("globalRanking") != null) {
                            resp.put("contestGlobalRanking", ((Number) contestData.get("globalRanking")).intValue());
                        }
                        if (contestData.get("topPercentage") != null) {
                            resp.put("contestTopPercentage", ((Number) contestData.get("topPercentage")).doubleValue());
                        }
                        if (contestData.get("badge") != null) {
                            Map badge = (Map) contestData.get("badge");
                            if (badge.get("name") != null) {
                                resp.put("contestBadge", badge.get("name"));
                            }
                        }
                    }

                    resp.put("source", "leetcode-live");
                    return ResponseEntity.ok(resp);
                }
            }
        } catch (Exception ignored) {}

        // Fallback to Alfa / Public Proxy
        try {
            org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
            Map fallbackResp = restTemplate.getForObject("https://leetcode-stats-api.herokuapp.com/" + cleanUser, Map.class);
            if (fallbackResp != null && "success".equals(fallbackResp.get("status"))) {
                resp.put("status", "success");
                resp.put("totalSolved", fallbackResp.get("totalSolved"));
                resp.put("easySolved", fallbackResp.get("easySolved"));
                resp.put("mediumSolved", fallbackResp.get("mediumSolved"));
                resp.put("hardSolved", fallbackResp.get("hardSolved"));
                resp.put("ranking", fallbackResp.get("ranking"));
                resp.put("acceptanceRate", fallbackResp.get("acceptanceRate"));
                resp.put("source", "proxy-live");
                return ResponseEntity.ok(resp);
            }
        } catch (Exception ignored) {}

        resp.put("status", "not_found");
        resp.put("message", "Could not query real-time data for " + cleanUser);
        return ResponseEntity.ok(resp);
    }
}
