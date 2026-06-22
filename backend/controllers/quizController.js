const Quiz        = require('../models/Quiz');
const User        = require('../models/User');
const QuizAttempt = require('../models/QuizAttempt');
const Anthropic   = require('@anthropic-ai/sdk');

const DAILY_LIMIT = 10; // max generations per day for pro
const DAILY_LIMIT_PREMIUM = 20; // for premium

function todayString() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

exports.getAll = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPublished: true }).select('-questions.options.isCorrect');

    // Récupère tous les attempts de l'utilisateur en une seule requête
    const attempts = await QuizAttempt.find({ user: req.user._id }).select('quiz status score currentQuestion answers completedAt');
    const attemptMap = {};
    for (const a of attempts) attemptMap[a.quiz.toString()] = a;

    const result = quizzes.map(q => {
      const a = attemptMap[q._id.toString()];
      return {
        ...q.toObject(),
        attempt: a ? {
          status:          a.status,
          score:           a.score,
          currentQuestion: a.currentQuestion,
          totalQuestions:  q.questions.length,
          completedAt:     a.completedAt,
          wrongAnswers:    a.answers.filter(x => !x.isCorrect).length,
        } : null,
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    res.status(201).json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' });
    res.json(quiz);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' });
    res.json({ message: 'Quiz supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/quizzes/:id/progress ─────────────────────────────────────────
// ── GET /api/quizzes/history ──────────────────────────────────────────────
// Historique complet des quiz terminés par l'utilisateur
exports.getHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.user._id,
      status: 'completed',
    })
      .populate('quiz', 'title category chapter semester difficulty')
      .sort({ completedAt: -1 })
      .limit(200);

    const result = attempts.map(a => ({
      _id:         a._id,
      quizId:      a.quiz?._id,
      title:       a.quiz?.title || 'Quiz supprimé',
      category:    a.quiz?.category || '',
      chapter:     a.quiz?.chapter || '',
      semester:    a.quiz?.semester || '',
      difficulty:  a.quiz?.difficulty || '',
      score:       a.score,
      total:       a.answers?.length || 0,
      pct:         a.answers?.length ? Math.round((a.score / a.answers.length) * 100) : 0,
      completedAt: a.completedAt,
    }));

    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Renvoie l'attempt en cours ou complété pour ce quiz
exports.getProgress = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({ user: req.user._id, quiz: req.params.id });
    res.json(attempt || null);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── PUT /api/quizzes/:id/progress ─────────────────────────────────────────
// Sauvegarde la progression en cours (après chaque question répondue)
exports.saveProgress = async (req, res) => {
  try {
    const { currentQuestion, score, answers } = req.body;
    const attempt = await QuizAttempt.findOneAndUpdate(
      { user: req.user._id, quiz: req.params.id },
      { $set: { currentQuestion, score, answers, status: 'in_progress' } },
      { upsert: true, new: true }
    );
    res.json(attempt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/quizzes/:id/attempt ──────────────────────────────────────────
// Marque le quiz comme terminé + met à jour les stats utilisateur
const FREE_MONTHLY_LIMIT = 10;
const currentMonth = () => new Date().toISOString().slice(0, 7); // "2026-06"

exports.getQuota = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('subscription');
    if (user.subscription !== 'free') return res.json({ limited: false });
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const count = await QuizAttempt.countDocuments({
      user: req.user._id,
      completedAt: { $gte: startOfMonth },
      status: 'completed',
    });
    res.json({ limited: true, used: count, limit: FREE_MONTHLY_LIMIT, exceeded: count >= FREE_MONTHLY_LIMIT });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.submitAttempt = async (req, res) => {
  try {
    const { score, answers } = req.body;
    const user = await User.findById(req.user._id).select('subscription');

    // Vérifier quota mensuel pour les free
    if (user.subscription === 'free') {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const count = await QuizAttempt.countDocuments({
        user: req.user._id,
        completedAt: { $gte: startOfMonth },
        status: 'completed',
      });
      if (count >= FREE_MONTHLY_LIMIT) {
        return res.status(403).json({ message: 'quota_exceeded' });
      }
    }

    // Marquer l'attempt comme completed
    await QuizAttempt.findOneAndUpdate(
      { user: req.user._id, quiz: req.params.id },
      { $set: { status: 'completed', score, answers, completedAt: new Date(), currentQuestion: 0 } },
      { upsert: true, new: true }
    );

    // Reset daily si nouveau jour
    const today = new Date().toISOString().split('T')[0];
    await User.updateOne(
      { _id: req.user._id, 'dailyProgress.date': { $ne: today } },
      { $set: { 'dailyProgress.date': today, 'dailyProgress.quiz': 0, 'dailyProgress.flashcards': 0, 'dailyProgress.exercises': 0 } }
    );

    // Mettre à jour les stats globales + daily
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'progress.quizCompleted': 1, 'progress.totalScore': score, 'dailyProgress.quiz': 1 },
      $set: { 'progress.lastActivity': new Date() }
    });

    res.json({ message: 'Résultat enregistré', score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminGetAll = async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/quizzes/personal — user's generated quizzes
exports.getPersonal = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPersonal: true, owner: req.user._id }).sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/quizzes/personal/:id
exports.deletePersonal = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, owner: req.user._id, isPersonal: true });
    if (!quiz) return res.status(404).json({ message: 'Quiz introuvable' });
    await Quiz.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quiz supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/quizzes/gen-status — check daily quota
exports.genStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!['pro', 'premium'].includes(user.subscription)) {
      return res.status(403).json({ message: 'Abonnement Pro requis' });
    }
    const limit = user.subscription === 'premium' ? DAILY_LIMIT_PREMIUM : DAILY_LIMIT;
    const today = todayString();
    const used = user.quizGen?.date === today ? (user.quizGen?.count || 0) : 0;
    res.json({ used, limit, remaining: limit - used });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/quizzes/generate
exports.generateQuiz = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!['pro', 'premium'].includes(user.subscription)) {
      return res.status(403).json({ message: 'Cette fonctionnalité est réservée aux abonnements Pro et Premium.' });
    }

    const limit = user.subscription === 'premium' ? DAILY_LIMIT_PREMIUM : DAILY_LIMIT;
    const today = todayString();

    // Reset counter if it's a new day
    if (user.quizGen?.date !== today) {
      user.quizGen = { count: 0, date: today };
    }

    if (user.quizGen.count >= limit) {
      return res.status(429).json({
        message: `Limite journalière atteinte (${limit} générations/jour). Réessayez demain.`,
        remaining: 0
      });
    }

    const { courseText, title, category, chapter, questionCount = 5 } = req.body;

    if (!courseText || courseText.trim().length < 50) {
      return res.status(400).json({ message: 'Le texte du cours doit contenir au moins 50 caractères.' });
    }

    const count = Math.min(Math.max(parseInt(questionCount) || 5, 3), 10);

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Tu es un formateur en soins infirmiers (IFSI). À partir du cours ci-dessous, génère exactement ${count} questions QCM en français.

COURS :
${courseText.slice(0, 4000)}

RÈGLES :
- Chaque question doit avoir exactement 4 options (A, B, C, D)
- Une seule réponse correcte par question
- Les questions doivent tester la compréhension réelle, pas la mémorisation superficielle
- Inclure une explication courte pour chaque bonne réponse
- TRÈS IMPORTANT : toutes les options doivent avoir une longueur et un niveau de détail similaires — la bonne réponse ne doit PAS être identifiable parce qu'elle est plus longue ou plus précise que les autres
- Les mauvaises réponses (distracteurs) doivent être plausibles, crédibles et de même complexité que la bonne réponse — évite les distracteurs trop courts, trop vagues ou manifestement faux
- Un étudiant ne doit pas pouvoir deviner la bonne réponse par la longueur ou la formulation, seulement par ses connaissances

Réponds UNIQUEMENT avec un JSON valide dans ce format exact, sans texte avant ou après :
{
  "title": "${title || 'Quiz généré'}",
  "description": "Quiz généré à partir de votre cours",
  "questions": [
    {
      "text": "Question ?",
      "options": [
        { "text": "Option A", "isCorrect": false },
        { "text": "Option B", "isCorrect": true },
        { "text": "Option C", "isCorrect": false },
        { "text": "Option D", "isCorrect": false }
      ],
      "explanation": "Explication courte."
    }
  ]
}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }]
    });

    const raw = message.content[0].text.trim();
    // Extract JSON even if there's surrounding text
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse IA invalide');

    const generated = JSON.parse(jsonMatch[0]);

    const quiz = await Quiz.create({
      title: generated.title || title || 'Quiz personnalisé',
      description: generated.description || '',
      category: category || 'Personnalisé',
      chapter: chapter || 'Mon cours',
      difficulty: 'medium',
      duration: count * 2,
      isPublished: false,
      isPersonal: true,
      owner: req.user._id,
      questions: generated.questions.slice(0, count)
    });

    // Increment daily counter
    user.quizGen.count += 1;
    await user.save();

    const remaining = limit - user.quizGen.count;
    res.status(201).json({ quiz, remaining });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ message: 'Erreur lors de la génération du quiz. Réessayez.' });
    }
    res.status(500).json({ message: err.message });
  }
};
