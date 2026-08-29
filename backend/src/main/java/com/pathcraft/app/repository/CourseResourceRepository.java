package com.pathcraft.app.repository;

import com.pathcraft.app.model.CourseResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseResourceRepository extends JpaRepository<CourseResource, String> {
    List<CourseResource> findBySkillNodeId(String skillNodeId);
}
