import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

const subColors = {
  free: 'bg-slate-100 text-slate-600',
  pro: 'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
};
const subLabel = { free: 'Gratuit', pro: 'Pro', premium: 'Premium' };

/* ─── 3D Tilt card ───────────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 22 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 22 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        whileHover={{ scale: 1.02 }}
        className={`rounded-2xl ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Stat card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, gradient, delay }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    if (!target) return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setCount(Math.round(target * step / 40));
      if (step >= 40) { setCount(target); clearInterval(id); }
    }, 18);
    return () => clearInterval(id);
  }, [value]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.5 }}>
      <TiltCard>
        <div className="relative rounded-2xl p-5 overflow-hidden text-white" style={{ background: gradient }}>
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-3xl font-bold">{count}</div>
          <div className="text-sm text-white/80 mt-0.5">{label}</div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Edit modal ─────────────────────────────────────────────────────────── */
function EditModal({ user, onClose, onSave }) {
  const [form, setForm] = useState({ subscription: user.subscription, role: user.role });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(user._id, form);
      onClose();
    } catch {
      // keep modal open on error
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6"
      >
        {/* Header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Abonnement</label>
            <select
              value={form.subscription}
              onChange={e => setForm({ ...form, subscription: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            >
              <option value="free">Gratuit</option>
              <option value="pro">Pro</option>
              <option value="premium">Premium</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Rôle</label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            >
              <option value="student">Étudiant</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Delete modal ───────────────────────────────────────────────────────── */
function DeleteModal({ user, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onConfirm(user._id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center"
      >
        <div className="text-4xl mb-3">🗑️</div>
        <h3 className="text-base font-bold text-slate-800 mb-1">Supprimer l'utilisateur ?</h3>
        <p className="text-xs text-slate-400 mb-6">
          <span className="font-semibold text-slate-600">{user.name}</span> sera définitivement supprimé. Cette action est irréversible.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition disabled:opacity-60"
          >
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export default function AdminUsers() {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const [users,    setUsers]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editing,  setEditing]  = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/admin/users`, { headers })
      .then(r => setUsers(r.data))
      .finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line

  const handleSave = async (id, data) => {
    await axios.put(`${API_URL}/admin/users/${id}`, data, { headers });
    load();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/admin/users/${id}`, { headers });
    setDeleting(null);
    load();
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const freeCount  = users.filter(u => u.subscription === 'free').length;
  const paidCount  = users.filter(u => ['pro', 'premium'].includes(u.subscription)).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <div className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}>

        {/* ── Header ── */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light />
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-bold text-lg">Utilisateurs</h1>
                <p className="text-blue-200/60 text-xs">Gestion de tous les comptes</p>
              </div>
            </div>
          </div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total utilisateurs"
              value={users.length}
              icon="👥"
              gradient="linear-gradient(135deg,#2563eb,#1d4ed8)"
              delay={0}
            />
            <StatCard
              label="Comptes gratuits"
              value={freeCount}
              icon="🎓"
              gradient="linear-gradient(135deg,#0891b2,#0e7490)"
              delay={0.08}
            />
            <StatCard
              label="Comptes Pro/Premium"
              value={paidCount}
              icon="⭐"
              gradient="linear-gradient(135deg,#7c3aed,#6d28d9)"
              delay={0.16}
            />
            <StatCard
              label="Administrateurs"
              value={adminCount}
              icon="🛡️"
              gradient="linear-gradient(135deg,#059669,#047857)"
              delay={0.24}
            />
          </div>
        </div>

        {/* ── White content card ── */}
        <div className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl"
          >
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Role filter tabs */}
              <div className="flex gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100 flex-shrink-0">
                {[
                  { key: 'all',     label: `Tous (${users.length})` },
                  { key: 'student', label: `Étudiants (${users.length - adminCount})` },
                  { key: 'admin',   label: `Admins (${adminCount})` },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setRoleFilter(tab.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      roleFilter === tab.key
                        ? 'text-white shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    style={roleFilter === tab.key ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un utilisateur…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                />
              </div>
              {(search || roleFilter !== 'all') && (
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Nom</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Abonnement</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Quiz</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Flashcards</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Score</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Inscription</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.map((user, i) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.025 }}
                          className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group"
                        >
                          {/* Avatar + Nom */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                                style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
                              >
                                {user.name?.charAt(0)?.toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                                  {user.role === 'admin' && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                                      style={{ background: 'rgba(5,150,105,0.12)', color: '#059669' }}>
                                      🛡️ Admin
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-5 py-3.5 text-xs text-slate-500">{user.email}</td>

                          {/* Abonnement badge */}
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${subColors[user.subscription] || subColors.free}`}>
                              {subLabel[user.subscription] || 'Gratuit'}
                            </span>
                          </td>

                          {/* Quiz */}
                          <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">
                            {user.progress?.quizCompleted || 0}
                          </td>

                          {/* Flashcards */}
                          <td className="px-5 py-3.5 text-sm text-slate-600 font-medium">
                            {user.progress?.flashcardsReviewed || 0}
                          </td>

                          {/* Score */}
                          <td className="px-5 py-3.5">
                            <span className="text-sm font-bold text-blue-600">
                              {user.progress?.totalScore || 0}
                            </span>
                          </td>

                          {/* Date inscription */}
                          <td className="px-5 py-3.5 text-xs text-slate-400">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : '—'}
                          </td>

                          {/* Actions (visible on group-hover) */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditing(user)}
                                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition"
                                title="Modifier"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeleting(user)}
                                className="p-1.5 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition"
                                title="Supprimer"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>

                    {filtered.length === 0 && !loading && (
                      <tr>
                        <td colSpan={8} className="text-center py-14 text-sm text-slate-400">
                          {search ? 'Aucun utilisateur ne correspond à votre recherche.' : 'Aucun utilisateur trouvé.'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {editing && (
          <EditModal
            key="edit-modal"
            user={editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
          />
        )}
        {deleting && (
          <DeleteModal
            key="delete-modal"
            user={deleting}
            onClose={() => setDeleting(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
