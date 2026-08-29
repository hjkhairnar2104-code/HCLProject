// LearnPath AI — Flagship DSA Animator Studio (85+ Comprehensive Problems across 17 Categories)
function AlgorithmVisualizerView() {
  const CATEGORIES = [
    'All', '1. Arrays', '2. Strings', '3. Matrix', '4. Stack', '5. Queue',
    '6. Binary Search', '7. Linked List', '11. Tree', '12. Heap', '13. Graph',
    '14. Dynamic Programming', '16. Trie'
  ];

  // Load comprehensive problem dataset from window.DSA_PROBLEMS_DATA
  const PROBLEMS = (typeof window !== 'undefined' && window.DSA_PROBLEMS_DATA && window.DSA_PROBLEMS_DATA.length > 0)
    ? window.DSA_PROBLEMS_DATA
    : [];

  // State Management
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedPriority, setSelectedPriority] = React.useState('All');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeProblem, setActiveProblem] = React.useState(PROBLEMS[0] || null);
  const [activeExampleIndex, setActiveExampleIndex] = React.useState(0);
  const [codeLanguage, setCodeLanguage] = React.useState('Python');

  // Player Engine State
  const [stepIndex, setStepIndex] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speedMs, setSpeedMs] = React.useState(700);

  // Synchronize active problem if initial state was empty
  React.useEffect(() => {
    if (!activeProblem && PROBLEMS.length > 0) {
      setActiveProblem(PROBLEMS[0]);
    }
  }, [PROBLEMS, activeProblem]);

  // Generate Steps for current active problem & example
  const currentExampleData = activeProblem?.examples?.[activeExampleIndex]?.data || activeProblem?.examples?.[0]?.data || {};
  const steps = React.useMemo(() => {
    if (activeProblem && activeProblem.generateSteps) {
      return activeProblem.generateSteps(currentExampleData);
    }
    return [{ line: 1, explanation: 'Ready', vars: {}, visual: {} }];
  }, [activeProblem, currentExampleData]);

  // Handle Autoplay & Pause
  React.useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    }
    return () => clearInterval(interval);
  }, [isPlaying, steps, speedMs]);

  // Switch problem
  const handleSelectProblem = (prob) => {
    setActiveProblem(prob);
    setActiveExampleIndex(0);
    setStepIndex(0);
    setIsPlaying(false);
  };

  const currentStep = steps[stepIndex] || steps[0] || {
    line: 1, explanation: 'Ready', vars: {}, visual: {}
  };

  // Get active code string based on selected language
  const getActiveCodeString = () => {
    if (!activeProblem) return '';
    if (codeLanguage === 'Python') return activeProblem.pythonCode || activeProblem.javaCode;
    if (codeLanguage === 'JavaScript') return activeProblem.javascriptCode || activeProblem.javaCode;
    return activeProblem.javaCode;
  };

  // Filter Problem Catalog
  const filteredProblems = PROBLEMS.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchPrio = selectedPriority === 'All' || p.priority === selectedPriority;
    const matchQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchPrio && matchQuery;
  });

  if (!activeProblem) {
    return <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>Loading DSA Animator Studio...</div>;
  }

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. MASTER HEADER & STATS BAR */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem'
            }}
          >
            🧠
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              DSA Animator Studio
            </h1>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
              Interactive step-by-step visualizer for top Data Structures & Algorithms interview questions.
            </p>
          </div>
        </div>

        {/* STATS METRICS BADGES */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ padding: '6px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
            Total: 85+ Problems
          </div>
          <div style={{ padding: '6px 12px', background: '#ecfdf5', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#059669' }}>
            Easy: 30+
          </div>
          <div style={{ padding: '6px 12px', background: '#fffbeb', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#d97706' }}>
            Medium: 45+
          </div>
          <div style={{ padding: '6px 12px', background: '#fef2f2', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 700, color: '#dc2626' }}>
            Hard: 10+
          </div>
        </div>
      </div>

      {/* 2. CATEGORY PILL NAVIGATION */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 800 : 600,
                  background: isSelected ? '#4f46e5' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#475569',
                  border: isSelected ? '1px solid #4f46e5' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.25)' : 'none'
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PROBLEM SELECTION CARDS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px'
        }}
      >
        {filteredProblems.map(p => {
          const isActive = activeProblem.id === p.id;
          const diffColor = p.difficulty === 'Easy' ? '#10b981' : (p.difficulty === 'Medium' ? '#f59e0b' : '#ef4444');

          return (
            <div
              key={p.id}
              onClick={() => handleSelectProblem(p)}
              style={{
                background: isActive ? '#eef2ff' : '#ffffff',
                border: isActive ? '2px solid #4f46e5' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: isActive ? '0 4px 14px rgba(79, 70, 229, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#6366f1' }}>#{p.num}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{p.title}</span>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{p.subcat}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: `${diffColor}15`,
                    color: diffColor
                  }}
                >
                  {p.difficulty}
                </span>
                <button
                  style={{
                    background: isActive ? '#4f46e5' : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#334155',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  ▶ viz
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. ACTIVE PROBLEM INTERACTIVE STAGE & WORKSPACE */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 24px -2px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        
        {/* PROBLEM BANNER HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 10px', background: '#4f46e5', color: '#ffffff', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem' }}>
                #{activeProblem.num}
              </span>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                {activeProblem.title}
              </h2>
              <span
                style={{
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  background: activeProblem.difficulty === 'Easy' ? '#ecfdf5' : (activeProblem.difficulty === 'Medium' ? '#fffbeb' : '#fef2f2'),
                  color: activeProblem.difficulty === 'Easy' ? '#059669' : (activeProblem.difficulty === 'Medium' ? '#d97706' : '#dc2626')
                }}
              >
                {activeProblem.difficulty}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '0.86rem', color: '#475569' }}>
              {activeProblem.description}
            </p>
          </div>

          {/* TRY EXAMPLES CHIPS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
              Try Examples:
            </span>
            {activeProblem.examples.map((ex, idx) => {
              const isSelected = activeExampleIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => { setActiveExampleIndex(idx); setStepIndex(0); setIsPlaying(false); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: isSelected ? '#4f46e5' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {ex.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* UNIVERSAL PLAYER CONTROLS BAR */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            color: '#ffffff'
          }}
        >
          {/* PLAY / PAUSE / STEP BUTTONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setStepIndex(prev => Math.max(0, prev - 1))}
              disabled={stepIndex === 0}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#1e293b',
                color: stepIndex === 0 ? '#64748b' : '#ffffff',
                border: '1px solid #334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: stepIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ◀ Prev
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                background: isPlaying ? '#ec4899' : '#10b981',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isPlaying ? '0 0 12px rgba(236, 72, 153, 0.4)' : '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>

            <button
              onClick={() => setStepIndex(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={stepIndex === steps.length - 1}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#1e293b',
                color: stepIndex === steps.length - 1 ? '#64748b' : '#ffffff',
                border: '1px solid #334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: stepIndex === steps.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next ▶
            </button>

            <button
              onClick={() => { setStepIndex(0); setIsPlaying(false); }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'transparent',
                color: '#94a3b8',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ↺ Reset
            </button>
          </div>

          {/* STEP COUNTER & SPEED SLIDER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#38bdf8' }}>
              Step {stepIndex + 1} / {steps.length}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>Speed:</span>
              <input
                type="range"
                min="200"
                max="1500"
                step="100"
                value={1700 - speedMs}
                onChange={(e) => setSpeedMs(1700 - Number(e.target.value))}
                style={{ width: '100px', cursor: 'pointer' }}
              />
            </div>
          </div>
        </div>

        {/* STEP EXPLANATION BANNER */}
        <div
          style={{
            background: '#f8fafc',
            borderLeft: '4px solid #4f46e5',
            padding: '14px 18px',
            borderRadius: '0 10px 10px 0',
            fontSize: '0.88rem',
            color: '#1e293b',
            lineHeight: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <div>
            <strong>Step {stepIndex + 1}: </strong>
            <span>{currentStep.explanation}</span>
          </div>
        </div>

        {/* MAIN VISUAL CANVAS & SYNCHRONIZED CODE INSPECTOR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '20px' }}>
          
          {/* LEFT: PROBLEM-SPECIFIC INTERACTIVE VISUAL CANVAS */}
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '24px',
              minHeight: '380px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            
            {/* 1. REAL SVG BINARY TREE VISUALIZER */}
            {currentStep.visual?.type === 'binary_tree' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <svg width="400" height="240" viewBox="0 0 400 240" style={{ overflow: 'visible', maxWidth: '100%' }}>
                  <defs>
                    <filter id="nodeShadow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                    </filter>
                  </defs>
                  {/* Render Tree Branches / Edges */}
                  {currentStep.visual.edges?.map((edge, eIdx) => {
                    const fromNode = currentStep.visual.nodes.find(n => n.id === edge.from);
                    const toNode = currentStep.visual.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    return (
                      <line
                        key={eIdx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#94a3b8"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Render Tree Nodes */}
                  {currentStep.visual.nodes?.map(node => {
                    const isActive = node.active;
                    const isDone = node.done || currentStep.visual.done;
                    const isLCA = node.lca;
                    const isTarget = node.target;

                    let fillColor = '#ffffff';
                    let strokeColor = '#64748b';
                    let textColor = '#0f172a';

                    if (isLCA) {
                      fillColor = '#8b5cf6';
                      strokeColor = '#6d28d9';
                      textColor = '#ffffff';
                    } else if (isActive) {
                      fillColor = '#3b82f6';
                      strokeColor = '#1d4ed8';
                      textColor = '#ffffff';
                    } else if (isDone) {
                      fillColor = '#10b981';
                      strokeColor = '#047857';
                      textColor = '#ffffff';
                    } else if (isTarget) {
                      fillColor = '#f59e0b';
                      strokeColor = '#b45309';
                      textColor = '#ffffff';
                    }

                    return (
                      <g key={node.id} style={{ transition: 'all 0.3s ease' }}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="20"
                          fill={fillColor}
                          stroke={strokeColor}
                          strokeWidth="3"
                          style={{
                            filter: (isActive || isLCA || isDone) ? 'drop-shadow(0 0 8px rgba(79, 70, 229, 0.4))' : 'none'
                          }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fill={textColor}
                          fontSize="14"
                          fontWeight="900"
                          fontFamily="sans-serif"
                        >
                          {node.val}
                        </text>
                        {isLCA && (
                          <text x={node.x} y={node.y - 25} textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="900">
                            ★ LCA
                          </text>
                        )}
                        {isTarget && !isDone && (
                          <text x={node.x} y={node.y - 25} textAnchor="middle" fill="#d97706" fontSize="10" fontWeight="800">
                            Target
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}

            {/* 1B. REAL SVG & DOM LINKED LIST VISUALIZER */}
            {currentStep.visual?.type === 'linked_list' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.visual.nodes?.map((node, nIdx) => {
                    const ptrs = currentStep.visual.ptrs || {};
                    const matchedPtrs = Object.entries(ptrs).filter(([_, v]) => v === node.id || v === nIdx);
                    const isActive = node.active || matchedPtrs.length > 0;
                    const isDone = node.done || currentStep.visual.done;

                    return (
                      <div key={node.id || nIdx} style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
                        {/* Node Card */}
                        <div
                          style={{
                            display: 'flex',
                            border: isActive ? '2px solid #4f46e5' : (isDone ? '2px solid #10b981' : '1px solid #cbd5e1'),
                            borderRadius: '10px',
                            background: isActive ? '#eef2ff' : (isDone ? '#ecfdf5' : '#ffffff'),
                            boxShadow: isActive ? '0 0 14px rgba(79, 70, 229, 0.3)' : '0 2px 6px rgba(0,0,0,0.05)',
                            overflow: 'hidden',
                            position: 'relative'
                          }}
                        >
                          <div
                            style={{
                              padding: '12px 16px',
                              fontWeight: 900,
                              fontSize: '1.15rem',
                              color: isActive ? '#4f46e5' : (isDone ? '#059669' : '#0f172a'),
                              borderRight: '1px solid #e2e8f0',
                              minWidth: '42px',
                              textAlign: 'center'
                            }}
                          >
                            {node.val}
                          </div>
                          <div
                            style={{
                              padding: '12px 10px',
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              color: '#94a3b8',
                              background: '#f8fafc',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            •
                          </div>
                        </div>

                        {/* Pointer Badges Above / Below Node */}
                        {matchedPtrs.length > 0 && (
                          <div style={{ position: 'absolute', bottom: '-26px', left: '0', right: '0', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                            {matchedPtrs.map(([pName]) => (
                              <span
                                key={pName}
                                style={{
                                  fontSize: '0.68rem',
                                  fontWeight: 900,
                                  color: pName === 'head' ? '#2563eb' : (pName === 'slow' || pName === 'prev' ? '#ec4899' : '#10b981'),
                                  background: '#ffffff',
                                  padding: '1px 6px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0'
                                }}
                              >
                                {pName}▲
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Animated Arrow to Next Node */}
                        {nIdx < currentStep.visual.nodes.length - 1 && (
                          <div style={{ display: 'flex', alignItems: 'center', color: node.reverseArrow ? '#ec4899' : '#4f46e5', fontWeight: 900, fontSize: '1.3rem' }}>
                            {node.reverseArrow ? '◀' : '➔'}
                          </div>
                        )}
                        {nIdx === currentStep.visual.nodes.length - 1 && !currentStep.visual.hasCycle && (
                          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8' }}>
                            ➔ NULL
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {currentStep.visual.hasCycle && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', padding: '6px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                    🔄 Cycle Detected: Next pointer loops back to Node {currentStep.visual.cycleTarget}!
                  </div>
                )}
              </div>
            )}

            {/* 1C. REAL SVG GRAPH & NETWORK VISUALIZER */}
            {currentStep.visual?.type === 'graph' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '14px' }}>
                <svg width="420" height="230" viewBox="0 0 420 230" style={{ overflow: 'visible', maxWidth: '100%' }}>
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="22" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="#6366f1" />
                    </marker>
                  </defs>
                  {/* Graph Edges */}
                  {currentStep.visual.edges?.map((edge, eIdx) => {
                    const fromNode = currentStep.visual.nodes.find(n => n.id === edge.from);
                    const toNode = currentStep.visual.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const isTraversed = edge.active;

                    return (
                      <g key={eIdx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isTraversed ? '#6366f1' : '#cbd5e1'}
                          strokeWidth={isTraversed ? '3.5' : '2'}
                          strokeDasharray={edge.dashed ? '5,5' : 'none'}
                          markerEnd={edge.directed ? 'url(#arrowhead)' : 'none'}
                        />
                        {edge.weight && (
                          <text
                            x={(fromNode.x + toNode.x) / 2}
                            y={(fromNode.y + toNode.y) / 2 - 6}
                            textAnchor="middle"
                            fill="#64748b"
                            fontSize="11"
                            fontWeight="800"
                          >
                            {edge.weight}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Graph Nodes */}
                  {currentStep.visual.nodes?.map(node => {
                    const isActive = node.active;
                    const isVisited = node.visited;
                    const isSource = node.isSource;
                    const isTarget = node.isTarget;

                    let bg = '#ffffff';
                    let border = '#64748b';
                    let text = '#0f172a';

                    if (isActive) {
                      bg = '#4f46e5';
                      border = '#3730a3';
                      text = '#ffffff';
                    } else if (isVisited) {
                      bg = '#10b981';
                      border = '#047857';
                      text = '#ffffff';
                    } else if (isSource) {
                      bg = '#f59e0b';
                      border = '#d97706';
                      text = '#ffffff';
                    } else if (isTarget) {
                      bg = '#ec4899';
                      border = '#db2777';
                      text = '#ffffff';
                    }

                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="22"
                          fill={bg}
                          stroke={border}
                          strokeWidth="3"
                          style={{ filter: isActive ? 'drop-shadow(0 0 10px rgba(79, 70, 229, 0.5))' : 'none' }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fill={text}
                          fontSize="13"
                          fontWeight="900"
                        >
                          {node.label || node.val || node.id}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                {currentStep.visual.queue && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8rem', background: '#f8fafc', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontWeight: 800, color: '#475569' }}>Frontier Queue:</span>
                    <span style={{ fontWeight: 900, color: '#4f46e5' }}>{JSON.stringify(currentStep.visual.queue)}</span>
                  </div>
                )}
              </div>
            )}

            {/* 1D. REAL SVG BINARY HEAP & ARRAY BUFFER VISUALIZER */}
            {currentStep.visual?.type === 'heap' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px' }}>
                {/* SVG Binary Heap Tree */}
                <svg width="380" height="170" viewBox="0 0 380 170" style={{ overflow: 'visible', maxWidth: '100%' }}>
                  {currentStep.visual.edges?.map((edge, eIdx) => {
                    const fromNode = currentStep.visual.nodes.find(n => n.id === edge.from);
                    const toNode = currentStep.visual.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    return (
                      <line
                        key={eIdx}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke="#94a3b8"
                        strokeWidth="3"
                      />
                    );
                  })}

                  {currentStep.visual.nodes?.map((node, nIdx) => {
                    const isActive = node.active;
                    const isSwap = node.isSwap;

                    return (
                      <g key={node.id || nIdx}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="18"
                          fill={isActive ? '#3b82f6' : (isSwap ? '#ec4899' : '#ffffff')}
                          stroke={isActive ? '#1d4ed8' : (isSwap ? '#be185d' : '#64748b')}
                          strokeWidth="2.5"
                        />
                        <text
                          x={node.x}
                          y={node.y + 4}
                          textAnchor="middle"
                          fill={isActive || isSwap ? '#ffffff' : '#0f172a'}
                          fontSize="12"
                          fontWeight="900"
                        >
                          {node.val}
                        </text>
                        <text
                          x={node.x}
                          y={node.y - 22}
                          textAnchor="middle"
                          fill="#94a3b8"
                          fontSize="9"
                          fontWeight="800"
                        >
                          [{node.heapIdx ?? nIdx}]
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Underlying Heap Array Buffer */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>Underlying Heap Array:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {currentStep.visual.array?.map((val, aIdx) => {
                      const isHighlighted = currentStep.visual.highlightIdx === aIdx || currentStep.visual.swapIdx?.includes(aIdx);
                      return (
                        <div
                          key={aIdx}
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '8px',
                            background: isHighlighted ? '#e0e7ff' : '#ffffff',
                            border: isHighlighted ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            color: isHighlighted ? '#4f46e5' : '#0f172a',
                            fontSize: '0.9rem'
                          }}
                        >
                          {val}
                          <span style={{ fontSize: '0.6rem', color: '#94a3b8', marginTop: '-2px' }}>[{aIdx}]</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 1E. REAL SVG TRIE / PREFIX TREE VISUALIZER (ENHANCED & SPACIOUS) */}
            {currentStep.visual?.type === 'trie_tree' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px' }}>
                <svg width="520" height="260" viewBox="0 0 520 260" style={{ overflow: 'visible', maxWidth: '100%' }}>
                  {/* Trie Branches */}
                  {currentStep.visual.edges?.map((edge, eIdx) => {
                    const fromNode = currentStep.visual.nodes.find(n => n.id === edge.from);
                    const toNode = currentStep.visual.nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    const isTraversed = edge.active;
                    const midX = (fromNode.x + toNode.x) / 2 + (edge.labelOffset || 0);
                    const midY = (fromNode.y + toNode.y) / 2;

                    return (
                      <g key={eIdx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke={isTraversed ? '#10b981' : '#94a3b8'}
                          strokeWidth={isTraversed ? '4' : '2'}
                          strokeLinecap="round"
                        />
                        {edge.char && (
                          <g transform={`translate(${midX}, ${midY})`}>
                            <circle r="11" fill={isTraversed ? '#ecfdf5' : '#f8fafc'} stroke={isTraversed ? '#10b981' : '#cbd5e1'} strokeWidth="1.5" />
                            <text
                              y="4"
                              textAnchor="middle"
                              fill={isTraversed ? '#047857' : '#475569'}
                              fontSize="11"
                              fontWeight="900"
                            >
                              {edge.char}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Trie Nodes */}
                  {currentStep.visual.nodes?.map(node => {
                    const isActive = node.active;
                    const isEndOfWord = node.isEnd;
                    const isRoot = node.id === 'root';

                    let bg = '#ffffff';
                    let border = '#64748b';
                    let text = '#0f172a';

                    if (isActive) {
                      bg = '#10b981';
                      border = '#047857';
                      text = '#ffffff';
                    } else if (isEndOfWord) {
                      bg = '#ecfdf5';
                      border = '#10b981';
                      text = '#059669';
                    }

                    return (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={isRoot ? '20' : '19'}
                          fill={bg}
                          stroke={border}
                          strokeWidth={isEndOfWord ? '3.5' : '2.5'}
                          style={{ filter: isActive ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))' : 'none' }}
                        />
                        <text
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          fill={text}
                          fontSize={isRoot ? '15' : '13'}
                          fontWeight="900"
                        >
                          {isRoot ? 'ROOT' : (node.char || node.val)}
                        </text>
                        {isEndOfWord && (
                          <g transform={`translate(${node.x}, ${node.y - 24})`}>
                            <rect x="-24" y="-8" width="48" height="16" rx="8" fill="#10b981" />
                            <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">
                              ✓ END
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
                {currentStep.visual.word && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 800, color: '#047857', background: '#ecfdf5', padding: '6px 16px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                    <span>Active Word / Query:</span>
                    <strong style={{ color: '#065f46', fontSize: '1rem', letterSpacing: '2px' }}>"{currentStep.visual.word}"</strong>
                  </div>
                )}
              </div>
            )}

            {/* 1E-2. REAL STACK TOWER & DUAL TRACKER VISUALIZER */}
            {currentStep.visual?.type === 'stack_tower' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-end', justifyContent: 'center' }}>
                  {/* Main Stack Container */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#4f46e5' }}>
                      {currentStep.visual.title || 'Main Stack (LIFO)'}
                    </span>
                    <div
                      style={{
                        width: '120px',
                        minHeight: '180px',
                        borderLeft: '4px solid #4f46e5',
                        borderRight: '4px solid #4f46e5',
                        borderBottom: '6px solid #4f46e5',
                        borderRadius: '0 0 14px 14px',
                        background: '#f8fafc',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        padding: '8px 10px',
                        gap: '8px',
                        position: 'relative'
                      }}
                    >
                      {currentStep.visual.stack?.length === 0 ? (
                        <div style={{ margin: 'auto', fontSize: '0.78rem', color: '#94a3b8', fontWeight: 700 }}>Stack Empty</div>
                      ) : (
                        currentStep.visual.stack?.map((item, sIdx) => {
                          const isTop = sIdx === currentStep.visual.stack.length - 1;
                          return (
                            <div
                              key={sIdx}
                              style={{
                                width: '100%',
                                padding: '8px 0',
                                textAlign: 'center',
                                borderRadius: '8px',
                                background: isTop ? '#e0e7ff' : '#ffffff',
                                border: isTop ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                                color: isTop ? '#4f46e5' : '#0f172a',
                                fontWeight: 900,
                                fontSize: '1rem',
                                position: 'relative',
                                boxShadow: isTop ? '0 0 10px rgba(79, 70, 229, 0.25)' : 'none'
                              }}
                            >
                              {item}
                              {isTop && (
                                <span
                                  style={{
                                    position: 'absolute',
                                    right: '-55px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: '#4f46e5',
                                    color: '#ffffff',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    fontWeight: 900
                                  }}
                                >
                                  ◀ TOP
                                </span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Optional Min Stack Companion */}
                  {currentStep.visual.minStack && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#f59e0b' }}>
                        Min-Tracker Stack
                      </span>
                      <div
                        style={{
                          width: '110px',
                          minHeight: '180px',
                          borderLeft: '4px solid #f59e0b',
                          borderRight: '4px solid #f59e0b',
                          borderBottom: '6px solid #f59e0b',
                          borderRadius: '0 0 14px 14px',
                          background: '#fffbeb',
                          display: 'flex',
                          flexDirection: 'column-reverse',
                          padding: '8px 10px',
                          gap: '8px'
                        }}
                      >
                        {currentStep.visual.minStack?.map((item, mIdx) => {
                          const isTop = mIdx === currentStep.visual.minStack.length - 1;
                          return (
                            <div
                              key={mIdx}
                              style={{
                                width: '100%',
                                padding: '8px 0',
                                textAlign: 'center',
                                borderRadius: '8px',
                                background: isTop ? '#fef3c7' : '#ffffff',
                                border: isTop ? '2px solid #f59e0b' : '1px solid #fde68a',
                                color: '#b45309',
                                fontWeight: 900,
                                fontSize: '1rem'
                              }}
                            >
                              {item}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stack Action Badge */}
                {currentStep.visual.action && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '6px 16px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>Action:</span>
                    <strong style={{ color: currentStep.visual.action.startsWith('PUSH') ? '#2563eb' : (currentStep.visual.action.startsWith('POP') ? '#ef4444' : '#10b981'), fontSize: '0.95rem' }}>
                      {currentStep.visual.action}
                    </strong>
                  </div>
                )}
              </div>
            )}

            {/* 1E-3. REAL HISTOGRAM AREA VISUALIZER */}
            {currentStep.visual?.type === 'histogram_area' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '160px', padding: '10px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                  {currentStep.visual.heights?.map((h, hIdx) => {
                    const isPopped = currentStep.visual.poppedIdx === hIdx;
                    const inArea = currentStep.visual.areaRange && hIdx >= currentStep.visual.areaRange[0] && hIdx <= currentStep.visual.areaRange[1];

                    return (
                      <div key={hIdx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b' }}>{h}</span>
                        <div
                          style={{
                            width: '38px',
                            height: `${h * 22}px`,
                            borderRadius: '6px 6px 0 0',
                            background: inArea ? '#a7f3d0' : (isPopped ? '#fecaca' : '#e0e7ff'),
                            border: inArea ? '2px solid #10b981' : (isPopped ? '2px solid #ef4444' : '1px solid #6366f1'),
                            boxShadow: inArea ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                        />
                        <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>[{hIdx}]</span>
                      </div>
                    );
                  })}
                </div>
                {currentStep.visual.currentArea !== undefined && (
                  <div style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a', background: '#ecfdf5', padding: '6px 16px', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                    Current Rectangle Area: <strong style={{ color: '#059669', fontSize: '1.05rem' }}>{currentStep.visual.currentArea}</strong> (Max: <strong>{currentStep.visual.maxArea}</strong>)
                  </div>
                )}
              </div>
            )}

            {/* 1F. REAL DYNAMIC PROGRAMMING TABLE & RECURRENCE FORMULA VISUALIZER */}
            {currentStep.visual?.type === 'dp_table' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '18px' }}>
                {currentStep.visual.formula && (
                  <div style={{ background: '#f8fafc', padding: '8px 18px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.86rem', fontWeight: 800, color: '#334155' }}>
                    Recurrence: <code style={{ color: '#4f46e5', fontWeight: 900 }}>{currentStep.visual.formula}</code>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.visual.dp?.map((val, dIdx) => {
                    const isActive = currentStep.visual.activeIdx === dIdx;
                    const isRef = currentStep.visual.refIndices?.includes(dIdx);
                    const isDone = currentStep.visual.done;

                    return (
                      <div
                        key={dIdx}
                        style={{
                          width: '54px',
                          height: '58px',
                          borderRadius: '10px',
                          background: isActive ? '#eef2ff' : (isRef ? '#fef3c7' : (isDone ? '#ecfdf5' : '#ffffff')),
                          border: isActive ? '2px solid #4f46e5' : (isRef ? '2px solid #f59e0b' : '1px solid #cbd5e1'),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          color: isActive ? '#4f46e5' : (isRef ? '#b45309' : (isDone ? '#059669' : '#0f172a')),
                          fontSize: '1.1rem',
                          boxShadow: isActive ? '0 0 12px rgba(79, 70, 229, 0.3)' : 'none',
                          transform: isActive ? 'scale(1.06)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {val === Infinity ? '∞' : val}
                        <span style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '-2px' }}>
                          dp[{currentStep.visual.labels ? currentStep.visual.labels[dIdx] : dIdx}]
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1G. REAL QUEUE BUFFER & MONOTONIC DEQUE VISUALIZER */}
            {currentStep.visual?.type === 'queue_buffer' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ef4444', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px' }}>
                    OUT (Front)
                  </div>
                  <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '12px', borderRadius: '12px', border: '2px dashed #94a3b8', minWidth: '220px', justifyContent: 'center' }}>
                    {currentStep.visual.queue?.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>Queue Empty</span>
                    ) : (
                      currentStep.visual.queue?.map((item, qIdx) => {
                        const isHead = qIdx === 0;
                        const isTail = qIdx === currentStep.visual.queue.length - 1;
                        return (
                          <div
                            key={qIdx}
                            style={{
                              width: '46px',
                              height: '46px',
                              borderRadius: '8px',
                              background: isHead ? '#e0e7ff' : '#ffffff',
                              border: isHead ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              color: isHead ? '#4f46e5' : '#0f172a',
                              position: 'relative'
                            }}
                          >
                            {item}
                            {isHead && <span style={{ position: 'absolute', top: '-18px', fontSize: '0.62rem', fontWeight: 900, color: '#4f46e5' }}>HEAD</span>}
                            {isTail && currentStep.visual.queue.length > 1 && <span style={{ position: 'absolute', bottom: '-18px', fontSize: '0.62rem', fontWeight: 900, color: '#10b981' }}>TAIL</span>}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '6px 10px', borderRadius: '6px' }}>
                    IN (Rear)
                  </div>
                </div>
                {currentStep.visual.window && (
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', background: '#f8fafc', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    Sliding Window: [{currentStep.visual.window.join(', ')}] ➔ Max = <strong style={{ color: '#4f46e5' }}>{currentStep.visual.maxVal}</strong>
                  </div>
                )}
              </div>
            )}

            {/* 1H. REAL BINARY SEARCH INTERVAL SLICE VISUALIZER */}
            {currentStep.visual?.type === 'binary_search_range' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.visual.nums?.map((n, idx) => {
                    const isLow = currentStep.visual.low === idx;
                    const isHigh = currentStep.visual.high === idx;
                    const isMid = currentStep.visual.mid === idx;
                    const inRange = idx >= currentStep.visual.low && idx <= currentStep.visual.high;
                    const isTargetFound = currentStep.visual.done && isMid;

                    return (
                      <div
                        key={idx}
                        style={{
                          width: '54px',
                          height: '56px',
                          borderRadius: '10px',
                          background: isTargetFound ? '#ecfdf5' : (isMid ? '#eef2ff' : (inRange ? '#ffffff' : '#f1f5f9')),
                          color: isTargetFound ? '#059669' : (isMid ? '#4f46e5' : (inRange ? '#0f172a' : '#94a3b8')),
                          border: isTargetFound ? '2px solid #10b981' : (isMid ? '2px solid #4f46e5' : (inRange ? '1px solid #cbd5e1' : '1px dashed #cbd5e1')),
                          opacity: inRange ? 1 : 0.45,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          position: 'relative',
                          boxShadow: isMid ? '0 0 14px rgba(79, 70, 229, 0.35)' : 'none',
                          transform: isMid ? 'scale(1.08)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {n}
                        {isLow && <span style={{ position: 'absolute', top: '-20px', fontSize: '0.65rem', fontWeight: 900, color: '#2563eb' }}>L▲</span>}
                        {isHigh && <span style={{ position: 'absolute', top: '-20px', fontSize: '0.65rem', fontWeight: 900, color: '#ec4899' }}>H▲</span>}
                        {isMid && <span style={{ position: 'absolute', bottom: '-20px', fontSize: '0.68rem', fontWeight: 900, color: '#4f46e5' }}>MID▼</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '16px', background: '#f8fafc', padding: '6px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                  <div><strong>Low:</strong> <span style={{ color: '#2563eb' }}>{currentStep.visual.low}</span></div>
                  <div><strong>Mid:</strong> <span style={{ color: '#4f46e5' }}>{currentStep.visual.mid} (val: {currentStep.visual.nums[currentStep.visual.mid]})</span></div>
                  <div><strong>High:</strong> <span style={{ color: '#ec4899' }}>{currentStep.visual.high}</span></div>
                  <div><strong>Target:</strong> <span style={{ color: '#10b981', fontWeight: 900 }}>{currentStep.visual.target}</span></div>
                </div>
              </div>
            )}

            {/* 2. UNIVERSAL 1D ARRAY & MULTI-POINTER VISUALIZER */}
            {currentStep.visual?.type === 'array_pointers' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.visual.nums?.map((n, idx) => {
                    const ptrs = currentStep.visual.ptrs || {};
                    const matched = Object.entries(ptrs).filter(([_, v]) => v === idx);
                    const isFocus = matched.length > 0;
                    const isDone = currentStep.visual.done;

                    return (
                      <div
                        key={idx}
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '10px',
                          background: isDone ? '#ecfdf5' : (isFocus ? '#eef2ff' : '#ffffff'),
                          color: isDone ? '#059669' : (isFocus ? '#4f46e5' : '#0f172a'),
                          border: isDone ? '2px solid #10b981' : (isFocus ? '2px solid #4f46e5' : '1px solid #cbd5e1'),
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1.15rem',
                          position: 'relative',
                          boxShadow: isFocus ? '0 0 14px rgba(79, 70, 229, 0.3)' : 'none',
                          transform: isFocus ? 'scale(1.05)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {n}
                        {matched.map(([k]) => (
                          <span
                            key={k}
                            style={{
                              position: 'absolute',
                              bottom: '-20px',
                              fontSize: '0.65rem',
                              color: k === 'i' || k === 'l' ? '#4f46e5' : (k === 'r' || k === 'right' ? '#ec4899' : '#10b981'),
                              fontWeight: 900
                            }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>
                    );
                  })}
                </div>

                {currentStep.visual.secondNums && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 700 }}>nums2 Buffer:</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {currentStep.visual.secondNums.map((v, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '8px',
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800
                          }}
                        >
                          {v}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. UNIVERSAL 2D MATRIX & GRID VISUALIZER */}
            {currentStep.visual?.type === 'matrix_grid' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  {currentStep.visual.grid.map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'flex', gap: '8px' }}>
                      {row.map((cell, cIdx) => {
                        const cellFlatIdx = rIdx * row.length + cIdx;
                        const isActive = currentStep.visual.active?.includes(cellFlatIdx);

                        return (
                          <div
                            key={cIdx}
                            style={{
                              width: '50px',
                              height: '50px',
                              borderRadius: '8px',
                              background: isActive ? '#ecfdf5' : '#f8fafc',
                              color: isActive ? '#059669' : '#0f172a',
                              border: isActive ? '2px solid #10b981' : '1px solid #cbd5e1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 900,
                              fontSize: '1.1rem',
                              boxShadow: isActive ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {cell}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TRAPPING RAIN WATER ELEVATION VISUALIZER */}
            {currentStep.visual?.type === 'rainwater' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '220px', padding: '0 20px' }}>
                  {currentStep.visual.height.map((h, idx) => {
                    const isLeft = currentStep.visual.left === idx;
                    const isRight = currentStep.visual.right === idx;
                    const waterH = currentStep.visual.waterAt[idx] || 0;

                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38px', position: 'relative' }}>
                        {isLeft && <span style={{ position: 'absolute', top: '-24px', fontSize: '0.72rem', color: '#4f46e5', fontWeight: 900 }}>L▼</span>}
                        {isRight && <span style={{ position: 'absolute', top: '-24px', fontSize: '0.72rem', color: '#ec4899', fontWeight: 900 }}>R▼</span>}

                        {waterH > 0 && (
                          <div
                            style={{
                              width: '100%',
                              height: `${waterH * 40}px`,
                              background: 'rgba(56, 189, 248, 0.7)',
                              border: '1px dashed #0284c7',
                              borderRadius: '4px 4px 0 0'
                            }}
                          />
                        )}

                        <div
                          style={{
                            width: '100%',
                            height: `${h * 40}px`,
                            background: '#1e293b',
                            borderRadius: '4px 4px 0 0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.78rem'
                          }}
                        >
                          {h > 0 ? h : ''}
                        </div>
                        <span style={{ fontSize: '0.62rem', color: '#94a3b8', marginTop: '4px' }}>[{idx}]</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '20px', background: '#ffffff', padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div><strong>leftMax:</strong> <span style={{ color: '#4f46e5' }}>{currentStep.visual.leftMax}</span></div>
                  <div><strong>rightMax:</strong> <span style={{ color: '#ec4899' }}>{currentStep.visual.rightMax}</span></div>
                  <div><strong>Total Water Trapped:</strong> <span style={{ color: '#0284c7', fontWeight: 900 }}>{currentStep.visual.trapped} Units</span></div>
                </div>
              </div>
            )}

            {/* 5. COIN CHANGE DP ARRAY VISUALIZER */}
            {currentStep.visual?.type === 'coin_dp' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748b' }}>Available Coins:</span>
                  {currentStep.visual.coins.map(c => (
                    <span key={c} style={{ padding: '4px 10px', background: '#eef2ff', color: '#4f46e5', borderRadius: '6px', fontWeight: 800 }}>
                      ${c}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '100%', padding: '10px 0' }}>
                  {currentStep.visual.dp.map((val, idx) => {
                    const isCurr = currentStep.visual.currentI === idx;
                    return (
                      <div
                        key={idx}
                        style={{
                          width: '46px',
                          height: '54px',
                          borderRadius: '8px',
                          background: isCurr ? '#ecfdf5' : '#ffffff',
                          border: isCurr ? '2px solid #10b981' : '1px solid #cbd5e1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '1rem',
                          color: val === Infinity ? '#94a3b8' : (isCurr ? '#059669' : '#0f172a')
                        }}
                      >
                        {val === Infinity ? '∞' : val}
                        <span style={{ fontSize: '0.6rem', color: '#64748b', opacity: 0.8 }}>${idx}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. LRU CACHE VISUALIZER */}
            {currentStep.visual?.type === 'lru' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', alignItems: 'center' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b' }}>
                  DOUBLY LINKED LIST: Head (Most Recent) ⇄ Tail (Least Recent)
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {currentStep.visual.list.map((item, idx) => (
                    <div
                      key={item.k}
                      style={{
                        padding: '12px 18px',
                        background: idx === 0 ? '#ecfdf5' : '#ffffff',
                        border: idx === 0 ? '2px solid #10b981' : '1px solid #cbd5e1',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: idx === 0 ? '0 0 16px rgba(16, 185, 129, 0.4)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>Key {item.k}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>{item.v}</div>
                      <div style={{ fontSize: '0.68rem', color: '#4f46e5', marginTop: '2px' }}>{idx === 0 ? 'MRU Head' : (idx === currentStep.visual.list.length - 1 ? 'LRU Tail' : 'Node')}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: SYNCHRONIZED CODE INSPECTOR */}
          <div style={{ background: '#0f172a', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', color: '#ffffff' }}>
            
            {/* LANGUAGE SELECTOR & COPY */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Java', 'Python', 'JavaScript'].map(lang => (
                  <button
                    key={lang}
                    onClick={() => setCodeLanguage(lang)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.74rem',
                      fontWeight: codeLanguage === lang ? 800 : 500,
                      background: codeLanguage === lang ? '#4f46e5' : 'transparent',
                      color: codeLanguage === lang ? '#ffffff' : '#94a3b8',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>Line {currentStep.line} Active</span>
            </div>

            {/* SYNCHRONIZED CODE VIEWER */}
            <div style={{ fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.8rem', lineHeight: 1.7, overflowX: 'auto', flex: 1 }}>
              {getActiveCodeString().split('\n').map((codeLine, idx) => {
                const isLineActive = currentStep.line === idx + 1;
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isLineActive ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                      color: isLineActive ? '#38bdf8' : '#cbd5e1',
                      borderLeft: isLineActive ? '3px solid #38bdf8' : '3px solid transparent',
                      fontWeight: isLineActive ? 800 : 400
                    }}
                  >
                    <span style={{ color: '#64748b', marginRight: '10px', userSelect: 'none' }}>{idx + 1}</span>
                    {codeLine}
                  </div>
                );
              })}
            </div>

            {/* LIVE VARIABLES WATCHER BOX */}
            <div style={{ background: '#1e293b', borderRadius: '10px', padding: '12px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>
                🔍 Live Variable Watcher
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {Object.entries(currentStep.vars || {}).map(([k, v]) => (
                  <div key={k} style={{ fontSize: '0.74rem', color: '#cbd5e1' }}>
                    <strong style={{ color: '#38bdf8' }}>{k}:</strong> {String(v)}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

window.AlgorithmVisualizerView = AlgorithmVisualizerView;
