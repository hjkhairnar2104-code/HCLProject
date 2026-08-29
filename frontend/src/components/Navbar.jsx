import React from 'react';
import { Compass, Cpu, GitBranch, BarChart3, BookOpen, Sparkles, RefreshCw } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenAssistant, onOpenCatalog, isReplanning }) {
  const tabs = [
    { id: 'onboarding', label: '1. Goal & Profile', icon: Compass },
    { id: 'skillgap', label: '2. Skill Radar', icon: BarChart3 },
    { id: 'roadmap', label: '3. Learning DAG', icon: GitBranch },
    { id: 'dashboard', label: '4. Progress Dashboard', icon: Cpu },
  ];

  return (
    <header style={{
      sticky: 'top',
      top: 0,
      zIndex: 40,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('onboarding')}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <GitBranch size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(90deg, #ffffff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1 }}>
            PathCraft <span style={{ color: '#10b981', WebkitTextFillColor: '#10b981' }}>AI</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.04em' }}>
            EXPLAINABLE DAG LEARNING ENGINE
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(18, 26, 44, 0.6)', padding: '4px 6px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)' : 'transparent',
                color: isActive ? '#f3f4f6' : '#9ca3af',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: isActive ? '2px solid #6366f1' : '2px solid transparent'
              }}
            >
              <Icon size={16} color={isActive ? '#6366f1' : '#9ca3af'} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right Action Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={onOpenCatalog}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#d1d5db',
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <BookOpen size={15} />
          Catalog
        </button>

        <button
          onClick={onOpenAssistant}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            border: 'none',
            color: 'white',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 0 14px rgba(139, 92, 246, 0.3)'
          }}
        >
          {isReplanning ? (
            <>
              <RefreshCw size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Adapting Path...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              AI Assistant & Replan
            </>
          )}
        </button>
      </div>
    </header>
  );
}
