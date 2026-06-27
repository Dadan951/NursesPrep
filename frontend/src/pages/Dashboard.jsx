import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

/* ── Animated counter ──────────────────────────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      let cur = 0;
      const step = target / 50;
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

/* ── SVG Progress ring ─────────────────────────────────────────────────────── */
function ProgressRing({ value, max, color, size = 80, sw = 7 }) {
  const r = (size - sw) / 2;
  const c = 2 * Math.PI * r;
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={sw} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - pct) }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-slate-800 leading-none tabular-nums">{value}</span>
        <span className="text-[10px] text-slate-400 mt-0.5">/{max}</span>
      </div>
    </div>
  );
}

/* ── Stagger animation variants ────────────────────────────────────────────── */
const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const cardVariant = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Tips ──────────────────────────────────────────────────────────────────── */
const TIPS = [
  "La répétition espacée augmente la mémorisation de 200 %. Révise tes flashcards chaque jour, même 5 minutes.",
  "Avant une garde, relis les valeurs normales des constantes vitales : elles reviennent souvent aux examens.",
  "Les cas cliniques IFSI testent ton raisonnement clinique. Explique toujours ton pourquoi.",
  "Groupe tes révisions par UE : la cohérence thématique ancre mieux les notions dans ta mémoire.",
];

/* ── Icons ─────────────────────────────────────────────────────────────────── */
const IconQuiz = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><circle cx="12" cy="17" r=".5" fill={color} />
  </svg>
);
const IconFlash = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="14" height="11" rx="2" /><rect x="8" y="9" width="14" height="11" rx="2" />
  </svg>
);
const IconExo = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
  </svg>
);
const IconStar = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);
const IconBook = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
const IconAnnale = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="9" y1="12" x2="15" y2="12" /><line x1="9" y1="16" x2="13" y2="16" />
  </svg>
);
const IconPill = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 20H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H20a2 2 0 0 1 2 2v2" />
    <circle cx="17" cy="17" r="5" /><path d="m14.5 19.5 5-5" />
  </svg>
);
const IconGroup = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconSub = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const IconChevron = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconFire = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#f97316">
    <path d="M12 2c0 0-4 5.5-4 9.5a4 4 0 0 0 8 0C16 7.5 12 2 12 2z" />
    <path d="M12 13c0 0-1.5 1.5-1.5 3a1.5 1.5 0 0 0 3 0C13.5 14.5 12 13 12 13z" fill="#fde68a" />
  </svg>
);
const IconInfo = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16" r=".5" fill="#d97706" />
  </svg>
);
const IconEdit = ({ size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const IconClose = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user, token, refreshUser } = useAuth();
  const p = user?.progress || {};

  const [tipIdx, setTipIdx] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [streak, setStreak] = useState(p.streak || 0);
  const [weeklyData, setWeeklyData] = useState([0, 0, 0, 0, 0, 0, 0]);
  const [dailyGoals, setDailyGoals] = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [dailyProgress, setDailyProgress] = useState({ quiz: 0, flashcards: 0, exercises: 0 });
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [editGoals, setEditGoals] = useState({ quizPerDay: 5, flashcardsPerDay: 20, exercisesPerDay: 3 });
  const [savingGoals, setSavingGoals] = useState(false);

  /* Greeting */
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 6 ? 'Bonne nuit' : h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir');
  }, []);

  /* Ping backend */
  useEffect(() => {
    if (!token) return;
    axios.post(`${API_URL}/auth/ping`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (typeof res.data.streak === 'number') setStreak(res.data.streak);
        if (Array.isArray(res.data.weeklyActivity)) setWeeklyData(res.data.weeklyActivity);
        refreshUser();
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  /* Daily goals + progress */
  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/auth/daily`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setDailyGoals(res.data.goals);
        setDailyProgress(res.data.daily);
        setEditGoals(res.data.goals);
      })
      .catch(() => {});
  }, [token]); // eslint-disable-line

  /* Rotate tips */
  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % TIPS.length), 8000);
    return () => clearInterval(id);
  }, []);

  /* Animated counters */
  const quizVal = useCounter(p.quizCompleted || 0, 80);
  const flashVal = useCounter(p.flashcardsReviewed || 0, 160);
  const exercVal = useCounter(p.exercisesCompleted || 0, 240);
  const scoreVal = useCounter(p.totalScore || 0, 320);

  /* Subscription */
  const SUB_CONFIG = {
    free:    { label: 'Gratuit',   bg: 'bg-slate-100',  text: 'text-slate-500' },
    pro:     { label: 'Pro',       bg: 'bg-cyan-500',   text: 'text-white' },
    premium: { label: 'Elite',     bg: 'bg-gradient-to-r from-amber-400 to-orange-500', text: 'text-white' },
  };
  const sub = SUB_CONFIG[user?.subscription] || SUB_CONFIG.free;

  /* Stat cards data */
  const stats = [
    { label: 'Quiz complétés',  val: quizVal,  icon: <IconQuiz color="#0891b2" />, accent: '#0891b2', bg: '#ecfeff' },
    { label: 'Flashcards',      val: flashVal, icon: <IconFlash color="#7c3aed" />, accent: '#7c3aed', bg: '#f5f3ff' },
    { label: 'Exercices',       val: exercVal, icon: <IconExo color="#0d9488" />, accent: '#0d9488', bg: '#f0fdfa' },
    { label: 'Points gagnés',   val: scoreVal, icon: <IconStar color="#d97706" />, accent: '#d97706', bg: '#fffbeb' },
  ];

  /* Daily objective rings */
  const rings = [
    { label: 'Quiz',       value: Math.min(dailyProgress.quiz, dailyGoals.quizPerDay),             max: dailyGoals.quizPerDay,       color: '#0891b2' },
    { label: 'Flashcards', value: Math.min(dailyProgress.flashcards, dailyGoals.flashcardsPerDay), max: dailyGoals.flashcardsPerDay, color: '#7c3aed' },
    { label: 'Exercices',  value: Math.min(dailyProgress.exercises, dailyGoals.exercisesPerDay),   max: dailyGoals.exercisesPerDay,  color: '#0d9488' },
  ];

  /* Quick actions */
  const actions = [
    { to: '/dashboard/quiz',         label: 'Quiz',        desc: 'Tester tes connaissances',  icon: <IconQuiz size={20} color="#fff" />, color: '#0284c7' },
    { to: '/dashboard/flashcards',   label: 'Flashcards',  desc: 'Mémoriser les notions clés', icon: <IconFlash size={20} color="#fff" />, color: '#7c3aed' },
    { to: '/dashboard/exercises',    label: 'Exercices',   desc: 'Cas cliniques & QCM',        icon: <IconExo size={20} color="#fff" />, color: '#0d9488' },
    { to: '/dashboard/cours',        label: 'Cours',       desc: 'Consulter les leçons',       icon: <IconBook size={20} color="#fff" />, color: '#16a34a' },
    { to: '/dashboard/annales',      label: 'Annales',     desc: 'Sujets des années passées',  icon: <IconAnnale size={20} color="#fff" />, color: '#4338ca' },
    { to: '/dashboard/medicaments',  label: 'Médicaments', desc: 'Base de données des drogues',icon: <IconPill size={20} color="#fff" />, color: '#dc2626' },
    { to: '/dashboard/groups',       label: 'Groupes',     desc: 'Réviser en équipe',          icon: <IconGroup size={20} color="#fff" />, color: '#d97706' },
    { to: '/dashboard/subscription', label: 'Abonnement',  desc: 'Gérer mon offre',            icon: <IconSub size={20} color="#fff" />, color: '#db2777' },
  ];

  async function saveGoals() {
    setSavingGoals(true);
    try {
      await axios.put(`${API_URL}/auth/goals`, editGoals, { headers: { Authorization: `Bearer ${token}` } });
      setDailyGoals({ ...editGoals });
      setShowGoalsModal(false);
    } catch {
      /* silent */
    } finally {
      setSavingGoals(false);
    }
  }

  /* Today's date */
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const todayLabel = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">

          {/* ── Welcome header ───────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-400 mb-1">{todayLabel}</p>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {greeting},{' '}
                <span className="text-cyan-600">{user?.name?.split(' ')[0] || 'Étudiant'}</span> 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1">Voici ton espace de révision</p>
            </div>
            <span className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-full ${sub.bg} ${sub.text}`}>
              {sub.label}
            </span>
          </motion.div>

          {/* ── Stat cards ───────────────────────────────────────────────── */}
          <motion.div
            variants={listVariants} initial="hidden" animate="show"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div key={i} variants={cardVariant}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow duration-200">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: s.bg }}
                  >
                    {s.icon}
                  </div>
                  <p className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{s.val}</p>
                  <p className="text-xs font-medium mt-1.5" style={{ color: s.accent }}>{s.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Main grid ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left column — 2/3 */}
            <div className="lg:col-span-2 space-y-6">

              {/* Daily objectives */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                {/* Card header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-50">
                  <h2 className="text-sm font-semibold text-slate-800">Objectifs du jour</h2>
                  <button
                    onClick={() => { setEditGoals({ ...dailyGoals }); setShowGoalsModal(true); }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
                    aria-label="Modifier les objectifs"
                  >
                    <IconEdit />
                    <span className="hidden sm:inline">Modifier</span>
                  </button>
                </div>

                {/* Rings */}
                <div className="grid grid-cols-3 gap-4 px-6 py-6">
                  {rings.map((rg, i) => {
                    const pct = rg.max > 0 ? Math.round((rg.value / rg.max) * 100) : 0;
                    const done = rg.value >= rg.max;
                    return (
                      <div key={i} className="flex flex-col items-center gap-3">
                        <ProgressRing {...rg} />
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-700">{rg.label}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: done ? '#16a34a' : '#94a3b8' }}>
                            {done ? '✓ Objectif atteint' : `${pct}% — objectif ${rg.max}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Quick actions */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Accès rapide</p>
                <motion.div
                  variants={listVariants} initial="hidden" animate="show"
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                >
                  {actions.map((a, i) => (
                    <motion.div key={i} variants={cardVariant}>
                      <Link
                        to={a.to}
                        className="group block bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-slate-200 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110"
                          style={{ backgroundColor: a.color }}
                        >
                          {a.icon}
                        </div>
                        <p className="text-xs font-bold text-slate-800">{a.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{a.desc}</p>
                        <div className="flex items-center gap-0.5 mt-2 text-slate-300 group-hover:text-slate-500 transition-colors">
                          <span className="text-[11px] font-medium">Aller</span>
                          <IconChevron size={11} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right column — 1/3 */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >

              {/* Streak */}
              <div
                className="rounded-2xl p-5 text-white overflow-hidden relative"
                style={{ background: 'linear-gradient(135deg, #0c1a2e 0%, #0e3460 60%, #0891b2 100%)' }}
              >
                {/* Glow */}
                <div
                  className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
                  style={{ background: 'radial-gradient(circle, #38bdf8, transparent)', opacity: 0.2, filter: 'blur(20px)' }}
                  aria-hidden
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <IconFire />
                    <p className="text-sm font-semibold text-cyan-200">Série en cours</p>
                  </div>
                  <motion.p
                    className="text-5xl font-bold tabular-nums leading-none"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring', stiffness: 240, damping: 18 }}
                  >
                    {streak}
                  </motion.p>
                  <p className="text-xs text-cyan-300 mt-1">
                    {streak === 0
                      ? 'Connecte-toi demain pour démarrer !'
                      : `jour${streak > 1 ? 's' : ''} consécutif${streak > 1 ? 's' : ''}`}
                  </p>

                  {/* 7-day progress dots */}
                  <div className="flex gap-1.5 mt-4">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ delay: 0.6 + i * 0.05, type: 'spring' }}
                        className="flex-1 h-1.5 rounded-full origin-bottom"
                        style={{ backgroundColor: i < streak ? '#38bdf8' : 'rgba(255,255,255,0.15)' }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-cyan-400/60 mt-1.5">objectif 7 jours</p>
                </div>
              </div>

              {/* Upgrade nudge — free users only */}
              {user?.subscription === 'free' && (
                <div className="bg-white rounded-2xl border border-cyan-100 shadow-sm p-5 relative overflow-hidden">
                  <div
                    className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #bfdbfe, transparent)', opacity: 0.6, filter: 'blur(16px)', transform: 'translate(8px, -8px)' }}
                    aria-hidden
                  />
                  <div className="relative">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-700 to-cyan-500 flex items-center justify-center mb-3">
                      <IconStar size={16} color="#fff" />
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-1">Passe en Pro</p>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Quiz illimités, toutes les fiches, flashcards sans limite et fiches IA.
                    </p>
                    <Link
                      to="/dashboard/subscription"
                      className="block w-full py-2.5 rounded-xl text-xs font-bold text-white text-center bg-gradient-to-r from-cyan-700 to-cyan-500 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                    >
                      Voir les offres →
                    </Link>
                  </div>
                </div>
              )}

              {/* Tip of the day */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <IconInfo />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">Conseil du jour</p>
                  <span className="ml-auto text-[10px] text-slate-300 tabular-nums">{tipIdx + 1}/{TIPS.length}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tipIdx}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs text-slate-500 leading-relaxed"
                  >
                    {TIPS[tipIdx]}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-1 mt-4">
                  {TIPS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTipIdx(i)}
                      aria-label={`Conseil ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-200 ${i === tipIdx ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-200 hover:bg-slate-300'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Weekly activity bar chart */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <p className="text-xs font-semibold text-slate-700 mb-4">Activité cette semaine</p>
                <div className="flex items-end gap-1.5 h-16">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => {
                    const maxVal = Math.max(...weeklyData, 1);
                    const h = Math.round((weeklyData[i] / maxVal) * 100);
                    const isToday = i === new Date().getDay() - 1;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <motion.div
                          className="w-full rounded-t-md"
                          style={{ backgroundColor: isToday ? '#0891b2' : '#e2e8f0', minHeight: 4 }}
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(h, 4)}%` }}
                          transition={{ delay: 0.4 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          title={`${weeklyData[i]} activités`}
                        />
                        <span className={`text-[9px] font-medium ${isToday ? 'text-cyan-600' : 'text-slate-400'}`}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
        </div>
      </main>

      {/* ── Goals modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showGoalsModal && (
          <motion.div
            key="goals-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setShowGoalsModal(false)}
          >
            <motion.div
              key="goals-modal"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800">Modifier mes objectifs</h3>
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-100 transition-colors"
                  aria-label="Fermer"
                >
                  <IconClose />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'quizPerDay',       label: 'Quiz par jour',       icon: <IconQuiz size={16} color="#0891b2" />, color: '#0891b2', min: 1, max: 500 },
                  { key: 'flashcardsPerDay', label: 'Flashcards par jour', icon: <IconFlash size={16} color="#7c3aed" />, color: '#7c3aed', min: 1, max: 999 },
                  { key: 'exercisesPerDay',  label: 'Exercices par jour',  icon: <IconExo size={16} color="#0d9488" />, color: '#0d9488', min: 1, max: 200 },
                ].map(({ key, label, icon, color, min, max }) => (
                  <div key={key} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    <label className="text-xs font-semibold text-slate-700 flex-1">{label}</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditGoals(g => ({ ...g, [key]: Math.max(min, g[key] - 1) }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-lg font-bold leading-none"
                        aria-label="Diminuer"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min={min}
                        max={max}
                        value={editGoals[key]}
                        onChange={e => {
                          const v = Math.max(min, Math.min(max, parseInt(e.target.value) || min));
                          setEditGoals(g => ({ ...g, [key]: v }));
                        }}
                        className="w-14 text-center text-sm font-bold rounded-lg border-2 py-1.5 outline-none transition-colors"
                        style={{ borderColor: color + '50', color }}
                        aria-label={label}
                      />
                      <button
                        type="button"
                        onClick={() => setEditGoals(g => ({ ...g, [key]: Math.min(max, g[key] + 1) }))}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-lg font-bold leading-none"
                        aria-label="Augmenter"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowGoalsModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-500 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveGoals}
                  disabled={savingGoals}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-700 to-cyan-500 hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {savingGoals ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
