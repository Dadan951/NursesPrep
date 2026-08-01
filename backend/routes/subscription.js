const router = require('express').Router();
const Stripe = require('stripe');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const SubscriptionEvent = require('../models/SubscriptionEvent');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');

const PRICE_IDS = {
  pro:     process.env.STRIPE_PRICE_PRO,
  premium: process.env.STRIPE_PRICE_PREMIUM,
};

const PLAN_RANK = { free: 0, pro: 1, premium: 2 };
async function logSubscriptionEvent(userId, fromPlan, toPlan) {
  if (fromPlan === toPlan) return;
  const type = fromPlan === 'free' ? 'new'
    : toPlan === 'free' ? 'canceled'
    : PLAN_RANK[toPlan] > PLAN_RANK[fromPlan] ? 'upgrade'
    : 'downgrade';
  try { await SubscriptionEvent.create({ user: userId, fromPlan, toPlan, type }); } catch (_) {}
}

/* ── POST /api/subscription/checkout ────────────────────────────────────── */
router.post('/checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PRICE_IDS[plan]) return res.status(400).json({ message: 'Plan invalide' });
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder')
      return res.status(503).json({ message: 'Paiement non configuré — contacte l\'administrateur.' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      customer_email: req.user.email,
      metadata: { userId: req.user._id.toString(), plan },
      success_url: `${process.env.FRONTEND_URL || 'https://www.nursesprep.fr'}/dashboard/subscription?success=true&plan=${plan}`,
      cancel_url:  `${process.env.FRONTEND_URL || 'https://www.nursesprep.fr'}/dashboard/subscription?canceled=true`,
      locale: 'fr',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe checkout]', err.message);
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/subscription/portal ──────────────────────────────────────── */
router.post('/portal', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.stripeCustomerId)
      return res.status(400).json({ message: 'Aucun abonnement actif trouvé.' });

    const session = await stripe.billingPortal.sessions.create({
      customer:   user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL || 'https://www.nursesprep.fr'}/dashboard/subscription`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('[Stripe portal]', err.message);
    res.status(500).json({ message: err.message });
  }
});

/* ── POST /api/subscription/webhook — raw body, registered in server.js ── */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe webhook]', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {

      /* Paiement réussi → on active l'abonnement */
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode !== 'subscription') break;

        const userId = session.metadata?.userId;
        const plan   = session.metadata?.plan || 'pro';
        const sub    = await stripe.subscriptions.retrieve(session.subscription);

        const prevUser = await User.findById(userId).select('subscription');
        await User.findByIdAndUpdate(userId, {
          subscription:         plan,
          stripeCustomerId:     session.customer,
          stripeSubscriptionId: session.subscription,
        });
        await logSubscriptionEvent(userId, prevUser?.subscription || 'free', plan);
        console.log(`[Stripe] ✅ ${userId} → plan ${plan}`);
        break;
      }

      /* Mise à jour (upgrade/downgrade depuis le portail) */
      case 'customer.subscription.updated': {
        const sub    = event.data.object;
        const priceId = sub.items.data[0].price.id;
        const plan   = Object.entries(PRICE_IDS).find(([, id]) => id === priceId)?.[0] || 'pro';

        const prevUser = await User.findOne({ stripeCustomerId: sub.customer }).select('_id subscription');
        await User.findOneAndUpdate(
          { stripeCustomerId: sub.customer },
          { subscription: plan, stripeSubscriptionId: sub.id }
        );
        if (prevUser) await logSubscriptionEvent(prevUser._id, prevUser.subscription, plan);
        console.log(`[Stripe] 🔄 customer ${sub.customer} → plan ${plan}`);
        break;
      }

      /* Annulation ou expiration */
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const prevUser = await User.findOne({ stripeCustomerId: sub.customer }).select('_id subscription');
        await User.findOneAndUpdate(
          { stripeCustomerId: sub.customer },
          { subscription: 'free', stripeSubscriptionId: null }
        );
        if (prevUser) await logSubscriptionEvent(prevUser._id, prevUser.subscription, 'free');
        console.log(`[Stripe] ❌ customer ${sub.customer} → plan free`);
        break;
      }
    }
  } catch (err) {
    console.error('[Stripe webhook handler]', err.message);
  }

  res.json({ received: true });
});

module.exports = router;
