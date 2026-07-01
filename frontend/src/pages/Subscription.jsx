import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth, API_URL } from '../context/AuthContext';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
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

/* ─── Données plans ──────────────────────────────────────────────────────────── */
const PLANS = [
  {
    id: 'free', name: 'Starter', price: '0', period: '/ mois',
    tagline: 'Pour découvrir la plateforme',
    accent: '#64748b', dark: '#334155',
    gradient: 'linear-gradient(135deg,#475569,#334155)',
    glow: 'rgba(71,85,105,0.18)', icon: '📚',
    features: [
      { text: '20 quiz / mois',                ok: 'warn' },
      { text: '30 flashcards / mois',          ok: 'warn' },
      { text: '1 cours · 1 fiche',             ok: 'warn' },
      { text: '1 exercice / mois',             ok: 'warn' },
      { text: 'Génération IA de quiz',         ok: false  },
      { text: 'Fiches personnalisées IA',      ok: false  },
      { text: 'Support prioritaire',           ok: false  },
    ],
  },
  {
    id: 'pro', name: 'Étudiant', price: '9,99', period: '/ mois',
    tagline: 'Pour réviser sans limite', popular: true,
    accent: '#2563eb', dark: '#1d4ed8',
    gradient: 'linear-gradient(135deg,#2563eb,#0891b2)',
    glow: 'rgba(37,99,235,0.28)', icon: '🎓',
    features: [
      { text: 'Quiz illimités (+1 440 QCM)',   ok: true  },
      { text: 'Flashcards illimitées',          ok: true  },
      { text: 'Cours & fiches complets',        ok: true  },
      { text: 'Exercices illimités',            ok: true  },
      { text: '5 quiz IA / jour',               ok: true  },
      { text: '5 fiches IA / jour',             ok: true  },
      { text: 'Support prioritaire',            ok: false },
    ],
  },
  {
    id: 'premium', name: 'Étudiant Pro', price: '14,99', period: '/ mois',
    tagline: 'Pour les plus ambitieux',
    accent: '#7c3aed', dark: '#5b21b6',
    gradient: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
    glow: 'rgba(124,58,237,0.28)', icon: '⭐',
    features: [
      { text: 'Quiz illimités (+1 440 QCM)',   ok: true  },
      { text: 'Flashcards illimitées',          ok: true  },
      { text: 'Cours & fiches complets',        ok: true  },
      { text: 'Exercices illimités',            ok: true  },
      { text: '10 quiz IA / jour',              ok: true  },
      { text: '10 fiches IA / jour',            ok: true  },
      { text: 'Support prioritaire 24/7',       ok: true  },
    ],
  },
];

const COMPARE = [
  { category: '📚 Quiz & Révision', rows: [
    { label: 'Quiz',                  vals: ['20 / mois', 'Illimités',  'Illimités']       },
    { label: 'Flashcards',            vals: ['30 / mois', 'Illimitées', 'Illimitées']      },
    { label: 'Cours & fiches',        vals: ['Partiel',   'Complets',   'Complets']        },
    { label: 'Exercices théoriques',  vals: ['1 / mois',  'Illimités',  'Illimités']       },
    { label: 'Annales IFSI',          vals: ['—',         '✓',          '✓']               },
  ]},
  { category: '🤖 Intelligence artificielle', rows: [
    { label: 'Quiz générés par IA',   vals: ['—',         '5 / jour',   '10 / jour']       },
    { label: 'Fiches générées par IA',vals: ['—',         '5 / jour',   '10 / jour']       },
  ]},
  { category: '🎯 Support & extras', rows: [
    { label: 'Support',               vals: ['Standard',  'Standard',   'Prioritaire 24/7'] },
    { label: 'Accès anticipé',        vals: ['—',         '—',          '✓']               },
    { label: 'Certificat de progrès', vals: ['—',         '✓',          '✓']               },
  ]},
];

const FAQS = [
  { q: 'Puis-je annuler à tout moment ?',
    a: "Oui. Annulez depuis le portail de facturation à n'importe quel moment. Vous conservez l'accès jusqu'à la fin de la période payée, sans frais supplémentaires." },
  { q: 'Quels modes de paiement sont acceptés ?',
    a: 'Visa, Mastercard, American Express. Le paiement est géré de manière sécurisée par Stripe — aucune donnée bancaire stockée sur nos serveurs.' },
  { q: "Y a-t-il une période d'essai ?",
    a: "Le plan Gratuit vous permet de découvrir la plateforme librement (20 quiz/mois, 30 flashcards, 1 exercice). Accès immédiat, sans engagement." },
  { q: 'Comment gérer mon abonnement ?',
    a: 'Cliquez sur "Gérer mon abonnement" pour accéder au portail Stripe : modification, mise à niveau ou annulation en quelques clics.' },
  { q: "L'abonnement est-il remboursable ?",
    a: "Oui. Si vous n'êtes pas satisfait dans les 7 jours suivant votre souscription, contactez le support et nous procédons au remboursement." },
];

/* ─── Sous-composants ────────────────────────────────────────────────────────── */
function FaqItem({ q, a, i }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * i }}
      style={{ background: C.card, borderRadius: 18, border: `1.5px solid ${C.border}`, boxShadow: clay.sm, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1 }}>{q}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: C.bg, border: `1px solid ${C.border}`,
          }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
            style={{ overflow: 'hidden' }}>
            <p style={{
              padding: '0 20px 18px', paddingTop: 4,
              fontSize: 13, color: C.sub, lineHeight: 1.65,
              borderTop: `1px solid ${C.border}`,
            }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeatureIcon({ ok, gradient }) {
  if (ok === 'warn') return (
    <span style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(245,158,11,0.12)',
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round">
        <path d="M12 9v4m0 4h.01"/>
      </svg>
    </span>
  );
  if (ok) return (
    <span style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: gradient,
    }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
  return (
    <span style={{
      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#f1f5f9',
    }}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </span>
  );
}

/* Valeur dans le tableau comparatif */
function CmpVal({ v, col }) {
  const colors = ['#64748b', '#2563eb', '#7c3aed'];
  const bgs    = ['rgba(100,116,139,0.10)', 'rgba(37,99,235,0.10)', 'rgba(124,58,237,0.10)'];
  if (v === '—') return <span style={{ color: '#cbd5e1', fontSize: 18, fontWeight: 700 }}>—</span>;
  if (v === '✓') return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 24, borderRadius: '50%', background: bgs[col],
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={colors[col]} strokeWidth="3.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
  const isPartial = v === 'Partiel';
  return (
    <span style={{
      fontSize: 11, fontWeight: 800, color: isPartial ? '#d97706' : colors[col],
      display: 'inline-block',
    }}>
      {v}
    </span>
  );
}

/* ─── Page principale ────────────────────────────────────────────────────────── */
export default function Subscription() {
  const { user, token, refreshUser } = useAuth();
  const [params]     = useSearchParams();
  const [loading,      setLoading]      = useState(null);
  const [portalLoad,   setPortalLoad]   = useState(false);
  const [banner,       setBanner]       = useState(null);
  const [isMobile,     setIsMobile]     = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(1); // Étudiant par défaut

  const currentSub  = user?.subscription || 'free';
  const isPaid      = currentSub !== 'free';
  const headers     = { Authorization: `Bearer ${token}` };
  const currentPlan = PLANS.find(p => p.id === currentSub);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 660);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (params.get('success') === 'true') {
      setBanner('success'); refreshUser?.();
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('canceled') === 'true') {
      setBanner('canceled');
      window.history.replaceState({}, '', '/dashboard/subscription');
    }
  }, []); // eslint-disable-line

  const handleCheckout = async (planId) => {
    if (planId === 'free' || planId === currentSub) return;
    setLoading(planId);
    try {
      const { data } = await axios.post(`${API_URL}/subscription/checkout`, { plan: planId }, { headers });
      window.location.href = data.url;
    } catch (err) {
      setBanner({ type: 'error', msg: err.response?.data?.message || 'Erreur lors de la redirection.' });
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoad(true);
    try {
      const { data } = await axios.post(`${API_URL}/subscription/portal`, {}, { headers });
      window.location.href = data.url;
    } catch (err) {
      setBanner({ type: 'error', msg: err.response?.data?.message || 'Erreur portail.' });
      setPortalLoad(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ flex: 1, overflowY: 'auto', background: C.bg }}>

        {/* ── Notification banner ──────────────────────────────────────── */}
        <AnimatePresence>
          {banner && (
            <motion.div
              initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
              style={{
                position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
                zIndex: 100, display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px', borderRadius: 16, fontSize: 13, fontWeight: 700,
                background: banner === 'success' ? '#10b981' : banner === 'canceled' ? '#334155' : '#ef4444',
                color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
              }}>
              {banner === 'success'  && <><span>✅</span> Abonnement activé avec succès !</>}
              {banner === 'canceled' && <><span>ℹ️</span> Paiement annulé — aucun débit.</>}
              {banner?.type === 'error' && <><span>⚠️</span> {banner.msg}</>}
              <button onClick={() => setBanner(null)}
                style={{ marginLeft: 8, opacity: 0.7, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14 }}>
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--theme-hero)', minHeight: '200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position: 'absolute', top: -50, right: -30, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter: 'blur(40px)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', bottom: -40, left: -20, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent)', filter: 'blur(32px)', pointerEvents: 'none' }}/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <div style={{ position: 'relative', zIndex: 10, padding: '28px 24px 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
              <div>
                {/* Plan actuel chip */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px', borderRadius: 999, marginBottom: 14,
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', animation: 'pulse 1.5s infinite' }}/>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>Plan actuel :</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>{currentPlan?.name}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  style={{ fontSize: 28, fontWeight: 900, color: '#fff', margin: '0 0 8px', lineHeight: 1.2 }}>
                  Passez au niveau<br/>
                  <span style={{ background: 'linear-gradient(90deg,rgba(255,255,255,0.9),rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    supérieur
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18 }}
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', maxWidth: 320, margin: 0 }}>
                  Quiz illimités, exercices, génération IA et tout le catalogue IFSI.
                </motion.p>
              </div>

              {isPaid && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handlePortal} disabled={portalLoad}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '10px 18px', borderRadius: 14, fontSize: 13, fontWeight: 700,
                    color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)',
                    background: 'rgba(255,255,255,0.12)', cursor: 'pointer', backdropFilter: 'blur(8px)',
                    opacity: portalLoad ? 0.6 : 1,
                  }}>
                  {portalLoad
                    ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  }
                  Gérer mon abonnement
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* ── Contenu ───────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 16px 48px' }}>

          {/* Alerte plan gratuit */}
          {currentSub === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28,
                padding: '14px 16px', borderRadius: 16,
                background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(245,158,11,0.3)',
                boxShadow: '0 2px 8px rgba(245,158,11,0.08)',
              }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(245,158,11,0.12)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#92400e', margin: '0 0 3px' }}>
                  Vous êtes limité à 20 quiz / mois avec le plan Gratuit
                </p>
                <p style={{ fontSize: 12, color: '#b45309', margin: 0 }}>
                  Passez au plan Étudiant pour débloquer les quiz illimités, exercices et la génération IA.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Cartes plans ──────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16, marginBottom: 32,
          }}>
            {PLANS.map((plan, i) => {
              const isCurrent  = currentSub === plan.id;
              const isLoading  = loading === plan.id;
              const isDisabled = isCurrent || plan.id === 'free';
              return (
                <motion.div key={plan.id}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  style={{
                    borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                    boxShadow: plan.popular
                      ? `0 4px 0 ${plan.dark}55, 0 16px 48px ${plan.glow}, 0 1px 0 rgba(255,255,255,0.3) inset`
                      : clay.card,
                    border: `1.5px solid ${plan.popular ? plan.accent + '44' : C.border}`,
                    transform: plan.popular ? 'scale(1.02)' : 'none',
                    position: 'relative',
                  }}>

                  {/* Badge populaire */}
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                      background: plan.gradient, color: '#fff',
                      fontSize: 11, fontWeight: 800, padding: '4px 16px',
                      borderRadius: '0 0 12px 12px', zIndex: 2,
                      boxShadow: `0 4px 12px ${plan.glow}`,
                    }}>
                      ⭐ Le plus populaire
                    </div>
                  )}

                  {/* Header avec gradient */}
                  <div style={{
                    padding: plan.popular ? '40px 20px 24px' : '24px 20px',
                    background: plan.gradient, position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(20px)' }}/>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {plan.name}
                      </span>
                      {isCurrent && (
                        <span style={{
                          fontSize: 10, fontWeight: 800, color: '#fff',
                          background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: 999,
                          display: 'flex', alignItems: 'center', gap: 4,
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Actuel
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>{plan.tagline}</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                      <span style={{ fontSize: 44, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{plan.price}€</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 2 }}>{plan.period}</span>
                    </div>
                  </div>

                  {/* Corps */}
                  <div style={{ background: C.card, padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {plan.features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <FeatureIcon ok={f.ok} gradient={plan.gradient}/>
                          <span style={{
                            fontSize: 13, lineHeight: 1.3,
                            color: f.ok === true ? C.text : f.ok === 'warn' ? '#92400e' : C.sub,
                            fontWeight: f.ok !== false ? 600 : 400,
                          }}>
                            {f.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={isDisabled ? {} : { y: -2 }}
                      whileTap={isDisabled ? {} : { scale: 0.97 }}
                      disabled={isDisabled || !!loading}
                      onClick={() => handleCheckout(plan.id)}
                      style={{
                        width: '100%', padding: '12px', borderRadius: 14,
                        fontSize: 13, fontWeight: 800, border: 'none', cursor: isDisabled ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: isDisabled ? '#f1f5f9' : plan.gradient,
                        color: isDisabled ? C.sub : '#fff',
                        boxShadow: isDisabled ? 'none' : `0 4px 0 ${plan.dark}, 0 8px 20px ${plan.glow}`,
                        opacity: (!!loading && !isLoading) ? 0.6 : 1,
                      }}>
                      {isCurrent ? (
                        <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Plan actuel</>
                      ) : isLoading ? (
                        <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/> Redirection...</>
                      ) : plan.id === 'free' ? 'Plan de base' : (
                        <>Commencer — {plan.price}€/mois
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stripe badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 12, fontSize: 12, color: C.sub,
              background: C.card, border: `1.5px solid ${C.border}`, boxShadow: clay.sm,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Paiement sécurisé par <strong style={{ color: C.text, margin: '0 3px' }}>Stripe</strong> — Aucune donnée bancaire stockée
            </div>
          </div>

          {/* ── Tableau comparatif ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ marginBottom: 40 }}>

            <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
              Comparaison détaillée
            </h2>

            {/* ── VUE MOBILE : onglets plan + table 2 colonnes ── */}
            {isMobile && (
              <div>
                {/* Onglets sélection plan */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {PLANS.map((p, pi) => (
                    <motion.button key={p.id}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setSelectedPlan(pi)}
                      style={{
                        flex: 1, padding: '9px 4px', borderRadius: 14, border: 'none', cursor: 'pointer',
                        fontSize: 12, fontWeight: 800, lineHeight: 1.2,
                        background: selectedPlan === pi ? p.gradient : C.card,
                        color: selectedPlan === pi ? '#fff' : C.sub,
                        boxShadow: selectedPlan === pi
                          ? `0 3px 0 ${p.dark}, 0 6px 16px ${p.glow}`
                          : clay.sm,
                        transition: 'all 0.18s',
                      }}>
                      {p.icon}<br/>{p.name}
                    </motion.button>
                  ))}
                </div>

                {/* Table 2 colonnes animée */}
                <AnimatePresence mode="wait">
                  <motion.div key={selectedPlan}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
                    style={{
                      background: C.card, borderRadius: 20,
                      border: `1.5px solid ${PLANS[selectedPlan].accent}44`,
                      boxShadow: `0 2px 0 var(--theme-shadow), 0 4px 20px ${PLANS[selectedPlan].glow}, 0 1px 0 rgba(255,255,255,0.9) inset`,
                      overflow: 'hidden',
                    }}>

                    {/* En-tête plan sélectionné */}
                    <div style={{
                      padding: '12px 16px', background: PLANS[selectedPlan].gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>
                        {PLANS[selectedPlan].icon} {PLANS[selectedPlan].name}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 900, color: 'rgba(255,255,255,0.9)' }}>
                        {PLANS[selectedPlan].price}€<span style={{ fontSize: 11, fontWeight: 500, opacity: 0.7 }}>/mois</span>
                      </span>
                    </div>

                    {/* Lignes fonctionnalités */}
                    {COMPARE.map((section, si) => (
                      <div key={si}>
                        <div style={{
                          padding: '8px 16px',
                          background: C.bg,
                          borderTop: si === 0 ? 'none' : `1.5px solid ${C.border}`,
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                            {section.category}
                          </span>
                        </div>
                        {section.rows.map((row, ri) => (
                          <div key={ri} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '11px 16px', gap: 12,
                            borderTop: `1px solid ${C.border}`,
                            background: ri % 2 === 1 ? C.bg : C.card,
                          }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1 }}>
                              {row.label}
                            </span>
                            <CmpVal v={row.vals[selectedPlan]} col={selectedPlan}/>
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* ── VUE DESKTOP : table 4 colonnes ── */}
            {!isMobile && (
              <div style={{
                background: C.card, borderRadius: 24,
                border: `1.5px solid ${C.border}`, boxShadow: clay.card,
                overflow: 'hidden',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${C.border}`, background: C.bg }}>
                      <th style={{ padding: '14px 20px', textAlign: 'left', width: '38%' }}>
                        <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          Fonctionnalité
                        </span>
                      </th>
                      {PLANS.map((p) => (
                        <th key={p.id} style={{
                          padding: '14px 12px', textAlign: 'center',
                          background: p.popular ? `rgba(var(--theme-primary-rgb),0.04)` : 'transparent',
                        }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: 30, height: 30, borderRadius: 9, marginBottom: 5,
                            background: p.gradient,
                            boxShadow: `0 2px 0 ${p.dark}, 0 4px 10px ${p.glow}`,
                          }}>
                            <span style={{ fontSize: 14 }}>{p.icon}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: p.accent }}>{p.name}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: C.sub }}>{p.price}€/mois</div>
                          {p.id === currentSub && (
                            <div style={{
                              fontSize: 9, fontWeight: 800, marginTop: 4,
                              padding: '2px 7px', borderRadius: 999, display: 'inline-block',
                              background: p.accent + '18', color: p.accent,
                            }}>▲ actuel</div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE.map((section, si) => (
                      <>
                        <tr key={`cat-${si}`} style={{ background: C.bg, borderTop: si === 0 ? 'none' : `1.5px solid ${C.border}` }}>
                          <td colSpan={4} style={{ padding: '10px 20px' }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                              {section.category}
                            </span>
                          </td>
                        </tr>
                        {section.rows.map((row, ri) => (
                          <tr key={`${si}-${ri}`} style={{
                            borderTop: `1px solid ${C.border}`,
                            background: ri % 2 === 1 ? C.bg : C.card,
                          }}>
                            <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 600, color: C.text }}>
                              {row.label}
                            </td>
                            {row.vals.map((v, vi) => (
                              <td key={vi} style={{
                                padding: '12px 12px', textAlign: 'center',
                                background: PLANS[vi].popular ? `rgba(var(--theme-primary-rgb),0.04)` : 'transparent',
                              }}>
                                <CmpVal v={v} col={vi}/>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* ── CTA upgrade pour plan gratuit ─────────────────────────── */}
          {currentSub === 'free' && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                borderRadius: 24, overflow: 'hidden', marginBottom: 40,
                background: 'var(--theme-hero)', position: 'relative',
                boxShadow: `0 4px 0 var(--theme-dark), 0 16px 48px rgba(var(--theme-primary-rgb),0.25)`,
              }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 85% 50%,rgba(255,255,255,0.10),transparent 60%)', pointerEvents: 'none' }}/>
              <div style={{
                position: 'relative', padding: '28px 24px',
                display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20,
              }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>
                    Passez à Étudiant — 9,99€/mois
                  </p>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                    Quiz · Flashcards · Exercices illimités · IA · Cours · Annales · Médicaments
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleCheckout('pro')} disabled={!!loading}
                  style={{
                    flexShrink: 0, padding: '12px 28px', borderRadius: 16,
                    fontSize: 14, fontWeight: 800, color: C.indigo,
                    background: '#fff', border: 'none', cursor: '  pointer',
                    boxShadow: '0 4px 0 rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.15)',
                    display: 'flex', alignItems: 'center', gap: 8,
                    opacity: loading === 'pro' ? 0.7 : 1,
                  }}>
                  {loading === 'pro'
                    ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(var(--theme-primary-rgb),0.3)', borderTop: `2px solid ${C.indigo}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}/> Redirection...</>
                    : <>Commencer maintenant
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </>
                  }
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── FAQ ───────────────────────────────────────────────────── */}
          <div>
            <motion.h2
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 16px' }}>
              Questions fréquentes
            </motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FAQS.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} i={i}/>)}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </DashboardLayout>
  );
}
