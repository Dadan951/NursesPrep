const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
require('./instrument'); // Sentry — doit être requis avant l'app

const mongoose = require('mongoose');
const app = require('./app');

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Atlas connecté !');
    await require('./seed')();
    app.listen(process.env.PORT || 5000, () => {
      console.log('✅ Serveur lancé sur http://localhost:5000');
    });
  })
  .catch((err) => {
    console.log('❌ Erreur :', err.message);
  });
