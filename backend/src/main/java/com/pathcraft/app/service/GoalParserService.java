package com.pathcraft.app.service;

import com.pathcraft.app.dto.ParseGoalRequest;
import com.pathcraft.app.dto.ParseGoalResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GoalParserService {

    public ParseGoalResponse parseUserGoal(ParseGoalRequest request) {
        String input = (request.getNaturalLanguageGoal() + " " + (request.getResumeOrJobText() != null ? request.getResumeOrJobText() : "")).toLowerCase();

        String targetRole = "Data Scientist / AI Engineer";
        String targetSkillNodeId = "ds_capstone";
        int timeframeMonths = 4;
        double hoursPerWeek = 8.0;
        String learningStyle = "HANDS_ON";
        Map<String, Integer> extractedSkills = new HashMap<>();

        // Intent detection heuristics
        if (input.contains("web") || input.contains("full stack") || input.contains("react") || input.contains("frontend") || input.contains("backend")) {
            targetRole = "Full-Stack Software Engineer";
            targetSkillNodeId = "fullstack_capstone";
        } else if (input.contains("cloud") || input.contains("devops") || input.contains("docker") || input.contains("kubernetes")) {
            targetRole = "Cloud DevOps Engineer";
            targetSkillNodeId = "cicd_iac";
        } else if (input.contains("ml") || input.contains("data science") || input.contains("python") || input.contains("ai")) {
            targetRole = "Data Scientist & AI Specialist";
            targetSkillNodeId = "ds_capstone";
        }

        // Extracted existing skills heuristics from prompt/resume
        if (input.contains("python") || input.contains("py_basics")) {
            extractedSkills.put("py_basics", 2);
        }
        if (input.contains("math") || input.contains("stats") || input.contains("calculus")) {
            extractedSkills.put("math_stats", 2);
        }
        if (input.contains("pandas") || input.contains("numpy") || input.contains("eda")) {
            extractedSkills.put("data_analysis", 2);
        }
        if (input.contains("html") || input.contains("css") || input.contains("javascript") || input.contains("js")) {
            extractedSkills.put("web_foundations", 3);
        }
        if (input.contains("react")) {
            extractedSkills.put("react_js", 2);
        }

        // Extract hours/week if mentioned
        if (input.contains("2 hours") || input.contains("2 hrs")) hoursPerWeek = 2.0;
        else if (input.contains("5 hours") || input.contains("5 hrs")) hoursPerWeek = 5.0;
        else if (input.contains("10 hours") || input.contains("10 hrs")) hoursPerWeek = 10.0;
        else if (input.contains("15 hours") || input.contains("15 hrs")) hoursPerWeek = 15.0;

        // Extract timeframe if mentioned
        if (input.contains("3 months") || input.contains("3 m")) timeframeMonths = 3;
        else if (input.contains("6 months") || input.contains("6 m")) timeframeMonths = 6;
        else if (input.contains("12 months") || input.contains("1 year")) timeframeMonths = 12;

        List<String> questions = new ArrayList<>();
        if (extractedSkills.isEmpty()) {
            questions.add("Have you done any basic programming (e.g. Python or JS) before?");
        }
        questions.add("Do you prefer hands-on coding projects or video-based guided courses?");

        String summary = String.format("Mapped target objective to '%s' path over %d months (%d hrs/wk). Detected %d prior skills.",
                targetRole, timeframeMonths, (int) hoursPerWeek, extractedSkills.size());

        return ParseGoalResponse.builder()
                .parsedTargetRole(targetRole)
                .targetSkillNodeId(targetSkillNodeId)
                .timeframeMonths(timeframeMonths)
                .hoursPerWeek(hoursPerWeek)
                .learningStyle(learningStyle)
                .extractedSkills(extractedSkills)
                .clarifyingQuestions(questions)
                .summary(summary)
                .build();
    }
}
