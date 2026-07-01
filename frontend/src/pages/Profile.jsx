import { useState, useEffect, useRef, useCallback } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/DashboardLayout';
import UserAvatar from '../components/UserAvatar';
import { API_URL } from '../context/AuthContext';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   '#FFFFFF',
  text:   'var(--theme-text)',
  border: 'var(--theme-border)',
  indigo: 'var(--theme-primary)',
  violet: 'var(--theme-secondary)',
  sub:    '#64748b',
};
const clay = {
  card: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.10)',
  btn:  (hex, dark) => hex
    ? `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`
    : `0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset`,
};

const subConfig = {
  free:    { label:'Gratuit',  gradient:'linear-gradient(135deg,#475569,#334155)', dark:'#1e293b' },
  pro:     { label:'Pro',      gradient:'linear-gradient(135deg,#2563eb,#0891b2)', dark:'#1e40af' },
  premium: { label:'Premium',  gradient:'linear-gradient(135deg,#7c3aed,#4f46e5)', dark:'#4c1d95' },
};

const inputStyle = {
  width:'100%', padding:'10px 14px', borderRadius:12,
  border:`1.5px solid ${C.border}`, background:C.bg,
  fontSize:13, color:C.text, outline:'none', boxShadow:clay.sm,
  transition:'border-color 0.15s',
};
const labelStyle = {
  display:'block', fontSize:10, fontWeight:700, color:C.sub,
  textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:6,
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
  const isErr = type === 'error';
  return (
    <motion.div
      initial={{ opacity:0, y:-16, x:'-50%' }}
      animate={{ opacity:1, y:0, x:'-50%' }}
      exit={{ opacity:0, y:-12, x:'-50%' }}
      style={{ position:'fixed', top:20, left:'50%', zIndex:9999, padding:'10px 20px', borderRadius:16,
        fontSize:13, fontWeight:600, color:'#fff', display:'flex', alignItems:'center', gap:8,
        background: isErr ? '#ef4444' : '#22c55e',
        boxShadow:`0 8px 24px ${isErr?'#ef444440':'#22c55e40'}` }}>
      {isErr
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      }
      {msg}
    </motion.div>
  );
}

/* ─── SCard — section card ───────────────────────────────────────────────────── */
function SCard({ children, style = {} }) {
  return (
    <div style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, overflow:'hidden', ...style }}>
      {children}
    </div>
  );
}

/* ─── SCardHeader ────────────────────────────────────────────────────────────── */
function SCardHeader({ icon, title, sub, gradFrom = C.indigo, gradTo = C.violet }) {
  return (
    <div style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, background:C.bg, display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ width:32, height:32, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        background:`linear-gradient(135deg,${gradFrom},${gradTo})`,
        boxShadow:clay.btn(gradFrom, gradFrom) }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize:13, fontWeight:700, color:C.text }}>{title}</p>
        {sub && <p style={{ fontSize:11, color:C.sub, marginTop:2 }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ─── EyeIcon ────────────────────────────────────────────────────────────────── */
const EyeOn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const EyeOff = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

/* ─── Avatar Crop Modal ──────────────────────────────────────────────────────── */
function AvatarCropModal({ src, onConfirm, onCancel, loading }) {
  const WRAP   = 300;
  const RADIUS = 110;
  const CX = WRAP / 2;
  const CY = WRAP / 2;

  const imgRef       = useRef(null);
  const containerRef = useRef(null);
  const scaleRef     = useRef(1);
  const offsetRef    = useRef({ x:0, y:0 });
  const dragging     = useRef(false);
  const lastXY       = useRef({ x:0, y:0 });
  const pinchRef     = useRef(null);

  const [imgSize, setImgSize] = useState({ w:0, h:0 });
  const [scale,   setScale]   = useState(1);
  const [offset,  setOffset]  = useState({ x:0, y:0 });
  const [grabbed, setGrabbed] = useState(false);

  const applyZoom = useCallback((newScale) => {
    const clamped = Math.max(0.1, Math.min(10, newScale));
    const ratio   = clamped / scaleRef.current;
    const newOff  = { x:offsetRef.current.x*ratio, y:offsetRef.current.y*ratio };
    scaleRef.current  = clamped;
    offsetRef.current = newOff;
    setScale(clamped);
    setOffset({ ...newOff });
  }, []);

  const onImgLoad = () => {
    const { naturalWidth:w, naturalHeight:h } = imgRef.current;
    setImgSize({ w, h });
    const s = Math.max((RADIUS*2)/w, (RADIUS*2)/h);
    scaleRef.current  = s;
    offsetRef.current = { x:0, y:0 };
    setScale(s);
    setOffset({ x:0, y:0 });
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastXY.current.x;
      const dy = e.clientY - lastXY.current.y;
      lastXY.current = { x:e.clientX, y:e.clientY };
      offsetRef.current = { x:offsetRef.current.x+dx, y:offsetRef.current.y+dy };
      setOffset({ ...offsetRef.current });
    };
    const onUp = () => { if (dragging.current) { dragging.current = false; setGrabbed(false); } };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const onMouseDown = (e) => { e.preventDefault(); dragging.current = true; setGrabbed(true); lastXY.current = { x:e.clientX, y:e.clientY }; };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleWheel = (e) => { e.preventDefault(); applyZoom(scaleRef.current*(e.deltaY < 0 ? 1.08 : 0.93)); };
    const handleTouchStart = (e) => {
      e.preventDefault();
      if (e.touches.length === 2) { dragging.current = false; pinchRef.current = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY); }
      else { dragging.current = true; lastXY.current = { x:e.touches[0].clientX, y:e.touches[0].clientY }; }
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 2 && pinchRef.current) {
        const dist = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
        applyZoom(scaleRef.current*(dist/pinchRef.current)); pinchRef.current = dist;
      } else if (dragging.current && e.touches.length === 1) {
        const dx = e.touches[0].clientX-lastXY.current.x; const dy = e.touches[0].clientY-lastXY.current.y;
        lastXY.current = { x:e.touches[0].clientX, y:e.touches[0].clientY };
        offsetRef.current = { x:offsetRef.current.x+dx, y:offsetRef.current.y+dy };
        setOffset({ ...offsetRef.current });
      }
    };
    const handleTouchEnd = () => { dragging.current = false; pinchRef.current = null; };
    el.addEventListener('wheel',      handleWheel,      { passive:false });
    el.addEventListener('touchstart', handleTouchStart, { passive:false });
    el.addEventListener('touchmove',  handleTouchMove,  { passive:false });
    el.addEventListener('touchend',   handleTouchEnd);
    return () => { el.removeEventListener('wheel',handleWheel); el.removeEventListener('touchstart',handleTouchStart); el.removeEventListener('touchmove',handleTouchMove); el.removeEventListener('touchend',handleTouchEnd); };
  }, [applyZoom]);

  const handleConfirm = () => {
    const OUT = 400; const f = OUT/(RADIUS*2);
    const dw = imgSize.w*scaleRef.current; const dh = imgSize.h*scaleRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = OUT; canvas.height = OUT;
    canvas.getContext('2d').drawImage(imgRef.current, (RADIUS-dw/2+offsetRef.current.x)*f, (RADIUS-dh/2+offsetRef.current.y)*f, dw*f, dh*f);
    onConfirm(canvas.toDataURL('image/jpeg', 0.92));
  };

  const dw = imgSize.w*scale;
  const dh = imgSize.h*scale;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.7)', backdropFilter:'blur(6px)', padding:16 }}
      onClick={() => !loading && onCancel()}>
      <motion.div initial={{ scale:0.88, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.88, opacity:0 }}
        transition={{ type:'spring', stiffness:300, damping:24 }}
        style={{ background:C.card, borderRadius:24, padding:24, boxShadow:clay.card, width:'100%', maxWidth:340 }}
        onClick={e => e.stopPropagation()}>
        <h3 style={{ fontSize:14, fontWeight:700, color:C.text, textAlign:'center', marginBottom:4 }}>Positionner ta photo</h3>
        <p style={{ fontSize:11, color:C.sub, textAlign:'center', marginBottom:16 }}>Glisse · Pincer · Scroll</p>

        <div style={{ display:'flex', justifyContent:'center', marginBottom:16 }}>
          <div ref={containerRef}
            style={{ width:WRAP, height:WRAP, position:'relative', overflow:'hidden', cursor:grabbed?'grabbing':'grab', background:'#1e293b', borderRadius:16, userSelect:'none' }}
            onMouseDown={onMouseDown}>
            <img ref={imgRef} src={src} onLoad={onImgLoad} draggable={false} alt="crop"
              style={{ position:'absolute', width:dw, height:dh, left:CX-dw/2+offset.x, top:CY-dh/2+offset.y, pointerEvents:'none' }}/>
            <div style={{ position:'absolute', inset:0, pointerEvents:'none',
              background:`radial-gradient(circle ${RADIUS}px at ${CX}px ${CY}px, transparent ${RADIUS}px, rgba(0,0,0,0.62) ${RADIUS}px)` }}/>
            <div style={{ position:'absolute', width:RADIUS*2, height:RADIUS*2, left:CX-RADIUS, top:CY-RADIUS,
              borderRadius:'50%', border:'2px solid rgba(255,255,255,0.9)', boxShadow:'0 0 0 1px rgba(255,255,255,0.2)', pointerEvents:'none' }}/>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'0 4px', marginBottom:20 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="range" min="0.1" max="6" step="0.02" value={scale} onChange={e => applyZoom(parseFloat(e.target.value))}
            style={{ flex:1, accentColor:C.indigo, height:6, cursor:'pointer' }}/>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>

        <div style={{ display:'flex', gap:10 }}>
          <motion.button onClick={onCancel} disabled={loading}
            whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
            style={{ flex:1, padding:'10px', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.card, fontSize:13, fontWeight:600, color:C.sub, cursor:'pointer', boxShadow:clay.sm, opacity:loading?0.5:1 }}>
            Annuler
          </motion.button>
          <motion.button onClick={handleConfirm} disabled={loading}
            whileHover={{ y:-2, boxShadow:clay.btn() }} whileTap={{ scale:0.97 }}
            style={{ flex:1, padding:'10px', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
              fontSize:13, fontWeight:700, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow:clay.btn(), opacity:loading?0.8:1 }}>
            {loading
              ? <><div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>Envoi...</>
              : '✓ Confirmer'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Profile() {
  const { user, refreshUser } = useAuth();
  const { toggleTheme, isDark, colorTheme, setColorTheme, THEMES } = useTheme();
  const isAdmin = user?.role === 'admin';

  const [infoForm, setInfoForm] = useState({ name:user?.name||'', email:user?.email||'' });
  const [pwForm,   setPwForm]   = useState({ currentPassword:'', newPassword:'', confirm:'' });
  const [infoLoading,   setInfoLoading]   = useState(false);
  const [pwLoading,     setPwLoading]     = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPw, setShowPw] = useState({ current:false, next:false, confirm:false });
  const [toast,  setToast]  = useState({ msg:'', type:'success' });
  const [preview, setPreview] = useState(null);

  const push = usePushNotifications();
  const handleTogglePush = async () => {
    if (push.subscribed) {
      const ok = await push.unsubscribe();
      if (ok) showToast('Notifications désactivées', 'success'); else showToast(push.error||'Erreur','error');
    } else {
      const ok = await push.subscribe();
      if (ok) showToast('Notifications activées !', 'success');
      else if (push.permission === 'denied') showToast('Permission refusée dans le navigateur','error');
      else showToast(push.error||'Erreur','error');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]; e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) return showToast('Fichier invalide, choisissez une image','error');
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const confirmAvatar = async (croppedBase64) => {
    setAvatarLoading(true);
    try {
      await axios.put(`${API_URL}/auth/avatar`, { avatar:croppedBase64 });
      await refreshUser(); setPreview(null); showToast('Photo de profil mise à jour ✓');
    } catch (err) { showToast(err.response?.data?.message||'Erreur upload','error'); }
    finally { setAvatarLoading(false); }
  };

  const showToast = (msg, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'success' }), 3000);
  };

  const handleInfoSave = async (e) => {
    e.preventDefault(); setInfoLoading(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, { name:infoForm.name, email:infoForm.email });
      await refreshUser(); showToast('Informations mises à jour');
    } catch (err) { showToast(err.response?.data?.message||'Erreur','error'); }
    finally { setInfoLoading(false); }
  };

  const handlePwSave = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return showToast('Les mots de passe ne correspondent pas','error');
    if (pwForm.newPassword.length < 6) return showToast('Minimum 6 caractères','error');
    setPwLoading(true);
    try {
      await axios.put(`${API_URL}/auth/profile`, { currentPassword:pwForm.currentPassword, newPassword:pwForm.newPassword });
      setPwForm({ currentPassword:'', newPassword:'', confirm:'' }); showToast('Mot de passe modifié avec succès');
    } catch (err) { showToast(err.response?.data?.message||'Erreur','error'); }
    finally { setPwLoading(false); }
  };

  const sub   = subConfig[user?.subscription] || subConfig.free;
  const stats = [
    { label:'Quiz',       value:user?.progress?.quizCompleted      || 0, color:'var(--theme-primary)'   },
    { label:'Flashcards', value:user?.progress?.flashcardsReviewed || 0, color:'#0891b2'                },
    { label:'Exercices',  value:user?.progress?.exercisesCompleted || 0, color:'var(--theme-secondary)' },
    { label:'Score',      value:user?.progress?.totalScore         || 0, color:'#ea580c'                },
  ];
  const maxStat = Math.max(...stats.map(s => s.value), 1);

  return (
    <DashboardLayout isAdmin={isAdmin}>
      <style>{`
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-18px,12px) scale(1.05)} 66%{transform:translate(14px,-18px) scale(0.96)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px) scale(1.04)} }
        @media (max-width: 700px) {
          .profile-main-grid  { grid-template-columns: 1fr !important; }
          .profile-stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .profile-pw-grid    { grid-template-columns: 1fr !important; }
          .profile-hero-row   { flex-direction: column !important; align-items: center !important; text-align: center !important; }
          .profile-hero-row .profile-badges { justify-content: center !important; }
        }
      `}</style>

      <AnimatePresence>{toast.msg && <Toast key="toast" msg={toast.msg} type={toast.type}/>}</AnimatePresence>
      <AnimatePresence>
        {preview && <AvatarCropModal src={preview} loading={avatarLoading} onConfirm={confirmAvatar} onCancel={() => setPreview(null)}/>}
      </AnimatePresence>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden' }}>
          {/* Orbs */}
          <div style={{ position:'absolute', top:-48, right:-32, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,#a5b4fc,transparent)', opacity:0.2, filter:'blur(50px)', animation:'drift1 18s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:100, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,#EC4899,transparent)', opacity:0.12, filter:'blur(40px)', animation:'drift2 22s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          {/* Shine */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 70% 10%,rgba(255,255,255,0.12),transparent 50%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
            style={{ position:'relative', padding:'28px 24px' }}>

            {/* Avatar + identity */}
            <div className="profile-hero-row" style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <UserAvatar name={user?.name} avatar={user?.avatar} size="xl" shape="circle" fit="cover"/>

                {/* Photo change button */}
                <label style={{ position:'absolute', bottom:-8, right:-8, cursor:'pointer' }} title="Changer la photo">
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange}/>
                  <motion.div whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                    style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
                      background: avatarLoading ? '#64748b' : 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
                      boxShadow:clay.btn() }}>
                    {avatarLoading
                      ? <div style={{ width:13, height:13, border:'2px solid rgba(255,255,255,0.5)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                          <circle cx="12" cy="13" r="4"/>
                        </svg>
                    }
                  </motion.div>
                </label>

                {isAdmin && (
                  <div style={{ position:'absolute', top:-6, right:-6, width:26, height:26, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                    background:'linear-gradient(135deg,#f59e0b,#d97706)', boxShadow:'0 2px 0 #92400e' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                      <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
                    </svg>
                  </div>
                )}
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <h1 style={{ fontSize:22, fontWeight:900, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{user?.name}</h1>
                <p style={{ fontSize:13, color:'rgba(196,181,253,0.7)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:10 }}>{user?.email}</p>
                <div className="profile-badges" style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, color:'#fff',
                    background:sub.gradient, boxShadow:`0 2px 0 ${sub.dark}` }}>
                    {sub.label}
                  </span>
                  {isAdmin && (
                    <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, color:'#fbbf24',
                      background:'rgba(251,191,36,0.15)', border:'1px solid rgba(251,191,36,0.35)' }}>
                      Administrateur
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="profile-stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
              {stats.map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.1+i*0.07, duration:0.4 }}
                  style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:16, padding:'12px 8px', textAlign:'center', backdropFilter:'blur(8px)' }}>
                  <div style={{ fontSize:18, marginBottom:2 }}>{s.icon}</div>
                  <div style={{ fontSize:20, fontWeight:900, color:'#fff', lineHeight:1 }}>
                    <Counter value={s.value}/>
                  </div>
                  <div style={{ fontSize:10, color:'rgba(196,181,253,0.6)', marginTop:4 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:'24px 16px' }}>
          <div className="profile-main-grid" style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 2fr', gap:16, alignItems:'start' }}>

            {/* ── Left column ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Account info */}
              <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}>
                <SCard>
                  <SCardHeader
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>}
                    title="Compte" sub="Informations de session"/>
                  <div style={{ padding:'16px 20px', display:'flex', flexDirection:'column', gap:12 }}>
                    {[
                      { k:'Rôle',          v:isAdmin?'Administrateur':'Étudiant' },
                      { k:'Membre depuis', v:user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR',{month:'short',year:'numeric'}) : '—' },
                    ].map(row => (
                      <div key={row.k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontSize:11, color:C.sub }}>{row.k}</span>
                        <span style={{ fontSize:12, fontWeight:600, color:C.text }}>{row.v}</span>
                      </div>
                    ))}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, color:C.sub }}>Statut</span>
                      <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'#16a34a' }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', boxShadow:'0 0 6px #22c55e80' }}/>
                        Actif
                      </span>
                    </div>
                  </div>
                </SCard>
              </motion.div>

              {/* Notifications */}
              {push.supported && (
                <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.24 }}>
                  <SCard>
                    <SCardHeader
                      icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
                      title="Notifications" sub="Rappels & alertes" gradFrom={push.subscribed?C.indigo:'#94a3b8'} gradTo={push.subscribed?C.violet:'#64748b'}/>
                    <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:3 }}>
                          {push.subscribed ? 'Activées' : push.permission==='denied' ? 'Bloquées' : 'Désactivées'}
                        </p>
                        <p style={{ fontSize:11, color:C.sub, lineHeight:1.55 }}>
                          {push.subscribed ? 'Rappels de streak & nouveaux cours' : push.permission==='denied' ? 'Autorisez dans les paramètres du navigateur' : 'Recevez des rappels même hors ligne'}
                        </p>
                      </div>
                      {push.permission !== 'denied' && (
                        <button onClick={handleTogglePush} disabled={push.loading}
                          style={{ position:'relative', width:44, height:24, borderRadius:99, border:'none', cursor:push.loading?'not-allowed':'pointer', flexShrink:0, transition:'background 0.25s', background:push.subscribed?C.indigo:'#cbd5e1', opacity:push.loading?0.5:1 }}>
                          <span style={{ position:'absolute', top:2, left:2, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'transform 0.25s', transform:push.subscribed?'translateX(20px)':'translateX(0)' }}/>
                        </button>
                      )}
                    </div>
                  </SCard>
                </motion.div>
              )}
            </div>

            {/* ── Right column ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

              {/* Informations personnelles */}
              <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.20 }}>
                <SCard>
                  <SCardHeader
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                    title="Informations personnelles" sub="Modifiez votre nom et votre adresse email"/>
                  <form onSubmit={handleInfoSave} style={{ padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
                    <div>
                      <label style={labelStyle}>Nom complet</label>
                      <input type="text" value={infoForm.name} required
                        onChange={e => setInfoForm({ ...infoForm, name:e.target.value })}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff'; }}
                        onBlur={e  => { e.target.style.borderColor = C.border;  e.target.style.background = C.bg; }}/>
                    </div>
                    <div>
                      <label style={labelStyle}>Adresse email</label>
                      <input type="email" value={infoForm.email} required
                        onChange={e => setInfoForm({ ...infoForm, email:e.target.value })}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.background = '#fff'; }}
                        onBlur={e  => { e.target.style.borderColor = C.border;  e.target.style.background = C.bg; }}/>
                    </div>
                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                      <motion.button type="submit" disabled={infoLoading}
                        whileHover={{ y:-3, boxShadow:clay.btn() }} whileTap={{ scale:0.97 }}
                        style={{ padding:'10px 22px', borderRadius:14, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8,
                          background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
                          boxShadow:clay.btn(), opacity:infoLoading?0.7:1 }}>
                        {infoLoading && <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>}
                        {infoLoading ? 'Enregistrement…' : 'Enregistrer'}
                      </motion.button>
                    </div>
                  </form>
                </SCard>
              </motion.div>

              {/* Sécurité */}
              <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.28 }}>
                <SCard>
                  <SCardHeader
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
                    title="Sécurité" sub="Modifiez votre mot de passe de connexion" gradFrom="#7c3aed" gradTo="#6d28d9"/>
                  <form onSubmit={handlePwSave} style={{ padding:'20px', display:'flex', flexDirection:'column', gap:16 }}>
                    {/* Mot de passe actuel */}
                    <div>
                      <label style={labelStyle}>Mot de passe actuel</label>
                      <div style={{ position:'relative' }}>
                        <input type={showPw.current?'text':'password'} placeholder="••••••••"
                          value={pwForm.currentPassword}
                          onChange={e => setPwForm({ ...pwForm, currentPassword:e.target.value })}
                          style={{ ...inputStyle, paddingRight:40 }}
                          onFocus={e => { e.target.style.borderColor='#7c3aed'; e.target.style.background='#fff'; }}
                          onBlur={e  => { e.target.style.borderColor=C.border;   e.target.style.background=C.bg; }}/>
                        <button type="button" onClick={() => setShowPw(s=>({...s,current:!s.current}))}
                          style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:C.sub, padding:2 }}>
                          {showPw.current ? <EyeOn/> : <EyeOff/>}
                        </button>
                      </div>
                    </div>

                    {/* Nouveau + confirmation */}
                    <div className="profile-pw-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      {[
                        { key:'newPassword', label:'Nouveau mot de passe', show:'next',    placeholder:'Minimum 6 caractères' },
                        { key:'confirm',     label:'Confirmer le nouveau', show:'confirm', placeholder:'••••••••' },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={labelStyle}>{f.label}</label>
                          <div style={{ position:'relative' }}>
                            <input type={showPw[f.show]?'text':'password'} placeholder={f.placeholder}
                              value={pwForm[f.key]}
                              onChange={e => setPwForm({ ...pwForm, [f.key]:e.target.value })}
                              style={{ ...inputStyle, paddingRight:40 }}
                              onFocus={e => { e.target.style.borderColor='#7c3aed'; e.target.style.background='#fff'; }}
                              onBlur={e  => { e.target.style.borderColor=C.border;   e.target.style.background=C.bg; }}/>
                            <button type="button" onClick={() => setShowPw(s=>({...s,[f.show]:!s[f.show]}))}
                              style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', cursor:'pointer', color:C.sub, padding:2 }}>
                              {showPw[f.show] ? <EyeOn/> : <EyeOff/>}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Match indicator */}
                    {pwForm.newPassword && pwForm.confirm && (
                      <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }}
                        style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, fontWeight:600,
                          color: pwForm.newPassword===pwForm.confirm ? '#16a34a' : '#ef4444' }}>
                        {pwForm.newPassword===pwForm.confirm
                          ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Les mots de passe correspondent</>
                          : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Les mots de passe ne correspondent pas</>
                        }
                      </motion.div>
                    )}

                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                      <motion.button type="submit"
                        disabled={pwLoading||!pwForm.currentPassword||!pwForm.newPassword}
                        whileHover={{ y:-3, boxShadow:clay.btn('#7c3aed','#4c1d95') }} whileTap={{ scale:0.97 }}
                        style={{ padding:'10px 22px', borderRadius:14, border:'none', cursor:'pointer', fontSize:13, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', gap:8,
                          background:'linear-gradient(135deg,#7c3aed,#6d28d9)',
                          boxShadow:clay.btn('#7c3aed','#4c1d95'), opacity:(pwLoading||!pwForm.currentPassword||!pwForm.newPassword)?0.45:1 }}>
                        {pwLoading && <div style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>}
                        {pwLoading ? 'Modification…' : 'Modifier le mot de passe'}
                      </motion.button>
                    </div>
                  </form>
                </SCard>
              </motion.div>

              {/* Apparence */}
              <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.36 }}>
                <SCard>
                  <SCardHeader
                    icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>}
                    title="Apparence" sub="Choisissez le thème d'affichage" gradFrom="#0891b2" gradTo="#0284c7"/>
                  <div style={{ padding:'20px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                      {[
                        {
                          id:'light', label:'Clair', sub:'Thème par défaut', active:!isDark,
                          preview:(
                            <div style={{ width:'100%', height:64, borderRadius:12, background:'#fff', border:'1px solid #e2e8f0', marginBottom:12, overflow:'hidden', display:'flex', flexDirection:'column', padding:8, gap:6 }}>
                              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                <div style={{ width:12, height:12, borderRadius:4, background:'var(--theme-primary)', flexShrink:0 }}/>
                                <div style={{ width:48, height:6, borderRadius:4, background:'var(--theme-border)' }}/>
                              </div>
                              <div style={{ display:'flex', gap:6 }}>
                                <div style={{ width:24, height:24, borderRadius:8, background:'var(--theme-bg)', border:'1px solid var(--theme-border)', flexShrink:0 }}/>
                                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4, justifyContent:'center' }}>
                                  <div style={{ height:5, borderRadius:4, background:'#e2e8f0', width:'75%' }}/>
                                  <div style={{ height:5, borderRadius:4, background:'#f1f5f9', width:'50%' }}/>
                                </div>
                              </div>
                            </div>
                          ),
                          onClick:() => { if (isDark) toggleTheme(); },
                        },
                        {
                          id:'dark', label:'Sombre', sub:'Mode nuit', active:isDark,
                          preview:(
                            <div style={{ width:'100%', height:64, borderRadius:12, background:'#0f172a', border:'1px solid #1e293b', marginBottom:12, overflow:'hidden', display:'flex', flexDirection:'column', padding:8, gap:6 }}>
                              <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                <div style={{ width:12, height:12, borderRadius:4, background:'var(--theme-primary)', flexShrink:0 }}/>
                                <div style={{ width:48, height:6, borderRadius:4, background:'#1e293b' }}/>
                              </div>
                              <div style={{ display:'flex', gap:6 }}>
                                <div style={{ width:24, height:24, borderRadius:8, background:'#1e293b', border:'1px solid #334155', flexShrink:0 }}/>
                                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4, justifyContent:'center' }}>
                                  <div style={{ height:5, borderRadius:4, background:'#334155', width:'75%' }}/>
                                  <div style={{ height:5, borderRadius:4, background:'#1e293b', width:'50%' }}/>
                                </div>
                              </div>
                            </div>
                          ),
                          onClick:() => { if (!isDark) toggleTheme(); },
                        },
                      ].map(theme => (
                        <motion.button key={theme.id} onClick={theme.onClick}
                          whileHover={{ y:-3, boxShadow:theme.active?clay.card:clay.sm }} whileTap={{ scale:0.97 }}
                          style={{ position:'relative', padding:14, borderRadius:18, cursor:'pointer', textAlign:'left',
                            border:`2px solid ${theme.active?C.indigo:C.border}`,
                            background: theme.active ? 'rgba(var(--theme-primary-rgb),0.03)' : C.card,
                            boxShadow: theme.active ? clay.card : clay.sm, transition:'all 0.2s' }}>
                          {theme.preview}
                          <p style={{ fontSize:12, fontWeight:700, color:C.text }}>{theme.label}</p>
                          <p style={{ fontSize:11, color:C.sub, marginTop:2 }}>{theme.sub}</p>
                          {theme.active && (
                            <div style={{ position:'absolute', top:12, right:12, width:20, height:20, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                              background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow:clay.btn() }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>

                    {/* ── Couleur de l'application ── */}
                    <div style={{ marginTop:20, paddingTop:20, borderTop:`1px solid ${C.border}` }}>
                      <p style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:14 }}>
                        Couleur de l'application
                      </p>
                      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
                        {Object.entries(THEMES).map(([key, t]) => {
                          const active = colorTheme === key;
                          return (
                            <motion.button key={key}
                              onClick={() => setColorTheme(key)}
                              whileHover={{ scale:1.15, y:-3 }}
                              whileTap={{ scale:0.92 }}
                              title={t.label}
                              style={{
                                width:38, height:38, borderRadius:'50%', border:'none', cursor:'pointer', flexShrink:0,
                                background:`linear-gradient(135deg,${t.primary},${t.secondary})`,
                                boxShadow: active
                                  ? `0 0 0 3px #fff, 0 0 0 5px ${t.primary}, 0 6px 16px ${t.primary}60`
                                  : `0 3px 10px ${t.primary}50`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                transition:'box-shadow 0.2s',
                              }}>
                              {active && (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                      <p style={{ fontSize:11, color:C.sub, marginTop:10 }}>
                        <span style={{ fontWeight:700, color:'var(--theme-primary)' }}>{THEMES[colorTheme]?.label}</span> — thème actif
                      </p>
                    </div>
                  </div>
                </SCard>
              </motion.div>

              {/* Zone de danger */}
              <motion.div initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.44 }}>
                <SCard style={{ border:'1.5px solid #fecaca' }}>
                  <div style={{ padding:'16px 20px', borderBottom:'1px solid #fee2e2', background:'#fff5f5', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:32, height:32, borderRadius:12, background:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:'#dc2626' }}>Zone de danger</p>
                      <p style={{ fontSize:11, color:'#f87171', marginTop:2 }}>Ces actions sont irréversibles</p>
                    </div>
                  </div>
                  <div style={{ padding:'20px' }}>
                    <p style={{ fontSize:11, color:C.sub, lineHeight:1.65, marginBottom:16 }}>
                      La suppression de votre compte est définitive. Toutes vos données (quiz, flashcards, fiches) seront effacées sans possibilité de récupération.
                    </p>
                    <motion.button whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                      style={{ padding:'9px 20px', borderRadius:14, border:'1.5px solid #fecaca', background:'#fff', fontSize:12, fontWeight:700, color:'#ef4444', cursor:'pointer', boxShadow:'0 2px 0 #fecaca' }}>
                      Supprimer mon compte
                    </motion.button>
                  </div>
                </SCard>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
