import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import NursesLogo from './NursesLogo';

export default function DashboardLayout({ children, isAdmin = false }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close sidebar when navigating (on mobile)
  useEffect(() => { setOpen(false); }, []);

  return (
    <div className="flex min-h-screen bg-blue-50/50 dark:bg-slate-950">
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
        <Sidebar isAdmin={isAdmin} onClose={() => setOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
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
          {isAdmin && (
            <span className="ml-auto text-xs font-bold bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full">Admin</span>
          )}
        </header>

        {children}
      </div>
    </div>
  );
}
