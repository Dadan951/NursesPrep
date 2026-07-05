import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import NursesLogo from '../components/NursesLogo';
import AuthScene, { BRAND } from '../components/AuthScene';

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

/* ─── Carte en verre premium ───────────────────────────────────────────────── */
function GlassCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="relative w-full rounded-[28px] p-7 sm:p-8"
      style={{
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.9)',
        boxShadow: '0 30px 80px rgba(30,58,95,0.18), 0 2px 0 rgba(255,255,255,0.7) inset',
      }}
    >
      <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-[28px] overflow-hidden">
        <div className="h-full w-full" style={{ background: BRAND }} />
      </div>
      {children}
    </motion.div>
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
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 overflow-hidden">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div key={i} className="h-1 flex-1 rounded-full"
            animate={{ backgroundColor: i <= s ? c : '#e2e8f0' }} transition={{ duration: 0.3 }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color: c }}>{labels[s]}</p>
    </motion.div>
  );
}

const INPUT = `w-full py-3.5 rounded-2xl border text-[16px] text-slate-800 placeholder-slate-300 focus:outline-none transition-all duration-200`;

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
  const [step,           setStep]           = useState('form');
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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

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
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } } };

  const fieldBorder = (key, valid) =>
    touched[key]
      ? valid
        ? 'border-emerald-300 bg-emerald-50/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/70'
        : 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100/70'
      : 'border-slate-200 bg-white/70 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/70';

  const ValidationIcon = ({ isValid }) => (
    isValid
      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  );

  const EyeBtn = ({ shown, onClick }) => (
    <button type="button" onClick={onClick} className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
      {shown
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
    </button>
  );

  const BackHome = () => (
    <div className="absolute top-5 left-5 z-20">
      <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        Accueil
      </Link>
    </div>
  );

  /* ── Écran de vérification ─────────────────────────────────────────────── */
  if (step === 'verify') {
    return (
      <AuthScene>
        <Toast msg={toast} />
        <div className="w-full max-w-[400px]">
          <BackHome />
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-center">
            <NursesLogo size="md" />
          </motion.div>
          <GlassCard>
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: BRAND, boxShadow: '0 12px 30px rgba(37,99,235,0.38)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </motion.div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center mb-1">Vérifie ton email</h2>
            <p className="text-xs text-slate-400 text-center mb-1">Un code à 6 chiffres a été envoyé à</p>
            <p className="text-sm font-semibold text-blue-600 text-center mb-6 break-all">{pendingEmail}</p>

            <form onSubmit={handleVerify} className="space-y-4">
              <input type="text" inputMode="numeric" maxLength={6} value={verifyCode}
                onChange={e => { setVerifyCode(e.target.value.replace(/\D/g, '')); setVerifyError(''); }}
                placeholder="_ _ _ _ _ _"
                className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 rounded-2xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-white/70" />

              <AnimatePresence>
                {verifyError && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-xl">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {verifyError}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={verifyLoading || verifyCode.length !== 6}
                whileHover={{ scale: verifyLoading ? 1 : 1.02, y: verifyLoading ? 0 : -2 }} whileTap={{ scale: 0.985 }}
                className="relative w-full py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden transition disabled:opacity-60"
                style={{ background: BRAND, boxShadow: '0 10px 26px rgba(37,99,235,0.34)' }}>
                {!verifyLoading && (
                  <motion.span className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ['-130%', '180%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }} />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {verifyLoading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Vérification...</>
                    : 'Confirmer mon compte →'}
                </span>
              </motion.button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-4">
              Tu n'as pas reçu le code ?{' '}
              {countdown > 0
                ? <span className="text-slate-400">Renvoyer dans {countdown}s</span>
                : <button onClick={handleResend} disabled={resendLoading} className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
                    {resendLoading ? 'Envoi...' : 'Renvoyer'}
                  </button>}
            </p>
            <button onClick={() => { setStep('form'); setVerifyCode(''); setVerifyError(''); }}
              className="w-full mt-3 text-xs text-slate-400 hover:text-slate-600 transition-colors">
              ← Changer d'adresse email
            </button>
          </GlassCard>
        </div>
      </AuthScene>
    );
  }

  /* ── Formulaire d'inscription ──────────────────────────────────────────── */
  return (
    <AuthScene>
      <Toast msg={toast} />
      <div className="w-full max-w-[420px]">
        <BackHome />
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-6 flex justify-center">
          <NursesLogo size="md" />
        </motion.div>

        <GlassCard>
          <h1 className="text-[23px] font-extrabold text-slate-800 text-center mb-0.5">Crée ton compte</h1>
          <p className="text-xs text-slate-400 text-center mb-6">Gratuit · Sans carte bancaire · En 30 secondes</p>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }} whileTap={{ scale: 0.985 }}
            onClick={() => window.location.href = 'https://api.nursesprep.fr/api/auth/google'}
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 bg-white/70 hover:bg-white hover:border-slate-300 transition-all shadow-sm hover:shadow mb-4">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.49-1.47-.76-3.04-.76-4.59s.27-3.12.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            </svg>
            S'inscrire avec Google
          </motion.button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-200/70" />
            <span className="text-[11px] text-slate-400 whitespace-nowrap">ou avec ton email</span>
            <div className="flex-1 h-px bg-slate-200/70" />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl mb-4">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form onSubmit={handleSubmit} variants={container} initial="hidden" animate="show" className="space-y-3.5">
            {/* Name */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input type="text" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, name: true }))}
                  placeholder="Marie Dupont"
                  className={`${INPUT} pl-11 pr-10 ${fieldBorder('name', nameValid)}`} />
                <AnimatePresence>
                  {touched.name && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-4 top-1/2 -translate-y-1/2">
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input type="email" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                  placeholder="vous@exemple.fr"
                  className={`${INPUT} pl-11 pr-10 ${fieldBorder('email', emailValid)}`} />
                <AnimatePresence>
                  {touched.email && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-4 top-1/2 -translate-y-1/2">
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
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder="Min. 6 caractères"
                  className={`${INPUT} pl-11 pr-16 ${fieldBorder('password', pwdValid)}`} />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <AnimatePresence>
                    {touched.password && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ValidationIcon isValid={pwdValid} /></motion.div>
                    )}
                  </AnimatePresence>
                  <EyeBtn shown={showPwd} onClick={() => setShowPwd(v => !v)} />
                </div>
              </div>
              <StrengthBar password={form.password} />
            </motion.div>

            {/* Confirm */}
            <motion.div variants={item}>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.01-.11-1.991-.301-2.95"/></svg>
                </div>
                <input type={showCfm ? 'text' : 'password'} value={form.confirm}
                  onChange={e => setForm({ ...form, confirm: e.target.value })}
                  onBlur={() => setTouched(t => ({ ...t, confirm: true }))}
                  placeholder="••••••••"
                  className={`${INPUT} pl-11 pr-16 ${fieldBorder('confirm', confirmValid)}`} />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <AnimatePresence>
                    {touched.confirm && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><ValidationIcon isValid={confirmValid} /></motion.div>
                    )}
                  </AnimatePresence>
                  <EyeBtn shown={showCfm} onClick={() => setShowCfm(v => !v)} />
                </div>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={item} className="pt-1">
              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }} whileTap={{ scale: 0.985 }}
                className="relative w-full py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden disabled:opacity-70"
                style={{ background: BRAND, boxShadow: '0 10px 26px rgba(37,99,235,0.34)' }}>
                {!loading && (
                  <motion.span className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    animate={{ x: ['-130%', '180%'] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }} />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Création...</>
                    : 'Créer mon compte →'}
                </span>
              </motion.button>
            </motion.div>
          </motion.form>

          <p className="text-center text-[10px] text-slate-400 mt-3 leading-relaxed px-2">
            En créant un compte, tu acceptes nos{' '}
            <Link to="/cgu" className="underline hover:text-slate-600 transition-colors">conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link to="/confidentialite" className="underline hover:text-slate-600 transition-colors">politique de confidentialité</Link>.
          </p>

          <p className="text-center text-xs text-slate-400 mt-3">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">Se connecter</Link>
          </p>
        </GlassCard>

        {/* Réassurance */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 mt-5 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            100% gratuit
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Données sécurisées
          </span>
        </motion.div>
      </div>
    </AuthScene>
  );
}
