'use client';

import React from 'react';
import { Search, Bell, Sun, Moon } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useTheme } from '@/context/ThemeContext';

interface TopBarProps {
  userName?: string;
}

export function TopBar({ userName }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
      <div>
        <h1 style={{ fontSize: '2rem' }}>Welcome back, <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{userName || 'Scholar'}</span></h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            type="text" 
            placeholder="Search protocols..." 
            style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', fontSize: '0.9rem' }} 
          />
        </div>
        <button 
          className="glass" 
          style={{ padding: '0.75rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} color="var(--text-secondary)" /> : <Moon size={20} color="var(--text-secondary)" />}
        </button>
        <button className="glass" style={{ padding: '0.75rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bell size={20} color="var(--text-secondary)" />
        </button>
        <WalletMultiButton />
      </div>
    </header>
  );
}
