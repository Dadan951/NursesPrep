/**
 * Seed — Exercices Semestre 1 · UE 1.1
 * Sociologie, anthropologie et psychologie
 * 3 exercices : Cas clinique · QCM · Question ouverte
 */

module.exports = [

  /* ══════════════════════════════════════════════════════════
   *  1. CAS CLINIQUE
   * ══════════════════════════════════════════════════════════ */
  {
    title: "Représentations culturelles de la maladie — Mme B.",
    type: "case_study",
    difficulty: "hard",
    semester: "Semestre 1",
    caseType: "UE 1.1 — Sociologie, anthropologie et psychologie",
    category: "Cas clinique",
    isPublished: true,
    content: `Mme Fatima B., 45 ans, d'origine marocaine, est hospitalisée en service de médecine interne pour un diabète de type 2 décompensé (glycémie à 3,2 g/L). Lors de l'entretien de soins, l'infirmière observe les éléments suivants :

— La patiente refuse certains médicaments en invoquant des raisons religieuses (le Ramadan approche) et préfère utiliser des remèdes à base de plantes transmis par sa mère.
— Elle minimise la gravité de sa maladie : "C'est la volonté de Dieu, il me donnera la force."
— Son mari, présent dans la chambre, répond systématiquement à sa place lors des questions posées par l'équipe soignante.
— Mme B. vit dans un logement social avec cinq enfants. Elle travaille dans un atelier textile comme couturière non déclarée.

1. Identifiez les représentations sociales et culturelles de la maladie présentes dans cette situation. Illustrez votre réponse avec des concepts de sociologie et d'anthropologie médicale.
2. Quels déterminants sociaux de la santé (selon le modèle de Dahlgren et Whitehead) pouvez-vous identifier dans cette situation ?
3. En tant qu'infirmier(ère), comment adaptez-vous votre communication et votre prise en charge à cette situation interculturelle, dans le respect des droits de la patiente ?`,

    answer: `1. REPRÉSENTATIONS SOCIALES ET CULTURELLES
— Représentation religieuse de la maladie : Mme B. attribue sa maladie à la volonté divine (ethos fataliste), ce qui peut limiter l'adhésion au traitement médical (concept de "maladie-punition" ou "maladie-épreuve").
— Recours à la médecine traditionnelle (remèdes de plantes) : coexistence de systèmes de soins parallèles = pluralisme médical (A. Kleinman). Risque d'interactions médicamenteuses.
— Représentation de la douleur et de la gravité : banalisation liée à la norme culturelle ("être fort").
— Dynamique de genre : le mari parle à la place de la patiente → inégalités de genre, rôle socialement construit de la femme dans l'espace médical.

2. DÉTERMINANTS SOCIAUX DE LA SANTÉ (Dahlgren & Whitehead)
— Déterminants individuels : représentations culturelles, croyances religieuses, comportements alimentaires liés à la culture.
— Réseau social et communautaire : soutien familial mais aussi contrôle du mari.
— Conditions de vie et de travail : travail non déclaré, exposition professionnelle (position assise prolongée), revenus précaires.
— Conditions socio-économiques : logement social, famille nombreuse, accès limité aux ressources.

3. ADAPTATION DE LA COMMUNICATION SOIGNANTE
— Utiliser la communication thérapeutique : écoute active, reformulation, questions ouvertes, sans jugement ni imposition de valeurs.
— Aborder la dimension culturelle et religieuse avec respect : proposer un entretien en l'absence du mari pour favoriser l'expression libre de la patiente (respect de l'autonomie, art. L1111-4 CSP).
— Faire appel à un médiateur interculturel ou à un interprète professionnel si besoin.
— Négocier le traitement en tenant compte des contraintes du Ramadan (ex : adaptation des horaires de prise médicamenteuse avec l'équipe médicale).
— Informer sans imposer : respecter les choix de la patiente tout en s'assurant de sa compréhension des risques (éducation thérapeutique).`,
  },

  /* ══════════════════════════════════════════════════════════
   *  2. QCM
   * ══════════════════════════════════════════════════════════ */
  {
    title: "Normes sociales, déviance et déterminants de la santé",
    type: "qcm",
    difficulty: "medium",
    semester: "Semestre 1",
    caseType: "UE 1.1 — Sociologie, anthropologie et psychologie",
    category: "QCM",
    isPublished: true,
    content: `Concernant les concepts fondamentaux de sociologie et d'anthropologie appliqués au soin infirmier, quelle(s) affirmation(s) est/sont exacte(s) ?`,
    options: [
      {
        text: "Selon Émile Durkheim, la norme sociale est une règle partagée par une société définissant les comportements attendus. Sa transgression constitue la déviance.",
        isCorrect: true,
      },
      {
        text: "L'habitus, concept de Pierre Bourdieu, désigne un ensemble de dispositions durables intériorisées par l'individu au cours de sa socialisation, influençant ses pratiques de santé.",
        isCorrect: true,
      },
      {
        text: "Les représentations sociales de la maladie n'ont aucune influence sur l'adhésion thérapeutique du patient, car le traitement médical repose uniquement sur des données scientifiques.",
        isCorrect: false,
      },
      {
        text: "Le modèle de Dahlgren et Whitehead distingue plusieurs niveaux de déterminants de la santé : individuels, sociaux et communautaires, structurels et économiques.",
        isCorrect: true,
      },
    ],
    answer: `AFFIRMATIONS EXACTES : A, B et D

A. VRAIE — Durkheim définit la norme comme une règle collective implicite ou explicite. La déviance est le comportement qui transgresse cette norme ; elle est relative à la société et à l'époque.

B. VRAIE — L'habitus (Bourdieu) est l'ensemble des schèmes de perception, de pensée et d'action acquis lors de la socialisation primaire et secondaire. Il influence directement les comportements de santé (alimentation, recours aux soins, rapport au corps).

C. FAUSSE — Les représentations sociales influencent fortement l'adhésion thérapeutique. Un patient qui perçoit sa maladie comme une "faiblesse" ou une "punition divine" peut refuser ou retarder les soins. La compréhension de ces représentations est essentielle à l'éducation thérapeutique.

D. VRAIE — Le modèle arc-en-ciel de Dahlgren et Whitehead (1991) identifie 5 niveaux de déterminants : facteurs biologiques individuels → comportements de santé → réseau social → conditions de vie/travail → facteurs socio-économiques/culturels/environnementaux.`,
  },

  /* ══════════════════════════════════════════════════════════
   *  3. QUESTION OUVERTE
   * ══════════════════════════════════════════════════════════ */
  {
    title: "Anthropologie médicale et représentations culturelles de la maladie",
    type: "open",
    difficulty: "medium",
    semester: "Semestre 1",
    caseType: "UE 1.1 — Sociologie, anthropologie et psychologie",
    category: "Question ouverte",
    isPublished: true,
    content: `En vous appuyant sur les concepts de l'anthropologie médicale (notamment les travaux d'Arthur Kleinman sur les systèmes explicatifs de la maladie), expliquez comment les représentations culturelles d'un patient peuvent influencer son parcours de soins.

Votre réponse devra :
1. Définir la notion de représentation sociale de la maladie et distinguer "disease", "illness" et "sickness".
2. Illustrer par un exemple concret tiré du contexte infirmier comment ces représentations peuvent créer une distance entre soignant et soigné.
3. Proposer des stratégies de communication adaptées permettant de réduire cette distance culturelle tout en respectant l'autonomie du patient.`,

    answer: `1. REPRÉSENTATIONS SOCIALES DE LA MALADIE ET DISTINCTIONS CONCEPTUELLES

La représentation sociale de la maladie est la façon dont un individu ou un groupe perçoit, explique et donne du sens à la maladie, en fonction de son contexte culturel, social et psychologique.

Arthur Kleinman (1978) distingue trois dimensions :
— Disease (maladie biomédicale) : altération biologique, objective, mesurable → ce que le médecin diagnostique.
— Illness (maladie vécue) : expérience subjective du malade, son ressenti, ses souffrances, ses peurs.
— Sickness (maladie sociale) : rôle social du malade, reconnaissance collective de la maladie, conséquences sociales.

Le soignant se situe principalement dans la "disease" tandis que le patient vit sa "illness". Ce décalage peut être source d'incompréhension et de rupture thérapeutique.

2. EXEMPLE CONCRET EN CONTEXTE INFIRMIER

M. Kofi, 60 ans, originaire du Ghana, est hospitalisé pour hypertension artérielle. Il refuse les médicaments car il pense que sa maladie est causée par un mauvais sort jeté par un voisin. Pour lui, le traitement médical ne peut pas guérir une cause spirituelle.

Distance soignant-soigné :
— Le soignant perçoit une "maladie biologique" (disease) nécessitant un traitement antihypertenseur.
— Le patient vit une "maladie spirituelle" (illness) qui nécessite un traitement par un guérisseur.
— Socialement, la maladie a une signification symbolique dans sa communauté (sickness).

Sans reconnaissance de cet écart, le patient sera non-adhérent et l'infirmière se retrouvera dans l'incompréhension.

3. STRATÉGIES DE COMMUNICATION ADAPTÉES

— Utiliser le modèle LEARN (Listen, Explain, Acknowledge, Recommend, Negotiate) pour construire un dialogue interculturel.
— Écouter sans juger les représentations du patient : "Comment expliquez-vous votre maladie ?"
— Reconnaître la légitimité de ses croyances sans les valider médicalement : "Je comprends que c'est important pour vous."
— Co-construire une prise en charge acceptable : expliquer que le traitement médicamenteux peut coexister avec ses pratiques culturelles, à condition qu'elles ne soient pas dangereuses.
— Faire appel à un médiateur de santé interculturel si disponible.
— Documenter les représentations du patient dans le dossier de soins pour assurer la continuité.

L'objectif n'est pas de convaincre le patient d'abandonner ses croyances, mais de trouver un accord thérapeutique respectueux de son autonomie (art. L1111-4 du CSP).`,
  },
];
