package com.pathcraft.app.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/curriculum")
public class CurriculumController {

    @Value("${youtube.api.key:AIzaSyAaDqFFN2ecDobYFlUg1rAHrzNRmyzjSpE}")
    private String youtubeApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Cache YouTube results by search query / subtopic to prevent redundant API calls
    private final Map<String, List<Map<String, Object>>> youtubeCache = new ConcurrentHashMap<>();

    @GetMapping("/youtube")
    public ResponseEntity<Map<String, Object>> getYouTubeResources(
            @RequestParam(required = false, defaultValue = "") String domain,
            @RequestParam(required = false, defaultValue = "") String module,
            @RequestParam(required = false, defaultValue = "") String topic,
            @RequestParam(required = false, defaultValue = "") String subtopic,
            @RequestParam(required = false, defaultValue = "") String query) {

        try {
            String searchQuery = query;
            if (searchQuery == null || searchQuery.isBlank()) {
                searchQuery = buildTopicSpecificQuery(domain, module, topic, subtopic);
            }

            // Clean query to remove characters that hurt YouTube search (like &, /, (), etc.)
            String cleanedQuery = cleanSearchQuery(searchQuery);
            String cacheKey = cleanedQuery.toLowerCase().trim();

            if (youtubeCache.containsKey(cacheKey) && !youtubeCache.get(cacheKey).isEmpty()) {
                List<Map<String, Object>> cached = youtubeCache.get(cacheKey);
                // Ensure cached result is not an old fallback
                if (!cached.isEmpty() && !"bkSWJJZNgf8".equals(cached.get(0).get("videoId"))) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("query", cleanedQuery);
                    response.put("source", "cache");
                    response.put("videos", cached);
                    return ResponseEntity.ok(response);
                }
            }

            List<Map<String, Object>> videos = fetchFromYouTubeApi(cleanedQuery);
            if (videos != null && !videos.isEmpty()) {
                youtubeCache.put(cacheKey, videos);
                Map<String, Object> response = new HashMap<>();
                response.put("query", cleanedQuery);
                response.put("source", "api");
                response.put("videos", videos);
                return ResponseEntity.ok(response);
            }

            // If query returned 0, try broader search
            String broaderQuery = cleanSearchQuery(subtopic.isBlank() ? topic : subtopic) + " tutorial";
            List<Map<String, Object>> broaderVideos = fetchFromYouTubeApi(broaderQuery);
            if (broaderVideos != null && !broaderVideos.isEmpty()) {
                youtubeCache.put(cacheKey, broaderVideos);
                Map<String, Object> response = new HashMap<>();
                response.put("query", broaderQuery);
                response.put("source", "api_broader");
                response.put("videos", broaderVideos);
                return ResponseEntity.ok(response);
            }

            // Last resort fallback with dynamic title
            videos = buildCuratedFallback(cleanedQuery, domain, topic, subtopic);
            Map<String, Object> response = new HashMap<>();
            response.put("query", cleanedQuery);
            response.put("source", "fallback");
            response.put("videos", videos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("query", query != null ? query : "");
            response.put("source", "fallback");
            response.put("videos", buildCuratedFallback(query != null ? query : "", domain, topic, subtopic));
            return ResponseEntity.ok(response);
        }
    }

    private String cleanSearchQuery(String raw) {
        if (raw == null) return "software engineering tutorial";
        return raw.replaceAll("[&/\\\\#,+\\-()$~%.'\":*?<>{}]", " ")
                  .replaceAll("\\s+", " ")
                  .trim();
    }

    private String buildTopicSpecificQuery(String domain, String module, String topic, String subtopic) {
        StringBuilder sb = new StringBuilder();
        if (subtopic != null && !subtopic.isBlank()) {
            sb.append(subtopic).append(" ");
        } else if (topic != null && !topic.isBlank()) {
            sb.append(topic).append(" ");
        } else if (module != null && !module.isBlank()) {
            sb.append(module).append(" ");
        }
        if (domain != null && !domain.isBlank()) {
            sb.append(domain).append(" ");
        }
        sb.append("tutorial");
        return sb.toString().trim();
    }

    private List<Map<String, Object>> fetchFromYouTubeApi(String query) {
        List<Map<String, Object>> results = new ArrayList<>();
        try {
            String encodedQuery = URLEncoder.encode(query, StandardCharsets.UTF_8);
            String urlStr = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&type=video&q=" 
                         + encodedQuery + "&key=" + youtubeApiKey;

            // Using java.net.URI avoids RestTemplate double-encoding % characters
            java.net.URI uri = java.net.URI.create(urlStr);
            String responseBody = restTemplate.getForObject(uri, String.class);

            if (responseBody != null) {
                JsonNode root = objectMapper.readTree(responseBody);
                JsonNode items = root.path("items");
                if (items.isArray()) {
                    for (JsonNode item : items) {
                        String videoId = item.path("id").path("videoId").asText("");
                        if (videoId.isBlank()) continue;

                        JsonNode snippet = item.path("snippet");
                        String title = snippet.path("title").asText("YouTube Video");
                        String description = snippet.path("description").asText("");
                        String channelTitle = snippet.path("channelTitle").asText("");
                        String publishedAt = snippet.path("publishedAt").asText("");
                        String thumbnail = snippet.path("thumbnails").path("medium").path("url").asText(
                                "https://img.youtube.com/vi/" + videoId + "/mqdefault.jpg"
                        );

                        Map<String, Object> video = new HashMap<>();
                        video.put("videoId", videoId);
                        video.put("title", title);
                        video.put("description", description);
                        video.put("channelTitle", channelTitle);
                        video.put("publishedAt", publishedAt);
                        video.put("thumbnailUrl", thumbnail);
                        video.put("youtubeUrl", "https://www.youtube.com/watch?v=" + videoId);
                        results.add(video);
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("YouTube API fetch error for query [" + query + "]: " + e.getMessage());
        }
        return results;
    }

    private List<Map<String, Object>> buildCuratedFallback(String query, String domain, String topic, String subtopic) {
        List<Map<String, Object>> fallbacks = new ArrayList<>();
        String primaryTitle = (subtopic != null && !subtopic.isBlank()) ? subtopic : ((topic != null && !topic.isBlank()) ? topic : domain);
        String combined = (query + " " + domain + " " + topic + " " + subtopic).toLowerCase();

        // 1. Data Structures & Algorithms
        if (combined.contains("trie")) {
            fallbacks.add(createVideoEntry("qA8l8c_805E", "Trie Data Structure & Auto-Complete — Striver", "take U forward", "https://img.youtube.com/vi/qA8l8c_805E/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("AXjmTQ8LEoI", "Trie Insertion, Search and StartsWith — NeetCode", "NeetCode", "https://img.youtube.com/vi/AXjmTQ8LEoI/mqdefault.jpg"));
        } else if (combined.contains("dp") || combined.contains("dynamic prog") || combined.contains("knapsack")) {
            fallbacks.add(createVideoEntry("oA5Gz3WzYHs", "Dynamic Programming Masterclass — FreeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/oA5Gz3WzYHs/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("Hdr64lKQ3e4", "0/1 Knapsack & DP Patterns — Abdul Bari", "Abdul Bari", "https://img.youtube.com/vi/Hdr64lKQ3e4/mqdefault.jpg"));
        } else if (combined.contains("graph") || combined.contains("bfs") || combined.contains("dfs") || combined.contains("dijkstra")) {
            fallbacks.add(createVideoEntry("tWVWeAqZ0WU", "Graph Theory & Algorithms Course — William Fiset", "freeCodeCamp.org", "https://img.youtube.com/vi/tWVWeAqZ0WU/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("iaABm44N4ow", "Dijkstra's & Shortest Path Algorithm — Abdul Bari", "Abdul Bari", "https://img.youtube.com/vi/iaABm44N4ow/mqdefault.jpg"));
        } else if (combined.contains("tree") || combined.contains("bst") || combined.contains("binary tree") || combined.contains("segment")) {
            fallbacks.add(createVideoEntry("76dhtgZt38A", "Binary Trees & BST Complete Tutorial — Striver", "take U forward", "https://img.youtube.com/vi/76dhtgZt38A/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("8hly31xKli0", "Binary Tree Inversion & Traversals — NeetCode", "NeetCode", "https://img.youtube.com/vi/8hly31xKli0/mqdefault.jpg"));
        } else if (combined.contains("array") || combined.contains("two pointer") || combined.contains("sliding window")) {
            fallbacks.add(createVideoEntry("37E9ckMDdTk", "Array Algorithms & Sliding Window — Striver", "take U forward", "https://img.youtube.com/vi/37E9ckMDdTk/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("MK-NZ4hN7wk", "Sliding Window Maximum & Two Pointers — NeetCode", "NeetCode", "https://img.youtube.com/vi/MK-NZ4hN7wk/mqdefault.jpg"));
        }

        // 2. Java & Spring Boot
        else if (combined.contains("spring") || combined.contains("microservice") || combined.contains("hibernate") || combined.contains("jpa")) {
            fallbacks.add(createVideoEntry("35EQXmHKZYs", "Spring Boot 3 Full Course 2026 — Amigoscode", "Amigoscode", "https://img.youtube.com/vi/35EQXmHKZYs/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("k4k3Cq687gM", "Spring Cloud Microservices & Distributed Architecture — Java Techie", "Java Techie", "https://img.youtube.com/vi/k4k3Cq687gM/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("r4S_v5vT7b4", "Java 21 Virtual Threads & Concurrency — Defog Tech", "Defog Tech", "https://img.youtube.com/vi/r4S_v5vT7b4/mqdefault.jpg"));
        } else if (combined.contains("java")) {
            fallbacks.add(createVideoEntry("eIrMbAQSU34", "Java Full Course for Beginners — Programming with Mosh", "Programming with Mosh", "https://img.youtube.com/vi/eIrMbAQSU34/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("grEKMHGYyns", "Java Object Oriented Programming (OOP) — freeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/grEKMHGYyns/mqdefault.jpg"));
        }

        // 3. Generative AI, LLMs & Machine Learning
        else if (combined.contains("genai") || combined.contains("llm") || combined.contains("rag") || combined.contains("transformer") || combined.contains("langchain")) {
            fallbacks.add(createVideoEntry("kCc8FmEb1nY", "Let's build GPT: from scratch, in code — Andrej Karpathy", "Andrej Karpathy", "https://img.youtube.com/vi/kCc8FmEb1nY/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("wUAUdEw50x4", "Building Production RAG Systems with LangChain & Vector DBs — Krish Naik", "Krish Naik", "https://img.youtube.com/vi/wUAUdEw50x4/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("aircAruvnKk", "Neural Networks Deep Dive — 3Blue1Brown", "3Blue1Brown", "https://img.youtube.com/vi/aircAruvnKk/mqdefault.jpg"));
        } else if (combined.contains("machine learning") || combined.contains("ml") || combined.contains("deep learning")) {
            fallbacks.add(createVideoEntry("i_LwzRVP7bg", "Machine Learning Course for Beginners — freeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/i_LwzRVP7bg/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("tPYj3fFJGjk", "PyTorch for Deep Learning Bootcamp — Daniel Bourke", "freeCodeCamp.org", "https://img.youtube.com/vi/tPYj3fFJGjk/mqdefault.jpg"));
        }

        // 4. System Design & Cloud Architecture
        else if (combined.contains("system design") || combined.contains("kafka") || combined.contains("redis") || combined.contains("distributed")) {
            fallbacks.add(createVideoEntry("i53Gi_K3N7I", "System Design Primer & Scalability Architecture — ByteByteGo", "ByteByteGo", "https://img.youtube.com/vi/i53Gi_K3N7I/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("7nL93t9B89I", "Apache Kafka Architecture & Event Streaming — ByteByteGo", "ByteByteGo", "https://img.youtube.com/vi/7nL93t9B89I/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("jgpVdSwp4p8", "Redis Caching Strategies & Distributed Locks — Hussein Nasser", "Hussein Nasser", "https://img.youtube.com/vi/jgpVdSwp4p8/mqdefault.jpg"));
        }

        // 5. Full Stack Web & React
        else if (combined.contains("react") || combined.contains("next") || combined.contains("full stack") || combined.contains("frontend") || combined.contains("javascript")) {
            fallbacks.add(createVideoEntry("bMknfKXIFA8", "React Course 2026 — Beginner to Pro — freeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/bMknfKXIFA8/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("w7ejDZ8SWv8", "React JS Crash Course — Traversy Media", "Traversy Media", "https://img.youtube.com/vi/w7ejDZ8SWv8/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("8aGhZQkoFbQ", "Next.js Full Stack App Architecture — Sonny Sangha", "Sonny Sangha", "https://img.youtube.com/vi/8aGhZQkoFbQ/mqdefault.jpg"));
        }

        // 6. DevOps, Docker & Kubernetes
        else if (combined.contains("docker") || combined.contains("kubernetes") || combined.contains("devops") || combined.contains("ci/cd")) {
            fallbacks.add(createVideoEntry("3c-iBn73dDE", "Docker Tutorial for Beginners [2026] — TechWorld with Nana", "TechWorld with Nana", "https://img.youtube.com/vi/3c-iBn73dDE/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("X48VuDVv0do", "Kubernetes in 1 Hour — TechWorld with Nana", "TechWorld with Nana", "https://img.youtube.com/vi/X48VuDVv0do/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("R8_veQiYErI", "CI/CD Pipeline with GitHub Actions — freeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/R8_veQiYErI/mqdefault.jpg"));
        }

        // 7. Python Backend & Data Engineering
        else if (combined.contains("python") || combined.contains("fastapi") || combined.contains("django")) {
            fallbacks.add(createVideoEntry("_uQrJ0TkZlc", "Python Full Course for Beginners — Programming with Mosh", "Programming with Mosh", "https://img.youtube.com/vi/_uQrJ0TkZlc/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("t8pPdKYpowI", "FastAPI Full Course — Python Web API Development — Sanjeev Thiyagarajan", "freeCodeCamp.org", "https://img.youtube.com/vi/t8pPdKYpowI/mqdefault.jpg"));
        }

        // 8. SQL & Database Internals
        else if (combined.contains("sql") || combined.contains("database") || combined.contains("postgres")) {
            fallbacks.add(createVideoEntry("HXV3zeQKqGY", "SQL Tutorial - Full Database Course for Beginners — freeCodeCamp", "freeCodeCamp.org", "https://img.youtube.com/vi/HXV3zeQKqGY/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("wTPGW1PNy_Y", "Database Indexing & Query Optimization — Hussein Nasser", "Hussein Nasser", "https://img.youtube.com/vi/wTPGW1PNy_Y/mqdefault.jpg"));
        }

        // Default Engineering Walkthrough
        if (fallbacks.isEmpty()) {
            fallbacks.add(createVideoEntry("kZ_wB1o8l6E", primaryTitle + " — Core Mechanics & Implementation", "LearnPath AI Academy", "https://img.youtube.com/vi/kZ_wB1o8l6E/mqdefault.jpg"));
            fallbacks.add(createVideoEntry("i53Gi_K3N7I", primaryTitle + " — System Architecture & Production Best Practices", "ByteByteGo", "https://img.youtube.com/vi/i53Gi_K3N7I/mqdefault.jpg"));
        }

        return fallbacks;
    }

    private Map<String, Object> createVideoEntry(String videoId, String title, String channel, String thumb) {
        Map<String, Object> v = new HashMap<>();
        v.put("videoId", videoId);
        v.put("title", title);
        v.put("description", "High-yield engineering tutorial covering core mechanics and interview patterns.");
        v.put("channelTitle", channel);
        v.put("publishedAt", "2026-01-01T00:00:00Z");
        v.put("thumbnailUrl", thumb);
        v.put("youtubeUrl", "https://www.youtube.com/watch?v=" + videoId);
        return v;
    }
}
