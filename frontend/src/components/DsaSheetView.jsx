// LearnPath AI - 450+ Curated DSA Problem Sheet & Pattern Practice (Clean Light SaaS)
function DsaSheetView({
  solvedProblemIds = new Set(),
  handleSolveProblem,
  user,
  setShowAuthModal
}) {
  const topics = window.DSA_AND_SQL_TOPICS || [];
  const [statusFilter, setStatusFilter] = React.useState('All'); // 'All' | 'Unsolved' | 'Solved'
  const [localSearch, setLocalSearch] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [difficultyFilter, setDifficultyFilter] = React.useState('All');
  const [localExpanded, setLocalExpanded] = React.useState({ sec_basics: true, sec_arrays: true, sec_trees: true });
  const [visibleCountMap, setVisibleCountMap] = React.useState({});

  const totalPlatformProblems = 455;
  const totalSolvedCount = solvedProblemIds.size;
  const overallProgressPct = Math.min(100, Math.round((totalSolvedCount / totalPlatformProblems) * 100));

  const filteredTopics = topics.filter(t => {
    if (activeCategory === 'DSA') return t.category === 'DSA';
    if (activeCategory === 'SQL') return t.category === 'SQL';
    if (activeCategory === 'SYSTEM_DESIGN') return t.category === 'SYSTEM_DESIGN';
    return true;
  });

  // Compute actual solved counts by difficulty
  let easySolved = 0, mediumSolved = 0, hardSolved = 0;
  let totalEasy = 0, totalMedium = 0, totalHard = 0;

  topics.forEach(t => {
    (t.problems || []).forEach(p => {
      const d = (p.difficulty || 'Easy').toLowerCase();
      if (d === 'easy') {
        totalEasy++;
        if (solvedProblemIds.has(p.id)) easySolved++;
      } else if (d === 'medium') {
        totalMedium++;
        if (solvedProblemIds.has(p.id)) mediumSolved++;
      } else if (d === 'hard') {
        totalHard++;
        if (solvedProblemIds.has(p.id)) hardSolved++;
      }
    });
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px', alignItems: 'start' }}>

      {/* LEFT: PROBLEM SHEET TABLE */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* HEADER */}
        <div>
          <span className="badge badge-primary">CURATED DSA & CODING PATTERNS</span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
            450+ Curated Problems & Algorithms
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.86rem', marginTop: '2px' }}>
            Complete step-by-step curriculum from Basics to Advanced Dynamic Programming, Trees, Graphs, SQL 50, and System Design.
          </p>
        </div>

        {/* PROGRESS BANNER */}
        <div className="saas-card" style={{ padding: '20px 24px', borderLeft: '4px solid #10b981' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>DSA Sheet Progress</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {totalSolvedCount} / {totalPlatformProblems} Solved <span style={{ color: '#059669', fontSize: '1rem' }}>({overallProgressPct}%)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ textAlign: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>● Easy</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{easySolved} / {totalEasy || 150}</div>
              </div>
              <div style={{ textAlign: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 700 }}>● Medium</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{mediumSolved} / {totalMedium || 220}</div>
              </div>
              <div style={{ textAlign: 'center', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>● Hard</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{hardSolved} / {totalHard || 85}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTROLS & FILTERS ROW */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          
          {/* CATEGORY FILTERS */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All 450+ Problems' },
              { id: 'DSA', label: '🧠 DSA Patterns' },
              { id: 'SQL', label: '🗄️ SQL 50' },
              { id: 'SYSTEM_DESIGN', label: '🏗️ System Design' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid',
                  background: activeCategory === c.id ? '#4f46e5' : '#ffffff',
                  borderColor: activeCategory === c.id ? '#4f46e5' : '#e2e8f0',
                  color: activeCategory === c.id ? '#ffffff' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* SEARCH INPUT */}
          <input
            type="text"
            placeholder="Search problems by name or pattern..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="saas-input"
            style={{ width: '220px', padding: '6px 10px', fontSize: '0.78rem' }}
          />
        </div>

        {/* TOPICS ACCORDION */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredTopics.map(topic => {
            const isExpanded = localExpanded[topic.id] !== false;
            const topicSolvedCount = topic.problems.filter(p => solvedProblemIds.has(p.id)).length;
            const topicPct = Math.round((topicSolvedCount / topic.problems.length) * 100);

            const displayProblems = topic.problems.filter(p => {
              const problemTitle = p.name || p.title || '';
              if (localSearch && !problemTitle.toLowerCase().includes(localSearch.toLowerCase())) return false;
              if (difficultyFilter !== 'All' && p.difficulty !== difficultyFilter) return false;
              if (statusFilter === 'Solved' && !solvedProblemIds.has(p.id)) return false;
              if (statusFilter === 'Unsolved' && solvedProblemIds.has(p.id)) return false;
              return true;
            });

            return (
              <div key={topic.id} className="saas-card" style={{ overflow: 'hidden' }}>
                
                {/* SECTION HEADER */}
                <div
                  onClick={() => setLocalExpanded({ ...localExpanded, [topic.id]: !isExpanded })}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: '#f8fafc',
                    borderBottom: isExpanded ? '1px solid #e2e8f0' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#4f46e5', fontWeight: 800, fontSize: '0.85rem' }}>
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <div>
                      <h3 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a' }}>
                        {topic.title}
                      </h3>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        {topic.desc || `${topic.problems.length} Curated Problems`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {topicSolvedCount} / {topic.problems.length} ({topicPct}%)
                    </span>
                  </div>
                </div>

                {/* PROBLEMS LIST */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {displayProblems.map((prob, pIdx) => {
                      const isSolved = solvedProblemIds.has(prob.id);
                      const probName = prob.name || prob.title || `Problem #${prob.id}`;
                      const probUrl = prob.link || prob.url || prob.leetcodeUrl || 'https://leetcode.com/problemset/';
                      const probPlatform = prob.platform || (probUrl.includes('leetcode') ? 'LeetCode' : 'GFG');
                      const probCompany = prob.company ? ` · 🏢 ${prob.company}` : '';

                      return (
                        <div
                          key={prob.id || pIdx}
                          style={{
                            padding: '12px 18px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid #f1f5f9',
                            background: isSolved ? '#f0fdf4' : '#ffffff',
                            transition: 'background 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, marginRight: '12px' }}>
                            <input
                              type="checkbox"
                              checked={isSolved}
                              onChange={() => {
                                if (!user || !user.email || user.isGuest) {
                                  if (setShowAuthModal) setShowAuthModal(true);
                                  return;
                                }
                                if (handleSolveProblem) handleSolveProblem(prob.id);
                              }}
                              style={{ width: '17px', height: '17px', accentColor: '#10b981', cursor: 'pointer', flexShrink: 0 }}
                            />
                            <div>
                              <a
                                href={probUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  fontSize: '0.86rem',
                                  fontWeight: 700,
                                  color: isSolved ? '#065f46' : '#0f172a',
                                  textDecoration: 'none'
                                }}
                              >
                                {probName} ↗
                              </a>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                                <span>{probPlatform}</span>
                                {probCompany && <span style={{ color: '#4f46e5' }}>{probCompany}</span>}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <span
                              className={
                                prob.difficulty === 'Easy' ? 'badge badge-success' :
                                (prob.difficulty === 'Medium' ? 'badge badge-warning' : 'badge badge-danger')
                              }
                              style={{ fontSize: '0.7rem' }}
                            >
                              {prob.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT: PROBLEM SOLVING PATTERNS & STATS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '90px' }}>
        
        {/* PATTERNS BREAKDOWN */}
        <div className="saas-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            🧠 High-Yield Coding Patterns
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginBottom: '14px' }}>
            Mastering these core templates solves 80% of software engineering coding interview rounds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { pattern: 'Sliding Window & Two Pointers', total: 45, filterKey: 'window' },
              { pattern: 'Fast & Slow Pointers (Cycle Detection)', total: 18, filterKey: 'cycle' },
              { pattern: 'Monotonic Stack / Queue', total: 24, filterKey: 'stack' },
              { pattern: 'Topological Sort & Kahn’s Algo', total: 22, filterKey: 'graph' },
              { pattern: '0/1 Knapsack & DP Memoization', total: 40, filterKey: 'dp' },
              { pattern: 'Trie & Prefix Trees', total: 16, filterKey: 'trie' }
            ].map((p, idx) => {
              // Count solved matching problems
              let pSolved = 0;
              topics.forEach(t => {
                const tName = (t.title || '').toLowerCase();
                (t.problems || []).forEach(prob => {
                  const pName = (prob.name || '').toLowerCase();
                  if ((tName.includes(p.filterKey) || pName.includes(p.filterKey)) && solvedProblemIds.has(prob.id)) {
                    pSolved++;
                  }
                });
              });
              const pPct = p.total > 0 ? Math.round((pSolved / p.total) * 100) : 0;

              return (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.pattern}</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{pSolved} / {p.total} Problems</div>
                  </div>
                  <span className={pSolved > 0 ? "badge badge-success" : "badge badge-primary"} style={{ fontSize: '0.68rem' }}>
                    {pPct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

window.DsaSheetView = DsaSheetView;
