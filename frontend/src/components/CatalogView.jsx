// LearnPath AI — Dynamic Topic & Course Explorer with Video Lessons & Topic Quizzes (Clean Light SaaS)
function CatalogView({ user, setActiveTab, targetRole }) {
  const API_BASE = 'http://localhost:8085';

  const [activeStack, setActiveStack] = React.useState(() => {
    if (targetRole) {
      if (targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine')) return 'pytorch';
      if (targetRole.toLowerCase().includes('backend') || targetRole.toLowerCase().includes('java')) return 'spring';
      if (targetRole.toLowerCase().includes('devops') || targetRole.toLowerCase().includes('cloud')) return 'devops';
      if (targetRole.toLowerCase().includes('full stack') || targetRole.toLowerCase().includes('fullstack')) return 'frontend';
    }
    return 'pytorch';
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTopicModal, setSelectedTopicModal] = React.useState(null);
  const [modalYoutubeVideos, setModalYoutubeVideos] = React.useState([]);
  const [modalSelectedVideoId, setModalSelectedVideoId] = React.useState(null);
  const [isModalYouTubeLoading, setIsModalYouTubeLoading] = React.useState(false);
  const [completedTopicIds, setCompletedTopicIds] = React.useState(() => {
    try {
      const saved = localStorage.getItem('pathcraft_completed_topics');
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {}
    return new Set(['py_tensors', 'java_core_oop', 'dsa_basics']);
  });

  const handleToggleComplete = (topicId) => {
    const next = new Set(completedTopicIds);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
      try { confetti({ particleCount: 50, spread: 60 }); } catch (e) {}
    }
    setCompletedTopicIds(next);
    try { localStorage.setItem('pathcraft_completed_topics', JSON.stringify(Array.from(next))); } catch (e) {}
  };

  const handleOpenTopicModal = async (topic) => {
    setSelectedTopicModal(topic);
    setModalSelectedVideoId(topic.youtubeId);
    setModalYoutubeVideos([]);
    setIsModalYouTubeLoading(true);

    try {
      const q = `${topic.title} tutorial`;
      const res = await fetch(`${API_BASE}/api/curriculum/youtube?query=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setModalYoutubeVideos(data.videos);
          setModalSelectedVideoId(data.videos[0].videoId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsModalYouTubeLoading(false);
    }
  };

  // TECH STACKS
  const TECH_STACKS = [
    { id: 'pytorch', label: '🧠 Generative AI & PyTorch', domainKey: 'aiml', icon: '🧠' },
    { id: 'spring', label: '☕ Java & Spring Boot', domainKey: 'java', icon: '☕' },
    { id: 'devops', label: '🚢 DevOps & Kubernetes', domainKey: 'devops', icon: '🚢' },
    { id: 'dsa', label: '⚔️ 450+ DSA & Algorithms', domainKey: 'dsa', icon: '⚔️' },
    { id: 'system_design', label: '🏗️ System Design (HLD/LLD)', domainKey: 'sysdesign', icon: '🏗️' },
    { id: 'sql', label: '🗄️ SQL 50 & Database Indexing', domainKey: 'db', icon: '🗄️' },
    { id: 'frontend', label: '🌐 React 18 & Full Stack', domainKey: 'web', icon: '🌐' }
  ];

  // RICH TOPIC MODULES WITH EMBEDDED VIDEOS & QUIZZES
  const TOPIC_MODULES = {
    pytorch: [
      {
        id: 'py_tensors',
        title: 'PyTorch Tensors, Autograd & GPU Acceleration',
        channel: 'CampusX (Nitish Singh)',
        youtubeId: 'V_xro1bcAuA',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLKnIA16_RmvYuZauWaPlRTC54KxSNLtNn',
        duration: '3.5 Hours · 8 Lessons',
        level: 'Beginner to Intermediate',
        domainKey: 'aiml',
        quizTopic: 'AI / Machine Learning & PyTorch',
        summary: 'Understand tensor manipulation, matrix multiplication, automatic differentiation (`torch.autograd`), and running models on CUDA GPUs.',
        subtopics: ['Tensor Creation & Slicing', 'Autograd Computation Graph', 'torch.nn.Module & Custom Layers', 'Loss Functions & Optimizers (AdamW)'],
        dsaProblems: ['Implement 2D Matrix Rotation', 'Vector Dot Product', 'Compute Softmax with Numerical Stability']
      },
      {
        id: 'py_rag',
        title: 'RAG Architecture, Vector DBs (Pinecone) & Semantic Search',
        channel: 'freeCodeCamp / LangChain Masterclass',
        youtubeId: 'tcqEUSNCn8I',
        playlistUrl: 'https://www.youtube.com/watch?v=tcqEUSNCn8I',
        duration: '5.0 Hours · 12 Lessons',
        level: 'Intermediate to Advanced',
        domainKey: 'aiml',
        quizTopic: 'AI / Machine Learning & PyTorch',
        summary: 'Build production-ready Retrieval-Augmented Generation systems using semantic chunking, dense embeddings, hybrid vector search, and Cross-Encoder rerankers.',
        subtopics: ['Hierarchical Chunking Strategies', 'Dense-Lexical Hybrid Search', 'Pinecone & ChromaDB Indexing', 'Cross-Encoder Reranking & Ragas Evaluation'],
        dsaProblems: ['Cosine Similarity Calculation', 'Top-K Nearest Neighbors', 'Inverted Index Search']
      },
      {
        id: 'py_transformers',
        title: 'Transformers, Self-Attention & LLM Fine-Tuning (LoRA)',
        channel: 'Andrej Karpathy (ex-Tesla AI/OpenAI)',
        youtubeId: 'kCc8FmEb1nY',
        playlistUrl: 'https://www.youtube.com/watch?v=kCc8FmEb1nY',
        duration: '4.5 Hours · 10 Lessons',
        level: 'Advanced',
        domainKey: 'aiml',
        quizTopic: 'AI / Machine Learning & PyTorch',
        summary: 'Build a GPT model from scratch in PyTorch. Learn multi-head self-attention, positional encodings, QLoRA parameter-efficient fine-tuning, and vLLM inference.',
        subtopics: ['Scaled Dot-Product Attention', 'Multi-Head Attention Layers', 'PEFT & QLoRA Fine-Tuning', 'vLLM & Fast Model Serving'],
        dsaProblems: ['Matrix Multiplication $O(N^3)$ to $O(N^{2.8})$', 'Trie for Token Prefix Matching', 'Softmax Temperature Scaling']
      },
      {
        id: 'py_agents',
        title: 'Autonomous AI Agents & Tool-Calling Workflows',
        channel: 'LangChain Official / Harrison Chase',
        youtubeId: 'sal78ACtGTc',
        playlistUrl: 'https://www.youtube.com/watch?v=sal78ACtGTc',
        duration: '3.0 Hours · 6 Lessons',
        level: 'Intermediate',
        domainKey: 'aiml',
        quizTopic: 'AI / Machine Learning & PyTorch',
        summary: 'Design multi-agent autonomous frameworks with LangGraph, function calling, stateful memory persistence, and Human-in-the-Loop decision guardrails.',
        subtopics: ['ReAct Prompting Pattern', 'Function Calling & Schema Validation', 'State Graphs in LangGraph', 'Evaluation & Guardrails'],
        dsaProblems: ['Directed Acyclic Graph Topological Sort', 'State Machine Cycle Detection', 'LRU Memory Buffer']
      }
    ],
    spring: [
      {
        id: 'spring_core',
        title: 'Spring Boot 3, REST APIs & Dependency Injection',
        channel: 'Amigoscode (Nelson Djalo)',
        youtubeId: '9SGDpan58Hg',
        playlistUrl: 'https://www.youtube.com/playlist?list=PLwvrYc43l1Mxv_23kI58cT9x3l9H7j3p9',
        duration: '6.0 Hours · 15 Lessons',
        level: 'Beginner to Intermediate',
        domainKey: 'java',
        quizTopic: 'Core Java & Spring Boot',
        summary: 'Master modern Spring Boot 3 with Java 21, Inversion of Control (IoC), Beans, DTOs, Bean Validation, Global Exception Handling, and actuator metrics.',
        subtopics: ['IoC & Bean Lifecycle', 'Spring MVC & REST Controllers', 'Global Exception Handling (@ControllerAdvice)', 'Spring Boot 3 Actuator & Logging'],
        dsaProblems: ['LRU Cache Implementation', 'Design In-Memory Key-Value Store', 'Valid Parentheses Parser']
      },
      {
        id: 'spring_jpa',
        title: 'Spring Data JPA, Hibernate & PostgreSQL Optimization',
        channel: 'Telusko (Navin Reddy)',
        youtubeId: 'BGTx91t8q50',
        playlistUrl: 'https://www.youtube.com/c/Telusko',
        duration: '5.5 Hours · 14 Lessons',
        level: 'Intermediate',
        domainKey: 'java',
        quizTopic: 'Core Java & Spring Boot',
        summary: 'Learn entity relationship mappings (@OneToMany, @ManyToMany), avoiding N+1 query bottlenecks with JOIN FETCH, indexing, and optimistic locking.',
        subtopics: ['Entity Lifecycle & Persistence Context', 'N+1 Problem & Entity Graphs', 'Composite Primary Keys & Pagination', 'Optimistic Locking (@Version)'],
        dsaProblems: ['Design SQL Index Lookup', 'Two Sum in Sorted Stream', 'Merge K Sorted Database Rows']
      },
      {
        id: 'spring_kafka',
        title: 'Apache Kafka Event Streaming & Microservices Communication',
        channel: 'Confluent Developer / Amigoscode',
        youtubeId: 'j4mlbT1j01c',
        playlistUrl: 'https://www.youtube.com/c/Confluent',
        duration: '4.0 Hours · 9 Lessons',
        level: 'Advanced',
        domainKey: 'java',
        quizTopic: 'Core Java & Spring Boot',
        summary: 'Architect resilient event-driven architectures with Apache Kafka, consumer groups, partition rebalancing, idempotent producers, and dead-letter queues.',
        subtopics: ['Kafka Topics & Partitions', 'Consumer Lag & Offset Management', 'Idempotent Producers & Transactions', 'Transactional Outbox Pattern'],
        dsaProblems: ['Circular Queue for Event Buffering', 'Sliding Window Rate Limiter', 'Top K Heavy Hitters in Stream']
      },
      {
        id: 'spring_security',
        title: 'Spring Security 6, JWT Authentication & OAuth2',
        channel: 'Bouali Ali / Amigoscode',
        youtubeId: 'KxqlJblhzfI',
        playlistUrl: 'https://www.youtube.com/watch?v=KxqlJblhzfI',
        duration: '3.5 Hours · 7 Lessons',
        level: 'Intermediate to Advanced',
        domainKey: 'java',
        quizTopic: 'Core Java & Spring Boot',
        summary: 'Implement stateless JWT authentication, SecurityFilterChain, Role-Based Access Control (RBAC), and OAuth2 Single Sign-On in Spring Boot 3.',
        subtopics: ['SecurityFilterChain Configuration', 'JWT Token Creation & Validation', 'Custom Authentication Providers', 'CSRF, CORS & Security Headers'],
        dsaProblems: ['Encode & Decode Strings', 'Token Bucket Rate Limiter', 'RSA Signature Verification']
      }
    ],
    devops: [
      {
        id: 'devops_docker',
        title: 'Docker & Multi-Stage Production Containerization',
        channel: 'TechWorld with Nana',
        youtubeId: '3c-iBn73dDE',
        playlistUrl: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
        duration: '4.5 Hours · 10 Lessons',
        level: 'Beginner to Intermediate',
        domainKey: 'devops',
        quizTopic: 'DevOps & Cloud Infrastructure',
        summary: 'Containerize backend and frontend applications using slim base images, multi-stage builds, non-root users, Docker volumes, and Compose networks.',
        subtopics: ['Docker Engine & Architecture', 'Multi-Stage Build Optimization', 'Docker Volumes & Storage', 'Docker Compose Multi-Container Orchestration'],
        dsaProblems: ['Container Port Mapping Hash Table', 'Graph Dependency Resolver', 'Layer Cache Invalidation Simulation']
      },
      {
        id: 'devops_k8s',
        title: 'Kubernetes (K8s) Cluster Architecture, Pods & Services',
        channel: 'TechWorld with Nana / Hussein Nasser',
        youtubeId: 'X48VuDVv0do',
        playlistUrl: 'https://www.youtube.com/watch?v=X48VuDVv0do',
        duration: '6.5 Hours · 16 Lessons',
        level: 'Intermediate to Advanced',
        domainKey: 'devops',
        quizTopic: 'DevOps & Cloud Infrastructure',
        summary: 'Deploy applications onto Kubernetes clusters with Pods, Deployments, ClusterIP/NodePort Services, Ingress Controllers, ConfigMaps, and Helm Charts.',
        subtopics: ['Control Plane (API Server, etcd, Kubelet)', 'Pods, ReplicaSets & Deployments', 'Services & Ingress Controllers', 'Horizontal Pod Autoscaler (HPA)'],
        dsaProblems: ['Load Balancer Round Robin Algorithm', 'Consistent Hashing Ring', 'Kubernetes Resource Scheduler']
      },
      {
        id: 'devops_cicd',
        title: 'CI/CD Automation with GitHub Actions & ArgoCD GitOps',
        channel: 'DevOps Toolkit / Viktor Farcic',
        youtubeId: 'R8_veQiYBjI',
        playlistUrl: 'https://www.youtube.com/watch?v=R8_veQiYBjI',
        duration: '3.5 Hours · 8 Lessons',
        level: 'Intermediate',
        domainKey: 'devops',
        quizTopic: 'DevOps & Cloud Infrastructure',
        summary: 'Build automated CI/CD pipelines that lint, test, build container images, scan with Trivy, and deploy to Kubernetes clusters via GitOps using ArgoCD.',
        subtopics: ['GitHub Actions Workflow Triggers', 'Automated Test & Docker Push', 'ArgoCD Declarative GitOps', 'Canary & Blue-Green Deployments'],
        dsaProblems: ['Topological Build Order Graph', 'Parallel Task Scheduler', 'Git Branch Conflict Detection']
      }
    ],
    dsa: [
      {
        id: 'dsa_basics',
        title: 'Arrays, Strings, Sliding Window & Two Pointers',
        channel: 'take U forward (Striver)',
        youtubeId: '0bHoB35fom4',
        playlistUrl: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',
        duration: '12 Hours · 35 Problems',
        level: 'All Levels',
        domainKey: 'dsa',
        quizTopic: 'Data Structures & Algorithms',
        summary: 'Master fundamental array manipulation, Prefix Sums, Kadane Algorithm, Two Pointers, and Variable-Size Sliding Window templates.',
        subtopics: ['Kadane’s Max Subarray Sum', 'Two Pointers (Dutch National Flag)', 'Sliding Window (Longest Substring)', 'Binary Search on Answer Space'],
        dsaProblems: ['Two Sum', 'Best Time to Buy and Sell Stock', '3Sum', 'Trapping Rain Water']
      },
      {
        id: 'dsa_trees_graphs',
        title: 'Binary Trees, BST, Graphs (BFS/DFS) & Topological Sort',
        channel: 'take U forward (Striver)',
        youtubeId: 'b7NYq23-AEM',
        playlistUrl: 'https://takeuforward.org/graph/striver-graph-series-top-graph-interview-problems/',
        duration: '18 Hours · 50 Problems',
        level: 'Intermediate to Hard',
        domainKey: 'dsa',
        quizTopic: 'Data Structures & Algorithms',
        summary: 'Master tree traversals (Inorder, Preorder, Postorder, Morris), Lowest Common Ancestor, Graph BFS/DFS, Dijkstra’s Algorithm, and Disjoint Set Union (DSU).',
        subtopics: ['Binary Tree Level Order Traversal', 'Lowest Common Ancestor (LCA)', 'Dijkstra’s Shortest Path', 'Kahn’s Topological Sort & Cycle Detection'],
        dsaProblems: ['Invert Binary Tree', 'Course Schedule II', 'Word Ladder', 'Number of Islands']
      },
      {
        id: 'dsa_dp',
        title: 'Dynamic Programming (1D, 2D, DP on Grids, Stocks & Trees)',
        channel: 'take U forward (Striver)',
        youtubeId: 'tyB0ztf0DNY',
        playlistUrl: 'https://takeuforward.org/dynamic-programming/striver-dp-series-dynamic-programming-problems/',
        duration: '22 Hours · 60 Problems',
        level: 'Hard',
        domainKey: 'dsa',
        quizTopic: 'Data Structures & Algorithms',
        summary: 'Learn DP from recursion to memoization to tabulation with space optimization: 0/1 Knapsack, Longest Common Subsequence (LCS), Partition DP, and DP on Trees.',
        subtopics: ['1D DP (Climbing Stairs, House Robber)', '2D Grid DP (Unique Paths, Min Path Sum)', 'LCS & Edit Distance Patterns', 'Matrix Chain Multiplication (MCM)'],
        dsaProblems: ['Coin Change', 'Longest Increasing Subsequence', 'Edit Distance', 'Partition Equal Subset Sum']
      }
    ],
    system_design: [
      {
        id: 'sys_caching',
        title: 'Distributed Caching, Redis Internals & Cache Invalidation',
        channel: 'ByteByteGo (Alex Xu)',
        youtubeId: 'i53Gi_K3o7I',
        playlistUrl: 'https://bytebytego.com/',
        duration: '4.0 Hours · 8 Lessons',
        level: 'Intermediate to Advanced',
        domainKey: 'sysdesign',
        quizTopic: 'System Design & Distributed Systems',
        summary: 'Master Cache-Aside, Write-Through, Write-Behind strategies, Redis data structures (Strings, Hashes, Sorted Sets, Bitmaps), and solving Thundering Herd.',
        subtopics: ['Cache Eviction Policies (LRU, LFU)', 'Cache Penetration & Stampede Protection', 'Redis Cluster Sharding & Sentinel', 'Consistent Hashing Algorithm'],
        dsaProblems: ['Design LRU Cache with $O(1)$ ops', 'Design LFU Cache', 'Consistent Hash Ring Node Mapping']
      },
      {
        id: 'sys_rate_limiter',
        title: 'API Gateway, Rate Limiting Algorithms & Distributed Locks',
        channel: 'ByteByteGo / Hussein Nasser',
        youtubeId: 'm8U2ZlA0ksc',
        playlistUrl: 'https://bytebytego.com/',
        duration: '3.5 Hours · 7 Lessons',
        level: 'Intermediate to Advanced',
        domainKey: 'sysdesign',
        quizTopic: 'System Design & Distributed Systems',
        summary: 'Design high-throughput rate limiters using Token Bucket, Leaky Bucket, and Sliding Window Counter in Redis with Lua scripts for atomicity.',
        subtopics: ['Token Bucket vs Leaky Bucket', 'Sliding Window Counter in Redis', 'Distributed Locks with Redlock Algorithm', 'API Gateway Reverse Proxies'],
        dsaProblems: ['Token Bucket Rate Limiter', 'Design Hit Counter', 'Sliding Window Log Algorithm']
      }
    ],
    sql: [
      {
        id: 'sql_window',
        title: 'SQL Window Functions, CTEs & Complex Query Optimization',
        channel: 'Alex The Analyst / Luke Barousse',
        youtubeId: 'Ww71knvhQ-s',
        playlistUrl: 'https://www.youtube.com/watch?v=Ww71knvhQ-s',
        duration: '4.0 Hours · 10 Lessons',
        level: 'Beginner to Advanced',
        domainKey: 'db',
        quizTopic: 'Databases & SQL Engineering',
        summary: 'Master RANK(), DENSE_RANK(), ROW_NUMBER(), LEAD(), LAG(), running totals, recursive Common Table Expressions (CTEs), and query execution plans.',
        subtopics: ['ROW_NUMBER() vs DENSE_RANK()', 'LEAD() and LAG() for Time Series', 'Recursive CTEs for Hierarchical Data', 'EXPLAIN ANALYZE & Index Scans'],
        dsaProblems: ['Nth Highest Salary', 'Consecutive Numbers', 'Department Top 3 Salaries']
      }
    ],
    frontend: [
      {
        id: 'fe_react18',
        title: 'React 18, TypeScript, Custom Hooks & State Architecture',
        channel: 'Chai aur Code (Hitesh Choudhary)',
        youtubeId: 'vz1RlUy573o',
        playlistUrl: 'https://www.youtube.com/c/ChaiAurCode',
        duration: '8.0 Hours · 20 Lessons',
        level: 'Beginner to Intermediate',
        domainKey: 'web',
        quizTopic: 'Full Stack Web & React',
        summary: 'Deep dive into React 18, Concurrent Mode, TypeScript strict types, Custom Hooks, Context API, Redux Toolkit, and building responsive SaaS UIs.',
        subtopics: ['React Component Lifecycle & Hooks', 'Custom Hook Architecture', 'Redux Toolkit vs Zustand', 'Server-Sent Events & Realtime WebSockets'],
        dsaProblems: ['Flatten Deep Nested Array', 'Debounce & Throttle Implementation', 'Custom Promise.all Implementation']
      }
    ]
  };

  const currentModules = TOPIC_MODULES[activeStack] || TOPIC_MODULES.pytorch;
  const filteredModules = searchQuery.trim()
    ? currentModules.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.summary.toLowerCase().includes(searchQuery.toLowerCase()))
    : currentModules;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* HEADER BANNER */}
      <div className="saas-card" style={{ padding: '28px', borderLeft: '4px solid #4f46e5' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-primary">DYNAMIC CURRICULUM & TOPIC EXPLORER</span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>
              Structured Engineering Topics & Lessons
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '2px' }}>
              Choose any technology domain to explore comprehensive video playlists, take topic assessments, and track completed topics.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-success" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
              ✓ {completedTopicIds.size} Topics Mastered
            </span>
          </div>
        </div>
      </div>

      {/* TECH STACK NAVIGATION PILLS & SEARCH */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {TECH_STACKS.map(st => (
            <button
              key={st.id}
              onClick={() => { setActiveStack(st.id); setSearchQuery(''); }}
              className={activeStack === st.id ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.82rem', padding: '8px 14px' }}
            >
              {st.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search topics, skills, or algorithms..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="saas-input"
          style={{ width: '280px', fontSize: '0.82rem', padding: '8px 12px' }}
        />
      </div>

      {/* TOPIC CARDS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {filteredModules.map(mod => {
          const isDone = completedTopicIds.has(mod.id);
          return (
            <div
              key={mod.id}
              className="saas-card"
              style={{
                padding: '24px',
                border: isDone ? '1px solid #86efac' : '1px solid #e2e8f0',
                background: isDone ? '#f0fdf4' : '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '16px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{mod.level}</span>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>⏱️ {mod.duration}</span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.35 }}>
                  {mod.title}
                </h3>

                <div style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 700, marginBottom: '10px' }}>
                  🎬 Instructor: {mod.channel}
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                  {mod.summary}
                </p>

                {/* KEY SUBTOPICS CHIPS */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                  {mod.subtopics.map((sub, sIdx) => (
                    <span key={sIdx} style={{ fontSize: '0.72rem', background: isDone ? '#dcfce7' : '#f1f5f9', color: isDone ? '#166534' : '#334155', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                      • {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => handleOpenTopicModal(mod)}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  Open Topic Studio 🎥
                </button>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      if (setActiveTab) setActiveTab('quiz');
                    }}
                    className="btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                  >
                    Take Quiz ⚡
                  </button>

                  <button
                    onClick={() => handleToggleComplete(mod.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid',
                      background: isDone ? '#10b981' : '#ffffff',
                      borderColor: isDone ? '#10b981' : '#cbd5e1',
                      color: isDone ? '#ffffff' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {isDone ? '✓ Completed' : '○ Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* =========================================================================
          INTERACTIVE TOPIC STUDIO MODAL (VIDEO PLAYER + QUIZ + DSA PROBLEMS)
         ========================================================================= */}
      {selectedTopicModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setSelectedTopicModal(null)}
        >
          <div
            className="saas-card"
            style={{
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: 'var(--shadow-modal)',
              animation: 'fadeInUp 0.2s ease-out'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-primary">TOPIC LEARNING STUDIO</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                  {selectedTopicModal.title}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  Curated by <strong>{selectedTopicModal.channel}</strong> · {selectedTopicModal.duration}
                </div>
              </div>

              <button
                onClick={() => setSelectedTopicModal(null)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '1rem', cursor: 'pointer', color: '#64748b', fontWeight: 800 }}
              >
                ✕
              </button>
            </div>

            {/* EMBEDDED YOUTUBE VIDEO LESSON */}
            {isModalYouTubeLoading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#4f46e5', fontWeight: 600 }}>
                ⚡ Fetching verified YouTube video lessons for {selectedTopicModal.title}...
              </div>
            ) : (
              <>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', background: '#000000', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
                  <iframe
                    key={modalSelectedVideoId || (modalYoutubeVideos.length > 0 ? modalYoutubeVideos[0].videoId : selectedTopicModal.youtubeId)}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    src={`https://www.youtube-nocookie.com/embed/${modalSelectedVideoId || (modalYoutubeVideos.length > 0 ? modalYoutubeVideos[0].videoId : selectedTopicModal.youtubeId)}?rel=0`}
                    title={selectedTopicModal.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                {/* Retrieved YouTube Video Cards List */}
                {modalYoutubeVideos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
                      🎬 Recommended Video Lessons (Click to Play):
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                      {modalYoutubeVideos.map((vid, vIdx) => {
                        const isPlaying = (modalSelectedVideoId === vid.videoId) || (!modalSelectedVideoId && vIdx === 0);
                        return (
                          <div
                            key={vIdx}
                            onClick={() => setModalSelectedVideoId(vid.videoId)}
                            style={{
                              display: 'flex',
                              gap: '10px',
                              padding: '8px',
                              borderRadius: '8px',
                              border: isPlaying ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                              background: isPlaying ? '#f0fdf4' : '#f8fafc',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <img
                              src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/mqdefault.jpg`}
                              alt={vid.title}
                              style={{ width: '80px', height: '50px', borderRadius: '4px', objectFit: 'cover', flexShrink: 0 }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: isPlaying ? '#4f46e5' : '#0f172a', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {vid.title}
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>
                                {isPlaying ? '▶️ PLAYING' : vid.channelTitle}
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

            {/* TOPIC CURRICULUM BREAKDOWN */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px', marginBottom: '20px' }}>
              
              {/* SUBTOPICS */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  📖 Key Subtopics in this Lesson
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedTopicModal.subtopics.map((st, sIdx) => (
                    <div key={sIdx} style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#4f46e5', fontWeight: 800 }}>✓</span>
                      {st}
                    </div>
                  ))}
                </div>
              </div>

              {/* HANDS-ON CODING & DSA */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                  🧠 Practice Coding Problems
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedTopicModal.dsaProblems.map((pr, pIdx) => (
                    <div key={pIdx} style={{ fontSize: '0.8rem', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#10b981' }}>⚡</span>
                      {pr}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* MODAL BOTTOM ACTION BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <a
                href={selectedTopicModal.playlistUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-subtle"
                style={{ fontSize: '0.82rem', padding: '8px 14px', textDecoration: 'none' }}
              >
                Open Full YouTube Playlist ↗
              </a>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedTopicModal(null);
                    if (setActiveTab) setActiveTab('quiz');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  Take {selectedTopicModal.quizTopic} Quiz 📊
                </button>

                <button
                  onClick={() => {
                    handleToggleComplete(selectedTopicModal.id);
                  }}
                  className={completedTopicIds.has(selectedTopicModal.id) ? 'btn-primary' : 'btn-secondary'}
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  {completedTopicIds.has(selectedTopicModal.id) ? '✓ Topic Completed' : 'Mark as Completed'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

window.CatalogView = CatalogView;
