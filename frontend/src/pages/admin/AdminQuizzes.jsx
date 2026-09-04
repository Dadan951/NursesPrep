import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, PrimaryBtn, GhostBtn, Card, Badge, PubBadge,
  Toolbar, SearchInput, FilterSelect, BulkBar, DataTable, Modal, ConfirmModal,
  Field, Toggle, inputCls, toast, useDraft, DraftBanner, C,
} from '../../components/admin/adminKit';

/* ─── Icônes ────────────────────────────────────────────────────────────── */
const quizIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);
const plusIcon = <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;

const EMPTY_QUIZ = {
  title: '', description: '', semester: '', programVersion: 'ancien', category: '', chapter: '', duration: 10, isPublished: true,
  questions: [{ text: '', explanation: '', multipleAnswers: false, options: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }],
};

/* ─── Modal Quiz ────────────────────────────────────────────────────────── */
function QuizModal({ quiz, preset, onClose, onSave, existingSemesters = [], existingCategories = [], existingChapters = [] }) {
  const isNew = !quiz;
  const initial = quiz ? JSON.parse(JSON.stringify(quiz)) : { ...EMPTY_QUIZ, ...(preset || {}) };
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const { pendingDraft, consumeDraft, dismissDraft, clearDraft } = useDraft('draft:quiz', form, { enabled: isNew, initial: { ...EMPTY_QUIZ, ...(preset || {}) } });

  const setQ = (qi, field, value) => { const qs = [...form.questions]; qs[qi] = { ...qs[qi], [field]: value }; setForm({ ...form, questions: qs }); };
  const setOpt = (qi, oi, field, value) => {
    const qs = [...form.questions]; const opts = [...qs[qi].options];
    if (field === 'isCorrect' && value && !qs[qi].multipleAnswers) opts.forEach((_, i) => { opts[i] = { ...opts[i], isCorrect: i === oi }; });
    else opts[oi] = { ...opts[oi], [field]: value };
    qs[qi] = { ...qs[qi], options: opts }; setForm({ ...form, questions: qs });
  };
  const setMultiple = (qi, value) => {
    const qs = [...form.questions]; let opts = [...qs[qi].options];
    if (!value) {
      // Bascule QCM → QCU : ne garder que la première option correcte pour éviter un état invalide
      const firstCorrect = opts.findIndex(o => o.isCorrect);
      opts = opts.map((o, i) => ({ ...o, isCorrect: i === (firstCorrect === -1 ? 0 : firstCorrect) }));
    }
    qs[qi] = { ...qs[qi], multipleAnswers: value, options: opts }; setForm({ ...form, questions: qs });
  };
  const addQ = () => { setForm({ ...form, questions: [...form.questions, JSON.parse(JSON.stringify(EMPTY_QUIZ.questions[0]))] }); setTab(form.questions.length); };
  const removeQ = (qi) => { const qs = form.questions.filter((_, i) => i !== qi); setForm({ ...form, questions: qs }); setTab(Math.max(0, tab - 1)); };

  const handleSave = async () => {
    if (!form.title.trim())    return toast.error('Le titre est requis');
    if (!form.category.trim()) return toast.error('La catégorie (UE) est requise');
    setLoading(true);
    try {
      await onSave(form);
      clearDraft();
      onClose();
      toast.success(isNew ? 'Quiz créé' : 'Quiz mis à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de l\'enregistrement — tes données sont conservées');
    } finally { setLoading(false); }
  };

  return (
    <Modal
      title={quiz ? 'Modifier le quiz' : 'Nouveau quiz'}
      subtitle={`${form.questions.length} question${form.questions.length > 1 ? 's' : ''}`}
      icon={quizIcon(18)}
      onClose={onClose}
      dirty={dirty}
      maxWidth={680}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={handleSave} loading={loading}>{loading ? 'Enregistrement…' : 'Enregistrer'}</PrimaryBtn>
      </>}
    >
      {pendingDraft && isNew && (
        <DraftBanner onRestore={() => setForm(consumeDraft())} onDismiss={dismissDraft} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Field label="Titre" required>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="Titre du quiz" />
          </Field>
        </div>
        <Field label="Semestre">
          <input list="sem-list" value={form.semester || ''} onChange={e => setForm({ ...form, semester: e.target.value })} className={inputCls} placeholder="Ex: Semestre 1" />
          <datalist id="sem-list">{existingSemesters.map(s => <option key={s} value={s} />)}</datalist>
        </Field>
        <Field label="Programme">
          <select value={form.programVersion || 'ancien'} onChange={e => setForm({ ...form, programVersion: e.target.value })} className={inputCls}>
            <option value="ancien">Ancien programme</option>
            <option value="reforme_2026">Réforme 2026</option>
          </select>
        </Field>
        <Field label="Catégorie (UE)" required>
          <input list="cat-list" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="Ex: UE 2.2" />
          <datalist id="cat-list">{existingCategories.map(c => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Chapitre">
          <input list="chap-list" value={form.chapter} onChange={e => setForm({ ...form, chapter: e.target.value })} className={inputCls} placeholder="Ex: Système cardio-vasculaire" />
          <datalist id="chap-list">{existingChapters.map(c => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Durée (min)">
          <input type="number" inputMode="numeric" value={form.duration} onChange={e => setForm({ ...form, duration: +e.target.value })} className={inputCls} min={1} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className={`${inputCls} resize-none`} placeholder="Description courte…" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Toggle checked={form.isPublished} onChange={v => setForm({ ...form, isPublished: v })} />
        </div>
      </div>

      {/* Questions */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <h4 style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Questions ({form.questions.length})</h4>
          <button onClick={addQ} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--theme-primary)', background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px' }}>
            {plusIcon} Ajouter
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {form.questions.map((_, i) => (
            <button key={i} onClick={() => setTab(i)}
              style={{
                padding: '8px 13px', borderRadius: 11, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer', minHeight: 38,
                background: tab === i ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : C.bg,
                color: tab === i ? '#fff' : C.sub,
              }}>
              Q{i + 1}
            </button>
          ))}
        </div>
        {form.questions[tab] && (
          <div style={{ background: C.bg, borderRadius: 18, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Question" required>
              <textarea value={form.questions[tab].text} onChange={e => setQ(tab, 'text', e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Texte de la question…" style={{ background: '#fff' }} />
            </Field>
            <Field label="Type de question">
              <Toggle checked={!!form.questions[tab].multipleAnswers} onChange={v => setMultiple(tab, v)}
                labels={['QCM — plusieurs bonnes réponses possibles', 'QCU — une seule bonne réponse']} />
            </Field>
            <Field label={form.questions[tab].multipleAnswers ? 'Options (sélectionner toutes les bonnes réponses)' : 'Options (sélectionner la bonne réponse)'}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {form.questions[tab].options.map((opt, oi) => (
                  <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button type="button" onClick={() => setOpt(tab, oi, 'isCorrect', form.questions[tab].multipleAnswers ? !opt.isCorrect : true)} aria-label={`Option ${String.fromCharCode(65 + oi)} correcte`}
                      style={{ width: 24, height: 24, borderRadius: form.questions[tab].multipleAnswers ? 6 : '50%', flexShrink: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${opt.isCorrect ? '#10b981' : '#cbd5e1'}`, background: opt.isCorrect ? '#10b981' : '#fff' }}>
                      {opt.isCorrect && <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </button>
                    <input value={opt.text} onChange={e => setOpt(tab, oi, 'text', e.target.value)}
                      className="text-base md:text-sm"
                      style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${opt.isCorrect ? '#a7f3d0' : C.border}`, background: opt.isCorrect ? '#ecfdf5' : '#fff', outline: 'none', minHeight: 44 }}
                      placeholder={`Option ${String.fromCharCode(65 + oi)}`} />
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Explication (optionnelle)">
              <textarea value={form.questions[tab].explanation} onChange={e => setQ(tab, 'explanation', e.target.value)} rows={2} className={`${inputCls} resize-none`} placeholder="Explication de la bonne réponse…" style={{ background: '#fff' }} />
            </Field>
            {form.questions.length > 1 && (
              <button onClick={() => removeQ(tab)} style={{ fontSize: 12, fontWeight: 600, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', padding: '6px 0' }}>
                Supprimer cette question
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminQuizzes() {
  const [quizzes, setQuizzes]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [search, setSearch]     = useState('');
  const [filterSem, setFilterSem]   = useState('');
  const [filterUE, setFilterUE]     = useState('');
  const [filterChap, setFilterChap] = useState('');
  const [selected, setSelected]     = useState(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  const load = () => {
    setLoading(true);
    setSelected(new Set());
    axios.get(`${API_URL}/quizzes/admin`)
      .then(r => setQuizzes(r.data))
      .catch(() => toast.error('Impossible de charger les quiz'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleSave = async (data) => {
    if (data._id) await axios.put(`${API_URL}/quizzes/${data._id}`, data);
    else await axios.post(`${API_URL}/quizzes`, data);
    load();
  };
  const handleDelete = async (id) => {
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/quizzes/${id}`);
      setDeleting(null);
      toast.success('Quiz supprimé');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const toggleOne = id => setSelected(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(q => q._id)));
  };
  const bulkAction = async (action, value) => {
    if (!selected.size) return;
    setBulkLoading(true);
    try {
      await axios.post(`${API_URL}/admin/bulk/quizzes`, { ids: [...selected], action, value }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success(action === 'delete' ? `${selected.size} quiz supprimé(s)` : 'Statut mis à jour');
      setBulkDeleting(false);
      load();
    } catch (e) { toast.error(e.response?.data?.message || e.message); }
    finally { setBulkLoading(false); }
  };

  const semesters = [...new Set(quizzes.map(q => q.semester).filter(Boolean))].sort();
  const ues = [...new Set(quizzes.filter(q => !filterSem || q.semester === filterSem).map(q => q.category).filter(Boolean))].sort();
  const chapters = [...new Set(quizzes.filter(q => (!filterSem || q.semester === filterSem) && (!filterUE || q.category === filterUE)).map(q => q.chapter).filter(Boolean))].sort();

  const filtered = quizzes.filter(q => {
    const s = search.toLowerCase();
    const matchSearch = q.title.toLowerCase().includes(s) || (q.category || '').toLowerCase().includes(s) || (q.chapter || '').toLowerCase().includes(s);
    return matchSearch
      && (!filterSem  || q.semester   === filterSem)
      && (!filterUE   || q.category   === filterUE)
      && (!filterChap || q.chapter    === filterChap);
  });

  const published = quizzes.filter(q => q.isPublished).length;
  const totalQ = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);
  const hasFilters = search || filterSem || filterUE || filterChap;
  const clearFilters = () => { setSearch(''); setFilterSem(''); setFilterUE(''); setFilterChap(''); };

  return (
    <AdminPage
      title="Quiz"
      subtitle="Gestion des questionnaires"
      icon={quizIcon()}
      stats={[
        { value: quizzes.length, label: 'quiz' },
        { value: published,      label: 'publiés' },
        { value: totalQ,         label: 'questions' },
      ]}
      actions={<HeroBtn onClick={() => setModal('new')}>{plusIcon} Nouveau quiz</HeroBtn>}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un quiz…" />
          <FilterSelect value={filterSem} onChange={v => { setFilterSem(v); setFilterUE(''); setFilterChap(''); }} options={semesters} allLabel="Tous les semestres" />
          <FilterSelect value={filterUE} onChange={v => { setFilterUE(v); setFilterChap(''); }} options={ues} allLabel="Toutes les UE" />
          <FilterSelect value={filterChap} onChange={setFilterChap} options={chapters} allLabel="Tous les chapitres" />
          {(filterSem || filterUE || filterChap) && (
            <button onClick={() => setModal({ _preset: true, semester: filterSem, category: filterUE, chapter: filterChap })}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', minHeight: 44, background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow: '0 3px 8px rgba(var(--theme-primary-rgb),0.3)' }}>
              {plusIcon} Ajouter ici
            </button>
          )}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: C.sub, fontWeight: 600 }}>{filtered.length} / {quizzes.length}</span>
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
          onEdit={q => setModal(q)}
          onDelete={q => setDeleting(q)}
          empty={{
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
            title: 'Aucun quiz trouvé',
            hint: hasFilters ? null : 'Crée ton premier quiz',
            onReset: hasFilters ? clearFilters : null,
          }}
          columns={[
            { label: 'Titre', maxWidth: 220, render: q => <span style={{ fontWeight: 700 }} title={q.title}>{q.title}</span> },
            { label: 'Semestre', render: q => q.semester ? <Badge color="#7c3aed">{q.semester}</Badge> : <span style={{ color: '#cbd5e1' }}>—</span> },
            { label: 'UE', maxWidth: 180, render: q => <Badge color="#2563eb">{q.category}</Badge> },
            { label: 'Chapitre', maxWidth: 160, render: q => <span style={{ fontSize: 12, color: C.sub }} title={q.chapter}>{q.chapter || '—'}</span> },
            { label: 'Questions', render: q => <span style={{ fontWeight: 700 }}>{q.questions?.length || 0}</span> },
            { label: 'Durée', render: q => <span style={{ fontSize: 12, color: C.sub }}>{q.duration} min</span> },
            { label: 'Statut', render: q => <PubBadge ok={q.isPublished} /> },
          ]}
          renderCard={q => (
            <>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', marginBottom: 8 }}>{q.title}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                {q.semester && <Badge color="#7c3aed">{q.semester}</Badge>}
                <Badge color="#2563eb">{q.category}</Badge>
                <PubBadge ok={q.isPublished} />
              </div>
              <div style={{ fontSize: 12, color: C.sub }}>
                {q.questions?.length || 0} question{(q.questions?.length || 0) > 1 ? 's' : ''} · {q.duration} min{q.chapter ? ` · ${q.chapter}` : ''}
              </div>
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {modal && (
          <QuizModal
            quiz={modal === 'new' || modal?._preset ? null : modal}
            preset={modal?._preset ? { semester: modal.semester, category: modal.category, chapter: modal.chapter } : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
            existingSemesters={semesters}
            existingCategories={[...new Set(quizzes.map(q => q.category).filter(Boolean))].sort()}
            existingChapters={[...new Set(quizzes.map(q => q.chapter).filter(Boolean))].sort()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleting && (
          <ConfirmModal
            title="Supprimer ce quiz ?"
            message={<><strong>« {deleting.title} »</strong> sera définitivement supprimé.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
        {bulkDeleting && (
          <ConfirmModal
            title={`Supprimer ${selected.size} quiz ?`}
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
