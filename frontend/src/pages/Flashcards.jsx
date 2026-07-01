import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
const C = {
  bg:'var(--theme-bg)', card:'#FFFFFF', text:'var(--theme-text)', muted:'#6b7280',
  border:'var(--theme-border)', indigo:'var(--theme-primary)', violet:'var(--theme-secondary)',
  green:'#10B981', red:'#DC2626', amber:'#F59E0B',
};
const clay = {
  card:`inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 0 var(--theme-shadow), 0 8px 24px rgba(var(--theme-primary-rgb),0.08)`,
  sm:  `inset 0 1px 0 rgba(255,255,255,0.8), 0 2px 0 var(--theme-shadow), 0 4px 12px rgba(var(--theme-primary-rgb),0.06)`,
  btn: (hex, dark) => hex
    ? `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 ${dark}, 0 14px 28px ${hex}55`
    : `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 var(--theme-dark), 0 14px 28px rgba(var(--theme-primary-rgb),0.33)`,
};
const PALETTE = [
  { from:'#6366f1', to:'#8b5cf6', dark:'#3730a3' },
  { from:'#0891b2', to:'#0284c7', dark:'#0e4d6d' },
  { from:'#059669', to:'#047857', dark:'#064e3b' },
  { from:'#dc2626', to:'#db2777', dark:'#7f1d1d' },
  { from:'#ea580c', to:'#d97706', dark:'#7c2d12' },
  { from:'#7c3aed', to:'#6d28d9', dark:'#4c1d95' },
  { from:'#0f766e', to:'#0891b2', dark:'#134e4a' },
  { from:'#be185d', to:'#9333ea', dark:'#701a75' },
];

/* ─── GradCard ───────────────────────────────────────────────────────────── */
function GradCard({ pal, title, sub, sub2, onClick, progress, badge }) {
  const [hov, setHov] = useState(false);
  const [tap, setTap] = useState(false);
  const shadow = tap
    ? `inset 0 1px 0 rgba(255,255,255,0.28), 0 2px 0 ${pal.dark}, 0 4px 8px ${pal.from}44`
    : hov
    ? `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 12px 0 ${pal.dark}, 0 18px 32px ${pal.from}55`
    : `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 ${pal.dark}, 0 14px 28px ${pal.from}55`;
  return (
    <motion.button onClick={onClick}
      onHoverStart={() => setHov(true)} onHoverEnd={() => setHov(false)}
      onTapStart={() => setTap(true)} onTap={() => setTap(false)} onTapCancel={() => setTap(false)}
      whileHover={{ y:-4 }} whileTap={{ y:2, scale:0.98 }}
      style={{ background:`linear-gradient(135deg,${pal.from},${pal.to})`, borderRadius:24, padding:'22px 20px',
        border:'none', cursor:'pointer', textAlign:'left', boxShadow:shadow, transition:'box-shadow 0.2s',
        minHeight:168, display:'flex', flexDirection:'column', width:'100%', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,0.12)', pointerEvents:'none' }}/>
      {badge && <span style={{ position:'absolute', top:14, right:14, fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,0.25)', color:'#fff' }}>{badge}</span>}
      <h3 style={{ fontSize:15, fontWeight:900, color:'#fff', fontFamily:'Nunito,sans-serif', lineHeight:1.3, marginBottom:6,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{title}</h3>
      <div style={{ marginTop:'auto' }}>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.8)', marginBottom: sub2 ? 2 : progress != null ? 8 : 10 }}>{sub}</p>
        {sub2 && <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginBottom: progress != null ? 8 : 10 }}>{sub2}</p>}
        {progress != null && (
          <div style={{ height:4, borderRadius:99, background:'rgba(255,255,255,0.25)', overflow:'hidden', marginBottom:10 }}>
            <div style={{ height:'100%', width:`${progress}%`, background:'rgba(255,255,255,0.85)', borderRadius:99, transition:'width 0.8s ease' }}/>
          </div>
        )}
        <div style={{ display:'flex', justifyContent:'flex-end' }}>
          <div style={{ width:32, height:32, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────── */
function Breadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, flexWrap:'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} style={{ fontSize:12, fontWeight:600, color:C.indigo, background:'none', border:'none', cursor:'pointer', padding:0 }}>{item.label}</button>
            : <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{item.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}

/* ─── FlashCard 3D flip ──────────────────────────────────────────────────── */
function FlashCard({ card, palette, flipped, onFlip }) {
  const backRef = useRef(null);
  const [needsScroll, setNeedsScroll] = useState(false);
  const [scrollDone,  setScrollDone]  = useState(false);

  useEffect(() => {
    if (!flipped || !backRef.current) return;
    const el = backRef.current;
    el.scrollTop = 0;
    setScrollDone(false);
    const t = setTimeout(() => { setNeedsScroll(el.scrollHeight > el.clientHeight + 4); }, 300);
    return () => clearTimeout(t);
  }, [flipped, card]);

  const handleScroll = () => {
    if (!backRef.current) return;
    const el = backRef.current;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setScrollDone(true);
  };

  return (
    <div style={{ perspective:'1200px' }}>
      <div onClick={onFlip} style={{
        position:'relative', width:'100%', height:300,
        transformStyle:'preserve-3d',
        transition:'transform 0.55s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        cursor:'pointer',
      }}>
        {/* FRONT */}
        <div style={{
          position:'absolute', inset:0, borderRadius:28,
          background:C.card, border:`1px solid ${C.border}`,
          boxShadow:`inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 0 var(--theme-shadow), 0 14px 36px rgba(var(--theme-primary-rgb),0.12)`,
          backfaceVisibility:'hidden',
          display:'flex', flexDirection:'column', padding:'24px 24px',
        }}>
          <div style={{ flexShrink:0, marginBottom:16 }}>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 13px', borderRadius:99,
              background:`linear-gradient(135deg,${palette.from},${palette.to})`, color:'#fff', letterSpacing:'0.03em' }}>
              {card.category}
            </span>
          </div>
          <div style={{ flex:1, overflow:'hidden auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontSize:16, fontWeight:700, color:C.text, textAlign:'center', lineHeight:1.6, fontFamily:'Nunito,sans-serif' }}>{card.front}</p>
          </div>
          <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', gap:7, marginTop:18 }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.indigo, display:'inline-block', animation:'pulse 2s ease-in-out infinite' }}/>
            <span style={{ fontSize:11, color:C.muted }}>Appuie pour révéler la réponse</span>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position:'absolute', inset:0, borderRadius:28,
          background:`linear-gradient(135deg,${palette.from},${palette.to})`,
          boxShadow:`inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 0 ${palette.dark}, 0 14px 36px ${palette.from}55`,
          backfaceVisibility:'hidden',
          transform:'rotateY(180deg)',
          display:'flex', flexDirection:'column', padding:'24px 24px',
          overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.12)', pointerEvents:'none' }}/>
          <div style={{ flexShrink:0, marginBottom:14 }}>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 13px', borderRadius:99, background:'rgba(255,255,255,0.25)', color:'#fff' }}>Réponse</span>
          </div>
          <div ref={backRef} onScroll={handleScroll} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
            <div style={{ margin:'auto 0', padding:'4px 0' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', textAlign:'center', lineHeight:1.6, whiteSpace:'pre-line' }}>{card.back}</p>
              {card.hint && <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', textAlign:'center', marginTop:12, fontStyle:'italic' }}>{card.hint}</p>}
            </div>
          </div>
          {needsScroll && !scrollDone && (
            <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', gap:4, marginTop:4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"
                style={{ opacity:0.7, animation:'bounce 1s ease-in-out infinite' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Défiler pour voir la suite</span>
            </div>
          )}
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.4)', textAlign:'center', marginTop:10, flexShrink:0 }}>Appuie pour revoir la question</p>
        </div>
      </div>
    </div>
  );
}

/* ─── OverviewGrid ───────────────────────────────────────────────────────── */
function OverviewGrid({ cards, currentIndex, unknownCards, onJumpTo, onClose }) {
  const unknownFronts = new Set(unknownCards.map(c => c.front));
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)',
        display:'flex', alignItems:'flex-end', justifyContent:'center', padding:16 }}
      onClick={onClose}>
      <motion.div initial={{ y:60, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:60, opacity:0 }}
        style={{ background:C.card, borderRadius:28, width:'100%', maxWidth:480, maxHeight:'80vh',
          overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:clay.card }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px 14px', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div>
            <h3 style={{ fontSize:15, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif' }}>Toutes les cartes</h3>
            <p style={{ fontSize:11, color:C.muted }}>{cards.length} cartes — appuie pour sauter</p>
          </div>
          <button onClick={onClose} style={{ width:34, height:34, borderRadius:11, background:C.bg, border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{ overflowY:'auto', padding:16 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {cards.map((card, i) => {
              const pal = PALETTE[i % PALETTE.length];
              const isDone    = i < currentIndex;
              const isCurrent = i === currentIndex;
              const isWrong   = unknownFronts.has(card.front);
              return (
                <motion.button key={card._id} onClick={() => onJumpTo(i)} whileTap={{ scale:0.96 }}
                  style={{ textAlign:'left', borderRadius:16, padding:'12px 14px',
                    border:`2px solid ${isCurrent ? C.indigo : isDone && isWrong ? '#fca5a5' : C.border}`,
                    background: isCurrent ? '#f0f0ff' : isDone && isWrong ? '#fff5f5' : C.card,
                    cursor:'pointer', boxShadow: isCurrent ? clay.sm : 'none',
                    opacity: isDone && !isWrong && !isCurrent ? 0.55 : 1, transition:'all 0.15s' }}>
                  <div style={{ height:3, borderRadius:99, marginBottom:10, background:`linear-gradient(90deg,${pal.from},${pal.to})` }}/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:C.muted }}>#{i+1}</span>
                    {isDone && !isWrong && <span style={{ fontSize:11, color:C.green, fontWeight:700 }}>✓</span>}
                    {isDone &&  isWrong && <span style={{ fontSize:11, color:C.red, fontWeight:700 }}>✗</span>}
                    {isCurrent && <span style={{ fontSize:10, fontWeight:700, color:C.indigo, background:'var(--theme-border)', padding:'2px 7px', borderRadius:99 }}>En cours</span>}
                  </div>
                  <p style={{ fontSize:11, fontWeight:600, color:C.text, lineHeight:1.4,
                    display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{card.front}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── SwipeGame ──────────────────────────────────────────────────────────── */
function SwipeGame({ cards, onExit, semester, ue, chapter, prevAttempt }) {
  const total = cards.length;
  const [currentIndex, setCurrentIndex] = useState(() =>
    prevAttempt?.status === 'in_progress' ? Math.min(prevAttempt.currentIndex, total - 1) : 0);
  const [flipped,      setFlipped]      = useState(false);
  const [known,        setKnown]        = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.known || 0) : 0);
  const [unknown,      setUnknown]      = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.unknown || 0) : 0);
  const [unknownCards, setUnknownCards] = useState(() => prevAttempt?.status === 'in_progress' ? (prevAttempt.unknownCards || []) : []);
  const [done,         setDone]         = useState(false);
  const [confirmExit,  setConfirmExit]  = useState(false);
  const [showOverview, setShowOverview] = useState(false);
  const [exitDir,      setExitDir]      = useState(null);

  const progress = (currentIndex / total) * 100;
  const card     = cards[currentIndex];
  const palette  = PALETTE[currentIndex % PALETTE.length];

  useEffect(() => { setFlipped(false); setExitDir(null); }, [currentIndex]);

  const persistProgress = useCallback(async (idx, k, u, uCards, status = 'in_progress') => {
    try {
      if (status === 'completed') {
        await axios.post(`${API_URL}/flashcards/attempt/complete`, { semester, ue, chapter, known: k, unknown: u, total, unknownCards: uCards });
      } else {
        await axios.put(`${API_URL}/flashcards/attempt`, { semester, ue, chapter, currentIndex: idx, known: k, unknown: u, total, unknownCards: uCards });
      }
    } catch {}
  }, [semester, ue, chapter, total]);

  const handleAnswer = useCallback((dir) => {
    if (!flipped) return;
    const isKnown = dir === 'right';
    const nk = isKnown ? known + 1 : known;
    const nu = isKnown ? unknown : unknown + 1;
    const nuc = isKnown ? unknownCards : [...unknownCards, { front: card.front, back: card.back }];
    setExitDir(dir);
    setKnown(nk); setUnknown(nu); setUnknownCards(nuc);
    setTimeout(() => {
      const next = currentIndex + 1;
      if (next >= total) { persistProgress(0, nk, nu, nuc, 'completed'); setDone(true); }
      else { setCurrentIndex(next); persistProgress(next, nk, nu, nuc); }
    }, 300);
  }, [flipped, currentIndex, total, known, unknown, unknownCards, card, persistProgress]);

  const handleRestart = () => {
    setCurrentIndex(0); setKnown(0); setUnknown(0);
    setUnknownCards([]); setDone(false); setFlipped(false); setExitDir(null);
    persistProgress(0, 0, 0, []);
  };

  /* ── Écran résultats ── */
  if (done) {
    const pct    = Math.round((known / total) * 100);
    const passed = pct >= 60;
    const ringColor = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red;
    return (
      <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <motion.div initial={{ opacity:0, y:20, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
          transition={{ type:'spring', stiffness:260, damping:22 }}
          style={{ background:C.card, borderRadius:32, padding:'28px 24px', width:'100%', maxWidth:420,
            boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}>

          {/* Score ring */}
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
              <span style={{ fontSize:26, fontWeight:900, color:ringColor, fontFamily:'Nunito,sans-serif' }}>{pct}%</span>
              <span style={{ fontSize:10, color:C.muted }}>{passed ? 'Réussi' : 'À revoir'}</span>
            </div>
          </div>

          <h2 style={{ fontSize:20, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:4 }}>
            {pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Bien joué !' : 'Continue à t\'entraîner !'}
          </h2>
          <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>{chapter}</p>

          {/* Stats */}
          <div style={{ display:'flex', borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:'16px 0', marginBottom:18 }}>
            {[{ n:known, l:'Connu', c:'#15803d' }, { n:unknown, l:'À revoir', c:C.red }, { n:total, l:'Total', c:C.text }].map((s, i) => (
              <div key={i} style={{ flex:1, textAlign:'center', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
                <p style={{ fontSize:28, fontWeight:900, color:s.c, fontFamily:'Nunito,sans-serif', lineHeight:1 }}>{s.n}</p>
                <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Dot strip */}
          <div style={{ display:'flex', gap:4, justifyContent:'center', flexWrap:'wrap', marginBottom:20 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ width:18, height:6, borderRadius:99, background: i < known ? C.green : C.red }}/>
            ))}
          </div>

          {/* Cartes à retravailler */}
          {unknownCards.length > 0 && (
            <div style={{ background:'#fff5f5', border:`1px solid #fecaca`, borderRadius:16, padding:'12px 16px', textAlign:'left', marginBottom:16 }}>
              <p style={{ fontSize:12, fontWeight:700, color:C.red, marginBottom:8 }}>
                {unknownCards.length} carte{unknownCards.length > 1 ? 's' : ''} à retravailler
              </p>
              <div style={{ maxHeight:130, overflowY:'auto', display:'flex', flexDirection:'column', gap:6 }}>
                {unknownCards.map((c, i) => (
                  <div key={i} style={{ background:'#fff', border:`1px solid #fecaca`, borderRadius:10, padding:'8px 12px' }}>
                    <p style={{ fontSize:11, fontWeight:700, color:'#7f1d1d', marginBottom:3 }}>{c.front}</p>
                    <p style={{ fontSize:11, color:C.indigo }}>{c.back}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <motion.button onClick={onExit} whileTap={{ scale:0.96 }}
              style={{ display:'block', width:'100%', padding:'13px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm, minWidth:0 }}>
              ← Retour
            </motion.button>
            <motion.button onClick={handleRestart} whileTap={{ scale:0.96 }}
              style={{ display:'block', width:'100%', padding:'13px 0', borderRadius:14, border:'none', background:`linear-gradient(135deg,#1e293b,#334155)`, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.btn('#334155','#0f172a'), minWidth:0 }}>
              Recommencer
            </motion.button>
          </div>
        </motion.div>
      </main>
    );
  }

  /* ── Jeu en cours ── */
  return (
    <>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{ opacity:.45 } 50%{ opacity:1 } }
        @keyframes bounce{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-4px) } }
      `}</style>

      <AnimatePresence>
        {showOverview && (
          <OverviewGrid cards={cards} currentIndex={currentIndex} unknownCards={unknownCards}
            onJumpTo={i => { setCurrentIndex(i); setShowOverview(false); }}
            onClose={() => setShowOverview(false)}/>
        )}
      </AnimatePresence>

      {/* Confirm exit */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)',
              display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              transition={{ type:'spring', stiffness:280, damping:24 }}
              style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:360, boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}>
              <div style={{ width:52, height:52, borderRadius:18, background:'#fef9c3', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <h3 style={{ fontSize:16, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>Quitter les flashcards ?</h3>
              <p style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Ta progression est <strong style={{ color:C.indigo }}>automatiquement sauvegardée</strong>.</p>
              <p style={{ fontSize:12, color:C.muted, marginBottom:24 }}>Tu pourras reprendre à la carte {currentIndex + 1} la prochaine fois.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <motion.button onClick={() => setConfirmExit(false)} whileTap={{ scale:0.96 }}
                  style={{ display:'block', width:'100%', padding:'12px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm, minWidth:0 }}>
                  Continuer
                </motion.button>
                <motion.button onClick={onExit} whileTap={{ scale:0.96 }}
                  style={{ display:'block', width:'100%', padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.btn(), minWidth:0 }}>
                  Quitter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ flex:1, overflowY:'auto', background:C.bg }}>
        {/* Header sticky */}
        <div style={{ position:'sticky', top:0, zIndex:10, background:C.card, borderBottom:`1px solid ${C.border}`, padding:'12px 20px 10px', boxShadow:clay.sm }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <p style={{ fontSize:11, color:C.muted, marginBottom:1 }}>{chapter}</p>
              <p style={{ fontSize:13, fontWeight:700, color:C.text }}>Carte {currentIndex + 1} / {total}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginRight:4 }}>
                <span style={{ fontSize:12, fontWeight:800, color:C.green }}>✓ {known}</span>
                <span style={{ fontSize:12, fontWeight:800, color:C.red }}>✗ {unknown}</span>
              </div>
              <button onClick={() => setShowOverview(true)}
                style={{ width:36, height:36, borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
              </button>
              <button onClick={() => setConfirmExit(true)}
                style={{ width:36, height:36, borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.muted }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ height:6, borderRadius:99, background:C.border, overflow:'hidden' }}>
            <motion.div style={{ height:'100%', borderRadius:99, background:'linear-gradient(90deg,var(--theme-primary),var(--theme-secondary))' }}
              animate={{ width:`${progress}%` }} transition={{ duration:0.4 }}/>
          </div>
        </div>

        {/* Carte + boutons */}
        <div style={{ maxWidth:520, margin:'0 auto', padding:'24px 16px 32px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={currentIndex}
              initial={{ opacity:0, x: exitDir === 'right' ? -40 : 40 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x: exitDir === 'right' ? 40 : -40 }}
              transition={{ duration:0.25 }}>
              <FlashCard card={card} palette={palette} flipped={flipped} onFlip={() => setFlipped(f => !f)}/>
            </motion.div>
          </AnimatePresence>

          {!flipped && (
            <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ textAlign:'center', fontSize:12, color:C.muted, marginTop:16 }}>
              Appuie sur la carte pour voir la réponse
            </motion.p>
          )}

          <AnimatePresence>
            {flipped && (
              <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:14 }}
                transition={{ duration:0.2 }}
                style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:20 }}>
                <motion.button onClick={() => handleAnswer('left')} whileTap={{ scale:0.96 }}
                  style={{ padding:'15px 0', borderRadius:16, border:`2px solid #fca5a5`, background:'#fff',
                    color:C.red, fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:clay.sm,
                    display:'flex', alignItems:'center', justifyContent:'center', gap:7, minWidth:0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  Je ne savais pas
                </motion.button>
                <motion.button onClick={() => handleAnswer('right')} whileTap={{ scale:0.96 }}
                  style={{ padding:'15px 0', borderRadius:16, border:'none',
                    background:`linear-gradient(135deg,${C.green},#059669)`, color:'#fff',
                    fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:clay.btn(C.green,'#065f46'),
                    display:'flex', alignItems:'center', justifyContent:'center', gap:7, minWidth:0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Je savais !
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
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
  const [chapterAttempt,   setChapterAttempt]   = useState(null);
  const [resumeModal,      setResumeModal]      = useState(false);
  const [errorsModal,      setErrorsModal]      = useState(false);

  useEffect(() => {
    const cached = getCache('flashcards_list');
    if (cached) { setCards(cached); setLoading(false); }
    Promise.all([
      axios.get(`${API_URL}/flashcards`),
      axios.get(`${API_URL}/flashcards/attempts`).catch(() => ({ data: [] })),
    ]).then(([cr, ar]) => {
      setCards(cr.data); setCache('flashcards_list', cr.data); setAttempts(ar.data);
    }).finally(() => setLoading(false));
  }, []);

  const attemptMap = {};
  attempts.forEach(a => { attemptMap[`${a.semester}|${a.ue}|${a.chapter}`] = a; });

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
  const chapters     = selectedSemester && selectedUE ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentCards = selectedSemester && selectedUE && selectedChapter
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE    = selectedSemester && selectedUE
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalCards   = cards.length;

  const handleChapterClick = (chap) => {
    setSelectedChapter(chap);
    const a = attemptMap[`${selectedSemester}|${selectedUE}|${chap}`];
    setChapterAttempt(a || null);
    if (a?.status === 'in_progress')  { setResumeModal(true); }
    else if (a?.status === 'completed') { setErrorsModal(true); }
    else { setView('cards'); }
  };

  const checkQuota = async () => {
    if (!isFree) return true;
    try {
      const { data } = await axios.get(`${API_URL}/flashcards/quota`, { headers: { Authorization: `Bearer ${token}` } });
      if (data.exceeded) { setQuotaModal(true); return false; }
    } catch {}
    return true;
  };

  const handleStart = async () => {
    const ok = await checkQuota();
    if (!ok) return;
    setResumeModal(false); setErrorsModal(false); setChapterAttempt(null); setView('cards');
  };

  const handleResume = async () => {
    const ok = await checkQuota();
    if (!ok) return;
    setResumeModal(false); setView('cards');
  };

  const handleExit = () => {
    axios.get(`${API_URL}/flashcards/attempts`).then(r => setAttempts(r.data)).catch(() => {});
    setView('chapters'); setChapterAttempt(null);
  };

  /* ── Loading ── */
  if (loading) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <div style={{ width:44, height:44, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </DashboardLayout>
  );

  /* ── Mode jeu ── */
  if (view === 'cards' && selectedSemester && selectedUE && selectedChapter) {
    return (
      <DashboardLayout>
        <SwipeGame key={`${selectedChapter}-${chapterAttempt?.status}`}
          cards={currentCards} onExit={handleExit}
          semester={selectedSemester} ue={selectedUE} chapter={selectedChapter}
          prevAttempt={chapterAttempt}/>
      </DashboardLayout>
    );
  }

  /* ── Modal : session en cours ── */
  if (resumeModal && chapterAttempt) {
    const a   = chapterAttempt;
    const tot = currentCards.length || a.total;
    const pct = tot ? Math.round((a.currentIndex / tot) * 100) : 0;
    return (
      <DashboardLayout>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}>
            <div style={{ width:52, height:52, borderRadius:18, background:'#fef9c3', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h2 style={{ fontSize:18, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:6 }}>Session en cours</h2>
            <p style={{ fontSize:13, color:C.muted, marginBottom:20 }}>
              Tu t'étais arrêté à la carte <strong style={{ color:C.text }}>{a.currentIndex + 1}/{tot}</strong>
            </p>
            <div style={{ height:8, borderRadius:99, background:C.border, overflow:'hidden', marginBottom:6 }}>
              <div style={{ height:'100%', width:`${pct}%`, background:`linear-gradient(90deg,${C.amber},#f97316)`, borderRadius:99, transition:'width 0.8s ease' }}/>
            </div>
            <p style={{ fontSize:11, color:C.muted, marginBottom:24 }}>{pct}% complété · {a.known} connu · {a.unknown} à revoir</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <motion.button onClick={handleResume} whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'14px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn(), display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                Reprendre où je me suis arrêté
              </motion.button>
              <motion.button onClick={handleStart} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'13px 0', borderRadius:16, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                Recommencer depuis le début
              </motion.button>
              <button onClick={() => { setResumeModal(false); setSelectedChapter(null); }}
                style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, color:C.muted, marginTop:4 }}>
                ← Retour aux chapitres
              </button>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Modal : chapitre terminé ── */
  if (errorsModal && chapterAttempt) {
    const a      = chapterAttempt;
    const tot    = a.total || currentCards.length;
    const pct    = tot ? Math.round((a.known / tot) * 100) : 0;
    const ringColor = pct >= 80 ? C.green : pct >= 60 ? C.amber : C.red;
    return (
      <DashboardLayout>
        <main style={{ flex:1, overflowY:'auto', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
          <motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }}
            transition={{ type:'spring', stiffness:280, damping:24 }}
            style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:440, boxShadow:clay.card, border:`1px solid ${C.border}` }}>

            <div style={{ textAlign:'center', marginBottom:20 }}>
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
                  <span style={{ fontSize:20, fontWeight:900, color:ringColor, fontFamily:'Nunito,sans-serif' }}>{pct}%</span>
                </div>
              </div>
              <h2 style={{ fontSize:18, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:4 }}>Dernière session</h2>
              <p style={{ fontSize:12, color:C.muted }}>{a.known} connu · {a.unknown} à revoir · {tot} cartes</p>
            </div>

            {(a.unknownCards || []).length > 0 ? (
              <div style={{ marginBottom:20 }}>
                <p style={{ fontSize:11, fontWeight:700, color:C.red, marginBottom:10, textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  {a.unknownCards.length} carte{a.unknownCards.length > 1 ? 's' : ''} à retravailler
                </p>
                <div style={{ maxHeight:160, overflowY:'auto', display:'flex', flexDirection:'column', gap:8 }}>
                  {a.unknownCards.map((c, i) => (
                    <div key={i} style={{ background:'#fff5f5', border:`1px solid #fecaca`, borderRadius:12, padding:'10px 14px' }}>
                      <p style={{ fontSize:11, fontWeight:700, color:'#7f1d1d', marginBottom:4 }}>{c.front}</p>
                      <p style={{ fontSize:11, color:C.indigo }}>{c.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ background:'#f0fdf4', border:`1px solid #bbf7d0`, borderRadius:16, padding:'14px', textAlign:'center', marginBottom:20 }}>
                <p style={{ fontSize:13, fontWeight:700, color:'#15803d' }}>Tu savais toutes les cartes ! 🎉</p>
              </div>
            )}

            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <motion.button onClick={handleStart} whileHover={{ scale:1.02 }} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'14px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn() }}>
                Refaire ce chapitre
              </motion.button>
              <motion.button onClick={() => { setErrorsModal(false); setSelectedChapter(null); }} whileTap={{ scale:0.96 }}
                style={{ width:'100%', padding:'13px 0', borderRadius:16, border:`1.5px solid ${C.border}`, background:C.bg, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                ← Retour aux chapitres
              </motion.button>
            </div>
          </motion.div>
        </main>
      </DashboardLayout>
    );
  }

  /* ── Navigation principale ── */
  return (
    <DashboardLayout>
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{ opacity:.45 } 50%{ opacity:1 } }
        @keyframes bounce{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-4px) } }
      `}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* Quota modal */}
        <AnimatePresence>
          {quotaModal && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              style={{ position:'fixed', inset:0, zIndex:50, background:'rgba(15,23,42,0.5)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
              onClick={() => setQuotaModal(false)}>
              <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
                transition={{ type:'spring', stiffness:280, damping:24 }}
                style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:360, boxShadow:clay.card, border:`1px solid ${C.border}`, textAlign:'center' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ width:56, height:56, borderRadius:20, background:'#fef9c3', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
                </div>
                <h3 style={{ fontSize:17, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:8 }}>Quota mensuel atteint</h3>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:24 }}>
                  Vous avez utilisé vos <strong style={{ color:C.text }}>20 flashcards gratuites</strong> ce mois-ci.<br/>
                  Passez à l'abonnement Étudiant pour des flashcards illimitées.
                </p>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                    onClick={() => navigate('/dashboard/subscription')}
                    style={{ width:'100%', padding:'14px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:clay.btn() }}>
                    Voir les abonnements
                  </motion.button>
                  <button onClick={() => setQuotaModal(false)}
                    style={{ width:'100%', padding:'12px 0', borderRadius:16, border:'none', background:'none', fontSize:13, fontWeight:600, color:C.muted, cursor:'pointer' }}>
                    Plus tard
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter:'blur(40px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:60, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.08),transparent)', filter:'blur(32px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'relative', padding:'28px 24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="3" width="9" height="13" rx="2"/><rect x="13" y="8" width="9" height="13" rx="2"/>
                  <path d="M7 16v2m10-8v2"/>
                </svg>
              </div>
              <div>
                <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:'Nunito,sans-serif', lineHeight:1.1 }}>Flashcards</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Mémorisez les notions clés</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:20, marginTop:18 }}>
              {[
                { n: totalCards, l:'Cartes', c:'#fff' },
                { n: semesters.length, l:'Semestres', c:'#c4b5fd' },
                { n: attempts.filter(a => a.status === 'completed').length, l:'Terminés', c:'#6ee7b7' },
              ].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:'Nunito,sans-serif', lineHeight:1 }}>{s.n}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'24px 16px' }}>
          <AnimatePresence mode="wait">

            {/* SEMESTRES */}
            {view === 'semesters' && (
              <motion.div key="sems" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.28 }}>
                {semesters.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'60px 20px', color:C.muted }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="1.5" strokeLinecap="round" style={{ margin:'0 auto 16px', display:'block' }}>
                      <rect x="2" y="3" width="9" height="13" rx="2"/><rect x="13" y="8" width="9" height="13" rx="2"/>
                    </svg>
                    <p style={{ fontWeight:700, color:C.text, marginBottom:4 }}>Aucune flashcard disponible</p>
                    <p style={{ fontSize:13 }}>Les cartes apparaîtront ici dès qu'elles seront ajoutées.</p>
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
                    {semesters.map((sem, idx) => {
                      const pal       = PALETTE[idx % PALETTE.length];
                      const ueCount   = Object.keys(structure[sem]).length;
                      const total     = Object.values(structure[sem]).flatMap(u => Object.values(u)).flat().length;
                      const doneCount = attempts.filter(a => a.semester === sem && a.status === 'completed').length;
                      return (
                        <motion.div key={sem} initial={{ opacity:0, y:18, scale:0.94 }} animate={{ opacity:1, y:0, scale:1 }}
                          transition={{ type:'spring', stiffness:280, damping:24, delay: idx*0.05 }}>
                          <GradCard pal={pal}
                            onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                            title={sem}
                            sub={`${ueCount} UE · ${total} carte${total>1?'s':''}`}
                            sub2={doneCount > 0 ? `✓ ${doneCount} chapitre${doneCount>1?'s':''} terminé${doneCount>1?'s':''}` : null}
                            progress={total > 0 ? (doneCount / Object.values(structure[sem]).flatMap(u => Object.keys(u)).length) * 100 : null}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* UEs */}
            {view === 'ues' && selectedSemester && (
              <motion.div key="ues" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.28 }}>
                <Breadcrumb items={[
                  { label:'Flashcards', onClick:() => { setSelectedSemester(null); setView('semesters'); } },
                  { label:selectedSemester },
                ]}/>
                <div style={{ marginBottom:20 }}>
                  <h2 style={{ fontSize:20, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif' }}>{selectedSemester}</h2>
                  <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>{ues.length} unité{ues.length>1?'s':''} d'enseignement</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
                  {ues.map((ue, idx) => {
                    const pal       = PALETTE[idx % PALETTE.length];
                    const total     = Object.values(structure[selectedSemester][ue]).flat().length;
                    const chCount   = Object.keys(structure[selectedSemester][ue]).length;
                    const doneCount = Object.keys(structure[selectedSemester][ue]).filter(ch =>
                      attemptMap[`${selectedSemester}|${ue}|${ch}`]?.status === 'completed').length;
                    return (
                      <motion.div key={ue} initial={{ opacity:0, y:18, scale:0.94 }} animate={{ opacity:1, y:0, scale:1 }}
                        transition={{ type:'spring', stiffness:280, damping:24, delay: idx*0.055 }}>
                        <GradCard pal={pal}
                          onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                          title={ue}
                          sub={`${chCount} chapitre${chCount>1?'s':''} · ${total} carte${total>1?'s':''}`}
                          sub2={doneCount > 0 ? `✓ ${doneCount}/${chCount} terminé${doneCount>1?'s':''}` : null}
                          progress={chCount > 0 ? (doneCount/chCount)*100 : null}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* CHAPITRES */}
            {view === 'chapters' && selectedSemester && selectedUE && (
              <motion.div key="chaps" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.28 }}>
                <Breadcrumb items={[
                  { label:'Flashcards', onClick:() => { setSelectedSemester(null); setSelectedUE(null); setView('semesters'); } },
                  { label:selectedSemester, onClick:() => { setSelectedUE(null); setView('ues'); } },
                  { label:selectedUE },
                ]}/>
                <div style={{ marginBottom:20 }}>
                  <h2 style={{ fontSize:20, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif' }}>{selectedUE}</h2>
                  <p style={{ fontSize:13, color:C.muted, marginTop:2 }}>{totalInUE} carte{totalInUE>1?'s':''} disponible{totalInUE>1?'s':''}</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                  {chapters.map((chap, idx) => {
                    const pal         = PALETTE[idx % PALETTE.length];
                    const count       = structure[selectedSemester][selectedUE][chap].length;
                    const a           = attemptMap[`${selectedSemester}|${selectedUE}|${chap}`];
                    const isDone      = a?.status === 'completed';
                    const isProgress  = a?.status === 'in_progress';
                    const pct         = isDone && a.total ? Math.round((a.known / a.total) * 100) : null;
                    const progressPct = isProgress && count ? Math.round((a.currentIndex / count) * 100) : null;

                    return (
                      <motion.div key={chap} style={{ display:'flex' }}
                        initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                        transition={{ duration:0.3, ease:[0.16,1,0.3,1], delay: idx*0.05 }}>
                        <motion.button onClick={() => handleChapterClick(chap)}
                          whileHover={{ y:-3, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 0 rgba(0,0,0,0.06), 0 20px 40px rgba(var(--theme-primary-rgb),0.14)` }}
                          whileTap={{ scale:0.98 }}
                          style={{ flex:1, width:'100%', textAlign:'left', border:`1px solid ${C.border}`, cursor:'pointer', borderRadius:18, overflow:'hidden', background:C.card, boxShadow:clay.card, padding:0, transition:'box-shadow 0.2s' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px' }}>
                            <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${pal.from},${pal.to})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 10px ${pal.from}44` }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                <rect x="2" y="3" width="9" height="13" rx="2"/><rect x="13" y="8" width="9" height="13" rx="2"/>
                              </svg>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 }}>
                                <span style={{ fontSize:13, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif' }}>{chap}</span>
                                {isDone && (
                                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99,
                                    background: pct >= 60 ? '#dcfce7' : '#ffedd5',
                                    color: pct >= 60 ? '#15803d' : '#9a3412', flexShrink:0 }}>
                                    {pct >= 60 ? '✓' : '△'} {a.known}/{a.total}
                                  </span>
                                )}
                                {isProgress && (
                                  <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:'#fef9c3', color:'#92400e', flexShrink:0 }}>
                                    ● {a.currentIndex}/{count}
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize:11, color:C.muted }}>{count} carte{count>1?'s':''}</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                          </div>
                          {isDone && pct != null && (
                            <div style={{ height:4, background:'var(--theme-border)' }}>
                              <div style={{ height:'100%', width:`${pct}%`, background: pct >= 60 ? `linear-gradient(90deg,${C.green},#34d399)` : `linear-gradient(90deg,${C.amber},#f97316)`, transition:'width 0.8s ease' }}/>
                            </div>
                          )}
                          {isProgress && progressPct != null && (
                            <div style={{ height:4, background:'var(--theme-border)' }}>
                              <div style={{ height:'100%', width:`${progressPct}%`, background:`linear-gradient(90deg,${C.amber},#f97316)`, transition:'width 0.8s ease' }}/>
                            </div>
                          )}
                        </motion.button>
                      </motion.div>
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
