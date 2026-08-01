import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, PrimaryBtn, GhostBtn, Card, Badge,
  Toolbar, SearchInput, FilterPills, DataTable, Modal, ConfirmModal,
  Field, inputCls, toast, C,
} from '../../components/admin/adminKit';

const usersIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SUB_BADGE = {
  free:    { label: 'Gratuit', color: '#64748b' },
  pro:     { label: 'Pro',     color: '#2563eb' },
  premium: { label: 'Premium', color: '#d97706' },
};

/* ─── Avatar initiale ───────────────────────────────────────────────────── */
function InitialAvatar({ name, size = 34 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: size * 0.4, background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
      {name?.charAt(0)?.toUpperCase() || '?'}
    </div>
  );
}

/* ─── Modal édition utilisateur ─────────────────────────────────────────── */
function EditModal({ user, onClose, onSave }) {
  const initial = { subscription: user.subscription, role: user.role };
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [unsuspending, setUnsuspending] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);
  const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date();

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(user._id, form);
      onClose();
      toast.success('Utilisateur mis à jour');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally { setSaving(false); }
  };

  const handleUnsuspend = async () => {
    setUnsuspending(true);
    try {
      await onSave(user._id, { suspendedUntil: null });
      toast.success('Suspension levée');
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Erreur lors de la levée de suspension');
    } finally { setUnsuspending(false); }
  };

  return (
    <Modal
      title={user.name}
      subtitle={user.email}
      icon={<span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{user.name?.charAt(0)?.toUpperCase()}</span>}
      onClose={onClose}
      dirty={dirty}
      maxWidth={420}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={handleSave} loading={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</PrimaryBtn>
      </>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {isSuspended && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: 14, padding: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#991b1b', marginBottom: 2 }}>
              Compte suspendu jusqu'au {new Date(user.suspendedUntil).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
            {user.suspendReason && <p style={{ fontSize: 11.5, color: '#7f1d1d', marginBottom: 8 }}>{user.suspendReason}</p>}
            <button onClick={handleUnsuspend} disabled={unsuspending}
              style={{ padding: '7px 14px', borderRadius: 10, border: 'none', background: '#dc2626', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: unsuspending ? 0.6 : 1 }}>
              {unsuspending ? 'Levée en cours…' : 'Lever la suspension'}
            </button>
          </div>
        )}
        <Field label="Abonnement">
          <select value={form.subscription} onChange={e => setForm({ ...form, subscription: e.target.value })} className={inputCls}>
            <option value="free">Gratuit</option>
            <option value="pro">Pro</option>
            <option value="premium">Premium</option>
          </select>
        </Field>
        <Field label="Rôle">
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls}>
            <option value="student">Étudiant</option>
            <option value="admin">Administrateur</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminUsers() {
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };

  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = () => {
    setLoading(true);
    axios.get(`${API_URL}/admin/users`, { headers })
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Impossible de charger les utilisateurs'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []); // eslint-disable-line

  const handleSave = async (id, data) => {
    await axios.put(`${API_URL}/admin/users/${id}`, data, { headers });
    load();
  };

  const handleDelete = async (id) => {
    setDelLoading(true);
    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, { headers });
      setDeleting(null);
      toast.success('Utilisateur supprimé');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Erreur lors de la suppression'); }
    finally { setDelLoading(false); }
  };

  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    const q = search.toLowerCase();
    return !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
  });

  const freeCount  = users.filter(u => u.subscription === 'free').length;
  const paidCount  = users.filter(u => ['pro', 'premium'].includes(u.subscription)).length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  return (
    <AdminPage
      title="Utilisateurs"
      subtitle="Gestion de tous les comptes"
      icon={usersIcon()}
      stats={[
        { value: users.length, label: 'comptes' },
        { value: freeCount,    label: 'gratuits' },
        { value: paidCount,    label: 'Pro / Premium' },
        { value: adminCount,   label: 'admins' },
      ]}
    >
      <Card>
        <Toolbar>
          <FilterPills value={roleFilter} onChange={setRoleFilter}
            options={[['all', `Tous (${users.length})`], ['student', `Étudiants (${users.length - adminCount})`], ['admin', `Admins (${adminCount})`]]} />
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher un utilisateur…" />
          {(search || roleFilter !== 'all') && (
            <span style={{ fontSize: 12, color: C.sub, fontWeight: 600, flexShrink: 0 }}>
              {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </Toolbar>

        <DataTable
          loading={loading}
          items={filtered}
          onEdit={u => setEditing(u)}
          onDelete={u => setDeleting(u)}
          empty={{
            icon: usersIcon(24),
            title: search ? 'Aucun utilisateur ne correspond' : 'Aucun utilisateur',
            onReset: (search || roleFilter !== 'all') ? () => { setSearch(''); setRoleFilter('all'); } : null,
          }}
          columns={[
            { label: 'Nom', maxWidth: 220, render: u => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <InitialAvatar name={u.name} size={32} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                    {u.role === 'admin' && <Badge color="#059669" style={{ fontSize: 9, padding: '2px 7px' }}>Admin</Badge>}
                  </div>
                </div>
              </div>
            ) },
            { label: 'Email', maxWidth: 210, render: u => <span style={{ fontSize: 12, color: C.sub }}>{u.email}</span> },
            { label: 'Abonnement', render: u => <Badge color={(SUB_BADGE[u.subscription] || SUB_BADGE.free).color}>{(SUB_BADGE[u.subscription] || SUB_BADGE.free).label}</Badge> },
            { label: 'Quiz', render: u => <span style={{ fontWeight: 600 }}>{u.progress?.quizCompleted || 0}</span> },
            { label: 'Flashcards', render: u => <span style={{ fontWeight: 600 }}>{u.progress?.flashcardsReviewed || 0}</span> },
            { label: 'Score', render: u => <span style={{ fontWeight: 800, color: 'var(--theme-primary)' }}>{u.progress?.totalScore || 0}</span> },
            { label: 'Inscription', render: u => <span style={{ fontSize: 12, color: C.sub }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}</span> },
          ]}
          renderCard={u => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <InitialAvatar name={u.name} size={36} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif' }}>{u.name}</div>
                  <div style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <Badge color={(SUB_BADGE[u.subscription] || SUB_BADGE.free).color}>{(SUB_BADGE[u.subscription] || SUB_BADGE.free).label}</Badge>
                {u.role === 'admin' && <Badge color="#059669">Admin</Badge>}
              </div>
              <div style={{ fontSize: 12, color: C.sub }}>
                {u.progress?.quizCompleted || 0} quiz · {u.progress?.flashcardsReviewed || 0} flashcards · {u.progress?.totalScore || 0} pts
                {u.createdAt ? ` · inscrit le ${new Date(u.createdAt).toLocaleDateString('fr-FR')}` : ''}
              </div>
            </>
          )}
        />
      </Card>

      <AnimatePresence>
        {editing && (
          <EditModal key="edit-modal" user={editing} onClose={() => setEditing(null)} onSave={handleSave} />
        )}
        {deleting && (
          <ConfirmModal
            key="delete-modal"
            title="Supprimer l'utilisateur ?"
            message={<><strong>{deleting.name}</strong> sera définitivement supprimé. Cette action est irréversible.</>}
            onConfirm={() => handleDelete(deleting._id)}
            onClose={() => setDeleting(null)}
            loading={delLoading}
          />
        )}
      </AnimatePresence>
    </AdminPage>
  );
}
