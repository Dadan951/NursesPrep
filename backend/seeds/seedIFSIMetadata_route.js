'use strict';
const Lesson = require('../models/Lesson');

module.exports = async (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses) || courses.length === 0)
    return res.status(400).json({ ok: false, message: 'Aucun cours reçu' });

  let inserted = 0, skipped = 0, errors = 0;

  for (const c of courses) {
    const { title, semester, category, ueCode, year } = c;
    if (!title || !category) { errors++; continue; }

    try {
      const exists = await Lesson.findOne({ title, category }).lean();
      if (exists) { skipped++; continue; }

      await Lesson.create({
        title,
        type:        'cours',
        content:     '',
        summary:     '',
        semester,
        category,
        chapter:     '',
        tags:        [ueCode, semester, year].filter(Boolean),
        difficulty:  'medium',
        isPublished: true,
        hasFile:     false,
      });
      inserted++;
    } catch (e) {
      errors++;
    }
  }

  res.json({ ok: true, inserted, skipped, errors });
};
