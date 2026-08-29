package com.pathcraft.app.controller;

import com.pathcraft.app.service.AdzunaJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobRecommendationController {

    private final AdzunaJobService adzunaJobService;

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchJobs(
            @RequestParam(required = false, defaultValue = "Java Developer") String keyword,
            @RequestParam(required = false, defaultValue = "") String skills,
            @RequestParam(required = false, defaultValue = "Bangalore") String location,
            @RequestParam(required = false, defaultValue = "false") boolean isRemote
    ) {
        log.info("Received job search request: keyword='{}', location='{}', skills='{}', isRemote={}", keyword, location, skills, isRemote);
        Map<String, Object> result = adzunaJobService.searchJobs(keyword, skills, location, isRemote);
        return ResponseEntity.ok(result);
    }
}
