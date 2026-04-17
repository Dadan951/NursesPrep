import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';

const TYPE_CONFIG = {
  qcm:        { label: 'QCM',              color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', emoji: '☑️' },
  open:       { label: 'Question ouverte', color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe', emoji: '✍️' },
  case_study: { label: 'Cas clinique',     color: '#ea580c', bg: '#fff7ed', border: '#fed7aa', emoji: '🏥' },
};
const diffColors = { easy: 'bg-emerald-100 text-emerald-700', medium: 'bg-amber-100 text-amber-700', hard: 'bg-red-100 text-red-700' };
const diffLabel  = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

/* ─── Exercise Card ──────────────────────────────────────────────────────────── */
function ExerciseCard({ ex, onComplete, index }) {
  const [expanded, setExpanded]   = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected, setSelected]   = useState(null);
  const [completed, setCompleted] = useState(false);
  const cfg = TYPE_CONFIG[ex.type] || TYPE_CONFIG.open;

  const handleComplete = async () => {
    if (completed) return;
    setCompleted(true);
    setShowAnswer(true);
    try {
      await axios.post(`${API_URL}/exercises/complete`);
      onComplete();
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm transition-all ${
        expanded ? 'shadow-xl border border-slate-200' : 'border border-slate-200 hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Left color indicator (top border on mobile) */}
      <div className="h-1" style={{ background: `linear-gradient(90deg,${cfg.color},${cfg.color}99)` }}/>

      <div className="p-5 cursor-pointer" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-start gap-4">
          {/* Type icon */}
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 border"
            style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}>
            {cfg.emoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: cfg.color }}>{cfg.label}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${diffColors[ex.difficulty]}`}>
                {diffLabel[ex.difficulty]}
              </span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{ex.category}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-800 leading-snug">{ex.title}</h3>
            {completed && (
              <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-emerald-600 font-bold">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Complété
              </span>
            )}
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-4">
              {/* Énoncé */}
              <div className="rounded-xl p-4" style={{ backgroundColor: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{ex.content}</p>
              </div>

              {/* QCM options */}
              {ex.type === 'qcm' && ex.options?.length > 0 && (
                <div className="space-y-2">
                  {ex.options.map((opt, i) => {
                    let cls = 'border border-slate-200 bg-white text-slate-700 hover:border-blue-300';
                    if (showAnswer) {
                      if (opt.isCorrect)    cls = 'border-2 border-emerald-400 bg-emerald-50 text-emerald-800';
                      else if (selected === i) cls = 'border-2 border-red-400 bg-red-50 text-red-700';
                      else cls = 'border border-slate-100 text-slate-400 opacity-60';
                    } else if (selected === i) {
                      cls = 'border-2 border-blue-400 bg-blue-50 text-blue-800';
                    }
                    return (
                      <button key={i} disabled={showAnswer} onClick={() => setSelected(i)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${cls} ${!showAnswer ? 'cursor-pointer' : 'cursor-default'}`}>
                        <span className="font-bold mr-2.5 opacity-60">{String.fromCharCode(65 + i)}.</span>
                        {opt.text}
                        {showAnswer && opt.isCorrect && <span className="float-right text-emerald-600">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Correction */}
              {showAnswer && ex.answer && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                >
                  <p className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Correction
                  </p>
                  <p className="text-xs text-emerald-700 leading-relaxed whitespace-pre-line">{ex.answer}</p>
                </motion.div>
              )}

              <div className="flex gap-3">
                {!showAnswer && (
                  <button onClick={() => setShowAnswer(true)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50 transition">
                    Voir la correction
                  </button>
                )}
                {!completed && (
                  <motion.button onClick={handleComplete} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                    style={{ backgroundColor: cfg.color }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Marquer complété
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Upgrade wall ───────────────────────────────────────────────────────────── */
function UpgradeWall() {
  const navigate = useNavigate();
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Exercices</h1>
          <p className="text-blue-200/70 text-sm">QCM, questions ouvertes et cas cliniques</p>
        </div>
        <div className="flex items-start justify-center p-8">
          <div className="max-w-md w-full text-center">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#eff6ff,#e0e7ff)' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-2">Exercices théoriques</h2>
            <p className="text-sm text-slate-500 mb-2 leading-relaxed">
              Les QCM, questions ouvertes et cas cliniques sont disponibles à partir de l'abonnement <strong className="text-blue-700">Pro</strong>.
            </p>
            <p className="text-xs text-slate-400 mb-7">
              Ces exercices sont conçus pour préparer les examens IFSI avec des mises en situation cliniques réelles.
            </p>

            <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6 space-y-3 border border-slate-200">
              {[
                { icon: '☑️', text: 'QCM sur toutes les UE' },
                { icon: '✍️', text: 'Questions ouvertes avec correction détaillée' },
                { icon: '🏥', text: 'Cas cliniques complets (mise en situation réelle)' },
                { icon: '📈', text: "Suivi de votre progression par type d'exercice" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm text-base">{item.icon}</div>
                  <span className="text-xs text-slate-700 font-medium">{item.text}</span>
                </div>
              ))}
            </div>

            <motion.button onClick={() => navigate('/dashboard/subscription')}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="w-full py-3 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-blue-100 mb-3"
              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
              Passer à Pro — Voir les offres
            </motion.button>
            <p className="text-xs text-slate-400">Sans engagement · Résiliable à tout moment</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ─── Navigation palette ────────────────────────────────────────────────────── */
const EX_PALETTE = [
  { from: '#2563eb', to: '#0891b2', emoji: '📝' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '🏥' },
  { from: '#ea580c', to: '#d97706', emoji: '🔬' },
  { from: '#059669', to: '#047857', emoji: '✍️' },
  { from: '#dc2626', to: '#db2777', emoji: '☑️' },
  { from: '#0f766e', to: '#0891b2', emoji: '📋' },
  { from: '#be185d', to: '#9333ea', emoji: '🧬' },
  { from: '#6366f1', to: '#8b5cf6', emoji: '💊' },
];

function ExBreadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Exercises() {
  const { user }    = useAuth();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [completedCount, setCompletedCount] = useState(0);

  const [view, setView]                 = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);

  const isFree = user?.subscription === 'free';

  useEffect(() => {
    if (isFree) { setLoading(false); return; }
    axios.get(`${API_URL}/exercises`).then(r => setExercises(r.data)).finally(() => setLoading(false));
  }, [isFree]);

  if (isFree) return <UpgradeWall/>;

  // Build structure: semester → caseType → UE → exercises
  const structure = {};
  exercises.forEach(ex => {
    const sem  = ex.semester  || 'Non classé';
    const ct   = ex.caseType  || 'Général';
    const ue   = ex.category  || 'Autre';
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ct]) structure[sem][ct] = {};
    if (!structure[sem][ct][ue]) structure[sem][ct][ue] = [];
    structure[sem][ct][ue].push(ex);
  });

  const semesters  = Object.keys(structure).sort();
  const caseTypes  = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const ues        = (selectedSemester && selectedCaseType) ? Object.keys(structure[selectedSemester]?.[selectedCaseType] || {}).sort() : [];
  const currentExs = (selectedSemester && selectedCaseType && selectedUE)
    ? (structure[selectedSemester]?.[selectedCaseType]?.[selectedUE] || []) : [];

  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedCaseType(null); setSelectedUE(null); };

  const qcmCount  = exercises.filter(e => e.type === 'qcm').length;
  const openCount = exercises.filter(e => e.type === 'open').length;
  const caseCount = exercises.filter(e => e.type === 'case_study').length;

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-6">
          <div className="flex items-end justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Exercices</h1>
              <p className="text-blue-200/70 text-sm">QCM, questions ouvertes et cas cliniques</p>
            </div>
            {completedCount > 0 && (
              <div className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-xl text-xs font-bold">
                ✓ {completedCount} complété{completedCount > 1 ? 's' : ''} cette session
              </div>
            )}
          </div>
          <div className="flex gap-4 mt-4">
            {[
              { label: 'Total',   val: exercises.length, color: '#93c5fd' },
              { label: 'QCM',     val: qcmCount,         color: '#60a5fa' },
              { label: 'Ouvertes',val: openCount,        color: '#c4b5fd' },
              { label: 'Cliniques',val: caseCount,       color: '#fb923c' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-lg font-bold" style={{ color: s.color }}>{s.val}</p>
                <p className="text-xs text-blue-300/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50 min-h-full">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* SEMESTERS */}
              {view === 'semesters' && (
                <motion.div key="sems-ex" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                  {semesters.length === 0 ? (
                    <div className="text-center py-20 text-slate-400"><div className="text-5xl mb-3">📋</div><p className="font-semibold">Aucun exercice disponible</p></div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {semesters.map((sem, idx) => {
                        const pal    = EX_PALETTE[idx % EX_PALETTE.length];
                        const ctCount = Object.keys(structure[sem]).length;
                        const total  = Object.values(structure[sem]).flatMap(ct => Object.values(ct)).flat().length;
                        return (
                          <motion.button key={sem}
                            onClick={() => { setSelectedSemester(sem); setView('casetypes'); }}
                            whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                            className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                            <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-black/10 blur-xl"/>
                            <div className="text-4xl mb-4">{pal.emoji}</div>
                            <h3 className="font-bold text-white text-base mb-1">{sem}</h3>
                            <p className="text-white/75 text-xs mb-4">{ctCount} type{ctCount > 1 ? 's' : ''} de cas · {total} exercice{total > 1 ? 's' : ''}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">{Array.from({ length: Math.min(ctCount, 5) }).map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/60"/>)}</div>
                              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* CASE TYPES */}
              {view === 'casetypes' && selectedSemester && (
                <motion.div key="cts-ex" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[{ label: 'Exercices', onClick: reset }, { label: selectedSemester }]}/>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{caseTypes.length} type{caseTypes.length > 1 ? 's' : ''} de cas</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {caseTypes.map((ct, idx) => {
                      const pal   = EX_PALETTE[idx % EX_PALETTE.length];
                      const ueCount = Object.keys(structure[selectedSemester][ct]).length;
                      const total = Object.values(structure[selectedSemester][ct]).flat().length;
                      return (
                        <motion.button key={ct}
                          onClick={() => { setSelectedCaseType(ct); setView('ues'); }}
                          whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                          <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                          <div className="text-3xl mb-3">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-sm mb-1">{ct}</h3>
                          <p className="text-white/75 text-xs mb-3">{ueCount} UE · {total} exercice{total > 1 ? 's' : ''}</p>
                          <div className="flex justify-end">
                            <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* UEs */}
              {view === 'ues' && selectedSemester && selectedCaseType && (
                <motion.div key="ues-ex" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[
                    { label: 'Exercices', onClick: reset },
                    { label: selectedSemester, onClick: () => { setSelectedCaseType(null); setView('casetypes'); } },
                    { label: selectedCaseType }
                  ]}/>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-800">{selectedCaseType}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ues.map((ue, idx) => {
                      const pal   = EX_PALETTE[idx % EX_PALETTE.length];
                      const count = structure[selectedSemester][selectedCaseType][ue].length;
                      return (
                        <motion.button key={ue}
                          onClick={() => { setSelectedUE(ue); setView('exercises'); }}
                          whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                          className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-all text-left group flex items-center gap-4 shadow-sm">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                            {pal.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm truncate">{ue}</h3>
                            <p className="text-xs text-slate-400 mt-0.5">{count} exercice{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* EXERCISES LIST */}
              {view === 'exercises' && selectedSemester && selectedCaseType && selectedUE && (
                <motion.div key="exs-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <ExBreadcrumb items={[
                    { label: 'Exercices', onClick: reset },
                    { label: selectedSemester, onClick: () => { setSelectedCaseType(null); setSelectedUE(null); setView('casetypes'); } },
                    { label: selectedCaseType, onClick: () => { setSelectedUE(null); setView('ues'); } },
                    { label: selectedUE }
                  ]}/>
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{currentExs.length} exercice{currentExs.length > 1 ? 's' : ''}</p>
                  </div>
                  <div className="space-y-3 max-w-3xl">
                    {currentExs.map((ex, i) => (
                      <ExerciseCard key={ex._id} ex={ex} index={i} onComplete={() => setCompletedCount(c => c + 1)}/>
                    ))}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
