import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { initSentry } from '../sentry';

const STORAGE_KEY = 'np-cookie-consent';

export default function CookieConsent() {
  const [consent, setConsent] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  });

  // Utilisateur déjà consentant lors d'une session précédente : index.js a déjà
  // appelé initSentry() au démarrage, donc ici on ne fait que monter Analytics.
  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch { /* */ }
    initSentry();
    setConsent('accepted');
  };

  const reject = () => {
    try { localStorage.setItem(STORAGE_KEY, 'rejected'); } catch { /* */ }
    setConsent('rejected');
  };

  if (consent === 'accepted') return <Analytics />;
  if (consent === 'rejected') return null;

  return (
    <div
      role="dialog"
      aria-label="Consentement aux cookies"
      style={{
        position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 9999,
        maxWidth: 640, margin: '0 auto',
        background: '#0f172a', color: '#f1f5f9',
        borderRadius: 18, padding: '20px 22px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}
    >
      <p style={{ fontSize: 13, lineHeight: 1.6, color: '#cbd5e1', margin: 0 }}>
        On utilise des cookies de mesure d'audience et de suivi d'erreurs (Vercel Analytics, Sentry) pour
        comprendre l'usage de l'appli et corriger les bugs plus vite. Rien d'obligatoire au fonctionnement
        du service n'en dépend — tu peux refuser sans perdre aucune fonctionnalité.{' '}
        <Link to="/confidentialite" style={{ color: '#93c5fd', textDecoration: 'underline' }}>
          En savoir plus
        </Link>
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button
          onClick={reject}
          style={{
            padding: '9px 18px', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'transparent', color: '#e2e8f0', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Refuser
        </button>
        <button
          onClick={accept}
          style={{
            padding: '9px 18px', borderRadius: 12, border: 'none',
            background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.4)',
          }}
        >
          Accepter
        </button>
      </div>
    </div>
  );
}
