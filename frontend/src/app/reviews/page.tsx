'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles,
  Award,
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useZcgContext } from '@/context/ZcgContext';
import { TopBar } from '@/components/TopBar';
import { ReviewTerminal } from '@/components/ReviewTerminal';

export default function ReviewsPage() {
  const { reviewQueue, userStats, submitReview } = useZcgContext();
  const [activeReview, setActiveReview] = useState<any | null>(null);

  return (
    <>
      <TopBar userName={userStats?.name} />
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Review Queue</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Contribute to the consensus by evaluating peer submissions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {reviewQueue.length > 0 ? (
          reviewQueue.map((item, i) => (
            <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{item.student.toString().slice(0, 2).toUpperCase()}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Scholar {item.student.toString().slice(0, 6)}...</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Awaiting Consensus</div>
                  </div>
                </div>
                <a href={item.contentUrl} target="_blank" className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
                  <ExternalLink size={18} />
                </a>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', wordBreak: 'break-all' }}>{item.contentUrl}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>#research</span>
                  <span style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>#solana</span>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00ff88', fontSize: '0.8rem', fontWeight: '600' }}>
                  <Award size={14} /> +10 Rep
                </div>
                <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => setActiveReview(item)}>
                  Evaluate <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', color: 'var(--text-dim)', border: '2px dashed var(--glass-border)', borderRadius: 'var(--radius-lg)' }}>
            <Sparkles size={48} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <h3>No assignments pending</h3>
            <p style={{ marginTop: '0.5rem' }}>The queue is empty. You've earned some rest!</p>
          </div>
        )}
      </div>

      <div className="glass-card" style={{ marginTop: '3rem', background: 'linear-gradient(to right, rgba(0, 242, 255, 0.02), rgba(138, 43, 226, 0.02))' }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255, 255, 0, 0.05)', color: '#ffcc00' }}>
            <ShieldAlert size={32} />
          </div>
          <div>
            <h4 style={{ marginBottom: '0.25rem' }}>Review Integrity Policy</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Providing biased or malicious reviews will lead to significant reputation slashing. 
              The ZCG consensus algorithm cross-references your grades with other peers.
            </p>
          </div>
        </div>
      </div>

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
    </>
  );
}
