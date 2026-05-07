'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { useWallet } from '@solana/wallet-adapter-react';
import { useZcgContext } from '@/context/ZcgContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();
  const { userStats, loading, initializeUser, requestAirdrop } = useZcgContext();
  const [userName, setUserName] = useState('');

  const handleRegister = async () => {
    if (!userName) return;
    await initializeUser(userName);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {/* Registration Overlay if not registered */}
        {connected && !userStats && !loading && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            backdropFilter: 'blur(20px)'
          }}>
            <div className="glass-card" style={{ width: '400px', padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'var(--accent-cyan)', borderRadius: '16px', margin: '0 auto 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={32} color="#000" />
              </div>
              <h2 style={{ marginBottom: '1rem' }}>Initialize Scholar Identity</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Your wallet is connected, but not yet registered on the ZAYNAB Protocol.
              </p>
              <input 
                type="text" 
                className="glass" 
                placeholder="Enter your Scholar Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', border: '1px solid var(--glass-border)', background: 'none', color: 'white', borderRadius: '8px' }}
              />
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRegister} disabled={loading}>
                {loading ? <Loader2 className="pulse" /> : "Create Identity"}
              </button>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', borderStyle: 'dashed' }} onClick={requestAirdrop} disabled={loading}>
                Request Devnet Airdrop (1 SOL)
              </button>
            </div>
          </div>
        )}
        
        {children}
      </main>
    </div>
  );
}
