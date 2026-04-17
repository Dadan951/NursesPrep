import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';

/* ─── Stagger variants ───────────────────────────────────────────────────── */
const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item      = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Detail modal ───────────────────────────────────────────────────────── */
function GroupDetailModal({ group, onClose, onDelete }) {
  const [pending, setPending]   = useState([]);
  const [pLoading, setPLoading] = useState(true);
  const [copied,   setCopied]   = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/groups/${group._id}/pending`)
      .then(r => setPending(r.data))
      .catch(() => setPending([]))
      .finally(() => setPLoading(false));
  }, [group._id]);

  const handleApprove = async (userId) => {
    await axios.post(`${API_URL}/groups/${group._id}/approve/${userId}`);
    setPending(p => p.filter(u => u._id !== userId));
  };
  const handleReject = async (userId) => {
    await axios.delete(`${API_URL}/groups/${group._id}/reject/${userId}`);
    setPending(p => p.filter(u => u._id !== userId));
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(group.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl p-7 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">{group.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${group.isPrivate ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                  {group.isPrivate ? 'Privé' : 'Public'}
                </span>
                <span className="text-xs text-slate-400">{group.category}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {group.description && (
          <p className="text-sm text-slate-500 mb-5 bg-slate-50 rounded-xl p-3">{group.description}</p>
        )}

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Créateur</p>
            <p className="text-sm font-semibold text-slate-800">{group.creator?.name || '—'}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Membres</p>
            <p className="text-sm font-semibold text-slate-800">{group.memberCount}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 col-span-2">
            <p className="text-[10px] text-blue-400 font-medium mb-1">Clé d'accès</p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-lg font-mono font-bold text-blue-700 tracking-[0.3em]">{group.joinCode}</p>
              <button onClick={handleCopy}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3 col-span-2">
            <p className="text-[10px] text-slate-400 font-medium mb-0.5">Créé le</p>
            <p className="text-sm font-semibold text-slate-800">
              {new Date(group.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}
            </p>
          </div>
        </div>

        {/* Pending members — only for private groups */}
        {group.isPrivate && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 flex items-center gap-2">
              Demandes en attente
              {pending.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-600 text-[10px] font-bold">{pending.length}</span>
              )}
            </h3>
            {pLoading ? (
              <div className="flex justify-center py-4">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : pending.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-3">Aucune demande en attente</p>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {pending.map(u => (
                    <motion.div
                      key={u._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                        {u.name?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => handleApprove(u._id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-green-500 text-white hover:bg-green-600 transition">
                          Approuver
                        </button>
                        <button onClick={() => handleReject(u._id)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-100 text-red-600 hover:bg-red-200 transition">
                          Refuser
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
            Fermer
          </button>
          <button onClick={() => { onDelete(group._id); onClose(); }}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition">
            Supprimer le groupe
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN GROUPS PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function AdminGroups() {
  const [groups,  setGroups]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('all'); // all | public | private
  const [detail,  setDetail]  = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/groups`);
      setGroups(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce groupe définitivement ?')) return;
    try {
      await axios.delete(`${API_URL}/admin/groups/${id}`);
      setGroups(g => g.filter(x => x._id !== id));
    } catch {}
  };

  const filtered = groups.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = g.name.toLowerCase().includes(q) || g.creator?.name?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'public' ? !g.isPrivate : g.isPrivate);
    return matchSearch && matchFilter;
  });

  const totalPublic  = groups.filter(g => !g.isPrivate).length;
  const totalPrivate = groups.filter(g =>  g.isPrivate).length;
  const totalMembers = groups.reduce((s, g) => s + (g.memberCount  || 0), 0);
  const totalPending = groups.reduce((s, g) => s + (g.pendingCount || 0), 0);

  return (
    <DashboardLayout isAdmin>
      <main className="flex-1 overflow-auto bg-slate-50/60">
        <div className="p-4 lg:p-8 max-w-6xl mx-auto space-y-6">

          {/* ── Header ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-between"
          >
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Gestion des groupes</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {groups.length} groupe{groups.length !== 1 ? 's' : ''} · {totalMembers} membre{totalMembers !== 1 ? 's' : ''} au total
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={load}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 shadow-sm transition"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Actualiser
            </motion.button>
          </motion.div>

          {/* ── Summary cards ───────────────────────────────────────── */}
          <motion.div variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label:'Total groupes',    value: groups.length,  color:'bg-blue-500',   glow:'shadow-blue-200'  },
              { label:'Groupes publics',  value: totalPublic,    color:'bg-teal-500',   glow:'shadow-teal-200'  },
              { label:'Groupes privés',   value: totalPrivate,   color:'bg-indigo-500', glow:'shadow-indigo-200'},
              { label:'Demandes en att.', value: totalPending,   color:'bg-amber-500',  glow:'shadow-amber-200' },
            ].map((s, i) => (
              <motion.div key={i} variants={item}
                className={`bg-white rounded-2xl p-5 border border-slate-100 shadow-md ${s.glow} hover:shadow-xl transition-shadow`}>
                <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  </svg>
                </div>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.value}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Search + filter ─────────────────────────────────────── */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }}
            className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Rechercher par nom ou créateur..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-400 transition shadow-sm"/>
            </div>
            <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
              {[['all','Tous'],['public','Public'],['private','Privé']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${filter === val ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Groups grid ─────────────────────────────────────────── */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <p className="font-semibold text-slate-500">Aucun groupe trouvé</p>
            </div>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(group => (
                <motion.div key={group._id} variants={item}>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all p-5">

                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                          style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                          {group.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{group.name}</p>
                          <p className="text-[11px] text-slate-400">{group.category}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${group.isPrivate ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                        {group.isPrivate ? 'Privé' : 'Public'}
                      </span>
                    </div>

                    {/* Membres + en attente */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                        </svg>
                        {group.memberCount} membre{group.memberCount !== 1 ? 's' : ''}
                      </span>
                      {group.pendingCount > 0 && (
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {group.pendingCount} en attente
                        </span>
                      )}
                    </div>

                    {/* Creator + code */}
                    <div className="bg-slate-50 rounded-xl px-3 py-2 flex items-center justify-between mb-3">
                      <span className="text-[11px] text-slate-500 truncate">
                        par <span className="font-semibold text-slate-700">{group.creator?.name || '—'}</span>
                      </span>
                      <span className="text-[11px] font-mono font-bold text-blue-600 tracking-widest flex-shrink-0 ml-2">
                        {group.joinCode}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button onClick={() => setDetail(group)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition">
                        Détails
                      </button>
                      <button onClick={() => handleDelete(group._id)}
                        className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-100 transition">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                          <path d="M10 11v6"/><path d="M14 11v6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {detail && (
          <GroupDetailModal group={detail} onClose={() => setDetail(null)} onDelete={handleDelete}/>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
