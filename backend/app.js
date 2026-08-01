/* ── Application Express (sans connexion DB ni listen) ────────────────────────
   Isolée de server.js pour être importable dans les tests (supertest). */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const Sentry = require('@sentry/node');

const app = express();

// Derrière le proxy Railway → indispensable pour lire la vraie IP client
// (sans ça tous les utilisateurs partagent l'IP du proxy et le rate limiter les bloque ensemble)
app.set('trust proxy', 1);

// En-têtes de sécurité HTTP (anti-clickjacking, anti-sniffing MIME, etc.)
app.use(helmet({
  // Le frontend (autre origine) doit pouvoir charger des fichiers servis par l'API
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS restreint aux origines autorisées
const allowedOrigins = [
  process.env.FRONTEND_URL || 'https://www.nursesprep.fr',
  'https://www.nursesprep.fr',
  'https://nursesprep.fr',
  'http://localhost:3000',
  ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(s => s.trim()) : []),
];
app.use(cors({
  origin(origin, cb) {
    // Pas d'origine (apps mobiles, curl, webhooks serveur-à-serveur) → autorisé
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) return cb(null, true);
    return cb(null, false); // origine non autorisée : le navigateur bloquera (pas d'erreur 500)
  },
  credentials: true,
}));

app.use(passport.initialize());

// Limiteur anti-brute-force sur les routes d'authentification sensibles
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // fenêtre de 15 minutes
  max: 30,                  // 30 tentatives max par IP sur cette fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives. Réessaie dans quelques minutes.' },
  skip: () => process.env.NODE_ENV === 'test', // ne pas limiter pendant les tests Jest
});
app.use([
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/resend-code',
], authLimiter);

// ⚠️ Webhook Stripe — raw body AVANT express.json()
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '300mb' }));
app.use(express.urlencoded({ extended: true, limit: '300mb' }));
app.use(express.static('public'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/groups', require('./routes/groups'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/files', require('./routes/files'));
app.use('/api/sheets', require('./routes/sheets'));
app.use('/api/drugs',   require('./routes/drugs'));
app.use('/api/annales', require('./routes/annales'));
app.use('/api/tickets', require('./routes/tickets'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/subscription',  require('./routes/subscription'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.get('/', (req, res) => {
  res.json({ message: '🚀 Serveur IFSI opérationnel !' });
});

// Capture d'erreurs Sentry — uniquement en production (DSN présent)
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

module.exports = app;
