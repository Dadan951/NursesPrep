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

/* ── Parrainage : coupon Stripe réutilisable pour N mois gratuits ─────────── */
async function getOrCreateFreeMonthsCoupon(months) {
  const id = months === 1 ? 'parrainage-1-mois' : `parrainage-${months}-mois`;
  try {
    return (await stripe.coupons.retrieve(id)).id;
  } catch (_) {
    const coupon = await stripe.coupons.create({
      id, percent_off: 100,
      duration: months === 1 ? 'once' : 'repeating',
      duration_in_months: months === 1 ? undefined : months,
      name: `Parrainage — ${months} mois gratuit${months > 1 ? 's' : ''}`,
    });
    return coupon.id;
  }
}

/* Accorde la récompense de parrainage (1 mois gratuit) au parrain d'un utilisateur
   qui vient de s'abonner pour la première fois. Applique directement le rabais
   Stripe si le parrain a déjà un abonnement actif, sinon met le mois en attente
   (appliqué automatiquement à son prochain checkout). */
async function rewardReferrer(referrerId) {
  const referrer = await User.findById(referrerId).select('stripeSubscriptionId');
  if (!referrer) return;
  if (referrer.stripeSubscriptionId) {
    try {
      const couponId = await getOrCreateFreeMonthsCoupon(1);
      await stripe.subscriptions.update(referrer.stripeSubscriptionId, { coupon: couponId });
    } catch (err) {
      console.error('[Parrainage] Échec application coupon parrain:', err.message);
    }
  } else {
    await User.findByIdAndUpdate(referrerId, { $inc: { pendingFreeMonths: 1 } });
  }
}

/* ── POST /api/subscription/checkout ────────────────────────────────────── */
router.post('/checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PRICE_IDS[plan]) return res.status(400).json({ message: 'Plan invalide' });
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_placeholder')
      return res.status(503).json({ message: 'Paiement non configuré — contacte l\'administrateur.' });

    const me = await User.findById(req.user._id).select('pendingFreeMonths');
    const sessionParams = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: PRICE_IDS[plan], quantity: 1 }],
      customer_email: req.user.email,
      metadata: { userId: req.user._id.toString(), plan },
      success_url: `${process.env.FRONTEND_URL || 'https://www.nursesprep.fr'}/dashboard/subscription?success=true&plan=${plan}`,
      cancel_url:  `${process.env.FRONTEND_URL || 'https://www.nursesprep.fr'}/dashboard/subscription?canceled=true`,
      locale: 'fr',
    };
    // Mois gratuits gagnés par parrainage, en attente d'un abonnement actif
    if (me?.pendingFreeMonths > 0) {
      sessionParams.discounts = [{ coupon: await getOrCreateFreeMonthsCoupon(me.pendingFreeMonths) }];
    }
    const session = await stripe.checkout.sessions.create(sessionParams);

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

        const prevUser = await User.findById(userId).select('subscription referredBy referralConverted pendingFreeMonths');
        await User.findByIdAndUpdate(userId, {
          subscription:         plan,
          stripeCustomerId:     session.customer,
          stripeSubscriptionId: session.subscription,
          ...(prevUser?.pendingFreeMonths > 0 ? { pendingFreeMonths: 0 } : {}), // consommés dans ce checkout
        });
        await logSubscriptionEvent(userId, prevUser?.subscription || 'free', plan);
        console.log(`[Stripe] ✅ ${userId} → plan ${plan}`);

        // Parrainage : première conversion payante d'un utilisateur parrainé
        // → 1 mois gratuit pour lui ET pour son parrain.
        if (prevUser?.referredBy && !prevUser.referralConverted) {
          try {
            const couponId = await getOrCreateFreeMonthsCoupon(1);
            await stripe.subscriptions.update(session.subscription, { coupon: couponId });
          } catch (err) {
            console.error('[Parrainage] Échec application coupon filleul:', err.message);
          }
          await User.findByIdAndUpdate(userId, { referralConverted: true });
          await rewardReferrer(prevUser.referredBy);
          console.log(`[Parrainage] 🎁 ${userId} et son parrain ${prevUser.referredBy} récompensés`);
        }
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
