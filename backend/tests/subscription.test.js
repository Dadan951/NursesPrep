/* Tests d'intégration des abonnements Stripe (checkout / portal / webhook).
   Stripe est entièrement mocké — aucun appel réseau réel. Base MongoDB en mémoire. */
process.env.JWT_SECRET          = 'test-secret-key';
process.env.NODE_ENV            = 'test';
process.env.STRIPE_PRICE_PRO    = 'price_pro';     // lus au chargement du module (PRICE_IDS)
process.env.STRIPE_PRICE_PREMIUM= 'price_premium';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';

// Mock du SDK Stripe : new Stripe() renvoie toujours le même objet mockStripe
const mockStripe = {
  checkout:      { sessions: { create: jest.fn() } },
  billingPortal: { sessions: { create: jest.fn() } },
  subscriptions: { retrieve: jest.fn() },
  webhooks:      { constructEvent: jest.fn() },
};
jest.mock('stripe', () => jest.fn(() => mockStripe));

const request  = require('supertest');
const mongoose = require('mongoose');
const jwt      = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app  = require('../app');
const User = require('../models/User');

let mem;
const token = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const mkUser = (extra = {}) =>
  User.create({ name: 'U', email: `u${Math.random()}@x.fr`, emailVerified: true, password: 'secret123', ...extra });

beforeAll(async () => { mem = await MongoMemoryServer.create(); await mongoose.connect(mem.getUri()); });
afterAll(async () => { await mongoose.disconnect(); if (mem) await mem.stop(); });
afterEach(async () => { await User.deleteMany({}); jest.clearAllMocks(); });

/* ── Checkout ──────────────────────────────────────────────────────────── */
describe('POST /api/subscription/checkout', () => {
  it('refuse sans authentification (401)', async () => {
    const r = await request(app).post('/api/subscription/checkout').send({ plan: 'pro' });
    expect(r.status).toBe(401);
  });

  it('refuse un plan invalide (400)', async () => {
    const u = await mkUser();
    const r = await request(app).post('/api/subscription/checkout')
      .set('Authorization', `Bearer ${token(u._id)}`).send({ plan: 'gold' });
    expect(r.status).toBe(400);
  });

  it('renvoie 503 si Stripe n\'est pas configuré', async () => {
    delete process.env.STRIPE_SECRET_KEY;
    const u = await mkUser();
    const r = await request(app).post('/api/subscription/checkout')
      .set('Authorization', `Bearer ${token(u._id)}`).send({ plan: 'pro' });
    expect(r.status).toBe(503);
    expect(mockStripe.checkout.sessions.create).not.toHaveBeenCalled();
  });

  it('crée une session et renvoie l\'url + les bonnes métadonnées (200)', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_configured';
    mockStripe.checkout.sessions.create.mockResolvedValue({ url: 'https://checkout.stripe.test/abc' });
    const u = await mkUser();

    const r = await request(app).post('/api/subscription/checkout')
      .set('Authorization', `Bearer ${token(u._id)}`).send({ plan: 'premium' });

    expect(r.status).toBe(200);
    expect(r.body.url).toBe('https://checkout.stripe.test/abc');
    const arg = mockStripe.checkout.sessions.create.mock.calls[0][0];
    expect(arg.line_items[0].price).toBe('price_premium');           // bon price id
    expect(arg.metadata).toEqual({ userId: u._id.toString(), plan: 'premium' }); // userId + plan transmis
    delete process.env.STRIPE_SECRET_KEY;
  });
});

/* ── Portal (gestion de l'abonnement) ──────────────────────────────────── */
describe('POST /api/subscription/portal', () => {
  it('refuse si l\'utilisateur n\'a pas de client Stripe (400)', async () => {
    const u = await mkUser();
    const r = await request(app).post('/api/subscription/portal')
      .set('Authorization', `Bearer ${token(u._id)}`).send({});
    expect(r.status).toBe(400);
  });

  it('renvoie l\'url du portail quand un client Stripe existe (200)', async () => {
    mockStripe.billingPortal.sessions.create.mockResolvedValue({ url: 'https://portal.stripe.test/x' });
    const u = await mkUser({ stripeCustomerId: 'cus_123' });
    const r = await request(app).post('/api/subscription/portal')
      .set('Authorization', `Bearer ${token(u._id)}`).send({});
    expect(r.status).toBe(200);
    expect(r.body.url).toBe('https://portal.stripe.test/x');
    expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({ customer: 'cus_123' })
    );
  });
});

/* ── Webhook — le chemin critique qui modifie l'abonnement en base ──────── */
describe('POST /api/subscription/webhook', () => {
  const sendWebhook = () => request(app).post('/api/subscription/webhook')
    .set('stripe-signature', 'sig').set('Content-Type', 'application/json').send('{}');

  it('rejette une signature invalide (400)', async () => {
    mockStripe.webhooks.constructEvent.mockImplementation(() => { throw new Error('bad signature'); });
    const r = await sendWebhook();
    expect(r.status).toBe(400);
  });

  it('checkout.session.completed → active le plan payé', async () => {
    const u = await mkUser({ subscription: 'free' });
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: { object: { mode: 'subscription', customer: 'cus_1', subscription: 'sub_1',
        metadata: { userId: u._id.toString(), plan: 'premium' } } },
    });
    mockStripe.subscriptions.retrieve.mockResolvedValue({ id: 'sub_1' });

    const r = await sendWebhook();
    expect(r.status).toBe(200);
    const after = await User.findById(u._id);
    expect(after.subscription).toBe('premium');
    expect(after.stripeCustomerId).toBe('cus_1');
    expect(after.stripeSubscriptionId).toBe('sub_1');
  });

  it('customer.subscription.updated → met à jour le plan selon le price id', async () => {
    const u = await mkUser({ stripeCustomerId: 'cus_2', subscription: 'pro' });
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: { object: { id: 'sub_2', customer: 'cus_2', items: { data: [{ price: { id: 'price_premium' } }] } } },
    });

    const r = await sendWebhook();
    expect(r.status).toBe(200);
    const after = await User.findById(u._id);
    expect(after.subscription).toBe('premium'); // pro → premium
  });

  it('customer.subscription.deleted → repasse l\'utilisateur en gratuit', async () => {
    const u = await mkUser({ stripeCustomerId: 'cus_3', subscription: 'premium', stripeSubscriptionId: 'sub_3' });
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: { customer: 'cus_3' } },
    });

    const r = await sendWebhook();
    expect(r.status).toBe(200);
    const after = await User.findById(u._id);
    expect(after.subscription).toBe('free');
    expect(after.stripeSubscriptionId).toBeNull();
  });

  it('ignore proprement un événement non géré (200)', async () => {
    mockStripe.webhooks.constructEvent.mockReturnValue({ type: 'invoice.paid', data: { object: {} } });
    const r = await sendWebhook();
    expect(r.status).toBe(200);
    expect(r.body.received).toBe(true);
  });
});
