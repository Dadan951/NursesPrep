import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { getCache, setCache } from '../utils/cache';
import { API_URL, useAuth } from '../context/AuthContext';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   '#FFFFFF',
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

const DIFF_STYLE = {
  easy:   { background:'rgba(74,222,128,0.18)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.35)' },
  medium: { background:'rgba(251,191,36,0.18)', color:'#fbbf24', border:'1px solid rgba(251,191,36,0.35)' },
  hard:   { background:'rgba(248,113,113,0.18)', color:'#f87171', border:'1px solid rgba(248,113,113,0.35)' },
};
const DIFF_LABEL = { easy:'Facile', medium:'Moyen', hard:'Difficile' };

/* ─── Exercise Card ──────────────────────────────────────────────────────────── */
function ExerciseCard({ ex, onComplete, quotaExceeded, index }) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [completed,  setCompleted]  = useState(false);
  const cfg  = TYPE_CFG[ex.type] || TYPE_CFG.open;
  const diff = DIFF_STYLE[ex.difficulty] || DIFF_STYLE.medium;
  const diffLabel = DIFF_LABEL[ex.difficulty] || 'Moyen';

  const handleComplete = async () => {
    if (completed || quotaExceeded) return;
    setCompleted(true);
    setShowAnswer(true);
    try { await axios.post(`${API_URL}/exercises/complete`); onComplete(); } catch {}
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
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, ...diff }}>
            {diffLabel}
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
        <div style={{ borderRadius:14, border:`1.5px solid ${cfg.border}`, padding:'14px 16px', background:cfg.light }}>
          <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:cfg.textColor, marginBottom:8 }}>
            {cfg.headerText}
          </p>
          {isNumbered ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {lines.map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                    <span style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, marginTop:2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff',
                      background:`linear-gradient(135deg,${cfg.from},${cfg.to})` }}>
                      {match[1]}
                    </span>
                    <p style={{ fontSize:12, color:'#334155', lineHeight:1.6 }}>{match[2]}</p>
                  </div>
                );
                return <p key={i} style={{ fontSize:12, color:'#334155', lineHeight:1.6 }}>{line}</p>;
              })}
            </div>
          ) : (
            <p style={{ fontSize:13, fontWeight:500, color:'#1e293b', lineHeight:1.65, whiteSpace:'pre-line' }}>{ex.content}</p>
          )}
        </div>

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
              <p style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#16a34a', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                Correction
              </p>
              {ex.answer.split('\n').filter(l => l.trim()).map((line, i) => {
                const match = line.trim().match(/^(\d+)[\.\)]\s+(.+)/);
                if (match) return (
                  <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, marginBottom:6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0, marginTop:3 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <p style={{ fontSize:12, color:'#166534', lineHeight:1.6 }}>
                      <strong style={{ color:'#15803d' }}>{match[1]}.</strong> {match[2]}
                    </p>
                  </div>
                );
                return <p key={i} style={{ fontSize:12, color:'#166534', lineHeight:1.6, marginBottom:4 }}>{line}</p>;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
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
            <motion.button onClick={handleComplete}
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
      </div>
    </motion.div>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */
function ExBreadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, flexWrap:'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
          {item.onClick ? (
            <motion.button onClick={item.onClick}
              whileHover={{ color:C.indigo }}
              style={{ fontSize:12, fontWeight:600, color:C.sub, background:'transparent', border:'none', cursor:'pointer', padding:'3px 8px', borderRadius:8 }}>
              {item.label}
            </motion.button>
          ) : (
            <span style={{ fontSize:12, fontWeight:700, color:C.text, padding:'3px 10px', borderRadius:10, background:C.card, boxShadow:clay.sm }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Quota Banner ───────────────────────────────────────────────────────────── */
function QuotaBanner({ used, limit, navigate }) {
  if (used < limit) return null;
  return (
    <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
      style={{ marginBottom:20, borderRadius:16, border:'1.5px solid #fde68a', background:'#fffbeb', padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, boxShadow:clay.sm }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:14, background:'#fef3c7', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:'#92400e' }}>Quota mensuel atteint ({used}/{limit} exercice{limit > 1?'s':''})</p>
          <p style={{ fontSize:11, color:'#b45309', marginTop:2 }}>Passe à l'abonnement Étudiant pour un accès illimité.</p>
        </div>
      </div>
      <motion.button onClick={() => navigate('/dashboard/subscription')}
        whileHover={{ y:-2, boxShadow:clay.btn('#d97706','#92400e') }} whileTap={{ scale:0.97 }}
        style={{ padding:'9px 16px', borderRadius:12, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff', whiteSpace:'nowrap',
          background:'linear-gradient(135deg,#d97706,#ea580c)', boxShadow:clay.btn('#d97706','#92400e') }}>
        Voir les offres
      </motion.button>
    </motion.div>
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
  const [loading,        setLoading]        = useState(true);
  const [completedCount, setCompletedCount] = useState(0);
  const [quota,          setQuota]          = useState(null);

  const [view,             setView]             = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCaseType, setSelectedCaseType] = useState(null);
  const [selectedUE,       setSelectedUE]       = useState(null);

  useEffect(() => {
    const cached = getCache('exercises_list');
    if (cached) { setExercises(cached); setLoading(false); }
    axios.get(`${API_URL}/exercises`)
      .then(r => { setExercises(r.data); setCache('exercises_list', r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
    if (isFree) {
      axios.get(`${API_URL}/exercises/quota`).then(r => setQuota(r.data)).catch(() => {});
    }
  }, [isFree]);

  /* Build structure */
  const structure = {};
  exercises.forEach(ex => {
    const sem = (ex.semester  || 'Non classé').trim();
    const ct  = (ex.caseType  || 'Général').trim();
    const ue  = (ex.category  || 'Autre').trim();
    if (!structure[sem])           structure[sem] = {};
    if (!structure[sem][ct])       structure[sem][ct] = {};
    if (!structure[sem][ct][ue])   structure[sem][ct][ue] = [];
    structure[sem][ct][ue].push(ex);
  });

  const semesters = Object.keys(structure).sort();
  const caseTypes = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const ues       = (selectedSemester && selectedCaseType) ? Object.keys(structure[selectedSemester]?.[selectedCaseType] || {}).sort() : [];
  const currentExs = (selectedSemester && selectedCaseType && selectedUE)
    ? (structure[selectedSemester]?.[selectedCaseType]?.[selectedUE] || []) : [];

  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedCaseType(null); setSelectedUE(null); };

  const qcmCount  = exercises.filter(e => e.type === 'qcm').length;
  const openCount = exercises.filter(e => e.type === 'open').length;
  const caseCount = exercises.filter(e => e.type === 'case_study').length;
  const quotaExceeded = isFree && quota?.exceeded;

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
              <div>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Entraîne-toi</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>QCM, questions ouvertes et cas cliniques — comme aux examens IFSI</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:20, flexWrap:'wrap', alignItems:'center' }}>
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
                <div style={{ marginLeft:'auto', textAlign:'right' }}>
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
                        const total   = Object.values(structure[sem]).flatMap(ct => Object.values(ct)).flat().length;
                        return (
                          <motion.button key={sem}
                            onClick={() => { setSelectedSemester(sem); setView('casetypes'); }}
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

                            <div style={{ width:40, height:40, borderRadius:14, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, position:'relative' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/>
                              </svg>
                            </div>

                            <h3 style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4, lineHeight:1.2, position:'relative' }}>{sem}</h3>
                            <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginBottom:18, position:'relative' }}>
                              {ctCount} type{ctCount > 1?'s':''} · {total} exercice{total > 1?'s':''}
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

              {/* ── TYPES DE CAS ── */}
              {view === 'casetypes' && selectedSemester && (
                <motion.div key="cts"
                  initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  <ExBreadcrumb items={[{ label:'Exercices', onClick:reset }, { label:selectedSemester }]}/>
                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedSemester}</h2>
                    <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{caseTypes.length} type{caseTypes.length > 1?'s':''} de cas</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
                    {caseTypes.map((ct, idx) => {
                      const pal = EX_PALETTE[idx % EX_PALETTE.length];
                      const ueCount = Object.keys(structure[selectedSemester][ct]).length;
                      const total   = Object.values(structure[selectedSemester][ct]).flat().length;
                      return (
                        <motion.button key={ct}
                          onClick={() => { setSelectedCaseType(ct); setView('ues'); }}
                          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay:idx*0.06 }}
                          whileHover={{ y:-5, boxShadow:`0 6px 0 ${pal.dark}, 0 14px 32px ${pal.from}55` }}
                          whileTap={{ scale:0.96 }}
                          style={{ borderRadius:20, padding:'18px', textAlign:'left', cursor:'pointer', border:'none', position:'relative', overflow:'hidden',
                            background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                            boxShadow:`0 4px 0 ${pal.dark}, 0 8px 28px ${pal.from}45` }}>
                          <div style={{ position:'absolute', top:-16, right:-16, width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(10px)', pointerEvents:'none' }}/>
                          <h3 style={{ fontSize:13, fontWeight:900, color:'#fff', marginBottom:4, position:'relative' }}>{ct}</h3>
                          <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)', marginBottom:12, position:'relative' }}>
                            {ueCount} UE · {total} exercice{total > 1?'s':''}
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

              {/* ── UEs ── */}
              {view === 'ues' && selectedSemester && selectedCaseType && (
                <motion.div key="ues"
                  initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  <ExBreadcrumb items={[
                    { label:'Exercices', onClick:reset },
                    { label:selectedSemester, onClick:() => { setSelectedCaseType(null); setView('casetypes'); } },
                    { label:selectedCaseType },
                  ]}/>
                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedCaseType}</h2>
                    <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{ues.length} unité{ues.length > 1?'s':''} d'enseignement</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                    {ues.map((ue, idx) => {
                      const pal = EX_PALETTE[idx % EX_PALETTE.length];
                      const count = structure[selectedSemester][selectedCaseType][ue].length;
                      return (
                        <motion.button key={ue}
                          onClick={() => { setSelectedUE(ue); setView('exercises'); }}
                          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                          transition={{ delay:idx*0.05 }}
                          whileHover={{ y:-4, boxShadow:clay.card }}
                          whileTap={{ scale:0.97 }}
                          style={{ borderRadius:18, padding:'16px', textAlign:'left', cursor:'pointer', background:C.card,
                            border:`1.5px solid ${C.border}`, boxShadow:clay.sm, display:'flex', alignItems:'center', gap:14 }}>
                          <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                            background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                            boxShadow:`0 3px 0 ${pal.dark}, 0 6px 16px ${pal.from}40` }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <h3 style={{ fontSize:13, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ue}</h3>
                            <p style={{ fontSize:11, color:C.sub, marginTop:3 }}>{count} exercice{count > 1?'s':''}</p>
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

              {/* ── EXERCICES ── */}
              {view === 'exercises' && selectedSemester && selectedCaseType && selectedUE && (
                <motion.div key="exs"
                  initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                  transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                  <ExBreadcrumb items={[
                    { label:'Exercices',     onClick:reset },
                    { label:selectedSemester, onClick:() => { setSelectedCaseType(null); setSelectedUE(null); setView('casetypes'); } },
                    { label:selectedCaseType, onClick:() => { setSelectedUE(null); setView('ues'); } },
                    { label:selectedUE },
                  ]}/>

                  <div style={{ marginBottom:20 }}>
                    <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedUE}</h2>
                    <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{currentExs.length} exercice{currentExs.length > 1?'s':''}</p>
                  </div>

                  {isFree && quota && <QuotaBanner used={quota.used} limit={quota.limit} navigate={navigate}/>}

                  <div style={{ display:'flex', flexDirection:'column', gap:16, maxWidth:860 }}>
                    {currentExs.map((ex, i) => (
                      <ExerciseCard
                        key={ex._id}
                        ex={ex}
                        index={i}
                        quotaExceeded={quotaExceeded}
                        onComplete={() => {
                          setCompletedCount(c => c + 1);
                          if (isFree && quota) setQuota(q => ({ ...q, used:(q.used||0)+1, exceeded:(q.used||0)+1 >= q.limit }));
                        }}
                      />
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
