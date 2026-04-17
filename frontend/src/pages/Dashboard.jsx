import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  motion, useMotionValue, useTransform, useSpring, AnimatePresence,
} from 'framer-motion';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Animated counter (triggers on mount) ───────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      let cur = 0;
      const step = target / 55;
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        setVal(Math.round(cur));
        if (cur >= target) clearInterval(id);
      }, 18);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

/* ─── 3D Tilt card ───────────────────────────────────────────────────────── */
function TiltCard({ children, className }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [7, -7]);
  const ry = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const sx = useSpring(rx, { stiffness: 300, damping: 22 });
  const sy = useSpring(ry, { stiffness: 300, damping: 22 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div style={{ perspective: 900 }}>
      <motion.div
        style={{ rotateX: sx, rotateY: sy }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Animated SVG progress ring ─────────────────────────────────────────── */
function ProgressRing({ value, max, color, glow, size = 88, sw = 8 }) {
  const r   = (size - sw) / 2;
  const c   = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw}/>
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          style={{ filter: `drop-shadow(0 0 5px ${glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold text-slate-800 leading-none">{value}</span>
        <span className="text-[10px] text-slate-400">/{max}</span>
      </div>
    </div>
  );
}

/* ─── Skeleton loader ────────────────────────────────────────────────────── */
function Skeleton({ className }) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-xl ${className}`}
      style={{ backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite' }}
    />
  );
}

/* ─── Stagger variants ───────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Tips rotation ──────────────────────────────────────────────────────── */
const TIPS = [
  "La répétition espacée augmente la mémorisation de 200 %. Révise tes flashcards chaque jour, même 5 minutes.",
  "Avant une garde, relis les valeurs normales des constantes vitales : elles reviennent souvent aux examens.",
  "Les cas cliniques IFSI testent ton raisonnement clinique, pas uniquement tes connaissances. Explique toujours ton pourquoi.",
  "Groupe tes révisions par UE : la cohérence thématique ancre mieux les notions dans ta mémoire à long terme.",
];

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const p = user?.progress || {};

  const [tipIdx,       setTipIdx]       = useState(0);
  const [greeting,     setGreeting]     = useState('');
  const [streak,       setStreak]       = useState(p.streak || 0);
  const [weeklyData,   setWeeklyData]   = useState([0,0,0,0,0,0,0]);

  /* Time-based greeting */
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir');
  }, []);

  /* Ping backend — met à jour streak + activité hebdo */
  useEffect(() => {
    console.log('[Ping] token=', token ? 'OK' : 'MISSING', '| API_URL=', API_URL);
    if (!token) return;
    axios.post(`${API_URL}/auth/ping`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      console.log('[Ping] success:', res.data);
      if (typeof res.data.streak === 'number') setStreak(res.data.streak);
      if (Array.isArray(res.data.weeklyActivity)) setWeeklyData(res.data.weeklyActivity);
      refreshUser();
    }).catch(err => {
      console.error('[Ping] FAILED:', err?.response?.status, err?.response?.data || err.message);
    });
  }, []); // eslint-disable-line

  /* Rotate tips */
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  /* Animated counters */
  const quizVal  = useCounter(p.quizCompleted  || 0,  80);
  const flashVal = useCounter(p.flashcardsReviewed || 0, 180);
  const exercVal = useCounter(p.exercisesCompleted || 0, 280);
  const scoreVal = useCounter(p.totalScore    || 0,  380);

  /* Subscription label */
  const subLabel = { free: 'Gratuit', pro: 'Pro', premium: 'Elite' };
  const subStyle = {
    free:    { bg: 'bg-slate-100',  text: 'text-slate-500' },
    pro:     { bg: 'bg-blue-500',   text: 'text-white' },
    premium: { bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-white' },
  }[user?.subscription] || { bg: 'bg-slate-100', text: 'text-slate-500' };

  const stats = [
    {
      label: 'Quiz complétés', val: quizVal,
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      grad: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-200', textC: 'text-blue-600',
    },
    {
      label: 'Flashcards', val: flashVal,
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
      grad: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-200', textC: 'text-indigo-600',
    },
    {
      label: 'Exercices', val: exercVal,
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
      grad: 'from-teal-500 to-emerald-500', glow: 'shadow-teal-200', textC: 'text-teal-600',
    },
    {
      label: 'Points gagnés', val: scoreVal,
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
      grad: 'from-amber-400 to-orange-500', glow: 'shadow-amber-200', textC: 'text-amber-600',
    },
  ];

  const quickActions = [
    {
      to: '/dashboard/quiz', label: 'Commencer un Quiz',
      desc: 'Tester tes connaissances',
      grad: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
    {
      to: '/dashboard/flashcards', label: 'Réviser Flashcards',
      desc: 'Mémoriser les notions clés',
      grad: 'from-indigo-500 to-violet-500', shadow: 'shadow-indigo-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
    },
    {
      to: '/dashboard/exercises', label: 'Faire des Exercices',
      desc: 'Cas cliniques & QCM',
      grad: 'from-teal-500 to-emerald-500', shadow: 'shadow-teal-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      to: '/dashboard/cours', label: 'Cours & Fiches',
      desc: 'Consulter les leçons',
      grad: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    },
    {
      to: '/dashboard/annales', label: 'Annales',
      desc: 'Sujets des années passées',
      grad: 'from-violet-500 to-purple-600', shadow: 'shadow-violet-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    },
    {
      to: '/dashboard/medicaments', label: 'Médicaments',
      desc: 'Base de données des drogues',
      grad: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
    },
    {
      to: '/dashboard/groups', label: 'Groupes',
      desc: 'Réviser en équipe',
      grad: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
  ];

  const rings = [
    { label: 'Quiz',       subLabel: 'objectif 50',  value: p.quizCompleted || 0,        max: 50,  color: '#3b82f6', glow: '#3b82f688' },
    { label: 'Flashcards', subLabel: 'objectif 100', value: p.flashcardsReviewed || 0,   max: 100, color: '#6366f1', glow: '#6366f188' },
    { label: 'Exercices',  subLabel: 'objectif 30',  value: p.exercisesCompleted || 0,   max: 30,  color: '#14b8a6', glow: '#14b8a688' },
  ];

  return (
    <DashboardLayout>
      {/* ── Animated CSS keyframes ────────────────────────────────────── */}
      <style>{`
        @keyframes blob-drift-1 {
          0%,100% { transform:translate(0,0) scale(1); }
          33%      { transform:translate(-30px,20px) scale(1.08); }
          66%      { transform:translate(20px,-25px) scale(0.94); }
        }
        @keyframes blob-drift-2 {
          0%,100% { transform:translate(0,0) scale(1); }
          50%      { transform:translate(25px,-18px) scale(1.06); }
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; }
          50%      { opacity:0.4; }
        }
      `}</style>

      <main className="flex-1 overflow-auto relative bg-slate-50/60">

        {/* ── Ambient background orbs ───────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
          <div style={{ width:420, height:420, top:-60, right:-80, position:'absolute',
            borderRadius:'50%', opacity:0.05, filter:'blur(60px)',
            background:'radial-gradient(circle,#0891b2,transparent)',
            animation:'blob-drift-1 14s ease-in-out infinite' }}/>
          <div style={{ width:320, height:320, bottom:100, left:-60, position:'absolute',
            borderRadius:'50%', opacity:0.04, filter:'blur(50px)',
            background:'radial-gradient(circle,#6366f1,transparent)',
            animation:'blob-drift-2 18s ease-in-out infinite' }}/>
        </div>

        <div className="relative z-10 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">

          {/* ── Greeting ──────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-between"
          >
            <div>
              <p className="text-sm text-slate-400 mb-0.5">{greeting},</p>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                {user?.name?.split(' ')[0] || 'Étudiant'}
              </h1>
              <p className="text-sm text-slate-400 mt-1">Voici ton espace de révision personnel</p>
            </div>

            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 250 }}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm ${subStyle.bg} ${subStyle.text}`}
            >
              {subLabel[user?.subscription] || 'Gratuit'}
            </motion.span>
          </motion.div>

          {/* ── Stats cards ───────────────────────────────────────────── */}
          <motion.div
            variants={container} initial="hidden" animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={item}>
                <TiltCard className={`rounded-2xl p-5 bg-white border border-slate-100 shadow-md ${s.glow} hover:shadow-xl transition-shadow cursor-default`}>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-3 shadow-lg`}>
                    <span className="text-white">{s.icon}</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.val}</p>
                  <p className={`text-xs font-medium mt-0.5 ${s.textC}`}>{s.label}</p>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Main grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left col (2/3) ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Progress rings */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-slate-700">Progression globale</h2>
                  <span className="text-xs text-slate-400">Ce mois-ci</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {rings.map((rg, i) => {
                    const pct = rg.max > 0 ? Math.round((rg.value / rg.max) * 100) : 0;
                    return (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <ProgressRing {...rg} />
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-700">{rg.label}</p>
                          <p className="text-[10px] text-slate-400">{pct}% — {rg.subLabel}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quick actions */}
              <div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-4"
                >
                  Accès rapide
                </motion.p>
                <motion.div
                  variants={container} initial="hidden" animate="show"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {quickActions.map((a, i) => (
                    <motion.div key={i} variants={item} className="h-full">
                      <TiltCard>
                        <Link to={a.to} className="block rounded-2xl overflow-hidden focus:outline-none h-full">
                          <motion.div
                            className={`bg-gradient-to-br ${a.grad} p-5 shadow-xl ${a.shadow} flex flex-col`}
                            style={{ height: '190px' }}
                            whileHover={{ scale: 1.04, boxShadow: '0 20px 40px -8px rgba(0,0,0,0.25)' }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                          >
                            <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 flex-shrink-0">
                              {a.icon}
                            </div>
                            <p className="text-sm font-bold text-white leading-tight h-10 flex items-start">{a.label}</p>
                            <p className="text-xs text-white/65 mt-0.5 mb-3">{a.desc}</p>
                            <div className="flex items-center gap-1 text-white/80 mt-auto">
                              <span className="text-xs font-semibold">Commencer</span>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                          </motion.div>
                        </Link>
                      </TiltCard>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Weekly activity bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-slate-700">Activité de la semaine</h2>
                  <span className="text-xs text-blue-500 font-medium">7 derniers jours</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {['L','M','M','J','V','S','D'].map((day, i) => {
                    const maxVal = Math.max(...weeklyData, 1);
                    const heightPct = Math.round((weeklyData[i] / maxVal) * 100) || 0;
                    const isToday = i === (new Date().getDay() + 6) % 7;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div
                          className="w-full rounded-lg relative overflow-hidden"
                          style={{ height: heightPct > 0 ? `${Math.max(heightPct, 8)}%` : '4%' }}
                          initial={{ scaleY: 0, originY: 1 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.7 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className={`w-full h-full rounded-lg ${isToday ? 'opacity-100' : 'opacity-40'}`}
                            style={{ background: isToday ? 'linear-gradient(180deg,#0891b2,#164e8a)' : '#bfdbfe' }}/>
                        </motion.div>
                        <span className={`text-[10px] font-medium ${isToday ? 'text-blue-600' : 'text-slate-400'}`}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* ── Right col (1/3) ─────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Streak card */}
              <div className="rounded-2xl p-5 text-white relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0891b2 100%)' }}>
                {/* Glow orb */}
                <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full pointer-events-none"
                  style={{ background:'radial-gradient(circle,#38bdf8,transparent)', opacity:0.25, filter:'blur(16px)' }}/>

                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#fb923c" stroke="none">
                        <path d="M12 2c0 0-4 5.5-4 9.5a4 4 0 0 0 8 0C16 7.5 12 2 12 2z"/>
                        <path d="M12 13c0 0-1.5 1.5-1.5 3a1.5 1.5 0 0 0 3 0C13.5 14.5 12 13 12 13z" fill="#fde68a"/>
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-blue-200">Série en cours</p>
                  </div>

                  <motion.p
                    className="text-5xl font-bold tabular-nums"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.65, type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    {streak}
                  </motion.p>
                  <p className="text-xs text-blue-300 mt-1">
                    jour{streak !== 1 ? 's' : ''} consécutif{streak !== 1 ? 's' : ''}
                  </p>

                  {/* Day dots */}
                  <div className="mt-4 flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.75 + i * 0.06, type: 'spring' }}
                        className={`flex-1 h-1.5 rounded-full origin-bottom ${
                          i < streak % 7 ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-[10px] text-blue-400 mt-3">
                    {['L','M','M','J','V','S','D'].join('   ')}
                  </p>
                </div>
              </div>

              {/* Upgrade nudge — free users */}
              {user?.subscription === 'free' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
                    style={{ background:'radial-gradient(circle,#bfdbfe,transparent)', opacity:0.5, filter:'blur(14px)', transform:'translate(8px,-8px)' }}/>
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                      style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">Passe en Pro</p>
                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      Quiz illimités, toutes les fiches, flashcards sans limite et fiches IA.
                    </p>
                    <Link to="/dashboard/subscription">
                      <motion.div
                        className="w-full py-2.5 rounded-xl text-xs font-bold text-white text-center cursor-pointer"
                        style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)' }}
                        whileHover={{ scale: 1.02, boxShadow:'0 8px 24px rgba(8,145,178,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Voir les offres →
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Tip of the day */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Conseil du jour</p>
                  <span className="ml-auto text-[10px] text-slate-300">{tipIdx + 1}/{TIPS.length}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIdx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="text-xs text-slate-500 leading-relaxed"
                  >
                    {TIPS[tipIdx]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-1 mt-3">
                  {TIPS.map((_, i) => (
                    <button key={i} onClick={() => setTipIdx(i)}
                      className={`h-1 rounded-full transition-all ${i === tipIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-200'}`}/>
                  ))}
                </div>
              </motion.div>

              {/* Mini quick links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
              >
                <p className="text-xs font-semibold text-slate-500 mb-3">Navigation rapide</p>
                <div className="space-y-1">
                  {[
                    { to:'/dashboard/cours',        label:'Cours & Fiches', color:'text-blue-600'   },
                    { to:'/dashboard/annales',       label:'Annales',        color:'text-violet-600' },
                    { to:'/dashboard/medicaments',   label:'Médicaments',    color:'text-rose-600'   },
                    { to:'/dashboard/groups',        label:'Groupes',        color:'text-amber-600'  },
                    { to:'/dashboard/profile',       label:'Mon profil',     color:'text-slate-600'  },
                    { to:'/dashboard/subscription',  label:'Abonnement',     color:'text-cyan-600'   },
                  ].map((l, i) => (
                    <motion.div key={i} whileHover={{ x: 4 }} transition={{ type:'spring', stiffness:400 }}>
                      <Link to={l.to}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-50 transition-colors text-xs font-medium ${l.color}`}>
                        {l.label}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
