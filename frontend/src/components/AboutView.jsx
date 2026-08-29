// About Platform View Component
function AboutView() {
  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }} className="glass-card">
      <div style={{ padding: '32px' }}>
        <span className="badge-tag badge-purple" style={{ marginBottom: '12px' }}>PathCraft AI Mission</span>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>About PathCraft AI Platform</h2>
        
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '16px', lineHeight: 1.6 }}>
          PathCraft AI was built to solve the fundamental problem of modern EdTech: <strong>information overload and static curriculum paths</strong>. We combine formal Directed Acyclic Graphs (DAGs), Gemini 1.5 Flash AI, Striver's A2Z DSA Mastery, SQL 50 query trackers, and gamification to help every student achieve their dream engineering career.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#6366f1', fontWeight: 800 }}>⚡ Tech Stack</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Spring Boot 3.4, Java 21, H2 JPA, React 18, Gemini AI API, Striver's A2Z & LeetCode SQL 50.
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px' }}>
            <h4 style={{ color: '#10b981', fontWeight: 800 }}>🏆 Hackathon Ready</h4>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              End-to-end full stack execution with verified persistence and instant PDF export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AboutView = AboutView;
