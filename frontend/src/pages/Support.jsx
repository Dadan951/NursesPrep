import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';

/* ─── Config ────────────────────────────────────────────────────────────────── */
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
const CAT_LABELS = {
  question:   '❓ Question générale',
  bug:        '🐛 Signaler un bug',
  billing:    '💳 Facturation / Abonnement',
  suggestion: '💡 Suggestion',
  other:      '📝 Autre',
};

/* ─── Mini components ────────────────────────────────────────────────────────── */
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

function Bubble({ msg }) {
  const isAdmin = msg.sender === 'admin';
  if (isAdmin) {
    return (
      <div className="flex gap-3 items-start">
        <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
          <svg width="12" height="12" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-slate-400 mb-1 font-semibold">{msg.senderName || 'Support NursesPrep'}</p>
          <div className="inline-block max-w-[85%] bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm">
            <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-start flex-row-reverse">
      <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 bg-slate-100 dark:bg-slate-600">
        <svg width="12" height="12" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0 flex flex-col items-end">
        <p className="text-[11px] text-slate-400 mb-1 font-semibold">{msg.senderName || 'Vous'}</p>
        <div className="inline-block max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm"
          style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
          <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">{msg.content}</p>
        </div>
        <p className="text-[10px] text-slate-400 mt-1">{new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export default function Support() {
  const headers  = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const bottomRef = useRef(null);

  const [view,     setView]     = useState('list');
  const [tickets,  setTickets]  = useState([]);
  const [ticket,   setTicket]   = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [showModal,setShowModal]= useState(false);
  const [form,     setForm]     = useState({ subject: '', category: 'question', message: '' });
  const [submitting,setSubmitting] = useState(false);
  const [formErr,  setFormErr]  = useState('');
  const [replyText,setReplyText]= useState('');
  const [replying, setReplying] = useState(false);

  /* ── Data ── */
  const loadTickets = async () => {
    try { const r = await axios.get(`${API_URL}/tickets/my`, { headers }); setTickets(r.data); }
    catch(e) {}
    setLoading(false);
  };

  const openTicket = async (t) => {
    setTicket(t); setView('detail');
    try { const r = await axios.get(`${API_URL}/tickets/my/${t._id}`, { headers }); setTicket(r.data); }
    catch(e) {}
  };

  useEffect(() => { loadTickets(); }, []); // eslint-disable-line
  useEffect(() => {
    if (view === 'detail' && bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length, view]);

  /* ── Actions ── */
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) return;
    setSubmitting(true); setFormErr('');
    try {
      await axios.post(`${API_URL}/tickets`, form, { headers });
      setShowModal(false);
      setForm({ subject: '', category: 'question', message: '' });
      loadTickets();
    } catch(err) { setFormErr(err.response?.data?.message || 'Erreur lors de la création'); }
    setSubmitting(false);
  };

  const handleReply = async () => {
    if (!replyText.trim() || !ticket) return;
    setReplying(true);
    try {
      const r = await axios.post(`${API_URL}/tickets/my/${ticket._id}/reply`, { content: replyText }, { headers });
      setTicket(r.data); setReplyText(''); loadTickets();
    } catch(e) {}
    setReplying(false);
  };

  /* ── Stats ── */
  const openCount  = tickets.filter(t => t.status === 'open').length;
  const ipCount    = tickets.filter(t => t.status === 'in_progress').length;
  const closedCount= tickets.filter(t => t.status === 'closed').length;
  const unread     = tickets.filter(t => t.isReadByUser === false).length;

  /* ════════════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto bg-slate-50/60 dark:bg-slate-950">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e3a5f 45%,#0c4a6e 100%)', minHeight: 200 }}>
          <div className="absolute -top-10 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,#38bdf8,transparent)', opacity: 0.08, filter: 'blur(40px)' }}/>
          <div className="absolute bottom-0 -left-10 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle,#6366f1,transparent)', opacity: 0.08, filter: 'blur(32px)' }}/>

          <div className="relative z-10 px-6 py-10 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                    <svg width="22" height="22" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Contact Support</h1>
                    <p className="text-blue-300 text-xs mt-0.5">Notre équipe vous répond dans les plus brefs délais</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Total',     val: tickets.length, col: '#60a5fa' },
                  { label: 'Ouverts',   val: openCount,      col: '#34d399' },
                  { label: 'En cours',  val: ipCount,        col: '#fbbf24' },
                  { label: 'Résolus',   val: closedCount,    col: '#94a3b8' },
                ].map((s, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-xl px-3.5 py-2 text-center min-w-[68px]"
                    style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
                    <p className="text-xl font-bold" style={{ color: s.col }}>{s.val}</p>
                    <p className="text-[11px] text-blue-300">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">

            {/* ══ LIST VIEW ══ */}
            {view === 'list' && (
              <motion.div key="list"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Mes tickets</h2>
                    {unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500 text-white">
                        {unread} nouveau{unread > 1 ? 'x' : ''}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-500/30"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nouveau ticket
                  </motion.button>
                </div>

                {loading ? (
                  <div className="text-center py-20 text-slate-400">Chargement…</div>
                ) : tickets.length === 0 ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-14 text-center">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg,#1e3a5f,#0c4a6e)' }}>
                      <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 font-bold text-lg mb-1">Aucun ticket</p>
                    <p className="text-slate-400 text-sm mb-5">Créez votre premier ticket pour contacter le support.</p>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowModal(true)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                      Créer un ticket
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((t, i) => (
                      <motion.div key={t._id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => openTicket(t)}
                        className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 cursor-pointer hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all group">
                        <div className="flex items-center gap-4">
                          {/* Unread indicator */}
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: t.isReadByUser === false ? '#3b82f6' : 'transparent' }}/>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">
                                #{t._id.slice(-6).toUpperCase()}
                              </span>
                              <CatBadge cat={t.category}/>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {t.subject}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {t.messages?.length || 0} message{(t.messages?.length || 0) !== 1 ? 's' : ''}
                              {' · '}
                              {new Date(t.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <StatusBadge status={t.status}/>
                          <svg width="14" height="14" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" className="flex-shrink-0">
                            <polyline points="9 18 15 12 9 6"/>
                          </svg>
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

                {/* Back + header */}
                <div className="flex items-start gap-4 mb-6">
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
                      <span className="text-xs text-slate-400">
                        {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Conversation thread */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 mb-4 space-y-5 min-h-[300px] max-h-[480px] overflow-y-auto">
                  {(ticket.messages || []).length === 0 ? (
                    <p className="text-center text-slate-400 py-8 text-sm">Aucun message</p>
                  ) : (
                    (ticket.messages || []).map((msg, i) => <Bubble key={i} msg={msg}/>)
                  )}
                  <div ref={bottomRef}/>
                </div>

                {/* Reply box or closed banner */}
                {ticket.status !== 'closed' ? (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                    <textarea rows={3} value={replyText} onChange={e => setReplyText(e.target.value)}
                      placeholder="Écrire un message…"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition"/>
                    <div className="flex justify-end mt-3">
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                        onClick={handleReply} disabled={replying || !replyText.trim()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 shadow-md shadow-blue-500/25"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                        {replying && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                        Envoyer
                        <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 text-center text-sm text-slate-400">
                    Ce ticket est fermé. Créez un nouveau ticket pour toute nouvelle demande.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── New Ticket Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">

              {/* Modal header */}
              <div className="px-6 py-5 flex items-center justify-between"
                style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)' }}>
                <div>
                  <h2 className="text-lg font-bold text-white">Nouveau ticket</h2>
                  <p className="text-blue-300 text-xs mt-0.5">Nous vous répondrons dès que possible</p>
                </div>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition text-white"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                  onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'}
                  onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formErr && (
                  <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-2.5 border border-red-100 dark:border-red-800">
                    {formErr}
                  </p>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Catégorie</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-400 transition">
                    {Object.entries(CAT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Objet</label>
                  <input type="text" required value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Décrivez brièvement votre demande"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition"/>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Expliquez votre problème ou votre question en détail…"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none focus:outline-none focus:border-blue-400 transition"/>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                    Annuler
                  </button>
                  <motion.button type="submit" disabled={submitting}
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60 shadow-md shadow-blue-500/25"
                    style={{ background: 'linear-gradient(135deg,#2563eb,#0891b2)' }}>
                    {submitting && <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/>}
                    {submitting ? 'Envoi…' : 'Envoyer le ticket'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
