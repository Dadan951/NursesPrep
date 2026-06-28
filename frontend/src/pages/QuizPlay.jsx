/**
 * QuizPlay — Clay 3D redesign
 * - Design cohérent avec Quiz.jsx / Dashboard.jsx
 * - Auto-scroll vers l'explication + bouton suivant après réponse
 * - Toute la logique de jeu est intacte (shuffle, timer, save, resume…)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:     '#EEF2FF',
  card:   '#FFFFFF',
  text:   '#1e1b4b',
  muted:  '#6b7280',
  border: '#e0e7ff',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  green:  '#10B981',
  red:    '#DC2626',
  amber:  '#F59E0B',
};

const clay = {
  card: `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 0 rgba(0,0,0,0.06), 0 12px 28px rgba(79,70,229,0.08), 0 24px 48px rgba(0,0,0,0.04)`,
  sm:   `inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07)`,
  btn:  (hex, dark) => `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 ${dark}, 0 14px 28px ${hex}55`,
};

/* ─── Option state config ────────────────────────────────────────────────── */
const OPT = {
  idle:    { bg:'#fff',     border:C.border,  text:C.text,     badgeBg:'#e0e7ff', badgeColor:C.indigo,   shadow:clay.sm },
  correct: { bg:'#f0fdf4',  border:'#86efac', text:'#14532d',  badgeBg:'#bbf7d0', badgeColor:'#15803d',  shadow:`inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 #15803d44, 0 8px 16px #10b98133` },
  wrong:   { bg:'#fef2f2',  border:'#fca5a5', text:'#7f1d1d',  badgeBg:'#fecaca', badgeColor:'#991b1b',  shadow:`inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 #ef444444, 0 8px 16px #dc262633` },
  dimmed:  { bg:'#f8fafc',  border:'#e2e8f0', text:'#94a3b8',  badgeBg:'#f1f5f9', badgeColor:'#cbd5e1',  shadow:'none' },
  missed:  { bg:'#f0fdf4',  border:'#86efac', text:'#166534',  badgeBg:'#bbf7d0', badgeColor:'#15803d',  shadow:`inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 #15803d44, 0 8px 16px #10b98133` },
};

/* ─── Fisher-Yates ───────────────────────────────────────────────────────── */
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

/* ─── Option button ──────────────────────────────────────────────────────── */
function OptionBtn({ opt, idx, answered, selected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const letter = String.fromCharCode(65 + idx);

  let st;
  if (!answered) {
    st = OPT.idle;
  } else if (opt.isCorrect) {
    st = OPT.correct;
  } else if (idx === selected) {
    st = OPT.wrong;
  } else {
    st = OPT.dimmed;
  }

  const isActive = hovered && !answered;

  return (
    <motion.button
      onClick={() => onClick(idx)}
      disabled={answered}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      animate={{ scale: isActive ? 1.015 : 1 }}
      whileTap={{ scale: answered ? 1 : 0.98 }}
      transition={{ type:'spring', stiffness:400, damping:28 }}
      style={{
        width:'100%', textAlign:'left', border:`1.5px solid ${isActive ? C.indigo : st.border}`,
        borderRadius:16, padding:'14px 16px', background:isActive ? '#f5f3ff' : st.bg,
        boxShadow:isActive ? `inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 0 ${C.indigo}33, 0 10px 20px ${C.indigo}22` : st.shadow,
        cursor:answered?'default':'pointer', display:'flex', alignItems:'center', gap:12,
        transition:'border-color 0.15s, background 0.15s, box-shadow 0.15s',
      }}
    >
      {/* Letter badge */}
      <div style={{
        width:32, height:32, borderRadius:10, flexShrink:0,
        background:isActive ? C.indigo : st.badgeBg,
        color:isActive ? '#fff' : st.badgeColor,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:12, fontWeight:900, fontFamily:'Nunito,sans-serif',
        transition:'all 0.15s',
      }}>
        {answered && opt.isCorrect
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          : answered && idx === selected && !opt.isCorrect
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : letter
        }
      </div>

      <span style={{ fontSize:14, fontWeight:answered?600:500, color:st.text, lineHeight:1.5, flex:1 }}>
        {opt.text}
      </span>

      {/* Label "Ta réponse" / "Bonne réponse" */}
      {answered && idx === selected && opt.isCorrect && (
        <span style={{ fontSize:10, fontWeight:700, color:'#15803d', background:'#dcfce7', borderRadius:99, padding:'3px 8px', whiteSpace:'nowrap' }}>Ta réponse ✓</span>
      )}
      {answered && idx === selected && !opt.isCorrect && (
        <span style={{ fontSize:10, fontWeight:700, color:'#991b1b', background:'#fee2e2', borderRadius:99, padding:'3px 8px', whiteSpace:'nowrap' }}>Ta réponse</span>
      )}
      {answered && opt.isCorrect && idx !== selected && (
        <span style={{ fontSize:10, fontWeight:700, color:'#15803d', background:'#dcfce7', borderRadius:99, padding:'3px 8px', whiteSpace:'nowrap' }}>Bonne réponse</span>
      )}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════════ */
export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz]                           = useState(null);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [current, setCurrent]                     = useState(0);
  const [selected, setSelected]                   = useState(null);
  const [answered, setAnswered]                   = useState(false);
  const [score, setScore]                         = useState(0);
  const [done, setDone]                           = useState(false);
  const [answers, setAnswers]                     = useState([]);
  const [reviewMode, setReviewMode]               = useState(false);
  const [reviewIdx, setReviewIdx]                 = useState(0);
  const [timeLeft, setTimeLeft]                   = useState(null);
  const [confirmExit, setConfirmExit]             = useState(false);
  const [prevAttempt, setPrevAttempt]             = useState(null);
  const [resumeModal, setResumeModal]             = useState(false);
  const [ready, setReady]                         = useState(false);

  // Ref pour le scroll automatique vers l'explication + bouton suivant
  const feedbackRef = useRef(null);
  const mainRef     = useRef(null);

  /* ── Chargement ─────────────────────────────────────────────────────── */
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
        setResumeModal(true);
      } else if (a?.status === 'completed') {
        const prevAnswers = a.answers || [];
        const matched = prevAnswers.map(ans =>
          q.questions.find(qst => qst.text === ans.questionText) ||
          { text: ans.questionText, options: [], explanation: '' }
        );
        setAnswers(prevAnswers);
        setScore(a.score);
        setShuffledQuestions(matched.length > 0 ? matched : shuffleOptions(q.questions));
        setDone(true);
      } else {
        setReady(true);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const handleResume = () => {
    if (!prevAttempt) return;
    setCurrent(prevAttempt.currentQuestion);
    setScore(prevAttempt.score);
    setAnswers(prevAttempt.answers || []);
    setResumeModal(false);
    setReady(true);
  };

  const handleRestart = () => {
    setCurrent(0); setScore(0); setAnswers([]);
    setSelected(null); setAnswered(false);
    setTimeLeft(quiz.duration * 60);
    setShuffledQuestions(shuffleOptions(quiz.questions));
    setResumeModal(false);
    setReady(true);
  };

  const saveProgress = useCallback(async (nextIndex, newScore, newAnswers) => {
    try {
      await axios.put(`${API_URL}/quizzes/${id}/progress`, { currentQuestion: nextIndex, score: newScore, answers: newAnswers });
    } catch {}
  }, [id]);

  const finish = useCallback(async (finalScore, finalAnswers) => {
    setDone(true);
    try {
      await axios.post(`${API_URL}/quizzes/${id}/attempt`, { score: finalScore, answers: finalAnswers });
    } catch {}
  }, [id]);

  /* ── Timer ──────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!quiz || done || timeLeft === null || !ready) return;
    if (timeLeft <= 0) { finish(score, answers); return; }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, quiz, done, score, answers, finish, ready]);

  /* ── Réponse + auto-scroll ───────────────────────────────────────────── */
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

    const nextIndex = current + 1 >= quiz.questions.length ? current : current + 1;
    saveProgress(nextIndex, newScore, newAnswers);

    // Scroll vers l'explication + bouton suivant après le render
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });
  };

  /* ── Question suivante ───────────────────────────────────────────────── */
  const handleNext = () => {
    if (current + 1 >= quiz.questions.length) {
      finish(score, answers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      // Scroll en haut de la page pour la nouvelle question
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (loading) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <div style={{ width:40, height:40, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </DashboardLayout>
  );

  if (!quiz) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:C.muted, fontSize:14 }}>Quiz introuvable</div>
    </DashboardLayout>
  );

  const q        = shuffledQuestions[current] || quiz.questions[current];
  const total    = quiz.questions.length;
  const progress = ((current + (answered ? 1 : 0)) / total) * 100;
  const mins     = Math.floor(timeLeft / 60);
  const secs     = timeLeft % 60;
  const timerUrgent = timeLeft < 30;

  /* ── Modal reprendre ─────────────────────────────────────────────────── */
  if (resumeModal && prevAttempt) {
    const resumePct = Math.round((prevAttempt.currentQuestion / total) * 100);
    return (
      <DashboardLayout>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }} transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ width:56, height:56, borderRadius:20, background:'#fef9c3', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>Quiz en cours</h2>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:18 }}>
              Tu t'es arrêté à la question <strong style={{ color:C.text }}>{prevAttempt.currentQuestion + 1}/{total}</strong>.
            </p>

            <div style={{ height:10, background:C.border, borderRadius:99, overflow:'hidden', boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)', marginBottom:6 }}>
              <motion.div initial={{ width:0 }} animate={{ width:`${resumePct}%` }} transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
                style={{ height:'100%', borderRadius:99, background:`linear-gradient(90deg,${C.amber},#fbbf24)` }}/>
            </div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:22 }}>{resumePct}% complété</p>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <motion.button onClick={handleResume} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                style={{ width:'100%', padding:'13px 0', borderRadius:16, border:'none', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.indigo,'#312e81') }}>
                ▶ Reprendre où je me suis arrêté
              </motion.button>
              <motion.button onClick={handleRestart} whileTap={{ scale:0.97 }}
                style={{ width:'100%', padding:'11px 0', borderRadius:16, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                Recommencer depuis le début
              </motion.button>
              <button onClick={() => navigate('/dashboard/quiz')}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:C.muted, marginTop:4 }}>
                ← Retour aux quiz
              </button>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Résultats + révision ────────────────────────────────────────────── */
  if (done) {
    const pct      = Math.round((score / total) * 100);
    const wrong    = total - score;
    const passed   = pct >= 60;
    const title    = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : "Continue à t'entraîner !";
    const ringColor = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red;
    const wrongCount = answers.filter(a => !a.isCorrect).length;

    /* Mode révision */
    if (reviewMode) {
      const ans  = answers[reviewIdx];
      const rq   = shuffledQuestions[reviewIdx] || quiz.questions[reviewIdx];
      const isOk = ans?.isCorrect;

      return (
        <DashboardLayout>
          <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
          <main style={{ flex:1, overflowY:'auto', background:C.bg }}>

            {/* Header révision */}
            <div style={{ background:'linear-gradient(135deg,#4338ca,#7C3AED)', padding:'20px 20px 0', position:'sticky', top:0, zIndex:10 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14, maxWidth:640, margin:'0 auto 14px' }}>
                <motion.button onClick={() => setReviewMode(false)} whileTap={{ scale:0.95 }}
                  style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:12, padding:'8px 12px', color:'rgba(255,255,255,0.85)', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                  Résultats
                </motion.button>
                <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'0.08em', textTransform:'uppercase' }}>Mode révision</span>
                <span style={{ fontSize:13, fontWeight:800, color:'#fff', fontFamily:'Nunito,sans-serif' }}>{reviewIdx + 1} / {total}</span>
              </div>

              {/* Indicateurs */}
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', justifyContent:'center', paddingBottom:16, maxWidth:640, margin:'0 auto' }}>
                {answers.map((a, i) => (
                  <motion.button key={i} onClick={() => setReviewIdx(i)} whileTap={{ scale:0.9 }}
                    style={{ width:30, height:30, borderRadius:10, border:'none', cursor:'pointer', fontSize:11, fontWeight:800, fontFamily:'Nunito,sans-serif', transition:'all 0.15s',
                      background: i===reviewIdx ? (a.isCorrect?'#22c55e':'#ef4444') : (a.isCorrect?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'),
                      color: i===reviewIdx ? '#fff' : (a.isCorrect?'#bbf7d0':'#fecaca'),
                      boxShadow: i===reviewIdx ? `0 0 0 2px #fff` : 'none',
                      transform: i===reviewIdx ? 'scale(1.15)' : 'scale(1)',
                    }}>
                    {i + 1}
                  </motion.button>
                ))}
              </div>
            </div>

            <div style={{ maxWidth:640, margin:'0 auto', padding:'20px 16px' }}>
              <AnimatePresence mode="wait">
                <motion.div key={reviewIdx} initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.22 }}>

                  {/* Badge réponse */}
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px', borderRadius:99, marginBottom:14,
                    background:isOk?'#dcfce7':'#fee2e2', color:isOk?'#15803d':'#991b1b', fontSize:12, fontWeight:800, fontFamily:'Nunito,sans-serif' }}>
                    {isOk
                      ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Bonne réponse</>
                      : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Mauvaise réponse</>
                    }
                  </div>

                  {/* Card question */}
                  <div style={{ background:C.card, borderRadius:24, boxShadow:clay.card, border:`1px solid ${C.border}`, padding:'22px 20px', marginBottom:12 }}>
                    <p style={{ fontSize:15, fontWeight:700, color:C.text, fontFamily:'Nunito,sans-serif', lineHeight:1.65, marginBottom:18 }}>{rq?.text}</p>

                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {rq?.options.map((opt, oi) => {
                        const isSel    = opt.text === ans?.selectedText;
                        const isCorr   = opt.isCorrect;
                        let st = OPT.dimmed;
                        if (isCorr) st = OPT.correct;
                        else if (isSel) st = OPT.wrong;
                        return (
                          <div key={oi} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:14, background:st.bg, border:`1.5px solid ${st.border}`, boxShadow:st.shadow }}>
                            <div style={{ width:30, height:30, borderRadius:9, flexShrink:0, background:st.badgeBg, color:st.badgeColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:900, fontFamily:'Nunito,sans-serif' }}>
                              {isCorr
                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                : isSel
                                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                : String.fromCharCode(65 + oi)
                              }
                            </div>
                            <span style={{ fontSize:13, fontWeight:500, color:st.text, flex:1, lineHeight:1.5 }}>{opt.text}</span>
                            {isSel && isCorr && <span style={{ fontSize:10, fontWeight:700, color:'#15803d', background:'#dcfce7', borderRadius:99, padding:'2px 8px', whiteSpace:'nowrap' }}>Ta réponse ✓</span>}
                            {isSel && !isCorr && <span style={{ fontSize:10, fontWeight:700, color:'#991b1b', background:'#fee2e2', borderRadius:99, padding:'2px 8px', whiteSpace:'nowrap' }}>Ta réponse</span>}
                            {isCorr && !isSel && <span style={{ fontSize:10, fontWeight:700, color:'#15803d', background:'#dcfce7', borderRadius:99, padding:'2px 8px', whiteSpace:'nowrap' }}>Bonne réponse</span>}
                          </div>
                        );
                      })}
                    </div>

                    {rq?.explanation && (
                      <div style={{ marginTop:16, padding:'14px 16px', background:'#f0f5ff', borderRadius:16, border:`1px solid #c7d2fe` }}>
                        <p style={{ fontSize:12, fontWeight:800, color:C.indigo, marginBottom:4, display:'flex', alignItems:'center', gap:6, fontFamily:'Nunito,sans-serif' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Explication
                        </p>
                        <p style={{ fontSize:13, color:'#3730a3', lineHeight:1.7 }}>{rq.explanation}</p>
                      </div>
                    )}
                  </div>

                  {/* Navigation révision */}
                  <div style={{ display:'flex', gap:10 }}>
                    <motion.button onClick={() => setReviewIdx(i => Math.max(0, i - 1))} disabled={reviewIdx===0} whileTap={{ scale:0.96 }}
                      style={{ flex:1, padding:'12px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:reviewIdx===0?'not-allowed':'pointer', opacity:reviewIdx===0?0.4:1, boxShadow:clay.sm }}>
                      ← Précédent
                    </motion.button>
                    {reviewIdx < total - 1
                      ? <motion.button onClick={() => setReviewIdx(i => i + 1)} whileTap={{ scale:0.96 }} whileHover={{ scale:1.01 }}
                          style={{ flex:1, padding:'12px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.indigo,'#312e81') }}>
                          Suivant →
                        </motion.button>
                      : <motion.button onClick={() => setReviewMode(false)} whileTap={{ scale:0.96 }} whileHover={{ scale:1.01 }}
                          style={{ flex:1, padding:'12px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.indigo,'#312e81') }}>
                          Terminer la révision
                        </motion.button>
                    }
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </DashboardLayout>
      );
    }

    /* Écran résultats */
    return (
      <DashboardLayout>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, y:20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }} transition={{ type:'spring', stiffness:260, damping:22 }}
            style={{ background:C.card, borderRadius:32, padding:'28px 24px', width:'100%', maxWidth:420, boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}>

            {/* Score ring */}
            <div style={{ position:'relative', width:120, height:120, margin:'0 auto 18px' }}>
              <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={C.border} strokeWidth="9"/>
                <motion.circle cx="60" cy="60" r="50" fill="none"
                  stroke={ringColor} strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*50}`}
                  initial={{ strokeDashoffset: 2*Math.PI*50 }}
                  animate={{ strokeDashoffset: 2*Math.PI*50*(1-pct/100) }}
                  transition={{ duration:1.3, delay:0.2, ease:[0.16,1,0.3,1] }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:26, fontWeight:900, color:ringColor, fontFamily:'Nunito,sans-serif' }}>{pct}%</span>
                <span style={{ fontSize:10, color:C.muted, marginTop:1 }}>{passed?'Réussi':'Échoué'}</span>
              </div>
            </div>

            <h2 style={{ fontSize:20, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:4 }}>{title}</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{quiz.title}</p>

            {/* Stats row */}
            <div style={{ display:'flex', justifyContent:'center', gap:0, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'16px 0', marginBottom:18 }}>
              {[{ n:score, l:'Correctes', c:'#15803d', bg:'#f0fdf4' }, { n:wrong, l:'Erreurs', c:C.red, bg:'#fef2f2' }, { n:total, l:'Questions', c:C.text, bg:C.bg }].map((s,i) => (
                <div key={i} style={{ flex:1, textAlign:'center', borderRight: i<2?`1px solid ${C.border}`:'none' }}>
                  <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Nunito,sans-serif', lineHeight:1 }}>{s.n}</p>
                  <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Indicateurs minidots */}
            <div style={{ display:'flex', gap:4, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
              {answers.map((a, i) => (
                <div key={i} style={{ width:20, height:6, borderRadius:99, background:a.isCorrect?C.green:C.red }}/>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {wrongCount > 0 && (
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                  onClick={() => { setReviewIdx(answers.findIndex(a => !a.isCorrect)); setReviewMode(true); }}
                  style={{ width:'100%', padding:'13px 0', borderRadius:16, border:'none', background:`linear-gradient(135deg,#dc2626,#ea580c)`, color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.red,'#7f1d1d'), display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Réviser mes {wrongCount} erreur{wrongCount>1?'s':''}
                </motion.button>
              )}
              <motion.button whileTap={{ scale:0.96 }}
                onClick={() => { setReviewIdx(0); setReviewMode(true); }}
                style={{ width:'100%', padding:'11px 0', borderRadius:16, border:`1.5px solid ${C.border}`, background:C.bg, color:C.indigo, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>
                Revoir toutes les questions
              </motion.button>
              <div style={{ display:'flex', gap:10 }}>
                <motion.button onClick={() => navigate('/dashboard/quiz')} whileTap={{ scale:0.96 }}
                  style={{ flex:1, padding:'11px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                  ← Retour
                </motion.button>
                <motion.button whileTap={{ scale:0.96 }} whileHover={{ scale:1.01 }}
                  onClick={() => { setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setDone(false); setAnswers([]); setReviewMode(false); setTimeLeft(quiz.duration*60); setShuffledQuestions(shuffleOptions(quiz.questions)); setReady(true); }}
                  style={{ flex:1, padding:'11px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,#1e293b,#334155)`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.btn('#334155','#0f172a') }}>
                  Recommencer
                </motion.button>
              </div>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── QUIZ EN COURS ──────────────────────────────────────────────────── */
  return (
    <DashboardLayout>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes urgent { 0%,100%{background:#fee2e2} 50%{background:#fecaca} }
      `}</style>

      <main ref={mainRef} style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── Sticky header ──────────────────────────────────────────── */}
        <div style={{ position:'sticky', top:0, zIndex:20, background:'linear-gradient(135deg,#4338ca,#7C3AED)', padding:'14px 16px 0' }}>
          <div style={{ maxWidth:600, margin:'0 auto' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>

              {/* Left: title + counter */}
              <div>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginBottom:2, letterSpacing:'0.05em' }}>{quiz.title}</p>
                <p style={{ fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Nunito,sans-serif' }}>
                  Question {current + 1} <span style={{ fontWeight:500, opacity:0.6 }}>/ {total}</span>
                </p>
              </div>

              {/* Right: timer + quit */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:12,
                  background:timerUrgent?'rgba(239,68,68,0.25)':'rgba(255,255,255,0.15)',
                  border:`1px solid ${timerUrgent?'rgba(239,68,68,0.5)':'rgba(255,255,255,0.2)'}`,
                  animation:timerUrgent?'urgent 0.8s ease-in-out infinite':'none',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={timerUrgent?'#fca5a5':'rgba(255,255,255,0.8)'} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span style={{ fontSize:13, fontWeight:800, fontFamily:'Nunito,sans-serif', fontVariantNumeric:'tabular-nums', color:timerUrgent?'#fca5a5':'#fff' }}>
                    {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
                  </span>
                </div>
                <motion.button onClick={() => setConfirmExit(true)} whileTap={{ scale:0.9 }}
                  style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,0.15)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.7)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </motion.button>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height:6, background:'rgba(255,255,255,0.2)', borderRadius:99, overflow:'hidden', marginBottom:0 }}>
              <motion.div
                animate={{ width:`${progress}%` }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
                style={{ height:'100%', borderRadius:99, background:'rgba(255,255,255,0.9)' }}
              />
            </div>

            {/* Question dots */}
            <div style={{ display:'flex', gap:3, justifyContent:'center', padding:'10px 0 14px' }}>
              {Array.from({ length:total }).map((_, i) => {
                const isPast    = i < current;
                const isCurrent = i === current;
                const wasRight  = isPast && answers[i]?.isCorrect;
                return (
                  <div key={i} style={{ width:isCurrent?20:6, height:6, borderRadius:99, transition:'all 0.3s ease',
                    background: isCurrent ? 'rgba(255,255,255,0.95)' : isPast ? (wasRight?'rgba(34,197,94,0.8)':'rgba(239,68,68,0.7)') : 'rgba(255,255,255,0.25)',
                  }}/>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        <div style={{ maxWidth:600, margin:'0 auto', padding:'20px 16px 32px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={current}
              initial={{ opacity:0, x:32, scale:0.97 }} animate={{ opacity:1, x:0, scale:1 }} exit={{ opacity:0, x:-32, scale:0.97 }}
              transition={{ type:'spring', stiffness:350, damping:30 }}>

              {/* Question card */}
              <div style={{ background:C.card, borderRadius:24, boxShadow:clay.card, border:`1px solid ${C.border}`, padding:'22px 20px 20px', marginBottom:14 }}>
                <p style={{ fontSize:16, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif', lineHeight:1.65, marginBottom:20 }}>{q.text}</p>

                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {q.options.map((opt, i) => (
                    <OptionBtn key={i} opt={opt} idx={i} answered={answered} selected={selected} onClick={handleAnswer}/>
                  ))}
                </div>
              </div>

              {/* ── Feedback (explication + bouton suivant) — ref pour scroll ── */}
              <AnimatePresence>
                {answered && (
                  <motion.div ref={feedbackRef}
                    initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    transition={{ type:'spring', stiffness:320, damping:28 }}>

                    {/* Explication */}
                    {q.explanation && (
                      <div style={{ background:C.card, borderRadius:20, boxShadow:clay.card, border:`1px solid ${C.border}`, padding:'18px 20px', marginBottom:12, borderLeft:`4px solid ${C.indigo}` }}>
                        <p style={{ fontSize:12, fontWeight:800, color:C.indigo, marginBottom:8, display:'flex', alignItems:'center', gap:6, fontFamily:'Nunito,sans-serif' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                          Explication
                        </p>
                        <p style={{ fontSize:14, color:C.text, lineHeight:1.75 }}>{q.explanation}</p>
                      </div>
                    )}

                    {/* Bouton Question suivante */}
                    <motion.button onClick={handleNext} whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                      style={{ width:'100%', padding:'16px 0', borderRadius:18, border:'none', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, color:'#fff', fontSize:15, fontWeight:900, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.indigo,'#312e81'), display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                      {current + 1 >= total
                        ? <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Voir les résultats</>
                        : <>Question suivante <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg></>
                      }
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modal Quitter ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div key="exit-backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setConfirmExit(false)}
            style={{ position:'fixed', inset:0, background:'rgba(30,27,75,0.5)', backdropFilter:'blur(8px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <motion.div key="exit-modal" initial={{ opacity:0, scale:0.9, y:16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background:C.card, borderRadius:28, padding:'24px 22px', width:'100%', maxWidth:340, boxShadow:clay.card, textAlign:'center' }}>
              <div style={{ width:48, height:48, borderRadius:16, background:'#e0e7ff', margin:'0 auto 14px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <h3 style={{ fontSize:16, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>Quitter le quiz ?</h3>
              <p style={{ fontSize:12, color:C.muted, lineHeight:1.65, marginBottom:4 }}>Ta progression est <strong style={{ color:C.text }}>automatiquement sauvegardée</strong>.</p>
              <p style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Tu pourras reprendre à la question {current + 1} la prochaine fois.</p>
              <div style={{ display:'flex', gap:10 }}>
                <motion.button onClick={() => setConfirmExit(false)} whileTap={{ scale:0.96 }}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                  Continuer
                </motion.button>
                <motion.button onClick={() => navigate('/dashboard/quiz')} whileTap={{ scale:0.96 }} whileHover={{ scale:1.01 }}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(C.indigo,'#312e81') }}>
                  Quitter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
