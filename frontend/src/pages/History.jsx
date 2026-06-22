import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const DIFF_COLOR = {
  easy:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Facile' },
  medium: { bg: 'bg-amber-100',   text: 'text-amber-700',   label: 'Moyen' },
  hard:   { bg: 'bg-red-100',     text: 'text-red-700',     label: 'Difficile' },
};

function scoreColor(pct) {
  if (pct >= 80) return { ring: '#10b981', bg: '#ecfdf5', text: '#065f46' };
  if (pct >= 60) return { ring: '#f59e0b', bg: '#fffbeb', text: '#92400e' };
  return { ring: '#ef4444', bg: '#fef2f2', text: '#991b1b' };
}

function fmtDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateShort(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
}

/* ─── Mini SVG line chart ─────────────────────────────────────────────────── */
function ScoreChart({ data }) {
  if (data.length < 2) return null;
  const W = 320, H = 80, PAD = 12;
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: PAD + (1 - d.pct / 100) * (H - PAD * 2),
    pct: d.pct,
    label: fmtDateShort(d.completedAt),
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${H} ` + pts.map(p => `${p.x},${p.y}`).join(' ') + ` ${pts[pts.length - 1].x},${H}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#cg)"/>
      <polyline points={polyline} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3.5" fill="white" stroke="#3b82f6" strokeWidth="2"/>
        </g>
      ))}
    </svg>
  );
}

/* ─── Score ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ pct, size = 52 }) {
  const c = scoreColor(pct);
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="4"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c.ring} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold" style={{ color: c.text }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function History() {
  const { token } = useAuth();
  const navigate   = useNavigate();
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [sort,     setSort]     = useState('date'); // 'date' | 'score_desc' | 'score_asc'

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/history`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setHistory(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  /* Stats globales */
  const stats = useMemo(() => {
    if (!history.length) return null;
    const scores = history.map(h => h.pct);
    const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best   = Math.max(...scores);
    const worst  = Math.min(...scores);
    const above80 = history.filter(h => h.pct >= 80).length;
    return { total: history.length, avg, best, worst, above80 };
  }, [history]);

  /* Filtres */
  const semesters = useMemo(() => [...new Set(history.map(h => h.semester).filter(Boolean))].sort(), [history]);

  const filtered = useMemo(() => {
    let list = history.filter(h => {
      const q = search.toLowerCase();
      const matchSearch = !q || h.title.toLowerCase().includes(q) || h.category.toLowerCase().includes(q) || h.chapter.toLowerCase().includes(q);
      const matchSem    = !filterSem || h.semester === filterSem;
      return matchSearch && matchSem;
    });
    if (sort === 'score_desc') list = [...list].sort((a, b) => b.pct - a.pct);
    if (sort === 'score_asc')  list = [...list].sort((a, b) => a.pct - b.pct);
    return list;
  }, [history, search, filterSem, sort]);

  /* Données pour le graphique (20 derniers, ordre chronologique) */
  const chartData = useMemo(() =>
    [...history].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt)).slice(-20),
  [history]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-slate-50">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-white mb-1">Historique</h1>
            <p className="text-blue-200/70 text-sm mb-6">Tous tes quiz terminés, tes scores et ta progression</p>

            {/* Stats strip */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Quiz terminés',    value: stats.total,             sub: 'au total' },
                  { label: 'Score moyen',      value: `${stats.avg}%`,         sub: 'sur tous les quiz' },
                  { label: 'Meilleur score',   value: `${stats.best}%`,        sub: 'record personnel' },
                  { label: 'Score ≥ 80%',      value: stats.above80,           sub: `quiz réussis` },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                    className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="text-xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-blue-200/60 mt-0.5">{s.label}</div>
                    <div className="text-[10px] text-white/30 mt-0.5">{s.sub}</div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="px-6 py-6 max-w-4xl mx-auto">

          {/* ── Progression chart ── */}
          {chartData.length >= 2 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-800">Progression</h2>
                  <p className="text-xs text-slate-400">Score (%) sur les {chartData.length} derniers quiz</p>
                </div>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block rounded"/>≥ 80%</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-amber-400 inline-block rounded"/>≥ 60%</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-400 inline-block rounded"/>{'< 60%'}</span>
                </div>
              </div>
              <ScoreChart data={chartData}/>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-300">{fmtDateShort(chartData[0]?.completedAt)}</span>
                <span className="text-[10px] text-slate-300">{fmtDateShort(chartData[chartData.length-1]?.completedAt)}</span>
              </div>
            </motion.div>
          )}

          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-3 mb-5">
            <div className="flex-1 min-w-[180px] relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un quiz…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"/>
            </div>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition text-slate-700">
              <option value="">Tous les semestres</option>
              {semesters.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 transition text-slate-700">
              <option value="date">Plus récent</option>
              <option value="score_desc">Meilleur score</option>
              <option value="score_asc">Score le plus bas</option>
            </select>
          </div>

          {/* ── Count ── */}
          {filtered.length > 0 && (
            <p className="text-xs text-slate-400 mb-4">
              {filtered.length} quiz{filtered.length > 1 ? '' : ''} affiché{filtered.length > 1 ? 's' : ''}
              {search || filterSem ? ' (filtré)' : ''}
            </p>
          )}

          {/* ── List ── */}
          {filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-20 text-slate-400">
              <div className="text-5xl mb-4">📋</div>
              <p className="font-semibold text-slate-600">
                {history.length === 0 ? 'Aucun quiz terminé pour l\'instant' : 'Aucun résultat pour cette recherche'}
              </p>
              {history.length === 0 && (
                <button onClick={() => navigate('/dashboard/quiz')}
                  className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 transition">
                  Faire mon premier quiz
                </button>
              )}
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((item, i) => {
                  const diff = DIFF_COLOR[item.difficulty] || DIFF_COLOR.medium;
                  const c    = scoreColor(item.pct);
                  return (
                    <motion.div key={item._id}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i < 10 ? i * 0.04 : 0 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all p-4 flex items-center gap-4">

                      {/* Score ring */}
                      <ScoreRing pct={item.pct}/>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {item.semester && (
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.semester}</span>
                          )}
                          {item.difficulty && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${diff.bg} ${diff.text}`}>{diff.label}</span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {item.category}{item.chapter ? ` · ${item.chapter}` : ''}
                        </p>
                      </div>

                      {/* Score & date */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold" style={{ color: c.text }}>
                          {item.score}/{item.total}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{fmtDate(item.completedAt)}</div>
                      </div>

                      {/* Redo button */}
                      {item.quizId && (
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          onClick={() => navigate(`/dashboard/quiz/${item.quizId}`)}
                          className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition text-slate-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
