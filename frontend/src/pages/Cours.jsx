import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';
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

/* ─── Colour palettes ────────────────────────────────────────────────────────── */
const COURS_PALETTE = [
  { from:'#6366f1', to:'#8b5cf6', dark:'#4338ca' },
  { from:'#0891b2', to:'#0284c7', dark:'#0e7490' },
  { from:'#059669', to:'#047857', dark:'#065f46' },
  { from:'#dc2626', to:'#db2777', dark:'#9f1239' },
  { from:'#ea580c', to:'#d97706', dark:'#92400e' },
  { from:'#7c3aed', to:'#6d28d9', dark:'#4c1d95' },
  { from:'#0f766e', to:'#0891b2', dark:'#134e4a' },
  { from:'#be185d', to:'#9333ea', dark:'#701a75' },
];

const FICHE_COLORS = [
  { bg:'#eff6ff', border:'#bfdbfe', accent:'#2563eb', light:'#dbeafe', text:'#1e3a5f' },
  { bg:'#f5f3ff', border:'#ddd6fe', accent:'#7c3aed', light:'#ede9fe', text:'#3b0764' },
  { bg:'#f0fdf4', border:'#bbf7d0', accent:'#16a34a', light:'#dcfce7', text:'#052e16' },
  { bg:'#fff7ed', border:'#fed7aa', accent:'#ea580c', light:'#ffedd5', text:'#431407' },
  { bg:'#fdf2f8', border:'#fbcfe8', accent:'#db2777', light:'#fce7f3', text:'#500724' },
];

const DIFF_STYLE = {
  easy:   { background:'#d1fae5', color:'#065f46' },
  medium: { background:'#fef3c7', color:'#92400e' },
  hard:   { background:'#fee2e2', color:'#991b1b' },
};
const DIFF_LABEL = { easy:'Facile', medium:'Moyen', hard:'Difficile' };

const FILE_ICON_COLOR = {
  'application/pdf':'#ef4444',
  'image/jpeg':'#10b981','image/png':'#10b981','image/webp':'#10b981',
  'application/msword':'#3b82f6',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'#3b82f6',
  'text/plain':'#6366f1',
};
const FILE_TYPE_LABEL = {
  'application/pdf':'PDF',
  'image/jpeg':'Image','image/png':'Image','image/webp':'Image',
  'application/msword':'Word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'Word',
  'text/plain':'Texte',
};

function formatSize(b) {
  if (!b) return '';
  if (b < 1024) return b + ' o';
  if (b < 1024*1024) return (b/1024).toFixed(0) + ' Ko';
  return (b/(1024*1024)).toFixed(1) + ' Mo';
}
function isImage(mime) { return mime?.startsWith('image/'); }
function isPDF(mime)   { return mime === 'application/pdf'; }

function catColor(str) {
  const CATS = ['#2563eb','#0891b2','#7c3aed','#059669','#dc2626','#ea580c','#be185d','#0f766e'];
  if (!str) return CATS[0];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h*31 + str.charCodeAt(i)) & 0xffff;
  return CATS[h % CATS.length];
}

/* ─── Breadcrumb ─────────────────────────────────────────────────────────────── */
function CoursBreadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, flexWrap:'wrap' }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          )}
          {item.onClick ? (
            <button onClick={item.onClick} style={{
              fontSize:12, fontWeight:600, color:C.indigo, background:'rgba(var(--theme-primary-rgb),0.07)',
              border:`1px solid ${C.border}`, padding:'3px 12px', borderRadius:20, cursor:'pointer',
            }}>
              {item.label}
            </button>
          ) : (
            <span style={{
              fontSize:12, fontWeight:700, color:C.text, padding:'3px 12px',
              background:C.card, border:`1px solid ${C.border}`, borderRadius:20, boxShadow:clay.sm,
            }}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ─── Spinner ────────────────────────────────────────────────────────────────── */
function Spinner({ color = C.indigo }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'48px 0' }}>
      <div style={{ width:32, height:32, border:`4px solid ${color}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
    </div>
  );
}

/* ─── FileViewer ─────────────────────────────────────────────────────────────── */
function FileViewer({ lessonId, fileMimeType, fileName, fileSize }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(false);

  useEffect(() => {
    let url;
    axios.get(`${API_URL}/lessons/${lessonId}/file`, { responseType:'arraybuffer' })
      .then(r => { const blob = new Blob([r.data],{type:fileMimeType}); url=URL.createObjectURL(blob); setBlobUrl(url); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
    return () => { if (url) URL.revokeObjectURL(url); };
  }, [lessonId, fileMimeType]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:24 }}><div style={{ width:24, height:24, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/></div>;
  if (error)   return <div style={{ textAlign:'center', padding:16, fontSize:13, color:'#f87171' }}>Impossible de charger le fichier.</div>;

  const color = FILE_ICON_COLOR[fileMimeType] || '#3b82f6';
  const label = FILE_TYPE_LABEL[fileMimeType] || 'Fichier';

  return (
    <div style={{ borderRadius:16, overflow:'hidden', border:`1.5px solid ${C.border}`, boxShadow:clay.sm }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', background:C.bg, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:6, background:color, color:'#fff' }}>{label}</span>
          <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{fileName}</span>
          {fileSize && <span style={{ fontSize:11, color:C.sub }}>{formatSize(fileSize)}</span>}
        </div>
        <a href={blobUrl} download={fileName} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:C.indigo, textDecoration:'none' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Télécharger
        </a>
      </div>
      {isImage(fileMimeType) ? (
        <div style={{ background:'#f8faff', display:'flex', justifyContent:'center', padding:16 }}>
          <img src={blobUrl} alt={fileName} style={{ maxWidth:'100%', maxHeight:'60vh', borderRadius:12, objectFit:'contain' }}/>
        </div>
      ) : isPDF(fileMimeType) ? (
        <iframe src={blobUrl} title={fileName} style={{ width:'100%', height:'60vh', border:'none' }}/>
      ) : (
        <div style={{ padding:20, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', background:color+'20' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:C.text }}>{fileName}</p>
            <a href={blobUrl} download={fileName} style={{ fontSize:12, color:C.indigo }}>Cliquez pour télécharger</a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LessonContent ──────────────────────────────────────────────────────────── */
function LessonContent({ content }) {
  if (!content?.trim()) return null;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      {content.split('\n').map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**'))
          return <h3 key={i} style={{ fontSize:13, fontWeight:800, color:C.text, marginTop:16, marginBottom:4 }}>{line.slice(2,-2)}</h3>;
        if (line.startsWith('- ') || line.match(/^\d+\.\s/))
          return (
            <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:C.indigo, flexShrink:0, marginTop:6 }}/>
              <p style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>{line.replace(/^- /,'').replace(/^\d+\.\s/,'')}</p>
            </div>
          );
        if (!line.trim()) return <div key={i} style={{ height:6 }}/>;
        return <p key={i} style={{ fontSize:13, color:'#334155', lineHeight:1.7 }}>{line}</p>;
      })}
    </div>
  );
}

/* ─── Quota helpers ──────────────────────────────────────────────────────────── */
const monthKey = () => new Date().toISOString().slice(0,7);
function getViewed(type) { return JSON.parse(localStorage.getItem(`${type}_viewed_${monthKey()}`) || '[]'); }
function addViewed(type, id) {
  const list = getViewed(type);
  if (!list.includes(id)) localStorage.setItem(`${type}_viewed_${monthKey()}`, JSON.stringify([...list, id]));
}

/* ─── QuotaModal ─────────────────────────────────────────────────────────────── */
function QuotaModal({ type, onClose }) {
  const navigate = useNavigate();
  const labels = {
    cours: { title:'Accès limité aux cours', body:'Le plan Gratuit vous permet de lire 1 cours par mois. Passez à Étudiant pour un accès illimité.' },
    fiche: { title:'Accès limité aux fiches', body:'Le plan Gratuit vous permet de consulter 1 fiche de révision par mois. Passez à Étudiant pour un accès illimité.' },
  };
  const { title, body } = labels[type] || labels.cours;
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={onClose}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
        style={{ background:C.card, borderRadius:28, padding:32, maxWidth:360, width:'100%', boxShadow:clay.card, textAlign:'center' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width:60, height:60, background:'#fef3c7', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <h3 style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>{title}</h3>
        <p style={{ fontSize:13, color:C.sub, marginBottom:24, lineHeight:1.6 }}>{body}</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
            onClick={() => navigate('/dashboard/subscription')}
            style={{ width:'100%', padding:'12px', borderRadius:16, border:'none', cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff',
              background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow:clay.btn() }}>
            Voir les abonnements
          </motion.button>
          <button onClick={onClose} style={{ width:'100%', padding:'10px', borderRadius:16, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:C.sub, background:'transparent' }}>
            Plus tard
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── CoursTab ───────────────────────────────────────────────────────────────── */
function CoursTab() {
  const { user } = useAuth();
  const isFree   = (user?.subscription || 'free') === 'free';
  const [lessons, setLessons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [quotaModal, setQuotaModal] = useState(false);
  const [view, setView]                           = useState('semesters');
  const [selectedSemester, setSelectedSemester]   = useState(null);
  const [selectedUE, setSelectedUE]               = useState(null);
  const [selectedChapter, setSelectedChapter]     = useState(null);

  useEffect(() => {
    const cached = getCache('lessons_cours');
    if (cached) { setLessons(cached); setLoading(false); }
    axios.get(`${API_URL}/lessons?type=cours`).then(r => { setLessons(r.data); setCache('lessons_cours', r.data); }).finally(() => setLoading(false));
  }, []);

  const structure = {};
  lessons.forEach(l => {
    const sem  = (l.semester || 'Non classé').trim();
    const ue   = (l.category || 'Autre').trim();
    const chap = (l.chapter  || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(l);
  });

  const semesters      = Object.keys(structure).sort();
  const ues            = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters       = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentLessons = (selectedSemester && selectedUE && selectedChapter) ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  const openLesson = async (lesson) => {
    if (isFree) {
      const viewed = getViewed('cours');
      if (!viewed.includes(lesson._id) && viewed.length >= 1) { setQuotaModal(true); return; }
      addViewed('cours', lesson._id);
    }
    setFetching(true);
    try { const { data } = await axios.get(`${API_URL}/lessons/${lesson._id}`); setSelected(data); }
    finally { setFetching(false); }
  };

  if (loading) return <Spinner/>;

  /* ── Lesson detail ── */
  if (selected) {
    const cc = catColor(selected.category);
    return (
      <motion.div key="detail" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}>
        <button onClick={() => setSelected(null)} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:C.indigo, background:'transparent', border:'none', cursor:'pointer', marginBottom:20 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          Retour
        </button>
        <div style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, overflow:'hidden', maxWidth:800 }}>
          <div style={{ height:4, background:`linear-gradient(90deg,${cc},${cc}80)` }}/>
          <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, background:`${cc}08` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:8 }}>
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, color:'#fff', background:cc }}>{selected.category}</span>
              {selected.chapter && <span style={{ fontSize:11, color:C.sub, fontWeight:500 }}>{selected.chapter}</span>}
              {DIFF_STYLE[selected.difficulty] && (
                <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, ...DIFF_STYLE[selected.difficulty] }}>{DIFF_LABEL[selected.difficulty]}</span>
              )}
            </div>
            <h1 style={{ fontSize:20, fontWeight:800, color:C.text }}>{selected.title}</h1>
            {selected.summary && <p style={{ fontSize:13, color:C.sub, marginTop:4 }}>{selected.summary}</p>}
          </div>
          <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:20 }}>
            {selected.hasFile && <FileViewer lessonId={selected._id} fileMimeType={selected.fileMimeType} fileName={selected.fileName} fileSize={selected.fileSize}/>}
            {selected.content?.trim() && <LessonContent content={selected.content}/>}
            {selected.tags?.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                {selected.tags.map(tag => (
                  <span key={tag} style={{ fontSize:11, fontWeight:600, padding:'3px 10px', borderRadius:20, background:'rgba(var(--theme-primary-rgb),0.07)', color:C.indigo }}>#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <AnimatePresence>{quotaModal && <QuotaModal type="cours" onClose={() => setQuotaModal(false)}/>}</AnimatePresence>
      <AnimatePresence mode="wait">

        {/* SEMESTRES */}
        {view === 'semesters' && (
          <motion.div key="sems" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>
            {semesters.length === 0 ? (
              <div style={{ textAlign:'center', padding:'64px 0', color:C.sub }}>
                <p style={{ fontWeight:600 }}>Aucun cours disponible</p>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
                {semesters.map((sem, idx) => {
                  const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
                  const ueCount = Object.keys(structure[sem]).length;
                  const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                  return (
                    <motion.button key={sem}
                      onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                      whileHover={{ y:-6 }} whileTap={{ scale:0.97 }}
                      transition={{ type:'spring', stiffness:300, damping:22 }}
                      style={{ position:'relative', overflow:'hidden', borderRadius:20, padding:'24px 20px', textAlign:'left', border:'none', cursor:'pointer',
                        background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                        boxShadow:`0 4px 0 ${pal.dark}, 0 8px 32px ${pal.from}50` }}>
                      <div style={{ position:'absolute', top:-16, right:-16, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(16px)' }}/>
                      <div style={{ position:'absolute', bottom:0, left:0, width:60, height:60, borderRadius:'50%', background:'rgba(0,0,0,0.12)', filter:'blur(12px)' }}/>
                      <h3 style={{ fontWeight:800, color:'#fff', fontSize:15, marginBottom:4, position:'relative' }}>{sem}</h3>
                      <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, marginBottom:16, position:'relative' }}>{ueCount} UE · {total} cours</p>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                        <div style={{ display:'flex', gap:4 }}>
                          {Array.from({ length:Math.min(ueCount,5) }).map((_,i) => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }}/>)}
                        </div>
                        <div style={{ width:32, height:32, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
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

        {/* UEs */}
        {view === 'ues' && selectedSemester && (
          <motion.div key="ues-view" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
            <CoursBreadcrumb items={[{ label:'Cours', onClick:reset }, { label:selectedSemester }]}/>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedSemester}</h2>
              <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{ues.length} unité{ues.length>1?'s':''} d'enseignement</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
              {ues.map((ue, idx) => {
                const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
                const total   = Object.values(structure[selectedSemester][ue]).flat().length;
                const chCount = Object.keys(structure[selectedSemester][ue]).length;
                return (
                  <motion.button key={ue}
                    onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                    whileHover={{ y:-4 }} whileTap={{ scale:0.97 }}
                    transition={{ type:'spring', stiffness:300, damping:22 }}
                    style={{ position:'relative', overflow:'hidden', borderRadius:18, padding:'20px 16px', textAlign:'left', border:'none', cursor:'pointer',
                      background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                      boxShadow:`0 4px 0 ${pal.dark}, 0 8px 24px ${pal.from}50` }}>
                    <div style={{ position:'absolute', top:-12, right:-12, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(12px)' }}/>
                    <h3 style={{ fontWeight:800, color:'#fff', fontSize:13, marginBottom:4, position:'relative' }}>{ue}</h3>
                    <p style={{ color:'rgba(255,255,255,0.75)', fontSize:11, marginBottom:12, position:'relative' }}>{chCount} chap. · {total} cours</p>
                    <div style={{ display:'flex', justifyContent:'flex-end', position:'relative' }}>
                      <div style={{ width:28, height:28, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* CHAPTERS */}
        {view === 'chapters' && selectedSemester && selectedUE && (
          <motion.div key="chaps" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
            <CoursBreadcrumb items={[
              { label:'Cours', onClick:reset },
              { label:selectedSemester, onClick:() => { setSelectedUE(null); setView('ues'); } },
              { label:selectedUE }
            ]}/>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedUE}</h2>
              <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{chapters.length} chapitre{chapters.length>1?'s':''}</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
              {chapters.map((chap, idx) => {
                const pal   = COURS_PALETTE[idx % COURS_PALETTE.length];
                const count = structure[selectedSemester][selectedUE][chap].length;
                return (
                  <motion.button key={chap}
                    onClick={() => { setSelectedChapter(chap); setView('lessons'); }}
                    whileHover={{ y:-3 }} whileTap={{ scale:0.98 }}
                    style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, boxShadow:clay.card,
                      padding:'16px', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                      background:`linear-gradient(135deg,${pal.from},${pal.to})`, boxShadow:`0 3px 0 ${pal.dark}` }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <h3 style={{ fontSize:13, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{chap}</h3>
                      <p style={{ fontSize:11, color:C.sub, marginTop:2 }}>{count} cours</p>
                    </div>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* LESSONS LIST */}
        {view === 'lessons' && selectedSemester && selectedUE && selectedChapter && (
          <motion.div key="lessons-view" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
            <CoursBreadcrumb items={[
              { label:'Cours', onClick:reset },
              { label:selectedSemester, onClick:() => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
              { label:selectedUE, onClick:() => { setSelectedChapter(null); setView('chapters'); } },
              { label:selectedChapter }
            ]}/>
            <div style={{ marginBottom:20 }}>
              <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedChapter}</h2>
              <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{currentLessons.length} cours</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
              {currentLessons.map((lesson, i) => {
                const cc = catColor(lesson.category);
                return (
                  <motion.button key={lesson._id}
                    onClick={() => openLesson(lesson)}
                    initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:i<6?i*0.04:0, duration:0.25 }}
                    whileHover={{ y:-4 }} whileTap={{ y:0 }}
                    style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, boxShadow:clay.card,
                      overflow:'hidden', textAlign:'left', cursor:'pointer', position:'relative' }}>
                    {fetching && <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, borderRadius:16 }}><div style={{ width:20, height:20, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/></div>}
                    <div style={{ height:4, background:`linear-gradient(90deg,${cc},${cc}80)` }}/>
                    <div style={{ padding:'14px 16px' }}>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                        <div style={{ width:38, height:38, borderRadius:12, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700,
                          background:cc+'22', color:cc, border:`1.5px solid ${cc}33` }}>
                          {lesson.category?.slice(0,2)||'?'}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:6 }}>
                            {DIFF_STYLE[lesson.difficulty] && (
                              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, ...DIFF_STYLE[lesson.difficulty] }}>{DIFF_LABEL[lesson.difficulty]}</span>
                            )}
                            {lesson.hasFile && (
                              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                                background:(FILE_ICON_COLOR[lesson.fileMimeType]||'#3b82f6')+'20',
                                color:FILE_ICON_COLOR[lesson.fileMimeType]||'#3b82f6' }}>
                                {FILE_TYPE_LABEL[lesson.fileMimeType]||'Fichier'}
                              </span>
                            )}
                          </div>
                          <h3 style={{ fontSize:13, fontWeight:700, color:C.text, lineHeight:1.4 }}>{lesson.title}</h3>
                          {lesson.summary && <p style={{ fontSize:11, color:C.sub, marginTop:4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{lesson.summary}</p>}
                        </div>
                      </div>
                      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
                        <span style={{ fontSize:11, fontWeight:700, color:C.indigo, display:'flex', alignItems:'center', gap:4 }}>
                          Lire <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                        </span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─── FicheFileCard ──────────────────────────────────────────────────────────── */
function FicheFileCard({ fiche, index }) {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const isFree    = (user?.subscription || 'free') === 'free';
  const palette   = FICHE_COLORS[index % FICHE_COLORS.length];
  const [open, setOpen]           = useState(false);
  const [fullData, setFullData]   = useState(null);
  const [loadingFull, setLoadingFull] = useState(false);
  const [quotaModal, setQuotaModal]   = useState(false);

  const handleOpen = async () => {
    if (!open && !fullData && isFree) {
      const viewed = getViewed('fiche');
      if (!viewed.includes(fiche._id) && viewed.length >= 1) { setQuotaModal(true); return; }
      addViewed('fiche', fiche._id);
    }
    if (!fullData) {
      setLoadingFull(true);
      try { const { data } = await axios.get(`${API_URL}/lessons/${fiche._id}`); setFullData(data); }
      finally { setLoadingFull(false); }
    }
    setOpen(o => !o);
  };

  const lesson = fullData || fiche;

  return (
    <>
      <AnimatePresence>
        {quotaModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
            onClick={() => setQuotaModal(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }}
              style={{ background:C.card, borderRadius:28, padding:32, maxWidth:360, width:'100%', boxShadow:clay.card, textAlign:'center' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width:60, height:60, background:'#fef3c7', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              </div>
              <h3 style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:8 }}>Accès limité aux fiches</h3>
              <p style={{ fontSize:13, color:C.sub, marginBottom:24, lineHeight:1.6 }}>Le plan Gratuit vous permet de consulter <strong>1 fiche</strong> par mois. Passez à Étudiant pour un accès illimité.</p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                  onClick={() => navigate('/dashboard/subscription')}
                  style={{ width:'100%', padding:12, borderRadius:16, border:'none', cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff',
                    background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow:clay.btn() }}>
                  Voir les abonnements
                </motion.button>
                <button onClick={() => setQuotaModal(false)} style={{ width:'100%', padding:10, borderRadius:16, border:'none', cursor:'pointer', fontSize:13, fontWeight:600, color:C.sub, background:'transparent' }}>
                  Plus tard
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ borderRadius:16, overflow:'hidden', border:`1.5px solid ${open ? palette.accent : palette.border}`, boxShadow:clay.sm, transition:'border-color 0.2s' }}>
        <button onClick={handleOpen} style={{ width:'100%', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', textAlign:'left', cursor:'pointer', border:'none', transition:'background 0.2s',
          background: open ? palette.accent : palette.bg }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4, flexWrap:'wrap' }}>
              <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20,
                background: open ? 'rgba(255,255,255,0.25)' : palette.light,
                color: open ? 'white' : palette.accent }}>
                {fiche.category}
              </span>
              {fiche.hasFile && (
                <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:20,
                  background: open ? 'rgba(255,255,255,0.15)' : palette.border,
                  color: open ? 'rgba(255,255,255,0.9)' : palette.accent }}>
                  {FILE_TYPE_LABEL[fiche.fileMimeType]||'Fichier'}
                </span>
              )}
            </div>
            <h3 style={{ fontSize:13, fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              color: open ? '#fff' : palette.text }}>{fiche.title}</h3>
            {fiche.summary && !open && (
              <p style={{ fontSize:11, marginTop:2, color:palette.accent, opacity:0.7, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{fiche.summary}</p>
            )}
          </div>
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration:0.2 }}
            style={{ width:28, height:28, borderRadius:10, flexShrink:0, marginLeft:12, display:'flex', alignItems:'center', justifyContent:'center',
              background: open ? 'rgba(255,255,255,0.2)' : palette.light }}>
            {loadingFull
              ? <div style={{ width:14, height:14, border:`2px solid ${open?'white':palette.accent}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open?'white':palette.accent} strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            }
          </motion.div>
        </button>

        <AnimatePresence>
          {open && fullData && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }}
              exit={{ height:0, opacity:0 }} transition={{ duration:0.25 }} style={{ overflow:'hidden' }}>
              <div style={{ padding:'16px', background:palette.bg, display:'flex', flexDirection:'column', gap:14 }}>
                {fullData.hasFile && <FileViewer lessonId={fullData._id} fileMimeType={fullData.fileMimeType} fileName={fullData.fileName} fileSize={fullData.fileSize}/>}
                {fullData.content?.trim() && (
                  <div>
                    {fullData.content.split('\n').map((line, i) => {
                      if (line.startsWith('**') && line.endsWith('**'))
                        return <h4 key={i} style={{ fontSize:11, fontWeight:700, color:palette.accent, marginTop:10, marginBottom:4 }}>{line.slice(2,-2)}</h4>;
                      if (line.startsWith('- ') || line.match(/^\d+\.\s/))
                        return <p key={i} style={{ fontSize:11, lineHeight:1.6, color:palette.text }}>· {line.replace(/^- /,'').replace(/^\d+\.\s/,'')}</p>;
                      if (!line.trim()) return <div key={i} style={{ height:4 }}/>;
                      return <p key={i} style={{ fontSize:11, lineHeight:1.6, color:palette.text }}>{line}</p>;
                    })}
                  </div>
                )}
                {fullData.tags?.length > 0 && (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, paddingTop:8, borderTop:`1px solid ${palette.border}` }}>
                    {fullData.tags.map(tag => <span key={tag} style={{ fontSize:10, padding:'2px 8px', borderRadius:20, background:palette.light, color:palette.accent }}>#{tag}</span>)}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

/* ─── FichesTab ──────────────────────────────────────────────────────────────── */
function FichesTab() {
  const [fiches, setFiches]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]                           = useState('semesters');
  const [selectedSemester, setSelectedSemester]   = useState(null);
  const [selectedUE, setSelectedUE]               = useState(null);
  const [selectedChapter, setSelectedChapter]     = useState(null);

  useEffect(() => {
    const cached = getCache('lessons_fiches');
    if (cached) { setFiches(cached); setLoading(false); }
    axios.get(`${API_URL}/lessons?type=fiche`).then(r => { setFiches(r.data); setCache('lessons_fiches', r.data); }).finally(() => setLoading(false));
  }, []);

  const structure = {};
  fiches.forEach(f => {
    const sem  = (f.semester || 'Non classé').trim();
    const ue   = (f.category || 'Autre').trim();
    const chap = (f.chapter  || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(f);
  });

  const semesters     = Object.keys(structure).sort();
  const ues           = selectedSemester ? Object.keys(structure[selectedSemester]||{}).sort() : [];
  const chapters      = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE]||{}).sort() : [];
  const currentFiches = (selectedSemester && selectedUE && selectedChapter) ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter]||[]) : [];
  const reset = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  if (loading) return <Spinner/>;

  return (
    <AnimatePresence mode="wait">

      {/* SEMESTRES */}
      {view === 'semesters' && (
        <motion.div key="sems-f" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>
          {semesters.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 0', color:C.sub }}>
              <p style={{ fontWeight:600 }}>Aucune fiche disponible</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:16 }}>
              {semesters.map((sem, idx) => {
                const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
                const ueCount = Object.keys(structure[sem]).length;
                const total   = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat().length;
                return (
                  <motion.button key={sem}
                    onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                    whileHover={{ y:-6 }} whileTap={{ scale:0.97 }}
                    transition={{ type:'spring', stiffness:300, damping:22 }}
                    style={{ position:'relative', overflow:'hidden', borderRadius:20, padding:'24px 20px', textAlign:'left', border:'none', cursor:'pointer',
                      background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                      boxShadow:`0 4px 0 ${pal.dark}, 0 8px 32px ${pal.from}50` }}>
                    <div style={{ position:'absolute', top:-16, right:-16, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(16px)' }}/>
                    <h3 style={{ fontWeight:800, color:'#fff', fontSize:15, marginBottom:4, position:'relative' }}>{sem}</h3>
                    <p style={{ color:'rgba(255,255,255,0.75)', fontSize:12, marginBottom:16, position:'relative' }}>{ueCount} UE · {total} fiche{total>1?'s':''}</p>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', position:'relative' }}>
                      <div style={{ display:'flex', gap:4 }}>
                        {Array.from({ length:Math.min(ueCount,5) }).map((_,i) => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:'rgba(255,255,255,0.6)' }}/>)}
                      </div>
                      <div style={{ width:32, height:32, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
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

      {/* UEs */}
      {view === 'ues' && selectedSemester && (
        <motion.div key="ues-f" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
          <CoursBreadcrumb items={[{ label:'Fiches', onClick:reset }, { label:selectedSemester }]}/>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedSemester}</h2>
            <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{ues.length} unité{ues.length>1?'s':''} d'enseignement</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
            {ues.map((ue, idx) => {
              const pal     = COURS_PALETTE[idx % COURS_PALETTE.length];
              const total   = Object.values(structure[selectedSemester][ue]).flat().length;
              const chCount = Object.keys(structure[selectedSemester][ue]).length;
              return (
                <motion.button key={ue}
                  onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                  whileHover={{ y:-4 }} whileTap={{ scale:0.97 }}
                  style={{ position:'relative', overflow:'hidden', borderRadius:18, padding:'20px 16px', textAlign:'left', border:'none', cursor:'pointer',
                    background:`linear-gradient(135deg,${pal.from},${pal.to})`,
                    boxShadow:`0 4px 0 ${pal.dark}, 0 8px 24px ${pal.from}50` }}>
                  <div style={{ position:'absolute', top:-12, right:-12, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.12)', filter:'blur(12px)' }}/>
                  <h3 style={{ fontWeight:800, color:'#fff', fontSize:13, marginBottom:4, position:'relative' }}>{ue}</h3>
                  <p style={{ color:'rgba(255,255,255,0.75)', fontSize:11, marginBottom:12, position:'relative' }}>{chCount} chap. · {total} fiche{total>1?'s':''}</p>
                  <div style={{ display:'flex', justifyContent:'flex-end', position:'relative' }}>
                    <div style={{ width:28, height:28, borderRadius:10, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* CHAPTERS */}
      {view === 'chapters' && selectedSemester && selectedUE && (
        <motion.div key="chaps-f" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
          <CoursBreadcrumb items={[
            { label:'Fiches', onClick:reset },
            { label:selectedSemester, onClick:() => { setSelectedUE(null); setView('ues'); } },
            { label:selectedUE }
          ]}/>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedUE}</h2>
            <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{chapters.length} chapitre{chapters.length>1?'s':''}</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:12 }}>
            {chapters.map((chap, idx) => {
              const pal   = COURS_PALETTE[idx % COURS_PALETTE.length];
              const count = structure[selectedSemester][selectedUE][chap].length;
              return (
                <motion.button key={chap}
                  onClick={() => { setSelectedChapter(chap); setView('fiches'); }}
                  whileHover={{ y:-3 }} whileTap={{ scale:0.98 }}
                  style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, boxShadow:clay.card,
                    padding:'16px', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                    background:`linear-gradient(135deg,${pal.from},${pal.to})`, boxShadow:`0 3px 0 ${pal.dark}` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="2" y="4" width="14" height="11" rx="2"/><rect x="8" y="9" width="14" height="11" rx="2"/></svg>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <h3 style={{ fontSize:13, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{chap}</h3>
                    <p style={{ fontSize:11, color:C.sub, marginTop:2 }}>{count} fiche{count>1?'s':''}</p>
                  </div>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.sub} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}><polyline points="9 18 15 12 9 6"/></svg>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* FICHES LIST */}
      {view === 'fiches' && selectedSemester && selectedUE && selectedChapter && (
        <motion.div key="fiches-view" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.3 }}>
          <CoursBreadcrumb items={[
            { label:'Fiches', onClick:reset },
            { label:selectedSemester, onClick:() => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
            { label:selectedUE, onClick:() => { setSelectedChapter(null); setView('chapters'); } },
            { label:selectedChapter }
          ]}/>
          <div style={{ marginBottom:20 }}>
            <h2 style={{ fontSize:20, fontWeight:900, color:C.text }}>{selectedChapter}</h2>
            <p style={{ fontSize:13, color:C.sub, marginTop:2 }}>{currentFiches.length} fiche{currentFiches.length>1?'s':''}</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:680 }}>
            {currentFiches.map((fiche, i) => <FicheFileCard key={fiche._id} fiche={fiche} index={i}/>)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── RevisionSheetCard ──────────────────────────────────────────────────────── */
const COLOR_PALETTE = {
  blue:   { bg:'#eff6ff', border:'#bfdbfe', accent:'#3b82f6', text:'#1e3a5f' },
  purple: { bg:'#f5f3ff', border:'#ddd6fe', accent:'#7c3aed', text:'#3b0764' },
  green:  { bg:'#f0fdf4', border:'#bbf7d0', accent:'#16a34a', text:'#052e16' },
  orange: { bg:'#fff7ed', border:'#fed7aa', accent:'#ea580c', text:'#431407' },
  pink:   { bg:'#fdf2f8', border:'#fbcfe8', accent:'#db2777', text:'#500724' },
};

const SECTION_ICONS = {
  definition: c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  key_points: c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  schema:     c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  remember:   c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>,
  caution:    c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  values:     c => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
};

function RevisionSheetCard({ sheet, onDelete }) {
  const palette  = COLOR_PALETTE[sheet.colorScheme] || COLOR_PALETTE.blue;
  const sections = sheet.content?.sections || [];
  return (
    <div style={{ borderRadius:16, overflow:'hidden', border:`1.5px solid ${palette.border}`, boxShadow:clay.card }}>
      <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', background:palette.accent }}>
        <div>
          <h3 style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{sheet.title}</h3>
          {sheet.category && <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{sheet.category}</p>}
        </div>
        <button onClick={() => onDelete(sheet._id)} style={{ width:28, height:28, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
      <div style={{ padding:'12px', background:palette.bg, display:'flex', flexDirection:'column', gap:8 }}>
        {sections.map((section, i) => (
          <div key={i} style={{ background:'#fff', borderRadius:12, padding:'12px', border:`1px solid ${palette.border}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
              {SECTION_ICONS[section.type]?.(palette.accent)}
              <span style={{ fontSize:11, fontWeight:700, color:palette.accent }}>{section.title}</span>
            </div>
            {(section.type === 'key_points' || section.type === 'caution' || section.type === 'values') ? (
              <ul style={{ display:'flex', flexDirection:'column', gap:4 }}>
                {(section.items||[]).map((item, j) => (
                  <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:6, fontSize:11, color:palette.text }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:palette.accent, flexShrink:0, marginTop:4 }}/>
                    {item}
                  </li>
                ))}
              </ul>
            ) : section.type === 'schema' ? (
              <div style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:6 }}>
                {(section.steps||[]).map((step, j) => (
                  <div key={j} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span style={{ fontSize:11, padding:'3px 8px', borderRadius:8, background:palette.border, color:palette.text }}>{step}</span>
                    {j < section.steps.length-1 && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={palette.accent} strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:11, lineHeight:1.6, color:palette.text }}>{section.content}</p>
            )}
          </div>
        ))}
      </div>
      <div style={{ padding:'8px 14px', textAlign:'right', background:palette.bg, borderTop:`1px solid ${palette.border}` }}>
        <span style={{ fontSize:10, color:palette.accent }}>{new Date(sheet.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'})}</span>
      </div>
    </div>
  );
}

/* ─── FichesPerso Upgrade Wall ───────────────────────────────────────────────── */
function FichesPersoUpgradeWall() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'48px 0' }}>
      <div style={{ maxWidth:420, width:'100%', textAlign:'center' }}>
        <div style={{ position:'relative', width:88, height:88, margin:'0 auto 24px' }}>
          <div style={{ width:88, height:88, borderRadius:28, background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.card }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={C.violet} strokeWidth="1.5" strokeLinecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <div style={{ position:'absolute', top:-4, right:-4, width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.btn() }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
        </div>
        <h2 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:8 }}>Fiches personnelles</h2>
        <p style={{ fontSize:13, color:C.sub, marginBottom:6, lineHeight:1.6 }}>Les fiches perso sont disponibles à partir de l'abonnement <strong style={{ color:C.indigo }}>Pro</strong>.</p>
        <p style={{ fontSize:12, color:C.sub, marginBottom:24 }}>Importez vos cours et laissez l'IA générer des fiches de révision colorées et structurées en quelques secondes.</p>
        <div style={{ background:C.card, borderRadius:18, padding:20, textAlign:'left', marginBottom:20, border:`1.5px solid ${C.border}`, boxShadow:clay.card, display:'flex', flexDirection:'column', gap:12 }}>
          {[
            'Import de PDF, images et texte',
            'Génération automatique de fiches par IA',
            'Fiches colorées, épurées et bien structurées',
            'Stockage de vos fichiers personnels',
            "Jusqu'à 5 fiches générées par jour (Pro) ou 10 (Premium)",
          ].map((text, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:'var(--theme-primary)', flexShrink:0 }}/>
              <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{text}</span>
            </div>
          ))}
        </div>
        <a href="/dashboard/subscription" style={{ display:'block', width:'100%', padding:'13px', color:'#fff', borderRadius:16, fontSize:13, fontWeight:800, textDecoration:'none', textAlign:'center', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow:clay.btn(), marginBottom:10 }}>
          Passer à Pro — Voir les offres
        </a>
        <p style={{ fontSize:11, color:C.sub }}>Sans engagement · Résiliable à tout moment</p>
      </div>
    </div>
  );
}

/* ─── FichesPersoTab ─────────────────────────────────────────────────────────── */
const PERSO_FILE_ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp';
const PERSO_FILE_MIME   = { 'application/pdf':'PDF', 'image/jpeg':'Image', 'image/png':'Image', 'image/jpg':'Image', 'image/webp':'Image' };
const PERSO_FILE_COLORS = { PDF:{ bg:'#fee2e2', color:'#ef4444' }, Image:{ bg:'#dcfce7', color:'#16a34a' } };
const SOURCE_MODES = [
  { id:'text',  label:'Texte',  icon: a => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg> },
  { id:'image', label:'Image',  icon: a => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  { id:'pdf',   label:'PDF',    icon: a => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={a} strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
];

function FichesPersoTab({ isPro }) {
  const [files, setFiles]               = useState([]);
  const [filesLoading, setFilesLoading] = useState(true);
  const [uploading, setUploading]       = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const fileInputRef = useRef(null);
  const [sheets, setSheets]               = useState([]);
  const [sheetsLoading, setSheetsLoading] = useState(true);
  const [status, setStatus]               = useState(null);
  const [generating, setGenerating]       = useState(false);
  const [sourceMode, setSourceMode]       = useState('text');
  const [courseText, setCourseText]       = useState('');
  const [aiFile, setAiFile]               = useState(null);
  const [title, setTitle]                 = useState('');
  const [category, setCategory]           = useState('');
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState('');
  const aiFileRef = useRef(null);

  useEffect(() => {
    if (!isPro) { setFilesLoading(false); setSheetsLoading(false); return; }
    const cf = getCache('user_files'); const cs = getCache('user_sheets');
    if (cf) { setFiles(cf); setFilesLoading(false); }
    if (cs) { setSheets(cs); setSheetsLoading(false); }
    axios.get(`${API_URL}/files`).then(r => { setFiles(r.data); setCache('user_files',r.data); }).finally(() => setFilesLoading(false));
    axios.get(`${API_URL}/sheets`).then(r => { setSheets(r.data); setCache('user_sheets',r.data); }).finally(() => setSheetsLoading(false));
    axios.get(`${API_URL}/sheets/gen-status`).then(r => setStatus(r.data)).catch(() => {});
  }, [isPro]);

  if (!isPro) return <FichesPersoUpgradeWall/>;

  const handleUpload = async (file) => {
    if (!file) return;
    const allowed = ['application/pdf','image/jpeg','image/png','image/jpg','image/webp'];
    if (!allowed.includes(file.type)) { alert('Seuls les PDF et images sont acceptés.'); return; }
    setUploading(true);
    const fd = new FormData(); fd.append('file', file); fd.append('name', file.name);
    try { const { data } = await axios.post(`${API_URL}/files/upload`, fd, { headers:{ 'Content-Type':'multipart/form-data' } }); setFiles(prev => [data,...prev]); }
    catch (err) { alert(err.response?.data?.message || "Erreur lors de l'envoi"); }
    setUploading(false);
  };

  const handleDeleteFile  = async (id) => { try { await axios.delete(`${API_URL}/files/${id}`); setFiles(prev => prev.filter(f => f._id!==id)); } catch {} };
  const handleDeleteSheet = async (id) => { try { await axios.delete(`${API_URL}/sheets/${id}`); setSheets(prev => prev.filter(s => s._id!==id)); } catch {} };
  const canGenerate = () => sourceMode==='text' ? courseText.length>=30 : !!aiFile;

  const handleGenerate = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setGenerating(true);
    try {
      const fd = new FormData();
      fd.append('sourceType', sourceMode); fd.append('title', title); fd.append('category', category);
      if (sourceMode==='text') fd.append('courseText', courseText);
      else if (aiFile) fd.append('file', aiFile);
      const { data } = await axios.post(`${API_URL}/sheets/generate`, fd);
      const full = await axios.get(`${API_URL}/sheets/${data.sheet._id}`);
      setSheets(prev => [full.data,...prev]);
      setStatus(s => s ? { ...s, used:s.used+1, remaining:s.remaining-1 } : null);
      setSuccess(`Fiche "${data.sheet.title}" générée !`);
      setCourseText(''); setTitle(''); setCategory(''); setAiFile(null);
    } catch (err) { setError(err.response?.data?.message || 'Erreur lors de la génération.'); }
    setGenerating(false);
  };

  const inputStyle = { width:'100%', padding:'10px 14px', borderRadius:12, border:`1.5px solid ${C.border}`, background:'#fff', fontSize:13, color:C.text, outline:'none', boxSizing:'border-box', boxShadow:clay.sm };

  return (
    <div style={{ maxWidth:740, display:'flex', flexDirection:'column', gap:32 }}>
      {/* Mes fichiers */}
      <section>
        <h2 style={{ fontSize:14, fontWeight:800, color:C.text, marginBottom:4 }}>Mes fichiers</h2>
        <p style={{ fontSize:12, color:C.sub, marginBottom:16 }}>Déposez vos fiches PDF ou photos de cours pour les retrouver facilement.</p>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f=e.dataTransfer.files[0]; if(f) handleUpload(f); }}
          onClick={() => fileInputRef.current?.click()}
          style={{ border:`2px dashed ${dragOver?C.indigo:C.border}`, borderRadius:16, padding:24, textAlign:'center', cursor:'pointer', marginBottom:16, transition:'all 0.18s',
            background: dragOver ? `${C.indigo}08` : C.card, boxShadow:clay.sm }}>
          <input ref={fileInputRef} type="file" style={{ display:'none' }} accept={PERSO_FILE_ACCEPT} onChange={e => { if(e.target.files[0]) handleUpload(e.target.files[0]); e.target.value=''; }}/>
          {uploading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
              <div style={{ width:24, height:24, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>
              <p style={{ fontSize:13, color:C.indigo, fontWeight:600 }}>Envoi en cours...</p>
            </div>
          ) : (
            <>
              <div style={{ width:40, height:40, borderRadius:14, background:'rgba(var(--theme-primary-rgb),0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', boxShadow:clay.sm }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.indigo} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p style={{ fontSize:13, fontWeight:600, color:C.text, marginBottom:4 }}>Glissez ou cliquez pour déposer</p>
              <p style={{ fontSize:11, color:C.sub }}>PDF et images (JPG, PNG, WebP) · Max 8 Mo</p>
            </>
          )}
        </div>
        {filesLoading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:16 }}><div style={{ width:20, height:20, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/></div>
        ) : files.length === 0 ? (
          <p style={{ fontSize:12, color:C.sub, textAlign:'center', padding:16 }}>Aucun fichier déposé pour l'instant.</p>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {files.map(file => {
              const typeLabel = PERSO_FILE_MIME[file.mimetype] || 'Fichier';
              const tc = PERSO_FILE_COLORS[typeLabel] || { bg:C.bg, color:C.indigo };
              return (
                <div key={file._id} style={{ background:C.card, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, boxShadow:clay.sm }}>
                  <div style={{ width:36, height:36, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, background:tc.bg, color:tc.color }}>{typeLabel.slice(0,3)}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{file.name}</p>
                    <p style={{ fontSize:11, color:C.sub, marginTop:1 }}>{formatSize(file.size)} · {new Date(file.createdAt).toLocaleDateString('fr-FR',{day:'2-digit',month:'short'})}</p>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:4, flexShrink:0 }}>
                    <a href={`${API_URL}/files/${file._id}/download`} target="_blank" rel="noopener noreferrer"
                      style={{ width:30, height:30, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:C.sub, background:'transparent', border:'none', cursor:'pointer', textDecoration:'none' }}
                      title="Ouvrir">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </a>
                    <button onClick={() => handleDeleteFile(file._id)}
                      style={{ width:30, height:30, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fca5a5', background:'transparent', border:'none', cursor:'pointer' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div style={{ height:1, background:C.border }}/>

      {/* Fiches IA */}
      <section>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <h2 style={{ fontSize:14, fontWeight:800, color:C.text }}>Fiches générées par IA</h2>
          <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:20, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff' }}>Pro</span>
        </div>
        <p style={{ fontSize:12, color:C.sub, marginBottom:16 }}>Importez votre cours (texte, image ou PDF) — l'IA génère une fiche colorée et structurée.</p>

        {status && (
          <div style={{ background:C.card, borderRadius:14, border:`1.5px solid ${C.border}`, padding:'14px 16px', marginBottom:16, display:'flex', alignItems:'center', gap:16, boxShadow:clay.sm }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:6 }}>
                <span style={{ fontWeight:600, color:C.text }}>Fiches générées aujourd'hui</span>
                <span style={{ fontWeight:700, color: status.remaining===0 ? '#ef4444' : C.indigo }}>{status.used}/{status.limit}</span>
              </div>
              <div style={{ height:6, background:C.bg, borderRadius:6, overflow:'hidden' }}>
                <div style={{ height:6, borderRadius:6, transition:'width 0.3s', width:`${Math.min((status.used/status.limit)*100,100)}%`,
                  background: status.remaining===0 ? '#f87171' : 'linear-gradient(90deg,var(--theme-primary),var(--theme-secondary))' }}/>
              </div>
            </div>
            <p style={{ fontSize:12, color:C.sub, flexShrink:0 }}>{status.remaining} restante{status.remaining!==1?'s':''}</p>
          </div>
        )}

        <form onSubmit={handleGenerate} style={{ background:C.card, borderRadius:18, border:`1.5px solid ${C.border}`, padding:20, marginBottom:20, display:'flex', flexDirection:'column', gap:16, boxShadow:clay.card }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div>
              <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:6 }}>Titre</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Hémostase" style={inputStyle}/>
            </div>
            <div>
              <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:6 }}>UE / Matière</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: UE 2.4" style={inputStyle}/>
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:C.sub, marginBottom:8 }}>Source du contenu *</label>
            <div style={{ display:'flex', gap:8, marginBottom:12 }}>
              {SOURCE_MODES.map(m => (
                <button key={m.id} type="button" onClick={() => { setSourceMode(m.id); setAiFile(null); }}
                  style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:12, fontSize:12, fontWeight:700, cursor:'pointer', border:`1.5px solid ${sourceMode===m.id ? 'transparent' : C.border}`, transition:'all 0.18s',
                    background: sourceMode===m.id ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : C.card,
                    color: sourceMode===m.id ? '#fff' : C.sub,
                    boxShadow: sourceMode===m.id ? clay.btn() : clay.sm }}>
                  {m.icon(sourceMode===m.id ? '#fff' : C.sub)} {m.label}
                </button>
              ))}
            </div>

            {sourceMode === 'text' && (
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:11, color:C.sub }}>Collez ou saisissez votre cours</span>
                  <span style={{ fontSize:11, fontWeight:600, color: courseText.length<30 ? '#f87171' : '#10b981' }}>{courseText.length} car.</span>
                </div>
                <textarea value={courseText} onChange={e => setCourseText(e.target.value)} rows={6}
                  placeholder="Collez votre cours ici (notes, polycopié, manuel...)"
                  style={{ ...inputStyle, resize:'none', height:'auto', background:C.bg }}/>
              </div>
            )}

            {(sourceMode === 'image' || sourceMode === 'pdf') && (
              <div>
                <input ref={aiFileRef} type="file" accept={sourceMode==='pdf'?'.pdf':'.jpg,.jpeg,.png,.webp'} style={{ display:'none' }} onChange={e => { if(e.target.files[0]) setAiFile(e.target.files[0]); e.target.value=''; }}/>
                {aiFile ? (
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:'rgba(var(--theme-primary-rgb),0.03)', borderRadius:12, border:`1.5px solid ${C.border}` }}>
                    <div style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:sourceMode==='pdf'?'#fee2e2':'#dcfce7' }}>
                      {sourceMode==='pdf' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{aiFile.name}</p>
                      <p style={{ fontSize:11, color:C.sub }}>{formatSize(aiFile.size)}</p>
                    </div>
                    <button type="button" onClick={() => setAiFile(null)} style={{ fontSize:11, color:'#f87171', background:'transparent', border:'none', cursor:'pointer', padding:'4px 8px', borderRadius:8 }}>Retirer</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => aiFileRef.current?.click()}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'14px 16px', border:`2px dashed ${C.border}`, borderRadius:12, background:C.bg, cursor:'pointer' }}>
                    <div style={{ width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, background:sourceMode==='pdf'?'#fee2e2':'#dcfce7' }}>
                      {sourceMode==='pdf' ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      }
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <p style={{ fontSize:13, fontWeight:600, color:C.text }}>{sourceMode==='pdf'?'Choisir un PDF':'Choisir une image (photo de cours)'}</p>
                      <p style={{ fontSize:11, color:C.sub }}>{sourceMode==='pdf'?'Fichier .pdf · max 10 Mo':'JPG, PNG, WebP · max 10 Mo'}</p>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>

          {error   && <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#dc2626' }}>{error}</div>}
          {success && <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'10px 14px', fontSize:12, color:'#166534', fontWeight:600 }}>{success}</div>}

          <motion.button type="submit" disabled={!canGenerate() || generating || status?.remaining===0}
            whileHover={{ opacity:0.92 }} whileTap={{ scale:0.98 }}
            style={{ width:'100%', padding:'13px', border:'none', borderRadius:14, cursor:'pointer', fontSize:13, fontWeight:800, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow:clay.btn(), opacity:(!canGenerate()||generating||status?.remaining===0)?0.5:1 }}>
            {generating ? <><div style={{ width:16, height:16, border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/>Génération en cours...</> : 'Générer la fiche'}
          </motion.button>
        </form>

        {sheetsLoading ? (
          <div style={{ display:'flex', justifyContent:'center', padding:24 }}><div style={{ width:24, height:24, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/></div>
        ) : sheets.length === 0 ? (
          <p style={{ fontSize:12, color:C.sub, textAlign:'center', padding:16 }}>Aucune fiche générée pour l'instant.</p>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {sheets.map(sheet => (
              sheet.content
                ? <RevisionSheetCard key={sheet._id} sheet={sheet} onDelete={handleDeleteSheet}/>
                : <div key={sheet._id} style={{ background:C.card, borderRadius:14, border:`1.5px solid ${C.border}`, padding:16, boxShadow:clay.sm }}>
                    <p style={{ fontSize:13, fontWeight:600, color:C.text }}>{sheet.title}</p>
                    <button onClick={() => handleDeleteSheet(sheet._id)} style={{ fontSize:11, color:'#f87171', background:'transparent', border:'none', cursor:'pointer', marginTop:8 }}>Supprimer</button>
                  </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
export default function Cours() {
  const { user } = useAuth();
  const [tab, setTab] = useState('cours');
  const isPro = ['pro','premium'].includes(user?.subscription);

  const tabs = [
    { id:'cours',  label:'Cours' },
    { id:'fiches', label:'Fiches' },
    { id:'perso',  label:'Fiches perso' },
  ];

  return (
    <DashboardLayout>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-40, right:-32, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter:'blur(40px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:80, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.08),transparent)', filter:'blur(32px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
            style={{ position:'relative', padding:'28px 24px 0' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center',
                background:'rgba(255,255,255,0.18)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Cours & Fiches</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Consultez les cours, révisez et créez vos fiches</p>
              </div>
            </div>
            <p style={{ fontSize:13, color:'rgba(196,181,253,0.7)', marginBottom:20, maxWidth:480 }}>
              Consultez les cours, révisez avec les fiches officielles, créez vos fiches personnelles avec l'IA.
            </p>

            {/* Tabs */}
            <div style={{ display:'flex', gap:6 }}>
              {tabs.map(t => (
                <motion.button key={t.id} onClick={() => setTab(t.id)}
                  whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  style={{ padding:'8px 16px', borderRadius:'16px 16px 0 0', border:'none', cursor:'pointer', fontSize:13, fontWeight:700, transition:'all 0.2s',
                    background: tab===t.id ? C.bg : 'rgba(255,255,255,0.12)',
                    color: tab===t.id ? C.indigo : 'rgba(255,255,255,0.8)',
                  }}>
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ padding:'24px 16px' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
              transition={{ duration:0.25 }}>
              {tab==='cours'  && <CoursTab/>}
              {tab==='fiches' && <FichesTab/>}
              {tab==='perso'  && <FichesPersoTab isPro={isPro}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
}
