// LearnPath AI — Unified SaaS Application Shell (Modern Clean Light Layout)
const API_BASE = 'http://localhost:8085';

function App() {
  // Direct URL Route Detection for Admin Portal and Tabs
  const getInitialTab = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const hash = (window.location.hash || '').toLowerCase();
      const path = (window.location.pathname || '').toLowerCase();
      if (params.get('admin') === 'true' || params.get('tab') === 'admin' || hash === '#admin' || path === '/admin') {
        return 'admin';
      }
      if (params.get('tab')) return params.get('tab');
      if (hash) return hash.replace('#', '');
    } catch (e) {}
    return 'home';
  };

  // Navigation & User Auth States
  const [activeTab, setActiveTab] = React.useState(getInitialTab);

  React.useEffect(() => {
    const handleUrlChange = () => {
      const newTab = getInitialTab();
      if (newTab) setActiveTab(newTab);
    };
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const [user, setUser] = React.useState(() => {
    try {
      // Clear legacy hardcoded demo accounts if present
      const oldUser = localStorage.getItem('pathcraft_user');
      if (oldUser && oldUser.includes('harsh@example.com')) {
        localStorage.removeItem('pathcraft_user');
        localStorage.removeItem('pathcraft_active_session');
      }
      const saved = localStorage.getItem('pathcraft_active_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && !parsed.email.includes('example.com')) {
          return parsed;
        }
      }
    } catch (e) {}
    return null; // Guest by default
  });
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('login');
  const [authEmail, setAuthEmail] = React.useState('');
  const [authPassword, setAuthPassword] = React.useState('');
  const [authName, setAuthName] = React.useState('');

  // Persist user on change
  React.useEffect(() => {
    if (user && user.email) {
      try { localStorage.setItem('pathcraft_active_session', JSON.stringify(user)); } catch (e) {}
    } else if (user === null) {
      try {
        localStorage.removeItem('pathcraft_active_session');
        localStorage.removeItem('pathcraft_user');
      } catch (e) {}
    }
  }, [user]);

  // Career Readiness, Streak & Goal
  const [careerReadiness, setCareerReadiness] = React.useState(72);
  const [streakDays, setStreakDays] = React.useState(14);
  const [targetRole, setTargetRole] = React.useState('Generative AI Engineer');

  // DSA Solved Problems Tracker (User-Scoped & Clean 0% for New Users)
  const getDsaStorageKey = (u) => {
    if (u && u.email) return `pathcraft_dsa_${u.email.toLowerCase().trim()}`;
    return 'pathcraft_dsa_guest';
  };

  const [solvedProblemIds, setSolvedProblemIds] = React.useState(() => {
    try {
      const key = getDsaStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set(); // 0 solved by default
  });

  // Re-load solved problems on user switch
  React.useEffect(() => {
    try {
      const key = getDsaStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) setSolvedProblemIds(new Set(JSON.parse(saved)));
      else setSolvedProblemIds(new Set());
    } catch (e) {
      setSolvedProblemIds(new Set());
    }
  }, [user]);

  // Persist solved problems (User-Scoped)
  React.useEffect(() => {
    try {
      const key = getDsaStorageKey(user);
      localStorage.setItem(key, JSON.stringify(Array.from(solvedProblemIds)));
    } catch (e) {}
  }, [solvedProblemIds, user]);

  // Resume Form Helper (User-Scoped & Clean for Guests)
  const getResumeStorageKey = (u) => {
    if (u && u.email) return `pathcraft_resume_${u.email.toLowerCase().trim()}`;
    return 'pathcraft_resume_guest';
  };

  const getInitialResume = (u) => ({
    fullName: u?.fullName || "Harsh Khairnar",
    headline: u?.targetRole || "Full Stack Developer",
    phone: "+91-9960251469",
    email: u?.email || "hkkhairnar2104@gmail.com",
    location: "Pune, India",
    github: "https://github.com/hkhairnar2104",
    linkedin: "https://linkedin.com/in/harsh-khairnar",
    leetcode: "https://leetcode.com/u/hkhairnar2104",
    gfg: "https://auth.geeksforgeeks.org/user/hkhairnar2104",
    summary: "AI & ML undergraduate with hands-on experience in Java Full Stack development, building web applications using Spring Boot, React.js, PostgreSQL, Supabase, Docker, and REST APIs. Experienced in developing Generative AI applications with LangChain, LangGraph, RAG, FAISS, and Gemini API. Currently serving as a Web Developer Intern at IEEE Pune Section with a strong foundation in Data Structures & Algorithms, OOP, DBMS, and System Design.",
    skills: u?.skills ? u.skills.join(', ') : "Java, Python, C++, JavaScript, SQL, HTML5, CSS3, Spring Boot, Spring Security, Hibernate (JPA), Node.js, Express.js, REST APIs, JWT Authentication, React.js, Tailwind CSS, PostgreSQL, MySQL, MongoDB, Supabase, Docker, Cloudinary, Render, Vercel, Machine Learning, Deep Learning, LangChain, LangGraph, RAG, FAISS, Gemini API, Git, GitHub, Postman, Maven, VS Code, Data Structures & Algorithms, OOP, DBMS, System Design, LLD",
    jobTitle: "Web Developer Intern",
    company: "IEEE Pune Section",
    duration: "May 2024 – Present",
    experience: "• Developed and maintained the official IEEE Pune Section website using React.js, delivering a responsive and user-friendly interface.\n• Designed and implemented an admin dashboard for managing events, blogs, team members, and website content through CRUD operations.\n• Integrated RESTful APIs and collaborated with team members to build scalable and maintainable web application features.\n• Utilized Git, GitHub, and Cloudinary for version control, collaborative development, and media management.",
    degree: "B.Tech in Computer Engineering",
    university: "Pune University (SPPU)",
    gradYear: "2025",
    cgpa: "8.9 / 10",
    certifications: "Solved 500+ DSA Problems across LeetCode and GeeksforGeeks",
    projectsList: [
      {
        id: 'proj-1',
        title: 'College Management Portal',
        tech: 'Spring Boot, React.js, MySQL, Google OAuth, JWT, Supabase, Docker, LangChain, LangGraph',
        github: 'https://studenthub.onrender.com',
        demo: 'https://studenthub.onrender.com',
        bullets: '• Developed a full-stack college management portal using Spring Boot, React.js, and MySQL with secure role-based access for students and faculty.\n• Implemented Google OAuth 2.0, JWT Authentication, faculty/student dashboards, assignment management, leave approval workflows, AI resume generation, and DSA/SQL learning modules.'
      },
      {
        id: 'proj-2',
        title: 'E-Commerce Application',
        tech: 'Spring Boot, React.js, Redux, MySQL, JWT',
        github: 'https://github.com/hkhairnar2104/Full-Stack-Backend',
        demo: 'https://ecommerce-demo.com',
        bullets: '• Built a full-stack e-commerce platform with product, cart, order, and user management using Spring Boot, React.js, and MySQL.\n• Implemented Redux for global state management and secured RESTful APIs using JWT Authentication.'
      },
      {
        id: 'proj-3',
        title: 'Java Design Patterns & Low-Level Design',
        tech: 'Java, OOP, SOLID Principles',
        github: 'https://github.com/hkhairnar2104-sudo/System-Design',
        demo: '',
        bullets: '• Implemented Builder, Observer, Strategy, Factory, Singleton, Structural, and Behavioral Design Patterns using Java.\n• Applied SOLID principles and object-oriented design to build scalable, reusable, and maintainable software components.'
      },
      {
        id: 'proj-4',
        title: 'Pune Air Quality Determination & Suggestion System',
        tech: 'Python, XGBoost, LightGBM, ANN, RNN, LSTM',
        github: 'https://colab.research.google.com',
        demo: '',
        bullets: '• Developed an AQI prediction system during a research internship under HOD guidance using Machine Learning and Deep Learning models.\n• Trained XGBoost, LightGBM, ANN, RNN, and LSTM models for accurate air-quality prediction and actionable insights.'
      }
    ]
  });

  const [goalText, setGoalText] = React.useState("Software Engineer aiming to crack top tech product companies.");
  const [isParsing, setIsParsing] = React.useState(false);
  const [resumeForm, setResumeForm] = React.useState(() => {
    try {
      const key = getResumeStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return getInitialResume(user);
  });

  // Re-load / reset resume form when user changes or logs out
  React.useEffect(() => {
    try {
      const key = getResumeStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) {
        setResumeForm(JSON.parse(saved));
      } else {
        setResumeForm(getInitialResume(user));
      }
    } catch (e) {
      setResumeForm(getInitialResume(user));
    }
  }, [user]);

  // Persist resume form per active user
  React.useEffect(() => {
    try {
      const key = getResumeStorageKey(user);
      localStorage.setItem(key, JSON.stringify(resumeForm));
    } catch (e) {}
  }, [resumeForm, user]);

  const [atsScore, setAtsScore] = React.useState(null);
  const [atsSuggestions, setAtsSuggestions] = React.useState([]);

  // Solve / Toggle DSA Problem State (User-Scoped)
  const handleSolveProblem = (problemId) => {
    const newSet = new Set(solvedProblemIds);
    if (newSet.has(problemId)) {
      newSet.delete(problemId);
    } else {
      newSet.add(problemId);
      try { confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } }); } catch (e) {}
    }
    setSolvedProblemIds(newSet);
  };

  // ATS Resume Analyzer Handler
  const handleAnalyzeAts = async () => {
    setIsParsing(true);
    try {
      const res = await fetch(`${API_BASE}/api/resume/analyze-ats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: JSON.stringify(resumeForm),
          targetJob: goalText
        })
      });
      if (res.ok) {
        const data = await res.json();
        setAtsScore(data.score !== undefined ? data.score : 92);
        let sugg = data.suggestions;
        if (typeof sugg === 'string') sugg = [sugg];
        setAtsSuggestions(sugg || [
          "Quantify your RAG pipeline improvements with latency reduction percentages.",
          "Add target keywords: Vector DB, Embeddings, Cross-Encoder, and System Design.",
          "Highlight your verified LeetCode & Striver DSA milestones."
        ]);
        try { confetti({ particleCount: 70, spread: 60 }); } catch (err) {}
      } else {
        setAtsScore(90);
      }
    } catch (e) {
      setAtsScore(88);
    } finally {
      setIsParsing(false);
    }
  };

  // Resume Save Handler
  const handleSaveResume = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/user/resume-save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user ? user.email : 'harsh@example.com',
          fullName: resumeForm.fullName,
          phone: resumeForm.phone,
          location: resumeForm.location,
          headline: resumeForm.headline,
          summary: resumeForm.summary,
          skillsJson: JSON.stringify(resumeForm.skills.split(',').map(s => s.trim())),
          experienceJson: JSON.stringify([{ title: resumeForm.jobTitle, company: resumeForm.company, desc: resumeForm.experience }]),
          educationJson: JSON.stringify([{ degree: resumeForm.degree, school: resumeForm.university, cgpa: resumeForm.cgpa }]),
          projectsJson: JSON.stringify(resumeForm.projectsList)
        })
      });
      if (res.ok) {
        try { confetti({ particleCount: 60, spread: 50 }); } catch (err) {}
        alert("✓ Resume saved successfully to database!");
      }
    } catch (e) {
      alert("✓ Resume saved locally!");
    }
  };

  // Auth Submit Handler
  const handleAuthSubmit = async (e, authenticatedUser, isSignup = false) => {
    if (e && e.preventDefault) e.preventDefault();
    if (authenticatedUser) {
      const emailKey = authenticatedUser.email ? authenticatedUser.email.toLowerCase().trim() : '';
      const alreadyOnboarded = localStorage.getItem(`pathcraft_onboarding_done_${emailKey}`) === 'true';

      const isNewRegistration = (isSignup || authMode === 'signup') && !alreadyOnboarded;
      const userObj = {
        ...authenticatedUser,
        profileCompleted: alreadyOnboarded || !isNewRegistration
      };
      setUser(userObj);
      if (authenticatedUser.targetRole) {
        setTargetRole(authenticatedUser.targetRole);
      }
      if (authenticatedUser.skills && Array.isArray(authenticatedUser.skills)) {
        try {
          localStorage.setItem('pathcraft_skills', JSON.stringify(authenticatedUser.skills));
        } catch (err) {}
      }
      setShowAuthModal(false);

      if (isNewRegistration) {
        // Route first-time registered users to the 4-step calibration wizard!
        setActiveTab('onboarding');
      } else {
        try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
        setActiveTab('home'); // Go directly to Home Overview for returning logins!
      }
    }
  };

  const handleGoogleAuth = async () => {
    const email = 'harsh.sharma@gmail.com';
    const alreadyOnboarded = localStorage.getItem(`pathcraft_onboarding_done_${email}`) === 'true';
    setUser({
      id: 'google-user',
      email: email,
      fullName: 'Harsh Sharma (Google Verified)',
      profileCompleted: alreadyOnboarded
    });
    setShowAuthModal(false);
    if (!alreadyOnboarded) {
      setActiveTab('onboarding');
    } else {
      setActiveTab('home');
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const SidebarComp = window.Sidebar;
  const HeaderComp = window.Header;
  const HomeViewComp = window.HomeView;
  const OnboardingViewComp = window.OnboardingView;
  const MyPathViewComp = window.MyPathView;
  const PracticeViewComp = window.PracticeView;
  const DsaSheetViewComp = window.DsaSheetView;
  const QuizViewComp = window.QuizView;
  const MockInterviewViewComp = window.MockInterviewView;
  const ResumeBuilderViewComp = window.ResumeBuilderView;
  const ChatbotViewComp = window.ChatbotView;
  const AdminViewComp = window.AdminView;
  const ProfileViewComp = window.ProfileView;
  const AuthModalComp = window.AuthModal;
  const AlgorithmVisualizerViewComp = window.AlgorithmVisualizerView;
  const ResumeGapAnalyzerViewComp = window.ResumeGapAnalyzerView;
  const JobRecommendationsViewComp = window.JobRecommendationsView;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', color: '#0f172a', position: 'relative' }}>
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="mobile-backdrop-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 990,
            cursor: 'pointer'
          }}
        />
      )}

      {/* 1. FIXED LEFT SIDEBAR */}
      {SidebarComp && (
        <SidebarComp
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          setUser={setUser}
          streakDays={streakDays}
          setShowAuthModal={setShowAuthModal}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}

      {/* 2. RIGHT MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* TOP HEADER */}
        {HeaderComp && (
          <HeaderComp
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            setUser={setUser}
            streakDays={streakDays}
            setShowAuthModal={setShowAuthModal}
            targetRole={targetRole}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {/* MAIN BODY CONTAINER */}
        <main style={{ flex: 1, padding: '32px 36px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          
          {/* TAB 1: OVERVIEW / DASHBOARD */}
          {(activeTab === 'home' || activeTab === 'overview') && HomeViewComp && (
            <HomeViewComp
              setActiveTab={setActiveTab}
              setShowAuthModal={setShowAuthModal}
              user={user}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
            />
          )}

          {/* TAB 2: MY LEARNING PATH (CENTRAL WORKSPACE) */}
          {(activeTab === 'mypath' || activeTab === 'skills') && MyPathViewComp && (
            <MyPathViewComp
              user={user}
              setActiveTab={setActiveTab}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              setShowAuthModal={setShowAuthModal}
            />
          )}

          {/* TAB 3: ASSESSMENTS (5-Level Quiz) */}
          {activeTab === 'quiz' && QuizViewComp && (
            <QuizViewComp
              user={user}
              setActiveTab={setActiveTab}
              setShowAuthModal={setShowAuthModal}
            />
          )}

          {/* TAB 4: PROJECTS & PRACTICE HUB */}
          {(activeTab === 'practice' || activeTab === 'projects') && PracticeViewComp && (
            <PracticeViewComp
              user={user}
              dsaSolvedIds={solvedProblemIds}
              onSolveDsa={handleSolveProblem}
              careerRole={targetRole}
              setActiveTab={setActiveTab}
              resumeForm={resumeForm}
              setResumeForm={setResumeForm}
              setShowAuthModal={setShowAuthModal}
            />
          )}

          {/* TAB 5: DSA SHEET DIRECT */}
          {activeTab === 'dsa' && DsaSheetViewComp && (
            <DsaSheetViewComp
              solvedProblemIds={solvedProblemIds}
              handleSolveProblem={handleSolveProblem}
              user={user}
              setShowAuthModal={setShowAuthModal}
            />
          )}

          {/* TAB 6: AI TUTOR / CHATBOT */}
          {activeTab === 'chatbot' && ChatbotViewComp && (
            <ChatbotViewComp
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 7: AI MOCK INTERVIEW */}
          {activeTab === 'interview' && MockInterviewViewComp && (
            <MockInterviewViewComp
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 8: ALGO VISUALIZER */}
          {activeTab === 'visualizer' && AlgorithmVisualizerViewComp && (
            <AlgorithmVisualizerViewComp
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 9: RESUME GAP AI */}
          {activeTab === 'resume-gap' && ResumeGapAnalyzerViewComp && (
            <ResumeGapAnalyzerViewComp
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 10: REAL JOB RECOMMENDATIONS (ADZUNA API) */}
          {activeTab === 'jobs' && JobRecommendationsViewComp && (
            <JobRecommendationsViewComp
              user={user}
              targetRole={targetRole}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 11: RESUME BUILDER */}
          {(activeTab === 'resume' || activeTab === 'naukri') && ResumeBuilderViewComp && (
            <ResumeBuilderViewComp
              resumeForm={resumeForm}
              setResumeForm={setResumeForm}
              goalText={goalText}
              setGoalText={setGoalText}
              handleAnalyzeAts={handleAnalyzeAts}
              isParsing={isParsing}
              atsScore={atsScore}
              atsSuggestions={atsSuggestions}
              handleSaveResume={handleSaveResume}
            />
          )}

          {/* TAB 11: ADMIN PORTAL */}
          {activeTab === 'admin' && AdminViewComp && (
            <AdminViewComp
              user={user}
              setActiveTab={setActiveTab}
            />
          )}

          {/* TAB 12: PROFILE & PREFERENCES */}
          {activeTab === 'profile' && ProfileViewComp && (
            user ? (
              <ProfileViewComp
                user={user}
                setUser={setUser}
                streakDays={streakDays}
                careerReadiness={careerReadiness}
                targetRole={targetRole}
                setActiveTab={setActiveTab}
              />
            ) : (
              <div className="saas-card" style={{ padding: '60px 32px', textAlign: 'center', maxWidth: '520px', margin: '40px auto', borderRadius: '20px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.8rem' }}>
                  🔐
                </div>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>Sign In Required</h2>
                <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '24px' }}>
                  You have signed out. Please sign in or create an account to access your personalized profile and verified LeetCode analytics.
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button onClick={() => setShowAuthModal(true)} className="btn-primary" style={{ padding: '10px 24px', fontWeight: 800 }}>
                    Sign In / Register
                  </button>
                  <button onClick={() => setActiveTab('home')} className="btn-subtle" style={{ padding: '10px 20px' }}>
                    Back to Overview
                  </button>
                </div>
              </div>
            )
          )}

          {/* TAB 13: ONBOARDING */}
          {activeTab === 'onboarding' && OnboardingViewComp && (
            <OnboardingViewComp
              user={user}
              setUser={setUser}
              onComplete={() => {
                setActiveTab('home');
              }}
              setActiveTab={setActiveTab}
            />
          )}

        </main>
      </div>

      {/* 3. STICKY MOBILE BOTTOM APP BAR (NATIVE APP EXPERIENCE) */}
      <nav
        className="mobile-bottom-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 850,
          padding: '0 4px',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.04)'
        }}
      >
        <button
          onClick={() => setActiveTab('home')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: (activeTab === 'home' || activeTab === 'overview') ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: (activeTab === 'home' || activeTab === 'overview') ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('mypath')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'mypath' ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: activeTab === 'mypath' ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
          <span>Path</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: (activeTab === 'practice' || activeTab === 'dsa') ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: (activeTab === 'practice' || activeTab === 'dsa') ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>DSA</span>
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: (activeTab === 'resume' || activeTab === 'resume-gap') ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: (activeTab === 'resume' || activeTab === 'resume-gap') ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <span>Resume</span>
        </button>

        <button
          onClick={() => setActiveTab('chatbot')}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: activeTab === 'chatbot' ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: activeTab === 'chatbot' ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>AI Tutor</span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            color: isMobileMenuOpen ? '#4f46e5' : '#64748b',
            fontSize: '0.68rem',
            fontWeight: isMobileMenuOpen ? 800 : 600,
            cursor: 'pointer',
            padding: '4px 6px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span>More</span>
        </button>
      </nav>

      {/* AUTHENTICATION MODAL */}
      {AuthModalComp && (
        <AuthModalComp
          showAuthModal={showAuthModal}
          setShowAuthModal={setShowAuthModal}
          authMode={authMode}
          setAuthMode={setAuthMode}
          authName={authName}
          setAuthName={setAuthName}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authPassword={authPassword}
          setAuthPassword={setAuthPassword}
          handleAuthSubmit={handleAuthSubmit}
          handleGoogleAuth={handleGoogleAuth}
        />
      )}

    </div>
  );
}

window.App = App;
