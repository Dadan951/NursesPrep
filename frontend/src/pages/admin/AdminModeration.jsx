import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_URL } from '../../context/AuthContext';
import {
  AdminPage, HeroBtn, GhostBtn, PrimaryBtn, Card, Badge,
  Modal, Spinner, EmptyState, Field, inputCls, labelCls,
  toast, C, clay,
} from '../../components/admin/adminKit';

const shieldIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ACTIONS = [
  { id: 'dismiss', label: 'Écarter le signalement', desc: 'Le message reste visible, aucune sanction.', color: '#64748b' },
  { id: 'delete',  label: 'Supprimer + avertir',     desc: "Le message est retiré, l'auteur reçoit un avertissement.", color: '#d97706' },
  { id: 'kick',    label: 'Supprimer + exclure',     desc: "En plus de l'avertissement, l'auteur est retiré du groupe.", color: '#ea580c' },
  { id: 'suspend', label: 'Supprimer + suspendre',   desc: "En plus de l'avertissement, le compte est suspendu temporairement.", color: '#dc2626' },
];

/* ─── Modal de traitement d'un signalement ──────────────────────────────── */
function ModerateModal({ post, onClose, onDone }) {
  const [action, setAction]   = useState('delete');
  const [warning, setWarning] = useState('Ton message a été retiré car il ne respecte pas les règles de la communauté.');
  const [days, setDays]       = useState(3);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/admin/posts/${post._id}/moderate`, {
        action,
        warning: action !== 'dismiss' ? warning : undefined,
        suspendDays: action === 'suspend' ? days : undefined,
      });
      toast.success('Action appliquée');
      onDone(post._id);
    } catch {
      toast.error("Erreur lors de l'application de l'action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Traiter le signalement"
      subtitle={post.group?.name || 'Groupe'}
      icon={<span style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>!</span>}
      onClose={onClose}
      maxWidth={560}
      footer={<>
        <GhostBtn onClick={onClose}>Annuler</GhostBtn>
        <PrimaryBtn onClick={submit} loading={loading}>Confirmer</PrimaryBtn>
      </>}
    >
      <div style={{ background: C.bg, borderRadius: 14, padding: 12, marginBottom: 16 }}>
        <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>
          {post.author?.name || 'Utilisateur'} · {new Date(post.createdAt).toLocaleDateString('fr-FR')}
        </p>
        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{post.content}</p>
      </div>

      {post.reports?.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <p className={labelCls}>Signalements ({post.reports.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {post.reports.map((r, i) => (
              <div key={i} style={{ fontSize: 12, color: C.sub, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '8px 10px' }}>
                <strong style={{ color: C.text }}>{r.reportedBy?.name || 'Utilisateur'}</strong>
                {r.reason ? ` — ${r.reason}` : ' — aucun motif précisé'}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <p className={labelCls}>Action</p>
        {ACTIONS.map(a => (
          <div key={a.id} onClick={() => setAction(a.id)}
            style={{ padding: '11px 14px', borderRadius: 14, cursor: 'pointer', border: `1.5px solid ${action === a.id ? a.color : C.border}`, background: action === a.id ? `${a.color}14` : '#fff', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, marginTop: 2, border: `2px solid ${action === a.id ? a.color : '#cbd5e1'}`, background: action === a.id ? a.color : 'transparent' }} />
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: action === a.id ? a.color : C.text }}>{a.label}</p>
              <p style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{a.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {action !== 'dismiss' && (
        <Field label="Message d'avertissement envoyé à l'utilisateur">
          <textarea className={inputCls} rows={2} value={warning} onChange={e => setWarning(e.target.value)} style={{ resize: 'vertical' }} />
        </Field>
      )}

      {action === 'suspend' && (
        <div style={{ marginTop: 12 }}>
          <Field label="Durée de suspension (jours)">
            <input type="number" min={1} max={365} className={inputCls} value={days}
              onChange={e => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))} />
          </Field>
        </div>
      )}
    </Modal>
  );
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminModeration() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/admin/reports`);
      setPosts(data);
    } catch { toast.error('Impossible de charger les signalements'); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const handleDone = (postId) => {
    setPosts(p => p.filter(x => x._id !== postId));
    setTarget(null);
  };

  return (
    <AdminPage
      title="Modération"
      subtitle="Messages de groupes signalés par les étudiants"
      icon={shieldIcon()}
      stats={[
        { value: posts.length, label: 'signalements' },
        { value: posts.reduce((s, p) => s + (p.reports?.length || 0), 0), label: 'signalements totaux' },
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
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <Card>
          <EmptyState icon={shieldIcon(24)} title="Aucun signalement en attente" hint="Tout est calme dans les groupes 🎉" />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div key={post._id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ delay: Math.min(i, 10) * 0.03 }}>
                <div style={{ background: '#fff', borderRadius: 20, border: `1.5px solid ${C.border}`, boxShadow: clay.sm, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <p style={{ fontSize: 13.5, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif' }}>{post.author?.name || 'Utilisateur'}</p>
                        <Badge color="#64748b">{post.group?.name || 'Groupe'}</Badge>
                        <Badge color="#dc2626">{post.reports.length} signalement{post.reports.length > 1 ? 's' : ''}</Badge>
                      </div>
                      <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                        {new Date(post.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <button onClick={() => setTarget(post)}
                      style={{ padding: '9px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: '#fff', border: 'none', cursor: 'pointer', minHeight: 40, background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', flexShrink: 0 }}>
                      Traiter
                    </button>
                  </div>
                  <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, background: C.bg, borderRadius: 12, padding: 12, whiteSpace: 'pre-wrap' }}>
                    {post.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {target && <ModerateModal post={target} onClose={() => setTarget(null)} onDone={handleDone} />}
      </AnimatePresence>
    </AdminPage>
  );
}
