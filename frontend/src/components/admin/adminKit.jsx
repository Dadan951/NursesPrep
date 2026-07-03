import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '../DashboardLayout';

/* ═══════════════════════════════════════════════════════════════════════════
   ADMIN KIT — primitives partagées par toutes les pages admin
   Design aligné sur les pages étudiantes : thème clair, clay 3D, hero thème.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Design tokens ────────────────────────────────────────────────────── */
export const C = {
  bg:      'var(--theme-bg)',
  card:    '#FFFFFF',
  text:    'var(--theme-text)',
  border:  'var(--theme-border)',
  primary: 'var(--theme-primary)',
  sub:     '#64748b',
};
export const clay = {
  card: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.10)',
  btn:  '0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset',
};

/* Classes Tailwind partagées — text-base (16px) sur mobile évite le zoom iOS */
export const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-base md:text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-400';
export const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

/* ─── useIsMobile ──────────────────────────────────────────────────────── */
export function useIsMobile(bp = 768) {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < bp);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < bp);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [bp]);
  return mobile;
}

/* ─── Toast system (remplace alert()) ──────────────────────────────────── */
const toastListeners = new Set();
let toastId = 0;
function emitToast(t) { toastListeners.forEach(l => l({ ...t, id: ++toastId })); }
export const toast = {
  success: (msg) => emitToast({ type: 'success', msg }),
  error:   (msg) => emitToast({ type: 'error',   msg }),
  info:    (msg) => emitToast({ type: 'info',    msg }),
};

export function Toaster() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const listener = (t) => {
      setToasts(list => [...list, t]);
      setTimeout(() => setToasts(list => list.filter(x => x.id !== t.id)), t.type === 'error' ? 5000 : 3500);
    };
    toastListeners.add(listener);
    return () => toastListeners.delete(listener);
  }, []);

  const colors = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> },
    error:   { bg: '#fef2f2', border: '#fecaca', text: '#b91c1c', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> },
    info:    { bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  };

  return (
    <div aria-live="polite" style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 90, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none', width: 'min(92vw, 420px)' }}>
      <AnimatePresence>
        {toasts.map(t => {
          const c = colors[t.type] || colors.info;
          return (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.22 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', borderRadius: 14, background: c.bg, border: `1.5px solid ${c.border}`, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', pointerEvents: 'auto' }}>
              <span style={{ flexShrink: 0 }}>{c.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: c.text, lineHeight: 1.4 }}>{t.msg}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

/* ─── AdminPage — coquille de page (hero + contenu) ────────────────────── */
export function AdminPage({ title, subtitle, icon, stats = [], actions, children }) {
  return (
    <DashboardLayout isAdmin>
      <Toaster />
      <main className="flex-1 min-h-0 overflow-y-auto" style={{ background: C.bg }}>

        {/* ── Hero (identique aux pages étudiantes) ── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--theme-hero)', minHeight: 180 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize: '28px 28px', pointerEvents: 'none' }} aria-hidden />
          <div style={{ position: 'absolute', top: -40, right: -20, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.14),transparent 65%)', pointerEvents: 'none' }} aria-hidden />
          <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent 65%)', pointerEvents: 'none' }} aria-hidden />

          <div style={{ position: 'relative', zIndex: 1, padding: '24px 20px 22px', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ display: 'inline-block', fontSize: 10, fontWeight: 700, padding: '3px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.25)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Administration
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
                    {icon}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h1 className="nunito" style={{ fontSize: 24, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{title}</h1>
                    {subtitle && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{subtitle}</p>}
                  </div>
                </div>
                {stats.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 14, flexWrap: 'wrap' }}>
                    {stats.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span className="nunito" style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{s.value}</span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>{actions}</div>}
            </div>
          </div>
        </div>

        {/* ── Contenu ── */}
        <div style={{ padding: '20px 12px 48px', maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {children}
        </div>
      </main>
    </DashboardLayout>
  );
}

/* ─── Boutons ──────────────────────────────────────────────────────────── */
export function HeroBtn({ onClick, children, secondary = false }) {
  return (
    <motion.button whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.96 }} onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: 14,
        fontSize: 13, fontWeight: 700, cursor: 'pointer', minHeight: 44, fontFamily: 'Nunito,sans-serif',
        ...(secondary
          ? { background: 'rgba(255,255,255,0.14)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }
          : { background: '#fff', color: 'var(--theme-primary)', border: 'none', boxShadow: '0 4px 0 rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.2)' }),
      }}>
      {children}
    </motion.button>
  );
}

export function PrimaryBtn({ onClick, disabled, loading, children, type = 'button', style }) {
  return (
    <motion.button type={type} onClick={onClick} disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }} whileTap={{ scale: 0.97 }}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        padding: '13px 18px', borderRadius: 14, border: 'none', cursor: disabled || loading ? 'default' : 'pointer',
        fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'Nunito,sans-serif', minHeight: 46,
        background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
        boxShadow: disabled || loading ? 'none' : clay.btn, opacity: disabled || loading ? 0.65 : 1, ...style,
      }}>
      {loading && <span style={{ width: 15, height: 15, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />}
      {children}
    </motion.button>
  );
}

export function GhostBtn({ onClick, children, danger = false, style }) {
  return (
    <button type="button" onClick={onClick}
      style={{
        flex: 1, padding: '13px 18px', borderRadius: 14, cursor: 'pointer', minHeight: 46,
        fontSize: 14, fontWeight: 700, fontFamily: 'Nunito,sans-serif',
        background: '#fff', border: `1.5px solid ${danger ? '#fecaca' : '#e2e8f0'}`,
        color: danger ? '#ef4444' : '#64748b', boxShadow: clay.sm, ...style,
      }}>
      {children}
    </button>
  );
}

/* ─── Card blanche clay ────────────────────────────────────────────────── */
export function Card({ children, style, className }) {
  return (
    <div className={className} style={{ background: C.card, borderRadius: 22, border: `1.5px solid ${C.border}`, boxShadow: clay.card, overflow: 'hidden', ...style }}>
      {children}
    </div>
  );
}

/* ─── Badge ────────────────────────────────────────────────────────────── */
export function Badge({ color = '#64748b', children, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: color + '1c', color, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

export const DIFF_BADGE = {
  easy:   { label: 'Facile',    color: '#059669' },
  medium: { label: 'Moyen',     color: '#d97706' },
  hard:   { label: 'Difficile', color: '#dc2626' },
};
export function PubBadge({ ok, labels = ['Publié', 'Brouillon'] }) {
  return <Badge color={ok ? '#059669' : '#64748b'}>{ok ? labels[0] : labels[1]}</Badge>;
}

/* ─── Spinner / EmptyState ─────────────────────────────────────────────── */
export function Spinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '64px 0' }}>
      <div style={{ width: 34, height: 34, border: '3px solid var(--theme-border)', borderTopColor: 'var(--theme-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  );
}

export function EmptyState({ icon, title, hint, onReset }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 20px', color: C.sub }}>
      <div style={{ width: 56, height: 56, borderRadius: 18, background: C.bg, border: `1.5px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
        {icon}
      </div>
      <p style={{ fontWeight: 800, color: C.text, fontSize: 14, fontFamily: 'Nunito,sans-serif' }}>{title}</p>
      {hint && <p style={{ fontSize: 12, marginTop: 4 }}>{hint}</p>}
      {onReset && (
        <button onClick={onReset} style={{ marginTop: 12, fontSize: 12, fontWeight: 700, color: 'var(--theme-primary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}

/* ─── Toolbar (recherche + filtres) ────────────────────────────────────── */
export function Toolbar({ children }) {
  return (
    <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.border}`, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      {children}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <div style={{ position: 'relative', flex: '1 1 180px', minWidth: 160 }}>
      <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="text-base md:text-sm"
        style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px 10px 34px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, outline: 'none', minHeight: 44 }} />
    </div>
  );
}

export function FilterSelect({ value, onChange, options, allLabel }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-base md:text-sm"
      style={{ padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${C.border}`, background: '#fff', color: value ? C.text : C.sub, outline: 'none', maxWidth: 200, minHeight: 44, cursor: 'pointer' }}>
      <option value="">{allLabel}</option>
      {options.map(o => typeof o === 'string'
        ? <option key={o} value={o}>{o}</option>
        : <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function FilterPills({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', background: C.bg, borderRadius: 12, padding: 4, border: `1px solid ${C.border}` }}>
      {options.map(([val, label]) => (
        <button key={val} onClick={() => onChange(val)}
          style={{
            padding: '8px 13px', borderRadius: 9, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 36,
            background: value === val ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : 'transparent',
            color: value === val ? '#fff' : C.sub,
            boxShadow: value === val ? '0 2px 8px rgba(var(--theme-primary-rgb),0.35)' : 'none',
            transition: 'color 0.15s',
          }}>
          {label}
        </button>
      ))}
    </div>
  );
}

/* ─── BulkBar (actions groupées) ───────────────────────────────────────── */
export function BulkBar({ count, loading, onPublish, onUnpublish, onDelete, onClear, publishLabels = ['Publier', 'Brouillon'] }) {
  if (!count) return null;
  const btn = (bg, color) => ({ padding: '8px 13px', borderRadius: 10, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', background: bg, color, minHeight: 38, opacity: loading ? 0.6 : 1 });
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={{ padding: '10px 16px', background: 'rgba(var(--theme-primary-rgb),0.07)', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--theme-primary)' }}>{count} sélectionné{count > 1 ? 's' : ''}</span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {onPublish   && <button disabled={loading} onClick={onPublish}   style={btn('#059669', '#fff')}>{publishLabels[0]}</button>}
        {onUnpublish && <button disabled={loading} onClick={onUnpublish} style={btn('#64748b', '#fff')}>{publishLabels[1]}</button>}
        {onDelete    && <button disabled={loading} onClick={onDelete}    style={btn('#ef4444', '#fff')}>Supprimer</button>}
        <button onClick={onClear} style={btn('#fff', '#64748b')}>Annuler</button>
      </div>
      {loading && <div style={{ width: 15, height: 15, border: '2px solid var(--theme-primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
    </motion.div>
  );
}

/* ─── DataTable — table desktop / cartes mobile ────────────────────────── */
export function DataTable({
  loading, items, columns, renderCard,
  selectable, onEdit, onDelete, empty,
  rowKey = (x) => x._id,
}) {
  const isMobile = useIsMobile();

  if (loading) return <Spinner />;
  if (!items.length) return <EmptyState {...empty} />;

  /* Actions communes (toujours visibles — pas de hover-reveal, mobile friendly) */
  const RowActions = ({ item }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
      {onEdit && (
        <button onClick={(e) => { e.stopPropagation(); onEdit(item); }} title="Modifier" aria-label="Modifier"
          style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${C.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--theme-primary)' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        </button>
      )}
      {onDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(item); }} title="Supprimer" aria-label="Supprimer"
          style={{ width: 34, height: 34, borderRadius: 10, border: '1px solid #fecaca', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
        </button>
      )}
    </div>
  );

  /* ── Mobile : cartes ── */
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 12 }}>
        {items.map((item, i) => (
          <motion.div key={rowKey(item)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.03 }}
            style={{ background: '#fff', borderRadius: 16, border: `1.5px solid ${selectable?.selected?.has(rowKey(item)) ? 'var(--theme-primary)' : C.border}`, boxShadow: clay.sm, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              {selectable && (
                <input type="checkbox" checked={selectable.selected.has(rowKey(item))} onChange={() => selectable.toggleOne(rowKey(item))}
                  style={{ width: 18, height: 18, accentColor: 'var(--theme-primary)', marginTop: 2, flexShrink: 0, cursor: 'pointer' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                {renderCard
                  ? renderCard(item)
                  : columns.map((col, ci) => (
                      <div key={ci} style={{ marginBottom: ci === 0 ? 8 : 4 }}>
                        {ci === 0
                          ? <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif' }}>{col.render(item)}</div>
                          : <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.sub }}>
                              {col.label && <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', minWidth: 64 }}>{col.label}</span>}
                              <span>{col.render(item)}</span>
                            </div>}
                      </div>
                    ))}
              </div>
              <RowActions item={item} />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  /* ── Desktop : table ── */
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: C.bg, borderBottom: `1.5px solid ${C.border}` }}>
            {selectable && (
              <th style={{ padding: '12px 14px', width: 40 }}>
                <input type="checkbox"
                  checked={items.length > 0 && selectable.selected.size === items.length}
                  onChange={selectable.toggleAll}
                  style={{ width: 15, height: 15, accentColor: 'var(--theme-primary)', cursor: 'pointer' }} />
              </th>
            )}
            {columns.map((col, i) => (
              <th key={i} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th style={{ width: 96 }} />}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <motion.tr key={rowKey(item)} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 18) * 0.018 }}
              style={{ borderBottom: `1px solid ${C.border}`, background: selectable?.selected?.has(rowKey(item)) ? 'rgba(var(--theme-primary-rgb),0.06)' : 'transparent' }}
              onMouseEnter={e => { if (!selectable?.selected?.has(rowKey(item))) e.currentTarget.style.background = 'rgba(var(--theme-primary-rgb),0.03)'; }}
              onMouseLeave={e => { if (!selectable?.selected?.has(rowKey(item))) e.currentTarget.style.background = 'transparent'; }}>
              {selectable && (
                <td style={{ padding: '12px 14px' }} onClick={e => e.stopPropagation()}>
                  <input type="checkbox" checked={selectable.selected.has(rowKey(item))} onChange={() => selectable.toggleOne(rowKey(item))}
                    style={{ width: 15, height: 15, accentColor: 'var(--theme-primary)', cursor: 'pointer' }} />
                </td>
              )}
              {columns.map((col, ci) => (
                <td key={ci} style={{ padding: '12px 14px', fontSize: 13, color: C.text, maxWidth: col.maxWidth || 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: col.wrap ? 'normal' : 'nowrap' }}>
                  {col.render(item)}
                </td>
              ))}
              {(onEdit || onDelete) && <td style={{ padding: '10px 14px' }}><RowActions item={item} /></td>}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Modal responsive avec garde anti-perte de données ────────────────── */
export function Modal({ title, subtitle, icon, onClose, dirty = false, children, footer, maxWidth = 620 }) {
  const isMobile = useIsMobile();
  const [confirmClose, setConfirmClose] = useState(false);

  const requestClose = () => { if (dirty) setConfirmClose(true); else onClose(); };

  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') requestClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [dirty]); // eslint-disable-line

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={requestClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? 0 : 16 }}>
      <motion.div
        initial={{ opacity: 0, y: isMobile ? 80 : 24, scale: isMobile ? 1 : 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: isMobile ? 80 : 20, scale: isMobile ? 1 : 0.96 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', width: '100%', maxWidth: isMobile ? '100%' : maxWidth,
          maxHeight: isMobile ? '94dvh' : '90vh',
          borderRadius: isMobile ? '24px 24px 0 0' : 26,
          display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative',
          boxShadow: '0 24px 64px rgba(15,23,42,0.35)',
        }}>

        {/* Poignée mobile */}
        {isMobile && <div style={{ width: 40, height: 4, borderRadius: 4, background: '#e2e8f0', margin: '10px auto 0', flexShrink: 0 }} />}

        {/* Header */}
        <div style={{ padding: isMobile ? '12px 18px 14px' : '18px 22px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {icon && (
            <div style={{ width: 40, height: 40, borderRadius: 13, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow: '0 3px 0 var(--theme-dark), 0 6px 14px rgba(var(--theme-primary-rgb),0.35)' }}>
              {icon}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="nunito" style={{ fontSize: 16, fontWeight: 900, color: C.text, lineHeight: 1.2 }}>{title}</h3>
            {subtitle && <p style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{subtitle}</p>}
          </div>
          <button onClick={requestClose} aria-label="Fermer"
            style={{ width: 38, height: 38, borderRadius: 12, background: C.bg, border: `1px solid ${C.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.sub, flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 18px' : '20px 22px', WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{ padding: isMobile ? '12px 18px calc(14px + env(safe-area-inset-bottom))' : '14px 22px', borderTop: `1px solid ${C.border}`, display: 'flex', gap: 10, flexShrink: 0, background: '#fafbff' }}>
            {footer}
          </div>
        )}

        {/* Garde anti-perte : confirmation avant fermeture */}
        <AnimatePresence>
          {confirmClose && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, zIndex: 5, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <motion.div initial={{ scale: 0.94, y: 8 }} animate={{ scale: 1, y: 0 }} style={{ textAlign: 'center', maxWidth: 340 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fffbeb', border: '1.5px solid #fde68a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                </div>
                <p className="nunito" style={{ fontSize: 15, fontWeight: 900, color: C.text, marginBottom: 4 }}>Modifications non enregistrées</p>
                <p style={{ fontSize: 12.5, color: C.sub, marginBottom: 18, lineHeight: 1.5 }}>Si tu fermes maintenant, les changements seront perdus.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <GhostBtn onClick={() => setConfirmClose(false)}>Continuer l'édition</GhostBtn>
                  <GhostBtn danger onClick={() => { setConfirmClose(false); onClose(); }}>Fermer sans sauver</GhostBtn>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── ConfirmModal (remplace window.confirm) ───────────────────────────── */
export function ConfirmModal({ title, message, confirmLabel = 'Supprimer', onConfirm, onClose, loading = false }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 70, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ scale: 0.92, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 14 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
        onClick={e => e.stopPropagation()}
        style={{ background: '#fff', borderRadius: 24, padding: 26, width: '100%', maxWidth: 380, textAlign: 'center', boxShadow: '0 24px 64px rgba(15,23,42,0.35)' }}>
        <div style={{ width: 54, height: 54, borderRadius: 18, background: '#fef2f2', border: '1.5px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></svg>
        </div>
        <h3 className="nunito" style={{ fontSize: 16, fontWeight: 900, color: C.text, marginBottom: 6 }}>{title}</h3>
        <div style={{ fontSize: 13, color: C.sub, marginBottom: 20, lineHeight: 1.55 }}>{message}</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <GhostBtn onClick={onClose}>Annuler</GhostBtn>
          <PrimaryBtn onClick={onConfirm} loading={loading}
            style={{ background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: loading ? 'none' : '0 4px 0 #991b1b, 0 8px 24px rgba(239,68,68,0.3)' }}>
            {confirmLabel}
          </PrimaryBtn>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Champs de formulaire ─────────────────────────────────────────────── */
export function Field({ label, required, hint, children }) {
  return (
    <div>
      <label className={labelCls}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: '#94a3b8', marginLeft: 6, textTransform: 'none' }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

export function Toggle({ checked, onChange, labels = ['Publié — visible par les étudiants', 'Masqué — non visible'] }) {
  return (
    <div role="switch" aria-checked={checked} tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${checked ? '#bbf7d0' : C.border}`, background: checked ? '#f0fdf4' : '#f8fafc', minHeight: 48 }}>
      <span style={{ fontSize: 12.5, fontWeight: 700, color: checked ? '#15803d' : C.sub }}>
        {checked ? labels[0] : labels[1]}
      </span>
      <div style={{ width: 42, height: 24, borderRadius: 999, position: 'relative', background: checked ? '#22c55e' : '#cbd5e1', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: 3, left: checked ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
      </div>
    </div>
  );
}

/* ─── useDraft — brouillon localStorage (anti-perte de données) ────────── */
export function useDraft(storageKey, form, { enabled = true, initial = null } = {}) {
  const [pendingDraft, setPendingDraft] = useState(null);
  const restored = useRef(false);

  /* Au montage : détecter un brouillon existant plus riche que l'état initial */
  useEffect(() => {
    if (!enabled) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (initial == null || JSON.stringify(parsed) !== JSON.stringify(initial)) {
          setPendingDraft(parsed);
        }
      }
    } catch { /* ignore */ }
  }, []); // eslint-disable-line

  /* Autosave débounce 500ms */
  useEffect(() => {
    if (!enabled) return;
    const id = setTimeout(() => {
      try { localStorage.setItem(storageKey, JSON.stringify(form)); } catch { /* quota */ }
    }, 500);
    return () => clearTimeout(id);
  }, [form, enabled, storageKey]);

  const clearDraft   = () => { try { localStorage.removeItem(storageKey); } catch { /* */ } };
  const dismissDraft = () => { setPendingDraft(null); clearDraft(); };
  const consumeDraft = () => { restored.current = true; const d = pendingDraft; setPendingDraft(null); return d; };

  return { pendingDraft, consumeDraft, dismissDraft, clearDraft };
}

export function DraftBanner({ onRestore, onDismiss }) {
  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 14, background: '#fffbeb', border: '1.5px solid #fde68a', marginBottom: 16 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <path d="M12 8v4l2 2" /><circle cx="12" cy="12" r="9" />
      </svg>
      <span style={{ flex: 1, fontSize: 12, fontWeight: 600, color: '#92400e' }}>Un brouillon non enregistré a été retrouvé.</span>
      <button onClick={onRestore} style={{ fontSize: 12, fontWeight: 800, color: '#d97706', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '6px 4px' }}>Restaurer</button>
      <button onClick={onDismiss} style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px' }}>Ignorer</button>
    </motion.div>
  );
}

/* ─── Utilitaires ──────────────────────────────────────────────────────── */
export function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}

/* Animation keyframes globales (spin) — injectées une fois */
if (typeof document !== 'undefined' && !document.getElementById('admin-kit-keyframes')) {
  const style = document.createElement('style');
  style.id = 'admin-kit-keyframes';
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);
}
