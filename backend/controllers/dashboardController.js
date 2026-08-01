const QuizAttempt = require('../models/QuizAttempt');
const FlashcardAttempt = require('../models/FlashcardAttempt');

exports.getInProgress = async (req, res) => {
  try {
    const [quizAttempts, flashAttempts] = await Promise.all([
      QuizAttempt.find({ user: req.user._id, status: 'in_progress' })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('quiz', 'title category chapter questions programVersion'),
      FlashcardAttempt.find({ user: req.user._id, status: 'in_progress' })
        .sort({ updatedAt: -1 })
        .limit(5),
    ]);

    const items = [
      ...quizAttempts
        .filter(a => a.quiz && !(req.user.programVersion === 'reforme_2026' && a.quiz.programVersion !== 'reforme_2026'))
        .map(a => ({
          type: 'quiz',
          quizId: a.quiz._id,
          title: a.quiz.title,
          subtitle: [a.quiz.category, a.quiz.chapter].filter(Boolean).join(' — '),
          progress: a.quiz.questions?.length
            ? Math.round((a.currentQuestion / a.quiz.questions.length) * 100)
            : null,
          updatedAt: a.updatedAt,
        })),
      ...flashAttempts.map(a => ({
        type: 'flashcard',
        semester: a.semester,
        ue: a.ue,
        chapter: a.chapter,
        part: a.part,
        title: a.chapter,
        subtitle: [a.ue, a.part].filter(Boolean).join(' — '),
        progress: a.total ? Math.round((a.currentIndex / a.total) * 100) : null,
        updatedAt: a.updatedAt,
      })),
    ]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
