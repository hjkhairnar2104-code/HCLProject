package com.pathcraft.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "custom_assessment_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomAssessmentQuestion {

    @Id
    private String id;

    @Column(nullable = false)
    private String domain; // 'dsa', 'db', 'sysdesign', 'devops', 'java', 'aiml'

    private String assignmentTopic; // e.g. 'Neural Networks & Backpropagation'

    @Column(nullable = false)
    private int level; // 1 to 5

    @Column(nullable = false, length = 1000)
    private String question;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "custom_question_options", joinColumns = @JoinColumn(name = "question_id"))
    @Column(name = "option_text")
    private List<String> options;

    @Column(nullable = false)
    private int correctIndex;

    @Column(length = 1000)
    private String explanation;

    private String addedBy; // 'admin' or user email

    private LocalDateTime createdAt;
}
