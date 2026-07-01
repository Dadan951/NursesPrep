import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
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

/* ─── Palette ────────────────────────────────────────────────────────────────── */
const PALETTE = [
  { from:'#4F46E5', to:'#7C3AED', dark:'#3730a3' },
  { from:'#0891b2', to:'#4F46E5', dark:'#0e7490' },
  { from:'#059669', to:'#0891b2', dark:'#047857' },
  { from:'#dc2626', to:'#db2777', dark:'#991b1b' },
  { from:'#ea580c', to:'#d97706', dark:'#9a3412' },
  { from:'#0f766e', to:'#0891b2', dark:'#134e4a' },
  { from:'#be185d', to:'#9333ea', dark:'#831843' },
  { from:'#6366f1', to:'#8b5cf6', dark:'#4338ca' },
];

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
const FILE_COLOR = {
  'application/pdf': '#ef4444',
  'image/jpeg': '#10b981', 'image/png': '#10b981', 'image/webp': '#10b981',
  'application/msword': '#3b82f6',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '#3b82f6',
};
const FILE_LABEL = {
  'application/pdf': 'PDF',
  'image/jpeg': 'Image', 'image/png': 'Image', 'image/webp': 'Image',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
};
function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024 * 1024) return (b / 1024).toFixed(0) + ' Ko';
  return (b / (1024 * 1024)).toFixed(1) + ' Mo';
}
const isImage = mime => mime?.startsWith('image/');
const isPDF   = mime => mime === 'application/pdf';

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */
function Breadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, flexWrap:'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
          {item.onClick ? (
            <motion.button onClick={item.onClick}
              whileHover={{ color:C.indigo }}
              style={{ fontSize:12, fontWeight:600, color:C.sub, background:'transparent', border:'none', cursor:'pointer', padding:'3px 8px', borderRadius:8 }}>
              {item.label}
            </motion.button>
          ) : (
            <span style={{ fontSize:12, fontWeight:700, color:C.text, padding:'3px 10px', borderRadius:10, background:C.card, boxShadow:clay.sm }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── File Viewer ────────────────────────────────────────────────────────────── */
function FileViewer({ annaleId, fileMimeType, fileName, fileSize }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    let url;
    axios.get(`${API_URL}/annales/${annaleId}/file`, { responseType:'arraybuffer' })
      .then(r => { const blob = new Blob([r.data], { type:fileMimeType }); url = URL.createObjectURL(blob); setBlobUrl(url); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [annaleId, fileMimeType]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 0' }}>
      <div style={{ width:28, height:28, border:`4px solid ${C.border}`, borderTopColor:C.indigo, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
    </div>
  );
  if (error) return (
    <div style={{ textAlign:'center', padding:'32px 0', color:'#f87171', fontSize:13 }}>Impossible de charger le fichier.</div>
  );

  const color = FILE_COLOR[fileMimeType] || '#3b82f6';
  const label = FILE_LABEL[fileMimeType] || 'Fichier';

  return (
    <div style={{ borderRadius:16, overflow:'hidden', border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:10, color:'#fff', background:color }}>
            {label}
          </span>
          <span style={{ fontSize:12, fontWeight:500, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:260 }}>
            {fileName}
          </span>
          {fileSize > 0 && <span style={{ fontSize:11, color:C.sub }}>{formatSize(fileSize)}</span>}
        </div>
        <a href={blobUrl} download={fileName}
          style={{ display:'flex', alignItems:'center', gap:6, fontSize:12, fontWeight:600, color:C.indigo, textDecoration:'none' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Télécharger
        </a>
      </div>

      {isImage(fileMimeType) ? (
        <div style={{ background:'#f8fafc', display:'flex', justifyContent:'center', padding:16 }}>
          <img src={blobUrl} alt={fileName} style={{ maxWidth:'100%', maxHeight:'65vh', borderRadius:12, objectFit:'contain' }}/>
        </div>
      ) : isPDF(fileMimeType) ? (
        <iframe src={blobUrl} title={fileName} style={{ width:'100%', height:'65vh', border:'none', display:'block' }}/>
      ) : (
        <div style={{ padding:24, display:'flex', alignItems:'center', gap:16, background:C.card }}>
          <div style={{ width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', background:`${color}15`, flexShrink:0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4 }}>{fileName}</p>
            <a href={blobUrl} download={fileName} style={{ fontSize:12, color:C.indigo, textDecoration:'underline' }}>
              Cliquer pour télécharger
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── AnnaleCard (detail view) ───────────────────────────────────────────────── */
function AnnaleCard({ annale, yearPalette, onBack }) {
  const color = FILE_COLOR[annale.fileMimeType] || '#3b82f6';
  const label = FILE_LABEL[annale.fileMimeType];
  return (
    <motion.div key="detail" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }}
      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }} style={{ maxWidth:820 }}>

      {/* Back */}
      <motion.button onClick={onBack}
        whileHover={{ x:-3 }} whileTap={{ scale:0.97 }}
        style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, fontWeight:600, color:C.sub,
          background:C.card, border:`1.5px solid ${C.border}`, borderRadius:12, padding:'7px 14px', cursor:'pointer', marginBottom:20, boxShadow:clay.sm }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Retour
      </motion.button>

      {/* Card */}
      <div style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, overflow:'hidden' }}>
        {/* Colored band */}
        <div style={{ height:5, background:`linear-gradient(90deg,${yearPalette.from},${yearPalette.to})` }}/>

        {/* Header */}
        <div style={{ padding:'20px 24px', background:`linear-gradient(135deg,${yearPalette.from}12,${yearPalette.to}06)`, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:10 }}>
            <span style={{ fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:20, color:'#fff',
              background:`linear-gradient(135deg,${yearPalette.from},${yearPalette.to})`,
              boxShadow:`0 2px 0 ${yearPalette.dark}` }}>
              {annale.year}
            </span>
            <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20, background:`${C.indigo}12`, color:C.indigo, border:`1px solid ${C.border}` }}>
              {annale.semester}
            </span>
            <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:20, background:C.bg, color:C.sub, border:`1px solid ${C.border}` }}>
              {annale.subject}
            </span>
            {annale.hasFile && label && (
              <span style={{ fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:20, color:'#fff', background:color }}>
                {label}
              </span>
            )}
          </div>
          <h1 style={{ fontSize:18, fontWeight:900, color:C.text, lineHeight:1.3 }}>{annale.title}</h1>
          {annale.description && (
            <p style={{ fontSize:12, color:C.sub, marginTop:6, lineHeight:1.6 }}>{annale.description}</p>
          )}
        </div>

        {/* Viewer */}
        <div style={{ padding:20 }}>
          {annale.hasFile ? (
            <FileViewer annaleId={annale._id} fileMimeType={annale.fileMimeType} fileName={annale.fileName} fileSize={annale.fileSize}/>
          ) : (
            <div style={{ textAlign:'center', padding:'48px 0', color:C.sub }}>
              <p style={{ fontSize:36, marginBottom:12 }}>📄</p>
              <p style={{ fontSize:13, fontWeight:600 }}>Aucun fichier joint à cette annale</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skel({ count = 6, h = 140 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
      {[...Array(count)].map((_, i) => (
        <div key={i} style={{ height:h, borderRadius:20, background:C.border, animation:'pulse 1.5s ease-in-out infinite', animationDelay:`${i*0.1}s` }}/>
      ))}
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Annales() {
  const [annales,  setAnnales]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);

  const [view,             setView]             = useState('years');
  const [selectedYear,     setSelectedYear]     = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedSubject,  setSelectedSubject]  = useState(null);

  useEffect(() => {
    const cached = getCache('annales_list');
    if (cached) { setAnnales(cached); setLoading(false); }
    axios.get(`${API_URL}/annales`)
      .then(r => { setAnnales(r.data); setCache('annales_list', r.data); })
      .finally(() => setLoading(false));
  }, []);

  /* Build structure: year → semester → subject → [annales] */
  const structure = {};
  annales.forEach(a => {
    const yr  = (a.year     || 'Autre').trim();
    const sem = (a.semester || 'Non classé').trim();
    const sub = (a.subject  || 'Général').trim();
    if (!structure[yr])           structure[yr] = {};
    if (!structure[yr][sem])      structure[yr][sem] = {};
    if (!structure[yr][sem][sub]) structure[yr][sem][sub] = [];
    structure[yr][sem][sub].push(a);
  });

  const years     = Object.keys(structure).sort((a, b) => b.localeCompare(a));
  const semesters = selectedYear ? Object.keys(structure[selectedYear] || {}).sort() : [];
  const subjects  = (selectedYear && selectedSemester)
    ? Object.keys(structure[selectedYear]?.[selectedSemester] || {}).sort() : [];
  const currentAnnales = (selectedYear && selectedSemester && selectedSubject)
    ? (structure[selectedYear]?.[selectedSemester]?.[selectedSubject] || []) : [];

  const totalInSem = (selectedYear && selectedSemester)
    ? Object.values(structure[selectedYear]?.[selectedSemester] || {}).flat().length : 0;

  const reset = () => { setView('years'); setSelectedYear(null); setSelectedSemester(null); setSelectedSubject(null); setSelected(null); };
  const yearPalette = selectedYear ? PALETTE[years.indexOf(selectedYear) % PALETTE.length] : PALETTE[0];

  return (
    <DashboardLayout>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes drift1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-18px,12px) scale(1.05)} 66%{transform:translate(14px,-18px) scale(0.96)} }
        @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(16px,-12px) scale(1.04)} }
      `}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          {/* Orbs */}
          <div style={{ position:'absolute', top:-40, right:-30, width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,#a5b4fc,transparent)', opacity:0.2, filter:'blur(48px)', animation:'drift1 20s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-16, left:80, width:150, height:150, borderRadius:'50%', background:'radial-gradient(circle,#fbbf24,transparent)', opacity:0.12, filter:'blur(38px)', animation:'drift2 24s ease-in-out infinite', pointerEvents:'none' }} aria-hidden/>
          {/* Grid */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          {/* Shine */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 65% 15%,rgba(255,255,255,0.12),transparent 50%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}
            style={{ position:'relative', padding:'28px 24px 28px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Annales</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Sujets d'examens classés par année et semestre</p>
              </div>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              {[
                { val:annales.length, label:'Sujets', color:'#c4b5fd' },
                { val:years.length,   label:'Années',  color:'#a5b4fc' },
              ].map(s => (
                <div key={s.label} style={{ textAlign:'center' }}>
                  <p className="nunito" style={{ fontSize:22, fontWeight:900, color:s.color, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{s.val}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', marginTop:2 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:'24px 16px' }}>
          {loading ? (
            <Skel count={6} h={150}/>
          ) : (
            <>
              {/* ── Detail view ── */}
              {selected && (
                <AnnaleCard annale={selected} yearPalette={yearPalette} onBack={() => setSelected(null)}/>
              )}

              {/* ── Navigation views ── */}
              {!selected && (
                <AnimatePresence mode="wait">

                  {/* ANNÉES */}
                  {view === 'years' && (
                    <motion.div key="years-view"
                      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                      {years.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'80px 0', color:C.sub }}>
                          <p style={{ fontSize:42, marginBottom:12 }}>📅</p>
                          <p style={{ fontSize:15, fontWeight:600, color:C.text, marginBottom:6 }}>Aucune annale disponible</p>
                          <p style={{ fontSize:13 }}>Le contenu sera disponible prochainement.</p>
                        </div>
                      ) : (
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:14 }}>
                          {years.map((year, idx) => {
                            const pal      = PALETTE[idx % PALETTE.length];
                            const semCount = Object.keys(structure[year]).length;
                            const total    = Object.values(structure[year]).flatMap(s => Object.values(s)).flat().length;
                            return (
                              <motion.button key={year}
                                onClick={() => { setSelectedYear(year); setView('semesters'); }}
                                initial={{ opacity:0, y:20, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                                transition={{ delay:idx*0.07, duration:0.45, ease:[0.16,1,0.3,1] }}
                                whileHover={{ y:-6, boxShadow:`0 8px 0 ${pal.dark}, 0 16px 40px ${pal.from}60` }}
                                whileTap={{ scale:0.96 }}
                                style={{ borderRadius:22, padding:'22px', textAlign:'left', cursor:'pointer', border:'none',
                                  position:'relative', overflow:'hidden', minHeight:150,
                                  background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                                  boxShadow:`0 4px 0 ${pal.dark}, 0 8px 32px ${pal.from}50` }}>
                                <div style={{ position:'absolute', top:-24, right:-24, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.15)', filter:'blur(14px)', pointerEvents:'none' }}/>
                                <div style={{ position:'absolute', bottom:-12, left:-12, width:60, height:60, borderRadius:'50%', background:'rgba(0,0,0,0.1)', filter:'blur(10px)', pointerEvents:'none' }}/>

                                {/* Calendar icon */}
                                <div style={{ width:38, height:38, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, position:'relative' }}>
                                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                  </svg>
                                </div>

                                <h3 style={{ fontSize:20, fontWeight:900, color:'#fff', marginBottom:4, lineHeight:1.1, position:'relative' }}>{year}</h3>
                                <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginBottom:20, position:'relative' }}>
                                  {semCount} semestre{semCount>1?'s':''} · {total} sujet{total>1?'s':''}
                                </p>

                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                                  <div style={{ display:'flex', gap:4 }}>
                                    {Array.from({ length:Math.min(total,6) }).map((_,i) => (
                                      <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.55)' }}/>
                                    ))}
                                  </div>
                                  <div style={{ width:30, height:30, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* SEMESTRES */}
                  {view === 'semesters' && selectedYear && (
                    <motion.div key="sems-view"
                      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                      <Breadcrumb items={[{ label:'Annales', onClick:reset }, { label:selectedYear }]}/>
                      <div style={{ marginBottom:20 }}>
                        <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedYear}</h2>
                        <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{semesters.length} semestre{semesters.length>1?'s':''}</p>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                        {semesters.map((sem, idx) => {
                          const pal      = PALETTE[idx % PALETTE.length];
                          const subCount = Object.keys(structure[selectedYear][sem]).length;
                          const total    = Object.values(structure[selectedYear][sem]).flat().length;
                          return (
                            <motion.button key={sem}
                              onClick={() => { setSelectedSemester(sem); setView('subjects'); }}
                              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
                              transition={{ delay:idx*0.07, duration:0.4 }}
                              whileHover={{ y:-5, boxShadow:`0 6px 0 ${pal.dark}, 0 14px 32px ${pal.from}55` }}
                              whileTap={{ scale:0.97 }}
                              style={{ borderRadius:20, padding:'20px', textAlign:'left', cursor:'pointer', border:'none',
                                position:'relative', overflow:'hidden',
                                background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                                boxShadow:`0 4px 0 ${pal.dark}, 0 8px 28px ${pal.from}45` }}>
                              <div style={{ position:'absolute', top:-16, right:-16, width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(10px)', pointerEvents:'none' }}/>
                              <h3 style={{ fontSize:15, fontWeight:900, color:'#fff', marginBottom:4, position:'relative' }}>{sem}</h3>
                              <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginBottom:16, position:'relative' }}>
                                {subCount} matière{subCount>1?'s':''} · {total} sujet{total>1?'s':''}
                              </p>
                              <div style={{ display:'flex', justifyContent:'flex-end', position:'relative' }}>
                                <div style={{ width:28, height:28, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* MATIÈRES */}
                  {view === 'subjects' && selectedYear && selectedSemester && (
                    <motion.div key="subs-view"
                      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                      <Breadcrumb items={[
                        { label:'Annales',     onClick:reset },
                        { label:selectedYear,  onClick:() => { setSelectedSemester(null); setView('semesters'); } },
                        { label:selectedSemester },
                      ]}/>
                      <div style={{ marginBottom:20 }}>
                        <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedSemester} — {selectedYear}</h2>
                        <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>{totalInSem} sujet{totalInSem>1?'s':''} disponible{totalInSem>1?'s':''}</p>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12 }}>
                        {subjects.map((sub, idx) => {
                          const pal   = PALETTE[idx % PALETTE.length];
                          const count = structure[selectedYear][selectedSemester][sub].length;
                          return (
                            <motion.button key={sub}
                              onClick={() => { setSelectedSubject(sub); setView('annales'); }}
                              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                              transition={{ delay:idx*0.05, duration:0.4 }}
                              whileHover={{ y:-4, boxShadow:clay.card }}
                              whileTap={{ scale:0.97 }}
                              style={{ borderRadius:18, padding:'16px', textAlign:'left', cursor:'pointer', background:C.card,
                                border:`1.5px solid ${C.border}`, boxShadow:clay.sm, display:'flex', alignItems:'center', gap:14 }}>
                              <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                                background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                                boxShadow:`0 3px 0 ${pal.dark}, 0 6px 16px ${pal.from}40` }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                  <polyline points="14 2 14 8 20 8"/>
                                </svg>
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <h3 style={{ fontSize:13, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{sub}</h3>
                                <p style={{ fontSize:11, color:C.sub, marginTop:3 }}>{count} sujet{count>1?'s':''}</p>
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.border} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}>
                                <polyline points="9 18 15 12 9 6"/>
                              </svg>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* LISTE DES ANNALES */}
                  {view === 'annales' && selectedYear && selectedSemester && selectedSubject && (
                    <motion.div key="annales-list"
                      initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }}
                      transition={{ duration:0.35, ease:[0.16,1,0.3,1] }}>
                      <Breadcrumb items={[
                        { label:'Annales',       onClick:reset },
                        { label:selectedYear,    onClick:() => { setSelectedSemester(null); setSelectedSubject(null); setView('semesters'); } },
                        { label:selectedSemester, onClick:() => { setSelectedSubject(null); setView('subjects'); } },
                        { label:selectedSubject },
                      ]}/>
                      <div style={{ marginBottom:20 }}>
                        <h2 style={{ fontSize:22, fontWeight:900, color:C.text }}>{selectedSubject}</h2>
                        <p style={{ fontSize:12, color:C.sub, marginTop:4 }}>
                          {currentAnnales.length} sujet{currentAnnales.length>1?'s':''} · {selectedSemester} {selectedYear}
                        </p>
                      </div>

                      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14, maxWidth:860 }}>
                        {currentAnnales.map((annale, i) => {
                          const fileColor = FILE_COLOR[annale.fileMimeType] || '#3b82f6';
                          const fileLabel = FILE_LABEL[annale.fileMimeType];
                          return (
                            <motion.div key={annale._id}
                              initial={{ opacity:0, y:16, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }}
                              transition={{ delay:i<6?i*0.06:0, duration:0.4, ease:[0.16,1,0.3,1] }}
                              style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, overflow:'hidden' }}>
                              {/* Top gradient band */}
                              <div style={{ height:4, background:`linear-gradient(90deg,${yearPalette.from},${yearPalette.to})` }}/>

                              <div style={{ padding:'18px 18px 16px' }}>
                                {/* Badges */}
                                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:10 }}>
                                  {annale.hasFile && fileLabel && (
                                    <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:20, color:'#fff', background:fileColor }}>
                                      {fileLabel}
                                    </span>
                                  )}
                                  {annale.hasFile && annale.fileSize > 0 && (
                                    <span style={{ fontSize:11, color:C.sub }}>{formatSize(annale.fileSize)}</span>
                                  )}
                                </div>

                                <h3 style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.4, marginBottom:6 }}>{annale.title}</h3>
                                {annale.description && (
                                  <p style={{ fontSize:11, color:C.sub, lineHeight:1.6, marginBottom:14,
                                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                                    {annale.description}
                                  </p>
                                )}

                                {/* CTA */}
                                {annale.hasFile ? (
                                  <motion.button onClick={() => setSelected(annale)}
                                    whileHover={{ y:-3, boxShadow:clay.btn(yearPalette.from, yearPalette.dark) }}
                                    whileTap={{ scale:0.96 }}
                                    style={{ width:'100%', padding:'10px', borderRadius:14, border:'none', cursor:'pointer',
                                      fontSize:12, fontWeight:700, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                                      background:`linear-gradient(135deg,${yearPalette.from},${yearPalette.to})`,
                                      boxShadow:`0 3px 0 ${yearPalette.dark}, 0 6px 16px ${yearPalette.from}40` }}>
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                      <circle cx="12" cy="12" r="3"/>
                                    </svg>
                                    Consulter le sujet
                                  </motion.button>
                                ) : (
                                  <div style={{ width:'100%', padding:'10px', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`,
                                    fontSize:12, fontWeight:600, color:C.sub, textAlign:'center' }}>
                                    Aucun fichier joint
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
