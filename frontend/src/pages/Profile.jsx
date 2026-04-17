import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';
import UserAvatar from '../components/UserAvatar';
import { API_URL } from '../context/AuthContext';

const subConfig = {
  free:    { label: 'Gratuit',  gradient: 'linear-gradient(135deg,#475569,#334155)', light: '#f1f5f9', text: '#475569' },
  pro:     { label: 'Pro',      gradient: 'linear-gradient(135deg,#2563eb,#0891b2)', light: '#eff6ff', text: '#2563eb' },
  premium: { label: 'Premium',  gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)', light: '#f5f3ff', text: '#7c3aed' },
};

/* ─── Animated counter ───────────────────────────────────────────────────────── */
function Counter({ value }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const target = Number(value) || 0;
    if (!target) return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      setCount(Math.round(target * step / 30));
      if (step >= 30) { setCount(target); clearInterval(id); }
    }, 20);
    return () => clearInterval(id);
  }, [value]);
  return <>{count}</>;
}

/* ─── Toast ──────────────────────────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -16, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -12, x: '-50%' }}
      className={`fixed top-5 left-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl flex items-center gap-2 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
      }`}
    >
      {type === 'error'
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      }
      {msg}
    </motion.div>
  );
}

/* ─── Section card ───────────────────────────────────────────────────────────── */
function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition';

/* ─── Avatar Crop Modal ──────────────────────────────────────────────────────── */
function AvatarCropModal({ src, onConfirm, onCancel, loading }) {
  const WRAP   = 300;   // taille du conteneur visible
  const RADIUS = 110;   // rayon du cercle de recadrage
  const CX = WRAP / 2;
  const CY = WRAP / 2;

  const imgRef       = useRef(null);
  const containerRef = useRef(null);
  const scaleRef     = useRef(1);
  const offsetRef    = useRef({ x: 0, y: 0 });
  const dragging     = useRef(false);
  const lastXY       = useRef({ x: 0, y: 0 });
  const pinchRef     = useRef(null);

  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [scale,   setScale]   = useState(1);
  const [offset,  setOffset]  = useState({ x: 0, y: 0 });
  const [grabbed, setGrabbed] = useState(false);

  /* Applique un zoom centré sur le cercle */
  const applyZoom = useCallback((newScale) => {
    const clamped = Math.max(0.1, Math.min(10, newScale));
    const ratio   = clamped / scaleRef.current;
    const newOff  = { x: offsetRef.current.x * ratio, y: offsetRef.current.y * ratio };
    scaleRef.current  = clamped;
    offsetRef.current = newOff;
    setScale(clamped);
    setOffset({ ...newOff });
  }, []);

  const onImgLoad = () => {
    const { naturalWidth: w, naturalHeight: h } = imgRef.current;
    setImgSize({ w, h });
    const s = Math.max((RADIUS * 2) / w, (RADIUS * 2) / h);
    scaleRef.current  = s;
    offsetRef.current = { x: 0, y: 0 };
    setScale(s);
    setOffset({ x: 0, y: 0 });
  };

  /* ── Drag global (mouse) — window listeners pour ne jamais perdre le drag ── */
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastXY.current.x;
      const dy = e.clientY - lastXY.current.y;
      lastXY.current = { x: e.clientX, y: e.clientY };
      offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
      setOffset({ ...offsetRef.current });
    };
    const onUp = () => {
      if (dragging.current) { dragging.current = false; setGrabbed(false); }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    dragging.current = true;
    setGrabbed(true);
    lastXY.current = { x: e.clientX, y: e.clientY };
  };

  /* ── Wheel + touch — attachés via useEffect { passive: false } ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      applyZoom(scaleRef.current * (e.deltaY < 0 ? 1.08 : 0.93));
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        dragging.current = false;
        pinchRef.current = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      } else {
        dragging.current = true;
        lastXY.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        applyZoom(scaleRef.current * (dist / pinchRef.current));
        pinchRef.current = dist;
      } else if (dragging.current && e.touches.length === 1) {
        const dx = e.touches[0].clientX - lastXY.current.x;
        const dy = e.touches[0].clientY - lastXY.current.y;
        lastXY.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        offsetRef.current = { x: offsetRef.current.x + dx, y: offsetRef.current.y + dy };
        setOffset({ ...offsetRef.current });
      }
    };

    const handleTouchEnd = () => { dragging.current = false; pinchRef.current = null; };

    el.addEventListener('wheel',      handleWheel,      { passive: false });
    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove',  handleTouchMove,  { passive: false });
    el.addEventListener('touchend',   handleTouchEnd);

    return () => {
      el.removeEventListener('wheel',      handleWheel);
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchmove',  handleTouchMove);
      el.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [applyZoom]);

  /* Export : on recadre exactement ce qui est dans le cercle */
  const handleConfirm = () => {
    const OUT = 400;
    const f   = OUT / (RADIUS * 2);
    const dw  = imgSize.w * scaleRef.current;
    const dh  = imgSize.h * scaleRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = OUT; canvas.height = OUT;
    canvas.getContext('2d').drawImage(
      imgRef.current,
      (RADIUS - dw/2 + offsetRef.current.x) * f,
      (RADIUS - dh/2 + offsetRef.current.y) * f,
      dw * f, dh * f
    );
    onConfirm(canvas.toDataURL('image/jpeg', 0.92));
  };

  const dw = imgSize.w * scale;
  const dh = imgSize.h * scale;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={() => !loading && onCancel()}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.88, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-white rounded-3xl p-6 shadow-2xl w-full max-w-xs"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-sm font-bold text-slate-800 text-center mb-1">Positionner ta photo</h3>
        <p className="text-xs text-slate-400 text-center mb-4">👆 Glisse · 🤏 Pincer · 🖱 Scroll</p>

        {/* Zone interactive — image entière visible */}
        <div className="flex justify-center mb-4">
          <div
            ref={containerRef}
            style={{
              width: WRAP, height: WRAP,
              position: 'relative', overflow: 'hidden',
              cursor: grabbed ? 'grabbing' : 'grab',
              background: '#1e293b',
              borderRadius: 16,
              userSelect: 'none',
            }}
            onMouseDown={onMouseDown}
          >
            {/* Image complète, librement déplaçable */}
            <img
              ref={imgRef} src={src} onLoad={onImgLoad} draggable={false} alt="crop"
              style={{
                position: 'absolute',
                width: dw, height: dh,
                left: CX - dw/2 + offset.x,
                top:  CY - dh/2 + offset.y,
                pointerEvents: 'none',
              }}
            />

            {/* Overlay sombre en dehors du cercle */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: `radial-gradient(circle ${RADIUS}px at ${CX}px ${CY}px,
                transparent ${RADIUS}px,
                rgba(0,0,0,0.62) ${RADIUS}px)`,
            }} />

            {/* Contour blanc du cercle */}
            <div style={{
              position: 'absolute',
              width: RADIUS * 2, height: RADIUS * 2,
              left: CX - RADIUS, top: CY - RADIUS,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.9)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.2)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>

        {/* Slider zoom */}
        <div className="flex items-center gap-3 px-1 mb-5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="range" min="0.1" max="6" step="0.02"
            value={scale}
            onChange={e => applyZoom(parseFloat(e.target.value))}
            className="flex-1 accent-blue-500 h-1.5" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50">
            Annuler
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg,#0891b2,#164e8a)' }}>
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Envoi...</>
              : '✓ Confirmer'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const isAdmin = user?.role === 'admin';

  const [infoForm, setInfoForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [infoLoading,   setInfoLoading]   = useState(false);
  const [pwLoading,     setPwLoading]     = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [toast,  setToast]  = useState({ msg: '', type: 'success' });
  const [preview, setPreview] = useState(null); // base64 de l'image à confirmer

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return showToast('Fichier invalide, choisissez une image', 'error');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result); // ouvre le recadreur
    reader.readAsDataURL(file);
  };

  const confirmAvatar = async (croppedBase64) => {
    setAvatarLoading(true);
    try {
      await axios.put(`${API_URL}/auth/avatar`, { avatar: croppedBase64 });
      await refreshUser();
      setPreview(null);
      showToast('Photo de profil mise à jour ✓');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur upload', 'error');
    } finally { setAvatarLoading(false); }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const handleInfoSave = async (e) => {
    e.preventDefault();
    setInfoLoading(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, { name: infoForm.name, email: infoForm.email });
      await refreshUser();
      showToast('Informations mises à jour');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally { setInfoLoading(false); }
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return showToast('Les mots de passe ne correspondent pas', 'error');
    if (pwForm.newPassword.length < 6) return showToast('Minimum 6 caractères', 'error');
    setPwLoading(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      showToast('Mot de passe modifié avec succès');
    } catch (err) {
      showToast(err.response?.data?.message || 'Erreur', 'error');
    } finally { setPwLoading(false); }
  };

  const sub    = subConfig[user?.subscription] || subConfig.free;
  const stats  = [
    { label: 'Quiz',        value: user?.progress?.quizCompleted      || 0, icon: '🧠', color: '#2563eb' },
    { label: 'Flashcards',  value: user?.progress?.flashcardsReviewed || 0, icon: '🃏', color: '#0891b2' },
    { label: 'Exercices',   value: user?.progress?.exercisesCompleted || 0, icon: '📋', color: '#7c3aed' },
    { label: 'Score',       value: user?.progress?.totalScore         || 0, icon: '⭐', color: '#ea580c' },
  ];

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <AnimatePresence>{toast.msg && <Toast key="toast" msg={toast.msg} type={toast.type}/>}</AnimatePresence>

      {/* ── Modal recadrage circulaire ── */}
      <AnimatePresence>
        {preview && (
          <AvatarCropModal
            src={preview}
            loading={avatarLoading}
            onConfirm={confirmAvatar}
            onCancel={() => setPreview(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

            {/* Avatar + identity */}
            <div className="flex items-center gap-5 mb-7">
              <div className="relative flex-shrink-0">
                <UserAvatar name={user?.name} avatar={user?.avatar} size="xl" shape="circle" fit="cover" />

                {/* Bouton changer la photo */}
                <label className="absolute -bottom-2 -right-2 cursor-pointer group" title="Changer la photo">
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{ background: avatarLoading ? '#64748b' : 'linear-gradient(135deg,#0891b2,#164e8a)' }}>
                    {avatarLoading
                      ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                    }
                  </div>
                </label>

                {isAdmin && (
                  <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-white truncate">{user?.name}</h1>
                <p className="text-blue-200/70 text-sm truncate">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ background: sub.gradient }}>
                    {sub.label}
                  </span>
                  {isAdmin && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Administrateur
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                  className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-center"
                >
                  <div className="text-xl mb-0.5">{s.icon}</div>
                  <div className="text-xl font-bold text-white">
                    <Counter value={s.value}/>
                  </div>
                  <div className="text-xs text-blue-200/60">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Content ── */}
        <div className="p-6 bg-slate-50">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left column ── */}
            <div className="space-y-4">

              {/* Subscription card */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Card className="overflow-hidden">
                  <div className="px-5 py-4" style={{ background: sub.gradient }}>
                    <p className="text-xs text-white/70 font-medium uppercase tracking-wide mb-0.5">Abonnement actuel</p>
                    <p className="text-lg font-bold text-white">{sub.label}</p>
                  </div>
                  <div className="p-4">
                    {user?.subscription === 'free' ? (
                      <>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Passez à Pro pour accéder aux exercices, à la génération IA et bien plus.
                        </p>
                        <Link to="/dashboard/subscription">
                          <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                            className="block text-center py-2.5 rounded-xl text-xs font-bold text-white transition"
                            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                            Passer au Pro →
                          </motion.div>
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                          Vous bénéficiez de toutes les fonctionnalités de votre plan.
                        </p>
                        <button className="w-full py-2.5 border border-red-200 text-red-400 rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition">
                          Résilier l'abonnement
                        </button>
                      </>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Account info */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28 }}>
                <Card className="p-5">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-4">Compte</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Rôle</span>
                      <span className="text-xs font-semibold text-slate-700 capitalize">
                        {isAdmin ? 'Administrateur' : 'Étudiant'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Membre depuis</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })
                          : '—'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">Statut</span>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>
                        Actif
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Progress detail */}
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.34 }}>
                <Card className="p-5">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-4">Activité détaillée</h3>
                  <div className="space-y-3">
                    {stats.map(s => (
                      <div key={s.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">{s.label}</span>
                          <span className="text-xs font-bold" style={{ color: s.color }}>{s.value}</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((s.value / Math.max(...stats.map(x => x.value), 1)) * 100, 100)}%` }}
                            transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                            className="h-1.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* ── Right column ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Personal info */}
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
                <Card className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Informations personnelles</h2>
                        <p className="text-xs text-slate-400">Modifiez votre nom et votre adresse email</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleInfoSave} className="p-6 space-y-4">
                    <Field label="Nom complet">
                      <input type="text" value={infoForm.name}
                        onChange={e => setInfoForm({ ...infoForm, name: e.target.value })}
                        className={inputCls} required/>
                    </Field>
                    <Field label="Adresse email">
                      <input type="email" value={infoForm.email}
                        onChange={e => setInfoForm({ ...infoForm, email: e.target.value })}
                        className={inputCls} required/>
                    </Field>
                    <div className="flex justify-end pt-1">
                      <motion.button type="submit" disabled={infoLoading}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        className="px-6 py-2.5 text-white rounded-xl text-sm font-bold transition disabled:opacity-60 flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                        {infoLoading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                        {infoLoading ? 'Enregistrement…' : 'Enregistrer'}
                      </motion.button>
                    </div>
                  </form>
                </Card>
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Card className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Sécurité</h2>
                        <p className="text-xs text-slate-400">Modifiez votre mot de passe de connexion</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handlePwSave} className="p-6 space-y-4">
                    {/* Current password */}
                    <Field label="Mot de passe actuel">
                      <div className="relative">
                        <input type={showPw.current ? 'text' : 'password'}
                          value={pwForm.currentPassword}
                          onChange={e => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                          placeholder="••••••••" className={inputCls + ' pr-10'}/>
                        <button type="button" onClick={() => setShowPw(s => ({ ...s, current: !s.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                          {showPw.current
                            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Nouveau mot de passe">
                        <div className="relative">
                          <input type={showPw.next ? 'text' : 'password'}
                            value={pwForm.newPassword}
                            onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })}
                            placeholder="Minimum 6 caractères" className={inputCls + ' pr-10'}/>
                          <button type="button" onClick={() => setShowPw(s => ({ ...s, next: !s.next }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                            {showPw.next
                              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                      </Field>
                      <Field label="Confirmer le nouveau">
                        <div className="relative">
                          <input type={showPw.confirm ? 'text' : 'password'}
                            value={pwForm.confirm}
                            onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                            placeholder="••••••••" className={inputCls + ' pr-10'}/>
                          <button type="button" onClick={() => setShowPw(s => ({ ...s, confirm: !s.confirm }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                            {showPw.confirm
                              ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            }
                          </button>
                        </div>
                      </Field>
                    </div>

                    {/* Password match indicator */}
                    {pwForm.newPassword && pwForm.confirm && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        className={`flex items-center gap-1.5 text-xs font-medium ${
                          pwForm.newPassword === pwForm.confirm ? 'text-emerald-600' : 'text-red-500'
                        }`}>
                        {pwForm.newPassword === pwForm.confirm
                          ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Les mots de passe correspondent</>
                          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Les mots de passe ne correspondent pas</>
                        }
                      </motion.div>
                    )}

                    <div className="flex justify-end pt-1">
                      <motion.button type="submit"
                        disabled={pwLoading || !pwForm.currentPassword || !pwForm.newPassword}
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        className="px-6 py-2.5 text-white rounded-xl text-sm font-bold transition disabled:opacity-40 flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#6d28d9)' }}>
                        {pwLoading && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                        {pwLoading ? 'Modification…' : 'Modifier le mot de passe'}
                      </motion.button>
                    </div>
                  </form>
                </Card>
              </motion.div>

              {/* Appearance */}
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.38 }}>
                <Card className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg,#0891b2,#0284c7)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-slate-800">Apparence</h2>
                        <p className="text-xs text-slate-400">Choisissez le thème d'affichage</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          id: 'light', label: 'Clair', sub: 'Thème par défaut', active: !isDark,
                          preview: (
                            <div className="w-full h-16 rounded-xl bg-white border border-gray-200 mb-3 overflow-hidden flex flex-col p-2 gap-1.5">
                              <div className="flex gap-1 items-center">
                                <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"/>
                                <div className="w-12 h-1.5 rounded bg-blue-100"/>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-6 h-6 rounded bg-blue-50 border border-blue-100"/>
                                <div className="flex-1 space-y-1">
                                  <div className="h-1.5 rounded bg-gray-200 w-3/4"/>
                                  <div className="h-1.5 rounded bg-gray-100 w-1/2"/>
                                </div>
                              </div>
                            </div>
                          ),
                          onClick: () => { if (isDark) toggleTheme(); },
                        },
                        {
                          id: 'dark', label: 'Sombre', sub: 'Mode nuit', active: isDark,
                          preview: (
                            <div className="w-full h-16 rounded-xl bg-slate-900 border border-slate-700 mb-3 overflow-hidden flex flex-col p-2 gap-1.5">
                              <div className="flex gap-1 items-center">
                                <div className="w-3 h-3 rounded bg-blue-500 flex-shrink-0"/>
                                <div className="w-12 h-1.5 rounded bg-slate-700"/>
                              </div>
                              <div className="flex gap-1">
                                <div className="w-6 h-6 rounded bg-slate-800 border border-slate-700"/>
                                <div className="flex-1 space-y-1">
                                  <div className="h-1.5 rounded bg-slate-600 w-3/4"/>
                                  <div className="h-1.5 rounded bg-slate-700 w-1/2"/>
                                </div>
                              </div>
                            </div>
                          ),
                          onClick: () => { if (!isDark) toggleTheme(); },
                        },
                      ].map(theme => (
                        <motion.button key={theme.id} onClick={theme.onClick}
                          whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                          className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                            theme.active ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100' : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}>
                          {theme.preview}
                          <p className="text-xs font-bold text-slate-800">{theme.label}</p>
                          <p className="text-xs text-slate-400">{theme.sub}</p>
                          {theme.active && (
                            <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Danger zone */}
              <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.44 }}>
                <Card className="overflow-hidden border-red-100">
                  <div className="px-6 py-4 border-b border-red-50 bg-red-50/40">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-red-600">Zone de danger</h2>
                        <p className="text-xs text-red-400">Ces actions sont irréversibles</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      La suppression de votre compte est définitive. Toutes vos données (quiz, flashcards, fiches) seront effacées sans possibilité de récupération.
                    </p>
                    <button className="px-5 py-2.5 border border-red-200 text-red-400 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition">
                      Supprimer mon compte
                    </button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
