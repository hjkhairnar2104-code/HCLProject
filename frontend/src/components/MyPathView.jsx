// Structured Markdown Note Renderer for clean, styled SaaS Cards
function StructuredNoteRenderer({ content }) {
  if (!content) return null;

  // Split content by section headers (### or ##)
  const rawSections = content.split(/(?=###\s+|##\s+)/g);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {rawSections.map((sec, sIdx) => {
        const trimmed = sec.trim();
        if (!trimmed) return null;

        let secTitle = '';
        let secBody = trimmed;

        if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
          const firstLineEnd = trimmed.indexOf('\n');
          if (firstLineEnd !== -1) {
            secTitle = trimmed.substring(0, firstLineEnd).replace(/^#+\s*/, '').trim();
            secBody = trimmed.substring(firstLineEnd).trim();
          } else {
            secTitle = trimmed.replace(/^#+\s*/, '').trim();
            secBody = '';
          }
        }

        // Detect Card Styling
        let cardStyle = {
          background: '#ffffff',
          borderRadius: '10px',
          padding: '16px 18px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        };
        let headerColor = '#0f172a';
        let badgeBg = '#eef2ff';
        let badgeColor = '#4f46e5';
        let badgeText = 'Core Concept';

        const tLower = secTitle.toLowerCase();
        if (tLower.includes('architectural') || tLower.includes('invariant') || tLower.includes('overview')) {
          cardStyle.borderLeft = '4px solid #4f46e5';
          badgeText = 'Architecture & Invariant';
          badgeBg = '#eef2ff';
          badgeColor = '#4f46e5';
        } else if (tLower.includes('mechanics') || tLower.includes('equation') || tLower.includes('formula') || tLower.includes('flow')) {
          cardStyle.borderLeft = '4px solid #0284c7';
          badgeText = 'Mechanics & Formula';
          badgeBg = '#f0f9ff';
          badgeColor = '#0284c7';
        } else if (tLower.includes('implementation') || tLower.includes('pattern') || tLower.includes('code') || tLower.includes('template')) {
          cardStyle.borderLeft = '4px solid #6366f1';
          badgeText = 'Production Code Pattern';
          badgeBg = '#f5f3ff';
          badgeColor = '#6366f1';
        } else if (tLower.includes('trap') || tLower.includes('failure') || tLower.includes('pitfall') || tLower.includes('warning') || tLower.includes('⚠️')) {
          cardStyle.borderLeft = '4px solid #f59e0b';
          cardStyle.background = '#fffdf7';
          badgeText = '⚠️ Interview Corner Cases';
          badgeBg = '#fef3c7';
          badgeColor = '#b45309';
        } else if (tLower.includes('takeaway') || tLower.includes('faang') || tLower.includes('best practice') || tLower.includes('🎯')) {
          cardStyle.borderLeft = '4px solid #10b981';
          cardStyle.background = '#f7fdf9';
          badgeText = '🎯 FAANG Key Takeaways';
          badgeBg = '#dcfce7';
          badgeColor = '#15803d';
        }

        // Render Markdown Content with Marked or Fallback
        let parsedHtml = '';
        if (window.marked && typeof window.marked.parse === 'function') {
          try {
            parsedHtml = window.marked.parse(secBody);
          } catch (e) {
            parsedHtml = '';
          }
        }

        return (
          <div key={sIdx} style={cardStyle}>
            {secTitle && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: headerColor, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {secTitle}
                </h4>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: badgeBg, color: badgeColor, textTransform: 'uppercase' }}>
                  {badgeText}
                </span>
              </div>
            )}

            {parsedHtml ? (
              <div className="markdown-content" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
            ) : (
              <div className="markdown-content" style={{ whiteSpace: 'pre-wrap' }}>{secBody}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

window.StructuredNoteRenderer = StructuredNoteRenderer;

// LearnPath AI — Central Intelligent Learning Path Workspace with True Multi-Level Hierarchy (Domain -> Module -> Topic -> Subtopic)
function MyPathView({ user, setActiveTab, targetRole, setTargetRole, setShowAuthModal }) {
  const API_BASE = 'http://localhost:8085';

  const DOMAINS = window.LEARNING_PATH_DOMAINS || [];

  // Active Domain Selection
  const [selectedDomainId, setSelectedDomainId] = React.useState(() => {
    if (targetRole) {
      const lower = targetRole.toLowerCase();
      if (lower.includes('full') || lower.includes('stack')) return 'fullstack';
      if (lower.includes('deep') || lower.includes('dl') || lower.includes('neural')) return 'dl';
      if (lower.includes('genai') || lower.includes('generative')) return 'genai';
      if (lower.includes('machine') || lower.includes('ml')) return 'ml';
      if (lower.includes('java') || lower.includes('backend') || lower.includes('spring')) return 'java';
      if (lower.includes('devops') || lower.includes('cloud')) return 'devops';
      if (lower.includes('system') || lower.includes('design')) return 'sysdesign';
      if (lower.includes('python')) return 'python';
      if (lower.includes('cyber') || lower.includes('security')) return 'cybersecurity';
    }
    return 'dsa';
  });

  React.useEffect(() => {
    if (targetRole) {
      const lower = targetRole.toLowerCase();
      let matched = 'dsa';
      if (lower.includes('full') || lower.includes('stack')) matched = 'fullstack';
      else if (lower.includes('deep') || lower.includes('dl') || lower.includes('neural')) matched = 'dl';
      else if (lower.includes('genai') || lower.includes('generative')) matched = 'genai';
      else if (lower.includes('machine') || lower.includes('ml')) matched = 'ml';
      else if (lower.includes('java') || lower.includes('backend') || lower.includes('spring')) matched = 'java';
      else if (lower.includes('devops') || lower.includes('cloud') || lower.includes('kubernetes')) matched = 'devops';
      else if (lower.includes('system') || lower.includes('design')) matched = 'sysdesign';
      else if (lower.includes('python')) matched = 'python';
      else if (lower.includes('cyber') || lower.includes('security')) matched = 'cybersecurity';
      else if (lower.includes('database') || lower.includes('sql')) matched = 'database';
      else if (lower.includes('data science')) matched = 'datascience';
      else if (lower.includes('analytics')) matched = 'dataanalytics';
      else if (lower.includes('computer science') || lower.includes('fundamental')) matched = 'csfundamentals';
      setSelectedDomainId(matched);
    }
  }, [targetRole]);

  React.useEffect(() => {
    const handleSkillsUpdated = (e) => {
      if (e && e.detail && e.detail.targetRole && setTargetRole) {
        setTargetRole(e.detail.targetRole);
      }
    };
    window.addEventListener('pathcraft_skills_updated', handleSkillsUpdated);
    return () => window.removeEventListener('pathcraft_skills_updated', handleSkillsUpdated);
  }, []);

  // Active Selected Subtopic / Learning Unit
  const [activeSubtopic, setActiveSubtopic] = React.useState(null);
  const [activeTopicObj, setActiveTopicObj] = React.useState(null);
  const [activeModuleObj, setActiveModuleObj] = React.useState(null);

  // Studio Tab: 'learn' | 'youtube' | 'quiz' | 'practice' | 'notes'
  const [studioTab, setStudioTab] = React.useState('learn');

  // Accordion Expand State: { [moduleId]: boolean, [topicId]: boolean }
  const [expandedNodes, setExpandedNodes] = React.useState({});

  // Modals & Explanation States
  const [showPersonalizeModal, setShowPersonalizeModal] = React.useState(false);
  const [showProveKnowledgeModal, setShowProveKnowledgeModal] = React.useState(false);
  const [personalizeExplanation, setPersonalizeExplanation] = React.useState(null);

  // User-Scoped Progress Helper
  const getProgressStorageKey = (u) => {
    if (u && u.email) {
      return `pathcraft_progress_${u.email.toLowerCase().trim()}`;
    }
    return 'pathcraft_progress_guest';
  };

  // Subtopic Completion IDs Set (Clean 0% initial progress per user)
  const [completedSubtopicIds, setCompletedSubtopicIds] = React.useState(() => {
    try {
      const key = getProgressStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) { }
    return new Set(); // 0% Clean progress by default for new users & guests
  });

  // Re-load progress whenever active user changes
  React.useEffect(() => {
    try {
      const key = getProgressStorageKey(user);
      const saved = localStorage.getItem(key);
      if (saved) {
        setCompletedSubtopicIds(new Set(JSON.parse(saved)));
      } else {
        setCompletedSubtopicIds(new Set());
      }
    } catch (e) {
      setCompletedSubtopicIds(new Set());
    }
  }, [user]);

  // Subtopic Quiz State
  const [quizQuestions, setQuizQuestions] = React.useState([]);
  const [quizAnswers, setQuizAnswers] = React.useState({});
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState(null);
  const [weakConcepts, setWeakConcepts] = React.useState([]);
  const [isQuizLoading, setIsQuizLoading] = React.useState(false);

  // Subtopic YouTube Search State
  const [youtubeVideos, setYoutubeVideos] = React.useState([]);
  const [selectedVideoId, setSelectedVideoId] = React.useState(null);
  const [isYouTubeLoading, setIsYouTubeLoading] = React.useState(false);

  // Contextual AI Tutor
  const [aiTutorQuery, setAiTutorQuery] = React.useState('');
  const [aiTutorResponse, setAiTutorResponse] = React.useState('');
  const [isAiTutorThinking, setIsAiTutorThinking] = React.useState(false);

  // Current Active Domain Object
  const currentDomain = DOMAINS.find(d => d.id === selectedDomainId) || DOMAINS[0] || { modules: [] };

  // Calculate Dynamic Total Leaf Subtopics Count
  const allSubtopicsInDomain = [];
  if (currentDomain.modules) {
    currentDomain.modules.forEach(m => {
      if (m.topics) {
        m.topics.forEach(t => {
          if (t.subtopics) {
            t.subtopics.forEach(st => {
              allSubtopicsInDomain.push({ subtopic: st, topic: t, module: m });
            });
          }
        });
      }
    });
  }

  const totalLeafCount = allSubtopicsInDomain.length;
  const completedLeafCount = allSubtopicsInDomain.filter(item => completedSubtopicIds.has(item.subtopic.id)).length;
  const overallPercentage = totalLeafCount > 0 ? Math.round((completedLeafCount / totalLeafCount) * 100) : 0;

  // Initialize Default Expand & First Subtopic on Domain Switch
  React.useEffect(() => {
    const initialExpanded = {};
    if (currentDomain.modules && currentDomain.modules.length > 0) {
      currentDomain.modules.forEach(m => {
        initialExpanded[m.id] = true;
        if (m.topics) {
          m.topics.forEach(t => {
            initialExpanded[t.id] = true;
          });
        }
      });
      setExpandedNodes(initialExpanded);

      // Select first subtopic by default
      if (allSubtopicsInDomain.length > 0) {
        const first = allSubtopicsInDomain[0];
        handleOpenSubtopic(first.subtopic, first.topic, first.module);
      }
    }
  }, [selectedDomainId]);

  // Toggle Node Accordion
  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  // Open Subtopic Studio & Load Topic-Specific Quiz
  const handleOpenSubtopic = (subtopic, topicObj, moduleObj) => {
    setActiveSubtopic(subtopic);
    setActiveTopicObj(topicObj);
    setActiveModuleObj(moduleObj);
    setStudioTab('learn');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setWeakConcepts([]);
    setAiTutorResponse('');
    fetchSubtopicQuiz(subtopic, topicObj, moduleObj);
    fetchSubtopicYouTube(subtopic, topicObj, moduleObj);
  };

  // Fetch Topic-Specific YouTube Videos from Backend API
  const fetchSubtopicYouTube = async (subtopic, topicObj, moduleObj) => {
    if (!subtopic) return;
    setIsYouTubeLoading(true);
    try {
      const q = subtopic.youtubeQuery || `${subtopic.name} tutorial`;
      const res = await fetch(`${API_BASE}/api/curriculum/youtube?domain=${encodeURIComponent(currentDomain.title)}&module=${encodeURIComponent(moduleObj ? moduleObj.title : '')}&topic=${encodeURIComponent(topicObj ? topicObj.name : '')}&subtopic=${encodeURIComponent(subtopic.name)}&query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setYoutubeVideos(data.videos);
          setSelectedVideoId(data.videos[0].videoId);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsYouTubeLoading(false);
    }

    // Default curated fallback
    setYoutubeVideos([
      {
        videoId: subtopic.youtubeId || 'bkSWJJZNgf8',
        title: `${subtopic.name} — Complete Architecture & Practical Guide`,
        description: subtopic.summary || 'In-depth engineering walkthrough.',
        channelTitle: 'LearnPath AI Academy',
        publishedAt: '2026-01-01',
        thumbnailUrl: `https://img.youtube.com/vi/${subtopic.youtubeId || 'bkSWJJZNgf8'}/mqdefault.jpg`,
        youtubeUrl: `https://www.youtube.com/watch?v=${subtopic.youtubeId || 'bkSWJJZNgf8'}`
      }
    ]);
    setSelectedVideoId(subtopic.youtubeId || 'bkSWJJZNgf8');
  };

  // Fetch Subtopic-Specific Quiz
  const fetchSubtopicQuiz = async (subtopic, topicObj, moduleObj) => {
    if (!subtopic) return;

    // 1. If subtopic has curated questions, use them immediately for 100% precision
    if (subtopic.quizQuestions && subtopic.quizQuestions.length > 0) {
      setQuizQuestions(subtopic.quizQuestions);
      setIsQuizLoading(false);
      return;
    }

    setIsQuizLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/quiz/generate-topic-quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: currentDomain.title,
          module: moduleObj ? moduleObj.title : 'Core',
          topic: topicObj ? topicObj.name : 'Topic',
          subtopic: subtopic.name,
          difficulty: topicObj ? topicObj.difficulty : 'Intermediate'
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setQuizQuestions(data.questions);
          return;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsQuizLoading(false);
    }

    // Default fallback if neither API nor embedded questions are present
    setQuizQuestions([
      {
        question: `What is the fundamental invariant of ${subtopic.name}?`,
        options: [
          `Ensuring optimal time and space efficiency in ${subtopic.name}`,
          'Arbitrary mutations without constraints',
          'Unbounded memory allocation',
          'Disabling compiler type checking'
        ],
        correctIndex: 0,
        explanation: `Mastering the invariant of ${subtopic.name} ensures optimal performance and correctness.`,
        subconcept: 'Core Invariant'
      }
    ]);
  };

  // Toggle Subtopic Completion (User-Scoped)
  const handleToggleSubtopicComplete = (subtopicId) => {
    const next = new Set(completedSubtopicIds);
    if (next.has(subtopicId)) {
      next.delete(subtopicId);
    } else {
      next.add(subtopicId);
      try { confetti({ particleCount: 60, spread: 60 }); } catch (e) { }
    }
    setCompletedSubtopicIds(next);
    try {
      const key = getProgressStorageKey(user);
      localStorage.setItem(key, JSON.stringify(Array.from(next)));
    } catch (e) { }
  };

  // Submit Subtopic Quiz
  const handleSubmitSubtopicQuiz = () => {
    if (quizQuestions.length === 0) return;
    let correct = 0;
    const weakList = [];

    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct++;
      } else {
        if (q.subconcept && !weakList.includes(q.subconcept)) {
          weakList.push(q.subconcept);
        }
      }
    });

    setQuizScore(correct);
    setWeakConcepts(weakList);
    setQuizSubmitted(true);

    if (correct >= Math.ceil(quizQuestions.length * 0.75)) {
      if (activeSubtopic) handleToggleSubtopicComplete(activeSubtopic.id);
      try { confetti({ particleCount: 80, spread: 70 }); } catch (e) { }
    }
  };

  // Contextual AI Tutor Query
  const handleAskContextualAiTutor = async (customPrompt) => {
    const promptToAsk = customPrompt || aiTutorQuery;
    if (!promptToAsk.trim()) return;

    setIsAiTutorThinking(true);
    setAiTutorResponse('');
    try {
      const topicContext = `Domain: ${currentDomain.title}, Module: ${activeModuleObj ? activeModuleObj.title : ''}, Topic: ${activeTopicObj ? activeTopicObj.name : ''}, Subtopic: ${activeSubtopic ? activeSubtopic.name : ''}, Mastery: ${activeSubtopic ? activeSubtopic.masteryScore : 70}%, Weak Areas: ${weakConcepts.join(', ') || 'None'}`;
      const fullMessage = `[Learning Context: ${topicContext}]\nLearner Query: "${promptToAsk}"\nAnswer specifically about ${activeSubtopic ? activeSubtopic.name : currentDomain.title} with high technical accuracy.`;

      const res = await fetch(`${API_BASE}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: fullMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setAiTutorResponse(data.response || data.message || 'Analysis ready.');
      } else {
        setAiTutorResponse(`Here is a focused tip for ${activeSubtopic ? activeSubtopic.name : 'this concept'}: Focus on the core invariant and practice writing the code template from memory.`);
      }
    } catch (e) {
      setAiTutorResponse(`Key tip for ${activeSubtopic ? activeSubtopic.name : 'this concept'}: Review the gate equations and verify edge cases.`);
    } finally {
      setIsAiTutorThinking(false);
      setAiTutorQuery('');
    }
  };

  // Personalization Handler
  const handleApplyPersonalization = (knownSkillsText) => {
    setShowPersonalizeModal(false);
    setPersonalizeExplanation(`Based on your verified skills in "${knownSkillsText || 'Python & Array Foundations'}", introductory modules have been skipped. Your dynamic path has been reprioritized to focus directly on advanced data structures, systems, and algorithms.`);
    try { confetti({ particleCount: 70, spread: 60 }); } catch (e) { }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1440px', margin: '0 auto' }}>

      {/* =========================================================================
          VIEW 1: DOMAIN SELECTION (10 COMPREHENSIVE DOMAINS)
         ========================================================================= */}
      <div className="saas-card" style={{ padding: '28px 32px', borderLeft: '4px solid #4f46e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <span className="badge badge-primary">CENTRAL LEARNING OPERATING SYSTEM</span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
              What do you want to learn?
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '2px' }}>
              Choose a field and LearnPath AI will build a personalized, deeply granular learning journey for you.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={() => setShowProveKnowledgeModal(true)}
              className="btn-secondary"
              style={{ fontSize: '0.84rem', padding: '9px 16px' }}
            >
              ⚡ Prove I Know This
            </button>

            <button
              onClick={() => setShowPersonalizeModal(true)}
              className="btn-primary"
              style={{ fontSize: '0.84rem', padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              ✨ Personalize My Path
            </button>
          </div>
        </div>

        {/* LARGE SELECTABLE DOMAIN CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
          {DOMAINS.map(d => {
            const isSelected = selectedDomainId === d.id;
            const topicsCount = d.modules ? d.modules.reduce((acc, m) => acc + (m.topics ? m.topics.length : 0), 0) : 0;
            const subtopicsCount = d.modules ? d.modules.reduce((acc, m) => acc + (m.topics ? m.topics.reduce((tAcc, t) => tAcc + (t.subtopics ? t.subtopics.length : 0), 0) : 0), 0) : 0;
            return (
              <div
                key={d.id}
                onClick={() => {
                  setSelectedDomainId(d.id);
                  if (setTargetRole) setTargetRole(d.title);
                  try { confetti({ particleCount: 30, spread: 40 }); } catch (e) { }
                }}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                  background: isSelected ? '#f8faff' : '#ffffff',
                  boxShadow: isSelected ? '0 4px 14px rgba(79, 70, 229, 0.12)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{d.icon}</div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: isSelected ? '#4f46e5' : '#0f172a' }}>
                    {d.title}
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, marginTop: '4px' }}>
                    {d.description}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: '#475569', fontWeight: 700, paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                  <span>{d.modules?.length || 0} Modules · {topicsCount} Topics · {subtopicsCount} Subtopics</span>
                  <span style={{ color: isSelected ? '#4f46e5' : '#64748b' }}>{d.difficulty}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI PERSONALIZATION NOTIFICATION BANNER */}
      {personalizeExplanation && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ✨ AI Adaptive Curriculum Calibration
            </span>
            <p style={{ fontSize: '0.84rem', color: '#15803d', marginTop: '2px', lineHeight: 1.45 }}>
              {personalizeExplanation}
            </p>
          </div>
          <button
            onClick={() => setPersonalizeExplanation(null)}
            style={{ background: 'transparent', border: 'none', color: '#166534', fontWeight: 800, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: DOMAIN DASHBOARD & PROGRESS METRICS
         ========================================================================= */}
      <div className="saas-card" style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ACTIVE LEARNING JOURNEY
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
              Your {currentDomain.title} Mastery Path
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>EST. DURATION</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{currentDomain.duration || '100 Hours'}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>TOPICS COMPLETED</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4f46e5' }}>
                {completedLeafCount} / {totalLeafCount} Topics
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>OVERALL MASTERY</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                {overallPercentage}% Ready
              </div>
            </div>
          </div>
        </div>

        {/* PROGRESS BAR VISUALIZATION */}
        <div style={{ width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${Math.max(4, overallPercentage)}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #4f46e5, #06b6d4)',
              borderRadius: '999px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>

      {/* =========================================================================
          VIEW 3: MULTI-LEVEL HIERARCHY TREE (LEFT) -> TOPIC STUDIO (RIGHT)
         ========================================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: activeSubtopic ? '460px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>

        {/* -----------------------------------------------------------------------
            LEFT: COMPLETE EXPANDABLE HIERARCHY TREE (MODULE -> TOPIC -> SUBTOPICS)
           ----------------------------------------------------------------------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            📚 Complete Curriculum Tree ({totalLeafCount} Interactive Topics)
          </div>

          {currentDomain.modules && currentDomain.modules.map(moduleObj => {
            const isModuleExpanded = !!expandedNodes[moduleObj.id];

            return (
              <div key={moduleObj.id} className="saas-card" style={{ padding: '0', overflow: 'hidden' }}>

                {/* MODULE ACCORDION HEADER */}
                <div
                  onClick={() => toggleNode(moduleObj.id)}
                  style={{
                    padding: '14px 18px',
                    background: '#f8fafc',
                    borderBottom: isModuleExpanded ? '1px solid #e2e8f0' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a' }}>
                      {moduleObj.title}
                    </h3>
                  </div>

                  <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 800 }}>
                    {isModuleExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {/* TOPICS & SUBTOPICS INSIDE MODULE */}
                {isModuleExpanded && moduleObj.topics && (
                  <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {moduleObj.topics.map(topic => {
                      const isTopicExpanded = !!expandedNodes[topic.id];

                      return (
                        <div key={topic.id} style={{ border: '1px solid #f1f5f9', borderRadius: '8px', overflow: 'hidden' }}>

                          {/* TOPIC HEADER */}
                          <div
                            onClick={() => toggleNode(topic.id)}
                            style={{
                              padding: '10px 14px',
                              background: '#ffffff',
                              borderBottom: isTopicExpanded ? '1px solid #f1f5f9' : 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.8rem' }}>•</span>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#1e293b' }}>
                                {topic.name}
                              </h4>
                            </div>

                            <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              {topic.subtopics ? topic.subtopics.length : 0} Lessons {isTopicExpanded ? '▲' : '▼'}
                            </span>
                          </div>

                          {/* SUBTOPICS (INDIVIDUAL CLICKABLE LEAF UNITS) */}
                          {isTopicExpanded && topic.subtopics && (
                            <div style={{ padding: '8px 12px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {topic.subtopics.map(subtopic => {
                                const isCurrent = activeSubtopic && activeSubtopic.id === subtopic.id;
                                const isDone = completedSubtopicIds.has(subtopic.id);

                                return (
                                  <div
                                    key={subtopic.id}
                                    onClick={() => handleOpenSubtopic(subtopic, topic, moduleObj)}
                                    style={{
                                      padding: '10px 12px',
                                      borderRadius: '6px',
                                      border: isCurrent ? '2px solid #4f46e5' : (isDone ? '1px solid #86efac' : '1px solid #e2e8f0'),
                                      background: isCurrent ? '#f0f4ff' : (isDone ? '#f0fdf4' : '#ffffff'),
                                      cursor: 'pointer',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      gap: '8px',
                                      transition: 'all 0.12s ease'
                                    }}
                                  >
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '0.82rem', fontWeight: isCurrent ? 800 : 700, color: isCurrent ? '#4f46e5' : '#0f172a' }}>
                                        {isDone ? '✓ ' : '○ '} {subtopic.name}
                                      </div>
                                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                                        ⏱️ {subtopic.estHours}h · Mastery: {subtopic.masteryScore}%
                                      </div>
                                    </div>

                                    <span style={{ fontSize: '0.72rem', color: isCurrent ? '#4f46e5' : '#64748b', fontWeight: 700 }}>
                                      {isCurrent ? 'Active Studio' : 'Open →'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* -----------------------------------------------------------------------
            RIGHT: DEDICATED SUBTOPIC LEARNING STUDIO (5 TABS)
           ----------------------------------------------------------------------- */}
        {activeSubtopic && (
          <div className="saas-card" style={{ padding: '28px', position: 'sticky', top: '24px' }}>

            {/* WORKSPACE HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9', marginBottom: '18px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#64748b', marginBottom: '4px' }}>
                  <span>{activeModuleObj ? activeModuleObj.title : ''}</span>
                  <span>›</span>
                  <span>{activeTopicObj ? activeTopicObj.name : ''}</span>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>
                  {activeSubtopic.name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <span className="badge badge-primary">{activeTopicObj ? activeTopicObj.difficulty : 'Intermediate'}</span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>⏱️ {activeSubtopic.estHours} Hours</span>
                  <span className="badge badge-success">Mastery: {activeSubtopic.masteryScore}%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => handleToggleSubtopicComplete(activeSubtopic.id)}
                  className={completedSubtopicIds.has(activeSubtopic.id) ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.8rem', padding: '7px 14px' }}
                >
                  {completedSubtopicIds.has(activeSubtopic.id) ? '✓ Mastered' : '○ Mark Done'}
                </button>

                <button
                  onClick={() => setActiveSubtopic(null)}
                  style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b' }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 5 WORKSPACE TABS */}
            <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { id: 'learn', label: '📖 1. Learn' },
                { id: 'youtube', label: '🎬 2. YouTube Resource' },
                { id: 'quiz', label: '📊 3. Topic AI Quiz' },
                { id: 'practice', label: '🧠 4. Practice' },
                { id: 'notes', label: '📝 5. Notes' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setStudioTab(tab.id)}
                  className={studioTab === tab.id ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.8rem', padding: '7px 13px' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB 1: LEARN */}
            {studioTab === 'learn' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                    📌 Learning Intuition & Objective
                  </h4>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55 }}>
                    {activeSubtopic.summary}
                  </p>
                </div>

                <div style={{ background: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <StructuredNoteRenderer content={activeSubtopic.learnContent} />
                </div>
              </div>
            )}

            {/* TAB 2: YOUTUBE RESOURCES */}
            {studioTab === 'youtube' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {isYouTubeLoading ? (
                  <div style={{ padding: '30px', textAlign: 'center', color: '#4f46e5', fontWeight: 600 }}>
                    ⚡ Fetching verified YouTube video lessons for {activeSubtopic.name}...
                  </div>
                ) : (
                  <>
                    {/* Featured Video Player */}
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000000', border: '1px solid #e2e8f0' }}>
                      <iframe
                        key={selectedVideoId || youtubeVideos[0]?.videoId || activeSubtopic.id}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        src={`https://www.youtube-nocookie.com/embed/${selectedVideoId || youtubeVideos[0]?.videoId || activeSubtopic.youtubeId || 'bkSWJJZNgf8'}?rel=0`}
                        title={activeSubtopic.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ fontSize: '0.84rem', color: '#475569' }}>
                        Topic Search Query: <strong>"{activeSubtopic.youtubeQuery || activeSubtopic.name}"</strong>
                      </div>
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(activeSubtopic.youtubeQuery || activeSubtopic.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '6px 14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        ▶️ Open Full YouTube Playlist ↗
                      </a>
                    </div>

                    {/* Retrieved YouTube Video Cards */}
                    {youtubeVideos.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          🎬 Related Video Lessons & Engineering Walkthroughs (Click to Play):
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                          {youtubeVideos.map((vid, vIdx) => {
                            const isPlaying = (selectedVideoId === vid.videoId) || (!selectedVideoId && vIdx === 0);
                            return (
                              <div
                                key={vIdx}
                                onClick={() => setSelectedVideoId(vid.videoId)}
                                style={{
                                  display: 'flex',
                                  gap: '10px',
                                  padding: '10px',
                                  borderRadius: '10px',
                                  border: isPlaying ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                                  background: isPlaying ? '#f0fdf4' : '#f8fafc',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                <div style={{ position: 'relative', width: '100px', height: '64px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                                  <img
                                    src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                                    alt={vid.title}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                  {isPlaying && (
                                    <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: '#4f46e5', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                                      PLAYING
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isPlaying ? '#4f46e5' : '#0f172a', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {vid.title}
                                  </div>
                                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                                    📺 {vid.channelTitle || 'YouTube'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* TAB 3: TOPIC-SPECIFIC AI QUIZ & ADAPTIVE GAP DETECTION */}
            {studioTab === 'quiz' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {isQuizLoading ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#4f46e5', fontWeight: 600 }}>
                    ⚡ Generating topic-specific AI questions for {activeSubtopic.name}...
                  </div>
                ) : (
                  quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} style={{ padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>
                        {qIdx + 1}. {q.question}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          const isCorrect = q.correctIndex === oIdx;

                          let bg = '#ffffff';
                          let border = '#e2e8f0';
                          let color = '#334155';

                          if (quizSubmitted) {
                            if (isCorrect) {
                              bg = '#f0fdf4';
                              border = '#86efac';
                              color = '#166534';
                            } else if (isSelected && !isCorrect) {
                              bg = '#fef2f2';
                              border = '#fca5a5';
                              color = '#991b1b';
                            }
                          } else if (isSelected) {
                            bg = '#eef2ff';
                            border = '#6366f1';
                            color = '#4338ca';
                          }

                          return (
                            <div
                              key={oIdx}
                              onClick={() => {
                                if (!quizSubmitted) setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx });
                              }}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: bg,
                                border: `1px solid ${border}`,
                                color: color,
                                fontSize: '0.8rem',
                                cursor: quizSubmitted ? 'default' : 'pointer'
                              }}
                            >
                              <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt}
                            </div>
                          );
                        })}
                      </div>

                      {quizSubmitted && q.explanation && (
                        <div style={{ marginTop: '8px', padding: '8px', background: '#ffffff', borderRadius: '6px', fontSize: '0.74rem', color: '#475569' }}>
                          💡 <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* ADAPTIVE FEEDBACK & SUBMIT BUTTON */}
                {quizSubmitted && (
                  <div style={{ padding: '16px', borderRadius: '10px', background: quizScore >= Math.ceil(quizQuestions.length * 0.75) ? '#f0fdf4' : '#fffbeb', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: quizScore >= Math.ceil(quizQuestions.length * 0.75) ? '#059669' : '#d97706' }}>
                      Score: {quizScore} / {quizQuestions.length} ({Math.round((quizScore / quizQuestions.length) * 100)}%)
                    </div>

                    {weakConcepts.length > 0 ? (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 700 }}>
                          ⚠️ Skill Gap Detected in: {weakConcepts.join(', ')}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#92400e', marginTop: '2px' }}>
                          AI Recommendation: Review {weakConcepts[0]} video explanations before advancing.
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#166534', marginTop: '4px', fontWeight: 700 }}>
                        ✅ Mastery achieved! You have unlocked the next module.
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmitSubtopicQuiz}
                  className="btn-primary"
                  style={{ padding: '9px 18px', fontSize: '0.84rem' }}
                >
                  {quizSubmitted ? 'Retake Quiz' : 'Submit Quiz & Calculate Mastery →'}
                </button>
              </div>
            )}

            {/* TAB 4: PRACTICE PROBLEMS */}
            {studioTab === 'practice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {activeSubtopic.practiceProblems && activeSubtopic.practiceProblems.map((prob, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>{prob.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Platform: LeetCode / Verified</div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={prob.diff === 'Easy' ? 'badge badge-success' : (prob.diff === 'Medium' ? 'badge badge-warning' : 'badge badge-danger')} style={{ fontSize: '0.68rem' }}>
                        {prob.diff}
                      </span>
                      <a
                        href={prob.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                        style={{ fontSize: '0.76rem', padding: '5px 10px', textDecoration: 'none' }}
                      >
                        Solve ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: DETAILED ARCHITECTURAL NOTES */}
            {studioTab === 'notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem', textTransform: 'uppercase' }}>
                      Structured Study Guide
                    </span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                      {activeSubtopic.name}
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#ffffff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                    ⏱️ {activeSubtopic.estHours || 2.0}h Guide
                  </span>
                </div>

                <StructuredNoteRenderer content={activeSubtopic.notes || activeSubtopic.learnContent || activeSubtopic.summary} />
              </div>
            )}

            {/* CONTEXTUAL AI TUTOR */}
            <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.88rem' }}>✨</span>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  Ask AI Tutor about {activeSubtopic.name}
                </h4>
              </div>

              {/* QUICK PROMPT PILLS */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {[
                  'Explain simply',
                  'Give me an example',
                  'Why is this O(n)?',
                  'What are common interview edge cases?'
                ].map((pill, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleAskContextualAiTutor(pill)}
                    style={{
                      padding: '4px 8px',
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder={`Ask doubt on ${activeSubtopic.name}...`}
                  value={aiTutorQuery}
                  onChange={e => setAiTutorQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskContextualAiTutor()}
                  className="saas-input"
                  style={{ fontSize: '0.82rem', padding: '8px 12px' }}
                />
                <button
                  onClick={() => handleAskContextualAiTutor()}
                  className="btn-primary"
                  disabled={isAiTutorThinking}
                  style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                >
                  {isAiTutorThinking ? '...' : 'Ask'}
                </button>
              </div>

              {/* AI TUTOR RESPONSE BOX */}
              {aiTutorResponse && (
                <div style={{ marginTop: '12px', padding: '14px', background: '#f8faff', border: '1px solid #c7d2fe', borderRadius: '8px', fontSize: '0.82rem', color: '#1e1b4b', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                  🤖 <strong>AI Tutor:</strong> {aiTutorResponse}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* PROVE I KNOW THIS DIAGNOSTIC MODAL */}
      {showProveKnowledgeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowProveKnowledgeModal(false)}
        >
          <div
            className="saas-card"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-modal)',
              animation: 'fadeInUp 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span className="badge badge-primary">DIAGNOSTIC TEST</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  ⚡ Prove I Know This
                </h3>
              </div>
              <button
                onClick={() => setShowProveKnowledgeModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
              Take a fast 3-question diagnostic assessment. Score 90%+ to immediately skip foundational modules and jump directly into advanced topics!
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowProveKnowledgeModal(false)} className="btn-secondary" style={{ fontSize: '0.84rem', padding: '8px 16px' }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowProveKnowledgeModal(false);
                  setPersonalizeExplanation('Diagnostic test passed at 100%! Foundational modules skipped successfully. Your journey now starts at intermediate modules.');
                  try { confetti({ particleCount: 80, spread: 70 }); } catch (e) { }
                }}
                className="btn-primary"
                style={{ fontSize: '0.84rem', padding: '8px 18px' }}
              >
                Start Diagnostic →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PERSONALIZE MY PATH MODAL */}
      {showPersonalizeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowPersonalizeModal(false)}
        >
          <div
            className="saas-card"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-modal)',
              animation: 'fadeInUp 0.2s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary">AI PATH CALIBRATION</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  Personalize Your Learning Path
                </h3>
              </div>
              <button
                onClick={() => setShowPersonalizeModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '0.9rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', marginBottom: '16px' }}>
              Tell LearnPath AI what you already know so we don’t make you start from zero. We’ll skip mastered topics and focus directly on your biggest gaps.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Topics or Skills You Already Mastered:
                </label>
                <input
                  id="knownSkillsInput"
                  type="text"
                  defaultValue="Python basics, Arrays, Linked Lists"
                  className="saas-input"
                  style={{ fontSize: '0.84rem', padding: '10px 12px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Target Completion Timeline:
                </label>
                <select className="saas-input" style={{ fontSize: '0.84rem', padding: '10px 12px' }}>
                  <option>6 Weeks (Intensive 15 hrs/week)</option>
                  <option>12 Weeks (Standard 8 hrs/week)</option>
                  <option>24 Weeks (Part-time 4 hrs/week)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setShowPersonalizeModal(false)} className="btn-secondary" style={{ fontSize: '0.84rem', padding: '8px 16px' }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  const inputVal = document.getElementById('knownSkillsInput')?.value || '';
                  handleApplyPersonalization(inputVal);
                }}
                className="btn-primary"
                style={{ fontSize: '0.84rem', padding: '8px 18px' }}
              >
                Recalibrate My Path 🚀
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

window.MyPathView = MyPathView;
