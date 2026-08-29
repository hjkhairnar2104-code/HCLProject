package com.pathcraft.app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/courses")
public class ExtendedCatalogController {

    @GetMapping("/catalog")
    public ResponseEntity<List<Map<String, Object>>> getExtendedCatalog() {
        List<Map<String, Object>> catalog = List.of(
                createCourseMap("yt_cpp_dsa_mastery", "Complete C++ Data Structures & Algorithms Course", "YouTube (CS Academy)", "YOUTUBE", "https://www.youtube.com/results?search_query=dsa+course+cpp", "https://images.unsplash.com/photo-1516116211223-425856988be2?w=500&auto=format&fit=crop", "FREE", "DSA", 4.98, 55.0, "Complete free C++ Data Structures and Algorithms playlist covering arrays, trees, graphs, and dynamic programming."),
                createCourseMap("yt_freecodecamp_python", "Python for Beginners - Full 12-Hour Course", "YouTube (freeCodeCamp)", "YOUTUBE", "https://www.youtube.com/watch?v=rfscVS0vtbw", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop", "FREE", "PYTHON", 4.95, 12.0, "Learn Python programming essentials with hands-on code examples in 12 continuous hours."),
                createCourseMap("yt_codewithharry_webdev", "Sigma Web Development Course (HTML, CSS, JS, React)", "YouTube (CodeWithHarry)", "YOUTUBE", "https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrHPff9UQX3oPP0gF_L", "https://images.unsplash.com/photo-1547658719-da2b51169166?w=500&auto=format&fit=crop", "FREE", "WEB_DEV", 4.92, 70.0, "Full stack web development tutorial series with modern JavaScript, Node.js and React."),
                createCourseMap("yt_krish_naik_ml", "Complete Machine Learning & Data Science Playlist", "YouTube (Krish Naik)", "YOUTUBE", "https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrPiURs4U58QQupvkSiD", "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&auto=format&fit=crop", "FREE", "AI_ML", 4.94, 45.0, "End-to-end Machine Learning, feature engineering, and deployment tutorial series."),
                createCourseMap("udemy_angela_yu_web", "The Complete 2026 Web Development Bootcamp", "Udemy (Dr. Angela Yu)", "PAID_UDEMY", "https://www.udemy.com/course/the-complete-web-development-bootcamp/", "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop", "PAID ($14.99)", "WEB_DEV", 4.88, 65.0, "Become a full-stack web developer with HTML, CSS, Javascript, Node, React, PostgreSQL and Web3."),
                createCourseMap("coursera_andrew_ng_ml", "Machine Learning Specialization by Andrew Ng", "Coursera / DeepLearning.AI", "MOOC_COURSERA", "https://www.coursera.org/specializations/machine-learning-introduction", "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=500&auto=format&fit=crop", "FREE_AUDIT", "AI_ML", 4.96, 35.0, "The global benchmark ML course taught by AI pioneer Andrew Ng.")
        );

        return ResponseEntity.ok(catalog);
    }

    private Map<String, Object> createCourseMap(String id, String title, String provider, String platform, String url, String imageUrl, String costType, String category, double rating, double durationHours, String description) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", id);
        m.put("title", title);
        m.put("provider", provider);
        m.put("platform", platform);
        m.put("url", url);
        m.put("imageUrl", imageUrl);
        m.put("costType", costType);
        m.put("category", category);
        m.put("rating", rating);
        m.put("durationHours", durationHours);
        m.put("description", description);
        return m;
    }

    @PostMapping("/explain")
    public ResponseEntity<Map<String, Object>> explainWhatWillILearn(@RequestBody Map<String, String> request) {
        String courseTitle = request.getOrDefault("courseTitle", "Striver's C++ DSA Course");

        List<String> outcomes = List.of(
                "Master foundational Data Structures (Arrays, Strings, HashMaps, Stacks, Queues, Binary Trees).",
                "Learn advanced algorithmic strategies: Sliding Window, 2-Pointers, Graph Traversals (BFS/DFS), and Dynamic Programming.",
                "Solve 150+ FAANG/MAANG interview coding problems with optimal Time & Space Complexity analysis.",
                "Build problem-solving intuition to break down unseen interview questions into clear steps."
        );

        List<String> prerequisites = List.of("Basic C++/Java/Python syntax", "High school algebra & logic");

        Map<String, Object> resp = new HashMap<>();
        resp.put("courseTitle", courseTitle);
        resp.put("outcomes", outcomes);
        resp.put("prerequisites", prerequisites);
        resp.put("targetCapstones", List.of("Algorithm Visualizer", "Interview Code Templates"));
        return ResponseEntity.ok(resp);
    }
}
