import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Icônes (Lucide-matched) ────────────────────────────────────────────── */
const svg = (paths) => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths}</svg>
);
const ICON = {
  sparkles: svg(<><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>),
  quiz: svg(<><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 14 2 2 4-4"/></>),
  brain: svg(<><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/></>),
  fileText: svg(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></>),
  scroll: svg(<><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/></>),
  pill: svg(<><path d="m10.5 20.5-7-7a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z"/><path d="m8.5 8.5 7 7"/></>),
  dumbbell: svg(<><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></>),
  community: svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  rocket: svg(<><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>),
};

/* ─── Étapes de la visite ────────────────────────────────────────────────── */
const STEPS = [
  { icon: 'sparkles', from: '#6366f1', to: '#8b5cf6', dark: '#4338ca', tag: 'Bienvenue',
    title: (name) => `Bienvenue, ${name} !`,
    desc: 'Fais le tour du propriétaire en 30 secondes — on te montre tout ce que Nurses Prép peut faire pour réussir ton diplôme.' },
  { icon: 'quiz', from: '#6366f1', to: '#0891b2', dark: '#3730a3', tag: 'Quiz',
    title: () => 'Des QCM classés par UE',
    desc: 'Des milliers de questions du S1 au S6, avec une correction détaillée à chaque réponse pour comprendre tes erreurs.' },
  { icon: 'brain', from: '#7c3aed', to: '#6d28d9', dark: '#5b21b6', tag: 'Flashcards',
    title: () => 'Mémorise en un swipe',
    desc: 'Des cartes recto-verso par petites sessions. Tu marques ce que tu sais, et on te fait retravailler le reste.' },
  { icon: 'fileText', from: '#0891b2', to: '#0d9488', dark: '#0e7490', tag: 'Cours & Fiches',
    title: () => 'Des fiches synthétiques + IA',
    desc: 'Des cours clairs et des fiches de révision — et tu peux même en générer sur mesure grâce à l\'intelligence artificielle.' },
  { icon: 'scroll', from: '#f59e0b', to: '#f97316', dark: '#b45309', tag: 'Annales',
    title: () => 'Les vrais sujets d\'examen',
    desc: 'Entraîne-toi sur les annales officielles pour arriver le jour J en terrain connu, sans surprise.' },
  { icon: 'pill', from: '#e11d48', to: '#db2777', dark: '#9f1239', tag: 'Médicaments',
    title: () => 'Ta base pharmaco',
    desc: 'Toute la pharmacologie essentielle, cherchable en un instant : indications, effets, surveillances infirmières.' },
  { icon: 'dumbbell', from: '#059669', to: '#10b981', dark: '#047857', tag: 'Exercices',
    title: () => 'Des cas cliniques',
    desc: 'Mets tes connaissances en pratique sur des situations réelles, comme en stage et à l\'examen.' },
  { icon: 'community', from: '#2563eb', to: '#0ea5e9', dark: '#1d4ed8', tag: 'Progression & Groupes',
    title: () => 'Progresse, ensemble',
    desc: 'Suis tes stats, garde ton streak jour après jour, et crée un groupe de révision avec ta promo.' },
  { icon: 'rocket', from: '#4f46e5', to: '#0891b2', dark: '#3730a3', tag: 'C\'est parti', final: true,
    title: () => 'Tu es prêt·e !',
    desc: 'Tu connais maintenant l\'essentiel. Commence par un quiz ou explore le menu à ta guise. Bonne révision !' },
];

/* ─── Confettis (final) ──────────────────────────────────────────────────── */
const CONFETTI_COLORS = ['#6366f1', '#0891b2', '#f59e0b', '#10b981', '#e11d48', '#8b5cf6'];
function Confetti() {
  const pieces = Array.from({ length: 40 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: 'inherit' }}>
      {pieces.map((_, i) => {
        const angle = (Math.PI * (i / pieces.length)) - Math.PI / 2 + (Math.random() - 0.5);
        const dist = 140 + Math.random() * 160;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist - 40;
        const c = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const size = 6 + Math.random() * 6;
        return (
          <motion.div key={i}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
            animate={{ x, y: y + 260, opacity: 0, rotate: Math.random() * 540 }}
            transition={{ duration: 1.4 + Math.random() * 0.6, ease: 'easeOut' }}
            style={{ position: 'absolute', top: '38%', left: '50%', width: size, height: size * (Math.random() > 0.5 ? 1 : 0.5), background: c, borderRadius: Math.random() > 0.5 ? '50%' : 2 }}
          />
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   VISITE GUIDÉE
══════════════════════════════════════════════════════════════════════════════ */
export default function OnboardingTour({ name = '', onFinish }) {
  const [[step, dir], setStep] = useState([0, 1]);
  const total = STEPS.length;
  const s = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === total - 1;

  // Verrou anti-burst : ignore les déclenchements rapprochés (< 450 ms).
  // Un vrai clic humain est toujours espacé ; ça neutralise les rafales
  // d'events parasites causées par les reflux de layout au changement d'étape.
  const navLock = useRef(0);
  const guard = () => {
    const now = Date.now();
    if (now - navLock.current < 400) return false;
    navLock.current = now;
    return true;
  };

  const paginate = useCallback((d) => {
    if (!guard()) return;
    setStep(([cur]) => {
      const next = cur + d;
      if (next < 0 || next >= total) return [cur, d];
      return [next, d];
    });
  }, [total]);

  const goTo = (i) => { if (guard()) setStep([i, i > step ? 1 : -1]); };
  const finish = () => { if (guard()) onFinish(); };

  useEffect(() => {
    const h = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); isLast ? finish() : paginate(1); }
      else if (e.key === 'ArrowLeft') { if (!isFirst) paginate(-1); }
      else if (e.key === 'Escape') onFinish();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [isFirst, isLast, paginate, onFinish]); // eslint-disable-line

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const title = s.title(name);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, background: 'radial-gradient(ellipse at 50% 30%, rgba(30,41,90,0.72), rgba(2,6,23,0.85))',
      }}>
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        style={{
          position: 'relative', width: '100%', maxWidth: 440, background: '#fff', borderRadius: 30,
          overflow: 'hidden', boxShadow: '0 30px 90px -20px rgba(2,6,23,0.6), 0 0 0 1px rgba(15,23,42,0.06)',
        }}>

        {/* ── En-tête coloré animé ── */}
        <div style={{ position: 'relative', height: 176, overflow: 'hidden' }}>
          <motion.div key={`bg-${step}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${s.from}, ${s.to})` }} />
          {/* motif points */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }} />
          {/* halo */}
          <div style={{ position: 'absolute', top: -50, right: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.28), transparent 65%)', filter: 'blur(12px)' }} />

          {isLast && <Confetti />}

          {/* bouton passer */}
          {!isLast && (
            <button onClick={onFinish}
              style={{ position: 'absolute', top: 14, right: 14, zIndex: 3, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
              Passer
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          )}

          {/* Icône animée */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div key={`icon-${step}`}
              initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}>
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{ width: 78, height: 78, borderRadius: 24, background: 'rgba(255,255,255,0.16)', border: '1.5px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.3), 0 14px 30px rgba(0,0,0,0.18)' }}>
                {ICON[s.icon]}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ── Corps texte (slide directionnel) ── */}
        <div style={{ position: 'relative', padding: '22px 26px 8px', minHeight: 150, overflow: 'hidden' }}>
          <motion.div key={`txt-${step}`}
            initial={{ opacity: 0, x: dir > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: s.from, background: `${s.from}14`, padding: '4px 10px', borderRadius: 999, marginBottom: 12 }}>
              {s.tag}
            </span>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', lineHeight: 1.2, marginBottom: 8, fontFamily: "'Nunito', sans-serif" }}>{title}</h2>
            <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
          </motion.div>
        </div>

        {/* ── Progression (points) ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '4px 0 6px' }}>
          {STEPS.map((_, i) => (
            <motion.button key={i} onClick={() => goTo(i)}
              aria-label={`Étape ${i + 1}`}
              animate={{ width: i === step ? 22 : 7, backgroundColor: i === step ? s.from : '#e2e8f0' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ height: 7, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 0 }} />
          ))}
        </div>

        {/* ── Actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 22px 22px' }}>
          {/* Slot Précédent toujours présent (masqué à l'étape 0) pour garder un layout stable */}
          <button onClick={() => paginate(-1)} tabIndex={isFirst ? -1 : 0}
            style={{ width: 46, height: 46, flexShrink: 0, borderRadius: 14, border: '1.5px solid #e2e8f0', background: '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.12s', visibility: isFirst ? 'hidden' : 'visible', pointerEvents: isFirst ? 'none' : 'auto' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="Précédent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => (isLast ? finish() : paginate(1))}
            style={{
              flex: 1, height: 46, borderRadius: 14, border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 14.5, fontWeight: 800, fontFamily: "'Nunito', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
              boxShadow: `0 4px 0 ${s.dark}, 0 10px 24px ${s.from}55`,
              transition: 'transform 0.12s',
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            {isLast ? 'Commencer à réviser' : 'Suivant'}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              {isLast
                ? <polyline points="20 6 9 17 4 12"/>
                : <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>}
            </svg>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
