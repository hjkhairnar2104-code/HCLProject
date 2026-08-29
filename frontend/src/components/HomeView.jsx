// LearnPath AI — Modern SaaS Engineering Ecosystem & Career Companion
function HomeView({ setActiveTab, user, setShowAuthModal, targetRole, setTargetRole }) {
  const ALL_DOMAINS = (typeof window !== 'undefined' && window.LEARNING_PATH_DOMAINS) || [];

  const handleLaunchDomain = (domain) => {
    if (setTargetRole) setTargetRole(domain.title);
    if (setActiveTab) setActiveTab('mypath');
    try {
      if (typeof confetti === 'function') confetti({ particleCount: 50, spread: 60 });
    } catch (e) {}
  };

  // Modern SVG Icons for Clean UI
  const ICONS = {
    compass: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
      </svg>
    ),
    code: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    zap: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    book: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    bot: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
        <circle cx="12" cy="5" r="2"></circle>
        <path d="M12 7v4"></path>
        <line x1="8" y1="16" x2="8.01" y2="16"></line>
        <line x1="16" y1="16" x2="16.01" y2="16"></line>
      </svg>
    ),
    mic: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" y1="19" x2="12" y2="23"></line>
        <line x1="8" y1="23" x2="16" y2="23"></line>
      </svg>
    ),
    layers: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
      </svg>
    ),
    fileText: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    globe: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    video: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
      </svg>
    )
  };

  const PLATFORM_FEATURES = [
    {
      icon: ICONS.compass,
      title: 'Deep Canonical Learning Paths',
      category: 'Curriculum Hierarchy',
      desc: '14 deeply structured engineering domains with multi-level hierarchy: Domain → Module → Topic → Subtopic.',
      actionLabel: 'Explore Roadmaps →',
      tab: 'mypath',
      color: '#4f46e5',
      bg: '#eef2ff',
      gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)'
    },
    {
      icon: ICONS.code,
      title: 'Algorithm Visualizer Studio',
      category: 'Interactive DSA',
      desc: 'Step-by-step interactive canvas animations for 12 fundamental sorting, graph, tree, and dynamic programming algorithms.',
      actionLabel: 'Launch Visualizer →',
      tab: 'visualizer',
      color: '#0284c7',
      bg: '#f0f9ff',
      gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)'
    },
    {
      icon: ICONS.zap,
      title: 'Dynamic AI Assessments',
      category: 'Adaptive Diagnostic',
      desc: 'Adaptive MCQ diagnostic quizzes generated on demand with randomized questions, shuffled choices, and mastery tracking.',
      actionLabel: 'Take Assessment →',
      tab: 'quiz',
      color: '#059669',
      bg: '#ecfdf5',
      gradient: 'linear-gradient(135deg, #059669, #10b981)'
    },
    {
      icon: ICONS.book,
      title: 'Structured Study Guides',
      category: 'Engineering Notes',
      desc: 'High-yield engineering notes covering mathematical formulas, production code patterns, and interview corner cases.',
      actionLabel: 'View Study Notes →',
      tab: 'mypath',
      color: '#8b5cf6',
      bg: '#f5f3ff',
      gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)'
    },
    {
      icon: ICONS.bot,
      title: 'Contextual AI Engineering Tutor',
      category: 'RAG Architecture',
      desc: '24/7 technical mentor providing intuitive explanations, complexity analysis, and debugging tips for any topic.',
      actionLabel: 'Ask AI Tutor →',
      tab: 'chatbot',
      color: '#10b981',
      bg: '#f0fdf4',
      gradient: 'linear-gradient(135deg, #10b981, #34d399)'
    },
    {
      icon: ICONS.mic,
      title: 'Voice AI Mock Interviews',
      category: 'Speech STT & TTS',
      desc: 'Simulate full technical interviews with live speech-to-text, real-time voice synthesis, and Staff Engineer rubric evaluation.',
      actionLabel: 'Start Interview →',
      tab: 'interview',
      color: '#d97706',
      bg: '#fffbeb',
      gradient: 'linear-gradient(135deg, #d97706, #f59e0b)'
    },
    {
      icon: ICONS.layers,
      title: '450+ Curated DSA Sheet',
      category: 'Striver & FAANG',
      desc: 'Comprehensive algorithmic problem sheet categorized by pattern with direct LeetCode links and solution tracking.',
      actionLabel: 'Solve DSA Problems →',
      tab: 'practice',
      color: '#e11d48',
      bg: '#fff1f2',
      gradient: 'linear-gradient(135deg, #e11d48, #fb7185)'
    },
    {
      icon: ICONS.fileText,
      title: 'ATS Resume Builder & Analyzer',
      category: 'Career Intelligence',
      desc: 'Score your resume against top tech job descriptions with keyword optimization, instant feedback, and PDF export.',
      actionLabel: 'Build Resume →',
      tab: 'resume',
      color: '#4338ca',
      bg: '#eef2ff',
      gradient: 'linear-gradient(135deg, #4338ca, #6366f1)'
    }
  ];

  const STATS_CARDS = [
    { label: 'Canonical Domains', value: '14 Tech Tracks', sub: 'DSA to Generative AI', icon: ICONS.globe, color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Curriculum Depth', value: '120+ Modules', sub: '170+ Deep Subtopics', icon: ICONS.layers, color: '#0284c7', bg: '#f0f9ff' },
    { label: 'Video Lessons', value: 'Live YouTube API', sub: 'Verified Video Streaming', icon: ICONS.video, color: '#dc2626', bg: '#fef2f2' },
    { label: 'Problem Tracker', value: '450+ DSA Sheet', sub: 'Direct LeetCode Links', icon: ICONS.code, color: '#e11d48', bg: '#fff1f2' },
    { label: 'AI Mentorship', value: '24/7 Adaptive Tutor', sub: 'Context-Aware Guidance', icon: ICONS.bot, color: '#059669', bg: '#ecfdf5' }
  ];

  const HOW_IT_WORKS_STEPS = [
    {
      step: '01',
      title: 'Select Target Specialization',
      desc: 'Choose from 14 industry-aligned engineering domains (Generative AI, DSA, DevOps, Full Stack, Systems, etc.).'
    },
    {
      step: '02',
      title: 'Stream Verified Video Lessons',
      desc: 'Watch targeted architectural tutorials retrieved dynamically through the Google YouTube Data API.'
    },
    {
      step: '03',
      title: 'Master Equations & Notes',
      desc: 'Study comprehensive markdown guides detailing invariants, mathematical bounds, and production code.'
    },
    {
      step: '04',
      title: 'Validate with Dynamic Quizzes',
      desc: 'Test your understanding with randomized AI topic assessments to achieve verifiable skill mastery.'
    },
    {
      step: '05',
      title: 'Ace Interviews & Land Offers',
      desc: 'Practice voice-simulated interviews, optimize your ATS resume, and track your career readiness.'
    }
  ];

  const SPECIALIZATIONS = [
    { title: 'Java Backend Developer', tag: 'Java', level: 'Mid to Senior', modules: '18 Modules', ctc: '₹14L – ₹28L' },
    { title: 'Full Stack Developer', tag: 'React & Node', level: 'All Levels', modules: '22 Modules', ctc: '₹12L – ₹26L' },
    { title: 'Generative AI & LLM Systems Engineer', tag: 'AI & LLM', level: 'Specialist', modules: '16 Modules', ctc: '₹18L – ₹35L' },
    { title: 'DevOps & Cloud SRE', tag: 'Cloud', level: 'Mid to Senior', modules: '15 Modules', ctc: '₹15L – ₹30L' },
    { title: 'Python / FastAPI Developer', tag: 'Python', level: 'Junior to Senior', modules: '14 Modules', ctc: '₹10L – ₹22L' },
    { title: 'Golang Systems Engineer', tag: 'Golang', level: 'Mid to Senior', modules: '12 Modules', ctc: '₹16L – ₹32L' },
    { title: 'Data Engineer & Streaming', tag: 'Data', level: 'Mid to Senior', modules: '16 Modules', ctc: '₹14L – ₹28L' },
    { title: 'Cybersecurity & Security Engineer', tag: 'Security', level: 'Specialist', modules: '14 Modules', ctc: '₹15L – ₹30L' }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}>
      
      {/* =========================================================================
          1. HERO & VALUE PROPOSITION BANNER WITH PHOTO VISUAL
         ========================================================================= */}
      <div
        className="hero-grid-container"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 80%, #4f46e5 100%)',
          color: '#ffffff',
          padding: '36px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 45px -10px rgba(67, 56, 202, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 0.85fr)',
          gap: '36px',
          alignItems: 'center'
        }}
      >
        {/* Ambient Decorative Background Glows */}
        <div style={{ position: 'absolute', top: '-60px', right: '-40px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '20%', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none', filter: 'blur(40px)' }} />

        {/* Left Column: Headline, Description & CTAs */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.16)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800, marginBottom: '16px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', letterSpacing: '0.04em' }}>
            <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8' }}></span>
            <span>NEXT-GENERATION AI-POWERED LEARNING COMPANION</span>
          </div>

          <h1 className="hero-headline" style={{ fontSize: '2.45rem', fontWeight: 900, lineHeight: 1.18, margin: '0 0 14px 0', letterSpacing: '-0.025em', color: '#ffffff' }}>
            Master Software Engineering & AI with Adaptive Pathways
          </h1>

          <p style={{ fontSize: '0.98rem', lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.92)', margin: '0 0 24px 0', maxWidth: '580px' }}>
            Accelerate your engineering journey with deep canonical curriculums, live YouTube video streaming, structured study notes, dynamic AI assessments, and speech-enabled mock interviews.
          </p>

          <div className="hero-cta-buttons" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={() => setActiveTab && setActiveTab('mypath')}
              style={{
                background: '#ffffff',
                color: '#312e81',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                transition: 'all 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Open My Learning Path</span>
              <span>➔</span>
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('quiz')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              Take Diagnostic Quiz
            </button>

            <button
              onClick={() => setActiveTab && setActiveTab('interview')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.35)',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
            >
              AI Mock Interview
            </button>
          </div>
        </div>

        {/* Right Column: Hero Female Engineer Laptop Photo */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 45px -10px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.25)',
              border: '2px solid rgba(255,255,255,0.25)',
              background: '#0f172a',
              width: '100%',
              maxWidth: '460px',
              aspectRatio: '4/3'
            }}
          >
            <img
              src="./hero_learning_illustration.jpg?v=20260829_new"
              alt="Beautiful Female Software Engineer Coding on Laptop"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&auto=format&fit=crop&q=80";
              }}
            />
            
            {/* Live Interactive Glass Floating Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                right: '12px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.80rem', fontWeight: 800, color: '#ffffff' }}>
                  Intelligent Engineering Hub
                </div>
                <div style={{ fontSize: '0.70rem', color: '#cbd5e1' }}>
                  Curriculums • Video Studios • AI Assessments
                </div>
              </div>
              <span style={{ fontSize: '0.70rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: '0 2px 8px rgba(16,185,129,0.4)' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffffff' }}></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. KEY PLATFORM STATS STRIP (ELEVATED & ATTRACTIVE)
         ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {STATS_CARDS.map((stat, sIdx) => (
          <div
            key={sIdx}
            className="saas-card"
            style={{
              padding: '20px 22px',
              borderRadius: '16px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 24px rgba(79, 70, 229, 0.08)';
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.03)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <div
              style={{
                fontSize: '1.6rem',
                background: stat.bg,
                color: stat.color,
                width: '50px',
                height: '50px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '1.20rem', fontWeight: 900, color: '#0f172a', margin: '2px 0' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.74rem', color: stat.color, fontWeight: 700 }}>
                {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================================================
          3. WHAT LEARNPATH AI PROVIDES (8 RICH FEATURE CARDS WITH GRADIENT ACCENTS)
         ========================================================================= */}
      <div>
        <div style={{ marginBottom: '20px' }}>
          <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px' }}>
            PLATFORM CAPABILITIES
          </span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px', marginBottom: '4px' }}>
            What LearnPath AI Provides
          </h2>
          <p style={{ fontSize: '0.90rem', color: '#64748b', margin: 0 }}>
            An integrated, end-to-end ecosystem designed to bridge technical knowledge gaps and accelerate engineering mastery.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' }}>
          {PLATFORM_FEATURES.map((feat, fIdx) => (
            <div
              key={fIdx}
              onClick={() => setActiveTab && setActiveTab(feat.tab)}
              className="saas-card"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 14px 28px rgba(79, 70, 229, 0.12)`;
                e.currentTarget.style.borderColor = feat.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: feat.gradient,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.4rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  >
                    {feat.icon}
                  </div>
                  <span style={{ fontSize: '0.70rem', fontWeight: 700, color: feat.color, background: feat.bg, padding: '3px 8px', borderRadius: '6px' }}>
                    {feat.category}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  {feat.title}
                </h3>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span
                  style={{
                    color: feat.color,
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {feat.actionLabel}
                </span>
                <span style={{ fontSize: '1.05rem', color: feat.color, fontWeight: 900 }}>
                  ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          4. HOW THE LEARNING ENGINE WORKS (5-STEP CONNECTED TIMELINE)
         ========================================================================= */}
      <div
        className="saas-card"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
          borderRadius: '20px',
          padding: '36px 32px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 32px' }}>
          <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px' }}>
            LEARNING METHODOLOGY
          </span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
            How LearnPath AI Accelerates Mastery
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '4px', lineHeight: 1.5 }}>
            A structured, science-backed learning cycle proven to maximize technical retention, problem solving speed, and interview readiness.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          {HOW_IT_WORKS_STEPS.map((st, sIdx) => (
            <div
              key={sIdx}
              style={{
                background: '#ffffff',
                padding: '22px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#4f46e5';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
              }}
            >
              <div
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
                }}
              >
                {st.step}
              </div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                {st.title}
              </h4>
              <p style={{ fontSize: '0.80rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. EXPLORE 14 ENGINEERING SPECIALIZATIONS MATRIX
         ========================================================================= */}
      <div>
        <div style={{ marginBottom: '18px' }}>
          <span className="badge badge-primary" style={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px' }}>
            CAREER ROADMAPS
          </span>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
            Choose Your Engineering Specialization
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '2px 0 0 0' }}>
            Select any domain below to load a customized milestone curriculum with prerequisite validation and verified video tutorials.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {SPECIALIZATIONS.map((spec, sIdx) => {
            const isCurrent = targetRole && targetRole.toLowerCase().includes(spec.title.toLowerCase().split(' ')[0]);
            return (
              <div
                key={sIdx}
                onClick={() => handleLaunchDomain(spec)}
                className="saas-card"
                style={{
                  padding: '18px 20px',
                  borderRadius: '14px',
                  background: isCurrent ? '#f8faff' : '#ffffff',
                  border: isCurrent ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#4f46e5';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 18px rgba(79, 70, 229, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isCurrent ? '#4f46e5' : '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe' }}>
                      {spec.tag || 'Track'}
                    </span>
                    <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                      {spec.title}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px', fontSize: '0.74rem', color: '#64748b' }}>
                    <span>{spec.level}</span>
                    <span>•</span>
                    <span style={{ color: '#4f46e5', fontWeight: 700 }}>{spec.modules}</span>
                    <span>•</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{spec.ctc}</span>
                  </div>
                </div>

                <span style={{ fontSize: '1.1rem', color: '#4f46e5', fontWeight: 900 }}>
                  ➔
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

window.HomeView = HomeView;
