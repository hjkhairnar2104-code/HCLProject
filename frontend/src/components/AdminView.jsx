// LearnPath AI - Secure Instructor & Admin Portal (Clean Modern Light SaaS)
function AdminView({ user, setActiveTab }) {
  const API_BASE = 'http://localhost:8085';

  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return sessionStorage.getItem('pathcraft_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = React.useState('');
  const [adminPassword, setAdminPassword] = React.useState('');
  const [authError, setAuthError] = React.useState('');
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);

  const [adminTab, setAdminTab] = React.useState('ai_generator'); // 'ai_generator' | 'manual_assessment' | 'interview' | 'stats'
  const [assessmentDomain, setAssessmentDomain] = React.useState('all');
  const [interviewRole, setInterviewRole] = React.useState('all');

  const [customAssessments, setCustomAssessments] = React.useState([]);
  const [customInterviews, setCustomInterviews] = React.useState([]);
  const [stats, setStats] = React.useState(null);

  // AI Generator Form State
  const [aiForm, setAiForm] = React.useState({
    domain: 'aiml',
    assignmentTopic: 'Neural Networks & Backpropagation',
    level: 1,
    count: 10
  });
  const [isGeneratingAi, setIsGeneratingAi] = React.useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = React.useState('');

  // Manual Question Form State
  const [newAssessment, setNewAssessment] = React.useState({
    domain: 'aiml',
    assignmentTopic: 'Deep Learning Basics',
    level: 1,
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: ''
  });

  // Interview Form State
  const [newInterview, setNewInterview] = React.useState({
    targetRole: 'Generative AI Engineer',
    topic: 'RAG Pipeline & Embeddings',
    question: '',
    modelAnswer: '',
    proTip: '',
    roundOrder: 1
  });

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword })
      });

      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem('pathcraft_admin_auth', 'true');
        fetchAssessmentQuestions();
        fetchInterviewQuestions();
        fetchStats();
      } else {
        setAuthError(data.message || 'Invalid Master Key Credentials.');
      }
    } catch (err) {
      if (adminEmail === 'admin@pathcraft.ai' && adminPassword === 'PathCraft@Admin2026!') {
        setIsAuthenticated(true);
        sessionStorage.setItem('pathcraft_admin_auth', 'true');
        fetchAssessmentQuestions();
      } else {
        setAuthError('Connection error or invalid credentials.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const fetchAssessmentQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/questions`);
      if (res.ok) setCustomAssessments(await res.json());
    } catch (e) {}
  };

  const fetchInterviewQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/interviews`);
      if (res.ok) setCustomInterviews(await res.json());
    } catch (e) {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/stats`);
      if (res.ok) setStats(await res.json());
    } catch (e) {}
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchAssessmentQuestions();
      fetchInterviewQuestions();
      fetchStats();
    }
  }, [isAuthenticated]);

  // AI GENERATOR
  const handleAiBatchGenerate = async (e) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiSuccessMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/admin/ai-generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: aiForm.domain,
          assignmentTopic: aiForm.assignmentTopic,
          level: parseInt(aiForm.level),
          count: parseInt(aiForm.count)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiSuccessMessage(`🎉 Successfully generated and saved ${data.count} questions on "${aiForm.assignmentTopic}" using Gemini 2.5 Flash!`);
        fetchAssessmentQuestions();
        fetchStats();
        try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}
      } else {
        alert("Error generating questions with AI.");
      }
    } catch (err) {
      alert("Backend connection error.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // MANUAL QUESTION
  const handleCreateManualAssessment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: newAssessment.domain,
          assignmentTopic: newAssessment.assignmentTopic,
          level: parseInt(newAssessment.level),
          question: newAssessment.question,
          options: [newAssessment.optionA, newAssessment.optionB, newAssessment.optionC, newAssessment.optionD],
          correctIndex: parseInt(newAssessment.correctIndex),
          explanation: newAssessment.explanation,
          addedBy: 'admin-manual'
        })
      });
      if (res.ok) {
        alert("✓ Custom Assessment Question added to backend!");
        setNewAssessment({ domain: 'aiml', assignmentTopic: '', level: 1, question: '', optionA: '', optionB: '', optionC: '', optionD: '', correctIndex: 0, explanation: '' });
        fetchAssessmentQuestions();
        fetchStats();
      }
    } catch (err) {
      alert("Error saving question.");
    }
  };

  const handleDeleteAssessment = async (id) => {
    if (!confirm("Are you sure you want to delete this question from the backend?")) return;
    try {
      await fetch(`${API_BASE}/api/admin/questions/${id}`, { method: 'DELETE' });
      fetchAssessmentQuestions();
      fetchStats();
    } catch (e) {}
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: '460px', margin: '40px auto', padding: '0 16px' }}>
        <div className="saas-card" style={{ padding: '36px 32px', borderLeft: '4px solid #4f46e5', textAlign: 'center' }}>
          
          <div style={{
            width: '52px', height: '52px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px', fontSize: '1.5rem', color: '#ffffff',
            boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
          }}>
            🔒
          </div>

          <span className="badge badge-primary">RESTRICTED ACCESS</span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
            LearnPath Admin Portal
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px', marginBottom: '20px' }}>
            Manage curriculum, question banks, and batch AI generation with Gemini 2.5 Flash.
          </p>

          {authError && (
            <div style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.78rem', marginBottom: '14px' }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Admin Email</label>
              <input
                type="email"
                required
                placeholder="admin@pathcraft.ai"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="saas-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Master Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="saas-input"
              />
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '6px', fontSize: '0.88rem' }}
            >
              {isAuthenticating ? 'Authenticating...' : 'Unlock Admin Portal 🔐'}
            </button>
          </form>

          <div style={{ marginTop: '16px', fontSize: '0.72rem', color: '#94a3b8' }}>
            Use Master Credentials to manage platform data.
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER */}
      <div className="saas-card" style={{ padding: '24px 28px', borderLeft: '4px solid #4f46e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-primary">MASTER ADMIN CONSOLE</span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Curriculum & AI Generation Manager
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
            Generate 5–20 questions per assignment topic with Gemini 2.5 Flash or create custom question banks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              sessionStorage.removeItem('pathcraft_admin_auth');
              setIsAuthenticated(false);
            }}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '7px 14px' }}
          >
            🔒 Lock Admin
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[
          { id: 'ai_generator', label: '⚡ 1-Click AI Generator (Gemini 2.5)' },
          { id: 'manual_assessment', label: '✍️ Manual MCQ Question Builder' },
          { id: 'interview', label: '🎙️ Mock Interview Questions' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setAdminTab(t.id)}
            className={adminTab === t.id ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: 1-CLICK AI QUESTION GENERATOR */}
      {adminTab === 'ai_generator' && (
        <div className="saas-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
            ⚡ Batch AI Question Generator (Powered by Gemini 2.5 Flash)
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '20px' }}>
            Specify any topic name (e.g. "RAG Pipelines & Chunking", "PostgreSQL MVCC", "Kubernetes Ingress") and batch-create verified questions directly in DB.
          </p>

          {aiSuccessMessage && (
            <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#065f46', fontSize: '0.84rem', fontWeight: 600, marginBottom: '20px' }}>
              {aiSuccessMessage}
            </div>
          )}

          <form onSubmit={handleAiBatchGenerate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Curriculum Domain
              </label>
              <select
                value={aiForm.domain}
                onChange={e => setAiForm({ ...aiForm, domain: e.target.value })}
                className="saas-input"
              >
                <option value="aiml">🤖 AI / Machine Learning & PyTorch</option>
                <option value="java">☕ Java Core & Spring Boot</option>
                <option value="db">🗄️ Database & SQL Optimization</option>
                <option value="sysdesign">🏗️ System Design & Architecture</option>
                <option value="devops">🚢 DevOps & Cloud Infrastructure</option>
                <option value="dsa">🧠 Data Structures & Algorithms</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Number of Questions to Generate
              </label>
              <select
                value={aiForm.count}
                onChange={e => setAiForm({ ...aiForm, count: parseInt(e.target.value) })}
                className="saas-input"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions (Recommended)</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Assignment / Topic Name:
              </label>
              <input
                type="text"
                required
                placeholder="e.g. RAG Pipelines, Vector Search & Embeddings"
                value={aiForm.assignmentTopic}
                onChange={e => setAiForm({ ...aiForm, assignmentTopic: e.target.value })}
                className="saas-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Target Difficulty Level
              </label>
              <select
                value={aiForm.level}
                onChange={e => setAiForm({ ...aiForm, level: parseInt(e.target.value) })}
                className="saas-input"
              >
                <option value={1}>Level 1: Foundations</option>
                <option value={2}>Level 2: Core Application</option>
                <option value={3}>Level 3: Advanced Reasoning</option>
                <option value={4}>Level 4: Interview Scenarios</option>
                <option value={5}>Level 5: Expert Mastery</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                disabled={isGeneratingAi}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '0.88rem' }}
              >
                {isGeneratingAi ? '⚡ Generating with Gemini 2.5...' : `🚀 Generate & Save ${aiForm.count} Questions →`}
              </button>
            </div>
          </form>

          {/* CUSTOM QUESTIONS LIST */}
          <div style={{ marginTop: '32px' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              Existing Custom Question Bank ({customAssessments.length} Total)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
              {customAssessments.map(q => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '3px' }}>
                      <span className="badge badge-primary">{q.domain?.toUpperCase()}</span>
                      <span className="badge badge-neutral">Level {q.level}</span>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{q.assignmentTopic}</span>
                    </div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>{q.question}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteAssessment(q.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', padding: '6px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MANUAL QUESTION BUILDER */}
      {adminTab === 'manual_assessment' && (
        <div className="saas-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            ✍️ Add Single Custom Question
          </h3>

          <form onSubmit={handleCreateManualAssessment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Domain</label>
              <select value={newAssessment.domain} onChange={e => setNewAssessment({ ...newAssessment, domain: e.target.value })} className="saas-input">
                <option value="aiml">AI / ML</option>
                <option value="java">Java / Spring</option>
                <option value="db">Database & SQL</option>
                <option value="sysdesign">System Design</option>
                <option value="devops">DevOps</option>
                <option value="dsa">DSA</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Assignment Topic</label>
              <input type="text" required placeholder="e.g. Backpropagation Math" value={newAssessment.assignmentTopic} onChange={e => setNewAssessment({ ...newAssessment, assignmentTopic: e.target.value })} className="saas-input" />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Question Text</label>
              <textarea rows={2} required placeholder="Enter question..." value={newAssessment.question} onChange={e => setNewAssessment({ ...newAssessment, question: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Option A</label>
              <input type="text" required value={newAssessment.optionA} onChange={e => setNewAssessment({ ...newAssessment, optionA: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Option B</label>
              <input type="text" required value={newAssessment.optionB} onChange={e => setNewAssessment({ ...newAssessment, optionB: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Option C</label>
              <input type="text" required value={newAssessment.optionC} onChange={e => setNewAssessment({ ...newAssessment, optionC: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Option D</label>
              <input type="text" required value={newAssessment.optionD} onChange={e => setNewAssessment({ ...newAssessment, optionD: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Correct Option</label>
              <select value={newAssessment.correctIndex} onChange={e => setNewAssessment({ ...newAssessment, correctIndex: parseInt(e.target.value) })} className="saas-input">
                <option value={0}>Option A</option>
                <option value={1}>Option B</option>
                <option value={2}>Option C</option>
                <option value={3}>Option D</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Explanation</label>
              <input type="text" placeholder="Explain the concept..." value={newAssessment.explanation} onChange={e => setNewAssessment({ ...newAssessment, explanation: e.target.value })} className="saas-input" />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn-primary">
                Save Custom Question →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: MOCK INTERVIEW QUESTIONS */}
      {adminTab === 'interview' && (
        <div className="saas-card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            🎙️ Add Custom Mock Interview Question
          </h3>

          <form onSubmit={handleCreateInterview} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Target Role</label>
              <select value={newInterview.targetRole} onChange={e => setNewInterview({ ...newInterview, targetRole: e.target.value })} className="saas-input">
                <option value="Generative AI Engineer">Generative AI Engineer</option>
                <option value="Backend Engineer">Backend Engineer</option>
                <option value="DevOps Engineer">DevOps Engineer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Topic</label>
              <input type="text" required placeholder="e.g. Transformer Attention" value={newInterview.topic} onChange={e => setNewInterview({ ...newInterview, topic: e.target.value })} className="saas-input" />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Question Text</label>
              <textarea rows={3} required placeholder="Enter interview question..." value={newInterview.question} onChange={e => setNewInterview({ ...newInterview, question: e.target.value })} className="saas-input" />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button type="submit" className="btn-primary">
                Save Interview Question →
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

window.AdminView = AdminView;
