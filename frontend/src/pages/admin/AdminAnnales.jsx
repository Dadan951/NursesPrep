import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { API_URL } from '../../context/AuthContext';
import NursesLogo from '../../components/NursesLogo';

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';
const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
};
function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}

/* ─── TiltCard ──────────────────────────────────────────────────────────────── */
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
        onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
        whileHover={{ scale: 1.02 }} className={`rounded-2xl ${className}`}>
        {children}
      </motion.div>
    </div>
  );
}

/* ─── StatCard ──────────────────────────────────────────────────────────────── */
function StatCard({ label, value, icon, gradient, delay }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const t = Number(value) || 0; if (!t) return;
    let s = 0;
    const id = setInterval(() => { s++; setCount(Math.round(t * s / 40)); if (s >= 40) { setCount(t); clearInterval(id); } }, 18);
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

/* ─── EMPTY state ───────────────────────────────────────────────────────────── */
const EMPTY = {
  title: '', year: '', semester: '', subject: '', description: '', isPublished: true,
};

/* ─── AnnaleModal ───────────────────────────────────────────────────────────── */
function AnnaleModal({ annale, onClose, onSave, existingSemesters = [], existingCategories = [] }) {
  const [form, setForm]           = useState(annale ? { ...annale } : { ...EMPTY });
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
    if (!form.title || !form.year || !form.semester || !form.subject) {
      return alert('Titre, année, semestre et matière sont requis');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('year',        form.year);
      fd.append('semester',    form.semester);
      fd.append('subject',     form.subject);
      fd.append('description', form.description || '');
      fd.append('isPublished', form.isPublished ? 'true' : 'false');
      if (selectedFile) fd.append('file', selectedFile);
      if (removeFile)   fd.append('removeFile', 'true');
      await onSave(fd, annale?._id);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const hasExistingFile = annale?.hasFile && !removeFile && !selectedFile;
  const fileLabel = selectedFile ? selectedFile.name : hasExistingFile ? annale.fileName : null;

  const inputCls = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition placeholder:text-slate-400';
  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-7 py-5 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              📜
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{annale ? "Modifier l'annale" : 'Nouvelle annale'}</h3>
              <p className="text-xs text-blue-200/60 mt-0.5">{annale ? 'Mettre à jour les informations' : 'Ajouter un sujet d\'examen'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition hover:bg-white/10"
            style={{ background: 'rgba(255,255,255,0.08)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-7 space-y-5">

          {/* Titre */}
          <div>
            <label className={labelCls}>Titre *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)}
              placeholder="Ex: Examen final UE 2.4 — Session 1" className={inputCls}/>
          </div>

          {/* Year + Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Année *</label>
              <input value={form.year} onChange={e => set('year', e.target.value)}
                placeholder="Ex: 2023-2024" className={inputCls}/>
            </div>
            <div>
              <label className={labelCls}>Semestre *</label>
              <input
                list="ann-sem-list"
                value={form.semester} onChange={e => set('semester', e.target.value)}
                placeholder="Ex: Semestre 1" className={inputCls}/>
              <datalist id="ann-sem-list">
                {existingSemesters.map(s => <option key={s} value={s} />)}
              </datalist>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className={labelCls}>Matière / Sujet *</label>
            <input
              list="ann-cat-list"
              value={form.subject} onChange={e => set('subject', e.target.value)}
              placeholder="Ex: UE 2.4 — Processus traumatiques" className={inputCls}/>
            <datalist id="ann-cat-list">
              {existingCategories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description (optionnelle)</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={2} className={`${inputCls} resize-none`}
              placeholder="Informations complémentaires sur le sujet..."/>
          </div>

          {/* File upload */}
          <div>
            <label className={labelCls}>Fichier (PDF, image…)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {fileLabel ? 'Changer' : 'Choisir un fichier'}
              </button>
              {fileLabel && (
                <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-xl border border-blue-200">
                  <span className="text-xs text-blue-700 font-medium truncate">{fileLabel}</span>
                  {selectedFile && <span className="text-xs text-slate-400 flex-shrink-0">{formatSize(selectedFile.size)}</span>}
                  <button type="button" onClick={() => { setSelectedFile(null); setRemoveFile(true); }}
                    className="ml-auto text-slate-400 hover:text-red-500 transition flex-shrink-0">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept={FILE_ACCEPT} className="hidden" onChange={handleFileChange}/>
          </div>

          {/* Published toggle */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition hover:opacity-90"
            style={{ background: form.isPublished ? 'linear-gradient(135deg,#dcfce7,#d1fae5)' : '#f8fafc' }}
            onClick={() => set('isPublished', !form.isPublished)}>
            <span className={`text-xs font-semibold ${form.isPublished ? 'text-emerald-700' : 'text-slate-500'}`}>
              {form.isPublished ? '✅ Publiée — visible par les étudiants' : '🔒 Masquée — non visible'}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-all ${form.isPublished ? 'bg-emerald-500' : 'bg-slate-300'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isPublished ? 'left-5' : 'left-0.5'}`}/>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-4 border-t border-slate-100 flex gap-3 bg-slate-50/60">
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-100 transition">
            Annuler
          </button>
          <button onClick={handleSave} disabled={loading}
            className="flex-1 py-2.5 text-white rounded-xl text-sm font-semibold transition disabled:opacity-60 hover:opacity-90 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>}
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── AdminAnnales ──────────────────────────────────────────────────────────── */
export default function AdminAnnales() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch]   = useState('');

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/annales/admin`).then(r => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (formData, id) => {
    if (id) await axios.put(`${API_URL}/annales/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else    await axios.post(`${API_URL}/annales`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    load();
  };
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/annales/${id}`);
    setDeleting(null);
    load();
  };

  const filtered  = items.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase()) ||
    a.year.toLowerCase().includes(search.toLowerCase())
  );
  const published = items.filter(a => a.isPublished).length;
  const years     = [...new Set(items.map(a => a.year))].length;

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>
      <div className="flex-1 overflow-y-auto" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 40%,#0c4a6e 100%)' }}>

        {/* ── Header ── */}
        <div className="px-6 pt-8 pb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light/>
              <div className="h-6 w-px bg-white/20"/>
              <div>
                <h1 className="text-white font-bold text-lg">Annales</h1>
                <p className="text-blue-200/60 text-xs">Gestion des sujets d'examens</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModal('new')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nouvelle annale
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Total annales" value={items.length}  icon="📜" gradient="linear-gradient(135deg,#2563eb,#1d4ed8)" delay={0}/>
            <StatCard label="Publiées"       value={published}    icon="✅" gradient="linear-gradient(135deg,#059669,#047857)" delay={0.1}/>
            <StatCard label="Années"         value={years}        icon="📅" gradient="linear-gradient(135deg,#0891b2,#0e7490)" delay={0.2}/>
          </div>
        </div>

        {/* ── White card ── */}
        <div className="px-6 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl">

            {/* Toolbar */}
            <div className="p-5 border-b border-slate-100 flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher une annale…"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition"/>
              </div>
              <span className="ml-auto text-xs text-slate-400 font-medium">
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-3">📜</div>
                <p className="font-semibold">Aucune annale</p>
                <p className="text-xs mt-1">Ajoutez votre premier sujet d'examen</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      {['Titre', 'Année', 'Semestre', 'Matière', 'Fichier', 'Statut', ''].map(h => (
                        <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((item, i) => (
                        <motion.tr key={item._id}
                          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }} transition={{ delay: i * 0.02 }}
                          className="border-b border-slate-100 hover:bg-blue-50/30 transition-all group">
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-800 max-w-[180px] truncate">{item.title}</td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-semibold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">{item.year}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{item.semester}</span>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-slate-600 max-w-[160px] truncate">{item.subject}</td>
                          <td className="px-5 py-3.5">
                            {item.hasFile ? (
                              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-600">
                                {FILE_TYPE_LABELS[item.fileMimeType] || 'Fichier'}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-300">—</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {item.isPublished ? 'Publiée' : 'Masquée'}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => setModal(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition" title="Modifier">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                              </button>
                              <button onClick={() => setDeleting(item)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition" title="Supprimer">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal ── */}
      <AnimatePresence>
        {modal && (
          <AnnaleModal
            annale={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={[...new Set(items.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(items.map(x => x.subject).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      {/* ── Delete confirm ── */}
      <AnimatePresence>
        {deleting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setDeleting(null); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl text-center">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-base font-bold text-slate-800 mb-1.5">Supprimer cette annale ?</h3>
              <p className="text-xs text-slate-400 mb-1 font-medium">{deleting.title}</p>
              <p className="text-xs text-slate-400 mb-6">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                  Annuler
                </button>
                <button onClick={() => handleDelete(deleting._id)}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition">
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
