import { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, useMotionValue, useTransform, useSpring,
} from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import NursesLogo from '../../components/NursesLogo';
import { useAuth, API_URL } from '../../context/AuthContext';

/* ─── Animated counter ───────────────────────────────────────────────────── */
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

/* ─── Animated subscription bar ─────────────────────────────────────────── */
function SubBar({ label, value, total, color, delay }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${color}`}/>
          <span className="font-semibold text-slate-700">{label}</span>
        </div>
        <span className="text-slate-400 tabular-nums">
          {value} <span className="text-slate-300">·</span> {pct}%
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-2.5 rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay }}
        />
      </div>
    </div>
  );
}

/* ─── Stagger variants ───────────────────────────────────────────────────── */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skel({ className }) {
  return <div className={`animate-pulse bg-slate-100 rounded-xl ${className}`}/>;
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ════════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/admin/stats`)
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  /* Animated counters (start only once stats arrive) */
  const cntUsers    = useCounter(stats?.totalUsers    || 0, 80);
  const cntActive   = useCounter(stats?.activeUsers   || 0, 160);
  const cntQuizzes  = useCounter(stats?.totalQuizzes  || 0, 240);
  const cntFlash    = useCounter(stats?.totalFlashcards || 0, 320);

  const totalSubs   = (stats?.freeUsers || 0) + (stats?.proUsers || 0) + (stats?.premiumUsers || 0) || 1;

  const statCards = [
    {
      label: 'Utilisateurs', val: cntUsers,
      sub: 'inscrits au total',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      grad: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-200', textC: 'text-blue-600',
    },
    {
      label: 'Actifs (7j)', val: cntActive,
      sub: stats?.totalUsers ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% du total` : '—',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      grad: 'from-indigo-500 to-violet-500', glow: 'shadow-indigo-200', textC: 'text-indigo-600',
    },
    {
      label: 'Quiz', val: cntQuizzes,
      sub: 'disponibles',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      grad: 'from-teal-500 to-emerald-500', glow: 'shadow-teal-200', textC: 'text-teal-600',
    },
    {
      label: 'Flashcards', val: cntFlash,
      sub: 'au total',
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
      grad: 'from-purple-500 to-violet-500', glow: 'shadow-purple-200', textC: 'text-purple-600',
    },
  ];

  const quickLinks = [
    {
      to: '/admin/users',
      label: 'Utilisateurs',
      desc: stats ? `${stats.totalUsers} comptes` : '—',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      grad: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-300/40',
    },
    {
      to: '/admin/quizzes',
      label: 'Quiz',
      desc: stats ? `${stats.totalQuizzes} questions` : '—',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      grad: 'from-indigo-500 to-violet-500', shadow: 'shadow-indigo-300/40',
    },
    {
      to: '/admin/flashcards',
      label: 'Flashcards',
      desc: stats ? `${stats.totalFlashcards} cartes` : '—',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>,
      grad: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-300/40',
    },
    {
      to: '/admin/exercises',
      label: 'Exercices',
      desc: stats ? `${stats.totalExercises || 0} exercices` : '—',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>,
      grad: 'from-teal-500 to-emerald-500', shadow: 'shadow-teal-300/40',
    },
    {
      to: '/admin/lessons',
      label: 'Cours & Fiches',
      desc: 'Contenu pédagogique',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      grad: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-300/40',
    },
    {
      to: '/admin/groups',
      label: 'Groupes',
      desc: 'Groupes d\'étude',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      grad: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-300/40',
    },
    {
      to: '/admin/logs',
      label: 'Activité',
      desc: 'Journal de connexions',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
      grad: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-300/40',
    },
  ];

  /* Engagement rate (simulated from active/total) */
  const engRate = stats?.totalUsers
    ? Math.round((stats.activeUsers / stats.totalUsers) * 100)
    : 0;

  return (
    <DashboardLayout isAdmin>
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
      `}</style>

      <main className="flex-1 overflow-auto relative bg-slate-50/60">

        {/* ── Ambient background orbs ───────────────────────────────── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
          <div style={{ width:380, height:380, top:-50, right:-60, position:'absolute',
            borderRadius:'50%', opacity:0.045, filter:'blur(55px)',
            background:'radial-gradient(circle,#6366f1,transparent)',
            animation:'blob-drift-1 16s ease-in-out infinite' }}/>
          <div style={{ width:280, height:280, bottom:80, left:-40, position:'absolute',
            borderRadius:'50%', opacity:0.035, filter:'blur(45px)',
            background:'radial-gradient(circle,#0891b2,transparent)',
            animation:'blob-drift-2 20s ease-in-out infinite' }}/>
        </div>

        <div className="relative z-10 p-4 lg:p-8 max-w-6xl mx-auto space-y-8">

          {/* ── Header ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <NursesLogo size="sm" />
                <span className="text-xs font-bold bg-slate-800 text-white px-2.5 py-1 rounded-full">
                  Administration
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight"
                style={{ background:'linear-gradient(135deg,#1e293b,#475569)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Tableau de bord
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Vue d'ensemble de la plateforme —{' '}
                {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })}
              </p>
            </div>

            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type:'spring', stiffness:250 }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-green-200 bg-green-50 shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm shadow-green-400"
                style={{ animation:'pulse 2s ease-in-out infinite' }}/>
              <span className="text-xs font-semibold text-green-700">Système actif</span>
            </motion.div>
          </motion.div>

          {/* ── Skeleton / Stats cards ────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skel key={i} className="h-28" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={container} initial="hidden" animate="show"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {statCards.map((s, i) => (
                <motion.div key={i} variants={item}>
                  <TiltCard className={`rounded-2xl p-5 bg-white border border-slate-100 shadow-md ${s.glow} hover:shadow-xl transition-shadow cursor-default`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center mb-3 shadow-lg`}>
                      <span className="text-white">{s.icon}</span>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 tabular-nums">{s.val}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${s.textC}`}>{s.label}</p>
                    {s.sub && <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>}
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* ── Main grid ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left col (2/3) ──────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Subscription distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-slate-700">Répartition des abonnements</h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {stats?.totalUsers || 0} utilisateurs
                  </span>
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <Skel key={i} className="h-6"/>)}
                  </div>
                ) : (
                  <div className="space-y-5">
                    <SubBar label="Gratuit" value={stats?.freeUsers || 0}    total={totalSubs} color="bg-slate-400"  delay={0.5}/>
                    <SubBar label="Pro"     value={stats?.proUsers || 0}     total={totalSubs} color="bg-blue-500"   delay={0.65}/>
                    <SubBar label="Elite"   value={stats?.premiumUsers || 0} total={totalSubs} color="bg-amber-400"  delay={0.8}/>
                  </div>
                )}

                {/* Revenue estimate row */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Revenu mensuel estimé</p>
                    <p className="text-xl font-bold text-slate-800 tabular-nums mt-0.5">
                      {loading ? '—' : `${((stats?.proUsers || 0) * 9.99 + (stats?.premiumUsers || 0) * 19.99).toFixed(0)} €`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Taux d'engagement</p>
                    <p className="text-xl font-bold tabular-nums mt-0.5"
                      style={{ background:'linear-gradient(135deg,#164e8a,#0891b2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {loading ? '—' : `${engRate}%`}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-slate-700">Contenu de la plateforme</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label:'Quiz',       value: stats?.totalQuizzes    || 0, color:'bg-blue-500',   textC:'text-blue-600',   bg:'bg-blue-50',   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg> },
                    { label:'Flashcards', value: stats?.totalFlashcards || 0, color:'bg-purple-500', textC:'text-purple-600', bg:'bg-purple-50', icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg> },
                    { label:'Exercices',  value: stats?.totalExercises  || 0, color:'bg-teal-500',   textC:'text-teal-600',   bg:'bg-teal-50',   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
                    { label:'Cours',      value: stats?.totalLessons    || 0, color:'bg-pink-500',   textC:'text-pink-600',   bg:'bg-pink-50',   icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
                  ].map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08 }}
                      className={`${c.bg} rounded-2xl p-4 text-center`}
                    >
                      <div className={`w-8 h-8 rounded-xl ${c.color} flex items-center justify-center mx-auto mb-2.5 text-white shadow-md`}>
                        {c.icon}
                      </div>
                      <p className={`text-2xl font-bold tabular-nums ${c.textC}`}>
                        {loading ? '—' : c.value}
                      </p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{c.label}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Platform activity bar chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-sm font-semibold text-slate-700">Activité plateforme</h2>
                  <span className="text-xs text-indigo-500 font-medium">7 derniers jours</span>
                </div>
                <div className="flex items-end gap-2 h-20">
                  {['L','M','M','J','V','S','D'].map((day, i) => {
                    const heights = [60, 85, 45, 95, 70, 50, 30];
                    const isToday = i === new Date().getDay() - 1;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div
                          className="w-full rounded-lg"
                          style={{ height:`${heights[i]}%` }}
                          initial={{ scaleY: 0, originY: 1 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: 0.65 + i * 0.07, duration: 0.5, ease:[0.16,1,0.3,1] }}
                        >
                          <div className={`w-full h-full rounded-lg ${isToday ? 'opacity-100' : 'opacity-35'}`}
                            style={{ background: isToday
                              ? 'linear-gradient(180deg,#6366f1,#4338ca)'
                              : '#c7d2fe' }}/>
                        </motion.div>
                        <span className={`text-[10px] font-medium ${isToday ? 'text-indigo-600' : 'text-slate-400'}`}>{day}</span>
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
              {/* Actions rapides — 6 cards */}
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-3">
                Gestion rapide
              </p>
              <motion.div
                variants={container} initial="hidden" animate="show"
                className="grid grid-cols-2 gap-3"
              >
                {quickLinks.map((l, i) => (
                  <motion.div key={i} variants={item}>
                    <TiltCard>
                      <Link to={l.to} className="block rounded-2xl overflow-hidden focus:outline-none">
                        <motion.div
                          className={`bg-gradient-to-br ${l.grad} p-4 shadow-lg ${l.shadow}`}
                          whileHover={{ scale: 1.05, boxShadow:'0 16px 32px -8px rgba(0,0,0,0.22)' }}
                          whileTap={{ scale: 0.96 }}
                          transition={{ type:'spring', stiffness:380, damping:22 }}
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 text-white">
                            {l.icon}
                          </div>
                          <p className="text-xs font-bold text-white leading-snug">{l.label}</p>
                          <p className="text-[10px] text-white/60 mt-0.5">{l.desc}</p>
                        </motion.div>
                      </Link>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>

              {/* Platform health */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">État de la plateforme</p>
                </div>
                <div className="space-y-2.5">
                  {[
                    { label:'API Backend',   status:'Opérationnel', ok:true },
                    { label:'Base de données', status:'Opérationnel', ok:true },
                    { label:'Stockage',       status:'Opérationnel', ok:true },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{s.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? 'bg-green-500' : 'bg-red-500'}`}/>
                        <span className={`text-[10px] font-semibold ${s.ok ? 'text-green-600' : 'text-red-600'}`}>{s.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick stats summary */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="rounded-2xl p-5 text-white relative overflow-hidden"
                style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a5f 50%,#0891b2 100%)' }}
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none"
                  style={{ background:'radial-gradient(circle,#38bdf8,transparent)', opacity:0.2, filter:'blur(14px)' }}/>
                <div className="relative">
                  <p className="text-xs text-blue-300 mb-3 font-medium">Résumé abonnements</p>
                  <div className="space-y-2">
                    {[
                      { label:'Gratuit', v: stats?.freeUsers    || 0, c:'text-slate-300' },
                      { label:'Pro',     v: stats?.proUsers     || 0, c:'text-cyan-300'  },
                      { label:'Elite',   v: stats?.premiumUsers || 0, c:'text-amber-300' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className={`text-xs font-medium ${s.c}`}>{s.label}</span>
                        <span className="text-sm font-bold text-white tabular-nums">
                          {loading ? '—' : s.v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between">
                    <span className="text-xs text-blue-300">Total</span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      {loading ? '—' : stats?.totalUsers || 0}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* ── Seeds Panel ──────────────────────────────────────── */}
              <SeedPanel />

              {/* ── Push Notifications Panel ─────────────────────────── */}
              <PushPanel />

            </motion.div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}

/* ── Seeds Panel ─────────────────────────────────────────────────────────── */
const SEEDS = [
  {
    id: 'exercises-s1',
    label: 'Exercices — S1 UE 1.1',
    desc: 'Sociologie, anthropologie et psychologie',
    count: '3 exercices',
    endpoint: '/admin/seed-exercises-s1',
    grad: 'linear-gradient(135deg,#c2410c,#ea580c)',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'cours-zip',
    label: 'Cours — Import ZIP complet',
    desc: '1A S1/S2 · 2A S3/S4 · UE 1.1, 1.3, 2.5, 2.7, 2.8, 2.11',
    count: '~62 cours PDF',
    endpoint: '/admin/seed-cours-zip',
    grad: 'linear-gradient(135deg,#1d4ed8,#0891b2)',
    zipField: 'zip',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    id: 'annales-zip',
    label: 'Annales — Import ZIP complet',
    desc: '1A 2018→2026 · 2A 2018-2019 · Paris Cité, UPEC, Sorbonne…',
    count: '~21 annales PDF',
    endpoint: '/admin/seed-annales-zip',
    grad: 'linear-gradient(135deg,#d97706,#f59e0b)',
    zipField: 'zip',
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    id: 'gen-content',
    label: 'Générer Quiz + Flashcards (IA)',
    desc: 'Depuis les cours déjà importés · Anthropic Haiku',
    count: '8 QCM + 12 flashcards / cours',
    endpoint: '/admin/generate-content-lessons',
    grad: 'linear-gradient(135deg,#7c3aed,#a855f7)',
    aiMode: true,
    icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2a10 10 0 1 0 10 10"/>
        <path d="M12 6v6l4 2"/>
        <circle cx="18" cy="6" r="3" fill="white" stroke="none"/>
      </svg>
    ),
  },
];

function SeedPanel() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [zipFiles, setZipFiles] = useState({});
  const { token } = useAuth();

  const runSeed = async (seed, aiMode = null) => {
    setLoading(l => ({ ...l, [seed.id]: true }));
    setResults(r => ({ ...r, [seed.id]: null }));
    try {
      let res;
      if (seed.zipField) {
        const file = zipFiles[seed.id];
        if (!file) {
          setResults(r => ({ ...r, [seed.id]: { ok: false, msg: 'Sélectionne d\'abord le fichier ZIP' } }));
          setLoading(l => ({ ...l, [seed.id]: false }));
          return;
        }
        const fd = new FormData();
        fd.append(seed.zipField, file);
        res = await axios.post(`${API_URL}${seed.endpoint}`, fd, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
          timeout: 300000,
          onUploadProgress: () => {},
        });
      } else if (seed.aiMode) {
        const params = aiMode ? `?mode=${aiMode}` : '';
        res = await axios.post(`${API_URL}${seed.endpoint}${params}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 600000,
        });
      } else {
        res = await axios.post(`${API_URL}${seed.endpoint}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setResults(r => ({ ...r, [seed.id]: { ok: true, msg: res.data.message } }));
    } catch (err) {
      setResults(r => ({ ...r, [seed.id]: { ok: false, msg: err.response?.data?.message || err.message || 'Erreur' } }));
    } finally {
      setLoading(l => ({ ...l, [seed.id]: false }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.78 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-3"
    >
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#c2410c,#ea580c)' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="16 16 12 12 8 16"/>
            <line x1="12" y1="12" x2="12" y2="21"/>
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
          </svg>
        </div>
        <p className="text-xs font-semibold text-slate-700">Insérer du contenu</p>
      </div>
      <p className="text-[10px] text-slate-400 leading-relaxed -mt-1">
        Lance l'insertion de contenu pédagogique directement en base de données.
      </p>

      {SEEDS.map(seed => (
        <div key={seed.id} className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: seed.grad }}>
              {seed.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{seed.label}</p>
              <p className="text-[10px] text-slate-400 truncate">{seed.desc} · {seed.count}</p>
            </div>
            {seed.aiMode ? (
              <div className="flex gap-1.5 flex-shrink-0">
                {[['quiz','Quiz'],['flashcards','Flashcards'],['both','Les deux']].map(([mode, label]) => (
                  <button key={mode}
                    onClick={() => runSeed(seed, mode)}
                    disabled={loading[seed.id]}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: seed.grad }}
                  >
                    {loading[seed.id]
                      ? <span className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      : null}
                    {loading[seed.id] ? '…' : label}
                  </button>
                ))}
              </div>
            ) : (
              <button
                onClick={() => runSeed(seed)}
                disabled={loading[seed.id]}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ background: seed.grad }}
              >
                {loading[seed.id]
                  ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                  : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/></svg>
                }
                {loading[seed.id] ? 'Import en cours…' : 'Insérer'}
              </button>
            )}
          </div>

          {/* Zone fichier ZIP si besoin */}
          {seed.zipField && (
            <div className="px-3 pb-2.5">
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed cursor-pointer transition text-[10px] font-medium ${
                zipFiles[seed.id] ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-200 hover:text-blue-500'
              }`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {zipFiles[seed.id]
                  ? `${zipFiles[seed.id].name} (${(zipFiles[seed.id].size / 1024 / 1024).toFixed(0)} MB)`
                  : 'Glisse ou clique pour sélectionner le ZIP (≤ 300 MB)'}
                <input type="file" accept=".zip" className="hidden"
                  onChange={e => setZipFiles(z => ({ ...z, [seed.id]: e.target.files[0] || null }))}/>
              </label>
            </div>
          )}

          {results[seed.id] && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className={`px-3 py-2 text-[10px] font-medium flex items-center gap-1.5 ${
                results[seed.id].ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
              }`}
            >
              {results[seed.id].ok
                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
              {results[seed.id].msg}
            </motion.div>
          )}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Push Notification Admin Panel ──────────────────────────────────────── */
function PushPanel() {
  const [notifStats, setNotifStats] = useState(null);
  const [title, setTitle]           = useState('');
  const [body,  setBody]            = useState('');
  const [url,   setUrl]             = useState('/dashboard');
  const [sending,   setSending]     = useState(false);
  const [reminding, setReminding]   = useState(false);
  const [result,    setResult]      = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/notifications/stats`)
      .then(r => setNotifStats(r.data))
      .catch(() => {});
  }, []);

  const handleSendAll = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true); setResult(null);
    try {
      const r = await axios.post(`${API_URL}/notifications/send-all`, { title, body, url });
      setResult({ ok: true, msg: `Envoyé à ${r.data.sent} utilisateur(s)` });
      setTitle(''); setBody(''); setUrl('/dashboard');
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.message || 'Erreur' });
    } finally { setSending(false); }
  };

  const handleStreakReminder = async () => {
    setReminding(true); setResult(null);
    try {
      const r = await axios.post(`${API_URL}/notifications/send-streak-reminder`);
      setResult({ ok: true, msg: `Rappels envoyés à ${r.data.sent} utilisateur(s)` });
    } catch (err) {
      setResult({ ok: false, msg: err.response?.data?.message || 'Erreur' });
    } finally { setReminding(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p className="text-xs font-semibold text-slate-700">Notifications push</p>
        </div>
        {notifStats && (
          <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
            {notifStats.subscribed} / {notifStats.total} abonnés
          </span>
        )}
      </div>

      {/* Streak reminder shortcut */}
      <button
        onClick={handleStreakReminder}
        disabled={reminding}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-white transition"
        style={{ background: reminding ? '#94a3b8' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}
      >
        {reminding
          ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
          : null}
        {reminding ? 'Envoi...' : 'Rappel streak (inactifs aujourd\'hui)'}
      </button>

      {/* Custom message */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Message personnalisé</p>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Titre de la notification"
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition"
        />
        <textarea
          value={body} onChange={e => setBody(e.target.value)}
          placeholder="Corps du message..."
          rows={2}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition resize-none"
        />
        <select
          value={url} onChange={e => setUrl(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-400 transition bg-white text-slate-700"
        >
          <option value="/dashboard">Tableau de bord</option>
          <option value="/dashboard/quiz">Quiz</option>
          <option value="/dashboard/flashcards">Flashcards</option>
          <option value="/dashboard/cours">Cours & Fiches</option>
          <option value="/dashboard/exercises">Exercices</option>
          <option value="/dashboard/annales">Annales</option>
          <option value="/dashboard/medicaments">Médicaments</option>
          <option value="/dashboard/groups">Groupes</option>
          <option value="/dashboard/profile">Profil</option>
          <option value="/dashboard/subscription">Abonnement</option>
          <option value="/dashboard/support">Support</option>
        </select>
        <button
          onClick={handleSendAll}
          disabled={sending || !title.trim() || !body.trim()}
          className="w-full py-2.5 rounded-xl text-xs font-semibold text-white transition"
          style={{ background: (sending || !title.trim() || !body.trim()) ? '#94a3b8' : 'linear-gradient(135deg,#2563eb,#0891b2)' }}
        >
          {sending
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                Envoi en cours...
              </span>
            : 'Envoyer à tous les abonnés'
          }
        </button>
      </div>

      {/* Result */}
      {result && (
        <motion.p
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          className={`text-xs font-medium text-center px-3 py-2 rounded-xl ${
            result.ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
          }`}
        >
          {result.msg}
        </motion.p>
      )}
    </motion.div>
  );
}
