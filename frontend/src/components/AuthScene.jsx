import { useMotionValue, useTransform, useSpring, motion } from 'framer-motion';

/* Gradient de marque partagé (login + register) */
export const BRAND = 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)';

/* ─── Petites icônes ─────────────────────────────────────────────────────── */
const I = {
  brain: (c = '#2563eb') => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/></svg>,
  check: (c = '#fff') => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  flame: (c = '#f97316') => <svg width="13" height="13" viewBox="0 0 24 24" fill={c} stroke="none"><path d="M12 2c1 3-2 4-2 7a2 2 0 0 0 4 0c0-1 1 1 1 3a3 3 0 1 1-6 0c0-4 3-7 3-10z"/></svg>,
  quiz: (c = '#7c3aed') => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 9a2.5 2.5 0 1 1 3 2.5c-.9.3-1.5 1-1.5 2"/><line x1="12" y1="17" x2="12" y2="17"/><circle cx="12" cy="12" r="10"/></svg>,
};

/* ─── Carte produit flottante ────────────────────────────────────────────── */
function FloatCard({ x, y, style, delay = 0, dur = 8, rotate = 0, children }) {
  return (
    <motion.div
      className="absolute hidden lg:block pointer-events-none"
      style={{ x, y, ...style }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay + 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        animate={{ y: [0, -16, 0], rotate: [rotate, rotate + 1.5, rotate] }}
        transition={{ duration: dur, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ rotate }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

const cardShell = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.9)',
  borderRadius: 18,
  boxShadow: '0 20px 45px rgba(30,58,95,0.16)',
};

/* ════════════════════════════════════════════════════════════════════════════
   AUTH SCENE — fond immersif animé partagé
══════════════════════════════════════════════════════════════════════════════ */
export default function AuthScene({ children }) {
  /* Parallaxe souris → 3 profondeurs */
  const SP = { stiffness: 60, damping: 22 };
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const nearX = useSpring(useTransform(rawX, [-1, 1], [-34, 34]), SP);
  const nearY = useSpring(useTransform(rawY, [-1, 1], [-26, 26]), SP);
  const midX  = useSpring(useTransform(rawX, [-1, 1], [-20, 20]), SP);
  const midY  = useSpring(useTransform(rawY, [-1, 1], [-15, 15]), SP);
  const farX  = useSpring(useTransform(rawX, [-1, 1], [-10, 10]), SP);
  const farY  = useSpring(useTransform(rawY, [-1, 1], [-8, 8]), SP);

  const handleMouse = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width  * 2 - 1);
    rawY.set((e.clientY - r.top)  / r.height * 2 - 1);
  };

  return (
    <div
      onMouseMove={handleMouse}
      className="relative flex flex-col items-center justify-center overflow-hidden px-4 py-8"
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(150deg, #eef5ff 0%, #e6f0ff 32%, #e4f6fb 66%, #eafcf6 100%)',
      }}
    >
      {/* ── Aurores animées ── */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 620, height: 620, top: '-16%', left: '-12%', x: farX, y: farY, background: 'radial-gradient(circle, rgba(56,189,248,0.42), transparent 68%)', filter: 'blur(46px)' }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 520, height: 520, bottom: '-14%', right: '-10%', x: midX, y: midY, background: 'radial-gradient(circle, rgba(45,212,191,0.36), transparent 68%)', filter: 'blur(48px)' }}
        animate={{ scale: [1, 1.16, 1], opacity: [0.7, 0.95, 0.7] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 400, height: 400, top: '30%', right: '18%', x: nearX, y: nearY, background: 'radial-gradient(circle, rgba(129,140,248,0.30), transparent 68%)', filter: 'blur(50px)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.55, 0.85, 0.55] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }} />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 360, height: 360, top: '55%', left: '20%', background: 'radial-gradient(circle, rgba(37,99,235,0.20), transparent 70%)', filter: 'blur(54px)' }}
        animate={{ scale: [1, 1.14, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 19, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }} />

      {/* ── Texture points ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.12) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, #000 40%, transparent 100%)',
      }} />

      {/* ── Croix médicales déco ── */}
      <div className="absolute top-8 right-10 opacity-[0.08] pointer-events-none hidden sm:block">
        <svg width="90" height="90" viewBox="0 0 24 24" fill="none" stroke="#164e8a" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
      </div>
      <div className="absolute bottom-12 left-10 opacity-[0.07] pointer-events-none hidden sm:block">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1"><path d="M12 2v20M2 12h20"/></svg>
      </div>

      {/* ── ECG animé (bas) ── */}
      <div className="absolute bottom-[6%] left-0 right-0 opacity-30 pointer-events-none">
        <svg viewBox="0 0 400 60" className="w-full" fill="none" preserveAspectRatio="none">
          <motion.polyline
            points="0,30 60,30 78,10 92,50 106,20 120,40 134,30 200,30 218,12 232,48 246,24 260,30 400,30"
            stroke="#0891b2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.6, delay: 0.8, ease: 'easeInOut' }} />
        </svg>
      </div>

      {/* ── Cartes produit flottantes (desktop) ── */}
      {/* Flashcard */}
      <FloatCard x={nearX} y={nearY} delay={0.1} dur={9} rotate={-5}
        style={{ top: '13%', left: '5%', width: 214 }}>
        <div style={{ ...cardShell, padding: 16 }}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(37,99,235,0.12)' }}>{I.brain('#2563eb')}</span>
            <span className="text-[10px] font-extrabold tracking-wider" style={{ color: '#2563eb' }}>FLASHCARD</span>
          </div>
          <p className="text-[13px] font-bold text-slate-800 leading-snug mb-2">Rôle principal de l'insuline ?</p>
          <div className="h-px bg-slate-100 mb-2" />
          <p className="text-[12px] font-semibold" style={{ color: '#0891b2' }}>Faire baisser la glycémie</p>
        </div>
      </FloatCard>

      {/* Quiz */}
      <FloatCard x={midX} y={midY} delay={0.5} dur={10} rotate={4}
        style={{ bottom: '13%', left: '7%', width: 226 }}>
        <div style={{ ...cardShell, padding: 16 }}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.12)' }}>{I.quiz('#7c3aed')}</span>
            <span className="text-[10px] font-extrabold tracking-wider" style={{ color: '#7c3aed' }}>QUIZ · UE 2.11</span>
          </div>
          <p className="text-[13px] font-bold text-slate-800 leading-snug mb-2.5">Dose max. de paracétamol / jour ?</p>
          <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#10b981' }}>{I.check()}</span>
            <span className="text-[12px] font-bold text-emerald-700">4 g / jour</span>
          </div>
        </div>
      </FloatCard>

      {/* Progress ring */}
      <FloatCard x={midX} y={midY} delay={0.35} dur={11} rotate={5}
        style={{ top: '12%', right: '6%', width: 176 }}>
        <div style={{ ...cardShell, padding: 16 }} className="flex items-center gap-3">
          <div className="relative flex-shrink-0" style={{ width: 52, height: 52 }}>
            <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="26" cy="26" r="21" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <motion.circle cx="26" cy="26" r="21" fill="none" stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 21}
                initial={{ strokeDashoffset: 2 * Math.PI * 21 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 21 * (1 - 0.87) }}
                transition={{ duration: 1.6, delay: 1, ease: [0.16, 1, 0.3, 1] }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[13px] font-extrabold text-slate-800">87%</span>
            </div>
          </div>
          <div>
            <p className="text-[12px] font-bold text-slate-800 leading-tight">Objectif du jour</p>
            <p className="text-[11px] text-slate-400">presque atteint !</p>
          </div>
        </div>
      </FloatCard>

      {/* Streak + UE badge */}
      <FloatCard x={nearX} y={nearY} delay={0.6} dur={8.5} rotate={-4}
        style={{ bottom: '17%', right: '7%', width: 190 }}>
        <div className="flex flex-col gap-2.5">
          <div style={{ ...cardShell, padding: '10px 14px' }} className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.14)' }}>{I.flame('#f97316')}</span>
            <div>
              <p className="text-[13px] font-extrabold text-slate-800 leading-none">12 jours</p>
              <p className="text-[10px] text-slate-400 mt-0.5">de révision d'affilée</p>
            </div>
          </div>
          <div style={{ ...cardShell, padding: '9px 14px' }} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#2563eb' }}>{I.check()}</span>
            <span className="text-[12px] font-bold text-slate-700">UE 2.1 validée</span>
          </div>
        </div>
      </FloatCard>

      {/* ── Contenu (logo + carte) ── */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {children}
      </div>
    </div>
  );
}
