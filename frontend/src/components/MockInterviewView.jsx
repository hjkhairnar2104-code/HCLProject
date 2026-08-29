// LearnPath AI - Live AI Mock Interview Studio (Clean Modern Light SaaS)
function MockInterviewView({ user, setActiveTab }) {
  const API_BASE = window.API_BASE || 'https://hclproject-cbmh.onrender.com';

  // Step: 'setup' | 'interviewing' | 'evaluation'
  const [interviewStep, setInterviewStep] = React.useState('setup');

  // Setup Options
  const [interviewType, setInterviewType] = React.useState('Technical');
  const [targetRole, setTargetRole] = React.useState('Generative AI Engineer');
  const [experienceLevel, setExperienceLevel] = React.useState('Intermediate');

  // Live Interview State
  const [currentQuestion, setCurrentQuestion] = React.useState('');
  const [currentTopic, setCurrentTopic] = React.useState('');
  const [questionNumber, setQuestionNumber] = React.useState(1);
  const [totalRounds] = React.useState(6);
  const [userAnswer, setUserAnswer] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [isAiEvaluating, setIsAiEvaluating] = React.useState(false);
  const [conversationHistory, setConversationHistory] = React.useState([]);
  
  // Track each round's question, answer, feedback, model answer & tips
  const [roundReviews, setRoundReviews] = React.useState([]);

  // Camera & Audio State
  const videoRef = React.useRef(null);
  const recognitionRef = React.useRef(null);
  const [isCameraActive, setIsCameraActive] = React.useState(true);
  const [isAiVoiceEnabled, setIsAiVoiceEnabled] = React.useState(true);

  // 30-Minute Countdown Timer State (1800 seconds)
  const [secondsRemaining, setSecondsRemaining] = React.useState(1800);

  // Final Report State
  const [finalReport, setFinalReport] = React.useState(null);

  // Timer Hook
  React.useEffect(() => {
    let timer = null;
    if (interviewStep === 'interviewing' && secondsRemaining > 0) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [interviewStep, secondsRemaining]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Webcam Setup
  React.useEffect(() => {
    let stream = null;
    if (interviewStep === 'interviewing' && isCameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.log("Webcam access optional or denied:", err);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewStep, isCameraActive]);

  // AI Voice Synthesis
  const speakText = (text) => {
    if (!isAiVoiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Web Speech Recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported in this browser. Please type your answer.");
      return;
    }

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRec();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = 0; i < event.results.length; ++i) {
        finalTranscript += event.results[i][0].transcript + ' ';
      }
      setUserAnswer(finalTranscript.trim());
    };

    recognition.onerror = (e) => {
      console.log("Speech recognition error:", e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  // Start Interview Handler
  const handleStartInterview = async () => {
    setIsAiEvaluating(true);
    setRoundReviews([]);
    setConversationHistory([]);
    setQuestionNumber(1);
    setSecondsRemaining(1800);

    try {
      const res = await fetch(`${API_BASE}/api/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewType,
          targetRole,
          experience: experienceLevel,
          userEmail: user ? user.email : 'harsh@example.com'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentQuestion(data.question);
        setCurrentTopic(data.topic || 'System Design & Code');
        setConversationHistory([
          { sender: 'interviewer', text: data.question }
        ]);
        setInterviewStep('interviewing');
        speakText(data.question);
      }
    } catch (e) {
      console.error(e);
      const fallbackQ = "Can you explain how Transformer self-attention works mathematically, and how multi-head projections improve feature representations?";
      setCurrentQuestion(fallbackQ);
      setCurrentTopic("LLM Architecture & Attention");
      setConversationHistory([{ sender: 'interviewer', text: fallbackQ }]);
      setInterviewStep('interviewing');
      speakText(fallbackQ);
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async (isSkipped = false) => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    const givenText = isSkipped ? "[Candidate skipped this question]" : userAnswer.trim();
    if (!givenText && !isSkipped) {
      alert("Please speak or type your answer before submitting.");
      return;
    }

    setIsAiEvaluating(true);
    const updatedHistory = [...conversationHistory, { sender: 'candidate', text: givenText }];
    setConversationHistory(updatedHistory);

    try {
      const res = await fetch(`${API_BASE}/api/interview/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion,
          answer: givenText,
          questionNumber,
          targetRole,
          interviewType,
          isSkipped
        })
      });

      if (res.ok) {
        const data = await res.json();

        const newReview = {
          qNum: questionNumber,
          topic: currentTopic,
          question: currentQuestion,
          candidateAnswer: givenText,
          score: data.score !== undefined ? data.score : (isSkipped ? 0 : 50),
          technicalAccuracy: data.technicalAccuracy !== undefined ? data.technicalAccuracy : (isSkipped ? 0 : 50),
          communication: data.communication !== undefined ? data.communication : (isSkipped ? 0 : 70),
          feedback: data.feedback,
          modelAnswer: data.modelAnswer,
          proTip: data.proTip,
          identifiedWeakness: data.identifiedWeakness
        };

        const updatedReviews = [...roundReviews, newReview];
        setRoundReviews(updatedReviews);
        setUserAnswer('');

        if (data.isFinal || questionNumber >= totalRounds) {
          handleFinishInterview(updatedReviews);
        } else {
          const nextQ = data.contextualFollowUp || "How would you handle database indexing and query tuning under 100k requests/sec?";
          setCurrentQuestion(nextQ);
          setQuestionNumber(prev => prev + 1);
          setConversationHistory([...updatedHistory, { sender: 'interviewer', text: nextQ, feedback: data.feedback }]);
          speakText(nextQ);
        }
      }
    } catch (e) {
      if (questionNumber >= totalRounds) {
        handleFinishInterview();
      } else {
        const fallbackNext = "How would you handle database indexing and query tuning under 100k requests/sec?";
        setCurrentQuestion(fallbackNext);
        setQuestionNumber(prev => prev + 1);
        setConversationHistory([...updatedHistory, { sender: 'interviewer', text: fallbackNext }]);
        speakText(fallbackNext);
      }
    } finally {
      setIsAiEvaluating(false);
    }
  };

  // Finish Round
  const handleFinishInterview = async (customReviews) => {
    setIsAiEvaluating(true);
    const reviewsToSend = customReviews || roundReviews;
    try {
      const res = await fetch(`${API_BASE}/api/interview/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          interviewType,
          userEmail: user ? user.email : 'learner@example.com',
          reviews: reviewsToSend
        })
      });
      if (res.ok) {
        setFinalReport(await res.json());
        setInterviewStep('evaluation');
        try { confetti({ particleCount: 90, spread: 80 }); } catch (e) {}
      } else {
        setInterviewStep('evaluation');
      }
    } catch (e) {
      setInterviewStep('evaluation');
    } finally {
      setIsAiEvaluating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* STEP 1: SETUP SCREEN */}
      {interviewStep === 'setup' && (
        <div className="saas-card" style={{ padding: '36px', borderLeft: '4px solid #4f46e5' }}>
          <span className="badge badge-primary">LIVE INTERACTIVE AI INTERVIEWER</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
            30-Minute AI Mock Technical Interview
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Full simulated interview with live camera feed, real-time voice speech, progressive 6-question curriculum, skip option, and end-of-round Staff Engineer rubric evaluation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Interview Domain:
              </label>
              <select
                value={interviewType}
                onChange={e => setInterviewType(e.target.value)}
                className="saas-input"
                style={{ fontSize: '0.84rem' }}
              >
                <option value="Technical">💻 Technical Coding & Architecture</option>
                <option value="System Design">🏗️ System Design & Distributed Systems</option>
                <option value="DSA">🧠 DSA Problem Solving Round</option>
                <option value="Behavioral">🤝 Behavioral & Leadership</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Target Role:
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="saas-input"
                style={{ fontSize: '0.84rem' }}
              >
                <option value="Generative AI Engineer">🤖 Generative AI Engineer (LLM, RAG, PyTorch)</option>
                <option value="Backend Engineer">☕ Backend Engineer (Java / Spring Boot / SQL)</option>
                <option value="DevOps Engineer">🚢 DevOps & Cloud Infrastructure SRE</option>
                <option value="Full Stack Developer">🌐 Full Stack Developer</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                Seniority Level:
              </label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="saas-input"
                style={{ fontSize: '0.84rem' }}
              >
                <option value="Fresher">Entry Level (0-1 yrs)</option>
                <option value="Intermediate">Intermediate (2-4 yrs)</option>
                <option value="Senior">Senior / Tech Lead (5+ yrs)</option>
              </select>
            </div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '1.8rem' }}>📹</span>
            <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
              <strong style={{ color: '#0f172a' }}>Camera & Audio Analysis Enabled:</strong> PathCraft will request webcam permissions to simulate real video interview conditions with live speech synthesis.
            </div>
          </div>

          <button
            onClick={handleStartInterview}
            disabled={isAiEvaluating}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '0.96rem' }}
          >
            {isAiEvaluating ? 'Opening Live Interview Room...' : `Open Camera & Start 30-Min ${targetRole} Interview →`}
          </button>
        </div>
      )}

      {/* STEP 2: LIVE INTERVIEW ROOM */}
      {interviewStep === 'interviewing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '20px', alignItems: 'start' }}>
          
          {/* LEFT: WEBCAM & TIMER */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div className="saas-card" style={{ padding: '14px', borderRadius: '14px' }}>
              <div style={{ position: 'relative', width: '100%', height: '240px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden' }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(0,0,0,0.65)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', color: '#10b981', fontWeight: 800 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} /> REC ● LIVE
                </div>

                <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.65)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>
                  👤 {user?.fullName || 'Candidate'}
                </div>

                {isRecording && (
                  <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#fff', fontWeight: 800 }}>
                    🎤 Recording...
                  </div>
                )}
              </div>

              {/* CAMERA CONTROLS BAR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setIsCameraActive(!isCameraActive)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    {isCameraActive ? '📷 Cam On' : '📷 Cam Off'}
                  </button>
                  <button
                    onClick={() => setIsAiVoiceEnabled(!isAiVoiceEnabled)}
                    className="btn-secondary"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    {isAiVoiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
                  </button>
                </div>

                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#d97706' }}>
                  ⏱️ {formatTimer(secondsRemaining)}
                </div>
              </div>
            </div>

            {/* AI INTERVIEWER CARD */}
            <div className="saas-card" style={{ padding: '16px', borderLeft: '4px solid #4f46e5', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>
                🤖
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>LearnPath AI Interviewer</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Assessing {targetRole} ({interviewType})</div>
              </div>
            </div>

          </div>

          {/* RIGHT: CONVERSATION & INPUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div className="saas-card" style={{ padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>
                Question {questionNumber} of {totalRounds} · <span style={{ color: '#4f46e5' }}>{targetRole}</span>
              </div>
              <button
                onClick={() => speakText(currentQuestion)}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
              >
                🔊 Replay Question
              </button>
            </div>

            {/* CHAT THREAD */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', minHeight: '260px', maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {conversationHistory.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'candidate' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'candidate' ? '#eef2ff' : '#f8fafc',
                    border: msg.sender === 'candidate' ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    fontSize: '0.85rem',
                    color: msg.sender === 'candidate' ? '#3730a3' : '#0f172a',
                    lineHeight: 1.5
                  }}
                >
                  <div style={{ fontSize: '0.68rem', fontWeight: 800, color: msg.sender === 'candidate' ? '#4f46e5' : '#059669', marginBottom: '2px' }}>
                    {msg.sender === 'candidate' ? '👤 Your Answer' : '🤖 AI Interviewer'}
                  </div>
                  {msg.text}
                </div>
              ))}
              {isAiEvaluating && (
                <div style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic' }}>
                  AI Interviewer is analyzing your response...
                </div>
              )}
            </div>

            {/* ANSWER COMPOSER */}
            <div className="saas-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#475569' }}>
                  Your Response (Speak into Mic or Type):
                </span>
                <button
                  onClick={toggleSpeechRecognition}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid',
                    background: isRecording ? '#ef4444' : '#ffffff',
                    borderColor: isRecording ? '#ef4444' : '#e2e8f0',
                    color: isRecording ? '#ffffff' : '#0f172a',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isRecording ? '⏹ Stop Mic' : '🎤 Speak Answer'}
                </button>
              </div>

              <textarea
                rows={4}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type your detailed answer or use microphone to speak..."
                className="saas-input"
                style={{ resize: 'vertical' }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                <button
                  onClick={() => handleSubmitAnswer(true)}
                  disabled={isAiEvaluating}
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px 14px' }}
                >
                  ⏭ Skip Question
                </button>

                <button
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={isAiEvaluating}
                  className="btn-primary"
                  style={{ fontSize: '0.84rem', padding: '8px 18px' }}
                >
                  {isAiEvaluating ? 'Analyzing...' : 'Submit Answer & Next →'}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* STEP 3: IN-DEPTH EVALUATION REPORT */}
      {interviewStep === 'evaluation' && (() => {
        const totalRoundsCount = roundReviews.length;
        const skippedCount = roundReviews.filter(r => (Number(r.score) === 0) || (r.candidateAnswer && r.candidateAnswer.includes('skipped'))).length;
        const isAllSkipped = totalRoundsCount > 0 && skippedCount === totalRoundsCount;

        const actualAvgScore = totalRoundsCount > 0 
          ? Math.round(roundReviews.reduce((sum, r) => sum + (Number(r.score) || 0), 0) / totalRoundsCount) 
          : 0;

        const actualTechScore = totalRoundsCount > 0 
          ? Math.round(roundReviews.reduce((sum, r) => sum + (Number(r.technicalAccuracy !== undefined ? r.technicalAccuracy : r.score) || 0), 0) / totalRoundsCount) 
          : 0;

        const scoreOverall = isAllSkipped ? 0 : actualAvgScore;
        const scoreTech = isAllSkipped ? 0 : actualTechScore;
        const scoreDepth = isAllSkipped ? 0 : Math.max(0, Math.round(scoreOverall * 0.95));
        const scoreComm = isAllSkipped ? 0 : (totalRoundsCount > 0 
          ? Math.round(roundReviews.reduce((sum, r) => sum + (r.candidateAnswer && !r.candidateAnswer.includes('skipped') ? (Number(r.communication) || 75) : 0), 0) / totalRoundsCount) 
          : 0);

        const hiringRec = isAllSkipped
          ? 'NO HIRE (All Questions Skipped)'
          : (scoreOverall >= 80 ? 'STRONG HIRE (Senior / Staff Level)' :
             scoreOverall >= 65 ? 'HIRE (Mid-Level Developer)' :
             scoreOverall >= 40 ? 'NEEDS IMPROVEMENT (Junior Developer)' :
             'NO HIRE (Insufficient Technical Depth)');

        const aiSummaryText = isAllSkipped
          ? `You skipped all questions in this ${targetRole} mock round. In actual technical interviews, sharing even partial intuition or brute-force ideas is strongly favored over complete passes. Attempt answering each question next time to receive comprehensive technical and system depth grading.`
          : (finalReport?.aiSummary || `Completed ${targetRole} mock session with an overall rating of ${scoreOverall}%. ${hiringRec}`);

        const scoreColor = scoreOverall >= 75 ? '#059669' : scoreOverall >= 40 ? '#d97706' : '#dc2626';
        const scoreBg = scoreOverall >= 75 ? '#ecfdf5' : scoreOverall >= 40 ? '#fffbeb' : '#fef2f2';
        const scoreBorder = scoreOverall >= 75 ? '#a7f3d0' : scoreOverall >= 40 ? '#fde68a' : '#fecaca';

        return (
          <div className="saas-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={scoreOverall >= 75 ? 'badge badge-success' : 'badge badge-warning'}>
                    {scoreOverall === 0 ? 'INTERVIEW COMPLETED (ALL SKIPPED)' : 'INTERVIEW COMPLETED'}
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '2px 10px', borderRadius: '12px', background: scoreBg, color: scoreColor, border: `1px solid ${scoreBorder}` }}>
                    {hiringRec}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                  Staff Engineer Performance Scorecard
                </h2>
                <p style={{ fontSize: '0.84rem', color: '#64748b', marginTop: '2px' }}>
                  Detailed rubric analysis for {targetRole} ({interviewType} Round).
                </p>
              </div>

              <button
                onClick={() => setInterviewStep('setup')}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '8px 16px' }}
              >
                Start New Mock Round 🔄
              </button>
            </div>

            {/* SCORES SUMMARY ROW */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Overall Score</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreColor, marginTop: '4px' }}>
                  {scoreOverall}%
                </div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Technical Accuracy</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreTech >= 70 ? '#059669' : scoreTech > 0 ? '#d97706' : '#dc2626', marginTop: '4px' }}>
                  {scoreTech}%
                </div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>System Depth</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreDepth >= 70 ? '#2563eb' : scoreDepth > 0 ? '#4f46e5' : '#64748b', marginTop: '4px' }}>
                  {scoreDepth}%
                </div>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Communication Clarity</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, color: scoreComm >= 70 ? '#7c3aed' : scoreComm > 0 ? '#8b5cf6' : '#94a3b8', marginTop: '4px' }}>
                  {scoreComm}%
                </div>
              </div>
            </div>

            {/* AI FEEDBACK SUMMARY BANNER */}
            <div style={{ background: scoreBg, border: `1px solid ${scoreBorder}`, padding: '14px 18px', borderRadius: '10px', fontSize: '0.84rem', color: scoreColor, lineHeight: 1.5 }}>
              <strong>🤖 AI Evaluator Verdict:</strong> {aiSummaryText}
            </div>

            {/* ROUND-BY-ROUND BREAKDOWN */}
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                Question-by-Question Review & Feedback ({roundReviews.length} Rounds Evaluated)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {roundReviews.map((rev, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4f46e5' }}>
                        Question {rev.qNum} · {rev.topic}
                      </span>
                      <span className={rev.score >= 75 ? 'badge badge-success' : rev.score > 0 ? 'badge badge-warning' : 'badge'}>
                        Score: {rev.score}%
                      </span>
                    </div>

                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                      {rev.question}
                    </div>

                    <div style={{ marginTop: '10px', padding: '10px 12px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.8rem', color: '#334155' }}>
                      <strong>Your Answer:</strong> {rev.candidateAnswer}
                    </div>

                    <div style={{ marginTop: '10px', padding: '10px 12px', background: rev.score === 0 ? '#fffbeb' : '#eff6ff', border: rev.score === 0 ? '1px solid #fde68a' : '1px solid #bfdbfe', borderRadius: '8px', fontSize: '0.78rem', color: rev.score === 0 ? '#92400e' : '#1e40af' }}>
                      💡 <strong>Interviewer Feedback:</strong> {rev.feedback}
                    </div>

                    {rev.modelAnswer && (
                      <div style={{ marginTop: '8px', padding: '10px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '0.76rem', color: '#166534' }}>
                        🎯 <strong>Ideal Model Answer:</strong> {rev.modelAnswer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        );
      })()}

    </div>
  );
}

window.MockInterviewView = MockInterviewView;
