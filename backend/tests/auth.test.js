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
    const r = await post('/api/auth/register', { name: 'Test', email: 'new@b.fr', password: 'secret123', studyYear: '1ere' });
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
    const r = await post('/api/auth/register', { name: 'Y', email: 'dup@b.fr', password: 'secret123', studyYear: '1ere' });
    expect(r.status).toBe(400);
  });

  it("refuse une année d'études manquante ou invalide (400)", async () => {
    const r1 = await post('/api/auth/register', { name: 'Test', email: 'noyear@b.fr', password: 'secret123' });
    expect(r1.status).toBe(400);
    const r2 = await post('/api/auth/register', { name: 'Test', email: 'badyear@b.fr', password: 'secret123', studyYear: 'nope' });
    expect(r2.status).toBe(400);
  });

  it("bascule sur la réforme 2026 uniquement pour '1ère année' (les autres restent 'ancien')", async () => {
    await post('/api/auth/register', { name: 'Test', email: 'reforme@b.fr', password: 'secret123', studyYear: '1ere' });
    const reforme = await User.findOne({ email: 'reforme@b.fr' });
    expect(reforme.programVersion).toBe('reforme_2026');
    expect(reforme.academicYear).toBe('2026-2027');

    await post('/api/auth/register', { name: 'Test', email: 'ancien2@b.fr', password: 'secret123', studyYear: '2eme' });
    const ancien2 = await User.findOne({ email: 'ancien2@b.fr' });
    expect(ancien2.programVersion).toBe('ancien');

    await post('/api/auth/register', { name: 'Test', email: 'ancien3@b.fr', password: 'secret123', studyYear: '3eme' });
    const ancien3 = await User.findOne({ email: 'ancien3@b.fr' });
    expect(ancien3.programVersion).toBe('ancien');
  });
});

describe('Vérification email + connexion', () => {
  it('vérifie avec le bon code puis connecte (200 + token)', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'v@b.fr', password: 'secret123', studyYear: '1ere' });
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
    await post('/api/auth/register', { name: 'Test', email: 'w@b.fr', password: 'secret123', studyYear: '1ere' });
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
    await post('/api/auth/register', { name: 'Test', email: 'unv@b.fr', password: 'secret123', studyYear: '1ere' });
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
    await post('/api/auth/register', { name: 'Test', email: 'me@b.fr', password: 'secret123', studyYear: '1ere' });
    const { verificationCode } = await User.findOne({ email: 'me@b.fr' });
    const vr = await post('/api/auth/verify-email', { email: 'me@b.fr', code: verificationCode });
    const token = vr.body.token;

    const r = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.user.email).toBe('me@b.fr');
  });
});

describe('PUT /api/auth/profile — changement d\'année d\'études', () => {
  const registerAndLogin = async (email, studyYear) => {
    await post('/api/auth/register', { name: 'Test', email, password: 'secret123', studyYear });
    const { verificationCode } = await User.findOne({ email });
    const vr = await post('/api/auth/verify-email', { email, code: verificationCode });
    return vr.body.token;
  };

  it("bascule 'ancien' → 'reforme_2026' puis inversement", async () => {
    const token = await registerAndLogin('switch@b.fr', '2eme');
    let u = await User.findOne({ email: 'switch@b.fr' });
    expect(u.programVersion).toBe('ancien');

    let r = await request(app).put('/api/auth/profile').set('Authorization', `Bearer ${token}`).send({ studyYear: '1ere' });
    expect(r.status).toBe(200);
    u = await User.findOne({ email: 'switch@b.fr' });
    expect(u.programVersion).toBe('reforme_2026');

    r = await request(app).put('/api/auth/profile').set('Authorization', `Bearer ${token}`).send({ studyYear: '2eme' });
    expect(r.status).toBe(200);
    u = await User.findOne({ email: 'switch@b.fr' });
    expect(u.programVersion).toBe('ancien');
  });

  it('ignore une valeur invalide sans modifier le programme actuel', async () => {
    const token = await registerAndLogin('invalidyear@b.fr', '1ere');
    const r = await request(app).put('/api/auth/profile').set('Authorization', `Bearer ${token}`).send({ studyYear: 'nope' });
    expect(r.status).toBe(200);
    const u = await User.findOne({ email: 'invalidyear@b.fr' });
    expect(u.programVersion).toBe('reforme_2026'); // inchangé
  });
});

describe('Parrainage', () => {
  const registerAndLogin = async (email, studyYear) => {
    await post('/api/auth/register', { name: 'Test', email, password: 'secret123', studyYear });
    const { verificationCode } = await User.findOne({ email });
    const vr = await post('/api/auth/verify-email', { email, code: verificationCode });
    return vr.body.token;
  };

  it('génère un code de parrainage unique à l\'inscription', async () => {
    await post('/api/auth/register', { name: 'Test', email: 'ref1@b.fr', password: 'secret123', studyYear: '1ere' });
    const u = await User.findOne({ email: 'ref1@b.fr' });
    expect(u.referralCode).toMatch(/^[A-Z0-9]{6}$/);
    expect(u.referredBy).toBeNull();
  });

  it("lie le filleul au parrain quand un code de parrainage valide est fourni", async () => {
    await post('/api/auth/register', { name: 'Parrain', email: 'parrain@b.fr', password: 'secret123', studyYear: '1ere' });
    const parrain = await User.findOne({ email: 'parrain@b.fr' });

    await post('/api/auth/register', {
      name: 'Filleul', email: 'filleul@b.fr', password: 'secret123', studyYear: '1ere',
      referralCode: parrain.referralCode,
    });
    const filleul = await User.findOne({ email: 'filleul@b.fr' });
    expect(filleul.referredBy?.toString()).toBe(parrain._id.toString());
    expect(filleul.referralConverted).toBe(false);
  });

  it('ignore silencieusement un code de parrainage inconnu', async () => {
    const r = await post('/api/auth/register', {
      name: 'Test', email: 'badref@b.fr', password: 'secret123', studyYear: '1ere', referralCode: 'ZZZZZZ',
    });
    expect(r.status).toBe(201);
    const u = await User.findOne({ email: 'badref@b.fr' });
    expect(u.referredBy).toBeNull();
  });

  it('GET /api/auth/referral renvoie le code et les statistiques', async () => {
    const token = await registerAndLogin('refinfo@b.fr', '1ere');
    const r = await request(app).get('/api/auth/referral').set('Authorization', `Bearer ${token}`);
    expect(r.status).toBe(200);
    expect(r.body.code).toMatch(/^[A-Z0-9]{6}$/);
    expect(r.body.referredCount).toBe(0);
    expect(r.body.pendingFreeMonths).toBe(0);
  });
});
