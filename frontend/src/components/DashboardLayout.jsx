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
    <div className="flex h-screen overflow-hidden bg-blue-50/50 dark:bg-slate-950">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
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
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-blue-100 shadow-sm dark:bg-slate-900 dark:border-slate-700">
          <button
            onClick={() => setOpen(true)}
            className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition flex-shrink-0"
            aria-label="Ouvrir le menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <NursesLogo size="xs" />
          </Link>
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="ml-auto w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition flex-shrink-0"
            aria-label="Rechercher"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
          {isAdmin && (
            <span className="text-xs font-bold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">Admin</span>
          )}
        </header>

        {children}
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
