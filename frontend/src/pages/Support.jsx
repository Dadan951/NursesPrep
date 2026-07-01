import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import DashboardLayout from '../components/DashboardLayout';
import { API_URL } from '../context/AuthContext';
import { getCache, setCache } from '../utils/cache';

/* ─── Design tokens ──────────────────────────────────────────────────────────── */
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

/* ─── Config ─────────────────────────────────────────────────────────────────── */
const STATUS_CFG = {
  open:        { label: 'Ouvert',   color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  in_progress: { label: 'En cours', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  closed:      { label: 'Fermé',    color: '#64748b', bg: 'rgba(100,116,139,0.12)' },
};
const CAT_CFG = {
  question:   { label: 'Question',    color: '#3b82f6' },
  bug:        { label: 'Bug',         color: '#ef4444' },
  billing:    { label: 'Facturation', color: '#f59e0b' },
  suggestion: { label: 'Suggestion',  color: '#10b981' },
  other:      { label: 'Autre',       color: '#94a3b8' },
};
const CAT_LABELS = {
  question:   'Question générale',
  bug:        'Signaler un bug',
  billing:    'Facturation / Abonnement',
  suggestion: 'Suggestion',
  other:      'Autre',
};

/* ─── Badges ─────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.open;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      fontSize: 11, fontWeight: 700, flexShrink: 0,
      background: c.bg, color: c.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, flexShrink: 0 }}/>
      {c.label}
    </span>
  );
}

function CatBadge({ cat }) {
  const c = CAT_CFG[cat] || CAT_CFG.other;
  return (
    <span style={{
      display: 'inline-flex', padding: '2px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 700,
      background: c.color + '22', color: c.color,
    }}>
      {c.label}
    </span>
  );
}

/* ─── Bubble ─────────────────────────────────────────────────────────────────── */
function Bubble({ msg }) {
  const isAdmin = msg.sender === 'admin';

  if (isAdmin) {
    return (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--theme-hero)', marginTop: 2,
          boxShadow: '0 2px 8px rgba(var(--theme-primary-rgb),0.25)',
        }}>
          <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
            {msg.senderName || 'Support NursesPrep'}
          </p>
          <div style={{
            display: 'inline-block', maxWidth: '85%',
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: '16px 16px 16px 4px',
            padding: '10px 14px', boxShadow: clay.sm,
          }}>
            <p style={{ fontSize: 13, color: C.text, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {msg.content}
            </p>
          </div>
          <p style={{ fontSize: 10, color: C.sub, marginTop: 4 }}>
            {new Date(msg.createdAt).toLocaleString('fr-FR')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bg, border: `1px solid ${C.border}`,
        boxShadow: clay.sm, marginTop: 2,
      }}>
        <svg width="13" height="13" fill="none" stroke={C.sub} strokeWidth="2" viewBox="0 0 24 24">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <p style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 600 }}>
          {msg.senderName || 'Vous'}
        </p>
        <div style={{
          display: 'inline-block', maxWidth: '85%',
          background: 'var(--theme-primary)',
          borderRadius: '16px 16px 4px 16px',
          padding: '10px 14px',
          boxShadow: clay.btn(),
        }}>
          <p style={{ fontSize: 13, color: '#fff', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {msg.content}
          </p>
        </div>
        <p style={{ fontSize: 10, color: C.sub, marginTop: 4 }}>
          {new Date(msg.createdAt).toLocaleString('fr-FR')}
        </p>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Support() {
  const headers   = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const bottomRef = useRef(null);

  const [view,       setView]       = useState('list');
  const [tickets,    setTickets]    = useState([]);
  const [ticket,     setTicket]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState({ subject: '', category: 'question', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [formErr,    setFormErr]    = useState('');
  const [replyText,  setReplyText]  = useState('');
  const [replying,   setReplying]   = useState(false);

  /* ── Data ── */
  const loadTickets = async () => {
    const cached = getCache('tickets_list');
    if (cached) { setTickets(cached); setLoading(false); }
    try {
      const r = await axios.get(`${API_URL}/tickets/my`, { headers });
      setTickets(r.data); setCache('tickets_list', r.data);
    } catch(e) {}
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
  const openCount   = tickets.filter(t => t.status === 'open').length;
  const ipCount     = tickets.filter(t => t.status === 'in_progress').length;
  const closedCount = tickets.filter(t => t.status === 'closed').length;
  const unread      = tickets.filter(t => t.isReadByUser === false).length;

  /* ════════════════════════════════════════════════════════════════════════════ */
  return (
    <DashboardLayout>
      <main style={{ flex: 1, overflowY: 'auto', background: C.bg }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--theme-hero)', minHeight: '200px' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} aria-hidden/>
          <div style={{
            position: 'absolute', top: -40, right: -20, width: 240, height: 240,
            borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.12),transparent)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', bottom: -30, left: -20, width: 180, height: 180,
            borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.08),transparent)',
            filter: 'blur(32px)', pointerEvents: 'none',
          }}/>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.15),transparent 55%)', pointerEvents:'none' }} aria-hidden/>

          <div style={{ position: 'relative', zIndex: 10, padding: '28px 24px 28px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

              {/* Titre */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 16, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)' }}>
                  <svg width="22" height="22" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h1 className="nunito" style={{ fontSize: 24, fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1 }}>
                    Support
                  </h1>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                    Notre équipe répond dans les plus brefs délais
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 4 }}>
                {[
                  { label: 'Total',    val: tickets.length, col: '#fff' },
                  { label: 'Ouverts',  val: openCount,      col: '#6ee7b7' },
                  { label: 'En cours', val: ipCount,        col: '#fcd34d' },
                  { label: 'Résolus',  val: closedCount,    col: 'rgba(255,255,255,0.5)' },
                ].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
                    <p className="nunito" style={{ fontSize: 22, fontWeight: 900, color: s.col, lineHeight: 1 }}>{s.val}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
          <AnimatePresence mode="wait">

            {/* ══ LIST VIEW ══ */}
            {view === 'list' && (
              <motion.div key="list"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.28 }}>

                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0 }}>Mes tickets</h2>
                    {unread > 0 && (
                      <span style={{
                        padding: '2px 10px', borderRadius: 999,
                        fontSize: 11, fontWeight: 800,
                        background: C.indigo, color: '#fff',
                        boxShadow: clay.btn(),
                      }}>
                        {unread} nouveau{unread > 1 ? 'x' : ''}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 20px', borderRadius: 14,
                      fontSize: 13, fontWeight: 800, color: '#fff', border: 'none', cursor: 'pointer',
                      background: C.indigo, boxShadow: clay.btn(),
                    }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Nouveau ticket
                  </motion.button>
                </div>

                {/* Contenu */}
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '80px 0', color: C.sub }}>Chargement…</div>
                ) : tickets.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                    style={{
                      background: C.card, borderRadius: 24, border: `1.5px solid ${C.border}`,
                      boxShadow: clay.card, padding: '56px 32px', textAlign: 'center',
                    }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: 20, margin: '0 auto 18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'var(--theme-hero)',
                      boxShadow: '0 4px 0 var(--theme-dark), 0 8px 24px rgba(var(--theme-primary-rgb),0.3)',
                    }}>
                      <svg width="28" height="28" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: C.text, margin: '0 0 8px' }}>Aucun ticket</p>
                    <p style={{ fontSize: 13, color: C.sub, marginBottom: 24 }}>
                      Créez votre premier ticket pour contacter le support.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={() => setShowModal(true)}
                      style={{
                        padding: '10px 24px', borderRadius: 14,
                        fontSize: 13, fontWeight: 800, color: '#fff', border: 'none', cursor: 'pointer',
                        background: C.indigo, boxShadow: clay.btn(),
                      }}>
                      Créer un ticket
                    </motion.button>
                  </motion.div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tickets.map((t, i) => (
                      <motion.div key={t._id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ y: -2, boxShadow: `0 2px 0 var(--theme-shadow), 0 8px 32px rgba(var(--theme-primary-rgb),0.14), 0 1px 0 rgba(255,255,255,0.9) inset` }}
                        onClick={() => openTicket(t)}
                        style={{
                          background: C.card, borderRadius: 18,
                          border: `1.5px solid ${C.border}`,
                          boxShadow: clay.card, padding: '14px 16px',
                          cursor: 'pointer', transition: 'box-shadow 0.18s',
                        }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {/* Unread dot */}
                          <div style={{
                            width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                            background: t.isReadByUser === false ? C.indigo : 'transparent',
                            boxShadow: t.isReadByUser === false ? `0 0 6px rgba(var(--theme-primary-rgb),0.5)` : 'none',
                          }}/>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 11, fontFamily: 'monospace', color: C.sub, flexShrink: 0 }}>
                                #{t._id.slice(-6).toUpperCase()}
                              </span>
                              <CatBadge cat={t.category}/>
                            </div>
                            <p style={{
                              fontSize: 14, fontWeight: 700, color: C.text,
                              margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                              {t.subject}
                            </p>
                            <p style={{ fontSize: 12, color: C.sub, marginTop: 2 }}>
                              {t.messages?.length || 0} message{(t.messages?.length || 0) !== 1 ? 's' : ''}
                              {' · '}
                              {new Date(t.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <StatusBadge status={t.status}/>
                          <svg width="14" height="14" fill="none" stroke={C.sub} strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                  <motion.button
                    whileHover={{ x: -2 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setView('list'); setTicket(null); loadTickets(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      fontSize: 13, fontWeight: 600, color: C.sub,
                      background: 'none', border: 'none', cursor: 'pointer', paddingTop: 2, flexShrink: 0,
                    }}>
                    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                    Retour
                  </motion.button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{
                      fontSize: 17, fontWeight: 800, color: C.text,
                      margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {ticket.subject}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                      <CatBadge cat={ticket.category}/>
                      <StatusBadge status={ticket.status}/>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: C.sub }}>
                        #{ticket._id.slice(-6).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 11, color: C.sub }}>
                        {new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thread */}
                <div style={{
                  background: C.card, borderRadius: 20, border: `1.5px solid ${C.border}`,
                  boxShadow: clay.card, padding: '20px', marginBottom: 12,
                  minHeight: 300, maxHeight: 480, overflowY: 'auto',
                  display: 'flex', flexDirection: 'column', gap: 18,
                }}>
                  {(ticket.messages || []).length === 0 ? (
                    <p style={{ textAlign: 'center', color: C.sub, padding: '32px 0', fontSize: 13 }}>Aucun message</p>
                  ) : (
                    (ticket.messages || []).map((msg, i) => <Bubble key={i} msg={msg}/>)
                  )}
                  <div ref={bottomRef}/>
                </div>

                {/* Reply / closed */}
                {ticket.status !== 'closed' ? (
                  <div style={{
                    background: C.card, borderRadius: 20, border: `1.5px solid ${C.border}`,
                    boxShadow: clay.card, padding: '16px',
                  }}>
                    <textarea rows={3} value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Écrire un message…"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        padding: '12px 16px', borderRadius: 12,
                        border: `1.5px solid ${C.border}`, background: C.bg,
                        fontSize: 13, color: C.text, resize: 'none',
                        outline: 'none', fontFamily: 'inherit', lineHeight: 1.5,
                      }}
                      onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.boxShadow = `0 0 0 3px rgba(var(--theme-primary-rgb),0.12)`; }}
                      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                        onClick={handleReply} disabled={replying || !replyText.trim()}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 20px', borderRadius: 12,
                          fontSize: 13, fontWeight: 800, color: '#fff',
                          border: 'none', cursor: replying || !replyText.trim() ? 'not-allowed' : 'pointer',
                          background: C.indigo, boxShadow: clay.btn(),
                          opacity: replying || !replyText.trim() ? 0.55 : 1,
                        }}>
                        {replying && (
                          <div style={{
                            width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                            borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                          }}/>
                        )}
                        Envoyer
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    borderRadius: 16, border: `1.5px solid ${C.border}`,
                    background: C.bg, padding: '16px 24px',
                    textAlign: 'center', fontSize: 13, color: C.sub,
                  }}>
                    Ce ticket est fermé. Créez un nouveau ticket pour toute nouvelle demande.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ── Modale nouveau ticket ─────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 16, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)',
            }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              style={{
                background: C.card, borderRadius: 28,
                boxShadow: '0 4px 0 rgba(0,0,0,0.15), 0 24px 64px rgba(0,0,0,0.3)',
                width: '100%', maxWidth: 500, overflow: 'hidden',
              }}>

              {/* Header modale */}
              <div style={{
                padding: '20px 24px',
                background: 'var(--theme-hero)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: 0 }}>Nouveau ticket</h2>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>
                    Nous vous répondrons dès que possible
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  style={{
                    width: 34, height: 34, borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                    boxShadow: '0 1px 0 rgba(0,0,0,0.15)',
                  }}>
                  <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </motion.button>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleCreate} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {formErr && (
                  <div style={{
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                    fontSize: 13, color: '#ef4444',
                  }}>
                    {formErr}
                  </div>
                )}

                {/* Catégorie */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                    Catégorie
                  </label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: 12,
                      border: `1.5px solid ${C.border}`, background: C.bg,
                      fontSize: 13, color: C.text, outline: 'none', fontFamily: 'inherit',
                      boxShadow: clay.sm,
                    }}>
                    {Object.entries(CAT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>

                {/* Objet */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                    Objet
                  </label>
                  <input
                    type="text" required value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    placeholder="Décrivez brièvement votre demande"
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: 12,
                      border: `1.5px solid ${C.border}`, background: C.bg,
                      fontSize: 13, color: C.text, outline: 'none', fontFamily: 'inherit',
                      boxShadow: clay.sm,
                    }}
                    onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.boxShadow = `0 0 0 3px rgba(var(--theme-primary-rgb),0.12)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = clay.sm; }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                    Message
                  </label>
                  <textarea
                    required rows={5} value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Expliquez votre problème en détail…"
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 12,
                      border: `1.5px solid ${C.border}`, background: C.bg,
                      fontSize: 13, color: C.text, resize: 'none', outline: 'none', fontFamily: 'inherit',
                      lineHeight: 1.5, boxShadow: clay.sm,
                    }}
                    onFocus={e => { e.target.style.borderColor = C.indigo; e.target.style.boxShadow = `0 0 0 3px rgba(var(--theme-primary-rgb),0.12)`; }}
                    onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = clay.sm; }}
                  />
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                  <motion.button
                    type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '10px 18px', borderRadius: 12,
                      fontSize: 13, fontWeight: 700, color: C.sub, cursor: 'pointer',
                      background: C.bg, border: `1.5px solid ${C.border}`,
                      boxShadow: clay.sm,
                    }}>
                    Annuler
                  </motion.button>
                  <motion.button
                    type="submit" disabled={submitting}
                    whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 22px', borderRadius: 12,
                      fontSize: 13, fontWeight: 800, color: '#fff',
                      border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      background: C.indigo, boxShadow: clay.btn(),
                      opacity: submitting ? 0.6 : 1,
                    }}>
                    {submitting && (
                      <div style={{
                        width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)',
                        borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                      }}/>
                    )}
                    {submitting ? 'Envoi…' : 'Envoyer le ticket'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
}
