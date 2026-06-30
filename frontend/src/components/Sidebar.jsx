import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';
import NursesLogo from './NursesLogo';

/* ─── Couleurs sur fond hero (dark gradient) ─────────────────────────────── */
const W = {
  text:   'rgba(255,255,255,0.92)',
  sub:    'rgba(255,255,255,0.55)',
  muted:  'rgba(255,255,255,0.38)',
  border: 'rgba(255,255,255,0.12)',
  hover:  'rgba(255,255,255,0.08)',
  active: 'rgba(255,255,255,0.16)',
};

/* ─── Nav links ──────────────────────────────────────────────────────────── */
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

function SectionLabel({ children }) {
  return (
    <p style={{
      padding: '18px 12px 6px',
      fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: W.muted, userSelect: 'none',
    }}>
      {children}
    </p>
  );
}

/* ─── NavItem ──────────────────────────────────────────────────────────── */
function NavItem({ link, pillId, delay, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
      <NavLink
        to={link.to} end={link.exact} onClick={onClose}
        style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}>
        {({ isActive }) => (
          <div style={{
            position: 'relative', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
          }}>
            {/* Active pill — frosted glass blanc */}
            {isActive && (
              <motion.div
                layoutId={pillId}
                style={{
                  position: 'absolute', inset: 0, borderRadius: 12,
                  background: W.active,
                  border: '1px solid rgba(255,255,255,0.22)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18), 0 1px 0 rgba(255,255,255,0.18) inset',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {/* Hover shimmer */}
            {!isActive && (
              <motion.div
                initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
                style={{ position: 'absolute', inset: 0, borderRadius: 12, background: W.hover }}
              />
            )}
            {/* Icon */}
            <span style={{
              position: 'relative', zIndex: 1, flexShrink: 0, display: 'flex', alignItems: 'center',
              color: isActive ? W.text : W.sub, transition: 'color 0.18s',
            }}>
              {link.icon}
            </span>
            {/* Label */}
            <span style={{
              position: 'relative', zIndex: 1, fontSize: 13,
              fontWeight: isActive ? 700 : 500, lineHeight: 1,
              color: isActive ? W.text : W.sub, transition: 'color 0.18s',
            }}>
              {link.label}
            </span>
          </div>
        )}
      </NavLink>
    </motion.div>
  );
}

/* ─── Sidebar ────────────────────────────────────────────────────────────── */
export default function Sidebar({ isAdmin = false, onClose, onSearch }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = isAdmin ? adminLinks : studentLinks;

  const handleLogout = () => { logout(); navigate('/'); };

  const mainLinks  = !isAdmin ? links.slice(0, 8) : links;
  const extraLinks = !isAdmin ? links.slice(8) : [];

  return (
    <aside style={{
      width: 232, height: '100%',
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
      background: 'var(--theme-hero)',
      borderRight: `1px solid ${W.border}`,
      transition: 'background 0.4s ease',
    }}>

      {/* Orbs décoratifs blancs */}
      <div style={{
        position: 'absolute', top: -24, right: -24, width: 130, height: 130,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(255,255,255,0.14),transparent)',
        filter: 'blur(28px)',
      }}/>
      <div style={{
        position: 'absolute', bottom: 80, left: -32, width: 110, height: 110,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent)',
        filter: 'blur(32px)',
      }}/>
      <div style={{
        position: 'absolute', top: '45%', right: -16, width: 80, height: 80,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle,rgba(255,255,255,0.06),transparent)',
        filter: 'blur(20px)',
      }}/>

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px',
        borderBottom: `1px solid ${W.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }} onClick={onClose}>
          <NursesLogo size="sm" light />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isAdmin && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
              background: 'rgba(255,255,255,0.15)', color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}>Admin</span>
          )}
          {onClose && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="lg:hidden"
              style={{
                width: 28, height: 28, borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.12)', border: `1px solid ${W.border}`, cursor: 'pointer',
              }}
              aria-label="Fermer le menu">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
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
              background: 'rgba(255,255,255,0.08)',
              border: `1.5px solid ${W.border}`,
              transition: 'background 0.18s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.13)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={W.sub} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 12, color: W.muted, flex: 1 }}>Rechercher…</span>
            <kbd style={{
              display: 'flex', alignItems: 'center', gap: 2, fontSize: 9,
              color: W.muted, border: `1px solid ${W.border}`,
              borderRadius: 5, padding: '2px 5px', lineHeight: 1,
            }}>⌘K</kbd>
          </button>
        </div>
      )}

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto', position: 'relative', zIndex: 10 }}>

        {!isAdmin && <SectionLabel>Menu principal</SectionLabel>}

        {(isAdmin ? links : mainLinks).map((link, i) => (
          <NavItem
            key={link.to} link={link}
            pillId={isAdmin ? 'admin-pill' : 'student-pill'}
            delay={i * 0.035} onClose={onClose}
          />
        ))}

        {!isAdmin && extraLinks.length > 0 && (
          <>
            <SectionLabel>Compte</SectionLabel>
            {extraLinks.map((link, i) => (
              <NavItem
                key={link.to} link={link}
                pillId="student-pill"
                delay={(mainLinks.length + i) * 0.035} onClose={onClose}
              />
            ))}
          </>
        )}
      </nav>

      {/* ── User section ─────────────────────────────────────────────── */}
      <div style={{
        padding: '10px',
        borderTop: `1px solid ${W.border}`,
        position: 'relative', zIndex: 10,
        background: 'rgba(0,0,0,0.15)',
        backdropFilter: 'blur(8px)',
      }}>
        <NavLink
          to="/dashboard/profile" onClick={onClose}
          style={{ textDecoration: 'none', display: 'block', marginBottom: 4 }}>
          {({ isActive }) => (
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12,
                background: isActive ? W.active : 'transparent',
                border: isActive ? `1px solid rgba(255,255,255,0.2)` : '1px solid transparent',
                cursor: 'pointer', transition: 'background 0.18s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = W.hover; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
              <UserAvatar name={user?.name} avatar={user?.avatar} size="sm" />
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{
                  fontSize: 12, fontWeight: 700, color: W.text,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{user?.name}</p>
                <p style={{
                  fontSize: 10, color: W.muted, marginTop: 1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{user?.email}</p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={W.sub} strokeWidth="2" style={{ flexShrink: 0 }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
          )}
        </NavLink>

        <motion.button
          whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 10px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: 'transparent', fontSize: 13, fontWeight: 500,
            color: 'rgba(248,113,113,0.85)', transition: 'background 0.18s, color 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#fca5a5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(248,113,113,0.85)'; }}>
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
