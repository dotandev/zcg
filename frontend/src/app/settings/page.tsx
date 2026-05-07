'use client';

import React, { useState, useEffect } from 'react';
import { useZcgContext } from '@/context/ZcgContext';
import { TopBar } from '@/components/TopBar';
import { User, Save, Shield, Database, Droplets } from 'lucide-react';

export default function SettingsPage() {
  const { userStats, updateUser, requestAirdrop } = useZcgContext();
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (userStats?.name) {
      setNewName(userStats.name);
    }
  }, [userStats]);

  const handleUpdate = async () => {
    if (!newName || newName === userStats?.name) return;
    await updateUser(newName);
  };

  return (
    <div className="fade-in">
      <TopBar userName={userStats?.name} />
      
      <div style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Protocol Settings</h2>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Identity Section */}
          <section className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
                <User size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Scholar Identity</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Update your visible name on the ZAYNAB protocol.</p>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Scholar Name</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                />
                <button 
                  className="btn btn-primary" 
                  onClick={handleUpdate}
                  disabled={!newName || newName === userStats?.name}
                >
                  <Save size={18} /> Update
                </button>
              </div>
            </div>
          </section>

          {/* Network Section */}
          <section className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', background: 'var(--glass-bg)', borderRadius: '12px', color: 'var(--accent-purple)' }}>
                <Database size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Network & Storage</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Manage your connection to the Solana Devnet.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00ff88', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>
                  <Shield size={16} /> Connected to Devnet
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Transactions are currently being settled on the Solana test network.
                </p>
              </div>

              <div className="glass" style={{ padding: '1.5rem', borderRadius: '12px', borderStyle: 'dashed' }}>
                <div style={{ marginBottom: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>Developer Tools</div>
                <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={requestAirdrop}>
                  <Droplets size={18} /> Request 1 SOL Airdrop
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
