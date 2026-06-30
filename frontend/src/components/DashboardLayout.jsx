import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import NursesLogo from './NursesLogo';
import SearchModal from './SearchModal';

export default function DashboardLayout({ children, isAdmin = false }) {
  const [open,       setOpen]       = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(s => !s);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close sidebar when navigating (on mobile)
  useEffect(() => { setOpen(false); }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--theme-bg)' }}>
      {/* Mobile overlay */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          className="lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
        lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar isAdmin={isAdmin} onClose={() => setOpen(false)} onSearch={() => setSearchOpen(true)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar — thémée */}
        <header
          className="lg:hidden sticky top-0 z-30"
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 16px',
            background: 'var(--theme-hero)',
            borderBottom: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
          }}>
          <button
            onClick={() => setOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
            }}
            aria-label="Ouvrir le menu">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <NursesLogo size="xs" light />
          </Link>
          <button
            onClick={() => setSearchOpen(true)}
            style={{
              marginLeft: 'auto', width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)',
              cursor: 'pointer',
            }}
            aria-label="Rechercher">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          {isAdmin && (
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.18)', color: '#fff',
            }}>Admin</span>
          )}
        </header>

        {children}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
