/**
 * Dashboard — Clay 3D Light
 * Design System: Claymorphism × Linear sophistication
 * Audience: 18-25 ans, étudiants IFSI
 * Fonts: Nunito (headings) + DM Sans (body)
 * Colors: Indigo #4F46E5 · Violet #7C3AED · Teal #0891b2 · Pink #EC4899
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const C = {
  bg:       '#EEF2FF',
  card:     '#FFFFFF',
  text:     '#1e1b4b',
  muted:    '#6b7280',
  border:   '#e0e7ff',
  indigo:   '#4F46E5',
  violet:   '#7C3AED',
  teal:     '#0891b2',
  pink:     '#EC4899',
  amber:    '#F59E0B',
  green:    '#10B981',
  red:      '#DC2626',
  orange:   '#EA580C',
};

/* Clay shadows */
const clay = {
  card: `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 0 rgba(0,0,0,0.06), 0 12px 28px rgba(79,70,229,0.08), 0 24px 48px rgba(0,0,0,0.04)`,
  sm:   `inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07)`,
  btn:  (hex) => `inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(0,0,0,0.18), 0 4px 0 ${hex}cc, 0 8px 20px ${hex}44`,
  pressed: `inset 0 2px 6px rgba(0,0,0,0.15), 0 1px 0 rgba(0,0,0,0.08)`,
};

/* ─── Animated counter ────────────────────────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      let cur = 0;
      const id = setInterval(() => {
        cur = Math.min(cur + target / 50, target);
        setVal(Math.round(cur));
        if (cur >= target) clearInterval(id);
      }, 18);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

/* ─── 3D Tilt ─────────────────────────────────────────────────────────────── */
function Tilt3D({ children, style = {}, className = '', scale = 1.02, depth = 8 }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useTransform(my, [-0.5, 0.5], [depth, -depth]);
  const rotY = useTransform(mx, [-0.5, 0.5], [-depth, depth]);
  const sX = useSpring(rotX, { stiffness: 280, damping: 24 });
  const sY = useSpring(rotY, { stiffness: 280, damping: 24 });

  return (
    <div style={{ perspective: 1000 }}>
      <motion.div
        style={{ rotateX: sX, rotateY: sY, ...style }}
        className={className}
        whileHover={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onMouseMove={e => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onMouseLeave={() => { mx.set(0); my.set(0); }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Clay Card ───────────────────────────────────────────────────────────── */
function Card({ children, style = {}, className = '' }) {
  return (
    <div
      className={className}
      style={{ background: C.card, borderRadius: 28, boxShadow: clay.card, border: `1px solid ${C.border}`, ...style }}
    >
      {children}
    </div>
  );
}

/* ─── Horizontal progress bar (clay inset) ────────────────────────────────── */
function ProgressBar({ value, max, color, label, sublabel }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const done = value >= max && max > 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: 'Nunito, sans-serif' }}>{label}</span>
          {sublabel && <span style={{ fontSize: 11, color: C.muted, marginLeft: 6 }}>{sublabel}</span>}
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: done ? C.green : color, fontVariantNumeric: 'tabular-nums' }}>
          {done ? '✓' : `${value}/${max}`}
        </span>
      </div>
      <div style={{ height: 10, borderRadius: 99, background: '#e0e7ff', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ height: '100%', borderRadius: 99, background: done ? C.green : `linear-gradient(90deg, ${color}, ${color}bb)`, boxShadow: `0 2px 6px ${color}55` }}
        />
      </div>
    </div>
  );
}

/* ─── SVG Icons ───────────────────────────────────────────────────────────── */
const Icon = {
  quiz:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><circle cx="12" cy="17" r=".6" fill="currentColor"/></svg>,
  flash:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
  exo:     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
  star:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  book:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  annale:  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
  pill:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2"/><circle cx="17" cy="17" r="5"/><path d="m14.5 19.5 5-5"/></svg>,
  group:   <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  card:    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
  fire:    <svg width="20" height="20" viewBox="0 0 24 24" fill="#f97316"><path d="M12 2c0 0-4 5.5-4 9.5a4 4 0 0 0 8 0C16 7.5 12 2 12 2z"/><path d="M12 13c0 0-1.5 1.5-1.5 3a1.5 1.5 0 0 0 3 0C13.5 14.5 12 13 12 13z" fill="#fde68a"/></svg>,
  bulb:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6H8.3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z"/></svg>,
  edit:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  close:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  arrow:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

const TIPS = [
  "La répétition espacée augmente la mémorisation de 200 %. Révise tes flashcards chaque jour, même 5 minutes.",
  "Avant une garde, relis les valeurs normales des constantes vitales : elles reviennent souvent aux examens.",
  "Les cas cliniques IFSI testent ton raisonnement clinique. Explique toujours ton pourquoi.",
  "Groupe tes révisions par UE : la cohérence thématique ancre mieux les notions dans ta mémoire.",
];

const spring = { type: 'spring', stiffness: 300, damping: 24 };
const fade = (delay = 0) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay } });

/* ════════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const p = user?.progress || {};

  const [greeting,      setGreeting]      = useState('');
  const [streak,        setStreak]        = useState(p.streak || 0);
  const [weeklyData,    setWeeklyData]    = useState([0,0,0,0,0,0,0]);
  const [tipIdx,        setTipIdx]        = useState(0);
  const [dailyGoals,    setDailyGoals]    = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [dailyProgress, setDailyProgress] = useState({ quiz: 0, flashcards: 0, exercises: 0 });
  const [showModal,     setShowModal]     = useState(false);
  const [editGoals,     setEditGoals]     = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir');
  }, []);

  useEffect(() => {
    if (!token) return;
    axios.post(`${API_URL}/auth/ping`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (typeof res.data.streak === 'number') setStreak(res.data.streak);
        if (Array.isArray(res.data.weeklyActivity)) setWeeklyData(res.data.weeklyActivity);
        refreshUser();
      }).catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/auth/daily`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { setDailyGoals(res.data.goals); setDailyProgress(res.data.daily); setEditGoals(res.data.goals); })
      .catch(() => {});
  }, [token]); // eslint-disable-line

  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  const quizVal  = useCounter(p.quizCompleted      || 0,  60);
  const flashVal = useCounter(p.flashcardsReviewed || 0, 120);
  const exercVal = useCounter(p.exercisesCompleted || 0, 180);
  const scoreVal = useCounter(p.totalScore         || 0, 240);

  const SUB = {
    free:    { label: 'Gratuit', bg: '#f1f5f9', color: C.muted },
    pro:     { label: 'Pro',     bg: C.indigo,  color: '#fff'  },
    premium: { label: 'Elite',   bg: `linear-gradient(135deg,${C.amber},${C.orange})`, color: '#fff' },
  };
  const sub = SUB[user?.subscription] || SUB.free;

  const todayStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const today = todayStr.charAt(0).toUpperCase() + todayStr.slice(1);

  const STATS = [
    { label: 'Quiz complétés',   val: quizVal,  color: C.indigo, bg: '#eef2ff', icon: Icon.quiz  },
    { label: 'Flashcards',       val: flashVal, color: C.violet, bg: '#f5f3ff', icon: Icon.flash },
    { label: 'Exercices',        val: exercVal, color: C.teal,   bg: '#ecfeff', icon: Icon.exo   },
    { label: 'Points gagnés',    val: scoreVal, color: C.amber,  bg: '#fffbeb', icon: Icon.star  },
  ];

  const GOALS = [
    { label: 'Quiz',       sublabel: `objectif ${dailyGoals.quizPerDay}`,       value: Math.min(dailyProgress.quiz, dailyGoals.quizPerDay),             max: dailyGoals.quizPerDay,       color: C.indigo },
    { label: 'Flashcards', sublabel: `objectif ${dailyGoals.flashcardsPerDay}`,  value: Math.min(dailyProgress.flashcards, dailyGoals.flashcardsPerDay), max: dailyGoals.flashcardsPerDay, color: C.violet },
    { label: 'Exercices',  sublabel: `objectif ${dailyGoals.exercisesPerDay}`,   value: Math.min(dailyProgress.exercises, dailyGoals.exercisesPerDay),   max: dailyGoals.exercisesPerDay,  color: C.teal   },
  ];

  const ACTIONS = [
    { to: '/dashboard/quiz',         label: 'Quiz',        desc: 'QCM & questions',       icon: Icon.quiz,   grad: `135deg, #4338ca, ${C.indigo}`, color: C.indigo  },
    { to: '/dashboard/flashcards',   label: 'Flashcards',  desc: 'Mémorisation rapide',   icon: Icon.flash,  grad: `135deg, #6d28d9, ${C.violet}`, color: C.violet  },
    { to: '/dashboard/exercises',    label: 'Exercices',   desc: 'Cas cliniques',         icon: Icon.exo,    grad: `135deg, #0e7490, ${C.teal}`,   color: C.teal    },
    { to: '/dashboard/cours',        label: 'Cours',       desc: 'Leçons & fiches',       icon: Icon.book,   grad: `135deg, #15803d, #10b981`,     color: '#10b981' },
    { to: '/dashboard/annales',      label: 'Annales',     desc: 'Sujets passés',         icon: Icon.annale, grad: `135deg, #1d4ed8, #3b82f6`,     color: '#3b82f6' },
    { to: '/dashboard/medicaments',  label: 'Médicaments', desc: 'Base pharma',           icon: Icon.pill,   grad: `135deg, #b91c1c, ${C.red}`,    color: C.red     },
    { to: '/dashboard/groups',       label: 'Groupes',     desc: 'Réviser ensemble',      icon: Icon.group,  grad: `135deg, #c2410c, ${C.orange}`, color: C.orange  },
    { to: '/dashboard/subscription', label: 'Abonnement',  desc: 'Gérer mon offre',       icon: Icon.card,   grad: `135deg, #be185d, ${C.pink}`,   color: C.pink    },
  ];

  async function saveGoals() {
    setSaving(true);
    try {
      await axios.put(`${API_URL}/auth/goals`, editGoals, { headers: { Authorization: `Bearer ${token}` } });
      setDailyGoals({ ...editGoals });
      setShowModal(false);
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  return (
    <DashboardLayout>

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-20px,14px) scale(1.05)} 70%{transform:translate(14px,-18px) scale(0.97)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0)} 50%{transform:translate(18px,-12px)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-10px,20px) scale(1.04)} 66%{transform:translate(16px,6px)} }
        * { font-family: 'DM Sans', system-ui, sans-serif; }
        h1,h2,h3,.nunito { font-family: 'Nunito', sans-serif !important; }
      `}</style>

      <main style={{ flex: 1, overflowY: 'auto', background: C.bg, position: 'relative' }}>

        {/* ── Ambient blobs ───────────────────────────────────────────────── */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }} aria-hidden>
          <div style={{ position:'absolute', width:500, height:500, top:-100, right:-80, borderRadius:'50%', background:'radial-gradient(circle,rgba(79,70,229,0.10),transparent 70%)', filter:'blur(30px)', animation:'floatA 20s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:350, height:350, bottom:80, left:-60, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,0.08),transparent 70%)', filter:'blur(30px)', animation:'floatB 24s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', width:280, height:280, top:'45%', left:'40%', borderRadius:'50%', background:'radial-gradient(circle,rgba(124,58,237,0.06),transparent 70%)', filter:'blur(40px)', animation:'floatC 28s ease-in-out infinite' }}/>
        </div>

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1152, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* ── HERO ──────────────────────────────────────────────────────── */}
          <motion.div {...fade(0)}>
            <Card style={{ padding: '32px 36px', background: 'linear-gradient(135deg, #4338ca 0%, #7C3AED 50%, #EC4899 100%)', border: 'none', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 0 rgba(67,56,202,0.4), 0 20px 40px rgba(79,70,229,0.35)`, position: 'relative', overflow: 'hidden' }}>
              {/* Shine overlay */}
              <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.15), transparent 60%)', pointerEvents:'none' }} aria-hidden/>
              {/* Grid texture */}
              <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>

              <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                <div>
                  <p style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.65)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:6 }}>{today}</p>
                  <h1 className="nunito" style={{ fontSize:36, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:6 }}>
                    {greeting}, {user?.name?.split(' ')[0] || 'Étudiant'} 👋
                  </h1>
                  <p style={{ fontSize:14, color:'rgba(255,255,255,0.72)', marginBottom:16 }}>Prêt à décrocher ton concours IFSI ?</p>

                  {/* Stats pills row */}
                  <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {/* Streak pill */}
                    <motion.div
                      initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      transition={{ delay:0.4, ...spring }}
                      style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:999, padding:'7px 16px' }}
                    >
                      {Icon.fire}
                      <span style={{ fontSize:14, fontWeight:800, color:'#fff', fontFamily:'Nunito,sans-serif' }}>{streak}</span>
                      <span style={{ fontSize:12, color:'rgba(255,255,255,0.75)' }}>jours de suite</span>
                    </motion.div>
                    {/* Sub badge */}
                    <motion.div
                      initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      transition={{ delay:0.5, ...spring }}
                      style={{ display:'inline-flex', alignItems:'center', background:'rgba(255,255,255,0.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:999, padding:'7px 16px', fontSize:12, fontWeight:700, color:'#fff' }}
                    >
                      {sub.label}
                    </motion.div>
                  </div>
                </div>

                {/* Weekly activity */}
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600, textAlign:'right' }}>Cette semaine</p>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:5, height:48 }}>
                    {['L','M','M','J','V','S','D'].map((day, i) => {
                      const maxV = Math.max(...weeklyData, 1);
                      const h = Math.round((weeklyData[i] / maxV) * 100);
                      const isToday = i === (new Date().getDay() + 6) % 7;
                      return (
                        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                          <motion.div
                            initial={{ height:0 }} animate={{ height:`${Math.max(h,8)}%` }}
                            transition={{ delay:0.3 + i*0.05, duration:0.6, ease:[0.16,1,0.3,1] }}
                            style={{ width:isToday?10:7, borderRadius:4, minHeight:4, background:isToday?'#fff':'rgba(255,255,255,0.3)' }}
                            title={`${weeklyData[i]}`}
                          />
                          <span style={{ fontSize:9, color:isToday?'#fff':'rgba(255,255,255,0.45)', fontWeight:isToday?700:400 }}>{day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── STAT CARDS ────────────────────────────────────────────────── */}
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.08, delayChildren:0.1 } } }}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:14 }}
          >
            {STATS.map((s, i) => (
              <motion.div key={i} variants={{ hidden:{ opacity:0, y:20, scale:0.96 }, show:{ opacity:1, y:0, scale:1, transition:{ duration:0.45, ease:[0.16,1,0.3,1] } } }}>
                <Tilt3D depth={6}>
                  <Card style={{ padding:'22px 24px', cursor:'default' }}>
                    {/* Colored top bar */}
                    <div style={{ height:4, borderRadius:99, background:`linear-gradient(90deg, ${s.color}, ${s.color}88)`, marginBottom:16 }}/>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                      <div style={{ width:42, height:42, borderRadius:14, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, boxShadow:clay.sm }}>
                        {s.icon}
                      </div>
                      <motion.div
                        initial={{ scale:0 }} animate={{ scale:1 }}
                        transition={{ delay:0.3+i*0.07, ...spring }}
                        style={{ width:10, height:10, borderRadius:'50%', background:s.color, boxShadow:`0 0 12px ${s.color}` }}
                      />
                    </div>
                    <p className="nunito" style={{ fontSize:34, fontWeight:900, color:C.text, lineHeight:1, fontVariantNumeric:'tabular-nums', marginBottom:4 }}>{s.val}</p>
                    <p style={{ fontSize:12, color:C.muted, fontWeight:500 }}>{s.label}</p>
                  </Card>
                </Tilt3D>
              </motion.div>
            ))}
          </motion.div>

          {/* ── MAIN GRID ─────────────────────────────────────────────────── */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }} className="dashboard-grid">
            <style>{`.dashboard-grid { @media(max-width:900px){ grid-template-columns:1fr !important; } }`}</style>

            {/* LEFT */}
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {/* Daily goals */}
              <motion.div {...fade(0.2)}>
                <Card style={{ padding:'26px 28px' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
                    <div>
                      <h2 className="nunito" style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:2 }}>Objectifs du jour</h2>
                      <p style={{ fontSize:12, color:C.muted }}>Tes cibles quotidiennes</p>
                    </div>
                    <motion.button
                      whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
                      onClick={() => { setEditGoals({ ...dailyGoals }); setShowModal(true); }}
                      style={{ display:'flex', alignItems:'center', gap:5, background:C.bg, border:`1px solid ${C.border}`, borderRadius:12, padding:'8px 14px', cursor:'pointer', color:C.muted, fontSize:12, fontWeight:600, boxShadow:clay.sm }}
                      aria-label="Modifier les objectifs"
                    >
                      {Icon.edit} Modifier
                    </motion.button>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                    {GOALS.map((g, i) => <ProgressBar key={i} {...g} />)}
                  </div>
                </Card>
              </motion.div>

              {/* Quick actions */}
              <motion.div {...fade(0.3)}>
                <h2 className="nunito" style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:14, paddingLeft:4 }}>Accès rapide</h2>
                <motion.div
                  initial="hidden" animate="show"
                  variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06, delayChildren:0.25 } } }}
                  style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}
                  className="actions-grid"
                >
                  <style>{`.actions-grid { @media(max-width:600px){ grid-template-columns:repeat(2,1fr) !important; } }`}</style>
                  {ACTIONS.map((a, i) => (
                    <motion.div key={i} variants={{ hidden:{ opacity:0, y:16, scale:0.94 }, show:{ opacity:1, y:0, scale:1, transition:{ duration:0.4, ease:[0.16,1,0.3,1] } } }}>
                      <Link to={a.to} style={{ textDecoration:'none', display:'block' }}>
                        <motion.div
                          whileHover={{ scale:1.04, y:-3 }}
                          whileTap={{ scale:0.93, boxShadow:clay.pressed }}
                          transition={spring}
                          style={{ background:`linear-gradient(${a.grad})`, borderRadius:22, padding:'20px 16px', boxShadow:clay.btn(a.color), cursor:'pointer', position:'relative', overflow:'hidden', minHeight:130 }}
                        >
                          {/* Shine */}
                          <div style={{ position:'absolute', top:0, left:0, right:0, height:'50%', background:'linear-gradient(180deg,rgba(255,255,255,0.18),transparent)', borderRadius:'22px 22px 0 0', pointerEvents:'none' }} aria-hidden/>
                          <div style={{ color:'#fff', marginBottom:12 }}>{a.icon}</div>
                          <p style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:4, fontFamily:'Nunito,sans-serif', lineHeight:1.2 }}>{a.label}</p>
                          <p style={{ fontSize:10, color:'rgba(255,255,255,0.7)', marginBottom:10 }}>{a.desc}</p>
                          <div style={{ display:'flex', alignItems:'center', gap:2, color:'rgba(255,255,255,0.85)', fontSize:11, fontWeight:600 }}>
                            Ouvrir {Icon.arrow}
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* RIGHT SIDEBAR */}
            <motion.div {...fade(0.25)} style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Streak card */}
              <Card style={{ padding:'24px', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'radial-gradient(circle,rgba(249,115,22,0.18),transparent)', pointerEvents:'none' }} aria-hidden/>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                  {Icon.fire}
                  <span className="nunito" style={{ fontSize:13, fontWeight:800, color:C.orange }}>Série active</span>
                </div>
                <motion.p
                  className="nunito"
                  initial={{ scale:0.4, opacity:0 }}
                  animate={{ scale:1, opacity:1 }}
                  transition={{ delay:0.5, ...spring }}
                  style={{ fontSize:60, fontWeight:900, color:C.text, lineHeight:1, fontVariantNumeric:'tabular-nums', marginBottom:4 }}
                >
                  {streak}
                </motion.p>
                <p style={{ fontSize:12, color:C.muted, marginBottom:16 }}>
                  {streak === 0 ? 'Reviens demain pour démarrer !' : `jour${streak > 1?'s':''} consécutif${streak > 1?'s':''}`}
                </p>
                <div style={{ display:'flex', gap:6 }}>
                  {Array.from({ length:7 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scaleY:0 }} animate={{ scaleY:1 }}
                      transition={{ delay:0.55 + i*0.06, ...spring }}
                      style={{ flex:1, height:6, borderRadius:99, transformOrigin:'bottom', background:i < streak ? `linear-gradient(135deg,${C.orange},${C.amber})` : '#e0e7ff', boxShadow:i < streak ? `0 2px 6px rgba(234,88,12,0.4)` : 'none' }}
                    />
                  ))}
                </div>
                <p style={{ fontSize:10, color:C.muted, marginTop:6 }}>Objectif : 7 jours</p>
              </Card>

              {/* Tip card */}
              <Card style={{ padding:'22px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <div style={{ width:30, height:30, borderRadius:10, background:'#fffbeb', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}>
                    {Icon.bulb}
                  </div>
                  <span className="nunito" style={{ fontSize:13, fontWeight:800, color:C.text }}>Conseil du jour</span>
                  <span style={{ marginLeft:'auto', fontSize:10, color:C.muted, fontVariantNumeric:'tabular-nums' }}>{tipIdx+1}/{TIPS.length}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIdx}
                    initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    transition={{ duration:0.25 }}
                    style={{ fontSize:12, color:C.muted, lineHeight:1.75 }}
                  >
                    {TIPS[tipIdx]}
                  </motion.p>
                </AnimatePresence>
                <div style={{ display:'flex', gap:5, marginTop:14 }}>
                  {TIPS.map((_, i) => (
                    <button key={i} onClick={() => setTipIdx(i)} aria-label={`Conseil ${i+1}`}
                      style={{ height:4, borderRadius:99, border:'none', cursor:'pointer', transition:'all 0.2s', background:i===tipIdx?C.amber:'#e0e7ff', width:i===tipIdx?20:6, boxShadow:i===tipIdx?`0 2px 6px ${C.amber}66`:'none' }}
                    />
                  ))}
                </div>
              </Card>

              {/* Upgrade card — free only */}
              {user?.subscription === 'free' && (
                <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.45 }}>
                  <Card style={{ padding:'24px', background:`linear-gradient(135deg,#4338ca,${C.indigo})`, border:'none', boxShadow:clay.btn(C.indigo), position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 10% 10%,rgba(255,255,255,0.15),transparent 60%)', pointerEvents:'none' }} aria-hidden/>
                    <div style={{ position:'relative' }}>
                      <div style={{ width:40, height:40, borderRadius:14, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, color:'#fff', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
                        {Icon.star}
                      </div>
                      <p className="nunito" style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:6 }}>Passe en Pro</p>
                      <p style={{ fontSize:12, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:16 }}>
                        Quiz illimités, fiches IA, flashcards sans limite.
                      </p>
                      <Link to="/dashboard/subscription" style={{ textDecoration:'none' }}>
                        <motion.div
                          whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
                          style={{ background:'#fff', borderRadius:14, padding:'11px 0', textAlign:'center', fontSize:13, fontWeight:800, color:C.indigo, cursor:'pointer', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 0 rgba(0,0,0,0.08)', fontFamily:'Nunito,sans-serif' }}
                        >
                          Voir les offres →
                        </motion.div>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              )}

            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Goals Modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            key="backdrop"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowModal(false)}
            style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(30,27,75,0.45)', backdropFilter:'blur(8px)' }}
          >
            <motion.div
              key="modal"
              initial={{ opacity:0, scale:0.92, y:20 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.92, y:20 }}
              transition={{ ...spring }}
              onClick={e => e.stopPropagation()}
              style={{ background:C.card, borderRadius:28, padding:28, width:'100%', maxWidth:380, boxShadow:clay.card }}
            >
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
                <p className="nunito" style={{ fontSize:15, fontWeight:800, color:C.text }}>Modifier mes objectifs</p>
                <motion.button whileTap={{ scale:0.9 }} onClick={() => setShowModal(false)}
                  style={{ width:34, height:34, borderRadius:12, background:C.bg, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', boxShadow:clay.sm }}
                  aria-label="Fermer"
                >
                  {Icon.close}
                </motion.button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { key:'quizPerDay',       label:'Quiz par jour',       icon:Icon.quiz,  color:C.indigo, min:1, max:500 },
                  { key:'flashcardsPerDay', label:'Flashcards par jour', icon:Icon.flash, color:C.violet, min:1, max:999 },
                  { key:'exercisesPerDay',  label:'Exercices par jour',  icon:Icon.exo,   color:C.teal,   min:1, max:200 },
                ].map(({ key, label, icon, color, min, max }) => (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:12, background:C.bg, border:`1px solid ${C.border}`, borderRadius:16, padding:'12px 16px' }}>
                    <div style={{ width:34, height:34, borderRadius:11, background:C.card, display:'flex', alignItems:'center', justifyContent:'center', color, flexShrink:0, boxShadow:clay.sm }}>{icon}</div>
                    <span style={{ fontSize:12, fontWeight:600, color:C.text, flex:1 }}>{label}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {[-1, null, 1].map((delta, j) => delta === null
                        ? <input key="inp" type="number" min={min} max={max} value={editGoals[key]}
                            onChange={e => { const v=Math.max(min,Math.min(max,parseInt(e.target.value)||min)); setEditGoals(g=>({...g,[key]:v})); }}
                            style={{ width:52, textAlign:'center', fontSize:14, fontWeight:800, color, background:C.card, border:`2px solid ${color}40`, borderRadius:10, padding:'5px 0', outline:'none', fontFamily:'Nunito,sans-serif' }}
                            aria-label={label}
                          />
                        : <motion.button key={j} whileTap={{ scale:0.88 }} type="button"
                            onClick={() => setEditGoals(g=>({...g,[key]:Math.max(min,Math.min(max,g[key]+delta))}))}
                            style={{ width:32, height:32, borderRadius:10, background:C.card, border:`1px solid ${C.border}`, color:C.muted, fontSize:18, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.sm }}
                            aria-label={delta === -1 ? 'Diminuer' : 'Augmenter'}
                          >{delta === -1 ? '−' : '+'}</motion.button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:10, marginTop:22 }}>
                <motion.button whileTap={{ scale:0.96 }} onClick={() => setShowModal(false)}
                  style={{ flex:1, padding:'13px 0', borderRadius:16, background:C.bg, border:`1px solid ${C.border}`, color:C.muted, fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:clay.sm }}>
                  Annuler
                </motion.button>
                <motion.button whileTap={{ scale:0.96 }} onClick={saveGoals} disabled={saving}
                  style={{ flex:1, padding:'13px 0', borderRadius:16, background:`linear-gradient(135deg,#4338ca,${C.indigo})`, border:'none', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', opacity:saving?0.6:1, boxShadow:clay.btn(C.indigo), fontFamily:'Nunito,sans-serif' }}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
