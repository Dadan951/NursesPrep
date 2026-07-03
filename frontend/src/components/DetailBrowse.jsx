import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════════════
   DetailBrowse — affichage « détaillé » (listes texte) pour les catalogues
   Quiz / Flashcards / Cours / Annales / Exercices.

   - useDisplayMode : 'simple' (cartes actuelles) | 'detail' (listes texte),
     persisté en localStorage, partagé entre toutes les rubriques.
   - ViewToggle : bouton segmenté à incruster dans le hero.
   - SlideLevel : animation de niveau — l'ancien niveau défile vers la
     gauche pendant que le nouveau arrive de la droite (et inversement
     quand on remonte).
   - DetailList : liste de lignes texte cliquables.
═══════════════════════════════════════════════════════════════════════════ */

const STORAGE_KEY = 'np-display-mode';

export function useDisplayMode() {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) || 'simple'; } catch { return 'simple'; }
  });
  const dirRef = useRef(1); // 1 = descente (droite→gauche), -1 = remontée
  const setDir = (d) => { dirRef.current = d; };
  const toggle = () => setMode(m => {
    const n = m === 'simple' ? 'detail' : 'simple';
    try { localStorage.setItem(STORAGE_KEY, n); } catch { /* */ }
    return n;
  });
  return { mode, toggle, dir: dirRef, setDir };
}

/* ─── Bouton segmenté pour le hero ─────────────────────────────────────── */
export function ViewToggle({ mode, onToggle }) {
  const seg = (active) => ({
    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 13px',
    borderRadius: 11, border: 'none', cursor: 'pointer', minHeight: 38,
    fontSize: 12, fontWeight: 700, fontFamily: 'Nunito,sans-serif',
    background: active ? '#fff' : 'transparent',
    color: active ? 'var(--theme-primary)' : 'rgba(255,255,255,0.75)',
    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.18)' : 'none',
    transition: 'all 0.2s',
  });
  return (
    <div role="group" aria-label="Mode d'affichage"
      style={{ display: 'flex', gap: 3, padding: 3, borderRadius: 14, background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', flexShrink: 0 }}>
      <button onClick={() => mode !== 'simple' && onToggle()} style={seg(mode === 'simple')} aria-pressed={mode === 'simple'}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        Simplifié
      </button>
      <button onClick={() => mode !== 'detail' && onToggle()} style={seg(mode === 'detail')} aria-pressed={mode === 'detail'}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Détaillé
      </button>
    </div>
  );
}

/* ─── Conteneur animé : glissement horizontal entre niveaux ────────────── */
const slideVariants = {
  enter:  (d) => ({ x: d > 0 ? '70%' : '-70%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:   (d) => ({ x: d > 0 ? '-70%' : '70%', opacity: 0 }),
};

export function SlideLevel({ id, dir = 1, children }) {
  return (
    <div style={{ position: 'relative', overflowX: 'clip' }}>
      <AnimatePresence mode="popLayout" custom={dir} initial={false}>
        <motion.div
          key={id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Liste texte cliquable ────────────────────────────────────────────── */
/* items: [{ key, label, sub, right (jsx), done (bool) }] */
export function DetailList({ items, onPick }) {
  return (
    <div style={{
      background: 'var(--theme-card, #fff)', borderRadius: 18,
      border: '1px solid var(--theme-border)', overflow: 'hidden',
      boxShadow: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.08)',
    }}>
      {items.map((item, i) => (
        <motion.button
          key={item.key}
          onClick={() => onPick(item.key, item)}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(i, 10) * 0.035, duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileTap={{ scale: 0.99 }}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 12,
            padding: '15px 18px', textAlign: 'left', cursor: 'pointer',
            background: 'transparent', border: 'none',
            borderBottom: i < items.length - 1 ? '1px solid var(--theme-border)' : 'none',
            transition: 'background 0.15s', minHeight: 54,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {item.done !== undefined && (
            <span style={{
              width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
              background: item.done ? '#22c55e' : 'var(--theme-border)',
              boxShadow: item.done ? '0 0 6px rgba(34,197,94,0.5)' : 'none',
            }} />
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--theme-text)', fontFamily: 'Nunito,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.label}
            </p>
            {item.sub && <p style={{ fontSize: 11.5, color: '#64748b', marginTop: 2 }}>{item.sub}</p>}
          </div>
          {item.right && <span style={{ flexShrink: 0 }}>{item.right}</span>}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Petit badge droit réutilisable ───────────────────────────────────── */
export function DetailBadge({ children, color = 'var(--theme-primary)', bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
      background: bg || 'rgba(var(--theme-primary-rgb),0.1)', color, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}
