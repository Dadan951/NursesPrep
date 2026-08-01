const mongoose = require('mongoose');

// Journal des changements d'abonnement (déclenché par les webhooks Stripe),
// utilisé pour calculer le taux de churn et la rétention dans le temps.
const subscriptionEventSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromPlan: { type: String, enum: ['free', 'pro', 'premium'], required: true },
  toPlan:   { type: String, enum: ['free', 'pro', 'premium'], required: true },
  type:     { type: String, enum: ['new', 'upgrade', 'downgrade', 'canceled'], required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SubscriptionEvent', subscriptionEventSchema);
