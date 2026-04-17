import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

/* ─── Plans data ─────────────────────────────────────────────────────────────── */
const plans = [
  {
    id: 'free',
    label: 'Gratuit',
    name: 'Starter',
    price: '0',
    period: '/ mois',
    description: 'Pour découvrir la plateforme',
    gradient: 'linear-gradient(135deg, #475569, #334155)',
    glowColor: 'rgba(71,85,105,0.25)',
    features: [
      { text: '10 quiz / mois',           ok: true  },
      { text: '20 flashcards',             ok: true  },
      { text: 'Cours & Fiches',            ok: true  },
      { text: 'Exercices théoriques',      ok: false },
      { text: 'Génération IA de quiz',     ok: false },
      { text: 'Fiches perso par IA',       ok: false },
      { text: 'Support prioritaire',       ok: false },
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    name: 'Étudiant',
    price: '9,99',
    period: '/ mois',
    description: 'Pour réviser efficacement',
    popular: true,
    gradient: 'linear-gradient(135deg, #2563eb, #0891b2)',
    glowColor: 'rgba(37,99,235,0.35)',
    features: [
      { text: 'Quiz illimités',            ok: true  },
      { text: 'Flashcards illimitées',     ok: true  },
      { text: 'Cours & Fiches',            ok: true  },
      { text: 'Exercices théoriques',      ok: true  },
      { text: 'Génération IA de quiz',     ok: true  },
      { text: 'Fiches perso par IA (×5/j)', ok: true },
      { text: 'Support prioritaire',       ok: false },
    ],
  },
  {
    id: 'premium',
    label: 'Premium',
    name: 'Elite',
    price: '19,99',
    period: '/ mois',
    description: 'Pour les étudiants exigeants',
    gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
    glowColor: 'rgba(124,58,237,0.35)',
    features: [
      { text: 'Quiz illimités',            ok: true  },
      { text: 'Flashcards illimitées',     ok: true  },
      { text: 'Cours & Fiches',            ok: true  },
      { text: 'Exercices théoriques',      ok: true  },
      { text: 'Génération IA de quiz',     ok: true  },
      { text: 'Fiches perso par IA (×10/j)', ok: true },
      { text: 'Support prioritaire 24/7',  ok: true  },
    ],
  },
];

const faqs = [
  { q: 'Puis-je annuler à tout moment ?', a: "Oui, vous pouvez annuler votre abonnement à tout moment. Vous continuerez à avoir accès aux fonctionnalités jusqu'à la fin de la période de facturation en cours." },
  { q: 'Quels modes de paiement sont acceptés ?', a: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) ainsi que PayPal. Toutes les transactions sont sécurisées.' },
  { q: "Y a-t-il une période d'essai ?", a: "Le plan Gratuit vous permet de tester la plateforme sans engagement. Vous pouvez passer à un plan payant à tout moment depuis votre profil." },
  { q: 'Que se passe-t-il si je déclasse mon abonnement ?', a: "Vous repassez au plan Gratuit et perdez l'accès aux fonctionnalités avancées, mais vos données (quiz générés, fiches) sont conservées." },
];

/* ─── FAQ item ───────────────────────────────────────────────────────────────── */
function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.4 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-slate-50 transition">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Subscription() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const currentSub = user?.subscription || 'free';

  const subNames = { free: 'Gratuit', pro: 'Pro', premium: 'Premium' };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-auto">

        {/* ── Hero ── */}
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0c4a6e 100%)' }} className="px-6 pt-8 pb-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Abonnement</h1>
                <p className="text-blue-200/70 text-sm">Choisissez le plan qui correspond à vos objectifs de révision</p>
              </div>
              {/* Current plan badge */}
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                <span className="text-white/80 text-xs">Plan actuel :</span>
                <span className="text-white font-bold text-sm">{subNames[currentSub]}</span>
              </div>
            </div>

            {/* Value props */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: '🎓', text: 'Conçu pour les étudiants IFSI' },
                { icon: '🔒', text: 'Sans engagement' },
                { icon: '⚡', text: 'Accès immédiat' },
                { icon: '💳', text: 'Paiement sécurisé' },
              ].map((v, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="text-sm">{v.icon}</span>
                  <span className="text-white/80 text-xs font-medium">{v.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Plans ── */}
        <div className="px-6 py-8 bg-slate-50">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {plans.map((plan, i) => {
              const isCurrent = currentSub === plan.id;
              return (
                <motion.div key={plan.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                  className={`relative rounded-3xl overflow-hidden flex flex-col ${
                    plan.popular ? 'md:-mt-3 md:mb-3' : ''
                  }`}
                  style={{
                    boxShadow: plan.popular
                      ? `0 20px 60px ${plan.glowColor}, 0 4px 16px rgba(0,0,0,0.1)`
                      : '0 4px 16px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: plan.gradient }}/>
                  )}
                  {plan.popular && (
                    <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                      <div className="mt-[-1px] text-xs font-bold text-white px-5 py-1 rounded-b-xl"
                        style={{ background: plan.gradient }}>
                        ⭐ Le plus populaire
                      </div>
                    </div>
                  )}

                  {/* Card header — gradient */}
                  <div className="px-6 pt-8 pb-6" style={{ background: plan.gradient }}>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-widest">{plan.label}</span>
                      {isCurrent && (
                        <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          Actuel
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                    <p className="text-white/70 text-xs mb-4">{plan.description}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">{plan.price}€</span>
                      <span className="text-white/60 text-sm">{plan.period}</span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="bg-white px-6 py-5 flex-1 flex flex-col">
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-3">
                          {f.ok ? (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{ background: plan.gradient }}>
                              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </div>
                          )}
                          <span className={`text-sm ${f.ok ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>{f.text}</span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={isCurrent ? {} : { y: -2 }}
                      whileTap={isCurrent ? {} : { scale: 0.97 }}
                      disabled={isCurrent}
                      onClick={() => !isCurrent && navigate('/dashboard/subscription')}
                      className={`w-full py-3 rounded-2xl text-sm font-bold transition-all ${
                        isCurrent
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'text-white shadow-lg'
                      }`}
                      style={isCurrent ? {} : {
                        background: plan.gradient,
                        boxShadow: `0 8px 24px ${plan.glowColor}`,
                      }}
                    >
                      {isCurrent ? '✓ Plan actuel' : `Choisir ${plan.name}`}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ── Comparison highlight ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
            className="max-w-5xl mx-auto mb-12 rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white"
          >
            <div className="px-6 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(135deg,#f8fafc,#f1f5f9)' }}>
              <h2 className="text-sm font-bold text-slate-800">Comparaison détaillée</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide w-1/2">Fonctionnalité</th>
                    {plans.map(p => (
                      <th key={p.id} className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wide"
                        style={{ color: p.id === 'free' ? '#64748b' : p.id === 'pro' ? '#2563eb' : '#7c3aed' }}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Quiz', '10/mois', 'Illimités', 'Illimités'],
                    ['Flashcards', '20', 'Illimitées', 'Illimitées'],
                    ['Cours & Fiches', '✓', '✓', '✓'],
                    ['Exercices théoriques', '—', '✓', '✓'],
                    ['Génération IA de quiz', '—', '✓', '✓'],
                    ['Fiches IA par jour', '—', '5', '10'],
                    ['Support', 'Standard', 'Standard', 'Prioritaire 24/7'],
                  ].map(([feat, ...vals], ri) => (
                    <tr key={ri} className={`border-b border-slate-50 ${ri % 2 === 0 ? 'bg-slate-50/40' : 'bg-white'}`}>
                      <td className="px-6 py-3 text-sm text-slate-700 font-medium">{feat}</td>
                      {vals.map((v, vi) => (
                        <td key={vi} className="px-4 py-3 text-center text-sm">
                          {v === '✓' ? (
                            <span className="text-emerald-500 font-bold">✓</span>
                          ) : v === '—' ? (
                            <span className="text-slate-300">—</span>
                          ) : (
                            <span className={`font-semibold ${vi === 0 ? 'text-slate-600' : vi === 1 ? 'text-blue-600' : 'text-purple-600'}`}>{v}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ── FAQ ── */}
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="text-base font-bold text-slate-800 mb-4">
              Questions fréquentes
            </motion.h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} delay={0.65 + i * 0.07}/>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
