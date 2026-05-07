'use client';

import React, { useState } from 'react';
import { Terminal, Shield, CheckCircle, AlertTriangle, X, Send } from 'lucide-react';

interface ReviewTerminalProps {
  assignment: {
    user: string;
    topic: string;
  };
  onClose: () => void;
  onSubmit: (grade: number, comment: string) => void;
}

export const ReviewTerminal = ({ assignment, onClose, onSubmit }: ReviewTerminalProps) => {
  const [grade, setGrade] = useState(80);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(grade, comment);
    setIsSubmitting(false);
  };

  return (
    <div className="glass" style={{
      padding: '2rem',
      width: '500px',
      border: '1px solid var(--accent-cyan)',
      boxShadow: '0 0 30px rgba(0, 242, 255, 0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Terminal size={20} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>EVALUATION_TERMINAL_V1.0</h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ background: '#000', padding: '1rem', borderRadius: '4px', border: '1px solid #222', marginBottom: '1.5rem' }}>
        <p style={{ color: '#00ff00', fontSize: '0.8rem', fontFamily: 'monospace' }}>
          {'>'} Loading assignment data...<br />
          {'>'} Source: {assignment.user}<br />
          {'>'} Topic: {assignment.topic}<br />
          {'>'} Verification Status: [AUTHENTICATED]
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label className="label">Evaluation Grade (0-100)</label>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{grade}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={grade}
          onChange={(e) => setGrade(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label className="label">Critical Assessment</label>
        <textarea 
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter technical feedback..."
          style={{ 
            width: '100%', 
            height: '100px', 
            background: 'rgba(255,255,255,0.02)', 
            border: '1px solid var(--glass-border)', 
            borderRadius: '4px',
            color: 'var(--text-primary)',
            padding: '0.75rem',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
      </div>

      <div className="glass" style={{ padding: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <Shield size={16} color="var(--accent-purple)" />
        <span>Submitting this review commits your reputation to the protocol.</span>
      </div>

      <button 
        className="btn btn-primary" 
        style={{ width: '100%', justifyContent: 'center' }}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        <Send size={18} /> {isSubmitting ? 'Finalizing Consensus...' : 'Submit Evaluation'}
      </button>
    </div>
  );
};
