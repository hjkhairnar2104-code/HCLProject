// LearnPath AI - Unified Practice & Engineering Hub (Clean Light SaaS)
function PracticeView({ user, dsaSolvedIds, onSolveDsa, careerRole = 'Generative AI Engineer', setActiveTab, resumeForm = {}, setResumeForm }) {
  const [practiceSubTab, setPracticeSubTab] = React.useState('dsa'); // 'dsa' | 'assessments' | 'courses' | 'projects'
  const [courseTopicFilter, setCourseTopicFilter] = React.useState('All');
  const [copiedProjectId, setCopiedProjectId] = React.useState(null);
  const [activeVideo, setActiveVideo] = React.useState(null);

  const DsaSheetComp = window.DsaSheetView;
  const QuizViewComp = window.QuizView;

  const COURSES = [
    {
      id: 'c-campusx-pytorch',
      topic: 'PyTorch',
      title: 'PyTorch Deep Learning & Neural Networks Complete Series',
      channel: 'CampusX',
      videosCount: '34 Videos',
      duration: '18 Hours',
      level: 'Intermediate',
      youtubeId: 'V_xro1bcAuA',
      link: 'https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn',
      desc: 'Complete PyTorch framework from tensors and autograd to CNNs, RNNs, and custom training loops by CampusX.'
    },
    {
      id: 'c-striver-dsa',
      topic: 'DSA',
      title: "Striver's A2Z DSA Complete Playlist (450+ Problems)",
      channel: 'take U forward (Striver)',
      videosCount: '180 Videos',
      duration: '65 Hours',
      level: 'All Levels',
      youtubeId: '0bHoB35fom4',
      link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
      desc: 'The gold standard for software engineering interviews: Arrays, Graphs, Dynamic Programming, Segment Trees, and Tries.'
    },
    {
      id: 'c-amigoscode-spring',
      topic: 'SpringBoot',
      title: 'Spring Boot 3 & Microservices Architecture Deep Dive',
      channel: 'Amigoscode (Nelson)',
      videosCount: '42 Videos',
      duration: '22 Hours',
      level: 'Intermediate',
      youtubeId: '9SGDpan58Hg',
      link: 'https://www.youtube.com/c/amigoscode',
      desc: 'Production-ready Spring Boot 3 with Spring Security, JWT, PostgreSQL JPA, Kafka, and Docker.'
    },
    {
      id: 'c-nana-devops',
      topic: 'DevOps',
      title: 'Docker & Kubernetes Full Course for Beginners to Pro',
      channel: 'TechWorld with Nana',
      videosCount: '28 Videos',
      duration: '15 Hours',
      level: 'Beginner to Advanced',
      youtubeId: '3c-iBn73dDE',
      link: 'https://www.youtube.com/c/TechWorldwithNana',
      desc: 'Containerize applications, build multi-stage Dockerfiles, manage Pods, Services, and deploy to AWS EKS.'
    },
    {
      id: 'c-bytebytego-sys',
      topic: 'SystemDesign',
      title: 'System Design Interview & High-Scale Architecture',
      channel: 'ByteByteGo / Alex Xu',
      videosCount: '45 Videos',
      duration: '20 Hours',
      level: 'Advanced',
      youtubeId: 'i53Gi_K3o7I',
      link: 'https://bytebytego.com/',
      desc: 'Consistent hashing, rate limiters, distributed caches (Redis), message queues (Kafka), and CAP tradeoffs.'
    },
    {
      id: 'c-chai-react',
      topic: 'WebDev',
      title: 'React 18 & Full-Stack Modern JavaScript Masterclass',
      channel: 'Chai aur Code (Hitesh Choudhary)',
      videosCount: '55 Videos',
      duration: '25 Hours',
      level: 'All Levels',
      youtubeId: 'vz1RlUy573o',
      link: 'https://www.youtube.com/c/ChaiAurCode',
      desc: 'Complete React 18, Custom Hooks, Redux Toolkit, Context API, Tailwind, and Full Stack APIs.'
    },
    {
      id: 'c-telusko-java',
      topic: 'SpringBoot',
      title: 'Core Java & Advanced Multithreading Concurrency',
      channel: 'Telusko (Navin Reddy)',
      videosCount: '60 Videos',
      duration: '28 Hours',
      level: 'Foundational',
      youtubeId: 'BGTx91t8q50',
      link: 'https://www.youtube.com/c/Telusko',
      desc: 'JVM internals, garbage collection tuning, concurrent locks, thread pools, and Spring Boot.'
    }
  ];

  const PORTFOLIO_PROJECTS = [
    {
      id: 'p-rag-system',
      title: 'RAG Document Q&A Knowledge Engine',
      tech: 'Python, LangChain, Pinecone, OpenAI, FastAPI, React',
      github: 'https://github.com/harshsharma/rag-document-qa',
      demo: 'https://rag-demo.learnpath.ai',
      whatIsThis: 'An enterprise RAG system with hierarchical semantic chunking, cross-encoder reranking, and sub-100ms vector search latency.',
      bullets: [
        "Architected end-to-end RAG system with hierarchical semantic chunking and cross-encoder reranking.",
        "Evaluated retrieval faithfulness with Ragas metrics scoring 94% precision on benchmark datasets.",
        "Deployed containerized FastAPI service with sub-100ms vector search latency."
      ]
    },
    {
      id: 'p-learnpath',
      title: 'LearnPath AI — Living Learning & Adaptive Career Engine',
      tech: 'Java 21, Spring Boot 3, React 18, PostgreSQL, Docker, Gemini AI',
      github: 'https://github.com/harshsharma/learnpath-ai',
      demo: 'https://learnpath.ai',
      whatIsThis: 'An intelligent AI SaaS that builds personalized prerequisite roadmaps, detects skill gaps, conducts 30-min live video mock interviews, and dynamically adapts based on learner performance.',
      bullets: [
        "Architected an adaptive DAG prerequisite dependency engine with Spring Boot 3 & PostgreSQL.",
        "Built a real-time conversational AI interviewer with live webcam streaming and voice synthesis.",
        "Engineered ATS Resume Builder with instant keyword analysis against top job descriptions."
      ]
    },
    {
      id: 'p-distributed-queue',
      title: 'Distributed Event Queue & High-Throughput Stream Broker',
      tech: 'Java 21, Netty, Apache Kafka, Redis, Docker, Prometheus',
      github: 'https://github.com/harshsharma/distributed-task-queue',
      demo: 'https://task-broker-demo.com',
      whatIsThis: 'A low-latency distributed message broker supporting topic partitioning, consumer group rebalancing, and dead-letter queue resilience handling 50k+ writes/sec.',
      bullets: [
        "Implemented consistent hashing ring for partition assignments with O(1) key routing.",
        "Designed append-only commit log with memory-mapped files cutting read latency by 45%.",
        "Configured Prometheus & Grafana telemetry dashboards tracking p99 consumer lag."
      ]
    }
  ];

  const handleAddProjectToResume = (proj) => {
    setCopiedProjectId(proj.id);
    try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}

    if (setResumeForm) {
      const currentList = resumeForm.projectsList && resumeForm.projectsList.length > 0 ? resumeForm.projectsList : [];
      const newProjItem = {
        id: 'proj-' + Date.now(),
        title: proj.title,
        tech: proj.tech,
        github: proj.github,
        demo: proj.demo,
        bullets: proj.bullets.map(b => b.startsWith('•') ? b : `• ${b}`).join('\n')
      };
      setResumeForm({
        ...resumeForm,
        projectsList: [...currentList, newProjItem]
      });
    }

    setTimeout(() => {
      if (setActiveTab) setActiveTab('resume');
    }, 600);
  };

  const filteredCourses = courseTopicFilter === 'All' ? COURSES : COURSES.filter(c => c.topic.toLowerCase() === courseTopicFilter.toLowerCase());

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* PRACTICE SUB-NAVBAR HEADER */}
      <div className="saas-card" style={{ padding: '24px 28px', borderLeft: '4px solid #4f46e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-primary">PRACTICE & VERIFICATION HUB</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>
              Hands-On Engineering Practice
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
              Master 450+ curated problem sheet, take 5-level verified assessments, and build portfolio projects.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'dsa', label: '🧠 450+ DSA Sheet' },
              { id: 'assessments', label: '📊 5-Level Assessments' },
              { id: 'projects', label: '🧪 Portfolio Projects' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPracticeSubTab(tab.id)}
                className={practiceSubTab === tab.id ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.82rem', padding: '8px 14px' }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. 450+ PROBLEM SHEET */}
      {practiceSubTab === 'dsa' && DsaSheetComp && (
        <DsaSheetComp
          solvedProblemIds={dsaSolvedIds}
          handleSolveProblem={onSolveDsa}
          user={user}
        />
      )}

      {/* 2. 5-LEVEL SKILL ASSESSMENTS */}
      {practiceSubTab === 'assessments' && QuizViewComp && (
        <QuizViewComp
          user={user}
          setActiveTab={setActiveTab}
        />
      )}

      {/* 3. PORTFOLIO PROJECTS WITH 1-CLICK ADD TO RESUME */}
      {practiceSubTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '18px' }}>
            {PORTFOLIO_PROJECTS.map(proj => (
              <div key={proj.id} className="saas-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-success">PORTFOLIO READY</span>
                    <a href={proj.github} target="_blank" rel="noreferrer" style={{ fontSize: '0.76rem', color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>
                      GitHub ↗
                    </a>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {proj.title}
                  </h3>

                  <div style={{ fontSize: '0.76rem', color: '#4f46e5', fontWeight: 600, marginTop: '4px' }}>
                    {proj.tech}
                  </div>

                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '8px', lineHeight: 1.45 }}>
                    {proj.whatIsThis}
                  </p>

                  <div style={{ marginTop: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px 12px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                      Key Engineering Bullets:
                    </div>
                    {proj.bullets.map((b, bIdx) => (
                      <div key={bIdx} style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.4, marginTop: '2px' }}>
                        • {b}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => handleAddProjectToResume(proj)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.82rem', padding: '8px' }}
                  >
                    {copiedProjectId === proj.id ? '✓ Appended to Resume!' : '🚀 1-Click Add to Resume →'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

window.PracticeView = PracticeView;
