'use client';

import React, { useState, useEffect } from 'react';
import { useZcgContext } from '@/context/ZcgContext';
import { TopBar } from '@/components/TopBar';
import { Users, Plus, Hash, Send, UserCheck, Shield } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

export default function ChannelsPage() {
  const { userStats, createChannel, sendInvite, assignments, program } = useZcgContext();
  const [channelName, setChannelName] = useState('');
  const [invitePeer, setInvitePeer] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [channels, setChannels] = useState<any[]>([]);

  // Fetch channels from the program
  useEffect(() => {
    if (!program) return;
    const fetchChannels = async () => {
      try {
        const data = await (program.account as any).channel.all();
        setChannels(data.map((c: any) => ({
          publicKey: c.publicKey,
          ...c.account
        })));
      } catch (e) {
        console.error("Fetch Channels Error:", e);
      }
    };
    fetchChannels();
  }, [program]);

  const handleCreateChannel = async () => {
    if (!channelName) return;
    await createChannel(channelName);
    setChannelName('');
  };

  const handleSendInvite = async () => {
    if (!invitePeer || !selectedAssignment) return;
    try {
      const receiverPubKey = new PublicKey(invitePeer);
      const assignmentPubKey = new PublicKey(selectedAssignment);
      await sendInvite(receiverPubKey, assignmentPubKey);
      setInvitePeer('');
    } catch (e) {
      alert("Invalid Public Key provided.");
    }
  };

  return (
    <div className="fade-in">
      <TopBar userName={userStats?.name} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Research Channels</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Create Channel */}
            <section className="glass-card">
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Plus size={20} color="var(--accent-cyan)" /> New Channel
              </h3>
              <div className="input-group">
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Channel name (e.g. quantum-computing)" 
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleCreateChannel}>Create</button>
                </div>
              </div>
            </section>

            {/* Active Channels List */}
            <section className="glass-card">
              <h3 style={{ marginBottom: '1.5rem' }}>Active Domains</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {channels.length === 0 ? (
                  <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>No channels active on-chain yet.</p>
                ) : (
                  channels.map((ch) => (
                    <div key={ch.publicKey.toString()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'var(--glass-bg)', borderRadius: '8px', color: 'var(--accent-cyan)' }}>
                          <Hash size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600' }}>{ch.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ch.memberCount} Scholars</div>
                        </div>
                      </div>
                      <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Join</button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Collaboration</h2>
          
          <section className="glass-card">
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Send size={20} color="var(--accent-purple)" /> Peer Invitation
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Directly invite a high-reputation scholar to assess your work.
            </p>

            <div className="input-group">
              <label className="input-label">Select Assignment</label>
              <select 
                className="input-field" 
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)' }}
              >
                <option value="">Choose a submission...</option>
                {assignments.map(a => (
                  <option key={a.publicKey.toString()} value={a.publicKey.toString()}>{a.contentUrl}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Scholar Wallet Address</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Paste wallet address" 
                value={invitePeer}
                onChange={(e) => setInvitePeer(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleSendInvite}>
              <UserCheck size={18} /> Send Invitation
            </button>
          </section>

          <section className="glass-card" style={{ marginTop: '2rem', borderStyle: 'dashed' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Shield size={24} color="var(--accent-cyan)" />
              <div>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Invitation Benefits</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Invited reviews carry higher governance weight and provide double reputation bonuses for the assessor.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
