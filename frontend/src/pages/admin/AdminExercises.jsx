import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge, PubBadge,
  Toolbar, SearchInput, FilterPills, BulkBar, DataTable, Modal, ConfirmModal,
  Field, Toggle, inputCls, toast, useDraft, DraftBanner, C,
} from '../../components/admin/adminKit';

const exoIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z" />
    <path d="m21.5 21.5-1.4-1.4" />
    <path d="M3.9 3.9 2.5 2.5" />
    <path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const EMPTY = { title: '', content: '', answer: '', semester: '', programVersion: 'ancien', caseType: '', category: '', type: 'open', isPublished: true, options: [] };
const QCM_OPT = [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }];

const TYPE_BADGE = {
  qcm:        { label: 'QCM',              color: '#2563eb' },
  open:       { label: 'Question ouverte', color: '#7c3aed' },
  case_study: { label: 'Cas clinique',     color: '#ea580c' },
};

/* ─── Modal Exercice ────────────────────────────────────────────────────── */
function ExModal({ item, onClose, onSave, existingSemesters = [], existingCategories = [] }) {
  const isNew = !item;
  const initial = item ? { ...item, options: item.options || [] } : { ...EMPTY };
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:exercise', form, { enabled: isNew, initial: EMPTY });

  const isQcm = form.type === 'qcm';

  const setOpt = (i, field, value) => {
    const opts = [...form.options];
    if (field === 'isCorrect' && value) opts.forEach((o, idx) => { opts[idx] = { ...o, isCorrect: idx === i }; });
    else opts[i] = { ...opts[i], [field]: value };
    setForm({ ...form, options: opts });
  };
  const handleTypeChange = (type) => {
    setForm({ ...form, type, options: type === 'qcm' ? (form.options.length ? form.options : JSON.parse(JSON.stringify(QCM_OPT))) : form.options });
  };

  const handleSave = async () => {
    if (!form.title.trim())    return toast.error('Le titre est requis');
    if (!form.content.trim())  return toast.error("L'énoncé est requis");
    if (!form.category.trim()) return toast.error('La catégorie (UE) est requise');
    setLoading(true);
    try {
      await onSave(form);
      clearDraft();
      onClose();
      toast.success(isNew ? 'Exercice créé' : 'Exercice mis à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setLoading(false); }
  };

  const typeOptions = [
    { value: 'open',       label: 'Question ouverte' },
    { value: 'qcm',        label: 'QCM' },
    { value: 'case_study', label: 'Cas clinique' },
  ];

  return (
    <Modal
      title={item ? "Modifier l'exercice" : 'Nouvel exercice'}
      subtitle={TYPE_BADGE[form.type]?.label}
      icon={exoIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={620}
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
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Titre de l'exercice" />
        </Field>

        <Field label="Type">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {typeOptions.map(t => (
              <button key={t.value} type="button" onClick={() => handleTypeChange(t.value)}
                style={{
                  padding: '10px 15px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', minHeight: 42,
                  border: `1.5px solid ${form.type === t.value ? 'transparent' : C.border}`,
                  background: form.type === t.value ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : '#fff',
                  color: form.type === t.value ? '#fff' : C.sub,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Semestre">
            <input list="ex-sem-list" value={form.semester || ''} onChange={e => setForm({ ...form, semester: e.target.value })} className={inputCls} placeholder="Ex: Semestre 2" />
            <datalist id="ex-sem-list">{existingSemesters.map(s => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Programme">
            <select value={form.programVersion || 'ancien'} onChange={e => setForm({ ...form, programVersion: e.target.value })} className={inputCls}>
              <option value="ancien">Ancien programme</option>
              <option value="reforme_2026">Réforme 2026</option>
            </select>
          </Field>
          <Field label="Type de cas">
            <input value={form.caseType || ''} onChange={e => setForm({ ...form, caseType: e.target.value })} className={inputCls} placeholder="Ex: Cas pratiques" />
          </Field>
          <Field label="Catégorie (UE)" required>
            <input list="ex-cat-list" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Ex: UE 4.4" />
            <datalist id="ex-cat-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
          </Field>
        </div>

        <Field label="Énoncé" required>
          <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={4} className={`${inputCls} resize-none`} placeholder="Énoncé de l'exercice…" />
        </Field>

        {isQcm && (
          <Field label="Options QCM (sélectionner la bonne réponse)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(form.options.length ? form.options : QCM_OPT).map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button type="button" onClick={() => setOpt(i, 'isCorrect', true)} aria-label={`Option ${String.fromCharCode(65 + i)} correcte`}
                    style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${opt.isCorrect ? '#10b981' : '#cbd5e1'}`, background: opt.isCorrect ? '#10b981' : '#fff' }}>
                    {opt.isCorrect && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                  <input value={opt.text} onChange={e => setOpt(i, 'text', e.target.value)}
                    className="text-base md:text-sm"
                    style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${opt.isCorrect ? '#a7f3d0' : C.border}`, background: opt.isCorrect ? '#ecfdf5' : '#fff', outline: 'none', minHeight: 44 }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                </div>
              ))}
            </div>
          </Field>
        )}

        <Field label="Correction / Réponse">
          <textarea value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Correction détaillée…" />
        </Field>

        <Toggle checked={form.isPublished} onChange={v => setForm({ ...form, isPublished: v })} />
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminExercises() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selected, setSelected]     = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const load = () => {
    setLoading(true);
    setSelected(new Set());
    axios.get(`${API_URL}/exercises/admin`)
      .then(r => setItems(r.data))
      .catch(() => toast.error('Impossible de charger les exercices'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (data) => {
    if (data._id) await axios.put(`${API_URL}/exercises/${data._id}`, data);
    else await axios.post(`${API_URL}/exercises`, data);
    load();
  };
  const handleDelete = async (id) => {
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/exercises/${id}`);
      setDeleting(null);
      toast.success('Exercice supprimé');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const toggleOne = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(x => x._id)));
  };
  const bulkAction = async (action, value) => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      await axios.post(`${API_URL}/admin/bulk/exercises`, { ids: [...selected], action, value }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'delete' ? `${selected.size} exercice(s) supprimé(s)` : 'Statut mis à jour');
      setBulkDeleting(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setBulkLoading(false); }
  };

  const filtered = items.filter(i => {
    const s = search.toLowerCase();
    const matchSearch = i.title.toLowerCase().includes(s) || i.category.toLowerCase().includes(s);
    const matchType = filterType === 'all' || i.type === filterType;
    return matchSearch && matchType;
  });

  const qcmCount  = items.filter(i => i.type === 'qcm').length;
  const openCount = items.filter(i => i.type === 'open').length;
  const caseCount = items.filter(i => i.type === 'case_study').length;
  const hasFilters = search || filterType !== 'all';

  return (
    <AdminPage
      title="Exercices"
      subtitle="Gestion des exercices cliniques"
      icon={exoIcon()}
      stats={[
        { value: items.length, label: 'exercices' },
        { value: qcmCount,     label: 'QCM' },
        { value: openCount,    label: 'ouverts' },
        { value: caseCount,    label: 'cas cliniques' },
      ]}
      actions={<HeroBtn onClick={() => setModal('new')}>{plusIcon} Nouvel exercice</HeroBtn>}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un exercice…" />
          <FilterPills value={filterType} onChange={setFilterType}
            options={[['all', 'Tout'], ['qcm', 'QCM'], ['open', 'Ouverte'], ['case_study', 'Cas clinique']]} />
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
          onEdit={i => setModal(i)}
          onDelete={i => setDeleting(i)}
          empty={{
            icon: exoIcon(24),
            title: 'Aucun exercice trouvé',
            hint: hasFilters ? null : 'Crée ton premier exercice',
            onReset: hasFilters ? () => { setSearch(''); setFilterType('all'); } : null,
          }}
          columns={[
            { label: 'Titre', maxWidth: 240, render: i => <span style={{ fontWeight: 700 }} title={i.title}>{i.title}</span> },
            { label: 'Type', render: i => <Badge color={TYPE_BADGE[i.type]?.color}>{TYPE_BADGE[i.type]?.label}</Badge> },
            { label: 'Catégorie', maxWidth: 150, render: i => <Badge color="#64748b">{i.category}</Badge> },
            { label: 'Statut', render: i => <PubBadge ok={i.isPublished} labels={['Publié', 'Masqué']} /> },
          ]}
          renderCard={i => (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', marginBottom: 8 }}>{i.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Badge color={TYPE_BADGE[i.type]?.color}>{TYPE_BADGE[i.type]?.label}</Badge>
                <Badge color="#64748b">{i.category}</Badge>
                <PubBadge ok={i.isPublished} labels={['Publié', 'Masqué']} />
              </div>
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {modal && (
          <ExModal
            item={modal === 'new' ? null : modal}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={[...new Set(items.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(items.map(x => x.category).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmModal
            title="Supprimer cet exercice ?"
            message={<><strong>« {deleting.title} »</strong><br />Cette action est irréversible.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
        {bulkDeleting && (
          <ConfirmModal
            title={`Supprimer ${selected.size} exercice(s) ?`}
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
