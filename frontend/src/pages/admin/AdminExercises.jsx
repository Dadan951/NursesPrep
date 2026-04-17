import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

const EMPTY = { title: '', content: '', answer: '', semester: '', caseType: '', category: '', type: 'open', difficulty: 'medium', isPublished: true, options: [] };
const QCM_OPT = [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }];

/* ─── TiltCard ─────────────────────────────────────────────────────────────── */
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

/* ─── StatCard ──────────────────────────────────────────────────────────────── */
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

/* ─── ExModal ───────────────────────────────────────────────────────────────── */
function ExModal({ item, onClose, onSave }) {
  const [form, setForm] = useState(item ? { ...item, options: item.options || [] } : EMPTY);
  const [loading, setLoading] = useState(false);

  const isQcm = form.type === 'qcm';

  const setOpt = (i, field, value) => {
    const opts = [...form.options];
    if (field === 'isCorrect' && value) opts.forEach((o, idx) => { opts[idx] = { ...o, isCorrect: idx === i }; });
    else opts[i] = { ...opts[i], [field]: value };
    setForm({ ...form, options: opts });
  };

  const handleTypeChange = (type) => {
    setForm({ ...form, type, options: type === 'qcm' ? (form.options.length ? form.options : [...QCM_OPT]) : form.options });
  };

  const handleSave = async () => {
    if (!form.title || !form.content || !form.category) return alert('Titre, contenu et catégorie sont requis');
    setLoading(true);
    try { await onSave(form); onClose(); }
    catch (err) { alert(err.response?.data?.message || 'Erreur'); }
    finally { setLoading(false); }
  };

  const typeOptions = [
    { value: 'open', label: 'Question ouverte' },
    { value: 'qcm', label: 'QCM' },
    { value: 'case_study', label: 'Cas clinique' },
  ];
  const diffOptions = [
    { value: 'easy', label: 'Facile', color: 'emerald' },
    { value: 'medium', label: 'Moyen', color: 'amber' },
    { value: 'hard', label: 'Difficile', color: 'red' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        >
          {/* Modal header */}
          <div
            className="px-7 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
                style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                ✏️
              </div>
              <h3 className="text-sm font-bold text-white">
                {item ? "Modifier l'exercice" : 'Nouvel exercice'}
              </h3>
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
          <div className="flex-1 overflow-auto p-7 space-y-5 bg-white">

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Titre *</label>
              <input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Titre de l'exercice"
              />
            </div>

            {/* Type pill buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Type</label>
              <div className="flex gap-2 flex-wrap">
                {typeOptions.map(t => (
                  <button
                    key={t.value}
                    onClick={() => handleTypeChange(t.value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      form.type === t.value
                        ? 'text-white border-transparent shadow-sm'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                    style={form.type === t.value ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester + CaseType */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Semestre</label>
                <input
                  value={form.semester || ''}
                  onChange={e => setForm({ ...form, semester: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Ex: Semestre 2"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Type de cas</label>
                <input
                  value={form.caseType || ''}
                  onChange={e => setForm({ ...form, caseType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Ex: Cas pratiques"
                />
              </div>
            </div>

            {/* Category + Difficulty */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Catégorie (UE) *</label>
                <input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Ex: UE 4.4"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Difficulté</label>
                <div className="flex gap-1.5">
                  {diffOptions.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setForm({ ...form, difficulty: d.value })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        form.difficulty === d.value
                          ? d.value === 'easy' ? 'bg-emerald-500 text-white border-transparent'
                            : d.value === 'medium' ? 'bg-amber-500 text-white border-transparent'
                            : 'bg-red-500 text-white border-transparent'
                          : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Énoncé *</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition"
                placeholder="Énoncé de l'exercice..."
              />
            </div>

            {/* QCM options */}
            {isQcm && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Options QCM
                </label>
                <div className="space-y-2">
                  {(form.options.length ? form.options : QCM_OPT).map((opt, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2.5"
                    >
                      <button
                        onClick={() => setOpt(i, 'isCorrect', true)}
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          opt.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white hover:border-emerald-400'
                        }`}
                      >
                        {opt.isCorrect && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <input
                        value={opt.text}
                        onChange={e => setOpt(i, 'text', e.target.value)}
                        className={`flex-1 px-3.5 py-2 rounded-xl border text-xs text-slate-800 focus:outline-none transition ${
                          opt.isCorrect
                            ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100'
                            : 'border-slate-200 bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                        }`}
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Answer */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Correction / Réponse</label>
              <textarea
                value={form.answer}
                onChange={e => setForm({ ...form, answer: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition"
                placeholder="Correction détaillée..."
              />
            </div>

            {/* Published */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition hover:opacity-90"
              style={{ background: form.isPublished ? 'linear-gradient(135deg,#dcfce7,#d1fae5)' : '#f8fafc' }}
              onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
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
          <div className="px-7 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/60">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60 hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── AdminExercises ────────────────────────────────────────────────────────── */
export default function AdminExercises() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/exercises/admin`).then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (data) => {
    if (data._id) await axios.put(`${API_URL}/exercises/${data._id}`, data);
    else await axios.post(`${API_URL}/exercises`, data);
    load();
  };
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/exercises/${id}`);
    setDeleting(null);
    load();
  };

  const typeLabel = { qcm: 'QCM', open: 'Question ouverte', case_study: 'Cas clinique' };
  const typeColors = { qcm: 'bg-blue-100 text-blue-700', open: 'bg-purple-100 text-purple-700', case_study: 'bg-orange-100 text-orange-700' };
  const diffColors = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
  const diffLabel = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

  const qcmCount = items.filter(i => i.type === 'qcm').length;
  const openCount = items.filter(i => i.type === 'open').length;
  const caseCount = items.filter(i => i.type === 'case_study').length;

  const filtered = items.filter(i => {
    const matchSearch = i.title.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === 'all' || i.type === filterType;
    return matchSearch && matchType;
  });

  const filterPills = [
    ['all', 'Tout'],
    ['qcm', 'QCM'],
    ['open', 'Question ouverte'],
    ['case_study', 'Cas clinique'],
  ];

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light />
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-bold text-lg">Exercices</h1>
                <p className="text-blue-200/60 text-xs">Gestion des exercices cliniques</p>
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
              Nouvel exercice
            </motion.button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Exercices" value={items.length} icon="📝" gradient="linear-gradient(135deg,#2563eb,#1d4ed8)" delay={0} />
            <StatCard label="QCM" value={qcmCount} icon="☑️" gradient="linear-gradient(135deg,#0891b2,#0e7490)" delay={0.1} />
            <StatCard label="Questions ouvertes" value={openCount} icon="✍️" gradient="linear-gradient(135deg,#7c3aed,#6d28d9)" delay={0.2} />
            <StatCard label="Cas cliniques" value={caseCount} icon="🏥" gradient="linear-gradient(135deg,#db2777,#be185d)" delay={0.3} />
          </div>
        </div>

        {/* ── White card ─────────────────────────────────────────────────── */}
        <div className="px-6 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un exercice..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
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
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Titre</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Catégorie</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulté</th>
                      <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                      <th className="px-5 py-3.5" />
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((item, i) => (
                        <motion.tr
                          key={item._id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ delay: i * 0.02 }}
                          className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group"
                        >
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[220px] truncate">
                            {item.title}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColors[item.type]}`}>
                              {typeLabel[item.type]}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                              {item.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffColors[item.difficulty]}`}>
                              {diffLabel[item.difficulty]}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {item.isPublished ? 'Publié' : 'Masqué'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.92 }}
                                onClick={() => setModal(item)}
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
                                onClick={() => setDeleting(item)}
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
                        <td colSpan={6} className="text-center py-14">
                          <div className="text-3xl mb-2">📋</div>
                          <div className="text-sm text-slate-400 font-medium">Aucun exercice trouvé</div>
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

      {/* ── ExModal ──────────────────────────────────────────────────────── */}
      {modal && (
        <ExModal
          item={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Delete confirm ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleting && (
          <motion.div
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
              <h3 className="text-base font-bold text-slate-800 mb-1.5">Supprimer cet exercice ?</h3>
              <p className="text-xs text-slate-400 mb-1 font-medium">{deleting.title}</p>
              <p className="text-xs text-slate-400 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleting(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleDelete(deleting._id)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
