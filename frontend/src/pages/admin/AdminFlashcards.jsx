import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge, PubBadge,
  Toolbar, SearchInput, FilterSelect, BulkBar, DataTable, Modal, ConfirmModal,
  Field, Toggle, inputCls, toast, useDraft, DraftBanner, C,
} from '../../components/admin/adminKit';

const flashIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const EMPTY = { front: '', back: '', semester: '', programVersion: 'ancien', category: '', chapter: '', part: '', hint: '', isPublished: true };

/* ─── Modal Flashcard ───────────────────────────────────────────────────── */
function FlashModal({ item, preset, onClose, onSave, existingSemesters = [], existingCategories = [], existingChapters = [], existingParts = [] }) {
  const isNew = !item;
  const initial = item ? { ...item } : { ...EMPTY, ...(preset || {}) };
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:flashcard', form, { enabled: isNew, initial: { ...EMPTY, ...(preset || {}) } });

  const handleSave = async () => {
    if (!form.front.trim() || !form.back.trim()) return toast.error('Recto et verso sont requis');
    if (!form.category.trim())                    return toast.error('La catégorie (UE) est requise');
    setLoading(true);
    try {
      await onSave(form);
      clearDraft();
      onClose();
      toast.success(isNew ? 'Flashcard créée' : 'Flashcard mise à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur — tes données sont conservées');
    } finally { setLoading(false); }
  };

  return (
    <Modal
      title={item ? 'Modifier la flashcard' : 'Nouvelle flashcard'}
      subtitle={item ? 'Mettre à jour les informations' : 'Créer une carte de révision'}
      icon={flashIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={540}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={handleSave} loading={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</PrimaryBtn>
      </>}
    >
      {pendingDraft && isNew && (
        <DraftBanner onRestore={() => setForm(consumeDraft())} onDismiss={dismissDraft} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Field label="Recto (Question)" required>
          <textarea value={form.front} onChange={e => setForm({ ...form, front: e.target.value })} rows={2} className={`${inputCls} resize-none`} placeholder="Question ou terme…" />
        </Field>
        <Field label="Verso (Réponse)" required>
          <textarea value={form.back} onChange={e => setForm({ ...form, back: e.target.value })} rows={3} className={`${inputCls} resize-none`} placeholder="Définition ou réponse…" />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Semestre">
            <input list="fc-sem-list" value={form.semester || ''} onChange={e => setForm({ ...form, semester: e.target.value })} className={inputCls} placeholder="Ex: Semestre 1" />
            <datalist id="fc-sem-list">{existingSemesters.map(s => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Programme">
            <select value={form.programVersion || 'ancien'} onChange={e => setForm({ ...form, programVersion: e.target.value })} className={inputCls}>
              <option value="ancien">Ancien programme</option>
              <option value="reforme_2026">Réforme 2026</option>
            </select>
          </Field>
          <Field label="Catégorie (UE)" required>
            <input list="fc-cat-list" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Ex: UE 2.4" />
            <datalist id="fc-cat-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Chapitre">
            <input list="fc-chap-list" value={form.chapter || ''} onChange={e => setForm({ ...form, chapter: e.target.value })} className={inputCls} placeholder="Ex: Troubles du rythme" />
            <datalist id="fc-chap-list">{existingChapters.map(c => <option key={c} value={c} />)}</datalist>
          </Field>
          <Field label="Partie">
            <input list="fc-part-list" value={form.part || ''} onChange={e => setForm({ ...form, part: e.target.value })} className={inputCls} placeholder="Ex: Partie 1" />
            <datalist id="fc-part-list">{existingParts.map(p => <option key={p} value={p} />)}</datalist>
          </Field>
        </div>
        <Field label="Indice (optionnel)">
          <input value={form.hint} onChange={e => setForm({ ...form, hint: e.target.value })} className={inputCls} placeholder="Indice pour aider…" />
        </Field>
        <Toggle checked={form.isPublished} onChange={v => setForm({ ...form, isPublished: v })} labels={['Publiée — visible par les étudiants', 'Masquée — non visible']} />
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminFlashcards() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [search, setSearch]         = useState('');
  const [filterSem, setFilterSem]   = useState('');
  const [filterUE, setFilterUE]     = useState('');
  const [filterChap, setFilterChap] = useState('');
  const [filterPart, setFilterPart] = useState('');
  const [selected, setSelected]     = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const load = () => {
    setLoading(true);
    setSelected(new Set());
    axios.get(`${API_URL}/flashcards/admin`)
      .then(r => setItems(r.data))
      .catch(() => toast.error('Impossible de charger les flashcards'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (data) => {
    if (data._id) await axios.put(`${API_URL}/flashcards/${data._id}`, data);
    else await axios.post(`${API_URL}/flashcards`, data);
    load();
  };
  const handleDelete = async (id) => {
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/flashcards/${id}`);
      setDeleting(null);
      toast.success('Flashcard supprimée');
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
      await axios.post(`${API_URL}/admin/bulk/flashcards`, { ids: [...selected], action, value }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'delete' ? `${selected.size} flashcard(s) supprimée(s)` : 'Statut mis à jour');
      setBulkDeleting(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setBulkLoading(false); }
  };

  const semesters = [...new Set(items.map(i => i.semester).filter(Boolean))].sort();
  const ues = [...new Set(items.filter(i => !filterSem || i.semester === filterSem).map(i => i.category).filter(Boolean))].sort();
  const chapters = [...new Set(items.filter(i => (!filterSem || i.semester === filterSem) && (!filterUE || i.category === filterUE)).map(i => i.chapter).filter(Boolean))].sort();
  const parts = [...new Set(items.filter(i => (!filterSem || i.semester === filterSem) && (!filterUE || i.category === filterUE) && (!filterChap || i.chapter === filterChap)).map(i => i.part).filter(Boolean))].sort();

  const filtered = items.filter(i => {
    const s = search.toLowerCase();
    const matchSearch = i.front.toLowerCase().includes(s) || (i.category || '').toLowerCase().includes(s);
    return matchSearch
      && (!filterSem  || i.semester === filterSem)
      && (!filterUE   || i.category === filterUE)
      && (!filterChap || i.chapter  === filterChap)
      && (!filterPart || i.part     === filterPart);
  });

  const published  = items.filter(i => i.isPublished).length;
  const categories = [...new Set(items.map(i => i.category).filter(Boolean))].length;
  const hasFilters = search || filterSem || filterUE || filterChap || filterPart;
  const clearFilters = () => { setSearch(''); setFilterSem(''); setFilterUE(''); setFilterChap(''); setFilterPart(''); };

  return (
    <AdminPage
      title="Flashcards"
      subtitle="Gestion des cartes de révision"
      icon={flashIcon()}
      stats={[
        { value: items.length, label: 'flashcards' },
        { value: published,    label: 'publiées' },
        { value: categories,   label: 'catégories' },
      ]}
      actions={<HeroBtn onClick={() => setModal('new')}>{plusIcon} Nouvelle flashcard</HeroBtn>}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher une flashcard…" />
          <FilterSelect value={filterSem} onChange={v => { setFilterSem(v); setFilterUE(''); setFilterChap(''); setFilterPart(''); }} options={semesters} allLabel="Tous les semestres" />
          <FilterSelect value={filterUE} onChange={v => { setFilterUE(v); setFilterChap(''); setFilterPart(''); }} options={ues} allLabel="Toutes les UE" />
          <FilterSelect value={filterChap} onChange={v => { setFilterChap(v); setFilterPart(''); }} options={chapters} allLabel="Tous les chapitres" />
          <FilterSelect value={filterPart} onChange={setFilterPart} options={parts} allLabel="Toutes les parties" />
          {(filterSem || filterUE || filterChap || filterPart) && (
            <button onClick={() => setModal({ _preset: true, semester: filterSem, category: filterUE, chapter: filterChap, part: filterPart })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', minHeight: 44, background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow: '0 3px 8px rgba(var(--theme-primary-rgb),0.3)' }}>
              {plusIcon} Ajouter ici
            </button>
          )}
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
              publishLabels={['Publier', 'Masquer']}
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
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" /></svg>,
            title: 'Aucune flashcard trouvée',
            hint: hasFilters ? null : 'Ajoute ta première carte de révision',
            onReset: hasFilters ? clearFilters : null,
          }}
          columns={[
            { label: 'Recto', maxWidth: 280, render: i => <span style={{ fontWeight: 700 }} title={i.front}>{i.front}</span> },
            { label: 'Semestre', render: i => i.semester ? <Badge color="#7c3aed">{i.semester}</Badge> : <span style={{ color: '#cbd5e1' }}>—</span> },
            { label: 'UE', maxWidth: 170, render: i => <Badge color="#2563eb">{i.category}</Badge> },
            { label: 'Chapitre', maxWidth: 150, render: i => <span style={{ fontSize: 12, color: C.sub }}>{i.chapter || '—'}</span> },
            { label: 'Partie', maxWidth: 110, render: i => <span style={{ fontSize: 12, color: C.sub }}>{i.part || '—'}</span> },
            { label: 'Statut', render: i => <PubBadge ok={i.isPublished} labels={['Publiée', 'Masquée']} /> },
          ]}
          renderCard={i => (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', marginBottom: 8 }}>{i.front}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {i.semester && <Badge color="#7c3aed">{i.semester}</Badge>}
                <Badge color="#2563eb">{i.category}</Badge>
                <PubBadge ok={i.isPublished} labels={['Publiée', 'Masquée']} />
              </div>
              {i.chapter && <div style={{ fontSize: 12, color: C.sub }}>{i.chapter}{i.part ? ` — ${i.part}` : ''}</div>}
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {modal && (
          <FlashModal
            item={modal === 'new' || modal?._preset ? null : modal}
            preset={modal?._preset ? { semester: modal.semester, category: modal.category, chapter: modal.chapter, part: modal.part } : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={[...new Set(items.map(x => x.semester).filter(Boolean))].sort()}
            existingCategories={[...new Set(items.map(x => x.category).filter(Boolean))].sort()}
            existingChapters={[...new Set(items.map(x => x.chapter).filter(Boolean))].sort()}
            existingParts={[...new Set(items.map(x => x.part).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmModal
            title="Supprimer cette flashcard ?"
            message={<><strong>« {deleting.front?.slice(0, 60)}{deleting.front?.length > 60 ? '…' : ''} »</strong><br />Cette action est irréversible.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
        {bulkDeleting && (
          <ConfirmModal
            title={`Supprimer ${selected.size} flashcard(s) ?`}
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
