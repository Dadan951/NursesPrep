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
  return (
    <div
      className="cursor-pointer select-none"
      style={{ perspective: 800, height: 130 }}
      onClick={() => setFlipped(f => !f)}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div style={{
        width: '100%', height: '100%', position: 'relative',
        transformStyle: 'preserve-3d',
        transition: 'transform 0.55s cubic-bezier(.4,0,.2,1)',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
      }}>
        {/* Front */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden' }}
          className={`rounded-2xl border flex flex-col items-center justify-center p-4 ${color.front}`}>
          <p className="text-xs font-semibold text-center leading-snug">{front}</p>
          <p className="text-xs mt-2 opacity-50">Survoler pour voir</p>
        </div>
        {/* Back */}
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          className={`rounded-2xl border flex items-center justify-center p-4 ${color.back}`}>
          <p className="text-xs font-semibold text-center leading-snug">{back}</p>
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
    { label: 'Stage', href: '#features' },
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
      title: 'Aide au stage',
      desc: "Protocoles, fiches pratiques et mémos cliniques pour être opérationnel dès le premier jour de stage.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
      badge: 'Nouveau',
    },
    {
      title: 'Mise en situation',
      desc: "Des cas cliniques complets pour t'entraîner aux épreuves de raisonnement infirmier.",
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
      badge: 'Nouveau',
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
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center gap-6">
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
      <section id="fiches" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Fiches de révision</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-3">Des fiches claires et structurées</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Chaque fiche résume l'essentiel d'un cours avec définitions, points clés, schémas et valeurs à retenir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: "Hémostase", cat: "UE 2.4", color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe',
                sections: [
                  { icon: 'definition', label: "Définition", content: "Ensemble des mécanismes qui arrêtent un saignement et maintiennent l'intégrité vasculaire." },
                  { icon: 'key_points', label: "Points clés", items: ["Hémostase primaire → clou plaquettaire", "Coagulation → fibrine", "Fibrinolyse → dissolution"] },
                  { icon: 'values', label: "Valeurs normales", items: ["Plaquettes : 150 000 – 400 000 /mm³", "TQ : 11 – 13 s", "TCA : 30 – 40 s"] },
                ]
              },
              { title: "Score de Glasgow", cat: "UE 2.2", color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe',
                sections: [
                  { icon: 'definition', label: "Définition", content: "Échelle d'évaluation de la conscience, de 3 (coma) à 15 (conscient)." },
                  { icon: 'schema', label: "Composantes (E+V+M)", steps: ["Yeux (4)", "Voix (5)", "Moteur (6)"] },
                  { icon: 'caution', label: "Seuils critiques", items: ["< 8 → coma → risque fausse route", "≤ 13 → TC grave"] },
                ]
              },
              { title: "Les 5 droits du médicament", cat: "UE 2.11", color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0',
                sections: [
                  { icon: 'remember', label: "Règle des 5 B", content: "Bon médicament · Bonne dose · Bon patient · Bonne voie · Bon moment" },
                  { icon: 'caution', label: "Erreurs fréquentes", items: ["Confusion de noms proches", "Erreur de calcul de dose", "Mauvaise voie d'administration"] },
                ]
              },
            ].map((fiche, idx) => (
              <div key={idx} className="reveal card-hover rounded-2xl overflow-hidden border cursor-pointer" style={{ borderColor: fiche.border, transitionDelay: `${idx*0.1}s` }}>
                <div className="px-5 py-3.5" style={{ backgroundColor: fiche.color }}>
                  <h3 className="text-sm font-bold text-white">{fiche.title}</h3>
                  <p className="text-xs text-white/70">{fiche.cat}</p>
                </div>
                <div className="p-4 space-y-3" style={{ backgroundColor: fiche.bg }}>
                  {fiche.sections.map((s, si) => (
                    <div key={si} className="bg-white rounded-xl p-3 border" style={{ borderColor: fiche.border }}>
                      <p className="text-xs font-bold mb-1.5" style={{ color: fiche.color }}>{s.label}</p>
                      {s.content && <p className="text-xs text-slate-600">{s.content}</p>}
                      {s.items && <ul className="space-y-1">{s.items.map((item,ii) => <li key={ii} className="text-xs text-slate-600 flex items-start gap-1.5"><span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: fiche.color }}/>{item}</li>)}</ul>}
                      {s.steps && <div className="flex flex-wrap gap-1.5">{s.steps.map((step, si2) => <span key={si2} className="text-xs px-2 py-0.5 rounded-lg font-medium" style={{ backgroundColor: fiche.border, color: fiche.color }}>{step}</span>)}</div>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 reveal">
            <Link to="/register" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-cyan-700 border-2 border-cyan-300 hover:bg-cyan-50 transition">
              Accéder à toutes les fiches
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXERCICES PREVIEW ───────────────────────────────────────── */}
      <section id="exercices" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Exercices cliniques</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-3">Entraîne-toi sur des cas réels</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">QCM, questions ouvertes et cas cliniques complets — comme aux examens IFSI.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="reveal card-hover bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">Cas clinique</span>
                <span className="text-xs font-semibold bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">Difficile</span>
                <span className="text-xs text-slate-400 ml-auto">UE 4.4</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-3 leading-snug">
                M. Dupont, 67 ans, diabétique de type 2, présente une glycémie à 0,52 g/L. Il est agité et transpire abondamment.
              </h3>
              <div className="space-y-2 mb-4">
                <p className="text-xs text-slate-500">1. Identifiez le problème de santé présenté.</p>
                <p className="text-xs text-slate-500">2. Décrivez votre conduite à tenir immédiate.</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  ~15 min
                </div>
                <Link to="/register" className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition">
                  Voir la correction →
                </Link>
              </div>
            </div>

            <div className="reveal card-hover bg-white rounded-2xl border border-slate-200 p-6 shadow-sm" style={{ transitionDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">QCM</span>
                <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full">Moyen</span>
                <span className="text-xs text-slate-400 ml-auto">UE 2.11</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-4 leading-snug">
                Concernant la gestion des stupéfiants à l'hôpital, quelle affirmation est exacte ?
              </h3>
              <div className="space-y-2">
                {[
                  { text: "Tout infirmier peut prescrire des stupéfiants en urgence", correct: false },
                  { text: "Les stupéfiants doivent être conservés dans une armoire fermée à clé", correct: true },
                  { text: "La traçabilité n'est pas obligatoire en EHPAD", correct: false },
                ].map((opt, i) => (
                  <div key={i} className={`text-xs px-3 py-2 rounded-lg border flex items-center gap-2 cursor-pointer transition hover:border-blue-300 ${opt.correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-slate-100 text-slate-600'}`}>
                    {opt.correct && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FLASHCARDS PREVIEW ──────────────────────────────────────── */}
      <section id="flashcards" className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Flashcards</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-3">Mémorise en jouant</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Retourne les cartes pour tester ta mémoire. La répétition espacée optimise la rétention.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              {
                front: "Définition de la bradycardie",
                back: "FC < 60 bpm au repos",
                color: { front: 'bg-blue-50 border-blue-200 text-blue-800', back: 'bg-blue-500 border-blue-500 text-white' }
              },
              {
                front: "Valeurs normales de la SpO₂",
                back: "95 % – 100 %\n(< 94 % → O₂ nécessaire)",
                color: { front: 'bg-teal-50 border-teal-200 text-teal-800', back: 'bg-teal-500 border-teal-500 text-white' }
              },
              {
                front: "Qu'est-ce que l'oligurie ?",
                back: "Diurèse < 400 mL/24h\n(ou < 0,5 mL/kg/h)",
                color: { front: 'bg-purple-50 border-purple-200 text-purple-800', back: 'bg-purple-500 border-purple-500 text-white' }
              },
              {
                front: "Définition de la dyspnée",
                back: "Sensation subjective de difficulté respiratoire",
                color: { front: 'bg-pink-50 border-pink-200 text-pink-800', back: 'bg-pink-500 border-pink-500 text-white' }
              },
            ].map((card, i) => (
              <div key={i} className="reveal" style={{ transitionDelay: `${i*0.1}s` }}>
                <FlipCard front={card.front} back={card.back} color={card.color}/>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6 reveal">Survolez une carte pour la retourner</p>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Tout en un</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-3">Tout ce qu'il te faut</h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto">Des outils pensés pour l'apprentissage infirmier, de la première année jusqu'au diplôme.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="reveal card-hover bg-white rounded-2xl border border-slate-100 p-7 cursor-default relative overflow-hidden" style={{ transitionDelay: `${i*0.1}s` }}>
                {f.badge && (
                  <span className="absolute top-4 right-4 text-xs font-bold text-white px-2 py-0.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                    {f.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg,#e0f2fe,#f0f9ff)' }}>
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
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
      <section id="pricing" className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="reveal text-center mb-12">
            <span className="text-xs font-semibold text-cyan-600 uppercase tracking-widest">Tarifs</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 mb-3">Choisis ton offre</h2>
            <p className="text-slate-500 text-sm">Commence gratuitement, évolue quand tu veux. Sans engagement.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="reveal card-hover border border-slate-200 rounded-2xl p-7">
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Gratuit</span>
              <h3 className="text-lg font-bold text-slate-800 mt-4 mb-1">Starter</h3>
              <p className="text-3xl font-bold text-slate-800 mb-5">0 €<span className="text-sm font-normal text-slate-400"> / mois</span></p>
              {['10 quiz / mois', '20 flashcards'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 py-2 border-b border-slate-100"><CheckIcon/>{f}</div>
              ))}
              {['Fiches de cours', 'Cas cliniques', 'Support prioritaire'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-300 py-2 border-b border-slate-100"><CrossIcon/>{f}</div>
              ))}
              <Link to="/register" className="block w-full mt-6 py-2.5 border-2 border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:border-cyan-400 hover:text-cyan-700 transition text-center">
                Commencer
              </Link>
            </div>

            {/* Pro */}
            <div className="reveal relative rounded-2xl p-7 card-hover" style={{ background: 'linear-gradient(145deg,#0f172a,#164e8a)', transitionDelay: '0.15s' }}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg,#0891b2,#164e8a)' }}>
                Le plus populaire
              </div>
              <span className="text-xs font-semibold bg-cyan-500 text-white px-3 py-1 rounded-full">Pro</span>
              <h3 className="text-lg font-bold text-white mt-4 mb-1">Étudiant</h3>
              <p className="text-3xl font-bold text-white mb-5">9,99 €<span className="text-sm font-normal text-blue-300"> / mois</span></p>
              {['Quiz illimités', 'Flashcards illimitées', 'Toutes les fiches de cours', 'Cas cliniques', 'Fiches personnelles IA'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-blue-100 py-2 border-b border-white/10"><CheckIcon/>{f}</div>
              ))}
              <Link to="/register" className="block w-full mt-6 py-2.5 bg-cyan-500 text-white rounded-xl text-sm font-bold hover:bg-cyan-400 transition text-center shadow-lg shadow-cyan-500/30">
                Passer Pro
              </Link>
            </div>

            {/* Elite */}
            <div className="reveal card-hover border border-slate-200 rounded-2xl p-7" style={{ transitionDelay: '0.3s' }}>
              <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a)' }}>Elite</span>
              <h3 className="text-lg font-bold text-slate-800 mt-4 mb-1">Premium</h3>
              <p className="text-3xl font-bold text-slate-800 mb-5">19,99 €<span className="text-sm font-normal text-slate-400"> / mois</span></p>
              {['Quiz illimités', 'Flashcards illimitées', 'Toutes les fiches de cours', 'Cas cliniques', 'Fiches IA illimitées', 'Support prioritaire 24/7'].map((f, i) => (
                <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600 py-2 border-b border-slate-100"><CheckIcon/>{f}</div>
              ))}
              <Link to="/register" className="block w-full mt-6 py-2.5 text-white rounded-xl text-sm font-bold transition text-center"
                style={{ background: 'linear-gradient(135deg,#0f172a,#164e8a)' }}>
                Passer Elite
              </Link>
            </div>
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
              { q: "Puis-je utiliser Nurses Prép gratuitement ?", a: "Oui, l'accès de base est gratuit avec 10 quiz et 20 flashcards par mois. Pour un accès illimité, les abonnements Pro et Elite sont disponibles." },
              { q: "Les contenus sont-ils adaptés à mon IFSI ?", a: "Oui, tous les contenus sont basés sur le référentiel IFSI officiel (arrêté du 31 juillet 2009) et couvrent les 8 unités d'enseignement." },
              { q: "Comment fonctionne la génération de fiches par IA ?", a: "Disponible avec l'abonnement Pro, tu colles ton cours ou importes un PDF — notre IA génère une fiche de révision structurée et colorée en quelques secondes." },
              { q: "Puis-je résilier à tout moment ?", a: "Oui, sans engagement. Tu peux résilier depuis ton espace personnel à n'importe quel moment, sans frais." },
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
                {['Gratuit', 'Pro', 'Elite', 'FAQ'].map(l => (
                  <a key={l} href="#pricing" className="block text-xs text-slate-500 hover:text-white mb-2.5 transition">{l}</a>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4">Légal</h4>
                {[
                  { label: 'CGU', href: '/cgu' },
                  { label: 'RGPD', href: '/rgpd' },
                  { label: 'Mentions légales', href: '/mentions-legales' },
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
