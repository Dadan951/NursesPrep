import * as Sentry from '@sentry/react';

/* Initialise Sentry uniquement si REACT_APP_SENTRY_DSN est défini.
   Sans DSN (dev / preview), Sentry reste inactif — aucun effet. */
export function initSentry() {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  if (!dsn) return;
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: Number(process.env.REACT_APP_SENTRY_TRACES_RATE || 0.1),
  });
}
