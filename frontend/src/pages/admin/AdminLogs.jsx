import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';

/* ─── Badges ─────────────────────────────────────────────────────────────── */
const ACTION_CONFIG = {
  login:        { label: 'Connexion',    bg: '#dcfce7', text: '#15803d', dot: '#22c55e' },
  logout:       { label: 'Déconnexion', bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
  register:     { label: 'Inscription', bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  login_failed: { label: 'Échec',       bg: '#fee2e2', text: '#b91c1c', dot: '#ef4444' },
};

function ActionBadge({ action }) {
  const c = ACTION_CONFIG[action] || { label: action, bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.dot }}/>
      {c.label}
    </span>
  );
}

/* ─── Device icons ───────────────────────────────────────────────────────── */
function DeviceIcon({ device }) {
  if (device === 'Mobile') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>
    </svg>
  );
  if (device === 'Tablette') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>
    </svg>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, color, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: color + '20' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

/* ─── Format date ────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ════════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminLogs() {
  const { token } = useAuth();
  const [logs,    setLogs]    = useState([]);
  const [stats,   setStats]   = useState(null);
  const [total,   setTotal]   = useState(0);
  const [pages,   setPages]   = useState(1);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(true);
  const [action,  setAction]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [searchQ, setSearchQ] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50, action };
      if (searchQ) params.search = searchQ;
      const { data } = await axios.get(`${API_URL}/admin/activity-logs`, { headers, params });
      setLogs(data.logs);
      setTotal(data.total);
      setPages(data.pages);
      setStats(data.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token, page, action, searchQ]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchQ(search);
  };

  const onActionChange = (v) => { setAction(v); setPage(1); };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Journal d'activité</h1>
          <p className="text-sm text-slate-500 mt-1">Connexions, déconnexions et inscriptions en temps réel</p>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard label="Connexions aujourd'hui" value={stats.todayLogins} color="#22c55e"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>}
            />
            <StatCard label="Inscriptions aujourd'hui" value={stats.todayRegs} color="#3b82f6"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>}
            />
            <StatCard label="Échecs de connexion" value={stats.todayFailed} color="#ef4444"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
            />
            <StatCard label="Total dans le journal" value={total} color="#8b5cf6"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>}
            />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-4 mb-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <form onSubmit={onSearch} className="flex gap-2 flex-1 min-w-48">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher par email, nom, IP…"
              className="flex-1 text-sm border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 transition-colors"
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
              OK
            </button>
            {searchQ && (
              <button type="button" onClick={() => { setSearch(''); setSearchQ(''); setPage(1); }}
                className="px-3 py-2 text-slate-500 hover:text-slate-700 text-sm">✕</button>
            )}
          </form>

          {/* Action filter */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'login', 'logout', 'register', 'login_failed'].map(a => (
              <button key={a} onClick={() => onActionChange(a)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  action === a ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {a === 'all' ? 'Tout' : ACTION_CONFIG[a]?.label || a}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={fetchLogs}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-xl hover:bg-blue-50">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.86"/>
            </svg>
            Actualiser
          </button>
        </motion.div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold">Aucun événement trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Appareil</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">IP</th>
                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Heure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log, i) => (
                    <motion.tr key={log._id}
                      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.01 }}
                      className="hover:bg-slate-50/80 transition-colors">
                      {/* Utilisateur */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(log.userName || log.userEmail || '?')[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[180px]">
                              {log.userName || <span className="italic text-slate-400">Inconnu</span>}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[180px]">{log.userEmail || '—'}</p>
                          </div>
                        </div>
                      </td>
                      {/* Action */}
                      <td className="px-4 py-3">
                        <ActionBadge action={log.action} />
                      </td>
                      {/* Appareil */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <DeviceIcon device={log.device} />
                          <span className="text-xs">{log.device || '—'}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{log.browser || '—'}</span>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs text-slate-500">{log.os || '—'}</span>
                        </div>
                      </td>
                      {/* IP */}
                      <td className="px-4 py-3">
                        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                          {log.ip || '—'}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-600">{fmtDate(log.createdAt)}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
            <p>{total} événements au total</p>
            <div className="flex items-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                ← Précédent
              </button>
              <span className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">{page} / {pages}</span>
              <button disabled={page === pages} onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Suivant →
              </button>
            </div>
          </div>
        )}

      </div>
      </div>
    </DashboardLayout>
  );
}
