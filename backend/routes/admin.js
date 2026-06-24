const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const { adminGetGroups, adminDeleteGroup } = require('../controllers/groupController');
const { protect, adminOnly } = require('../middleware/auth');
const ActivityLog = require('../models/ActivityLog');

router.use(protect, adminOnly);

router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.put('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

/* ── GET /admin/activity-logs ────────────────────────────────────────────── */
router.get('/activity-logs', async (req, res) => {
  try {
    const { page = 1, limit = 50, action, search } = req.query;
    const filter = {};
    if (action && action !== 'all') filter.action = action;
    if (search) {
      filter.$or = [
        { userEmail: { $regex: search, $options: 'i' } },
        { userName:  { $regex: search, $options: 'i' } },
        { ip:        { $regex: search, $options: 'i' } },
      ];
    }
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);

    // Stats rapides
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const [todayLogins, todayRegs, todayFailed] = await Promise.all([
      ActivityLog.countDocuments({ action: 'login', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments({ action: 'register', createdAt: { $gte: todayStart } }),
      ActivityLog.countDocuments({ action: 'login_failed', createdAt: { $gte: todayStart } }),
    ]);

    res.json({ logs, total, page: +page, pages: Math.ceil(total / +limit), stats: { todayLogins, todayRegs, todayFailed } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/groups', adminGetGroups);
router.delete('/groups/:id', adminDeleteGroup);

// ── Seeds Semestre 1 (usage unique, puis peut être retiré) ────────────────
router.post('/seed-s1', require('../seeds/seedSemestre1_route'));
router.post('/seed-flashcards-s1', require('../seeds/seedFlashcardsSemestre1_route'));
router.post('/seed-medicaments', require('../seeds/seedMedicaments_route'));
router.post('/migrate-buprenorphine', require('../seeds/migrateBuprenorphine'));

/* ── POST /admin/seed-s1-20 ──────────────────────────────────────────────── */
router.post('/seed-s1-20', async (req, res) => {
  try {
    const { seedS1_20 } = require('../seeds/seedS1_20');
    const result = await seedS1_20();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[seed-s1-20]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/fix-chapter-names ───────────────────────────────────────── */
router.post('/fix-chapter-names', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const files = [
      ...require('../seeds/quiz20_S1_UE1_1_B'),
      ...require('../seeds/quiz20_S1_UE1_1_C'),
      ...require('../seeds/quiz20_S1_UE2_10_C'),
      ...require('../seeds/quiz20_S1_UE2_10_D'),
      ...require('../seeds/quiz20_S1_UE2_11_C'),
      ...require('../seeds/quiz20_S1_UE2_11_D'),
      ...require('../seeds/quiz20_S1_UE4_1_B'),
      ...require('../seeds/quiz20_S1_UE6_1_B'),
      ...require('../seeds/quiz20_S1_UE6_1_C'),
    ];
    let updated = 0;
    for (const quiz of files) {
      const result = await Quiz.updateOne(
        { title: quiz.title, category: quiz.category },
        { $set: { chapter: quiz.chapter } }
      );
      if (result.modifiedCount > 0) updated++;
    }
    res.json({ success: true, updated, total: files.length });
  } catch (err) {
    console.error('[fix-chapter-names]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/restructure-ue1-1 ───────────────────────────────────────── */
router.post('/restructure-ue1-1', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const mapping = [
      // Fondements de la psychologie
      { from: 'Introduction à la psychologie — définitions, méthodes et courants théoriques', to: 'Fondements de la psychologie' },
      { from: 'Introduction à la psychologie et mécanismes de défense',                       to: 'Fondements de la psychologie' },
      { from: 'Mécanismes de défense — types, rôles et repérage clinique',                    to: 'Fondements de la psychologie' },
      { from: 'Psychanalyse de Freud — inconscient, pulsions et structure psychique',         to: 'Fondements de la psychologie' },
      { from: 'Conditionnement classique et opérant — Pavlov, Watson, Skinner',               to: 'Fondements de la psychologie' },
      { from: 'Stress, coping et résilience — définitions et mécanismes',                     to: 'Fondements de la psychologie' },
      // Développement psychologique
      { from: 'Piaget — stades du développement cognitif de 0 à l\'adolescence',              to: 'Développement psychologique' },
      { from: 'Erikson — stades psychosociaux du nourrisson à la vieillesse',                 to: 'Développement psychologique' },
      { from: 'Psychologie du développement — stades de Piaget et Erikson',                   to: 'Développement psychologique' },
      { from: 'Bowlby — théorie de l\'attachement et implications cliniques',                  to: 'Développement psychologique' },
      { from: 'Psychologie du sujet âgé — vieillissement normal et psychopathologique',       to: 'Développement psychologique' },
      // Relation, besoins et communication
      { from: 'Maslow — hiérarchie des besoins et applications en soins',                     to: 'Relation, besoins et communication' },
      { from: 'Carl Rogers — relation d\'aide, empathie et congruence',                        to: 'Relation, besoins et communication' },
      { from: 'Communication et relations interpersonnelles en soins',                         to: 'Relation, besoins et communication' },
      { from: 'La famille comme système — approche systémique',                                to: 'Relation, besoins et communication' },
      { from: 'Deuil — étapes de Kübler-Ross, deuil pathologique et accompagnement',          to: 'Relation, besoins et communication' },
      // Sociologie et anthropologie de la santé
      { from: 'Sociologie générale — groupe social, norme et déviance',                       to: 'Sociologie et anthropologie de la santé' },
      { from: 'Sociologie des soins et anthropologie de la santé',                             to: 'Sociologie et anthropologie de la santé' },
      { from: 'Déterminants sociaux de santé — inégalités et facteurs socio-économiques',     to: 'Sociologie et anthropologie de la santé' },
      { from: 'Anthropologie médicale — maladie, culture et représentations du corps',        to: 'Sociologie et anthropologie de la santé' },
      { from: 'Représentations sociales de la maladie et du soin',                            to: 'Sociologie et anthropologie de la santé' },
      // Identité professionnelle et soignant
      { from: 'Identité professionnelle infirmière — construction et enjeux',                 to: 'Identité professionnelle et soignant' },
      { from: 'Burnout soignant — signes, facteurs de risque et prévention',                  to: 'Identité professionnelle et soignant' },
    ];
    let total = 0;
    for (const { from, to } of mapping) {
      const r = await Quiz.updateMany(
        { category: 'UE 1.1 - Psychologie, sociologie, anthropologie', chapter: from },
        { $set: { chapter: to } }
      );
      total += r.modifiedCount;
    }
    res.json({ success: true, updated: total });
  } catch (err) {
    console.error('[restructure-ue1-1]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/restructure-s1-all ──────────────────────────────────────── */
router.post('/restructure-s1-all', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    let total = 0;
    async function remap(category, chapters, newChapter) {
      const r = await Quiz.updateMany(
        { category, chapter: { $in: chapters } },
        { $set: { chapter: newChapter } }
      );
      total += r.modifiedCount;
    }

    // ─── UE 1.3 ──────────────────────────────────────────────────────────────
    const C13 = 'UE 1.3 - Législation, éthique, déontologie';
    await remap(C13, [
      'Droits fondamentaux des patients — loi du 4 mars 2002 (Kouchner)',
      'Personne de confiance — désignation, rôle et limites légales',
      'Consentement éclairé — conditions, refus de soins et exceptions',
      'Droits des patients et personne de confiance',
      'Droits des mineurs et personnes sous tutelle en soins',
      'Loi Leonetti 2005 et Claeys-Leonetti 2016 — droits en fin de vie',
      'Recherche clinique — consentement éclairé et protection des personnes',
    ], 'Droits des patients');
    await remap(C13, [
      'Secret professionnel — étendue, partage et exceptions légales',
      'Responsabilité civile professionnelle de l\'infirmière',
      'Responsabilité pénale et disciplinaire des infirmiers',
      'Responsabilité juridique infirmière et secret professionnel',
      'Délégation de soins — conditions légales et responsabilités partagées',
    ], 'Responsabilité et secret professionnel');
    await remap(C13, [
      'Éthique médicale et déontologie infirmière',
      'Éthique médicale — principes autonomie, bienfaisance, non-malfaisance, justice',
      'Code de déontologie infirmier 2016 — principes et obligations',
      'Bioéthique — lois de bioéthique et Comité Consultatif National d\'Éthique',
    ], 'Éthique, déontologie et bioéthique');
    await remap(C13, [
      'Décrets de compétence infirmière — actes autorisés et interdits',
      'Organisation du système de santé français — niveaux, acteurs et financement',
      'Travail en équipe — cadre légal et interprofessionnalité',
      'Certification HAS — démarche qualité et obligations des établissements',
    ], 'Organisation et compétences infirmières');
    await remap(C13, [
      'Vigilances sanitaires — hémovigilance, pharmacovigilance et signalement',
      'Erreurs médicales et événements indésirables graves — déclaration et responsabilités',
      'RGPD et données médicales — obligations légales et hébergement agréé',
    ], 'Vigilances et sécurité sanitaire');

    // ─── UE 2.1 ──────────────────────────────────────────────────────────────
    const C21 = 'UE 2.1 - Biologie fondamentale';
    await remap(C21, [
      'Structure cellulaire — membrane plasmique, organites et noyau',
      'Division cellulaire — mitose, méiose et cycle cellulaire',
      'ADN, ARN et synthèse des protéines — transcription et traduction',
      'Génétique mendélienne — lois de Mendel et hérédité autosomique',
      'Génétique clinique — mutations, maladies héréditaires et conseil génétique',
      'Biologie cellulaire et génétique fondamentale',
    ], 'Biologie cellulaire et génétique');
    await remap(C21, [
      'Système osseux — histologie osseuse, remodelage et minéralisation',
      'Système musculaire — structure et mécanisme de contraction musculaire',
      'Anatomie cardiovasculaire — cœur, artères et veines principaux',
      'Anatomie respiratoire — voies aériennes supérieures et inférieures',
      'Système digestif — anatomie de l\'oesophage au rectum',
      'Anatomie générale et systèmes de l\'organisme',
    ], 'Anatomie des grands systèmes');
    await remap(C21, [
      'Système nerveux — organisation centrale et périphérique',
      'Système endocrinien — glandes et régulation hormonale',
      'Système rénal — anatomie rein, néphron et voies urinaires',
      'Système reproducteur — anatomie mâle et femelle',
    ], 'Physiologie des systèmes organiques');
    await remap(C21, [
      'Biochimie des glucides — glycolyse, cycle de Krebs et production d\'ATP',
      'Biochimie des lipides — acides gras, triglycérides et phospholipides',
      'Biochimie des protéines — acides aminés, structure et enzymologie',
      'Biochimie et métabolisme énergétique',
    ], 'Biochimie et métabolisme');
    await remap(C21, [
      'Hématologie fondamentale — composition du sang et lignées cellulaires',
      'Immunologie fondamentale — immunité innée et adaptative',
      'Microbiologie générale — classification bactérienne, virale et fongique',
    ], 'Hématologie, immunologie et microbiologie');

    // ─── UE 2.2 ──────────────────────────────────────────────────────────────
    const C22 = 'UE 2.2 - Cycles de la vie et grandes fonctions';
    await remap(C22, [
      'Physiologie cardiaque',
      'Lecture de l\'ECG',
      'Physiologie respiratoire',
      'Cardiologie — anatomie et physiologie cardiovasculaire',
      'Pneumologie — appareil respiratoire et échanges gazeux',
    ], 'Physiologie cardiovasculaire et respiratoire');
    await remap(C22, [
      'Physiologie neurologique',
      'Système nerveux autonome',
      'Neurologie — système nerveux central et périphérique',
      'Chapitre 8 - Physiologie endocrinienne',
    ], 'Physiologie neurologique et endocrinienne');
    await remap(C22, [
      'Chapitre 6 - Physiologie rénale',
      'Chapitre 7 - Physiologie digestive',
      'Chapitre 9 - Hémostase',
      'Chapitre 10 - Physiologie de la reproduction',
    ], 'Physiologie rénale, digestive et de la reproduction');
    await remap(C22, [
      'Chapitre 11 — Vieillissement physiologique',
      'Chapitre 12 — Thermorégulation',
      'Chapitre 13 — Équilibre hydro-électrolytique',
      'Chapitre 14 — Physiologie du sommeil',
      'Chapitre 15 — Douleur',
    ], 'Régulation et homéostasie');
    await remap(C22, [
      'Chapitre 16',
      'Chapitre 17',
      'Chapitre 18',
      'Chapitre 19',
      'Chapitre 20',
    ], 'Cycles de la vie');

    // ─── UE 2.10 ─────────────────────────────────────────────────────────────
    const C210 = 'UE 2.10 - Infectiologie et hygiène';
    await remap(C210, [
      'Bactériologie générale — structure, classification et pouvoir pathogène',
      'Virologie générale — structure virale, réplication et tropisme',
      'Mycologie et parasitologie — principaux agents fongiques et parasitaires',
      'Microbiologie — bactéries, virus, champignons et parasites',
      'Mécanismes de l\'infection — chaîne épidémiologique et portes d\'entrée',
    ], 'Microbiologie et agents infectieux');
    await remap(C210, [
      'Immunité anti-infectieuse — réponse innée et adaptative face aux agents pathogènes',
      'Chapitre 6 — Vaccination',
    ], 'Immunité et vaccination');
    await remap(C210, [
      'Hygiène hospitalière et prévention des infections nosocomiales',
      'Chapitre 7 — Hygiène des mains',
      'Chapitre 8 — Précautions standard',
      'Chapitre 9 — Précautions complémentaires',
      'Désinfection et décontamination — niveaux, produits et matériels',
      'Gestion des DASRI — tri, conditionnement et filière d\'élimination',
      'Stérilisation — méthodes, contrôles et traçabilité',
      'Chapitre 10 — Infections associées aux soins',
    ], 'Hygiène et prévention des infections');
    await remap(C210, [
      'Antibiothérapie — mécanismes, classes et résistances bactériennes',
      'Antibiothérapie 1 — classes d\'antibiotiques, spectre et mécanismes d\'action',
      'Antibiothérapie 2 — règles de prescription, durée et suivi biologique',
      'Résistances bactériennes — mécanismes, BMR/BHR et mesures de contrôle',
    ], 'Antibiothérapie et résistances');
    await remap(C210, [
      'Infections digestives — gastro-entérites bactériennes et virales, Clostridium',
      'Infections respiratoires — pneumonies, tuberculose et grippe',
      'Infections urinaires — agents pathogènes, diagnostic et traitement',
      'Surveillance épidémiologique — réseaux, signalement et alertes sanitaires',
    ], 'Infections cliniques et surveillance');

    // ─── UE 2.11 ─────────────────────────────────────────────────────────────
    const C211 = 'UE 2.11 - Pharmacologie et thérapeutiques';
    await remap(C211, [
      'Pharmacocinétique et pharmacodynamie',
      'Pharmacocinétique — absorption et biodisponibilité des médicaments',
      'Pharmacocinétique — distribution, liaison protéique et volume de distribution',
      'Pharmacocinétique — métabolisme hépatique et élimination rénale',
    ], 'Pharmacocinétique');
    await remap(C211, [
      'Pharmacodynamie — mécanismes d\'action, récepteurs et relation dose-effet',
      'Interactions médicamenteuses — mécanismes pharmacocinétiques et pharmacodynamiques',
      'Chapitre 6 - Effets indésirables médicamenteux',
    ], 'Pharmacodynamie et interactions médicamenteuses');
    await remap(C211, [
      'Administration des médicaments et règles de sécurité',
      'Chapitre 7 - Circuit du médicament à l\'hôpital',
      'Chapitre 8 - Administration IV — perfusions, débit, calcul de doses et complications',
      'Chapitre 9 - Voies IM, SC et ID — techniques, sites et précautions infirmières',
      'Chapitre 10 - Formes orales et autres voies — comprimés, gélules, patches et voie rectale',
      'Médicaments à risque — liste, précautions infirmières et double vérification',
    ], 'Administration des médicaments');
    await remap(C211, [
      'Antalgiques palier 1 — paracétamol, AINS et aspirine',
      'Antalgiques paliers 2 et 3 — tramadol, codéine, morphine et surveillance',
      'Antibiotiques en pratique — pénicillines, céphalosporines, fluoroquinolones',
    ], 'Antalgiques et antibiotiques');
    await remap(C211, [
      'Classes thérapeutiques — cardiovasculaires, SNC et antalgiques',
      'Anticoagulants — héparine, HBPM, AVK et AOD : mécanismes et surveillance',
      'Antihypertenseurs — IEC, ARA2, bêtabloquants, inhibiteurs calciques et diurétiques',
      'Médicaments cardiaques — digoxine, antiarythmiques et dérivés nitrés',
      'Corticoïdes — mécanismes, indications, effets indésirables et sevrage',
      'Insulines et antidiabétiques — types d\'insuline, schémas et surveillance glycémique',
      'Psychotropes — anxiolytiques, antidépresseurs, neuroleptiques et hypnotiques',
    ], 'Classes thérapeutiques spécifiques');

    // ─── UE 3.1 ──────────────────────────────────────────────────────────────
    const C31 = 'UE 3.1 - Raisonnement et démarche clinique infirmière';
    await remap(C31, [
      'Modèles conceptuels de soins et modèle de Henderson',
      'Concepts et modèles de soins infirmiers — définitions et fondements théoriques',
      'Modèle de Virginia Henderson — 14 besoins fondamentaux et recueil de données',
      'Modèles d\'Orem et de Roy — autosoins et adaptation',
      'Evidence-Based Nursing (EBN) — niveaux de preuve et application clinique',
      'Processus de soins infirmiers — étapes et cadre méthodologique',
    ], 'Modèles et concepts de soins infirmiers');
    await remap(C31, [
      'Démarche clinique infirmière et recueil de données',
      'Collecte de données — entretien, observation et sources d\'information',
      'Chapitre 6 — Diagnostic infirmier NANDA',
      'Diagnostics infirmiers, objectifs et planification des soins',
      'Raisonnement clinique — hypothèses, indices et prise de décision',
    ], 'Recueil de données et diagnostic infirmier');
    await remap(C31, [
      'Chapitre 7 — Planification des soins',
      'Chapitre 8 — Réalisation et évaluation des soins',
      'Chapitre 9 — Transmissions DAR',
      'Chapitre 10 — Dossier patient informatisé (DPI)',
      'Continuité des soins — transmission inter-équipe et passage de relais',
    ], 'Planification et suivi des soins');
    await remap(C31, [
      'Urgences vitales — reconnaissance et conduite à tenir initiale (ABC)',
      'Démarche clinique en psychiatrie — signes cliniques et approche relationnelle',
      'Dénutrition — dépistage, MNA et prise en charge nutritionnelle',
      'Prévention des chutes — facteurs de risque, évaluation et mesures adaptées',
      'Évaluation et gestion de la douleur — échelles et traitement non médicamenteux',
      'Situation complexe — intégration de multiples problèmes infirmiers',
      'Éthique dans le soin quotidien — dilemmes éthiques et décision partagée',
    ], 'Situations cliniques et éthique du soin');

    // ─── UE 4.1 ──────────────────────────────────────────────────────────────
    const C41 = 'UE 4.1 - Soins de confort et de bien-être';
    await remap(C41, [
      'Hygiène corporelle et soins de nursing',
      'Douche et bain — aide partielle, totale et sécurité du patient',
      'Toilette au lit — préparation, technique et respect de l\'intimité',
      'Soins bucco-dentaires — technique, matériel et cas particuliers (prothèses, muqueuses)',
      'Soins des yeux et des oreilles — instillations, irrigation et surveillance',
    ], 'Hygiène corporelle et soins de nursing');
    await remap(C41, [
      'Prévention et traitement des plaies et escarres',
      'Classification des escarres — stades I à IV et tissus concernés',
      'Prévention des escarres — échelle de Braden, supports et retournements',
      'Pansements simples — matériel, technique et types de pansements',
      'Plaies chroniques — escarre, ulcère et pied diabétique : évaluation et traitement local',
    ], 'Prévention et soins des plaies');
    await remap(C41, [
      'Mobilisation, installation et prévention des complications de décubitus',
      'Mobilisation et aide aux transferts — techniques de manutention et ergonomie',
      'Positionnement et installation — positions thérapeutiques et prévention des complications',
      'Prévention des chutes — évaluation du risque et aménagement de l\'environnement',
      'Contention physique — indications, cadre légal et surveillance',
      'Confort thermique — hyperthermie, frissons et moyens physiques de refroidissement',
    ], 'Mobilisation, installation et prévention');
    await remap(C41, [
      'Nutrition entérale — pose de SNG, débit et surveillance infirmière',
      'Nutrition parentérale — voies d\'abord, composition et complications',
      'Sondage urinaire — technique, matériel et prévention des infections',
      'Élimination intestinale — constipation, lavement et stomie : soins infirmiers',
    ], 'Nutrition et élimination');
    await remap(C41, [
      'Relation soignant-soigné — écoute active, reformulation et soutien émotionnel',
      'Soins palliatifs et fin de vie — confort, soulagement et accompagnement',
      'Documentation des soins — tracabilité, observations infirmières et cotation',
    ], 'Relation, confort global et fin de vie');

    // ─── UE 6.1 ──────────────────────────────────────────────────────────────
    const C61 = 'UE 6.1 - Méthodes de travail et TIC';
    await remap(C61, [
      'Organisation du travail infirmier et gestion des priorités',
      'Organisation du temps de travail — priorisation, planification et gestion des urgences',
      'Gestion des imprévus — adaptabilité et réajustement en situation de soins',
      'Planification des soins numériques — logiciels de planning et coordination',
    ], 'Organisation du travail et gestion des priorités');
    await remap(C61, [
      'Informatique de santé, dossier patient et transmissions ciblées',
      'Communication ISBAR — structure, utilisation et avantages en soins',
      'Communication interprofessionnelle — outils collaboratifs et réunions de synthèse',
      'Transmissions écrites — règles de rédaction, objectivité et traçabilité',
      'MSSanté et messagerie sécurisée — utilisation, règles et échanges interprofessionnels',
    ], 'Transmissions et communication professionnelle');
    await remap(C61, [
      'Informatique et logiciels de soins — utilisation du DPI et des outils numériques',
      'Systèmes d\'information hospitaliers (SIH) — composants, interopérabilité et enjeux',
      'Prescription électronique — traçabilité, alertes et sécurisation',
      'Intelligence artificielle en santé — applications, limites et enjeux éthiques',
      'Télémédecine — téléconsultation, téléexpertise et cadre réglementaire',
    ], 'Outils numériques et systèmes d\'information');
    await remap(C61, [
      'RGPD et données de santé — droits des patients et obligations des soignants',
      'Cybersécurité en santé — mots de passe, phishing et gestion des incidents',
      'Gestion documentaire — archivage, durée de conservation et destruction sécurisée',
      'Réseaux sociaux et e-réputation — risques professionnels et bonnes pratiques',
    ], 'Réglementation et sécurité numérique');
    await remap(C61, [
      'Recherche documentaire — bases de données, mots-clés et sources fiables',
      'Lecture critique d\'article — grille d\'analyse et niveaux de preuve',
      'Veille professionnelle — agrégateurs, newsletters et revues infirmières',
      'Bilan de compétences numériques — autoévaluation et formation continue',
    ], 'Veille et développement professionnel');

    res.json({ success: true, totalModified: total });
  } catch (err) {
    console.error('[restructure-s1-all]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/merge-ue-categories ─────────────────────────────────────── */
router.post('/merge-ue-categories', async (req, res) => {
  try {
    const Quiz = require('../models/Quiz');
    const renames = [
      { from: 'UE 2.10 - Infectiologie, hygiène',         to: 'UE 2.10 - Infectiologie et hygiène' },
      { from: 'UE 4.1 - Soins de confort et de relation', to: 'UE 4.1 - Soins de confort et de bien-être' },
      { from: 'UE 6.2 - Anglais médical',                 to: 'UE 6.2 - Anglais' },
    ];
    const results = [];
    for (const { from, to } of renames) {
      const r = await Quiz.updateMany({ category: from }, { $set: { category: to } });
      results.push({ from, to, updated: r.modifiedCount });
    }
    console.log('[merge-ue-categories]', results);
    res.json({ success: true, results });
  } catch (err) {
    console.error('[merge-ue-categories]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/seed-new-quizzes ────────────────────────────────────────── */
router.post('/seed-new-quizzes', async (req, res) => {
  try {
    const { seedNewQuizzes } = require('../seeds/seedNewQuizzes');
    const result = await seedNewQuizzes();
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[seed-new-quizzes]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /admin/seed-exercises-s1 ───────────────────────────────────────── */
router.post('/seed-exercises-s1', require('../seeds/seedExercises_route'));

module.exports = router;
