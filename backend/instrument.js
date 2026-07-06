/* ── Instrumentation Sentry (backend) ────────────────────────────────────────
   Doit être requis EN PREMIER dans server.js (avant Express) pour que Sentry
   puisse instrumenter automatiquement les requêtes HTTP.
   Ne s'active que si SENTRY_DSN est défini → aucun effet en dev / test / CI. */
const Sentry = require('@sentry/node');

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: Number(process.env.SENTRY_TRACES_RATE || 0.1),
    sendDefaultPii: false,
  });
  console.log('✅ Sentry (backend) activé');
}

module.exports = Sentry;
