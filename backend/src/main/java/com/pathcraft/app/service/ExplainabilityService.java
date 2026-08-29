package com.pathcraft.app.service;

import com.pathcraft.app.model.CourseResource;
import com.pathcraft.app.model.LearnerProfile;
import com.pathcraft.app.model.SkillNode;
import org.springframework.stereotype.Service;

@Service
public class ExplainabilityService {

    public String generateExplanation(SkillNode skillNode, CourseResource resource, LearnerProfile profile, double readinessScore, double relevanceScore) {
        StringBuilder explanation = new StringBuilder();
        
        explanation.append(String.format("Recommended because it bridges your skill gap in '%s' (Relevance: %.0f%%). ", 
                skillNode.getName(), relevanceScore * 100));

        if (readinessScore >= 0.8) {
            explanation.append("You meet 100% of the prerequisite requirements to start immediately. ");
        } else if (readinessScore >= 0.5) {
            explanation.append("Contains key foundational concepts building directly on your current knowledge. ");
        }

        if (profile != null && profile.getLearningStyle() != null && resource != null && resource.getFormat() != null) {
            if (profile.getLearningStyle().equalsIgnoreCase(resource.getFormat())) {
                explanation.append(String.format("Matches your preferred '%s' learning style. ", resource.getFormat()));
            }
        }

        if (resource != null && resource.getRating() != null) {
            explanation.append(String.format("Rated %.1f/5 stars by %s learners.", resource.getRating(), resource.getProvider()));
        }

        return explanation.toString();
    }
}
