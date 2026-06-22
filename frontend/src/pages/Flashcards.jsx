import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Palette ───────────────────────────────────────────────────────────────── */
const PALETTE = [
  { from: '#6366f1', to: '#8b5cf6', emoji: '' },
  { from: '#0891b2', to: '#0284c7', emoji: '' },
  { from: '#059669', to: '#047857', emoji: '' },
  { from: '#dc2626', to: '#db2777', emoji: '' },
  { from: '#ea580c', to: '#d97706', emoji: '' },
  { from: '#7c3aed', to: '#6d28d9', emoji: '' },
  { from: '#0f766e', to: '#0891b2', emoji: '' },
  { from: '#be185d', to: '#9333ea', emoji: '' },
];

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

/* ─── FlashCard (3D flip) ────────────────────────────────────────────────────── */
function FlashCard({ card, palette, flipped, onFlip }) {
  const backRef          = useRef(null);
  const [needsScroll, setNeedsScroll]   = useState(false);  // la réponse dépasse
  const [scrollDone, setScrollDone]     = useState(false);   // l'utilisateur a scrollé jusqu'en bas

  /* Reset scroll + recalcul dès que la carte se retourne */
  useEffect(() => {
    if (!flipped || !backRef.current) return;
    const el = backRef.current;
    el.scrollTop = 0;                                        // toujours montrer le début
    setScrollDone(false);
    // Légère attente pour laisser le DOM se stabiliser après l'animation
    const timer = setTimeout(() => {
      setNeedsScroll(el.scrollHeight > el.clientHeight + 4);
    }, 300);
    return () => clearTimeout(timer);
  }, [flipped, card]);

  const handleScroll = () => {
    if (!backRef.current) return;
    const el = backRef.current;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setScrollDone(true);
  };

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
        {/* ── Face recto ── */}
        <div className="absolute inset-0 rounded-3xl bg-white border border-blue-100 shadow-xl shadow-blue-100 p-6 flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-xl text-white leading-tight w-fit max-w-[75%] break-words"
              style={{ background: `linear-gradient(135deg,${palette.from},${palette.to})` }}>
              {card.category}
            </span>
          </div>
          {/* Question : centrée verticalement, scroll si trop longue */}
          <div className="flex-1 overflow-y-auto flex items-center justify-center">
            <p className="text-base font-semibold text-blue-900 text-center leading-relaxed">{card.front}</p>
          </div>
          <p className="text-xs text-blue-300 text-center mt-3 flex-shrink-0 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-blue-400 inline-block"/>
            Toucher pour révéler la réponse
          </p>
        </div>

        {/* ── Face verso ── */}
        <div className="absolute inset-0 rounded-3xl p-6 flex flex-col overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `linear-gradient(135deg,${palette.from},${palette.to})` }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-3xl"/>
          </div>

          {/* En-tête */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0 relative">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">Réponse</span>
          </div>

          {/* Réponse : centrée si courte, scrollable depuis le début si longue */}
          <div
            ref={backRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto flex flex-col"
          >
            <div className="my-auto py-1">
              <p className="text-sm font-semibold text-white text-center leading-relaxed whitespace-pre-line">
                {card.back}
              </p>
              {card.hint && <p className="text-xs text-white/70 text-center mt-3 italic">{card.hint}</p>}
            </div>
          </div>

          {/* Indicateur "↓ Défiler" — visible tant qu'on n'a pas atteint le bas */}
          {needsScroll && !scrollDone && (
            <div className="flex-shrink-0 flex items-center justify-center gap-1 mt-1 pointer-events-none">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                className="animate-bounce opacity-70">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <span className="text-xs text-white/60">Défiler pour voir la suite</span>
            </div>
          )}

          <p className="text-xs text-white/40 text-center mt-1.5 flex-shrink-0 relative">Toucher pour revoir la question</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Grid ─────────────────────────────────────────────────────────── */
function OverviewGrid({ cards, currentIndex, unknownCards, onJumpTo, onClose }) {
  const unknownFronts = new Set(unknownCards.map(c => c.front));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}>
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
              const pal       = PALETTE[i % PALETTE.length];
              const isDone    = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isWrong   = unknownFronts.has(card.front);
              return (
                <button key={card._id} onClick={() => onJumpTo(i)}
                  className={`relative rounded-2xl p-3.5 text-left border-2 transition-all ${
                    isCurrent  ? 'border-blue-500 shadow-lg shadow-blue-100'
                    : isDone && isWrong ? 'border-red-200 bg-red-50'
                    : isDone   ? 'border-slate-100 opacity-50'
                    : 'border-slate-200 hover:border-blue-300'
                  }`}>
                  <div className="h-1 rounded-full mb-2.5" style={{ background: `linear-gradient(90deg,${pal.from},${pal.to})` }}/>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                    {isDone && !isWrong && <span className="text-xs text-green-500">✓</span>}
                    {isDone &&  isWrong && <span className="text-xs text-red-500">✗</span>}
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

/* ─── SwipeGame ─────────────────────────────────────────────────────────────── */
function SwipeGame({ cards, onExit, semester, ue, chapter, prevAttempt }) {
  const total = cards.length;

  // Si reprise, on repart à l'index sauvegardé
  const [currentIndex,  setCurrentIndex]  = useState(() => prevAttempt?.status === 'in_progress' ? Math.min(prevAttempt.currentIndex, total - 1) : 0);
  const [flipped,       setFlipped]       = useState(false);
  const [known,         setKnown]         = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.known || 0) : 0);
  const [unknown,       setUnknown]       = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.unknown || 0) : 0);
  const [unknownCards,  setUnknownCards]  = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.unknownCards || []) : []);
  const [done,          setDone]          = useState(false);
  const [confirmExit,   setConfirmExit]   = useState(false);
  const [showOverview,  setShowOverview]  = useState(false);
  const [exitDir,       setExitDir]       = useState(null);

  const progress = (currentIndex / total) * 100;
  const card     = cards[currentIndex];
  const palette  = PALETTE[currentIndex % PALETTE.length];

  useEffect(() => { setFlipped(false); setExitDir(null); }, [currentIndex]);

  /* Sauvegarde en base après chaque carte */
  const persistProgress = useCallback(async (idx, k, u, uCards, status = 'in_progress') => {
    try {
      if (status === 'completed') {
        await axios.post(`${API_URL}/flashcards/attempt/complete`, {
          semester, ue, chapter, known: k, unknown: u, total, unknownCards: uCards,
        });
      } else {
        await axios.put(`${API_URL}/flashcards/attempt`, {
          semester, ue, chapter, currentIndex: idx, known: k, unknown: u, total, unknownCards: uCards,
        });
      }
    } catch {}
  }, [semester, ue, chapter, total]);

  const handleAnswer = useCallback((dir) => {
    if (!flipped) return;
    const isKnown = dir === 'right';
    const newKnown   = isKnown ? known + 1   : known;
    const newUnknown = isKnown ? unknown      : unknown + 1;
    const newUnknownCards = isKnown ? unknownCards : [...unknownCards, { front: card.front, back: card.back }];

    setExitDir(dir);
    setKnown(newKnown);
    setUnknown(newUnknown);
    setUnknownCards(newUnknownCards);

    setTimeout(() => {
      const next = currentIndex + 1;
      if (next >= total) {
        persistProgress(0, newKnown, newUnknown, newUnknownCards, 'completed');
        setDone(true);
      } else {
        setCurrentIndex(next);
        persistProgress(next, newKnown, newUnknown, newUnknownCards);
      }
    }, 300);
  }, [flipped, currentIndex, total, known, unknown, unknownCards, card, persistProgress]);

  const handleRestart = () => {
    setCurrentIndex(0); setKnown(0); setUnknown(0);
    setUnknownCards([]); setDone(false); setFlipped(false); setExitDir(null);
    persistProgress(0, 0, 0, []);
  };

  /* ── Écran de résultat ── */
  if (done) {
    const pct    = Math.round((known / total) * 100);
    const passed = pct >= 60;
    return (
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
        <div className="w-full max-w-lg mx-auto my-auto">
          <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100 text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-1">
              {pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continue à réviser !'}
            </h2>
            <p className="text-sm text-blue-400 mb-6">Flashcards terminées</p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <span className="text-4xl font-bold text-green-500">{known}</span>
                <p className="text-xs text-green-400 mt-1">✓ Connu</p>
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
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.3 }}
                className={`h-3 rounded-full ${passed ? 'bg-green-400' : 'bg-orange-400'}`}/>
            </div>

            {/* Cartes à retravailler */}
            {unknownCards.length > 0 && (
              <div className="text-left mb-6">
                <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
                  {unknownCards.length} carte{unknownCards.length > 1 ? 's' : ''} à retravailler :
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {unknownCards.map((c, i) => (
                    <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 text-left">
                      <p className="text-xs font-semibold text-red-800 mb-1">{c.front}</p>
                      <p className="text-xs text-blue-600">{c.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
      <AnimatePresence>
        {showOverview && (
          <OverviewGrid cards={cards} currentIndex={currentIndex} unknownCards={unknownCards}
            onJumpTo={i => { setCurrentIndex(i); setShowOverview(false); }}
            onClose={() => setShowOverview(false)}/>
        )}
      </AnimatePresence>

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
            <p className="text-xs text-blue-400 mb-1">Ta progression est <strong className="text-blue-600">automatiquement sauvegardée</strong>.</p>
            <p className="text-xs text-blue-300 mb-5">Tu pourras reprendre à la carte {currentIndex + 1} la prochaine fois.</p>
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

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
        <div className="w-full max-w-xl mx-auto my-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-blue-400">{chapter}</p>
              <p className="text-sm font-semibold text-blue-900">Carte {currentIndex + 1} / {total}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowOverview(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-500 hover:bg-blue-100 transition">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                Toutes
              </button>
              <button onClick={() => setConfirmExit(true)} title="Quitter"
                className="text-blue-300 hover:text-blue-500 transition p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full h-1.5 bg-blue-100 rounded-full mb-6 overflow-hidden">
            <motion.div className="h-1.5 bg-blue-500 rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}/>
          </div>

          {/* Carte */}
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex}
              initial={{ opacity: 0, x: exitDir === 'right' ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: exitDir === 'right' ? 40 : -40 }}
              transition={{ duration: 0.25 }}>
              <FlashCard card={card} palette={palette} flipped={flipped} onFlip={() => setFlipped(f => !f)}/>
            </motion.div>
          </AnimatePresence>

          {/* Score live */}
          <div className="flex justify-between mt-3 px-1">
            <span className="text-xs font-bold text-red-400">✗ {unknown} à retravailler</span>
            <span className="text-xs font-bold text-green-500">✓ {known} Connu</span>
          </div>

          {/* Boutons après flip */}
          <AnimatePresence>
            {flipped && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex gap-3 mt-4">
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
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isFree   = (user?.subscription || 'free') === 'free';

  const [cards,      setCards]      = useState([]);
  const [attempts,   setAttempts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [view,       setView]       = useState('semesters');
  const [quotaModal, setQuotaModal] = useState(false);

  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE,       setSelectedUE]       = useState(null);
  const [selectedChapter,  setSelectedChapter]  = useState(null);

  // Attempt du chapitre sélectionné (pour les modals)
  const [chapterAttempt,  setChapterAttempt]  = useState(null);
  const [resumeModal,     setResumeModal]     = useState(false);
  const [errorsModal,     setErrorsModal]     = useState(false);

  /* Chargement initial avec cache */
  useEffect(() => {
    // Affiche immédiatement le cache si disponible
    const cachedCards = getCache('flashcards_list');
    if (cachedCards) { setCards(cachedCards); setLoading(false); }

    // Toujours rafraîchir les attempts (données utilisateur, doivent être fraîches)
    // Les cartes sont rafraîchies en arrière-plan
    Promise.all([
      axios.get(`${API_URL}/flashcards`),
      axios.get(`${API_URL}/flashcards/attempts`).catch(() => ({ data: [] })),
    ]).then(([cardsRes, attemptsRes]) => {
      setCards(cardsRes.data);
      setCache('flashcards_list', cardsRes.data);
      setAttempts(attemptsRes.data);
    }).finally(() => setLoading(false));
  }, []);

  /* Map des attempts par clé "sem|ue|chap" pour lookup rapide */
  const attemptMap = {};
  attempts.forEach(a => {
    attemptMap[`${a.semester}|${a.ue}|${a.chapter}`] = a;
  });

  /* Structure hiérarchique */
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
  const chapters     = (selectedSemester && selectedUE)
    ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentCards = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE    = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalCards   = cards.length;

  /* Clic sur un chapitre → afficher modal ou démarrer */
  const handleChapterClick = (chap) => {
    setSelectedChapter(chap);
    const a = attemptMap[`${selectedSemester}|${selectedUE}|${chap}`];
    setChapterAttempt(a || null);
    if (a?.status === 'in_progress') {
      setResumeModal(true);
    } else if (a?.status === 'completed') {
      setErrorsModal(true);
    } else {
      setView('cards');
    }
  };

  /* Vérifier quota flashcards (free: 20 cartes/mois) */
  const checkQuota = async () => {
    if (!isFree) return true;
    try {
      const { data } = await axios.get(`${API_URL}/flashcards/quota`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.exceeded) { setQuotaModal(true); return false; }
    } catch {}
    return true;
  };

  /* Démarrer depuis le début */
  const handleStart = async () => {
    const ok = await checkQuota();
    if (!ok) return;
    setResumeModal(false);
    setErrorsModal(false);
    setChapterAttempt(null);
    setView('cards');
  };

  /* Reprendre */
  const handleResume = async () => {
    const ok = await checkQuota();
    if (!ok) return;
    setResumeModal(false);
    setView('cards');
  };

  /* Après une session : rafraîchir les attempts */
  const handleExit = () => {
    axios.get(`${API_URL}/flashcards/attempts`).then(r => setAttempts(r.data)).catch(() => {});
    setView('chapters');
    setChapterAttempt(null);
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  /* ── Mode jeu ── */
  if (view === 'cards' && selectedSemester && selectedUE && selectedChapter) {
    return (
      <DashboardLayout>
        <SwipeGame
          key={`${selectedChapter}-${chapterAttempt?.status}`}
          cards={currentCards}
          onExit={handleExit}
          semester={selectedSemester}
          ue={selectedUE}
          chapter={selectedChapter}
          prevAttempt={chapterAttempt}
        />
      </DashboardLayout>
    );
  }

  /* ── Modal : en cours → reprendre ou recommencer ── */
  if (resumeModal && chapterAttempt) {
    const a   = chapterAttempt;
    const tot = currentCards.length || a.total;
    const pct = tot ? Math.round((a.currentIndex / tot) * 100) : 0;
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="w-full max-w-md mx-auto my-auto">
            <div className="bg-white rounded-3xl p-7 border border-blue-100 shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 mx-auto mb-4 flex items-center justify-center">
              </div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Session en cours</h2>
              <p className="text-sm text-blue-400 mb-5">
                Tu t'étais arrêté à la carte <strong className="text-blue-700">{a.currentIndex + 1}/{tot}</strong>
              </p>
              <div className="w-full h-2 bg-blue-100 rounded-full mb-1 overflow-hidden">
                <div className="h-2 bg-amber-400 rounded-full" style={{ width: `${pct}%` }}/>
              </div>
              <p className="text-xs text-blue-400 mb-6">{pct}% complété · {a.known} connu · {a.unknown} à revoir</p>
              <div className="flex flex-col gap-3">
                <button onClick={handleResume}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                  ▶ Reprendre où je me suis arrêté
                </button>
                <button onClick={handleStart}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  Recommencer depuis le début
                </button>
                <button onClick={() => { setResumeModal(false); setSelectedChapter(null); }}
                  className="text-xs text-blue-300 hover:text-blue-500 transition pt-1">
                  ← Retour aux chapitres
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Modal : terminé → voir les erreurs ── */
  if (errorsModal && chapterAttempt) {
    const a      = chapterAttempt;
    const tot    = a.total || currentCards.length;
    const pct    = tot ? Math.round((a.known / tot) * 100) : 0;
    const passed = pct >= 60;
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="w-full max-w-lg mx-auto my-auto">
            <div className="bg-white rounded-3xl p-7 border border-blue-100 shadow-xl">
              <div className="text-center mb-5">
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
                </div>
                <h2 className="text-lg font-bold text-blue-900">Dernière session</h2>
                <p className={`text-3xl font-bold mt-1 ${passed ? 'text-green-500' : 'text-orange-500'}`}>{pct}%</p>
                <p className="text-sm text-blue-400">{a.known} connu · {a.unknown} à revoir · {tot} cartes au total</p>
              </div>

              {/* Cartes ratées */}
              {(a.unknownCards || []).length > 0 ? (
                <div className="mb-5">
                  <p className="text-xs font-bold text-blue-900 mb-3 uppercase tracking-wide">
                    {a.unknownCards.length} carte{a.unknownCards.length > 1 ? 's' : ''} à retravailler :
                  </p>
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {a.unknownCards.map((c, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-red-800 mb-1.5">{c.front}</p>
                        <p className="text-xs text-blue-700">{c.back}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-4 text-center mb-5">
                  <p className="text-sm font-semibold text-green-700">Tu savais toutes les cartes la dernière fois !</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button onClick={handleStart}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                  Refaire ce chapitre
                </button>
                <button onClick={() => { setErrorsModal(false); setSelectedChapter(null); }}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  ← Retour aux chapitres
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Navigation ── */
  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Quota modal ── */}
        <AnimatePresence>
          {quotaModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setQuotaModal(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
                onClick={e => e.stopPropagation()}>
                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Quota mensuel atteint</h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Vous avez utilisé vos <strong>20 flashcards gratuites</strong> ce mois-ci.<br/>
                  Passez à l'abonnement Étudiant pour des flashcards illimitées.
                </p>
                <div className="flex flex-col gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/dashboard/subscription')}
                    className="w-full py-3 rounded-2xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #0891b2)' }}>
                    Voir les abonnements
                  </motion.button>
                  <button onClick={() => setQuotaModal(false)}
                    className="w-full py-2.5 rounded-2xl text-sm font-semibold text-slate-500 hover:bg-slate-50 transition">
                    Plus tard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
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
              {attempts.filter(a => a.status === 'completed').length > 0 && (
                <div>
                  <p className="text-xl font-bold text-emerald-400">{attempts.filter(a => a.status === 'completed').length}</p>
                  <p className="text-xs text-blue-300/70">Terminés</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 min-h-full">
          <AnimatePresence mode="wait">

            {/* SEMESTERS */}
            {view === 'semesters' && (
              <motion.div key="sems" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
                {semesters.length === 0 ? (
                  <div className="text-center py-20 text-slate-400">
                    <div className="text-5xl mb-3"></div>
                    <p className="font-semibold">Aucune flashcard disponible</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {semesters.map((sem, idx) => {
                      const pal     = PALETTE[idx % PALETTE.length];
                      const ueCount = Object.keys(structure[sem]).length;
                      const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                      const doneCount = attempts.filter(a => a.semester === sem && a.status === 'completed').length;
                      return (
                        <motion.button key={sem}
                          onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                          whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}>
                          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                          <h3 className="font-bold text-white text-base mb-1">{sem}</h3>
                          <p className="text-white/75 text-xs mb-1">{ueCount} UE · {total} carte{total > 1 ? 's' : ''}</p>
                          {doneCount > 0 && <p className="text-white/60 text-xs mb-3">✓ {doneCount} chapitre{doneCount > 1 ? 's' : ''} terminé{doneCount > 1 ? 's' : ''}</p>}
                          <div className="flex items-center justify-between mt-3">
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
              <motion.div key="ues-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
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
                    const doneCount = Object.keys(structure[selectedSemester][ue]).filter(ch => {
                      const a = attemptMap[`${selectedSemester}|${ue}|${ch}`];
                      return a?.status === 'completed';
                    }).length;
                    return (
                      <motion.button key={ue}
                        onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                        whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                        style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}>
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                        <h3 className="font-bold text-white text-sm mb-1">{ue}</h3>
                        <p className="text-white/75 text-xs">{chCount} chapitre{chCount > 1 ? 's' : ''} · {total} carte{total > 1 ? 's' : ''}</p>
                        {doneCount > 0 && (
                          <p className="text-white/60 text-xs mt-1">✓ {doneCount}/{chCount} terminé{doneCount > 1 ? 's' : ''}</p>
                        )}
                        <div className="flex justify-end mt-3">
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
              <motion.div key="chaps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
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
                    const pal    = PALETTE[idx % PALETTE.length];
                    const count  = structure[selectedSemester][selectedUE][chap].length;
                    const a      = attemptMap[`${selectedSemester}|${selectedUE}|${chap}`];
                    const isDone = a?.status === 'completed';
                    const isInProgress = a?.status === 'in_progress';
                    const pct    = isDone && a.total ? Math.round((a.known / a.total) * 100) : null;
                    const barColor = pct >= 60 ? '#22c55e' : '#f97316';

                    return (
                      <motion.button key={chap}
                        onClick={() => handleChapterClick(chap)}
                        whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }}
                        style={{ willChange: 'transform' }}
                        className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-50 transition-shadow transition-colors text-left group flex flex-col gap-3 shadow-sm">

                        {/* Ligne principale */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                            style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-slate-800 text-sm truncate">{chap}</h3>
                              {/* Badge statut */}
                              {isDone && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${pct >= 60 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {pct >= 60 ? '✓' : '✗'} {a.known}/{a.total}
                                </span>
                              )}
                              {isInProgress && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 bg-amber-100 text-amber-700">
                                  ● {a.currentIndex}/{count}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{count} carte{count > 1 ? 's' : ''}</p>
                          </div>
                          <div className="text-slate-300 group-hover:text-blue-500 transition flex-shrink-0">
                            <ChevronRight/>
                          </div>
                        </div>

                        {/* Barre de score si terminé */}
                        {isDone && (
                          <div>
                            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-1 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }}/>
                            </div>
                            {(a.unknownCards || []).length > 0 && (
                              <p className="text-xs text-orange-500 mt-1">
                                {a.unknownCards.length} carte{a.unknownCards.length > 1 ? 's' : ''} à retravailler
                              </p>
                            )}
                          </div>
                        )}

                        {/* Barre de progression si en cours */}
                        {isInProgress && (
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-1 rounded-full bg-amber-400" style={{ width: `${Math.round((a.currentIndex / count) * 100)}%` }}/>
                          </div>
                        )}
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
