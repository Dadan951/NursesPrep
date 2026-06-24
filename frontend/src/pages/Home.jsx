import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

/* ─── LOGO CALLIGRAPHIE ──────────────────────────────────────────────────── */
function NursesLogo({ size = 'md', light = false }) {
  const sizes = { sm: { script: 22, sub: 11 }, md: { script: 28, sub: 13 }, lg: { script: 38, sub: 16 } };
  const s = sizes[size] || sizes.md;
  return (
    <div className="flex flex-col items-start leading-none select-none" style={{ fontFamily: "'Dancing Script', cursive" }}>
      <span style={{
        fontSize: s.script,
        fontWeight: 700,
        background: light ? 'linear-gradient(135deg,#7dd3fc,#38bdf8,#bae6fd)' : 'linear-gradient(135deg,#164e8a,#1d6fba,#0891b2)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        letterSpacing: '-0.5px',
        lineHeight: 1.1,
      }}>Nurses Prép</span>
      {/* heartbeat line */}
      <svg viewBox="0 0 120 14" style={{ width: s.script * 3.5, height: 10, marginTop: 2 }} fill="none">
        <polyline
          points="0,7 20,7 28,2 34,12 40,7 54,7 58,1 63,13 68,7 80,7 84,4 88,10 92,7 120,7"
          stroke={light ? '#38bdf8' : '#0891b2'}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ─── STAR RATING ────────────────────────────────────────────────────────── */
function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < n ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

/* ─── FLASHCARD FLIP ─────────────────────────────────────────────────────── */
function FlipCard({ front, back, color }) {
  const [flipped, setFlipped] = useState(false);
  const isJSX = typeof front === 'object';
  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: 800, height: '100%', minHeight: isJSX ? undefined : 130 }}
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => !isJSX && setFlipped(true)}
      onMouseLeave={() => !isJSX && setFlipped(false)}
    >
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        {/* Front */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}>
          {isJSX ? front : (
            <div className={`rounded-2xl border flex flex-col items-center justify-center p-4 h-full ${color?.front}`}>
              <p className="text-xs font-semibold text-center leading-snug">{front}</p>
              <p className="text-xs mt-2 opacity-50">Survoler pour voir</p>
            </div>
          )}
        </div>
        {/* Back */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          {isJSX ? back : (
            <div className={`rounded-2xl border flex items-center justify-center p-4 h-full ${color?.back}`}>
              <p className="text-xs font-semibold text-center leading-snug">{back}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN HOME ──────────────────────────────────────────────────────────── */
export default function Home() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [reviewIdx, setReviewIdx]   = useState(0);
  const canvasRef = useRef(null);
  const typedRef  = useRef(null);
  const heroRef   = useRef(null);

  /* scroll header */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* mouse parallax */
  useEffect(() => {
    const fn = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      setMousePos({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  /* particles canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width  = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 18 + 6;
        this.dx = (Math.random() - 0.5) * 0.3;
        this.dy = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.08 + 0.03;
        this.color = ['#0891b2','#38bdf8','#7dd3fc','#bfdbfe'][Math.floor(Math.random()*4)];
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      update() {
        this.x += this.dx; this.y += this.dy;
        if (this.x < -this.r || this.x > canvas.width+this.r || this.y < -this.r || this.y > canvas.height+this.r) this.reset();
      }
    }
    const particles = Array.from({ length: 35 }, () => new Particle());
    let id;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);

  /* typewriter */
  useEffect(() => {
    const words = ['avec confiance', 'en toute sérénité', "dès aujourd'hui", 'et décrocher ton diplôme'];
    let wi = 0, ci = 0, deleting = false, timeout;
    const type = () => {
      const word = words[wi];
      if (!typedRef.current) return;
      if (!deleting) {
        typedRef.current.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) { deleting = true; timeout = setTimeout(type, 2000); return; }
      } else {
        typedRef.current.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      }
      timeout = setTimeout(type, deleting ? 50 : 90);
    };
    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  /* scroll reveal */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* counter animation */
  useEffect(() => {
    const counters = document.querySelectorAll('[data-target]');
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = parseInt(el.dataset.target);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          let current = 0;
          const step = target / 60;
          const iv = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = prefix + Math.round(current).toLocaleString('fr-FR') + suffix;
            if (current >= target) clearInterval(iv);
          }, 22);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* reviews auto-scroll */
  const reviews = [
    { name: 'Camille R.', school: 'IFSI Paris', text: "Grâce aux fiches et aux quiz, j'ai validé tous mes modules du premier coup. Interface claire et vraiment bien pensée.", stars: 5 },
    { name: 'Théo M.', school: 'IFSI Lyon', text: "Les flashcards avec répétition espacée m'ont sauvé avant les partiels. Je recommande à tous mes collègues de promo.", stars: 5 },
    { name: 'Inès B.', school: 'IFSI Bordeaux', text: "Exactement ce qu'il faut pour réviser en stage. Accessible depuis le téléphone, fiches claires et bien structurées.", stars: 5 },
    { name: 'Lucas T.', school: 'IFSI Marseille', text: "Les cas cliniques sont très proches de ce qui est demandé aux examens. Un vrai plus pour s'entraîner.", stars: 4 },
    { name: 'Manon D.', school: 'IFSI Lille', text: "La génération de fiches par IA à partir de mes cours est bluffante. Un gain de temps énorme.", stars: 5 },
    { name: 'Antoine P.', school: 'IFSI Nantes', text: "Plateforme très complète, bien mieux que de chercher sur des forums. Le suivi des stats est motivant.", stars: 5 },
  ];

  useEffect(() => {
    const id = setInterval(() => setReviewIdx(i => (i + 1) % reviews.length), 4000);
    return () => clearInterval(id);
  }, [reviews.length]);

  const CheckIcon = () => (
    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
  );
  const CrossIcon = () => (
    <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
  );

  const navLinks = [
    { label: 'Fiches', href: '#fiches' },
    { label: 'Exercices', href: '#exercices' },
    { label: 'Flashcards', href: '#flashcards' },
    { label: 'Médicaments', href: '#features' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  const features = [
    {
      title: 'Quiz interactifs',
      desc: "Des centaines de questions sur toutes les UE, avec corrections détaillées et explications pédagogiques.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      badge: null,
    },
    {
      title: 'Flashcards intelligentes',
      desc: "Mémorise les notions clés grâce à la répétition espacée — la méthode scientifiquement prouvée.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="16" height="13" rx="2"/><rect x="6" y="7" width="16" height="13" rx="2"/></svg>,
      badge: null,
    },
    {
      title: 'Fiches de cours',
      desc: "Des résumés clairs et structurés pour chaque module de ta formation IFSI.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
      badge: null,
    },
    {
      title: 'Médicaments',
      desc: "Base de données des médicaments courants en soins infirmiers — posologies, voies d'administration et contre-indications.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>,
      badge: null,
    },
    {
      title: 'Groupes d\'étudiants',
      desc: "Crée ou rejoins des groupes de révision, échange avec ta promo et progressez ensemble avant les examens.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      badge: null,
    },
    {
      title: 'Annales',
      desc: "Entraîne-toi sur les annales des examens IFSI pour te préparer dans les meilleures conditions.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      badge: null,
    },
  ];

  const px = mousePos.x;
  const py = mousePos.y;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── GOOGLE FONT ─────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.75s cubic-bezier(0.16,1,0.3,1); }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .grad-text { background: linear-gradient(135deg,#164e8a,#0891b2); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .card-hover { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 24px 48px -12px rgba(8,145,178,0.2); }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes pulse-ring { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
        @keyframes slide-track { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .floating { animation: float 4s ease-in-out infinite; }
        .review-track { display:flex; gap:24px; animation: slide-track 28s linear infinite; width: max-content; }
        .review-track:hover { animation-play-state: paused; }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
        .gradient-bg { background: linear-gradient(135deg, #f0f9ff, #e0f2fe, #f0fdf4, #eff6ff); background-size: 300% 300%; animation: gradient-shift 8s ease infinite; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-2.5 shadow-lg shadow-blue-100/60 bg-white/96 backdrop-blur-md border-b border-blue-100' : 'py-4 bg-white/90 backdrop-blur-sm'}`}>
        <div className="w-full px-6 md:px-10 flex items-center gap-6">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
            <img src="/logo512.png" alt="NursePrep" className="h-9 w-9 rounded-xl object-cover" />
            <NursesLogo size="sm" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.map(l => (
              <a key={l.label} href={l.href}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-2 ml-auto">
            <Link to="/login" className="px-4 py-2 rounded-xl border border-cyan-400 text-cyan-700 hover:bg-cyan-50 transition text-xs font-semibold">
              Connexion
            </Link>
            <Link to="/register" className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)', boxShadow: '0 4px 14px rgba(8,145,178,0.35)' }}>
              S'inscrire
            </Link>
            {/* Mobile hamburger */}
            <button className="lg:hidden ml-1 p-2 rounded-xl hover:bg-slate-100 transition" onClick={() => setMenuOpen(m => !m)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f172a" strokeWidth="2.5">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-blue-100 px-4 py-4 grid grid-cols-2 gap-2">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 gradient-bg min-h-screen flex items-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0"/>

        {/* Decorative blobs */}
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#0891b2,transparent)', transform: `translate(${px*20}px,${py*20}px)` }}/>
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle,#3b82f6,transparent)', transform: `translate(${px*-15}px,${py*-15}px)` }}/>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left — text */}
          <div className="w-full lg:max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-cyan-200 rounded-full text-xs font-medium text-cyan-700 mb-6 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"/>
              Plateforme officielle IFSI — France
            </div>

            <NursesLogo size="lg" />

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mt-4 mb-4">
              Réussis ton diplôme<br/>
              <span className="grad-text" ref={typedRef}/>
              <span className="text-cyan-500 animate-pulse">|</span>
            </h1>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Quiz, flashcards, fiches de cours et cas cliniques — tout ce dont tu as besoin pour valider ta formation infirmière.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/register"
                className="px-8 py-3.5 text-white rounded-2xl font-semibold hover:-translate-y-1 transition-all text-sm text-center"
                style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)', boxShadow: '0 8px 24px rgba(8,145,178,0.4)' }}>
                Commencer gratuitement
              </Link>
              <a href="#pricing"
                className="px-8 py-3.5 border-2 border-cyan-400 text-cyan-700 rounded-2xl font-semibold hover:bg-cyan-50 hover:-translate-y-1 transition-all text-sm text-center bg-white/70 backdrop-blur-sm">
                Voir les offres
              </a>
            </div>

            <div className="flex items-center gap-6 mt-8 justify-center lg:justify-start">
              {[['2 400+', 'étudiants'], ['87%', 'de réussite'], ['1 200+', 'questions']].map(([v, l]) => (
                <div key={l} className="text-center">
                  <p className="text-lg font-bold grad-text">{v}</p>
                  <p className="text-xs text-slate-400">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating cards */}
          <div className="relative w-full lg:w-auto flex-shrink-0 lg:w-80" style={{ transform: `translate(${px*12}px,${py*8}px)` }}>
            {/* Quiz card */}
            <div className="floating bg-white rounded-2xl border border-blue-100 shadow-2xl shadow-blue-200/50 p-5 w-72 mx-auto">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-cyan-600 font-semibold uppercase tracking-wider">Quiz du jour</p>
                <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">UE 2.11</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
                <div className="h-1.5 rounded-full w-3/5 transition-all" style={{ background: 'linear-gradient(90deg,#164e8a,#0891b2)' }}/>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 mb-2">
                <p className="text-sm font-semibold text-slate-800 mb-3 leading-snug">
                  Dose maximale de paracétamol par jour chez l'adulte ?
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-green-50 border border-green-300 text-green-800 text-xs px-3 py-2 rounded-lg">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    4 g / jour
                  </div>
                  <div className="bg-white border border-slate-100 text-slate-600 text-xs px-3 py-2 rounded-lg">2 g / jour</div>
                  <div className="bg-white border border-slate-100 text-slate-600 text-xs px-3 py-2 rounded-lg">6 g / jour</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 text-right">3 / 5 questions</p>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg border border-blue-100 px-3 py-2 text-xs font-semibold text-cyan-700 hidden lg:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400"/>
              Correction instantanée
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <p className="text-xs text-slate-400">Découvrir</p>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" className="animate-bounce"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </section>

      {/* ── FICHES PREVIEW ──────────────────────────────────────────── */}
      <section id="fiches" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Fiches de révision</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-3">Des vraies fiches, comme en cours</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Définitions, valeurs normales, seuils d'alerte, protocoles — structurés et prêts à réviser.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Fiche 1 : Constantes vitales ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-lg shadow-blue-100/60 border border-blue-100" style={{ transitionDelay: '0s' }}>
              {/* Header */}
              <div className="px-6 py-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1d4ed8, #0891b2)' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
                <div className="absolute -right-1 -bottom-6 w-14 h-14 rounded-full bg-white/5"/>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">UE 4.1 · S1</span>
                    <h3 className="text-base font-black text-white mt-1">Constantes vitales de l'adulte</h3>
                    <p className="text-xs text-blue-200/80 mt-0.5">Valeurs de référence &amp; seuils d'alerte</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="bg-white p-5 space-y-3">
                {/* Tableau valeurs */}
                <div className="rounded-2xl border border-blue-100 overflow-hidden">
                  <div className="grid grid-cols-3 bg-blue-50 px-3 py-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Paramètre</span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">Normal</span>
                    <span className="text-[10px] font-bold text-red-500 uppercase">Alerte</span>
                  </div>
                  {[
                    { p: 'Fréq. cardiaque', n: '60 – 100 bpm', a: '< 50 ou > 120' },
                    { p: 'Fréq. respiratoire', n: '12 – 20 /min', a: '< 10 ou > 25' },
                    { p: 'SpO₂', n: '95 – 100 %', a: '< 94 %' },
                    { p: 'PA systolique', n: '100 – 140 mmHg', a: '< 90 ou > 180' },
                    { p: 'Température', n: '36,5 – 37,5 °C', a: '< 35 ou > 38,5' },
                    { p: 'Diurèse', n: '1 à 2 L / 24 h', a: '< 400 mL / 24 h' },
                    { p: 'Glycémie', n: '0,70 – 1,10 g/L', a: '< 0,60 ou > 2,00' },
                  ].map((r, i) => (
                    <div key={i} className={`grid grid-cols-3 px-3 py-2 border-t border-blue-50 ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50/30'}`}>
                      <span className="text-xs font-semibold text-slate-700">{r.p}</span>
                      <span className="text-xs text-emerald-700 font-medium">{r.n}</span>
                      <span className="text-xs text-red-500 font-medium">{r.a}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <p className="text-xs text-amber-800"><strong>Oligurie</strong> : diurèse &lt; 0,5 mL/kg/h — surveiller la fonction rénale</p>
                </div>
              </div>
            </div>

            {/* ── Fiche 2 : Score de Glasgow ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-lg shadow-violet-100/60 border border-violet-100" style={{ transitionDelay: '0.1s' }}>
              <div className="px-6 py-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6d28d9, #a21caf)' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">UE 2.2 · S1</span>
                    <h3 className="text-base font-black text-white mt-1">Score de Glasgow (GCS)</h3>
                    <p className="text-xs text-violet-200/80 mt-0.5">Évaluation de la conscience — 3 à 15 pts</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 space-y-3">
                {/* E - Yeux */}
                <div className="rounded-2xl border border-violet-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-violet-50 px-4 py-2">
                    <span className="text-xs font-bold text-violet-700">E — Ouverture des yeux</span>
                    <span className="text-[10px] font-bold text-violet-500">/ 4 pts</span>
                  </div>
                  {[['Spontanée','4'],['À la voix','3'],['À la douleur','2'],['Aucune','1']].map(([l,v],i)=>(
                    <div key={i} className="flex justify-between px-4 py-1.5 border-t border-violet-50 text-xs">
                      <span className="text-slate-600">{l}</span>
                      <span className="font-bold text-violet-600 w-5 text-center">{v}</span>
                    </div>
                  ))}
                </div>
                {/* V - Voix */}
                <div className="rounded-2xl border border-fuchsia-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-fuchsia-50 px-4 py-2">
                    <span className="text-xs font-bold text-fuchsia-700">V — Réponse verbale</span>
                    <span className="text-[10px] font-bold text-fuchsia-500">/ 5 pts</span>
                  </div>
                  {[['Orientée','5'],['Confuse','4'],['Mots inappropriés','3'],['Sons incompréhensibles','2'],['Aucune','1']].map(([l,v],i)=>(
                    <div key={i} className="flex justify-between px-4 py-1.5 border-t border-fuchsia-50 text-xs">
                      <span className="text-slate-600">{l}</span>
                      <span className="font-bold text-fuchsia-600 w-5 text-center">{v}</span>
                    </div>
                  ))}
                </div>
                {/* M - Moteur */}
                <div className="rounded-2xl border border-purple-100 overflow-hidden">
                  <div className="flex items-center justify-between bg-purple-50 px-4 py-2">
                    <span className="text-xs font-bold text-purple-700">M — Réponse motrice</span>
                    <span className="text-[10px] font-bold text-purple-500">/ 6 pts</span>
                  </div>
                  {[['Obéit aux ordres','6'],['Localise la douleur','5'],['Retrait (flexion)','4'],['Flexion anormale','3'],['Extension','2'],['Aucune','1']].map(([l,v],i)=>(
                    <div key={i} className="flex justify-between px-4 py-1.5 border-t border-purple-50 text-xs">
                      <span className="text-slate-600">{l}</span>
                      <span className="font-bold text-purple-600 w-5 text-center">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Seuils */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-red-600">≤ 8</p>
                    <p className="text-[10px] font-bold text-red-500 mt-0.5">Coma — intubation</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                    <p className="text-lg font-black text-amber-600">≤ 13</p>
                    <p className="text-[10px] font-bold text-amber-500 mt-0.5">TC grave — urgence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Fiche 3 : Hémostase ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-lg shadow-emerald-100/60 border border-emerald-100" style={{ transitionDelay: '0.2s' }}>
              <div className="px-6 py-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #065f46, #0891b2)' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">UE 2.4 · S1</span>
                    <h3 className="text-base font-black text-white mt-1">Hémostase</h3>
                    <p className="text-xs text-emerald-200/80 mt-0.5">Mécanismes, biologie &amp; traitements</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </div>
                </div>
              </div>
              <div className="bg-white p-5 space-y-3">
                {/* Définition */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-1">Définition</p>
                  <p className="text-xs text-slate-700 leading-relaxed">Ensemble des mécanismes permettant d'arrêter un saignement et de maintenir la perméabilité vasculaire.</p>
                </div>
                {/* 3 phases */}
                <div className="rounded-2xl border border-emerald-100 overflow-hidden">
                  <div className="bg-emerald-50 px-4 py-2">
                    <span className="text-xs font-bold text-emerald-700">Les 3 phases</span>
                  </div>
                  {[
                    { phase: '① Hémostase primaire', desc: 'Vasoconstriction + clou plaquettaire (plaquettes + vWF)', time: '3 – 5 min' },
                    { phase: '② Coagulation', desc: 'Cascade des facteurs → thrombine → fibrine (caillot)', time: '5 – 10 min' },
                    { phase: '③ Fibrinolyse', desc: 'Dissolution du caillot par la plasmine (D-Dimères)', time: 'J2 – J5' },
                  ].map((r, i) => (
                    <div key={i} className="px-4 py-2.5 border-t border-emerald-50">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-emerald-700">{r.phase}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{r.time}</span>
                      </div>
                      <p className="text-xs text-slate-500">{r.desc}</p>
                    </div>
                  ))}
                </div>
                {/* Valeurs bio */}
                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2">
                    <span className="text-xs font-bold text-slate-600">Valeurs biologiques normales</span>
                  </div>
                  {[
                    ['Plaquettes', '150 000 – 400 000 /mm³'],
                    ['TP (Taux de prothrombine)', '70 – 100 %'],
                    ['TCA', '30 – 40 s (ratio < 1,2)'],
                    ['Fibrinogène', '2 – 4 g/L'],
                    ['D-Dimères', '< 500 µg/L'],
                  ].map(([k, v], i) => (
                    <div key={i} className={`flex justify-between px-4 py-2 border-t border-slate-50 text-xs ${i%2===0?'bg-white':'bg-slate-50/50'}`}>
                      <span className="text-slate-600 font-medium">{k}</span>
                      <span className="text-emerald-700 font-bold">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Traitements */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wide mb-1.5">Traitements courants</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Héparine (HBPM)', 'AVK (Warfarine)', 'Aspirine', 'Clopidogrel', 'Vitamine K'].map(t => (
                      <span key={t} className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)', boxShadow: '0 6px 20px rgba(8,145,178,0.35)' }}>
              Accéder à toutes les fiches
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <p className="text-xs text-slate-400 mt-3">+50 fiches disponibles · Hémato, Cardio, Pharma, Pneumo…</p>
          </div>
        </div>
      </section>

      {/* ── EXERCICES PREVIEW ───────────────────────────────────────── */}
      <section id="exercices" className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-14">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Exercices cliniques</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-3">Entraîne-toi sur des cas réels</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Cas cliniques complets, QCM commentés et raisonnement infirmier — comme aux examens IFSI.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Carte 1 : Cas clinique ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-lg shadow-orange-100/60 border border-orange-100 lg:col-span-2" style={{ transitionDelay: '0s' }}>
              {/* Header */}
              <div className="px-6 py-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #c2410c, #ea580c)' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Cas clinique</span>
                    <span className="text-[10px] font-bold text-orange-200 bg-orange-900/40 px-2 py-0.5 rounded-full">Difficile</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-orange-200">
                    <span className="font-semibold">UE 4.4</span>
                    <div className="flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      ~20 min
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 space-y-4">
                {/* Patient info */}
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-2">Situation clinique</p>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    M. Dupont, 67 ans, diabétique de type 2 sous insuline, est retrouvé confus dans sa chambre en service de médecine. Il transpire abondamment, est pâle, et a du mal à répondre aux questions.
                  </p>
                </div>

                {/* Constantes */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Glycémie', val: '0,52 g/L', alert: true },
                    { label: 'FC', val: '108 bpm', alert: true },
                    { label: 'PA', val: '95/60 mmHg', alert: true },
                    { label: 'SpO₂', val: '97 %', alert: false },
                  ].map(({ label, val, alert }) => (
                    <div key={label} className={`rounded-xl p-2.5 text-center border ${alert ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
                      <p className="text-[10px] text-slate-500 mb-0.5">{label}</p>
                      <p className={`text-xs font-black ${alert ? 'text-red-600' : 'text-slate-700'}`}>{val}</p>
                    </div>
                  ))}
                </div>

                {/* Questions */}
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Questions</p>
                  {[
                    'Identifiez le problème de santé principal et argumentez votre réponse.',
                    'Quelles sont les 3 premières actions infirmières à réaliser en urgence ?',
                    'Quel traitement d\'urgence l\'IDE peut-elle administrer sans prescription médicale ?',
                  ].map((q, i) => (
                    <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl px-4 py-3">
                      <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                      <p className="text-xs text-slate-700 leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>

                {/* Corrigé partiel */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide mb-2">Éléments de correction</p>
                  <div className="space-y-1.5">
                    {[
                      { q: 'Problème de santé', r: 'Hypoglycémie sévère (glycémie < 0,60 g/L) avec signes neuroglycopéniques' },
                      { q: 'Actions IDE', r: 'Appel médecin · Resucrage per os si conscient · Surveillance constantes / 15 min' },
                      { q: 'Traitement sans prescription', r: 'Glucosé 15 g per os (3 sucres) si patient capable d\'avaler' },
                    ].map(({ q, r }) => (
                      <div key={q} className="flex items-start gap-2 text-xs">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                        <span className="text-slate-700"><strong className="text-emerald-700">{q} :</strong> {r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link to="/register" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-800 transition">
                    Voir la correction complète
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Carte 2 : QCM ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-lg shadow-purple-100/60 border border-purple-100" style={{ transitionDelay: '0.15s' }}>
              <div className="px-6 py-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #6d28d9, #7c3aed)' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-white/10"/>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-white/80 bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wide">QCM</span>
                    <span className="text-[10px] font-bold text-yellow-200 bg-yellow-700/40 px-2 py-0.5 rounded-full">Moyen</span>
                  </div>
                  <span className="text-xs font-semibold text-purple-200">UE 2.11</span>
                </div>
              </div>

              <div className="bg-white p-5 space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5">
                  <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-1.5">Question</p>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    Concernant la gestion des stupéfiants à l'hôpital, quelle(s) affirmation(s) est/sont exacte(s) ?
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    { text: "Tout infirmier peut prescrire des stupéfiants en urgence", state: 'wrong' },
                    { text: "Les stupéfiants doivent être conservés dans une armoire sécurisée fermée à clé", state: 'correct' },
                    { text: "La traçabilité n'est pas obligatoire en EHPAD", state: 'wrong' },
                    { text: "Chaque administration doit être tracée dans le registre de stupéfiants", state: 'correct' },
                  ].map((opt, i) => (
                    <div key={i} className={`text-xs px-3.5 py-2.5 rounded-xl border flex items-start gap-2.5 ${
                      opt.state === 'correct'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-700 line-through opacity-70'
                    }`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${opt.state === 'correct' ? 'bg-emerald-500' : 'bg-red-400'}`}>
                        {opt.state === 'correct'
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>

                {/* Explication */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide mb-1.5">Explication</p>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Selon l'art. R.5132-34 du CSP, les stupéfiants doivent être conservés sous clé et tracés dans un registre spécial à chaque entrée/sortie. Seul le médecin peut les prescrire.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                  {[['78 %', 'Taux réussite'], ['2 400', 'Tentatives'], ['2,4 min', 'Durée moy.']].map(([v, l]) => (
                    <div key={l} className="text-center">
                      <p className="text-sm font-black text-purple-600">{v}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #c2410c, #ea580c)', boxShadow: '0 6px 20px rgba(234,88,12,0.35)' }}>
              Accéder à tous les exercices
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <p className="text-xs text-slate-400 mt-3">+200 exercices · Cas cliniques, QCM, Mises en situation professionnelle</p>
          </div>
        </div>
      </section>

      {/* ── FLASHCARDS PREVIEW ──────────────────────────────────────── */}
      <section id="flashcards" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-14">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Flashcards</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-3">Mémorise en jouant</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Répétition espacée, flip 3D, decks par UE — le meilleur moyen de retenir les définitions et valeurs clés.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Deck principal : grande carte flip ── */}
            <div className="reveal lg:col-span-2" style={{ transitionDelay: '0s' }}>
              <div className="rounded-3xl overflow-hidden shadow-lg shadow-teal-100/60 border border-teal-100">
                {/* Header deck */}
                <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'linear-gradient(135deg, #0f766e, #0891b2)' }}>
                  <div>
                    <p className="text-[10px] font-bold text-teal-200 uppercase tracking-widest mb-0.5">Deck actif · UE 2.1</p>
                    <p className="text-sm font-black text-white">Biologie fondamentale</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-base font-black text-white">84</p>
                      <p className="text-[10px] text-teal-200">cartes</p>
                    </div>
                    <div className="w-px h-8 bg-white/20"/>
                    <div className="text-center">
                      <p className="text-base font-black text-emerald-300">61 %</p>
                      <p className="text-[10px] text-teal-200">maîtrisées</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6">
                  {/* Barre de progression */}
                  <div className="mb-5">
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
                      <span>Progression du deck</span><span>61 / 84</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: '61%', background: 'linear-gradient(90deg,#0f766e,#0891b2)' }}/>
                    </div>
                    <div className="flex gap-4 mt-2">
                      {[['Maîtrisées','61 %','text-emerald-600'],['À revoir','28 %','text-amber-500'],['Nouvelles','11 %','text-blue-500']].map(([l,v,c])=>(
                        <div key={l} className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold ${c}`}>{v}</span>
                          <span className="text-[10px] text-slate-400">{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2 cartes flip côte à côte */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {[
                      {
                        ue: 'UE 2.1',
                        front: "Définition de l'hémostase primaire",
                        back: "Vasoconstriction réflexe + adhésion et agrégation plaquettaire → formation du clou plaquettaire (thrombus blanc)",
                        extra: "Durée : 3 – 5 min",
                        grad: ['#0f766e','#0891b2'],
                        light: '#f0fdfa',
                        border: '#99f6e4',
                      },
                      {
                        ue: 'UE 2.4',
                        front: "Valeurs normales des plaquettes",
                        back: "150 000 – 400 000 /mm³\n• < 50 000 → risque hémorragique\n• > 450 000 → thrombocytose",
                        extra: "Seuil transfusion : < 10 000",
                        grad: ['#6d28d9','#7c3aed'],
                        light: '#faf5ff',
                        border: '#ddd6fe',
                      },
                    ].map((c, i) => (
                      <div key={i} style={{ perspective: 900, height: 180 }}>
                        <FlipCard
                          front={
                            <div className="w-full h-full rounded-2xl border flex flex-col justify-between p-4 cursor-pointer"
                              style={{ background: c.light, borderColor: c.border }}>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full self-start"
                                style={{ background: c.border, color: c.grad[0] }}>{c.ue}</span>
                              <div>
                                <p className="text-[10px] text-slate-400 mb-1">Question</p>
                                <p className="text-xs font-bold text-slate-800 leading-snug">{c.front}</p>
                              </div>
                              <p className="text-[10px] text-slate-400 text-center">Cliquer pour retourner →</p>
                            </div>
                          }
                          back={
                            <div className="w-full h-full rounded-2xl flex flex-col justify-between p-4 cursor-pointer"
                              style={{ background: `linear-gradient(135deg,${c.grad[0]},${c.grad[1]})` }}>
                              <p className="text-[10px] text-white/60">Réponse</p>
                              <p className="text-xs font-semibold text-white leading-relaxed whitespace-pre-line">{c.back}</p>
                              <p className="text-[10px] text-white/50 border-t border-white/20 pt-1.5 mt-1">{c.extra}</p>
                            </div>
                          }
                        />
                      </div>
                    ))}
                  </div>

                  {/* Catégories de decks */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2.5">Autres decks disponibles</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Pharmacologie UE 2.11', count: 120, color: 'bg-blue-50 text-blue-700 border-blue-200' },
                        { label: 'Anatomie UE 2.3', count: 95, color: 'bg-pink-50 text-pink-700 border-pink-200' },
                        { label: 'Cardiologie UE 2.2', count: 78, color: 'bg-red-50 text-red-700 border-red-200' },
                        { label: 'Législation UE 1.3', count: 45, color: 'bg-amber-50 text-amber-700 border-amber-200' },
                        { label: 'Microbiologie UE 2.10', count: 62, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                      ].map(d => (
                        <div key={d.label} className={`flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1.5 rounded-full border ${d.color}`}>
                          {d.label}
                          <span className="opacity-60">· {d.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Panneau stats + session ── */}
            <div className="reveal flex flex-col gap-4" style={{ transitionDelay: '0.15s' }}>

              {/* Streak */}
              <div className="rounded-3xl overflow-hidden shadow-lg shadow-amber-100/60 border border-amber-100">
                <div className="px-5 py-4 flex items-center gap-4" style={{ background: 'linear-gradient(135deg,#b45309,#d97706)' }}>
                  <div className="text-3xl">🔥</div>
                  <div>
                    <p className="text-2xl font-black text-white">14 jours</p>
                    <p className="text-xs text-amber-200">Série de révision en cours</p>
                  </div>
                </div>
                <div className="bg-white px-5 py-3">
                  <div className="flex justify-between">
                    {['L','M','M','J','V','S','D'].map((j, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i < 6 ? 'bg-amber-400' : 'bg-slate-100'}`}>
                          {i < 6 && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        </div>
                        <p className="text-[10px] text-slate-400">{j}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats du jour */}
              <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-5">
                <p className="text-xs font-bold text-slate-600 mb-3">Statistiques globales</p>
                <div className="space-y-3">
                  {[
                    { label: 'Cartes maîtrisées', val: '347', color: 'text-emerald-600', icon: '✓', bg: 'bg-emerald-50' },
                    { label: 'À réviser aujourd\'hui', val: '23', color: 'text-amber-600', icon: '↻', bg: 'bg-amber-50' },
                    { label: 'Decks disponibles', val: '18', color: 'text-blue-600', icon: '▤', bg: 'bg-blue-50' },
                    { label: 'Temps moyen/session', val: '12 min', color: 'text-purple-600', icon: '⏱', bg: 'bg-purple-50' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center text-xs font-bold ${s.color}`}>{s.icon}</div>
                        <p className="text-xs text-slate-600">{s.label}</p>
                      </div>
                      <p className={`text-sm font-black ${s.color}`}>{s.val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini flashcard flip */}
              <div className="rounded-3xl border border-pink-100 bg-white shadow-sm overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#9d174d,#db2777)' }}>
                  <p className="text-xs font-bold text-white">Carte du jour</p>
                  <span className="text-[10px] font-semibold text-pink-200 bg-pink-800/30 px-2 py-0.5 rounded-full">UE 4.1</span>
                </div>
                <div className="p-4" style={{ perspective: 700, height: 130 }}>
                  <FlipCard
                    front={
                      <div className="w-full h-full rounded-2xl border border-pink-200 bg-pink-50 flex flex-col justify-between p-3 cursor-pointer">
                        <p className="text-[10px] text-pink-400">Question du jour</p>
                        <p className="text-xs font-bold text-pink-800 text-center leading-snug">Définition de la douleur selon l'IASP</p>
                        <p className="text-[10px] text-pink-300 text-center">Cliquer pour voir →</p>
                      </div>
                    }
                    back={
                      <div className="w-full h-full rounded-2xl flex flex-col justify-center p-3 cursor-pointer text-center"
                        style={{ background: 'linear-gradient(135deg,#9d174d,#db2777)' }}>
                        <p className="text-[10px] text-white/60 mb-1">Réponse</p>
                        <p className="text-xs font-semibold text-white leading-relaxed">
                          Expérience sensorielle et émotionnelle désagréable, liée à une lésion tissulaire réelle ou potentielle.
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="text-center mt-10 reveal">
            <Link to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg,#0f766e,#0891b2)', boxShadow: '0 6px 20px rgba(8,145,178,0.35)' }}>
              Commencer à mémoriser
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
            <p className="text-xs text-slate-400 mt-3">+1 000 flashcards · 18 decks classés par UE et semestre</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-14">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Tout en un</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-3">Tout ce qu'il te faut</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto">Des outils pensés pour l'apprentissage infirmier, de la première année jusqu'au diplôme.</p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* ── Quiz ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-blue-100/60 border border-blue-100 bg-white" style={{ transitionDelay: '0s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#1d4ed8,#0891b2)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#dbeafe,#e0f2fe)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">+1 247 questions</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Quiz interactifs</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Des centaines de questions sur toutes les UE, avec corrections détaillées et explications pédagogiques.</p>
                {/* Mini aperçu UE */}
                <div className="space-y-1.5">
                  {[['UE 2.4 — Hémostase', 92], ['UE 2.11 — Pharmacologie', 78], ['UE 4.4 — Soins infirmiers', 65]].map(([ue, pct]) => (
                    <div key={ue}>
                      <div className="flex justify-between text-[10px] text-slate-400 mb-0.5"><span>{ue}</span><span>{pct}%</span></div>
                      <div className="h-1.5 bg-blue-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#1d4ed8,#0891b2)' }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Progression exemple sur 3 UE</p>
              </div>
            </div>

            {/* ── Flashcards ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-teal-100/60 border border-teal-100 bg-white" style={{ transitionDelay: '0.08s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#0f766e,#0891b2)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ccfbf1,#cffafe)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="16" height="13" rx="2"/><rect x="6" y="7" width="16" height="13" rx="2"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full">+1 000 cartes</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Flashcards intelligentes</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Mémorise les notions clés grâce à la répétition espacée — la méthode scientifiquement prouvée.</p>
                {/* Mini carte flip démo */}
                <div className="bg-teal-50 border border-teal-200 rounded-2xl p-3.5 mb-3">
                  <p className="text-[10px] font-bold text-teal-600 mb-1">Exemple · UE 2.1</p>
                  <p className="text-xs font-semibold text-slate-800 mb-2">Qu'est-ce que la thrombopénie ?</p>
                  <div className="bg-white border border-teal-200 rounded-xl px-3 py-2">
                    <p className="text-xs text-teal-800 font-medium">Taux de plaquettes &lt; 150 000 /mm³ — risque hémorragique si &lt; 50 000</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[['18 decks','bg-teal-50 text-teal-700'],['Répétition espacée','bg-cyan-50 text-cyan-700'],['S1 → S6','bg-slate-100 text-slate-600']].map(([t,c])=>(
                    <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c}`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Fiches ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-violet-100/60 border border-violet-100 bg-white" style={{ transitionDelay: '0.16s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#6d28d9,#a21caf)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ede9fe,#fae8ff)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full">+50 fiches</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Fiches de cours</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Des résumés clairs et structurés — définitions, valeurs normales, protocoles et points clés pour chaque module IFSI.</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Hémostase', tags: ['UE 2.4','Valeurs','Protocoles'] },
                    { label: 'Score de Glasgow', tags: ['UE 2.2','Cotation'] },
                    { label: 'Les 5 droits du médicament', tags: ['UE 2.11','Sécurité'] },
                  ].map(f => (
                    <div key={f.label} className="flex items-center justify-between bg-violet-50 rounded-xl px-3 py-2">
                      <p className="text-xs font-semibold text-slate-700">{f.label}</p>
                      <div className="flex gap-1">{f.tags.map(t=><span key={t} className="text-[10px] font-medium text-violet-600 bg-violet-100 px-1.5 py-0.5 rounded-full">{t}</span>)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Médicaments ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-emerald-100/60 border border-emerald-100 bg-white" style={{ transitionDelay: '0.24s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#065f46,#0891b2)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d1fae5,#ccfbf1)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">Base complète</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Médicaments</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Posologies, voies d'administration, contre-indications et interactions — la base de données essentielle en soins infirmiers.</p>
                {/* Mini fiche médicament */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-black text-emerald-800">Paracétamol</p>
                    <span className="text-[10px] font-bold text-white bg-emerald-600 px-1.5 py-0.5 rounded">Antalgique</span>
                  </div>
                  {[['Posologie adulte', '500 mg – 1 g / 6 h'],['Voie', 'PO · IV · Rectale'],['CI principale', 'Insuffisance hépatique']].map(([k,v])=>(
                    <div key={k} className="flex justify-between text-[10px] py-0.5 border-t border-emerald-200/50">
                      <span className="text-slate-500">{k}</span>
                      <span className="font-semibold text-emerald-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Groupes ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-indigo-100/60 border border-indigo-100 bg-white" style={{ transitionDelay: '0.32s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#3730a3,#6d28d9)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#e0e7ff,#ede9fe)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3730a3" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">247 groupes actifs</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Groupes d'étudiants</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Crée ou rejoins un groupe de révision, échange avec ta promo et progressez ensemble avant les examens.</p>
                {/* Mini groupe */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold text-indigo-800">IFSI Lyon · Promo 2025</p>
                    <span className="text-[10px] text-indigo-500">12 membres</span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {['A','B','C','D','E'].map((l,i)=>(
                      <div key={i} className="w-6 h-6 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center -ml-1 first:ml-0 text-[9px] font-bold text-white">{l}</div>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center -ml-1 text-[9px] font-bold text-slate-500">+7</div>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {['UE 2.4','Quiz partagés','Entraide'].map(t=>(
                      <span key={t} className="text-[10px] font-medium text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Annales ── */}
            <div className="reveal card-hover rounded-3xl overflow-hidden shadow-md shadow-amber-100/60 border border-amber-100 bg-white" style={{ transitionDelay: '0.4s' }}>
              <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg,#b45309,#d97706)' }}/>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#fef3c7,#fde68a)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">120 sujets</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1.5">Annales</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">Entraîne-toi sur les annales des examens IFSI — sujets corrigés pour te préparer dans les meilleures conditions.</p>
                <div className="space-y-2">
                  {[
                    { year: 'Session 2024', count: '34 sujets', pct: 90 },
                    { year: 'Session 2023', count: '31 sujets', pct: 75 },
                    { year: 'Session 2022', count: '28 sujets', pct: 55 },
                  ].map(a=>(
                    <div key={a.year} className="flex items-center gap-3">
                      <span className="text-[10px] font-semibold text-slate-600 w-24 flex-shrink-0">{a.year}</span>
                      <div className="flex-1 h-2 bg-amber-50 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width:`${a.pct}%`, background:'linear-gradient(90deg,#b45309,#d97706)' }}/>
                      </div>
                      <span className="text-[10px] text-slate-400 w-14 text-right">{a.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────── */}
      <section className="py-14 md:py-16" style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a,#0891b2)' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { target: 2400, prefix: '+', label: 'Étudiants actifs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
              { target: 87,   suffix: '%', label: 'Taux de réussite', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
              { target: 1200, prefix: '+', label: 'Questions',       icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg> },
            ].map((s, i) => (
              <div key={i} className="reveal text-center" style={{ transitionDelay: `${i*0.15}s` }}>
                <div className="flex justify-center mb-2">{s.icon}</div>
                <div className="text-3xl md:text-4xl font-bold text-white"
                  data-target={s.target} data-prefix={s.prefix || ''} data-suffix={s.suffix || ''}>0</div>
                <div className="text-xs md:text-sm text-blue-200 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-16 md:py-24 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-14">
            <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest">Tarifs</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-3">Choisis ton offre</h2>
            <p className="text-slate-500 text-sm md:text-base">Commence gratuitement, évolue quand tu veux. Sans engagement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">

            {/* ── Starter ── */}
            <div className="reveal card-hover rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm" style={{ transitionDelay: '0s' }}>
              <div className="px-7 pt-7 pb-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full uppercase tracking-wide">Gratuit</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Starter</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black text-slate-900">0</span>
                  <span className="text-2xl font-bold text-slate-900 mb-0.5">€</span>
                  <span className="text-sm text-slate-400 mb-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Pour commencer sans risque</p>
                <div className="space-y-1 mb-6">
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
                  ].map(({ t, ok }) => (
                    <div key={t} className={`flex items-center gap-2.5 py-1.5 text-xs ${ok ? 'text-slate-700' : 'text-slate-300'}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                        {ok
                          ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                          : <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        }
                      </span>
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-7">
                <Link to="/register" className="block w-full py-3 border-2 border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:border-cyan-400 hover:text-cyan-700 transition text-center">
                  Commencer gratuitement
                </Link>
              </div>
            </div>

            {/* ── Étudiant (featured) ── */}
            <div className="reveal relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/30" style={{ transitionDelay: '0.12s', background: 'linear-gradient(160deg,#0f172a 0%,#1e3a6e 50%,#164e8a 100%)' }}>
              {/* Badge populaire */}
              <div className="absolute -top-px left-1/2 -translate-x-1/2">
                <div className="text-white text-[10px] font-black px-5 py-1.5 rounded-b-xl shadow-lg whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
                  ⭐ Le plus populaire
                </div>
              </div>
              <div className="px-7 pt-9 pb-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-full uppercase tracking-wide">Recommandé</span>
                </div>
                <h3 className="text-xl font-black text-white mb-1">Étudiant</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black text-white">9,99</span>
                  <span className="text-2xl font-bold text-white mb-0.5">€</span>
                  <span className="text-sm text-blue-300 mb-1">/ mois</span>
                </div>
                <p className="text-xs text-blue-400 mb-6">L'accès complet à la plateforme</p>
                <div className="space-y-1 mb-6">
                  {[
                    'Quiz illimités',
                    'Flashcards illimitées',
                    'Toutes les fiches de cours',
                    'Exercices & Cas cliniques',
                    'Fiches personnalisées par IA',
                    'Annales complètes',
                    'Base médicaments complète',
                    'Support prioritaire',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5 py-1.5 text-xs text-blue-100">
                      <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 bg-cyan-500/30">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#67e8f9" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-7">
                <Link to="/register"
                  className="block w-full py-3.5 rounded-2xl text-sm font-black text-slate-900 text-center transition hover:opacity-90 shadow-lg shadow-cyan-400/30"
                  style={{ background: 'linear-gradient(135deg,#06b6d4,#0891b2)' }}>
                  Commencer maintenant
                </Link>
                <p className="text-[10px] text-blue-400/70 text-center mt-3">Sans engagement · Résiliation en 1 clic</p>
              </div>
            </div>

            {/* ── Étudiant Pro ── */}
            <div className="reveal card-hover rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm" style={{ transitionDelay: '0.24s' }}>
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg,#0f172a,#164e8a,#0891b2)' }}/>
              <div className="px-7 pt-6 pb-5">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-[10px] font-bold text-white px-2.5 py-1 rounded-full uppercase tracking-wide"
                    style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a)' }}>Étudiant Pro</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Étudiant Pro</h3>
                <div className="flex items-end gap-1.5 mb-1">
                  <span className="text-4xl font-black text-slate-900">14,99</span>
                  <span className="text-2xl font-bold text-slate-900 mb-0.5">€</span>
                  <span className="text-sm text-slate-400 mb-1">/ mois</span>
                </div>
                <p className="text-xs text-slate-400 mb-6">Pour ceux qui visent l'excellence</p>

                {/* Tout Étudiant + extras */}
                <div className="bg-slate-50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <p className="text-xs font-semibold text-slate-600">Tout le plan Étudiant, plus :</p>
                </div>
                <div className="space-y-1 mb-6">
                  {[
                    { t: 'Génération IA illimitée', highlight: true },
                    { t: 'Quiz personnalisés par IA', highlight: true },
                    { t: 'Groupes illimités', highlight: false },
                    { t: 'Statistiques avancées', highlight: false },
                    { t: 'Export PDF des fiches', highlight: false },
                    { t: 'Support dédié 24h', highlight: true },
                  ].map(({ t, highlight }) => (
                    <div key={t} className="flex items-center gap-2.5 py-1.5 text-xs text-slate-700">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${highlight ? 'bg-blue-100' : 'bg-emerald-100'}`}>
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke={highlight ? '#1d4ed8' : '#16a34a'} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                      <span className={highlight ? 'font-semibold text-blue-800' : ''}>{t}</span>
                    </div>
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
            </div>

          </div>

          {/* Garantie */}
          <div className="reveal flex items-center justify-center gap-3 mt-8 text-xs text-slate-400">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Paiement sécurisé par Stripe</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"/>
            <span>Sans engagement · Résiliation immédiate</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"/>
            <span>14 jours satisfait ou remboursé</span>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────── */}
      <section id="reviews" className="py-16 md:py-20 overflow-hidden bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-10">
          <div className="reveal text-center">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Avis étudiants</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-2">Ils ont réussi avec Nurses Prép</h2>
            <div className="flex justify-center items-center gap-2 mt-3">
              <Stars n={5}/>
              <span className="text-sm font-semibold text-slate-700">4,9 / 5</span>
              <span className="text-xs text-slate-400">— 240+ avis</span>
            </div>
          </div>
        </div>

        {/* Infinite scroll carousel */}
        <div className="relative overflow-hidden">
          <div className="review-track py-2">
            {[...reviews, ...reviews].map((r, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex-shrink-0" style={{ width: 280 }}>
                <Stars n={r.stars}/>
                <p className="text-sm text-slate-600 leading-relaxed mt-3 mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.school}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────── */}
      <section id="faq" className="py-16 md:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">FAQ</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: "Puis-je utiliser Nurses Prép gratuitement ?", a: "Oui, l'accès Starter est entièrement gratuit : 20 quiz, 30 flashcards, 1 exercice théorique, 1 cours et 1 fiche de révision par mois. Pour un accès illimité, les abonnements Étudiant (9,99 €/mois) et Étudiant Pro (14,99 €/mois) sont disponibles." },
              { q: "Les contenus sont-ils adaptés à mon IFSI ?", a: "Oui, tous les contenus sont basés sur le référentiel IFSI officiel (arrêté du 31 juillet 2009) et couvrent l'ensemble des unités d'enseignement de la S1 à la S6." },
              { q: "Comment fonctionne la génération de fiches par IA ?", a: "Disponible avec l'abonnement Étudiant Pro, tu colles le texte de ton cours — notre IA génère une fiche de révision structurée en quelques secondes. Tu peux aussi générer des quiz personnalisés à partir de tes propres cours." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement. Tu peux résilier depuis ton espace personnel à n'importe quel moment, sans frais. L'accès reste actif jusqu'à la fin de la période payée." },
              { q: "Comment fonctionnent les groupes d'étudiants ?", a: "Tu peux créer ou rejoindre des groupes de révision avec tes camarades de promo. Partage des ressources, progresse ensemble et suivez vos statistiques collectives." },
            ].map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section id="contact" className="py-16 md:py-20" style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a,#0891b2)' }}>
        <div className="max-w-2xl mx-auto px-4 md:px-8 text-center">
          <NursesLogo size="lg" light />
          <h2 className="text-2xl md:text-3xl font-bold text-white mt-6 mb-4">
            Prête pour tes examens IFSI ?
          </h2>
          <p className="text-blue-200 text-sm mb-8 leading-relaxed">
            Rejoins des milliers d'étudiants qui font confiance à Nurses Prép pour réussir leur diplôme infirmier.
          </p>
          <Link to="/register"
            className="inline-block px-10 py-4 bg-white font-bold rounded-2xl text-sm hover:-translate-y-1 transition-all shadow-2xl"
            style={{ color: '#164e8a' }}>
            Commencer gratuitement — c'est rapide
          </Link>
          <p className="text-blue-300 text-xs mt-4">Sans carte bancaire requise</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-10 mb-10">
            <div className="max-w-xs">
              <NursesLogo size="sm" light />
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                La plateforme de révision conçue pour les étudiants infirmiers IFSI — France.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Contenu</h4>
                {['Fiches', 'Quiz', 'Flashcards', 'Exercices'].map(l => (
                  <a key={l} href="#" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Outils</h4>
                {['Stage', 'Médicaments', 'Calculateurs', 'IA Fiches'].map(l => (
                  <a key={l} href="#" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Offres</h4>
                {['Starter (gratuit)', 'Étudiant', 'Étudiant Pro', 'FAQ'].map((l, i) => (
                  <a key={i} href="#pricing" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Légal</h4>
                {[
                  { label: 'CGU', href: '/cgu' },
                  { label: 'Confidentialité', href: '/confidentialite' },
                  { label: 'Contact', href: 'mailto:contact@nursesprep.fr' },
                ].map(l => (
                  <a key={l.label} href={l.href} className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l.label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between gap-2">
            <p className="text-xs text-slate-600">© 2026 Nurses Prép — Tous droits réservés</p>
            <p className="text-xs text-slate-600">Made with care for IFSI students — France</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

/* ─── FAQ ITEM ───────────────────────────────────────────────────────────── */
function FaqItem({ q, a, delay }) {
  const [open, setOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      className={`reveal${revealed ? ' visible' : ''} bg-white border rounded-2xl overflow-hidden transition-all ${open ? 'border-cyan-300 shadow-sm' : 'border-slate-200'}`}
      style={{ transitionDelay: revealed ? '0s' : `${delay}s` }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-3">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-sm text-slate-500 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
