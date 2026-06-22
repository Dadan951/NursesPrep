import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth, API_URL } from '../context/AuthContext';

/* ─── Plans ──────────────────────────────────────────────────────────────────── */
const plans = [
  {
    id: 'free',
    name: 'Starter',
    price: '0',
    period: '/ mois',
    tagline: 'Pour découvrir la plateforme',
    accent: '#64748b',
    gradient: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
    glowColor: 'rgba(71,85,105,0.2)',
    icon: '📚',
    features: [
      { text: '10 quiz par mois seulement',          ok: 'warn' },
      { text: '20 flashcards par mois',              ok: 'warn' },
      { text: '1 cours · 1 fiche de révision',       ok: 'warn' },
      { text: 'Exercices théoriques',                ok: false  },
      { text: 'Génération IA de quiz',               ok: false  },
      { text: 'Fiches personnalisées par IA',        ok: false  },
      { text: 'Support prioritaire',                 ok: false  },
    ],
  },
  {
    id: 'pro',
    name: 'Étudiant',
    price: '9,99',
    period: '/ mois',
    tagline: 'Pour réviser sans limite',
    popular: true,
    accent: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0891b2 100%)',
    glowColor: 'rgba(37,99,235,0.3)',
    icon: '🎓',
    features: [
      { text: 'Quiz illimités (+1 440 questions)',   ok: true   },
      { text: 'Flashcards illimitées',               ok: true   },
      { text: 'Cours & fiches complets',             ok: true   },
      { text: 'Exercices théoriques',                ok: true   },
      { text: '5 quiz générés par IA / jour',        ok: true   },
      { text: '5 fiches personnalisées / jour',      ok: true   },
      { text: 'Support prioritaire',                 ok: false  },
    ],
  },
  {
    id: 'premium',
    name: 'Étudiant Pro',
    price: '14,99',
    period: '/ mois',
    tagline: 'Pour les plus ambitieux',
    accent: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
    glowColor: 'rgba(124,58,237,0.3)',
    icon: '⭐',
    features: [
      { text: 'Quiz illimités (+1 440 questions)',   ok: true   },
      { text: 'Flashcards illimitées',               ok: true   },
      { text: 'Cours & fiches complets',             ok: true   },
      { text: 'Exercices théoriques',                ok: true   },
      { text: '10 quiz générés par IA / jour',       ok: true   },
      { text: '10 fiches personnalisées / jour',     ok: true   },
      { text: 'Support prioritaire 24/7',            ok: true   },
    ],
  },
];

/* ─── Comparison table ───────────────────────────────────────────────────────── */
const compareRows = [
  { category: 'Quiz & Révision', rows: [
    { label: 'Accès aux quiz',          vals: ['10 / mois', 'Illimités', 'Illimités'] },
    { label: 'Flashcards',              vals: ['Accès de base', 'Illimitées', 'Illimitées'] },
    { label: 'Cours & fiches',          vals: ['✓', '✓ Complets', '✓ Complets'] },
    { label: 'Exercices théoriques',    vals: ['—', '✓', '✓'] },
  ]},
  { category: 'Intelligence artificielle', rows: [
    { label: 'Génération de quiz IA',   vals: ['—', '5 / jour', '10 / jour'] },
    { label: 'Fiches personnalisées',   vals: ['—', '5 / jour', '10 / jour'] },
  ]},
  { category: 'Support & extras', rows: [
    { label: 'Support',                 vals: ['Standard', 'Standard', 'Prioritaire 24/7'] },
    { label: 'Accès anticipé',          vals: ['—', '—', '✓'] },
  ]},
];

const faqs = [
  { q: 'Puis-je annuler à tout moment ?', a: "Oui. Annulez depuis le portail de facturation à n'importe quel moment. Vous conservez l'accès jusqu'à la fin de la période payée, sans frais supplémentaires." },
  { q: 'Quels modes de paiement sont acceptés ?', a: 'Visa, Mastercard, American Express. Le paiement est géré de manière sécurisée par Stripe — aucune donnée bancaire stockée sur nos serveurs.' },
  { q: "Y a-t-il une période d'essai ?", a: "Le plan Gratuit vous permet de découvrir la plateforme librement (10 quiz/mois). Accès immédiat, sans engagement." },
  { q: 'Comment gérer mon abonnement ?', a: 'Cliquez sur "Gérer mon abonnement" pour accéder au portail Stripe : modification, mise à niveau ou annulation en quelques clics.' },
  { q: "L'abonnement est-il remboursable ?", a: "Oui. Si vous n'êtes pas satisfait dans les 7 jours suivant votre souscription, contactez le support et nous procédons au remboursement." },
];

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4 hover:bg-slate-50/80 transition">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-6 pb-5 pt-3 text-sm text-slate-500 leading-relaxed border-t border-slate-50">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeatureIcon({ ok, gradient }) {
  if (ok === 'warn') return (
    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3" strokeLinecap="round"><path d="M12 9v4m0 4h.01"/></svg>
    </div>
  );
  if (ok) return (
    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: gradient }}>
      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  );
  return (
    <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
  );
}

function CmpVal({ v, col }) {
  const colors = ['#64748b', '#2563eb', '#7c3aed'];
  const bgs    = ['#f1f5f9', 'rgba(37,99,235,0.10)', 'rgba(124,58,237,0.10)'];
  if (v === '—') return <span className="text-slate-200 text-base font-bold">—</span>;
  if (v === '✓') return (
    <div className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background: bgs[col] }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={colors[col]} strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  );
  return <span className="text-xs font-bold" style={{ color: colors[col] }}>{v}</span>;
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Subscription() {
  const { user, token, refreshUser } = useAuth();
  const [params]     = useSearchParams();
  const [loading,    setLoading]    = useState(null);
  const [portalLoad, setPortalLoad] = useState(false);
  const [banner,     setBanner]     = useState(null);
  const currentSub  = user?.subscription || 'free';
  const isPaid      = currentSub !== 'free';
  const headers     = { Authorization: `Bearer ${token}` };
  const currentPlan = plans.find(p => p.id === currentSub);

  useEffect(() => {
    if (params.get('success') === 'true') {
      setBanner('success');
      refreshUser?.();
      window.history.replaceState({}, '', '/dashboard/subscription');
    } else if (params.get('canceled') === 'true') {
      setBanner('canceled');
      window.history.replaceState({}, '', '/dashboard/subscription');
    }
  }, []);

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
      <div className="flex-1 overflow-auto bg-slate-50">

        {/* ── Banners ── */}
        <AnimatePresence>
          {banner && (
            <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
              className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold ${
                banner === 'success' ? 'bg-emerald-500 text-white' : banner === 'canceled' ? 'bg-slate-700 text-white' : 'bg-red-500 text-white'
              }`}>
              {banner === 'success' && <><span>✅</span> Abonnement activé avec succès !</>}
              {banner === 'canceled' && <><span>ℹ️</span> Paiement annulé — aucun débit.</>}
              {banner?.type === 'error' && <><span>⚠️</span> {banner.msg}</>}
              <button onClick={() => setBanner(null)} className="ml-2 opacity-70 hover:opacity-100">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Hero ── */}
        <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0c4a6e 100%)' }}>
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #60a5fa, transparent)' }}/>
          <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #a78bfa, transparent)' }}/>

          <div className="relative px-6 pt-10 pb-12 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

              <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-3 py-1 rounded-full mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                    <span className="text-white/60 text-xs">Plan actuel :</span>
                    <span className="text-white text-xs font-bold">{currentPlan?.name}</span>
                  </div>
                  <h1 className="text-3xl font-black text-white mb-2 leading-tight">
                    Passez au niveau<br/>
                    <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      supérieur
                    </span>
                  </h1>
                  <p className="text-blue-200/60 text-sm max-w-xs">Accédez à tout le catalogue IFSI, générez des quiz par IA et révisez sans limite.</p>
                </div>
                {isPaid && (
                  <button onClick={handlePortal} disabled={portalLoad}
                    className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-white text-xs font-semibold hover:bg-white/20 transition disabled:opacity-60">
                    {portalLoad
                      ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                      : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    }
                    Gérer mon abonnement
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { icon: '🎓', text: 'Conçu pour les étudiants IFSI' },
                  { icon: '🔓', text: 'Sans engagement' },
                  { icon: '⚡', text: 'Accès immédiat' },
                  { icon: '🔒', text: 'Paiement sécurisé Stripe' },
                ].map((v, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                    className="flex items-center gap-2 bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl">
                    <span className="text-sm">{v.icon}</span>
                    <span className="text-white/70 text-xs font-medium">{v.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Free user warning banner ── */}
        {currentSub === 'free' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mx-6 mt-6 p-4 rounded-2xl border border-amber-200 bg-amber-50 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-800">Vous êtes limité à 10 quiz par mois avec le plan Gratuit</p>
              <p className="text-xs text-amber-600 mt-0.5">Passez au plan Étudiant pour débloquer les quiz illimités, les exercices et la génération de quiz par IA.</p>
            </div>
          </motion.div>
        )}

        {/* ── Plans cards ── */}
        <div className="px-6 pt-6 pb-8 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {plans.map((plan, i) => {
              const isCurrent  = currentSub === plan.id;
              const isLoading  = loading === plan.id;
              const isDisabled = isCurrent || plan.id === 'free';

              return (
                <motion.div key={plan.id}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  className={`relative rounded-3xl overflow-hidden flex flex-col ${plan.popular ? 'md:-mt-4 md:mb-4' : ''}`}
                  style={{ boxShadow: plan.popular ? `0 24px 64px ${plan.glowColor}, 0 4px 20px rgba(0,0,0,0.08)` : '0 4px 20px rgba(0,0,0,0.06)' }}
                >
                  {plan.popular && (
                    <div className="absolute top-0 inset-x-0 flex justify-center z-10">
                      <div className="text-xs font-bold text-white px-5 py-1.5 rounded-b-2xl shadow-lg" style={{ background: plan.gradient }}>
                        ⭐ Le plus populaire
                      </div>
                    </div>
                  )}

                  {/* Card header */}
                  <div className="px-6 pt-10 pb-7 relative overflow-hidden" style={{ background: plan.gradient }}>
                    <div className="absolute top-3 right-4 text-4xl opacity-15 select-none">{plan.icon}</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{plan.name}</span>
                      {isCurrent && (
                        <span className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Actuel
                        </span>
                      )}
                    </div>
                    <p className="text-white/50 text-xs mb-5">{plan.tagline}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">{plan.price}€</span>
                      <span className="text-white/40 text-sm ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="bg-white px-6 py-5 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3">
                          <FeatureIcon ok={f.ok} gradient={plan.gradient} />
                          <span className={`text-sm leading-tight ${
                            f.ok === true ? 'text-slate-700 font-medium'
                            : f.ok === 'warn' ? 'text-amber-700 font-medium'
                            : 'text-slate-400'
                          }`}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={isDisabled ? {} : { y: -2, scale: 1.01 }}
                      whileTap={isDisabled ? {} : { scale: 0.97 }}
                      disabled={isDisabled || !!loading}
                      onClick={() => handleCheckout(plan.id)}
                      className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrent ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : plan.id === 'free' ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'text-white disabled:opacity-70'
                      }`}
                      style={isDisabled ? {} : { background: plan.gradient, boxShadow: `0 8px 24px ${plan.glowColor}` }}
                    >
                      {isCurrent ? (
                        <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Plan actuel</>
                      ) : isLoading ? (
                        <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/> Redirection...</>
                      ) : plan.id === 'free' ? (
                        'Plan de base'
                      ) : (
                        <>Commencer — {plan.price}€/mois <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Stripe trust badge */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-white border border-slate-100 px-5 py-2.5 rounded-xl shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Paiement 100% sécurisé par <strong className="text-slate-600 mx-1">Stripe</strong> — Aucune donnée bancaire stockée sur nos serveurs
            </div>
          </div>

          {/* ── Comparison table ── */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mb-12 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">

            <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50">
              <div className="px-6 py-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fonctionnalité</span>
              </div>
              {plans.map(p => (
                <div key={p.id} className={`px-4 py-4 text-center ${p.popular ? 'bg-blue-50/60' : ''}`}>
                  <div className="text-sm font-bold" style={{ color: p.accent }}>{p.name}</div>
                  <div className="text-xs font-semibold text-slate-400">{p.price}€/mois</div>
                  {p.id === currentSub && (
                    <div className="text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: `${p.accent}18`, color: p.accent }}>
                      ▲ actuel
                    </div>
                  )}
                </div>
              ))}
            </div>

            {compareRows.map((section, si) => (
              <div key={si}>
                <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/60">
                  <div className="px-6 py-2.5 col-span-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{section.category}</span>
                  </div>
                </div>
                {section.rows.map((row, ri) => (
                  <div key={ri} className={`grid grid-cols-4 border-b border-slate-50 ${ri % 2 === 1 ? 'bg-slate-50/40' : ''}`}>
                    <div className="px-6 py-3.5 text-sm text-slate-600 font-medium flex items-center">{row.label}</div>
                    {row.vals.map((v, vi) => (
                      <div key={vi} className={`px-4 py-3.5 flex items-center justify-center ${plans[vi].popular ? 'bg-blue-50/20' : ''}`}>
                        <CmpVal v={v} col={vi} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </motion.div>

          {/* ── Upgrade CTA for free users ── */}
          {currentSub === 'free' && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="mb-10 rounded-3xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #0891b2 100%)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 85% 50%, rgba(255,255,255,0.12), transparent 60%)' }}/>
              <div className="relative px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <div className="text-white font-black text-xl mb-1">Passez à Étudiant — 9,99€/mois</div>
                  <p className="text-blue-200/70 text-sm">Quiz · Flashcards · Exercices illimités · Fonctionnalités IA · Cours, Fiches, Annales & Médicaments</p>
                </div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  onClick={() => handleCheckout('pro')} disabled={!!loading}
                  className="flex-shrink-0 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-2xl text-sm shadow-xl hover:shadow-2xl transition disabled:opacity-70 flex items-center gap-2">
                  {loading === 'pro'
                    ? <><span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"/> Redirection...</>
                    : <>Commencer maintenant <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                  }
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── FAQ ── */}
          <div>
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
              className="text-base font-bold text-slate-800 mb-5">Questions fréquentes</motion.h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => <FaqItem key={i} q={faq.q} a={faq.a} delay={0.7 + i * 0.06}/>)}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
