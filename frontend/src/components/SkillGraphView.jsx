// LearnPath AI — Interactive RPG-Style Skill Tree Graph Studio
function SkillGraphView({ setActiveTab }) {
  const SKILL_NODES = [
    // DSA Tier
    { id: 'dsa_1', title: 'Array & Two Pointers', domain: 'DSA', level: 1, x: 100, y: 80, unlocked: true, mastered: true, prereq: null, summary: 'Master O(N) two-pointer shrinking bounds for sorted array partitions.' },
    { id: 'dsa_2', title: 'Sliding Window', domain: 'DSA', level: 2, x: 280, y: 80, unlocked: true, mastered: true, prereq: 'dsa_1', summary: 'Dynamic and fixed window state preservation for subarray optimization.' },
    { id: 'dsa_3', title: 'Trie Prefix Trees', domain: 'DSA', level: 3, x: 460, y: 80, unlocked: true, mastered: false, prereq: 'dsa_2', summary: 'O(L) exact and prefix character branch storage for autocomplete.' },
    { id: 'dsa_4', title: 'Segment Trees', domain: 'DSA', level: 4, x: 640, y: 80, unlocked: false, mastered: false, prereq: 'dsa_3', summary: 'O(log N) range queries and point updates with lazy propagation.' },

    // System Design Tier
    { id: 'sys_1', title: 'Load Balancing & Proxies', domain: 'System Design', level: 1, x: 100, y: 200, unlocked: true, mastered: true, prereq: null, summary: 'Layer 4 vs Layer 7 load balancing with NGINX and round-robin / least-connection.' },
    { id: 'sys_2', title: 'Redis Distributed Cache', domain: 'System Design', level: 2, x: 280, y: 200, unlocked: true, mastered: true, prereq: 'sys_1', summary: 'Cache-Aside, Write-Through, Write-Back, and cache stampede prevention.' },
    { id: 'sys_3', title: 'Kafka Event Streaming', domain: 'System Design', level: 3, x: 460, y: 200, unlocked: true, mastered: false, prereq: 'sys_2', summary: 'Partition offsets, consumer group rebalancing, and exactly-once semantics.' },
    { id: 'sys_4', title: 'Consistent Hashing', domain: 'System Design', level: 4, x: 640, y: 200, unlocked: false, mastered: false, prereq: 'sys_3', summary: 'Virtual nodes on a hash ring to minimize key migration during node add/remove.' },

    // GenAI Tier
    { id: 'ai_1', title: 'Vector Embeddings', domain: 'Generative AI', level: 1, x: 100, y: 320, unlocked: true, mastered: true, prereq: null, summary: 'Dense semantic representations via high-dimensional cosine similarity.' },
    { id: 'ai_2', title: 'Hybrid RAG Retrieval', domain: 'Generative AI', level: 2, x: 280, y: 320, unlocked: true, mastered: false, prereq: 'ai_1', summary: 'Combining BM25 keyword matching with HNSW vector indexing via RRF.' },
    { id: 'ai_3', title: 'Cross-Encoder Rerankers', domain: 'Generative AI', level: 3, x: 460, y: 320, unlocked: false, mastered: false, prereq: 'ai_2', summary: 'Deep joint self-attention across (query, doc) pairs for maximum precision.' },
    { id: 'ai_4', title: 'LoRA / Fine-Tuning', domain: 'Generative AI', level: 4, x: 640, y: 320, unlocked: false, mastered: false, prereq: 'ai_3', summary: 'Low-Rank Adaptation decomposing weight updates into rank-r matrices.' }
  ];

  const [selectedNode, setSelectedNode] = React.useState(null);
  const [filterDomain, setFilterDomain] = React.useState('all');

  const filteredNodes = SKILL_NODES.filter(n => filterDomain === 'all' || n.domain === filterDomain);

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER BANNER */}
      <div
        className="saas-card"
        style={{
          padding: '24px 32px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ padding: '4px 10px', background: '#eef2ff', color: '#4f46e5', fontSize: '0.74rem', fontWeight: 700, borderRadius: '6px', border: '1px solid #c7d2fe' }}>
              GAMIFIED MASTERY TREE
            </span>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '6px 0 2px 0' }}>
              Interactive RPG Skill Tree Graph
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
              Visualize prerequisite progression, unlock tier masteries, and inspect deep technical flashcards.
            </p>
          </div>

          {/* FILTER PILLS */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '12px', gap: '4px' }}>
            {['all', 'DSA', 'System Design', 'Generative AI'].map(d => (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: filterDomain === d ? 700 : 500,
                  background: filterDomain === d ? '#ffffff' : 'transparent',
                  color: filterDomain === d ? '#4f46e5' : '#64748b',
                  border: 'none',
                  boxShadow: filterDomain === d ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer'
                }}
              >
                {d === 'all' ? 'All Domains' : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* INTERACTIVE SKILL TREE SVG CANVAS */}
      <div
        className="saas-card"
        style={{
          padding: 0,
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          background: '#0f172a',
          position: 'relative',
          height: '460px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 760 420">
          {/* PREREQUISITE CONNECTING LINES */}
          {SKILL_NODES.map(node => {
            if (!node.prereq) return null;
            const parent = SKILL_NODES.find(p => p.id === node.prereq);
            if (!parent) return null;

            return (
              <line
                key={`${parent.id}-${node.id}`}
                x1={parent.x}
                y1={parent.y}
                x2={node.x}
                y2={node.y}
                stroke={node.unlocked ? '#4f46e5' : '#334155'}
                strokeWidth="2.5"
                strokeDasharray={node.unlocked ? 'none' : '4 4'}
              />
            );
          })}

          {/* SKILL NODES */}
          {filteredNodes.map(node => {
            const isMastered = node.mastered;
            const isUnlocked = node.unlocked;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                {/* Node Outer Glow */}
                {isMastered && (
                  <circle cx={node.x} cy={node.y} r="32" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
                )}
                {isSelected && (
                  <circle cx={node.x} cy={node.y} r="36" fill="none" stroke="#ec4899" strokeWidth="2.5" />
                )}

                {/* Main Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill={isMastered ? '#10b981' : (isUnlocked ? '#4f46e5' : '#1e293b')}
                  stroke={isMastered ? '#059669' : (isUnlocked ? '#6366f1' : '#334155')}
                  strokeWidth="3"
                />

                {/* Node Icon */}
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontSize="13" fill="#ffffff" fontWeight="800">
                  {isMastered ? '✓' : (isUnlocked ? `L${node.level}` : '🔒')}
                </text>

                {/* Node Title Label */}
                <text
                  x={node.x}
                  y={node.y + 44}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="700"
                  fill={isUnlocked ? '#ffffff' : '#64748b'}
                >
                  {node.title}
                </text>
              </g>
            );
          })}
        </svg>

        {/* BOTTOM STATUS LEGEND */}
        <div style={{ position: 'absolute', bottom: '16px', left: '20px', display: 'flex', gap: '16px', fontSize: '0.76rem', color: '#94a3b8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} /> Mastered
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#4f46e5' }} /> Unlocked (In Progress)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#334155' }} /> Locked (Prereq Required)
          </div>
        </div>
      </div>

      {/* SELECTED NODE DETAILS DRAWER */}
      {selectedNode && (
        <div
          className="saas-card"
          style={{
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <span className="badge badge-primary">{selectedNode.domain}</span>
              <span style={{ fontSize: '0.74rem', fontWeight: 700, color: selectedNode.mastered ? '#059669' : '#4f46e5' }}>
                Level {selectedNode.level} • {selectedNode.mastered ? 'Mastered 🏆' : (selectedNode.unlocked ? 'Unlocked 🔓' : 'Locked 🔒')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              {selectedNode.title}
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', maxWidth: '600px', marginTop: '6px', marginBottom: 0 }}>
              {selectedNode.summary}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab && setActiveTab('dsa')}
              className="btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '10px' }}
            >
              🚀 Launch Module Lessons
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="btn-secondary"
              style={{ padding: '10px 16px', fontSize: '0.85rem', borderRadius: '10px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

window.SkillGraphView = SkillGraphView;
