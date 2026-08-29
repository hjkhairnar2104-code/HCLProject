function ChatbotView({ user, setActiveTab }) {
  const API_BASE = window.API_BASE || 'https://hclproject-cbmh.onrender.com';

  const generateDynamicPromptGuide = (query) => {
    const lower = (query || '').toLowerCase().trim();
    const cleanTopic = (query || '').replace(/(what is|how to learn|roadmap for|explain|difference between|tell me about|what should be my roadmap for|roadmap|\?)/gi, '').trim() || (query || 'Topic');

    if (lower.includes('langchain')) {
      return `### 🦜🔗 Production LangChain & AI Agent Mastery Roadmap

Here is a structured, production-ready 4-Week Roadmap to master **LangChain**, Vector Databases, RAG architectures, and Autonomous AI Agents:

#### 📅 Week 1: Core Fundamentals & LCEL (LangChain Expression Language)
- **Prompt Engineering**: \`ChatPromptTemplate\`, System vs Human messages, Few-Shot formatting.
- **Output Parsers**: Enforcing strict JSON schemas using \`PydanticOutputParser\` and \`StrOutputParser\`.
- **LCEL Pipe Syntax**: Composing pipelines: \`chain = prompt | model | parser\`.
- 🛠️ **Project**: *Interactive Code Explainer & Automated Unit-Test Generator*.

#### 📅 Week 2: Document Processing, Embeddings & Vector Databases (RAG)
- **Document Loaders & Chunking**: \`RecursiveCharacterTextSplitter\` with token overlap invariants.
- **Embeddings & Vector Stores**: OpenAI/HuggingFace embeddings with **FAISS**, **ChromaDB**, or **Pinecone**.
- **Retrievers**: Multi-Query Retriever, Contextual Compression, and BM25 + Vector Hybrid Search.
- 🛠️ **Project**: *Enterprise PDF Documentation Chatbot with Exact Page & Paragraph Citations*.

#### 📅 Week 3: Memory, Custom Tools & ReAct Agents
- **Stateful Memory**: \`ConversationBufferWindowMemory\`, SQLite-backed session persistence.
- **Custom Tool Calling**: Using \`@tool\` decorator with Pydantic validation schemas.
- **ReAct Agents**: \`create_tool_calling_agent\` combining Reason + Act loop for dynamic execution.
- 🛠️ **Project**: *Autonomous SQL Database Query & Chart Plotting Agent*.

#### 📅 Week 4: LangGraph Multi-Agent Workflows & Production Evaluation
- **LangGraph State Graphs**: Multi-agent nodes, conditional edge routing, human-in-the-loop approvals.
- **Observability & Tracing**: Integrating **LangSmith** and **Ragas** framework for latency and hallucination metrics.
- 🚀 **Capstone**: *Autonomous Software Architecture Reviewer & Code Generator*.

\`\`\`python
# Production LCEL + FAISS Vector Store Pipeline
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

# 1. Initialize Embeddings & Vector Store
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = FAISS.from_texts(["LangChain is an enterprise framework for building LLM applications."], embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})

# 2. Define LCEL Prompt & Chain
prompt = ChatPromptTemplate.from_template("Answer question using context:\\nContext: {context}\\nQuestion: {question}")
# chain = ({"context": retriever, "question": lambda x: x} | prompt | model | StrOutputParser())
\`\`\``;
    }

    if (lower.includes('roadmap') || lower.includes('how to learn')) {
      return `### 🗺️ Master Engineering Roadmap: ${cleanTopic.toUpperCase()}

Here is a structured, production-ready step-by-step roadmap to master **${cleanTopic}** from fundamentals to enterprise scale:

#### 📅 Phase 1: Core Fundamentals & Environment Setup (Weeks 1–2)
- **Syntax, Primitives & Lifecycle**: Understand core runtime semantics, memory models, and standard libraries.
- **Tooling & IDE Setup**: Package managers, debugging profilers, and linting/formatting tools.
- **Hands-on Practice**: Implement core algorithms and small standalone CLI utilities.

#### 📅 Phase 2: Architecture, State & API Integrations (Weeks 3–4)
- **Data Layer & Async Execution**: Asynchronous streams, connection pooling, and resilient error boundaries.
- **REST & Microservices**: Building clean modular endpoints with input validation and authentication.
- **Automated Testing**: Unit tests, mocking dependencies, and integration test suites.

#### 📅 Phase 3: Advanced Optimization, Security & System Design (Weeks 5–6)
- **High-Throughput Scaling**: Caching strategies (Redis), concurrency patterns, and query indexing.
- **Security Hardening**: Token authentication, secret vaults, and rate limiting.

#### 📅 Phase 4: Production Deployment & Observability (Weeks 7–8)
- **Containerization & CI/CD**: Multi-stage Dockerfiles and automated pipeline deployment.
- **Monitoring**: Structured logging, Prometheus metrics, and distributed APM tracing.
- 🚀 **Capstone Project**: Build an end-to-end production application using ${cleanTopic}!`;
    }

    if (lower.includes('difference') || lower.includes(' vs ')) {
      return `### ⚡ Technical Comparison: ${cleanTopic}

| Evaluation Dimension | Option A | Option B |
| :--- | :--- | :--- |
| **Ecosystem & Tools** | Native browser execution without bundlers | Requires build tools (Vite, Webpack, Babel/SWC) for JSX compilation |

#### 💡 Practical Code Comparison:

**1. Vanilla JavaScript (Imperative)**:
\`\`\`javascript
const button = document.createElement('button');
let count = 0;
button.innerText = 'Clicks: ' + count;
button.addEventListener('click', () => {
  count++;
  button.innerText = 'Clicks: ' + count; // Manual DOM update
});
document.body.appendChild(button);
\`\`\`

**2. React.js (Declarative)**:
\`\`\`jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicks: {count}
    </button>
  ); // React automatically calculates VDOM diff and updates only the text node!
}
\`\`\`

**Summary**: JavaScript is the foundational language of the web; React is an abstraction built on top of JavaScript to solve complex, stateful, and interactive user interfaces at scale.`;
    }

    if (lower.includes('trie')) {
      return `### 🌲 Trie (Prefix Tree) Complete Guide

A **Trie** is a specialized tree structure where nodes represent character keys, enabling **$O(L)$ search, insert, and prefix matching** regardless of the total number of items $N$ in the dictionary ($L$ = word length).

\`\`\`java
class TrieNode {
    TrieNode[] children = new TrieNode[26];
    boolean isEndOfWord = false;
}

public class Trie {
    private final TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode curr = root;
        for (char c : word.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) curr.children[idx] = new TrieNode();
            curr = curr.children[idx];
        }
        curr.isEndOfWord = true;
    }

    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEndOfWord;
    }

    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }

    private TrieNode find(String s) {
        TrieNode curr = root;
        for (char c : s.toCharArray()) {
            int idx = c - 'a';
            if (curr.children[idx] == null) return null;
            curr = curr.children[idx];
        }
        return curr;
    }
}
\`\`\`

- **Time Complexity**: Insert $O(L)$, Search $O(L)$, Prefix $O(L)$.
- **Interview Applications**: Autocomplete, Spell Checkers, Longest Common Prefix, IP Routing.`;
    }

    if (lower.includes('kafka') || lower.includes('system design') || lower.includes('redis')) {
      return `### 🏗️ High-Scale Distributed System Architecture

1. **Distributed Caching (Redis)**:
   - **Cache-Aside**: Query Redis &rarr; on cache miss, query Database &rarr; write back to Redis with TTL.
   - **Write-Through**: Application writes to cache, which synchronously persists to DB.
   - **Write-Back**: Write to Redis immediately, asynchronously batch flushes to DB.

2. **Event Streaming (Apache Kafka)**:
   - **Partitions**: Unit of parallelism and strict per-key ordering.
   - **Consumer Groups**: Load balances partition reads across multiple consumer instances.
   - **ISR (In-Sync Replicas)**: Guarantees zero data loss with \`acks=all\`.

3. **Database Sharding**:
   - Uses **Consistent Hashing** with virtual nodes to evenly distribute keys across partitions with minimal data movement during node resizing.`;
    }

    return `### 💡 Technical Guide: ${query}

1. **Core Concept & Architecture**:
   - Deconstruct the problem into modular components with clear state invariants.
   - Identify asymptotic time ($O(1)$ vs $O(N)$ vs $O(N \\log N)$) and space trade-offs.

2. **Best Practices**:
   - Ensure clean error handling, boundary validation, and immutable data flow.
   - Leverage dedicated data structures (HashMaps, Min-Heaps, Segment Trees) for performance bottlenecks.

3. **Interactive Practice**:
   - You can test and benchmark this concept directly in **My Learning Path** and **Algo Visualizer**!`;
  };

  const requestChatGptAnswer = async (query, historyPayload) => {
    // 1. Send request to Backend API (which calls Gemini 2.5 Flash on Render)
    try {
      const res = await fetch(`${API_BASE}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          userContext: user ? `User: ${user.fullName || user.email}` : "Target: Software & AI Engineer"
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.response || data.reply;
        if (text && text.trim().length > 0 && !text.includes("Technical Deep-Dive:") && !text.includes("Master Roadmap:")) {
          return text;
        }
      }
    } catch (e) {
      console.warn("Backend API request error:", e);
    }

    // 2. Direct client-side Gemini 2.5 Flash call as immediate fallback
    try {
      const geminiKey = "AIzaSyCKAbcdq_NZNTQ57QYey4FjccTjhClXl-w";
      const contents = (historyPayload || []).map(m => ({
        role: m.role === 'assistant' || m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.text || m.content || '' }]
      }));

      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: query }] }]
        })
      });

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const replyText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText && replyText.trim().length > 0) {
          return replyText;
        }
      }
    } catch (gErr) {
      console.warn("Direct client Gemini call error:", gErr);
    }

    return generateDynamicPromptGuide(query);
  };
  // Helper to isolate chat threads per user
  const getChatStorageKey = (u) => {
    if (u && u.email) return `learnpath_chat_threads_${u.email.toLowerCase().trim()}`;
    return 'learnpath_chat_threads_guest';
  };

  const getDefaultThread = (u) => [
    {
      id: 'thread_welcome_1',
      title: 'Getting Started with AI Mentor',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          role: 'ai',
          text: `👋 **Hello${u?.fullName ? ' ' + u.fullName.split(' ')[0] : ''}! I'm your LearnPath AI Technical Mentor.**\n\nI can help you deep-dive into:\n- ⚔️ **Data Structures & Algorithms** (Trie, Segment Trees, 0/1 Knapsack, Graphs, LCA)\n- 🏗️ **System Design** (Kafka, Redis Caching, Distributed Sharding, CAP Theorem)\n- 🌐 **Full Stack & SQL** (JavaScript vs React, Next.js, Window Functions, Indexing)\n- 🤖 **Generative AI & LLMs** (Hybrid RAG, Cross-Encoder Rerankers, Transformers)\n- ☕ **Java 21 & Cloud** (Virtual Threads vs Carrier Threads, Docker Multi-Stage)\n\nWhat topic would you like to explore or debug today?`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    }
  ];

  const currentStorageKey = getChatStorageKey(user);
  const activeKeyRef = React.useRef(currentStorageKey);

  // 1. Thread & History State Management (User-Scoped & Isolated)
  const [threads, setThreads] = React.useState(() => {
    try {
      const saved = localStorage.getItem(currentStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return getDefaultThread(user);
  });

  const [activeThreadId, setActiveThreadId] = React.useState(() => {
    return threads[0]?.id || 'thread_welcome_1';
  });

  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [copiedIdx, setCopiedIdx] = React.useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [editingThreadId, setEditingThreadId] = React.useState(null);
  const [editTitleText, setEditTitleText] = React.useState('');

  const messagesEndRef = React.useRef(null);
  const textareaRef = React.useRef(null);

  // Safely handle User Switch / Login / Logout without overwriting saved data
  React.useEffect(() => {
    if (activeKeyRef.current !== currentStorageKey) {
      // 1. Load the new user's threads from their storage
      try {
        const saved = localStorage.getItem(currentStorageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setThreads(parsed);
            setActiveThreadId(parsed[0].id);
            activeKeyRef.current = currentStorageKey;
            return;
          }
        }
      } catch (e) {}

      // 2. If new user has no threads yet, initialize default
      const def = getDefaultThread(user);
      setThreads(def);
      setActiveThreadId(def[0].id);
      activeKeyRef.current = currentStorageKey;
      try {
        localStorage.setItem(currentStorageKey, JSON.stringify(def));
      } catch (e) {}
    }
  }, [currentStorageKey, user]);

  // Persist threads to user's LocalStorage only when activeKey matches current user
  React.useEffect(() => {
    if (activeKeyRef.current === currentStorageKey && threads && threads.length > 0) {
      try {
        localStorage.setItem(currentStorageKey, JSON.stringify(threads));
      } catch (e) {}
    }
  }, [threads, currentStorageKey]);

  // Current active thread
  const currentThread = threads.find(t => t.id === activeThreadId) || threads[0] || {
    id: 'temp',
    title: 'New Conversation',
    messages: []
  };

  const scrollToBottom = () => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {}
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentThread?.messages, isLoading]);

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  // Create a new chat thread
  const handleCreateNewThread = () => {
    const newThreadId = 'thread_' + Date.now();
    const newThread = {
      id: newThreadId,
      title: 'New Conversation',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          role: 'ai',
          text: "👋 **New Chat Started!** How can I assist you with your code, architecture, or interview prep?",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setInput('');
  };

  // Delete a thread
  const handleDeleteThread = (threadId, e) => {
    e?.stopPropagation();
    if (threads.length <= 1) {
      if (window.confirm("Clear this conversation?")) {
        const resetThread = {
          id: 'thread_' + Date.now(),
          title: 'New Conversation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [
            {
              role: 'ai',
              text: "👋 **Chat cleared.** How can I assist you with your engineering path today?",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        setThreads([resetThread]);
        setActiveThreadId(resetThread.id);
      }
      return;
    }

    if (window.confirm("Delete this conversation thread?")) {
      setThreads(prev => {
        const filtered = prev.filter(t => t.id !== threadId);
        if (activeThreadId === threadId && filtered.length > 0) {
          setActiveThreadId(filtered[0].id);
        }
        return filtered;
      });
    }
  };

  // Rename a thread
  const handleStartRename = (thread, e) => {
    e?.stopPropagation();
    setEditingThreadId(thread.id);
    setEditTitleText(thread.title);
  };

  const handleSaveRename = (threadId, e) => {
    e?.preventDefault();
    if (editTitleText.trim()) {
      setThreads(prev => prev.map(t => t.id === threadId ? { ...t, title: editTitleText.trim(), updatedAt: new Date().toISOString() } : t));
    }
    setEditingThreadId(null);
  };

  // Clear all threads
  const handleClearAllThreads = () => {
    if (window.confirm("Are you sure you want to clear all conversation history?")) {
      const freshThread = {
        id: 'thread_' + Date.now(),
        title: 'New Conversation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            role: 'ai',
            text: "👋 **All conversations cleared.** Ask any technical question to begin!",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      setThreads([freshThread]);
      setActiveThreadId(freshThread.id);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Send message with multi-turn history
  const handleSendMessage = async (customText) => {
    const textToSend = customText || input;
    if (!textToSend || !textToSend.trim() || isLoading) return;

    const trimmedQuery = textToSend.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Prepare new user message
    const userMsg = { role: 'user', text: trimmedQuery, time: currentTime };
    const currentMsgs = currentThread.messages || [];
    const updatedMsgs = [...currentMsgs, userMsg];

    // Auto-update thread title if it's the default name
    let updatedTitle = currentThread.title;
    if (currentThread.title === 'New Conversation' || currentThread.title === 'Getting Started with AI Mentor') {
      updatedTitle = trimmedQuery.length > 36 ? trimmedQuery.substring(0, 36) + '...' : trimmedQuery;
    }

    // Update UI immediately with user message and commit to storage
    setThreads(prev => {
      const next = prev.map(t => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            title: updatedTitle,
            updatedAt: new Date().toISOString(),
            messages: updatedMsgs
          };
        }
        return t;
      });
      try { localStorage.setItem(currentStorageKey, JSON.stringify(next)); } catch (e) {}
      return next;
    });

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsLoading(true);

    // Multi-turn history formatting (last 8 messages for context window)
    const historyPayload = updatedMsgs.slice(-8).map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      text: m.text
    }));

    try {
      const reply = await requestChatGptAnswer(trimmedQuery, historyPayload);

      const aiMsg = {
        role: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => {
        const next = prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [...updatedMsgs, aiMsg]
            };
          }
          return t;
        });
        try { localStorage.setItem(currentStorageKey, JSON.stringify(next)); } catch (e) {}
        return next;
      });

    } catch (e) {
      const errorMsg = {
        role: 'ai',
        text: generateDynamicPromptGuide(trimmedQuery),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setThreads(prev => {
        const next = prev.map(t => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              updatedAt: new Date().toISOString(),
              messages: [...updatedMsgs, errorMsg]
            };
          }
          return t;
        });
        try { localStorage.setItem(currentStorageKey, JSON.stringify(next)); } catch (err) {}
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (text, idx) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch (err) {}
  };

  // Export current conversation to Markdown file
  const handleExportChat = () => {
    try {
      let mdContent = `# Conversation: ${currentThread.title}\n\n`;
      currentThread.messages.forEach(m => {
        mdContent += `### ${m.role === 'ai' ? '🤖 AI Engineering Mentor' : '👤 You'} (${m.time || ''})\n\n${m.text}\n\n---\n\n`;
      });
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentThread.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {}
  };

  const CATEGORIES = [
    { id: 'all', label: '🔥 All Topics' },
    { id: 'platform', label: '🚀 LearnPath Platform Features' },
    { id: 'dsa', label: '⚔️ DSA & Algorithms' },
    { id: 'sysdesign', label: '🏗️ System Design' },
    { id: 'web', label: '🌐 Full Stack & SQL' },
    { id: 'genai', label: '🤖 Generative AI & RAG' },
    { id: 'java', label: '☕ Java 21 & Cloud' }
  ];

  const PROMPT_SUGGESTIONS = {
    all: [
      "What features does LearnPath AI offer?",
      "Javascript and react difference",
      "Explain me trie data structure with Java code",
      "How does Resume Gap AI find jobs and build 30-day roadmaps?",
      "What is the difference between Virtual Threads and Carrier Threads in Java 21?",
      "How does Kafka manage partition consumer lag?",
      "Explain how RAG Cross-Encoder reranking works"
    ],
    platform: [
      "What features does LearnPath AI offer?",
      "How does the Algorithm Visualizer work?",
      "How does Resume Gap AI find jobs and build 30-day roadmaps?",
      "How does the ATS Resume Builder create free PDFs?",
      "How does real-time job matching with Adzuna work?",
      "What is the 5-level adaptive assessment quiz?"
    ],
    dsa: [
      "Explain me trie data structure with Java code",
      "Show the template for Sliding Window pattern with code",
      "0/1 Knapsack 1D space optimization code & intuition",
      "Explain Dijkstra Shortest Path with priority queue in Java",
      "How to validate Binary Search Tree with bounding ranges"
    ],
    sysdesign: [
      "How does Kafka manage partition consumer lag?",
      "Explain Cache-Aside vs Write-Through vs Write-Back caching",
      "How does Consistent Hashing minimize database key redistribution?",
      "Design a Distributed Rate Limiter with Redis Token Bucket"
    ],
    web: [
      "Javascript and react difference",
      "explain me sql window function",
      "How does React useEffect reconciliation and cleanup work?",
      "Difference between SQL B-Tree indexing and Hash indexing"
    ],
    genai: [
      "Explain how RAG Cross-Encoder reranking works",
      "Explain Transformer Self-Attention mathematical equation",
      "How does LoRA (Low-Rank Adaptation) fine-tune LLMs efficiently?",
      "What is Chain-of-Thought (CoT) prompting with examples"
    ],
    java: [
      "What is the difference between Virtual Threads and Carrier Threads in Java 21?",
      "How does Spring Boot IoC Container and HikariCP work?",
      "How to build Docker multi-stage builds for Java applications"
    ]
  };

  // Filter threads by search query
  const filteredThreads = threads.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.messages.some(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', gap: '16px', height: 'calc(100vh - 120px)', minHeight: '680px' }}>
      
      {/* ========================================================================= */}
      {/* 1. CHATGPT-STYLE THREADS & HISTORY SIDEBAR                                 */}
      {/* ========================================================================= */}
      {isSidebarOpen && (
        <div
          className="saas-card"
          style={{
            width: '280px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            padding: '16px',
            borderRadius: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
            height: '100%',
            overflow: 'hidden'
          }}
        >
          {/* + NEW CHAT BUTTON */}
          <button
            onClick={handleCreateNewThread}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.25)',
              marginBottom: '14px'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>+</span> New Chat
          </button>

          {/* SEARCH THREADS INPUT */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 30px',
                fontSize: '0.78rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                outline: 'none'
              }}
            />
            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8' }}>
              🔍
            </span>
          </div>

          {/* THREADS LIST SCROLL VIEW */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px', paddingRight: '4px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 6px' }}>
              Recent Chats ({filteredThreads.length})
            </div>

            {filteredThreads.length === 0 ? (
              <div style={{ padding: '20px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.8rem' }}>
                No chats found
              </div>
            ) : (
              filteredThreads.map(thread => {
                const isActive = thread.id === activeThreadId;
                const isEditing = editingThreadId === thread.id;

                return (
                  <div
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      background: isActive ? '#ffffff' : 'transparent',
                      border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
                      boxShadow: isActive ? '0 2px 8px rgba(79, 70, 229, 0.08)' : 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={e => {
                      if (!isActive) e.currentTarget.style.background = '#f1f5f9';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
                      <span style={{ fontSize: '0.85rem', flexShrink: 0 }}>
                        {isActive ? '💬' : '🗨️'}
                      </span>

                      {isEditing ? (
                        <form onSubmit={(e) => handleSaveRename(thread.id, e)} style={{ flex: 1 }} onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            autoFocus
                            value={editTitleText}
                            onChange={e => setEditTitleText(e.target.value)}
                            onBlur={(e) => handleSaveRename(thread.id, e)}
                            style={{
                              width: '100%',
                              padding: '2px 6px',
                              fontSize: '0.8rem',
                              borderRadius: '4px',
                              border: '1px solid #4f46e5',
                              outline: 'none'
                            }}
                          />
                        </form>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: isActive ? 700 : 500,
                            color: isActive ? '#4f46e5' : '#334155',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={thread.title}
                        >
                          {thread.title}
                        </span>
                      )}
                    </div>

                    {/* ACTIONS: RENAME & DELETE */}
                    {!isEditing && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                        <button
                          onClick={(e) => handleStartRename(thread, e)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#94a3b8', padding: '2px' }}
                          title="Rename title"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => handleDeleteThread(thread.id, e)}
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.72rem', color: '#ef4444', padding: '2px' }}
                          title="Delete chat"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* SIDEBAR FOOTER */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                ⚡ Multi-Turn Memory Active
              </span>
              <button
                onClick={handleClearAllThreads}
                style={{ background: 'transparent', border: 'none', fontSize: '0.7rem', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }}
                title="Clear all chats"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN CHATGPT-STYLE CONVERSATION WORKSPACE                              */}
      {/* ========================================================================= */}
      <div
        className="saas-card"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          background: '#ffffff',
          height: '100%'
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            {/* TOGGLE SIDEBAR BUTTON */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="btn-subtle"
              style={{ padding: '6px 10px', fontSize: '0.85rem', borderRadius: '8px' }}
              title={isSidebarOpen ? "Hide sidebar" : "Show sidebar"}
            >
              {isSidebarOpen ? '◀' : '▶ History'}
            </button>

            <div style={{ overflow: 'hidden' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentThread.title}
              </h2>
              <div style={{ fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                <span>Gemini 3.5 & RAG Knowledge Engine</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={handleExportChat}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Export as Markdown"
            >
              📥 Export
            </button>
            <button
              onClick={handleCreateNewThread}
              className="btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              title="Start a new chat"
            >
              + New
            </button>
          </div>
        </div>

        {/* MESSAGES SCROLL AREA */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>
          
          {currentThread.messages.map((msg, idx) => {
            const isAi = msg.role === 'ai';
            let parsedHtml = '';
            if (isAi && window.marked) {
              try {
                parsedHtml = window.marked.parse(msg.text);
              } catch (err) {
                parsedHtml = '';
              }
            }

            return (
              <div
                key={idx}
                style={{
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: isAi ? '96%' : '84%',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start'
                }}
              >
                {/* AI AVATAR */}
                {isAi && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)'
                    }}
                  >
                    🤖
                  </div>
                )}

                {/* MESSAGE BODY */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: isAi ? '100%' : 'auto' }}>
                  
                  {/* SENDER LABEL & TIME */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: isAi ? '2px' : 0, justifyContent: isAi ? 'flex-start' : 'flex-end' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isAi ? '#4f46e5' : '#64748b' }}>
                      {isAi ? 'AI Technical Mentor' : (user?.fullName || 'You')}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>
                      {msg.time || ''}
                    </span>
                  </div>

                  <div
                    style={{
                      background: isAi ? '#ffffff' : 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                      color: isAi ? '#0f172a' : '#ffffff',
                      border: isAi ? '1px solid #e2e8f0' : 'none',
                      padding: '18px 22px',
                      borderRadius: isAi ? '14px' : '14px 14px 2px 14px',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                      boxShadow: isAi ? '0 2px 10px rgba(0, 0, 0, 0.02)' : '0 4px 14px rgba(79, 70, 229, 0.25)',
                      position: 'relative'
                    }}
                  >
                    {isAi && parsedHtml ? (
                      <div className="markdown-content" dangerouslySetInnerHTML={{ __html: parsedHtml }} />
                    ) : (
                      <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    )}

                    {/* COPY BUTTON ON AI REPLIES */}
                    {isAi && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                        <button
                          onClick={() => handleCopyMessage(msg.text, idx)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedIdx === idx ? '#059669' : '#64748b',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {copiedIdx === idx ? '✓ Copied to clipboard' : '📋 Copy response'}
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}

          {isLoading && (
            <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center', padding: '14px 20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '0.86rem', color: '#4f46e5', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
              <span className="spinner" style={{ width: '16px', height: '16px', border: '2px solid #4f46e5', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
              AI Mentor is thinking & generating detailed solution...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. CATEGORIES & FAST SUGGESTIONS */}
        <div style={{ borderTop: '1px solid #f1f5f9', background: '#fafbfc', padding: '10px 20px' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px', marginBottom: '6px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  background: activeCategory === cat.id ? '#4f46e5' : '#ffffff',
                  color: activeCategory === cat.id ? '#ffffff' : '#64748b',
                  border: activeCategory === cat.id ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
            {(PROMPT_SUGGESTIONS[activeCategory] || PROMPT_SUGGESTIONS.all).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                style={{
                  fontSize: '0.72rem',
                  padding: '5px 12px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: '#ffffff',
                  color: '#334155',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#4f46e5'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; }}
              >
                💡 {q}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CHATGPT-STYLE EXPANDING COMMAND BAR */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '10px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '14px',
              padding: '8px 14px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
            }}
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (Press Enter to send, Shift+Enter for new line)..."
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                resize: 'none',
                maxHeight: '160px',
                padding: '6px 0',
                color: '#0f172a'
              }}
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="btn-primary"
              style={{
                padding: '8px 18px',
                fontSize: '0.85rem',
                fontWeight: 700,
                borderRadius: '10px',
                opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
                flexShrink: 0
              }}
            >
              Send →
            </button>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
            LearnPath AI can generate code, diagrams, and architecture proofs. Verify critical production details.
          </div>
        </div>

      </div>

    </div>
  );
}

window.ChatbotView = ChatbotView;
