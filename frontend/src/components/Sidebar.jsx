// LearnPath AI — Modern Fixed Left Sidebar Component (Clean Light SaaS)
function Sidebar({ activeTab, setActiveTab, user, setUser, streakDays = 14, setShowAuthModal, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const NAV_ITEMS = [
    {
      id: 'home',
      label: 'Overview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      id: 'mypath',
      label: 'My Learning Path',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" x2="9" y1="3" y2="18" />
          <line x1="15" x2="15" y1="6" y2="21" />
        </svg>
      ),
      badge: 'Active'
    },
    {
      id: 'quiz',
      label: 'Assessments',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      )
    },

    {
      id: 'practice',
      label: 'Projects & Practice',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 7h20v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'visualizer',
      label: 'Algo Visualizer',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 16 4-4-4-4" />
          <path d="m6 8-4 4 4 4" />
          <path d="m14.5 4-5 16" />
        </svg>
      ),
      badge: 'Visual'
    },
    {
      id: 'chatbot',
      label: 'AI Tutor',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8" />
          <rect width="16" height="12" x="4" y="8" rx="2" />
          <path d="M2 14h2" />
          <path d="M20 14h2" />
          <path d="M15 13v2" />
          <path d="M9 13v2" />
        </svg>
      ),
      badge: 'AI'
    },
    {
      id: 'interview',
      label: 'Live Voice Interview',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      ),
      badge: 'Voice'
    },
    {
      id: 'resume-gap',
      label: 'Resume Gap AI',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      ),
      badge: 'Roadmap'
    },
    {
      id: 'resume',
      label: 'Resume Builder',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      )
    },
    {
      id: 'jobs',
      label: 'Find Jobs (Adzuna)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      badge: 'Adzuna'
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  return (
    <aside
      className={`no-print app-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}
      style={{
        width: '260px',
        background: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        flexShrink: 0
      }}
    >
      {/* 1. BRAND HEADER */}
      <div
        style={{
          padding: '20px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <div
          onClick={() => {
            setActiveTab('home');
            if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              flexShrink: 0,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
              <circle cx="12" cy="12" r="2" fill="#38bdf8" stroke="none" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 style={{ fontSize: '1.12rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
                LearnPath
              </h1>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', color: '#ffffff', letterSpacing: '0.04em', boxShadow: '0 2px 6px rgba(79,70,229,0.3)' }}>
                AI
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, margin: '2px 0 0 0', letterSpacing: '-0.01em' }}>
              Engineering Ecosystem
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          className="mobile-sidebar-close-btn"
          onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
          style={{
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '6px',
            width: '32px',
            height: '32px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#475569',
            fontWeight: 800,
            fontSize: '0.9rem'
          }}
          aria-label="Close Navigation"
        >
          ✕
        </button>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <nav
        style={{
          flex: 1,
          padding: '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          overflowY: 'auto'
        }}
      >
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 12px 4px' }}>
          Main Menu
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id ||
            (item.id === 'practice' && (activeTab === 'practice' || activeTab === 'dsa')) ||
            (item.id === 'courses' && activeTab === 'courses') ||
            (item.id === 'skills' && activeTab === 'skills');

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'profile' && !user) {
                  if (setShowAuthModal) setShowAuthModal(true);
                  setActiveTab('profile');
                } else {
                  setActiveTab(item.id);
                }
                if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#eef2ff' : 'transparent',
                color: isActive ? '#4f46e5' : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid #4f46e5' : '3px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.color = '#0f172a';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#475569';
                }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: isActive ? '#4f46e5' : '#64748b', display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    background: item.badge === 'Active' ? '#ecfdf5' : '#f5f3ff',
                    color: item.badge === 'Active' ? '#059669' : '#7c3aed',
                    border: item.badge === 'Active' ? '1px solid #a7f3d0' : '1px solid #ddd6fe'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

window.Sidebar = Sidebar;
