import React from 'react';
import { Cpu, Flame, Clock, Award, CheckCircle2, ArrowRight, Zap, Play, Sparkles } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function DashboardView({ dashboardData, onGoToRoadmap }) {
  if (!dashboardData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        <p>Loading dashboard telemetry...</p>
      </div>
    );
  }

  const { profile, skillGap, roadmap, completionPercentage, nextBestAction, streakDays, totalHoursInvested } = dashboardData;

  const chartData = (skillGap?.targetSkills || []).map(ts => {
    const cs = (skillGap?.currentSkills || []).find(c => c.skillId === ts.skillId);
    return {
      skill: ts.name.length > 18 ? ts.name.substring(0, 16) + '...' : ts.name,
      CurrentLevel: cs ? cs.level : 1,
      TargetLevel: ts.level || 3,
      fullMark: 5
    };
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Top Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div className="badge-tag badge-cyan" style={{ marginBottom: '8px' }}>
            <Cpu size={13} /> Real-Time Learning Analytics
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            Learner Progress & Skill Mastery Dashboard
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Tracking profile: <strong style={{ color: '#6366f1' }}>{profile?.targetRole || 'Data Scientist'}</strong>
          </p>
        </div>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #6366f1' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Path Completion</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#6366f1', marginTop: '4px' }}>
            {completionPercentage || 0}%
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${completionPercentage || 0}%`, height: '100%', background: '#6366f1', borderRadius: '3px' }} />
          </div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Flame size={14} color="#f59e0b" /> Daily Learning Streak
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            {streakDays || 3} Days 🔥
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '6px' }}>Consistently active this week</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="#10b981" /> Time Invested
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {totalHoursInvested || 4.5} Hours
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '6px' }}>Total study time logged</div>
        </div>

        <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="#8b5cf6" /> Live Adaptations
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#8b5cf6', marginTop: '4px' }}>
            {roadmap?.adaptationCount || 1} Reflows
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '6px' }}>Dynamic path adjustments</div>
        </div>

      </div>

      {/* MAIN CONTENT GRID: NEXT BEST ACTION + SKILL RADAR */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        
        {/* NEXT BEST ACTION SMART WIDGET */}
        <div className="glass-card" style={{ padding: '28px', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="badge-tag badge-emerald" style={{ marginBottom: '12px' }}>
              <Zap size={13} /> Recommended Next Action
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              {nextBestAction ? nextBestAction.title : 'Master Python Programming Fundamentals'}
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '16px' }}>
              {nextBestAction ? nextBestAction.whyRecommended : 'Continue your scheduled milestone to maintain your 3-day learning streak!'}
            </p>

            {nextBestAction && (
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', fontWeight: 700 }}>Resource:</div>
                <div style={{ fontWeight: 700, color: '#10b981', fontSize: '0.95rem' }}>{nextBestAction.resourceTitle}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>{nextBestAction.resourceProvider} · {nextBestAction.estimatedHours} hrs</div>
              </div>
            )}
          </div>

          <button onClick={onGoToRoadmap} className="glow-btn-accent" style={{ width: '100%', padding: '14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Play size={16} /> Continue Learning Milestone <ArrowRight size={16} />
          </button>
        </div>

        {/* SKILL MASTERY RADAR */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '12px' }}>
            Current vs. Target Skill Growth
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="skill" stroke="#9ca3af" tick={{ fill: '#d1d5db', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#4b5563" />
                <Radar name="Target" dataKey="TargetLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                <Radar name="Current" dataKey="CurrentLevel" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
