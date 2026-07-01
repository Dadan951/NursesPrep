import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens ──────────────────────────────────────────────────────── */
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
  sm:   '0 2px 0 var(--theme-shadow), 0 2px 8px rgba(var(--theme-primary-rgb),0.08)',
  btn:  (hex, dark) => hex
    ? `0 4px 0 ${dark}, 0 8px 24px ${hex}40, 0 1px 0 rgba(255,255,255,0.4) inset`
    : `0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.25), 0 1px 0 rgba(255,255,255,0.4) inset`,
};
const fade = (delay = 0) => ({ initial:{opacity:0,y:16}, animate:{opacity:1,y:0}, transition:{duration:0.45,delay,ease:[0.16,1,0.3,1]} });

/* ─── CreateGroupModal ───────────────────────────────────────────────────── */
function CreateGroupModal({ onClose, onCreate }) {
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ name:'', description:'', category:'Général', isPrivate:false });
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);
  const [copied,  setCopied]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/groups`, form);
      onCreate(data);
      setCreated({ name:data.name, joinCode:data.joinCode, isPrivate:data.isPrivate, _id:data._id });
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(created?.joinCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{opacity:0,scale:0.94,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94,y:20}}
        transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
        style={{ background:C.card, borderRadius:28, padding:32, width:'100%', maxWidth:420, boxShadow:clay.card }}>

        {!created ? (
          <>
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
              <div style={{ width:44, height:44, borderRadius:16, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:clay.btn(), flexShrink:0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div>
                <p style={{ fontSize:15, fontWeight:800, color:C.text }}>Créer un groupe</p>
                <p style={{ fontSize:11, color:C.sub }}>Réunissez vos camarades</p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Nom */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Nom du groupe</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form,name:e.target.value})}
                  placeholder="Ex : Promo 2025 — UE 2.2"
                  style={{ width:'100%', padding:'11px 14px', borderRadius:14, border:`1.5px solid ${C.border}`, background:'#fafafa', fontSize:13, color:C.text, outline:'none', boxSizing:'border-box', fontFamily:'DM Sans,sans-serif', transition:'border 0.18s' }}
                  onFocus={e => e.target.style.borderColor='var(--theme-primary)'}
                  onBlur={e => e.target.style.borderColor='var(--theme-border)'}/>
              </div>

              {/* Description */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Description</label>
                <textarea value={form.description} onChange={e => setForm({...form,description:e.target.value})}
                  placeholder="Décrivez votre groupe..." rows={3}
                  style={{ width:'100%', padding:'11px 14px', borderRadius:14, border:`1.5px solid ${C.border}`, background:'#fafafa', fontSize:13, color:C.text, outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'DM Sans,sans-serif', transition:'border 0.18s' }}
                  onFocus={e => e.target.style.borderColor='var(--theme-primary)'}
                  onBlur={e => e.target.style.borderColor='var(--theme-border)'}/>
              </div>

              {/* Catégorie */}
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6 }}>Catégorie</label>
                <select value={form.category} onChange={e => setForm({...form,category:e.target.value})}
                  style={{ width:'100%', padding:'11px 14px', borderRadius:14, border:`1.5px solid ${C.border}`, background:'#fafafa', fontSize:13, color:C.text, outline:'none', boxSizing:'border-box', fontFamily:'DM Sans,sans-serif', cursor:'pointer' }}>
                  {['Général','UE 1','UE 2','UE 3','UE 4','UE 5','UE 6','Révisions concours','Stages'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Toggle privé */}
              <motion.label whileHover={{scale:1.01}} whileTap={{scale:0.99}}
                style={{ display:'flex', alignItems:'center', gap:12, cursor:'pointer', padding:'12px 14px', borderRadius:14, background:form.isPrivate?'rgba(var(--theme-primary-rgb),0.06)':C.bg, border:`1.5px solid ${form.isPrivate?'var(--theme-border)':'transparent'}`, marginBottom:20, transition:'all 0.2s' }}>
                <div style={{ width:44, height:26, borderRadius:13, background:form.isPrivate?'var(--theme-primary)':'#cbd5e1', position:'relative', flexShrink:0, transition:'background 0.2s', boxShadow:form.isPrivate?`0 2px 8px rgba(var(--theme-primary-rgb),0.3)`:'none' }}>
                  <div style={{ position:'absolute', top:3, left:form.isPrivate?20:3, width:20, height:20, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'left 0.2s' }}/>
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.text }}>Groupe privé</p>
                  <p style={{ fontSize:11, color:C.sub }}>Accès sur clé — vous approuvez chaque demande</p>
                </div>
                <input type="checkbox" checked={form.isPrivate} onChange={e => setForm({...form,isPrivate:e.target.checked})} style={{ display:'none' }}/>
              </motion.label>

              {/* Boutons */}
              <div style={{ display:'flex', gap:10 }}>
                <motion.button type="button" onClick={onClose} whileTap={{scale:0.97}}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.sub, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Annuler
                </motion.button>
                <motion.button type="submit" disabled={loading} whileTap={{scale:0.97}}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', opacity:loading?0.6:1, boxShadow:clay.btn() }}>
                  {loading ? 'Création...' : 'Créer le groupe'}
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          /* ── Succès + clé ── */
          <div style={{ textAlign:'center' }}>
            <motion.div initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:260,damping:18}}
              style={{ width:64, height:64, borderRadius:22, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:clay.btn() }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </motion.div>
            <p style={{ fontSize:17, fontWeight:800, color:C.text, marginBottom:4 }}>Groupe créé !</p>
            <p style={{ fontSize:12, color:C.sub, marginBottom:20 }}>Partagez cette clé pour inviter des membres</p>

            {/* Clé d'accès */}
            <div style={{ background:'var(--theme-bg)', borderRadius:20, padding:20, marginBottom:16, border:`1.5px solid var(--theme-border)`, boxShadow:clay.sm }}>
              <p style={{ fontSize:10, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>Clé d'accès</p>
              <p style={{ fontSize:32, fontFamily:'monospace', fontWeight:800, color:'var(--theme-primary)', letterSpacing:'0.4em', marginBottom:12 }}>{created.joinCode}</p>
              <motion.button onClick={copyCode} whileTap={{scale:0.96}}
                style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 18px', borderRadius:12, border:'none', background:copied?'#10B981':'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', transition:'background 0.2s', boxShadow:clay.btn() }}>
                {copied
                  ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copié !</>
                  : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copier la clé</>}
              </motion.button>
              {created.isPrivate && (
                <div style={{ marginTop:12, padding:'8px 12px', borderRadius:10, background:'#fef3c7', border:'1px solid #fde68a' }}>
                  <p style={{ fontSize:11, color:'#92400e', fontWeight:600 }}>🔒 Groupe privé — vous approuvez chaque demande</p>
                </div>
              )}
            </div>
            <p style={{ fontSize:11, color:C.sub, marginBottom:16 }}>Vous pourrez retrouver cette clé à tout moment dans la page du groupe.</p>
            <motion.button onClick={() => { onClose(); navigate(`/dashboard/groups/${created._id}`); }} whileTap={{scale:0.97}}
              style={{ width:'100%', padding:'13px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:clay.btn() }}>
              Accéder au groupe
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── JoinByCodeModal ────────────────────────────────────────────────────── */
function JoinByCodeModal({ onClose, onJoin }) {
  const [code,    setCode]    = useState('');
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.trim().length < 4) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/groups/join-by-code`, { code: code.trim() });
      setResult(data);
      onJoin();
    } catch (err) {
      alert(err.response?.data?.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(6px)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <motion.div initial={{opacity:0,scale:0.94,y:20}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.94,y:20}}
        transition={{duration:0.35,ease:[0.16,1,0.3,1]}}
        style={{ background:C.card, borderRadius:28, padding:32, width:'100%', maxWidth:360, boxShadow:clay.card }}>

        {!result ? (
          <>
            <div style={{ textAlign:'center', marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:18, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:clay.btn() }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <p style={{ fontSize:15, fontWeight:800, color:C.text, marginBottom:4 }}>Rejoindre avec une clé</p>
              <p style={{ fontSize:12, color:C.sub }}>Entrez la clé partagée par le créateur du groupe</p>
            </div>

            <form onSubmit={handleJoin}>
              <input type="text" required value={code}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,''))}
                placeholder="AB12CD"
                maxLength={8}
                style={{ width:'100%', padding:'16px 14px', borderRadius:16, border:`2px solid ${code.length>0?'var(--theme-primary)':C.border}`, background:C.bg, fontSize:22, fontFamily:'monospace', fontWeight:800, letterSpacing:'0.45em', textAlign:'center', color:'var(--theme-primary)', outline:'none', boxSizing:'border-box', transition:'border 0.18s', marginBottom:16 }}/>
              <div style={{ display:'flex', gap:10 }}>
                <motion.button type="button" onClick={onClose} whileTap={{scale:0.97}}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, color:C.sub, fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Annuler
                </motion.button>
                <motion.button type="submit" disabled={loading || code.length < 4} whileTap={{scale:0.97}}
                  style={{ flex:1, padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', opacity:(loading||code.length<4)?0.5:1, boxShadow:clay.btn() }}>
                  {loading ? 'Vérification...' : 'Rejoindre'}
                </motion.button>
              </div>
            </form>
          </>
        ) : (
          <div style={{ textAlign:'center' }}>
            <motion.div initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'spring',stiffness:260,damping:18}}
              style={{ width:64, height:64, borderRadius:22, background:result.pending?'#fef3c7':'#dcfce7', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              {result.pending
                ? <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                : <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </motion.div>
            <p style={{ fontSize:16, fontWeight:800, color:C.text, marginBottom:6 }}>{result.pending ? 'Demande envoyée !' : 'Rejoint !'}</p>
            <p style={{ fontSize:13, fontWeight:700, color:'var(--theme-primary)', marginBottom:4 }}>{result.groupName}</p>
            <p style={{ fontSize:12, color:C.sub, marginBottom:24, lineHeight:1.6 }}>
              {result.pending ? "Votre demande est en attente d'approbation par l'admin du groupe." : 'Vous avez rejoint le groupe avec succès.'}
            </p>
            <motion.button onClick={onClose} whileTap={{scale:0.97}}
              style={{ width:'100%', padding:'12px 0', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:clay.btn() }}>
              Fermer
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN GROUPS PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function Groups() {
  const navigate = useNavigate();
  const [groups,         setGroups]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showCreate,     setShowCreate]     = useState(false);
  const [showJoinByCode, setShowJoinByCode] = useState(false);
  const [search,         setSearch]         = useState('');
  const [filter,         setFilter]         = useState('all');

  const load = async (force = false) => {
    if (!force) {
      const cached = getCache('groups_list');
      if (cached) { setGroups(cached); setLoading(false); }
    }
    try {
      const { data } = await axios.get(`${API_URL}/groups`);
      setGroups(data); setCache('groups_list', data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDirectJoin = async (group) => {
    try {
      await axios.post(`${API_URL}/groups/${group._id}/join`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
  };

  const filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'mine' && (g.isMember || g.isPending));
    return matchSearch && matchFilter;
  });

  return (
    <DashboardLayout>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden', minHeight:'200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-40, right:-32, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.12),transparent)', filter:'blur(40px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', bottom:-20, left:80, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,0.08),transparent)', filter:'blur(32px)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <div style={{ position:'relative', padding:'28px 24px 28px' }}>
            <motion.div {...fade(0)} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
                    <div style={{ width:44, height:44, borderRadius:16, background:'rgba(255,255,255,0.18)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.3)', flexShrink:0 }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div>
                      <h1 style={{ fontSize:24, fontWeight:900, color:'#fff', fontFamily:'Nunito,sans-serif', lineHeight:1.1, margin:0 }}>Groupes d'étude</h1>
                      <p style={{ fontSize:13, color:'rgba(255,255,255,0.7)', marginTop:2 }}>Collaborez et partagez avec vos camarades IFSI</p>
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <motion.button whileHover={{scale:1.04,y:-1}} whileTap={{scale:0.97}}
                    onClick={() => setShowJoinByCode(true)}
                    style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:14, border:'none', background:'rgba(255,255,255,0.18)', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', backdropFilter:'blur(8px)', boxShadow:'0 2px 8px rgba(0,0,0,0.15)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    Utiliser une clé
                  </motion.button>
                  <motion.button whileHover={{scale:1.04,y:-1}} whileTap={{scale:0.97}}
                    onClick={() => setShowCreate(true)}
                    style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:14, border:'none', background:'#fff', color:'var(--theme-primary)', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Créer un groupe
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ maxWidth:900, margin:'0 auto', padding:'28px 24px' }}>

          {/* Recherche + filtre */}
          <motion.div {...fade(0.05)} style={{ display:'flex', flexWrap:'wrap', gap:10, marginBottom:24 }}>
            <div style={{ position:'relative', flex:1, minWidth:200 }}>
              <svg style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'#94a3b8', pointerEvents:'none' }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" placeholder="Rechercher un groupe..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ width:'100%', paddingLeft:38, paddingRight:14, paddingTop:10, paddingBottom:10, borderRadius:14, border:`1.5px solid ${C.border}`, background:C.card, fontSize:13, color:C.text, outline:'none', boxSizing:'border-box', boxShadow:clay.sm, fontFamily:'DM Sans,sans-serif', transition:'border 0.18s' }}
                onFocus={e => e.target.style.borderColor='var(--theme-primary)'}
                onBlur={e => e.target.style.borderColor='var(--theme-border)'}/>
            </div>
            <div style={{ display:'flex', gap:4, padding:4, background:C.card, border:`1.5px solid ${C.border}`, borderRadius:14, boxShadow:clay.sm }}>
              {[['all','Tous'],['mine','Mes groupes']].map(([val, label]) => (
                <button key={val} onClick={() => setFilter(val)}
                  style={{ padding:'6px 16px', borderRadius:10, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.18s',
                    background:filter===val?'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))':'transparent',
                    color:filter===val?'#fff':C.sub,
                    boxShadow:filter===val?clay.btn():'none' }}>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Grille groupes */}
          {loading ? (
            <div style={{ display:'flex', justifyContent:'center', padding:'64px 0' }}>
              <div style={{ width:32, height:32, border:'4px solid var(--theme-border)', borderTopColor:'var(--theme-primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div {...fade(0.1)} style={{ textAlign:'center', padding:'64px 0' }}>
              <div style={{ width:72, height:72, borderRadius:24, background:C.bg, border:`1.5px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:clay.sm }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--theme-border)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <p style={{ fontWeight:700, color:C.text, marginBottom:6 }}>Aucun groupe trouvé</p>
              <p style={{ fontSize:13, color:C.sub }}>Créez le premier groupe ou utilisez une clé d'accès</p>
            </motion.div>
          ) : (
            <motion.div initial="hidden" animate="show"
              variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.06 } } }}
              style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
              {filtered.map((group) => (
                <motion.div key={group._id}
                  variants={{ hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.45,ease:[0.16,1,0.3,1]}} }}
                  whileHover={{ y:-4, boxShadow:`0 2px 0 var(--theme-shadow), 0 12px 36px rgba(var(--theme-primary-rgb),0.16), 0 1px 0 rgba(255,255,255,0.9) inset` }}
                  onClick={() => group.isMember ? navigate(`/dashboard/groups/${group._id}`) : null}
                  style={{ background:C.card, borderRadius:20, padding:20, boxShadow:clay.card, cursor:group.isMember?'pointer':'default', transition:'box-shadow 0.2s', border:`1.5px solid ${C.border}` }}>

                  {/* Header */}
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <motion.div whileHover={{scale:1.08}}
                        style={{ width:44, height:44, borderRadius:14, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:16, flexShrink:0, boxShadow:clay.btn() }}>
                        {group.name.charAt(0).toUpperCase()}
                      </motion.div>
                      <div style={{ minWidth:0 }}>
                        <p style={{ fontSize:13, fontWeight:800, color:C.text, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:140 }}>{group.name}</p>
                        <p style={{ fontSize:11, color:C.sub }}>{group.category}</p>
                      </div>
                    </div>
                    {group.isPrivate && (
                      <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(var(--theme-primary-rgb),0.08)', color:'var(--theme-primary)', fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:99, flexShrink:0, border:`1px solid var(--theme-border)` }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Privé
                      </div>
                    )}
                  </div>

                  {group.description && (
                    <p style={{ fontSize:12, color:C.sub, marginBottom:12, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{group.description}</p>
                  )}

                  {/* Footer */}
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:10, borderTop:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:11, color:C.sub }}>
                      {group.memberCount} membre{group.memberCount !== 1 ? 's' : ''}
                    </span>

                    {group.isMember ? (
                      <span style={{ fontSize:11, fontWeight:700, color:'#16A34A', background:'#dcfce7', padding:'3px 10px', borderRadius:99 }}>✓ Membre</span>
                    ) : group.isPending ? (
                      <span style={{ fontSize:11, fontWeight:700, color:'#D97706', background:'#fef3c7', padding:'3px 10px', borderRadius:99 }}>⏱ En attente</span>
                    ) : group.isPrivate ? (
                      <motion.button whileTap={{scale:0.96}}
                        onClick={e => { e.stopPropagation(); setShowJoinByCode(true); }}
                        style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:700, color:'var(--theme-primary)', background:'rgba(var(--theme-primary-rgb),0.08)', border:'none', padding:'4px 10px', borderRadius:99, cursor:'pointer' }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778"/></svg>
                        Clé d'accès
                      </motion.button>
                    ) : (
                      <motion.button whileTap={{scale:0.96}}
                        onClick={e => { e.stopPropagation(); handleDirectJoin(group); }}
                        style={{ fontSize:11, fontWeight:700, color:'var(--theme-primary)', background:'rgba(var(--theme-primary-rgb),0.08)', border:'none', padding:'4px 12px', borderRadius:99, cursor:'pointer' }}>
                        Rejoindre →
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreate && (
          <CreateGroupModal
            onClose={() => setShowCreate(false)}
            onCreate={g => {
              const newGroup = { ...g, isMember:true, isPending:false };
              setGroups(prev => {
                const next = [newGroup, ...prev];
                setCache('groups_list', next);
                return next;
              });
            }}
          />
        )}
        {showJoinByCode && (
          <JoinByCodeModal
            onClose={() => setShowJoinByCode(false)}
            onJoin={load}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
