import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const QuizIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const CardIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="4" width="14" height="10" rx="2"/><rect x="8" y="10" width="14" height="10" rx="2"/>
  </svg>
);
const CoursIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const FicheIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="15" x2="15" y2="15"/>
  </svg>
);
const MedicamentIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>
  </svg>
);

const TYPE_META = {
  quiz:        { label: 'Quiz',               Icon: QuizIcon,        color: 'text-blue-500',    bg: 'bg-blue-50'    },
  flashcard:   { label: 'Flashcards',         Icon: CardIcon,        color: 'text-purple-500',  bg: 'bg-purple-50'  },
  cours:       { label: 'Cours',              Icon: CoursIcon,       color: 'text-emerald-600', bg: 'bg-emerald-50' },
  fiche:       { label: 'Fiches de révision', Icon: FicheIcon,       color: 'text-amber-600',   bg: 'bg-amber-50'   },
  medicament:  { label: 'Médicaments',        Icon: MedicamentIcon,  color: 'text-red-500',     bg: 'bg-red-50'     },
};

/* ─── Safe highlight (never throws) ─────────────────────────────────────── */
function highlight(text, q) {
  if (!text || !q) return text || '';
  try {
    const i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i === -1) return text;
    return (
      <>
        {text.slice(0, i)}
        <mark className="bg-yellow-200 text-yellow-900 rounded-sm not-italic px-0.5">
          {text.slice(i, i + q.length)}
        </mark>
        {text.slice(i + q.length)}
      </>
    );
  } catch {
    return text;
  }
}

const MAX_PER_TYPE = 5;

/* ─── Component ──────────────────────────────────────────────────────────── */
export default function SearchModal({ open, onClose }) {
  const { token } = useAuth();
  const navigate  = useNavigate();
  const inputRef  = useRef(null);

  const [query,   setQuery]   = useState('');
  const [corpus,  setCorpus]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [active,  setActive]  = useState(0);

  /* ── Load corpus once ── */
  const load = useCallback(async () => {
    if (corpus || loading) return;
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [qRes, fcRes, coursRes, ficheRes, drugRes] = await Promise.allSettled([
        axios.get(`${API_URL}/quizzes`,            { headers }),
        axios.get(`${API_URL}/flashcards`,         { headers }),
        axios.get(`${API_URL}/lessons?type=cours`, { headers }),
        axios.get(`${API_URL}/lessons?type=fiche`, { headers }),
        axios.get(`${API_URL}/drugs`,              { headers }),
      ]);

      const safe = (r) => (r.status === 'fulfilled' ? r.value.data : []);

      setCorpus([
        ...safe(qRes).map(q => ({
          id: q._id || Math.random(), type: 'quiz',
          title: q.title || '',
          sub: [q.category, q.chapter, q.semester].filter(Boolean).join(' · '),
          href: `/dashboard/quiz/${q._id}`,
        })),
        ...safe(fcRes).map(f => ({
          id: f._id || Math.random(), type: 'flashcard',
          title: f.title || '',
          sub: [f.category, f.chapter, f.semester].filter(Boolean).join(' · '),
          href: '/dashboard/flashcards',
        })),
        ...safe(coursRes).map(c => ({
          id: c._id || Math.random(), type: 'cours',
          title: c.title || '',
          sub: [c.semester, c.category].filter(Boolean).join(' · '),
          href: '/dashboard/cours',
        })),
        ...safe(ficheRes).map(f => ({
          id: f._id || Math.random(), type: 'fiche',
          title: f.title || '',
          sub: [f.semester, f.category].filter(Boolean).join(' · '),
          href: '/dashboard/cours',
        })),
        ...safe(drugRes).map(d => ({
          id: d._id || Math.random(), type: 'medicament',
          title: d.name || '',
          sub: [d.drugClass?.name, d.genericName].filter(Boolean).join(' · '),
          href: `/dashboard/medicaments/${d._id}`,
        })),
      ]);
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, [corpus, loading, token]);

  useEffect(() => {
    if (open) {
      load();
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      setQuery('');
      setActive(0);
    }
  }, [open]); // eslint-disable-line

  /* ── Filter + group (memoized) ── */
  const { results, grouped, flat } = useMemo(() => {
    if (!corpus || !query.trim()) return { results: [], grouped: [], flat: [] };

    const q = query.toLowerCase().trim();
    const results = corpus.filter(item =>
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.sub   && item.sub.toLowerCase().includes(q))
    );

    const map = {};
    for (const r of results) {
      if (!map[r.type]) map[r.type] = [];
      if (map[r.type].length < MAX_PER_TYPE) map[r.type].push(r);
    }
    const grouped = Object.entries(map);
    const flat    = grouped.flatMap(([, items]) => items);

    return { results, grouped, flat };
  }, [corpus, query]);

  useEffect(() => { setActive(0); }, [query]);

  /* ── Keyboard ── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, flat.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === 'Enter' && flat[active]) { go(flat[active]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, flat, active, onClose]); // eslint-disable-line

  function go(item) {
    navigate(item.href);
    onClose();
  }

  /* ── Render ── */
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/*
            Centering wrapper — fixed inset-0 + flex pour centrer le panel.
            Le panel n'a PAS de transform de positionnement, donc les transforms
            Framer Motion (scale, y) n'interfèrent pas avec sa position.
          */}
          <div
            className="fixed inset-0 z-[101] flex items-start justify-center px-4"
            style={{ paddingTop: 'clamp(60px, 12vh, 120px)' }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1,    y: 0    }}
              exit={{    opacity: 0, scale: 0.96, y: -10  }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">

                {/* ── Input ── */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Quiz, flashcards, cours, fiches, médicaments…"
                    className="flex-1 text-sm text-slate-800 placeholder-slate-400 outline-none bg-transparent min-w-0"
                  />
                  {loading && (
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"/>
                  )}
                  <button onClick={onClose} className="flex-shrink-0">
                    <kbd className="flex items-center text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 cursor-pointer hover:bg-slate-50 transition">Esc</kbd>
                  </button>
                </div>

                {/* ── Results ── */}
                <div className="max-h-[58vh] overflow-y-auto overscroll-contain">
                  {!query.trim() ? (
                    /* État vide — hint */
                    <div className="py-8 px-4 text-center">
                      <p className="text-sm text-slate-400 mb-4">Recherche parmi tes cours, quiz et flashcards</p>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {Object.values(TYPE_META).map(m => (
                          <div key={m.label} className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg ${m.bg} ${m.color}`}>
                            <m.Icon/>{m.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : results.length === 0 && !loading ? (
                    /* Aucun résultat */
                    <div className="py-10 text-center px-4">
                      <p className="text-sm font-medium text-slate-600">Aucun résultat pour «&nbsp;{query}&nbsp;»</p>
                      <p className="text-xs text-slate-400 mt-1">Essaie avec un autre mot-clé</p>
                    </div>
                  ) : (
                    /* Résultats */
                    <div className="py-1">
                      {grouped.map(([type, items]) => {
                        const meta = TYPE_META[type];
                        if (!meta) return null;
                        return (
                          <div key={type}>
                            {/* Type header */}
                            <div className={`flex items-center gap-2 px-4 py-2 mt-1 ${meta.color}`}>
                              <meta.Icon/>
                              <span className="text-[11px] font-bold uppercase tracking-wider">{meta.label}</span>
                              <span className="text-[10px] opacity-50 ml-0.5">{items.length}</span>
                            </div>

                            {/* Items */}
                            {items.map((item) => {
                              const idx      = flat.indexOf(item);
                              const isActive = idx === active;
                              return (
                                <button
                                  key={item.id}
                                  onMouseEnter={() => setActive(idx)}
                                  onClick={() => go(item)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                >
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.bg} ${meta.color}`}>
                                    <meta.Icon/>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">
                                      {highlight(item.title, query)}
                                    </p>
                                    {item.sub && (
                                      <p className="text-xs text-slate-400 truncate">{highlight(item.sub, query)}</p>
                                    )}
                                  </div>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                    stroke={isActive ? '#94a3b8' : 'transparent'}
                                    strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                                    <polyline points="9 18 15 12 9 6"/>
                                  </svg>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })}

                      {/* Footer */}
                      {results.length > 0 && (
                        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between mt-1">
                          <span className="text-[11px] text-slate-400">
                            {results.length} résultat{results.length > 1 ? 's' : ''}
                          </span>
                          <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                            <kbd className="border border-slate-200 rounded px-1 py-0.5">↑↓</kbd>
                            <span>naviguer</span>
                            <kbd className="border border-slate-200 rounded px-1 py-0.5">↵</kbd>
                            <span>ouvrir</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
