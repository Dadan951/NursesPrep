import { useState, useEffect } from 'react';
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

/* ─── Flash Card (3D flip) ───────────────────────────────────────────────────── */
function FlashCard({ card, idx, onReviewed }) {
  const [flipped, setFlipped]   = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const pal = PALETTE[idx % PALETTE.length];

  const handleReview = async (e) => {
    e.stopPropagation();
    if (reviewed) return;
    setReviewed(true);
    try {
      await axios.post(`${API_URL}/flashcards/reviewed`);
      onReviewed();
    } catch {}
  };

  return (
    <motion.div
      className="cursor-pointer"
      style={{ perspective: '1000px', height: 220 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => setFlipped(f => !f)}
    >
      <div
        className="relative w-full h-full transition-all duration-500"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-md flex flex-col"
          style={{ backfaceVisibility: 'hidden' }}>
          <div className="h-1.5 flex-shrink-0" style={{ background: `linear-gradient(90deg,${pal.from},${pal.to})` }}/>
          <div className="flex items-center justify-between px-4 pt-3 pb-1 flex-shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
              {card.category}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${diffColors[card.difficulty]}`}>
              {diffLabel[card.difficulty]}
            </span>
          </div>
          <div className="flex-1 flex items-center justify-center px-5 py-2">
            <p className="text-sm font-bold text-slate-800 text-center leading-relaxed">{card.front}</p>
          </div>
          <p className="text-xs text-slate-400 text-center pb-3 flex-shrink-0">Cliquer pour retourner →</p>
        </div>

        {/* Back */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: `linear-gradient(135deg,${pal.from},${pal.to})` }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 right-2 w-24 h-24 rounded-full bg-white blur-2xl"/>
          </div>
          <div className="flex-1 flex items-center justify-center px-5 py-4 relative">
            <p className="text-sm text-white text-center leading-relaxed whitespace-pre-line font-medium">{card.back}</p>
          </div>
          {card.hint && (
            <p className="text-xs text-white/70 text-center px-4 mb-2 italic">💡 {card.hint}</p>
          )}
          {!reviewed ? (
            <button onClick={handleReview}
              className="mx-4 mb-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition border border-white/20">
              ✓ Marquer comme révisée
            </button>
          ) : (
            <div className="mx-4 mb-4 py-2 bg-white/10 text-white/80 rounded-xl text-xs font-bold text-center border border-white/10">
              ✓ Révisée
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Flashcards() {
  const [cards, setCards]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [view, setView]                 = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);
  const [reviewedCount, setReviewedCount]       = useState(0);

  useEffect(() => {
    axios.get(`${API_URL}/flashcards`).then(r => setCards(r.data)).finally(() => setLoading(false));
  }, []);

  const structure = {};
  cards.forEach(c => {
    const sem  = c.semester  || 'Non classé';
    const ue   = c.category  || 'Autre';
    const chap = c.chapter   || 'Général';
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(c);
  });

  const semesters   = Object.keys(structure).sort();
  const ues         = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters    = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentCards = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE   = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalCards  = cards.length;

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

          {/* Progress bar for session */}
          {reviewedCount > 0 && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-blue-300/70 mb-1.5">
                <span>Progression de la session</span>
                <span>{reviewedCount} / {totalCards} cartes</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((reviewedCount / totalCards) * 100, 100)}%` }}
                  className="h-2 rounded-full"
                  style={{ background: 'linear-gradient(90deg,#34d399,#10b981)' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Content ── */}
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
                          whileHover={{ y: -6, scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                          className="relative overflow-hidden rounded-2xl p-6 text-left shadow-md hover:shadow-xl transition-shadow"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                        >
                          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10 blur-2xl"/>
                          <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-black/10 blur-xl"/>
                          <div className="text-4xl mb-4">{pal.emoji}</div>
                          <h3 className="font-bold text-white text-base mb-1 leading-snug">{sem}</h3>
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
                        whileHover={{ y: -4, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                        className="relative overflow-hidden rounded-2xl p-5 text-left shadow-md hover:shadow-xl transition-shadow"
                        style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                      >
                        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl"/>
                        <div className="text-3xl mb-3">{pal.emoji}</div>
                        <h3 className="font-bold text-white text-sm mb-1 leading-snug">{ue}</h3>
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
                    const pal   = PALETTE[idx % PALETTE.length];
                    const count = structure[selectedSemester][selectedUE][chap].length;
                    return (
                      <motion.button key={chap}
                        onClick={() => { setSelectedChapter(chap); setView('cards'); }}
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
                          <p className="text-xs text-slate-400 mt-0.5">{count} carte{count > 1 ? 's' : ''}</p>
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

            {/* CARDS */}
            {view === 'cards' && selectedSemester && selectedUE && selectedChapter && (
              <motion.div key="cards-view"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}>
                <Breadcrumb items={[
                  { label: 'Flashcards', onClick: () => { setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); setView('semesters'); } },
                  { label: selectedSemester, onClick: () => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
                  { label: selectedUE, onClick: () => { setSelectedChapter(null); setView('chapters'); } },
                  { label: selectedChapter }
                ]}/>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedChapter}</h2>
                    <p className="text-sm text-slate-400 mt-0.5">{currentCards.length} carte{currentCards.length > 1 ? 's' : ''}</p>
                  </div>
                  {reviewedCount > 0 && (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold">
                      ✓ {reviewedCount} révisée{reviewedCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="bg-blue-50/70 border border-blue-200 rounded-2xl px-4 py-3 mb-6 flex items-center gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>
                  </svg>
                  <p className="text-xs text-blue-600 font-medium">Cliquez sur une carte pour la retourner et voir la réponse.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentCards.map((card, i) => (
                    <motion.div key={card._id}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}>
                      <FlashCard card={card} idx={i} onReviewed={() => setReviewedCount(c => c + 1)}/>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
