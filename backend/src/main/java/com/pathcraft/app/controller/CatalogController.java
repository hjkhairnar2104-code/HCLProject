package com.pathcraft.app.controller;

import com.pathcraft.app.model.CourseResource;
import com.pathcraft.app.model.SkillNode;
import com.pathcraft.app.repository.CourseResourceRepository;
import com.pathcraft.app.repository.SkillNodeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final SkillNodeRepository skillNodeRepository;
    private final CourseResourceRepository courseResourceRepository;

    public CatalogController(SkillNodeRepository skillNodeRepository, CourseResourceRepository courseResourceRepository) {
        this.skillNodeRepository = skillNodeRepository;
        this.courseResourceRepository = courseResourceRepository;
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillNode>> getAllSkills() {
        return ResponseEntity.ok(skillNodeRepository.findAll());
    }

    @GetMapping("/resources")
    public ResponseEntity<List<CourseResource>> getAllResources() {
        return ResponseEntity.ok(courseResourceRepository.findAll());
    }
}
