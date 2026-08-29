package com.pathcraft.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dsa")
public class DsaSheetController {

    @GetMapping("/sheets")
    public ResponseEntity<List<Map<String, Object>>> getFamousDsaSheets() {
        List<Map<String, Object>> sheets = List.of(
                Map.of(
                        "id", "a2z_dsa",
                        "title", "A2Z DSA Algorithmic Master Sheet",
                        "author", "PathCraft Engineering Track",
                        "url", "https://leetcode.com/problemset/all/",
                        "totalProblems", 455,
                        "topics", List.of("Learn the Basics", "Sorting Techniques", "Arrays (Easy/Med/Hard)", "Binary Search", "Strings", "LinkedList", "Recursion", "Bit Manipulation", "Stack & Queue", "Sliding Window", "Heaps", "Greedy", "Trees & BST", "Graphs", "Dynamic Programming", "Tries"),
                        "description", "The comprehensive 450+ problem roadmap for software engineering interviews with LeetCode & GFG implementations."
                ),
                Map.of(
                        "id", "neetcode_150",
                        "title", "NeetCode 150 Practice Roadmap",
                        "author", "NeetCode",
                        "url", "https://neetcode.io/practice",
                        "totalProblems", 150,
                        "topics", List.of("Arrays & Hashing", "Two Pointers", "Sliding Window", "Stack", "Binary Search", "Linked List", "Trees", "Tries", "Backtracking", "Heap / Priority Queue", "Graphs", "1D DP", "2D DP", "Bit Manipulation"),
                        "description", "Handpicked 150 LeetCode patterns with animated problem visualizers and code walkthroughs."
                ),
                Map.of(
                        "id", "faang_450",
                        "title", "FAANG 450 DSA Cracker Track",
                        "author", "PathCraft Curated Track",
                        "url", "https://leetcode.com/problemset/all/",
                        "totalProblems", 450,
                        "topics", List.of("Array", "Matrix", "String", "Searching & Sorting", "LinkedList", "Binary Trees", "BST", "Greedy", "Backtracking", "Stacks & Queues", "Heap", "Graph", "Trie", "Dynamic Programming"),
                        "description", "Curated 450 coding questions track for tier-1 tech company interview preparation."
                ),
                Map.of(
                        "id", "sde_core_180",
                        "title", "Core SDE Interview Sheet (Top 180 Questions)",
                        "author", "PathCraft Curated Track",
                        "url", "https://leetcode.com/problemset/all/",
                        "totalProblems", 180,
                        "topics", List.of("Arrays", "Pascal Triangle", "Grid Unique Paths", "Linked List", "2-Pointer", "Greedy", "Recursion", "Binary Search", "Heaps", "Graphs", "DP"),
                        "description", "The most compact 180 questions sheet for last-minute coding interview revision."
                )
        );

        return ResponseEntity.ok(sheets);
    }

    @PostMapping("/solve")
    public ResponseEntity<Map<String, Object>> solveProblem(@RequestBody Map<String, String> request) {
        String problemId = request.get("problemId");
        String email = request.get("email");
        
        // Gamification logic could go here, but for hackathon we assume 
        // GamificationController handles the actual coin crediting.
        // Or we can just call it from frontend directly.
        return ResponseEntity.ok(Map.of("success", true, "message", "Problem " + problemId + " marked as solved!"));
    }
}
