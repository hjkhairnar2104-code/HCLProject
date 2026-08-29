// LearnPath AI — Production-Grade Strict Authentication Modal (Login & Registration)
function AuthModal({
  showAuthModal,
  setShowAuthModal,
  authMode = 'login',
  setAuthMode,
  authName = '',
  setAuthName,
  authEmail = '',
  setAuthEmail,
  authPassword = '',
  setAuthPassword,
  handleAuthSubmit,
  handleGoogleAuth
}) {
  if (!showAuthModal) return null;

  const [mode, setMode] = React.useState(authMode || 'login'); // 'login' | 'signup'
  const [name, setName] = React.useState(authName || '');
  const [email, setEmail] = React.useState(authEmail || '');
  const [password, setPassword] = React.useState(authPassword || '');
  const [targetRole, setTargetRole] = React.useState('Java Backend Developer');
  const [skills, setSkills] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  const API_BASE = window.API_BASE || 'https://hclproject-cbmh.onrender.com';

  // Helper to get locally registered accounts
  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('pathcraft_registered_accounts');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return {};
  };

  const saveRegisteredUser = (userObj) => {
    try {
      const accounts = getRegisteredUsers();
      accounts[userObj.email.toLowerCase()] = userObj;
      localStorage.setItem('pathcraft_registered_accounts', JSON.stringify(accounts));
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!cleanEmail.endsWith('@gmail.com')) {
      setErrorMsg('⚠️ Access Restricted: Only official @gmail.com email addresses are allowed to Sign In or Sign Up (e.g. yourname@gmail.com).');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);

    if (mode === 'login') {
      // STRICT LOGIN AUTHENTICATION
      try {
        const res = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password: cleanPassword })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setSuccessMsg(`✨ Welcome back, ${data.user.fullName || cleanEmail}!`);
            try { confetti({ particleCount: 50, spread: 60 }); } catch (err) {}
            setTimeout(() => {
              if (handleAuthSubmit) handleAuthSubmit(e, data.user);
              setShowAuthModal(false);
            }, 600);
            return;
          }
        } else {
          const errData = await res.json().catch(() => ({}));
          if (res.status === 404 || res.status === 401) {
            setErrorMsg(errData.error || 'Invalid credentials or user not registered. Please sign up first.');
            setLoading(false);
            return;
          }
        }
      } catch (networkErr) {
        console.warn('Backend offline, verifying local credentials registry:', networkErr.message);
      }

      // Check local registered accounts registry
      const localAccounts = getRegisteredUsers();
      const userMatch = localAccounts[cleanEmail];

      if (!userMatch) {
        setErrorMsg('⚠️ No registered account found with this email. Please register / create an account first.');
        setLoading(false);
        return;
      }

      if (userMatch.password && userMatch.password !== cleanPassword) {
        setErrorMsg('⚠️ Incorrect password. Please verify your credentials and try again.');
        setLoading(false);
        return;
      }

      setSuccessMsg(`✨ Welcome back, ${userMatch.fullName}!`);
      try { confetti({ particleCount: 50, spread: 60 }); } catch (err) {}
      setTimeout(() => {
        if (handleAuthSubmit) handleAuthSubmit(e, userMatch);
        setShowAuthModal(false);
      }, 600);

    } else {
      // SIGN UP / REGISTRATION
      const cleanName = (name || '').trim() || cleanEmail.split('@')[0];
      const parsedSkills = skills.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

      const newUserAccount = {
        id: 'user-' + Date.now(),
        email: cleanEmail,
        fullName: cleanName,
        password: cleanPassword,
        targetRole: targetRole,
        skills: parsedSkills,
        claimedSkills: parsedSkills,
        profileCompleted: false
      };

      try {
        const res = await fetch(`${API_BASE}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            fullName: cleanName,
            password: cleanPassword,
            targetRole: targetRole,
            skills: skills
          })
        });

        if (res.ok) {
          const data = await res.json();
          const registeredUser = { ...(data.user || newUserAccount), profileCompleted: false };
          saveRegisteredUser(registeredUser);
          setSuccessMsg('🎉 Account created! Starting your profile & learning path setup...');
          try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
          setTimeout(() => {
            if (handleAuthSubmit) handleAuthSubmit(e, registeredUser, true);
            setShowAuthModal(false);
          }, 600);
          return;
        } else if (res.status === 409) {
          const errData = await res.json().catch(() => ({}));
          setErrorMsg(errData.error || 'An account with this email already exists. Please switch to Sign In.');
          setLoading(false);
          return;
        }
      } catch (networkErr) {
        console.warn('Registering locally into credentials store:', networkErr.message);
      }

      // Check for duplicates in local store
      const localAccounts = getRegisteredUsers();
      if (localAccounts[cleanEmail]) {
        setErrorMsg('⚠️ An account with this email already exists. Please switch to Sign In.');
        setLoading(false);
        return;
      }

      saveRegisteredUser(newUserAccount);
      setSuccessMsg('🎉 Account created! Starting your profile & learning path setup...');
      try { confetti({ particleCount: 60, spread: 60 }); } catch (err) {}
      setTimeout(() => {
        if (handleAuthSubmit) handleAuthSubmit(e, newUserAccount, true);
        setShowAuthModal(false);
      }, 600);
    }

    setLoading(false);
  };

  const handleQuickDemoFill = () => {
    setMode('login');
    setEmail('harsh@example.com');
    setPassword('password123');
    setName('Harsh Sharma');
    setErrorMsg('');
  };

  return (
    <div
      onClick={() => setShowAuthModal(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div
        className="saas-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          background: '#ffffff',
          boxShadow: 'var(--shadow-modal)',
          borderRadius: '16px',
          padding: '32px 28px',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setShowAuthModal(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            color: '#64748b',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* BRAND HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 50%, #06b6d4 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '8px',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="m2 17 10 5 10-5" />
              <path d="m2 12 10 5 10-5" />
              <circle cx="12" cy="12" r="2" fill="#38bdf8" stroke="none" />
            </svg>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {mode === 'signup' ? 'Create Your Developer Account' : 'Sign In to LearnPath AI'}
          </h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eef2ff', border: '1px solid #c7d2fe', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, color: '#4338ca', marginTop: '6px', marginBottom: '2px' }}>
            <span>🔒 Access Policy: Only official @gmail.com accounts allowed</span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.80rem', marginTop: '4px' }}>
            {mode === 'signup'
              ? 'Enter your skills and target role to personalize your roadmap & job matches.'
              : 'Registered users only. Unregistered visitors must create an account first.'}
          </p>
        </div>

        {/* MODE SWITCHER TABS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4px',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '16px'
          }}
        >
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'login' ? '#ffffff' : 'transparent',
              color: mode === 'login' ? '#4f46e5' : '#64748b',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Sign In (Existing)
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              padding: '8px',
              border: 'none',
              borderRadius: '8px',
              background: mode === 'signup' ? '#ffffff' : 'transparent',
              color: mode === 'signup' ? '#4f46e5' : '#64748b',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Register / Sign Up
          </button>
        </div>

        {/* FEEDBACK BANNERS */}
        {errorMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', fontSize: '0.8rem', lineHeight: 1.4 }}>
            {errorMsg}
            {errorMsg.includes('register') && (
              <div style={{ marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); }}
                  style={{ background: 'transparent', border: 'none', color: '#4f46e5', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                >
                  Click here to Register ➔
                </button>
              </div>
            )}
          </div>
        )}

        {successMsg && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.8rem', fontWeight: 700 }}>
            {successMsg}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {mode === 'signup' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="saas-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Target Career Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="saas-input"
                  style={{ width: '100%', padding: '8px 12px', fontSize: '0.84rem' }}
                >
                  <option value="Java Backend Developer">☕ Java Backend Developer</option>
                  <option value="Full Stack Developer">⚛️ Full Stack Developer (React + Node)</option>
                  <option value="Software Engineering Intern / Fresher">🎓 Software Engineering Intern / Fresher</option>
                  <option value="Generative AI & LLM Systems Engineer">🤖 Generative AI & LLM Systems Engineer</option>
                  <option value="DevOps & Cloud SRE">🚢 DevOps & Cloud SRE</option>
                  <option value="Python / FastAPI Developer">🐍 Python / FastAPI Developer</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Your Initial Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot, SQL, React"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="saas-input"
                />
              </div>
            </>
          )}

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569' }}>
                Email Address
              </label>
              <span style={{ fontSize: '0.68rem', color: '#4f46e5', fontWeight: 700 }}>
                @gmail.com required
              </span>
            </div>
            <input
              type="email"
              placeholder="e.g. yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="saas-input"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="saas-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px', marginTop: '6px', fontSize: '0.9rem', fontWeight: 800 }}
          >
            {loading ? 'Authenticating...' : (mode === 'signup' ? 'Complete Registration →' : 'Sign In with Password →')}
          </button>
        </form>
      </div>
    </div>
  );
}

window.AuthModal = AuthModal;
