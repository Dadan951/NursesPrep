import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../context/AuthContext';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import NursesLogo from '../components/NursesLogo';

/* ─── Toast ─────────────────────────────────────────────────────────────── */
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

  const [mode,          setMode]          = useState('login');
  const [forgotEmail,   setForgotEmail]   = useState('');
  const [forgotCode,    setForgotCode]    = useState('');
  const [newPwd,        setNewPwd]        = useState('');
  const [showNewPwd,    setShowNewPwd]    = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError,   setForgotError]   = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [countdown,     setCountdown]     = useState(0);

  const startCountdown = () => {
    setCountdown(60);
    const t = setInterval(() => setCountdown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; }), 1000);
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) return setForgotError('Email invalide');
    setForgotLoading(true); setForgotError('');
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, { email: forgotEmail });
      setMode('forgot-code');
      startCountdown();
    } catch { setForgotError('Erreur, réessaie'); }
    finally { setForgotLoading(false); }
  };

  const handleForgotCode = async (e) => {
    e.preventDefault();
    if (forgotCode.length !== 6) return setForgotError('Entre les 6 chiffres du code');
    if (newPwd.length < 6)       return setForgotError('Au moins 6 caractères');
    setForgotLoading(true); setForgotError('');
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email: forgotEmail, code: forgotCode, newPassword: newPwd });
      setForgotSuccess(true);
      setTimeout(() => { setMode('login'); setForgotSuccess(false); setForgotEmail(''); setForgotCode(''); setNewPwd(''); }, 2500);
    } catch (err) { setForgotError(err.response?.data?.message || 'Code incorrect'); }
    finally { setForgotLoading(false); }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    try {
      await axios.post(`${API_URL}/auth/resend-code`, { email: forgotEmail, type: 'reset' });
      showToast('Code renvoyé !');
      startCountdown();
    } catch { showToast('Erreur lors du renvoi'); }
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const pwdValid   = form.password.length >= 6;

  /* ── Mouse parallax ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tx1  = useTransform(rawX, [-1, 1], [-30, 30]);
  const ty1  = useTransform(rawY, [-1, 1], [-20, 20]);
  const tx2  = useTransform(rawX, [-1, 1], [20, -20]);
  const ty2  = useTransform(rawY, [-1, 1], [15, -15]);
  const o1x  = useSpring(tx1, { stiffness: 70, damping: 22 });
  const o1y  = useSpring(ty1, { stiffness: 70, damping: 22 });
  const o2x  = useSpring(tx2, { stiffness: 55, damping: 28 });
  const o2y  = useSpring(ty2, { stiffness: 55, damping: 28 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  * 2 - 1);
    rawY.set((e.clientY - r.top)  / r.height * 2 - 1);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

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

  const fieldClass = (key, valid) =>
    `w-full py-3 rounded-xl border text-sm text-slate-800 placeholder-slate-300 focus:outline-none transition-all duration-200
     ${touched[key]
       ? valid
         ? 'border-emerald-300 bg-emerald-50/30 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100/70'
         : 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-2 focus:ring-red-100/70'
       : 'border-slate-200 bg-slate-50/60 focus:border-blue-400 focus:ring-2 focus:ring-blue-100/70'
     }`;

  /* ── Mot de passe oublié ─────────────────────────────────────────────── */
  if (mode === 'forgot-email' || mode === 'forgot-code') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #f0f6ff 0%, #e7f0fe 45%, #e6f7fb 100%)' }}
      >
        <Toast msg={toast} />

        {/* Background orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-300/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-8%] w-[350px] h-[350px] rounded-full bg-indigo-300/20 blur-3xl pointer-events-none" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.5]" style={{
          backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.14) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div className="relative z-10 w-full max-w-sm">
          <motion.div className="mb-6 flex justify-center"
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <NursesLogo size="md" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
            className="bg-white rounded-3xl p-8 border border-slate-100"
            style={{ boxShadow: '0 24px 60px rgba(30,58,95,0.14)' }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {mode === 'forgot-email' && (
                <motion.div key="email-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold text-slate-800 text-center mb-1">Mot de passe oublié ?</h2>
                  <p className="text-xs text-slate-400 text-center mb-6">Entre ton email pour recevoir un code</p>
                  <form onSubmit={handleForgotEmail} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                      <input type="email" value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setForgotError(''); }}
                        placeholder="vous@exemple.fr"
                        className="w-full py-3 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50"
                      />
                    </div>
                    <AnimatePresence>
                      {forgotError && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
                          {forgotError}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <motion.button type="submit" disabled={forgotLoading}
                      whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                      {forgotLoading
                        ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Envoi...</span>
                        : 'Envoyer le code →'}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {mode === 'forgot-code' && (
                <motion.div key="code-step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold text-slate-800 text-center mb-1">
                    {forgotSuccess ? 'Mot de passe modifié !' : 'Nouveau mot de passe'}
                  </h2>
                  <p className="text-xs text-slate-400 text-center mb-6">
                    {forgotSuccess
                      ? 'Redirection vers la connexion...'
                      : <>Code envoyé à <strong className="text-blue-600">{forgotEmail}</strong></>}
                  </p>
                  {!forgotSuccess && (
                    <form onSubmit={handleForgotCode} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Code reçu par email</label>
                        <input type="text" inputMode="numeric" maxLength={6} value={forgotCode}
                          onChange={e => { setForgotCode(e.target.value.replace(/\D/g, '')); setForgotError(''); }}
                          placeholder="_ _ _ _ _ _"
                          className="w-full text-center text-2xl font-bold tracking-[0.5em] py-4 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nouveau mot de passe</label>
                        <div className="relative">
                          <input type={showNewPwd ? 'text' : 'password'} value={newPwd}
                            onChange={e => { setNewPwd(e.target.value); setForgotError(''); }}
                            placeholder="••••••••"
                            className="w-full py-3 pl-4 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition bg-slate-50"
                          />
                          <button type="button" onClick={() => setShowNewPwd(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            {showNewPwd
                              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {forgotError && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-xs text-red-500 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">
                            {forgotError}
                          </motion.p>
                        )}
                      </AnimatePresence>
                      <motion.button type="submit" disabled={forgotLoading}
                        whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                        {forgotLoading
                          ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Modification...</span>
                          : 'Modifier le mot de passe →'}
                      </motion.button>
                      <p className="text-center text-xs text-slate-400">
                        Pas reçu ?{' '}
                        {countdown > 0
                          ? <span>Renvoyer dans {countdown}s</span>
                          : <button type="button" onClick={handleResend} className="text-blue-500 font-semibold hover:text-blue-600 transition-colors">Renvoyer</button>
                        }
                      </p>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => { setMode('login'); setForgotError(''); setForgotEmail(''); setForgotCode(''); setNewPwd(''); }}
              className="w-full mt-4 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Retour à la connexion
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════════
     MAIN LOGIN — plein écran sombre, formulaire centré
  ══════════════════════════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f0f6ff 0%, #e7f0fe 45%, #e6f7fb 100%)' }}
      onMouseMove={handleMouseMove}
    >
      <Toast msg={toast} />

      {/* ── Orbes parallaxe ── */}
      <motion.div
        className="absolute rounded-full bg-cyan-300/30 blur-3xl pointer-events-none"
        style={{ width: 640, height: 640, x: o1x, y: o1y, top: '-20%', left: '-18%' }}
      />
      <motion.div
        className="absolute rounded-full bg-indigo-300/25 blur-3xl pointer-events-none"
        style={{ width: 420, height: 420, x: o2x, y: o2y, bottom: '-12%', right: '-10%' }}
      />
      <div className="absolute w-64 h-64 rounded-full bg-sky-300/20 blur-3xl pointer-events-none"
        style={{ top: '40%', left: '65%' }} />

      {/* ── Texture points ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.14) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }} />

      {/* ── ECG décoratif bas de page ── */}
      <div className="absolute bottom-[8%] left-0 right-0 opacity-[0.25] pointer-events-none">
        <svg viewBox="0 0 320 60" className="w-full" fill="none">
          <motion.polyline
            points="0,30 40,30 55,10 65,50 75,20 85,40 95,30 320,30"
            stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.5, delay: 1, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {/* ── Croix médicale déco (coin haut droite) ── */}
      <div className="absolute top-8 right-10 opacity-[0.10] pointer-events-none">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#164e8a" strokeWidth="1">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>
      {/* ── Croix médicale déco (coin bas gauche) ── */}
      <div className="absolute bottom-12 left-8 opacity-[0.08] pointer-events-none">
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#164e8a" strokeWidth="1">
          <path d="M12 2v20M2 12h20"/>
        </svg>
      </div>

      {/* ── Lien retour ── */}
      <div className="absolute top-5 left-5 z-20">
        <Link to="/" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          Accueil
        </Link>
      </div>

      {/* ══ Contenu principal ══ */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[360px]">

        {/* Logo au-dessus de la carte */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <NursesLogo size="md" />
        </motion.div>

        {/* ── Carte formulaire ── */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="w-full bg-white rounded-3xl p-7 border border-slate-100"
          style={{ boxShadow: '0 28px 70px rgba(30,58,95,0.16)' }}
        >
          <h1 className="text-[22px] font-bold text-slate-800 text-center mb-0.5">Bon retour !</h1>
          <p className="text-xs text-slate-400 text-center mb-6">Connecte-toi pour continuer tes révisions</p>

          {/* Google */}
          <motion.button
            whileHover={{ scale: 1.015, y: -1 }}
            whileTap={{ scale: 0.985 }}
            onClick={() => { window.location.href = 'https://api.nursesprep.fr/api/auth/google'; }}
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow mb-4"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.49-1.47-.76-3.04-.76-4.59s.27-3.12.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            </svg>
            Continuer avec Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] text-slate-400 whitespace-nowrap">ou avec ton email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Erreur */}
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

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
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
                      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
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
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
                <button type="button"
                  onClick={() => { setMode('forgot-email'); setForgotError(''); }}
                  className="text-xs text-blue-500 hover:text-blue-600 transition-colors">
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
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-0.5">
                    {showPwd
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>
            </div>

            {/* Bouton connexion */}
            <div className="pt-1">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -1.5 }}
                whileTap={{ scale: 0.985 }}
                className="relative w-full py-3 rounded-xl text-sm font-semibold text-white overflow-hidden disabled:opacity-70"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)' }}
              >
                {!loading && (
                  <motion.span
                    className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ['-130%', '180%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                )}
                <span className="relative flex items-center justify-center gap-2">
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Connexion...</>
                    : 'Se connecter →'}
                </span>
              </motion.button>
            </div>
          </form>

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
