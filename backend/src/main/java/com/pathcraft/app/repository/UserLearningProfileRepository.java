package com.pathcraft.app.repository;

import com.pathcraft.app.model.UserLearningProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserLearningProfileRepository extends JpaRepository<UserLearningProfile, String> {
    Optional<UserLearningProfile> findByUserEmail(String userEmail);
}
