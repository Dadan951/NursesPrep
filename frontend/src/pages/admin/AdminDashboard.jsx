import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth, API_URL } from '../../context/AuthContext';
import { Toaster, toast, ConfirmModal, useIsMobile } from '../../components/admin/adminKit';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     '#EEF2FF',
  card:   '#FFFFFF',
  text:   '#1e1b4b',
  border: '#e0e7ff',
  indigo: '#4F46E5',
  violet: '#7C3AED',
  sub:    '#64748b',
};
const clay = {
  card: '0 2px 0 #c7d2fe, 0 4px 24px rgba(99,102,241,0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 #c7d2fe, 0 2px 8px rgba(99,102,241,0.10)',
  btn:  (hex, dark) => `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`,
};

/* ─── Animated counter ───────────────────────────────────────────────────── */
function useCounter(target, delay = 0) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t = setTimeout(() => {
      let cur = 0;
      const step = target / 55;
      const id = setInterval(() => {
        cur = Math.min(cur + step, target);
        setVal(Math.round(cur));
        if (cur >= target) clearInterval(id);
      }, 18);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t);
  }, [target, delay]);
  return val;
}

/* ─── 3D Tilt card ───────────────────────────────────────────────────────── */
function TiltCard({ children, style }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [6, -6]);
  const ry = useTransform(mx, [-0.5, 0.5], [-6, 6]);
  const sx = useSpring(rx, { stiffness:300, damping:22 });
  const sy = useSpring(ry, { stiffness:300, damping:22 });

  const onMove  = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX-r.left)/r.width-0.5); my.set((e.clientY-r.top)/r.height-0.5); };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <div style={{ perspective:900 }}>
      <motion.div style={{ rotateX:sx, rotateY:sy, ...style }} onMouseMove={onMove} onMouseLeave={onLeave}>
        {children}
      </motion.div>
    </div>
  );
}

/* ─── SubBar ─────────────────────────────────────────────────────────────── */
function SubBar({ label, value, total, from, to, delay }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:`linear-gradient(135deg,${from},${to})`, display:'block', flexShrink:0 }}/>
          <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{label}</span>
        </div>
        <span style={{ fontSize:11, color:C.sub }}>{value} <span style={{ color:C.border }}>·</span> {pct}%</span>
      </div>
      <div style={{ height:8, background:C.bg, borderRadius:8, overflow:'hidden' }}>
        <motion.div
          style={{ height:8, borderRadius:8, background:`linear-gradient(90deg,${from},${to})` }}
          initial={{ width:0 }}
          animate={{ width:`${pct}%` }}
          transition={{ duration:1.4, ease:[0.16,1,0.3,1], delay }}
        />
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function Skel({ h = 112 }) {
  return <div style={{ height:h, borderRadius:20, background:C.border, animation:'pulse 1.5s ease-in-out infinite' }}/>;
}

/* ─── Section card ───────────────────────────────────────────────────────── */
function SCard({ children, title, badge, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, padding:'20px 22px' }}>
      {(title || badge) && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
          {title && <h2 style={{ fontSize:13, fontWeight:700, color:C.text }}>{title}</h2>}
          {badge && <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, background:C.bg, color:C.sub, border:`1px solid ${C.border}` }}>{badge}</span>}
        </div>
      )}
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   ADMIN DASHBOARD
   ════════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile(1024);

  useEffect(() => {
    axios.get(`${API_URL}/admin/stats`)
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  const cntUsers   = useCounter(stats?.totalUsers    || 0, 80);
  const cntActive  = useCounter(stats?.activeUsers   || 0, 160);
  const cntQuizzes = useCounter(stats?.totalQuizzes  || 0, 240);
  const cntFlash   = useCounter(stats?.totalFlashcards || 0, 320);

  const totalSubs = (stats?.freeUsers||0) + (stats?.proUsers||0) + (stats?.premiumUsers||0) || 1;
  const engRate   = stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;

  const statCards = [
    { label:'Utilisateurs', val:cntUsers,   sub:'inscrits',  from:'#4F46E5', to:'#7C3AED', dark:'#3730a3',
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { label:'Actifs 7j',    val:cntActive,  sub:stats?.totalUsers ? `${Math.round((stats.activeUsers/stats.totalUsers)*100)}% du total` : '—',
      from:'#0891b2', to:'#4F46E5', dark:'#0e7490',
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { label:'Quiz',         val:cntQuizzes, sub:'disponibles', from:'#059669', to:'#0891b2', dark:'#047857',
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { label:'Flashcards',   val:cntFlash,   sub:'au total',   from:'#7C3AED', to:'#EC4899', dark:'#6d28d9',
      icon:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg> },
  ];

  const quickLinks = [
    { to:'/admin/users',      label:'Utilisateurs', desc:stats?`${stats.totalUsers} comptes`:'—',         from:'#4F46E5', to2:'#7C3AED', dark:'#3730a3',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { to:'/admin/quizzes',    label:'Quiz',          desc:stats?`${stats.totalQuizzes} questions`:'—',    from:'#0891b2', to2:'#4F46E5', dark:'#0e7490',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
    { to:'/admin/flashcards', label:'Flashcards',    desc:stats?`${stats.totalFlashcards} cartes`:'—',   from:'#7C3AED', to2:'#EC4899', dark:'#6d28d9',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg> },
    { to:'/admin/exercises',  label:'Exercices',     desc:stats?`${stats.totalExercises||0} exercices`:'—', from:'#059669', to2:'#0891b2', dark:'#047857',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
    { to:'/admin/lessons',    label:'Cours & Fiches', desc:'Contenu pédagogique', from:'#EC4899', to2:'#f43f5e', dark:'#be123c',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
    { to:'/admin/tickets',    label:'Support',        desc:"Tickets & Messages", from:'#ea580c', to2:'#d97706', dark:'#9a3412',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
    { to:'/admin/logs',       label:'Activité',       desc:'Journal de connexions', from:'#be185d', to2:'#9333ea', dark:'#86198f',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { to:'/admin/medicaments',label:'Médicaments',    desc:'Base médicamenteuse', from:'#0f766e', to2:'#0891b2', dark:'#134e4a',
      icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2v-4M9 21H5a2 2 0 0 1-2-2v-4m0 0h18"/></svg> },
  ];

  const contentItems = [
    { label:'Quiz',       value:stats?.totalQuizzes   ||0, from:'#4F46E5', to:'#7C3AED', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg> },
    { label:'Flashcards', value:stats?.totalFlashcards||0, from:'#7C3AED', to:'#EC4899', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg> },
    { label:'Exercices',  value:stats?.totalExercises ||0, from:'#059669', to:'#0891b2', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
    { label:'Cours',      value:stats?.totalLessons   ||0, from:'#EC4899', to:'#f43f5e', icon:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  ];

  return (
    <DashboardLayout isAdmin>
      <style>{`
        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes drift1  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-20px,15px) scale(1.06)} 66%{transform:translate(15px,-20px) scale(0.96)} }
        @keyframes drift2  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(18px,-14px) scale(1.05)} }
      `}</style>

      <Toaster />
      <div style={{ flex:1, overflowY:'auto', background:'var(--theme-bg)', position:'relative' }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden' }}>
          {/* Orbs */}
          <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,#6366f1,transparent)', opacity:0.2, filter:'blur(50px)', animation:'drift1 18s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:80, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,#EC4899,transparent)', opacity:0.15, filter:'blur(40px)', animation:'drift2 22s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.04) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          {/* Shine */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 75% 15%,rgba(255,255,255,0.12),transparent 50%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>

            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:'3px 12px', borderRadius:20, background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.85)', border:'1.5px solid rgba(255,255,255,0.25)', backdropFilter:'blur(6px)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
                    Administration
                  </span>
                </div>
                <h1 className="nunito" style={{ fontSize:30, fontWeight:900, color:'#fff', lineHeight:1.1, marginBottom:4 }}>Tableau de bord</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' })} · NursesPrep
                </p>
              </div>

              {/* Status badge */}
              <motion.div initial={{ scale:0, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay:0.3, type:'spring', stiffness:280 }}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:16, background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.2)', backdropFilter:'blur(8px)' }}>
                <span style={{ width:8, height:8, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 8px #4ade80', animation:'blink 2s ease-in-out infinite', display:'block' }}/>
                <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>Système actif</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:'24px 16px' }}>

          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:14, marginBottom:20 }}>
            {loading ? [...Array(4)].map((_,i) => <Skel key={i} h={110}/>) : statCards.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:20, scale:0.96 }} animate={{ opacity:1, y:0, scale:1 }}
                transition={{ delay:0.08+i*0.07, duration:0.5, ease:[0.16,1,0.3,1] }}>
                <TiltCard style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, padding:'20px', height:'100%' }}>
                  <div style={{ width:42, height:42, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, flexShrink:0,
                    background:`linear-gradient(135deg,${s.from},${s.to})`, boxShadow:`0 4px 0 ${s.dark}, 0 8px 16px ${s.from}40` }}>
                    <span style={{ color:'#fff' }}>{s.icon}</span>
                  </div>
                  <p style={{ fontSize:28, fontWeight:900, color:C.text, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{s.val}</p>
                  <p style={{ fontSize:12, fontWeight:700, color:s.from, marginTop:4 }}>{s.label}</p>
                  {s.sub && <p style={{ fontSize:10, color:C.sub, marginTop:2 }}>{s.sub}</p>}
                </TiltCard>
              </motion.div>
            ))}
          </div>

          {/* Main 2-col grid — 1 colonne sur mobile */}
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap:16, alignItems:'start' }}>

            {/* Left column */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Subscription distribution */}
              <SCard title="Répartition des abonnements" badge={`${stats?.totalUsers||0} utilisateurs`} delay={0.2}>
                {loading ? (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>{[...Array(3)].map((_,i) => <Skel key={i} h={28}/>)}</div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                    <SubBar label="Gratuit" value={stats?.freeUsers||0}    total={totalSubs} from="#94a3b8" to="#64748b" delay={0.4}/>
                    <SubBar label="Pro"     value={stats?.proUsers||0}     total={totalSubs} from={C.indigo} to={C.violet} delay={0.55}/>
                    <SubBar label="Élite"   value={stats?.premiumUsers||0} total={totalSubs} from="#f59e0b" to="#ea580c" delay={0.7}/>
                  </div>
                )}
                <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <div>
                    <p style={{ fontSize:11, color:C.sub }}>MRR (revenu mensuel récurrent)</p>
                    <p style={{ fontSize:22, fontWeight:900, color:C.text, fontVariantNumeric:'tabular-nums', marginTop:2 }}>
                      {loading ? '—' : `${(stats?.mrr||0).toFixed(0)} €`}
                    </p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ fontSize:11, color:C.sub }}>Taux d'engagement</p>
                    <p style={{ fontSize:22, fontWeight:900, marginTop:2, background:`linear-gradient(135deg,${C.indigo},${C.violet})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                      {loading ? '—' : `${engRate}%`}
                    </p>
                  </div>
                </div>
              </SCard>

              {/* Activité abonnements (30 derniers jours) */}
              <SCard title="Abonnements — 30 derniers jours" badge={`Churn ≈ ${loading ? '—' : stats?.churnRate30d}%`} delay={0.25}>
                {loading ? (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>{[...Array(4)].map((_,i) => <Skel key={i} h={56}/>)}</div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                    {[
                      { l:'Nouveaux', v:stats?.newSubs30d||0, c:'#10b981' },
                      { l:'Upgrades', v:stats?.upgrades30d||0, c:C.indigo },
                      { l:'Downgrades', v:stats?.downgrades30d||0, c:'#f59e0b' },
                      { l:'Annulés', v:stats?.canceled30d||0, c:'#ef4444' },
                    ].map((s, i) => (
                      <div key={i} style={{ textAlign:'center', padding:'12px 6px', borderRadius:14, background:C.bg, border:`1.5px solid ${C.border}` }}>
                        <p style={{ fontSize:20, fontWeight:900, color:s.c, fontVariantNumeric:'tabular-nums' }}>{s.v}</p>
                        <p style={{ fontSize:10, color:C.sub, marginTop:2 }}>{s.l}</p>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between' }}>
                  <div>
                    <p style={{ fontSize:11, color:C.sub }}>ARPU</p>
                    <p style={{ fontSize:15, fontWeight:800, color:C.text, marginTop:2 }}>{loading ? '—' : `${(stats?.arpu||0).toFixed(2)} €`}</p>
                  </div>
                  <p style={{ fontSize:10, color:C.sub, maxWidth:200, textAlign:'right', lineHeight:1.5, alignSelf:'flex-end' }}>
                    Le churn est approximatif tant que peu d'historique est disponible.
                  </p>
                </div>
              </SCard>

              {/* Content overview */}
              <SCard title="Contenu de la plateforme" delay={0.3}>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(110px,1fr))', gap:10 }}>
                  {contentItems.map((c, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay:0.35+i*0.07 }}
                      style={{ background:C.bg, borderRadius:16, padding:'16px 10px', textAlign:'center', border:`1.5px solid ${C.border}` }}>
                      <div style={{ width:34, height:34, borderRadius:12, background:`linear-gradient(135deg,${c.from},${c.to})`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px',
                        boxShadow:`0 3px 0 ${c.from}90, 0 6px 12px ${c.from}30` }}>
                        {c.icon}
                      </div>
                      <p style={{ fontSize:22, fontWeight:900, color:C.text, fontVariantNumeric:'tabular-nums' }}>
                        {loading ? '—' : c.value}
                      </p>
                      <p style={{ fontSize:10, color:C.sub, fontWeight:600, marginTop:3 }}>{c.label}</p>
                    </motion.div>
                  ))}
                </div>
              </SCard>

              {/* Activity chart */}
              <SCard title="Activité plateforme" badge="7 derniers jours" delay={0.4}>
                <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:80 }}>
                  {['L','M','M','J','V','S','D'].map((day, i) => {
                    const heights = [60,85,45,95,70,50,30];
                    const isToday = i === (new Date().getDay()||7) - 1;
                    return (
                      <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                        <motion.div
                          style={{ width:'100%', borderRadius:8, overflow:'hidden' }}
                          initial={{ height:0 }} animate={{ height:`${heights[i]}%` }}
                          transition={{ delay:0.55+i*0.06, duration:0.5, ease:[0.16,1,0.3,1] }}>
                          <div style={{ width:'100%', height:'100%', borderRadius:8,
                            background: isToday ? `linear-gradient(180deg,${C.violet},${C.indigo})` : C.border,
                            opacity: isToday ? 1 : 0.7 }}/>
                        </motion.div>
                        <span style={{ fontSize:10, fontWeight:isToday?700:500, color:isToday?C.indigo:C.sub }}>{day}</span>
                      </div>
                    );
                  })}
                </div>
              </SCard>

              {/* SeedPanel */}
              <SeedPanel/>
            </div>

            {/* Right column */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>

              {/* Quick links */}
              <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.25, duration:0.5, ease:[0.16,1,0.3,1] }}>
                <p style={{ fontSize:9, fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--theme-primary)', opacity:0.6, marginBottom:10 }}>Gestion rapide</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  {quickLinks.map((l, i) => (
                    <motion.div key={i}
                      initial={{ opacity:0, y:16, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                      transition={{ delay:0.3+i*0.06, duration:0.4, ease:[0.16,1,0.3,1] }}>
                      <TiltCard>
                        <Link to={l.to} style={{ textDecoration:'none', display:'block' }}>
                          <motion.div
                            whileHover={{ y:-4, boxShadow:`0 4px 0 ${l.dark}, 0 12px 28px ${l.from}50` }}
                            whileTap={{ scale:0.96 }}
                            transition={{ type:'spring', stiffness:380, damping:22 }}
                            style={{ borderRadius:16, padding:'14px 12px', cursor:'pointer',
                              background:`linear-gradient(135deg,${l.from},${l.to2})`,
                              boxShadow:`0 4px 0 ${l.dark}, 0 8px 20px ${l.from}40` }}>
                            <div style={{ width:34, height:34, borderRadius:11, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                              {l.icon}
                            </div>
                            <p style={{ fontSize:11, fontWeight:800, color:'#fff', lineHeight:1.3 }}>{l.label}</p>
                            <p style={{ fontSize:9, color:'rgba(255,255,255,0.6)', marginTop:2 }}>{l.desc}</p>
                          </motion.div>
                        </Link>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Platform health */}
              <SCard title="État de la plateforme" delay={0.5}>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    { label:'API Backend',     ok:true },
                    { label:'Base de données', ok:true },
                    { label:'Stockage',        ok:true },
                  ].map((s, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', borderRadius:12, background:C.bg, border:`1px solid ${C.border}` }}>
                      <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{s.label}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background:s.ok?'#4ade80':'#f87171', display:'block', boxShadow:s.ok?'0 0 6px #4ade80':'0 0 6px #f87171' }}/>
                        <span style={{ fontSize:10, fontWeight:700, color:s.ok?'#16a34a':'#dc2626' }}>
                          {s.ok?'Opérationnel':'Erreur'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </SCard>

              {/* Subscription summary dark */}
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
                style={{ borderRadius:20, padding:'20px', position:'relative', overflow:'hidden',
                  background:'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)',
                  boxShadow:`0 4px 0 #1e1b4b, 0 8px 32px rgba(67,56,202,0.4)` }}>
                <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'radial-gradient(circle,#a5b4fc,transparent)', opacity:0.25, filter:'blur(16px)' }}/>
                <p style={{ fontSize:11, color:'#a5b4fc', fontWeight:600, marginBottom:14, position:'relative' }}>Résumé abonnements</p>
                <div style={{ display:'flex', flexDirection:'column', gap:8, position:'relative' }}>
                  {[
                    { label:'Gratuit', v:stats?.freeUsers   ||0, color:'#94a3b8' },
                    { label:'Pro',     v:stats?.proUsers    ||0, color:'#a5b4fc' },
                    { label:'Élite',   v:stats?.premiumUsers||0, color:'#fbbf24' },
                  ].map((s, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:12, fontWeight:600, color:s.color }}>{s.label}</span>
                      <span style={{ fontSize:15, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums' }}>
                        {loading?'—':s.v}
                      </span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', justifyContent:'space-between', position:'relative' }}>
                  <span style={{ fontSize:12, color:'#a5b4fc' }}>Total</span>
                  <span style={{ fontSize:15, fontWeight:900, color:'#fff', fontVariantNumeric:'tabular-nums' }}>
                    {loading?'—':stats?.totalUsers||0}
                  </span>
                </div>
              </motion.div>

              {/* Push panel */}
              <PushPanel/>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

/* ─── Seeds Panel ────────────────────────────────────────────────────────────── */
const SEEDS = [
  {
    id:'annales-zip', label:'Annales — Import ZIP complet',
    desc:'1A 2018→2026 · 2A 2018-2019 · Paris Cité, UPEC, Sorbonne…', count:'~21 annales PDF',
    endpoint:'/admin/seed-annales-zip', from:'#d97706', to:'#f59e0b', zipField:'zip',
    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    id:'ifsi-zip', label:'Drive IFSI 💊 — Import ZIP (S1→S6)',
    desc:'Tous semestres · Structure semestre/UE · multi-fichiers', count:'~590 PDFs détectés',
    endpoint:'/admin/seed-ifsi-zip', from:'#059669', to:'#10b981', zipField:'zips', multipleZip:true,
    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  },
  {
    id:'gen-content', label:'Générer Quiz + Flashcards (IA)',
    desc:'Depuis les cours déjà importés · Anthropic Haiku', count:'8 QCM + 12 flashcards / cours',
    endpoint:'/admin/generate-content-lessons', from:'#7c3aed', to:'#a855f7', aiMode:true,
    icon:<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 6v6l4 2"/><circle cx="18" cy="6" r="3" fill="white" stroke="none"/></svg>,
  },
];

function InventoryPanel({ token }) {
  const [data, setData]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen]   = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API_URL}/admin/lessons-inventory`, { headers:{ Authorization:`Bearer ${token}` } });
      setData(r.data); setOpen(true);
    } catch (e) { toast.error(e.response?.data?.error || e.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ borderRadius:12, border:`1px solid ${C.border}`, overflow:'hidden', background:C.bg }}>
      <button onClick={open ? () => setOpen(false) : load}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 12px', fontSize:10, fontWeight:600, color:C.text, background:'transparent', border:'none', cursor:'pointer' }}>
        <span>🗂 Voir les cours en base (semestre / UE)</span>
        <span>{loading?'…':open?'▲':'▼'}</span>
      </button>
      {open && data && (
        <div style={{ padding:'0 12px 12px', maxHeight:280, overflowY:'auto' }}>
          <p style={{ fontSize:9, color:C.sub }}>{data.total} cours au total</p>
          {Object.entries(data.grouped).sort().map(([sem, ues]) => (
            <div key={sem}>
              <p style={{ fontSize:10, fontWeight:900, color:C.text, marginTop:8 }}>{sem}</p>
              {Object.entries(ues).sort().map(([ue, titles]) => (
                <div key={ue} style={{ marginLeft:8, marginBottom:4 }}>
                  <p style={{ fontSize:9, fontWeight:700, color:C.indigo }}>{ue} <span style={{ color:C.sub, fontWeight:400 }}>({titles.length} cours)</span></p>
                  {titles.map((t, i) => <p key={i} style={{ fontSize:9, color:C.sub, marginLeft:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>· {t}</p>)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SeedPanel() {
  const [results,  setResults]  = useState({});
  const [loading,  setLoading]  = useState({});
  const [zipFiles, setZipFiles] = useState({});
  const [aiCount,  setAiCount]  = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const { token } = useAuth();

  const handleResetGenerated = async () => {
    setResetLoading(true);
    try {
      const r = await axios.delete(`${API_URL}/admin/generated-content`, { headers:{ Authorization:`Bearer ${token}` } });
      toast.success(r.data.message);
      setAiCount(c => c ? { ...c, quizDone:0, flashDone:0 } : c);
      setConfirmReset(false);
    } catch (e) { toast.error(e.response?.data?.error || e.message); }
    finally { setResetLoading(false); }
  };

  useEffect(() => {
    axios.get(`${API_URL}/admin/generate-content-lessons/count`, { headers:{ Authorization:`Bearer ${token}` } })
      .then(r => setAiCount(r.data)).catch(() => {});
  }, [token]);

  const runSeed = async (seed, aiMode = null, isTest = false) => {
    setLoading(l => ({ ...l, [seed.id]:true }));
    setResults(r => ({ ...r, [seed.id]:null }));
    try {
      let res;
      if (seed.zipField) {
        const file = zipFiles[seed.id];
        if (!file && !seed.multipleZip) { setResults(r => ({ ...r, [seed.id]:{ ok:false, msg:"Sélectionne d'abord le fichier ZIP" } })); setLoading(l => ({ ...l, [seed.id]:false })); return; }
        if (seed.multipleZip && (!file || (Array.isArray(file) && file.length===0))) { setResults(r => ({ ...r, [seed.id]:{ ok:false, msg:'Sélectionne au moins un fichier ZIP' } })); setLoading(l => ({ ...l, [seed.id]:false })); return; }
        const fd = new FormData();
        if (seed.multipleZip) { const files = Array.isArray(file)?file:[file]; files.forEach(f => fd.append(seed.zipField, f)); }
        else { fd.append(seed.zipField, file); }
        res = await axios.post(`${API_URL}${seed.endpoint}`, fd, { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'multipart/form-data' }, timeout:600000 });
      } else if (seed.aiMode) {
        const params = new URLSearchParams();
        if (aiMode) params.set('mode', aiMode);
        if (isTest) params.set('test', 'true');
        res = await axios.post(`${API_URL}${seed.endpoint}?${params}`, {}, { headers:{ Authorization:`Bearer ${token}` }, timeout:600000 });
      } else {
        res = await axios.post(`${API_URL}${seed.endpoint}`, {}, { headers:{ Authorization:`Bearer ${token}` } });
      }
      setResults(r => ({ ...r, [seed.id]:{ ok:true, msg:res.data.message } }));
    } catch (err) {
      setResults(r => ({ ...r, [seed.id]:{ ok:false, msg:err.response?.data?.message || err.message || 'Erreur' } }));
    } finally {
      setLoading(l => ({ ...l, [seed.id]:false }));
    }
  };

  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
      style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, padding:'20px 22px', display:'flex', flexDirection:'column', gap:12 }}>

      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
        <div style={{ width:28, height:28, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#c2410c,#ea580c)', flexShrink:0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
        </div>
        <div>
          <p style={{ fontSize:13, fontWeight:700, color:C.text }}>Insérer du contenu</p>
          <p style={{ fontSize:10, color:C.sub }}>Lance l'insertion de contenu pédagogique en base.</p>
        </div>
      </div>

      {/* Fix UE labels */}
      <button
        onClick={async () => {
          try { const r = await axios.post(`${API_URL}/admin/fix-ue-labels`, {}, { headers:{ Authorization:`Bearer ${token}` } }); toast.success(r.data.message); }
          catch (e) { toast.error(e.response?.data?.error || e.message); }
        }}
        style={{ width:'100%', padding:'8px', borderRadius:12, fontSize:10, fontWeight:600, color:'#059669', border:`1.5px solid #bbf7d0`, background:'#f0fdf4', cursor:'pointer' }}>
        🔧 Corriger les labels UE (migration)
      </button>

      {/* Inventory */}
      <InventoryPanel token={token}/>

      {/* Seeds */}
      {SEEDS.map(seed => (
        <div key={seed.id} style={{ borderRadius:14, border:`1.5px solid ${C.border}`, overflow:'hidden', background:C.bg }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px' }}>
            <div style={{ width:32, height:32, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:`linear-gradient(135deg,${seed.from},${seed.to})`, boxShadow:`0 2px 0 ${seed.from}` }}>
              {seed.icon}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <p style={{ fontSize:11, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{seed.label}</p>
              <p style={{ fontSize:9, color:C.sub }}>{seed.desc} · {seed.count}</p>
            </div>
            {seed.aiMode ? (
              <button onClick={() => runSeed(seed, 'both', true)} disabled={loading[seed.id]}
                style={{ fontSize:9, fontWeight:700, padding:'5px 10px', borderRadius:8, color:C.violet, border:`1.5px solid ${C.violet}`, background:'#fff', cursor:'pointer', flexShrink:0 }}>
                {loading[seed.id]?'…':'🧪 Test'}
              </button>
            ) : (
              <button onClick={() => runSeed(seed)} disabled={loading[seed.id]}
                style={{ display:'flex', alignItems:'center', gap:4, fontSize:9, fontWeight:700, padding:'5px 10px', borderRadius:8, color:'#fff', background:`linear-gradient(135deg,${seed.from},${seed.to})`, border:'none', cursor:'pointer', flexShrink:0, opacity:loading[seed.id]?0.7:1 }}>
                {loading[seed.id] ? <span style={{ width:10, height:10, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }}/> : null}
                {loading[seed.id]?'Import…':'Insérer'}
              </button>
            )}
          </div>

          {seed.aiMode && (
            <div style={{ padding:'0 12px 12px', display:'flex', flexDirection:'column', gap:8 }}>
              {aiCount && (() => {
                const n = aiCount.total;
                return (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
                    {[
                      { val:`${n}–${n*6}`, label:'quiz estimés',   bg:'#f5f3ff', color:C.violet },
                      { val:`${n*8}–${n*6*20}`, label:'questions', bg:`${C.bg}`, color:C.indigo },
                      { val:`${n*12}`, label:'flashcards',          bg:'#eff6ff', color:'#2563eb' },
                    ].map((x, i) => (
                      <div key={i} style={{ background:x.bg, borderRadius:10, padding:'8px 4px', textAlign:'center', border:`1px solid ${C.border}` }}>
                        <p style={{ fontSize:10, fontWeight:900, color:x.color }}>{x.val}</p>
                        <p style={{ fontSize:8, color:C.sub }}>{x.label}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:6 }}>
                {[['quiz','🎯 Quiz'],['flashcards','🃏 Flash'],['both','⚡ Les deux']].map(([mode, label]) => (
                  <button key={mode} onClick={() => runSeed(seed, mode, false)} disabled={loading[seed.id]}
                    style={{ padding:'7px 4px', borderRadius:10, fontSize:9, fontWeight:700, color:'#fff', border:'none', cursor:'pointer',
                      background:`linear-gradient(135deg,${seed.from},${seed.to})`, opacity:loading[seed.id]?0.6:1 }}>
                    {loading[seed.id] ? <span style={{ display:'inline-block', width:10, height:10, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> : label}
                  </button>
                ))}
              </div>
              {aiCount && (
                <p style={{ fontSize:9, color:C.sub, textAlign:'center' }}>
                  Quiz : ~{Math.ceil(aiCount.total*3/60)} min · Flash : ~{Math.ceil(aiCount.total*2/60)} min · Les deux : ~{Math.ceil(aiCount.total*5/60)} min
                </p>
              )}
              <button
                onClick={() => setConfirmReset(true)}
                style={{ width:'100%', padding:'6px', borderRadius:10, fontSize:9, fontWeight:600, color:'#f87171', border:'1px solid #fecaca', background:'#fff', cursor:'pointer' }}>
                🗑 Réinitialiser (supprimer quiz + flashcards générés)
              </button>
            </div>
          )}

          {seed.zipField && (
            <div style={{ padding:'0 12px 10px' }}>
              <label style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:10, border:`2px dashed ${zipFiles[seed.id]?'#4ade80':C.border}`, cursor:'pointer', fontSize:9, fontWeight:600,
                background: zipFiles[seed.id]?'#f0fdf4':C.bg, color: zipFiles[seed.id]?'#16a34a':C.sub }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                {zipFiles[seed.id]
                  ? seed.multipleZip ? `${Array.isArray(zipFiles[seed.id])?zipFiles[seed.id].length:1} fichier(s)`
                    : `${zipFiles[seed.id].name} (${(zipFiles[seed.id].size/1024/1024).toFixed(0)} MB)`
                  : seed.multipleZip ? 'Sélectionne les ZIP (multi)' : 'Glisse ou clique pour le ZIP (≤300 MB)'}
                <input type="file" accept=".zip" style={{ display:'none' }} multiple={!!seed.multipleZip}
                  onChange={e => { const files = Array.from(e.target.files); setZipFiles(z => ({ ...z, [seed.id]:seed.multipleZip?files:(files[0]||null) })); }}/>
              </label>
            </div>
          )}

          {results[seed.id] && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
              style={{ padding:'8px 12px', fontSize:9, fontWeight:600, display:'flex', alignItems:'center', gap:6,
                background: results[seed.id].ok?'#f0fdf4':'#fef2f2',
                color: results[seed.id].ok?'#16a34a':'#dc2626' }}>
              {results[seed.id].ok
                ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
              {results[seed.id].msg}
            </motion.div>
          )}
        </div>
      ))}

      <AnimatePresence>
        {confirmReset && (
          <ConfirmModal
            title="Réinitialiser le contenu généré ?"
            message="TOUS les quiz et flashcards générés par IA seront supprimés. Cette action est irréversible."
            confirmLabel="Tout supprimer"
            onConfirm={handleResetGenerated}
            onClose={() => setConfirmReset(false)}
            loading={resetLoading}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Push Panel ─────────────────────────────────────────────────────────────── */
function PushPanel() {
  const [notifStats, setNotifStats] = useState(null);
  const [title,   setTitle]   = useState('');
  const [body,    setBody]    = useState('');
  const [url,     setUrl]     = useState('/dashboard');
  const [sending,   setSending]   = useState(false);
  const [reminding, setReminding] = useState(false);
  const [result,    setResult]    = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/notifications/stats`).then(r => setNotifStats(r.data)).catch(() => {});
  }, []);

  const handleSendAll = async () => {
    if (!title.trim() || !body.trim()) return;
    setSending(true); setResult(null);
    try {
      const r = await axios.post(`${API_URL}/notifications/send-all`, { title, body, url });
      setResult({ ok:true, msg:`Envoyé à ${r.data.sent} utilisateur(s)` });
      setTitle(''); setBody(''); setUrl('/dashboard');
    } catch (err) { setResult({ ok:false, msg:err.response?.data?.message||'Erreur' }); }
    finally { setSending(false); }
  };

  const handleStreakReminder = async () => {
    setReminding(true); setResult(null);
    try {
      const r = await axios.post(`${API_URL}/notifications/send-streak-reminder`);
      setResult({ ok:true, msg:`Rappels envoyés à ${r.data.sent} utilisateur(s)` });
    } catch (err) { setResult({ ok:false, msg:err.response?.data?.message||'Erreur' }); }
    finally { setReminding(false); }
  };

  const inputSt = { width:'100%', padding:'9px 12px', borderRadius:12, border:`1.5px solid ${C.border}`, fontSize:12, color:C.text, background:'#fff', outline:'none', boxSizing:'border-box', boxShadow:clay.sm };

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
      style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:28, height:28, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg,${C.indigo},${C.violet})`, flexShrink:0 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <p style={{ fontSize:13, fontWeight:700, color:C.text }}>Notifications push</p>
        </div>
        {notifStats && (
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, background:`${C.indigo}12`, color:C.indigo, border:`1px solid ${C.border}` }}>
            {notifStats.subscribed}/{notifStats.total} abonnés
          </span>
        )}
      </div>

      <button onClick={handleStreakReminder} disabled={reminding}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'10px', borderRadius:14, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff',
          background: reminding ? '#94a3b8' : 'linear-gradient(135deg,#f59e0b,#d97706)',
          boxShadow: reminding ? 'none' : clay.btn('#f59e0b','#92400e') }}>
        {reminding && <span style={{ width:12, height:12, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }}/>}
        {reminding ? 'Envoi...' : "Rappel streak (inactifs aujourd'hui)"}
      </button>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        <p style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.1em', color:C.sub }}>Message personnalisé</p>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre de la notification" style={inputSt}/>
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Corps du message..." rows={2} style={{ ...inputSt, resize:'none' }}/>
        <select value={url} onChange={e => setUrl(e.target.value)} style={{ ...inputSt }}>
          <option value="/dashboard">Tableau de bord</option>
          <option value="/dashboard/quiz">Quiz</option>
          <option value="/dashboard/flashcards">Flashcards</option>
          <option value="/dashboard/cours">Cours & Fiches</option>
          <option value="/dashboard/exercises">Exercices</option>
          <option value="/dashboard/annales">Annales</option>
          <option value="/dashboard/medicaments">Médicaments</option>
          <option value="/dashboard/groups">Groupes</option>
          <option value="/dashboard/profile">Profil</option>
          <option value="/dashboard/subscription">Abonnement</option>
          <option value="/dashboard/support">Support</option>
        </select>
        <button onClick={handleSendAll} disabled={sending||!title.trim()||!body.trim()}
          style={{ width:'100%', padding:'10px', borderRadius:14, border:'none', cursor:'pointer', fontSize:12, fontWeight:700, color:'#fff',
            background: (sending||!title.trim()||!body.trim()) ? '#94a3b8' : `linear-gradient(135deg,${C.indigo},${C.violet})`,
            boxShadow: (sending||!title.trim()||!body.trim()) ? 'none' : clay.btn(C.indigo,'#3730a3') }}>
          {sending
            ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                <span style={{ width:12, height:12, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }}/>
                Envoi en cours...
              </span>
            : 'Envoyer à tous les abonnés'
          }
        </button>
      </div>

      {result && (
        <motion.p initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
          style={{ fontSize:12, fontWeight:600, textAlign:'center', padding:'8px 12px', borderRadius:12,
            background: result.ok?'#f0fdf4':'#fef2f2', color: result.ok?'#16a34a':'#dc2626' }}>
          {result.msg}
        </motion.p>
      )}
    </motion.div>
  );
}
