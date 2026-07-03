/**
 * Home — Landing page NursesPrep
 * Refonte scrollytelling : un téléphone épinglé raconte l'app pendant le défilement.
 * Perf : framer-motion useScroll/useTransform (motion values hors cycle React),
 * uniquement transform/opacity, respect de prefers-reduced-motion.
 */

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  motion, AnimatePresence,
  useScroll, useTransform, useSpring, useInView,
  useMotionValueEvent, useReducedMotion,
} from 'framer-motion';
import NursesLogo from '../components/NursesLogo';

/* ═══════════════════════════════════════════════════════════════════════════
   DONNÉES
═══════════════════════════════════════════════════════════════════════════ */

const STATIONS = [
  {
    id: 'quiz', kicker: '01 · Quiz', color: '#6366f1', glow: 'rgba(99,102,241,0.35)',
    title: 'Des milliers de QCM classés par UE',
    desc: 'Chaque unité d\'enseignement, chaque chapitre, chaque notion — testée. Corrections détaillées à chaque question.',
    bullets: ['Corrections expliquées pas à pas', 'Classement par semestre, UE et chapitre', 'Reprise automatique où tu t\'es arrêté'],
  },
  {
    id: 'flashcards', kicker: '02 · Flashcards', color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)',
    title: 'Mémorise avec la répétition active',
    desc: 'Recto, verso, tu tries : "je savais" ou "à revoir". Ton cerveau fait le reste — c\'est prouvé par la science.',
    bullets: ['Glisse pour trier tes cartes', 'Les notions ratées reviennent automatiquement', 'Score et progression par chapitre'],
  },
  {
    id: 'fiches', kicker: '03 · Cours & Fiches IA', color: '#10b981', glow: 'rgba(16,185,129,0.35)',
    title: 'Tes cours deviennent des fiches, grâce à l\'IA',
    desc: 'Colle le texte de ton cours ou envoie une photo — l\'IA génère une fiche de révision structurée en quelques secondes.',
    bullets: ['Fiches officielles S1 → S6 incluses', 'Génération IA depuis tes propres cours', 'Sommaire, points clés, à retenir'],
  },
  {
    id: 'annales', kicker: '04 · Annales', color: '#3b82f6', glow: 'rgba(59,130,246,0.35)',
    title: 'Entraîne-toi sur de vrais sujets d\'examen',
    desc: 'Des annales d\'IFSI de toute la France, classées par année, semestre et matière. Consultables directement dans l\'app.',
    bullets: ['Sujets PDF consultables en ligne', 'Classées par année et par UE', 'Paris, Lyon, UPEC, Sorbonne…'],
  },
  {
    id: 'medicaments', kicker: '05 · Médicaments', color: '#f43f5e', glow: 'rgba(244,63,94,0.35)',
    title: 'La pharmacologie, enfin claire',
    desc: 'Une base médicaments complète : classes, posologies, effets indésirables, surveillances. Recherche instantanée.',
    bullets: ['Fiches par classe médicamenteuse', 'Posologie, contre-indications, surveillance', 'Cartes mentales et schémas'],
  },
  {
    id: 'exercices', kicker: '06 · Cas cliniques', color: '#f97316', glow: 'rgba(249,115,22,0.35)',
    title: 'Des cas cliniques comme aux partiels',
    desc: 'Situations réelles, raisonnement clinique, questions ouvertes et QCM — exactement le format des évaluations IFSI.',
    bullets: ['Cas cliniques progressifs', 'QCM et questions ouvertes corrigés', 'Explication du raisonnement attendu'],
  },
];

const REVIEWS = [
  { name: 'Camille R.', school: 'IFSI Paris', text: "Grâce aux fiches et aux quiz, j'ai validé tous mes modules du premier coup. Interface claire et vraiment bien pensée.", stars: 5 },
  { name: 'Théo M.', school: 'IFSI Lyon', text: "Les flashcards avec répétition espacée m'ont sauvé avant les partiels. Je recommande à tous mes collègues de promo.", stars: 5 },
  { name: 'Inès B.', school: 'IFSI Bordeaux', text: "Exactement ce qu'il faut pour réviser en stage. Accessible depuis le téléphone, fiches claires et bien structurées.", stars: 5 },
  { name: 'Lucas T.', school: 'IFSI Marseille', text: "Les cas cliniques sont très proches de ce qui est demandé aux examens. Un vrai plus pour s'entraîner.", stars: 4 },
  { name: 'Manon D.', school: 'IFSI Lille', text: "La génération de fiches par IA à partir de mes cours est bluffante. Un gain de temps énorme.", stars: 5 },
  { name: 'Antoine P.', school: 'IFSI Nantes', text: "Plateforme très complète, bien mieux que de chercher sur des forums. Le suivi des stats est motivant.", stars: 5 },
];

const FAQ_ITEMS = [
  { q: "Puis-je utiliser Nurses Prép gratuitement ?", a: "Oui, l'accès Starter est entièrement gratuit : 20 quiz, 30 flashcards, 1 exercice théorique, 1 cours et 1 fiche de révision par mois. Pour un accès illimité, les abonnements Étudiant (9,99 €/mois) et Étudiant Pro (14,99 €/mois) sont disponibles." },
  { q: "Les contenus sont-ils adaptés à mon IFSI ?", a: "Oui, tous les contenus sont basés sur le référentiel IFSI officiel (arrêté du 31 juillet 2009) et couvrent l'ensemble des unités d'enseignement de la S1 à la S6." },
  { q: "Comment fonctionne la génération de fiches par IA ?", a: "Disponible avec l'abonnement Étudiant Pro, tu colles le texte de ton cours — notre IA génère une fiche de révision structurée en quelques secondes. Tu peux aussi générer des quiz personnalisés à partir de tes propres cours." },
  { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement. Tu peux résilier depuis ton espace personnel à n'importe quel moment, sans frais. L'accès reste actif jusqu'à la fin de la période payée." },
  { q: "Comment fonctionnent les groupes d'étudiants ?", a: "Tu peux créer ou rejoindre des groupes de révision avec tes camarades de promo. Partage des ressources, progresse ensemble et suivez vos statistiques collectives." },
];

/* ═══════════════════════════════════════════════════════════════════════════
   PETITS COMPOSANTS
═══════════════════════════════════════════════════════════════════════════ */

function Stars({ n = 5, size = 13 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i < n ? '#fbbf24' : '#e2e8f0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* Compteur animé quand visible */
function Counter({ target, suffix = '', duration = 1.6 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    let raf;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration]);
  return <span ref={ref}>{val.toLocaleString('fr-FR')}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ÉCRANS DU TÉLÉPHONE (un par station)
═══════════════════════════════════════════════════════════════════════════ */

function ScreenShell({ title, color, children }) {
  return (
    <div className="flex flex-col h-full" style={{ background: '#f8fafc' }}>
      {/* Status bar */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1 flex-shrink-0">
        <span className="text-[9px] font-bold text-slate-700">9:41</span>
        <div className="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="#334155"><path d="M2 22h20V2L2 22z" /></svg>
          <svg width="14" height="9" viewBox="0 0 28 14"><rect x="0.5" y="0.5" width="23" height="13" rx="3" fill="none" stroke="#334155" /><rect x="2.5" y="2.5" width="16" height="9" rx="1.5" fill="#334155" /><rect x="25" y="4.5" width="2.5" height="5" rx="1" fill="#334155" /></svg>
        </div>
      </div>
      {/* App header */}
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0">
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 6v12M6 12h12" /></svg>
        </div>
        <span className="text-[11px] font-black text-slate-800">{title}</span>
      </div>
      <div className="flex-1 px-3 pb-3 overflow-hidden">{children}</div>
    </div>
  );
}

function ScreenQuiz() {
  return (
    <ScreenShell title="Quiz — UE 2.11" color="#6366f1">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-full flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[8px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">Question 4/10</span>
          <span className="text-[8px] font-bold text-slate-400">⏱ 0:42</span>
        </div>
        <div className="h-1 rounded-full bg-slate-100 mb-3 overflow-hidden">
          <motion.div className="h-full rounded-full bg-indigo-500" initial={{ width: '20%' }} animate={{ width: '40%' }} transition={{ duration: 0.8, delay: 0.3 }} />
        </div>
        <p className="text-[10px] font-bold text-slate-800 leading-snug mb-3">Quelle est la dose maximale de paracétamol par jour chez l'adulte sain ?</p>
        <div className="space-y-1.5">
          {[
            { t: '2 g / jour', ok: false },
            { t: '4 g / jour', ok: true },
            { t: '6 g / jour', ok: false },
            { t: '8 g / jour', ok: false },
          ].map((o, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.1 }}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 border text-[9px] font-semibold ${o.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-150 bg-slate-50 text-slate-500'}`}>
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 text-[7px] font-black ${o.ok ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                {o.ok ? '✓' : String.fromCharCode(65 + i)}
              </span>
              {o.t}
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="mt-auto bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 py-1.5">
          <p className="text-[8px] text-emerald-700 leading-snug"><strong>Bonne réponse !</strong> 4 g/j max, en 4 prises espacées de 6 h minimum.</p>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function ScreenFlashcards() {
  return (
    <ScreenShell title="Flashcards — UE 2.4" color="#8b5cf6">
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[8px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">Carte 12/20</span>
          <span className="text-[8px] font-bold text-emerald-500">✓ 9 connues</span>
        </div>
        <div className="flex-1 relative" style={{ perspective: 500 }}>
          <motion.div
            className="absolute inset-0"
            animate={{ rotateY: [0, 0, 180, 180, 0] }}
            transition={{ duration: 6, times: [0, 0.3, 0.45, 0.85, 1], repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformStyle: 'preserve-3d' }}>
            {/* Recto */}
            <div className="absolute inset-0 rounded-2xl p-3 flex flex-col items-center justify-center text-center shadow-lg"
              style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(150deg,#7c3aed,#a78bfa)' }}>
              <span className="text-[7px] font-black text-white/60 uppercase tracking-widest mb-2">Question</span>
              <p className="text-[11px] font-black text-white leading-snug">Quels sont les 3 temps de l'hémostase ?</p>
              <span className="text-[7px] text-white/50 mt-3">Touche pour retourner</span>
            </div>
            {/* Verso */}
            <div className="absolute inset-0 rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-white border-2 border-violet-200 shadow-lg"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
              <span className="text-[7px] font-black text-violet-400 uppercase tracking-widest mb-2">Réponse</span>
              <p className="text-[9px] font-bold text-slate-700 leading-relaxed">1. Hémostase primaire<br />2. Coagulation<br />3. Fibrinolyse</p>
            </div>
          </motion.div>
        </div>
        <div className="flex gap-2 mt-2.5">
          <div className="flex-1 rounded-xl py-1.5 text-center text-[8px] font-black text-rose-500 bg-rose-50 border border-rose-100">✕ À revoir</div>
          <div className="flex-1 rounded-xl py-1.5 text-center text-[8px] font-black text-white shadow-sm" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>✓ Je savais</div>
        </div>
      </div>
    </ScreenShell>
  );
}

function ScreenFiches() {
  return (
    <ScreenShell title="Fiches — IA" color="#10b981">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-full flex flex-col">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[8px] font-black text-white px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
            ✦ Générée par IA
          </span>
          <span className="text-[8px] font-bold text-slate-400">UE 2.4</span>
        </div>
        <p className="text-[11px] font-black text-slate-800 mb-2">L'hémostase — l'essentiel</p>
        {[
          { t: 'Définition', w: '90%' },
          { t: 'Les 3 temps', w: '75%' },
          { t: 'Valeurs normales', w: '82%' },
          { t: 'À retenir', w: '60%' },
        ].map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.18 }}
            className="mb-2">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-3.5 h-3.5 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center text-[7px] font-black flex-shrink-0">{i + 1}</span>
              <span className="text-[9px] font-bold text-slate-700">{s.t}</span>
            </div>
            <div className="space-y-1 pl-5">
              <div className="h-1 rounded-full bg-slate-100" style={{ width: s.w }} />
              <div className="h-1 rounded-full bg-slate-100" style={{ width: `calc(${s.w} - 18%)` }} />
            </div>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="mt-auto flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-2.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
          <p className="text-[8px] font-bold text-emerald-700">Fiche générée en 8 secondes</p>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function ScreenAnnales() {
  return (
    <ScreenShell title="Annales" color="#3b82f6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-full flex flex-col">
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">2024-2025</span>
          <span className="text-[8px] font-bold text-slate-400">Semestre 1</span>
        </div>
        {[
          { t: 'UE 2.11 — Pharmacologie', ifsi: 'IFSI Paris Cité', pdf: true },
          { t: 'UE 2.4 — Processus traumatiques', ifsi: 'IFSI Sorbonne', pdf: true },
          { t: 'UE 4.4 — Thérapeutiques', ifsi: 'IFSI UPEC', pdf: true },
        ].map((a, i) => (
          <motion.div key={a.t} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
            className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2 mb-1.5">
            <div className="w-6 h-7 rounded bg-rose-100 flex items-center justify-center flex-shrink-0">
              <span className="text-[6px] font-black text-rose-500">PDF</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[8.5px] font-bold text-slate-700 truncate">{a.t}</p>
              <p className="text-[7px] text-slate-400">{a.ifsi}</p>
            </div>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          </motion.div>
        ))}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.75 }}
          className="mt-auto rounded-xl p-2.5 text-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
          <p className="text-[9px] font-black text-white">+120 sujets d'examens réels</p>
          <p className="text-[7px] text-blue-200 mt-0.5">IFSI de toute la France</p>
        </motion.div>
      </div>
    </ScreenShell>
  );
}

function ScreenMedicaments() {
  return (
    <ScreenShell title="Médicaments" color="#f43f5e">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"><path d="m10.5 20.5-7-7a5 5 0 1 1 7-7l7 7a5 5 0 1 1-7 7Z" /><path d="m8.5 8.5 7 7" /></svg>
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-800 leading-none">Amoxicilline</p>
            <p className="text-[7.5px] text-slate-400 italic mt-0.5">Antibiotiques — β-lactamines</p>
          </div>
        </div>
        {[
          { t: 'Indications', c: '#3b82f6', txt: 'Infections ORL, pulmonaires, urinaires…' },
          { t: 'Posologie', c: '#10b981', txt: '1 à 3 g/j en 2-3 prises (adulte)' },
          { t: 'Effets indésirables', c: '#f59e0b', txt: 'Troubles digestifs, réactions allergiques' },
          { t: 'Surveillance', c: '#f43f5e', txt: 'Signes allergiques, fonction rénale' },
        ].map((s, i) => (
          <motion.div key={s.t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.14 }}
            className="rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-1.5 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.c }} />
              <span className="text-[8.5px] font-black text-slate-700">{s.t}</span>
            </div>
            <p className="text-[7.5px] text-slate-500 mt-0.5 pl-3">{s.txt}</p>
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}

function ScreenExercices() {
  return (
    <ScreenShell title="Cas clinique" color="#f97316">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 h-full flex flex-col">
        <span className="text-[8px] font-black text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full self-start mb-2">Situation clinique</span>
        <p className="text-[9px] text-slate-600 leading-relaxed mb-2">
          <strong className="text-slate-800">M. Dupont, 67 ans</strong>, diabétique de type 2, est retrouvé confus dans sa chambre. Sueurs profuses, tremblements.
        </p>
        <div className="flex gap-1.5 mb-2.5">
          {[['Glycémie', '0,45 g/L', '#f43f5e'], ['FC', '118 bpm', '#f59e0b'], ['TA', '140/85', '#3b82f6']].map(([l, v, c]) => (
            <div key={l} className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-1.5 py-1 text-center">
              <p className="text-[6.5px] font-bold text-slate-400 uppercase">{l}</p>
              <p className="text-[8.5px] font-black" style={{ color: c }}>{v}</p>
            </div>
          ))}
        </div>
        <p className="text-[9px] font-bold text-slate-800 mb-1.5">Quelle est votre priorité de soin ?</p>
        {[
          { t: 'Resucrage per os si conscient', ok: true },
          { t: 'Injection d\'insuline rapide', ok: false },
          { t: 'Surveillance simple', ok: false },
        ].map((o, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.13 }}
            className={`flex items-center gap-2 rounded-xl px-2.5 py-1.5 border mb-1.5 text-[8.5px] font-semibold ${o.ok ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-500'}`}>
            <span className={`w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center text-[6px] font-black ${o.ok ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200'}`}>{o.ok ? '✓' : ''}</span>
            {o.t}
          </motion.div>
        ))}
      </div>
    </ScreenShell>
  );
}

const SCREENS = [ScreenQuiz, ScreenFlashcards, ScreenFiches, ScreenAnnales, ScreenMedicaments, ScreenExercices];

/* ═══════════════════════════════════════════════════════════════════════════
   TÉLÉPHONE (mockup)
═══════════════════════════════════════════════════════════════════════════ */

function Phone({ active, glow }) {
  const Screen = SCREENS[active];
  return (
    <div className="relative" style={{ width: 'min(258px, 62vw)' }}>
      {/* Halo coloré derrière le téléphone */}
      <motion.div
        className="absolute -inset-8 rounded-full pointer-events-none"
        animate={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
        transition={{ duration: 0.6 }}
        style={{ filter: 'blur(30px)' }}
      />
      {/* Cadre */}
      <div className="relative rounded-[2.6rem] border-[10px] border-slate-900 bg-slate-900 shadow-2xl overflow-hidden"
        style={{ aspectRatio: '9/19', boxShadow: '0 26px 60px rgba(15,23,42,0.28), inset 0 0 0 2px #1e293b' }}>
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-b-2xl z-20" />
        {/* Écran avec transition entre stations */}
        <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0">
              <Screen />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Boutons latéraux */}
      <div className="absolute -right-[3px] top-24 w-[3px] h-12 bg-slate-700 rounded-r" />
      <div className="absolute -left-[3px] top-20 w-[3px] h-8 bg-slate-700 rounded-l" />
      <div className="absolute -left-[3px] top-32 w-[3px] h-8 bg-slate-700 rounded-l" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLYTELLING — section haute avec téléphone épinglé
═══════════════════════════════════════════════════════════════════════════ */

function ScrollStory() {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const N = STATIONS.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(N - 1, Math.max(0, Math.floor(v * N)));
    setActive(prev => (prev === idx ? prev : idx));
  });

  /* Légère rotation du téléphone au fil du scroll (GPU only) */
  const rotate = useTransform(scrollYProgress, [0, 1], [-4, 4]);
  const rotateSpring = useSpring(rotate, { stiffness: 120, damping: 24 });

  const station = STATIONS[active];

  /* Mode réduit : rendu statique empilé, pas de sticky ni d'animations */
  if (reduced) {
    return (
      <section id="fonctionnalites" className="py-20" style={{ background: 'linear-gradient(180deg,#f1f5fd,#eef2ff,#f8fafc)' }}>
        <div className="max-w-5xl mx-auto px-4 space-y-16">
          {STATIONS.map((s, i) => (
            <div key={s.id} className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-black uppercase tracking-widest" style={{ color: s.color }}>{s.kicker}</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3">{s.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{s.desc}</p>
              </div>
              <div className="flex justify-center"><Phone active={i} glow={s.glow} /></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="fonctionnalites" ref={ref} className="relative" style={{ height: `${N * 108}vh`, background: '#f1f5fd' }}>
      {/* Fond : points + orbes */}
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: 'linear-gradient(160deg,#f1f5fd 0%,#eef2ff 45%,#f0f9ff 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(100,116,139,0.13) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none hidden md:block"
          animate={{ background: `radial-gradient(circle, ${station.glow}, transparent 65%)` }}
          transition={{ duration: 0.8 }}
          style={{ top: '-15%', right: '-10%', filter: 'blur(50px)', opacity: 0.3 }} />
        <motion.div className="absolute w-[380px] h-[380px] rounded-full pointer-events-none"
          animate={{ background: `radial-gradient(circle, ${station.glow}, transparent 65%)` }}
          transition={{ duration: 0.8 }}
          style={{ bottom: '-14%', left: '-8%', filter: 'blur(56px)', opacity: 0.22 }} />

        <div className="relative h-full max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:grid md:grid-cols-2 md:gap-12 items-center justify-center">

          {/* ── Téléphone (sticky, change d'écran) ── */}
          <div className="flex justify-center items-center pt-12 md:pt-0 order-1 md:order-2 h-[420px] md:h-auto overflow-visible" style={{ minHeight: 0 }}>
            <div className="scale-[0.68] sm:scale-90 md:scale-100 origin-center">
              <motion.div style={{ rotate: rotateSpring, willChange: 'transform' }}>
                <Phone active={active} glow={station.glow} />
              </motion.div>
            </div>
          </div>

          {/* ── Texte de la station ── */}
          <div className="order-2 md:order-1 w-full max-w-md pb-8 md:pb-0 mt-1 md:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}>
                <span className="inline-block text-[11px] md:text-xs font-black uppercase tracking-[0.18em] px-3 py-1 rounded-full border"
                  style={{ color: station.color, borderColor: `${station.color}55`, background: `${station.color}14` }}>
                  {station.kicker}
                </span>
                <h3 className="text-2xl md:text-4xl font-black text-slate-900 mt-4 mb-3 leading-tight">{station.title}</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-5">{station.desc}</p>
                <ul className="space-y-2.5 hidden sm:block">
                  {station.bullets.map(b => (
                    <li key={b} className="flex items-center gap-2.5 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${station.color}22` }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={station.color} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>

            {/* Indicateur de progression (stations) */}
            <div className="flex items-center gap-2 mt-7">
              {STATIONS.map((s, i) => (
                <button key={s.id} aria-label={s.kicker}
                  onClick={() => {
                    const el = ref.current;
                    if (!el) return;
                    const top = el.offsetTop + (i / N) * (el.offsetHeight - window.innerHeight) + 10;
                    window.scrollTo({ top, behavior: 'smooth' });
                  }}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 26 : 8, height: 8,
                    background: i === active ? station.color : 'rgba(100,116,139,0.28)',
                    cursor: 'pointer', border: 'none', padding: 0,
                  }} />
              ))}
              <span className="text-[10px] text-slate-400 font-bold ml-2 tabular-nums">{String(active + 1).padStart(2, '0')} / {String(N).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Hint scroll (visible sur la première station seulement) */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
          animate={{ opacity: active === 0 ? 1 : 0 }}
          transition={{ duration: 0.3 }}>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Continue de défiler</span>
          <motion.svg animate={{ y: [0, 5, 0] }} transition={{ duration: 1.4, repeat: Infinity }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></motion.svg>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════════════ */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { label: 'Fonctionnalités', href: '#fonctionnalites' },
    { label: 'Tout-en-un', href: '#atouts' },
    { label: 'Tarifs', href: '#pricing' },
    { label: 'Avis', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      {/* Barre de progression de lecture */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left"
        style={{ scaleX: progress, background: 'linear-gradient(90deg,#0891b2,#06b6d4,#6366f1)' }} />

      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/85 shadow-lg shadow-slate-900/5' : 'bg-transparent'}`}
        style={{ backdropFilter: scrolled ? 'blur(14px)' : 'none' }}>
        <nav className={`w-full px-4 md:px-6 flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-4'}`}>
          <Link to="/" className="flex-shrink-0">
            <NursesLogo size="sm" light={!scrolled} />
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors ${scrolled ? 'text-slate-600 hover:text-cyan-700 hover:bg-cyan-50' : 'text-blue-100/80 hover:text-white hover:bg-white/10'}`}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/login"
              className={`hidden sm:block px-4 py-2 rounded-xl text-[13px] font-bold transition-colors ${scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white/90 hover:bg-white/10'}`}>
              Connexion
            </Link>
            <Link to="/register"
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[13px] font-black text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5 transition-transform"
              style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
              S'inscrire
            </Link>
            {/* Burger mobile */}
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Menu"
              className={`md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${scrolled ? 'bg-slate-100 text-slate-700' : 'bg-white/10 text-white'}`}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </nav>

        {/* Menu mobile */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }} className="md:hidden overflow-hidden bg-white/95 shadow-xl" style={{ backdropFilter: 'blur(14px)' }}>
              <div className="px-4 py-3 space-y-1">
                {links.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 transition">
                    {l.label}
                  </a>
                ))}
                <Link to="/login" className="block px-4 py-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition">Connexion</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ ITEM (accordéon animé)
═══════════════════════════════════════════════════════════════════════════ */

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-colors ${open ? 'border-cyan-300 shadow-md shadow-cyan-500/5' : 'border-slate-200'}`}>
      <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left gap-3 min-h-[56px]">
        <span className="text-sm font-bold text-slate-800">{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${open ? 'bg-cyan-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
            <p className="px-5 pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION REVEAL — wrapper d'apparition au scroll
═══════════════════════════════════════════════════════════════════════════ */

function Reveal({ children, delay = 0, y = 24, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════════════════════════════════ */

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(heroProgress, [0, 0.75], [1, 0]);

  return (
    <div className="bg-white antialiased" style={{ fontFamily: "'Nunito', 'DM Sans', system-ui, sans-serif" }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes float1 { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(-24px,18px) } }
        @keyframes float2 { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(20px,-16px) } }
        @keyframes marquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
        .marquee-track { display:flex; gap:16px; width:max-content; animation:marquee 42s linear infinite; }
        .marquee-track:hover { animation-play-state:paused; }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
          html { scroll-behavior: auto; }
        }
      `}</style>

      <Navbar />

      {/* ══════════════ HERO ══════════════ */}
      <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4"
        style={{ background: 'linear-gradient(160deg,#020617 0%,#0f172a 35%,#164e8a 80%,#0891b2 130%)' }}>
        {/* Décor */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.10) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute w-[480px] h-[480px] rounded-full pointer-events-none hidden sm:block" style={{ top: '-12%', left: '-8%', background: 'radial-gradient(circle,rgba(8,145,178,0.35),transparent 65%)', filter: 'blur(50px)', animation: 'float1 16s ease-in-out infinite' }} />
        <div className="absolute w-[380px] h-[380px] rounded-full pointer-events-none" style={{ bottom: '-10%', right: '-6%', background: 'radial-gradient(circle,rgba(99,102,241,0.3),transparent 65%)', filter: 'blur(46px)', animation: 'float2 20s ease-in-out infinite' }} />

        {/* ECG discret */}
        <svg className="absolute bottom-[12%] left-0 right-0 w-full opacity-[0.13] pointer-events-none" viewBox="0 0 320 60" fill="none" preserveAspectRatio="none" style={{ height: 60 }}>
          <motion.polyline points="0,30 90,30 105,10 115,50 125,18 135,42 145,30 320,30"
            stroke="#67e8f9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.9, ease: 'easeInOut' }} />
        </svg>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-3xl mx-auto text-center pt-20 pb-14">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 mb-7">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-cyan-200">Plateforme de révision IFSI — France</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] mb-6">
            Réussis ton diplôme<br />
            <span style={{ background: 'linear-gradient(90deg,#67e8f9,#06b6d4,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              infirmier avec confiance
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-blue-100/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-9">
            Quiz, flashcards, fiches IA, annales, médicaments et cas cliniques — tout ce dont tu as besoin pour valider tes UE, du S1 au S6.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.38 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-black text-slate-900 shadow-2xl shadow-cyan-500/30 hover:-translate-y-1 transition-transform text-center"
              style={{ background: 'linear-gradient(135deg,#67e8f9,#06b6d4)' }}>
              Commencer gratuitement
            </Link>
            <a href="#fonctionnalites"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold text-white border border-white/20 bg-white/5 hover:bg-white/10 transition text-center">
              Découvrir en 30 secondes ↓
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.6 }}
            className="flex items-center justify-center gap-4 md:gap-8 mt-10 flex-wrap">
            <div className="flex items-center gap-2">
              <Stars n={5} />
              <span className="text-xs font-bold text-blue-100">4,9/5 · 240+ avis</span>
            </div>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-blue-300/40" />
            <span className="text-xs font-bold text-blue-100"><Counter target={2400} suffix="+" /> étudiants</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-blue-300/40" />
            <span className="text-xs font-bold text-blue-100">Sans carte bancaire</span>
          </motion.div>
        </motion.div>

        {/* Indicateur scroll */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/25 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════ SCROLLYTELLING ══════════════ */}
      <div className="pt-16 pb-4 text-center px-4" style={{ background: 'linear-gradient(180deg,#ffffff,#f1f5fd)' }}>
        <Reveal>
          <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">Visite guidée</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Tout ce qu'il te faut,<br className="sm:hidden" /> dans une seule app</h2>
          <p className="text-slate-500 text-sm md:text-base mt-3 max-w-lg mx-auto">Défile — le téléphone te montre chaque outil, comme si tu y étais.</p>
        </Reveal>
      </div>

      <ScrollStory />

      {/* ══════════════ TOUT-EN-UN (bento) ══════════════ */}
      <section id="atouts" className="relative bg-white py-20 md:py-28 overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ top: '10%', left: '-12%', background: 'radial-gradient(circle,rgba(8,145,178,0.10),transparent 65%)', filter: 'blur(48px)' }} />
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <Reveal className="text-center mb-14">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">Et bien plus</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Pensée pour ta réussite,<br className="sm:hidden" /> du premier jour au diplôme</h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                t: 'Groupes de révision', d: 'Crée un groupe avec ta promo, partagez vos ressources et progressez ensemble.', c: '#06b6d4',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
              },
              {
                t: 'Suivi de progression', d: 'Scores, streaks, objectifs quotidiens : visualise tes progrès UE par UE, jour après jour.', c: '#818cf8',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
              },
              {
                t: 'Objectifs quotidiens', d: 'Fixe tes cibles (quiz, cartes, exercices par jour) et garde ta série de révision active.', c: '#f59e0b',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>,
              },
              {
                t: 'Accessible partout', d: 'Sur ton téléphone en stage, sur ton ordi à la bibliothèque — ta progression te suit.', c: '#10b981',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" /></svg>,
              },
              {
                t: 'Référentiel officiel', d: 'Contenus alignés sur le référentiel IFSI (arrêté du 31 juillet 2009), S1 → S6.', c: '#3b82f6',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
              },
              {
                t: 'Support réactif', d: 'Une question, un souci ? L\'équipe répond directement dans l\'app, rapidement.', c: '#f43f5e',
                icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
              },
            ].map((f, i) => (
              <Reveal key={f.t} delay={i * 0.07}>
                <div className="group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: `${f.c}16`, color: f.c }}>
                    {f.icon}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mb-2">{f.t}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CHIFFRES ══════════════ */}
      <section className="relative py-16 md:py-20" style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a,#0891b2)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
        <div className="relative max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: 2400, s: '+', l: 'Étudiants inscrits' },
            { v: 1200, s: '+', l: 'Questions de quiz' },
            { v: 120, s: '+', l: 'Sujets d\'annales' },
            { v: 87, s: '%', l: 'De réussite déclarée' },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <p className="text-3xl md:text-5xl font-black text-white tabular-nums"><Counter target={s.v} suffix={s.s} /></p>
              <p className="text-xs md:text-sm text-blue-200/80 font-bold mt-2">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══════════════ TARIFS ══════════════ */}
      <section id="pricing" className="relative py-20 md:py-28 overflow-hidden" style={{ background: 'linear-gradient(180deg,#ffffff,#f1f5fd 40%,#ffffff)' }}>
        {/* Blobs décoratifs */}
        <div className="absolute w-[420px] h-[420px] rounded-full pointer-events-none" style={{ top: '4%', right: '-10%', background: 'radial-gradient(circle,rgba(6,182,212,0.13),transparent 65%)', filter: 'blur(52px)' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none" style={{ bottom: '2%', left: '-8%', background: 'radial-gradient(circle,rgba(99,102,241,0.12),transparent 65%)', filter: 'blur(48px)' }} />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8">
          <Reveal className="text-center mb-16">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">Tarifs</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-3">Choisis ton offre</h2>
            <p className="text-slate-500 text-sm md:text-base">Commence gratuitement, évolue quand tu veux. Sans engagement.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-5 items-stretch">

            {/* ── Starter ── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
              whileHover={{ y: -8 }}
              className="flex flex-col rounded-[28px] border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-shadow duration-300 md:mt-6">
              <div className="px-7 pt-7 pb-5 flex-1">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Gratuit</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Starter</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black text-slate-900">0</span>
                  <span className="text-2xl font-bold text-slate-900 mb-0.5">€</span>
                  <span className="text-sm text-slate-400 mb-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Pour commencer sans risque</p>
                <div className="space-y-0.5">
                  {[
                    { t: '20 quiz / mois', ok: true },
                    { t: '30 flashcards / mois', ok: true },
                    { t: '1 exercice théorique / mois', ok: true },
                    { t: '1 fiche de cours / mois', ok: true },
                    { t: 'Fiches illimitées', ok: false },
                    { t: 'Exercices & Cas cliniques', ok: false },
                    { t: 'Génération IA', ok: false },
                    { t: 'Annales complètes', ok: false },
                    { t: 'Support prioritaire', ok: false },
                  ].map(({ t, ok }, fi) => (
                    <motion.div key={t}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: 0.15 + fi * 0.05, duration: 0.35 }}
                      className={`flex items-center gap-2.5 py-1.5 text-xs ${ok ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {ok
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          : <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                      </span>
                      {t}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-7">
                <Link to="/register" className="block w-full py-3 border-2 border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:border-cyan-400 hover:text-cyan-700 transition text-center">
                  Commencer gratuitement
                </Link>
              </div>
            </motion.div>

            {/* ── Étudiant (vedette, bordure animée) ── */}
            <motion.div
              initial={{ opacity: 0, y: 48, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 190, damping: 22, delay: 0.08 }}
              whileHover={{ y: -8 }}
              className="relative rounded-[30px] p-[2.5px] overflow-hidden shadow-2xl shadow-cyan-900/25">
              {/* Bordure lumineuse rotative */}
              <motion.div
                className="absolute -inset-[120%] pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
                style={{ background: 'conic-gradient(from 0deg, #06b6d4, #6366f1 25%, #0e7490 50%, #22d3ee 75%, #06b6d4)' }} />

              <div className="relative flex flex-col h-full rounded-[28px] overflow-hidden"
                style={{ background: 'linear-gradient(165deg,#0c2f56 0%,#14508c 55%,#0e7490 100%)' }}>
                {/* Shine interne */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 80% 0%,rgba(255,255,255,0.14),transparent 55%)' }} />

                {/* Badge flottant */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="text-white text-[10px] font-black px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5"
                    style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#fde047"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    Le plus populaire
                  </div>
                </motion.div>

                <div className="relative px-7 pt-14 pb-5 flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    <span className="text-[10px] font-black text-cyan-300 bg-cyan-400/15 border border-cyan-400/30 px-2.5 py-1 rounded-full uppercase tracking-wide">Recommandé</span>
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">Étudiant</h3>
                  <div className="flex items-end gap-1.5 mb-1">
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.25 }}
                      className="text-4xl font-black text-white">9,99</motion.span>
                    <span className="text-2xl font-bold text-white mb-0.5">€</span>
                    <span className="text-sm text-cyan-200/70 mb-1">/ mois</span>
                  </div>
                  <p className="text-xs text-cyan-200/60 mb-6">L'accès complet à la plateforme</p>
                  <div className="space-y-0.5">
                    {[
                      'Quiz illimités',
                      'Flashcards illimitées',
                      'Toutes les fiches de cours',
                      'Exercices & Cas cliniques',
                      'Fiches personnalisées par IA',
                      'Annales complètes',
                      'Base médicaments complète',
                      'Support prioritaire',
                    ].map((f, fi) => (
                      <motion.div key={f}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ delay: 0.2 + fi * 0.05, duration: 0.35 }}
                        className="flex items-center gap-2.5 py-1.5 text-xs text-blue-50">
                        <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-400/25">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        </span>
                        {f}
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative px-7 pb-7">
                  <Link to="/register"
                    className="relative block w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 text-center overflow-hidden shadow-lg shadow-cyan-400/30 hover:opacity-95 transition"
                    style={{ background: 'linear-gradient(135deg,#67e8f9,#06b6d4)' }}>
                    <motion.span
                      className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ['-140%', '190%'] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }} />
                    <span className="relative">Commencer maintenant</span>
                  </Link>
                  <p className="text-[10px] text-cyan-200/60 text-center mt-3">Sans engagement · Résiliation en 1 clic</p>
                </div>
              </div>
            </motion.div>

            {/* ── Étudiant Pro ── */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 210, damping: 24, delay: 0.16 }}
              whileHover={{ y: -8 }}
              className="flex flex-col rounded-[28px] border border-slate-200 bg-white shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-shadow duration-300 overflow-hidden md:mt-6">
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0f172a,#164e8a,#0891b2)' }} />
              <div className="px-7 pt-6 pb-5 flex-1">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#eef2ff,#e0f2fe)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#164e8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.735H5.81a1 1 0 0 1-.957-.735L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" /><path d="M5 21h14" /></svg>
                  </div>
                  <span className="text-[10px] font-black text-white px-2.5 py-1 rounded-full uppercase tracking-wide"
                    style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a)' }}>Pro</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Étudiant Pro</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black text-slate-900">14,99</span>
                  <span className="text-2xl font-bold text-slate-900 mb-0.5">€</span>
                  <span className="text-sm text-slate-400 mb-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Pour ceux qui visent l'excellence</p>
                <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  <p className="text-xs font-semibold text-slate-600">Tout le plan Étudiant, plus :</p>
                </div>
                <div className="space-y-0.5">
                  {[
                    { t: 'Génération IA illimitée', highlight: true },
                    { t: 'Quiz personnalisés par IA', highlight: true },
                    { t: 'Groupes illimités', highlight: false },
                    { t: 'Statistiques avancées', highlight: false },
                    { t: 'Export PDF des fiches', highlight: false },
                    { t: 'Support dédié 24h', highlight: true },
                  ].map(({ t, highlight }, fi) => (
                    <motion.div key={t}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ delay: 0.15 + fi * 0.05, duration: 0.35 }}
                      className="flex items-center gap-2.5 py-1.5 text-xs text-slate-700">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={highlight ? '#1d4ed8' : '#16a34a'} strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      <span className={highlight ? 'font-semibold text-blue-800' : ''}>{t}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-7">
                <Link to="/register"
                  className="block w-full py-3 text-white rounded-2xl text-sm font-bold text-center transition hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a)' }}>
                  Choisir Étudiant Pro
                </Link>
              </div>
            </motion.div>
          </div>

          <Reveal className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-10 text-xs text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>Paiement sécurisé par Stripe</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Sans engagement · Résiliation immédiate</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>14 jours satisfait ou remboursé</span>
          </Reveal>
        </div>
      </section>

      {/* ══════════════ AVIS ══════════════ */}
      <section id="reviews" className="py-20 md:py-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
          <Reveal className="text-center">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">Avis étudiants</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-2">Ils ont réussi avec Nurses Prép</h2>
            <div className="flex justify-center items-center gap-2 mt-3">
              <Stars n={5} />
              <span className="text-sm font-bold text-slate-700">4,9 / 5</span>
              <span className="text-xs text-slate-400">— 240+ avis</span>
            </div>
          </Reveal>
        </div>

        {/* Marquee infini */}
        <div className="relative overflow-hidden py-2"
          style={{ maskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,black 8%,black 92%,transparent)' }}>
          <div className="marquee-track">
            {[...REVIEWS, ...REVIEWS].map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-sm flex-shrink-0" style={{ width: 290 }}>
                <Stars n={r.stars} />
                <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ FAQ ══════════════ */}
      <section id="faq" className="py-20 md:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <Reveal className="text-center mb-12">
            <span className="text-xs font-black text-cyan-600 uppercase tracking-[0.2em]">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-3">Questions fréquentes</h2>
          </Reveal>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <FaqItem q={item.q} a={item.a} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FINAL ══════════════ */}
      <section id="contact" className="relative py-20 md:py-28 overflow-hidden" style={{ background: 'linear-gradient(135deg,#020617,#0f172a 40%,#164e8a 85%,#0891b2 130%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="absolute w-[360px] h-[360px] rounded-full pointer-events-none" style={{ top: '-18%', right: '4%', background: 'radial-gradient(circle,rgba(6,182,212,0.3),transparent 65%)', filter: 'blur(46px)' }} />
        <Reveal className="relative max-w-2xl mx-auto px-4 md:px-8 text-center">
          <NursesLogo size="lg" light />
          <h2 className="text-3xl md:text-4xl font-black text-white mt-7 mb-4 leading-tight">
            Prêt·e pour tes examens IFSI ?
          </h2>
          <p className="text-blue-200/80 text-sm md:text-base mb-9 leading-relaxed">
            Rejoins des milliers d'étudiants qui font confiance à Nurses Prép pour réussir leur diplôme infirmier.
          </p>
          <Link to="/register"
            className="inline-block px-10 py-4 bg-white font-black rounded-2xl text-sm hover:-translate-y-1 transition-transform shadow-2xl"
            style={{ color: '#164e8a' }}>
            Commencer gratuitement — c'est rapide
          </Link>
          <p className="text-blue-300/70 text-xs mt-4">Sans carte bancaire requise</p>
        </Reveal>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-slate-950 pt-14 pb-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row justify-between gap-10 mb-12">
            <div className="max-w-xs">
              <NursesLogo size="sm" light />
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                La plateforme de révision conçue pour les étudiants infirmiers IFSI — France.
              </p>
              <div className="flex items-center gap-2 mt-5">
                {[
                  { label: 'Instagram', href: '#', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg> },
                  { label: 'TikTok', href: '#', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a4.8 4.8 0 0 1-3.5-3.6V2h-3.2v13.7a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .9.1V9.6a6.1 6.1 0 1 0 5.2 6V9.9a7.9 7.9 0 0 0 4.4 1.3V8a4.7 4.7 0 0 1-.9-1.7z" /></svg> },
                  { label: 'Email', href: 'mailto:contact@nursesprep.fr', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> },
                ].map(s => (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Réviser</h4>
                {[['Quiz', '#fonctionnalites'], ['Flashcards', '#fonctionnalites'], ['Cours & Fiches', '#fonctionnalites'], ['Annales', '#fonctionnalites']].map(([l, h]) => (
                  <a key={l} href={h} className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Outils</h4>
                {[['Médicaments', '#fonctionnalites'], ['Cas cliniques', '#fonctionnalites'], ['Fiches IA', '#fonctionnalites'], ['Groupes', '#atouts']].map(([l, h]) => (
                  <a key={l} href={h} className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Offres</h4>
                {['Starter (gratuit)', 'Étudiant', 'Étudiant Pro'].map(l => (
                  <a key={l} href="#pricing" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
                <a href="#faq" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">FAQ</a>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4">Légal</h4>
                <Link to="/cgu" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">CGU</Link>
                <Link to="/confidentialite" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">Confidentialité</Link>
                <a href="mailto:contact@nursesprep.fr" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">Contact</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-slate-600">© 2026 Nurses Prép — Tous droits réservés</p>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#f43f5e"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <span>Fait avec soin pour les étudiants IFSI — France</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
