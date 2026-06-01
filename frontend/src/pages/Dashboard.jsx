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
  const [showDetail,   setShowDetail]   = useState(false);
  const [detailPeriod, setDetailPeriod] = useState('semaine');
  const [customRange,  setCustomRange]  = useState({ from: '', to: '' });

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
      grad: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-200', textC: 'text-blue-600',
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
    {
      label: 'Flashcards', val: flashVal,
      grad: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-200', textC: 'text-indigo-600',
      icon: <img src="/icons/card-icon.png" alt="Flashcards" className="w-5 h-5 object-contain" />,
    },
    {
      label: 'Exercices', val: exercVal,
      grad: 'from-teal-500 to-emerald-500', glow: 'shadow-teal-200', textC: 'text-teal-600',
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
    },
    {
      label: 'Points gagnés', val: scoreVal,
      grad: 'from-amber-400 to-orange-500', glow: 'shadow-amber-200', textC: 'text-amber-600',
      icon: <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
    },
  ];

  const quickActions = [
    {
      to: '/dashboard/quiz', label: 'Commencer un Quiz',
      desc: 'Tester tes connaissances',
      grad: 'from-blue-500 to-blue-700', shadow: 'shadow-blue-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
    {
      to: '/dashboard/flashcards', label: 'Réviser Flashcards',
      desc: 'Mémoriser les notions clés',
      grad: 'from-violet-500 to-purple-700', shadow: 'shadow-violet-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
    },
    {
      to: '/dashboard/exercises', label: 'Faire des Exercices',
      desc: 'Cas cliniques & QCM',
      grad: 'from-teal-500 to-cyan-600', shadow: 'shadow-teal-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    },
    {
      to: '/dashboard/cours', label: 'Cours & Fiches',
      desc: 'Consulter les leçons',
      grad: 'from-emerald-500 to-green-600', shadow: 'shadow-emerald-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    },
    {
      to: '/dashboard/annales', label: 'Annales',
      desc: 'Sujets des années passées',
      grad: 'from-indigo-600 to-indigo-800', shadow: 'shadow-indigo-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>,
    },
    {
      to: '/dashboard/medicaments', label: 'Médicaments',
      desc: 'Base de données des drogues',
      grad: 'from-rose-500 to-red-600', shadow: 'shadow-rose-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
    },
    {
      to: '/dashboard/groups', label: 'Groupes',
      desc: 'Réviser en équipe',
      grad: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    },
    {
      to: '/dashboard/subscription', label: 'Abonnement',
      desc: 'Gérer mon offre',
      grad: 'from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-400/40',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
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

              {/* Progress rings + En détail */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-5">
                  <h2 className="text-sm font-semibold text-slate-700">Progression globale</h2>
                  <button
                    onClick={() => setShowDetail(v => !v)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                    style={showDetail
                      ? { background: 'linear-gradient(135deg,#164e8a,#0891b2)', color: '#fff' }
                      : { background: '#f1f5f9', color: '#475569' }}
                  >
                    En détail
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                      style={{ transform: showDetail ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform .25s' }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </button>
                </div>

                {/* Rings résumé */}
                <div className="grid grid-cols-3 gap-4 px-6 pb-6">
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

                {/* ── Panneau détaillé ── */}
                <AnimatePresence>
                {showDetail && (
                  <motion.div
                    key="detail-panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="border-t border-slate-100 px-6 pt-5 pb-6 space-y-5"
                      style={{ background: 'linear-gradient(180deg,#f8fafc,#fff)' }}>

                      {/* Sélecteur de période */}
                      <div className="flex flex-wrap gap-2 items-center">
                        {[
                          { key: 'jour',    label: "Aujourd'hui" },
                          { key: 'semaine', label: 'Cette semaine' },
                          { key: 'mois',    label: 'Ce mois' },
                          { key: 'custom',  label: 'Personnalisé' },
                        ].map(p => (
                          <button key={p.key}
                            onClick={() => setDetailPeriod(p.key)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                            style={detailPeriod === p.key
                              ? { background:'linear-gradient(135deg,#164e8a,#0891b2)', color:'#fff', boxShadow:'0 2px 8px rgba(8,145,178,.35)' }
                              : { background:'#f1f5f9', color:'#64748b' }}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>

                      {/* Plage personnalisée */}
                      <AnimatePresence>
                      {detailPeriod === 'custom' && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                          className="flex gap-3 items-center flex-wrap"
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-medium">Du</span>
                            <input type="date" value={customRange.from}
                              onChange={e => setCustomRange(r => ({ ...r, from: e.target.value }))}
                              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-slate-400 font-medium">Au</span>
                            <input type="date" value={customRange.to}
                              onChange={e => setCustomRange(r => ({ ...r, to: e.target.value }))}
                              className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                          </div>
                        </motion.div>
                      )}
                      </AnimatePresence>

                      {/* Cartes détaillées par catégorie */}
                      {(() => {
                        const pr = user?.progress || {};
                        const wSum = weeklyData.reduce((a, b) => a + b, 0);
                        const todayAct = weeklyData[6] || 0;

                        // Coefficients pour estimer la part par période
                        const coeff = detailPeriod === 'jour'
                          ? (wSum > 0 ? todayAct / wSum : 0)
                          : detailPeriod === 'semaine'
                          ? (wSum > 0 ? Math.min(wSum / Math.max(pr.quizCompleted + pr.flashcardsReviewed + pr.exercisesCompleted || 1, 1), 1) : 0)
                          : 1; // mois / custom → totaux

                        const qTotal  = Math.round((pr.quizCompleted || 0) * coeff);
                        const fTotal  = Math.round((pr.flashcardsReviewed || 0) * coeff);
                        const eTotal  = Math.round((pr.exercisesCompleted || 0) * coeff);

                        // Score moyen en % : totalScore = cumul des bonnes réponses, chaque quiz = 10 questions
                        const QUESTIONS_PAR_QUIZ = 10;
                        const avgScore = pr.quizCompleted > 0
                          ? Math.min(Math.round(((pr.totalScore || 0) / (pr.quizCompleted * QUESTIONS_PAR_QUIZ)) * 100), 100)
                          : 0;
                        // Erreurs estimées sur la période : nb questions ratées
                        const erreurs = pr.quizCompleted > 0
                          ? Math.round(qTotal * QUESTIONS_PAR_QUIZ * (1 - avgScore / 100))
                          : null;

                        const detailCards = [
                          {
                            label: 'Quiz',
                            color: '#3b82f6',
                            bg: 'from-blue-50 to-blue-100/60',
                            border: 'border-blue-100',
                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                            rows: [
                              { label: 'Réalisés',     val: qTotal,                                     unit: 'quiz'      },
                              { label: 'Score moyen',  val: avgScore > 0 ? `${avgScore}%` : '—',        unit: ''          },
                              { label: 'Erreurs est.', val: erreurs !== null ? `~${erreurs}` : '—',     unit: erreurs !== null ? 'questions' : '' },
                              { label: 'Objectif',     val: '50',                                       unit: 'quiz'      },
                            ],
                            pct: Math.min(Math.round(((pr.quizCompleted || 0) / 50) * 100), 100),
                          },
                          {
                            label: 'Flashcards',
                            color: '#6366f1',
                            bg: 'from-indigo-50 to-indigo-100/60',
                            border: 'border-indigo-100',
                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
                            rows: (() => {
                              const known   = Math.round((pr.flashcardsReviewed || 0) * coeff);
                              const unknown = Math.round((pr.flashcardsUnknown  || 0) * coeff);
                              const total   = known + unknown;
                              const tauxMemo = total > 0 ? Math.round((known / total) * 100) : null;
                              return [
                                { label: 'Maîtrisées', val: known,                                                        unit: 'cartes' },
                                { label: 'À revoir',   val: unknown > 0 ? unknown : (pr.flashcardsUnknown === 0 && pr.flashcardsReviewed > 0 ? '0' : '—'), unit: unknown > 0 ? 'cartes' : '' },
                                { label: 'Taux mémo',  val: tauxMemo !== null ? `${tauxMemo}%` : '—',                     unit: ''       },
                                { label: 'Objectif',   val: '100',                                                        unit: 'cartes' },
                              ];
                            })(),
                            pct: (() => {
                              const known   = pr.flashcardsReviewed || 0;
                              const unknown = pr.flashcardsUnknown  || 0;
                              const total   = known + unknown;
                              return total > 0 ? Math.min(Math.round((known / total) * 100), 100) : 0;
                            })(),
                          },
                          {
                            label: 'Exercices',
                            color: '#14b8a6',
                            bg: 'from-teal-50 to-teal-100/60',
                            border: 'border-teal-100',
                            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
                            rows: [
                              { label: 'Complétés', val: eTotal, unit: 'exercices'  },
                              { label: 'Réussis',   val: '—',    unit: ''           },
                              { label: 'Erreurs',   val: '—',    unit: ''           },
                              { label: 'Objectif',  val: '30',   unit: 'exercices'  },
                            ],
                            pct: Math.min(Math.round(((pr.exercisesCompleted || 0) / 30) * 100), 100),
                          },
                        ];

                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {detailCards.map((dc, i) => (
                              <motion.div
                                key={dc.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                                className={`rounded-xl border ${dc.border} bg-gradient-to-br ${dc.bg} p-4`}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                    {dc.icon}
                                  </div>
                                  <span className="text-xs font-bold text-slate-700">{dc.label}</span>
                                </div>
                                <div className="space-y-1.5 mb-3">
                                  {dc.rows.map((r, j) => (
                                    <div key={j} className="flex items-center justify-between">
                                      <span className="text-[10px] text-slate-500">{r.label}</span>
                                      <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                                        {r.val}{r.unit ? <span className="text-[9px] font-normal text-slate-400 ml-0.5">{r.unit}</span> : null}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                                {/* Barre de progression */}
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-slate-400">Progression</span>
                                    <span className="text-[10px] font-bold" style={{ color: dc.color }}>{dc.pct}%</span>
                                  </div>
                                  <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
                                    <motion.div
                                      className="h-full rounded-full"
                                      style={{ background: dc.color }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${dc.pct}%` }}
                                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        );
                      })()}

                      <p className="text-[10px] text-slate-300 text-center">
                        Données basées sur ta progression enregistrée · Le suivi d'erreurs détaillé arrive prochainement
                      </p>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
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
                    {streak === 0 ? 'connecte-toi demain pour commencer !' : `jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''}`}
                  </p>

                  {/* Barre de progression streak */}
                  <div className="mt-4 flex gap-1.5">
                    {[...Array(7)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.75 + i * 0.06, type: 'spring' }}
                        className={`flex-1 h-1.5 rounded-full origin-bottom ${
                          i < streak ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-blue-400/60 mt-2">objectif 7 jours</p>
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

            </motion.div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}
