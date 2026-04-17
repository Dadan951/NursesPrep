import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Category colour palette ──────────────────────────────────────────────── */
const PALETTE = [
  { from: '#6366f1', to: '#8b5cf6', emoji: '🧠' },
  { from: '#0891b2', to: '#0284c7', emoji: '💊' },
  { from: '#059669', to: '#047857', emoji: '🩺' },
  { from: '#dc2626', to: '#db2777', emoji: '❤️' },
  { from: '#ea580c', to: '#d97706', emoji: '🔥' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '🏥' },
  { from: '#0f766e', to: '#0891b2', emoji: '🔬' },
  { from: '#be185d', to: '#9333ea', emoji: '📋' },
];

const diffColors = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
const diffLabel  = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

function ChevronRight({ className = '' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={className}>
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
}

function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3" />}
          {item.onClick ? (
            <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
          ) : (
            <span className="text-slate-700 font-semibold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Quiz Generator ────────────────────────────────────────────────────────── */
function QuizGenerator({ onGenerated }) {
  const [courseText, setCourseText] = useState('');
  const [title, setTitle]           = useState('');
  const [category, setCategory]     = useState('');
  const [chapter, setChapter]       = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus]         = useState(null);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/gen-status`).then(r => setStatus(r.data)).catch(() => {});
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setGenerating(true);
    try {
      const { data } = await axios.post(`${API_URL}/quizzes/generate`, { courseText, title, category, chapter, questionCount });
      setStatus(s => s ? { ...s, used: s.used + 1, remaining: s.remaining - 1 } : null);
      setSuccess(`Quiz "${data.quiz.title}" généré avec succès !`);
      setCourseText(''); setTitle('');
      onGenerated(data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la génération.');
    } finally { setGenerating(false); }
  };

  const charCount = courseText.length;
  const isReady   = charCount >= 50 && status?.remaining > 0;
  const inputCls  = 'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition placeholder:text-slate-400';

  return (
    <div className="max-w-2xl">
      {status && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700">Générations aujourd'hui</span>
            <span className={`text-xs font-bold ${status.remaining === 0 ? 'text-red-500' : 'text-blue-600'}`}>{status.used} / {status.limit}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-2 rounded-full transition-all ${status.remaining === 0 ? 'bg-red-400' : 'bg-blue-500'}`}
              style={{ width: `${(status.used / status.limit) * 100}%` }}/>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {status.remaining > 0
              ? `${status.remaining} génération${status.remaining > 1 ? 's' : ''} restante${status.remaining > 1 ? 's' : ''} aujourd'hui`
              : 'Limite journalière atteinte — réessayez demain'}
          </p>
        </div>
      )}

      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Titre du quiz</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Cours sur l'hémostase" className={inputCls}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">UE / Catégorie</label>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: UE 2.2" className={inputCls}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Chapitre</label>
            <input type="text" value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Ex: Hémostase primaire" className={inputCls}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Nombre de questions</label>
            <select value={questionCount} onChange={e => setQuestionCount(+e.target.value)} className={inputCls}>
              {[3, 5, 7, 10].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Texte du cours *</label>
            <span className={`text-xs font-medium ${charCount < 50 ? 'text-red-400' : 'text-emerald-600'}`}>{charCount} caractères</span>
          </div>
          <textarea value={courseText} onChange={e => setCourseText(e.target.value)}
            placeholder="Collez ici votre cours, vos notes de TD, un extrait de polycopié... (minimum 50 caractères)"
            rows={8} maxLength={4500}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition resize-none placeholder:text-slate-400"/>
          <p className="text-xs text-slate-400 mt-1.5">Le texte est analysé par l'IA pour générer des questions pertinentes.</p>
        </div>

        {error   && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-600">{error}</div>}
        {success && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs text-emerald-700 font-medium">{success}</div>}

        <motion.button type="submit" disabled={!isReady || generating} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
          className="w-full py-3 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
          {generating
            ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Génération en cours...</>
            : <><span>✨</span> Générer le quiz</>
          }
        </motion.button>
      </form>
    </div>
  );
}

/* ─── Personal quiz list ─────────────────────────────────────────────────────── */
function PersonalQuizList({ quizzes, onDelete, onPlay }) {
  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try { await axios.delete(`${API_URL}/quizzes/personal/${id}`); onDelete(id); } catch {}
    setDeletingId(null);
  };

  if (quizzes.length === 0) return (
    <div className="text-center py-10 text-slate-400">
      <div className="text-4xl mb-3">📝</div>
      <p className="font-semibold text-slate-600 mb-1">Aucun quiz généré</p>
      <p className="text-sm">Utilisez le générateur ci-dessus pour créer votre premier quiz.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence>
        {quizzes.map((quiz, i) => (
          <motion.div key={quiz._id}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-800 leading-snug">{quiz.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{quiz.chapter || quiz.category} · {quiz.questions?.length} questions</p>
                </div>
                <button onClick={() => confirmDelete(quiz._id)} disabled={deletingId === quiz._id}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {new Date(quiz.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
              <motion.button onClick={() => onPlay(quiz._id)}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="w-full py-2.5 text-white rounded-xl text-xs font-bold transition"
                style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                Commencer ce quiz →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Pro prompt ────────────────────────────────────────────────────────────── */
function ProFeaturePrompt() {
  const navigate = useNavigate();
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-200"
        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">Fonctionnalité Pro</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">
        La génération de quiz depuis vos cours est réservée aux abonnements <strong className="text-blue-700">Pro</strong> et <strong className="text-blue-700">Premium</strong>.
        Créez jusqu'à 10 quiz personnalisés par jour.
      </p>
      <motion.button onClick={() => navigate('/dashboard/subscription')}
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
        className="px-8 py-3 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-200"
        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
        Voir les offres
      </motion.button>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────────────────────────── */
export default function Quiz() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [tab, setTab]             = useState('catalogue');
  const [quizzes, setQuizzes]     = useState([]);
  const [personalQuizzes, setPersonalQuizzes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [view, setView]               = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);

  const isPro = ['pro', 'premium'].includes(user?.subscription);

  useEffect(() => {
    axios.get(`${API_URL}/quizzes`).then(r => setQuizzes(r.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'personnalises' && isPro && personalQuizzes.length === 0) {
      setPersonalLoading(true);
      axios.get(`${API_URL}/quizzes/personal`).then(r => setPersonalQuizzes(r.data)).finally(() => setPersonalLoading(false));
    }
  }, [tab, isPro]);

  const structure = {};
  quizzes.forEach(q => {
    const sem  = q.semester  || 'Non classé';
    const ue   = q.category  || 'Autre';
    const chap = q.chapter   || 'Général';
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(q);
  });

  const semesters      = Object.keys(structure).sort();
  const ues            = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters       = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentQuizzes = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE      = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalQuizzes   = quizzes.length;

  const resetCatalogue = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-0">
          {/* Title + stats */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Quiz</h1>
              <p className="text-blue-200/70 text-sm">Testez vos connaissances par unité d'enseignement</p>
            </div>
            {tab === 'catalogue' && (
              <div className="flex gap-4 text-center pb-1">
                <div>
                  <p className="text-xl font-bold text-white">{totalQuizzes}</p>
                  <p className="text-xs text-blue-300/70">Quiz</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">{semesters.length}</p>
                  <p className="text-xs text-blue-300/70">Semestres</p>
                </div>
              </div>
            )}
          </div>

          {/* Tab bar */}
          <div className="flex gap-0">
            {[
              { id: 'catalogue', label: 'Catalogue' },
              { id: 'personnalises', label: isPro ? 'Mes quiz' : 'Mes quiz ⭐' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-white text-white'
                    : 'border-transparent text-blue-300/70 hover:text-blue-200'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">

          {/* ── CATALOGUE TAB ── */}
          {tab === 'catalogue' && (
            <AnimatePresence mode="wait">

              {/* SEMESTERS */}
              {view === 'semesters' && (
                <motion.div key="sems"
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}>
                  {semesters.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                      <div className="text-5xl mb-3">📚</div>
                      <p className="font-semibold">Aucun quiz disponible</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {semesters.map((sem, idx) => {
                        const pal     = PALETTE[idx % PALETTE.length];
                        const ueCount = Object.keys(structure[sem]).length;
                        const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                        return (
                          <motion.button key={sem}
                            onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                            whileHover={{ y: -6, scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                            style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                          >
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 blur-xl"/>
                            <div className="text-4xl mb-4">{pal.emoji}</div>
                            <h3 className="font-bold text-white text-base mb-1 leading-snug">{sem}</h3>
                            <p className="text-white/75 text-xs mb-4">{ueCount} UE · {total} quiz</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {Array.from({ length: Math.min(ueCount, 5) }).map((_, i) => (
                                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>
                                ))}
                              </div>
                              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <ChevronRight className="text-white"/>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* UEs */}
              {view === 'ues' && selectedSemester && (
                <motion.div key="ues"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Quiz', onClick: resetCatalogue },
                    { label: selectedSemester }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ues.map((ue, idx) => {
                      const pal   = PALETTE[idx % PALETTE.length];
                      const total = Object.values(structure[selectedSemester][ue]).flat().length;
                      const chCount = Object.keys(structure[selectedSemester][ue]).length;
                      return (
                        <motion.button key={ue}
                          onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                          whileHover={{ y: -4, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                        >
                          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                          <div className="text-3xl mb-3">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-sm mb-1 leading-snug">{ue}</h3>
                          <p className="text-white/75 text-xs mb-3">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} quiz</p>
                          <div className="flex justify-end">
                            <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                              <ChevronRight className="text-white"/>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CHAPTERS */}
              {view === 'chapters' && selectedSemester && selectedUE && (
                <motion.div key="chaps"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Quiz', onClick: resetCatalogue },
                    { label: selectedSemester, onClick: () => { setSelectedUE(null); setView('ues'); } },
                    { label: selectedUE }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{totalInUE} quiz disponible{totalInUE > 1 ? 's' : ''}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapters.map((chap, idx) => {
                      const pal   = PALETTE[idx % PALETTE.length];
                      const count = structure[selectedSemester][selectedUE][chap].length;
                      return (
                        <motion.button key={chap}
                          onClick={() => { setSelectedChapter(chap); setView('quizzes'); }}
                          whileHover={{ y: -3 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm"
                        >
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                            {pal.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{count} quiz disponible{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                            <ChevronRight/>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* QUIZZES */}
              {view === 'quizzes' && selectedSemester && selectedUE && selectedChapter && (
                <motion.div key="quizs"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}>
                  <Breadcrumb items={[
                    { label: 'Quiz', onClick: resetCatalogue },
                    { label: selectedSemester, onClick: () => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
                    { label: selectedUE, onClick: () => { setSelectedChapter(null); setView('chapters'); } },
                    { label: selectedChapter }
                  ]}/>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{selectedChapter}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{currentQuizzes.length} quiz disponible{currentQuizzes.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {currentQuizzes.map((quiz, i) => (
                      <motion.div key={quiz._id}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all cursor-pointer group"
                        onClick={() => navigate(`/dashboard/quiz/${quiz._id}`)}
                      >
                        <div className="h-1.5" style={{ background: 'linear-gradient(90deg,#2563eb,#0891b2)' }}/>
                        <div className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">{quiz.category}</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffColors[quiz.difficulty]}`}>{diffLabel[quiz.difficulty]}</span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 mb-2 leading-snug">{quiz.title}</h3>
                          {quiz.description && <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{quiz.description}</p>}
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg>
                                {quiz.questions?.length || 0} questions
                              </span>
                              <span className="flex items-center gap-1.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                {quiz.duration} min
                              </span>
                            </div>
                            <span className="text-xs font-bold text-blue-600 group-hover:text-blue-800 transition flex items-center gap-1">
                              Commencer <ChevronRight/>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ── PERSONNALISÉS TAB ── */}
          {tab === 'personnalises' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {!isPro ? (
                <ProFeaturePrompt/>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-base font-bold text-slate-800 mb-1">Générer un quiz depuis votre cours</h2>
                    <p className="text-sm text-slate-400">Collez n'importe quel texte de cours et l'IA génère des QCM adaptés.</p>
                  </div>
                  <QuizGenerator onGenerated={quiz => setPersonalQuizzes(prev => [quiz, ...prev])}/>
                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Mes quiz générés</h3>
                    {personalLoading ? (
                      <div className="flex justify-center py-8">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
                      </div>
                    ) : (
                      <PersonalQuizList
                        quizzes={personalQuizzes}
                        onDelete={id => setPersonalQuizzes(prev => prev.filter(q => q._id !== id))}
                        onPlay={id => navigate(`/dashboard/quiz/${id}`)}
                      />
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
