import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

const EMPTY = {
  title: '', type: 'cours', semester: '', category: '', chapter: '', summary: '',
  content: '', difficulty: 'medium', tags: '', isPublished: true,
};

const FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.txt';
const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'text/plain': 'Texte',
};

function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}

/* ─── 3D Tilt card ─────────────────────────────────────────────────────────── */
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

/* ─── Stat card ────────────────────────────────────────────────────────────── */
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

/* ─── Lesson Modal (preserves all file upload logic) ───────────────────────── */
function LessonModal({ lesson, onClose, onSave }) {
  const [form, setForm] = useState(lesson
    ? { ...lesson, tags: (lesson.tags || []).join(', ') }
    : { ...EMPTY }
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeFile, setRemoveFile]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setSelectedFile(f); setRemoveFile(false); }
    e.target.value = '';
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('type',        form.type);
      fd.append('semester',    form.semester || '');
      fd.append('category',    form.category);
      fd.append('chapter',     form.chapter || '');
      fd.append('summary',     form.summary || '');
      fd.append('content',     form.content || '');
      fd.append('difficulty',  form.difficulty);
      fd.append('isPublished', form.isPublished ? 'true' : 'false');
      fd.append('tags', JSON.stringify(
        form.tags.split(',').map(t => t.trim()).filter(Boolean)
      ));
      if (selectedFile) fd.append('file', selectedFile);
      if (removeFile)   fd.append('removeFile', 'true');

      await onSave(fd, lesson?._id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const hasExistingFile = lesson?.hasFile && !removeFile && !selectedFile;
  const fileLabel = selectedFile
    ? selectedFile.name
    : hasExistingFile
      ? lesson.fileName
      : null;

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Modal header */}
        <div
          className="px-7 py-5 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              📚
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {lesson ? 'Modifier le contenu' : 'Nouveau contenu'}
              </h3>
              <p className="text-xs text-blue-200/60 mt-0.5">
                {lesson ? 'Mettre à jour les informations' : 'Créer un cours ou une fiche de révision'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">

          {/* Type toggle */}
          <div>
            <label className={labelCls}>Type</label>
            <div className="flex gap-2">
              {['cours', 'fiche'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set('type', t)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    form.type === t
                      ? 'text-white border-transparent shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                  style={form.type === t ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}
                >
                  {t === 'cours' ? '📖 Cours' : '📄 Fiche'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelCls}>Titre *</label>
              <input
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Ex: Hémostase — Mécanismes de coagulation"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Semestre</label>
              <input
                value={form.semester || ''}
                onChange={e => set('semester', e.target.value)}
                placeholder="Ex: Semestre 1"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Catégorie (UE) *</label>
              <input
                value={form.category}
                onChange={e => set('category', e.target.value)}
                placeholder="Ex: UE 2.4"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Chapitre</label>
              <input
                value={form.chapter}
                onChange={e => set('chapter', e.target.value)}
                placeholder="Ex: Chapitre 3"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Difficulté</label>
              <select
                value={form.difficulty}
                onChange={e => set('difficulty', e.target.value)}
                className={inputCls}
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyen</option>
                <option value="hard">Difficile</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tags (séparés par virgules)</label>
              <input
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="Ex: coagulation, sang, hémostase"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Résumé</label>
            <input
              value={form.summary}
              onChange={e => set('summary', e.target.value)}
              placeholder="Courte description visible dans la liste..."
              className={inputCls}
            />
          </div>

          {/* File attachment */}
          <div>
            <label className={labelCls}>
              Fichier joint <span className="font-normal text-slate-400 normal-case">(PDF, image, Word, texte — max 15 Mo)</span>
            </label>
            <input ref={fileRef} type="file" accept={FILE_ACCEPT} className="hidden" onChange={handleFileChange} />
            {fileLabel ? (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{fileLabel}</p>
                  {selectedFile && <p className="text-xs text-slate-400">{formatSize(selectedFile.size)}</p>}
                  {hasExistingFile && <p className="text-xs text-slate-400">{formatSize(lesson.fileSize)}</p>}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition"
                  >
                    Changer
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setRemoveFile(true); }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-red-200 text-xs text-red-500 hover:bg-red-50 transition"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center gap-3 p-3.5 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/30 transition text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700">Joindre un fichier</p>
                  <p className="text-xs text-slate-400">PDF, image, Word, texte — max 15 Mo</p>
                </div>
              </button>
            )}
          </div>

          {/* Text content */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls}>Contenu texte</label>
              <span className="text-xs text-slate-400 font-normal">**Titre** pour sous-titres, - pour listes</span>
            </div>
            <textarea
              value={form.content}
              onChange={e => set('content', e.target.value)}
              rows={10}
              placeholder={"**Introduction**\n- Point important 1\n- Point important 2\n\n**Section 2**\nTexte du cours..."}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition resize-none font-mono placeholder:text-slate-400"
            />
          </div>

          {/* Published toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition hover:opacity-90"
            style={{ background: form.isPublished ? 'linear-gradient(135deg,#dcfce7,#d1fae5)' : '#f8fafc' }}
            onClick={() => set('isPublished', !form.isPublished)}
          >
            <span className={`text-xs font-semibold ${form.isPublished ? 'text-emerald-700' : 'text-slate-500'}`}>
              {form.isPublished ? '✅ Publié — visible par les étudiants' : '🔒 Masqué — non visible'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-all ${form.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isPublished ? 'left-5' : 'left-0.5'}`} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/60 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition"
          >
            Annuler
          </button>
          <motion.button
            onClick={handleSave}
            disabled={loading || !form.title.trim() || !form.category.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
          >
            {loading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
            {lesson ? 'Enregistrer' : 'Créer le contenu'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

const DIFF_COLORS = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
const DIFF_LABEL  = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export default function AdminLessons() {
  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [search, setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/lessons/admin`)
      .then(r => setLessons(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = lessons.filter(l => {
    const matchType = filterType === 'all' || l.type === filterType;
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q)
      || l.category.toLowerCase().includes(q)
      || (l.chapter || '').toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const handleSave = async (formData, id) => {
    if (id) {
      const { data } = await axios.put(`${API_URL}/lessons/${id}`, formData);
      setLessons(prev => prev.map(l => l._id === data._id ? data : l));
    } else {
      const { data } = await axios.post(`${API_URL}/lessons`, formData);
      setLessons(prev => [data, ...prev]);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API_URL}/lessons/${id}`);
      setLessons(prev => prev.filter(l => l._id !== id));
    } catch {}
    setDeletingId(null);
    setDeleting(null);
  };

  const cours  = lessons.filter(l => l.type === 'cours').length;
  const fiches = lessons.filter(l => l.type === 'fiche').length;

  const filterPills = [
    ['all', 'Tout'],
    ['cours', 'Cours'],
    ['fiche', 'Fiches'],
  ];

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>

      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}>

        {/* ── Header ── */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light />
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-bold text-lg">Cours & Fiches</h1>
                <p className="text-blue-200/60 text-xs">Gestion du contenu pédagogique</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setModal('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Nouveau contenu
            </motion.button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Total contenus"
              value={lessons.length}
              icon="📚"
              gradient="linear-gradient(135deg,#2563eb,#1d4ed8)"
              delay={0}
            />
            <StatCard
              label="Cours"
              value={cours}
              icon="📖"
              gradient="linear-gradient(135deg,#0891b2,#0e7490)"
              delay={0.1}
            />
            <StatCard
              label="Fiches"
              value={fiches}
              icon="📄"
              gradient="linear-gradient(135deg,#7c3aed,#6d28d9)"
              delay={0.2}
            />
          </div>
        </div>

        {/* ── White content card ── */}
        <div className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un cours ou fiche…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400"
                />
              </div>

              {/* Filter pills */}
              <div className="flex gap-2 flex-wrap">
                {filterPills.map(([val, lbl]) => (
                  <button
                    key={val}
                    onClick={() => setFilterType(val)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      filterType === val
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                    style={filterType === val ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-3">📚</div>
                <p className="font-semibold">Aucun contenu</p>
                <p className="text-xs mt-1">Créez votre premier cours ou fiche de révision</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Titre</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden sm:table-cell">Type</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Catégorie</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Difficulté</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">Fichier</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">Statut</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence initial={false}>
                      {filtered.map((lesson, i) => (
                        <motion.tr
                          key={lesson._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold text-slate-800 truncate max-w-[220px]">{lesson.title}</p>
                            {lesson.chapter && <p className="text-xs text-slate-400 mt-0.5">{lesson.chapter}</p>}
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              lesson.type === 'fiche' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {lesson.type === 'fiche' ? 'Fiche' : 'Cours'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                              {lesson.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DIFF_COLORS[lesson.difficulty] || DIFF_COLORS.medium}`}>
                              {DIFF_LABEL[lesson.difficulty] || 'Moyen'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 hidden lg:table-cell">
                            {lesson.hasFile ? (
                              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                                </svg>
                                {FILE_TYPE_LABELS[lesson.fileMimeType] || 'Fichier'} · {formatSize(lesson.fileSize)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Texte seulement</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 hidden md:table-cell">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              lesson.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {lesson.isPublished ? 'Publié' : 'Brouillon'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                              <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setModal(lesson)}
                                className="p-1.5 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100 transition"
                                title="Modifier"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setDeleting(lesson)}
                                className="p-1.5 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition"
                                title="Supprimer"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-14">
                          <div className="text-3xl mb-2">📋</div>
                          <div className="text-sm text-slate-400 font-medium">Aucun contenu trouvé</div>
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

      {/* ── Lesson Modal ── */}
      <AnimatePresence>
        {(modal === 'new' || (modal && modal._id)) && (
          <LessonModal
            key="lesson-modal"
            lesson={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirm modal ── */}
      <AnimatePresence>
        {deleting && (
          <motion.div
            key="delete-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleting(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">Supprimer ce contenu ?</h3>
              <p className="text-sm font-semibold text-slate-700 mb-1 truncate px-4">{deleting.title}</p>
              <p className="text-xs text-slate-400 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(deleting._id)}
                  disabled={deletingId === deleting._id}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {deletingId === deleting._id && (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
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
