package com.pathcraft.app.repository;

import com.pathcraft.app.model.CustomAssessmentQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomAssessmentQuestionRepository extends JpaRepository<CustomAssessmentQuestion, String> {
    List<CustomAssessmentQuestion> findByDomainAndLevel(String domain, int level);
    List<CustomAssessmentQuestion> findByDomain(String domain);
}
