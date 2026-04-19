import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';
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
      animate={{ y: [0, -28, 0], scale: [1, 1.07, 1], opacity: [0.5, 0.8, 0.5] }}
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

/* ─── Password strength bar ──────────────────────────────────────────────── */
function StrengthBar({ password }) {
  if (!password) return null;
  let s = 0;
  if (password.length >= 6)            s++;
  if (password.length >= 10)           s++;
  if (/[A-Z]/.test(password))          s++;
  if (/[0-9]/.test(password))          s++;
  if (/[^A-Za-z0-9]/.test(password))   s++;

  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];
  const labels = ['', 'Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
  const c = colors[s] || '#e2e8f0';

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="mt-2 overflow-hidden"
    >
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div
            key={i}
            className="h-1 flex-1 rounded-full"
            animate={{ backgroundColor: i <= s ? c : '#e2e8f0' }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: c }}>{labels[s]}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   REGISTER PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function Register() {
  const { register, verifyEmail } = useAuth();
  const navigate      = useNavigate();

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' });
  const [touched, setTouched] = useState({ name: false, email: false, password: false, confirm: false });
  const [showPwd, setShowPwd] = useState(false);
  const [showCfm, setShowCfm] = useState(false);
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState('');

  /* ── Étape 2 : vérification email ── */
  const [step,           setStep]           = useState('form'); // 'form' | 'verify'
  const [pendingEmail,   setPendingEmail]   = useState('');
  const [verifyCode,     setVerifyCode]     = useState('');
  const [verifyLoading,  setVerifyLoading]  = useState(false);
  const [verifyError,    setVerifyError]    = useState('');
  const [resendLoading,  setResendLoading]  = useState(false);
  const [countdown,      setCountdown]      = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  };

  /* ── Validation ── */
  const nameValid    = form.name.trim().length >= 2;
  const emailValid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwdValid     = form.password.length >= 6;
  const confirmValid = form.confirm === form.password && form.confirm.length > 0;

  /* ── Mouse parallax ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tx1  = useTransform(rawX, [-1, 1], [-20, 20]);
  const ty1  = useTransform(rawY, [-1, 1], [-20, 20]);
  const tx2  = useTransform(rawX, [-1, 1], [14, -14]);
  const ty2  = useTransform(rawY, [-1, 1], [10, -10]);
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
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!nameValid)    return setError('Le nom doit contenir au moins 2 caractères');
    if (!emailValid)   return setError('Adresse email invalide');
    if (!pwdValid)     return setError('Le mot de passe doit faire au moins 6 caractères');
    if (!confirmValid) return setError('Les mots de passe ne correspondent pas');
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      if (res?.needsVerification) {
        setPendingEmail(res.email);
        setStep('verify');
        startCountdown();
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verifyCode.length !== 6) return setVerifyError('Entre les 6 chiffres du code');
    setVerifyLoading(true); setVerifyError('');
    try {
      await verifyEmail(pendingEmail, verifyCode);
      navigate('/dashboard');
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Code incorrect');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResendLoading(true);
    try {
      await axios.post(`${API_URL}/auth/resend-code`, { email: pendingEmail });
      showToast('Code renvoyé !');
      startCountdown();
    } catch { showToast('Erreur lors du renvoi'); }
    finally { setResendLoading(false); }
  };

  /* ── Variants ── */
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
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

  const ValidationIcon = ({ isValid }) => (
    isValid
      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );

  /* ── Écran de vérification ─────────────────────────────────────────────── */
  if (step === 'verify') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <Toast msg={toast} />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8"
        >
          {/* Icône */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0891b2,#0d9488)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 text-center mb-1">Vérifie ton email 📧</h2>
          <p className="text-xs text-slate-400 text-center mb-1">Un code à 6 chiffres a été envoyé à</p>
          <p className="text-sm font-semibold text-blue-600 text-center mb-6">{pendingEmail}</p>

          <form onSubmit={handleVerify} className="space-y-4">
            {/* Code input */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Code de vérification</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={verifyCode}
                onChange={e => { setVerifyCode(e.target.value.replace(/\D/g, '')); setVerifyError(''); }}
                placeholder="_ _ _ _ _ _"
                className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50"
              />
            </div>

            <AnimatePresence>
              {verifyError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {verifyError}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={verifyLoading || verifyCode.length !== 6}
              whileHover={{ scale: verifyLoading ? 1 : 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#0891b2,#0d9488)' }}
            >
              {verifyLoading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Vérification...
                  </span>
                : 'Confirmer mon compte →'
              }
            </motion.button>
          </form>

          {/* Renvoi */}
          <p className="text-center text-xs text-slate-400 mt-4">
            Tu n'as pas reçu le code ?{' '}
            {countdown > 0
              ? <span className="text-slate-400">Renvoyer dans {countdown}s</span>
              : <button
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
                >
                  {resendLoading ? 'Envoi...' : 'Renvoyer'}
                </button>
            }
          </p>

          {/* Retour */}
          <button
            onClick={() => { setStep('form'); setVerifyCode(''); setVerifyError(''); }}
            className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Changer d'adresse email
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-900">
      <Toast msg={toast} />

      {/* ══════════════ LEFT PANEL ══════════════ */}
      <motion.div
        className="hidden lg:flex lg:w-[52%] xl:w-[58%] relative flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0f172a 0%, #1a2f5f 42%, #134e4a 75%, #0c4a6e 100%)' }}
        onMouseMove={handleMouseMove}
      >
        {/* Parallax orbs */}
        <motion.div
          className="absolute w-[480px] h-[480px] rounded-full bg-teal-500/15 blur-3xl"
          style={{ x: o1x, y: o1y, top: '-8%', right: '-8%' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full bg-cyan-400/12 blur-3xl"
          style={{ x: o2x, y: o2y, bottom: '5%', left: '-5%' }}
        />
        <Orb className="w-56 h-56 bg-blue-400/10" delay={1.2} duration={11} />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)',
          backgroundSize: '44px 44px',
        }} />

        {/* Decorative floating "+" symbols */}
        {[
          { top: '15%', left: '12%', size: 28, delay: 0.5, dur: 7 },
          { top: '72%', left: '78%', size: 18, delay: 1.2, dur: 9 },
          { top: '40%', left: '88%', size: 22, delay: 2,   dur: 8 },
        ].map(({ top, left, size, delay, dur }, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10 font-bold select-none pointer-events-none"
            style={{ top, left, fontSize: size }}
            animate={{ y: [0, -14, 0], rotate: [0, 15, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
          >
            +
          </motion.div>
        ))}

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
            Rejoins la communauté<br />
            <span className="text-teal-400">NursePrep</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.6 }}
            className="text-blue-200/80 text-sm leading-relaxed mb-10"
          >
            Crée ton compte gratuitement et accède à toute la plateforme. Aucune carte bancaire requise.
          </motion.p>

          <div className="space-y-4 mb-10">
            <Feature delay={0.38} label="Accès gratuit à des centaines de ressources"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} />
            <Feature delay={0.46} label="Progression sauvegardée automatiquement"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>} />
            <Feature delay={0.54} label="Groupes de révision collaboratifs"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>} />
            <Feature delay={0.62} label="Notifications et rappels de révision"
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5eead4" strokeWidth="2.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>} />
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4"
          >
            <p className="text-xs text-blue-200/80 italic leading-relaxed mb-3">
              "NursePrep m'a permis de valider toutes mes UE dès le premier essai. Les fiches sont claires et les QCM vraiment ciblés !"
            </p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-xs font-bold text-white">
                M
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Marie L.</p>
                <p className="text-xs text-blue-300/60">IFSI Paris — Promo 2024</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#fbbf24" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
            </div>
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
          className="w-full max-w-[340px] py-8"
        >
          {/* Logo — mobile only */}
          <div className="flex justify-center mb-7 lg:hidden">
            <NursesLogo size="md" />
          </div>
          {/* Logo — desktop */}
          <div className="hidden lg:flex justify-center mb-7">
            <NursesLogo size="sm" />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-1">Créer un compte ✨</h1>
          <p className="text-sm text-slate-400 text-center mb-7">Gratuit · Sans carte bancaire · En 30 secondes</p>

          {/* ── Social buttons ── */}
          <div className="space-y-2.5 mb-5">
            <motion.button
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => showToast('Inscription Google — bientôt disponible ✨')}
              className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow"
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.49-1.47-.76-3.04-.76-4.59s.27-3.12.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              </svg>
              S'inscrire avec Google
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
              S'inscrire avec un lien magique
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
            className="space-y-3.5"
          >
            {/* Name */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, name: true }))}
                  placeholder="Marie Dupont"
                  className={`${fieldClass('name', nameValid)} pl-10 pr-9`}
                />
                <AnimatePresence>
                  {touched.name && (
                    <motion.div
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    >
                      <ValidationIcon isValid={nameValid} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

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
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    >
                      <ValidationIcon isValid={emailValid} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder="Min. 6 caractères"
                  className={`${fieldClass('password', pwdValid)} pl-10 pr-16`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <AnimatePresence>
                    {touched.password && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ValidationIcon isValid={pwdValid} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="button" onClick={() => setShowPwd(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                    {showPwd
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
              {/* Strength bar */}
              <StrengthBar password={form.password} />
            </motion.div>

            {/* Confirm password */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.01-.11-1.991-.301-2.95" strokeWidth="2"/></svg>
                </div>
                <input
                  type={showCfm ? 'text' : 'password'}
                  value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                  placeholder="••••••••"
                  className={`${fieldClass('confirm', confirmValid)} pl-10 pr-16`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <AnimatePresence>
                    {touched.confirm && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <ValidationIcon isValid={confirmValid} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button type="button" onClick={() => setShowCfm(v => !v)} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                    {showCfm
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
                style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0d9488 100%)' }}
              >
                {!loading && (
                  <motion.span
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-130%', '180%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Création...</>
                    : 'Créer mon compte →'
                  }
                </span>
              </motion.button>
            </motion.div>
          </motion.form>

          {/* Terms */}
          <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed px-2">
            En créant un compte, tu acceptes nos{' '}
            <button onClick={() => showToast('CGU — bientôt disponibles')} className="underline hover:text-slate-600 transition-colors">conditions d'utilisation</button>
            {' '}et notre{' '}
            <button onClick={() => showToast('Politique de confidentialité — bientôt disponible')} className="underline hover:text-slate-600 transition-colors">politique de confidentialité</button>.
          </p>

          <p className="text-center text-xs text-slate-400 mt-4">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
              Se connecter
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
