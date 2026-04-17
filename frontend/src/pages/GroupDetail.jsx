import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import UserAvatar from '../components/UserAvatar';
import { API_URL, useAuth } from '../context/AuthContext';

const TYPE_CONFIG = {
  text: { label: 'Discussion', color: 'bg-blue-100 text-blue-600' },
  question: { label: 'Question', color: 'bg-yellow-100 text-yellow-600' },
  resource: { label: 'Ressource', color: 'bg-green-100 text-green-600' },
};

function timeAgo(date) {
  const diff = (Date.now() - new Date(date)) / 1000;
  if (diff < 60) return 'à l\'instant';
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  return `il y a ${Math.floor(diff / 86400)} j`;
}

function Post({ post, groupId, onUpdate, currentUserId }) {
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const liked = post.likes.some(l => (l._id || l) === currentUserId);

  const handleLike = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/groups/${groupId}/posts/${post._id}/like`);
      onUpdate(post._id, { likes: Array(data.likes).fill(null), _liked: data.liked });
    } catch {}
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/groups/${groupId}/posts/${post._id}/comments`, { content: comment });
      setComment('');
      onUpdate(post._id, null, true);
    } catch {}
    setLoading(false);
  };

  const tc = TYPE_CONFIG[post.type] || TYPE_CONFIG.text;

  return (
    <div className="bg-white rounded-2xl border border-blue-100 p-5">
      {/* Author + type */}
      <div className="flex items-start gap-3 mb-3">
        <UserAvatar name={post.author?.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-blue-900">{post.author?.name}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tc.color}`}>{tc.label}</span>
            <span className="text-xs text-blue-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-blue-800 leading-relaxed whitespace-pre-wrap mb-4">{post.content}</p>

      {/* Actions */}
      <div className="flex items-center gap-4 text-xs text-blue-400">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition ${liked ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {post.likes.length > 0 && <span>{post.likes.length}</span>}
          J'aime
        </button>
        <button
          onClick={() => setShowComments(v => !v)}
          className="flex items-center gap-1.5 hover:text-blue-600 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {post.comments.length > 0 && <span>{post.comments.length}</span>}
          Commenter
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-4 border-t border-blue-50 pt-4 space-y-3">
          {post.comments.map((c, i) => (
            <div key={i} className="flex items-start gap-2">
              <UserAvatar name={c.author?.name} size="xs" />
              <div className="bg-blue-50 rounded-xl px-3 py-2 flex-1">
                <span className="text-xs font-semibold text-blue-800">{c.author?.name} </span>
                <span className="text-xs text-blue-700">{c.content}</span>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2 items-center">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-blue-100 bg-blue-50/30 text-blue-900 focus:outline-none focus:border-blue-400 transition"
            />
            <button
              type="submit"
              disabled={loading || !comment.trim()}
              className="px-3 py-2 bg-blue-500 text-white rounded-xl text-xs font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group,        setGroup]        = useState(null);
  const [posts,        setPosts]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [content,      setContent]      = useState('');
  const [type,         setType]         = useState('text');
  const [posting,      setPosting]      = useState(false);
  const [showMembers,  setShowMembers]  = useState(false);
  const [leaving,      setLeaving]      = useState(false);
  const [pending,      setPending]      = useState([]);
  const [showKey,      setShowKey]      = useState(false);
  const [keyCopied,    setKeyCopied]    = useState(false);
  const textareaRef = useRef(null);

  const loadPosts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/groups/${id}/posts`);
      setPosts(data);
    } catch {}
  };

  const loadPending = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/groups/${id}/pending`);
      setPending(data);
    } catch {}
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`${API_URL}/groups/${id}/approve/${userId}`);
      setPending(p => p.filter(u => u._id !== userId));
      setGroup(g => g ? { ...g, members: [...(g.members||[]), pending.find(u=>u._id===userId)] } : g);
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
          axios.get(`${API_URL}/groups/${id}/posts`)
        ]);
        setGroup(groupRes.data);
        setPosts(postsRes.data);
        // load pending if creator
        const gData = groupRes.data;
        const myId  = user?._id;
        const isCreator = gData.creator?._id === myId || gData.creator === myId;
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
  }, [id, navigate]);

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
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  if (!group) return null;

  const isCreator = group.creator?._id === user?._id || group.creator === user?._id;
  const isMember = group.isMember;

  return (
    <DashboardLayout>
      <main className="flex-1 p-4 lg:p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate('/dashboard/groups')}
            className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-600 mb-5 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            Retour aux groupes
          </button>

          {/* Group header */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                {group.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold text-slate-800">{group.name}</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${group.isPrivate ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'}`}>
                    {group.isPrivate ? 'Privé' : 'Public'}
                  </span>
                </div>
                {group.description && (
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{group.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <button onClick={() => setShowMembers(v => !v)}
                    className="hover:text-blue-600 transition flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    {group.members?.length || 0} membre{group.members?.length !== 1 ? 's' : ''}
                  </button>
                  <span>{group.category}</span>
                  {pending.length > 0 && (
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {pending.length} en attente
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Key button — creator only */}
                {isCreator && (
                  <button onClick={() => setShowKey(v => !v)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition ${showKey ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                    </svg>
                    Clé
                  </button>
                )}
                {/* Leave button — members only */}
                {isMember && !isCreator && (
                  <button onClick={handleLeave} disabled={leaving}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-xl transition">
                    Quitter
                  </button>
                )}
              </div>
            </div>

            {/* Access key panel */}
            <AnimatePresence>
              {showKey && isCreator && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="text-xs text-blue-400 font-medium mb-2">Clé d'accès du groupe</p>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-2xl font-mono font-bold text-blue-700 tracking-[0.35em]">
                        {group.joinCode}
                      </p>
                      <button onClick={copyKey}
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${keyCopied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                        {keyCopied ? (
                          <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copié !</>
                        ) : (
                          <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copier</>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-blue-400 mt-2">
                      {group.isPrivate
                        ? 'Les personnes avec cette clé enverront une demande que vous devrez approuver.'
                        : 'Les personnes avec cette clé rejoignent directement le groupe.'}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Members list */}
            <AnimatePresence>
              {showMembers && group.members?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-semibold text-slate-600 mb-3">
                      Membres ({group.members.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.members.map(m => (
                        <div key={m._id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2.5 py-1">
                          <UserAvatar name={m.name} size="xs" />
                          <span className="text-xs text-slate-700 font-medium">{m.name}</span>
                          {(m._id === group.creator?._id || m._id === group.creator) && (
                            <span className="text-[10px] text-blue-400 font-semibold">(admin)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pending members — private group creator only */}
            {isCreator && group.isPrivate && pending.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 border-t border-amber-100 pt-4"
              >
                <p className="text-xs font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Demandes en attente ({pending.length})
                </p>
                <div className="space-y-2">
                  <AnimatePresence>
                    {pending.map(u => (
                      <motion.div
                        key={u._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5"
                      >
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#164e8a,#0891b2)' }}>
                          {u.name?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{u.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => handleApprove(u._id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Approuver
                          </button>
                          <button onClick={() => handleReject(u._id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 transition">
                            Refuser
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </div>

          {/* Compose */}
          {isMember && (
            <div className="bg-white rounded-2xl border border-blue-100 p-5 mb-5">
              <form onSubmit={handlePost}>
                <div className="flex gap-2 mb-3">
                  {['text', 'question', 'resource'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        type === t
                          ? TYPE_CONFIG[t].color.replace('bg-', 'bg-') + ' border border-current/20'
                          : 'text-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {TYPE_CONFIG[t].label}
                    </button>
                  ))}
                </div>
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={type === 'question' ? 'Posez votre question...' : type === 'resource' ? 'Partagez une ressource, un lien...' : 'Partagez quelque chose avec le groupe...'}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-blue-100 bg-blue-50/30 text-sm text-blue-900 focus:outline-none focus:border-blue-400 focus:bg-white transition resize-none"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    disabled={posting || !content.trim()}
                    className="px-5 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {posting ? 'Publication...' : 'Publier'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts */}
          {posts.length === 0 ? (
            <div className="text-center py-12 text-blue-400">
              <p className="font-medium text-blue-700 mb-1">Aucune publication</p>
              <p className="text-sm">Soyez le premier à partager quelque chose !</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <Post
                  key={post._id}
                  post={post}
                  groupId={id}
                  onUpdate={handlePostUpdate}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </DashboardLayout>
  );
}
