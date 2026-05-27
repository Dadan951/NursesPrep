import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Palette ───────────────────────────────────────────────────────────────── */
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

/* ─── LocalStorage helpers ──────────────────────────────────────────────────── */
const storageKey  = (s, u, c) => `nprep_fc_${s}_${u}_${c}`.replace(/\s+/g, '_');
const saveProgress  = (s, u, c, i) => { try { localStorage.setItem(storageKey(s,u,c), String(i)); } catch {} };
const loadProgress  = (s, u, c)    => { try { return parseInt(localStorage.getItem(storageKey(s,u,c)) || '0', 10) || 0; } catch { return 0; } };
const clearProgress = (s, u, c)    => { try { localStorage.removeItem(storageKey(s,u,c)); } catch {} };

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
          {i > 0 && <ChevronRight className="w-3 h-3"/>}
          {item.onClick
            ? <button onClick={item.onClick} className="hover:text-blue-600 transition font-medium">{item.label}</button>
            : <span className="text-slate-700 font-semibold">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}

/* ─── Flash Card (quiz style) ───────────────────────────────────────────────── */
function FlashCard({ card, palette, flipped, onFlip }) {
  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className="relative w-full cursor-pointer"
        style={{
          height: 260,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(.4,0,.2,1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={onFlip}
      >
        {/* ── Front ── */}
        <div
          className="absolute inset-0 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-100 p-7 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg,${palette.from},${palette.to})` }}>
              {card.category}
            </span>
            <span className="text-2xl">{palette.emoji}</span>
          </div>
          <p className="text-base font-semibold text-blue-900 flex-1 flex items-center leading-relaxed">{card.front}</p>
          <p className="text-xs text-blue-300 text-center mt-4 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-400 inline-block"/>
            Toucher pour révéler la réponse
          </p>
        </div>

        {/* ── Back ── */}
        <div
          className="absolute inset-0 rounded-3xl p-7 flex flex-col overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: `linear-gradient(135deg,${palette.from},${palette.to})`,
          }}
        >
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl"/>
          </div>
          <div className="flex items-center justify-between mb-4 relative">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Réponse</span>
            <span className="text-2xl">{palette.emoji}</span>
          </div>
          <p className="text-base font-semibold text-white flex-1 flex items-center justify-center text-center leading-relaxed whitespace-pre-line relative">
            {card.back}
          </p>
          {card.hint && (
            <p className="text-xs text-white/70 text-center mt-2 italic relative">💡 {card.hint}</p>
          )}
          <p className="text-xs text-white/50 text-center mt-3 relative">Toucher pour revoir la question</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Grid ─────────────────────────────────────────────────────────── */
function OverviewGrid({ cards, currentIndex, onJumpTo, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-50">
          <div>
            <h3 className="font-bold text-blue-900 text-base">Toutes les cartes</h3>
            <p className="text-xs text-blue-400">{cards.length} cartes — appuie pour sauter</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition text-blue-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card, i) => {
              const pal = PALETTE[i % PALETTE.length];
              const isDone    = i < currentIndex;
              const isCurrent = i === currentIndex;
              return (
                <button key={card._id} onClick={() => onJumpTo(i)}
                  className={`relative rounded-2xl p-3.5 text-left border-2 transition-all ${
                    isCurrent ? 'border-blue-500 shadow-lg shadow-blue-100'
                    : isDone  ? 'border-slate-100 opacity-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }`}>
                  <div className="h-1 rounded-full mb-2.5" style={{ background: `linear-gradient(90deg,${pal.from},${pal.to})` }}/>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                    {isDone && <span className="text-xs text-slate-400">✓</span>}
                    {isCurrent && <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">En cours</span>}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-snug line-clamp-3">{card.front}</p>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Swipe Game (QuizPlay style) ───────────────────────────────────────────── */
function SwipeGame({ cards, onExit, onReviewed, semester, ue, chapter }) {
  const total      = cards.length;
  const savedIndex = loadProgress(semester, ue, chapter);
  const [currentIndex, setCurrentIndex] = useState(() => Math.min(savedIndex, total - 1));
  const [flipped, setFlipped]     = useState(false);
  const [known, setKnown]         = useState(0);
  const [unknown, setUnknown]     = useState(0);
  const [done, setDone]           = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exitDir, setExitDir]     = useState(null); // 'left' | 'right'

  const progress = ((currentIndex + (flipped ? 0 : 0)) / total) * 100;
  const resumed  = savedIndex > 0 && savedIndex < total;
  const card     = cards[currentIndex];
  const palette  = PALETTE[currentIndex % PALETTE.length];

  useEffect(() => { saveProgress(semester, ue, chapter, currentIndex); }, [currentIndex, semester, ue, chapter]);
  useEffect(() => { setFlipped(false); setExitDir(null); }, [currentIndex]);

  const handleAnswer = useCallback((dir) => {
    if (!flipped) return;
    setExitDir(dir);
    if (dir === 'right') {
      setKnown(k => k + 1);
      axios.post(`${API_URL}/flashcards/reviewed`).catch(() => {});
      onReviewed();
    } else {
      setUnknown(u => u + 1);
    }
    setTimeout(() => {
      const next = currentIndex + 1;
      if (next >= total) {
        clearProgress(semester, ue, chapter);
        setDone(true);
      } else {
        setCurrentIndex(next);
      }
    }, 300);
  }, [flipped, currentIndex, total, semester, ue, chapter, onReviewed]);

  const handleRestart = () => {
    clearProgress(semester, ue, chapter);
    setCurrentIndex(0); setKnown(0); setUnknown(0);
    setDone(false); setFlipped(false); setExitDir(null);
  };

  /* ── Result screen ── */
  if (done) {
    const pct    = Math.round((known / total) * 100);
    const passed = pct >= 60;
    return (
      <main className="flex-1 p-4 lg:p-8 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
              <span className="text-4xl">{pct >= 80 ? '🏆' : pct >= 60 ? '💪' : '📚'}</span>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-1">
              {pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continue à réviser !'}
            </h2>
            <p className="text-sm text-blue-400 mb-6">Flashcards terminées</p>

            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-green-500">{known}</span>
                <p className="text-xs text-green-400 mt-1">✓ Sus</p>
              </div>
              <div className="text-3xl text-blue-200">/</div>
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">{total}</span>
                <p className="text-xs text-blue-400 mt-1">Total</p>
              </div>
              <div className="text-3xl text-blue-200">/</div>
              <div className="text-center">
                <span className="text-4xl font-bold text-red-400">{unknown}</span>
                <p className="text-xs text-red-300 mt-1">✗ À revoir</p>
              </div>
            </div>

            <div className={`text-2xl font-bold mb-6 ${passed ? 'text-green-500' : 'text-orange-500'}`}>{pct}%</div>

            <div className="w-full h-3 bg-blue-100 rounded-full mb-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-3 rounded-full ${passed ? 'bg-green-400' : 'bg-orange-400'}`}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onExit} className="flex-1 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                Retour aux chapitres
              </button>
              <button onClick={handleRestart} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Recommencer
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Overview modal */}
      <AnimatePresence>
        {showOverview && (
          <OverviewGrid cards={cards} currentIndex={currentIndex}
            onJumpTo={i => { setCurrentIndex(i); setShowOverview(false); }}
            onClose={() => setShowOverview(false)} />
        )}
      </AnimatePresence>

      {/* Confirm exit modal */}
      {confirmExit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-blue-900 mb-1">Quitter les flashcards ?</h3>
            <p className="text-xs text-blue-400 mb-5">Ta progression est sauvegardée automatiquement.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmExit(false)}
                className="flex-1 py-2.5 border border-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                Continuer
              </button>
              <button onClick={onExit}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 p-4 lg:p-8 flex items-center justify-center overflow-auto">
        <div className="w-full max-w-xl">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-blue-400">{chapter}</p>
              <p className="text-sm font-semibold text-blue-900">Carte {currentIndex + 1} / {total}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Vue d'ensemble */}
              <button onClick={() => setShowOverview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-500 hover:bg-blue-100 transition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Toutes les cartes
              </button>
              {/* Exit */}
              <button onClick={() => setConfirmExit(true)} title="Quitter"
                className="text-blue-300 hover:text-blue-500 transition p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-blue-100 rounded-full mb-6 overflow-hidden">
            <motion.div className="h-1.5 bg-blue-500 rounded-full"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
          </div>

          {/* Resume banner */}
          {resumed && currentIndex === savedIndex && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-2.5 flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-blue-700">📌 Reprise à la carte {savedIndex + 1}</p>
              <button onClick={handleRestart} className="text-xs text-blue-500 hover:text-blue-700 font-medium transition">
                Recommencer
              </button>
            </div>
          )}

          {/* Card */}
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex}
              initial={{ opacity: 0, x: exitDir === 'right' ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: exitDir === 'right' ? 40 : -40 }}
              transition={{ duration: 0.25 }}
            >
              <FlashCard
                card={card}
                palette={palette}
                flipped={flipped}
                onFlip={() => setFlipped(f => !f)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Score ligne */}
          <div className="flex justify-between mt-3 px-1">
            <span className="text-xs font-bold text-red-400">✗ {unknown} à retravailler</span>
            <span className="text-xs font-bold text-green-500">✓ {known} sus</span>
          </div>

          {/* Buttons — apparaissent après le flip */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-3 mt-4"
              >
                <button onClick={() => handleAnswer('left')}
                  className="flex-1 py-3 border-2 border-red-200 text-red-500 rounded-xl text-sm font-semibold hover:bg-red-50 transition">
                  ✗ Je ne savais pas
                </button>
                <button onClick={() => handleAnswer('right')}
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition">
                  ✓ Je savais !
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!flipped && (
            <p className="text-xs text-blue-300 text-center mt-4">Retourne la carte pour voir la réponse</p>
          )}

        </div>
      </main>
    </>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Flashcards() {
  const [cards, setCards]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);
  const [reviewedCount, setReviewedCount]       = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/flashcards`).then(r => setCards(r.data)).finally(() => setLoading(false));
  }, []);

  const structure = {};
  cards.forEach(c => {
    const sem  = (c.semester || 'Non classé').trim();
    const ue   = (c.category || 'Autre').trim();
    const chap = (c.chapter  || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(c);
  });

  const semesters    = Object.keys(structure).sort();
  const ues          = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters     = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentCards = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE    = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalCards   = cards.length;

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  /* ── Game mode : full screen comme QuizPlay ── */
  if (view === 'cards' && selectedSemester && selectedUE && selectedChapter) {
    return (
      <DashboardLayout>
        <SwipeGame
          key={selectedChapter}
          cards={currentCards}
          onExit={() => setView('chapters')}
          onReviewed={() => setReviewedCount(c => c + 1)}
          semester={selectedSemester}
          ue={selectedUE}
          chapter={selectedChapter}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Flashcards</h1>
              <p className="text-blue-200/70 text-sm">Mémorisez les notions clés par répétition espacée</p>
            </div>
            <div className="flex gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-white">{totalCards}</p>
                <p className="text-xs text-blue-300/70">Cartes</p>
              </div>
              <div>
                <p className="text-xl font-bold text-white">{semesters.length}</p>
                <p className="text-xs text-blue-300/70">Semestres</p>
              </div>
              {reviewedCount > 0 && (
                <div>
                  <p className="text-xl font-bold text-emerald-400">{reviewedCount}</p>
                  <p className="text-xs text-blue-300/70">Révisées</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="p-6 bg-slate-50 min-h-full">
          <AnimatePresence mode="wait">

            {/* SEMESTERS */}
            {view === 'semesters' && (
              <motion.div key="sems"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}>
                {semesters.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <div className="text-5xl mb-3">🃏</div>
                    <p className="font-semibold">Aucune flashcard disponible</p>
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
                          whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                        >
                          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                          <div className="text-4xl mb-4">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-base mb-1">{sem}</h3>
                          <p className="text-white/75 text-xs mb-4">{ueCount} UE · {total} carte{total > 1 ? 's' : ''}</p>
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
              <motion.div key="ues-view"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                <Breadcrumb items={[
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setView('semesters'); } },
                  { label: selectedSemester }
                ]}/>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{selectedSemester}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{ues.length} unité{ues.length > 1 ? 's' : ''} d'enseignement</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ues.map((ue, idx) => {
                    const pal     = PALETTE[idx % PALETTE.length];
                    const total   = Object.values(structure[selectedSemester][ue]).flat().length;
                    const chCount = Object.keys(structure[selectedSemester][ue]).length;
                    return (
                      <motion.button key={ue}
                        onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                        style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                        <div className="text-3xl mb-3">{pal.emoji}</div>
                        <h3 className="font-bold text-white text-sm mb-1">{ue}</h3>
                        <p className="text-white/75 text-xs mb-3">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} carte{total > 1 ? 's' : ''}</p>
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
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setSelectedUE(null); setView('semesters'); } },
                  { label: selectedSemester, onClick: () => { setSelectedUE(null); setView('ues'); } },
                  { label: selectedUE }
                ]}/>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-800">{selectedUE}</h2>
                  <p className="text-sm text-slate-400 mt-0.5">{totalInUE} carte{totalInUE > 1 ? 's' : ''} disponible{totalInUE > 1 ? 's' : ''}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {chapters.map((chap, idx) => {
                    const pal     = PALETTE[idx % PALETTE.length];
                    const count   = structure[selectedSemester][selectedUE][chap].length;
                    const saved   = loadProgress(selectedSemester, selectedUE, chap);
                    const hasProgress = saved > 0 && saved < count;
                    return (
                      <motion.button key={chap}
                        onClick={() => { setSelectedChapter(chap); setView('cards'); }}
                        whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                        style={{ willChange: 'transform' }}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-shadow transition-colors text-left group flex items-center gap-4 shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                          style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                          {pal.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{count} carte{count > 1 ? 's' : ''}</p>
                          {hasProgress && (
                            <div className="mt-1.5 flex items-center gap-1.5">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-1 rounded-full" style={{ width: `${(saved/count)*100}%`, background: `linear-gradient(90deg,${pal.from},${pal.to})` }}/>
                              </div>
                              <span className="text-xs text-blue-500 font-semibold">📌 {saved}/{count}</span>
                            </div>
                          )}
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

          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
