import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, Card, Badge,
  Toolbar, SearchInput, FilterPills, DataTable, ConfirmModal,
  toast, useIsMobile, C, clay,
} from '../../components/admin/adminKit';

const ticketIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const STATUS_CFG = {
  open:        { label: 'Ouvert',   color: '#10b981' },
  in_progress: { label: 'En cours', color: '#f59e0b' },
  closed:      { label: 'Fermé',    color: '#64748b' },
};
const CAT_CFG = {
  question:   { label: 'Question',    color: '#3b82f6' },
  bug:        { label: 'Bug',         color: '#ef4444' },
  billing:    { label: 'Facturation', color: '#f59e0b' },
  suggestion: { label: 'Suggestion',  color: '#10b981' },
  other:      { label: 'Autre',       color: '#94a3b8' },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.open;
  return (
    <Badge color={c.color}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, marginRight: 5, display: 'inline-block' }} />
      {c.label}
    </Badge>
  );
}
function CatBadge({ cat }) {
  const c = CAT_CFG[cat] || CAT_CFG.other;
  return <Badge color={c.color}>{c.label}</Badge>;
}

/* ─── Bulle de message ──────────────────────────────────────────────────── */
function Bubble({ msg }) {
  const isAdmin = msg.sender === 'admin';
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2, background: isAdmin ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : C.bg, border: isAdmin ? 'none' : `1px solid ${C.border}` }}>
        {isAdmin
          ? <svg width="13" height="13" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          : <svg width="13" height="13" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
        <p style={{ fontSize: 11, color: C.sub, marginBottom: 4, fontWeight: 700 }}>{msg.senderName || (isAdmin ? 'Support NursesPrep' : 'Utilisateur')}</p>
        <div style={{
          display: 'inline-block', maxWidth: '85%', padding: '10px 14px',
          borderRadius: isAdmin ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isAdmin ? 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' : '#fff',
          border: isAdmin ? 'none' : `1px solid ${C.border}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <p style={{ fontSize: 13.5, color: isAdmin ? '#fff' : C.text, whiteSpace: 'pre-wrap', lineHeight: 1.55 }}>{msg.content}</p>
        </div>
        <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4 }}>{new Date(msg.createdAt).toLocaleString('fr-FR')}</p>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminTickets() {
  const headers   = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const bottomRef = useRef(null);
  const isMobile  = useIsMobile();

  const [view, setView]                 = useState('list');
  const [tickets, setTickets]           = useState([]);
  const [ticket, setTicket]             = useState(null);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [replyText, setReplyText]       = useState('');
  const [replying, setReplying]         = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleteId, setDeleteId]         = useState(null);
  const [delLoading, setDelLoading]     = useState(false);

  const loadTickets = async () => {
    try { const r = await axios.get(`${API_URL}/tickets/admin`, { headers }); setTickets(r.data); }
    catch { toast.error('Impossible de charger les tickets'); }
    setLoading(false);
  };

  const openTicket = async (t) => {
    setTicket(t); setView('detail'); setReplyText('');
    try { const r = await axios.get(`${API_URL}/tickets/admin/${t._id}`, { headers }); setTicket(r.data); }
    catch { /* affiche la version liste */ }
  };

  useEffect(() => { loadTickets(); }, []); // eslint-disable-line
  useEffect(() => {
    if (view === 'detail' && bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages?.length, view]);

  const handleReply = async () => {
    if (!replyText.trim() || !ticket) return;
    setReplying(true);
    try {
      const r = await axios.post(`${API_URL}/tickets/admin/${ticket._id}/reply`, { content: replyText }, { headers });
      setTicket(r.data); setReplyText(''); loadTickets();
      toast.success('Réponse envoyée');
    } catch (e) { toast.error(e.response?.data?.message || "Erreur lors de l'envoi — ton message est conservé"); }
    setReplying(false);
  };

  const handleStatus = async (status) => {
    if (!ticket) return;
    setUpdatingStatus(true);
    try {
      const r = await axios.put(`${API_URL}/tickets/admin/${ticket._id}/status`, { status }, { headers });
      setTicket(r.data); loadTickets();
      toast.success(`Statut : ${STATUS_CFG[status]?.label}`);
    } catch (e) { toast.error('Erreur lors du changement de statut'); }
    setUpdatingStatus(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/tickets/admin/${deleteId}`, { headers });
      if (ticket?._id === deleteId) { setView('list'); setTicket(null); }
      setDeleteId(null);
      toast.success('Ticket supprimé');
      loadTickets();
    } catch (e) { toast.error('Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const filtered = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.subject?.toLowerCase().includes(q) || t.userName?.toLowerCase().includes(q) || t.userEmail?.toLowerCase().includes(q);
    }
    return true;
  });

  const total  = tickets.length;
  const nOpen  = tickets.filter(t => t.status === 'open').length;
  const nIp    = tickets.filter(t => t.status === 'in_progress').length;
  const nClose = tickets.filter(t => t.status === 'closed').length;
  const unread = tickets.filter(t => !t.isReadByAdmin).length;

  return (
    <AdminPage
      title="Tickets Support"
      subtitle={unread > 0 ? `${unread} non lu${unread > 1 ? 's' : ''}` : 'Gérez les demandes des utilisateurs'}
      icon={ticketIcon()}
      stats={[
        { value: total,  label: 'tickets' },
        { value: nOpen,  label: 'ouverts' },
        { value: nIp,    label: 'en cours' },
        { value: nClose, label: 'fermés' },
      ]}
    >
      <AnimatePresence mode="wait">

        {/* ══ LISTE ══ */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <Card>
              <Toolbar>
                <FilterPills value={statusFilter} onChange={setStatusFilter}
                  options={[['all', `Tous (${total})`], ['open', `Ouverts (${nOpen})`], ['in_progress', `En cours (${nIp})`], ['closed', `Fermés (${nClose})`]]} />
                <SearchInput value={search} onChange={setSearch} placeholder="Rechercher…" />
              </Toolbar>

              <DataTable
                loading={loading}
                items={filtered}
                onDelete={t => setDeleteId(t._id)}
                empty={{ icon: ticketIcon(24), title: 'Aucun ticket trouvé' }}
                columns={[
                  { label: '', render: t => <span style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: !t.isReadByAdmin ? 'var(--theme-primary)' : 'transparent' }} /> },
                  { label: 'Objet / Utilisateur', maxWidth: 280, render: t => (
                    <button onClick={() => openTicket(t)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', minWidth: 0, width: '100%' }}>
                      <span style={{ fontWeight: 700, color: C.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</span>
                      <span style={{ fontSize: 11, color: C.sub, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.userName} · {t.userEmail}</span>
                    </button>
                  ) },
                  { label: 'Catégorie', render: t => <CatBadge cat={t.category} /> },
                  { label: 'Statut', render: t => <StatusBadge status={t.status} /> },
                  { label: 'Date', render: t => (
                    <span style={{ fontSize: 12, color: C.sub }}>
                      {new Date(t.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      <span style={{ display: 'block', fontSize: 10, fontFamily: 'monospace', color: '#94a3b8' }}>#{t._id.slice(-6).toUpperCase()}</span>
                    </span>
                  ) },
                  { label: '', render: t => (
                    <button onClick={() => openTicket(t)}
                      style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${C.border}`, background: '#fff', color: 'var(--theme-primary)', minHeight: 36 }}>
                      Ouvrir
                    </button>
                  ) },
                ]}
                renderCard={t => (
                  <button onClick={() => openTicket(t)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {!t.isReadByAdmin && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--theme-primary)', flexShrink: 0 }} />}
                      <span style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.subject}</span>
                    </div>
                    <div style={{ fontSize: 11, color: C.sub, marginBottom: 8 }}>{t.userName} · {t.userEmail}</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <CatBadge cat={t.category} />
                      <StatusBadge status={t.status} />
                      <Badge color="#94a3b8">{new Date(t.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</Badge>
                    </div>
                  </button>
                )}
              />
            </Card>
          </motion.div>
        )}

        {/* ══ DÉTAIL ══ */}
        {view === 'detail' && ticket && (
          <motion.div key="detail" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>

            {/* Retour + titre */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <button onClick={() => { setView('list'); setTicket(null); loadTickets(); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: `1px solid ${C.border}`, background: '#fff', color: C.sub, boxShadow: clay.sm, flexShrink: 0, minHeight: 44 }}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                Retour
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 className="nunito" style={{ fontSize: 17, fontWeight: 900, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  <CatBadge cat={ticket.category} />
                  <StatusBadge status={ticket.status} />
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#94a3b8' }}>#{ticket._id.slice(-6).toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: 16, alignItems: 'start' }}>

              {/* Conversation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Card style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 260, maxHeight: 460, overflowY: 'auto' }}>
                  {(ticket.messages || []).map((msg, i) => <Bubble key={i} msg={msg} />)}
                  <div ref={bottomRef} />
                </Card>

                {/* Réponse */}
                <Card style={{ padding: 16 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Répondre</p>
                  <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Rédigez votre réponse…"
                    className="text-base md:text-sm"
                    style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: 14, border: `1.5px solid ${C.border}`, background: C.bg, color: C.text, resize: 'none', outline: 'none' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <motion.button whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.97 }}
                      onClick={handleReply} disabled={replying || !replyText.trim()}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px', borderRadius: 14,
                        fontSize: 13, fontWeight: 800, color: '#fff', border: 'none', minHeight: 46,
                        cursor: replying || !replyText.trim() ? 'default' : 'pointer',
                        background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))',
                        opacity: replying || !replyText.trim() ? 0.6 : 1,
                        boxShadow: replying || !replyText.trim() ? 'none' : clay.btn,
                        fontFamily: 'Nunito,sans-serif',
                      }}>
                      {replying && <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'block' }} />}
                      Envoyer la réponse
                      <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </motion.button>
                  </div>
                </Card>
              </div>

              {/* Infos + statut */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Card style={{ padding: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Utilisateur</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                      {ticket.userName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.userName}</p>
                      <p style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.userEmail}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: C.sub }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Créé le</span>
                      <span style={{ color: C.text, fontWeight: 600 }}>{new Date(ticket.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Mis à jour</span>
                      <span style={{ color: C.text, fontWeight: 600 }}>{new Date(ticket.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Messages</span>
                      <span style={{ color: C.text, fontWeight: 600 }}>{ticket.messages?.length || 0}</span>
                    </div>
                  </div>
                </Card>

                <Card style={{ padding: 18 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Changer le statut</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Object.entries(STATUS_CFG).map(([value, cfg]) => {
                      const active = ticket.status === value;
                      return (
                        <button key={value} onClick={() => !active && handleStatus(value)} disabled={active || updatingStatus}
                          style={{
                            padding: '11px 14px', borderRadius: 12, fontSize: 12.5, fontWeight: 800, minHeight: 44,
                            cursor: active ? 'default' : 'pointer', transition: 'all 0.15s',
                            border: `2px solid ${active ? cfg.color : C.border}`,
                            background: active ? cfg.color + '18' : 'transparent',
                            color: active ? cfg.color : '#94a3b8',
                            opacity: updatingStatus && !active ? 0.5 : 1,
                          }}>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                <Card style={{ padding: 18, borderColor: '#fecaca' }}>
                  <p style={{ fontSize: 11, fontWeight: 800, color: '#f87171', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Zone de danger</p>
                  <button onClick={() => setDeleteId(ticket._id)}
                    style={{ width: '100%', padding: '12px', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', border: '1.5px solid #fecaca', background: '#fef2f2', color: '#ef4444', minHeight: 46 }}>
                    Supprimer ce ticket
                  </button>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <ConfirmModal
            title="Supprimer le ticket ?"
            message="Cette action est irréversible. Toute la conversation sera perdue."
            onConfirm={handleDelete}
            onClose={() => setDeleteId(null)}
            loading={delLoading}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
