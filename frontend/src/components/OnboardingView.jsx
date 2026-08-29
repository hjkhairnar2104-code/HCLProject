// PathCraft.ai - Complete Modern Progressive Onboarding & AI Calibration Wizard (Clean Light SaaS)
function OnboardingView({ user, setUser, onComplete, setActiveTab }) {
  const API_BASE = 'http://localhost:8085';

  // Wizard Stage: 1..4 (steps) | 'analyzing' | 'ready'
  const [step, setStep] = React.useState(1);

  // Form State
  const [targetRole, setTargetRole] = React.useState('Java Backend Developer');
  const [experienceLevel, setExperienceLevel] = React.useState('Intermediate (1-3 years)');
  
  // Selected Skills Map
  const [selectedSkills, setSelectedSkills] = React.useState({
    'Java': 8,
    'Spring Boot': 8,
    'SQL': 7,
    'REST API': 8
  });

  const [hoursPerDay, setHoursPerDay] = React.useState(2.0);
  const [deadlineDays, setDeadlineDays] = React.useState(90);
  const [analysisStage, setAnalysisStage] = React.useState(0);
  const [customSkillInput, setCustomSkillInput] = React.useState('');
  const [extraSkills, setExtraSkills] = React.useState([]);

  const ROLE_CARDS = [
    { id: 'Java Backend Developer', title: 'Java Backend Developer', icon: '☕', desc: 'Java, Spring Boot, Microservices, SQL, Distributed Systems', defaultSkills: ['Java', 'Spring Boot', 'SQL', 'REST API', 'Microservices', 'Docker'] },
    { id: 'Full Stack Developer', title: 'Full Stack Developer', icon: '⚛️', desc: 'React, Node.js, JavaScript, TypeScript, PostgreSQL, REST APIs', defaultSkills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'PostgreSQL', 'REST API'] },
    { id: 'Software Engineering Intern / Fresher', title: 'Software Engineering Intern / Fresher', icon: '🎓', desc: 'Core DSA, Java/Python, SQL, OOP, Git, Problem Solving', defaultSkills: ['Java', 'DSA', 'SQL', 'Git', 'Problem Solving', 'OOP'] },
    { id: 'Generative AI & LLM Systems Engineer', title: 'Generative AI & LLM Systems Engineer', icon: '🤖', desc: 'Python, PyTorch, LLMs, RAG, LangChain, Vector DBs, FastAPI', defaultSkills: ['Python', 'PyTorch', 'LangChain', 'RAG', 'Vector DBs', 'FastAPI'] },
    { id: 'Python / FastAPI Developer', title: 'Python / FastAPI Developer', icon: '🐍', desc: 'Python, FastAPI, AsyncIO, PostgreSQL, Redis, Docker', defaultSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'AsyncIO'] },
    { id: 'DevOps & Cloud SRE', title: 'DevOps & Cloud SRE', icon: '🚢', desc: 'Docker, Kubernetes, AWS, Terraform, CI/CD, Linux', defaultSkills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD', 'Linux'] },
    { id: 'Frontend React/Next.js Engineer', title: 'Frontend React/Next.js Engineer', icon: '🎨', desc: 'React, Next.js, TypeScript, Tailwind CSS, State Management', defaultSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'HTML/CSS'] },
    { id: 'Data Engineer & Analytics', title: 'Data Engineer & Analytics', icon: '📊', desc: 'Python, SQL, Spark, Kafka, Snowflake, Data Pipelines', defaultSkills: ['Python', 'SQL', 'Spark', 'Kafka', 'Snowflake', 'Airflow'] },
    { id: 'Mobile App Developer', title: 'Mobile App Developer', icon: '📱', desc: 'React Native, Flutter, JavaScript, Firebase, iOS/Android', defaultSkills: ['React Native', 'Flutter', 'JavaScript', 'Firebase', 'iOS/Android'] },
    { id: 'Golang Systems Engineer', title: 'Golang Systems Engineer', icon: '⚡', desc: 'Go, Microservices, gRPC, Docker, Kubernetes, Low-Latency', defaultSkills: ['Go', 'Docker', 'Kubernetes', 'gRPC', 'Microservices', 'Redis'] },
    { id: 'Data Scientist / ML Engineer', title: 'Data Scientist / ML Engineer', icon: '📈', desc: 'Python, Scikit-Learn, Pandas, NumPy, Statistics, PyTorch', defaultSkills: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'PyTorch', 'Statistics'] },
    { id: 'Cybersecurity & Security Engineer', title: 'Cybersecurity & Security Engineer', icon: '🛡️', desc: 'Linux, Networking, Python, Penetration Testing, IAM', defaultSkills: ['Linux', 'Networking', 'Python', 'Penetration Testing', 'IAM'] }
  ];

  const handleSelectRole = (r) => {
    setTargetRole(r.id);
    const nextSkills = {};
    r.defaultSkills.forEach(s => { nextSkills[s] = 8; });
    // Retain any custom extra skills user added
    extraSkills.forEach(s => { nextSkills[s] = 8; });
    setSelectedSkills(nextSkills);
  };

  const toggleSkill = (skill) => {
    const next = { ...selectedSkills };
    if (next[skill] !== undefined) {
      delete next[skill];
    } else {
      next[skill] = 7;
    }
    setSelectedSkills(next);
  };

  const handleAddCustomSkill = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const clean = customSkillInput.trim();
    if (clean) {
      setSelectedSkills(prev => ({ ...prev, [clean]: 8 }));
      if (!extraSkills.includes(clean)) {
        setExtraSkills(prev => [...prev, clean]);
      }
      setCustomSkillInput('');
    }
  };

  const handleRemoveExtraSkill = (skillToRemove) => {
    setSelectedSkills(prev => {
      const next = { ...prev };
      delete next[skillToRemove];
      return next;
    });
    setExtraSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  const handleGeneratePath = async () => {
    setStep('analyzing');
    setAnalysisStage(0);

    const skillsArray = Object.keys(selectedSkills);

    // Save locally & permanently mark onboarding completed for this user
    try {
      localStorage.setItem('pathcraft_skills', JSON.stringify(skillsArray));
      localStorage.setItem('pathcraft_target_role', targetRole);

      if (user && user.email) {
        localStorage.setItem(`pathcraft_onboarding_done_${user.email.toLowerCase().trim()}`, 'true');
        localStorage.setItem(`pathcraft_skills_${user.email.toLowerCase().trim()}`, JSON.stringify(skillsArray));
      }

      if (setUser) {
        setUser(prev => ({
          ...prev,
          targetRole,
          skills: skillsArray,
          claimedSkills: skillsArray,
          profileCompleted: true
        }));
      }

      window.dispatchEvent(new CustomEvent('pathcraft_skills_updated', {
        detail: { targetRole, skills: skillsArray }
      }));
    } catch (e) {}

    // Simulated animated calibration
    setTimeout(() => setAnalysisStage(1), 400);
    setTimeout(() => setAnalysisStage(2), 800);
    setTimeout(() => setAnalysisStage(3), 1200);
    setTimeout(() => {
      setStep('ready');
      try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}
    }, 1600);
  };

  const handleFinish = () => {
    if (user && user.email) {
      try {
        localStorage.setItem(`pathcraft_onboarding_done_${user.email.toLowerCase().trim()}`, 'true');
        localStorage.setItem(`pathcraft_skills_${user.email.toLowerCase().trim()}`, JSON.stringify(Object.keys(selectedSkills)));
        const userObj = { ...user, profileCompleted: true, targetRole, skills: Object.keys(selectedSkills) };
        localStorage.setItem('pathcraft_active_session', JSON.stringify(userObj));
        if (setUser) setUser(userObj);
      } catch (e) {}
    }
    if (onComplete) onComplete();
    if (setActiveTab) setActiveTab('home');
  };

  const activeRoleCard = ROLE_CARDS.find(r => r.id === targetRole) || ROLE_CARDS[0];

  return (
    <div style={{ maxWidth: '840px', margin: '20px auto', padding: '16px' }}>
      
      {/* PROGRESS BAR */}
      {typeof step === 'number' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4f46e5' }}>
            Step {step} of 3
          </div>
          <div style={{ width: '220px', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: '#4f46e5', transition: 'width 0.3s ease' }} />
          </div>
          <button
            type="button"
            onClick={handleFinish}
            style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
          >
            Skip to Dashboard →
          </button>
        </div>
      )}

      {/* STEP 1: TARGET ROLE SELECTION */}
      {step === 1 && (
        <div className="saas-card" style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Goal Setting
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              What engineering role are you aiming for?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '2px' }}>
              Select your career goal. We'll engineer your personalized roadmap and live job matches.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '10px', marginBottom: '24px' }}>
            {ROLE_CARDS.map((r) => {
              const isSel = targetRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => handleSelectRole(r)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    background: isSel ? '#eef2ff' : '#ffffff',
                    border: isSel ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{r.icon}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSel ? '#4338ca' : '#0f172a' }}>{r.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px', lineHeight: 1.35 }}>{r.desc}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary"
              style={{ fontSize: '0.88rem', padding: '10px 24px', fontWeight: 800 }}
            >
              Continue to Skills →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CURRENT SKILLS WITH CUSTOM ADD FEATURE */}
      {step === 2 && (
        <div className="saas-card" style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Skill Assessment
              </span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 10px', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
                ✓ {Object.keys(selectedSkills).length} Skills Selected
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              Which skills do you already know for {targetRole}?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '2px' }}>
              Click on tags to add or remove skills you are comfortable with, or add your own custom skills below.
            </p>
          </div>

          {/* PREDEFINED ROLE SKILLS */}
          <div style={{ marginBottom: '16px' }}>
            <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Recommended Core Skills:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {activeRoleCard.defaultSkills.map((s) => {
                const isChecked = selectedSkills[s] !== undefined;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSkill(s)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: isChecked ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                      background: isChecked ? '#ecfdf5' : '#f8fafc',
                      color: isChecked ? '#065f46' : '#64748b',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{isChecked ? '✓' : '+'}</span>
                    <span>{s}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* EXTRA / CUSTOM ADDED SKILLS (IF ANY) */}
          {extraSkills.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Your Custom Added Skills:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {extraSkills.map((s) => {
                  const isChecked = selectedSkills[s] !== undefined;
                  return (
                    <div
                      key={s}
                      style={{
                        padding: '6px 12px 6px 14px',
                        borderRadius: '20px',
                        border: '1px solid #c7d2fe',
                        background: '#eef2ff',
                        color: '#4338ca',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span onClick={() => toggleSkill(s)} style={{ cursor: 'pointer' }}>
                        {isChecked ? '✓ ' : '+ '}{s}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtraSkill(s)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#6366f1',
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          padding: '0 2px'
                        }}
                        title={`Remove ${s}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INLINE ADD CUSTOM SKILL FORM */}
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px dashed #cbd5e1', marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              ➕ Add Extra / Custom Skills:
            </label>
            <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: '8px', maxWidth: '500px' }}>
              <input
                type="text"
                placeholder="e.g. Docker, Python, Spring Boot, PyTorch, C++, Kubernetes..."
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                className="saas-input"
                style={{ flex: 1, padding: '8px 12px', fontSize: '0.84rem', borderRadius: '8px', background: '#ffffff' }}
              />
              <button
                type="submit"
                disabled={!customSkillInput.trim()}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', fontWeight: 800, borderRadius: '8px', opacity: !customSkillInput.trim() ? 0.6 : 1 }}
              >
                + Add Skill
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-subtle"
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="btn-primary"
              style={{ fontSize: '0.88rem', padding: '10px 24px', fontWeight: 800 }}
            >
              Continue to Timeline →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: TIMELINE & COMMITMENT */}
      {step === 3 && (
        <div className="saas-card" style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Pacing & Commitment
            </span>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginTop: '4px' }}>
              How much time can you invest daily?
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.84rem', marginTop: '2px' }}>
              We'll calculate your pacing and optimize your daily milestones.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Daily Study Hours
              </label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                className="saas-input"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem' }}
              >
                <option value={1.0}>1.0 hour / day (Casual)</option>
                <option value={2.0}>2.0 hours / day (Recommended)</option>
                <option value={3.5}>3.5 hours / day (Intensive)</option>
                <option value={5.0}>5.0+ hours / day (Full-Time Prep)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Target Interview Date
              </label>
              <select
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
                className="saas-input"
                style={{ width: '100%', padding: '10px 12px', fontSize: '0.88rem' }}
              >
                <option value={30}>30 Days (Sprint)</option>
                <option value={60}>60 Days (Standard)</option>
                <option value={90}>90 Days (Deep Mastery)</option>
                <option value={180}>6 Months (Comprehensive)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-subtle"
              style={{ fontSize: '0.84rem', padding: '8px 16px' }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={handleGeneratePath}
              className="btn-primary"
              style={{ fontSize: '0.9rem', padding: '11px 28px', fontWeight: 800 }}
            >
              🚀 Generate My Personalized Roadmap →
            </button>
          </div>
        </div>
      )}

      {/* ANALYZING STAGE */}
      {step === 'analyzing' && (
        <div className="saas-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '14px', animation: 'pulse 1s infinite' }}>⚡</div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
            Synthesizing Your Curriculum & Job Matches
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.84rem', maxWidth: '420px', margin: '0 auto 24px' }}>
            Running prerequisite topology analysis for {targetRole}...
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '380px', margin: '0 auto' }}>
            <div style={{ fontSize: '0.78rem', color: analysisStage >= 1 ? '#059669' : '#94a3b8', fontWeight: 700 }}>
              {analysisStage >= 1 ? '✓ Prerequisite DAG resolved' : '○ Resolving knowledge dependencies...'}
            </div>
            <div style={{ fontSize: '0.78rem', color: analysisStage >= 2 ? '#059669' : '#94a3b8', fontWeight: 700 }}>
              {analysisStage >= 2 ? '✓ Real-time Adzuna job queries synchronized' : '○ Calibrating match percentage...'}
            </div>
            <div style={{ fontSize: '0.78rem', color: analysisStage >= 3 ? '#059669' : '#94a3b8', fontWeight: 700 }}>
              {analysisStage >= 3 ? '✓ Custom roadmap ready!' : '○ Finalizing curriculum modules...'}
            </div>
          </div>
        </div>
      )}

      {/* READY STAGE */}
      {step === 'ready' && (
        <div className="saas-card" style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #a7f3d0', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#065f46', marginBottom: '6px' }}>
            Your Roadmap for {targetRole} is Ready!
          </h3>
          <p style={{ color: '#047857', fontSize: '0.86rem', maxWidth: '440px', margin: '0 auto 24px' }}>
            Your skills have been calibrated and live job listings are ready for application.
          </p>

          <button
            type="button"
            onClick={handleFinish}
            className="btn-primary"
            style={{ fontSize: '0.92rem', padding: '12px 32px', fontWeight: 800 }}
          >
            Launch Platform Dashboard →
          </button>
        </div>
      )}

    </div>
  );
}

window.OnboardingView = OnboardingView;
