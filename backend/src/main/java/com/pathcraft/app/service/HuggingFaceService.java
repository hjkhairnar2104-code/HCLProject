package com.pathcraft.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HuggingFaceService {

    private static final Logger log = LoggerFactory.getLogger(HuggingFaceService.class);

    @Value("${huggingface.api.key:${HUGGINGFACE_API_KEY:}}")
    private String hfApiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String[] HF_MODELS = {
            "Qwen/Qwen2.5-Coder-32B-Instruct",
            "meta-llama/Llama-3.2-3B-Instruct",
            "mistralai/Mistral-7B-Instruct-v0.3",
            "microsoft/Phi-3.5-mini-instruct"
    };

    public HuggingFaceService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(20000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String generateChatCompletion(List<Map<String, Object>> messages, String systemInstruction) {
        if (hfApiKey == null || hfApiKey.isBlank()) {
            return null;
        }

        List<Map<String, String>> formattedMessages = new ArrayList<>();
        if (systemInstruction != null && !systemInstruction.isBlank()) {
            formattedMessages.add(Map.of("role", "system", "content", systemInstruction));
        }

        for (Map<String, Object> msg : messages) {
            String role = String.valueOf(msg.getOrDefault("role", "user"));
            String text = String.valueOf(msg.getOrDefault("text", msg.getOrDefault("content", "")));
            if (text.isBlank()) continue;

            String hfRole = ("assistant".equalsIgnoreCase(role) || "ai".equalsIgnoreCase(role) || "model".equalsIgnoreCase(role))
                    ? "assistant" : "user";
            formattedMessages.add(Map.of("role", hfRole, "content", text));
        }

        if (formattedMessages.isEmpty()) {
            return null;
        }

        // Try HuggingFace Router OpenAI-compatible endpoint first
        for (String model : HF_MODELS) {
            try {
                String url = "https://router.huggingface.co/hf-inference/v1/chat/completions";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(hfApiKey.trim());

                Map<String, Object> payload = new HashMap<>();
                payload.put("model", model);
                payload.put("messages", formattedMessages);
                payload.put("max_tokens", 1024);
                payload.put("temperature", 0.7);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        String content = choices.get(0).path("message").path("content").asText("");
                        if (!content.isBlank()) {
                            log.info("Successfully generated response using HuggingFace model: {}", model);
                            return content;
                        }
                    }
                }
            } catch (Exception ex) {
                log.warn("HuggingFace Router call failed for model {}: {}", model, ex.getMessage());
            }
        }

        return null;
    }
}
