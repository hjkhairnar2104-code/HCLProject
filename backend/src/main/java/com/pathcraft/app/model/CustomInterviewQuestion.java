package com.pathcraft.app.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "custom_interview_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomInterviewQuestion {

    @Id
    private String id;

    @Column(nullable = false)
    private String targetRole; // 'Backend Engineer', 'AI/ML Engineer', etc.

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false, length = 1000)
    private String question;

    @Column(length = 2000)
    private String modelAnswer;

    @Column(length = 1000)
    private String proTip;

    private int roundOrder;

    private String addedBy;

    private LocalDateTime createdAt;
}
