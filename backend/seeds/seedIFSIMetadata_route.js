'use strict';
const Lesson = require('../models/Lesson');

const UE_MAP = {
  '1.1': 'UE 1.1 — Psychologie, sociologie, anthropologie',
  '1.2': 'UE 1.2 — Santé publique et économie de la santé',
  '1.3': 'UE 1.3 — Législation, éthique, déontologie',
  '2.1': 'UE 2.1 — Biologie fondamentale',
  '2.2': 'UE 2.2 — Cycles de la vie et grandes fonctions',
  '2.3': 'UE 2.3 — Santé, maladie, handicap, accidents de la vie',
  '2.4': 'UE 2.4 — Processus traumatiques',
  '2.5': 'UE 2.5 — Processus infectieux et inflammatoires',
  '2.6': 'UE 2.6 — Processus psychopathologiques',
  '2.7': 'UE 2.7 — Défaillances organiques et processus dégénératifs',
  '2.8': 'UE 2.8 — Processus obstructifs',
  '2.9': 'UE 2.9 — Processus tumoraux',
  '2.10': 'UE 2.10 — Infectiologie, hygiène',
  '2.11': 'UE 2.11 — Pharmacologie et thérapeutique',
  '3.1': 'UE 3.1 — Raisonnement et démarche clinique infirmière',
  '3.2': 'UE 3.2 — Projet de soins infirmiers',
  '3.3': 'UE 3.3 — Rôles infirmiers, organisation du travail et interprofessionalité',
  '3.4': 'UE 3.4 — Initiation à la démarche de recherche',
  '3.5': 'UE 3.5 — Encadrement des professionnels de soins',
  '4.1': 'UE 4.1 — Soins de confort et de bien-être',
  '4.2': 'UE 4.2 — Soins relationnels',
  '4.3': "UE 4.3 — Soins d'urgence",
  '4.4': 'UE 4.4 — Thérapeutiques et contribution au diagnostic médical',
  '4.5': 'UE 4.5 — Soins infirmiers et gestion des risques',
  '4.6': 'UE 4.6 — Soins éducatifs et préventifs',
  '4.7': 'UE 4.7 — Soins palliatifs et de fin de vie',
  '4.8': 'UE 4.8 — Qualité des soins, évaluation des pratiques',
  '5.1': 'UE 5.1 — Accompagnement dans la réalisation des soins quotidiens',
  '5.2': "UE 5.2 — Évaluation d'une situation clinique",
  '5.3': 'UE 5.3 — Communication et conduite de projet',
  '5.4': 'UE 5.4 — Soins éducatifs et formation des professionnels',
  '5.5': 'UE 5.5 — Mise en œuvre des thérapeutiques et coordination des soins',
  '5.6': 'UE 5.6 — Analyse de la qualité et traitement des données scientifiques',
  '5.7': "UE 5.7 — Unité d'enseignement optionnelle",
  '6.1': 'UE 6.1 — Méthodes de travail et TIC',
  '6.2': 'UE 6.2 — Anglais',
};

module.exports = async (req, res) => {
  const { courses } = req.body;
  if (!Array.isArray(courses) || courses.length === 0)
    return res.status(400).json({ ok: false, message: 'Aucun cours recu' });

  let inserted = 0, skipped = 0, errors = 0;

  for (const c of courses) {
    const { title, semester, ueCode, year } = c;
    if (!title || !ueCode) { errors++; continue; }

    const category = UE_MAP[ueCode] || `UE ${ueCode}`;

    try {
      const exists = await Lesson.findOne({ title, category }).lean();
      if (exists) { skipped++; continue; }

      await Lesson.create({
        title,
        type:        'cours',
        content:     '',
        summary:     '',
        semester:    semester || '',
        category,
        chapter:     '',
        tags:        [ueCode, semester, year].filter(Boolean),
        difficulty:  'medium',
        isPublished: true,
        hasFile:     false,
      });
      inserted++;
    } catch (e) {
      console.error('[SeedIFSI Meta]', title, e.message);
      errors++;
    }
  }

  res.json({ ok: true, inserted, skipped, errors });
};
