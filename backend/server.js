const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
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

app.get('/', (req, res) => {
  res.json({ message: '🚀 Serveur IFSI opérationnel !' });
});

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