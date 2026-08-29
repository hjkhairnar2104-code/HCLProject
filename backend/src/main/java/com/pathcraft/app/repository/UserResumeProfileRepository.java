package com.pathcraft.app.repository;

import com.pathcraft.app.model.UserResumeProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserResumeProfileRepository extends JpaRepository<UserResumeProfile, String> {
    Optional<UserResumeProfile> findByUserEmail(String userEmail);
}
