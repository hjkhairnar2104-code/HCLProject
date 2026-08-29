package com.pathcraft.app.service;

import com.pathcraft.app.dto.SkillGapResponse;
import com.pathcraft.app.model.SkillNode;
import com.pathcraft.app.repository.SkillNodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillGraphService {

    private final SkillNodeRepository skillNodeRepository;

    /**
     * Given a target skill node ID, finds all prerequisite skill nodes required in topological order.
     */
    public List<SkillNode> getPrerequisiteChain(String targetSkillNodeId) {
        Map<String, SkillNode> allSkills = skillNodeRepository.findAll().stream()
                .collect(Collectors.toMap(SkillNode::getId, s -> s));

        if (!allSkills.containsKey(targetSkillNodeId)) {
            // Default fallback to py_basics or data science track if unknown
            targetSkillNodeId = "ds_capstone";
        }

        Set<String> requiredSkillIds = new HashSet<>();
        collectPrerequisites(targetSkillNodeId, allSkills, requiredSkillIds);
        requiredSkillIds.add(targetSkillNodeId);

        // Topological Sort
        List<SkillNode> orderedNodes = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        for (String skillId : requiredSkillIds) {
            visitNode(skillId, allSkills, visited, orderedNodes, requiredSkillIds);
        }

        return orderedNodes;
    }

    private void collectPrerequisites(String currentId, Map<String, SkillNode> allSkills, Set<String> collected) {
        SkillNode node = allSkills.get(currentId);
        if (node == null || node.getPrerequisites() == null) return;
        for (String prereqId : node.getPrerequisites()) {
            if (!collected.contains(prereqId)) {
                collected.add(prereqId);
                collectPrerequisites(prereqId, allSkills, collected);
            }
        }
    }

    private void visitNode(String currentId, Map<String, SkillNode> allSkills, Set<String> visited, List<SkillNode> orderedNodes, Set<String> allowedScope) {
        if (visited.contains(currentId) || !allowedScope.contains(currentId)) return;
        SkillNode node = allSkills.get(currentId);
        if (node != null && node.getPrerequisites() != null) {
            for (String prereqId : node.getPrerequisites()) {
                if (allowedScope.contains(prereqId)) {
                    visitNode(prereqId, allSkills, visited, orderedNodes, allowedScope);
                }
            }
        }
        visited.add(currentId);
        if (node != null) {
            orderedNodes.add(node);
        }
    }

    /**
     * Analyzes current learner skills against target requirements to calculate gap radar metrics.
     */
    public SkillGapResponse calculateSkillGap(String targetRole, String targetSkillNodeId, Map<String, Integer> currentSkills) {
        List<SkillNode> targetChain = getPrerequisiteChain(targetSkillNodeId);
        if (currentSkills == null) currentSkills = new HashMap<>();

        List<SkillGapResponse.SkillItem> currentList = new ArrayList<>();
        List<SkillGapResponse.SkillItem> targetList = new ArrayList<>();
        List<SkillGapResponse.SkillGapDetail> gaps = new ArrayList<>();

        int totalSkillsInChain = targetChain.size();
        int masteredSkillsCount = 0;

        for (SkillNode node : targetChain) {
            int curLevel = currentSkills.getOrDefault(node.getId(), 0);
            int targetLevel = node.getLevel() != null ? node.getLevel() : 3;

            targetList.add(SkillGapResponse.SkillItem.builder()
                    .skillId(node.getId())
                    .name(node.getName())
                    .category(node.getCategory())
                    .level(targetLevel)
                    .build());

            if (curLevel > 0) {
                currentList.add(SkillGapResponse.SkillItem.builder()
                        .skillId(node.getId())
                        .name(node.getName())
                        .category(node.getCategory())
                        .level(curLevel)
                        .build());
                if (curLevel >= targetLevel) {
                    masteredSkillsCount++;
                }
            }

            if (curLevel < targetLevel) {
                String importance = node.getPrerequisites().isEmpty() ? "CRITICAL" : (node.getLevel() > 3 ? "HIGH" : "MEDIUM");
                gaps.add(SkillGapResponse.SkillGapDetail.builder()
                        .skillId(node.getId())
                        .name(node.getName())
                        .category(node.getCategory())
                        .currentLevel(curLevel)
                        .targetLevel(targetLevel)
                        .missingPrerequisites(node.getPrerequisites())
                        .importance(importance)
                        .build());
            }
        }

        double readiness = totalSkillsInChain == 0 ? 100.0 : ((double) masteredSkillsCount / totalSkillsInChain) * 100.0;

        return SkillGapResponse.builder()
                .targetRole(targetRole)
                .overallReadinessPercentage(Math.round(readiness * 10.0) / 10.0)
                .currentSkills(currentList)
                .targetSkills(targetList)
                .gaps(gaps)
                .build();
    }
}
