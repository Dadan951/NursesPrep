import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth, API_URL } from '../../context/AuthContext';
import {
  AdminPage, Card, Badge,
  Toolbar, SearchInput, FilterPills, DataTable,
  toast, C,
} from '../../components/admin/adminKit';

const logsIcon = (size = 22) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const ACTION_CONFIG = {
  login:        { label: 'Connexion',   color: '#22c55e' },
  logout:       { label: 'Déconnexion', color: '#94a3b8' },
  register:     { label: 'Inscription', color: '#3b82f6' },
  login_failed: { label: 'Échec',       color: '#ef4444' },
};

function ActionBadge({ action }) {
  const c = ACTION_CONFIG[action] || { label: action, color: '#94a3b8' };
  return (
    <Badge color={c.color}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, marginRight: 5, display: 'inline-block' }} />
      {c.label}
    </Badge>
  );
}

function DeviceIcon({ device }) {
  if (device === 'Mobile') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="18" r="1" /></svg>
  );
  if (device === 'Tablette') return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="2" /><circle cx="12" cy="18" r="1" /></svg>
  );
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
  );
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    + ' · ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ════════════════════════════════════════════════════════════════════════ */
export default function AdminLogs() {
  const { token } = useAuth();
  const [logs, setLogs]       = useState([]);
  const [stats, setStats]     = useState(null);
  const [total, setTotal]     = useState(0);
  const [pages, setPages]     = useState(1);
  const [page, setPage]       = useState(1);
  const [loading, setLoading] = useState(true);
  const [action, setAction]   = useState('all');
  const [search, setSearch]   = useState('');
  const [searchQ, setSearchQ] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 50, action };
      if (searchQ) params.search = searchQ;
      const { data } = await axios.get(`${API_URL}/admin/activity-logs`, { headers, params });
      setLogs(data.logs);
      setTotal(data.total);
      setPages(data.pages);
      setStats(data.stats);
    } catch {
      toast.error('Impossible de charger le journal');
    } finally {
      setLoading(false);
    }
  }, [token, page, action, searchQ]); // eslint-disable-line

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  /* Recherche débounce 400ms — actualisation en temps réel */
  useEffect(() => {
    const id = setTimeout(() => { setPage(1); setSearchQ(search); }, 400);
    return () => clearTimeout(id);
  }, [search]);

  const pageBtn = (disabled) => ({
    padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 600, minHeight: 44,
    border: `1px solid ${C.border}`, background: '#fff', color: C.sub,
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.4 : 1,
  });

  return (
    <AdminPage
      title="Journal d'activité"
      subtitle="Connexions, déconnexions et inscriptions en temps réel"
      icon={logsIcon()}
      stats={[
        { value: stats?.todayLogins ?? '—', label: "connexions aujourd'hui" },
        { value: stats?.todayRegs   ?? '—', label: 'inscriptions' },
        { value: stats?.todayFailed ?? '—', label: 'échecs' },
        { value: total,                     label: 'au total' },
      ]}
    >
      <Card>
        <Toolbar>
          <SearchInput value={search} onChange={setSearch} placeholder="Rechercher par email, nom, IP…" />
          <FilterPills value={action} onChange={v => { setAction(v); setPage(1); }}
            options={[['all', 'Tout'], ['login', 'Connexion'], ['logout', 'Déconnexion'], ['register', 'Inscription'], ['login_failed', 'Échec']]} />
          <button onClick={fetchLogs}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderRadius: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: `1px solid ${C.border}`, background: '#fff', color: C.sub, minHeight: 44 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.86" />
            </svg>
            Actualiser
          </button>
        </Toolbar>

        <DataTable
          loading={loading}
          items={logs}
          empty={{ icon: logsIcon(24), title: 'Aucun événement trouvé' }}
          columns={[
            { label: 'Utilisateur', maxWidth: 220, render: log => (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                  {(log.userName || log.userEmail || '?')[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.userName || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Inconnu</span>}
                  </p>
                  <p style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.userEmail || '—'}</p>
                </div>
              </div>
            ) },
            { label: 'Action', render: log => <ActionBadge action={log.action} /> },
            { label: 'Appareil', maxWidth: 220, render: log => (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.sub }}>
                <DeviceIcon device={log.device} />
                {log.device || '—'} · {log.browser || '—'} · {log.os || '—'}
              </span>
            ) },
            { label: 'IP', render: log => <span style={{ fontSize: 11, fontFamily: 'monospace', background: C.bg, padding: '3px 8px', borderRadius: 8, color: C.text }}>{log.ip || '—'}</span> },
            { label: 'Date & heure', render: log => <span style={{ fontSize: 12, color: C.sub }}>{fmtDate(log.createdAt)}</span> },
          ]}
          renderCard={log => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))' }}>
                  {(log.userName || log.userEmail || '?')[0].toUpperCase()}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: C.text, fontFamily: 'Nunito,sans-serif' }}>{log.userName || 'Inconnu'}</div>
                  <div style={{ fontSize: 11, color: C.sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.userEmail || '—'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                <ActionBadge action={log.action} />
                {log.device && <Badge color="#64748b">{log.device}</Badge>}
                {log.ip && <Badge color="#64748b">{log.ip}</Badge>}
              </div>
              <div style={{ fontSize: 11, color: C.sub }}>{fmtDate(log.createdAt)}</div>
            </>
          )}
        />
      </Card>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14, fontSize: 13, color: C.sub, flexWrap: 'wrap', gap: 10 }}>
          <p>{total} événements au total</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={pageBtn(page === 1)}>← Précédent</button>
            <span style={{ padding: '10px 16px', borderRadius: 12, background: 'linear-gradient(135deg,var(--theme-primary),var(--theme-secondary))', color: '#fff', fontSize: 12, fontWeight: 800 }}>
              {page} / {pages}
            </span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={pageBtn(page === pages)}>Suivant →</button>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
