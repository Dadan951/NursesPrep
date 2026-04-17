import { useState, useEffect } from 'react';
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import NursesLogo from '../../components/NursesLogo';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ─── Palette of preset class colors ─────────────────────────────────────── */
const COLORS = [
  '#0891b2','#2563eb','#7c3aed','#db2777','#dc2626',
  '#ea580c','#ca8a04','#16a34a','#0d9488','#475569',
];

/* ─── 3D Tilt card ───────────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 22 });
  const rotY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 22 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width  - 0.5);
    y.set((e.clientY - r.top)  / r.height - 0.5);
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
        <div className="relative rounded-2xl p-5 overflow-hidden text-white"
          style={{ background: gradient }}>
          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
          <div className="text-2xl mb-1">{icon}</div>
          <div className="text-3xl font-bold">{count}</div>
          <div className="text-sm text-white/80 mt-0.5">{label}</div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ─── Class form modal ───────────────────────────────────────────────────── */
function ClassModal({ editCls, onSave, onClose, token }) {
  const [form, setForm] = useState(
    editCls
      ? { name: editCls.name, description: editCls.description, color: editCls.color, icon: editCls.icon }
      : { name: '', description: '', color: COLORS[0], icon: '💊' }
  );
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editCls) {
        const res = await axios.put(`${API}/api/drugs/classes/${editCls._id}`, form, { headers });
        onSave(res.data, 'edit');
      } else {
        const res = await axios.post(`${API}/api/drugs/classes`, form, { headers });
        onSave(res.data, 'create');
      }
      onClose();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
      >
        <h2 className="text-lg font-bold text-slate-800 mb-5">
          {editCls ? 'Modifier la classe' : 'Nouvelle classe médicamenteuse'}
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="flex gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Icône</label>
              <input type="text" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})}
                className="w-16 h-11 text-center text-2xl border border-slate-200 rounded-xl focus:outline-none focus:border-blue-400" />
            </div>
            {/* Name */}
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Nom *</label>
              <input required type="text" value={form.name} placeholder="ex: Antibiotiques"
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Courte description de la classe..."
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          {/* Color picker */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Couleur</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setForm({...form, color: c})}
                  className={`w-7 h-7 rounded-lg transition-all ${form.color === c ? 'ring-2 ring-offset-2 scale-110' : 'opacity-70 hover:opacity-100'}`}
                  style={{ backgroundColor: c, ringColor: c }} />
              ))}
              <input type="color" value={form.color} onChange={e => setForm({...form, color: e.target.value})}
                className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer" title="Couleur personnalisée" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
              Annuler
            </button>
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
              {saving ? '...' : editCls ? 'Enregistrer' : 'Créer'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── Drug editor ─────────────────────────────────────────────────────────── */
function DrugEditor({ drug: initDrug, classes, token, onSaved, onCancel }) {
  const isEdit = !!initDrug;
  const [form, setForm] = useState(
    isEdit
      ? {
          name: initDrug.name, genericName: initDrug.genericName || '',
          drugClass: initDrug.drugClass?._id || initDrug.drugClass || '',
          description: initDrug.description || '',
          tags: (initDrug.tags || []).join(', '),
          sections: initDrug.sections?.length > 0 ? initDrug.sections : [{ title: '', content: '' }],
          mindMapUrl: initDrug.mindMap?.url || '', mindMapCaption: initDrug.mindMap?.caption || '',
          attachments: initDrug.attachments || [],
          sources: initDrug.sources || [],
        }
      : {
          name: '', genericName: '', drugClass: classes[0]?._id || '',
          description: '', tags: '',
          sections: [{ title: '', content: '' }],
          mindMapUrl: '', mindMapCaption: '',
          attachments: [], sources: [],
        }
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const headers = { Authorization: `Bearer ${token}` };

  /* Section helpers */
  const updateSection = (i, field, val) => {
    const s = [...form.sections];
    s[i] = { ...s[i], [field]: val };
    setForm({ ...form, sections: s });
  };
  const addSection = () => setForm({ ...form, sections: [...form.sections, { title: '', content: '' }] });
  const removeSection = (i) => setForm({ ...form, sections: form.sections.filter((_, j) => j !== i) });
  const moveSection = (i, dir) => {
    const s = [...form.sections];
    const j = i + dir;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    setForm({ ...form, sections: s });
  };

  /* Attachment helpers */
  const addAttachment = () => setForm({ ...form, attachments: [...form.attachments, { name: '', url: '', type: 'pdf' }] });
  const updateAttachment = (i, field, val) => {
    const a = [...form.attachments];
    a[i] = { ...a[i], [field]: val };
    setForm({ ...form, attachments: a });
  };
  const removeAttachment = (i) => setForm({ ...form, attachments: form.attachments.filter((_, j) => j !== i) });

  /* Source helpers */
  const addSource = () => setForm({ ...form, sources: [...form.sources, { title: '', authors: '', year: '', url: '' }] });
  const updateSource = (i, field, val) => {
    const s = [...form.sources];
    s[i] = { ...s[i], [field]: val };
    setForm({ ...form, sources: s });
  };
  const removeSource = (i) => setForm({ ...form, sources: form.sources.filter((_, j) => j !== i) });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.drugClass) return;
    setSaving(true);
    const payload = {
      name: form.name, genericName: form.genericName,
      drugClass: form.drugClass, description: form.description,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      sections: form.sections.filter(s => s.title.trim()),
      mindMap: { url: form.mindMapUrl, caption: form.mindMapCaption },
      attachments: form.attachments.filter(a => a.url.trim()),
      sources: form.sources.filter(s => s.title.trim() || s.url.trim()),
    };
    try {
      let res;
      if (isEdit) {
        res = await axios.put(`${API}/api/drugs/${initDrug._id}`, payload, { headers });
      } else {
        res = await axios.post(`${API}/api/drugs`, payload, { headers });
      }
      onSaved(res.data, isEdit ? 'edit' : 'create');
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const TABS = [
    { id: 'general',  label: 'Général',   icon: '📋' },
    { id: 'sections', label: 'Sections',  icon: '📖' },
    { id: 'media',    label: 'Médias',    icon: '🖼️'  },
    { id: 'sources',  label: 'Sources',   icon: '📚' },
  ];

  const inputCls = "w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition";
  const labelCls = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <form onSubmit={submit} className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? `Modifier — ${initDrug.name}` : 'Nouveau médicament'}
          </h2>
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition p-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map(t => (
            <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}>
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-6 py-5">

        {/* ── GÉNÉRAL ─────────────────────────────────────────────── */}
        {activeTab === 'general' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nom commercial *</label>
                <input required type="text" value={form.name} placeholder="ex: Amoxicilline"
                  onChange={e => setForm({...form, name: e.target.value})} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>DCI / Nom générique</label>
                <input type="text" value={form.genericName} placeholder="ex: Amoxicillin"
                  onChange={e => setForm({...form, genericName: e.target.value})} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Classe médicamenteuse *</label>
              <select required value={form.drugClass} onChange={e => setForm({...form, drugClass: e.target.value})}
                className={inputCls}>
                <option value="">Choisir une classe...</option>
                {classes.map(c => (
                  <option key={c._id} value={c._id}>{c.icon} {c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Description courte</label>
              <textarea value={form.description} rows={3}
                placeholder="Présentation générale du médicament..."
                onChange={e => setForm({...form, description: e.target.value})}
                className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className={labelCls}>Tags (séparés par des virgules)</label>
              <input type="text" value={form.tags} placeholder="ex: beta-lactamine, bactéricide, pénicilline"
                onChange={e => setForm({...form, tags: e.target.value})} className={inputCls} />
            </div>
          </motion.div>
        )}

        {/* ── SECTIONS ────────────────────────────────────────────── */}
        {activeTab === 'sections' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            {/* Auto-sommaire preview */}
            {form.sections.some(s => s.title.trim()) && (
              <div className="mb-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Sommaire automatique</p>
                <div className="space-y-1">
                  {form.sections.map((s, i) => s.title.trim() && (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded bg-blue-200 text-blue-800 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {s.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              {form.sections.map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                      {i + 1}
                    </div>
                    <input type="text" value={s.title} placeholder={`Titre de la partie ${i + 1}...`}
                      onChange={e => updateSection(i, 'title', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-400 bg-white" />
                    <div className="flex gap-1">
                      <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-xs">↑</button>
                      <button type="button" onClick={() => moveSection(i, 1)} disabled={i === form.sections.length - 1}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-30 flex items-center justify-center text-xs">↓</button>
                      <button type="button" onClick={() => removeSection(i)}
                        className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </div>
                  </div>
                  <textarea value={s.content} rows={5}
                    placeholder={`Contenu de la partie ${i + 1}...\n\nTu peux utiliser des listes, des explications détaillées, etc.`}
                    onChange={e => updateSection(i, 'content', e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white" />
                </motion.div>
              ))}
            </div>
            <motion.button type="button" onClick={addSection} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="mt-4 w-full py-3 border-2 border-dashed border-blue-300 rounded-2xl text-sm font-semibold text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter une section
            </motion.button>
          </motion.div>
        )}

        {/* ── MÉDIAS ──────────────────────────────────────────────── */}
        {activeTab === 'media' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Mind map */}
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}>
                <span>🧠</span> Carte mentale
              </label>
              <div className="space-y-2">
                <input type="url" value={form.mindMapUrl}
                  placeholder="URL de l'image de la carte mentale..."
                  onChange={e => setForm({...form, mindMapUrl: e.target.value})}
                  className={inputCls} />
                <input type="text" value={form.mindMapCaption}
                  placeholder="Légende (optionnel)..."
                  onChange={e => setForm({...form, mindMapCaption: e.target.value})}
                  className={inputCls} />
                {form.mindMapUrl && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 mt-2">
                    <img src={form.mindMapUrl} alt="Aperçu carte mentale" className="w-full max-h-48 object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}>
                <span>📎</span> Pièces jointes
              </label>
              <div className="space-y-2">
                {form.attachments.map((a, i) => (
                  <div key={i} className="flex gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <select value={a.type} onChange={e => updateAttachment(i, 'type', e.target.value)}
                      className="w-24 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-400 bg-white">
                      <option value="pdf">PDF</option>
                      <option value="image">Image</option>
                      <option value="video">Vidéo</option>
                      <option value="other">Autre</option>
                    </select>
                    <input type="text" value={a.name} placeholder="Nom du fichier"
                      onChange={e => updateAttachment(i, 'name', e.target.value)}
                      className="w-32 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-400 bg-white" />
                    <input type="url" value={a.url} placeholder="URL..."
                      onChange={e => updateAttachment(i, 'url', e.target.value)}
                      className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-400 bg-white min-w-0" />
                    <button type="button" onClick={() => removeAttachment(i)}
                      className="text-red-400 hover:text-red-600 transition p-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addAttachment}
                  className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-xl text-xs font-semibold text-slate-500 hover:border-blue-300 hover:text-blue-600 transition flex items-center justify-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Ajouter une pièce jointe
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SOURCES ─────────────────────────────────────────────── */}
        {activeTab === 'sources' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
            {form.sources.map((s, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Source {i + 1}</span>
                  <button type="button" onClick={() => removeSource(i)} className="text-red-400 hover:text-red-600 transition">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={s.title} placeholder="Titre"
                    onChange={e => updateSource(i, 'title', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-white" />
                  <input type="text" value={s.authors} placeholder="Auteurs"
                    onChange={e => updateSource(i, 'authors', e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-white" />
                  <input type="text" value={s.year} placeholder="Année"
                    onChange={e => updateSource(i, 'year', e.target.value)}
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-white" />
                  <input type="url" value={s.url} placeholder="URL (optionnel)"
                    onChange={e => updateSource(i, 'url', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 bg-white" />
                </div>
              </div>
            ))}
            <button type="button" onClick={addSource}
              className="w-full py-3 border-2 border-dashed border-amber-300 rounded-2xl text-sm font-semibold text-amber-600 hover:border-amber-400 hover:bg-amber-50 transition flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Ajouter une source
            </button>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
          Annuler
        </button>
        <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
          {saving
            ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sauvegarde...</>
            : isEdit ? '✓ Enregistrer' : '✓ Créer le médicament'
          }
        </motion.button>
      </div>
    </form>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN MEDICAMENTS PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function AdminMedicaments() {
  const { token } = useAuth();
  const [classes,  setClasses]  = useState([]);
  const [drugs,    setDrugs]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selClass, setSelClass] = useState(null);   // selected class filter
  const [search,   setSearch]   = useState('');
  const [panel,    setPanel]    = useState(null);   // null | 'createDrug' | {drug} | 'createClass' | {cls}
  const [classModal, setClassModal] = useState(null); // null | 'create' | cls object
  const [delConfirm, setDelConfirm] = useState(null); // {type, id, name}

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        axios.get(`${API}/api/drugs/classes`, { headers }),
        axios.get(`${API}/api/drugs`,         { headers }),
      ]);
      setClasses(cRes.data);
      setDrugs(dRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  /* Drug list filtered */
  const filteredDrugs = drugs.filter(d => {
    const matchClass = !selClass || d.drugClass?._id === selClass;
    const matchSearch = !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.genericName?.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const handleSaveClass = (saved, mode) => {
    if (mode === 'create') setClasses(prev => [...prev, { ...saved, drugCount: 0 }]);
    else setClasses(prev => prev.map(c => c._id === saved._id ? { ...saved, drugCount: c.drugCount } : c));
    setClassModal(null);
  };

  const handleSaveDrug = (saved, mode) => {
    if (mode === 'create') setDrugs(prev => [...prev, saved]);
    else setDrugs(prev => prev.map(d => d._id === saved._id ? saved : d));
    setPanel(null);
    load(); // refresh class counts
  };

  const handleDelete = async () => {
    if (!delConfirm) return;
    try {
      if (delConfirm.type === 'drug') {
        await axios.delete(`${API}/api/drugs/${delConfirm.id}`, { headers });
        setDrugs(prev => prev.filter(d => d._id !== delConfirm.id));
      } else {
        await axios.delete(`${API}/api/drugs/classes/${delConfirm.id}`, { headers });
        setClasses(prev => prev.filter(c => c._id !== delConfirm.id));
        setDrugs(prev => prev.filter(d => d.drugClass?._id !== delConfirm.id));
        if (selClass === delConfirm.id) setSelClass(null);
      }
    } catch (e) { console.error(e); }
    setDelConfirm(null);
  };

  const totalDrugs   = drugs.length;
  const totalClasses = classes.length;
  const totalSections = drugs.reduce((acc, d) => acc + (d.sections?.length || 0), 0);

  return (
    <DashboardLayout isAdmin>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');`}</style>
      <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }}>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <NursesLogo size="sm" light />
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="text-white font-bold text-lg">Médicaments</h1>
                <p className="text-blue-200/60 text-xs">Gestion des classes et des cours</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setClassModal('create')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white border border-white/20 hover:bg-white/20 transition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Classe
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setPanel('createDrug')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Médicament
              </motion.button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Classes"     value={totalClasses}  icon="🗂️"  delay={0}    gradient="linear-gradient(135deg,#2563eb,#1d4ed8)" />
            <StatCard label="Médicaments" value={totalDrugs}    icon="💊"  delay={0.1}  gradient="linear-gradient(135deg,#0891b2,#0e7490)" />
            <StatCard label="Sections"    value={totalSections} icon="📖"  delay={0.2}  gradient="linear-gradient(135deg,#7c3aed,#6d28d9)" />
          </div>
        </div>

        {/* ── Content area ──────────────────────────────────────────── */}
        <div className="px-6 pb-8">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex" style={{ minHeight: 600 }}>

              {/* ── Classes sidebar ──────────────────────────────── */}
              <div className="w-64 border-r border-slate-100 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Classes</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2">
                  {/* All classes */}
                  <button
                    onClick={() => setSelClass(null)}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm mb-1 transition-all ${
                      !selClass ? 'bg-blue-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">🗂️</span>
                    <span className="flex-1 truncate">Tous</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${!selClass ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {drugs.length}
                    </span>
                  </button>

                  {loading
                    ? <div className="flex justify-center py-8"><div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>
                    : classes.sort((a, b) => a.name.localeCompare(b.name, 'fr')).map((cls, i) => {
                        const count = drugs.filter(d => d.drugClass?._id === cls._id).length;
                        return (
                          <motion.div key={cls._id}
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="group flex items-center gap-1 mb-0.5"
                          >
                            <button
                              onClick={() => setSelClass(cls._id)}
                              className={`flex-1 text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${
                                selClass === cls._id ? 'text-white font-semibold shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                              }`}
                              style={selClass === cls._id ? { backgroundColor: cls.color } : {}}
                            >
                              <span className="text-base">{cls.icon}</span>
                              <span className="flex-1 truncate text-xs">{cls.name}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold flex-shrink-0 ${
                                selClass === cls._id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {count}
                              </span>
                            </button>
                            {/* Class actions */}
                            <div className="hidden group-hover:flex gap-0.5">
                              <button onClick={() => setClassModal(cls)}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-400 hover:text-blue-600 flex items-center justify-center transition text-xs">✏️</button>
                              <button onClick={() => setDelConfirm({ type: 'class', id: cls._id, name: cls.name })}
                                className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 flex items-center justify-center transition text-xs">🗑</button>
                            </div>
                          </motion.div>
                        );
                      })
                  }
                </div>
                {/* Add class button */}
                <div className="p-3 border-t border-slate-100">
                  <button onClick={() => setClassModal('create')}
                    className="w-full py-2.5 border-2 border-dashed border-blue-300 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition flex items-center justify-center gap-1.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Nouvelle classe
                  </button>
                </div>
              </div>

              {/* ── Drugs list + editor ───────────────────────────── */}
              <div className="flex-1 flex overflow-hidden">

                {/* Drug list */}
                <div className={`flex flex-col ${panel ? 'w-64 flex-shrink-0 border-r border-slate-100' : 'flex-1'}`}>
                  {/* Search */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher..."
                        className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100" />
                    </div>
                  </div>

                  {/* Drugs */}
                  <div className="flex-1 overflow-y-auto p-3">
                    {loading
                      ? <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>
                      : filteredDrugs.length === 0
                        ? (
                          <div className="text-center py-12 text-slate-400">
                            <div className="text-4xl mb-2">💊</div>
                            <p className="text-sm font-medium">Aucun médicament</p>
                            <button onClick={() => setPanel('createDrug')}
                              className="mt-3 text-xs text-blue-500 hover:underline">
                              + Créer le premier
                            </button>
                          </div>
                        )
                        : filteredDrugs.map((drug, i) => {
                            const cls = classes.find(c => c._id === drug.drugClass?._id);
                            const isActive = panel?._id === drug._id;
                            return (
                              <motion.div key={drug._id}
                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.025 }}
                                className={`group flex items-center gap-3 p-3 rounded-xl mb-1 cursor-pointer transition-all ${
                                  isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50 border border-transparent'
                                }`}
                                onClick={() => setPanel(drug)}
                              >
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                  style={{ backgroundColor: (cls?.color || '#0891b2') + '20' }}>
                                  {cls?.icon || '💊'}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-800 truncate">{drug.name}</p>
                                  {drug.genericName && <p className="text-xs text-slate-400 truncate italic">{drug.genericName}</p>}
                                </div>
                                <button
                                  onClick={e => { e.stopPropagation(); setDelConfirm({ type: 'drug', id: drug._id, name: drug.name }); }}
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center transition text-xs"
                                >
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                </button>
                              </motion.div>
                            );
                          })
                    }
                  </div>

                  {/* Add drug */}
                  {!panel && (
                    <div className="p-3 border-t border-slate-100">
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                        onClick={() => setPanel('createDrug')}
                        className="w-full py-2.5 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-1.5"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                        Nouveau médicament
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Drug editor panel */}
                <AnimatePresence>
                  {panel && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col overflow-hidden"
                    >
                      <DrugEditor
                        drug={panel === 'createDrug' ? null : panel}
                        classes={classes}
                        token={token}
                        onSaved={handleSaveDrug}
                        onCancel={() => setPanel(null)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* ── Modals ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {classModal && (
            <ClassModal
              editCls={classModal === 'create' ? null : classModal}
              onSave={handleSaveClass}
              onClose={() => setClassModal(null)}
              token={token}
            />
          )}
        </AnimatePresence>

        {/* Delete confirm modal */}
        <AnimatePresence>
          {delConfirm && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDelConfirm(null)}
            >
              <motion.div initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
              >
                <div className="text-4xl mb-3">🗑️</div>
                <h3 className="font-bold text-slate-800 mb-1">Supprimer ?</h3>
                <p className="text-sm text-slate-500 mb-5">
                  <span className="font-semibold">"{delConfirm.name}"</span> sera définitivement supprimé
                  {delConfirm.type === 'class' && ' ainsi que tous ses médicaments'}.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDelConfirm(null)}
                    className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition">
                    Annuler
                  </button>
                  <button onClick={handleDelete}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition">
                    Supprimer
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
