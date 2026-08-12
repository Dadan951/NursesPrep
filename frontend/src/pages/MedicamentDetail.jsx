import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useAuth, API_URL } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

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
  btn:  (hex, dark) => hex
    ? `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`
    : `0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset`,
};

/* ─── Sections spéciales ─────────────────────────────────────────────────── */
const SPECIAL = new Set(['Médias', 'Source', 'Général']);

/* ─── Glossaire — termes techniques définis au survol / tap ─────────────── */
const GLOSSARY = {
  'effet plafond': "Au-delà d'une certaine dose, l'effet du médicament n'augmente plus : cela limite le risque de surdosage par rapport à un produit sans ce plafond.",
  'agoniste-antagoniste partiel': "Molécule qui active partiellement un récepteur (effet plus faible qu'un agoniste complet) tout en bloquant l'action d'autres substances sur ce même récepteur.",
  'agoniste partiel': "Substance qui se lie à un récepteur et l'active, mais avec une efficacité moindre qu'un agoniste complet.",
  'agoniste complet': "Substance qui se lie à un récepteur et l'active au maximum de son efficacité possible.",
  'antagoniste': "Substance qui se lie à un récepteur sans l'activer, bloquant ainsi l'action d'autres substances sur ce récepteur.",
  'palier iii': "Classification de l'OMS pour les antalgiques : le palier III regroupe les opioïdes forts, réservés aux douleurs intenses.",
  'palier ii': "Classification de l'OMS pour les antalgiques : le palier II regroupe les opioïdes faibles, pour les douleurs modérées.",
  'demi-vie': "Temps nécessaire pour que la concentration du médicament dans l'organisme diminue de moitié.",
  'tso': "Traitement de Substitution aux Opioïdes — prise en charge médicale remplaçant un opioïde illicite par un médicament encadré, pour réduire les risques et accompagner le sevrage.",
  'amm': "Autorisation de Mise sur le Marché — accord officiel obligatoire avant la commercialisation d'un médicament en France.",
  'ansm': "Agence Nationale de Sécurité du Médicament et des produits de santé — autorité française de surveillance des médicaments.",
  'rcp': "Résumé des Caractéristiques du Produit — document officiel décrivant précisément un médicament (indications, posologie, effets indésirables…).",
  'has': "Haute Autorité de Santé — organisme public émettant des recommandations de bonne pratique médicale.",
  'snc': "Système Nerveux Central — l'ensemble formé par le cerveau et la moelle épinière.",
  'per os': "Voie d'administration orale, c'est-à-dire par la bouche.",
  'voie sublinguale': "Administration sous la langue, permettant une absorption rapide directement dans la circulation sanguine.",
  'dépression respiratoire': "Ralentissement dangereux de la fréquence et/ou de l'amplitude respiratoire, principal risque des opioïdes en cas de surdosage.",
  'sevrage': "Ensemble des symptômes physiques et psychiques survenant à l'arrêt ou à la diminution d'une substance dont l'organisme est devenu dépendant.",
  'pharmacocinétique': "Étude du devenir d'un médicament dans l'organisme (absorption, distribution, métabolisme, élimination).",
  'pharmacodynamie': "Étude des effets d'un médicament sur l'organisme et de son mécanisme d'action.",
  'biodisponibilité': "Proportion d'une dose de médicament qui atteint la circulation générale sous forme active.",
};
const GLOSSARY_RE = new RegExp(
  '\\b(' + Object.keys(GLOSSARY).sort((a,b) => b.length - a.length).map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b',
  'gi'
);

/* ─── Term — mot souligné en pointillés, définition au survol/tap ───────── */
function Term({ word, definition, keyIndex }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const ref = useRef(null);
  const canHover = typeof window !== 'undefined' && window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onScroll = () => setOpen(false);
    document.addEventListener('click', onDocClick);
    document.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !ref.current) return;
    const margin = 10;
    const tipWidth = Math.min(240, window.innerWidth - 2 * margin);
    const r = ref.current.getBoundingClientRect();
    let left = r.left + r.width / 2 - tipWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - margin - tipWidth));
    setPos({ top: r.bottom + 6, left, width: tipWidth });
  }, [open]);

  return (
    <span ref={ref} style={{ position:'relative', display:'inline-block' }}>
      <span
        onMouseEnter={canHover ? () => setOpen(true) : undefined}
        onMouseLeave={canHover ? () => setOpen(false) : undefined}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ borderBottom:'1.5px dotted #94a3b8', cursor:'help', fontWeight:600, color:'inherit' }}>
        {word}
      </span>
      {open && pos && createPortal(
        <AnimatePresence>
          <motion.div key={`tip-${keyIndex}`}
            initial={{ opacity:0, y:4, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:4, scale:0.97 }}
            transition={{ duration:0.15 }}
            style={{ position:'fixed', zIndex:9999, top:pos.top, left:pos.left, width:pos.width, textAlign:'left',
              background:'#0f172a', color:'#f1f5f9', fontSize:11.5, fontWeight:500, lineHeight:1.55,
              padding:'9px 12px', borderRadius:11, boxShadow:'0 10px 28px rgba(0,0,0,0.3)', pointerEvents:'none' }}>
            {definition}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}

/* ─── Applique le glossaire sur un fragment de texte brut ───────────────── */
function glossaryize(str, keyPrefix) {
  if (!str) return [str];
  const out = [];
  let last = 0, m, idx = 0;
  GLOSSARY_RE.lastIndex = 0;
  while ((m = GLOSSARY_RE.exec(str)) !== null) {
    if (m.index > last) out.push(str.slice(last, m.index));
    const def = GLOSSARY[m[0].toLowerCase()];
    out.push(<Term key={`${keyPrefix}-g${idx++}`} word={m[0]} definition={def} keyIndex={`${keyPrefix}-g${idx}`}/>);
    last = m.index + m[0].length;
  }
  if (last < str.length) out.push(str.slice(last));
  return out;
}

/* ─── Couleurs des parties ───────────────────────────────────────────────── */
const HEADING_COLORS = [
  { text:'#1d4ed8', bg:'#eff6ff', border:'#bfdbfe' },
  { text:'#0e7490', bg:'#ecfeff', border:'#a5f3fc' },
  { text:'#6d28d9', bg:'#f5f3ff', border:'#ddd6fe' },
  { text:'#047857', bg:'#ecfdf5', border:'#a7f3d0' },
];
const PARTIE_COLORS = ['#2563eb', '#0891b2', '#7c3aed', '#059669', '#dc2626'];

/* ─── Inline renderer pour fond sombre ──────────────────────────────────── */
function renderHeroInline(str) {
  if (!str) return null;
  const parts = [];
  const re = /(__.*?__|\*\*.*?\*\*|\*.*?\*)/g;
  let last = 0, m;
  while ((m = re.exec(str)) !== null) {
    if (m.index > last) parts.push(<span key={`t${m.index}`} style={{ color:'rgba(196,181,253,0.85)' }}>{str.slice(last, m.index)}</span>);
    const raw = m[0];
    if (raw.startsWith('**'))      parts.push(<strong key={m.index} style={{ fontWeight:700, color:'#fff' }}>{raw.slice(2,-2)}</strong>);
    else if (raw.startsWith('__')) parts.push(<span key={m.index} style={{ textDecoration:'underline', color:'#fff' }}>{raw.slice(2,-2)}</span>);
    else                           parts.push(<em key={m.index} style={{ fontStyle:'italic', color:'rgba(196,181,253,0.7)' }}>{raw.slice(1,-1)}</em>);
    last = m.index + raw.length;
  }
  if (last < str.length) parts.push(<span key="end" style={{ color:'rgba(196,181,253,0.85)' }}>{str.slice(last)}</span>);
  return parts;
}

/* ─── Renderer Markdown léger ────────────────────────────────────────────── */
function RichContent({ text, partieIndex = 0 }) {
  if (!text) return <span style={{ fontStyle:'italic', color:C.sub }}>Contenu non renseigné</span>;
  const hc = HEADING_COLORS[partieIndex % HEADING_COLORS.length];

  function renderInline(str, keyPrefix = 'i') {
    const parts = [];
    const re = /(__.*?__|\*\*.*?\*\*|\*.*?\*)/g;
    let last = 0, m;
    while ((m = re.exec(str)) !== null) {
      if (m.index > last) parts.push(...glossaryize(str.slice(last, m.index), `${keyPrefix}-${m.index}`));
      const raw = m[0];
      if (raw.startsWith('**'))      parts.push(<strong key={m.index} style={{ fontWeight:700, color:'#0f172a' }}>{glossaryize(raw.slice(2,-2), `${keyPrefix}-b${m.index}`)}</strong>);
      else if (raw.startsWith('__')) parts.push(<span key={m.index} style={{ textDecoration:'underline underline-offset-2', color:'#1e293b' }}>{glossaryize(raw.slice(2,-2), `${keyPrefix}-u${m.index}`)}</span>);
      else                           parts.push(<em key={m.index} style={{ fontStyle:'italic', color:C.sub }}>{glossaryize(raw.slice(1,-1), `${keyPrefix}-e${m.index}`)}</em>);
      last = m.index + raw.length;
    }
    if (last < str.length) parts.push(...glossaryize(str.slice(last), `${keyPrefix}-end`));
    return parts;
  }

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
      const rows    = tableLines.filter(l => !l.replace(/[|\-\s]/g,'').trim() === false || !/^[|\s\-:]+$/.test(l));
      const headers = rows[0]?.split('|').filter(Boolean).map(c => c.trim()) || [];
      const dataRows = rows.slice(1).filter(r => !/^[|\s\-:]+$/.test(r));
      elements.push(
        <div key={`table-${i}`} style={{ overflowX:'auto', margin:'18px 0', borderRadius:16, border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
          <table style={{ width:'100%', fontSize:13, borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:hc.bg }}>
                {headers.map((h, hi) => (
                  <th key={hi} style={{ padding:'11px 15px', textAlign:'left', fontWeight:700, color:hc.text, borderBottom:`1.5px solid ${C.border}` }}>
                    {renderInline(h)}
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
                        {renderInline(cell)}
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

    // Titre de section **Xxx** seul
    const boldOnlyMatch = line.trim().match(/^\*\*(.+)\*\*$/);
    if (boldOnlyMatch) {
      elements.push(
        <div key={`h-${i}`} style={{ display:'flex', alignItems:'center', gap:10, marginTop:24, marginBottom:12 }}>
          <div style={{ height:1, flex:1, borderRadius:2, background:hc.border }}/>
          <span style={{ fontSize:11.5, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em',
            padding:'4px 13px', borderRadius:20, color:hc.text, background:hc.bg, border:`1px solid ${hc.border}` }}>
            {boldOnlyMatch[1]}
          </span>
          <div style={{ height:1, flex:1, borderRadius:2, background:hc.border }}/>
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
            <li key={ii} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:15.5, color:'#334155', lineHeight:1.65 }}>
              <span style={{ flexShrink:0, width:16, height:16, borderRadius:'50%', marginTop:3,
                display:'flex', alignItems:'center', justifyContent:'center',
                background:hc.bg, border:`1.5px solid ${hc.border}` }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:hc.text, display:'block' }}/>
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraphe normal
    elements.push(
      <p key={`p-${i}`} style={{ fontSize:15.5, color:'#334155', lineHeight:1.85, margin:'10px 0' }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <div>{elements}</div>;
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

/* ─── PartieBlock ────────────────────────────────────────────────────────── */
function PartieBlock({ partieNum, title, content, id, color, partieIndex }) {
  return (
    <motion.div id={id}
      initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
      style={{ marginBottom:28, scrollMarginTop:24 }}>
      <div style={{ position:'relative', background:C.card, borderRadius:24, borderTop:`1.5px solid ${C.border}`, borderRight:`1.5px solid ${C.border}`, borderBottom:`1.5px solid ${C.border}`,
        borderLeft:`5px solid ${color}`, boxShadow:clay.card }}>
        {/* Voile de couleur en fond */}
        <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:`radial-gradient(ellipse 420px 200px at 100% 0%,${color}12,transparent 70%)`, pointerEvents:'none' }} aria-hidden/>
        <div style={{ position:'relative', padding:'26px 26px 28px' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:18 }}>
            <span style={{ flexShrink:0, width:48, height:48, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
              background:`linear-gradient(135deg,${color},${color}cc)`, boxShadow:`0 0 0 4px ${color}18, 0 6px 16px ${color}50`,
              fontSize:19, fontWeight:800, color:'#fff' }}>
              {partieNum}
            </span>
            <h2 className="nunito" style={{ fontSize:21, fontWeight:800, color:C.text, lineHeight:1.3 }}>{title}</h2>
          </div>
          {/* Contenu */}
          <RichContent text={content} partieIndex={partieIndex}/>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SectionBlock (générique) ───────────────────────────────────────────── */
function SectionBlock({ icon, title, color = C.indigo, children }) {
  return (
    <div style={{ position:'relative', background:C.card, borderRadius:24, borderTop:`1.5px solid ${C.border}`, borderRight:`1.5px solid ${C.border}`, borderBottom:`1.5px solid ${C.border}`,
      borderLeft:`5px solid ${color}`, boxShadow:clay.card, marginBottom:28 }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:`radial-gradient(ellipse 420px 200px at 100% 0%,${color}12,transparent 70%)`, pointerEvents:'none' }} aria-hidden/>
      <div style={{ position:'relative', padding:'26px 26px 28px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
          <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            background:`linear-gradient(135deg,${color}20,${color}10)`, border:`1.5px solid ${color}35` }}>
            {icon}
          </div>
          <h2 className="nunito" style={{ fontSize:21, fontWeight:800, color:C.text }}>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── AttachmentCard ─────────────────────────────────────────────────────── */
function AttachmentCard({ attachment }) {
  const [hov, setHov] = useState(false);
  const icons = {
    image: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0891b2" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    pdf:   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
    video: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    other: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  };
  const typeBg = { image:'#e0f7fa', pdf:'#fef2f2', video:'#f3e8ff', other:`${C.bg}` };
  return (
    <a href={attachment.url} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', textDecoration:'none',
        background:C.card, border:`1.5px solid ${hov ? C.indigo+'40' : C.border}`, borderRadius:14,
        boxShadow: hov ? clay.sm : 'none', transition:'all 0.18s' }}>
      <div style={{ width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        background: typeBg[attachment.type] || typeBg.other }}>
        {icons[attachment.type] || icons.other}
      </div>
      <div style={{ minWidth:0, flex:1 }}>
        <p style={{ fontSize:13, fontWeight:600, color: hov ? C.indigo : C.text, transition:'color 0.18s',
          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{attachment.name || 'Fichier'}</p>
        <p style={{ fontSize:10, color:C.sub, textTransform:'uppercase', marginTop:1 }}>{attachment.type}</p>
      </div>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={hov ? C.indigo : '#94a3b8'} strokeWidth="2" strokeLinecap="round" style={{ flexShrink:0, transition:'stroke 0.18s' }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MEDICAMENT DETAIL PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function MedicamentDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { token } = useAuth();
  const [drug,    setDrug]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection,  setActiveSection]  = useState(0);
  const [mobileTocOpen,  setMobileTocOpen]  = useState(false);
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!token) return;
    axios.get(`${API_URL}/drugs/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setDrug(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, token]);

  useEffect(() => {
    if (!drug) return;
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
  }, [drug]);

  const scrollTo = (sectionIndex) => {
    sectionRefs.current[sectionIndex]?.scrollIntoView({ behavior:'smooth', block:'start' });
    setMobileTocOpen(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <div style={{ width:36, height:36, border:`4px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
      </div>
    </DashboardLayout>
  );

  if (!drug) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:C.bg, padding:40 }}>
        <div style={{ fontSize:48, marginBottom:12 }}>💊</div>
        <p style={{ fontWeight:700, color:C.text, fontSize:16, marginBottom:8 }}>Médicament introuvable</p>
        <button onClick={() => navigate('/dashboard/medicaments')}
          style={{ fontSize:13, color:C.indigo, background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline' }}>
          ← Retour aux médicaments
        </button>
      </div>
    </DashboardLayout>
  );

  const classColor      = drug.drugClass?.color || C.indigo;
  const sections        = drug.sections || [];
  const contentSections = sections.filter(s => !SPECIAL.has(s.title));
  const mediasSection   = sections.find(s => s.title === 'Médias');
  const generalSection  = sections.find(s => s.title === 'Général');
  const displaySections = contentSections.length > 0 ? contentSections : (generalSection ? [generalSection] : []);

  const hasMindMap     = !!drug.mindMap?.url;
  const hasAttachments = drug.attachments?.length > 0;
  const hasSources     = drug.sources?.length > 0;
  const hasMedias      = !!mediasSection;

  const tocItems = [
    { label:'Introduction', sublabel:null, badge:'>', refIdx:0 },
    ...displaySections.map((s, i) => ({ label:`Partie ${i+1}`, sublabel:s.title, badge:i+1, refIdx:i+1 })),
    ...(hasMedias      ? [{ label:'Médias',        sublabel:null, badge:'▶', refIdx:displaySections.length+1 }] : []),
    ...(hasMindMap     ? [{ label:'Carte mentale', sublabel:null, badge:'⬡', refIdx:displaySections.length+(hasMedias?2:1) }] : []),
    ...(hasAttachments ? [{ label:'Ressources',    sublabel:null, badge:'📎', refIdx:displaySections.length+(hasMedias?2:1)+(hasMindMap?1:0) }] : []),
    ...(hasSources     ? [{ label:'Sources',       sublabel:null, badge:'§',  refIdx:displaySections.length+(hasMedias?2:1)+(hasMindMap?1:0)+(hasAttachments?1:0) }] : []),
  ];

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
        <div style={{ background:`linear-gradient(135deg,var(--theme-dark) 0%,${classColor} 60%,var(--theme-text) 100%)`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:`${classColor}30`, filter:'blur(60px)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>
            {/* Breadcrumb */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <button onClick={() => navigate('/dashboard/medicaments')}
                style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:'rgba(196,181,253,0.8)',
                  background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.15)',
                  padding:'4px 12px', borderRadius:20, cursor:'pointer' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                Médicaments
              </button>
              <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>/</span>
              <span style={{ fontSize:12, fontWeight:700, padding:'4px 12px', borderRadius:20,
                background:`${classColor}40`, color:'rgba(255,255,255,0.9)', border:'1.5px solid rgba(255,255,255,0.2)' }}>
                {drug.drugClass?.icon} {drug.drugClass?.name}
              </span>
            </div>

            <h1 className="nunito" style={{ fontSize:'clamp(24px, 6vw, 30px)', fontWeight:900, color:'#fff', lineHeight:1.15, marginBottom:4, wordBreak:'break-word' }}>{drug.name}</h1>
            {drug.genericName && (
              <p style={{ fontSize:13, fontStyle:'italic', color:'rgba(196,181,253,0.7)', marginBottom:12 }}>{drug.genericName}</p>
            )}
            {drug.description && (
              <p style={{ fontSize:13.5, lineHeight:1.75, maxWidth:640, marginBottom:12 }}>
                {renderHeroInline(drug.description)}
              </p>
            )}
            {drug.tags?.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {drug.tags.map(tag => (
                  <span key={tag} style={{ fontSize:11, padding:'4px 10px', borderRadius:20,
                    background:'rgba(255,255,255,0.1)', color:'rgba(196,181,253,0.9)', border:'1px solid rgba(255,255,255,0.15)' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────────── */}
        <div style={{ padding:'24px 16px' }}>

          {/* TOC */}
          <div style={{ marginBottom:16, display:'block' }}>
            <button onClick={() => setMobileTocOpen(v => !v)}
              style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:700, color:C.indigo,
                background:C.card, border:`1.5px solid ${C.border}`, padding:'10px 16px', borderRadius:14,
                width:'100%', cursor:'pointer', boxShadow:clay.sm }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="15" y2="18"/>
              </svg>
              Sommaire ({tocItems.length} sections)
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

          {/* Layout */}
          <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

            {/* Contenu principal */}
            <main style={{ flex:1, minWidth:0 }}>

              {/* Introduction */}
              <div ref={el => { sectionRefs.current[0] = el; }} style={{ scrollMarginTop:24, marginBottom:28 }}>
                <div style={{ position:'relative', background:C.card, borderRadius:24, borderTop:`1.5px solid ${C.border}`, borderRight:`1.5px solid ${C.border}`, borderBottom:`1.5px solid ${C.border}`,
                  borderLeft:`5px solid ${classColor}` , boxShadow:clay.card }}>
                  <div style={{ position:'absolute', inset:0, borderRadius:'inherit', background:`radial-gradient(ellipse 420px 200px at 100% 0%,${classColor}12,transparent 70%)`, pointerEvents:'none' }} aria-hidden/>
                  <div style={{ position:'relative', padding:'26px 26px 28px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                      <div style={{ width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                        background:`linear-gradient(135deg,${classColor}25,${classColor}12)`, border:`1.5px solid ${classColor}35` }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={classColor} strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      </div>
                      <h2 className="nunito" style={{ fontSize:21, fontWeight:800, color:C.text }}>Introduction</h2>
                    </div>
                    <RichContent text={drug.description} partieIndex={-1}/>
                  </div>
                </div>
              </div>

              {/* Parties numérotées */}
              {displaySections.map((s, i) => (
                <div key={s._id||i} ref={el => { sectionRefs.current[i+1] = el; }}>
                  <PartieBlock
                    partieNum={i+1}
                    title={s.title}
                    content={s.content}
                    id={`section-${i}`}
                    color={PARTIE_COLORS[i] || PARTIE_COLORS[0]}
                    partieIndex={i}
                  />
                </div>
              ))}

              {/* Médias */}
              {hasMedias && (
                <div ref={el => { sectionRefs.current[displaySections.length+1] = el; }} style={{ scrollMarginTop:24 }}>
                  <SectionBlock
                    color="#7c3aed"
                    icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
                    title="Médias & Ressources pédagogiques">
                    {mediasSection.content && (
                      <div style={{ marginBottom:16 }}>
                        <RichContent text={mediasSection.content} partieIndex={2}/>
                      </div>
                    )}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:10 }}>
                      {[
                        { name:'ANSM',  desc:'Agence nationale de sécurité du médicament', icon:'🏛️', bg:'#eff6ff', border:'#bfdbfe', text:'#1d4ed8' },
                        { name:'Vidal', desc:'Base de données médicaments de référence',   icon:'📖', bg:'#f0fdf4', border:'#bbf7d0', text:'#15803d' },
                        { name:'HAS',   desc:'Haute Autorité de Santé — recommandations',  icon:'📋', bg:'#fef3c7', border:'#fde68a', text:'#b45309' },
                        { name:'RCP',   desc:"Résumé des Caractéristiques du Produit",     icon:'📄', bg:'#f5f3ff', border:'#ddd6fe', text:'#6d28d9' },
                      ].map(r => (
                        <div key={r.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:14,
                          background:r.bg, border:`1.5px solid ${r.border}` }}>
                          <span style={{ fontSize:20, flexShrink:0 }}>{r.icon}</span>
                          <div style={{ minWidth:0 }}>
                            <p style={{ fontSize:13, fontWeight:700, color:r.text }}>{r.name}</p>
                            <p style={{ fontSize:10, color:C.sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* Carte mentale */}
              {hasMindMap && (
                <div ref={el => { sectionRefs.current[displaySections.length+(hasMedias?2:1)] = el; }} style={{ scrollMarginTop:24 }}>
                  <SectionBlock
                    color="#7c3aed"
                    icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M2 12h3M19 12h3M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12"/></svg>}
                    title="Carte mentale">
                    <div style={{ borderRadius:14, overflow:'hidden', border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
                      <img src={drug.mindMap.url} alt={drug.mindMap.caption||'Carte mentale'} style={{ width:'100%', display:'block' }}/>
                      {drug.mindMap.caption && (
                        <p style={{ fontSize:11, color:C.sub, textAlign:'center', padding:'8px', background:C.bg, borderTop:`1px solid ${C.border}` }}>
                          {drug.mindMap.caption}
                        </p>
                      )}
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* Ressources */}
              {hasAttachments && (
                <div ref={el => {
                  const o = displaySections.length+(hasMedias?2:1)+(hasMindMap?1:0);
                  sectionRefs.current[o] = el;
                }} style={{ scrollMarginTop:24 }}>
                  <SectionBlock
                    color="#0d9488"
                    icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
                    title="Ressources">
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
                      {drug.attachments.map((a, i) => <AttachmentCard key={i} attachment={a}/>)}
                    </div>
                  </SectionBlock>
                </div>
              )}

              {/* Sources */}
              {hasSources && (
                <div ref={el => {
                  const o = displaySections.length+(hasMedias?2:1)+(hasMindMap?1:0)+(hasAttachments?1:0);
                  sectionRefs.current[o] = el;
                }} style={{ scrollMarginTop:24 }}>
                  <SectionBlock
                    color="#d97706"
                    icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>}
                    title="Sources">
                    <div style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:14, overflow:'hidden' }}>
                      {drug.sources.map((src, i) => (
                        <div key={i} style={{ padding:'12px 16px', borderBottom: i < drug.sources.length-1 ? `1px solid ${C.border}` : 'none' }}>
                          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                            <div style={{ minWidth:0 }}>
                              <p style={{ fontSize:13, fontWeight:600, color:C.text }}>
                                {src.url ? (
                                  <a href={src.url} target="_blank" rel="noopener noreferrer"
                                    style={{ color:C.indigo, textDecoration:'none' }}
                                    onMouseEnter={e => e.currentTarget.style.textDecoration='underline'}
                                    onMouseLeave={e => e.currentTarget.style.textDecoration='none'}>
                                    {src.title || src.url}
                                  </a>
                                ) : src.title || `Source ${i+1}`}
                              </p>
                              {src.authors && <p style={{ fontSize:11, color:C.sub, marginTop:2 }}>{src.authors}</p>}
                            </div>
                            {src.year && (
                              <span style={{ fontSize:11, fontWeight:700, background:`${C.indigo}14`, color:C.indigo,
                                padding:'2px 8px', borderRadius:8, flexShrink:0 }}>{src.year}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionBlock>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
