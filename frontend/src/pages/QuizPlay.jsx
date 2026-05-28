import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [confirmExit, setConfirmExit] = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/${id}`).then(r => {
      setQuiz(r.data);
      setTimeLeft(r.data.duration * 60);
    }).finally(() => setLoading(false));
  }, [id]);

  const finish = useCallback(async (finalScore) => {
    setDone(true);
    try {
      await axios.post(`${API_URL}/quizzes/${id}/attempt`, { score: finalScore });
    } catch {}
  }, [id]);

  useEffect(() => {
    if (!quiz || done || timeLeft === null) return;
    if (timeLeft <= 0) { finish(score); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quiz, done, score, finish]);

  if (loading) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!quiz) return (
    <DashboardLayout>
      <div className="flex-1 flex items-center justify-center text-blue-400">Quiz introuvable</div>
    </DashboardLayout>
  );

  const q = quiz.questions[current];
  const total = quiz.questions.length;
  const progress = ((current + (answered ? 1 : 0)) / total) * 100;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  const handleAnswer = (optIdx) => {
    if (answered) return;
    const isCorrect = q.options[optIdx].isCorrect;
    const newScore = isCorrect ? score + 1 : score;
    setSelected(optIdx);
    setAnswered(true);
    setScore(newScore);
    setAnswers([...answers, { question: q.text, selected: q.options[optIdx].text, correct: isCorrect }]);
  };

  const handleNext = () => {
    if (current + 1 >= total) {
      finish(score);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    const passed = pct >= 60;
    return (
      <DashboardLayout>
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto flex flex-col">
          <div className="w-full max-w-lg mx-auto my-auto">
            <div className="bg-white rounded-3xl p-8 border border-blue-100 shadow-xl shadow-blue-100 text-center">
              <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${passed ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={passed ? '#16a34a' : '#dc2626'} strokeWidth="2" strokeLinecap="round">
                  {passed
                    ? <><polyline points="20 6 9 17 4 12"/></>
                    : <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>
                  }
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">
                {passed ? 'Félicitations !' : 'Continue à t\'entraîner !'}
              </h2>
              <p className="text-sm text-blue-400 mb-6">Quiz terminé</p>

              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-blue-600">{score}</span>
                <span className="text-2xl text-blue-300">/ {total}</span>
              </div>
              <div className={`text-2xl font-bold mb-6 ${passed ? 'text-green-500' : 'text-red-500'}`}>{pct}%</div>

              <div className="w-full h-3 bg-blue-100 rounded-full mb-6 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-1000 ${passed ? 'bg-green-400' : 'bg-red-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Answer review */}
              <div className="text-left space-y-2 mb-6 max-h-48 overflow-auto">
                {answers.map((a, i) => (
                  <div key={i} className={`text-xs p-3 rounded-xl flex items-start gap-2 ${a.correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    <span className="font-bold flex-shrink-0">{a.correct ? '✓' : '✗'}</span>
                    <span>{a.question}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => navigate('/dashboard/quiz')} className="flex-1 py-2.5 border border-blue-200 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition">
                  Retour aux quiz
                </button>
                <button onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); setAnswers([]); setTimeLeft(quiz.duration * 60); }} className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition">
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        </main>
      </DashboardLayout>
    );
  }

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
              {/* Bouton quitter — discret */}
              <button
                onClick={() => setConfirmExit(true)}
                title="Quitter le quiz"
                className="text-blue-300 hover:text-blue-500 transition-colors p-1"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full h-1.5 bg-blue-100 rounded-full mb-6 overflow-hidden">
            <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          {/* Question card */}
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
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${cls} ${!answered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
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
              <button
                onClick={handleNext}
                className="w-full mt-4 py-3 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition"
              >
                {current + 1 >= total ? 'Voir les résultats' : 'Question suivante →'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modale confirmation quitter */}
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
            <h3 className="text-base font-bold text-blue-900 mb-1">Quitter le quiz ?</h3>
            <p className="text-xs text-blue-400 mb-5">Ta progression en cours sera perdue.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmExit(false)}
                className="flex-1 py-2.5 border border-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50 transition"
              >
                Continuer
              </button>
              <button
                onClick={() => navigate('/dashboard/quiz')}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition"
              >
                Quitter
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
