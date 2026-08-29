package com.pathcraft.app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final RestTemplate restTemplate;

    private static final String[] CANDIDATE_MODELS = {
            "gemini-3.1-flash-lite",
            "gemini-3.5-flash-lite",
            "gemini-3.5-flash",
            "gemini-3.1-flash-lite-preview",
            "gemini-2.5-flash",
            "gemini-pro-latest"
    };

    public GeminiService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String generateContent(String prompt) {
        return generateContentWithHistory(List.of(Map.of("role", "user", "text", prompt)), null);
    }

    public String generateContentWithHistory(List<Map<String, Object>> history, String systemInstruction) {
        if (geminiApiKey == null || geminiApiKey.isBlank() || history == null || history.isEmpty()) {
            return "";
        }

        List<Map<String, Object>> contents = new java.util.ArrayList<>();
        for (Map<String, Object> msg : history) {
            String role = String.valueOf(msg.getOrDefault("role", "user"));
            String text = String.valueOf(msg.getOrDefault("text", msg.getOrDefault("content", "")));
            if (text.isBlank()) continue;

            String geminiRole = ("assistant".equalsIgnoreCase(role) || "ai".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role)) ? "model" : "user";
            contents.add(Map.of(
                    "role", geminiRole,
                    "parts", List.of(Map.of("text", text))
            ));
        }

        if (contents.isEmpty()) return "";

        Map<String, Object> requestBody = new java.util.HashMap<>();
        requestBody.put("contents", contents);

        if (systemInstruction != null && !systemInstruction.isBlank()) {
            requestBody.put("systemInstruction", Map.of(
                    "parts", List.of(Map.of("text", systemInstruction))
            ));
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        for (String model : CANDIDATE_MODELS) {
            try {
                String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + geminiApiKey;
                ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
                Map body = response.getBody();
                if (body != null && body.containsKey("candidates")) {
                    List candidates = (List) body.get("candidates");
                    if (!candidates.isEmpty()) {
                        Map candidate = (Map) candidates.get(0);
                        Map content = (Map) candidate.get("content");
                        if (content != null && content.containsKey("parts")) {
                            List parts = (List) content.get("parts");
                            if (!parts.isEmpty()) {
                                Map part = (Map) parts.get(0);
                                String text = (String) part.get("text");
                                if (text != null && !text.isBlank()) {
                                    return text.trim();
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                // Try next candidate model seamlessly
            }
        }
        return "";
    }
}
