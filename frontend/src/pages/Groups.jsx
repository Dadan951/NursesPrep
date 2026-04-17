import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Create group modal ─────────────────────────────────────────────────── */
function CreateGroupModal({ onClose, onCreate }) {
  const [form,    setForm]    = useState({ name: '', description: '', category: 'Général', isPrivate: false });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null); // { name, joinCode, isPrivate }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/groups`, form);
      onCreate(data);
      setCreated({ name: data.name, joinCode: data.joinCode, isPrivate: data.isPrivate });
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity:0, scale:0.95, y:16 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:16 }}
        transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
        className="bg-white rounded-3xl p-7 w-full max-w-md shadow-2xl"
      >
        {!created ? (
          <>
            <h2 className="text-base font-bold text-slate-800 mb-5">Créer un groupe</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom du groupe</label>
                <input type="text" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex : Promo 2025 — UE 2.2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez votre groupe..." rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition resize-none"/>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Catégorie</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition">
                  {['Général','UE 1','UE 2','UE 3','UE 4','UE 5','UE 6','Révisions concours','Stages'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
                <div className={`w-10 h-6 rounded-full transition-colors relative ${form.isPrivate ? 'bg-blue-500' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isPrivate ? 'translate-x-5' : 'translate-x-1'}`}/>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Groupe privé</p>
                  <p className="text-xs text-slate-400">Accès sur approbation du créateur</p>
                </div>
                <input type="checkbox" checked={form.isPrivate} onChange={e => setForm({ ...form, isPrivate: e.target.checked })} className="hidden"/>
              </label>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60"
                  style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                  {loading ? 'Création...' : 'Créer le groupe'}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ── Success screen with key ── */
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Groupe créé !</h3>
            <p className="text-sm text-slate-400 mb-6">Partagez cette clé pour inviter des membres</p>

            <div className="bg-blue-50 rounded-2xl p-5 mb-6">
              <p className="text-xs text-blue-400 font-medium mb-2">Clé d'accès</p>
              <p className="text-3xl font-mono font-bold text-blue-700 tracking-[0.4em]">{created.joinCode}</p>
              {created.isPrivate && (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 mt-3">
                  Groupe privé — les demandes nécessitent votre approbation
                </p>
              )}
            </div>
            <button onClick={onClose}
              className="w-full py-3 text-white rounded-xl text-sm font-bold transition"
              style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
              Accéder au groupe
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Join by code modal ─────────────────────────────────────────────────── */
function JoinByCodeModal({ onClose, onJoin }) {
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null); // { pending, groupName, groupId }

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.trim().length < 4) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/groups/join-by-code`, { code: code.trim() });
      setResult(data);
      onJoin();
    } catch (err) {
      alert(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity:0, scale:0.95, y:16 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:16 }}
        transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}
        className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl"
      >
        {!result ? (
          <>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
            </div>
            <h2 className="text-base font-bold text-slate-800 text-center mb-1">Rejoindre avec une clé</h2>
            <p className="text-xs text-slate-400 text-center mb-6">Entrez la clé d'accès partagée par le créateur</p>
            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <input type="text" required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}
                  placeholder="Ex : AB12CD"
                  maxLength={8}
                  className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xl font-mono font-bold tracking-[0.4em] text-center text-blue-700 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition">
                  Annuler
                </button>
                <button type="submit" disabled={loading || code.length < 4}
                  className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                  {loading ? 'Vérification...' : 'Rejoindre'}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* ── Result screen ── */
          <div className="text-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${result.pending ? 'bg-amber-100' : 'bg-green-100'}`}>
              {result.pending ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-2">
              {result.pending ? 'Demande envoyée !' : 'Rejoint !'}
            </h3>
            <p className="text-sm text-slate-500 mb-1">
              <span className="font-semibold text-slate-700">{result.groupName}</span>
            </p>
            <p className="text-xs text-slate-400 mb-6">
              {result.pending
                ? "Votre demande est en attente d'approbation par l'admin du groupe."
                : 'Vous avez rejoint le groupe avec succès.'}
            </p>
            <button onClick={onClose}
              className="w-full py-2.5 text-white rounded-xl text-sm font-bold transition"
              style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
              Fermer
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN GROUPS PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Groups() {
  const navigate = useNavigate();
  const [groups,         setGroups]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showJoinByCode, setShowJoinByCode] = useState(false);
  const [search,         setSearch]         = useState('');
  const [filter,         setFilter]         = useState('all'); // all | mine

  const load = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/groups`);
      setGroups(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDirectJoin = async (group) => {
    try {
      await axios.post(`${API_URL}/groups/${group._id}/join`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'mine' && (g.isMember || g.isPending));
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 lg:p-8 overflow-auto bg-slate-50/40">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:-16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Groupes d'étude</h1>
            <p className="text-sm text-slate-400 mt-0.5">Collaborez et partagez avec vos camarades</p>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => setShowJoinByCode(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
              </svg>
              Clé d'accès
            </motion.button>
            <motion.button
              whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-300/40 transition"
              style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Créer un groupe
            </motion.button>
          </div>
        </motion.div>

        {/* ── Search + filter ────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Rechercher un groupe..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:border-blue-400 shadow-sm transition"/>
          </div>
          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm">
            {[['all','Tous'],['mine','Mes groupes']].map(([val, label]) => (
              <button key={val} onClick={() => setFilter(val)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${filter === val ? 'bg-blue-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Groups grid ────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p className="font-semibold text-slate-600 mb-1">Aucun groupe trouvé</p>
            <p className="text-sm text-slate-400">Créez le premier groupe ou utilisez une clé d'accès</p>
          </div>
        ) : (
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.07 } } }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map(group => (
              <motion.div
                key={group._id}
                variants={{ hidden:{ opacity:0, y:20 }, show:{ opacity:1, y:0, transition:{ duration:0.45, ease:[0.16,1,0.3,1] } } }}
              >
                <div
                  className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/60 transition-all cursor-pointer group"
                  onClick={() => (group.isMember ? navigate(`/dashboard/groups/${group._id}`) : null)}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform"
                        style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                        {group.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-sm truncate">{group.name}</h3>
                        <p className="text-xs text-slate-400">{group.category}</p>
                      </div>
                    </div>
                    {group.isPrivate && (
                      <div className="flex items-center gap-1 bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        Privé
                      </div>
                    )}
                  </div>

                  {group.description && (
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{group.description}</p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {group.memberCount} membre{group.memberCount !== 1 ? 's' : ''}
                    </span>

                    {group.isMember ? (
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                        Membre
                      </span>
                    ) : group.isPending ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                        </svg>
                        En attente
                      </span>
                    ) : group.isPrivate ? (
                      <button
                        onClick={e => { e.stopPropagation(); setShowJoinByCode(true); }}
                        className="text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full transition flex items-center gap-1.5"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778"/>
                        </svg>
                        Clé d'accès
                      </button>
                    ) : (
                      <button
                        onClick={e => { e.stopPropagation(); handleDirectJoin(group); }}
                        className="text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition"
                      >
                        Rejoindre
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {showCreate && (
          <CreateGroupModal
            onClose={() => setShowCreate(false)}
            onCreate={g => setGroups(prev => [{ ...g, isMember:true, isPending:false }, ...prev])}
          />
        )}
        {showJoinByCode && (
          <JoinByCodeModal
            onClose={() => setShowJoinByCode(false)}
            onJoin={load}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
