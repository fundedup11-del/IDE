"use client";
import React, { useState } from 'react';
import { Button } from './Button';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-muted)', color: 'var(--text-default)', fontFamily: 'var(--font-sans)' }}>
      <header style={{ position: 'sticky', top: 0, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-4)', background: 'var(--surface-foreground)', borderBottom: '1px solid var(--border)', zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <strong style={{ fontSize: '18px' }}>ExternAI</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="ghost" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close' : 'Menu'}</Button>
        </div>
      </header>

      <div style={{ display: 'flex', gap: 'var(--space-6)', padding: 'var(--space-6)' }}>
        <aside style={{ width: 240, background: 'var(--card-background)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-sm)', display: window.innerWidth < 768 && !open ? 'none' : 'block' }}>
          <nav aria-label="Main Navigation">
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><a href="#" style={{ color: 'var(--text-default)' }}>Dashboard</a></li>
              <li><a href="#" style={{ color: 'var(--text-default)' }}>Products</a></li>
              <li><a href="#" style={{ color: 'var(--text-default)' }}>Settings</a></li>
            </ul>
          </nav>
        </aside>

        <main style={{ flex: 1, maxWidth: 1200 }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
