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
        
        Map<String, Object> v1 = new HashMap<>();
        v1.put("videoId", "BKorP55Aqvg"); // Professional engineering architecture video
        v1.put("title", primaryTitle + " — Master Engineering Walkthrough");
        v1.put("description", "In-depth engineering deep dive into " + primaryTitle + " covering core mechanics, trade-offs, and implementation.");
        v1.put("channelTitle", "LearnPath AI Academy");
        v1.put("publishedAt", "2026-01-15T00:00:00Z");
        v1.put("thumbnailUrl", "https://img.youtube.com/vi/BKorP55Aqvg/mqdefault.jpg");
        v1.put("youtubeUrl", "https://www.youtube.com/watch?v=BKorP55Aqvg");
        fallbacks.add(v1);
        return fallbacks;
    }
}
