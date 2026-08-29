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

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
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

    private static final String[] HF_ROUTER_MODELS = {
            "Qwen/Qwen2.5-Coder-32B-Instruct",
            "meta-llama/Llama-3.2-3B-Instruct",
            "mistralai/Mistral-7B-Instruct-v0.3",
            "google/gemma-2-2b-it",
            "microsoft/Phi-3.5-mini-instruct"
    };

    public HuggingFaceService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(20000);
        this.restTemplate = new RestTemplate(factory);
    }

    public String generateChatCompletion(List<Map<String, Object>> messages, String systemInstruction) {
        String effectiveKey = (hfApiKey != null && !hfApiKey.isBlank()) ? hfApiKey : System.getenv("HUGGINGFACE_API_KEY");
        if (effectiveKey == null || effectiveKey.isBlank()) {
            effectiveKey = System.getenv("HF_TOKEN");
        }
        if (effectiveKey == null || effectiveKey.isBlank()) {
            effectiveKey = System.getProperty("huggingface.api.key");
        }

        if (effectiveKey == null || effectiveKey.isBlank()) {
            return null;
        }

        effectiveKey = effectiveKey.trim();

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

        // Method 1: HuggingFace Router OpenAI-compatible chat completion endpoint
        for (String model : HF_ROUTER_MODELS) {
            try {
                String url = "https://router.huggingface.co/hf-inference/v1/chat/completions";
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(effectiveKey);

                Map<String, Object> payload = new HashMap<>();
                payload.put("model", model);
                payload.put("messages", formattedMessages);
                payload.put("max_tokens", 1500);
                payload.put("temperature", 0.7);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode choices = root.path("choices");
                    if (choices.isArray() && choices.size() > 0) {
                        String content = choices.get(0).path("message").path("content").asText("");
                        if (!content.isBlank()) {
                            log.info("HF Router chat generation successful with model: {}", model);
                            return content;
                        }
                    }
                }
            } catch (Exception ex) {
                log.debug("HF Router for {} failed: {}", model, ex.getMessage());
            }
        }

        // Method 2: Direct Serverless Inference API fallback
        String lastUserText = "";
        for (int i = formattedMessages.size() - 1; i >= 0; i--) {
            if ("user".equals(formattedMessages.get(i).get("role"))) {
                lastUserText = formattedMessages.get(i).get("content");
                break;
            }
        }

        if (!lastUserText.isBlank()) {
            String combinedPrompt = (systemInstruction != null ? systemInstruction + "\n\nUser Question: " : "") + lastUserText;
            for (String model : HF_ROUTER_MODELS) {
                try {
                    String url = "https://api-inference.huggingface.co/models/" + model;
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.APPLICATION_JSON);
                    headers.setBearerAuth(effectiveKey);

                    Map<String, Object> payload = new HashMap<>();
                    payload.put("inputs", combinedPrompt);
                    payload.put("parameters", Map.of("max_new_tokens", 1200, "temperature", 0.7, "return_full_text", false));

                    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
                    ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                    if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                        JsonNode root = objectMapper.readTree(response.getBody());
                        if (root.isArray() && root.size() > 0) {
                            String genText = root.get(0).path("generated_text").asText("");
                            if (!genText.isBlank()) {
                                log.info("HF Serverless Inference successful with model: {}", model);
                                return genText;
                            }
                        }
                    }
                } catch (Exception ex) {
                    log.debug("HF Inference API for {} failed: {}", model, ex.getMessage());
                }
            }
        }

        return null;
    }
}
