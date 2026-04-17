const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Flashcard = require('./models/Flashcard');
const Exercise = require('./models/Exercise');
const Lesson = require('./models/Lesson');

async function seed() {
  // Admin user
  const adminExists = await User.findOne({ email: 'admin@ifsi.fr' });
  if (!adminExists) {
    await User.create({ name: 'Administrateur', email: 'admin@ifsi.fr', password: 'Admin1234!', role: 'admin' });
    console.log('✅ Admin créé : admin@ifsi.fr / Admin1234!');
  }

  // Sample quizzes
  const quizCount = await Quiz.countDocuments();
  if (quizCount === 0) {
    await Quiz.insertMany([
      {
        title: 'Anatomie — Système cardio-vasculaire',
        description: 'Questions sur le cœur, les vaisseaux et la circulation sanguine.',
        category: 'UE 2.2',
        chapter: 'Système cardio-vasculaire',
        difficulty: 'medium',
        duration: 10,
        questions: [
          {
            text: 'Combien de cavités comporte le cœur ?',
            options: [
              { text: '2 cavités', isCorrect: false },
              { text: '4 cavités', isCorrect: true },
              { text: '3 cavités', isCorrect: false },
              { text: '6 cavités', isCorrect: false }
            ],
            explanation: 'Le cœur est composé de 4 cavités : deux oreillettes (droite et gauche) et deux ventricules (droit et gauche).'
          },
          {
            text: 'Quel vaisseau transporte le sang oxygéné du cœur vers le corps ?',
            options: [
              { text: 'La veine cave', isCorrect: false },
              { text: "L'artère pulmonaire", isCorrect: false },
              { text: "L'aorte", isCorrect: true },
              { text: 'La veine pulmonaire', isCorrect: false }
            ],
            explanation: "L'aorte est la principale artère du corps humain, elle transporte le sang riche en oxygène depuis le ventricule gauche."
          },
          {
            text: 'Quelle est la valeur normale de la fréquence cardiaque au repos chez l\'adulte ?',
            options: [
              { text: '40-60 bpm', isCorrect: false },
              { text: '60-100 bpm', isCorrect: true },
              { text: '100-120 bpm', isCorrect: false },
              { text: '120-140 bpm', isCorrect: false }
            ],
            explanation: 'La fréquence cardiaque normale au repos chez un adulte est de 60 à 100 battements par minute.'
          }
        ]
      },
      {
        title: 'Pharmacologie — Analgésiques',
        description: 'Connaissances sur les médicaments antidouleur et leurs utilisations.',
        category: 'UE 2.11',
        chapter: 'Analgésiques et antidouleurs',
        difficulty: 'hard',
        duration: 15,
        questions: [
          {
            text: 'Quelle est la dose maximale de paracétamol par jour chez l\'adulte ?',
            options: [
              { text: '2 grammes', isCorrect: false },
              { text: '3 grammes', isCorrect: false },
              { text: '4 grammes', isCorrect: true },
              { text: '6 grammes', isCorrect: false }
            ],
            explanation: 'La dose maximale de paracétamol est de 4g/jour chez l\'adulte, soit 1g toutes les 6 heures.'
          },
          {
            text: 'L\'ibuprofène appartient à quelle classe thérapeutique ?',
            options: [
              { text: 'Opioïdes faibles', isCorrect: false },
              { text: 'AINS (Anti-Inflammatoires Non Stéroïdiens)', isCorrect: true },
              { text: 'Corticoïdes', isCorrect: false },
              { text: 'Antispasmodiques', isCorrect: false }
            ],
            explanation: 'L\'ibuprofène est un AINS (Anti-Inflammatoire Non Stéroïdien) utilisé pour ses propriétés analgésiques, antipyrétiques et anti-inflammatoires.'
          }
        ]
      },
      {
        title: 'Soins infirmiers — Hygiène et prévention',
        description: 'Principes fondamentaux de l\'hygiène hospitalière.',
        category: 'UE 4.1',
        chapter: 'Hygiène et prévention des infections',
        difficulty: 'easy',
        duration: 8,
        questions: [
          {
            text: 'Combien de temps doit durer un lavage des mains hygiénique avec une solution hydroalcoolique ?',
            options: [
              { text: '10 secondes', isCorrect: false },
              { text: '20-30 secondes', isCorrect: true },
              { text: '1 minute', isCorrect: false },
              { text: '2 minutes', isCorrect: false }
            ],
            explanation: 'La friction avec une solution hydroalcoolique doit durer au minimum 20 à 30 secondes pour être efficace.'
          },
          {
            text: 'Le port de gants remplace-t-il le lavage des mains ?',
            options: [
              { text: 'Oui, toujours', isCorrect: false },
              { text: 'Non, jamais', isCorrect: true },
              { text: 'Oui, si les gants sont stériles', isCorrect: false },
              { text: 'Cela dépend du soin', isCorrect: false }
            ],
            explanation: 'Le port de gants ne remplace jamais le lavage des mains. Les mains doivent être lavées avant et après le port des gants.'
          }
        ]
      }
    ]);
    console.log('✅ Quiz de démonstration créés');
  }

  // Sample flashcards
  const fcCount = await Flashcard.countDocuments();
  if (fcCount === 0) {
    await Flashcard.insertMany([
      { front: 'Définition de la bradycardie', back: 'Fréquence cardiaque inférieure à 60 battements par minute au repos.', category: 'Cardiologie', chapter: 'Troubles du rythme', difficulty: 'easy' },
      { front: 'Définition de la tachycardie', back: 'Fréquence cardiaque supérieure à 100 battements par minute au repos.', category: 'Cardiologie', chapter: 'Troubles du rythme', difficulty: 'easy' },
      { front: 'Qu\'est-ce que l\'hypoglycémie ?', back: 'Glycémie inférieure à 0,70 g/L (3,9 mmol/L). Signes : sueurs, tremblements, confusion, palpitations.', category: 'Endocrinologie', chapter: 'Diabète et glycémie', difficulty: 'medium' },
      { front: 'Valeurs normales de la SpO2', back: 'Entre 95% et 100%. En dessous de 94%, une supplémentation en oxygène est généralement nécessaire.', category: 'Pneumologie', chapter: 'Paramètres vitaux', difficulty: 'easy' },
      { front: 'Définition de l\'oligurie', back: 'Diurèse inférieure à 400 mL/24h chez l\'adulte (ou moins de 0,5 mL/kg/h).', category: 'Néphrologie', chapter: 'Fonction rénale', difficulty: 'medium' },
      { front: 'Qu\'est-ce que la pression artérielle différentielle ?', back: 'Différence entre la pression systolique et la pression diastolique. Valeur normale : environ 40 mmHg.', category: 'Cardiologie', chapter: 'Pression artérielle', difficulty: 'medium' },
      { front: 'Les 5 droits en administration médicamenteuse', back: '1. Bon médicament\n2. Bonne dose\n3. Bon patient\n4. Bonne voie\n5. Bon moment', category: 'Pharmacologie', chapter: 'Administration des médicaments', difficulty: 'easy' },
      { front: 'Définition de la dyspnée', back: 'Sensation subjective de difficultés respiratoires, couramment appelée "essoufflement".', category: 'Pneumologie', chapter: 'Paramètres vitaux', difficulty: 'easy' }
    ]);
    console.log('✅ Flashcards de démonstration créées');
  }

  // Sample exercises
  const exCount = await Exercise.countDocuments();
  if (exCount === 0) {
    await Exercise.insertMany([
      {
        title: 'Cas clinique : prise en charge d\'un patient diabétique',
        content: 'M. Dupont, 67 ans, diabétique de type 2 sous insuline, est hospitalisé. À 8h00, avant son petit-déjeuner, sa glycémie capillaire est de 0,52 g/L. Il est conscient, agité et transpire abondamment.\n\n1. Identifiez le problème de santé présenté par M. Dupont.\n2. Quels sont les signes d\'hypoglycémie que vous observez ?\n3. Quelle est votre conduite à tenir immédiate ?\n4. Quand resucrerez-vous de nouveau et par quoi ?',
        answer: '1. M. Dupont présente une hypoglycémie (glycémie < 0,70 g/L).\n2. Signes observés : agitation, sueurs abondantes + glycémie à 0,52 g/L.\n3. Conduite immédiate : apporter 15-20g de glucides rapides (3 sucres, 150mL de jus de fruit), ne pas laisser le patient seul, prévenir le médecin, monitorer la glycémie.\n4. Contrôler la glycémie 15 minutes après et resucrer si < 0,70 g/L. Donner un complément glucidique complexe (pain, biscuits) pour maintenir la glycémie.',
        category: 'UE 4.4',
        type: 'case_study',
        difficulty: 'hard'
      },
      {
        title: 'Question théorique : La loi Leonetti',
        content: 'Expliquez les principes fondamentaux de la loi Leonetti (2005) et son importance dans la pratique infirmière. Quels sont les droits qu\'elle accorde aux patients en fin de vie ?',
        answer: 'La loi Leonetti du 22 avril 2005 encadre les droits des malades en fin de vie :\n- Interdit l\'acharnement thérapeutique\n- Reconnaît le droit à laisser mourir (arrêt/limitation des traitements)\n- Donne force légale aux directives anticipées\n- Désigne la personne de confiance\n- Oblige au soulagement de la douleur même si cela peut abréger la vie\nPour l\'infirmier : respecter les directives anticipées, informer, tracer les décisions, assurer des soins de confort.',
        category: 'UE 1.3',
        type: 'open',
        difficulty: 'medium'
      },
      {
        title: 'QCM : Réglementation des stupéfiants',
        content: 'Concernant la gestion des médicaments stupéfiants à l\'hôpital, quelle(s) affirmation(s) est/sont exacte(s) ?',
        answer: 'Réponses B et D correctes.',
        category: 'UE 2.11',
        type: 'qcm',
        difficulty: 'medium',
        options: [
          { text: 'Tout infirmier peut prescrire des stupéfiants en cas d\'urgence', isCorrect: false },
          { text: 'Les stupéfiants doivent être conservés dans une armoire fermée à clé', isCorrect: true },
          { text: 'La traçabilité des stupéfiants n\'est pas obligatoire en EHPAD', isCorrect: false },
          { text: 'Chaque administration doit être enregistrée dans le registre des stupéfiants', isCorrect: true }
        ]
      }
    ]);
    console.log('✅ Exercices de démonstration créés');
  }
  // Sample lessons + fiches
  const lessonCount = await Lesson.countDocuments();
  if (lessonCount === 0) {
    await Lesson.insertMany([
      {
        title: "L'hémostase — Mécanismes et régulation",
        summary: "Comprendre les trois phases de l'hémostase : primaire, coagulation et fibrinolyse.",
        content: `L'hémostase est l'ensemble des mécanismes physiologiques permettant d'arrêter un saignement et de maintenir l'intégrité vasculaire.

**1. Hémostase primaire**
Après une lésion vasculaire, la vasoconstriction réflexe réduit immédiatement le flux sanguin. Les plaquettes (thrombocytes) adhèrent au sous-endothélium exposé via le facteur von Willebrand (vWF). Elles s'activent, changent de forme et s'agrègent pour former le thrombus plaquettaire (clou de Moriez). Ce processus nécessite la thromboxane A2 et l'ADP.

Valeurs normales :
- Numération plaquettaire : 150 000 à 400 000/mm³
- Temps de saignement (TS) : 3 à 5 minutes

**2. Coagulation (hémostase secondaire)**
La coagulation transforme le thrombus plaquettaire en caillot de fibrine stable. Elle implique une cascade de réactions enzymatiques faisant intervenir des facteurs de coagulation numérotés de I à XIII.

Voie extrinsèque : Facteur tissulaire (FT) + Facteur VII → activation du Facteur X
Voie intrinsèque : Facteur XII, XI, IX, VIII → activation du Facteur X
Voie commune : Facteur X activé → Prothrombine → Thrombine → Fibrinogène → Fibrine

Temps de Quick (TQ) normal : 11-13 secondes (INR : 0,9-1,2)
TCA normal : 30-40 secondes

**3. Fibrinolyse**
La fibrinolyse est la dissolution physiologique du caillot une fois la cicatrisation accomplie. Le plasminogène est transformé en plasmine par l'activateur tissulaire du plasminogène (t-PA). La plasmine dégrade la fibrine en produits de dégradation (D-dimères).

**Points d'attention infirmiers**
- Surveiller les signes hémorragiques chez les patients sous anticoagulants
- Un TP < 50% ou un TCA > 2× la normale nécessite une évaluation médicale urgente
- Les D-dimères élevés signent une fibrinolyse active (thrombose, CIVD)`,
        category: 'UE 2.4',
        chapter: "Hémostase et coagulation",
        tags: ['hémostase', 'coagulation', 'plaquettes', 'fibrinolyse'],
        difficulty: 'medium',
        isPublished: true
      },
      {
        title: "Pharmacologie — Antibiotiques : classes et mécanismes",
        summary: "Les principales familles d'antibiotiques, leurs mécanismes d'action et les points de vigilance infirmiers.",
        content: `Les antibiotiques sont des substances capables d'inhiber la croissance bactérienne (bactériostatiques) ou de tuer les bactéries (bactéricides).

**Classification par mécanisme d'action**

1. Inhibiteurs de la synthèse de la paroi cellulaire
- Pénicillines (amoxicilline, ampicilline) : bêta-lactamines, bactéricides
- Céphalosporines (céfazoline, céfotaxime) : bêta-lactamines
- Vancomycine : glycopeptide, réservée aux infections sévères à SARM
→ Risque d'allergie croisée entre pénicillines et céphalosporines

2. Inhibiteurs de la synthèse protéique
- Macrolides (azithromycine, érythromycine) : bactériostatiques
- Aminosides (gentamicine, amikacine) : bactéricides, néphrotoxiques et ototoxiques
- Cyclines (doxycycline) : bactériostatiques, contre-indiqués chez l'enfant < 8 ans

3. Inhibiteurs de la réplication de l'ADN
- Fluoroquinolones (ciprofloxacine, lévofloxacine) : bactéricides à large spectre
- Métronidazole (Flagyl) : actif sur les anaérobies et les parasites

**Surveillance infirmière des antibiotiques**
- Respecter scrupuleusement les horaires d'administration (maintien du taux sérique)
- Surveiller les signes d'allergie (urticaire, angioedème, anaphylaxie)
- Aminosides : surveiller la créatinine, l'audition, dosage des pics et creux
- Vancomycine : adaptation posologique sur la clairance rénale, dosages sanguins
- Informer le patient de terminer le traitement même en cas d'amélioration clinique

**Résistance bactérienne**
La résistance aux antibiotiques est un enjeu majeur de santé publique. Les infirmiers jouent un rôle clé dans la prévention par :
- Le respect strict des mesures d'hygiène (SHA)
- L'application des protocoles de précautions complémentaires contact/gouttelettes
- La traçabilité des BHRE (bactéries hautement résistantes émergentes)`,
        category: 'UE 2.11',
        chapter: "Antibiotiques et antiviraux",
        tags: ['antibiotiques', 'pharmacologie', 'résistance', 'infection'],
        difficulty: 'hard',
        isPublished: true
      },
      {
        title: "Anatomie du système nerveux central",
        summary: "Organisation et fonctions du cerveau, du cervelet, du tronc cérébral et de la moelle épinière.",
        content: `Le système nerveux central (SNC) comprend l'encéphale et la moelle épinière. Il est protégé par les méninges (dure-mère, arachnoïde, pie-mère) et le liquide céphalo-rachidien (LCR).

**L'encéphale**

Cerveau (hémisphères cérébraux)
- Lobe frontal : fonctions motrices, langage (aire de Broca), personnalité
- Lobe pariétal : sensibilité somatique, intégration sensorielle
- Lobe temporal : audition, mémoire (hippocampe), langage (aire de Wernicke)
- Lobe occipital : vision

Diencéphale
- Thalamus : relais de toutes les informations sensorielles vers le cortex
- Hypothalamus : régulation neurovegetative (température, faim, soif, sommeil)

Cervelet : coordination des mouvements, équilibre, tonus musculaire

Tronc cérébral (mésencéphale, pont, bulbe rachidien)
- Contient les noyaux des nerfs crâniens (III à XII)
- Centre respiratoire et cardiovasculaire (bulbe)
- Conscience et éveil (formation réticulée)

**La moelle épinière**
Située dans le canal rachidien, de C1 à L2. Elle conduit les messages nerveux entre le cerveau et le reste du corps.
- Voies sensitives ascendantes : cordons postérieurs (tact épicritique), faisceau spinothalamique (douleur, température)
- Voies motrices descendantes : faisceau pyramidal (motricité volontaire)
- Arcs réflexes spinaux

**LCR — Points clés**
- Produit par les plexus choroïdes
- Volume : 150 mL
- Pression normale : 7-18 cmH₂O
- Normal : clair comme de l'eau de roche, < 5 cellules/mm³

**Surveillance neurologique infirmière**
Échelle de Glasgow : Ouverture des yeux (E1-4) + Réponse verbale (V1-5) + Réponse motrice (M1-6)
→ Score maximal : 15 (conscient) / Score < 8 : coma
Signes d'hypertension intracrânienne (HTIC) : céphalées, vomissements en jet, bradycardie + HTA + bradypnée (triade de Cushing)`,
        category: 'UE 2.2',
        chapter: "Système nerveux",
        tags: ['neurologie', 'anatomie', 'SNC', 'Glasgow', 'HTIC'],
        difficulty: 'hard',
        isPublished: true
      },
      // ── FICHES ──
      {
        type: 'fiche',
        title: "Fiche — Hémostase : l'essentiel",
        summary: "Les points clés à retenir sur l'hémostase pour les examens IFSI.",
        content: `**Définition**
Ensemble des mécanismes physiologiques qui arrêtent un saignement.

**3 étapes à connaître**
1. Hémostase primaire → Vasoconstriction + Clou plaquettaire
2. Coagulation → Cascade enzymatique → Thrombus de fibrine
3. Fibrinolyse → Dissolution du caillot (plasmine)

**Valeurs normales**
- Plaquettes : 150 000 – 400 000 /mm³
- Temps de saignement (TS) : 3 – 5 min
- Temps de Quick (TQ) : 11 – 13 s  |  INR : 0,9 – 1,2
- TCA : 30 – 40 s

**À retenir absolument**
Le caillot = Plaquettes + Fibrine. La fibrinolyse = dissolution naturelle et physiologique.

**Vigilance infirmière**
- Surveiller saignements sous anticoagulants
- TP < 50% ou TCA > 2× normale = évaluation urgente`,
        category: 'UE 2.4',
        chapter: "Hémostase et coagulation",
        tags: ['hémostase', 'coagulation', 'fiche'],
        difficulty: 'medium'
      },
      {
        type: 'fiche',
        title: "Fiche — Score de Glasgow",
        summary: "Mémoriser et appliquer le score de Glasgow en soins infirmiers.",
        content: `**Définition**
Échelle d'évaluation de la conscience. Score de 3 (coma profond) à 15 (conscient).

**Les 3 composantes (E + V + M)**

Ouverture des Yeux (E) :
4 – Spontanée | 3 – Au bruit | 2 – À la douleur | 1 – Aucune

Réponse Verbale (V) :
5 – Orientée | 4 – Confuse | 3 – Mots | 2 – Sons | 1 – Aucune

Réponse Motrice (M) :
6 – Sur ordre | 5 – Orientée | 4 – Fuite | 3 – Flexion | 2 – Extension | 1 – Aucune

**Seuils critiques**
- Score < 8 → Coma → Risque de fausse route → Intubation possible
- Score ≤ 13 → Traumatisme crânien grave

**Mnémotechnique**
"YVM" — Yeux, Voix, Mouvement. Maximum = 4+5+6 = 15`,
        category: 'UE 2.2',
        chapter: "Système nerveux",
        tags: ['Glasgow', 'neurologie', 'conscience', 'fiche'],
        difficulty: 'easy'
      },
      {
        type: 'fiche',
        title: "Fiche — Les 5 droits du médicament",
        summary: "La règle des 5 droits à appliquer systématiquement avant toute administration.",
        content: `**La règle des 5 droits (ou 5 B)**

1. Bon MÉDICAMENT → Vérifier le nom, la DCI, l'ordonnance
2. Bonne DOSE → Calculer, vérifier les unités, jamais de tête
3. Bon PATIENT → Vérifier l'identité (bracelet + demande verbale)
4. Bonne VOIE → PO / IV / IM / SC / Topique — selon prescription
5. Bon MOMENT → Respecter les horaires (taux sérique)

**+ 2 droits complémentaires (règle des 7 B)**
6. Bonne TRAÇABILITÉ → Signature immédiate après administration
7. Bon DROIT du patient → Droit de refus, information

**Les erreurs médicamenteuses les plus fréquentes**
- Confusion de médicaments (noms proches : Acupan ≠ Atarax)
- Erreur de dose (calcul, conversion mg/mL)
- Mauvaise voie (IV au lieu d'IM)
- Omission de traçabilité

**Règle d'or**
En cas de doute → On NE donne PAS et on demande au médecin.`,
        category: 'UE 2.11',
        chapter: "Administration des médicaments",
        tags: ['médicament', 'sécurité', 'administration', 'fiche'],
        difficulty: 'easy'
      }
    ]);
    console.log('✅ Cours de démonstration créés');
  }
}

module.exports = seed;
