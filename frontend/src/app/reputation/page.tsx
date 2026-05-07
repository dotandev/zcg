'use client';

import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Target, 
  Zap, 
  History,
  Info,
  Scale,
  Award
} from 'lucide-react';
import { useZcgContext } from '@/context/ZcgContext';
import { TopBar } from '@/components/TopBar';

export default function ReputationPage() {
  const { userStats } = useZcgContext();

  const reputationValue = userStats?.reputation.toString() || '0';
  const completedAssignments = userStats?.completedAssignments || 0;
  const completedReviews = userStats?.completedReviews || 0;

  return (
    <>
      <TopBar userName={userStats?.name} />
      
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Scholar Reputation</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Detailed breakdown of your standing within the ZAYNAB Protocol.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Reputation Main Card */}
          <section className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.05) 0%, rgba(138, 43, 226, 0.05) 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
              <Award size={200} />
            </div>
            
            <span className="label">On-Chain Reputation</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginTop: '1rem' }}>
              <h1 style={{ fontSize: '5rem', lineHeight: 1 }} className="text-gradient">{reputationValue}</h1>
              <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '500' }}>REP</span>
            </div>
            
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2.5rem' }}>
              <div style={{ flex: 1, padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-cyan)' }}>
                  <Target size={16} /> Accuracy
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>98.4%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Consensus Agreement</div>
              </div>
              <div style={{ flex: 1, padding: '1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--accent-purple)' }}>
                  <Zap size={16} /> Velocity
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>High</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Review Turnaround</div>
              </div>
            </div>
          </section>

          {/* Detailed Breakdown */}
          <section className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <History size={20} color="var(--accent-cyan)" /> Reputation Factors
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'Base Enrollment', value: '+100', color: 'var(--text-primary)', desc: 'Initial protocol registration' },
                { name: 'Completed Submissions', value: `+${completedAssignments * 50}`, color: '#00ff88', desc: 'Rewarding successful work' },
                { name: 'Consensus Reviews', value: `+${completedReviews * 10}`, color: '#00ff88', desc: 'Contributing to peer evaluation' },
                { name: 'Slashing Incidents', value: '0', color: '#ff3366', desc: 'Penalties for malicious reviews' },
              ].map((factor, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{factor.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{factor.desc}</div>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: factor.color }}>{factor.value}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Governance Section */}
          <section className="glass-card" style={{ border: '1px solid rgba(0, 242, 255, 0.1)' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Scale size={20} color="var(--accent-cyan)" /> Governance Weight
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Your reputation directly translates to your voting power in protocol governance and your eligibility for high-tier research reviews.
            </p>
            <div style={{ padding: '1rem', borderRadius: '8px', background: 'rgba(0, 242, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)', textAlign: 'center' }}>
              <div className="label">Current Tier</div>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>Lead Scholar</div>
            </div>
          </section>

          {/* Reputation Logic Tip */}
          <section className="glass-card" style={{ background: 'none', borderStyle: 'dashed' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Info size={24} color="var(--text-dim)" />
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>How it works</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  ZAYNAB uses a **Consensus Grading** model. If your grade for a peer matches the eventual group average, your reputation increases. If you deviate significantly without justification, your reputation is slashed.
                </p>
              </div>
            </div>
          </section>

          {/* Trust Level */}
          <section className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem' }}>Network Trust Level</h4>
              <ShieldCheck size={18} color="#00ff88" />
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(to right, var(--accent-cyan), #00ff88)' }}></div>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.75rem' }}>
              Your trust level is calculated based on 32 distinct on-chain interactions.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
