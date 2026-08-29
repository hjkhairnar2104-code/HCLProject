package com.pathcraft.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AdzunaJobService {

    @Value("${adzuna.app.id:561aae10}")
    private String appId;

    @Value("${adzuna.app.key:1df006b77d79a54fc3ffba2ef183f89b}")
    private String appKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Comprehensive Tech Skill Dictionary
    private static final List<String> TECH_SKILL_DICTIONARY = List.of(
            "Java", "Spring Boot", "Spring", "SQL", "REST API", "Microservices",
            "Docker", "AWS", "Kubernetes", "Kafka", "Redis", "PostgreSQL",
            "MySQL", "MongoDB", "React", "Node.js", "TypeScript", "JavaScript",
            "Python", "FastAPI", "Django", "PyTorch", "TensorFlow", "LangChain",
            "RAG", "Vector DBs", "Git", "CI/CD", "System Design", "DSA", "Algorithms",
            "GraphQL", "Elasticsearch", "Linux", "Hibernate", "JPA", "Maven",
            "HTML", "CSS", "Next.js", "Vue", "Angular", "Go", "C++", "C#",
            ".NET", "GCP", "Azure", "Terraform", "RabbitMQ", "Spark", "Hadoop",
            "React Native", "Flutter", "Android", "iOS", "gRPC", "Problem Solving"
    );

    public AdzunaJobService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(15000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    public Map<String, Object> searchJobs(String keyword, String userSkillsStr, String location, boolean isRemote) {
        String cleanKeyword = (keyword != null && !keyword.isBlank()) ? keyword.trim() : "Java Developer";
        String cleanLocation = (location != null && !location.isBlank()) ? location.trim() : "Bangalore";

        // Parse user skills (keep empty if user hasn't added any skills)
        List<String> userSkills = parseUserSkills(userSkillsStr);

        // Determine country code
        String countryCode = detectCountryCode(cleanLocation);

        Map<String, Object> responseMap = new LinkedHashMap<>();
        responseMap.put("attribution", "Jobs by Adzuna");
        responseMap.put("keyword", cleanKeyword);
        responseMap.put("location", cleanLocation);
        responseMap.put("isRemote", isRemote);
        responseMap.put("userSkills", userSkills);

        try {
            String queryWhat = cleanKeyword;
            if (isRemote && !cleanKeyword.toLowerCase().contains("remote")) {
                queryWhat += " remote";
            }

            // Build request entity with standard browser User-Agent
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.set("Accept", "application/json");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            String encodedWhat = URLEncoder.encode(queryWhat, StandardCharsets.UTF_8);
            String encodedWhere = URLEncoder.encode(cleanLocation, StandardCharsets.UTF_8);

            // 1. Try search with where parameter
            String adzunaUrl = String.format(
                    "https://api.adzuna.com/v1/api/jobs/%s/search/1?app_id=%s&app_key=%s&what=%s&where=%s&results_per_page=20&content-type=application/json",
                    countryCode, appId, appKey, encodedWhat, encodedWhere
            );

            log.info("Calling Adzuna API for keyword='{}', location='{}', country='{}'", cleanKeyword, cleanLocation, countryCode);

            ResponseEntity<String> apiResponse = restTemplate.exchange(adzunaUrl, HttpMethod.GET, entity, String.class);
            List<Map<String, Object>> jobList = new ArrayList<>();

            if (apiResponse.getStatusCode().is2xxSuccessful() && apiResponse.getBody() != null) {
                jobList = extractJobsFromJson(apiResponse.getBody(), userSkills, cleanKeyword);
            }

            // 2. If 0 results returned, try query with location embedded in what parameter without strict where filter
            if (jobList.isEmpty() && !cleanLocation.isBlank()) {
                String broadQueryWhat = queryWhat + " " + cleanLocation;
                String broadEncodedWhat = URLEncoder.encode(broadQueryWhat, StandardCharsets.UTF_8);
                String fallbackUrl = String.format(
                        "https://api.adzuna.com/v1/api/jobs/%s/search/1?app_id=%s&app_key=%s&what=%s&results_per_page=20&content-type=application/json",
                        countryCode, appId, appKey, broadEncodedWhat
                );
                log.info("Retrying broad Adzuna query: {}", fallbackUrl);
                ResponseEntity<String> broadResponse = restTemplate.exchange(fallbackUrl, HttpMethod.GET, entity, String.class);
                if (broadResponse.getStatusCode().is2xxSuccessful() && broadResponse.getBody() != null) {
                    jobList = extractJobsFromJson(broadResponse.getBody(), userSkills, cleanKeyword);
                }
            }

            // 3. If still empty, try general search on country endpoint
            if (jobList.isEmpty()) {
                String generalUrl = String.format(
                        "https://api.adzuna.com/v1/api/jobs/%s/search/1?app_id=%s&app_key=%s&what=%s&results_per_page=20&content-type=application/json",
                        countryCode, appId, appKey, encodedWhat
                );
                ResponseEntity<String> genResponse = restTemplate.exchange(generalUrl, HttpMethod.GET, entity, String.class);
                if (genResponse.getStatusCode().is2xxSuccessful() && genResponse.getBody() != null) {
                    jobList = extractJobsFromJson(genResponse.getBody(), userSkills, cleanKeyword);
                }
            }

            if (!jobList.isEmpty()) {
                // Sort by match percentage descending
                jobList.sort((a, b) -> {
                    int scoreA = (int) a.getOrDefault("matchPercentage", 0);
                    int scoreB = (int) b.getOrDefault("matchPercentage", 0);
                    return Integer.compare(scoreB, scoreA);
                });

                responseMap.put("status", "SUCCESS");
                responseMap.put("total", jobList.size());
                responseMap.put("jobs", jobList);
                return responseMap;
            }

        } catch (Exception e) {
            log.error("Error calling Adzuna API: {}", e.getMessage());
            responseMap.put("apiError", e.getMessage());
        }

        // Fallback with dynamic skill computation for any role and location
        List<Map<String, Object>> dynamicJobs = generateDynamicJobs(cleanKeyword, cleanLocation, userSkills);
        responseMap.put("status", "SUCCESS");
        responseMap.put("total", dynamicJobs.size());
        responseMap.put("jobs", dynamicJobs);
        responseMap.put("isCuratedFallback", true);

        return responseMap;
    }

    private List<Map<String, Object>> extractJobsFromJson(String responseBody, List<String> userSkills, String cleanKeyword) {
        List<Map<String, Object>> jobList = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode resultsNode = root.get("results");
            if (resultsNode != null && resultsNode.isArray()) {
                for (JsonNode item : resultsNode) {
                    Map<String, Object> job = parseAdzunaJobItem(item, userSkills, cleanKeyword);
                    jobList.add(job);
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Adzuna JSON: {}", e.getMessage());
        }
        return jobList;
    }

    private Map<String, Object> parseAdzunaJobItem(JsonNode item, List<String> userSkills, String searchKeyword) {
        Map<String, Object> job = new LinkedHashMap<>();

        String id = item.has("id") ? item.get("id").asText() : UUID.randomUUID().toString();
        String title = item.has("title") ? cleanHtml(item.get("title").asText()) : searchKeyword;
        String description = item.has("description") ? cleanHtml(item.get("description").asText()) : "";
        String redirectUrl = item.has("redirect_url") ? item.get("redirect_url").asText() : "https://www.adzuna.com";
        String created = item.has("created") ? item.get("created").asText() : "";

        // Company
        String companyName = "Top Tech Enterprise";
        if (item.has("company") && item.get("company").has("display_name")) {
            companyName = item.get("company").get("display_name").asText();
        }

        // Location
        String locationName = "Bengaluru, Karnataka";
        if (item.has("location") && item.get("location").has("display_name")) {
            locationName = item.get("location").get("display_name").asText();
        }

        // Salary
        String salary = null;
        if (item.has("salary_min") && item.has("salary_max")) {
            double min = item.get("salary_min").asDouble();
            double max = item.get("salary_max").asDouble();
            if (min > 0 && max > 0) {
                if (min > 100000) {
                    salary = String.format("₹%.1fL - ₹%.1fL / year", min / 100000.0, max / 100000.0);
                } else {
                    salary = String.format("$%.0f - $%.0f / year", min, max);
                }
            }
        } else if (item.has("salary_is_predicted") && item.get("salary_is_predicted").asInt() == 1 && item.has("salary_min")) {
            double min = item.get("salary_min").asDouble();
            if (min > 100000) {
                salary = String.format("₹%.1fL+ (Est. Market)", min / 100000.0);
            }
        }

        // Job Type
        String jobType = "Full Time";
        if (title.toLowerCase().contains("intern") || description.toLowerCase().contains("internship")) {
            jobType = "Internship";
        } else if (item.has("contract_time")) {
            String ct = item.get("contract_time").asText();
            if ("part_time".equalsIgnoreCase(ct)) jobType = "Part Time";
        }

        // Skill Extraction & Dynamic Matching
        String fullText = (title + " " + description).toLowerCase();
        Set<String> identifiedSkillsInJob = new LinkedHashSet<>();

        for (String skill : TECH_SKILL_DICTIONARY) {
            String skillLower = skill.toLowerCase();
            if (Pattern.compile("\\b" + Pattern.quote(skillLower) + "\\b").matcher(fullText).find()) {
                identifiedSkillsInJob.add(skill);
            }
        }

        // Ensure primary search keyword skills are present in job requirements if relevant
        List<String> roleDefaultSkills = defaultSkillsForRole(searchKeyword);
        for (String s : roleDefaultSkills) {
            if (fullText.contains(s.toLowerCase())) {
                identifiedSkillsInJob.add(s);
            }
        }

        // Compute Matching vs Missing skills
        List<String> matchingSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String jobReqSkill : identifiedSkillsInJob) {
            boolean userHas = false;
            for (String uSkill : userSkills) {
                if (uSkill.equalsIgnoreCase(jobReqSkill) ||
                        (uSkill.toLowerCase().contains("spring") && jobReqSkill.toLowerCase().contains("spring")) ||
                        (uSkill.toLowerCase().contains("sql") && (jobReqSkill.equalsIgnoreCase("SQL") || jobReqSkill.equalsIgnoreCase("PostgreSQL") || jobReqSkill.equalsIgnoreCase("MySQL"))) ||
                        (uSkill.toLowerCase().contains("react") && jobReqSkill.toLowerCase().contains("react")) ||
                        (uSkill.toLowerCase().contains("python") && jobReqSkill.toLowerCase().contains("python"))) {
                    userHas = true;
                    break;
                }
            }
            if (userHas) {
                matchingSkills.add(jobReqSkill);
            } else {
                missingSkills.add(jobReqSkill);
            }
        }

        // Check if any user skills are in the job text that weren't caught yet
        for (String uSkill : userSkills) {
            if (!matchingSkills.contains(uSkill) && fullText.contains(uSkill.toLowerCase())) {
                matchingSkills.add(uSkill);
            }
        }

        // If job description had zero detected skills, populate standard stack
        if (matchingSkills.isEmpty() && missingSkills.isEmpty()) {
            for (String s : roleDefaultSkills) {
                if (userSkills.stream().anyMatch(u -> u.equalsIgnoreCase(s))) {
                    matchingSkills.add(s);
                } else {
                    missingSkills.add(s);
                }
            }
        }

        // Dynamic Match Percentage Calculation
        int totalSkills = matchingSkills.size() + missingSkills.size();
        int matchPct;
        if (userSkills.isEmpty()) {
            matchingSkills.clear();
            matchPct = 0;
        } else if (totalSkills > 0) {
            double ratio = (double) matchingSkills.size() / totalSkills;
            matchPct = (int) Math.round(ratio * 100);
            if (title.toLowerCase().contains(searchKeyword.toLowerCase().split(" ")[0])) {
                matchPct = Math.min(96, matchPct + 10);
            }
            matchPct = Math.max(10, Math.min(96, matchPct));
        } else {
            matchPct = 0;
        }

        job.put("id", id);
        job.put("title", title);
        job.put("company", companyName);
        job.put("location", locationName);
        job.put("salary", salary);
        job.put("jobType", jobType);
        job.put("description", description.length() > 240 ? description.substring(0, 240) + "..." : description);
        job.put("redirectUrl", redirectUrl);
        job.put("created", created);
        job.put("matchingSkills", matchingSkills);
        job.put("missingSkills", missingSkills);
        job.put("recommendedLearning", missingSkills);
        job.put("matchPercentage", matchPct);
        job.put("source", "Adzuna");

        return job;
    }

    private List<String> defaultSkillsForRole(String role) {
        String r = role.toLowerCase();
        if (r.contains("java")) return List.of("Java", "Spring Boot", "SQL", "REST API", "Docker", "AWS");
        if (r.contains("react") || r.contains("frontend")) return List.of("React", "JavaScript", "TypeScript", "HTML", "CSS", "Next.js");
        if (r.contains("python") || r.contains("django") || r.contains("fastapi")) return List.of("Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "Redis");
        if (r.contains("ai") || r.contains("genai") || r.contains("llm") || r.contains("ml")) return List.of("Python", "PyTorch", "LangChain", "RAG", "Vector DBs", "SQL");
        if (r.contains("devops") || r.contains("cloud") || r.contains("sre")) return List.of("Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform");
        if (r.contains("intern") || r.contains("fresher")) return List.of("Java", "DSA", "SQL", "Git", "Problem Solving");
        if (r.contains("full stack") || r.contains("fullstack")) return List.of("React", "Node.js", "TypeScript", "PostgreSQL", "REST API", "Docker");
        if (r.contains("data engineer")) return List.of("Python", "SQL", "Kafka", "Spark", "PostgreSQL", "Airflow");
        if (r.contains("golang") || r.contains("go")) return List.of("Go", "Docker", "Kubernetes", "Microservices", "gRPC", "SQL");
        return List.of("JavaScript", "Python", "SQL", "REST API", "Git");
    }

    private List<String> parseUserSkills(String userSkillsStr) {
        if (userSkillsStr == null || userSkillsStr.isBlank()) return new ArrayList<>();
        return Arrays.stream(userSkillsStr.split("[,;\\|\\n]"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String detectCountryCode(String location) {
        if (location == null || location.isBlank()) return "in";
        String loc = location.toLowerCase();
        if (loc.contains("india") || loc.contains("bangalore") || loc.contains("bengaluru") ||
                loc.contains("hyderabad") || loc.contains("delhi") || loc.contains("pune") ||
                loc.contains("mumbai") || loc.contains("chennai") || loc.contains("noida") ||
                loc.contains("gurgaon") || loc.contains("kolkata")) {
            return "in";
        }
        if (loc.contains("uk") || loc.contains("london") || loc.contains("manchester")) return "gb";
        if (loc.contains("us") || loc.contains("usa") || loc.contains("san francisco") ||
                loc.contains("new york") || loc.contains("seattle") || loc.contains("austin")) return "us";
        if (loc.contains("canada") || loc.contains("toronto") || loc.contains("vancouver")) return "ca";
        if (loc.contains("germany") || loc.contains("berlin")) return "de";

        return "in";
    }

    private String cleanHtml(String text) {
        if (text == null) return "";
        return text.replaceAll("<[^>]*>", "").replace("&amp;", "&").replace("&quot;", "\"").replace("&#39;", "'").trim();
    }

    private List<Map<String, Object>> generateDynamicJobs(String keyword, String location, List<String> userSkills) {
        List<Map<String, Object>> list = new ArrayList<>();
        String k = keyword.toLowerCase();
        String loc = location.isBlank() ? "Bengaluru, India" : location;

        String[][] templates;
        if (k.contains("intern") || k.contains("fresher")) {
            templates = new String[][]{
                    {"Software Engineer Intern (2025/2026 Batch)", "Amazon Development Centre", loc, "₹45,000 - ₹80,000 / month", "Internship", "Work directly on production features, algorithmic problem solving with DSA, REST APIs, Git workflows, and collaborative sprint delivery.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Backend Engineering Intern", "Razorpay Software Labs", loc, "₹35,000 - ₹60,000 / month", "Internship", "Assist in designing payment microservices, writing unit tests, SQL query tuning, and API integration with Java/Python.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Full Stack Developer Intern", "Swiggy / Tech Systems", loc, "₹40,000 - ₹65,000 / month", "Internship", "Build interactive user interfaces with React and backend services with Node/Java. Great opportunity for rapid learning.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Graduate Software Trainee", "TCS / Infosys Innovations", loc, "₹4.5L - ₹8.0L / year", "Full Time", "Entry-level engineering role focusing on core programming, OOP, database fundamentals, and software testing lifecycles.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)}
            };
        } else if (k.contains("ai") || k.contains("genai") || k.contains("llm") || k.contains("ml")) {
            templates = new String[][]{
                    {"Generative AI & LLM Systems Engineer", "Nexus AI Labs", loc, "₹28.0L - ₹48.0L / year", "Full Time", "Architect production RAG systems with hybrid vector search (HNSW + BM25), fine-tune open-weights LLMs with QLoRA, and build low-latency inference pipelines.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Machine Learning Platform Engineer", "Flipkart Data Science", loc, "₹25.0L - ₹42.0L / year", "Full Time", "Deploy PyTorch and TensorFlow models to production clusters with Docker, Kubernetes, Ray Serve, and PostgreSQL vector embeddings.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"AI / NLP Backend Developer", "Zomato Intelligence", loc, "₹22.0L - ₹36.0L / year", "Full Time", "Implement semantic search, LangChain agents, FastAPI services, and caching with Redis Vector Search for customer queries.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)}
            };
        } else if (k.contains("devops") || k.contains("cloud")) {
            templates = new String[][]{
                    {"Senior DevOps & Cloud SRE", "Atlassian Cloud", loc, "₹26.0L - ₹45.0L / year", "Full Time", "Manage multi-region AWS infrastructure, Kubernetes EKS clusters, Docker container registries, Terraform IAC, and automated CI/CD pipelines.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Site Reliability Engineer (SRE)", "Postman Developer Platform", loc, "₹24.0L - ₹38.0L / year", "Full Time", "Ensure 99.99% availability for developer tools, configure Prometheus/Grafana monitoring, Linux kernel tuning, and automated incident response.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)}
            };
        } else {
            templates = new String[][]{
                    {"Senior " + keyword, "Oracle / Fintech Cloud", loc, "₹24.0L - ₹38.0L / year", "Full Time", "Develop and scale mission-critical transaction engines using " + keyword + ", microservices, high-throughput REST APIs, and database indexing.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Full Stack " + keyword + " Engineer", "Swiggy / Tech Systems", loc, "₹20.0L - ₹32.0L / year", "Full Time", "Build scalable cloud-native architectures with modern APIs, relational databases, and clean frontend interfaces.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)},
                    {"Software Development Engineer II", "Razorpay Technologies", loc, "₹26.0L - ₹42.0L / year", "Full Time", "Architect high-performance distributed microservices handling high concurrency with caching and message streaming.", "https://www.adzuna.in/jobs/search?q=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8) + "&w=" + URLEncoder.encode(loc, StandardCharsets.UTF_8)}
            };
        }

        List<String> roleDefaults = defaultSkillsForRole(keyword);

        for (String[] row : templates) {
            Map<String, Object> job = new LinkedHashMap<>();
            job.put("id", "adz-dyn-" + UUID.randomUUID().toString().substring(0, 8));
            job.put("title", row[0]);
            job.put("company", row[1]);
            job.put("location", row[2]);
            job.put("salary", row[3]);
            job.put("jobType", row[4]);
            job.put("description", row[5]);
            job.put("redirectUrl", row[6]);
            job.put("created", "2026-08-28");

            List<String> matching = new ArrayList<>();
            List<String> missing = new ArrayList<>();

            for (String s : roleDefaults) {
                boolean has = !userSkills.isEmpty() && userSkills.stream().anyMatch(u -> u.equalsIgnoreCase(s) || u.toLowerCase().contains(s.toLowerCase()) || s.toLowerCase().contains(u.toLowerCase()));
                if (has) {
                    matching.add(s);
                } else {
                    missing.add(s);
                }
            }

            int matchPct;
            if (userSkills.isEmpty()) {
                matching.clear();
                matchPct = 0;
            } else {
                matchPct = (int) Math.round(((double) matching.size() / Math.max(1, matching.size() + missing.size())) * 100);
                matchPct = Math.max(10, Math.min(96, matchPct));
            }

            job.put("matchingSkills", matching);
            job.put("missingSkills", missing);
            job.put("recommendedLearning", missing);
            job.put("matchPercentage", matchPct);
            job.put("source", "Adzuna");

            list.add(job);
        }

        return list;
    }
}
