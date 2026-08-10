import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge, PubBadge,
  Toolbar, SearchInput, BulkBar, DataTable, Modal, ConfirmModal,
  Field, Toggle, inputCls, toast, useDraft, DraftBanner, formatSize, C,
} from '../../components/admin/adminKit';

const annaleIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" />
    <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.doc,.docx';
const FILE_TYPE_LABELS = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
};

const EMPTY = { title: '', year: '', semester: '', programVersion: 'ancien', subject: '', description: '', isPublished: true };

/* ─── Modal Annale ──────────────────────────────────────────────────────── */
function AnnaleModal({ annale, onClose, onSave, existingYears = [], existingSemesters = [], existingCategories = [] }) {
  const isNew = !annale;
  const initial = annale ? { ...annale } : { ...EMPTY };
  const [form, setForm] = useState(initial);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeFile, setRemoveFile]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const fileRef = useRef(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial) || !!selectedFile || removeFile;
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:annale', form, { enabled: isNew, initial: EMPTY });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setSelectedFile(f); setRemoveFile(false); }
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.year.trim() || !form.semester.trim() || !form.subject.trim()) {
      return toast.error('Titre, université, semestre et matière sont requis');
    }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title',       form.title);
      fd.append('year',        form.year);
      fd.append('semester',    form.semester);
      fd.append('programVersion', form.programVersion || 'ancien');
      fd.append('subject',     form.subject);
      fd.append('description', form.description || '');
      fd.append('isPublished', form.isPublished ? 'true' : 'false');
      if (selectedFile) fd.append('file', selectedFile);
      if (removeFile)   fd.append('removeFile', 'true');
      await onSave(fd, annale?._id);
      clearDraft();
      onClose();
      toast.success(isNew ? 'Annale créée' : 'Annale mise à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setLoading(false); }
  };

  const hasExistingFile = annale?.hasFile && !removeFile && !selectedFile;
  const fileLabel = selectedFile ? selectedFile.name : hasExistingFile ? annale.fileName : null;

  return (
    <Modal
      title={annale ? "Modifier l'annale" : 'Nouvelle annale'}
      subtitle={annale ? 'Mettre à jour les informations' : "Ajouter un sujet d'examen"}
      icon={annaleIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={560}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={handleSave} loading={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</PrimaryBtn>
      </>}
    >
      {pendingDraft && isNew && (
        <DraftBanner onRestore={() => setForm(consumeDraft())} onDismiss={dismissDraft} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Titre" required>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Examen final UE 2.4 — Session 1" className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Université" required>
            <input list="ann-year-list" value={form.year} onChange={e => set('year', e.target.value)} placeholder="Ex: Paris Cité 2024-2025" className={inputCls} />
            <datalist id="ann-year-list">{existingYears.map(y => <option key={y} value={y} />)}</datalist>
          </Field>
          <Field label="Semestre" required>
            <input list="ann-sem-list" value={form.semester} onChange={e => set('semester', e.target.value)} placeholder="Ex: Semestre 1" className={inputCls} />
            <datalist id="ann-sem-list">{existingSemesters.map(s => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Programme">
            <select value={form.programVersion || 'ancien'} onChange={e => set('programVersion', e.target.value)} className={inputCls}>
              <option value="ancien">Ancien programme</option>
              <option value="reforme_2026">Réforme 2026</option>
            </select>
          </Field>
        </div>

        <Field label="Matière / Sujet" required>
          <input list="ann-cat-list" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Ex: UE 2.4 — Processus traumatiques" className={inputCls} />
          <datalist id="ann-cat-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
        </Field>

        <Field label="Description (optionnelle)">
          <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Informations complémentaires sur le sujet…" />
        </Field>

        {/* Fichier */}
        <Field label="Fichier (PDF, image…)">
          <input ref={fileRef} type="file" accept={FILE_ACCEPT} style={{ display: 'none' }} onChange={handleFileChange} />
          {fileLabel ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(var(--theme-primary-rgb),0.06)', borderRadius: 14, border: `1.5px solid ${C.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileLabel}</p>
                {selectedFile && <p style={{ fontSize: 11, color: C.sub }}>{formatSize(selectedFile.size)}</p>}
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#fff', border: `1px solid ${C.border}`, color: C.sub, cursor: 'pointer', minHeight: 36 }}>
                  Changer
                </button>
                <button type="button" onClick={() => { setSelectedFile(null); setRemoveFile(true); }}
                  style={{ padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#fff', border: '1px solid #fecaca', color: '#ef4444', cursor: 'pointer', minHeight: 36 }}>
                  Retirer
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px', borderRadius: 14, border: `2px dashed ${C.border}`, background: 'transparent', cursor: 'pointer', textAlign: 'left', minHeight: 60 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Joindre un fichier</p>
                <p style={{ fontSize: 11, color: C.sub }}>PDF, image, Word</p>
              </div>
            </button>
          )}
        </Field>

        <Toggle checked={form.isPublished} onChange={v => set('isPublished', v)} labels={['Publiée — visible par les étudiants', 'Masquée — non visible']} />
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminAnnales() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [search, setSearch]     = useState('');
  const [selected, setSelected]     = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const load = () => {
    setLoading(true);
    setSelected(new Set());
    axios.get(`${API_URL}/annales/admin`)
      .then(r => setItems(r.data))
      .catch(() => toast.error('Impossible de charger les annales'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (formData, id) => {
    if (id) await axios.put(`${API_URL}/annales/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else    await axios.post(`${API_URL}/annales`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    load();
  };
  const handleDelete = async (id) => {
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/annales/${id}`);
      setDeleting(null);
      toast.success('Annale supprimée');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const toggleOne = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(a => a._id)));
  };
  const bulkAction = async (action, value) => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      await axios.post(`${API_URL}/admin/bulk/annales`, { ids: [...selected], action, value }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'delete' ? `${selected.size} annale(s) supprimée(s)` : 'Statut mis à jour');
      setBulkDeleting(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setBulkLoading(false); }
  };

  const filtered = items.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.subject.toLowerCase().includes(search.toLowerCase()) ||
    a.year.toLowerCase().includes(search.toLowerCase())
  );
  const published = items.filter(a => a.isPublished).length;
  const years = [...new Set(items.map(a => a.year))].length;

  return (
    <AdminPage
      title="Annales"
      subtitle="Gestion des sujets d'examens"
      icon={annaleIcon()}
      stats={[
        { value: items.length, label: 'annales' },
        { value: published,    label: 'publiées' },
        { value: years,        label: 'universités' },
      ]}
      actions={<HeroBtn onClick={() => setModal('new')}>{plusIcon} Nouvelle annale</HeroBtn>}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une annale…" />
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.sub, fontWeight: 600 }}>{filtered.length} / {items.length}</span>
        </Toolbar>

        <AnimatePresence>
          {selected.size > 0 && (
            <BulkBar
              count={selected.size}
              loading={bulkLoading}
              onPublish={() => bulkAction('publish', true)}
              onUnpublish={() => bulkAction('publish', false)}
              onDelete={() => setBulkDeleting(true)}
              onClear={() => setSelected(new Set())}
            />
          )}
        </AnimatePresence>

        <DataTable
          loading={loading}
          items={filtered}
          selectable={{ selected, toggleOne, toggleAll }}
          onEdit={a => setModal(a)}
          onDelete={a => setDeleting(a)}
          empty={{
            icon: annaleIcon(24),
            title: 'Aucune annale',
            hint: search ? null : "Ajoute ton premier sujet d'examen",
            onReset: search ? () => setSearch('') : null,
          }}
          columns={[
            { label: 'Titre', maxWidth: 220, render: a => <span style={{ fontWeight: 700 }} title={a.title}>{a.title}</span> },
            { label: 'Université', render: a => <Badge color="#4f46e5">{a.year}</Badge> },
            { label: 'Semestre', render: a => <Badge color="#2563eb">{a.semester}</Badge> },
            { label: 'Matière', maxWidth: 180, render: a => <span style={{ fontSize: 12, color: C.sub }} title={a.subject}>{a.subject}</span> },
            { label: 'Fichier', render: a => a.hasFile ? <Badge color="#dc2626">{FILE_TYPE_LABELS[a.fileMimeType] || 'Fichier'}</Badge> : <span style={{ color: '#cbd5e1' }}>—</span> },
            { label: 'Statut', render: a => <PubBadge ok={a.isPublished} labels={['Publiée', 'Masquée']} /> },
          ]}
          renderCard={a => (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', marginBottom: 8 }}>{a.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <Badge color="#4f46e5">{a.year}</Badge>
                <Badge color="#2563eb">{a.semester}</Badge>
                {a.hasFile && <Badge color="#dc2626">{FILE_TYPE_LABELS[a.fileMimeType] || 'Fichier'}</Badge>}
                <PubBadge ok={a.isPublished} labels={['Publiée', 'Masquée']} />
              </div>
              <div style={{ fontSize: 12, color: C.sub }}>{a.subject}</div>
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {modal && (
          <AnnaleModal
            annale={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingYears={[...new Set(items.map(x => x.year).filter(Boolean))].sort((a, b) => b.localeCompare(a))}
            existingSemesters={[...new Set(items.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(items.map(x => x.subject).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmModal
            title="Supprimer cette annale ?"
            message={<><strong>« {deleting.title} »</strong><br />Cette action est irréversible.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
        {bulkDeleting && (
          <ConfirmModal
            title={`Supprimer ${selected.size} annale(s) ?`}
            message="Cette action est irréversible."
            onConfirm={() => bulkAction('delete')}
            onClose={() => setBulkDeleting(false)}
            loading={bulkLoading}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
