import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge, PubBadge, DIFF_BADGE,
  Toolbar, SearchInput, FilterPills, BulkBar, DataTable, Modal, ConfirmModal,
  Field, Toggle, inputCls, toast, useDraft, DraftBanner, formatSize, C,
} from '../../components/admin/adminKit';

const lessonIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

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

/* ─── Modal Cours/Fiche (upload de fichier préservé) ────────────────────── */
function LessonModal({ lesson, onClose, onSave, existingSemesters = [], existingCategories = [], existingChapters = [] }) {
  const isNew = !lesson;
  const initial = lesson ? { ...lesson, tags: (lesson.tags || []).join(', ') } : { ...EMPTY };
  const [form, setForm] = useState(initial);
  const [selectedFile, setSelectedFile] = useState(null);
  const [removeFile, setRemoveFile]     = useState(false);
  const [loading, setLoading]           = useState(false);
  const fileRef = useRef(null);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial) || !!selectedFile || removeFile;
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:lesson', form, { enabled: isNew, initial: EMPTY });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setSelectedFile(f); setRemoveFile(false); }
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!form.title.trim())    return toast.error('Le titre est requis');
    if (!form.category.trim()) return toast.error('La catégorie (UE) est requise');
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
      fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
      if (selectedFile) fd.append('file', selectedFile);
      if (removeFile)   fd.append('removeFile', 'true');

      await onSave(fd, lesson?._id);
      clearDraft();
      onClose();
      toast.success(isNew ? 'Contenu créé' : 'Contenu mis à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setLoading(false); }
  };

  const hasExistingFile = lesson?.hasFile && !removeFile && !selectedFile;
  const fileLabel = selectedFile ? selectedFile.name : hasExistingFile ? lesson.fileName : null;

  return (
    <Modal
      title={lesson ? 'Modifier le contenu' : 'Nouveau contenu'}
      subtitle={lesson ? 'Mettre à jour les informations' : 'Créer un cours ou une fiche de révision'}
      icon={lessonIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={680}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={handleSave} loading={loading} disabled={!form.title.trim() || !form.category.trim()}>
          {loading ? 'Enregistrement…' : lesson ? 'Enregistrer' : 'Créer le contenu'}
        </PrimaryBtn>
      </>}
    >
      {pendingDraft && isNew && (
        <DraftBanner onRestore={() => setForm(consumeDraft())} onDismiss={dismissDraft} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Type">
          <div style={{ display: 'flex', gap: 8 }}>
            {['cours', 'fiche'].map(t => (
              <button key={t} type="button" onClick={() => set('type', t)}
                style={{
                  padding: '10px 18px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', minHeight: 42,
                  border: `1.5px solid ${form.type === t ? 'transparent' : C.border}`,
                  background: form.type === t ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : '#fff',
                  color: form.type === t ? '#fff' : C.sub,
                }}>
                {t === 'cours' ? 'Cours' : 'Fiche'}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Titre" required>
          <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ex: Hémostase — Mécanismes de coagulation" className={inputCls} />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Semestre">
            <input list="les-sem-list" value={form.semester || ''} onChange={e => set('semester', e.target.value)} placeholder="Ex: Semestre 1" className={inputCls} />
            <datalist id="les-sem-list">{existingSemesters.map(s => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Catégorie (UE)" required>
            <input list="les-cat-list" value={form.category} onChange={e => set('category', e.target.value)} placeholder="Ex: UE 2.4" className={inputCls} />
            <datalist id="les-cat-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Chapitre">
            <input list="les-chap-list" value={form.chapter} onChange={e => set('chapter', e.target.value)} placeholder="Ex: Chapitre 3" className={inputCls} />
            <datalist id="les-chap-list">{existingChapters.map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Difficulté">
            <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)} className={inputCls}>
              <option value="easy">Facile</option><option value="medium">Moyen</option><option value="hard">Difficile</option>
            </select>
          </Field>
        </div>

        <Field label="Tags" hint="séparés par des virgules">
          <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Ex: coagulation, sang, hémostase" className={inputCls} />
        </Field>

        <Field label="Résumé">
          <input value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Courte description visible dans la liste…" className={inputCls} />
        </Field>

        {/* Fichier joint */}
        <Field label="Fichier joint" hint="PDF, image, Word, texte — max 15 Mo">
          <input ref={fileRef} type="file" accept={FILE_ACCEPT} style={{ display: 'none' }} onChange={handleFileChange} />
          {fileLabel ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'rgba(var(--theme-primary-rgb),0.06)', borderRadius: 14, border: `1.5px solid ${C.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileLabel}</p>
                {selectedFile && <p style={{ fontSize: 11, color: C.sub }}>{formatSize(selectedFile.size)}</p>}
                {hasExistingFile && <p style={{ fontSize: 11, color: C.sub }}>{formatSize(lesson.fileSize)}</p>}
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
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, border: `2px dashed ${C.border}`, background: 'transparent', cursor: 'pointer', textAlign: 'left', minHeight: 60 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Joindre un fichier</p>
                <p style={{ fontSize: 11, color: C.sub }}>PDF, image, Word, texte — max 15 Mo</p>
              </div>
            </button>
          )}
        </Field>

        <Field label="Contenu texte" hint="**Titre** pour sous-titres, - pour listes">
          <textarea
            value={form.content}
            onChange={e => set('content', e.target.value)}
            rows={10}
            placeholder={'**Introduction**\n- Point important 1\n- Point important 2\n\n**Section 2**\nTexte du cours…'}
            className={`${inputCls} resize-none`}
            style={{ fontFamily: 'ui-monospace, monospace' }}
          />
        </Field>

        <Toggle checked={form.isPublished} onChange={v => set('isPublished', v)} />
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminLessons() {
  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [search, setSearch]     = useState('');
  const [filterType, setFilterType] = useState('all');
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [selected, setSelected]     = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const load = () => {
    setLoading(true);
    setSelected(new Set());
    axios.get(`${API_URL}/lessons/admin`)
      .then(r => setLessons(r.data))
      .catch(() => toast.error('Impossible de charger les contenus'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const toggleOne = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(x => x._id)));
  };
  const bulkAction = async (action, value) => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      await axios.post(`${API_URL}/admin/bulk/lessons`, { ids: [...selected], action, value }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'delete' ? `${selected.size} contenu(s) supprimé(s)` : 'Statut mis à jour');
      setBulkDeleting(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setBulkLoading(false); }
  };

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
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/lessons/${id}`);
      setLessons(prev => prev.filter(l => l._id !== id));
      setDeleting(null);
      toast.success('Contenu supprimé');
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const filtered = lessons.filter(l => {
    const matchType = filterType === 'all' || l.type === filterType;
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.category.toLowerCase().includes(q) || (l.chapter || '').toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  const cours  = lessons.filter(l => l.type === 'cours').length;
  const fiches = lessons.filter(l => l.type === 'fiche').length;
  const hasFilters = search || filterType !== 'all';

  return (
    <AdminPage
      title="Cours & Fiches"
      subtitle="Gestion du contenu pédagogique"
      icon={lessonIcon()}
      stats={[
        { value: lessons.length, label: 'contenus' },
        { value: cours,          label: 'cours' },
        { value: fiches,         label: 'fiches' },
      ]}
      actions={<HeroBtn onClick={() => setModal('new')}>{plusIcon} Nouveau contenu</HeroBtn>}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un cours ou une fiche…" />
          <FilterPills value={filterType} onChange={setFilterType} options={[['all', 'Tout'], ['cours', 'Cours'], ['fiche', 'Fiches']]} />
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.sub, fontWeight: 600 }}>{filtered.length} / {lessons.length}</span>
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
          onEdit={l => setModal(l)}
          onDelete={l => setDeleting(l)}
          empty={{
            icon: lessonIcon(24),
            title: 'Aucun contenu',
            hint: hasFilters ? null : 'Crée ton premier cours ou fiche de révision',
            onReset: hasFilters ? () => { setSearch(''); setFilterType('all'); } : null,
          }}
          columns={[
            { label: 'Titre', maxWidth: 240, render: l => (
              <div>
                <span style={{ fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }} title={l.title}>{l.title}</span>
                {l.chapter && <span style={{ fontSize: 11, color: C.sub }}>{l.chapter}</span>}
              </div>
            ) },
            { label: 'Type', render: l => <Badge color={l.type === 'fiche' ? '#7c3aed' : '#2563eb'}>{l.type === 'fiche' ? 'Fiche' : 'Cours'}</Badge> },
            { label: 'Catégorie', maxWidth: 130, render: l => <Badge color="#64748b">{l.category}</Badge> },
            { label: 'Difficulté', render: l => <Badge color={DIFF_BADGE[l.difficulty]?.color || DIFF_BADGE.medium.color}>{DIFF_BADGE[l.difficulty]?.label || 'Moyen'}</Badge> },
            { label: 'Fichier', render: l => l.hasFile
              ? <span style={{ fontSize: 11, color: '#059669', fontWeight: 600 }}>{FILE_TYPE_LABELS[l.fileMimeType] || 'Fichier'} · {formatSize(l.fileSize)}</span>
              : <span style={{ fontSize: 11, color: '#94a3b8' }}>Texte seul</span> },
            { label: 'Statut', render: l => <PubBadge ok={l.isPublished} /> },
          ]}
          renderCard={l => (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', marginBottom: 8 }}>{l.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <Badge color={l.type === 'fiche' ? '#7c3aed' : '#2563eb'}>{l.type === 'fiche' ? 'Fiche' : 'Cours'}</Badge>
                <Badge color="#64748b">{l.category}</Badge>
                {l.hasFile && <Badge color="#059669">{FILE_TYPE_LABELS[l.fileMimeType] || 'Fichier'}</Badge>}
                <PubBadge ok={l.isPublished} />
              </div>
              {l.chapter && <div style={{ fontSize: 12, color: C.sub }}>{l.chapter}</div>}
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {(modal === 'new' || (modal && modal._id)) && (
          <LessonModal
            key="lesson-modal"
            lesson={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={[...new Set(lessons.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(lessons.map(x => x.category).filter(Boolean))].sort()}
            existingChapters={[...new Set(lessons.map(x => x.chapter).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmModal
            title="Supprimer ce contenu ?"
            message={<><strong>« {deleting.title} »</strong><br />Cette action est irréversible.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
        {bulkDeleting && (
          <ConfirmModal
            title={`Supprimer ${selected.size} contenu(s) ?`}
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
