import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

const EMPTY = { front: '', back: '', semester: '', category: '', chapter: '', difficulty: 'medium', hint: '', isPublished: true };

/* ── Tilt 3-D card ─────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0), y = useMotionValue(0);
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

/* ── Animated stat card ─────────────────────────────────────────────── */
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

/* ── Flash modal ────────────────────────────────────────────────────── */
function FlashModal({ item, preset, onClose, onSave, existingSemesters = [], existingCategories = [], existingChapters = [] }) {
  const [form, setForm] = useState(item ? { ...item } : { ...EMPTY, ...(preset || {}) });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.front || !form.back || !form.category) return alert('Recto, verso et catégorie sont requis');
    setLoading(true);
    try { await onSave(form); onClose(); }
    catch (err) { alert(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Modal header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}>
          <div>
            <h3 className="text-base font-bold text-white">{item ? 'Modifier la flashcard' : 'Nouvelle flashcard'}</h3>
            <p className="text-xs text-blue-200/60 mt-0.5">{item ? 'Mettre à jour les informations' : 'Créer une nouvelle carte de révision'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-4">
          <div>
            <label className={labelCls}>Recto (Question) *</label>
            <textarea
              value={form.front}
              onChange={e => setForm({ ...form, front: e.target.value })}
              rows={2}
              className={`${inputCls} resize-none`}
              placeholder="Question ou terme…"
            />
          </div>
          <div>
            <label className={labelCls}>Verso (Réponse) *</label>
            <textarea
              value={form.back}
              onChange={e => setForm({ ...form, back: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
              placeholder="Définition ou réponse…"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Semestre</label>
              <input
                list="fc-sem-list"
                value={form.semester || ''}
                onChange={e => setForm({ ...form, semester: e.target.value })}
                className={inputCls}
                placeholder="Ex: Semestre 1"
              />
              <datalist id="fc-sem-list">
                {existingSemesters.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>Catégorie (UE) *</label>
              <input
                list="fc-cat-list"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className={inputCls}
                placeholder="Ex: UE 2.4"
              />
              <datalist id="fc-cat-list">
                {existingCategories.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Chapitre</label>
              <input
                list="fc-chap-list"
                value={form.chapter || ''}
                onChange={e => setForm({ ...form, chapter: e.target.value })}
                className={inputCls}
                placeholder="Ex: Troubles du rythme"
              />
              <datalist id="fc-chap-list">
                {existingChapters.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>
          </div>
          <div>
            <label className={labelCls}>Difficulté</label>
            <select
              value={form.difficulty}
              onChange={e => setForm({ ...form, difficulty: e.target.value })}
              className={inputCls}
            >
              <option value="easy">Facile</option>
              <option value="medium">Moyen</option>
              <option value="hard">Difficile</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Indice (optionnel)</label>
            <input
              value={form.hint}
              onChange={e => setForm({ ...form, hint: e.target.value })}
              className={inputCls}
              placeholder="Indice pour aider…"
            />
          </div>
          <div className="flex items-center gap-2.5">
            <input
              type="checkbox"
              id="fpub"
              checked={form.isPublished}
              onChange={e => setForm({ ...form, isPublished: e.target.checked })}
              className="w-4 h-4 accent-blue-500"
            />
            <label htmlFor="fpub" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Publié</label>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            Annuler
          </button>
          <motion.button
            onClick={handleSave}
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
          >
            {loading ? 'Enregistrement…' : 'Enregistrer'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────────────── */
export default function AdminFlashcards() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search,     setSearch]     = useState('');
  const [filterSem,  setFilterSem]  = useState('');
  const [filterUE,   setFilterUE]   = useState('');
  const [filterChap, setFilterChap] = useState('');

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/flashcards/admin`).then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (data) => {
    if (data._id) await axios.put(`${API_URL}/flashcards/${data._id}`, data);
    else await axios.post(`${API_URL}/flashcards`, data);
    load();
  };
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/flashcards/${id}`);
    setDeleting(null);
    load();
  };

  const diffColors = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
  };
  const diffLabel = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

  const semesters = [...new Set(items.map(i => i.semester).filter(Boolean))].sort();
  const ues       = [...new Set(
    items.filter(i => !filterSem || i.semester === filterSem).map(i => i.category).filter(Boolean)
  )].sort();
  const chapters  = [...new Set(
    items.filter(i => (!filterSem || i.semester === filterSem) && (!filterUE || i.category === filterUE))
         .map(i => i.chapter).filter(Boolean)
  )].sort();

  const filtered = items.filter(i => {
    const matchSearch = i.front.toLowerCase().includes(search.toLowerCase()) || (i.category||'').toLowerCase().includes(search.toLowerCase());
    const matchSem  = !filterSem  || i.semester  === filterSem;
    const matchUE   = !filterUE   || i.category  === filterUE;
    const matchChap = !filterChap || i.chapter    === filterChap;
    return matchSearch && matchSem && matchUE && matchChap;
  });

  const published  = items.filter(i => i.isPublished).length;
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))].length;

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}>

        {/* ── Header ── */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light />
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-bold text-lg">Flashcards</h1>
                <p className="text-blue-200/60 text-xs">Gestion des cartes de révision</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nouvelle flashcard
            </motion.button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total Flashcards"
              value={items.length}
              icon=""
              gradient="linear-gradient(135deg,#2563eb,#1d4ed8)"
              delay={0}
            />
            <StatCard
              label="Publiées"
              value={published}
              icon=""
              gradient="linear-gradient(135deg,#059669,#047857)"
              delay={0.1}
            />
            <StatCard
              label="Catégories"
              value={categories}
              icon=""
              gradient="linear-gradient(135deg,#0891b2,#0e7490)"
              delay={0.2}
            />
          </div>
        </div>

        {/* ── White content card ── */}
        <div className="px-6 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl">

            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[180px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher une flashcard…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400"
                />
              </div>

              {/* Filtre semestre */}
              <select value={filterSem} onChange={e => { setFilterSem(e.target.value); setFilterUE(''); setFilterChap(''); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white">
                <option value="">Tous les semestres</option>
                {semesters.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {/* Filtre UE (cascade depuis semestre) */}
              <select value={filterUE} onChange={e => { setFilterUE(e.target.value); setFilterChap(''); }}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white max-w-[220px]">
                <option value="">Toutes les UE</option>
                {ues.map(u => <option key={u} value={u}>{u}</option>)}
              </select>

              {/* Filtre chapitre (cascade depuis UE) */}
              <select value={filterChap} onChange={e => setFilterChap(e.target.value)}
                className="px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white max-w-[220px]">
                <option value="">Tous les chapitres</option>
                {chapters.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              {/* Bouton contextuel */}
              {(filterSem || filterUE || filterChap) && (
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setModal({ _preset: true, semester: filterSem, category: filterUE, chapter: filterChap })}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-sm whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Ajouter une flashcard ici
                </motion.button>
              )}

              <span className="ml-auto text-xs text-slate-400 font-medium">
                {filtered.length} / {items.length} flashcard{items.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table body */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-3"></div>
                <p className="font-semibold">Aucune flashcard trouvée</p>
                {(search || filterSem || filterUE || filterChap) ? (
                  <button onClick={() => { setSearch(''); setFilterSem(''); setFilterUE(''); setFilterChap(''); }}
                    className="mt-3 text-xs text-blue-500 hover:text-blue-700 underline">
                    Réinitialiser les filtres
                  </button>
                ) : (
                  <p className="text-xs mt-1">Ajoutez votre première carte de révision</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Recto</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Catégorie</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulté</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item, i) => (
                      <motion.tr
                        key={item._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group"
                      >
                        <td className="px-5 py-3.5 text-sm font-medium text-slate-800 max-w-xs truncate">{item.front}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">{item.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffColors[item.difficulty]}`}>
                            {diffLabel[item.difficulty]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {item.isPublished ? 'Publiée' : 'Masquée'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setModal(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                              title="Modifier"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button
                              onClick={() => setDeleting(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
                              title="Supprimer"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FlashModal ── */}
      <AnimatePresence>
        {modal && (
          <FlashModal
            item={modal === 'new' || modal?._preset ? null : modal}
            preset={modal?._preset ? { semester: modal.semester, category: modal.category, chapter: modal.chapter } : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={[...new Set(items.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(items.map(x => x.category).filter(Boolean))].sort()}
            existingChapters={[...new Set(items.map(x => x.chapter).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirm modal ── */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="text-5xl mb-4"></div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Supprimer cette flashcard ?</h3>
              <p className="text-xs text-slate-400 mb-6">
                « <span className="font-medium text-slate-600">{deleting.front?.slice(0, 60)}{deleting.front?.length > 60 ? '…' : ''}</span> »
                <br />Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(deleting._id)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                >
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
