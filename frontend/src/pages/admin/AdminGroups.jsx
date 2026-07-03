import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, GhostBtn, Card, Badge,
  Toolbar, SearchInput, FilterPills, Modal, ConfirmModal, Spinner, EmptyState,
  toast, C, clay,
} from '../../components/admin/adminKit';

const groupsIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

/* ─── Modal détail de groupe ────────────────────────────────────────────── */
function GroupDetailModal({ group, onClose, onRequestDelete }) {
  const [pending, setPending]   = useState([]);
  const [pLoading, setPLoading] = useState(true);
  const [copied, setCopied]     = useState(false);

  useEffect(() => {
    axios.get(`${API_URL}/groups/${group._id}/pending`)
      .then(r => setPending(r.data))
      .catch(() => setPending([]))
      .finally(() => setPLoading(false));
  }, [group._id]);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`${API_URL}/groups/${group._id}/approve/${userId}`);
      setPending(p => p.filter(u => u._id !== userId));
      toast.success('Membre approuvé');
    } catch { toast.error("Erreur lors de l'approbation"); }
  };
  const handleReject = async (userId) => {
    try {
      await axios.delete(`${API_URL}/groups/${group._id}/reject/${userId}`);
      setPending(p => p.filter(u => u._id !== userId));
      toast.success('Demande refusée');
    } catch { toast.error('Erreur lors du refus'); }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(group.joinCode);
    setCopied(true);
    toast.success("Clé d'accès copiée");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      title={group.name}
      subtitle={`${group.isPrivate ? 'Privé' : 'Public'} · ${group.category || 'Général'}`}
      icon={<span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{group.name.charAt(0).toUpperCase()}</span>}
      onClose={onClose}
      maxWidth={520}
      footer={<>
        <GhostBtn onClick={onClose}>Fermer</GhostBtn>
        <GhostBtn danger onClick={() => { onClose(); onRequestDelete(group); }}>Supprimer le groupe</GhostBtn>
      </>}
    >
      {group.description && (
        <p style={{ fontSize: 13, color: C.sub, marginBottom: 16, background: C.bg, borderRadius: 14, padding: 12, lineHeight: 1.5 }}>{group.description}</p>
      )}

      {/* Infos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        <div style={{ background: C.bg, borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>Créateur</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{group.creator?.name || '—'}</p>
        </div>
        <div style={{ background: C.bg, borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>Membres</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{group.memberCount}</p>
        </div>
        <div style={{ gridColumn: '1 / -1', background: 'rgba(var(--theme-primary-rgb),0.07)', borderRadius: 14, padding: 12, border: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 10, color: 'var(--theme-primary)', fontWeight: 700, marginBottom: 6 }}>Clé d'accès</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 17, fontFamily: 'monospace', fontWeight: 800, color: 'var(--theme-primary)', letterSpacing: '0.3em' }}>{group.joinCode}</p>
            <button onClick={handleCopy}
              style={{ padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', minHeight: 38, background: copied ? '#22c55e' : 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
              {copied ? 'Copié !' : 'Copier'}
            </button>
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1', background: C.bg, borderRadius: 14, padding: 12 }}>
          <p style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>Créé le</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
            {new Date(group.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Demandes en attente (groupes privés) */}
      {group.isPrivate && (
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 800, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
            Demandes en attente
            {pending.length > 0 && <Badge color="#d97706">{pending.length}</Badge>}
          </h3>
          {pLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
              <div style={{ width: 22, height: 22, border: '2px solid var(--theme-border)', borderTopColor: 'var(--theme-primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : pending.length === 0 ? (
            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '12px 0' }}>Aucune demande en attente</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <AnimatePresence>
                {pending.map(u => (
                  <motion.div key={u._id}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 14, padding: '10px 12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                      {u.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 700, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                      <p style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => handleApprove(u._id)}
                        style={{ padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, background: '#22c55e', color: '#fff', border: 'none', cursor: 'pointer', minHeight: 36 }}>
                        Approuver
                      </button>
                      <button onClick={() => handleReject(u._id)}
                        style={{ padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, background: '#fee2e2', color: '#dc2626', border: 'none', cursor: 'pointer', minHeight: 36 }}>
                        Refuser
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminGroups() {
  const [groups, setGroups]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [detail, setDetail]     = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/groups`);
      setGroups(data);
    } catch { toast.error('Impossible de charger les groupes'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/groups/${deleting._id}`);
      setGroups(g => g.filter(x => x._id !== deleting._id));
      setDeleting(null);
      toast.success('Groupe supprimé');
    } catch { toast.error('Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const filtered = groups.filter(g => {
    const q = search.toLowerCase();
    const matchSearch = g.name.toLowerCase().includes(q) || g.creator?.name?.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'public' ? !g.isPrivate : g.isPrivate);
    return matchSearch && matchFilter;
  });

  const totalPublic  = groups.filter(g => !g.isPrivate).length;
  const totalPrivate = groups.filter(g => g.isPrivate).length;
  const totalMembers = groups.reduce((s, g) => s + (g.memberCount || 0), 0);
  const totalPending = groups.reduce((s, g) => s + (g.pendingCount || 0), 0);

  return (
    <AdminPage
      title="Groupes"
      subtitle="Gestion des groupes de révision"
      icon={groupsIcon()}
      stats={[
        { value: groups.length, label: 'groupes' },
        { value: totalMembers,  label: 'membres' },
        { value: totalPublic,   label: 'publics' },
        { value: totalPending,  label: 'en attente' },
      ]}
      actions={
        <HeroBtn secondary onClick={load}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Actualiser
        </HeroBtn>
      }
    >
      <Card style={{ marginBottom: 16 }}>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher par nom ou créateur…" />
          <FilterPills value={filter} onChange={setFilter}
            options={[['all', 'Tous'], ['public', `Publics (${totalPublic})`], ['private', `Privés (${totalPrivate})`]]} />
        </Toolbar>
      </Card>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={groupsIcon(24)}
            title="Aucun groupe trouvé"
            onReset={(search || filter !== 'all') ? () => { setSearch(''); setFilter('all'); } : null}
          />
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 14 }}>
          {filtered.map((group, i) => (
            <motion.div key={group._id}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 12) * 0.04 }}>
              <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.border}`, boxShadow: clay.sm, padding: 18, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', boxSizing: 'border-box' }}>

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', boxShadow: '0 3px 8px rgba(var(--theme-primary-rgb),0.3)' }}>
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.name}</p>
                      <p style={{ fontSize: 11, color: C.sub }}>{group.category || 'Général'}</p>
                    </div>
                  </div>
                  <Badge color={group.isPrivate ? '#64748b' : '#059669'}>{group.isPrivate ? 'Privé' : 'Public'}</Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: C.sub }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                    {group.memberCount} membre{group.memberCount !== 1 ? 's' : ''}
                  </span>
                  {group.pendingCount > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#d97706', fontWeight: 700 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                      {group.pendingCount} en attente
                    </span>
                  )}
                </div>

                <div style={{ background: C.bg, borderRadius: 12, padding: '9px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    par <strong style={{ color: C.text }}>{group.creator?.name || '—'}</strong>
                  </span>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 800, color: 'var(--theme-primary)', letterSpacing: '0.15em', flexShrink: 0 }}>{group.joinCode}</span>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <button onClick={() => setDetail(group)}
                    style={{ flex: 1, padding: '11px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${C.border}`, background: '#fff', color: C.sub, minHeight: 44 }}>
                    Détails
                  </button>
                  <button onClick={() => setDeleting(group)} aria-label="Supprimer le groupe"
                    style={{ padding: '11px 14px', borderRadius: 12, cursor: 'pointer', border: '1px solid #fecaca', background: '#fef2f2', color: '#ef4444', minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {detail && (
          <GroupDetailModal group={detail} onClose={() => setDetail(null)} onRequestDelete={g => setDeleting(g)} />
        )}
        {deleting && (
          <ConfirmModal
            title="Supprimer ce groupe ?"
            message={<><strong>« {deleting.name} »</strong> et toutes ses données seront définitivement supprimés.</>}
            onConfirm={handleDelete}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
