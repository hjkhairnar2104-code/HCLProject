import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { BarChart3, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function SkillGapView({ skillGapData, onProceedToRoadmap }) {
  if (!skillGapData) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
        <p>No skill gap data calculated yet. Complete onboarding first!</p>
      </div>
    );
  }

  // Format radar data
  const chartData = (skillGapData.targetSkills || []).map(ts => {
    const cs = (skillGapData.currentSkills || []).find(c => c.skillId === ts.skillId);
    return {
      skill: ts.name.length > 20 ? ts.name.substring(0, 18) + '...' : ts.name,
      CurrentLevel: cs ? cs.level : 0,
      TargetLevel: ts.level || 3,
      fullMark: 5
    };
  });

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '32px 24px' }}>
      
      {/* Top Header & Readiness Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div className="badge-tag badge-purple" style={{ marginBottom: '8px' }}>
            <BarChart3 size={13} /> Analytical Skill Gap Model
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            Skill Radar & Prerequisite Gap Analysis
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Comparing claimed/calibrated skills against target role: <strong style={{ color: '#10b981' }}>{skillGapData.targetRole}</strong>
          </p>
        </div>

        <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid #10b981' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: 700 }}>Overall Prerequisite Readiness</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981' }}>
              {skillGapData.overallReadinessPercentage || 25}%
            </div>
          </div>
          <button onClick={onProceedToRoadmap} className="glow-btn-accent" style={{ padding: '10px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            View DAG Roadmap <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Grid: Left Radar Chart, Right Gap Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px' }}>
        
        {/* RADAR CHART CARD */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', width: '100%', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#6366f1" /> Skill Mastery Radar
          </h3>

          <div style={{ width: '100%', height: '360px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
                <PolarAngleAxis dataKey="skill" stroke="#9ca3af" tick={{ fill: '#d1d5db', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} stroke="#4b5563" />
                <Radar name="Target Level" dataKey="TargetLevel" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
                <Radar name="Current Level" dataKey="CurrentLevel" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#10b981' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#10b981' }} />
              Current Skills
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#6366f1' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#6366f1' }} />
              Target Role Requirements
            </div>
          </div>
        </div>

        {/* GAP LIST & MISSING PREREQUISITES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#f59e0b" /> Identified Skill Gaps ({skillGapData.gaps ? skillGapData.gaps.length : 0})
          </h3>

          {(skillGapData.gaps || []).map((gap) => (
            <div key={gap.skillId} className="glass-card" style={{ padding: '16px 20px', borderLeft: gap.importance === 'CRITICAL' ? '4px solid #ef4444' : '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>{gap.name}</span>
                <span className={gap.importance === 'CRITICAL' ? 'badge-tag badge-amber' : 'badge-tag badge-cyan'}>
                  {gap.importance} GAP
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '6px' }}>
                Current: Level {gap.currentLevel} $\rightarrow$ Required: Level {gap.targetLevel}
              </p>
              {gap.missingPrerequisites && gap.missingPrerequisites.length > 0 && (
                <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={12} /> Prerequisite dependencies: {gap.missingPrerequisites.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
