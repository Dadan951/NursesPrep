import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import { glossaryize } from '../components/GlossaryTerm';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   'var(--theme-card)',
  text:   'var(--theme-text)',
  border: 'var(--theme-border)',
  indigo: 'var(--theme-primary)',
  violet: 'var(--theme-secondary)',
  sub:    '#64748b',
};
const clay = {
  card: '0 2px 0 var(--theme-shadow), 0 4px 24px rgba(var(--theme-primary-rgb),0.10), 0 1px 0 rgba(255,255,255,0.9) inset',
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.10)',
};

/* Couleur par type de section — cohérent avec l'ordre pédagogique demandé */
const KIND_COLORS = {
  'définition':                '#2563eb',
  'physiopathologie':          '#7c3aed',
  'étiologies':                '#0891b2',
  'facteurs de risque':        '#d97706',
  'signes cliniques':          '#059669',
  'diagnostic':                '#0e7490',
  'complications':             '#dc2626',
  'traitement':                '#16a34a',
  'prise en charge infirmière':'#db2777',
  "signes d'alerte":           '#ea580c',
  "l'essentiel à retenir":     '#4f46e5',
};
const FALLBACK_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#059669', '#dc2626', '#d97706', '#0e7490', '#db2777', '#ea580c', '#4f46e5', '#16a34a'];
function colorForTitle(title, idx) {
  return KIND_COLORS[title?.trim().toLowerCase()] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

/* ─── Renderer Markdown léger (bold/italic/underline, listes, tableaux) ──── */
/* Les termes techniques (glossaire partagé avec les fiches médicaments) sont soulignés
   en pointillés et affichent leur définition au survol/tap. */
function renderInline(str, keyPrefix = 'i') {
  if (!str) return null;
  const parts = [];
  const re = /(__.*?__|\*\*.*?\*\*|\*.*?\*)/g;
  let last = 0, m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) parts.push(...glossaryize(str.slice(last, m.index), `${keyPrefix}-${m.index}`));
    const raw = m[0];
    if (raw.startsWith('**'))      parts.push(<strong key={`${keyPrefix}-${m.index}`} style={{ fontWeight:700, color:'#0f172a' }}>{glossaryize(raw.slice(2,-2), `${keyPrefix}-b${m.index}`)}</strong>);
    else if (raw.startsWith('__')) parts.push(<span key={`${keyPrefix}-${m.index}`} style={{ textDecoration:'underline underline-offset-2', color:'#1e293b' }}>{glossaryize(raw.slice(2,-2), `${keyPrefix}-u${m.index}`)}</span>);
    else                           parts.push(<em key={`${keyPrefix}-${m.index}`} style={{ fontStyle:'italic', color:C.sub }}>{glossaryize(raw.slice(1,-1), `${keyPrefix}-e${m.index}`)}</em>);
    last = m.index + raw.length;
  }
  if (last < str.length) parts.push(...glossaryize(str.slice(last), `${keyPrefix}-end`));
  return parts;
}

function RichContent({ text, color = C.indigo }) {
  if (!text?.trim()) return <span style={{ fontStyle:'italic', color:C.sub }}>Contenu non renseigné</span>;
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }

    // Tableau Markdown
    if (line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) { tableLines.push(lines[i]); i++; }
      const rows      = tableLines.filter(l => !/^[|\s\-:]+$/.test(l));
      const headers   = rows[0]?.split('|').filter(Boolean).map(c => c.trim()) || [];
      const dataRows  = rows.slice(1);
      elements.push(
        <div key={`table-${i}`} style={{ overflowX:'auto', margin:'18px 0', borderRadius:16, border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
          <table style={{ width:'100%', fontSize:13, borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:`${color}10` }}>
                {headers.map((h, hi) => (
                  <th key={hi} style={{ padding:'11px 15px', textAlign:'left', fontWeight:700, color, borderBottom:`1.5px solid ${C.border}` }}>
                    {renderInline(h, `th-${hi}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, ri) => {
                const cells = row.split('|').filter(Boolean).map(c => c.trim());
                return (
                  <tr key={ri} style={{ background: ri%2===0 ? '#fff' : C.bg }}>
                    {cells.map((cell, ci) => (
                      <td key={ci} style={{ padding:'9px 15px', color:'#334155', borderBottom:`1px solid ${C.border}`, fontSize:13 }}>
                        {renderInline(cell, `td-${ri}-${ci}`)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Sous-titre **Xxx** seul sur sa ligne
    const boldOnlyMatch = line.trim().match(/^\*\*(.+)\*\*$/);
    if (boldOnlyMatch) {
      elements.push(
        <div key={`h-${i}`} style={{ display:'flex', alignItems:'center', gap:10, marginTop:22, marginBottom:12 }}>
          <div style={{ height:1, flex:1, borderRadius:2, background:`${color}30` }}/>
          <span style={{ fontSize:11.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em',
            padding:'4px 13px', borderRadius:20, color, background:`${color}12`, border:`1px solid ${color}30` }}>
            {boldOnlyMatch[1]}
          </span>
          <div style={{ height:1, flex:1, borderRadius:2, background:`${color}30` }}/>
        </div>
      );
      i++; continue;
    }

    // Liste à puces
    if (line.trim().startsWith('- ')) {
      const items = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().slice(2)); i++; }
      elements.push(
        <ul key={`ul-${i}`} style={{ margin:'10px 0', display:'flex', flexDirection:'column', gap:9, paddingLeft:4 }}>
          {items.map((item, ii) => (
            <li key={ii} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:15, color:'#334155', lineHeight:1.65 }}>
              <span style={{ flexShrink:0, width:16, height:16, borderRadius:'50%', marginTop:3,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:`${color}12`, border:`1.5px solid ${color}30` }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'block' }}/>
              </span>
              <span>{renderInline(item, `li-${ii}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraphe normal
    elements.push(
      <p key={`p-${i}`} style={{ fontSize:15, color:'#334155', lineHeight:1.8, margin:'10px 0' }}>
        {renderInline(line, `p-${i}`)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
}

/* ─── Icônes par titre de section (mnémotechnique, purement visuel) ──────── */
function sectionIcon(title, color) {
  const key = title?.trim().toLowerCase();
  const common = { width:18, height:18, viewBox:'0 0 24 24', fill:'none', stroke:color, strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' };
  switch (key) {
    case 'définition':
      return <svg {...common}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
    case 'physiopathologie':
      return <svg {...common}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>;
    case 'étiologies':
      return <svg {...common}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
    case 'facteurs de risque':
      return <svg {...common}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    case 'signes cliniques':
      return <svg {...common}><path d="M22 12h-2.5l-2 5-4-14-2 9-1.5-3H2"/></svg>;
    case 'diagnostic':
      return <svg {...common}><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="12" y2="16"/></svg>;
    case 'complications':
      return <svg {...common}><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>;
    case 'prise en charge infirmière':
      return <svg {...common}><path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/></svg>;
    case "signes d'alerte":
      return <svg {...common}><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
    default:
      return <svg {...common}><circle cx="12" cy="12" r="10"/></svg>;
  }
}

/* ─── TocItem ────────────────────────────────────────────────────────────── */
function TocItem({ label, sublabel, badge, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'flex-start', gap:10,
        padding:'8px 10px', borderRadius:12, border:'none', cursor:'pointer', transition:'background 0.18s',
        background: active ? C.indigo : hov ? `${C.indigo}10` : 'transparent' }}>
      <span style={{ flexShrink:0, width:22, height:22, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:10, fontWeight:700, marginTop:1,
        background: active ? 'rgba(255,255,255,0.25)' : `${C.indigo}14`,
        color: active ? '#fff' : C.indigo }}>
        {badge}
      </span>
      <span style={{ minWidth:0, lineHeight:1.4 }}>
        <span style={{ display:'block', fontSize:12, fontWeight:700, color: active ? '#fff' : hov ? C.indigo : C.text }}>{label}</span>
        {sublabel && (
          <span style={{ display:'block', fontSize:10, marginTop:2, color: active ? 'rgba(255,255,255,0.65)' : C.sub,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sublabel}</span>
        )}
      </span>
    </button>
  );
}

/* ─── SectionCard (enveloppe commune à toutes les parties) ───────────────── */
function SectionCard({ id, refCb, num, title, color, children }) {
  return (
    <motion.div id={id} ref={refCb}
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ marginBottom:24, scrollMarginTop:24 }}>
      <div style={{ position:'relative', background:C.card, borderRadius:24, borderTop:`1.5px solid ${C.border}`, borderRight:`1.5px solid ${C.border}`, borderBottom:`1.5px solid ${C.border}`,
        borderLeft:`5px solid ${color}`, boxShadow:clay.card }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:`radial-gradient(ellipse 420px 200px at 100% 0%,${color}12,transparent 70%)`, pointerEvents:'none' }} aria-hidden/>
        <div style={{ position:'relative', padding:'26px 26px 28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
            <span style={{ flexShrink:0, width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              background:`linear-gradient(135deg,${color},${color}cc)`, boxShadow:`0 0 0 4px ${color}18, 0 6px 16px ${color}50` }}>
              {typeof num === 'number'
                ? <span style={{ fontSize:17, fontWeight:800, color:'#fff' }}>{num}</span>
                : sectionIcon(title, '#fff')}
            </span>
            <h2 className="nunito" style={{ fontSize:20, fontWeight:800, color:C.text, lineHeight:1.3, textTransform:'uppercase', letterSpacing:'0.02em' }}>{title}</h2>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Bloc TRAITEMENT — items cliquables vers l'onglet Médicaments ───────── */
function TreatmentBlock({ items, color }) {
  const navigate = useNavigate();
  if (!items?.length) return <span style={{ fontStyle:'italic', color:C.sub }}>Aucun traitement renseigné</span>;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {items.map((t, i) => (
        <motion.button key={i} whileHover={{ y:-2 }} whileTap={{ scale:0.98 }}
          onClick={() => navigate(`/dashboard/medicaments?q=${encodeURIComponent(t.name)}`)}
          style={{ display:'flex', alignItems:'center', gap:12, textAlign:'left', width:'100%',
            padding:'14px 16px', borderRadius:16, border:`1.5px solid ${color}30`, background:`${color}08`,
            cursor:'pointer', transition:'box-shadow 0.18s' }}>
          <span style={{ flexShrink:0, width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
            background:`linear-gradient(135deg,${color},${color}cc)` }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
          </span>
          <span style={{ minWidth:0, flex:1 }}>
            <span style={{ display:'block', fontSize:14.5, fontWeight:700, color:C.text }}>{t.name}</span>
            {t.note && <span style={{ display:'block', fontSize:12, color:C.sub, marginTop:2, lineHeight:1.5 }}>{t.note}</span>}
          </span>
          <span style={{ flexShrink:0, fontSize:10.5, fontWeight:700, color, background:`${color}18`, padding:'5px 10px', borderRadius:20,
            display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
            Voir la fiche
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

/* ─── Bloc L'ESSENTIEL À RETENIR ──────────────────────────────────────────── */
function EssentialsBlock({ items, color }) {
  if (!items?.length) return <span style={{ fontStyle:'italic', color:C.sub }}>Contenu non renseigné</span>;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'12px 14px', borderRadius:14,
          background:`${color}0c`, border:`1.5px solid ${color}25` }}>
          <span style={{ flexShrink:0, width:26, height:26, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center',
            background:color, color:'#fff', fontSize:12, fontWeight:800 }}>
            ✓
          </span>
          <span style={{ fontSize:14.5, fontWeight:600, color:C.text, lineHeight:1.6, marginTop:2 }}>{renderInline(item, `es-${i}`)}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   COURS DETAIL PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function CoursDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { token } = useAuth();
  const [lesson,  setLesson]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/lessons/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setLesson(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!lesson) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { rootMargin:'-20% 0px -70% 0px' }
    );
    sectionRefs.current.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [lesson]);

  const scrollTo = (idx) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior:'smooth', block:'start' });
    setMobileTocOpen(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <div style={{ width:36, height:36, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
      </div>
    </DashboardLayout>
  );

  if (!lesson) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:C.bg, padding:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>📘</div>
        <p style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:8 }}>Cours introuvable</p>
        <button onClick={() => navigate('/dashboard/cours')}
          style={{ fontSize:13, color:C.indigo, background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>
          ← Retour aux cours
        </button>
      </div>
    </DashboardLayout>
  );

  const sections = lesson.sections || [];

  const tocItems = sections.map((s, i) => ({
    label: `Partie ${i+1}`, sublabel: s.title, badge: i+1, refIdx: i,
  }));

  const TOC = (
    <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
      {tocItems.map((t, i) => (
        <TocItem key={i} {...t} active={activeSection===i} onClick={() => scrollTo(t.refIdx)}/>
      ))}
    </div>
  );

  return (
    <DashboardLayout>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <div style={{ background:'linear-gradient(135deg,var(--theme-dark) 0%,var(--theme-primary) 60%,var(--theme-text) 100%)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/dashboard/cours')}
                style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'rgba(196,181,253,0.8)',
                  background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.15)',
                  padding:'4px 12px', borderRadius:20, cursor:'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                Cours
              </button>
              {lesson.chapter && (
                <>
                  <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>/</span>
                  <span style={{ fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20,
                    background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.9)', border:'1.5px solid rgba(255,255,255,0.2)' }}>
                    {lesson.chapter}
                  </span>
                </>
              )}
            </div>

            <h1 className="nunito" style={{ fontSize:'clamp(24px, 6vw, 30px)', fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:8, wordBreak:'break-word' }}>{lesson.title}</h1>

            {lesson.summary && (
              <p style={{ fontSize:13.5, lineHeight:1.75, maxWidth:640, color:'rgba(196,181,253,0.85)' }}>{lesson.summary}</p>
            )}
          </motion.div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────────── */}
        <div style={{ padding:'24px 16px' }}>

          {/* TOC mobile */}
          {tocItems.length > 0 && (
            <div style={{ marginBottom:16 }}>
              <button onClick={() => setMobileTocOpen(v => !v)}
                style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:700, color:C.indigo,
                  background:C.card, border:`1.5px solid ${C.border}`, padding:'10px 16px', borderRadius:14,
                  width:'100%', cursor:'pointer', boxShadow:clay.sm }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/>
                </svg>
                Sommaire ({tocItems.length} parties)
                <motion.svg animate={{ rotate: mobileTocOpen ? 180 : 0 }} style={{ marginLeft:'auto' }}
                  width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {mobileTocOpen && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                    exit={{ opacity:0, height:0 }} transition={{ duration:0.25 }}
                    style={{ overflow:'hidden', background:C.card, border:`1.5px solid ${C.border}`, borderRadius:16, marginTop:8, padding:10, boxShadow:clay.card }}>
                    {TOC}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <main style={{ flex:1, minWidth:0 }}>
            {sections.map((s, i) => {
              const color = colorForTitle(s.title, i);
              return (
                <SectionCard key={s._id || i} id={`section-${i}`} refCb={el => { sectionRefs.current[i] = el; }}
                  num={s.kind === 'text' ? i + 1 : undefined} title={s.title} color={color}>
                  {s.kind === 'treatments'
                    ? <TreatmentBlock items={s.treatments} color={color}/>
                    : s.kind === 'essentials'
                      ? <EssentialsBlock items={s.items} color={color}/>
                      : <RichContent text={s.content} color={color}/>}
                </SectionCard>
              );
            })}

            {sections.length === 0 && (
              <div style={{ textAlign:'center', padding:'60px 20px', color:C.sub }}>
                <p style={{ fontSize:14 }}>Ce cours n'a pas encore de contenu structuré.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </DashboardLayout>
  );
}
