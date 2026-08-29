package com.pathcraft.app.repository;

import com.pathcraft.app.model.LearnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LearnerProfileRepository extends JpaRepository<LearnerProfile, String> {
}
