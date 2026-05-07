'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  TrendingUp,
  Award,
  BookMarked,
  X,
  Loader2,
  Globe,
  Zap,
  Sparkles
} from 'lucide-react';
import { useZcgContext } from '@/context/ZcgContext';
import { ReviewTerminal } from '@/components/ReviewTerminal';
import { TopBar } from '@/components/TopBar';

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<any | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const { 
    submitAssignment, 
    submitReview,
    loading, 
    userStats, 
    assignments, 
    reviewQueue 
  } = useZcgContext();

  const handleSubit = async () => {
    if (!submissionUrl) return;
    await submitAssignment(submissionUrl);
    setIsModalOpen(false);
    setSubmissionUrl('');
  };

  return (
    <>
      <TopBar userName={userStats?.name} />

      {/* Submission Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="glass-card" style={{ width: '450px', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem' }}>Submit Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Assignment Content URL</label>
              <div className="glass" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={18} color="var(--text-secondary)" />
                <input 
                  type="text" 
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/..." 
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', flex: 1 }} 
                />
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', height: '50px' }}
              onClick={handleSubit}
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="pulse" /> : <><Zap size={18} /> Submit to Protocol</>}
            </button>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {activeReview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          backdropFilter: 'blur(12px)'
        }}>
          <ReviewTerminal 
            assignment={{
              user: activeReview.student.toString().slice(0, 8) + '...',
              topic: activeReview.contentUrl
            }} 
            onClose={() => setActiveReview(null)}
            onSubmit={async (grade, comment) => {
              await submitReview(activeReview.publicKey, grade, comment);
              setActiveReview(null);
            }}
          />
        </div>
      )}

      {/* Stats Row */}
      <div className="dashboard-grid">
        <div className="glass-card stat-card">
          <span className="label">Current Reputation</span>
          <div className="stat-value text-gradient">{userStats?.reputation.toString() || '0'}</div>
          <div className="stat-change positive">
            <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />
            +0% from last week
          </div>
        </div>
        
        <div className="glass-card stat-card" style={{ gridColumn: 'span 2' }}>
          <span className="label">Academic Growth Pattern</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '60px', marginTop: '1rem' }}>
            {[30, 45, 35, 60, 50, 75, 80].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, borderRadius: '2px', border: '1px solid var(--glass-border)', background: i === 6 ? 'var(--accent-cyan)' : 'var(--glass-bg)' }}></div>
            ))}
          </div>
        </div>

        <div className="glass-card stat-card">
          <span className="label">Completed Work</span>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{userStats?.completedAssignments || 0} Projects</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{userStats?.completedReviews || 0} Peer Reviews</p>
        </div>
      </div>

      {/* Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '3rem' }}>
        {/* Quick Actions */}
        <section className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', background: 'var(--glass-bg)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
            <Award size={40} className="text-gradient" />
          </div>
          <div>
            <h3>Ready to contribute?</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Submit your work for peer assessment or help others grow by providing reviews.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              <Plus size={18} /> New Assignment
            </button>
            <button className="btn btn-outline">
              Explore Research
            </button>
          </div>
        </section>

        {/* Recent Activity Mini-List */}
        <section className="glass-card">
          <h3 style={{ marginBottom: '1.5rem' }}>Protocol Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assignments.slice(0, 3).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: (item.status.submitted || item.status.Submitted) ? 'var(--accent-cyan)' : '#00ff88' }}></div>
                <div style={{ flex: 1, fontSize: '0.9rem' }}>{item.contentUrl.slice(0, 30)}...</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{(item.status.submitted || item.status.Submitted) ? 'Pending' : 'Graded'}</div>
              </div>
            ))}
            {assignments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                <Sparkles size={24} style={{ marginBottom: '0.5rem' }} />
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
