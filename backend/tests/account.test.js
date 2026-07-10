/* Tests d'intégration de la suppression de compte RGPD (DELETE /api/auth/account).
   Base MongoDB éphémère en mémoire — n'utilise jamais la vraie base. */
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
delete process.env.STRIPE_SECRET_KEY; // pas d'appel Stripe en test

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const FlashcardAttempt = require('../models/FlashcardAttempt');
const RevisionSheet = require('../models/RevisionSheet');
const UserFile = require('../models/UserFile');
const Ticket = require('../models/Ticket');
const Group = require('../models/Group');
const GroupPost = require('../models/GroupPost');

let mem;
const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

beforeAll(async () => {
  mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mem) await mem.stop();
});

afterEach(async () => {
  await Promise.all([
    User.deleteMany({}), QuizAttempt.deleteMany({}), FlashcardAttempt.deleteMany({}),
    RevisionSheet.deleteMany({}), UserFile.deleteMany({}), Ticket.deleteMany({}),
    Group.deleteMany({}), GroupPost.deleteMany({}),
  ]);
});

// Crée un utilisateur vérifié + un jeu de données liées dans chaque collection
async function seedUserWithData({ withPassword = true } = {}) {
  const user = await User.create({
    name: 'Alice', email: 'alice@ifsi.fr', emailVerified: true,
    password: withPassword ? 'secret123' : null,
    googleId: withPassword ? null : 'g-123',
  });
  const uid = user._id;
  const fakeQuiz = new mongoose.Types.ObjectId();
  await QuizAttempt.create({ user: uid, quiz: fakeQuiz, answers: [{ questionIndex: 0, isCorrect: true }] });
  await FlashcardAttempt.create({ user: uid, semester: 'S1', ue: 'UE 2.1', chapter: 'Chap 1' });
  await RevisionSheet.create({ title: 'Fiche', rawText: 'txt', content: {}, owner: uid });
  await UserFile.create({ name: 'f', originalName: 'f.pdf', mimetype: 'application/pdf', size: 1, data: Buffer.from('x'), owner: uid });
  await Ticket.create({ user: uid, subject: 'Bug', messages: [{ sender: 'user', content: 'coucou' }] });
  return user;
}

describe('DELETE /api/auth/account', () => {
  it('refuse sans authentification (401)', async () => {
    const r = await request(app).delete('/api/auth/account').send({});
    expect(r.status).toBe(401);
  });

  it('refuse avec un mauvais mot de passe et ne supprime rien (401)', async () => {
    const user = await seedUserWithData();
    const r = await request(app).delete('/api/auth/account')
      .set('Authorization', `Bearer ${token(user._id)}`)
      .send({ password: 'mauvais' });
    expect(r.status).toBe(401);
    expect(await User.findById(user._id)).toBeTruthy();       // toujours là
    expect(await QuizAttempt.countDocuments({ user: user._id })).toBe(1); // données intactes
  });

  it('supprime le compte et TOUTES les données liées avec le bon mot de passe (200)', async () => {
    const user = await seedUserWithData();
    const uid = user._id;
    const r = await request(app).delete('/api/auth/account')
      .set('Authorization', `Bearer ${token(uid)}`)
      .send({ password: 'secret123' });

    expect(r.status).toBe(200);
    expect(r.body.success).toBe(true);

    // Le compte et chaque collection liée doivent être vides
    expect(await User.findById(uid)).toBeNull();
    expect(await QuizAttempt.countDocuments({ user: uid })).toBe(0);
    expect(await FlashcardAttempt.countDocuments({ user: uid })).toBe(0);
    expect(await RevisionSheet.countDocuments({ owner: uid })).toBe(0);
    expect(await UserFile.countDocuments({ owner: uid })).toBe(0);
    expect(await Ticket.countDocuments({ user: uid })).toBe(0);
  });

  it('retire l\'utilisateur des groupes des autres et transfère ceux qu\'il a créés', async () => {
    const user = await seedUserWithData();
    const other = await User.create({ name: 'Bob', email: 'bob@ifsi.fr', emailVerified: true, password: 'secret123' });

    // Groupe d'un autre où l'utilisateur est simple membre
    const foreign = await Group.create({ name: 'Groupe de Bob', creator: other._id, members: [other._id, user._id] });
    // Groupe créé par l'utilisateur, avec un autre membre → doit être transféré à Bob
    const owned = await Group.create({ name: 'Groupe d\'Alice', creator: user._id, members: [user._id, other._id] });

    const r = await request(app).delete('/api/auth/account')
      .set('Authorization', `Bearer ${token(user._id)}`)
      .send({ password: 'secret123' });
    expect(r.status).toBe(200);

    const foreignAfter = await Group.findById(foreign._id);
    expect(foreignAfter.members.map(String)).not.toContain(String(user._id)); // retiré
    expect(foreignAfter.members.map(String)).toContain(String(other._id));    // Bob reste

    const ownedAfter = await Group.findById(owned._id);
    expect(ownedAfter).toBeTruthy();                                          // pas supprimé
    expect(String(ownedAfter.creator)).toBe(String(other._id));              // transféré à Bob
  });

  it('supprime un compte Google (sans mot de passe) sans en exiger un (200)', async () => {
    const user = await seedUserWithData({ withPassword: false });
    const r = await request(app).delete('/api/auth/account')
      .set('Authorization', `Bearer ${token(user._id)}`)
      .send({});
    expect(r.status).toBe(200);
    expect(await User.findById(user._id)).toBeNull();
  });
});
