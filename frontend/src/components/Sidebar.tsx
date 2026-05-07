'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckCircle2, 
  Settings, 
  Award,
  Users
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'My Assignments', href: '/assignments', icon: <BookOpen size={18} /> },
    { name: 'Review Queue', href: '/reviews', icon: <CheckCircle2 size={18} /> },
    { name: 'Research Channels', href: '/channels', icon: <Users size={18} /> },
    { name: 'Reputation', href: '/reputation', icon: <Award size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))', borderRadius: '8px' }}></div>
        <h2 style={{ fontSize: '1.25rem', letterSpacing: '0.1em', fontWeight: '800' }}>ZAYNAB</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className="btn btn-outline" 
              style={{ 
                justifyContent: 'flex-start', 
                background: isActive ? 'var(--glass-bg)' : 'transparent', 
                borderColor: isActive ? 'var(--accent-cyan)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--glass-border)' : 'none'
              }}
            >
              {item.icon} {item.name}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
        <Link 
          href="/settings" 
          className="btn btn-outline" 
          style={{ 
            width: '100%', 
            justifyContent: 'flex-start', 
            border: 'none',
            background: pathname === '/settings' ? 'var(--glass-bg)' : 'transparent',
            color: pathname === '/settings' ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
        >
          <Settings size={18} /> Settings
        </Link>
      </div>
    </aside>
  );
}
