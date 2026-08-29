import React, { useState, useEffect } from 'react';
import { BookOpen, X, ExternalLink, Star, Award, Search, Tag } from 'lucide-react';

const API_BASE = 'http://localhost:8085';

export default function CatalogModal({ isOpen, onClose }) {
  const [skills, setSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE}/api/catalog/skills`)
        .then(r => r.json())
        .then(data => setSkills(data))
        .catch(() => {});

      fetch(`${API_BASE}/api/catalog/resources`)
        .then(r => r.json())
        .then(data => setResources(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredResources = resources.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '24px'
    }}>
      <div style={{
        width: '900px',
        maxHeight: '85vh',
        background: '#0d1322',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={22} color="#10b981" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>PathCraft Skill Graph & Course Catalog</h3>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Curated learning resources across Data Science, AI/ML, Full-Stack & DevOps</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.2rem', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 28px', background: 'rgba(18, 26, 44, 0.5)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Search size={16} color="#9ca3af" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog by title, provider (Coursera, Kaggle, Udemy...), or resource type..."
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#ffffff', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Resource List Grid */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {filteredResources.map(r => (
            <div key={r.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className="badge-tag badge-cyan">{r.type}</span>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                    <Star size={13} fill="#f59e0b" /> {r.rating || 4.8}
                  </span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{r.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>{r.provider} · {r.durationHours} Hours · {r.format}</p>
                <p style={{ fontSize: '0.82rem', color: '#d1d5db', marginTop: '8px', lineHeight: 1.3 }}>{r.description}</p>
              </div>

              <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge-tag badge-emerald">{r.costType}</span>
                {r.url && r.url !== '#' && (
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.8rem', color: '#6366f1', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Resource <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
