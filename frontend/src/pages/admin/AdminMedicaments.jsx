import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge,
  Toolbar, SearchInput, DataTable, Modal, ConfirmModal,
  Field, inputCls, toast, useDraft, DraftBanner, C,
} from '../../components/admin/adminKit';

const pillIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.5 20.5-7-7a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z" />
    <path d="m8.5 8.5 7 7" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const COLORS = ['#0891b2', '#2563eb', '#7c3aed', '#db2777', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#0d9488', '#475569'];

/* ─── Modal Classe ──────────────────────────────────────────────────────── */
function ClassModal({ editCls, onSave, onClose, token }) {
  const initial = editCls
    ? { name: editCls.name, description: editCls.description, color: editCls.color, icon: editCls.icon }
    : { name: '', description: '', color: COLORS[0], icon: '' };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const headers = { Authorization: `Bearer ${token}` };
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const submit = async () => {
    if (!form.name.trim()) return toast.error('Le nom de la classe est requis');
    setSaving(true);
    try {
      if (editCls) {
        const res = await axios.put(`${API_URL}/drugs/classes/${editCls._id}`, form, { headers });
        onSave(res.data, 'edit');
      } else {
        const res = await axios.post(`${API_URL}/drugs/classes`, form, { headers });
        onSave(res.data, 'create');
      }
      onClose();
      toast.success(editCls ? 'Classe mise à jour' : 'Classe créée');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={editCls ? 'Modifier la classe' : 'Nouvelle classe médicamenteuse'}
      icon={pillIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={480}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={submit} loading={saving}>{saving ? 'Enregistrement…' : editCls ? 'Enregistrer' : 'Créer'}</PrimaryBtn>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flexShrink: 0, width: 74 }}>
            <Field label="Icône">
              <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                style={{ width: '100%', boxSizing: 'border-box', height: 46, textAlign: 'center', fontSize: 22, border: `1.5px solid ${C.border}`, borderRadius: 12, outline: 'none', background: '#f8fafc' }} />
            </Field>
          </div>
          <div style={{ flex: 1 }}>
            <Field label="Nom" required>
              <input type="text" value={form.name} placeholder="ex: Antibiotiques"
                onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
          </div>
        </div>
        <Field label="Description">
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Courte description de la classe…" rows={2} className={`${inputCls} resize-none`} />
        </Field>
        <Field label="Couleur">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            {COLORS.map(c => (
              <button key={c} type="button" onClick={() => setForm({ ...form, color: c })}
                aria-label={`Couleur ${c}`}
                style={{
                  width: 32, height: 32, borderRadius: 10, cursor: 'pointer', backgroundColor: c,
                  border: 'none', outline: form.color === c ? `2.5px solid ${c}` : 'none', outlineOffset: 2,
                  opacity: form.color === c ? 1 : 0.65, transform: form.color === c ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.15s',
                }} />
            ))}
            <input type="color" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })}
              style={{ width: 32, height: 32, borderRadius: 10, border: `1px solid ${C.border}`, cursor: 'pointer', padding: 0 }} title="Couleur personnalisée" />
          </div>
        </Field>
      </div>
    </Modal>
  );
}

/* ─── Modal Médicament (éditeur complet à onglets) ──────────────────────── */
function DrugModal({ drug: initDrug, classes, token, onSaved, onClose }) {
  const isEdit = !!initDrug;
  const initial = isEdit
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
      };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const headers = { Authorization: `Bearer ${token}` };

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:drug', form, { enabled: !isEdit, initial });

  /* Sections */
  const updateSection = (i, field, val) => { const s = [...form.sections]; s[i] = { ...s[i], [field]: val }; setForm({ ...form, sections: s }); };
  const addSection    = () => setForm({ ...form, sections: [...form.sections, { title: '', content: '' }] });
  const removeSection = (i) => setForm({ ...form, sections: form.sections.filter((_, j) => j !== i) });
  const moveSection   = (i, dir) => {
    const s = [...form.sections]; const j = i + dir;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    setForm({ ...form, sections: s });
  };

  /* Attachments */
  const addAttachment    = () => setForm({ ...form, attachments: [...form.attachments, { name: '', url: '', type: 'pdf' }] });
  const updateAttachment = (i, field, val) => { const a = [...form.attachments]; a[i] = { ...a[i], [field]: val }; setForm({ ...form, attachments: a }); };
  const removeAttachment = (i) => setForm({ ...form, attachments: form.attachments.filter((_, j) => j !== i) });

  /* Sources */
  const addSource    = () => setForm({ ...form, sources: [...form.sources, { title: '', authors: '', year: '', url: '' }] });
  const updateSource = (i, field, val) => { const s = [...form.sources]; s[i] = { ...s[i], [field]: val }; setForm({ ...form, sources: s }); };
  const removeSource = (i) => setForm({ ...form, sources: form.sources.filter((_, j) => j !== i) });

  const submit = async () => {
    if (!form.name.trim())  return toast.error('Le nom commercial est requis');
    if (!form.drugClass)    return toast.error('Choisis une classe médicamenteuse');
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
      if (isEdit) res = await axios.put(`${API_URL}/drugs/${initDrug._id}`, payload, { headers });
      else        res = await axios.post(`${API_URL}/drugs`, payload, { headers });
      clearDraft();
      onSaved(res.data, isEdit ? 'edit' : 'create');
      toast.success(isEdit ? 'Médicament mis à jour' : 'Médicament créé');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setSaving(false); }
  };

  const TABS = [
    { id: 'general',  label: 'Général' },
    { id: 'sections', label: `Sections (${form.sections.filter(s => s.title.trim()).length})` },
    { id: 'media',    label: 'Médias' },
    { id: 'sources',  label: `Sources (${form.sources.length})` },
  ];

  const smallInput = { padding: '9px 11px', borderRadius: 11, border: `1.5px solid ${C.border}`, background: '#fff', outline: 'none', fontSize: 13, minHeight: 40, boxSizing: 'border-box' };

  return (
    <Modal
      title={isEdit ? `Modifier — ${initDrug.name}` : 'Nouveau médicament'}
      subtitle="Fiche pharmacologique"
      icon={pillIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={720}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={submit} loading={saving}>{saving ? 'Sauvegarde…' : isEdit ? 'Enregistrer' : 'Créer le médicament'}</PrimaryBtn>
      </>}
    >
      {pendingDraft && !isEdit && (
        <DraftBanner onRestore={() => setForm(consumeDraft())} onDismiss={dismissDraft} />
      )}

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} type="button" onClick={() => setActiveTab(t.id)}
            style={{
              padding: '9px 14px', borderRadius: 11, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 40,
              background: activeTab === t.id ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : C.bg,
              color: activeTab === t.id ? '#fff' : C.sub,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GÉNÉRAL ── */}
      {activeTab === 'general' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nom commercial" required>
              <input type="text" value={form.name} placeholder="ex: Amoxicilline"
                onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} />
            </Field>
            <Field label="DCI / Nom générique">
              <input type="text" value={form.genericName} placeholder="ex: Amoxicillin"
                onChange={e => setForm({ ...form, genericName: e.target.value })} className={inputCls} />
            </Field>
          </div>
          <Field label="Classe médicamenteuse" required>
            <select value={form.drugClass} onChange={e => setForm({ ...form, drugClass: e.target.value })} className={inputCls}>
              <option value="">Choisir une classe…</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
            </select>
          </Field>
          <Field label="Description courte">
            <textarea value={form.description} rows={3} placeholder="Présentation générale du médicament…"
              onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none`} />
          </Field>
          <Field label="Tags" hint="séparés par des virgules">
            <input type="text" value={form.tags} placeholder="ex: beta-lactamine, bactéricide, pénicilline"
              onChange={e => setForm({ ...form, tags: e.target.value })} className={inputCls} />
          </Field>
        </div>
      )}

      {/* ── SECTIONS ── */}
      {activeTab === 'sections' && (
        <div>
          {form.sections.some(s => s.title.trim()) && (
            <div style={{ marginBottom: 18, background: 'rgba(var(--theme-primary-rgb),0.06)', border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--theme-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Sommaire automatique</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {form.sections.map((s, i) => s.title.trim() && (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text }}>
                    <span style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(var(--theme-primary-rgb),0.15)', color: 'var(--theme-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                    {s.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {form.sections.map((s, i) => (
              <div key={i} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>{i + 1}</div>
                  <input type="text" value={s.title} placeholder={`Titre de la partie ${i + 1}…`}
                    onChange={e => updateSection(i, 'title', e.target.value)}
                    className="text-base md:text-sm"
                    style={{ ...smallInput, flex: 1, minWidth: 140, fontWeight: 700 }} />
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button type="button" onClick={() => moveSection(i, -1)} disabled={i === 0} aria-label="Monter"
                      style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer', opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                    <button type="button" onClick={() => moveSection(i, 1)} disabled={i === form.sections.length - 1} aria-label="Descendre"
                      style={{ width: 34, height: 34, borderRadius: 9, background: '#fff', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer', opacity: i === form.sections.length - 1 ? 0.3 : 1 }}>↓</button>
                    <button type="button" onClick={() => removeSection(i)} aria-label="Supprimer la section"
                      style={{ width: 34, height: 34, borderRadius: 9, background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                </div>
                <textarea value={s.content} rows={5}
                  placeholder={`Contenu de la partie ${i + 1}…`}
                  onChange={e => updateSection(i, 'content', e.target.value)}
                  className="text-base md:text-sm"
                  style={{ ...smallInput, width: '100%', resize: 'vertical' }} />
              </div>
            ))}
          </div>
          <button type="button" onClick={addSection}
            style={{ marginTop: 14, width: '100%', padding: '13px', borderRadius: 16, border: '2px dashed rgba(var(--theme-primary-rgb),0.4)', background: 'transparent', fontSize: 13, fontWeight: 700, color: 'var(--theme-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}>
            {plusIcon} Ajouter une section
          </button>
        </div>
      )}

      {/* ── MÉDIAS ── */}
      {activeTab === 'media' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Field label="Carte mentale">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input type="url" value={form.mindMapUrl} placeholder="URL de l'image de la carte mentale…"
                onChange={e => setForm({ ...form, mindMapUrl: e.target.value })} className={inputCls} />
              <input type="text" value={form.mindMapCaption} placeholder="Légende (optionnel)…"
                onChange={e => setForm({ ...form, mindMapCaption: e.target.value })} className={inputCls} />
              {form.mindMapUrl && (
                <div style={{ borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${C.border}` }}>
                  <img src={form.mindMapUrl} alt="Aperçu carte mentale" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
                </div>
              )}
            </div>
          </Field>

          <Field label="Pièces jointes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {form.attachments.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: 10, flexWrap: 'wrap' }}>
                  <select value={a.type} onChange={e => updateAttachment(i, 'type', e.target.value)} style={{ ...smallInput, width: 90 }}>
                    <option value="pdf">PDF</option><option value="image">Image</option><option value="video">Vidéo</option><option value="other">Autre</option>
                  </select>
                  <input type="text" value={a.name} placeholder="Nom" onChange={e => updateAttachment(i, 'name', e.target.value)} style={{ ...smallInput, flex: '1 1 100px' }} />
                  <input type="url" value={a.url} placeholder="URL…" onChange={e => updateAttachment(i, 'url', e.target.value)} style={{ ...smallInput, flex: '2 1 160px', minWidth: 0 }} />
                  <button type="button" onClick={() => removeAttachment(i)} aria-label="Retirer"
                    style={{ width: 40, height: 40, borderRadius: 10, background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
              <button type="button" onClick={addAttachment}
                style={{ width: '100%', padding: '12px', borderRadius: 14, border: `2px dashed ${C.border}`, background: 'transparent', fontSize: 12, fontWeight: 700, color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, minHeight: 46 }}>
                {plusIcon} Ajouter une pièce jointe
              </button>
            </div>
          </Field>
        </div>
      )}

      {/* ── SOURCES ── */}
      {activeTab === 'sources' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {form.sources.map((s, i) => (
            <div key={i} style={{ background: C.bg, border: `1.5px solid ${C.border}`, borderRadius: 16, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: C.sub }}>Source {i + 1}</span>
                <button type="button" onClick={() => removeSource(i)} aria-label="Retirer la source"
                  style={{ width: 32, height: 32, borderRadius: 9, background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input type="text" value={s.title} placeholder="Titre" onChange={e => updateSource(i, 'title', e.target.value)} className="sm:col-span-2" style={{ ...smallInput, width: '100%' }} />
                <input type="text" value={s.authors} placeholder="Auteurs" onChange={e => updateSource(i, 'authors', e.target.value)} style={{ ...smallInput, width: '100%' }} />
                <input type="text" value={s.year} placeholder="Année" onChange={e => updateSource(i, 'year', e.target.value)} style={{ ...smallInput, width: '100%' }} />
                <input type="url" value={s.url} placeholder="URL (optionnel)" onChange={e => updateSource(i, 'url', e.target.value)} className="sm:col-span-2" style={{ ...smallInput, width: '100%' }} />
              </div>
            </div>
          ))}
          <button type="button" onClick={addSource}
            style={{ width: '100%', padding: '13px', borderRadius: 16, border: '2px dashed #fcd34d', background: 'transparent', fontSize: 13, fontWeight: 700, color: '#d97706', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 48 }}>
            {plusIcon} Ajouter une source
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminMedicaments() {
  const { token } = useAuth();
  const [classes, setClasses]   = useState([]);
  const [drugs, setDrugs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selClass, setSelClass] = useState(null);
  const [search, setSearch]     = useState('');
  const [drugModal, setDrugModal]   = useState(null);  // null | 'create' | drug
  const [classModal, setClassModal] = useState(null);  // null | 'create' | cls
  const [delConfirm, setDelConfirm] = useState(null);  // { type, id, name }
  const [delLoading, setDelLoading] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const [cRes, dRes] = await Promise.all([
        axios.get(`${API_URL}/drugs/classes`, { headers }),
        axios.get(`${API_URL}/drugs`, { headers }),
      ]);
      setClasses(cRes.data);
      setDrugs(dRes.data);
    } catch { toast.error('Impossible de charger les médicaments'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []); // eslint-disable-line

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
    setDrugModal(null);
    load();
  };

  const handleDelete = async () => {
    if (!delConfirm) return;
    setDelLoading(true);
    try {
      if (delConfirm.type === 'drug') {
        await axios.delete(`${API_URL}/drugs/${delConfirm.id}`, { headers });
        setDrugs(prev => prev.filter(d => d._id !== delConfirm.id));
        toast.success('Médicament supprimé');
      } else {
        await axios.delete(`${API_URL}/drugs/classes/${delConfirm.id}`, { headers });
        setClasses(prev => prev.filter(c => c._id !== delConfirm.id));
        setDrugs(prev => prev.filter(d => d.drugClass?._id !== delConfirm.id));
        if (selClass === delConfirm.id) setSelClass(null);
        toast.success('Classe supprimée');
      }
      setDelConfirm(null);
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const totalSections = drugs.reduce((acc, d) => acc + (d.sections?.length || 0), 0);
  const sortedClasses = [...classes].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  return (
    <AdminPage
      title="Médicaments"
      subtitle="Gestion des classes et des fiches pharmacologiques"
      icon={pillIcon()}
      stats={[
        { value: classes.length, label: 'classes' },
        { value: drugs.length,   label: 'médicaments' },
        { value: totalSections,  label: 'sections' },
      ]}
      actions={<>
        <HeroBtn secondary onClick={() => setClassModal('create')}>{plusIcon} Classe</HeroBtn>
        <HeroBtn onClick={() => setDrugModal('create')}>{plusIcon} Médicament</HeroBtn>
      </>}
    >
      {/* ── Classes : puces filtrantes ── */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14, WebkitOverflowScrolling: 'touch' }}>
        <button onClick={() => setSelClass(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
            cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, minHeight: 40,
            border: `1.5px solid ${!selClass ? 'transparent' : C.border}`,
            background: !selClass ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : '#fff',
            color: !selClass ? '#fff' : C.sub,
            boxShadow: !selClass ? '0 3px 10px rgba(var(--theme-primary-rgb),0.35)' : '0 1px 3px rgba(0,0,0,0.06)',
          }}>
          Tous
          <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 8px', borderRadius: 999, background: !selClass ? 'rgba(255,255,255,0.25)' : C.bg }}>{drugs.length}</span>
        </button>
        {sortedClasses.map(cls => {
          const count = drugs.filter(d => d.drugClass?._id === cls._id).length;
          const active = selClass === cls._id;
          return (
            <div key={cls._id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: 2 }}>
              <button onClick={() => setSelClass(active ? null : cls._id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '9px 15px', borderRadius: 999, fontSize: 12.5, fontWeight: 700,
                  cursor: 'pointer', whiteSpace: 'nowrap', minHeight: 40,
                  border: `1.5px solid ${active ? 'transparent' : C.border}`,
                  background: active ? cls.color : '#fff',
                  color: active ? '#fff' : C.sub,
                  boxShadow: active ? `0 3px 10px ${cls.color}55` : '0 1px 3px rgba(0,0,0,0.06)',
                }}>
                {cls.icon && <span>{cls.icon}</span>}
                {cls.name}
                <span style={{ fontSize: 11, fontWeight: 800, padding: '1px 8px', borderRadius: 999, background: active ? 'rgba(255,255,255,0.25)' : C.bg }}>{count}</span>
              </button>
              {active && (
                <div style={{ display: 'flex', gap: 2 }}>
                  <button onClick={() => setClassModal(cls)} aria-label="Modifier la classe"
                    style={{ width: 34, height: 34, borderRadius: 999, background: '#fff', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </button>
                  <button onClick={() => setDelConfirm({ type: 'class', id: cls._id, name: cls.name })} aria-label="Supprimer la classe"
                    style={{ width: 34, height: 34, borderRadius: 999, background: '#fff', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un médicament…" />
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.sub, fontWeight: 600 }}>{filteredDrugs.length} / {drugs.length}</span>
        </Toolbar>

        <DataTable
          loading={loading}
          items={filteredDrugs}
          onEdit={d => setDrugModal(d)}
          onDelete={d => setDelConfirm({ type: 'drug', id: d._id, name: d.name })}
          empty={{
            icon: pillIcon(24),
            title: 'Aucun médicament',
            hint: 'Crée ta première fiche pharmacologique',
            onReset: (search || selClass) ? () => { setSearch(''); setSelClass(null); } : null,
          }}
          columns={[
            { label: 'Nom', maxWidth: 220, render: d => {
              const cls = classes.find(c => c._id === d.drugClass?._id);
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, backgroundColor: (cls?.color || '#0891b2') + '22' }}>
                    {cls?.icon || '💊'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span>
                    {d.genericName && <span style={{ fontSize: 11, color: C.sub, fontStyle: 'italic' }}>{d.genericName}</span>}
                  </div>
                </div>
              );
            } },
            { label: 'Classe', render: d => {
              const cls = classes.find(c => c._id === d.drugClass?._id);
              return cls ? <Badge color={cls.color}>{cls.name}</Badge> : <span style={{ color: '#cbd5e1' }}>—</span>;
            } },
            { label: 'Sections', render: d => <span style={{ fontWeight: 700 }}>{d.sections?.length || 0}</span> },
            { label: 'Tags', maxWidth: 200, render: d => (d.tags || []).length
              ? <span style={{ fontSize: 11, color: C.sub }}>{d.tags.slice(0, 3).join(', ')}{d.tags.length > 3 ? '…' : ''}</span>
              : <span style={{ color: '#cbd5e1' }}>—</span> },
          ]}
          renderCard={d => {
            const cls = classes.find(c => c._id === d.drugClass?._id);
            return (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, backgroundColor: (cls?.color || '#0891b2') + '22' }}>
                    {cls?.icon || '💊'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif' }}>{d.name}</div>
                    {d.genericName && <div style={{ fontSize: 11, color: C.sub, fontStyle: 'italic' }}>{d.genericName}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {cls && <Badge color={cls.color}>{cls.name}</Badge>}
                  <Badge color="#64748b">{d.sections?.length || 0} section{(d.sections?.length || 0) > 1 ? 's' : ''}</Badge>
                </div>
              </>
            );
          }}
        />
      </Card>

      {/* ── Modals ── */}
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

      <AnimatePresence>
        {drugModal && (
          <DrugModal
            drug={drugModal === 'create' ? null : drugModal}
            classes={classes}
            token={token}
            onSaved={handleSaveDrug}
            onClose={() => setDrugModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {delConfirm && (
          <ConfirmModal
            title={delConfirm.type === 'class' ? 'Supprimer cette classe ?' : 'Supprimer ce médicament ?'}
            message={<><strong>« {delConfirm.name} »</strong> sera définitivement supprimé{delConfirm.type === 'class' ? ' ainsi que tous ses médicaments' : ''}.</>}
            onConfirm={handleDelete}
            onClose={() => setDelConfirm(null)}
            loading={delLoading}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
