// Topological DAG Roadmap View Component
function RoadmapView({ roadmapData }) {
  const milestones = roadmapData?.milestones || [
    { id: "m1", stepOrder: 1, stage: "FOUNDATION", estimatedHours: 12, title: "Learn Basics & Time Complexity", resourceTitle: "Striver's C++ / Java DSA Basics", resourceProvider: "takeUforward", resourceUrl: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", whyRecommended: "Essential prerequisite before diving into linear and non-linear data structures." },
    { id: "m2", stepOrder: 2, stage: "CORE", estimatedHours: 20, title: "Arrays & Dynamic Programming", resourceTitle: "Kadane's Algo, 2-Pointers & 1D DP", resourceProvider: "LeetCode & GFG", resourceUrl: "https://leetcode.com/problemset/all/", whyRecommended: "Over 40% of FAANG technical interview questions test Array and DP optimization techniques." },
    { id: "m3", stepOrder: 3, stage: "CAPSTONE", estimatedHours: 18, title: "Full-Stack AI Project Deployment", resourceTitle: "PathCraft AI Engine with Spring Boot & React", resourceProvider: "GitHub Repo", resourceUrl: "#", whyRecommended: "Build real production portfolio proof of work." }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-card" style={{ padding: '24px', borderLeft: '4px solid #6366f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-tag badge-cyan">Topological Skill Graph</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>
            Adaptive Milestone Learning Path
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Prerequisite-ordered milestones linking direct to Striver's A2Z & FreeCodeCamp.</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Estimated Time</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#10b981' }}>{roadmapData?.roadmap?.totalEstimatedHours || 65} Hours</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {milestones.map(m => (
          <div key={m.id} className="glass-card" style={{ padding: '20px 24px', borderLeft: '4px solid #6366f1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1' }}>Milestone #{m.stepOrder}</span>
                  <span className="badge-tag badge-purple">{m.stage}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>⏱️ {m.estimatedHours} hrs</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>{m.title}</h3>
                <div style={{ marginTop: '6px', fontSize: '0.88rem', color: '#10b981', fontWeight: 700 }}>
                  📖 Attached Resource: {m.resourceTitle} ({m.resourceProvider})
                </div>
              </div>

              {m.resourceUrl && m.resourceUrl !== '#' && (
                <a href={m.resourceUrl} target="_blank" rel="noreferrer" className="glow-btn-accent" style={{ padding: '8px 16px', fontSize: '0.8rem', textDecoration: 'none' }}>
                  🚀 Open Resource ↗
                </a>
              )}
            </div>

            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(99, 102, 241, 0.08)', borderRadius: '8px', fontSize: '0.82rem', color: '#c7d2fe' }}>
              <strong>Why Recommended:</strong> {m.whyRecommended}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.RoadmapView = RoadmapView;
