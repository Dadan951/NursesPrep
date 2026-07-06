/* Tests d'intégration du flux d'authentification (register → vérif → login).
   Base MongoDB éphémère en mémoire — n'utilise jamais la vraie base. */
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
delete process.env.RESEND_API_KEY; // pas d'envoi d'email en test

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');

let mem;

beforeAll(async () => {
  mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mem) await mem.stop();
});

afterEach(async () => {
  await User.deleteMany({});
});

const post = (path, body) => request(app).post(path).send(body);

describe('POST /api/auth/register', () => {
  it('refuse les champs manquants (400)', async () => {
    const r = await post('/api/auth/register', { email: 'a@b.fr' });
    expect(r.status).toBe(400);
  });

  it('refuse un mot de passe trop court (400)', async () => {
    const r = await post('/api/auth/register', { name: 'Test', email: 'a@b.fr', password: '123' });
    expect(r.status).toBe(400);
  });

  it('crée un compte en attente de vérification (201)', async () => {
    const r = await post('/api/auth/register', { name: 'Test', email: 'new@b.fr', password: 'secret123' });
    expect(r.status).toBe(201);
    expect(r.body.needsVerification).toBe(true);

    const u = await User.findOne({ email: 'new@b.fr' });
    expect(u).toBeTruthy();
    expect(u.emailVerified).toBe(false);
    expect(u.verificationCode).toMatch(/^\d{6}$/);
    // le mot de passe ne doit jamais être stocké en clair
    expect(u.password).not.toBe('secret123');
  });

  it('refuse un email déjà vérifié (400)', async () => {
    await User.create({ name: 'X', email: 'dup@b.fr', password: 'secret123', emailVerified: true });
    const r = await post('/api/auth/register', { name: 'Y', email: 'dup@b.fr', password: 'secret123' });
    expect(r.status).toBe(400);
  });
});

describe('Vérification email + connexion', () => {
  it('vérifie avec le bon code puis connecte (200 + token)', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'v@b.fr', password: 'secret123' });
    const { verificationCode } = await User.findOne({ email: 'v@b.fr' });

    const vr = await post('/api/auth/verify-email', { email: 'v@b.fr', code: verificationCode });
    expect(vr.status).toBe(200);
    expect(vr.body.token).toBeTruthy();
    expect(vr.body.user.email).toBe('v@b.fr');

    const lr = await post('/api/auth/login', { email: 'v@b.fr', password: 'secret123' });
    expect(lr.status).toBe(200);
    expect(lr.body.token).toBeTruthy();
  });

  it('refuse un mauvais code de vérification (400)', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'w@b.fr', password: 'secret123' });
    const r = await post('/api/auth/verify-email', { email: 'w@b.fr', code: '000000' });
    expect(r.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  it('refuse un mauvais mot de passe (401)', async () => {
    await User.create({ name: 'X', email: 'log@b.fr', password: 'secret123', emailVerified: true });
    const r = await post('/api/auth/login', { email: 'log@b.fr', password: 'wrongpass' });
    expect(r.status).toBe(401);
  });

  it('refuse un email inconnu (401)', async () => {
    const r = await post('/api/auth/login', { email: 'ghost@b.fr', password: 'secret123' });
    expect(r.status).toBe(401);
  });

  it('bloque un compte non vérifié ayant un code en attente (403)', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'unv@b.fr', password: 'secret123' });
    const r = await post('/api/auth/login', { email: 'unv@b.fr', password: 'secret123' });
    expect(r.status).toBe(403);
    expect(r.body.needsVerification).toBe(true);
  });
});

describe('POST /api/auth/reset-password', () => {
  it('refuse un nouveau mot de passe trop court (400)', async () => {
    const r = await post('/api/auth/reset-password', { email: 'a@b.fr', code: '123456', newPassword: '12' });
    expect(r.status).toBe(400);
  });

  it('réinitialise avec le bon code (200)', async () => {
    const u = await User.create({ name: 'X', email: 'rst@b.fr', password: 'oldpass123', emailVerified: true });
    u.resetCode = '654321';
    u.resetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await u.save();

    const r = await post('/api/auth/reset-password', { email: 'rst@b.fr', code: '654321', newPassword: 'newpass123' });
    expect(r.status).toBe(200);

    // l'ancien mot de passe ne fonctionne plus, le nouveau oui
    const oldLogin = await post('/api/auth/login', { email: 'rst@b.fr', password: 'oldpass123' });
    expect(oldLogin.status).toBe(401);
    const newLogin = await post('/api/auth/login', { email: 'rst@b.fr', password: 'newpass123' });
    expect(newLogin.status).toBe(200);
  });
});

describe('Routes protégées', () => {
  it('GET /api/auth/me sans token → 401', async () => {
    const r = await request(app).get('/api/auth/me');
    expect(r.status).toBe(401);
  });

  it('GET /api/auth/me avec token valide → 200', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'me@b.fr', password: 'secret123' });
    const { verificationCode } = await User.findOne({ email: 'me@b.fr' });
    const vr = await post('/api/auth/verify-email', { email: 'me@b.fr', code: verificationCode });
    const token = vr.body.token;

    const r = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.user.email).toBe('me@b.fr');
  });
});
