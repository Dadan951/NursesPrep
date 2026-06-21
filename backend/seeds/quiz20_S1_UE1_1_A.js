module.exports = [
  {
    title: "Introduction à la psychologie",
    description: "Définitions fondamentales, grandes méthodes de recherche et principaux courants théoriques de la psychologie.",
    semester: "Semestre 1",
    category: "UE 1.1 - Psychologie, sociologie, anthropologie",
    chapter: "Introduction à la psychologie — définitions, méthodes et courants théoriques",
    difficulty: "débutant",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle définition correspond le mieux à la psychologie scientifique moderne ?",
        options: [
          { text: "L'étude des comportements observables et des processus mentaux à l'aide de méthodes rigoureuses et reproductibles", isCorrect: true },
          { text: "L'analyse exclusive des troubles mentaux graves diagnostiqués en milieu psychiatrique hospitalier", isCorrect: false },
          { text: "La description philosophique de l'âme humaine fondée sur la tradition métaphysique occidentale classique", isCorrect: false },
          { text: "L'explication des conduites humaines uniquement à partir des variables biologiques et génétiques mesurables", isCorrect: false }
        ],
        explanation: "La psychologie scientifique étudie à la fois les comportements observables et les processus mentaux (perception, mémoire, émotion) en utilisant des méthodes empiriques rigoureuses, sans se limiter à la pathologie ni à la biologie."
      },
      {
        text: "Quelle méthode de recherche consiste à manipuler une variable indépendante pour mesurer son effet sur une variable dépendante ?",
        options: [
          { text: "La méthode expérimentale en laboratoire avec groupe contrôle et groupe expérimental", isCorrect: true },
          { text: "L'observation clinique naturaliste réalisée sur le terrain sans intervention du chercheur", isCorrect: false },
          { text: "L'entretien semi-directif approfondi conduit individuellement avec chaque participant", isCorrect: false },
          { text: "L'enquête par questionnaire administrée à grande échelle sur un échantillon représentatif", isCorrect: false }
        ],
        explanation: "La méthode expérimentale implique la manipulation d'une variable indépendante et la mesure de son effet sur une variable dépendante, avec un groupe contrôle pour isoler la causalité."
      },
      {
        text: "Quel courant théorique affirme que seuls les comportements observables et mesurables doivent constituer l'objet d'étude de la psychologie ?",
        options: [
          { text: "Le béhaviorisme, dont les représentants majeurs sont Watson et Skinner", isCorrect: true },
          { text: "La psychanalyse, fondée par Sigmund Freud à la fin du XIXe siècle à Vienne", isCorrect: false },
          { text: "La psychologie humaniste, défendue notamment par Abraham Maslow et Carl Rogers", isCorrect: false },
          { text: "La psychologie cognitive, développée dans les années 1950-1960 en rupture avec le béhaviorisme", isCorrect: false }
        ],
        explanation: "Le béhaviorisme (Watson, Skinner) rejette l'étude des processus mentaux non observables et ne retient que les comportements mesurables, analysés selon le schéma stimulus-réponse."
      },
      {
        text: "La psychologie humaniste de Maslow et Rogers se distingue des autres courants par son insistance sur :",
        options: [
          { text: "Le potentiel de croissance de la personne, sa liberté et sa quête de sens et d'accomplissement", isCorrect: true },
          { text: "L'importance des réflexes conditionnés acquis par renforcement positif ou négatif répété", isCorrect: false },
          { text: "Le rôle déterminant des conflits inconscients issus de la petite enfance sur la personnalité", isCorrect: false },
          { text: "La modélisation computationnelle des processus cognitifs tels que la mémoire et l'attention", isCorrect: false }
        ],
        explanation: "La psychologie humaniste met l'accent sur la liberté, la responsabilité, le potentiel de croissance et la recherche de sens propres à chaque être humain, en réaction au déterminisme béhavioriste et psychanalytique."
      },
      {
        text: "L'observation clinique se distingue de l'observation naturaliste principalement parce qu'elle :",
        options: [
          { text: "Se déroule dans un contexte thérapeutique et vise à comprendre la singularité d'un individu ou d'un cas", isCorrect: true },
          { text: "Repose sur des hypothèses formulées à l'avance et testées de façon strictement contrôlée en laboratoire", isCorrect: false },
          { text: "Utilise uniquement des instruments standardisés validés sur de larges populations représentatives", isCorrect: false },
          { text: "Exclut tout contact verbal entre l'observateur et la personne observée pendant toute la durée du recueil", isCorrect: false }
        ],
        explanation: "L'observation clinique s'inscrit dans une relation de soin et cherche à saisir la singularité d'un sujet, contrairement à l'observation naturaliste qui vise la généralisation et l'absence d'intervention."
      },
      {
        text: "Quelle affirmation caractérise correctement la psychologie cognitive ?",
        options: [
          { text: "Elle étudie les processus mentaux internes comme la mémoire, l'attention et le raisonnement à l'aide de modèles représentatifs", isCorrect: true },
          { text: "Elle s'intéresse exclusivement aux émotions et aux relations interpersonnelles dans les groupes sociaux restreints", isCorrect: false },
          { text: "Elle fonde son analyse sur l'exploration des conflits inconscients et des mécanismes de défense du moi", isCorrect: false },
          { text: "Elle privilégie l'étude des comportements moteurs et des réponses réflexes mesurables en laboratoire", isCorrect: false }
        ],
        explanation: "La psychologie cognitive étudie les processus mentaux internes (perception, mémoire, attention, langage, raisonnement) en les modélisant, souvent par analogie avec le traitement de l'information."
      },
      {
        text: "Dans la recherche en psychologie, le terme « validité externe » d'une étude désigne :",
        options: [
          { text: "La capacité à généraliser les résultats obtenus à d'autres populations, contextes ou situations réelles", isCorrect: true },
          { text: "La précision avec laquelle les instruments mesurent effectivement la variable qu'ils sont censés évaluer", isCorrect: false },
          { text: "La cohérence interne des résultats obtenus lors de la réplication de l'étude dans les mêmes conditions", isCorrect: false },
          { text: "L'accord entre les évaluations de plusieurs observateurs indépendants sur un même comportement cible", isCorrect: false }
        ],
        explanation: "La validité externe concerne la généralisabilité des résultats : peut-on appliquer les conclusions d'une étude à d'autres personnes, lieux ou moments que ceux de l'expérience originale ?"
      },
      {
        text: "Quelle est la principale limite de l'introspection comme méthode de connaissance psychologique ?",
        options: [
          { text: "Les rapports subjectifs produits sont difficilement vérifiables et peuvent être biaisés par la réflexion même", isCorrect: true },
          { text: "Elle ne peut être utilisée qu'avec des sujets présentant des troubles cognitifs sévères documentés", isCorrect: false },
          { text: "Elle impose de recourir à des appareils de mesure coûteux et à une formation technique spécialisée", isCorrect: false },
          { text: "Elle est réservée aux études longitudinales et ne convient pas aux protocoles transversaux courts", isCorrect: false }
        ],
        explanation: "L'introspection repose sur l'auto-observation de ses propres états mentaux, mais les rapports produits sont subjectifs, difficiles à vérifier par un tiers et potentiellement faussés par l'acte même d'observer."
      }
    ]
  },
  {
    title: "Mécanismes de défense",
    description: "Types, rôles adaptatifs et pathologiques des mécanismes de défense, et leur repérage en contexte clinique infirmier.",
    semester: "Semestre 1",
    category: "UE 1.1 - Psychologie, sociologie, anthropologie",
    chapter: "Mécanismes de défense — types, rôles et repérage clinique",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Selon la théorie psychanalytique, quelle est la fonction principale des mécanismes de défense ?",
        options: [
          { text: "Protéger le moi contre l'angoisse générée par des conflits entre les instances psychiques ou la réalité", isCorrect: true },
          { text: "Favoriser l'expression consciente et verbale des émotions douloureuses vécues dans le passé récent", isCorrect: false },
          { text: "Renforcer la capacité du sujet à résoudre rationnellement les problèmes de la vie quotidienne", isCorrect: false },
          { text: "Permettre l'intégration progressive des traumatismes grâce à un travail de mémoire intentionnel", isCorrect: false }
        ],
        explanation: "Les mécanismes de défense opèrent de façon inconsciente pour protéger le moi de l'angoisse liée aux conflits entre le ça, le surmoi et les exigences de la réalité externe."
      },
      {
        text: "Un patient apprend qu'il est atteint d'une maladie grave et déclare : « Non, les résultats doivent être faux, je me sens très bien. » Quel mécanisme illustre cette réaction ?",
        options: [
          { text: "Le déni, qui consiste à refuser psychiquement une réalité externe menaçante ou insupportable", isCorrect: true },
          { text: "La régression, qui correspond au retour à des modes de fonctionnement propres à un stade antérieur", isCorrect: false },
          { text: "La projection, qui attribue à autrui des pensées ou des sentiments inacceptables pour le sujet", isCorrect: false },
          { text: "La rationalisation, qui consiste à justifier un comportement par des arguments logiques apparents", isCorrect: false }
        ],
        explanation: "Le déni est un refus d'accepter une réalité externe perçue comme insupportable. Le patient nie la validité du diagnostic pour se protéger de l'angoisse générée par l'annonce."
      },
      {
        text: "La sublimation est considérée comme un mécanisme de défense dit « mature » car elle :",
        options: [
          { text: "Redirige des pulsions socialement inacceptables vers des activités valorisées culturellement ou socialement", isCorrect: true },
          { text: "Supprime complètement les pulsions instinctuelles en les remplaçant par leur contraire observable", isCorrect: false },
          { text: "Permet au sujet de prendre conscience de ses conflits internes grâce à un travail thérapeutique guidé", isCorrect: false },
          { text: "Élimine définitivement la tension psychique par un processus de décharge émotionnelle directe et immédiate", isCorrect: false }
        ],
        explanation: "La sublimation détourne l'énergie pulsionnelle vers des buts socialement valorisés (art, sport, travail intellectuel) sans refoulement, ce qui en fait un mécanisme adaptatif et considéré comme mature."
      },
      {
        text: "Quel mécanisme de défense est à l'œuvre lorsqu'un infirmier en colère contre un médecin se montre agressif envers ses collègues ou les patients ?",
        options: [
          { text: "Le déplacement, qui transfère une émotion de son objet d'origine vers un objet substitut moins menaçant", isCorrect: true },
          { text: "L'isolation, qui sépare une représentation pénible de l'affect qui lui est normalement associé", isCorrect: false },
          { text: "La formation réactionnelle, qui transforme une impulsion inacceptable en son opposé comportemental", isCorrect: false },
          { text: "L'introjection, qui consiste à incorporer psychiquement les qualités ou valeurs d'une personne externe", isCorrect: false }
        ],
        explanation: "Le déplacement consiste à transférer une émotion (ici la colère) de sa cible originale (le médecin) vers un autre objet perçu comme moins menaçant (collègues, patients)."
      },
      {
        text: "L'intellectualisation comme mécanisme de défense se manifeste cliniquement par :",
        options: [
          { text: "Un discours très élaboré, froid et abstrait sur sa maladie, sans expression émotionnelle apparente", isCorrect: true },
          { text: "Un retour soudain à des comportements enfantins comme pleurer ou réclamer une présence constante", isCorrect: false },
          { text: "Une attribution à d'autres personnes de ses propres ressentis négatifs ou de ses propres craintes", isCorrect: false },
          { text: "Un refus catégorique de parler de sa situation, accompagné d'un mutisme et d'un repli sur soi", isCorrect: false }
        ],
        explanation: "L'intellectualisation consiste à mettre à distance les émotions en adoptant un registre très abstrait et conceptuel. Le patient parle de sa maladie « techniquement » sans laisser paraître de ressenti."
      },
      {
        text: "En quoi la régression diffère-t-elle de la fixation dans le vocabulaire psychanalytique ?",
        options: [
          { text: "La régression est un retour à un stade antérieur sous l'effet du stress, la fixation est un blocage permanent à ce stade", isCorrect: true },
          { text: "La régression concerne uniquement les adultes hospitalisés, la fixation ne concerne que les enfants en bas âge", isCorrect: false },
          { text: "La régression est un mécanisme conscient et volontaire, la fixation est toujours inconsciente et involontaire", isCorrect: false },
          { text: "La régression renforce l'autonomie du sujet, tandis que la fixation produit toujours une dépendance pathologique", isCorrect: false }
        ],
        explanation: "La fixation est l'arrêt du développement à un stade donné, tandis que la régression est un retour temporaire à un mode de fonctionnement antérieur, souvent déclenché par une situation angoissante."
      },
      {
        text: "Pourquoi le repérage des mécanismes de défense est-il important pour la pratique infirmière ?",
        options: [
          { text: "Il permet d'adapter la communication soignante en respectant les besoins de protection psychique du patient", isCorrect: true },
          { text: "Il donne à l'infirmier la compétence légale pour poser un diagnostic psychiatrique différentiel précis", isCorrect: false },
          { text: "Il fournit une technique pour faire disparaître rapidement les défenses afin d'accéder aux émotions vraies", isCorrect: false },
          { text: "Il remplace le bilan psychologique réalisé par le psychologue clinicien dans les services de soins courants", isCorrect: false }
        ],
        explanation: "Identifier les mécanismes de défense permet à l'infirmier de comprendre la dynamique psychique du patient et d'adapter sa communication, sans chercher à lever brutalement ces protections nécessaires."
      },
      {
        text: "La formation réactionnelle se caractérise par :",
        options: [
          { text: "L'adoption d'attitudes ou de comportements diamétralement opposés à l'impulsion inconsciente refoulée", isCorrect: true },
          { text: "La mise en scène théâtrale de symptômes physiques pour attirer l'attention de l'entourage soignant", isCorrect: false },
          { text: "L'attribution systématique de ses propres défauts et pulsions inacceptables à d'autres personnes", isCorrect: false },
          { text: "Le retour à des comportements régressifs infantiles lors de situations perçues comme très angoissantes", isCorrect: false }
        ],
        explanation: "La formation réactionnelle transforme une impulsion inacceptable (ex. : hostilité) en son contraire manifeste (ex. : gentillesse exagérée), permettant au moi de nier l'existence de cette impulsion."
      }
    ]
  },
  {
    title: "Psychanalyse de Freud",
    description: "L'inconscient, les pulsions, la structure psychique et les grandes théories freudiennes fondamentales.",
    semester: "Semestre 1",
    category: "UE 1.1 - Psychologie, sociologie, anthropologie",
    chapter: "Psychanalyse de Freud — inconscient, pulsions et structure psychique",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Dans la première topique freudienne, quelles sont les trois instances qui composent l'appareil psychique ?",
        options: [
          { text: "Le conscient, le préconscient et l'inconscient, représentés métaphoriquement par un iceberg", isCorrect: true },
          { text: "Le ça, le moi et le surmoi, élaborés par Freud dans les années 1920 comme seconde topique", isCorrect: false },
          { text: "Le refoulé, le censuré et le symbolique, issus de la relecture lacanienne de la théorie freudienne", isCorrect: false },
          { text: "L'instinct, la pulsion et le désir, trois concepts centraux du vocabulaire psychanalytique classique", isCorrect: false }
        ],
        explanation: "La première topique (1900) distingue trois systèmes : inconscient (Ics), préconscient (Pcs) et conscient (Cs). La seconde topique (ça, moi, surmoi) est élaborée ultérieurement en 1923."
      },
      {
        text: "Quelle est la différence fondamentale entre une pulsion et un instinct selon la conception freudienne ?",
        options: [
          { text: "La pulsion est une poussée psychique d'origine somatique sans objet fixe, l'instinct est un comportement biologique inné et prédéterminé", isCorrect: true },
          { text: "La pulsion est consciente et maîtrisable par la volonté, l'instinct reste toujours entièrement inconscient et inaccessible", isCorrect: false },
          { text: "La pulsion caractérise uniquement la vie affective adulte, l'instinct s'applique exclusivement au développement infantile", isCorrect: false },
          { text: "La pulsion est liée à la culture et à l'apprentissage social, l'instinct dépend exclusivement des hormones et neurotransmetteurs", isCorrect: false }
        ],
        explanation: "La pulsion (Trieb) est une excitation d'origine corporelle qui pousse le psychisme à agir, sans objet ni but fixé d'avance, contrairement à l'instinct animal, comportement inné rigide et prédéterminé."
      },
      {
        text: "Dans la seconde topique freudienne, le surmoi est décrit comme :",
        options: [
          { text: "L'instance psychique héritière du complexe d'Œdipe, représentant les interdits et l'idéal moral intériorisés", isCorrect: true },
          { text: "Le réservoir des pulsions primitives cherchant à se satisfaire selon le principe de plaisir immédiat", isCorrect: false },
          { text: "La partie de l'appareil psychique en contact avec la réalité externe, régie par le principe de réalité", isCorrect: false },
          { text: "La couche superficielle du conscient qui filtre les informations venant du monde extérieur et intérieur", isCorrect: false }
        ],
        explanation: "Le surmoi est formé lors de la résolution du complexe d'Œdipe par intériorisation des interdits parentaux et culturels. Il joue le rôle de juge interne et source de culpabilité."
      },
      {
        text: "Le refoulement occupe une place centrale dans la théorie freudienne car il :",
        options: [
          { text: "Est le mécanisme de défense fondateur qui maintient hors de la conscience les représentations inacceptables", isCorrect: true },
          { text: "Permet l'intégration consciente des expériences traumatiques grâce à un processus actif de mémorisation", isCorrect: false },
          { text: "Représente la capacité du moi à tolérer l'ambivalence affective sans recourir à un évitement défensif", isCorrect: false },
          { text: "Constitue le mécanisme par lequel les pulsions sont définitivement éliminées de l'appareil psychique", isCorrect: false }
        ],
        explanation: "Le refoulement est le mécanisme de défense primaire pour Freud : il maintient actives dans l'inconscient des représentations insupportables, qui cherchent constamment à revenir dans la conscience."
      },
      {
        text: "Freud distingue deux types de pulsions dans sa théorie dualiste des pulsions (1920). Il s'agit de :",
        options: [
          { text: "Éros (pulsions de vie, liant et créateur) et Thanatos (pulsions de mort, déliant et destructeur)", isCorrect: true },
          { text: "Les pulsions sexuelles (libido) et les pulsions alimentaires (besoin de nourriture et de survie physique)", isCorrect: false },
          { text: "Les pulsions conscientes (maîtrisables par la raison) et les pulsions inconscientes (refoulées par le moi)", isCorrect: false },
          { text: "Les pulsions d'attachement (lien à autrui) et les pulsions d'autonomie (séparation et individuation)", isCorrect: false }
        ],
        explanation: "Dans « Au-delà du principe de plaisir » (1920), Freud élabore le dualisme Éros/Thanatos : les pulsions de vie unissent et maintiennent la cohésion, les pulsions de mort tendent à la désorganisation et à la destruction."
      },
      {
        text: "Le « retour du refoulé » se manifeste cliniquement à travers :",
        options: [
          { text: "Les rêves, les lapsus, les actes manqués et les symptômes névrotiques comme formations de compromis", isCorrect: true },
          { text: "Les comportements altruistes et les actes créateurs qui subliment les pulsions agressives refoulées", isCorrect: false },
          { text: "Les épisodes de régression développementale observés lors de maladies somatiques graves et prolongées", isCorrect: false },
          { text: "Les réactions émotionnelles intenses et conscientes provoquées par des situations de stress aigu", isCorrect: false }
        ],
        explanation: "Le refoulé cherche sans cesse à revenir à la conscience. Il se manifeste de façon déguisée dans les rêves, lapsus, actes manqués et symptômes, que Freud appelle « formations de compromis »."
      },
      {
        text: "La notion freudienne de « transfert » en situation de soin désigne :",
        options: [
          { text: "Le déplacement sur le soignant de sentiments et d'attentes issus de relations affectives passées importantes", isCorrect: true },
          { text: "La transmission des connaissances médicales du médecin vers le patient lors d'une consultation d'annonce", isCorrect: false },
          { text: "Le passage d'un service hospitalier à un autre lors d'une mutation du patient vers des soins spécialisés", isCorrect: false },
          { text: "La capacité du patient à accepter une information médicale difficile grâce à un accompagnement structuré", isCorrect: false }
        ],
        explanation: "En psychanalyse, le transfert est le processus par lequel le patient reporte sur le thérapeute (ou le soignant) des émotions, désirs et conflits vécus initialement avec des personnes significatives de son histoire."
      },
      {
        text: "Quelle est la principale critique adressée à la psychanalyse freudienne du point de vue de la psychologie scientifique ?",
        options: [
          { text: "Ses concepts centraux (inconscient, refoulement) sont difficilement réfutables et peu accessibles à la vérification empirique", isCorrect: true },
          { text: "Elle n'accorde aucune place au développement de l'enfant ni aux relations précoces avec les figures parentales", isCorrect: false },
          { text: "Elle repose uniquement sur des données biologiques et neurologiques mesurées en laboratoire de neurosciences", isCorrect: false },
          { text: "Elle ignore totalement la dimension culturelle et sociale dans la construction de l'identité du sujet humain", isCorrect: false }
        ],
        explanation: "La principale critique épistémologique adressée à la psychanalyse est son manque de réfutabilité (Popper) : les concepts comme l'inconscient ou le refoulement ne peuvent pas être testés et falsifiés de manière expérimentale."
      }
    ]
  },
  {
    title: "Piaget — stades du développement cognitif",
    description: "Les quatre stades du développement cognitif selon Jean Piaget, de la naissance à l'adolescence.",
    semester: "Semestre 1",
    category: "UE 1.1 - Psychologie, sociologie, anthropologie",
    chapter: "Piaget — stades du développement cognitif de 0 à l'adolescence",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Selon Piaget, dans quel ordre se succèdent les quatre stades du développement cognitif ?",
        options: [
          { text: "Sensori-moteur, préopératoire, opératoire concret, opératoire formel", isCorrect: true },
          { text: "Préopératoire, sensori-moteur, opératoire formel, opératoire concret", isCorrect: false },
          { text: "Oral, anal, phallique, de latence, génital selon la progression libidinale", isCorrect: false },
          { text: "Confiance, autonomie, initiative, travail, identité selon la théorie psychosociale", isCorrect: false }
        ],
        explanation: "Piaget décrit quatre stades invariants et universels : sensori-moteur (0-2 ans), préopératoire (2-7 ans), opératoire concret (7-11 ans) et opératoire formel (à partir de 11-12 ans)."
      },
      {
        text: "L'acquisition de la « permanence de l'objet » est une conquête majeure du stade :",
        options: [
          { text: "Sensori-moteur, entre 8 et 12 mois environ, lorsque l'enfant comprend qu'un objet caché existe toujours", isCorrect: true },
          { text: "Préopératoire, vers 3-4 ans, quand l'enfant devient capable d'utiliser le langage et les symboles", isCorrect: false },
          { text: "Opératoire concret, vers 7-8 ans, avec l'apparition des opérations logiques sur des objets présents", isCorrect: false },
          { text: "Opératoire formel, vers 12 ans, avec l'accès à la pensée abstraite et au raisonnement hypothético-déductif", isCorrect: false }
        ],
        explanation: "La permanence de l'objet est acquise durant le stade sensori-moteur : l'enfant comprend progressivement qu'un objet soustrait à sa vue continue d'exister, ce qui marque une étape fondamentale du développement cognitif."
      },
      {
        text: "L'égocentrisme du stade préopératoire (2-7 ans) signifie que l'enfant :",
        options: [
          { text: "N'est pas encore capable de se décentrer et considère que tous les autres partagent son propre point de vue", isCorrect: true },
          { text: "Présente un trouble narcissique caractérisé par un manque d'empathie pathologique précoce et durable", isCorrect: false },
          { text: "Refuse catégoriquement de partager ses jouets et ses affaires avec les autres enfants du même âge", isCorrect: false },
          { text: "Ne s'intéresse qu'à ses propres besoins corporels et ne perçoit pas encore la présence de ses proches", isCorrect: false }
        ],
        explanation: "L'égocentrisme cognitif piagétien n'est pas un trait de caractère moral : il désigne l'incapacité de l'enfant à adopter le point de vue d'autrui ou à imaginer qu'une scène puisse être perçue différemment par quelqu'un d'autre."
      },
      {
        text: "La « conservation » est une acquisition clé du stade opératoire concret. Elle désigne la compréhension que :",
        options: [
          { text: "La quantité d'une substance reste identique malgré des modifications de sa forme ou de sa présentation visuelle", isCorrect: true },
          { text: "Les objets continuent d'exister même lorsqu'ils disparaissent du champ visuel de l'enfant temporairement", isCorrect: false },
          { text: "Les règles morales et sociales sont stables dans le temps et s'appliquent à tous les membres du groupe", isCorrect: false },
          { text: "Les relations logiques entre classes d'objets peuvent être représentées mentalement sans support concret", isCorrect: false }
        ],
        explanation: "La conservation (Piaget) est la capacité à comprendre que la quantité (de matière, de nombre, de volume) reste invariante malgré des transformations perceptives. Elle apparaît vers 7-8 ans selon les domaines."
      },
      {
        text: "Le raisonnement hypothético-déductif caractéristique du stade opératoire formel permet à l'adolescent de :",
        options: [
          { text: "Formuler des hypothèses abstraites et en déduire des conséquences logiques sans s'appuyer sur du concret", isCorrect: true },
          { text: "Classer les objets selon plusieurs critères simultanés et réaliser des sériations sur des données perceptibles", isCorrect: false },
          { text: "Comprendre la permanence de l'objet et établir des relations de cause à effet dans l'environnement immédiat", isCorrect: false },
          { text: "Utiliser le langage symbolique et le jeu de faire-semblant pour représenter des objets ou des événements absents", isCorrect: false }
        ],
        explanation: "Le stade opératoire formel (à partir de 11-12 ans) marque l'accès à la pensée abstraite : l'adolescent peut raisonner sur des hypothèses indépendamment de la réalité concrète et envisager des possibles."
      },
      {
        text: "Selon Piaget, l'assimilation et l'accommodation sont deux processus complémentaires. Laquelle de ces propositions les définit correctement ?",
        options: [
          { text: "L'assimilation intègre le nouveau dans les schèmes existants, l'accommodation modifie les schèmes face à un élément nouveau", isCorrect: true },
          { text: "L'assimilation transforme les schèmes pour s'adapter au réel, l'accommodation intègre le réel aux structures actuelles", isCorrect: false },
          { text: "L'assimilation correspond à l'imitation différée, l'accommodation correspond au jeu symbolique de l'enfant", isCorrect: false },
          { text: "L'assimilation est propre au nourrisson, l'accommodation ne s'observe qu'à partir du stade préopératoire", isCorrect: false }
        ],
        explanation: "L'assimilation consiste à interpréter les nouvelles expériences à travers les schèmes existants. L'accommodation modifie ces schèmes quand ils s'avèrent insuffisants. L'équilibre entre les deux est l'adaptation."
      },
      {
        text: "La notion de « schème » chez Piaget désigne :",
        options: [
          { text: "Une structure d'action ou de pensée organisée, généralisable et transférable à des situations similaires", isCorrect: true },
          { text: "Un stéréotype social appris par conditionnement et appliqué automatiquement à des catégories d'individus", isCorrect: false },
          { text: "Un plan thérapeutique structuré élaboré par l'équipe soignante pour accompagner un patient spécifique", isCorrect: false },
          { text: "Un protocole de recherche standardisé permettant de comparer les performances cognitives entre groupes d'âge", isCorrect: false }
        ],
        explanation: "Le schème est une structure cognitive organisée qui se construit et se complexifie avec l'expérience. Il peut s'agir d'un schème d'action (saisir, sucer) ou d'opération mentale (classifier, sériation)."
      },
      {
        text: "Quelle est la principale critique adressée à la théorie piagétienne du développement cognitif ?",
        options: [
          { text: "Des recherches ultérieures montrent que Piaget sous-estime les compétences des nourrissons et des jeunes enfants", isCorrect: true },
          { text: "Piaget ne prend pas en compte les aspects biologiques et neurologiques du développement cérébral précoce", isCorrect: false },
          { text: "Sa théorie s'applique uniquement aux enfants européens et ne peut pas être transposée à d'autres cultures", isCorrect: false },
          { text: "Il ignore totalement le rôle du langage dans le développement cognitif, contrairement à ce qu'observe Vygotski", isCorrect: false }
        ],
        explanation: "Des travaux comme ceux de Baillargeon (avec la méthode du regard) montrent que des compétences comme la permanence de l'objet apparaissent bien plus tôt que Piaget ne le pensait, remettant en cause ses âges charnières."
      }
    ]
  },
  {
    title: "Erikson — stades psychosociaux",
    description: "Les huit stades du développement psychosocial d'Erikson, du nourrisson à la vieillesse, et leurs enjeux pour le soin.",
    semester: "Semestre 1",
    category: "UE 1.1 - Psychologie, sociologie, anthropologie",
    chapter: "Erikson — stades psychosociaux du nourrisson à la vieillesse",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la crise psychosociale centrale du premier stade d'Erikson, correspondant à la période du nourrisson (0-18 mois) ?",
        options: [
          { text: "Confiance de base versus méfiance : l'enfant développe un sentiment de sécurité ou d'insécurité fondamentale", isCorrect: true },
          { text: "Autonomie versus honte et doute : l'enfant acquiert la maîtrise de ses sphincters et de ses mouvements", isCorrect: false },
          { text: "Initiative versus culpabilité : l'enfant explore le monde et développe un sens de la compétence naissante", isCorrect: false },
          { text: "Identité versus confusion des rôles : l'adolescent cherche une cohérence stable de soi à travers ses expériences", isCorrect: false }
        ],
        explanation: "Le premier stade eriksonien (0-18 mois) est celui de la confiance vs méfiance. La qualité des soins et la régularité des réponses de la figure d'attachement déterminent si l'enfant développe un sentiment de confiance fondamentale."
      },
      {
        text: "La crise « travail versus infériorité » correspond à quelle tranche d'âge dans le modèle d'Erikson ?",
        options: [
          { text: "L'âge scolaire, entre 6 et 12 ans environ, période d'apprentissage et de socialisation par les pairs", isCorrect: true },
          { text: "La petite enfance, entre 3 et 6 ans, période de jeu symbolique et d'exploration de l'environnement proche", isCorrect: false },
          { text: "L'adolescence, entre 12 et 18 ans, période de remise en question identitaire et de recherche de soi", isCorrect: false },
          { text: "Le jeune adulte, entre 20 et 40 ans, période de construction des relations intimes et de l'engagement amoureux", isCorrect: false }
        ],
        explanation: "La crise travail/infériorité (industry vs inferiority) est propre à l'âge scolaire (6-12 ans) : l'enfant doit acquérir des compétences et recevoir une reconnaissance sociale, faute de quoi il développe un sentiment d'infériorité."
      },
      {
        text: "La résolution positive de la crise « identité versus confusion des rôles » à l'adolescence se traduit par :",
        options: [
          { text: "Un sentiment cohérent et stable de qui l'on est, incluant valeurs, aspirations et appartenance sociale", isCorrect: true },
          { text: "La capacité à établir des relations intimes profondes et à s'engager durablement envers autrui", isCorrect: false },
          { text: "L'acceptation de sa propre vie comme ayant eu un sens et une valeur unique et irremplaçable", isCorrect: false },
          { text: "Le développement d'une préoccupation altruiste pour les générations suivantes et la transmission de valeurs", isCorrect: false }
        ],
        explanation: "La crise identitaire de l'adolescence se résout positivement par l'acquisition d'une identité stable (sens de soi, valeurs, rôles). Sa résolution négative est la confusion des rôles, caractérisée par une incertitude sur soi."
      },
      {
        text: "Selon Erikson, la crise psychosociale de la maturité (40-65 ans) oppose :",
        options: [
          { text: "La générativité à la stagnation : s'investir pour les autres et les générations futures versus se replier sur soi", isCorrect: true },
          { text: "L'intégration à la désespoir : accepter sa vie passée telle qu'elle a été versus regretter le temps écoulé", isCorrect: false },
          { text: "L'intimité à l'isolement : construire des liens profonds et durables versus rester seul et coupé des autres", isCorrect: false },
          { text: "L'identité à la confusion : construire un sentiment stable de soi versus douter de sa place dans le monde", isCorrect: false }
        ],
        explanation: "La générativité (soin, transmission, création) s'oppose à la stagnation durant la maturité. Les adultes générateurs s'investissent dans l'éducation des enfants, la transmission culturelle ou des projets socialement utiles."
      },
      {
        text: "Le huitième et dernier stade d'Erikson, propre à la vieillesse, met en tension :",
        options: [
          { text: "L'intégrité du moi face au désespoir : le sentiment d'avoir vécu une vie cohérente et digne de sens", isCorrect: true },
          { text: "La générativité face à la stagnation : la volonté de transmettre aux générations futures ses acquis de vie", isCorrect: false },
          { text: "La confiance face à la méfiance : retrouver la sécurité perdue face au déclin des capacités physiques", isCorrect: false },
          { text: "L'intimité face à l'isolement : maintenir des liens affectifs malgré les deuils et les pertes de proches", isCorrect: false }
        ],
        explanation: "Le huitième stade (vieillesse) oppose intégrité versus désespoir. La résolution positive implique d'accepter sa vie comme un tout signifiant ; la résolution négative se traduit par un sentiment d'échec et de peur de la mort."
      },
      {
        text: "En quoi la théorie d'Erikson se distingue-t-elle fondamentalement de celle de Freud ?",
        options: [
          { text: "Elle s'étend sur toute la vie, intègre le rôle de la société et ne réduit pas le développement à la sexualité infantile", isCorrect: true },
          { text: "Elle rejette totalement la notion d'inconscient et se fonde exclusivement sur des comportements observables", isCorrect: false },
          { text: "Elle s'appuie sur des expériences contrôlées en laboratoire, contrairement aux études de cas cliniques freudiens", isCorrect: false },
          { text: "Elle décrit des stades fixes et non universels, valides uniquement pour les sociétés occidentales industrialisées", isCorrect: false }
        ],
        explanation: "Erikson étend le développement à l'ensemble du cycle de vie (pas seulement l'enfance), accorde une place centrale aux influences culturelles et sociales, et ne réduit pas les crises à des enjeux sexuels comme Freud."
      },
      {
        text: "La notion de « moratoire psychosocial » introduite par Erikson à propos de l'adolescence désigne :",
        options: [
          { text: "Une période de suspension socialement accordée pour explorer des identités possibles avant de s'engager définitivement", isCorrect: true },
          { text: "Un arrêt temporaire du développement cognitif observé en début d'adolescence sous l'effet hormonal", isCorrect: false },
          { text: "Un délai légal accordé aux jeunes adultes pour reporter leurs obligations professionnelles et civiques", isCorrect: false },
          { text: "Une phase de régression affective normale précédant l'accession à la maturité émotionnelle et relationnelle", isCorrect: false }
        ],
        explanation: "Le moratoire psychosocial est un espace de temps toléré socialement permettant à l'adolescent d'explorer différents rôles et valeurs sans s'engager définitivement, facilitant ainsi la construction identitaire."
      },
      {
        text: "Comment le modèle d'Erikson peut-il orienter la pratique infirmière auprès d'un patient âgé hospitalisé ?",
        options: [
          { text: "Il aide à comprendre les enjeux d'intégrité et de sens que vit le patient, orientant une écoute valorisante de son histoire", isCorrect: true },
          { text: "Il fournit un protocole standardisé de rééducation cognitive applicable à tous les patients de plus de 65 ans", isCorrect: false },
          { text: "Il permet de diagnostiquer les troubles de la personnalité présents dès l'enfance et persistant à l'âge adulte", isCorrect: false },
          { text: "Il donne des indications précises sur les doses médicamenteuses adaptées aux différents stades développementaux", isCorrect: false }
        ],
        explanation: "Comprendre que le patient âgé traverse la crise intégrité/désespoir invite l'infirmier à valoriser le récit de vie, à reconnaître l'expérience du patient et à soutenir son sentiment d'avoir mené une vie qui a eu du sens."
      }
    ]
  }
];
