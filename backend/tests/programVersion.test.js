/* Tests d'intégration du filtrage par programVersion (réforme UE 2026).
   Base MongoDB en mémoire — n'utilise jamais la vraie base. */
process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV   = 'test';

const request  = require('supertest');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app       = require('../app');
const User      = require('../models/User');
const Quiz      = require('../models/Quiz');
const Lesson    = require('../models/Lesson');
const Flashcard = require('../models/Flashcard');
const Exercise  = require('../models/Exercise');
const Annale    = require('../models/Annale');

let mem;
const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const mkUser = (extra = {}) =>
  User.create({ name: 'U', email: `u${Math.random()}@x.fr`, emailVerified: true, password: 'secret123', ...extra });

beforeAll(async () => { mem = await MongoMemoryServer.create(); await mongoose.connect(mem.getUri()); });
afterAll(async () => { await mongoose.disconnect(); if (mem) await mem.stop(); });
afterEach(async () => {
  await Promise.all([
    User.deleteMany({}), Quiz.deleteMany({}), Lesson.deleteMany({}),
    Flashcard.deleteMany({}), Exercise.deleteMany({}), Annale.deleteMany({}),
  ]);
});

describe('Quiz — filtrage par programVersion', () => {
  it("un utilisateur 'ancien' ne voit que le contenu ancien (le contenu réforme ne lui est pas destiné)", async () => {
    const u = await mkUser({ programVersion: 'ancien' });
    await Quiz.create([
      { title: 'Q ancien',  category: 'UE 2.2' }, // programVersion par défaut = 'ancien'
      { title: 'Q reforme', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/quizzes').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.status).toBe(200);
    expect(r.body.map(q => q.title)).toEqual(['Q ancien']);
  });

  it("un utilisateur 'reforme_2026' ne voit que le contenu réforme", async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    await Quiz.create([
      { title: 'Q ancien',  category: 'UE 2.2' },
      { title: 'Q reforme', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/quizzes').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.status).toBe(200);
    expect(r.body.map(q => q.title)).toEqual(['Q reforme']);
  });

  it("getOne — un utilisateur 'reforme_2026' ne peut pas accéder à un quiz 'ancien' par id (404)", async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    const q = await Quiz.create({ title: 'Q ancien', category: 'UE 2.2' });
    const r = await request(app).get(`/api/quizzes/${q._id}`).set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.status).toBe(404);
  });

  it('la route admin renvoie tout, peu importe le programVersion de l\'admin', async () => {
    const admin = await mkUser({ role: 'admin', programVersion: 'ancien' });
    await Quiz.create([
      { title: 'Q ancien',  category: 'UE 2.2' },
      { title: 'Q reforme', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/quizzes/admin').set('Authorization', `Bearer ${token(admin._id)}`);
    expect(r.status).toBe(200);
    expect(r.body.length).toBe(2);
  });
});

describe('Lesson/Flashcard/Exercise/Annale — même filtrage', () => {
  it('Lesson: reforme_2026 ne voit que le contenu réforme', async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    await Lesson.create([
      { title: 'L ancien',  category: 'UE 2.2' },
      { title: 'L reforme', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/lessons').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.body.map(l => l.title)).toEqual(['L reforme']);
  });

  it('Flashcard: reforme_2026 ne voit que le contenu réforme', async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    await Flashcard.create([
      { front: 'F ancien', back: '...', category: 'UE 2.2' },
      { front: 'F reforme', back: '...', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/flashcards').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.body.map(f => f.front)).toEqual(['F reforme']);
  });

  it('Exercise: reforme_2026 ne voit que le contenu réforme', async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    await Exercise.create([
      { title: 'E ancien', content: '...', category: 'UE 2.2' },
      { title: 'E reforme', content: '...', category: 'UE 1.1', programVersion: 'reforme_2026' },
    ]);
    const r = await request(app).get('/api/exercises').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.body.map(e => e.title)).toEqual(['E reforme']);
  });

  it('Annale: reforme_2026 ne voit que le contenu réforme (vide si aucune n\'existe encore)', async () => {
    const u = await mkUser({ programVersion: 'reforme_2026' });
    await Annale.create([
      { title: 'A ancien', year: '2023-2024', semester: 'Semestre 1', subject: 'UE 2.4' },
    ]);
    const r = await request(app).get('/api/annales').set('Authorization', `Bearer ${token(u._id)}`);
    expect(r.body).toEqual([]);
  });
});

describe('Migration — backfill programVersion sur le contenu existant', () => {
  it("tague 'ancien' tous les documents qui n'ont pas encore le champ, sans toucher aux autres", async () => {
    const admin = await mkUser({ role: 'admin' });
    // Simule un document créé avant la migration (pas de programVersion en base)
    await Quiz.collection.insertOne({ title: 'Vieux quiz', category: 'UE 2.2', isPublished: true });
    await Quiz.create({ title: 'Nouveau quiz reforme', category: 'UE 1.1', programVersion: 'reforme_2026' });

    const r = await request(app).post('/api/admin/migrate-program-version-ancien')
      .set('Authorization', `Bearer ${token(admin._id)}`);
    expect(r.status).toBe(200);
    expect(r.body.modifiedCount.quiz).toBe(1);

    const old = await Quiz.findOne({ title: 'Vieux quiz' });
    expect(old.programVersion).toBe('ancien');
    const fresh = await Quiz.findOne({ title: 'Nouveau quiz reforme' });
    expect(fresh.programVersion).toBe('reforme_2026'); // inchangé
  });
});
