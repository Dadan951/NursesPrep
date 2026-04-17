import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from './UserAvatar';
import NursesLogo from './NursesLogo';

/* ─── Nav link definitions ───────────────────────────────────────────────── */
const studentLinks = [
  {
    to: '/dashboard', label: 'Tableau de bord', exact: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/quiz', label: 'Quiz',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/flashcards', label: 'Flashcards',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/cours', label: 'Cours & Fiches',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/exercises', label: 'Exercices',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/annales', label: 'Annales',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/medicaments', label: 'Médicaments',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/groups', label: 'Groupes',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/support', label: 'Support',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/subscription', label: 'Abonnement',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
];

const adminLinks = [
  {
    to: '/admin', label: 'Dashboard', exact: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/admin/users', label: 'Utilisateurs',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/admin/quizzes', label: 'Quiz',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/admin/flashcards', label: 'Flashcards',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/>
      </svg>
    ),
  },
  {
    to: '/admin/exercises', label: 'Exercices',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/admin/annales', label: 'Annales',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: '/admin/medicaments', label: 'Médicaments',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    to: '/admin/tickets', label: 'Tickets Support',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/admin/lessons', label: 'Cours & Fiches',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
];

/* ─── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <p className="px-3 pt-5 pb-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500 select-none">
      {children}
    </p>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
export default function Sidebar({ isAdmin = false, onClose }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  /* Split student links into groups */
  const mainLinks  = !isAdmin ? links.slice(0, 7) : links;
  const extraLinks = !isAdmin ? links.slice(7)    : [];

  return (
    <aside className="w-60 h-full flex flex-col relative overflow-hidden"
      style={{
        background: isDark
          ? 'linear-gradient(180deg,#0a1628 0%,#0f1f3f 100%)'
          : 'linear-gradient(180deg,#ffffff 0%,#f8faff 100%)',
        borderRight: isDark ? '1px solid #1e3a5f' : '1px solid #dbeafe',
      }}>

      {/* Subtle bg orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,#bfdbfe,transparent)', opacity: 0.4, filter: 'blur(20px)' }}/>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="px-5 py-4 border-b border-blue-100 flex items-center justify-between relative z-10">
        <Link to="/" className="hover:opacity-80 transition-opacity" onClick={onClose}>
          <NursesLogo size="sm" />
        </Link>
        {isAdmin && (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">Admin</span>
        )}
        {onClose && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition flex-shrink-0"
            aria-label="Fermer le menu"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </motion.button>
        )}
      </div>

      {/* ── Nav links ─────────────────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto relative z-10">

        {!isAdmin && <SectionLabel>Menu principal</SectionLabel>}

        {(isAdmin ? links : mainLinks).map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <NavLink
              to={link.to}
              end={link.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 relative overflow-hidden ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/80'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active gradient background */}
                  {isActive && (
                    <motion.div
                      layoutId={isAdmin ? 'admin-pill' : 'student-pill'}
                      className="absolute inset-0 rounded-xl"
                      style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Hover shimmer */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: isDark ? 'linear-gradient(135deg,#162032,#1a2742)' : 'linear-gradient(135deg,#eff6ff,#e0f2fe)' }}/>
                  )}
                  <span className={`relative z-10 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-600'}`}>
                    {link.icon}
                  </span>
                  <span className="relative z-10">{link.label}</span>
                </>
              )}
            </NavLink>
          </motion.div>
        ))}

        {!isAdmin && extraLinks.length > 0 && (
          <>
            <SectionLabel>Compte</SectionLabel>
            {extraLinks.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (mainLinks.length + i) * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <NavLink
                  to={link.to}
                  end={link.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 relative overflow-hidden ${
                      isActive
                        ? 'text-white shadow-md'
                        : 'text-slate-600 hover:text-blue-700'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.div
                          layoutId="student-pill"
                          className="absolute inset-0 rounded-xl"
                          style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ background: isDark ? 'linear-gradient(135deg,#162032,#1a2742)' : 'linear-gradient(135deg,#eff6ff,#e0f2fe)' }}/>
                      )}
                      <span className={`relative z-10 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-blue-400 group-hover:text-blue-600'}`}>
                        {link.icon}
                      </span>
                      <span className="relative z-10">{link.label}</span>
                    </>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </>
        )}
      </nav>

      {/* ── User section ─────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-blue-100 relative z-10 bg-white/80 backdrop-blur-sm">
        <NavLink
          to="/dashboard/profile"
          onClick={onClose}
          className={({ isActive }) =>
            `group flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
              isActive ? 'bg-blue-50' : 'hover:bg-blue-50/80'
            }`
          }
        >
          <UserAvatar name={user?.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="flex-shrink-0">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </NavLink>

        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Déconnexion
        </motion.button>
      </div>
    </aside>
  );
}
