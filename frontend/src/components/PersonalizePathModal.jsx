// Interactive Modern Personalized Career & Skills Calibration Modal
function PersonalizePathModal({ isOpen, onClose, onCalibrated, initialUser, targetRole: initialTargetRole }) {
  if (!isOpen) return null;

  const API_BASE = 'http://localhost:8085';

  const ROLE_CONFIGS = [
    {
      title: "Java Backend Developer",
      icon: "☕",
      skills: ["Java", "Spring Boot", "SQL", "REST API", "Microservices", "Docker"]
    },
    {
      title: "Full Stack Developer",
      icon: "⚛️",
      skills: ["React", "Node.js", "JavaScript", "TypeScript", "PostgreSQL", "REST API"]
    },
    {
      title: "Software Engineering Intern / Fresher",
      icon: "🎓",
      skills: ["Java", "DSA", "SQL", "Git", "Problem Solving", "OOP"]
    },
    {
      title: "Generative AI & LLM Systems Engineer",
      icon: "🤖",
      skills: ["Python", "PyTorch", "LangChain", "RAG", "Vector DBs", "FastAPI"]
    },
    {
      title: "Python / FastAPI Developer",
      icon: "🐍",
      skills: ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis", "AsyncIO"]
    },
    {
      title: "DevOps & Cloud SRE",
      icon: "🚢",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"]
    },
    {
      title: "Frontend React/Next.js Engineer",
      icon: "🎨",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux", "HTML/CSS"]
    },
    {
      title: "Data Engineer & Analytics",
      icon: "📊",
      skills: ["Python", "SQL", "Spark", "Kafka", "Snowflake", "Airflow"]
    },
    {
      title: "Mobile App Developer",
      icon: "📱",
      skills: ["React Native", "Flutter", "JavaScript", "Firebase", "iOS/Android"]
    },
    {
      title: "Golang Systems Engineer",
      icon: "⚡",
      skills: ["Go", "Docker", "Kubernetes", "gRPC", "Microservices", "Redis"]
    },
    {
      title: "Data Scientist / ML Engineer",
      icon: "📈",
      skills: ["Python", "Scikit-Learn", "Pandas", "NumPy", "PyTorch", "Statistics"]
    },
    {
      title: "Cybersecurity & Security Engineer",
      icon: "🛡️",
      skills: ["Linux", "Networking", "Python", "Penetration Testing", "IAM"]
    }
  ];

  // Match initial role or fallback to Java Backend
  const defaultRole = initialTargetRole || initialUser?.targetRole || "Java Backend Developer";
  const defaultCfg = ROLE_CONFIGS.find(r => r.title.toLowerCase() === defaultRole.toLowerCase()) || ROLE_CONFIGS[0];

  // State
  const [fullName, setFullName] = React.useState(initialUser?.fullName || '');
  const [targetRole, setTargetRole] = React.useState(defaultCfg.title);
  const [deadlineDays, setDeadlineDays] = React.useState(90);
  const [hoursPerDay, setHoursPerDay] = React.useState(2.0);
  const [inputMode, setInputMode] = React.useState('skills'); // 'skills' | 'resume'
  
  // Initialize Selected Skills map
  const [selectedSkills, setSelectedSkills] = React.useState(() => {
    const initMap = {};
    if (initialUser?.skills && Array.isArray(initialUser.skills) && initialUser.skills.length > 0) {
      initialUser.skills.forEach(s => { initMap[s] = "Intermediate"; });
    } else {
      defaultCfg.skills.forEach(s => { initMap[s] = "Intermediate"; });
    }
    return initMap;
  });

  const [customSkillInput, setCustomSkillInput] = React.useState('');
  const [resumeText, setResumeText] = React.useState('');
  const [isParsingResume, setIsParsingResume] = React.useState(false);
  const [resumeSummary, setResumeSummary] = React.useState(null);
  const [isCalibrating, setIsCalibrating] = React.useState(false);

  // When role changes, switch skills to role defaults
  const handleRoleSelect = (roleTitle) => {
    setTargetRole(roleTitle);
    const cfg = ROLE_CONFIGS.find(r => r.title === roleTitle);
    if (cfg) {
      const nextSkills = {};
      cfg.skills.forEach(s => { nextSkills[s] = "Intermediate"; });
      setSelectedSkills(nextSkills);
    }
  };

  const toggleSkill = (skill) => {
    const next = { ...selectedSkills };
    if (next[skill]) {
      delete next[skill];
    } else {
      next[skill] = "Intermediate";
    }
    setSelectedSkills(next);
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !selectedSkills[trimmed]) {
      setSelectedSkills({ ...selectedSkills, [trimmed]: "Intermediate" });
      setCustomSkillInput('');
    }
  };

  const updateSkillLevel = (skill, level) => {
    setSelectedSkills({ ...selectedSkills, [skill]: level });
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) return;
    setIsParsingResume(true);
    try {
      const res = await fetch(`${API_BASE}/api/learning-path/parse-resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, userEmail: initialUser?.email || 'learner@example.com' })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.candidateName) setFullName(data.candidateName);
        if (data.targetRole) handleRoleSelect(data.targetRole);
        
        const extracted = {};
        (data.extractedSkills || []).forEach(s => {
          extracted[s.name] = s.level || "Intermediate";
        });
        setSelectedSkills(extracted);
        setResumeSummary(data.summary);
        try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleSaveCalibration = async () => {
    setIsCalibrating(true);
    const claimedList = Object.entries(selectedSkills).map(([name, level]) => ({ name, level }));
    const skillsArray = Object.keys(selectedSkills);

    // Save locally into localStorage
    try {
      localStorage.setItem('pathcraft_skills', JSON.stringify(skillsArray));
      localStorage.setItem('pathcraft_target_role', targetRole);
      
      const session = localStorage.getItem('pathcraft_active_session');
      if (session) {
        const parsed = JSON.parse(session);
        parsed.targetRole = targetRole;
        parsed.skills = skillsArray;
        parsed.claimedSkills = skillsArray;
        localStorage.setItem('pathcraft_active_session', JSON.stringify(parsed));
      }

      // Dispatch real-time cross-component sync event
      window.dispatchEvent(new CustomEvent('pathcraft_skills_updated', {
        detail: { targetRole, skills: skillsArray }
      }));
    } catch (e) {}

    try {
      await fetch(`${API_BASE}/api/learning-path/calibrate-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: initialUser?.email || 'learner@example.com',
          fullName: fullName || initialUser?.fullName || 'Learner',
          targetRole,
          deadlineDays,
          hoursPerDay,
          claimedSkills: claimedList
        })
      });
    } catch (e) {}

    setIsCalibrating(false);
    try { confetti({ particleCount: 60, spread: 60 }); } catch (e) {}

    if (onCalibrated) {
      onCalibrated({
        targetRole,
        claimedSkills: claimedList,
        skills: skillsArray,
        deadlineDays,
        hoursPerDay
      });
    }
    onClose();
  };

  const currentConfig = ROLE_CONFIGS.find(r => r.title === targetRole) || ROLE_CONFIGS[0];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          background: '#ffffff',
          boxShadow: 'var(--shadow-modal)',
          borderRadius: '16px',
          padding: '28px 32px',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* HEADER */}
        <div style={{ marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎯</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Personalize Your Career Path & Skills
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.84rem' }}>
            Select your desired target role and current skills. Your curriculum and real-time job matching will update immediately.
          </p>
        </div>

        {/* METHOD TOGGLE TABS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setInputMode('skills')}
            className={inputMode === 'skills' ? 'btn-primary' : 'btn-subtle'}
            style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '8px' }}
          >
            ⚡ Select Target Role & Skills
          </button>
          <button
            type="button"
            onClick={() => setInputMode('resume')}
            className={inputMode === 'resume' ? 'btn-primary' : 'btn-subtle'}
            style={{ fontSize: '0.82rem', padding: '6px 14px', borderRadius: '8px' }}
          >
            📄 Auto-Extract via Resume Paste
          </button>
        </div>

        {/* SCROLLABLE FORM BODY */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {inputMode === 'skills' ? (
            <>
              {/* 1. TARGET ROLE SELECTION CARDS */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  1. Choose Your Target Career Track (12 Modern Roles)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '8px' }}>
                  {ROLE_CONFIGS.map((r) => {
                    const isSelected = targetRole === r.title;
                    return (
                      <div
                        key={r.title}
                        onClick={() => handleRoleSelect(r.title)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                          background: isSelected ? '#eef2ff' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{r.icon}</span>
                        <div style={{ fontSize: '0.8rem', fontWeight: isSelected ? 800 : 600, color: isSelected ? '#4338ca' : '#0f172a' }}>
                          {r.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. ACTIVE SKILLS CHECKLIST */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                    2. Skills You Currently Have ({Object.keys(selectedSkills).length} Active)
                  </label>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Click tags to toggle or adjust proficiency
                  </span>
                </div>

                {/* Popular / Recommended Tags for Role */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {currentConfig.skills.map((s) => {
                    const isChecked = Boolean(selectedSkills[s]);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSkill(s)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '20px',
                          border: isChecked ? '1px solid #a7f3d0' : '1px solid #e2e8f0',
                          background: isChecked ? '#ecfdf5' : '#f8fafc',
                          color: isChecked ? '#065f46' : '#64748b',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span>{isChecked ? '✓' : '+'}</span>
                        <span>{s}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Skill Input Form */}
                <form onSubmit={handleAddCustomSkill} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Add custom skill (e.g. AWS, Redis, GraphQL, Kafka)..."
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    className="saas-input"
                    style={{ flex: 1, padding: '7px 12px', fontSize: '0.8rem' }}
                  />
                  <button
                    type="submit"
                    className="btn-secondary"
                    style={{ padding: '7px 14px', fontSize: '0.8rem', fontWeight: 700 }}
                  >
                    + Add Skill
                  </button>
                </form>

                {/* Detailed Proficiency Rating Grid */}
                {Object.keys(selectedSkills).length > 0 && (
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #f1f5f9', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '8px' }}>
                    {Object.entries(selectedSkills).map(([skill, level]) => (
                      <div key={skill} style={{ background: '#ffffff', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{skill}</span>
                        <select
                          value={level}
                          onChange={(e) => updateSkillLevel(skill, e.target.value)}
                          style={{ fontSize: '0.72rem', padding: '2px 4px', borderRadius: '4px', border: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. TIMELINE & HOURS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Daily Study Commitment
                  </label>
                  <select
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
                    className="saas-input"
                    style={{ width: '100%', padding: '7px 10px', fontSize: '0.82rem' }}
                  >
                    <option value={1.0}>1.0 hour / day (Casual)</option>
                    <option value={2.0}>2.0 hours / day (Recommended)</option>
                    <option value={3.5}>3.5 hours / day (Intensive)</option>
                    <option value={5.0}>5.0+ hours / day (Full-Time Prep)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Target Interview Timeline
                  </label>
                  <select
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
                    className="saas-input"
                    style={{ width: '100%', padding: '7px 10px', fontSize: '0.82rem' }}
                  >
                    <option value={30}>30 Days (Sprint)</option>
                    <option value={60}>60 Days (Standard)</option>
                    <option value={90}>90 Days (Deep Mastery)</option>
                    <option value={180}>6 Months (Comprehensive)</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* RESUME PARSE TAB */
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                Paste Your Raw Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your education, work experience, and tech skills here for AI parsing..."
                rows={7}
                className="saas-input"
                style={{ width: '100%', resize: 'vertical', fontSize: '0.82rem', fontFamily: 'monospace' }}
              />
              <button
                type="button"
                onClick={handleParseResume}
                disabled={isParsingResume || !resumeText.trim()}
                className="btn-primary"
                style={{ marginTop: '8px', fontSize: '0.84rem', padding: '8px 16px' }}
              >
                {isParsingResume ? '🤖 Analyzing Resume...' : '✨ Extract Skills & Role'}
              </button>

              {resumeSummary && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#065f46' }}>✓ Extracted Profile Summary</div>
                  <div style={{ fontSize: '0.76rem', color: '#047857', marginTop: '3px' }}>{resumeSummary}</div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* FOOTER ACTIONS */}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-subtle"
            style={{ fontSize: '0.84rem', padding: '8px 16px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveCalibration}
            disabled={isCalibrating || Object.keys(selectedSkills).length === 0}
            className="btn-primary"
            style={{ fontSize: '0.86rem', padding: '8px 20px', fontWeight: 800 }}
          >
            {isCalibrating ? '⚡ Calibrating Roadmap...' : '🚀 Apply to Roadmap & Jobs →'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.PersonalizePathModal = PersonalizePathModal;
