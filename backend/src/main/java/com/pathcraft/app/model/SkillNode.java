package com.pathcraft.app.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "skill_nodes")
public class SkillNode {

    @Id
    private String id;
    private String name;
    private String category;

    @Column(length = 1000)
    private String description;

    private Integer level;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "skill_prerequisites", joinColumns = @JoinColumn(name = "skill_id"))
    @Column(name = "prerequisite_skill_id")
    private List<String> prerequisites = new ArrayList<>();

    public SkillNode() {}

    public SkillNode(String id, String name, String category, String description, Integer level, List<String> prerequisites) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.level = level;
        this.prerequisites = prerequisites != null ? prerequisites : new ArrayList<>();
    }

    public static SkillNodeBuilder builder() {
        return new SkillNodeBuilder();
    }

    public static class SkillNodeBuilder {
        private String id;
        private String name;
        private String category;
        private String description;
        private Integer level;
        private List<String> prerequisites = new ArrayList<>();

        public SkillNodeBuilder id(String id) { this.id = id; return this; }
        public SkillNodeBuilder name(String name) { this.name = name; return this; }
        public SkillNodeBuilder category(String category) { this.category = category; return this; }
        public SkillNodeBuilder description(String description) { this.description = description; return this; }
        public SkillNodeBuilder level(Integer level) { this.level = level; return this; }
        public SkillNodeBuilder prerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; return this; }

        public SkillNode build() {
            return new SkillNode(id, name, category, description, level, prerequisites);
        }
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public List<String> getPrerequisites() { return prerequisites; }
    public void setPrerequisites(List<String> prerequisites) { this.prerequisites = prerequisites; }
}
