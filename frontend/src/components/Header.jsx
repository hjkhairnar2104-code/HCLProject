// LearnPath AI — Clean Top Header Component (Modern Light SaaS)
function Header({
  activeTab,
  setActiveTab,
  user,
  setUser,
  setShowAuthModal,
  targetRole = 'GenAI Engineer',
  toggleSidebar,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  // Accurate Time-of-Day Greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  };

  // Strictly check if user is genuinely logged in
  const isLoggedIn = Boolean(user && user.email && user.fullName);
  const userFirstName = isLoggedIn ? user.fullName.split(' ')[0] : '';
  const userInitial = isLoggedIn ? user.fullName[0].toUpperCase() : '';

  return (
    <header
      className="no-print"
      style={{
        width: '100%',
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 32px'
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* LEFT: HAMBURGER TOGGLE (MOBILE) & GREETING */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              width: '38px',
              height: '38px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              color: '#0f172a'
            }}
            aria-label="Toggle Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div>
            {isLoggedIn ? (
              <>
                <h1
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  {getGreeting()}, {userFirstName} 👋
                </h1>
                <p
                  style={{
                    fontSize: '0.78rem',
                    color: '#64748b',
                    fontWeight: 500,
                    margin: '2px 0 0 0'
                  }}
                >
                  Target: <strong style={{ color: '#4f46e5' }}>{targetRole || 'Software Engineer'}</strong>
                </p>
              </>
            ) : (
              <>
                <h1
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                    margin: 0
                  }}
                >
                  Welcome to LearnPath AI 👋
                </h1>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    fontWeight: 500,
                    marginTop: '2px',
                    marginBottom: 0
                  }}
                >
                  Sign in or create an account to customize your roadmap and apply to live jobs.
                </p>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: SEARCH BAR & SIGN IN / USER PROFILE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          
          {/* SEARCH BAR */}
          <div style={{ position: 'relative', width: '260px' }}>
            <span
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search skills, topics, jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="saas-input"
              style={{
                paddingLeft: '34px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '0.82rem',
                borderRadius: '20px',
                width: '100%'
              }}
            />
          </div>

          {/* TOP RIGHT: SIGN IN BUTTON (IF GUEST) OR USER DROPDOWN (IF LOGGED IN) */}
          {isLoggedIn ? (
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #3b82f6)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    boxShadow: '0 2px 6px rgba(79, 70, 229, 0.25)'
                  }}
                >
                  {userInitial}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                    {userFirstName}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>

              {/* PROFILE MENU DROPDOWN */}
              {showProfileMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '8px',
                    width: '210px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-elevated)',
                    padding: '8px',
                    zIndex: 200
                  }}
                >
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>{user.fullName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                  </div>
                  <button
                    onClick={() => { setActiveTab('jobs'); setShowProfileMenu(false); }}
                    className="btn-subtle"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.82rem' }}
                  >
                    💼 Find Jobs (Adzuna)
                  </button>
                  <button
                    onClick={() => { setActiveTab('mypath'); setShowProfileMenu(false); }}
                    className="btn-subtle"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.82rem' }}
                  >
                    📈 My Learning Roadmap
                  </button>
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />
                  <button
                    onClick={() => {
                      setUser(null);
                      try {
                        localStorage.removeItem('pathcraft_active_session');
                        localStorage.removeItem('pathcraft_user');
                      } catch (e) {}
                      setShowProfileMenu(false);
                      if (setActiveTab) setActiveTab('home');
                    }}
                    className="btn-subtle"
                    style={{ width: '100%', justifyContent: 'flex-start', padding: '8px 10px', fontSize: '0.82rem', color: '#ef4444', fontWeight: 700 }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal && setShowAuthModal(true)}
              className="btn-primary"
              style={{
                fontSize: '0.85rem',
                padding: '9px 18px',
                borderRadius: '9999px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
                cursor: 'pointer'
              }}
            >
              <span>🔐</span> Sign In / Register
            </button>
          )}

        </div>
      </div>
    </header>
  );
}

window.Header = Header;
