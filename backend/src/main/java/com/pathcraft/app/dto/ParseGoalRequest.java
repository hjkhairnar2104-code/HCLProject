package com.pathcraft.app.dto;

import java.util.List;
import java.util.Map;

public class ParseGoalRequest {
    private String naturalLanguageGoal;
    private String resumeOrJobText;

    public ParseGoalRequest() {}

    public ParseGoalRequest(String naturalLanguageGoal, String resumeOrJobText) {
        this.naturalLanguageGoal = naturalLanguageGoal;
        this.resumeOrJobText = resumeOrJobText;
    }

    public String getNaturalLanguageGoal() { return naturalLanguageGoal; }
    public void setNaturalLanguageGoal(String naturalLanguageGoal) { this.naturalLanguageGoal = naturalLanguageGoal; }

    public String getResumeOrJobText() { return resumeOrJobText; }
    public void setResumeOrJobText(String resumeOrJobText) { this.resumeOrJobText = resumeOrJobText; }
}
