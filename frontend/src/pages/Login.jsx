import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  motion, AnimatePresence,
  useMotionValue, useTransform, useSpring,
} from 'framer-motion';
import NursesLogo from '../components/NursesLogo';

/* ─── Animated orb ──────────────────────────────────────────────────────── */
function Orb({ className, delay = 0, duration = 9 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{ y: [0, -28, 0], scale: [1, 1.07, 1], opacity: [0.55, 0.85, 0.55] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ─── Feature item ───────────────────────────────────────────────────────── */
function Feature({ icon, label, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 border border-white/10">
        {icon}
      </div>
      <span className="text-sm text-blue-100/90">{label}</span>
    </motion.div>
  );
}

/* ─── Toast ──────────────────────────────────────────────────────────────── */
function Toast({ msg }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-800/95 backdrop-blur text-white text-xs px-5 py-2.5 rounded-full shadow-xl whitespace-nowrap flex items-center gap-2"
        >
          <span className="text-cyan-400">✦</span>
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── ECG decoration ────────────────────────────────────────────────────── */
function EcgLine() {
  return (
    <svg viewBox="0 0 320 60" className="w-full opacity-20" fill="none">
      <motion.polyline
        points="0,30 40,30 55,10 65,50 75,20 85,40 95,30 320,30"
        stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.8, ease: 'easeInOut' }}
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   LOGIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPwd, setShowPwd] = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');

  /* ── Validation ── */
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwdValid   = form.password.length >= 6;

  /* ── Mouse parallax ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tx1  = useTransform(rawX, [-1, 1], [-22, 22]);
  const ty1  = useTransform(rawY, [-1, 1], [-22, 22]);
  const tx2  = useTransform(rawX, [-1, 1], [16, -16]);
  const ty2  = useTransform(rawY, [-1, 1], [12, -12]);
  const o1x  = useSpring(tx1, { stiffness: 90,  damping: 22 });
  const o1y  = useSpring(ty1, { stiffness: 90,  damping: 22 });
  const o2x  = useSpring(tx2, { stiffness: 70,  damping: 28 });
  const o2y  = useSpring(ty2, { stiffness: 70,  damping: 28 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  * 2 - 1);
    rawY.set((e.clientY - r.top)  / r.height * 2 - 1);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    if (!emailValid || !pwdValid) return;
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  /* ── Variants ── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  };

  const fieldClass = (key, valid) =>
    `w-full py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-300
     focus:outline-none transition-all duration-200
     ${touched[key]
       ? valid
         ? 'border-emerald-300 bg-emerald-50/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/70'
         : 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100/70'
       : 'border-slate-200 bg-slate-50/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/70'
     }`;

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-900">
      <Toast msg={toast} />

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <motion.div
        className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1e3a5f 42%, #0c4a6e 75%, #134e4a 100%)' }}
        onMouseMove={handleMouseMove}
      >
        {/* Parallax orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/15 blur-3xl"
          style={{ x: o1x, y: o1y, top: '-10%', left: '-5%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-blue-500/12 blur-3xl"
          style={{ x: o2x, y: o2y, bottom: '5%', right: '-5%' }}
        />
        <Orb className="w-64 h-64 bg-teal-400/10"  delay={0}   style={{ top: '45%', left: '50%', transform: 'translate(-50%,-50%)' }} />
        <Orb className="w-40 h-40 bg-cyan-300/12"  delay={2}   duration={7} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-[440px] w-full px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <NursesLogo size="lg" light />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl xl:text-[2.4rem] font-bold leading-tight mb-4"
          >
            Révise efficacement<br />
            <span className="text-cyan-400">pour ton IFSI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="text-blue-200/80 text-sm leading-relaxed mb-10"
          >
            Des milliers d'étudiants infirmiers font confiance à NursePrep pour préparer leur concours et valider leurs UE.
          </motion.p>

          <div className="space-y-4 mb-10">
            <Feature delay={0.38} label="Fiches de révision structurées et illustrées"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"><path d="M9 12l2 2 4-4"/><rect x="3" y="3" width="18" height="18" rx="3"/></svg>} />
            <Feature delay={0.46} label="QCM interactifs avec corrections détaillées"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} />
            <Feature delay={0.54} label="Suivi de progression en temps réel"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
            <Feature delay={0.62} label="Communauté d'entraide entre étudiants IFSI"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
          </div>

          {/* ECG decoration */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6 -mx-2"
          >
            <EcgLine />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6"
          >
            {[['5 000+', 'Étudiants'], ['50 000+', 'Questions'], ['98 %', 'Satisfaction']].map(([n, l]) => (
              <div key={l}>
                <div className="text-lg font-bold text-cyan-400">{n}</div>
                <div className="text-xs text-blue-300/70 mt-0.5">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ══════════════ RIGHT PANEL ══════════════ */}
      <div className="relative w-full lg:w-[48%] xl:w-[42%] bg-white flex flex-col items-center justify-center p-6 overflow-y-auto">

        {/* Back link */}
        <div className="absolute top-5 left-5">
          <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            Accueil
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[340px]"
        >
          {/* Logo — mobile only */}
          <div className="flex justify-center mb-7 lg:hidden">
            <NursesLogo size="md" />
          </div>
          {/* Logo — desktop */}
          <div className="hidden lg:flex justify-center mb-7">
            <NursesLogo size="sm" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">Bon retour ! 👋</h1>
          <p className="text-sm text-slate-400 text-center mb-7">Connecte-toi pour continuer tes révisions</p>

          {/* ── Social buttons ── */}
          <div className="space-y-2.5 mb-5">
            <motion.button
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => showToast('Connexion Google — bientôt disponible ✨')}
              className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.49-1.47-.76-3.04-.76-4.59s.27-3.12.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              </svg>
              Continuer avec Google
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => showToast('Lien magique — bientôt disponible ✨')}
              className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              Connexion par lien magique
            </motion.button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 whitespace-nowrap">ou avec ton email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl mb-4"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* Email */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="vous@exemple.fr"
                  className={`${fieldClass('email', emailValid)} pl-10 pr-9`}
                />
                <AnimatePresence>
                  {touched.email && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    >
                      {emailValid
                        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      }
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={item}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => showToast('Réinitialisation — bientôt disponible ✨')}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder="••••••••"
                  className={`${fieldClass('password', pwdValid)} pl-10 pr-16`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <AnimatePresence>
                    {touched.password && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        {pwdValid
                          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                  >
                    {showPwd
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item} className="pt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -1.5 }}
                whileTap={{ scale: 0.985 }}
                className="relative w-full py-3 rounded-xl text-sm font-semibold text-white overflow-hidden disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
              >
                {/* Shimmer sweep */}
                {!loading && (
                  <motion.span
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-130%', '180%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connexion...</>
                    : 'Se connecter →'
                  }
                </span>
              </motion.button>
            </motion.div>
          </motion.form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
              Créer un compte
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
