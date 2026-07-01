/**
 * Quiz — Clay 3D Light
 * Design cohérent avec Dashboard (même tokens, clay shadows, Nunito+DM Sans)
 * Logique 100% identique, uniquement la couche visuelle est refaite
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL, useAuth } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens (identiques au Dashboard) ────────────────────────────── */
const C = {
  bg:     'var(--theme-bg)',
  card:   '#FFFFFF',
  text:   'var(--theme-text)',
  muted:  '#6b7280',
  border: 'var(--theme-border)',
  indigo: 'var(--theme-primary)',
  violet: 'var(--theme-secondary)',
  teal:   '#0891b2',
  pink:   '#EC4899',
  amber:  '#F59E0B',
  green:  '#10B981',
  red:    '#DC2626',
};

const clay = {
  card: `inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(0,0,0,0.03), 0 4px 0 rgba(0,0,0,0.06), 0 12px 28px rgba(var(--theme-primary-rgb),0.08), 0 24px 48px rgba(0,0,0,0.04)`,
  sm:   `inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 0 rgba(0,0,0,0.07), 0 8px 16px rgba(0,0,0,0.07)`,
  btn:  (hex, dark) => hex
    ? `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 ${dark}, 0 14px 28px ${hex}55`
    : `inset 0 1px 0 rgba(255,255,255,0.28), inset 0 -3px 0 rgba(0,0,0,0.22), 0 8px 0 var(--theme-dark), 0 14px 28px rgba(var(--theme-primary-rgb),0.33)`,
};

const PALETTE = [
  { from: '#4F46E5', to: '#7C3AED', dark: '#312e81' },
  { from: '#0891b2', to: '#0284c7', dark: '#164e63' },
  { from: '#059669', to: '#047857', dark: '#064e3b' },
  { from: '#dc2626', to: '#db2777', dark: '#7f1d1d' },
  { from: '#ea580c', to: '#d97706', dark: '#7c2d12' },
  { from: '#7c3aed', to: '#6d28d9', dark: '#4c1d95' },
  { from: '#0f766e', to: '#0891b2', dark: '#134e4a' },
  { from: '#be185d', to: '#9333ea', dark: '#701a75' },
];

const DIFF = {
  easy:   { label: 'Facile',    bg: '#dcfce7', color: '#15803d' },
  medium: { label: 'Moyen',     bg: '#fef9c3', color: '#854d0e' },
  hard:   { label: 'Difficile', bg: '#fee2e2', color: '#991b1b' },
};

const sp = { type: 'spring', stiffness: 300, damping: 24 };

/* ─── Breadcrumb ─────────────────────────────────────────────────────────── */
function Breadcrumb({ items }) {
  return (
    <nav style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:20 }}>
      {items.map((item, i) => (
        <span key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
          {i > 0 && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>}
          {item.onClick
            ? <button onClick={item.onClick} style={{ background:'none', border:'none', cursor:'pointer', fontSize:12, fontWeight:600, color:C.indigo, padding:0, fontFamily:'DM Sans,sans-serif' }}>{item.label}</button>
            : <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:'Nunito,sans-serif' }}>{item.label}</span>
          }
        </span>
      ))}
    </nav>
  );
}

/* ─── Section header ─────────────────────────────────────────────────────── */
function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom:22 }}>
      <h2 style={{ fontSize:20, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', lineHeight:1.2, marginBottom:4 }}>{title}</h2>
      {sub && <p style={{ fontSize:13, color:C.muted }}>{sub}</p>}
    </div>
  );
}

/* ─── Clay chip (diff / status) ──────────────────────────────────────────── */
function Chip({ label, bg, color }) {
  return (
    <span style={{ fontSize:11, fontWeight:700, background:bg, color, borderRadius:99, padding:'4px 10px', fontFamily:'Nunito,sans-serif', whiteSpace:'nowrap' }}>
      {label}
    </span>
  );
}

/* ─── Gradient semestre / UE card (3D clay) ─────────────────────────────── */
function GradCard({ pal, title, sub, sub2, onClick, progress }) {
  const [state, setState] = useState('idle');
  const shadows = {
    idle:    clay.btn(pal.from, pal.dark),
    hovered: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(0,0,0,0.18), 0 14px 0 ${pal.dark}, 0 22px 44px ${pal.from}66`,
    pressed: `inset 0 3px 8px rgba(0,0,0,0.25), 0 2px 0 ${pal.dark}, 0 4px 12px ${pal.from}33`,
  };
  return (
    <motion.button
      onClick={onClick}
      animate={{ y: state === 'pressed' ? 6 : state === 'hovered' ? -8 : 0, scale: state === 'pressed' ? 0.96 : state === 'hovered' ? 1.03 : 1 }}
      transition={sp}
      onHoverStart={() => setState('hovered')} onHoverEnd={() => setState('idle')}
      onTapStart={() => setState('pressed')} onTap={() => setState('hovered')} onTapCancel={() => setState('idle')}
      style={{ textAlign:'left', border:'none', cursor:'pointer', borderRadius:24, padding:'22px 20px', background:`linear-gradient(135deg, ${pal.from}, ${pal.to})`, position:'relative', overflow:'hidden', boxShadow:shadows[state], transition:'box-shadow 0.14s ease', width:'100%', minHeight:168, display:'flex', flexDirection:'column' }}
    >
      {/* shine */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(148deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.06) 40%, transparent 65%)', borderRadius:24, pointerEvents:'none' }} aria-hidden/>
      {/* bottom vignette */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:40, background:'linear-gradient(to top, rgba(0,0,0,0.18), transparent)', borderRadius:'0 0 24px 24px', pointerEvents:'none' }} aria-hidden/>

      {/* Contenu : flex colonne — texte en haut, chevron toujours en bas */}
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column' }}>
        {/* Zone texte */}
        <div>
          <h3 style={{ fontSize:14, fontWeight:900, color:'#fff', fontFamily:'Nunito,sans-serif', lineHeight:1.3, marginBottom:4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{title}</h3>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.75)', marginBottom:sub2 ? 3 : 0 }}>{sub}</p>
          {sub2 && <p style={{ fontSize:11, color:'rgba(255,255,255,0.9)', fontWeight:700 }}>{sub2}</p>}
        </div>

        {/* Zone basse : barre + chevron, toujours collée en bas */}
        <div style={{ marginTop:'auto', paddingTop:12 }}>
          {progress != null && (
            <div style={{ height:4, background:'rgba(255,255,255,0.25)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
              <div style={{ height:'100%', borderRadius:99, background:'rgba(255,255,255,0.9)', width:`${progress}%`, transition:'width 0.8s ease' }}/>
            </div>
          )}
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <div style={{ width:30, height:30, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

/* ─── Quiz Generator ─────────────────────────────────────────────────────── */
function QuizGenerator({ onGenerated }) {
  const [courseText, setCourseText] = useState('');
  const [title, setTitle]           = useState('');
  const [category, setCategory]     = useState('');
  const [chapter, setChapter]       = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [status, setStatus]         = useState(null);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/quizzes/gen-status`).then(r => setStatus(r.data)).catch(() => {});
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setGenerating(true);
    try {
      const { data } = await axios.post(`${API_URL}/quizzes/generate`, { courseText, title, category, chapter, questionCount });
      setStatus(s => s ? { ...s, used: s.used + 1, remaining: s.remaining - 1 } : null);
      setSuccess(`Quiz "${data.quiz.title}" généré avec succès !`);
      setCourseText(''); setTitle('');
      onGenerated(data.quiz);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la génération.');
    } finally { setGenerating(false); }
  };

  const charCount = courseText.length;
  const isReady   = charCount >= 50 && status?.remaining > 0;

  const inputStyle = {
    width:'100%', padding:'10px 14px', borderRadius:14, border:`1.5px solid ${C.border}`,
    background:C.card, fontSize:13, color:C.text, outline:'none', fontFamily:'DM Sans,sans-serif',
    boxSizing:'border-box', transition:'border-color 0.2s',
  };

  return (
    <div style={{ maxWidth:680 }}>
      {status && (
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          style={{ background:C.card, borderRadius:20, boxShadow:clay.card, border:`1px solid ${C.border}`, padding:'18px 22px', marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:12, fontWeight:700, color:C.text, fontFamily:'Nunito,sans-serif' }}>Générations aujourd'hui</span>
            <span style={{ fontSize:12, fontWeight:800, color:status.remaining === 0 ? C.red : C.indigo, fontFamily:'Nunito,sans-serif' }}>{status.used} / {status.limit}</span>
          </div>
          <div style={{ height:8, background:C.border, borderRadius:99, overflow:'hidden', boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
            <motion.div
              initial={{ width:0 }} animate={{ width:`${(status.used/status.limit)*100}%` }}
              transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
              style={{ height:'100%', borderRadius:99, background:status.remaining===0 ? `linear-gradient(90deg,${C.red},#f87171)` : `linear-gradient(90deg,${C.indigo},${C.violet})` }}
            />
          </div>
          <p style={{ fontSize:11, color:C.muted, marginTop:6 }}>
            {status.remaining > 0 ? `${status.remaining} génération${status.remaining>1?'s':''} restante${status.remaining>1?'s':''} aujourd'hui` : 'Limite journalière atteinte — réessayez demain'}
          </p>
        </motion.div>
      )}

      <motion.form onSubmit={handleGenerate} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
        style={{ background:C.card, borderRadius:24, boxShadow:clay.card, border:`1px solid ${C.border}`, padding:'24px 26px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14, marginBottom:14 }}>
          {[
            { label:'Titre du quiz', val:title, set:setTitle, ph:'Ex: Cours sur l\'hémostase' },
            { label:'UE / Catégorie', val:category, set:setCategory, ph:'Ex: UE 2.2' },
            { label:'Chapitre', val:chapter, set:setChapter, ph:'Ex: Hémostase primaire' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{f.label}</label>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={inputStyle} onFocus={e => e.target.style.borderColor=C.indigo} onBlur={e => e.target.style.borderColor=C.border}/>
            </div>
          ))}
          <div>
            <label style={{ fontSize:11, fontWeight:700, color:C.muted, display:'block', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>Nombre de questions</label>
            <select value={questionCount} onChange={e => setQuestionCount(+e.target.value)} style={inputStyle} onFocus={e => e.target.style.borderColor=C.indigo} onBlur={e => e.target.style.borderColor=C.border}>
              {[3,5,7,10].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom:16 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <label style={{ fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.06em' }}>Texte du cours *</label>
            <span style={{ fontSize:11, fontWeight:700, color:charCount<50?C.red:C.green }}>{charCount} / 4500</span>
          </div>
          <textarea value={courseText} onChange={e => setCourseText(e.target.value)}
            placeholder="Collez ici votre cours, vos notes de TD, un extrait de polycopié... (minimum 50 caractères)"
            rows={7} maxLength={4500}
            style={{ ...inputStyle, resize:'none', lineHeight:1.65, background:'#f8faff', padding:'12px 14px' }}
            onFocus={e => e.target.style.borderColor=C.indigo} onBlur={e => e.target.style.borderColor=C.border}/>
          <p style={{ fontSize:11, color:C.muted, marginTop:4 }}>L'IA analyse votre texte et génère des QCM pertinents.</p>
        </div>

        {error && (
          <div style={{ background:'#fef2f2', border:`1px solid #fecaca`, borderRadius:14, padding:'10px 14px', fontSize:12, color:C.red, marginBottom:12 }}>{error}</div>
        )}
        {success && (
          <div style={{ background:'#f0fdf4', border:`1px solid #bbf7d0`, borderRadius:14, padding:'10px 14px', fontSize:12, color:C.green, fontWeight:600, marginBottom:12 }}>{success}</div>
        )}

        <motion.button type="submit" disabled={!isReady || generating}
          whileHover={{ scale: isReady ? 1.01 : 1 }} whileTap={{ scale: isReady ? 0.97 : 1 }}
          style={{ width:'100%', padding:'13px 0', borderRadius:16, border:'none', background:isReady ? 'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))' : 'var(--theme-border)', color:isReady?'#fff':C.muted, fontSize:14, fontWeight:800, cursor:isReady?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'Nunito,sans-serif', boxShadow:isReady?clay.btn():'none', transition:'all 0.2s' }}>
          {generating
            ? <><div style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/> Génération en cours...</>
            : 'Générer le quiz ✦'
          }
        </motion.button>
      </motion.form>
    </div>
  );
}

/* ─── Personal quiz list ─────────────────────────────────────────────────── */
function PersonalQuizList({ quizzes, onDelete, onPlay }) {
  const [deletingId, setDeletingId] = useState(null);

  const confirmDelete = async (id) => {
    setDeletingId(id);
    try { await axios.delete(`${API_URL}/quizzes/personal/${id}`); onDelete(id); } catch {}
    setDeletingId(null);
  };

  if (quizzes.length === 0) return (
    <div style={{ textAlign:'center', padding:'48px 24px', color:C.muted }}>
      <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
      <p style={{ fontWeight:700, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:4 }}>Aucun quiz généré</p>
      <p style={{ fontSize:13 }}>Utilisez le générateur ci-dessus pour créer votre premier quiz.</p>
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
      <AnimatePresence>
        {quizzes.map((quiz, i) => (
          <motion.div key={quiz._id}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
            transition={{ delay: i*0.05 }}
            style={{ background:C.card, borderRadius:20, boxShadow:clay.card, border:`1px solid ${C.border}`, overflow:'hidden' }}
          >
            <div style={{ height:4, background:'linear-gradient(90deg,var(--theme-primary),var(--theme-secondary))' }}/>
            <div style={{ padding:'18px 20px' }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8, marginBottom:10 }}>
                <div style={{ minWidth:0 }}>
                  <h3 style={{ fontSize:13, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif', lineHeight:1.3 }}>{quiz.title}</h3>
                  <p style={{ fontSize:11, color:C.muted, marginTop:2 }}>{quiz.chapter || quiz.category} · {quiz.questions?.length} questions</p>
                </div>
                <motion.button onClick={() => confirmDelete(quiz._id)} disabled={deletingId===quiz._id}
                  whileHover={{ scale:1.1 }} whileTap={{ scale:0.9 }}
                  style={{ width:30, height:30, borderRadius:10, background:'#fef2f2', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </motion.button>
              </div>
              <p style={{ fontSize:11, color:C.muted, marginBottom:14 }}>
                {new Date(quiz.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' })}
              </p>
              <motion.button onClick={() => onPlay(quiz._id)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                style={{ width:'100%', padding:'13px 0', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn() }}>
                Commencer →
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ─── Pro prompt ─────────────────────────────────────────────────────────── */
function ProFeaturePrompt() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth:420, margin:'0 auto', textAlign:'center', padding:'48px 24px' }}>
      <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={sp}
        style={{ width:72, height:72, borderRadius:24, margin:'0 auto 20px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))', boxShadow:clay.btn() }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
        </svg>
      </motion.div>
      <h3 style={{ fontSize:18, fontWeight:900, color:C.text, fontFamily:'Nunito,sans-serif', marginBottom:8 }}>Fonctionnalité Pro</h3>
      <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:24 }}>
        La génération de quiz depuis vos cours est réservée aux abonnements <strong style={{ color:C.indigo }}>Pro</strong> et <strong style={{ color:C.indigo }}>Premium</strong>. Créez jusqu'à 10 quiz personnalisés par jour.
      </p>
      <motion.button onClick={() => navigate('/dashboard/subscription')} whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
        style={{ padding:'12px 32px', borderRadius:16, border:'none', background:'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))', color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn() }}>
        Voir les offres →
      </motion.button>
    </div>
  );
}

/* ─── Skeleton loader ────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
      {[...Array(6)].map((_,i) => (
        <div key={i} style={{ height:140, borderRadius:24, background:'linear-gradient(135deg,var(--theme-border),var(--theme-shadow))', opacity:0.6+(i*0.06), animation:'pulse 1.5s ease-in-out infinite' }}/>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════════════════════ */
export default function Quiz() {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const [tab, setTab]             = useState('catalogue');
  const [quizzes, setQuizzes]     = useState([]);
  const [personalQuizzes, setPersonalQuizzes] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [personalLoading, setPersonalLoading] = useState(false);
  const [view, setView]               = useState('semesters');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedUE, setSelectedUE]             = useState(null);
  const [selectedChapter, setSelectedChapter]   = useState(null);
  const [quotaModal, setQuotaModal]   = useState(false);

  const isPro = ['pro', 'premium'].includes(user?.subscription);

  const handlePlay = async (id) => {
    if (!isPro) {
      try {
        const { data } = await axios.get(`${API_URL}/quizzes/quota`);
        if (data.exceeded) { setQuotaModal(true); return; }
      } catch {}
    }
    navigate(`/dashboard/quiz/${id}`);
  };

  useEffect(() => {
    const cached = getCache('quizzes_list');
    if (cached) { setQuizzes(cached); setLoading(false); }
    axios.get(`${API_URL}/quizzes`).then(r => {
      setQuizzes(r.data);
      setCache('quizzes_list', r.data);
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'personnalises' && isPro && personalQuizzes.length === 0) {
      setPersonalLoading(true);
      axios.get(`${API_URL}/quizzes/personal`).then(r => setPersonalQuizzes(r.data)).finally(() => setPersonalLoading(false));
    }
  }, [tab, isPro]); // eslint-disable-line

  const structure = {};
  quizzes.forEach(q => {
    const sem  = (q.semester  || 'Non classé').trim();
    const ue   = (q.category  || 'Autre').trim();
    const chap = (q.chapter   || 'Général').trim();
    if (!structure[sem]) structure[sem] = {};
    if (!structure[sem][ue]) structure[sem][ue] = {};
    if (!structure[sem][ue][chap]) structure[sem][ue][chap] = [];
    structure[sem][ue][chap].push(q);
  });

  const semesters      = Object.keys(structure).sort();
  const ues            = selectedSemester ? Object.keys(structure[selectedSemester] || {}).sort() : [];
  const chapters       = (selectedSemester && selectedUE) ? Object.keys(structure[selectedSemester]?.[selectedUE] || {}).sort() : [];
  const currentQuizzes = (selectedSemester && selectedUE && selectedChapter)
    ? (structure[selectedSemester]?.[selectedUE]?.[selectedChapter] || []) : [];
  const totalInUE      = (selectedSemester && selectedUE)
    ? Object.values(structure[selectedSemester]?.[selectedUE] || {}).flat().length : 0;
  const totalQuizzes   = quizzes.length;

  const resetCatalogue = () => { setView('semesters'); setSelectedSemester(null); setSelectedUE(null); setSelectedChapter(null); };

  return (
    <DashboardLayout>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{ opacity:.6 } 50%{ opacity:.9 } }
      `}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          {/* Grid texture */}
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          {/* Orbs */}
          <div style={{ position:'absolute', top:-48, right:-32, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter:'blur(40px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:80, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.07),transparent)', filter:'blur(30px)', pointerEvents:'none' }} aria-hidden/>
          {/* Shine */}
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.15), transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <div style={{ position:'relative', padding:'28px 24px 0' }}>
            {/* Icon + titre */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div>
                <h1 className="nunito" style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 }}>Quiz</h1>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Testez vos connaissances par unité d'enseignement</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'flex', gap:20, marginBottom:20, marginTop:6 }}>
              {[{ n:totalQuizzes, l:'Quiz', c:'#fff' }, { n:semesters.length, l:'Semestres', c:'#c4b5fd' }].map(s => (
                <div key={s.l}>
                  <p className="nunito" style={{ fontSize:22, fontWeight:900, color:s.c, lineHeight:1 }}>{s.n}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', marginTop:2 }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Tab bar */}
            <div style={{ display:'flex', gap:2 }}>
              {[{ id:'catalogue', label:'Catalogue' }, { id:'personnalises', label:'Mes quiz' }].map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  style={{ padding:'10px 20px', background:'transparent', border:'none', borderBottom:`2.5px solid ${tab===t.id?'#fff':'transparent'}`, color:tab===t.id?'#fff':'rgba(255,255,255,0.55)', fontSize:13, fontWeight:700, cursor:'pointer', transition:'all 0.2s', fontFamily:'Nunito,sans-serif' }}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ──────────────────────────────────────────────────── */}
        <div style={{ padding:'24px 16px' }}>

          {/* ── CATALOGUE ── */}
          {tab === 'catalogue' && (
            <AnimatePresence mode="wait">

              {/* SEMESTERS */}
              {view === 'semesters' && (
                <motion.div key="sems" initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>
                  {loading ? <Skeleton/> : semesters.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 24px', color:C.muted }}>
                      <div style={{ fontSize:48, marginBottom:12 }}>📚</div>
                      <p style={{ fontWeight:700, color:C.text, fontFamily:'Nunito,sans-serif' }}>Aucun quiz disponible</p>
                    </div>
                  ) : (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
                      {semesters.map((sem, idx) => {
                        const pal       = PALETTE[idx % PALETTE.length];
                        const allQ      = Object.values(structure[sem]).flatMap(ue => Object.values(ue)).flat();
                        const total     = allQ.length;
                        const ueCount   = Object.keys(structure[sem]).length;
                        const doneCount = allQ.filter(q => q.attempt?.status === 'completed').length;
                        return (
                          <motion.div key={sem}
                            initial={{ opacity:0, y:20, scale:0.94 }} whileInView={{ opacity:1, y:0, scale:1 }}
                            viewport={{ once:true, margin:'-30px' }}
                            transition={{ type:'spring', stiffness:280, damping:24, delay: idx*0.06 }}>
                            <GradCard
                              pal={pal} onClick={() => { setSelectedSemester(sem); setView('ues'); }}
                              title={sem}
                              sub={`${ueCount} UE · ${total} quiz`}
                              sub2={doneCount > 0 ? `✓ ${doneCount} quiz terminé${doneCount>1?'s':''}` : null}
                              progress={total>0 ? (doneCount/total)*100 : null}
                            />
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* UEs */}
              {view === 'ues' && selectedSemester && (
                <motion.div key="ues" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.28 }}>
                  <Breadcrumb items={[{ label:'Quiz', onClick:resetCatalogue }, { label:selectedSemester }]}/>
                  <SectionHeader title={selectedSemester} sub={`${ues.length} unité${ues.length>1?'s':''} d'enseignement`}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:14 }}>
                    {ues.map((ue, idx) => {
                      const pal       = PALETTE[idx % PALETTE.length];
                      const allQ      = Object.values(structure[selectedSemester][ue]).flat();
                      const total     = allQ.length;
                      const chCount   = Object.keys(structure[selectedSemester][ue]).length;
                      const doneCount = allQ.filter(q => q.attempt?.status === 'completed').length;
                      return (
                        <motion.div key={ue}
                          initial={{ opacity:0, y:18, scale:0.94 }} animate={{ opacity:1, y:0, scale:1 }}
                          transition={{ type:'spring', stiffness:280, damping:24, delay: idx*0.055 }}>
                          <GradCard
                            pal={pal} onClick={() => { setSelectedUE(ue); setView('chapters'); }}
                            title={ue}
                            sub={`${chCount} chapitre${chCount>1?'s':''} · ${total} quiz`}
                            sub2={doneCount > 0 ? `✓ ${doneCount}/${total} terminé${doneCount>1?'s':''}` : null}
                            progress={total>0 ? (doneCount/total)*100 : null}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* CHAPTERS */}
              {view === 'chapters' && selectedSemester && selectedUE && (
                <motion.div key="chaps" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.28 }}>
                  <Breadcrumb items={[
                    { label:'Quiz', onClick:resetCatalogue },
                    { label:selectedSemester, onClick:() => { setSelectedUE(null); setView('ues'); } },
                    { label:selectedUE }
                  ]}/>
                  <SectionHeader title={selectedUE} sub={`${totalInUE} quiz disponible${totalInUE>1?'s':''}`}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:12 }}>
                    {chapters.map((chap, idx) => {
                      const pal       = PALETTE[idx % PALETTE.length];
                      const chapQ     = structure[selectedSemester][selectedUE][chap];
                      const count     = chapQ.length;
                      const doneCount = chapQ.filter(q => q.attempt?.status === 'completed').length;
                      const allDone   = doneCount === count && count > 0;
                      const pct       = count > 0 ? (doneCount/count)*100 : 0;
                      return (
                        <motion.div key={chap}
                          style={{ display:'flex' }}
                          initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                          transition={{ duration:0.3, ease:[0.16,1,0.3,1], delay: idx*0.05 }}>
                          <motion.button
                            onClick={() => { setSelectedChapter(chap); setView('quizzes'); }}
                            whileHover={{ y:-3, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 0 rgba(0,0,0,0.06), 0 20px 40px rgba(var(--theme-primary-rgb),0.14)` }}
                            whileTap={{ scale:0.98 }}
                            style={{ flex:1, width:'100%', textAlign:'left', border:`1px solid ${C.border}`, cursor:'pointer', borderRadius:18, overflow:'hidden', background:C.card, boxShadow:clay.card, padding:0, transition:'box-shadow 0.2s' }}
                          >
                            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px' }}>
                              <div style={{ width:44, height:44, borderRadius:14, background:`linear-gradient(135deg,${pal.from},${pal.to})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 4px 10px ${pal.from}44` }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><path d="M9 3h6a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z"/></svg>
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:2 }}>
                                  <span style={{ fontSize:13, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif' }}>{chap}</span>
                                  {doneCount > 0 && (
                                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:allDone?'#dcfce7':'var(--theme-border)', color:allDone?'#15803d':C.indigo }}>
                                      ✓ {doneCount}/{count}
                                    </span>
                                  )}
                                </div>
                                <p style={{ fontSize:11, color:C.muted }}>{count} quiz disponible{count>1?'s':''}</p>
                              </div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.muted} strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </div>
                            {doneCount > 0 && (
                              <div style={{ height:4, background:'var(--theme-border)' }}>
                                <div style={{ height:'100%', width:`${pct}%`, background:allDone?`linear-gradient(90deg,${C.green},#34d399)`:`linear-gradient(90deg,${C.indigo},${C.violet})`, transition:'width 0.8s ease' }}/>
                              </div>
                            )}
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* QUIZZES */}
              {view === 'quizzes' && selectedSemester && selectedUE && selectedChapter && (
                <motion.div key="quizs" initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-24 }} transition={{ duration:0.28 }}>
                  <Breadcrumb items={[
                    { label:'Quiz', onClick:resetCatalogue },
                    { label:selectedSemester, onClick:() => { setSelectedUE(null); setSelectedChapter(null); setView('ues'); } },
                    { label:selectedUE, onClick:() => { setSelectedChapter(null); setView('chapters'); } },
                    { label:selectedChapter }
                  ]}/>
                  <SectionHeader title={selectedChapter} sub={`${currentQuizzes.length} quiz disponible${currentQuizzes.length>1?'s':''}`}/>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
                    {currentQuizzes.map((quiz, i) => {
                      const a       = quiz.attempt;
                      const isDone  = a?.status === 'completed';
                      const isResume = a?.status === 'in_progress';
                      const pct     = isDone ? Math.round((a.score / a.totalQuestions) * 100) : null;
                      const barColor = pct >= 60 ? C.green : C.red;
                      const diff    = DIFF[quiz.difficulty] || DIFF.medium;
                      return (
                        <motion.div key={quiz._id}
                          initial={{ opacity:0, y:16, scale:0.95 }} animate={{ opacity:1, y:0, scale:1 }}
                          transition={{ delay: i<6 ? i*0.05:0, duration:0.3, ease:[0.16,1,0.3,1] }}>
                          <motion.div
                            onClick={() => handlePlay(quiz._id)}
                            whileHover={{ y:-5, boxShadow:`inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 0 rgba(0,0,0,0.06), 0 24px 48px rgba(var(--theme-primary-rgb),0.16)` }}
                            whileTap={{ scale:0.98 }}
                            style={{ background:C.card, borderRadius:20, boxShadow:clay.card, border:`1px solid ${C.border}`, overflow:'hidden', cursor:'pointer', transition:'box-shadow 0.2s' }}
                          >
                            {/* Status color bar */}
                            <div style={{ height:4, background:isDone?barColor:isResume?C.amber:`linear-gradient(90deg,${C.indigo},${C.violet})` }}/>
                            <div style={{ padding:'18px 20px' }}>
                              {/* Top row chips */}
                              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:6, marginBottom:12 }}>
                                <span style={{ fontSize:11, fontWeight:700, background:'var(--theme-border)', color:C.indigo, borderRadius:99, padding:'4px 10px' }}>{quiz.category}</span>
                                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                                  {isDone && <Chip label={`${pct>=60?'✓':'✗'} ${a.score}/${a.totalQuestions}`} bg={pct>=60?'#dcfce7':'#fee2e2'} color={pct>=60?'#15803d':'#991b1b'}/>}
                                  {isResume && <Chip label={`● Q${a.currentQuestion+1}/${a.totalQuestions}`} bg='#fef9c3' color='#854d0e'/>}
                                  <Chip label={diff.label} bg={diff.bg} color={diff.color}/>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 style={{ fontSize:14, fontWeight:800, color:C.text, fontFamily:'Nunito,sans-serif', lineHeight:1.35, marginBottom:isDone||quiz.description?10:14 }}>{quiz.title}</h3>

                              {/* Score bar */}
                              {isDone && (
                                <div style={{ marginBottom:12 }}>
                                  <div style={{ height:6, background:C.border, borderRadius:99, overflow:'hidden', boxShadow:'inset 0 2px 4px rgba(0,0,0,0.06)' }}>
                                    <motion.div
                                      initial={{ width:0 }} animate={{ width:`${pct}%` }}
                                      transition={{ duration:1, ease:[0.16,1,0.3,1], delay:0.2 }}
                                      style={{ height:'100%', borderRadius:99, background:barColor }}
                                    />
                                  </div>
                                  {a.wrongAnswers > 0 && <p style={{ fontSize:11, color:C.red, marginTop:4 }}>{a.wrongAnswers} erreur{a.wrongAnswers>1?'s':''} lors du dernier essai</p>}
                                </div>
                              )}

                              {quiz.description && !isDone && (
                                <p style={{ fontSize:12, color:C.muted, lineHeight:1.65, marginBottom:12, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{quiz.description}</p>
                              )}

                              {/* Footer */}
                              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:12, borderTop:`1px solid ${C.border}` }}>
                                <div style={{ display:'flex', gap:14 }}>
                                  <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/></svg>
                                    {quiz.questions?.length||0} q.
                                  </span>
                                  <span style={{ fontSize:11, color:C.muted, display:'flex', alignItems:'center', gap:4 }}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                                    {quiz.duration} min
                                  </span>
                                </div>
                                <span style={{ fontSize:12, fontWeight:800, color:C.indigo, fontFamily:'Nunito,sans-serif' }}>
                                  {isDone ? 'Refaire →' : isResume ? 'Reprendre →' : 'Commencer →'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* ── PERSONNALISÉS ── */}
          {tab === 'personnalises' && (
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>
              {!isPro ? <ProFeaturePrompt/> : (
                <>
                  <div style={{ marginBottom:20 }}>
                    <h2 className="nunito" style={{ fontSize:18, fontWeight:900, color:C.text, marginBottom:4 }}>Générer un quiz depuis votre cours</h2>
                    <p style={{ fontSize:13, color:C.muted }}>Collez n'importe quel texte de cours — l'IA génère des QCM adaptés.</p>
                  </div>
                  <QuizGenerator onGenerated={quiz => setPersonalQuizzes(prev => [quiz, ...prev])}/>
                  <div style={{ marginTop:32 }}>
                    <h3 className="nunito" style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:16 }}>Mes quiz générés</h3>
                    {personalLoading
                      ? <div style={{ display:'flex', justifyContent:'center', padding:'32px 0' }}><div style={{ width:32, height:32, border:`3px solid ${C.indigo}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }}/></div>
                      : <PersonalQuizList quizzes={personalQuizzes} onDelete={id => setPersonalQuizzes(prev => prev.filter(q => q._id !== id))} onPlay={id => handlePlay(id)}/>
                    }
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── QUOTA MODAL ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {quotaModal && (
          <motion.div key="backdrop" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setQuotaModal(false)}
            style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(30,27,75,0.45)', backdropFilter:'blur(8px)' }}>
            <motion.div key="modal" initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ background:C.card, borderRadius:28, padding:'28px 24px', width:'100%', maxWidth:380, boxShadow:clay.card, textAlign:'center' }}>
              <div style={{ width:56, height:56, borderRadius:18, margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))', boxShadow:clay.btn() }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h3 className="nunito" style={{ fontSize:17, fontWeight:900, color:C.text, marginBottom:8 }}>Quota mensuel atteint</h3>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:6 }}>Vous avez utilisé vos <strong style={{ color:C.text }}>10 quiz gratuits</strong> ce mois-ci.</p>
              <p style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:22 }}>Passez à l'abonnement <strong style={{ color:C.indigo }}>Étudiant</strong> pour un accès illimité.</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <motion.button onClick={() => setQuotaModal(false)} whileTap={{ scale:0.96 }}
                  style={{ width:'100%', padding:'12px 0', borderRadius:14, background:C.bg, border:`1px solid ${C.border}`, fontSize:13, fontWeight:700, color:C.muted, cursor:'pointer', boxShadow:clay.sm }}>
                  Plus tard
                </motion.button>
                <motion.button onClick={() => navigate('/dashboard/subscription')} whileTap={{ scale:0.96 }} whileHover={{ scale:1.02 }}
                  style={{ width:'100%', padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-dark),var(--theme-primary))', fontSize:13, fontWeight:800, color:'#fff', cursor:'pointer', fontFamily:'Nunito,sans-serif', boxShadow:clay.btn() }}>
                  Voir les offres
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </DashboardLayout>
  );
}
