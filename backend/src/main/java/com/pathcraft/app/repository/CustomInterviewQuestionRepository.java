package com.pathcraft.app.repository;

import com.pathcraft.app.model.CustomInterviewQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomInterviewQuestionRepository extends JpaRepository<CustomInterviewQuestion, String> {
    List<CustomInterviewQuestion> findByTargetRoleOrderByRoundOrderAsc(String targetRole);
}
