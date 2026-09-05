import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { getCache, setCache } from '../utils/cache';
import { API_URL, useAuth } from '../context/AuthContext';
import { useDisplayMode, SlideLevel, DetailList } from '../components/DetailBrowse';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   'var(--theme-card)',
  text:   'var(--theme-text)',
  border: 'var(--theme-border)',
  indigo: 'var(--theme-primary)',
  violet: 'var(--theme-secondary)',
  sub:    '#64748b',
};
const clay = {
  card: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.10)',
  btn:  (hex, dark) => hex
    ? `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`
    : `0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset`,
};

/* ─── Palettes ───────────────────────────────────────────────────────────────── */
const EX_PALETTE = [
  { from:'#4F46E5', to:'#7C3AED', dark:'#3730a3' },
  { from:'#0891b2', to:'#4F46E5', dark:'#0e7490' },
  { from:'#ea580c', to:'#d97706', dark:'#9a3412' },
  { from:'#059669', to:'#0891b2', dark:'#047857' },
  { from:'#dc2626', to:'#db2777', dark:'#991b1b' },
  { from:'#0f766e', to:'#0891b2', dark:'#134e4a' },
];

const TYPE_CFG = {
  case_study: {
    label:'Cas clinique',   from:'#c2410c', to:'#ea580c', dark:'#7c2d12',
    light:'#fff7ed', border:'#fed7aa', textColor:'#9a3412', headerText:'Situation clinique',
  },
  qcm: {
    label:'QCM',            from:'#6d28d9', to:'#7c3aed', dark:'#4c1d95',
    light:'#f5f3ff', border:'#ddd6fe', textColor:'#5b21b6', headerText:'Question',
  },
  open: {
    label:'Question ouverte', from:'#1d4ed8', to:'#0891b2', dark:'#1e40af',
    light:'#eff6ff', border:'#bfdbfe', textColor:'#1e40af', headerText:'Question ouverte',
  },
};

/* ─── Correction automatique par mots-clés (sans API) ────────────────────────── */
const FR_STOPWORDS = new Set([
  'le','la','les','de','des','du','un','une','et','ou','est','sont','dans','pour','avec','sur','par',
  'ce','cet','cette','ces','son','sa','ses','qui','que','quoi','quel','quelle','quels','quelles','au','aux',
  'en','se','ne','pas','plus','moins','tout','tous','toute','toutes','on','il','elle','ils','elles','nous',
  'vous','je','tu','être','avoir','fait','faire','peut','peuvent','doit','doivent','permet','permettent',
  'entre','sans','très','ainsi','donc','car','soit','été','comme','leur','leurs','même','mêmes','aussi',
  'alors','lorsque','lors','afin','chez','vers','sous','deux','trois','autre','autres','ceci','cela','celui',
  'celle','ceux','dont','où','si','mais','or','ni','ont','avez','avons','sera','seront','était','étaient',
]);

/* Minuscule, sans accents, sans ponctuation */
function normalizeWords(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/* Termes significatifs d'un texte (mots > 3 lettres, hors mots vides, dédupliqués) */
function extractKeywords(text, max = 999) {
  const seen = new Set();
  const out = [];
  for (const w of normalizeWords(text)) {
    if (w.length > 3 && !FR_STOPWORDS.has(w) && !seen.has(w)) { seen.add(w); out.push(w); }
    if (out.length >= max) break;
  }
  return out;
}

/* Découpe une correction "1. ... 2. ... 3. ..." en points distincts */
function splitIntoPoints(text) {
  const lines = (text || '').split('\n').filter(l => l.trim());
  const points = [];
  let current = '';
  for (const line of lines) {
    const m = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
    if (m) { if (current) points.push(current); current = m[2]; }
    else if (current) current += ' ' + line.trim();
    else current = line.trim();
  }
  if (current) points.push(current);
  return points;
}

/* Compare la réponse rédigée à la correction, par mots-clés — sans appel API.
   Si la correction est numérotée (1. 2. 3. ...), on score chaque point séparément
   (un point est "couvert" si sa réponse en reprend une bonne partie des termes clés),
   ce qui reflète mieux une réponse à plusieurs parties qu'un simple sac de mots global. */
function scoreAnswer(userText, correctionText) {
  const userWords = new Set(normalizeWords(userText));
  const points = splitIntoPoints(correctionText);

  if (points.length > 1) {
    let covered = 0, matched = 0, total = 0;
    points.forEach(p => {
      const kws = extractKeywords(p, 12);
      if (kws.length === 0) return;
      const hit = kws.filter(k => userWords.has(k)).length;
      matched += hit; total += kws.length;
      if (hit / kws.length >= 0.3) covered++;
    });
    return { ratio: points.length ? covered / points.length : 0, matched, total, multiPoint:true };
  }

  // Correction en un seul bloc : mots-clés proportionnels à sa longueur
  const cap = Math.min(80, Math.max(15, Math.round(normalizeWords(correctionText).length / 3)));
  const kws = extractKeywords(correctionText, cap);
  if (kws.length === 0) return { ratio:0, matched:0, total:0, multiPoint:false };
  const matched = kws.filter(k => userWords.has(k)).length;
  return { ratio: matched / kws.length, matched, total: kws.length, multiPoint:false };
}

const AUTO_RESULT_CFG = {
  correct:   { label:'Bonne réponse',      color:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0', val:true  },
  partial:   { label:'Réponse partielle',  color:'#d97706', bg:'#fffbeb', border:'#fde68a', val:null  },
  incorrect: { label:'À revoir',           color:'#dc2626', bg:'#fef2f2', border:'#fecaca', val:false },
};

/* ─── Exercise Card ──────────────────────────────────────────────────────────── */
function ExerciseCard({ ex, onComplete, quotaExceeded, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [completed,  setCompleted]  = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [autoResult, setAutoResult] = useState(null); // { key:'correct'|'partial'|'incorrect', matched, total }
  const cfg  = TYPE_CFG[ex.type] || TYPE_CFG.open;

  const handleComplete = async (overrideCorrect) => {
    if (completed || quotaExceeded) return;
    setCompleted(true);
    setShowAnswer(true);
    let isCorrect = null;
    if (ex.type === 'qcm' && selected !== null) isCorrect = !!ex.options[selected]?.isCorrect;
    else if (typeof overrideCorrect === 'boolean') isCorrect = overrideCorrect;
    try { await axios.post(`${API_URL}/exercises/complete`, { exerciseId: ex._id, isCorrect }); } catch {}
    onComplete(isCorrect);
  };

  /* Vérifie automatiquement la réponse écrite par mots-clés (aucun appel API) */
  const handleVerifyOpen = () => {
    const { ratio, matched, total, multiPoint } = scoreAnswer(userAnswer, ex.answer);
    let key = 'incorrect';
    if (total === 0) key = 'partial';
    else if (multiPoint) {
      // ratio = proportion des points de la correction couverts
      if (ratio >= 0.66) key = 'correct';
      else if (ratio > 0) key = 'partial';
    } else {
      // ratio = proportion de mots-clés retrouvés (correction en un seul bloc)
      if (ratio >= 0.45) key = 'correct';
      else if (ratio >= 0.2) key = 'partial';
    }
    setAutoResult({ key, matched, total });
    handleComplete(AUTO_RESULT_CFG[key].val);
  };

  const lines = (ex.content || '').split('\n').filter(l => l.trim());
  const isNumbered = lines.some(l => /^\d+[\.\)]\s/.test(l.trim()));

  return (
    <motion.div
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ delay:index*0.06, duration:0.45, ease:[0.16,1,0.3,1] }}
      style={{ borderRadius:20, overflow:'hidden', background:C.card, boxShadow:clay.card, border:`1.5px solid ${C.border}` }}>

      {/* Colored top band */}
      <div style={{ height:4, background:`linear-gradient(135deg,${cfg.from},${cfg.to})` }}/>

      {/* ── Header ── */}
      <div style={{ background:`linear-gradient(135deg,${cfg.from},${cfg.to})`, padding:'16px 20px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-16, top:-16, width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', right:48, bottom:-16, width:48, height:48, borderRadius:'50%', background:'rgba(0,0,0,0.08)', pointerEvents:'none' }}/>

        {/* Badges */}
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', position:'relative' }}>
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20,
            background:'rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.9)', border:'1px solid rgba(255,255,255,0.25)' }}>
            {cfg.label}
          </span>
          {completed && (
            <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, display:'flex', alignItems:'center', gap:4,
              background:'rgba(74,222,128,0.2)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.3)' }}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
              Complété
            </span>
          )}
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            {ex.category && <span style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.8)' }}>{ex.category}</span>}
            {ex.semester  && <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>{ex.semester}</span>}
          </div>
        </div>

        <h3 style={{ fontSize:14, fontWeight:900, color:'#fff', marginTop:10, lineHeight:1.35, position:'relative' }}>
          {ex.title}
        </h3>
      </div>

      {/* ── Body ── */}
      <div style={{ padding:'18px 20px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Énoncé / situation */}
        <div style={{ borderRadius:16, border:`1.5px solid ${cfg.border}`, padding:'22px 24px', background:cfg.light }}>
          <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:cfg.textColor, marginBottom:12 }}>
            {cfg.headerText}
          </p>
          {isNumbered ? (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {lines.map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                    <span style={{ width:26, height:26, borderRadius:'50%', flexShrink:0, marginTop:2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:900, color:'#fff',
                      background:`linear-gradient(135deg,${cfg.from},${cfg.to})` }}>
                      {match[1]}
                    </span>
                    <p style={{ fontSize:16, color:'#334155', lineHeight:1.85 }}>{match[2]}</p>
                  </div>
                );
                return <p key={i} style={{ fontSize:16, color:'#334155', lineHeight:1.85 }}>{line}</p>;
              })}
            </div>
          ) : (
            <p style={{ fontSize:16, fontWeight:500, color:'#1e293b', lineHeight:1.85, whiteSpace:'pre-line' }}>{ex.content}</p>
          )}
        </div>

        {/* Zone de réponse libre (question ouverte) */}
        {ex.type === 'open' && (
          <div>
            <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:8 }}>
              Votre réponse
            </p>
            <textarea
              value={userAnswer}
              onChange={e => setUserAnswer(e.target.value)}
              disabled={completed}
              placeholder="Rédigez votre réponse ici…"
              rows={6}
              style={{ width:'100%', borderRadius:14, border:`1.5px solid ${C.border}`, padding:'14px 16px', fontSize:15, lineHeight:1.7,
                fontFamily:'inherit', color:C.text, background: completed ? C.bg : '#fff', resize:'vertical', boxShadow:clay.sm }}
            />
          </div>
        )}

        {/* QCM Options */}
        {ex.type === 'qcm' && ex.options?.length > 0 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ex.options.map((opt, i) => {
              let st = { background:'#fff', border:`1.5px solid ${C.border}`, color:C.text, cursor:'pointer', boxShadow:clay.sm };
              let dotSt = { background:C.border, color:C.sub };
              let icon = null;

              if (showAnswer) {
                if (opt.isCorrect) {
                  st = { background:'#f0fdf4', border:'2px solid #4ade80', color:'#166534', cursor:'default', boxShadow:'none' };
                  icon = <span style={{ width:16, height:16, borderRadius:'50%', background:'#22c55e', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>;
                } else if (selected === i) {
                  st = { background:'#fef2f2', border:'2px solid #f87171', color:'#991b1b', textDecoration:'line-through', opacity:0.8, cursor:'default', boxShadow:'none' };
                  icon = <span style={{ width:16, height:16, borderRadius:'50%', background:'#f87171', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </span>;
                } else {
                  st = { background:C.bg, border:`1px solid ${C.border}`, color:C.sub, opacity:0.6, cursor:'default', boxShadow:'none' };
                  dotSt = { background:C.border, color:C.sub };
                  icon = <span style={{ width:16, height:16, borderRadius:'50%', background:C.border, color:C.sub, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </span>;
                }
              }

              return (
                <motion.button key={i}
                  disabled={showAnswer}
                  onClick={() => !showAnswer && setSelected(i)}
                  whileHover={!showAnswer ? { y:-2, boxShadow:clay.card } : {}}
                  whileTap={!showAnswer ? { scale:0.98 } : {}}
                  style={{ width:'100%', textAlign:'left', padding:'10px 14px', borderRadius:14, fontSize:12, fontWeight:500, display:'flex', alignItems:'center', gap:10, transition:'all 0.15s', ...st }}>
                  {!showAnswer && (
                    <span style={{ width:18, height:18, borderRadius:'50%', border:`2px solid ${C.border}`, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:C.sub }}>
                      {String.fromCharCode(65+i)}
                    </span>
                  )}
                  {showAnswer && icon}
                  <span>{opt.text}</span>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Correction */}
        <AnimatePresence>
          {showAnswer && ex.answer && (
            <motion.div
              initial={{ opacity:0, y:8, height:0 }} animate={{ opacity:1, y:0, height:'auto' }} exit={{ opacity:0 }}
              style={{ background:'#f0fdf4', border:'1.5px solid #bbf7d0', borderRadius:14, padding:'14px 16px', overflow:'hidden' }}>
              <p style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#16a34a', marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Correction
              </p>
              {ex.answer.split('\n').filter(l => l.trim()).map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:4 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <p style={{ fontSize:15, color:'#166534', lineHeight:1.8 }}>
                      <strong style={{ color:'#15803d' }}>{match[1]}.</strong> {match[2]}
                    </p>
                  </div>
                );
                return <p key={i} style={{ fontSize:15, color:'#166534', lineHeight:1.8, marginBottom:8 }}>{line}</p>;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        {ex.type === 'open' ? (
          quotaExceeded && !completed ? (
            <span style={{ fontSize:10, fontWeight:700, padding:'7px 14px', borderRadius:12, background:'#fffbeb', color:'#d97706', border:'1.5px solid #fde68a', alignSelf:'flex-start' }}>
              Quota mensuel atteint — Passe à Pro
            </span>
          ) : !completed ? (
            <div style={{ paddingTop:4 }}>
              <motion.button onClick={handleVerifyOpen} disabled={!userAnswer.trim()}
                whileHover={userAnswer.trim() ? { y:-3, boxShadow:clay.btn(cfg.from, cfg.dark) } : {}}
                whileTap={userAnswer.trim() ? { scale:0.96 } : {}}
                style={{ padding:'9px 18px', borderRadius:14, border:'none', cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                  fontSize:12, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:7, opacity: userAnswer.trim() ? 1 : 0.5,
                  background:`linear-gradient(135deg,${cfg.from},${cfg.to})`,
                  boxShadow:`0 4px 0 ${cfg.dark}, 0 8px 20px ${cfg.from}40` }}>
                Vérifier ma réponse
              </motion.button>
            </div>
          ) : (
            <div>
              <span style={{ fontSize:12, fontWeight:700, color: autoResult ? AUTO_RESULT_CFG[autoResult.key].color : '#16a34a', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                {autoResult ? AUTO_RESULT_CFG[autoResult.key].label : 'Exercice complété'}
              </span>
              {autoResult && autoResult.total > 0 && (
                <p style={{ fontSize:11, color:C.sub, marginTop:6 }}>
                  {autoResult.matched}/{autoResult.total} éléments clés de la correction retrouvés dans ta réponse
                </p>
              )}
            </div>
          )
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:4 }}>
            <div>
              {!showAnswer && (
                <motion.button onClick={() => setShowAnswer(true)}
                  whileHover={{ y:-2, boxShadow:clay.sm }} whileTap={{ scale:0.97 }}
                  style={{ padding:'8px 16px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#fff', fontSize:11, fontWeight:600, color:C.sub, cursor:'pointer', boxShadow:clay.sm }}>
                  Voir la correction
                </motion.button>
              )}
            </div>

            {quotaExceeded && !completed ? (
              <span style={{ fontSize:10, fontWeight:700, padding:'7px 14px', borderRadius:12, background:'#fffbeb', color:'#d97706', border:'1.5px solid #fde68a' }}>
                Quota mensuel atteint — Passe à Pro
              </span>
            ) : !completed ? (
              <motion.button onClick={() => handleComplete()}
                whileHover={{ y:-3, boxShadow:clay.btn(cfg.from, cfg.dark) }}
                whileTap={{ scale:0.96 }}
                style={{ padding:'9px 18px', borderRadius:14, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:7,
                  background:`linear-gradient(135deg,${cfg.from},${cfg.to})`,
                  boxShadow:`0 4px 0 ${cfg.dark}, 0 8px 20px ${cfg.from}40` }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                Marquer complété
              </motion.button>
            ) : (
              <span style={{ fontSize:12, fontWeight:700, color:'#16a34a', display:'flex', alignItems:'center', gap:6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Exercice complété
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Exercise Session (mode jeu) ─────────────────────────────────────────────── */
function ExerciseSession({ exercises, title, subtitle, quotaExceeded, onExit, onExerciseComplete, navigate }) {
  const total = exercises.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results,      setResults]      = useState(() => new Array(total).fill(undefined));
  const [answered,     setAnswered]     = useState(false);
  const [done,         setDone]         = useState(false);
  // Figé au lancement : un quota qui se remplit PENDANT la session ne doit pas
  // interrompre l'affichage des résultats une fois le dernier exercice répondu.
  const [blockedAtStart] = useState(quotaExceeded);

  const ex = exercises[currentIndex];
  const progress = total ? (currentIndex / total) * 100 : 0;

  const handleAnswered = (isCorrect) => {
    setResults(r => { const copy = [...r]; copy[currentIndex] = isCorrect; return copy; });
    setAnswered(true);
    onExerciseComplete(isCorrect);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) { setDone(true); return; }
    setCurrentIndex(i => i + 1);
    setAnswered(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0); setResults(new Array(total).fill(undefined)); setAnswered(false); setDone(false);
  };

  /* ── Quota atteint avant même de démarrer ── */
  if (blockedAtStart) {
    return (
      <main style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:C.bg }}>
        <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          style={{ background:C.card, borderRadius:28, padding:'32px 26px', maxWidth:380, width:'100%', textAlign:'center', boxShadow:clay.card, border:`1.5px solid ${C.border}` }}>
          <div style={{ width:52, height:52, borderRadius:18, background:'#fef3c7', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
              <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <h3 style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:8 }}>Quota mensuel atteint</h3>
          <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>Passe à l'abonnement Étudiant pour continuer à t'entraîner sans limite.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <motion.button onClick={() => navigate('/dashboard/subscription')} whileTap={{ scale:0.96 }}
              style={{ padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,#d97706,#ea580c)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
              Voir les offres
            </motion.button>
            <button onClick={onExit} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:C.sub }}>← Retour</button>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ── Écran résultats ── */
  if (done || total === 0) {
    const correct   = results.filter(r => r === true).length;
    const incorrect = results.filter(r => r === false).length;
    const pct = total ? Math.round((correct / total) * 100) : 0;
    const ringColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#DC2626';
    return (
      <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <motion.div initial={{ opacity:0, y:20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ type:'spring', stiffness:260, damping:22 }}
          style={{ background:C.card, borderRadius:32, padding:'28px 24px', width:'100%', maxWidth:420,
            boxShadow:clay.card, border:`1.5px solid ${C.border}`, textAlign:'center' }}>

          {total > 0 && (
            <div style={{ position:'relative', width:120, height:120, margin:'0 auto 18px' }}>
              <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke={C.border} strokeWidth="9"/>
                <motion.circle cx="60" cy="60" r="50" fill="none" stroke={ringColor} strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*50}`}
                  initial={{ strokeDashoffset: 2*Math.PI*50 }}
                  animate={{ strokeDashoffset: 2*Math.PI*50*(1-pct/100) }}
                  transition={{ duration:1.3, delay:0.2, ease:[0.16,1,0.3,1] }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:26, fontWeight:900, color:ringColor }}>{pct}%</span>
                <span style={{ fontSize:10, color:C.sub }}>{pct >= 50 ? 'Réussi' : 'À revoir'}</span>
              </div>
            </div>
          )}

          <h2 style={{ fontSize:20, fontWeight:900, color:C.text, marginBottom:4 }}>
            {total === 0 ? 'Aucun exercice disponible' : pct >= 80 ? 'Excellent !' : pct >= 50 ? 'Bien joué !' : 'Continue à t\'entraîner !'}
          </h2>
          <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>{title}</p>

          {total > 0 && (
            <div style={{ display:'flex', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'16px 0', marginBottom:24 }}>
              {[{ n:correct, l:'Réussi', c:'#16a34a' }, { n:incorrect, l:'Raté', c:'#dc2626' }, { n:total, l:'Total', c:C.text }].map((s, i) => (
                <div key={i} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                  <p style={{ fontSize:28, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</p>
                  <p style={{ fontSize:11, color:C.sub, marginTop:4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          )}

          <div style={{ display:'grid', gridTemplateColumns: total > 0 ? '1fr 1fr' : '1fr', gap:10 }}>
            <motion.button onClick={onExit} whileTap={{ scale:0.96 }}
              style={{ padding:'13px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.sub, fontSize:13, fontWeight:700, cursor:'pointer' }}>
              ← Retour
            </motion.button>
            {total > 0 && (
              <motion.button onClick={handleRestart} whileTap={{ scale:0.96 }}
                style={{ padding:'13px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,#1e293b,#334155)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Recommencer
              </motion.button>
            )}
          </div>
        </motion.div>
      </main>
    );
  }

  /* ── Jeu en cours ── */
  return (
    <main style={{ flex:1, overflowY:'auto', background:C.bg }}>
      {/* Header sticky */}
      <div style={{ position:'sticky', top:0, zIndex:10, background:C.card, borderBottom:`1px solid ${C.border}`, padding:'12px 20px 10px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:11, color:C.sub, marginBottom:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{subtitle}</p>
            <p style={{ fontSize:13, fontWeight:700, color:C.text }}>Exercice {currentIndex + 1} / {total}</p>
          </div>
          <button onClick={onExit}
            style={{ width:36, height:36, borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.sub, flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ height:6, borderRadius:99, background:C.border, overflow:'hidden' }}>
          <motion.div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,var(--theme-primary),var(--theme-secondary))' }}
            animate={{ width:`${progress}%` }} transition={{ duration:0.4 }}/>
        </div>
      </div>

      <div style={{ maxWidth:760, margin:'0 auto', padding:'24px 16px 40px' }}>
        <motion.div key={ex._id}
          initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.3, ease:[0.16,1,0.3,1] }}>
          <ExerciseCard ex={ex} index={0} quotaExceeded={false} onComplete={handleAnswered}/>
        </motion.div>

        <AnimatePresence>
          {answered && (
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
              style={{ marginTop:18, display:'flex', justifyContent:'center' }}>
              <motion.button onClick={handleNext} whileHover={{ y:-3 }} whileTap={{ scale:0.96 }}
                style={{ padding:'13px 32px', borderRadius:16, border:'none', cursor:'pointer', fontSize:14, fontWeight:800, color:'#fff',
                  background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
                  boxShadow:'inset 0 1px 0 rgba(255,255,255,0.28), 0 8px 0 var(--theme-dark), 0 14px 28px rgba(var(--theme-primary-rgb),0.35)',
                  display:'flex', alignItems:'center', gap:8 }}>
                {currentIndex + 1 >= total ? 'Voir les résultats' : 'Exercice suivant'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */
function ExBreadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, flexWrap:'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
          {item.onClick ? (
            <button onClick={item.onClick} style={{
              fontSize:12, fontWeight:600, color:C.indigo, background:'rgba(var(--theme-primary-rgb),0.07)',
              border:`1px solid ${C.border}`, padding:'3px 12px', borderRadius:20, cursor:'pointer',
            }}>
              {item.label}
            </button>
          ) : (
            <span style={{
              fontSize:12, fontWeight:700, color:C.text, padding:'3px 12px',
              background:C.card, border:`1px solid ${C.border}`, borderRadius:20, boxShadow:clay.sm,
            }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skel({ h = 100, count = 3 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ height:h, borderRadius:20, background:C.border, animation:'pulse 1.5s ease-in-out infinite', animationDelay:`${i*0.1}s` }}/>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Exercises() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const isFree    = user?.subscription === 'free';

  const [exercises,      setExercises]      = useState([]);
  const [attempts,       setAttempts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [quota,          setQuota]          = useState(null);

  const { mode: displayMode, dir, setDir } = useDisplayMode();
  const [view,             setView]             = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  const [selectedUE,       setSelectedUE]       = useState(null);
  const [resumeModal,      setResumeModal]      = useState(false);
  const [doneModal,        setDoneModal]        = useState(false);
  const [skipDone,         setSkipDone]         = useState(false);

  const refreshAttempts = () => axios.get(`${API_URL}/exercises/history`).then(r => setAttempts(r.data)).catch(() => {});

  useEffect(() => {
    const cached = getCache('exercises_list');
    if (cached) { setExercises(cached); setLoading(false); }
    axios.get(`${API_URL}/exercises`)
      .then(r => { setExercises(r.data); setCache('exercises_list', r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    refreshAttempts();
    if (isFree) {
      axios.get(`${API_URL}/exercises/quota`).then(r => setQuota(r.data)).catch(() => {});
    }
  }, [isFree]);

  /* Suivi : quels exercices ont déjà été faits (persisté en base, un par un) */
  const attemptedIds = new Set(attempts.map(a => a.exerciseId));
  const countDone = (exs) => exs.filter(ex => attemptedIds.has(ex._id)).length;

  /* Build structure : Semestre → UE → Chapitre → exercices */
  const structure = {};
  exercises.forEach(ex => {
    const sem = (ex.semester  || 'Non classé').trim();
    const ue  = (ex.category  || 'Autre').trim();
    const ct  = (ex.caseType  || 'Général').trim();
    if (!structure[sem])           structure[sem] = {};
    if (!structure[sem][ue])       structure[sem][ue] = {};
    if (!structure[sem][ue][ct])   structure[sem][ue][ct] = [];
    structure[sem][ue][ct].push(ex);
  });

  const semesters = Object.keys(structure).sort();
  const ues       = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const caseTypes = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentExs = (selectedSemester && selectedUE && selectedCaseType)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedCaseType] || []) : [];

  const reset = () => {
    setView('semesters'); setSelectedSemester(null); setSelectedCaseType(null); setSelectedUE(null);
    setResumeModal(false); setDoneModal(false); setSkipDone(false);
  };
  const backToChapters = () => { setResumeModal(false); setDoneModal(false); setSelectedCaseType(null); setView('casetypes'); };

  const qcmCount  = exercises.filter(e => e.type === 'qcm').length;
  const openCount = exercises.filter(e => e.type === 'open').length;
  const caseCount = exercises.filter(e => e.type === 'case_study').length;
  const quotaExceeded = isFree && quota?.exceeded;

  const chapterDone  = currentExs.length ? countDone(currentExs) : 0;
  const chapterTotal = currentExs.length;

  /* Clic sur un chapitre : démarre directement, ou propose de reprendre / recommencer */
  const handleChapterClick = (ct) => {
    setSelectedCaseType(ct);
    const exs = structure[selectedSemester]?.[selectedUE]?.[ct] || [];
    const done = countDone(exs);
    setSkipDone(false);
    if (done === 0) { setView('exercises'); }
    else if (done >= exs.length) { setDoneModal(true); }
    else { setResumeModal(true); }
  };

  const handleResume = () => { setSkipDone(true); setResumeModal(false); setView('exercises'); };
  const handleRestartChapter = () => { setSkipDone(false); setResumeModal(false); setDoneModal(false); setView('exercises'); };

  const sessionExercises = skipDone ? currentExs.filter(ex => !attemptedIds.has(ex._id)) : currentExs;

  /* ── Mode jeu : une session plein écran, un exercice à la fois ── */
  if (!loading && view === 'exercises' && selectedSemester && selectedUE && selectedCaseType) {
    return (
      <DashboardLayout>
        <ExerciseSession
          key={`${selectedSemester}-${selectedUE}-${selectedCaseType}-${skipDone}`}
          exercises={sessionExercises}
          title={selectedCaseType}
          subtitle={`${selectedUE} · ${selectedSemester}`}
          quotaExceeded={quotaExceeded}
          navigate={navigate}
          onExit={() => { refreshAttempts(); setView('casetypes'); }}
          onExerciseComplete={() => {
            setCompletedCount(c => c + 1);
            if (isFree && quota) setQuota(q => ({ ...q, used:(q.used||0)+1, exceeded:(q.used||0)+1 >= q.limit }));
            refreshAttempts();
          }}
        />
      </DashboardLayout>
    );
  }

  /* ── Modal : chapitre déjà commencé ── */
  if (resumeModal) {
    const pct = chapterTotal ? Math.round((chapterDone / chapterTotal) * 100) : 0;
    return (
      <DashboardLayout>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:clay.card, border:`1.5px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:18, background:'#fef9c3', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.text, marginBottom:2 }}>Chapitre en cours</h2>
            <p style={{ fontSize:12, color:C.sub, marginBottom:6 }}>{selectedCaseType}</p>
            <p style={{ fontSize:13, color:C.sub, marginBottom:20 }}>
              Tu as déjà fait <strong style={{ color:C.text }}>{chapterDone}/{chapterTotal}</strong> exercices
            </p>
            <div style={{ height:8, borderRadius:99, background:C.border, overflow:'hidden', marginBottom:24 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:'linear-gradient(90deg,#f59e0b,#f97316)', borderRadius:99, transition:'width 0.8s ease' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <motion.button onClick={handleResume} whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'14px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Reprendre où je me suis arrêté
              </motion.button>
              <motion.button onClick={handleRestartChapter} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'13px 0', borderRadius:16, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                Recommencer depuis le début
              </motion.button>
              <button onClick={backToChapters} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:C.sub, marginTop:4 }}>
                ← Retour aux chapitres
              </button>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Modal : chapitre déjà terminé ── */
  if (doneModal) {
    const correct = currentExs.filter(ex => attempts.find(a => a.exerciseId === ex._id)?.pct === 100).length;
    const pct = chapterTotal ? Math.round((correct / chapterTotal) * 100) : 0;
    const ringColor = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#DC2626';
    return (
      <DashboardLayout>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:400, boxShadow:clay.card, border:`1.5px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ position:'relative', width:96, height:96, margin:'0 auto 16px' }}>
              <svg width="96" height="96" style={{ transform:'rotate(-90deg)' }}>
                <circle cx="48" cy="48" r="40" fill="none" stroke={C.border} strokeWidth="7"/>
                <motion.circle cx="48" cy="48" r="40" fill="none" stroke={ringColor} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={`${2*Math.PI*40}`}
                  initial={{ strokeDashoffset: 2*Math.PI*40 }}
                  animate={{ strokeDashoffset: 2*Math.PI*40*(1-pct/100) }}
                  transition={{ duration:1.2, delay:0.1, ease:[0.16,1,0.3,1] }}/>
              </svg>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontSize:20, fontWeight:900, color:ringColor }}>{pct}%</span>
              </div>
            </div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.text, marginBottom:2 }}>Chapitre terminé</h2>
            <p style={{ fontSize:12, color:C.sub, marginBottom:20 }}>{selectedCaseType} — {chapterTotal}/{chapterTotal} exercices faits</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <motion.button onClick={handleRestartChapter} whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'14px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer' }}>
                Recommencer ce chapitre
              </motion.button>
              <button onClick={backToChapters} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:C.sub, marginTop:4 }}>
                ← Retour aux chapitres
              </button>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-18px,12px) scale(1.05)} 66%{transform:translate(14px,-18px) scale(0.96)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px) scale(1.04)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          {/* Orbs */}
          <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,#38bdf8,transparent)', opacity:0.18, filter:'blur(50px)', animation:'drift1 18s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:60, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,#a5b4fc,transparent)', opacity:0.15, filter:'blur(40px)', animation:'drift2 22s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          {/* Shine */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 70% 15%,rgba(255,255,255,0.12),transparent 50%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>

            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
              </div>
              <div style={{ minWidth:0 }}>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Entraîne-toi</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>QCM, questions ouvertes et cas cliniques — comme aux examens IFSI</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:20, rowGap:12, flexWrap:'wrap', alignItems:'center' }}>
              {[
                { label:'Total',        val:exercises.length, color:'#93c5fd' },
                { label:'QCM',          val:qcmCount,         color:'#c4b5fd' },
                { label:'Ouvertes',     val:openCount,        color:'#60a5fa' },
                { label:'Cas cliniques',val:caseCount,        color:'#fb923c' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:22, fontWeight:900, color:s.color, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{s.val}</p>
                  <p style={{ fontSize:10, color:'rgba(186,230,253,0.55)', marginTop:3 }}>{s.label}</p>
                </div>
              ))}
              {isFree && quota && (
                <div style={{ textAlign:'right' }}>
                  <p style={{ fontSize:10, color:'rgba(186,230,253,0.55)', marginBottom:2 }}>Quota mensuel</p>
                  <p style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{quota.used} / {quota.limit} exercice{quota.limit > 1?'s':''}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:'24px 16px' }}>
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', padding:'80px 0' }}>
              <div style={{ width:36, height:36, border:'4px solid var(--theme-shadow)', borderTopColor:'var(--theme-primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            </div>
          ) : displayMode === 'detail' && view !== 'exercises' ? (
            /* ── AFFICHAGE DÉTAILLÉ (listes) ── */
            <div style={{ maxWidth:760 }}>
              <SlideLevel id={view} dir={dir.current}>
                {view === 'semesters' && (
                  semesters.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'80px 0', color:C.sub }}>
                      <p style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Aucun exercice disponible</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom:20 }}>
                        <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>Semestres</h2>
                        <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{semesters.length} semestre{semesters.length>1?'s':''}</p>
                      </div>
                      <DetailList
                        items={semesters.map(sem => {
                          const all   = Object.values(structure[sem]).flatMap(ct => Object.values(ct)).flat();
                          const total = all.length;
                          const done  = countDone(all);
                          return { key: sem, label: sem, done: total>0 && done>=total, sub: `${Object.keys(structure[sem]).length} UE · ${done}/${total} exercice${total>1?'s':''} fait${done>1?'s':''}` };
                        })}
                        onPick={sem => { setDir(1); setSelectedSemester(sem); setView('ues'); }}
                      />
                    </>
                  )
                )}

                {view === 'ues' && selectedSemester && (
                  <>
                    <ExBreadcrumb items={[
                      { label:'Exercices', onClick:() => { setDir(-1); reset(); } },
                      { label:selectedSemester }
                    ]}/>
                    <div style={{ marginBottom:20 }}>
                      <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedSemester}</h2>
                      <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{ues.length} unité{ues.length>1?'s':''} d'enseignement</p>
                    </div>
                    <DetailList
                      items={ues.map(ue => {
                        const all   = Object.values(structure[selectedSemester][ue]).flat();
                        const total = all.length;
                        const done  = countDone(all);
                        return { key: ue, label: ue, done: total>0 && done>=total, sub: `${Object.keys(structure[selectedSemester][ue]).length} chapitre${Object.keys(structure[selectedSemester][ue]).length>1?'s':''} · ${done}/${total} fait${done>1?'s':''}` };
                      })}
                      onPick={ue => { setDir(1); setSelectedUE(ue); setView('casetypes'); }}
                    />
                  </>
                )}

                {view === 'casetypes' && selectedSemester && selectedUE && (
                  <>
                    <ExBreadcrumb items={[
                      { label:'Exercices', onClick:() => { setDir(-1); reset(); } },
                      { label:selectedSemester, onClick:() => { setDir(-1); setSelectedUE(null); setView('ues'); } },
                      { label:selectedUE },
                    ]}/>
                    <div style={{ marginBottom:20 }}>
                      <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedUE}</h2>
                      <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{caseTypes.length} chapitre{caseTypes.length>1?'s':''}</p>
                    </div>
                    <DetailList
                      items={caseTypes.map(ct => {
                        const exs = structure[selectedSemester][selectedUE][ct];
                        const done = countDone(exs);
                        return {
                          key: ct, label: ct, done: done >= exs.length,
                          sub: `${done}/${exs.length} exercice${exs.length>1?'s':''} fait${done>1?'s':''}`,
                        };
                      })}
                      onPick={ct => { setDir(1); handleChapterClick(ct); }}
                    />
                  </>
                )}
              </SlideLevel>
            </div>
          ) : (
            <AnimatePresence mode="wait">

              {/* ── SEMESTRES ── */}
              {view === 'semesters' && (
                <motion.div key="sems"
                  initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  {semesters.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'80px 0', color:C.sub }}>
                      <p style={{ fontSize:42, marginBottom:12 }}>📋</p>
                      <p style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Aucun exercice disponible</p>
                      <p style={{ fontSize:13 }}>Le contenu sera disponible prochainement.</p>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                      {semesters.map((sem, idx) => {
                        const pal = EX_PALETTE[idx % EX_PALETTE.length];
                        const ctCount = Object.keys(structure[sem]).length;
                        const all     = Object.values(structure[sem]).flatMap(ct => Object.values(ct)).flat();
                        const total   = all.length;
                        const done    = countDone(all);
                        return (
                          <motion.button key={sem}
                            onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                            initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                            transition={{ delay:idx*0.07, duration:0.45, ease:[0.16,1,0.3,1] }}
                            whileHover={{ y:-6, boxShadow:`0 8px 0 ${pal.dark}, 0 16px 40px ${pal.from}60` }}
                            whileTap={{ scale:0.96 }}
                            style={{ borderRadius:22, padding:'22px', textAlign:'left', cursor:'pointer', border:'none', position:'relative', overflow:'hidden',
                              background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                              boxShadow:`0 4px 0 ${pal.dark}, 0 8px 32px ${pal.from}50` }}>
                            {/* Shine */}
                            <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(12px)', pointerEvents:'none' }}/>
                            <div style={{ position:'absolute', bottom:-12, left:-12, width:60, height:60, borderRadius:'50%', background:'rgba(0,0,0,0.1)', filter:'blur(10px)', pointerEvents:'none' }}/>
                            {total > 0 && done >= total && (
                              <span style={{ position:'absolute', top:14, right:14, fontSize:9, fontWeight:700, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.25)', color:'#fff' }}>✓ Terminé</span>
                            )}

                            <div style={{ width:40, height:40, borderRadius:14, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, position:'relative' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                              </svg>
                            </div>

                            <h3 style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4, lineHeight:1.2, position:'relative' }}>{sem}</h3>
                            <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginBottom:18, position:'relative' }}>
                              {ctCount} UE · {done}/{total} fait{done>1?'s':''}
                            </p>

                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                              <div style={{ display:'flex', gap:5 }}>
                                {Array.from({ length:Math.min(ctCount,5) }).map((_, i) => (
                                  <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.5)' }}/>
                                ))}
                              </div>
                              <div style={{ width:30, height:30, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ── UEs ── */}
              {view === 'ues' && selectedSemester && (
                <motion.div key="ues"
                  initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  <ExBreadcrumb items={[{ label:'Exercices', onClick:reset }, { label:selectedSemester }]}/>
                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedSemester}</h2>
                    <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{ues.length} unité{ues.length > 1?'s':''} d'enseignement</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
                    {ues.map((ue, idx) => {
                      const pal = EX_PALETTE[idx % EX_PALETTE.length];
                      const chapCount = Object.keys(structure[selectedSemester][ue]).length;
                      const all       = Object.values(structure[selectedSemester][ue]).flat();
                      const total     = all.length;
                      const done      = countDone(all);
                      return (
                        <motion.button key={ue}
                          onClick={() => { setSelectedUE(ue); setView('casetypes'); }}
                          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay:idx*0.06 }}
                          whileHover={{ y:-5, boxShadow:`0 6px 0 ${pal.dark}, 0 14px 32px ${pal.from}55` }}
                          whileTap={{ scale:0.96 }}
                          style={{ borderRadius:20, padding:'18px', textAlign:'left', cursor:'pointer', border:'none', position:'relative', overflow:'hidden',
                            background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                            boxShadow:`0 4px 0 ${pal.dark}, 0 8px 28px ${pal.from}45` }}>
                          <div style={{ position:'absolute', top:-16, right:-16, width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(10px)', pointerEvents:'none' }}/>
                          {total > 0 && done >= total && (
                            <span style={{ position:'absolute', top:12, right:12, fontSize:9, fontWeight:700, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.25)', color:'#fff' }}>✓</span>
                          )}
                          <h3 style={{ fontSize:13, fontWeight:900, color:'#fff', marginBottom:4, position:'relative' }}>{ue}</h3>
                          <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)', marginBottom:12, position:'relative' }}>
                            {chapCount} chapitre{chapCount > 1?'s':''} · {done}/{total} fait{done>1?'s':''}
                          </p>
                          <div style={{ display:'flex', justifyContent:'flex-end', position:'relative' }}>
                            <div style={{ width:28, height:28, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── CHAPITRES ── */}
              {view === 'casetypes' && selectedSemester && selectedUE && (
                <motion.div key="chapters"
                  initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  <ExBreadcrumb items={[
                    { label:'Exercices', onClick:reset },
                    { label:selectedSemester, onClick:() => { setSelectedUE(null); setView('ues'); } },
                    { label:selectedUE },
                  ]}/>
                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedUE}</h2>
                    <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{caseTypes.length} chapitre{caseTypes.length > 1?'s':''}</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                    {caseTypes.map((ct, idx) => {
                      const pal = EX_PALETTE[idx % EX_PALETTE.length];
                      const exs   = structure[selectedSemester][selectedUE][ct];
                      const count = exs.length;
                      const done  = countDone(exs);
                      const isDone = count > 0 && done >= count;
                      return (
                        <motion.button key={ct}
                          onClick={() => handleChapterClick(ct)}
                          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay:idx*0.05 }}
                          whileHover={{ y:-4, boxShadow:clay.card }}
                          whileTap={{ scale:0.97 }}
                          style={{ borderRadius:18, padding:'16px', textAlign:'left', cursor:'pointer', background:C.card,
                            border:`1.5px solid ${isDone ? '#86efac' : C.border}`, boxShadow:clay.sm, display:'flex', alignItems:'center', gap:14 }}>
                          <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                            background: isDone ? 'linear-gradient(135deg,#22c55e,#16a34a)' : `linear-gradient(135deg,${pal.from},${pal.to})`,
                            boxShadow: isDone ? '0 3px 0 #15803d, 0 6px 16px rgba(34,197,94,0.4)' : `0 3px 0 ${pal.dark}, 0 6px 16px ${pal.from}40` }}>
                            {isDone ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            ) : (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                            )}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <h3 style={{ fontSize:13, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ct}</h3>
                            <p style={{ fontSize:11, color: isDone ? '#16a34a' : done > 0 ? '#d97706' : C.sub, marginTop:3, fontWeight: done > 0 ? 700 : 400 }}>
                              {done}/{count} exercice{count > 1?'s':''} fait{done>1?'s':''}
                            </p>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}>
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
                        </motion.button>
                      );
                    })}
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
