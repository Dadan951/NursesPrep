import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserAvatar from './UserAvatar';
import NursesLogo from './NursesLogo';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     '#f8f9ff',
  bgDark: '#090f1e',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  text:   '#1e1b4b',
  sub:    '#6366f1',
  muted:  '#94a3b8',
  border: '#e0e7ff',
  borderDark: '#1e2d50',
  hover:  '#EEF2FF',
  hoverDark: '#131f38',
};

/* ─── Nav link definitions ───────────────────────────────────────────────── */
const studentLinks = [
  {
    to: '/dashboard', label: 'Tableau de bord', exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/quiz', label: 'Quiz',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/history', label: 'Mes résultats',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/flashcards', label: 'Flashcards',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/cours', label: 'Cours & Fiches',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/exercises', label: 'Exercices',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/annales', label: 'Annales',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/medicaments', label: 'Médicaments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/groups', label: 'Groupes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/support', label: 'Support',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/subscription', label: 'Abonnement',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
  },
];

const adminLinks = [
  {
    to: '/admin', label: 'Dashboard', exact: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    to: '/admin/users', label: 'Utilisateurs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/admin/quizzes', label: 'Quiz',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/admin/flashcards', label: 'Flashcards',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/>
      </svg>
    ),
  },
  {
    to: '/admin/exercises', label: 'Exercices',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/admin/annales', label: 'Annales',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: '/admin/medicaments', label: 'Médicaments',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
      </svg>
    ),
  },
  {
    to: '/admin/tickets', label: 'Tickets Support',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/admin/lessons', label: 'Cours & Fiches',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
];

/* ─── Section label ──────────────────────────────────────────────────────── */
function SectionLabel({ children, isDark }) {
  return (
    <p style={{
      padding: '18px 12px 6px',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: isDark ? '#334155' : '#a5b4fc',
      userSelect: 'none',
    }}>
      {children}
    </p>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
export default function Sidebar({ isAdmin = false, onClose, onSearch }) {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  const mainLinks  = !isAdmin ? links.slice(0, 8) : links;
  const extraLinks = !isAdmin ? links.slice(8) : [];

  const bg     = isDark ? C.bgDark : C.bg;
  const border = isDark ? C.borderDark : C.border;

  return (
    <aside style={{
      width: 232,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: isDark
        ? 'linear-gradient(180deg,#090f1e 0%,#0d1525 100%)'
        : 'linear-gradient(180deg,#ffffff 0%,#f4f6ff 100%)',
      borderRight: `1px solid ${border}`,
    }}>

      {/* Orb de fond */}
      <div style={{
        position: 'absolute', top: -24, right: -24, width: 120, height: 120,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,#a5b4fc,transparent)',
        opacity: isDark ? 0.08 : 0.35, filter: 'blur(24px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 80, left: -32, width: 100, height: 100,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,#c4b5fd,transparent)',
        opacity: isDark ? 0.06 : 0.2, filter: 'blur(30px)',
      }}/>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={onClose}>
          <NursesLogo size="sm" />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isAdmin && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
              background: `${C.indigo}18`, color: C.indigo,
              border: `1px solid ${C.indigo}30`,
            }}>Admin</span>
          )}
          {onClose && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="lg:hidden"
              style={{
                width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDark ? '#1e2d50' : C.hover, border: `1px solid ${border}`, cursor: 'pointer',
              }}
              aria-label="Fermer le menu">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* ── Recherche ─────────────────────────────────────────────────── */}
      {!isAdmin && onSearch && (
        <div style={{ padding: '10px 10px 2px', position: 'relative', zIndex: 10 }}>
          <button
            onClick={onSearch}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              background: isDark ? '#131f38' : C.hover,
              border: `1.5px solid ${border}`,
              transition: 'all 0.18s',
            }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 12, color: isDark ? '#4a5568' : '#a5b4fc', flex: 1 }}>Rechercher…</span>
            <kbd style={{
              display: 'flex', alignItems: 'center', gap: 2, fontSize: 9,
              color: isDark ? '#334155' : '#a5b4fc',
              border: `1px solid ${border}`, borderRadius: 5, padding: '2px 5px', lineHeight: 1,
            }}>⌘K</kbd>
          </button>
        </div>
      )}

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto', position: 'relative', zIndex: 10 }}>

        {!isAdmin && <SectionLabel isDark={isDark}>Menu principal</SectionLabel>}

        {(isAdmin ? links : mainLinks).map((link, i) => (
          <motion.div key={link.to}
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.035, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            <NavLink
              to={link.to}
              end={link.exact}
              onClick={onClose}
              style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
              {({ isActive }) => (
                <div style={{
                  position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 12, overflow: 'hidden',
                  cursor: 'pointer', transition: 'background 0.18s',
                  background: isActive
                    ? 'transparent'
                    : 'transparent',
                }}>
                  {/* Active pill */}
                  {isActive && (
                    <motion.div
                      layoutId={isAdmin ? 'admin-pill' : 'student-pill'}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 12,
                        background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                        boxShadow: '0 4px 12px rgba(79,70,229,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {/* Hover shimmer */}
                  {!isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 12,
                        background: isDark ? C.hoverDark : C.hover,
                      }}
                    />
                  )}
                  {/* Icon */}
                  <span style={{
                    position: 'relative', zIndex: 1, flexShrink: 0,
                    color: isActive ? '#fff' : isDark ? '#4a6080' : C.sub,
                    transition: 'color 0.18s',
                    display: 'flex', alignItems: 'center',
                  }}>
                    {link.icon}
                  </span>
                  {/* Label */}
                  <span style={{
                    position: 'relative', zIndex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#fff' : isDark ? '#64748b' : C.text,
                    transition: 'color 0.18s, font-weight 0.18s',
                    lineHeight: 1,
                  }}>
                    {link.label}
                  </span>
                </div>
              )}
            </NavLink>
          </motion.div>
        ))}

        {!isAdmin && extraLinks.length > 0 && (
          <>
            <SectionLabel isDark={isDark}>Compte</SectionLabel>
            {extraLinks.map((link, i) => (
              <motion.div key={link.to}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (mainLinks.length + i) * 0.035, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                <NavLink
                  to={link.to}
                  end={link.exact}
                  onClick={onClose}
                  style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
                  {({ isActive }) => (
                    <div style={{
                      position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 10px', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                    }}>
                      {isActive && (
                        <motion.div
                          layoutId="student-pill"
                          style={{
                            position: 'absolute', inset: 0, borderRadius: 12,
                            background: 'linear-gradient(135deg,#4F46E5,#7C3AED)',
                            boxShadow: '0 4px 12px rgba(79,70,229,0.35), 0 1px 0 rgba(255,255,255,0.15) inset',
                          }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          style={{
                            position: 'absolute', inset: 0, borderRadius: 12,
                            background: isDark ? C.hoverDark : C.hover,
                          }}
                        />
                      )}
                      <span style={{
                        position: 'relative', zIndex: 1, flexShrink: 0,
                        color: isActive ? '#fff' : isDark ? '#4a6080' : C.sub,
                        display: 'flex', alignItems: 'center',
                      }}>
                        {link.icon}
                      </span>
                      <span style={{
                        position: 'relative', zIndex: 1, fontSize: 13, fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#fff' : isDark ? '#64748b' : C.text,
                      }}>
                        {link.label}
                      </span>
                    </div>
                  )}
                </NavLink>
              </motion.div>
            ))}
          </>
        )}
      </nav>

      {/* ── User section ─────────────────────────────────────────────── */}
      <div style={{
        padding: '10px 10px',
        borderTop: `1px solid ${border}`,
        position: 'relative', zIndex: 10,
        background: isDark ? 'rgba(9,15,30,0.9)' : 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(8px)',
      }}>
        <NavLink
          to="/dashboard/profile"
          onClick={onClose}
          style={{ textDecoration: 'none', display: 'block', marginBottom: 4 }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12,
              background: isActive
                ? (isDark ? '#131f38' : C.hover)
                : 'transparent',
              cursor: 'pointer', transition: 'background 0.18s',
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isDark ? C.hoverDark : C.hover; }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <UserAvatar name={user?.name} avatar={user?.avatar} size="sm" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: isDark ? '#e2e8f0' : C.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
                <p style={{ fontSize: 10, color: C.muted,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>{user?.email}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          )}
        </NavLink>

        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'transparent', fontSize: 13, fontWeight: 500,
            color: '#f87171', transition: 'background 0.18s, color 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f87171'; }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
