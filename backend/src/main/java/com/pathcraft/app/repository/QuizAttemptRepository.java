package com.pathcraft.app.repository;

import com.pathcraft.app.model.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, String> {
    List<QuizAttempt> findByUserEmailOrderByAttemptedAtDesc(String userEmail);
}
