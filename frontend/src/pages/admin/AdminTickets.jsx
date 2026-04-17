import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import NursesLogo from '../../components/NursesLogo';
import { API_URL } from '../../context/AuthContext';
import { useMotionValue, useTransform, useSpring } from 'framer-motion';

/* ─── Config ─────────────────────────────────────────────────────────────────── */
const STATUS_CFG = {
  open:        { label: 'Ouvert',   color: '#10b981', bg: 'rgba(16,185,129,0.15)'  },
  in_progress: { label: 'En cours', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)'  },
  closed:      { label: 'Fermé',    color: '#64748b', bg: 'rgba(100,116,139,0.15)' },
};
const CAT_CFG = {
  question:   { label: 'Question',    color: '#3b82f6' },
  bug:        { label: 'Bug',         color: '#ef4444' },
  billing:    { label: 'Facturation', color: '#f59e0b' },
  suggestion: { label: 'Suggestion',  color: '#10b981' },
  other:      { label: 'Autre',       color: '#94a3b8' },
};

/* ─── 3‑D tilt card ─────────────────────────────────────────────────────────── */
function TiltCard({ children, className = '' }) {
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useTransform(my, [-0.5, 0.5], [7, -7]);
  const ry = useTransform(mx, [-0.5, 0.5], [-7, 7]);
  const sx = useSpring(rx, { stiffness: 300, damping: 22 });
  const sy = useSpring(ry, { stiffness: 300, damping: 22 });
  const onMove = e => { const r = e.currentTarget.getBoundingClientRect(); mx.set((e.clientX-r.left)/r.width-.5); my.set((e.clientY-r.top)/r.height-.5); };
  const onLeave = () => { mx.set(0); my.set(0); };
  return (
    <div style={{ perspective: 900 }}>
      <motion.div style={{ rotateX: sx, rotateY: sy }} onMouseMove={onMove} onMouseLeave={onLeave} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

/* ─── Stat card ─────────────────────────────────────────────────────────────── */
function StatCard({ label, value, from, to, icon }) {
  return (
    <TiltCard className="rounded-2xl p-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-md hover:shadow-xl transition-shadow">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-lg"
        style={{ background: `linear-gradient(135deg,${from},${to})` }}>
        <span className="text-white">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 tabular-nums">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{label}</p>
    </TiltCard>
  );
}

/* ─── Badges ────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.open;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
      style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }}/>
      {c.label}
    </span>
  );
}
function CatBadge({ cat }) {
  const c = CAT_CFG[cat] || CAT_CFG.other;
  return (
    <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold"
      style={{ background: c.color + '22', color: c.color }}>
      {c.label}
    </span>
  );
}

/* ─── Message bubble ─────────────────────────────────────────────────────────── */
function Bubble({ msg }) {
  const isAdmin = msg.sender === 'admin';
  if (isAdmin) {
    return (
      <div className="flex gap-3 items-start flex-row-reverse">
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
          <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <p className="text-[11px] text-slate-400 mb-1 font-semibold">{msg.senderName || 'Support NursesPrep'}</p>
          <div className="inline-block max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm"
            style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
            <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-slate-100 dark:bg-slate-600">
        <svg width="12" height="12" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-400 mb-1 font-semibold">{msg.senderName || 'Utilisateur'}</p>
        <div className="inline-block max-w-[85%] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
}

/* ─── Status selector button ────────────────────────────────────────────────── */
function StatusBtn({ current, value, label, color, onClick, loading }) {
  const active = current === value;
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
      onClick={() => !active && onClick(value)}
      disabled={active || loading}
      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 transition-all disabled:opacity-70"
      style={active
        ? { background: color + '20', borderColor: color, color }
        : { background: 'transparent', borderColor: '#e2e8f0', color: '#94a3b8' }}>
      {label}
    </motion.button>
  );
}

/* ════════════════════════════════════════════════════════════════════════════ */
export default function AdminTickets() {
  const headers   = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const bottomRef = useRef(null);

  const [view,           setView]          = useState('list');
  const [tickets,        setTickets]       = useState([]);
  const [ticket,         setTicket]        = useState(null);
  const [loading,        setLoading]       = useState(true);
  const [statusFilter,   setStatusFilter]  = useState('all');
  const [search,         setSearch]        = useState('');
  const [replyText,      setReplyText]     = useState('');
  const [replying,       setReplying]      = useState(false);
  const [updatingStatus, setUpdatingStatus]= useState(false);
  const [deleteId,       setDeleteId]      = useState(null);

  /* ── Data ── */
  const loadTickets = async () => {
    try { const r = await axios.get(`${API_URL}/tickets/admin`, { headers }); setTickets(r.data); }
    catch(e) {}
    setLoading(false);
  };

  const openTicket = async (t) => {
    setTicket(t); setView('detail'); setReplyText('');
    try { const r = await axios.get(`${API_URL}/tickets/admin/${t._id}`, { headers }); setTicket(r.data); }
    catch(e) {}
  };

  useEffect(() => { loadTickets(); }, []); // eslint-disable-line
  useEffect(() => {
    if (view === 'detail' && bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length, view]);

  /* ── Actions ── */
  const handleReply = async () => {
    if (!replyText.trim() || !ticket) return;
    setReplying(true);
    try {
      const r = await axios.post(`${API_URL}/tickets/admin/${ticket._id}/reply`, { content: replyText }, { headers });
      setTicket(r.data); setReplyText(''); loadTickets();
    } catch(e) {}
    setReplying(false);
  };

  const handleStatus = async (status) => {
    if (!ticket) return;
    setUpdatingStatus(true);
    try {
      const r = await axios.put(`${API_URL}/tickets/admin/${ticket._id}/status`, { status }, { headers });
      setTicket(r.data); loadTickets();
    } catch(e) {}
    setUpdatingStatus(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`${API_URL}/tickets/admin/${deleteId}`, { headers });
      if (ticket?._id === deleteId) { setView('list'); setTicket(null); }
      setDeleteId(null); loadTickets();
    } catch(e) {}
  };

  /* ── Filtered list ── */
  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.subject?.toLowerCase().includes(q)
          || t.userName?.toLowerCase().includes(q)
          || t.userEmail?.toLowerCase().includes(q);
    }
    return true;
  });

  /* ── Stats ── */
  const total  = tickets.length;
  const nOpen  = tickets.filter(t => t.status === 'open').length;
  const nIp    = tickets.filter(t => t.status === 'in_progress').length;
  const nClose = tickets.filter(t => t.status === 'closed').length;
  const unread = tickets.filter(t => !t.isReadByAdmin).length;

  const FILTER_TABS = [
    { key: 'all',         label: `Tous (${total})` },
    { key: 'open',        label: `Ouverts (${nOpen})` },
    { key: 'in_progress', label: `En cours (${nIp})` },
    { key: 'closed',      label: `Fermés (${nClose})` },
  ];

  /* ════════════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout isAdmin>
      <main className="flex-1 overflow-auto bg-slate-50/60 dark:bg-slate-950">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1a2e50 40%,#0c3460 100%)', minHeight: 220 }}>
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,#3b82f6,transparent)', opacity: 0.08, filter: 'blur(40px)' }}/>
          <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,#6366f1,transparent)', opacity: 0.08, filter: 'blur(32px)' }}/>

          <div className="relative z-10 px-6 py-10 max-w-6xl mx-auto">
            {/* Top row */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <NursesLogo size="sm" light/>
                <span className="text-[10px] font-bold bg-white/10 text-blue-200 px-2.5 py-1 rounded-lg tracking-widest uppercase">
                  Administration
                </span>
              </div>
              {unread > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-bold bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"/>
                  {unread} non lu{unread > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Title + stat cards */}
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">Tickets Support</h1>
                <p className="text-blue-300 text-sm">Gérez les demandes des utilisateurs</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Total',    value: total,  from: '#2563eb', to: '#0891b2', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
                  { label: 'Ouverts', value: nOpen,  from: '#059669', to: '#10b981', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
                  { label: 'En cours', value: nIp,   from: '#d97706', to: '#f59e0b', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                  { label: 'Fermés',  value: nClose, from: '#475569', to: '#64748b', icon: <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}>
                    <StatCard {...s}/>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">

            {/* ══ LIST VIEW ══ */}
            {view === 'list' && (
              <motion.div key="list"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>

                {/* Filters + search */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                  {/* Status tabs */}
                  <div className="flex gap-1 bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-100 dark:border-slate-700 shadow-sm flex-wrap">
                    {FILTER_TABS.map(tab => (
                      <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          statusFilter === tab.key
                            ? 'text-white shadow-md'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                        style={statusFilter === tab.key ? { background: 'linear-gradient(135deg,#2563eb,#0891b2)' } : {}}>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  {/* Search */}
                  <div className="relative flex-1 max-w-xs">
                    <svg width="15" height="15" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24"
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                      placeholder="Rechercher…"
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition shadow-sm"/>
                  </div>
                </div>

                {/* Ticket table */}
                {loading ? (
                  <div className="text-center py-20 text-slate-400">Chargement…</div>
                ) : filtered.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-14 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-semibold">Aucun ticket trouvé</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                      <div className="col-span-1"/>
                      <div className="col-span-4">Objet / Utilisateur</div>
                      <div className="col-span-2">Catégorie</div>
                      <div className="col-span-2">Statut</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-1 text-right">Actions</div>
                    </div>
                    {filtered.map((t, i) => (
                      <motion.div key={t._id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                        className="grid grid-cols-12 gap-3 px-4 py-3.5 border-b border-slate-50 dark:border-slate-700/50 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors items-center group cursor-pointer"
                        onClick={() => openTicket(t)}>
                        {/* Unread dot */}
                        <div className="col-span-1 flex justify-center">
                          <div className="w-2 h-2 rounded-full"
                            style={{ background: !t.isReadByAdmin ? '#3b82f6' : 'transparent' }}/>
                        </div>
                        {/* Subject + user */}
                        <div className="col-span-4 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {t.subject}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {t.userName} · {t.userEmail}
                          </p>
                        </div>
                        {/* Category */}
                        <div className="col-span-2"><CatBadge cat={t.category}/></div>
                        {/* Status */}
                        <div className="col-span-2"><StatusBadge status={t.status}/></div>
                        {/* Date */}
                        <div className="col-span-2 text-xs text-slate-400">
                          {new Date(t.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          <br/>
                          <span className="text-[10px] font-mono text-slate-300 dark:text-slate-500">#{t._id.slice(-6).toUpperCase()}</span>
                        </div>
                        {/* Delete */}
                        <div className="col-span-1 flex justify-end">
                          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={e => { e.stopPropagation(); setDeleteId(t._id); }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50">
                            <svg width="12" height="12" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                              <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* ══ DETAIL VIEW ══ */}
            {view === 'detail' && ticket && (
              <motion.div key="detail"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.28 }}>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* ── Left: conversation ── */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Back + title */}
                    <div className="flex items-start gap-4">
                      <motion.button whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}
                        onClick={() => { setView('list'); setTicket(null); loadTickets(); }}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition pt-0.5 flex-shrink-0">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                        Retour
                      </motion.button>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{ticket.subject}</h2>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <CatBadge cat={ticket.category}/>
                          <StatusBadge status={ticket.status}/>
                          <span className="text-[11px] font-mono text-slate-400">#{ticket._id.slice(-6).toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Thread */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 space-y-5 min-h-[300px] max-h-[500px] overflow-y-auto">
                      {(ticket.messages || []).map((msg, i) => <Bubble key={i} msg={msg}/>)}
                      <div ref={bottomRef}/>
                    </div>

                    {/* Admin reply box */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Répondre</p>
                      <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)}
                        placeholder="Rédigez votre réponse…"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition"/>
                      <div className="flex justify-end mt-3">
                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                          onClick={handleReply} disabled={replying || !replyText.trim()}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 shadow-md shadow-blue-500/25"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                          {replying && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                          Envoyer la réponse
                          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                          </svg>
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* ── Right: ticket info + status ── */}
                  <div className="space-y-4">

                    {/* User info */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Utilisateur</p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                          {ticket.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{ticket.userName}</p>
                          <p className="text-xs text-slate-400 truncate">{ticket.userEmail}</p>
                        </div>
                      </div>
                      <div className="space-y-1 text-xs text-slate-400">
                        <div className="flex justify-between">
                          <span>Créé le</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mis à jour</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            {new Date(ticket.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Messages</span>
                          <span className="text-slate-600 dark:text-slate-300 font-medium">{ticket.messages?.length || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status change */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Changer le statut</p>
                      <div className="flex flex-col gap-2">
                        <StatusBtn current={ticket.status} value="open"        label="🟢 Ouvert"   color="#10b981" onClick={handleStatus} loading={updatingStatus}/>
                        <StatusBtn current={ticket.status} value="in_progress" label="🟡 En cours"  color="#f59e0b" onClick={handleStatus} loading={updatingStatus}/>
                        <StatusBtn current={ticket.status} value="closed"      label="⚫ Fermé"    color="#64748b" onClick={handleStatus} loading={updatingStatus}/>
                      </div>
                    </div>

                    {/* Danger zone */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-100 dark:border-red-900/30 p-5">
                      <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3">Zone de danger</p>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setDeleteId(ticket._id)}
                        className="w-full py-2.5 rounded-xl text-sm font-bold text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition border border-red-100 dark:border-red-800">
                        Supprimer ce ticket
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Delete confirm modal ─────────────────────────────────────── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Supprimer le ticket ?</h3>
              <p className="text-sm text-slate-400 mb-6">Cette action est irréversible. Toute la conversation sera perdue.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  Annuler
                </button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition">
                  Supprimer
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
