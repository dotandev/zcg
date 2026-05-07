'use client';

import React from 'react';
import { 
  BookMarked, 
  ArrowUpRight, 
  Ghost,
  ExternalLink,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useZcgContext } from '@/context/ZcgContext';
import { TopBar } from '@/components/TopBar';

export default function AssignmentsPage() {
  const { assignments, userStats, finalizeAssignment } = useZcgContext();

  return (
    <>
      <TopBar userName={userStats?.name} />
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Assignments</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track and manage your scholarly submissions on the protocol.</p>
      </div>

      <div className="glass" style={{ overflow: 'hidden' }}>
        {assignments.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reviews</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Grade</th>
                <th style={{ padding: '1.25rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((item, i) => {
                const isFinalized = item.status.finalized || item.status.Finalized;
                return (
                  <tr key={i} style={{ borderBottom: i === assignments.length - 1 ? 'none' : '1px solid var(--glass-border)', transition: 'var(--transition)' }} className="hover-row">
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookMarked size={20} color="var(--accent-cyan)" />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500', fontSize: '0.95rem' }}>{item.contentUrl}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>PDA: {item.publicKey.toString().slice(0, 12)}...</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {isFinalized ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(0, 255, 136, 0.1)', color: '#00ff88', fontSize: '0.75rem', fontWeight: '600' }}>
                            <CheckCircle2 size={12} /> Finalized
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', background: 'rgba(0, 242, 255, 0.1)', color: 'var(--accent-cyan)', fontSize: '0.75rem', fontWeight: '600' }}>
                            <Clock size={12} /> In Review
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ fontSize: '0.9rem' }}>{item.reviewCount} / 3</div>
                      <div style={{ width: '80px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                        <div style={{ width: `${(item.reviewCount / 3) * 100}%`, height: '100%', background: 'var(--accent-cyan)' }}></div>
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '700', color: isFinalized ? 'white' : 'var(--text-dim)' }}>
                        {isFinalized ? `${item.averageGrade}%` : '--'}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {!isFinalized && item.reviewCount >= 1 && (
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.7rem' }}
                            onClick={() => finalizeAssignment(item.publicKey)}
                          >
                            Finalize
                          </button>
                        )}
                        <a href={item.contentUrl} target="_blank" className="btn btn-outline" style={{ padding: '0.4rem', border: 'none' }}>
                          <ExternalLink size={18} />
                        </a>
                        <button className="btn btn-outline" style={{ padding: '0.4rem', border: 'none' }}>
                          <ArrowUpRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            <Ghost size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
            <h3>No assignments found</h3>
            <p style={{ marginTop: '0.5rem' }}>You haven't submitted any work to the protocol yet.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .hover-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }
      `}</style>
    </>
  );
}
