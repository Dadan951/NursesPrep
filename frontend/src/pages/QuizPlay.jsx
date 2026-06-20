import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ── Mélange aléatoire des options (Fisher-Yates) ───────────────────────── */
function shuffleOptions(questions) {
  return questions.map(q => {
    const opts = [...q.options];
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }
    return { ...q, options: opts };
  });
}

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz]                       = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [current, setCurrent]                 = useState(0);
  const [selected, setSelected]               = useState(null);
  const [answered, setAnswered]               = useState(false);
  const [score, setScore]                     = useState(0);
  const [done, setDone]                       = useState(false);
  const [answers, setAnswers]                 = useState([]);
  const [timeLeft, setTimeLeft]               = useState(null);
  const [confirmExit, setConfirmExit]         = useState(false);

  // États pour la gestion de la progression
  const [prevAttempt, setPrevAttempt]   = useState(null);   // attempt existant au chargement
  const [resumeModal, setResumeModal]   = useState(false);  // modal "reprendre ou recommencer ?"
  const [errorsModal, setErrorsModal]   = useState(false);  // modal "voir les erreurs précédentes"
  const [ready, setReady]               = useState(false);  // le quiz est prêt à démarrer

  /* ── Chargement du quiz + attempt existant ─────────────────────────── */
  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/quizzes/${id}`),
      axios.get(`${API_URL}/quizzes/${id}/progress`).catch(() => ({ data: null })),
    ]).then(([quizRes, progressRes]) => {
      const q = quizRes.data;
      const a = progressRes.data;
      setQuiz(q);
      setShuffledQuestions(shuffleOptions(q.questions));
      setTimeLeft(q.duration * 60);
      setPrevAttempt(a);

      if (a?.status === 'in_progress') {
        // Quiz en cours → proposer de reprendre
        setResumeModal(true);
      } else if (a?.status === 'completed') {
        // Quiz terminé → proposer de voir les erreurs ou recommencer
        setErrorsModal(true);
      } else {
        // Pas d'attempt → démarrer directement
        setReady(true);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  /* ── Reprendre là où on s'était arrêté ────────────────────────────── */
  const handleResume = () => {
    if (!prevAttempt) return;
    setCurrent(prevAttempt.currentQuestion);
    setScore(prevAttempt.score);
    setAnswers(prevAttempt.answers || []);
    setResumeModal(false);
    setReady(true);
  };

  /* ── Recommencer depuis zéro ───────────────────────────────────────── */
  const handleRestart = () => {
    setCurrent(0); setScore(0); setAnswers([]);
    setSelected(null); setAnswered(false);
    setTimeLeft(quiz.duration * 60);
    setShuffledQuestions(shuffleOptions(quiz.questions)); // nouveau mélange à chaque recommencement
    setResumeModal(false);
    setErrorsModal(false);
    setReady(true);
  };

  /* ── Sauvegarde après chaque réponse ──────────────────────────────── */
  const saveProgress = useCallback(async (nextIndex, newScore, newAnswers) => {
    try {
      await axios.put(`${API_URL}/quizzes/${id}/progress`, {
        currentQuestion: nextIndex,
        score:           newScore,
        answers:         newAnswers,
      });
    } catch {}
  }, [id]);

  /* ── Terminer le quiz ──────────────────────────────────────────────── */
  const finish = useCallback(async (finalScore, finalAnswers) => {
    setDone(true);
    try {
      await axios.post(`${API_URL}/quizzes/${id}/attempt`, {
        score:   finalScore,
        answers: finalAnswers,
      });
    } catch {}
  }, [id]);

  /* ── Timer ─────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!quiz || done || timeLeft === null || !ready) return;
    if (timeLeft <= 0) { finish(score, answers); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quiz, done, score, answers, finish, ready]);

  /* ── Réponse sélectionnée ──────────────────────────────────────────── */
  const handleAnswer = (optIdx) => {
    if (answered || !quiz) return;
    const q         = shuffledQuestions[current] || quiz.questions[current];
    const isCorrect = q.options[optIdx].isCorrect;
    const correctOpt = q.options.find(o => o.isCorrect);
    const newScore  = isCorrect ? score + 1 : score;
    const newAnswers = [...answers, {
      questionIndex: current,
      questionText:  q.text,
      selectedText:  q.options[optIdx].text,
      correctText:   correctOpt?.text || '',
      isCorrect,
    }];
    setSelected(optIdx);
    setAnswered(true);
    setScore(newScore);
    setAnswers(newAnswers);

    // Sauvegarde silencieuse
    const nextIndex = current + 1 >= quiz.questions.length ? current : current + 1;
    saveProgress(nextIndex, newScore, newAnswers);
  };

  /* ── Question suivante ─────────────────────────────────────────────── */
  const handleNext = () => {
    if (current + 1 >= quiz.questions.length) {
      finish(score, answers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  /* ── Chargement ────────────────────────────────────────────────────── */
  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"/>
      </div>
    </DashboardLayout>
  );

  if (!quiz) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center text-blue-400">Quiz introuvable</div>
    </DashboardLayout>
  );

  const q        = shuffledQuestions[current] || quiz.questions[current];
  const total    = quiz.questions.length;
  const progress = ((current + (answered ? 1 : 0)) / total) * 100;
  const mins     = Math.floor(timeLeft / 60);
  const secs     = timeLeft % 60;

  /* ── Modal : reprendre ou recommencer ─────────────────────────────── */
  if (resumeModal && prevAttempt) {
    const resumePct = Math.round((prevAttempt.currentQuestion / total) * 100);
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="w-full max-w-md mx-auto my-auto">
            <div className="bg-white rounded-3xl p-7 border border-blue-100 shadow-xl text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 mx-auto mb-4 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              </div>
              <h2 className="text-lg font-bold text-blue-900 mb-1">Quiz en cours</h2>
              <p className="text-sm text-blue-400 mb-5">Tu avais commencé ce quiz et tu t'es arrêté à la question {prevAttempt.currentQuestion + 1}/{total}.</p>

              {/* Barre de progression */}
              <div className="w-full h-2 bg-blue-100 rounded-full mb-1 overflow-hidden">
                <div className="h-2 bg-amber-400 rounded-full transition-all" style={{ width: `${resumePct}%` }}/>
              </div>
              <p className="text-xs text-blue-400 mb-6">{resumePct}% complété</p>

              <div className="flex flex-col gap-3">
                <button onClick={handleResume}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                  ▶ Reprendre où je me suis arrêté
                </button>
                <button onClick={handleRestart}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  Recommencer depuis le début
                </button>
                <button onClick={() => navigate('/dashboard/quiz')}
                  className="text-xs text-blue-300 hover:text-blue-500 transition pt-1">
                  ← Retour aux quiz
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Modal : quiz déjà terminé — voir les erreurs ou refaire ──────── */
  if (errorsModal && prevAttempt) {
    const pct     = Math.round((prevAttempt.score / total) * 100);
    const passed  = pct >= 60;
    const wrongs  = (prevAttempt.answers || []).filter(a => !a.isCorrect);
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 overflow-y-auto flex flex-col">
          <div className="w-full max-w-lg mx-auto my-auto">
            <div className="bg-white rounded-3xl p-7 border border-blue-100 shadow-xl">
              {/* En-tête score */}
              <div className="text-center mb-5">
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={passed ? '#16a34a' : '#dc2626'} strokeWidth="2.5" strokeLinecap="round">
                    {passed ? <polyline points="20 6 9 17 4 12"/> : <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>}
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-blue-900">Dernier résultat</h2>
                <p className={`text-3xl font-bold mt-1 ${passed ? 'text-green-500' : 'text-red-500'}`}>{pct}%</p>
                <p className="text-sm text-blue-400">{prevAttempt.score}/{total} questions correctes</p>
              </div>

              {/* Erreurs de la session précédente */}
              {wrongs.length > 0 ? (
                <div className="mb-5">
                  <p className="text-xs font-bold text-blue-900 mb-3 uppercase tracking-wide">
                    Tes {wrongs.length} erreur{wrongs.length > 1 ? 's' : ''} de la dernière session :
                  </p>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {wrongs.map((w, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3">
                        <p className="text-xs font-semibold text-red-800 mb-1.5">{w.questionText}</p>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-red-500 flex items-start gap-1.5">
                            <span className="font-bold flex-shrink-0">✗</span>
                            <span>Ta réponse : {w.selectedText}</span>
                          </p>
                          <p className="text-xs text-green-700 flex items-start gap-1.5">
                            <span className="font-bold flex-shrink-0">✓</span>
                            <span>Bonne réponse : {w.correctText}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-4 text-center mb-5">
                  <p className="text-sm font-semibold text-green-700">Aucune erreur lors de ta dernière session !</p>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <button onClick={handleRestart}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                  Refaire ce quiz
                </button>
                <button onClick={() => navigate('/dashboard/quiz')}
                  className="w-full py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  ← Retour aux quiz
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Résultat final ────────────────────────────────────────────────── */
  if (done) {
    const pct          = Math.round((score / total) * 100);
    const wrong        = total - score;
    const passed       = pct >= 60;
    const emoji        = pct >= 80 ? '' : pct >= 60 ? '' : '';
    const title        = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : "Continue à t'entraîner !";
    const wrongAnswers = answers.filter(a => !a.isCorrect);
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
          <div className="w-full max-w-lg mx-auto my-auto">
            <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100 text-center">

              {/* Emoji */}
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-orange-100'}`}>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">{title}</h2>
              <p className="text-sm text-blue-400 mb-6">Quiz terminé</p>

              {/* Stats correct / total / erreurs */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="text-center">
                  <span className="text-4xl font-bold text-green-500">{score}</span>
                  <p className="text-xs text-green-400 mt-1">✓ Correct</p>
                </div>
                <div className="text-3xl text-blue-200">/</div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-blue-600">{total}</span>
                  <p className="text-xs text-blue-400 mt-1">Total</p>
                </div>
                <div className="text-3xl text-blue-200">/</div>
                <div className="text-center">
                  <span className="text-4xl font-bold text-red-400">{wrong}</span>
                  <p className="text-xs text-red-300 mt-1">✗ Erreurs</p>
                </div>
              </div>

              {/* Pourcentage */}
              <div className={`text-2xl font-bold mb-6 ${passed ? 'text-green-500' : 'text-orange-500'}`}>{pct}%</div>

              {/* Barre animée */}
              <div className="w-full h-3 bg-blue-100 rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-3 rounded-full ${passed ? 'bg-green-400' : 'bg-orange-400'}`}
                />
              </div>

              {/* Questions ratées */}
              {wrongAnswers.length > 0 ? (
                <div className="text-left mb-6">
                  <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">
                    {wrongAnswers.length} question{wrongAnswers.length > 1 ? 's' : ''} à retravailler :
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {wrongAnswers.map((a, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 text-left">
                        <p className="text-xs font-semibold text-red-800 mb-1">{a.questionText}</p>
                        <p className="text-xs text-red-500 flex items-start gap-1">
                          <span className="font-bold flex-shrink-0">✗</span> Ta réponse : {a.selectedText}
                        </p>
                        <p className="text-xs text-green-700 flex items-start gap-1 mt-0.5">
                          <span className="font-bold flex-shrink-0">✓</span> Bonne réponse : {a.correctText}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 rounded-xl p-4 text-center mb-6">
                  <p className="text-sm font-semibold text-green-700">Aucune erreur, parfait !</p>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => navigate('/dashboard/quiz')}
                  className="flex-1 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  Retour aux quiz
                </button>
                <button onClick={() => {
                  setCurrent(0); setSelected(null); setAnswered(false);
                  setScore(0); setDone(false); setAnswers([]);
                  setTimeLeft(quiz.duration * 60);
                  setShuffledQuestions(shuffleOptions(quiz.questions));
                  setReady(true);
                }}
                  className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Quiz en cours ─────────────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
        <div className="w-full max-w-xl mx-auto my-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-blue-400">{quiz.title}</p>
              <p className="text-sm font-semibold text-blue-900">Question {current + 1} / {total}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-mono font-semibold ${timeLeft < 30 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>
              <button onClick={() => setConfirmExit(true)} title="Quitter"
                className="text-blue-300 hover:text-blue-500 transition-colors p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full h-1.5 bg-blue-100 rounded-full mb-6 overflow-hidden">
            <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}/>
          </div>

          {/* Carte question */}
          <div className="bg-white rounded-3xl p-7 border border-blue-100 shadow-xl shadow-blue-100">
            <p className="text-base font-semibold text-blue-900 mb-6 leading-relaxed">{q.text}</p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let cls = 'border border-blue-100 bg-blue-50/50 text-blue-700 hover:border-blue-300 hover:bg-blue-50';
                if (answered) {
                  if (opt.isCorrect) cls = 'border-2 border-green-400 bg-green-50 text-green-800';
                  else if (i === selected && !opt.isCorrect) cls = 'border-2 border-red-400 bg-red-50 text-red-700';
                  else cls = 'border border-blue-100 bg-blue-50/30 text-blue-400 opacity-60';
                } else if (selected === i) {
                  cls = 'border-2 border-blue-500 bg-blue-50 text-blue-800';
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}>
                    <span className="text-xs opacity-50 mr-2">{String.fromCharCode(65 + i)}.</span>
                    {opt.text}
                  </button>
                );
              })}
            </div>

            {answered && q.explanation && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-1">Explication</p>
                <p className="text-xs text-blue-600 leading-relaxed">{q.explanation}</p>
              </div>
            )}

            {answered && (
              <button onClick={handleNext}
                className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition">
                {current + 1 >= total ? 'Voir les résultats' : 'Question suivante →'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modale confirmation quitter — la progression est sauvegardée */}
      {confirmExit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 mx-auto mb-4 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </div>
            <h3 className="text-base font-bold text-blue-900 mb-1">Quitter le quiz ?</h3>
            <p className="text-xs text-blue-400 mb-1">Ta progression est <strong className="text-blue-600">automatiquement sauvegardée</strong>.</p>
            <p className="text-xs text-blue-300 mb-5">Tu pourras reprendre à la question {current + 1} la prochaine fois.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmExit(false)}
                className="flex-1 py-2.5 border border-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                Continuer
              </button>
              <button onClick={() => navigate('/dashboard/quiz')}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
