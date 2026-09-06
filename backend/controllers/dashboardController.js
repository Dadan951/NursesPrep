const QuizAttempt = require('../models/QuizAttempt');
const FlashcardAttempt = require('../models/FlashcardAttempt');
const ExerciseAttempt = require('../models/ExerciseAttempt');
const Exercise = require('../models/Exercise');

exports.getInProgress = async (req, res) => {
  try {
    const [quizAttempts, flashAttempts, exerciseAttempts] = await Promise.all([
      QuizAttempt.find({ user: req.user._id, status: 'in_progress' })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('quiz', 'title category chapter questions programVersion'),
      FlashcardAttempt.find({ user: req.user._id, status: 'in_progress' })
        .sort({ updatedAt: -1 })
        .limit(5),
      ExerciseAttempt.find({ user: req.user._id })
        .sort({ completedAt: -1 })
        .limit(500)
        .populate('exercise', 'category semester caseType programVersion'),
    ]);

    // Regroupe les tentatives d'exercices par chapitre (semestre + UE + caseType),
    // en ne gardant que les exercices distincts déjà répondus dans ce chapitre —
    // un chapitre "en cours" est un chapitre partiellement fait (ni 0, ni entier).
    const chapterMap = {};
    exerciseAttempts.forEach(a => {
      const ex = a.exercise;
      if (!ex) return;
      if (req.user.programVersion === 'reforme_2026' && ex.programVersion !== 'reforme_2026') return;
      const key = `${ex.semester}|${ex.category}|${ex.caseType}`;
      if (!chapterMap[key]) {
        chapterMap[key] = { semester: ex.semester, ue: ex.category, chapter: ex.caseType, doneIds: new Set(), lastAt: a.completedAt };
      }
      chapterMap[key].doneIds.add(String(ex._id));
      if (a.completedAt > chapterMap[key].lastAt) chapterMap[key].lastAt = a.completedAt;
    });

    const chapterKeys = Object.keys(chapterMap);
    const exerciseItems = [];
    if (chapterKeys.length) {
      const orConds = chapterKeys.map(k => {
        const c = chapterMap[k];
        return { semester: c.semester, category: c.ue, caseType: c.chapter };
      });
      const allExercises = await Exercise.find({
        isPublished: true,
        programVersion: req.user.programVersion === 'reforme_2026' ? 'reforme_2026' : { $ne: 'reforme_2026' },
        $or: orConds,
      }).select('semester category caseType');

      const totalMap = {};
      allExercises.forEach(ex => {
        const key = `${ex.semester}|${ex.category}|${ex.caseType}`;
        totalMap[key] = (totalMap[key] || 0) + 1;
      });

      chapterKeys.forEach(key => {
        const c = chapterMap[key];
        const total = totalMap[key] || 0;
        const done = c.doneIds.size;
        if (total > 0 && done > 0 && done < total) {
          exerciseItems.push({
            type: 'exercise',
            semester: c.semester,
            ue: c.ue,
            chapter: c.chapter,
            title: c.chapter,
            subtitle: c.ue,
            progress: Math.round((done / total) * 100),
            updatedAt: c.lastAt,
          });
        }
      });
    }

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
      ...exerciseItems,
    ]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
