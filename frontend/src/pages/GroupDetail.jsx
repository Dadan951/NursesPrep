import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import UserAvatar from '../components/UserAvatar';
import { API_URL, useAuth } from '../context/AuthContext';

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

const TYPE_CONFIG = {
  text:     { label:'Discussion', bg:'rgba(var(--theme-primary-rgb),0.08)', color:'var(--theme-primary)' },
  question: { label:'Question',   bg:'#fef3c7', color:'#d97706' },
  resource: { label:'Ressource',  bg:'#dcfce7', color:'#16a34a' },
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60)    return 'à l\'instant';
  if (diff < 3600)  return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

/* ─── Post component ─────────────────────────────────────────────────────── */
function Post({ post, groupId, onUpdate, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [comment,      setComment]      = useState('');
  const [loading,      setLoading]      = useState(false);
  const [liked,        setLiked]        = useState(() => post.likes.some(l => (l?._id || l) === currentUserId));
  const [likeCount,    setLikeCount]    = useState(post.likes.length);

  const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.text;

  const handleLike = async () => {
    const next = !liked;
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    try {
      const { data } = await axios.post(`${API_URL}/groups/${groupId}/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch {
      setLiked(!next);
      setLikeCount(c => next ? c - 1 : c + 1);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/groups/${groupId}/posts/${post._id}/comments`, { content:comment });
      setComment('');
      onUpdate(post._id, null, true);
    } catch {}
    setLoading(false);
  };

  return (
    <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.35}}
      style={{ background:C.card, borderRadius:20, padding:20, boxShadow:clay.card, border:`1.5px solid ${C.border}` }}>

      {/* Auteur + type */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
        <UserAvatar name={post.author?.name} size="sm" />
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{post.author?.name}</span>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:tc.bg, color:tc.color }}>{tc.label}</span>
            <span style={{ fontSize:11, color:C.sub }}>{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <p style={{ fontSize:13, color:C.text, lineHeight:1.7, whiteSpace:'pre-wrap', marginBottom:14 }}>{post.content}</p>

      {/* Actions */}
      <div style={{ display:'flex', alignItems:'center', gap:16, paddingTop:10, borderTop:`1px solid ${C.border}` }}>
        <motion.button onClick={handleLike} whileTap={{scale:0.92}}
          style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:liked?700:500, color:liked?'var(--theme-primary)':C.sub, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked?'currentColor':'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likeCount > 0 && <span>{likeCount}</span>}
          J'aime
        </motion.button>
        <motion.button onClick={() => setShowComments(v => !v)} whileTap={{scale:0.92}}
          style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:500, color:showComments?'var(--theme-primary)':C.sub, background:'none', border:'none', cursor:'pointer', padding:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post.comments.length > 0 && <span>{post.comments.length}</span>}
          Commenter
        </motion.button>
      </div>

      {/* Commentaires */}
      <AnimatePresence>
        {showComments && (
          <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}
            transition={{duration:0.25}} style={{overflow:'hidden'}}>
            <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${C.border}`, display:'flex', flexDirection:'column', gap:10 }}>
              {post.comments.map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8 }}>
                  <UserAvatar name={c.author?.name} size="xs" />
                  <div style={{ background:C.bg, borderRadius:12, padding:'8px 12px', flex:1, border:`1px solid ${C.border}` }}>
                    <span style={{ fontSize:12, fontWeight:700, color:C.text }}>{c.author?.name} </span>
                    <span style={{ fontSize:12, color:C.sub }}>{c.content}</span>
                  </div>
                </div>
              ))}
              <form onSubmit={handleComment} style={{ display:'flex', gap:8, alignItems:'center' }}>
                <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  style={{ flex:1, padding:'8px 12px', fontSize:12, borderRadius:12, border:`1.5px solid ${C.border}`, background:C.bg, color:C.text, outline:'none', fontFamily:'DM Sans,sans-serif', transition:'border 0.18s' }}
                  onFocus={e => e.target.style.borderColor='var(--theme-primary)'}
                  onBlur={e => e.target.style.borderColor='var(--theme-border)'}/>
                <motion.button type="submit" disabled={loading || !comment.trim()} whileTap={{scale:0.95}}
                  style={{ padding:'8px 14px', borderRadius:12, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', opacity:(loading||!comment.trim())?0.5:1, boxShadow:clay.btn() }}>
                  Envoyer
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   GROUP DETAIL PAGE
   ════════════════════════════════════════════════════════════════════════════ */
export default function GroupDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group,       setGroup]       = useState(null);
  const [posts,       setPosts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [content,     setContent]     = useState('');
  const [type,        setType]        = useState('text');
  const [posting,     setPosting]     = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [leaving,     setLeaving]     = useState(false);
  const [pending,     setPending]     = useState([]);
  const [showKey,     setShowKey]     = useState(false);
  const [keyCopied,   setKeyCopied]   = useState(false);
  const textareaRef = useRef(null);

  const loadPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/groups/${id}/posts`);
      setPosts(data);
    } catch {}
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`${API_URL}/groups/${id}/approve/${userId}`);
      setPending(p => p.filter(u => u._id !== userId));
      setGroup(g => g ? { ...g, members:[...(g.members||[]), pending.find(u=>u._id===userId)] } : g);
    } catch {}
  };

  const handleReject = async (userId) => {
    try {
      await axios.delete(`${API_URL}/groups/${id}/reject/${userId}`);
      setPending(p => p.filter(u => u._id !== userId));
    } catch {}
  };

  const copyKey = () => {
    navigator.clipboard.writeText(group?.joinCode || '');
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const [groupRes, postsRes] = await Promise.all([
          axios.get(`${API_URL}/groups/${id}`),
          axios.get(`${API_URL}/groups/${id}/posts`),
        ]);
        setGroup(groupRes.data);
        setPosts(postsRes.data);
        const gData = groupRes.data;
        const isCreator = gData.creator?._id === user?._id || gData.creator === user?._id;
        if (isCreator && gData.isPrivate) {
          axios.get(`${API_URL}/groups/${id}/pending`).then(r => setPending(r.data)).catch(()=>{});
        }
      } catch {
        navigate('/dashboard/groups');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, navigate, user]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    try {
      const { data } = await axios.post(`${API_URL}/groups/${id}/posts`, { content, type });
      setPosts(prev => [data, ...prev]);
      setContent('');
    } catch {}
    setPosting(false);
  };

  const handlePostUpdate = (postId, updates, reload = false) => {
    if (reload) { loadPosts(); return; }
    setPosts(prev => prev.map(p => p._id === postId ? { ...p, ...updates } : p));
  };

  const handleLeave = async () => {
    if (!window.confirm('Quitter ce groupe ?')) return;
    setLeaving(true);
    try {
      await axios.post(`${API_URL}/groups/${id}/leave`);
      navigate('/dashboard/groups');
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur');
    }
    setLeaving(false);
  };

  if (loading) return (
    <DashboardLayout>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:C.bg }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ width:36, height:36, border:'4px solid var(--theme-border)', borderTopColor:'var(--theme-primary)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      </div>
    </DashboardLayout>
  );

  if (!group) return null;

  const isCreator = group.isCreator ?? (group.creator?._id?.toString() === user?._id?.toString());
  const isMember  = group.isMember;

  return (
    <DashboardLayout>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={{ flex:1, overflowY:'auto', background:C.bg }}>

        {/* ── HERO ── */}
        <div style={{ background:'var(--theme-hero)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'24px 24px', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'absolute', top:-60, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.06)', pointerEvents:'none' }} aria-hidden/>
          <div style={{ position:'relative', maxWidth:720, margin:'0 auto', padding:'28px 24px 24px' }}>
            {/* Back */}
            <motion.button onClick={() => navigate('/dashboard/groups')} whileHover={{x:-2}} whileTap={{scale:0.97}}
              style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)', background:'rgba(255,255,255,0.12)', border:'none', borderRadius:99, padding:'5px 12px', cursor:'pointer', marginBottom:16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              Groupes
            </motion.button>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:52, height:52, borderRadius:18, background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:20, flexShrink:0, border:'1.5px solid rgba(255,255,255,0.3)' }}>
                  {group.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <h1 style={{ fontSize:18, fontWeight:900, color:'#fff', fontFamily:'Nunito,sans-serif' }}>{group.name}</h1>
                    <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99, background:group.isPrivate?'rgba(255,255,255,0.2)':'rgba(134,239,172,0.3)', color:'#fff' }}>
                      {group.isPrivate ? '🔒 Privé' : '🌐 Public'}
                    </span>
                  </div>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.7)', marginTop:2 }}>{group.category}</p>
                </div>
              </div>

              {/* Actions header */}
              <div style={{ display:'flex', gap:8 }}>
                {/* Bouton clé — créateur seulement */}
                {isCreator && (
                  <motion.button onClick={() => setShowKey(v => !v)} whileTap={{scale:0.96}}
                    style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:12, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.18s',
                      background:showKey?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.18)',
                      color:showKey?'var(--theme-primary)':'rgba(255,255,255,0.9)',
                      backdropFilter:'blur(8px)', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    Clé d'accès
                  </motion.button>
                )}
                {isMember && !isCreator && (
                  <motion.button onClick={handleLeave} disabled={leaving} whileTap={{scale:0.96}}
                    style={{ padding:'7px 14px', borderRadius:12, border:'1px solid rgba(252,165,165,0.5)', background:'rgba(239,68,68,0.15)', color:'#fca5a5', fontSize:12, fontWeight:700, cursor:'pointer', backdropFilter:'blur(8px)' }}>
                    Quitter
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ maxWidth:720, margin:'0 auto', padding:'24px 16px' }}>

          {/* ── Panneau clé d'accès ── */}
          <AnimatePresence>
            {showKey && isCreator && (
              <motion.div initial={{opacity:0,y:-12,height:0}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:0,y:-12,height:0}}
                transition={{duration:0.28}} style={{overflow:'hidden', marginBottom:16}}>
                <div style={{ background:C.card, borderRadius:20, padding:20, boxShadow:clay.card, border:`2px solid var(--theme-border)`, position:'relative', overflow:'hidden' }}>
                  {/* Accent bar */}
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,var(--theme-primary),var(--theme-secondary))' }}/>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, paddingTop:8 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
                        <div style={{ width:28, height:28, borderRadius:9, background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                          </svg>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.08em' }}>Clé d'accès du groupe</span>
                      </div>
                      <p style={{ fontSize:30, fontFamily:'monospace', fontWeight:900, color:'var(--theme-primary)', letterSpacing:'0.45em' }}>{group.joinCode}</p>
                      <p style={{ fontSize:11, color:C.sub, marginTop:6, lineHeight:1.5 }}>
                        {group.isPrivate
                          ? '🔒 Groupe privé — les personnes avec cette clé enverront une demande que vous approuvez.'
                          : '🌐 Les personnes avec cette clé rejoignent directement le groupe.'}
                      </p>
                    </div>
                    <motion.button onClick={copyKey} whileTap={{scale:0.95}}
                      style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 18px', borderRadius:14, border:'none', background:keyCopied?'#10B981':'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', boxShadow:clay.btn(), transition:'background 0.2s', flexShrink:0 }}>
                      {keyCopied
                        ? <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copié !</>
                        : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copier</>}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Infos du groupe ── */}
          <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:0.4}}
            style={{ background:C.card, borderRadius:20, padding:20, boxShadow:clay.card, border:`1.5px solid ${C.border}`, marginBottom:16 }}>

            {group.description && (
              <p style={{ fontSize:13, color:C.sub, lineHeight:1.7, marginBottom:14 }}>{group.description}</p>
            )}

            <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
              <motion.button onClick={() => setShowMembers(v => !v)} whileTap={{scale:0.96}}
                style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:showMembers?'var(--theme-primary)':C.sub, background:'none', border:'none', cursor:'pointer', fontWeight:showMembers?700:500, padding:0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {group.members?.length || 0} membre{group.members?.length !== 1 ? 's' : ''}
              </motion.button>

              {pending.length > 0 && (
                <span style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, fontWeight:700, color:'#d97706' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {pending.length} en attente
                </span>
              )}
            </div>

            {/* Liste membres */}
            <AnimatePresence>
              {showMembers && group.members?.length > 0 && (
                <motion.div initial={{opacity:0,height:0,marginTop:0}} animate={{opacity:1,height:'auto',marginTop:16}} exit={{opacity:0,height:0,marginTop:0}}
                  transition={{duration:0.25}} style={{overflow:'hidden'}}>
                  <div style={{ paddingTop:16, borderTop:`1px solid ${C.border}` }}>
                    <p style={{ fontSize:11, fontWeight:700, color:C.sub, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>Membres ({group.members.length})</p>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {group.members.map(m => (
                        <div key={m._id} style={{ display:'flex', alignItems:'center', gap:6, background:C.bg, border:`1px solid ${C.border}`, borderRadius:99, padding:'4px 10px' }}>
                          <UserAvatar name={m.name} size="xs" />
                          <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{m.name}</span>
                          {(m._id === group.creator?._id || m._id === group.creator) && (
                            <span style={{ fontSize:10, fontWeight:700, color:'var(--theme-primary)' }}>admin</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── Demandes en attente ── */}
          {isCreator && group.isPrivate && pending.length > 0 && (
            <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
              style={{ background:'#fffbeb', borderRadius:20, padding:20, border:'1.5px solid #fde68a', marginBottom:16, boxShadow:clay.sm }}>
              <p style={{ fontSize:12, fontWeight:800, color:'#92400e', marginBottom:12, display:'flex', alignItems:'center', gap:7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                Demandes en attente ({pending.length})
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <AnimatePresence>
                  {pending.map(u => (
                    <motion.div key={u._id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:10,height:0}} transition={{duration:0.25}}
                      style={{ display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1px solid #fde68a', borderRadius:14, padding:'10px 14px' }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:13, fontWeight:800, flexShrink:0 }}>
                        {u.name?.charAt(0)}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:12, fontWeight:700, color:C.text, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</p>
                        <p style={{ fontSize:11, color:C.sub, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                      </div>
                      <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                        <motion.button onClick={() => handleApprove(u._id)} whileTap={{scale:0.95}}
                          style={{ display:'flex', alignItems:'center', gap:4, padding:'6px 12px', borderRadius:10, border:'none', background:'#10B981', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                          Approuver
                        </motion.button>
                        <motion.button onClick={() => handleReject(u._id)} whileTap={{scale:0.95}}
                          style={{ padding:'6px 12px', borderRadius:10, border:'none', background:'#fee2e2', color:'#dc2626', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                          Refuser
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Composer un post ── */}
          {isMember && (
            <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              style={{ background:C.card, borderRadius:20, padding:20, boxShadow:clay.card, border:`1.5px solid ${C.border}`, marginBottom:20 }}>
              <form onSubmit={handlePost}>
                {/* Type selector */}
                <div style={{ display:'flex', gap:6, marginBottom:12 }}>
                  {Object.entries(TYPE_CONFIG).map(([t, cfg]) => (
                    <motion.button key={t} type="button" onClick={() => setType(t)} whileTap={{scale:0.95}}
                      style={{ padding:'5px 12px', borderRadius:10, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.15s',
                        background:type===t?cfg.bg:'transparent', color:type===t?cfg.color:C.sub }}>
                      {cfg.label}
                    </motion.button>
                  ))}
                </div>
                <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)} rows={3}
                  placeholder={type==='question'?'Posez votre question...':type==='resource'?'Partagez une ressource, un lien...':'Partagez quelque chose avec le groupe...'}
                  style={{ width:'100%', padding:'12px 14px', borderRadius:14, border:`1.5px solid ${C.border}`, background:C.bg, fontSize:13, color:C.text, outline:'none', resize:'none', boxSizing:'border-box', fontFamily:'DM Sans,sans-serif', lineHeight:1.6, transition:'border 0.18s' }}
                  onFocus={e => e.target.style.borderColor='var(--theme-primary)'}
                  onBlur={e => e.target.style.borderColor='var(--theme-border)'}/>
                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:10 }}>
                  <motion.button type="submit" disabled={posting || !content.trim()} whileTap={{scale:0.96}}
                    style={{ padding:'9px 22px', borderRadius:14, border:'none', background:'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color:'#fff', fontSize:13, fontWeight:800, cursor:'pointer', opacity:(posting||!content.trim())?0.5:1, boxShadow:clay.btn(), fontFamily:'Nunito,sans-serif' }}>
                    {posting ? 'Publication...' : 'Publier →'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ── Posts ── */}
          {posts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'48px 0' }}>
              <div style={{ width:64, height:64, borderRadius:22, background:C.bg, border:`1.5px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', boxShadow:clay.sm }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--theme-border)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p style={{ fontWeight:700, color:C.text, marginBottom:4 }}>Aucune publication</p>
              <p style={{ fontSize:13, color:C.sub }}>Soyez le premier à partager quelque chose !</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {posts.map(post => (
                <Post key={post._id} post={post} groupId={id} onUpdate={handlePostUpdate} currentUserId={user?._id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
