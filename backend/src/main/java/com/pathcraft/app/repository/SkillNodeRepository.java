package com.pathcraft.app.repository;

import com.pathcraft.app.model.SkillNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillNodeRepository extends JpaRepository<SkillNode, String> {
    List<String> findByCategory(String category);
}
