/* ── Application Express (sans connexion DB ni listen) ────────────────────────
   Isolée de server.js pour être importable dans les tests (supertest). */
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const Sentry = require('@sentry/node');

const app = express();

app.use(cors());
app.use(passport.initialize());

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

app.get('/', (req, res) => {
  res.json({ message: '🚀 Serveur IFSI opérationnel !' });
});

// Capture d'erreurs Sentry — uniquement en production (DSN présent)
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

module.exports = app;
