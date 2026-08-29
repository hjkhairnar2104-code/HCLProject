// LearnPath AI - Step-by-Step ATS Resume Builder (Clean Light SaaS Workspace)
function ResumeBuilderView({
  resumeForm = {},
  setResumeForm,
  goalText = '',
  setGoalText,
  handleAnalyzeAts,
  isParsing = false,
  atsScore = null,
  atsSuggestions = [],
  handleSaveResume
}) {
  const [activeStep, setActiveStep] = React.useState(1);
  const [selectedTemplate, setSelectedTemplate] = React.useState('classic-ats');
  const [skillInput, setSkillInput] = React.useState('');
  const [showSkillDropdown, setShowSkillDropdown] = React.useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = React.useState(false);

  const STEPS = [
    { num: 1, title: 'Contact Info', icon: '👤', desc: 'Name, email, phone, location, LeetCode, GFG, GitHub' },
    { num: 2, title: 'Work Experience', icon: '💼', desc: 'Roles, companies, measurable impact' },
    { num: 3, title: 'Education', icon: '🎓', desc: 'Degrees, university, CGPA, graduation' },
    { num: 4, title: 'Projects (Multiple)', icon: '🧪', desc: 'Portfolio apps, GitHub, Demo links' },
    { num: 5, title: 'Skills', icon: '⚡', desc: 'Languages, frameworks, tools' },
    { num: 6, title: 'Summary', icon: '📝', desc: 'Compelling recruiter pitch' },
    { num: 7, title: 'Review & Export', icon: '🚀', desc: 'ATS scan & 100% Free PDF export' }
  ];

  const SKILL_DATABASE = [
    "Java", "Python", "C++", "JavaScript", "SQL", "Spring Boot", "Spring Security", "Hibernate (JPA)",
    "REST APIs", "JWT Authentication", "React.js", "Tailwind CSS", "PostgreSQL", "MySQL", "MongoDB",
    "Docker", "Cloudinary", "Render", "Vercel", "Machine Learning", "Deep Learning", "LangChain",
    "LangGraph", "RAG", "FAISS", "Gemini API", "Git", "GitHub", "Postman", "Maven", "VS Code",
    "Data Structures & Algorithms", "OOP", "DBMS", "System Design", "LLD"
  ];

  const defaultProjectsList = [
    {
      id: 'proj-1',
      title: 'College Management Portal',
      tech: 'Spring Boot, React.js, MySQL, Google OAuth, JWT, Supabase, Docker, LangChain, LangGraph',
      github: 'https://studenthub.onrender.com',
      demo: 'https://studenthub.onrender.com',
      bullets: '• Developed a full-stack college management portal using Spring Boot, React.js, and MySQL with secure role-based access for students and faculty.\n• Implemented Google OAuth 2.0, JWT Authentication, faculty/student dashboards, assignment management, leave approval workflows, AI resume generation, and DSA/SQL learning modules.'
    },
    {
      id: 'proj-2',
      title: 'E-Commerce Application',
      tech: 'Spring Boot, React.js, Redux, MySQL, JWT',
      github: 'https://github.com/hkhairnar2104/Full-Stack-Backend',
      demo: 'https://ecommerce-demo.com',
      bullets: '• Built a full-stack e-commerce platform with product, cart, order, and user management using Spring Boot, React.js, and MySQL.\n• Implemented Redux for global state management and secured RESTful APIs using JWT Authentication.'
    },
    {
      id: 'proj-3',
      title: 'Java Design Patterns & Low-Level Design',
      tech: 'Java, OOP, SOLID Principles',
      github: 'https://github.com/hkhairnar2104-sudo/System-Design',
      demo: '',
      bullets: '• Implemented Builder, Observer, Strategy, Factory, Singleton, Structural, and Behavioral Design Patterns using Java.\n• Applied SOLID principles and object-oriented design to build scalable, reusable, and maintainable software components.'
    },
    {
      id: 'proj-4',
      title: 'Pune Air Quality Determination & Suggestion System',
      tech: 'Python, XGBoost, LightGBM, ANN, RNN, LSTM',
      github: 'https://colab.research.google.com',
      demo: '',
      bullets: '• Developed an AQI prediction system during a research internship under HOD guidance using Machine Learning and Deep Learning models.\n• Trained XGBoost, LightGBM, ANN, RNN, and LSTM models for accurate air-quality prediction and actionable insights.'
    }
  ];

  const projectsList = resumeForm.projectsList && resumeForm.projectsList.length > 0 ? resumeForm.projectsList : defaultProjectsList;

  const handleUpdateProject = (index, field, value) => {
    const updated = [...projectsList];
    updated[index] = { ...updated[index], [field]: value };
    setResumeForm({ ...resumeForm, projectsList: updated });
  };

  const handleAddProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      title: 'New Technical Project',
      tech: 'Java, React, PostgreSQL, Docker',
      github: 'https://github.com/username/project',
      demo: 'https://demo-link.com',
      bullets: '• Built high-performance microservices architecture with 99.9% uptime.\n• Implemented optimized caching layer cutting response latency by 50%.'
    };
    setResumeForm({
      ...resumeForm,
      projectsList: [...projectsList, newProj]
    });
  };

  const handleRemoveProject = (index) => {
    const updated = projectsList.filter((_, idx) => idx !== index);
    setResumeForm({ ...resumeForm, projectsList: updated });
  };

  const handleMoveProject = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === projectsList.length - 1)) return;
    const updated = [...projectsList];
    const targetIdx = index + direction;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setResumeForm({ ...resumeForm, projectsList: updated });
  };

  const handleAddSkillPill = (skillToAdd) => {
    const current = resumeForm.skills ? resumeForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!current.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      const updated = [...current, skillToAdd].join(', ');
      setResumeForm({ ...resumeForm, skills: updated });
    }
    setSkillInput('');
    setShowSkillDropdown(false);
  };

  const handleRemoveSkillPill = (skillToRemove) => {
    const current = resumeForm.skills ? resumeForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    const updated = current.filter(s => s.toLowerCase() !== skillToRemove.toLowerCase()).join(', ');
    setResumeForm({ ...resumeForm, skills: updated });
  };

  // High-Precision Pixel-Perfect PDF Export Handler
  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    const element = document.getElementById('resume-preview');
    if (!element) {
      window.print();
      setIsDownloadingPdf(false);
      return;
    }

    if (window.html2pdf) {
      const sanitizedName = (resumeForm.fullName || 'Harsh_Khairnar').replace(/\s+/g, '_');
      const opt = {
        margin: [6, 10, 6, 10],
        filename: `${sanitizedName}_Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.8, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(element).save()
        .then(() => {
          setIsDownloadingPdf(false);
          try { confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } }); } catch (e) {}
        })
        .catch(() => {
          setIsDownloadingPdf(false);
          window.print();
        });
    } else {
      setIsDownloadingPdf(false);
      window.print();
    }
  };

  const handleResetToTemplate = () => {
    const fullTemplate = {
      fullName: "Harsh Khairnar",
      headline: "Full Stack Developer",
      phone: "+91-9960251469",
      email: "hkkhairnar2104@gmail.com",
      location: "Pune, India",
      github: "https://github.com/hkhairnar2104",
      linkedin: "https://linkedin.com/in/harsh-khairnar",
      leetcode: "https://leetcode.com/u/hkhairnar2104",
      gfg: "https://auth.geeksforgeeks.org/user/hkhairnar2104",
      summary: "AI & ML undergraduate with hands-on experience in Java Full Stack development, building web applications using Spring Boot, React.js, PostgreSQL, Supabase, Docker, and REST APIs. Experienced in developing Generative AI applications with LangChain, LangGraph, RAG, FAISS, and Gemini API. Currently serving as a Web Developer Intern at IEEE Pune Section with a strong foundation in Data Structures & Algorithms, OOP, DBMS, and System Design.",
      skills: "Java, Python, C++, JavaScript, SQL, HTML5, CSS3, Spring Boot, Spring Security, Hibernate (JPA), Node.js, Express.js, REST APIs, JWT Authentication, React.js, Tailwind CSS, PostgreSQL, MySQL, MongoDB, Supabase, Docker, Cloudinary, Render, Vercel, Machine Learning, Deep Learning, LangChain, LangGraph, RAG, FAISS, Gemini API, Git, GitHub, Postman, Maven, VS Code, Data Structures & Algorithms, OOP, DBMS, System Design, LLD",
      jobTitle: "Web Developer Intern",
      company: "IEEE Pune Section",
      duration: "May 2024 – Present",
      expLocation: "Pune, India",
      experience: "• Developed and maintained the official IEEE Pune Section website using React.js, delivering a responsive and user-friendly interface.\n• Designed and implemented an admin dashboard for managing events, blogs, team members, and website content through CRUD operations.\n• Integrated RESTful APIs and collaborated with team members to build scalable and maintainable web application features.\n• Utilized Git, GitHub, and Cloudinary for version control, collaborative development, and media management.",
      degree: "B.Tech in Computer Engineering",
      university: "Pune University (SPPU)",
      gradYear: "2025",
      cgpa: "8.9 / 10",
      certifications: "Solved 500+ DSA Problems across LeetCode and GeeksforGeeks",
      projectsList: [
        {
          id: 'proj-1',
          title: 'College Management Portal',
          tech: 'Spring Boot, React.js, MySQL, Google OAuth, JWT, Supabase, Docker, LangChain, LangGraph',
          github: 'https://studenthub.onrender.com',
          demo: 'https://studenthub.onrender.com',
          bullets: '• Developed a full-stack college management portal using Spring Boot, React.js, and MySQL with secure role-based access for students and faculty.\n• Implemented Google OAuth 2.0, JWT Authentication, faculty/student dashboards, assignment management, leave approval workflows, AI resume generation, and DSA/SQL learning modules.'
        },
        {
          id: 'proj-2',
          title: 'E-Commerce Application',
          tech: 'Spring Boot, React.js, Redux, MySQL, JWT',
          github: 'https://github.com/hkhairnar2104/Full-Stack-Backend',
          demo: 'https://ecommerce-demo.com',
          bullets: '• Built a full-stack e-commerce platform with product, cart, order, and user management using Spring Boot, React.js, and MySQL.\n• Implemented Redux for global state management and secured RESTful APIs using JWT Authentication.'
        },
        {
          id: 'proj-3',
          title: 'Java Design Patterns & Low-Level Design',
          tech: 'Java, OOP, SOLID Principles',
          github: 'https://github.com/hkhairnar2104-sudo/System-Design',
          demo: '',
          bullets: '• Implemented Builder, Observer, Strategy, Factory, Singleton, Structural, and Behavioral Design Patterns using Java.\n• Applied SOLID principles and object-oriented design to build scalable, reusable, and maintainable software components.'
        },
        {
          id: 'proj-4',
          title: 'Pune Air Quality Determination & Suggestion System',
          tech: 'Python, XGBoost, LightGBM, ANN, RNN, LSTM',
          github: 'https://colab.research.google.com',
          demo: '',
          bullets: '• Developed a real-time air quality prediction system utilizing machine learning models (XGBoost, LightGBM, LSTM).\n• Analyzed meteorological and pollutant sensor data to provide actionable health suggestions for urban areas.'
        }
      ]
    };
    if (setResumeForm) setResumeForm(fullTemplate);
  };

  const currentSkillsList = resumeForm.skills ? resumeForm.skills.split(',').map(s => s.trim()).filter(Boolean) : [
    'Java', 'Python', 'C++', 'JavaScript', 'SQL', 'Spring Boot', 'React.js', 'PostgreSQL', 'Docker', 'Machine Learning'
  ];

  const filteredSkills = skillInput.trim() ? SKILL_DATABASE.filter(s => s.toLowerCase().includes(skillInput.toLowerCase())) : [];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* TOP HEADER: ACTION BAR */}
      <div className="no-print saas-card" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderLeft: '4px solid #10b981' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success">✨ 100% Free Forever</span>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>No paywalls, no subscriptions, unlimited ATS PDF downloads.</span>
          </div>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '2px' }}>
            Step-by-Step ATS Resume Builder
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleResetToTemplate}
            className="btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.78rem', background: '#f8fafc', color: '#4f46e5', borderColor: '#c7d2fe', fontWeight: 700 }}
            title="Populate complete Harsh Khairnar profile with IEEE experience, 4 projects, and education"
          >
            📋 Load Complete Profile Template
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Template:</span>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="saas-input"
              style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem', fontWeight: 700 }}
            >
              <option value="classic-ats">📄 Classic ATS (1-Column Clean)</option>
              <option value="modern-slate">🎨 Modern Slate (2-Column Pro)</option>
              <option value="tech-minimalist">💻 Tech Minimalist (FAANG)</option>
              <option value="executive-blue">👔 Executive Navy (Timeline)</option>
            </select>
          </div>

          <button
            onClick={() => handleSaveResume && handleSaveResume()}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
          >
            💾 Save
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="btn-primary"
            style={{ padding: '7px 18px', fontSize: '0.82rem', background: '#2563eb' }}
          >
            {isDownloadingPdf ? '⏳ Generating PDF...' : '📥 Download PDF'}
          </button>

          <button
            onClick={() => window.print()}
            className="btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.8rem' }}
            title="Open browser print dialogue"
          >
            🖨️ Print
          </button>
        </div>
      </div>

      {/* 7-STEP HORIZONTAL SLIDE STEPPER */}
      <div className="no-print saas-card" style={{ padding: '10px 14px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minWidth: '760px', gap: '6px' }}>
          {STEPS.map((s) => {
            const isCompleted = activeStep > s.num;
            const isCurrent = activeStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '7px 12px', borderRadius: '8px', cursor: 'pointer',
                  background: isCurrent ? '#4f46e5' : (isCompleted ? '#ecfdf5' : '#f8fafc'),
                  border: isCurrent ? '1px solid #4f46e5' : (isCompleted ? '1px solid #a7f3d0' : '1px solid #e2e8f0'),
                  color: isCurrent ? '#ffffff' : (isCompleted ? '#065f46' : '#475569'),
                  fontWeight: isCurrent ? 700 : 500, fontSize: '0.78rem',
                  transition: 'all 0.15s ease', flexShrink: 0
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: isCurrent ? '#ffffff' : (isCompleted ? '#10b981' : '#cbd5e1'),
                  color: isCurrent ? '#4f46e5' : '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 800
                }}>
                  {isCompleted ? '✓' : s.num}
                </div>
                <span>{s.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-COLUMN WORKSPACE */}
      <div className="resume-workspace-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT: FORM SLIDE */}
        <div className="no-print saas-card" style={{ padding: '24px', borderLeft: '4px solid #4f46e5' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>
                Step {activeStep} of 7
              </span>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {STEPS[activeStep - 1]?.title}
              </h2>
            </div>
            <span style={{ fontSize: '1.4rem' }}>{STEPS[activeStep - 1]?.icon}</span>
          </div>

          {/* SLIDE 1: CONTACT INFO */}
          {activeStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  value={resumeForm.fullName || ''}
                  onChange={e => setResumeForm({ ...resumeForm, fullName: e.target.value })}
                  placeholder="Harsh Sharma"
                  className="saas-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Target Headline Role *</label>
                <input
                  type="text"
                  value={resumeForm.headline || ''}
                  onChange={e => setResumeForm({ ...resumeForm, headline: e.target.value })}
                  placeholder="Generative AI & Backend Software Engineer"
                  className="saas-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    value={resumeForm.email || ''}
                    onChange={e => setResumeForm({ ...resumeForm, email: e.target.value })}
                    placeholder="harsh@example.com"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="text"
                    value={resumeForm.phone || ''}
                    onChange={e => setResumeForm({ ...resumeForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="saas-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Location (City, Country)</label>
                <input
                  type="text"
                  value={resumeForm.location || ''}
                  onChange={e => setResumeForm({ ...resumeForm, location: e.target.value })}
                  placeholder="Bangalore, India"
                  className="saas-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>GitHub Profile URL</label>
                  <input
                    type="text"
                    value={resumeForm.github || ''}
                    onChange={e => setResumeForm({ ...resumeForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>LinkedIn Profile URL</label>
                  <input
                    type="text"
                    value={resumeForm.linkedin || ''}
                    onChange={e => setResumeForm({ ...resumeForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="saas-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>LeetCode Profile URL</label>
                  <input
                    type="text"
                    value={resumeForm.leetcode || ''}
                    onChange={e => setResumeForm({ ...resumeForm, leetcode: e.target.value })}
                    placeholder="https://leetcode.com/u/hkhairnar2104"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>GeeksforGeeks (GFG) Profile URL</label>
                  <input
                    type="text"
                    value={resumeForm.gfg || ''}
                    onChange={e => setResumeForm({ ...resumeForm, gfg: e.target.value })}
                    placeholder="https://auth.geeksforgeeks.org/user/hkhairnar2104"
                    className="saas-input"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: WORK EXPERIENCE */}
          {activeStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Job Title</label>
                  <input
                    type="text"
                    value={resumeForm.jobTitle || ''}
                    onChange={e => setResumeForm({ ...resumeForm, jobTitle: e.target.value })}
                    placeholder="Web Developer Intern"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Company Name</label>
                  <input
                    type="text"
                    value={resumeForm.company || ''}
                    onChange={e => setResumeForm({ ...resumeForm, company: e.target.value })}
                    placeholder="IEEE Pune Section"
                    className="saas-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Duration</label>
                  <input
                    type="text"
                    value={resumeForm.duration || ''}
                    onChange={e => setResumeForm({ ...resumeForm, duration: e.target.value })}
                    placeholder="May 2024 – Present"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Location</label>
                  <input
                    type="text"
                    value={resumeForm.expLocation || ''}
                    onChange={e => setResumeForm({ ...resumeForm, expLocation: e.target.value })}
                    placeholder="Pune, India"
                    className="saas-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Key Responsibilities & Measurable Impact (Bulleted)</label>
                <textarea
                  rows={6}
                  value={resumeForm.experience || ''}
                  onChange={e => setResumeForm({ ...resumeForm, experience: e.target.value })}
                  placeholder="• Developed and maintained official website using React.js..."
                  className="saas-input"
                  style={{ resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>
          )}

          {/* SLIDE 3: EDUCATION */}
          {activeStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Degree & Major</label>
                <input
                  type="text"
                  value={resumeForm.degree || ''}
                  onChange={e => setResumeForm({ ...resumeForm, degree: e.target.value })}
                  placeholder="B.Tech in Computer Engineering"
                  className="saas-input"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>University / Institute</label>
                <input
                  type="text"
                  value={resumeForm.university || ''}
                  onChange={e => setResumeForm({ ...resumeForm, university: e.target.value })}
                  placeholder="Pune University (SPPU)"
                  className="saas-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Graduation Year</label>
                  <input
                    type="text"
                    value={resumeForm.gradYear || ''}
                    onChange={e => setResumeForm({ ...resumeForm, gradYear: e.target.value })}
                    placeholder="2025"
                    className="saas-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>CGPA / GPA</label>
                  <input
                    type="text"
                    value={resumeForm.cgpa || ''}
                    onChange={e => setResumeForm({ ...resumeForm, cgpa: e.target.value })}
                    placeholder="8.9 / 10"
                    className="saas-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>Certifications & Honors</label>
                <input
                  type="text"
                  value={resumeForm.certifications || ''}
                  onChange={e => setResumeForm({ ...resumeForm, certifications: e.target.value })}
                  placeholder="Solved 500+ DSA Problems across LeetCode and GeeksforGeeks"
                  className="saas-input"
                />
              </div>
            </div>
          )}

          {/* SLIDE 4: PROJECTS */}
          {activeStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                  Engineering Projects ({projectsList.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.74rem' }}
                >
                  + Add Project
                </button>
              </div>

              {projectsList.map((p, idx) => (
                <div
                  key={p.id || idx}
                  style={{
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e293b' }}>
                      #{idx + 1}: {p.title || 'Untitled Project'}
                    </span>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, -1)}
                        disabled={idx === 0}
                        style={{ border: 'none', background: 'transparent', cursor: idx === 0 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: idx === 0 ? 0.3 : 1 }}
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveProject(idx, 1)}
                        disabled={idx === projectsList.length - 1}
                        style={{ border: 'none', background: 'transparent', cursor: idx === projectsList.length - 1 ? 'not-allowed' : 'pointer', fontSize: '0.8rem', opacity: idx === projectsList.length - 1 ? 0.3 : 1 }}
                      >
                        ▼
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Project Title</label>
                    <input
                      type="text"
                      value={p.title || ''}
                      onChange={e => handleUpdateProject(idx, 'title', e.target.value)}
                      placeholder="College Management Portal"
                      className="saas-input"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Tech Stack</label>
                    <input
                      type="text"
                      value={p.tech || ''}
                      onChange={e => handleUpdateProject(idx, 'tech', e.target.value)}
                      placeholder="Spring Boot, React.js, MySQL, Docker"
                      className="saas-input"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Live Demo URL</label>
                      <input
                        type="text"
                        value={p.demo || ''}
                        onChange={e => handleUpdateProject(idx, 'demo', e.target.value)}
                        placeholder="https://studenthub.onrender.com"
                        className="saas-input"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>GitHub / Code URL</label>
                      <input
                        type="text"
                        value={p.github || ''}
                        onChange={e => handleUpdateProject(idx, 'github', e.target.value)}
                        placeholder="https://github.com/hkhairnar2104/..."
                        className="saas-input"
                        style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>Project Bullets & Achievements</label>
                    <textarea
                      rows={3}
                      value={p.bullets || ''}
                      onChange={e => handleUpdateProject(idx, 'bullets', e.target.value)}
                      placeholder="• Developed a full-stack college management portal..."
                      className="saas-input"
                      style={{ padding: '6px 10px', fontSize: '0.78rem', resize: 'vertical' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SLIDE 5: SKILLS */}
          {activeStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
                  Technical Skills (Comma-Separated)
                </label>
                <textarea
                  rows={4}
                  value={resumeForm.skills || ''}
                  onChange={e => setResumeForm({ ...resumeForm, skills: e.target.value })}
                  placeholder="Java, Python, C++, JavaScript, SQL, Spring Boot, React.js..."
                  className="saas-input"
                  style={{ resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
                  Quick Add Skills
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="text"
                    value={skillInput}
                    onChange={e => { setSkillInput(e.target.value); setShowSkillDropdown(true); }}
                    onFocus={() => setShowSkillDropdown(true)}
                    placeholder="Search e.g. Docker, LangChain, Kafka..."
                    className="saas-input"
                  />
                </div>

                {showSkillDropdown && filteredSkills.length > 0 && (
                  <div style={{
                    marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px',
                    maxHeight: '130px', overflowY: 'auto', padding: '6px', display: 'flex', flexWrap: 'wrap', gap: '6px'
                  }}>
                    {filteredSkills.map(s => (
                      <span
                        key={s}
                        onClick={() => handleAddSkillPill(s)}
                        style={{
                          background: '#eef2ff', color: '#4f46e5', padding: '3px 8px', borderRadius: '6px',
                          fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer'
                        }}
                      >
                        + {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Active Skills ({currentSkillsList.length}):</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {currentSkillsList.map(s => (
                    <span
                      key={s}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        background: '#f1f5f9', color: '#0f172a', border: '1px solid #e2e8f0',
                        borderRadius: '6px', padding: '3px 8px', fontSize: '0.72rem', fontWeight: 600
                      }}
                    >
                      {s}
                      <span onClick={() => handleRemoveSkillPill(s)} style={{ cursor: 'pointer', color: '#ef4444', fontWeight: 800 }}>×</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 6: SUMMARY */}
          {activeStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#475569', fontWeight: 700, marginBottom: '4px' }}>
                  Professional Summary
                </label>
                <textarea
                  rows={6}
                  value={resumeForm.summary || ''}
                  onChange={e => setResumeForm({ ...resumeForm, summary: e.target.value })}
                  placeholder="AI & ML undergraduate with hands-on experience in Java Full Stack development..."
                  className="saas-input"
                  style={{ resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>
          )}

          {/* SLIDE 7: REVIEW & EXPORT */}
          {activeStep === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '14px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#065f46' }}>
                  🎉 Your ATS Resume is Ready for Export!
                </span>
                <p style={{ fontSize: '0.76rem', color: '#047857', marginTop: '4px' }}>
                  Your resume is formatted strictly to ATS compliance standards with standard single-column structure and scannable technical headings.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.9rem', background: '#2563eb' }}
                >
                  {isDownloadingPdf ? '⏳ Generating PDF...' : '📥 Download ATS PDF File'}
                </button>
                <button
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ padding: '12px 18px', fontSize: '0.9rem' }}
                >
                  🖨️ Browser Print
                </button>
              </div>
            </div>
          )}

          {/* STEP CONTROLS (BACK / NEXT) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
              disabled={activeStep === 1}
              className="btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.76rem', opacity: activeStep === 1 ? 0.4 : 1 }}
            >
              ← Back
            </button>

            {activeStep < 7 ? (
              <button
                onClick={() => setActiveStep(prev => Math.min(prev + 1, 7))}
                className="btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.76rem' }}
              >
                Next: {STEPS[activeStep]?.title} →
              </button>
            ) : (
              <button
                onClick={handleDownloadPdf}
                disabled={isDownloadingPdf}
                className="btn-primary"
                style={{ padding: '6px 16px', fontSize: '0.76rem', background: '#10b981' }}
              >
                📥 Download PDF
              </button>
            )}
          </div>

        </div>

        {/* RIGHT: REAL A4 RESUME PREVIEW */}
        <div className="resume-preview-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>Live A4 Preview ({selectedTemplate})</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Updates in real-time</span>
          </div>

          <div
            id="resume-preview"
            style={{
              background: '#ffffff',
              color: '#0f172a',
              padding: '32px 28px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              minHeight: '720px',
              fontSize: '0.80rem',
              lineHeight: 1.4,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* HEADER */}
            <div style={{ borderBottom: '1.5px solid #1e3a8a', paddingBottom: '8px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#1e40af', letterSpacing: '-0.01em', margin: 0, textTransform: 'uppercase' }}>
                {resumeForm.fullName || 'Harsh Khairnar'}
              </h2>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
                {resumeForm.headline || 'Full Stack Developer'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '6px', fontSize: '0.72rem', color: '#1e293b', marginTop: '4px' }}>
                {resumeForm.phone && <span>{resumeForm.phone}</span>}
                {resumeForm.phone && resumeForm.email && <span>|</span>}
                {resumeForm.email && <span>{resumeForm.email}</span>}
                {resumeForm.location && <span>|</span>}
                {resumeForm.location && <span>{resumeForm.location}</span>}
                {resumeForm.github && <span>|</span>}
                {resumeForm.github && <a href={resumeForm.github} target="_blank" rel="noreferrer" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>GitHub</a>}
                {resumeForm.linkedin && <span>|</span>}
                {resumeForm.linkedin && <a href={resumeForm.linkedin} target="_blank" rel="noreferrer" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>LinkedIn</a>}
                {resumeForm.leetcode && <span>|</span>}
                {resumeForm.leetcode && <a href={resumeForm.leetcode} target="_blank" rel="noreferrer" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>LeetCode</a>}
                {resumeForm.gfg && <span>|</span>}
                {resumeForm.gfg && <a href={resumeForm.gfg} target="_blank" rel="noreferrer" style={{ color: '#1e40af', fontWeight: 600, textDecoration: 'none' }}>GeeksforGeeks</a>}
              </div>
            </div>

            {/* SUMMARY */}
            {resumeForm.summary && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Summary
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#1e293b', textAlign: 'justify', lineHeight: 1.45, margin: 0 }}>
                  {resumeForm.summary}
                </p>
              </div>
            )}

            {/* TECHNICAL SKILLS */}
            {currentSkillsList.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Technical Skills
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#1e293b', lineHeight: 1.45, margin: 0 }}>
                  {resumeForm.skills || currentSkillsList.join(', ')}
                </p>
              </div>
            )}

            {/* WORK EXPERIENCE */}
            {resumeForm.jobTitle && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Experience
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '0.78rem' }}>
                  <span style={{ color: '#0f172a' }}>
                    {resumeForm.jobTitle}{resumeForm.company ? ` — ${resumeForm.company}` : ''}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                    {resumeForm.duration || ''}
                    {resumeForm.duration && (resumeForm.expLocation || resumeForm.location) ? ' | ' : ''}
                    {resumeForm.expLocation || resumeForm.location || ''}
                  </span>
                </div>
                {resumeForm.experience && (
                  <div style={{ fontSize: '0.74rem', color: '#1e293b', whiteSpace: 'pre-line', marginTop: '3px', lineHeight: 1.4 }}>
                    {resumeForm.experience}
                  </div>
                )}
              </div>
            )}

            {/* PROJECTS */}
            {projectsList.length > 0 && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Projects
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projectsList.map((p, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '0.76rem' }}>
                        <span>
                          <strong style={{ color: '#0f172a' }}>{p.title}</strong>{' '}
                          {p.tech && <span style={{ fontStyle: 'italic', fontWeight: 500, color: '#475569' }}>| {p.tech}</span>}
                        </span>
                        {p.demo && (
                          <a href={p.demo} target="_blank" rel="noreferrer" style={{ fontSize: '0.70rem', color: '#1e40af', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#1e293b', whiteSpace: 'pre-line', marginTop: '2px', lineHeight: 1.4 }}>
                        {p.bullets}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* EDUCATION */}
            {resumeForm.degree && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Education
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontWeight: 700, fontSize: '0.76rem' }}>
                  <span>
                    {resumeForm.degree}
                    {resumeForm.university ? ` — ${resumeForm.university}` : ''}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#475569' }}>
                    {resumeForm.gradYear || ''}
                    {resumeForm.cgpa ? ` (CGPA: ${resumeForm.cgpa})` : ''}
                  </span>
                </div>
              </div>
            )}

            {/* AWARDS & CERTIFICATIONS */}
            {resumeForm.certifications && (
              <div>
                <h3 style={{ fontSize: '0.84rem', fontWeight: 800, color: '#1e40af', borderBottom: '1px solid #93c5fd', paddingBottom: '2px', marginBottom: '4px' }}>
                  Awards & Certifications
                </h3>
                <div style={{ fontSize: '0.74rem', color: '#1e293b', marginTop: '2px' }}>
                  • {resumeForm.certifications}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}

window.ResumeBuilderView = ResumeBuilderView;
