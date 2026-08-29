package com.pathcraft.app.repository;

import com.pathcraft.app.model.UserSkillMastery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserSkillMasteryRepository extends JpaRepository<UserSkillMastery, String> {
    List<UserSkillMastery> findByUserEmail(String userEmail);
    Optional<UserSkillMastery> findByUserEmailAndSkillId(String userEmail, String skillId);
}
