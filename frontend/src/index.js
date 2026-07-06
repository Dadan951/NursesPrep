import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { initSentry } from './sentry';

initSentry();

/* Écran de secours si l'app plante — évite l'écran blanc */
function ErrorFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: 'linear-gradient(160deg, #f0f6ff 0%, #e6f0ff 50%, #e6f7fb 100%)',
    }}>
      <div style={{
        width: 60, height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#2563eb,#0891b2)', boxShadow: '0 12px 30px rgba(37,99,235,0.3)',
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
          <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        </svg>
      </div>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', margin: 0 }}>Oups, une erreur est survenue</h1>
      <p style={{ fontSize: 14, color: '#64748b', margin: 0, maxWidth: 340 }}>
        Nos équipes en ont été informées. Réessaie de recharger la page.
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: 4, padding: '11px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
          fontSize: 14, fontWeight: 700, color: '#fff',
          background: 'linear-gradient(135deg,#2563eb,#0891b2)', boxShadow: '0 8px 22px rgba(37,99,235,0.3)',
        }}>
        Recharger la page
      </button>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
