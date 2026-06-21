module.exports = [
  {
    title: "Diagnostic infirmier NANDA — formulation et composantes",
    description: "Maîtrisez la formulation des diagnostics infirmiers selon la taxonomie NANDA : structure PE/PES, composantes essentielles et diagnostics courants en pratique clinique.",
    semester: "Semestre 1",
    category: "UE 3.1 - Raisonnement et démarche clinique infirmière",
    chapter: "Chapitre 6 — Diagnostic infirmier NANDA",
    difficulty: "intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la structure complète d'un diagnostic infirmier selon le format PES ?",
        options: [
          { text: "Problème de santé lié à une étiologie se manifestant par des signes", isCorrect: true },
          { text: "Pathologie liée à une cause médicale se manifestant par des symptômes", isCorrect: false },
          { text: "Prescription infirmière liée à une situation se manifestant par des résultats", isCorrect: false },
          { text: "Priorité de soin liée à une évaluation se manifestant par des données", isCorrect: false }
        ],
        explanation: "Le format PES (Problem, Etiology, Signs/Symptoms) structure le diagnostic infirmier en trois parties : le problème de santé (P), l'étiologie ou facteur lié (E), et les caractéristiques définissantes ou signes (S). Exemple : Douleur aiguë (P) liée à une incision chirurgicale (E) se manifestant par une grimace et une EVA à 7 (S)."
      },
      {
        text: "Parmi ces énoncés, lequel est un diagnostic infirmier NANDA correctement formulé ?",
        options: [
          { text: "Risque de chute lié à une faiblesse musculaire des membres inférieurs", isCorrect: true },
          { text: "Fracture du col du fémur nécessitant une surveillance orthopédique", isCorrect: false },
          { text: "Prescription de kinésithérapie pour rééducation fonctionnelle", isCorrect: false },
          { text: "Résultat de laboratoire anormal nécessitant une analyse médicale", isCorrect: false }
        ],
        explanation: "Le diagnostic infirmier NANDA décrit une réponse humaine à un problème de santé, pas un diagnostic médical ni une prescription. « Risque de chute lié à une faiblesse musculaire » est correct car il identifie un problème infirmier avec son étiologie. Les diagnostics médicaux (fracture), les prescriptions et les résultats biologiques n'appartiennent pas à la taxonomie NANDA."
      },
      {
        text: "Quelle est la différence fondamentale entre un diagnostic infirmier « réel » et un diagnostic « de risque » ?",
        options: [
          { text: "Le diagnostic réel présente des signes actuels ; le diagnostic de risque identifie une vulnérabilité sans signe présent", isCorrect: true },
          { text: "Le diagnostic réel est posé par le médecin ; le diagnostic de risque est posé par l'infirmier", isCorrect: false },
          { text: "Le diagnostic réel concerne les besoins physiologiques ; le diagnostic de risque concerne les besoins psychologiques", isCorrect: false },
          { text: "Le diagnostic réel est prioritaire ; le diagnostic de risque n'est jamais traité en premier", isCorrect: false }
        ],
        explanation: "Un diagnostic infirmier réel est soutenu par des caractéristiques définissantes (signes et symptômes actuellement présents). Un diagnostic de risque indique une vulnérabilité accrue à développer un problème, sans que les signes soient encore présents. Il commence par « Risque de… » et ne comporte donc pas de signes mais des facteurs de risque."
      },
      {
        text: "Quel diagnostic infirmier NANDA correspond le mieux à un patient alité depuis 10 jours, présentant une rougeur au sacrum et une peau fragile ?",
        options: [
          { text: "Atteinte à l'intégrité de la peau liée à l'immobilité prolongée", isCorrect: true },
          { text: "Déficit en soins personnels : hygiène lié à la fatigue chronique", isCorrect: false },
          { text: "Risque de syndrome d'immobilité lié à l'alitement prolongé", isCorrect: false },
          { text: "Perturbation de la mobilité physique liée à une douleur articulaire", isCorrect: false }
        ],
        explanation: "La présence de rougeur au sacrum et de peau fragile constitue des signes actuels (caractéristiques définissantes), ce qui oriente vers un diagnostic réel. « Atteinte à l'intégrité de la peau » est le diagnostic NANDA correspondant à une lésion cutanée existante. Le risque d'escarre serait utilisé si la peau était encore intacte malgré l'immobilité."
      },
      {
        text: "Combien de composantes minimales doit contenir un diagnostic infirmier NANDA pour être valide ?",
        options: [
          { text: "Deux composantes : le problème et le facteur lié (étiologie)", isCorrect: true },
          { text: "Une composante : le problème de santé suffit à lui seul", isCorrect: false },
          { text: "Trois composantes obligatoires : problème, étiologie et signes", isCorrect: false },
          { text: "Quatre composantes : problème, étiologie, signes et objectif", isCorrect: false }
        ],
        explanation: "Un diagnostic infirmier NANDA nécessite au minimum deux composantes : le problème (P) et le facteur lié ou étiologie (E). La troisième composante (S — signes) est ajoutée pour les diagnostics réels afin de le documenter, mais elle n'est pas obligatoire pour tous les types. Pour les diagnostics de risque, les signes n'existent pas encore par définition."
      },
      {
        text: "Lequel de ces diagnostics infirmiers est qualifié de « diagnostic de promotion de la santé » selon NANDA ?",
        options: [
          { text: "Motivation à améliorer ses habitudes alimentaires", isCorrect: true },
          { text: "Alimentation déficiente liée à une anorexie chronique", isCorrect: false },
          { text: "Risque de déséquilibre nutritionnel lié à des nausées post-chimiothérapie", isCorrect: false },
          { text: "Déséquilibre nutritionnel : apports inférieurs aux besoins", isCorrect: false }
        ],
        explanation: "Les diagnostics de promotion de la santé décrivent la motivation d'une personne à améliorer son niveau de bien-être. Ils commencent souvent par « Motivation à… » ou « Disponibilité à améliorer… ». Ils s'appliquent aux personnes en bonne santé ou en rétablissement souhaitant optimiser leur mode de vie, sans étiologie associée."
      },
      {
        text: "Lors de la collecte de données, quels éléments permettent de formuler le « S » (signes) du diagnostic PES ?",
        options: [
          { text: "Les caractéristiques définissantes objectives et subjectives observées chez le patient", isCorrect: true },
          { text: "Les antécédents médicaux et chirurgicaux figurant dans le dossier médical", isCorrect: false },
          { text: "Les prescriptions médicales et les résultats des examens complémentaires", isCorrect: false },
          { text: "Les objectifs infirmiers définis lors de la planification des soins", isCorrect: false }
        ],
        explanation: "Le « S » du diagnostic PES regroupe les caractéristiques définissantes, c'est-à-dire les données objectives (observées par l'infirmier : rougeur, tachycardie, grimace) et subjectives (rapportées par le patient : « j'ai mal », « je me sens faible »). Ces éléments valident le diagnostic et le distinguent d'un autre problème similaire."
      },
      {
        text: "Quel diagnostic infirmier NANDA est le plus approprié pour un patient exprimant une peur intense liée à une intervention chirurgicale prévue ?",
        options: [
          { text: "Anxiété liée à la menace perçue de l'intégrité physique se manifestant par des tremblements", isCorrect: true },
          { text: "Déni non constructif lié à un refus d'accepter le diagnostic médical", isCorrect: false },
          { text: "Stratégies d'adaptation inefficaces liées à un soutien social insuffisant", isCorrect: false },
          { text: "Sentiment d'impuissance lié à une perte de contrôle sur les soins reçus", isCorrect: false }
        ],
        explanation: "L'anxiété est le diagnostic NANDA adapté lorsque le patient exprime une peur intense et présente des signes physiques associés (tremblements, agitation). Elle est liée à une menace perçue (ici l'intervention chirurgicale). Le déni, les stratégies d'adaptation inefficaces et le sentiment d'impuissance répondent à des présentations cliniques différentes."
      }
    ]
  },
  {
    title: "Planification des soins — objectifs SMART et priorisation",
    description: "Apprenez à rédiger des objectifs infirmiers selon les critères SMART, à planifier des interventions adaptées et à prioriser les soins selon les besoins du patient.",
    semester: "Semestre 1",
    category: "UE 3.1 - Raisonnement et démarche clinique infirmière",
    chapter: "Chapitre 7 — Planification des soins",
    difficulty: "intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Que signifie l'acronyme SMART dans la formulation d'un objectif infirmier ?",
        options: [
          { text: "Spécifique, Mesurable, Atteignable, Réaliste, Temporellement défini", isCorrect: true },
          { text: "Sécuritaire, Médical, Adapté, Rapide, Transmissible", isCorrect: false },
          { text: "Standardisé, Modulable, Autonome, Révisable, Traçable", isCorrect: false },
          { text: "Symptomatique, Multidisciplinaire, Axé, Réévalué, Thérapeutique", isCorrect: false }
        ],
        explanation: "L'acronyme SMART définit les critères d'un objectif de soin efficace : Spécifique (centré sur un résultat précis), Mesurable (évaluable avec des indicateurs), Atteignable (réalisable pour ce patient), Réaliste (en rapport avec les ressources disponibles), Temporellement défini (avec une échéance claire). Ces critères garantissent que l'objectif peut être évalué de façon rigoureuse."
      },
      {
        text: "Lequel de ces objectifs infirmiers respecte le mieux les critères SMART ?",
        options: [
          { text: "Le patient marchera 50 mètres sans aide avec son déambulateur d'ici 5 jours", isCorrect: true },
          { text: "Le patient améliorera sa mobilité après la rééducation kinésithérapeutique", isCorrect: false },
          { text: "Le patient devra être autonome lors de sa sortie de l'hôpital prochainement", isCorrect: false },
          { text: "Le patient sera mieux le plus rapidement possible grâce aux soins infirmiers", isCorrect: false }
        ],
        explanation: "L'objectif « marcher 50 mètres sans aide avec déambulateur d'ici 5 jours » est SMART : il est Spécifique (marcher avec déambulateur), Mesurable (50 mètres), Atteignable et Réaliste (avec déambulateur), et Temporellement défini (5 jours). Les autres options manquent de précision mesurable et d'échéance claire."
      },
      {
        text: "Selon la hiérarchie des besoins de Maslow appliquée aux soins infirmiers, quel soin doit être priorisé en premier ?",
        options: [
          { text: "Assurer la liberté des voies aériennes d'un patient en détresse respiratoire", isCorrect: true },
          { text: "Informer le patient sur sa pathologie pour réduire son anxiété préopératoire", isCorrect: false },
          { text: "Aider le patient à maintenir son image corporelle après une mastectomie", isCorrect: false },
          { text: "Favoriser le lien social en organisant une visite de la famille hospitalisée", isCorrect: false }
        ],
        explanation: "Selon la pyramide de Maslow, les besoins physiologiques (oxygénation, alimentation, élimination) sont prioritaires sur les besoins de sécurité, d'appartenance et d'estime de soi. Assurer la liberté des voies aériennes répond à un besoin vital immédiat. La détresse respiratoire met la vie en danger et prime sur l'éducation, l'image corporelle ou le lien social."
      },
      {
        text: "Qu'est-ce qu'une intervention infirmière autonome dans le cadre de la planification des soins ?",
        options: [
          { text: "Une action relevant du rôle propre infirmier ne nécessitant pas de prescription médicale", isCorrect: true },
          { text: "Une action réalisée seul par l'infirmier sans l'aide d'un aide-soignant", isCorrect: false },
          { text: "Une action prescrite par le médecin et exécutée de façon indépendante", isCorrect: false },
          { text: "Une action réalisée sans protocole ni référentiel de soins validé", isCorrect: false }
        ],
        explanation: "Les interventions autonomes (ou relevant du rôle propre) sont des actes que l'infirmier peut initier et réaliser sans prescription médicale préalable : éducation du patient, positionnement, surveillance, soutien psychologique, prévention des escarres. Elles se distinguent des interventions sur prescription (injections, médicaments) qui nécessitent un ordre médical."
      },
      {
        text: "Lors de la planification des soins, quelle est la différence entre un objectif à court terme et un objectif à long terme ?",
        options: [
          { text: "Le court terme vise un résultat immédiat (heures à jours) ; le long terme vise un résultat global (semaines à mois)", isCorrect: true },
          { text: "Le court terme concerne les soins physiques ; le long terme concerne l'éducation thérapeutique", isCorrect: false },
          { text: "Le court terme est rédigé par l'infirmier ; le long terme est rédigé par le médecin", isCorrect: false },
          { text: "Le court terme s'applique aux hospitalisations ; le long terme s'applique aux soins à domicile", isCorrect: false }
        ],
        explanation: "Un objectif à court terme vise un résultat attendu dans les heures ou jours suivants (ex : douleur < 3/10 dans les 2 heures). Un objectif à long terme concerne un résultat global sur plusieurs semaines ou mois (ex : autonomie pour l'autocontrôle glycémique à la sortie). Les deux types se complètent et s'inscrivent dans la continuité du plan de soins."
      },
      {
        text: "Quel outil de priorisation permet à l'infirmier de classer les diagnostics infirmiers par ordre d'urgence ?",
        options: [
          { text: "La hiérarchie des besoins de Maslow appliquée aux problèmes identifiés", isCorrect: true },
          { text: "L'algorithme de décision médicale défini dans le protocole du service", isCorrect: false },
          { text: "Le score de Glasgow utilisé pour évaluer la conscience du patient", isCorrect: false },
          { text: "L'échelle EVA utilisée pour quantifier la douleur ressentie par le patient", isCorrect: false }
        ],
        explanation: "La hiérarchie des besoins de Maslow est l'outil de référence en soins infirmiers pour prioriser les diagnostics. On traite en premier les problèmes menaçant la survie (besoins physiologiques), puis les problèmes de sécurité, puis les besoins psychosociaux. L'EVA mesure la douleur, le Glasgow évalue la conscience, et l'algorithme médical ne s'applique pas aux diagnostics infirmiers."
      },
      {
        text: "Quelle information est indispensable pour rédiger un plan de soins infirmier complet et individualisé ?",
        options: [
          { text: "Les données d'évaluation initiale du patient incluant ses ressources et ses limites", isCorrect: true },
          { text: "Les protocoles standardisés du service applicables à tous les patients", isCorrect: false },
          { text: "Les prescriptions médicales uniquement pour guider les actions infirmières", isCorrect: false },
          { text: "Les résultats des examens complémentaires transmis par le laboratoire", isCorrect: false }
        ],
        explanation: "Un plan de soins individualisé repose sur l'évaluation initiale du patient : ses besoins, ses ressources (capacités physiques, cognitives, soutien social), ses limites et ses préférences. Cette individualisation distingue le plan de soins infirmier d'un protocole standardisé. Les prescriptions médicales et les résultats biologiques sont des données complémentaires mais ne suffisent pas à eux seuls."
      },
      {
        text: "Comment l'infirmier doit-il formuler un objectif de soin centré sur le patient ?",
        options: [
          { text: "En décrivant ce que le patient sera capable de faire ou d'atteindre comme résultat", isCorrect: true },
          { text: "En décrivant les actions que l'infirmier réalisera pour prendre en charge le patient", isCorrect: false },
          { text: "En listant les médicaments prescrits et leur fréquence d'administration", isCorrect: false },
          { text: "En précisant les examens complémentaires à réaliser pour suivre l'évolution", isCorrect: false }
        ],
        explanation: "Un objectif infirmier centré sur le patient décrit un résultat attendu du côté du patient, pas de l'infirmier. Il utilise le sujet « le patient » : « Le patient exprimera une douleur inférieure à 3/10 ». Ce centrage sur le patient (patient-centered outcome) est fondamental en démarche clinique infirmière pour évaluer l'efficacité des soins."
      }
    ]
  },
  {
    title: "Réalisation et évaluation des soins — critères et réajustement",
    description: "Comprenez les étapes de la réalisation et de l'évaluation des soins infirmiers : critères d'évaluation, réajustement du plan, et indicateurs de résultats cliniques.",
    semester: "Semestre 1",
    category: "UE 3.1 - Raisonnement et démarche clinique infirmière",
    chapter: "Chapitre 8 — Réalisation et évaluation des soins",
    difficulty: "intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la principale différence entre la réalisation et l'évaluation des soins dans la démarche clinique ?",
        options: [
          { text: "La réalisation met en œuvre les interventions planifiées ; l'évaluation mesure l'atteinte des objectifs", isCorrect: true },
          { text: "La réalisation est effectuée par l'infirmier ; l'évaluation est effectuée par le médecin", isCorrect: false },
          { text: "La réalisation concerne les soins techniques ; l'évaluation concerne les soins relationnels", isCorrect: false },
          { text: "La réalisation se fait en début de journée ; l'évaluation se fait uniquement à la sortie", isCorrect: false }
        ],
        explanation: "Dans la démarche clinique infirmière en six étapes, la réalisation est la mise en œuvre concrète des interventions planifiées. L'évaluation est la phase suivante : elle mesure si les objectifs définis lors de la planification ont été atteints. Cette distinction est fondamentale car l'évaluation déclenche, si nécessaire, un réajustement du plan de soins."
      },
      {
        text: "Quand un infirmier doit-il réajuster le plan de soins d'un patient ?",
        options: [
          { text: "Lorsque l'évaluation montre que les objectifs ne sont pas atteints ou que la situation a évolué", isCorrect: true },
          { text: "Uniquement lors du changement de l'équipe soignante en fin de poste", isCorrect: false },
          { text: "Seulement sur prescription médicale après la visite du médecin traitant", isCorrect: false },
          { text: "À intervalles fixes définis par le protocole du service, quelle que soit l'évolution", isCorrect: false }
        ],
        explanation: "Le réajustement du plan de soins est déclenché par l'évaluation clinique : si les objectifs ne sont pas atteints, si la situation clinique s'est aggravée ou améliorée, ou si de nouveaux problèmes sont apparus. C'est la nature dynamique et itérative de la démarche clinique infirmière. Le réajustement ne dépend pas d'un calendrier fixe ni d'une prescription médicale."
      },
      {
        text: "Quel indicateur est le plus pertinent pour évaluer l'efficacité d'une intervention contre la douleur ?",
        options: [
          { text: "La comparaison du score EVA avant et après l'intervention infirmière réalisée", isCorrect: true },
          { text: "La satisfaction globale du patient exprimée lors de l'enquête de sortie", isCorrect: false },
          { text: "Le nombre d'antalgiques prescrits sur la feuille de médicaments du patient", isCorrect: false },
          { text: "L'absence de plainte verbale du patient auprès de l'équipe soignante", isCorrect: false }
        ],
        explanation: "L'EVA (Échelle Visuelle Analogique) est l'outil de mesure validé pour évaluer la douleur. Comparer le score avant et après une intervention (ex : EVA à 7 avant, EVA à 3 après analgésie) permet de mesurer objectivement l'efficacité de l'intervention. L'absence de plainte n'est pas fiable (le patient peut ne pas vouloir exprimer sa douleur)."
      },
      {
        text: "Dans le cadre de l'évaluation des soins, qu'est-ce qu'un critère de résultat ?",
        options: [
          { text: "Un indicateur observable et mesurable attestant que l'objectif de soin est atteint", isCorrect: true },
          { text: "Une action réalisée par l'infirmier pour atteindre l'objectif de soin planifié", isCorrect: false },
          { text: "Un problème infirmier identifié lors de la collecte initiale des données", isCorrect: false },
          { text: "Une prescription médicale modifiée suite à l'évaluation de l'état clinique", isCorrect: false }
        ],
        explanation: "Un critère de résultat est un indicateur clinique observable permettant de vérifier qu'un objectif a été atteint. Par exemple, pour l'objectif « le patient marchera 50 mètres sans aide », le critère de résultat est la réalisation effective de cette marche, mesurée et documentée. Les critères de résultats permettent d'évaluer l'efficacité des interventions de manière objective."
      },
      {
        text: "Que doit faire l'infirmier si, lors de l'évaluation, un objectif est partiellement atteint ?",
        options: [
          { text: "Analyser les obstacles, adapter les interventions et réviser l'échéance si nécessaire", isCorrect: true },
          { text: "Clôturer le diagnostic infirmier car une amélioration partielle suffit à valider l'objectif", isCorrect: false },
          { text: "Signaler immédiatement au médecin l'échec des soins infirmiers réalisés", isCorrect: false },
          { text: "Maintenir le plan initial sans modification car les résultats peuvent s'améliorer seuls", isCorrect: false }
        ],
        explanation: "Un objectif partiellement atteint exige une analyse des facteurs limitants (douleur persistante, manque de motivation, ressources insuffisantes), puis une adaptation des interventions (intensité, fréquence, méthode) et éventuellement une révision de l'échéance. La démarche clinique est un processus itératif : évaluer → réajuster → réévaluer. Clôturer un objectif non atteint serait une erreur professionnelle."
      },
      {
        text: "Quelle est la place de l'évaluation dans la démarche clinique infirmière en six étapes ?",
        options: [
          { text: "Sixième et dernière étape, déclenchant un nouveau cycle si les objectifs ne sont pas atteints", isCorrect: true },
          { text: "Quatrième étape, réalisée avant la planification et la mise en œuvre des soins", isCorrect: false },
          { text: "Première étape permettant d'établir les priorités avant toute collecte de données", isCorrect: false },
          { text: "Troisième étape, simultanée à la formulation des diagnostics infirmiers", isCorrect: false }
        ],
        explanation: "La démarche clinique infirmière comprend six étapes dans l'ordre : 1. Collecte de données, 2. Analyse et interprétation, 3. Planification, 4. Réalisation, 5. Évaluation, 6. Réajustement. L'évaluation est la sixième étape. Si les objectifs ne sont pas atteints, elle relance le cycle en repartant de la collecte de données actualisée."
      },
      {
        text: "Comment l'infirmier évalue-t-il la prévention des escarres chez un patient à haut risque ?",
        options: [
          { text: "En inspectant quotidiennement l'état cutané et en réévaluant le score de Braden", isCorrect: true },
          { text: "En vérifiant uniquement que le protocole de positionnement a été appliqué", isCorrect: false },
          { text: "En comptant le nombre de changements de position effectués pendant le poste", isCorrect: false },
          { text: "En demandant au patient s'il ressent une douleur au niveau des points d'appui", isCorrect: false }
        ],
        explanation: "L'évaluation de la prévention des escarres repose sur l'inspection cutanée régulière (rougeurs, lésions) et la réévaluation du score de Braden (risque d'escarre). Ces deux éléments constituent des critères de résultats objectifs. Vérifier que le protocole a été suivi évalue l'observance des interventions, pas leur efficacité. La douleur aux points d'appui est un signe tardif."
      },
      {
        text: "Après réalisation d'un soin d'éducation sur l'insulinothérapie, comment l'infirmier évalue-t-il l'efficacité de l'apprentissage ?",
        options: [
          { text: "En demandant au patient de démontrer lui-même la technique d'injection sans aide", isCorrect: true },
          { text: "En comptant le nombre de séances d'éducation réalisées pendant l'hospitalisation", isCorrect: false },
          { text: "En vérifiant que la brochure d'information a bien été remise au patient", isCorrect: false },
          { text: "En notant dans le dossier que l'éducation thérapeutique a été dispensée", isCorrect: false }
        ],
        explanation: "L'évaluation des apprentissages repose sur la démonstration pratique par le patient (teach-back ou retour-démonstration). C'est la méthode la plus fiable pour vérifier que le patient a non seulement compris mais aussi intégré la compétence. Le simple fait de dispenser l'éducation ou de remettre des documents ne garantit pas l'apprentissage effectif."
      }
    ]
  },
  {
    title: "Transmissions DAR — data, action, résultat et traçabilité",
    description: "Maîtrisez la méthode de transmission ciblée DAR : structure des notes, contenu de chaque composante, et importance de la traçabilité dans le dossier de soins infirmiers.",
    semester: "Semestre 1",
    category: "UE 3.1 - Raisonnement et démarche clinique infirmière",
    chapter: "Chapitre 9 — Transmissions DAR",
    difficulty: "intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Que signifie l'acronyme DAR dans les transmissions infirmières ?",
        options: [
          { text: "Données, Action, Résultat — les trois composantes de la note ciblée", isCorrect: true },
          { text: "Diagnostic, Acte, Réévaluation — les étapes du raisonnement clinique", isCorrect: false },
          { text: "Dossier, Administration, Rapport — les outils de transmission en EHPAD", isCorrect: false },
          { text: "Danger, Alerte, Réponse — le protocole de gestion des urgences", isCorrect: false }
        ],
        explanation: "DAR est la structure des transmissions ciblées : D (Données) = les informations objectives et subjectives observées ; A (Action) = les interventions infirmières réalisées ou planifiées ; R (Résultat) = l'état du patient après l'action. Cette méthode structure et synthétise les transmissions pour assurer la continuité des soins entre les équipes soignantes."
      },
      {
        text: "Dans une transmission DAR, quelle information figure dans la composante « Données » (D) ?",
        options: [
          { text: "Les signes cliniques observés et les propos rapportés par le patient ou son entourage", isCorrect: true },
          { text: "Les soins réalisés par l'infirmier pendant son poste de travail", isCorrect: false },
          { text: "L'évolution de l'état du patient après les interventions réalisées", isCorrect: false },
          { text: "Les prescriptions médicales à exécuter lors du prochain poste", isCorrect: false }
        ],
        explanation: "La composante D (Données) contient les éléments de la situation : données objectives (paramètres vitaux, aspect de la plaie, comportement observable) et données subjectives (ce que dit le patient). Exemple : D — « Patient se plaint d'une douleur thoracique 7/10, diaphorèse, FC 110 bpm ». Les soins réalisés appartiennent au A (Action)."
      },
      {
        text: "Qu'est-ce qu'une « cible » dans le contexte des transmissions ciblées DAR ?",
        options: [
          { text: "Le problème ou la préoccupation infirmière qui donne son thème à la note DAR", isCorrect: true },
          { text: "L'objectif de soin défini lors de la planification du plan de soins individualisé", isCorrect: false },
          { text: "Le diagnostic médical principal figurant sur le dossier du patient hospitalisé", isCorrect: false },
          { text: "Le résultat attendu après la réalisation des interventions infirmières planifiées", isCorrect: false }
        ],
        explanation: "La cible est le titre de la note DAR. Elle identifie le problème ou la préoccupation concernée (ex : « Douleur », « Anxiété », « Risque de chute », « Éducation »). Chaque note DAR est identifiée par une cible spécifique qui permet de retrouver rapidement l'information dans le dossier et d'assurer un suivi longitudinal du problème ciblé."
      },
      {
        text: "Quelle est la principale valeur juridique des transmissions infirmières dans le dossier patient ?",
        options: [
          { text: "Elles constituent une preuve écrite des soins réalisés en cas de litige ou de contrôle", isCorrect: true },
          { text: "Elles servent uniquement à informer l'équipe de nuit sur les événements du jour", isCorrect: false },
          { text: "Elles permettent à l'administration hospitalière d'évaluer la productivité infirmière", isCorrect: false },
          { text: "Elles sont rédigées pour satisfaire aux exigences de la certification HAS", isCorrect: false }
        ],
        explanation: "Les transmissions infirmières ont une valeur médicolégale : elles constituent la preuve écrite que les soins ont été réalisés et que la surveillance a été assurée. En cas de plainte ou de litige, « ce qui n'est pas écrit n'a pas été fait ». L'infirmier engage sa responsabilité professionnelle dans la traçabilité de ses actes. La valeur juridique est leur dimension primordiale."
      },
      {
        text: "Comment doit-on corriger une erreur de saisie dans les transmissions infirmières papier ?",
        options: [
          { text: "Barrer d'un trait unique en laissant lisible le texte erroné, puis signer la correction", isCorrect: true },
          { text: "Effacer complètement l'erreur avec du blanc correcteur pour réécrire proprement", isCorrect: false },
          { text: "Déchirer la page et réécrire la transmission sur une nouvelle feuille vierge", isCorrect: false },
          { text: "Indiquer « annulé » sans barrer l'erreur pour laisser le texte intégralement lisible", isCorrect: false }
        ],
        explanation: "En dossier infirmier papier, toute erreur doit être corrigée par un simple trait de stylo laissant le texte erroné lisible, suivi d'une signature. L'utilisation de blanc correcteur, l'effacement ou la destruction de documents médicaux sont des actes graves pouvant être interprétés comme une falsification de document médical, engagement la responsabilité pénale de l'auteur."
      },
      {
        text: "Lors d'un passage de relève oral entre deux équipes, quelle méthode structurée est recommandée en milieu hospitalier ?",
        options: [
          { text: "La méthode SBAR : Situation, Background, Évaluation, Recommandations", isCorrect: true },
          { text: "La méthode DAR appliquée oralement pour chaque patient de l'unité de soins", isCorrect: false },
          { text: "La lecture intégrale du dossier médical de chaque patient à l'équipe entrante", isCorrect: false },
          { text: "La transmission libre sans structure pour adapter le contenu à chaque situation", isCorrect: false }
        ],
        explanation: "La méthode SBAR (Situation, Background, Évaluation, Recommandations) est recommandée par la HAS pour les transmissions orales interprofessionnelles, notamment lors des passages de relève. Elle structure l'information pour éviter les omissions et les malentendus. La méthode DAR est utilisée pour les transmissions écrites ciblées dans le dossier de soins."
      },
      {
        text: "Que doit contenir la composante « Résultat » (R) d'une note DAR ?",
        options: [
          { text: "L'état du patient après l'intervention réalisée et l'atteinte ou non de l'objectif fixé", isCorrect: true },
          { text: "Les prochains soins à planifier pour le poste de nuit selon la prescription médicale", isCorrect: false },
          { text: "L'ensemble des constantes vitales mesurées pendant toute la durée du poste", isCorrect: false },
          { text: "Les conclusions du médecin formulées lors de la visite médicale quotidienne", isCorrect: false }
        ],
        explanation: "Le R (Résultat) documente l'efficacité de l'action réalisée. Exemple : R — « Patient soulagé, EVA à 2/10, verbalise un confort amélioré, position antalgique maintenue ». Cette composante ferme la boucle évaluative de la note DAR et permet à l'équipe suivante de savoir si le problème est résolu, en cours de résolution ou nécessite une surveillance continue."
      },
      {
        text: "Pourquoi les transmissions DAR doivent-elles être rédigées en temps réel ou au plus près du soin ?",
        options: [
          { text: "Pour garantir la précision des informations et éviter les oublis liés au délai", isCorrect: true },
          { text: "Pour respecter la planification horaire établie par le cadre de santé du service", isCorrect: false },
          { text: "Pour satisfaire aux audits qualité réalisés par la direction des soins infirmiers", isCorrect: false },
          { text: "Pour permettre au médecin de prendre connaissance des soins avant sa prochaine visite", isCorrect: false }
        ],
        explanation: "La traçabilité en temps réel (ou au plus près du soin) est une règle déontologique et médicolégale. Elle garantit la fiabilité des données transmises, évite les erreurs de mémoire et assure la continuité des soins en cas d'événement imprévu (urgence, incident). Un soin non tracé immédiatement peut être oublié, modifié involontairement ou contesté en cas de litige."
      }
    ]
  },
  {
    title: "Dossier patient informatisé (DPI) — contenu, accès et confidentialité",
    description: "Apprenez le contenu réglementaire du dossier patient informatisé, les règles d'accès, les droits du patient et les obligations de confidentialité en établissement de santé.",
    semester: "Semestre 1",
    category: "UE 3.1 - Raisonnement et démarche clinique infirmière",
    chapter: "Chapitre 10 — Dossier patient informatisé (DPI)",
    difficulty: "intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quelle loi française encadre principalement le droit d'accès du patient à son dossier médical ?",
        options: [
          { text: "La loi du 4 mars 2002 relative aux droits des malades et à la qualité du système de santé", isCorrect: true },
          { text: "La loi Informatique et Libertés de 1978 relative à la protection des données personnelles", isCorrect: false },
          { text: "La loi HPST du 21 juillet 2009 portant réforme de l'hôpital et des territoires", isCorrect: false },
          { text: "La loi du 26 janvier 1984 portant statut général de la fonction publique hospitalière", isCorrect: false }
        ],
        explanation: "La loi du 4 mars 2002 (loi Kouchner) est le texte fondateur des droits des patients en France. Elle reconnaît le droit d'accès direct du patient à son dossier médical, le droit à l'information, le consentement éclairé et la désignation d'une personne de confiance. Le délai d'accès au dossier est de 8 jours (48h si hospitalisation récente de moins de 5 ans)."
      },
      {
        text: "Qui peut accéder légalement au dossier patient informatisé dans un établissement de santé ?",
        options: [
          { text: "Les professionnels de santé participant directement à la prise en charge du patient", isCorrect: true },
          { text: "Tout agent hospitalier ayant un badge d'accès aux locaux de l'établissement", isCorrect: false },
          { text: "Les proches et la famille du patient sans restriction ni condition particulière", isCorrect: false },
          { text: "Les étudiants en stage ayant accès libre pour leur formation professionnelle", isCorrect: false }
        ],
        explanation: "L'accès au DPI est strictement limité aux professionnels de santé participant directement à la prise en charge du patient. Le secret médical et la confidentialité s'imposent à tous. Les étudiants n'ont accès qu'aux dossiers des patients dont ils assurent les soins, sous supervision. Les proches n'ont pas d'accès direct sauf délégation expresse du patient ou cas particuliers prévus par la loi."
      },
      {
        text: "Combien de temps minimum un dossier patient doit-il être conservé en établissement de santé après la dernière consultation ?",
        options: [
          { text: "20 ans à compter de la date du dernier passage dans l'établissement de santé", isCorrect: true },
          { text: "10 ans à compter de la date de sortie ou de décès du patient hospitalisé", isCorrect: false },
          { text: "5 ans à compter de la date de clôture administrative du dossier informatisé", isCorrect: false },
          { text: "30 ans à compter de la date de la première consultation dans l'établissement", isCorrect: false }
        ],
        explanation: "En France, le Code de la santé publique fixe la durée de conservation minimale du dossier médical à 20 ans à compter de la date du dernier séjour ou de la dernière consultation. Pour les mineurs, la conservation se prolonge jusqu'aux 28 ans du patient. Ce délai permet de faire face aux éventuels recours juridiques et à la continuité des soins à long terme."
      },
      {
        text: "Quelle information doit obligatoirement figurer dans le dossier infirmier du patient hospitalisé ?",
        options: [
          { text: "Les transmissions ciblées, les soins réalisés, les paramètres surveillés et les évaluations", isCorrect: true },
          { text: "Les opinions personnelles de l'infirmier sur le comportement du patient hospitalisé", isCorrect: false },
          { text: "Les informations confidentielles confiées par le patient hors cadre des soins", isCorrect: false },
          { text: "Les diagnostics médicaux posés par le médecin lors de la visite quotidienne", isCorrect: false }
        ],
        explanation: "Le dossier infirmier doit contenir des données factuelles et objectives : les transmissions ciblées (DAR), les soins réalisés avec horodatage et signature, les paramètres surveillés, les évaluations (douleur, risques, autonomie) et les éléments éducatifs. Les jugements de valeur sur la personnalité du patient, les propos confidentiels hors soins ou les diagnostics médicaux n'appartiennent pas au dossier infirmier."
      },
      {
        text: "Qu'est-ce que le secret médical partagé dans le cadre d'une équipe pluridisciplinaire ?",
        options: [
          { text: "Le partage d'informations confidentielles entre professionnels concourant à la même prise en charge", isCorrect: true },
          { text: "La divulgation du dossier patient à l'ensemble du personnel administratif de l'établissement", isCorrect: false },
          { text: "L'obligation de transmettre les données médicales aux assurances du patient sans consentement", isCorrect: false },
          { text: "Le partage illimité des informations médicales avec tous les soignants de l'hôpital", isCorrect: false }
        ],
        explanation: "Le secret médical partagé (article L. 1110-4 du CSP) autorise le partage d'informations confidentielles entre professionnels de santé participant à la même prise en charge, dans la limite du besoin d'en connaître. Ce partage est limité aux informations utiles à la coordination des soins pour ce patient. Il ne s'étend pas à l'ensemble du personnel de l'établissement."
      },
      {
        text: "Que risque un infirmier qui consulte le dossier d'un patient dont il n'assure pas la prise en charge ?",
        options: [
          { text: "Des sanctions disciplinaires et pénales pour violation du secret professionnel", isCorrect: true },
          { text: "Une simple remarque verbale du cadre de santé sans conséquence administrative", isCorrect: false },
          { text: "Une formation obligatoire sur la confidentialité imposée par la direction des soins", isCorrect: false },
          { text: "Un avertissement écrit au dossier RH sans possibilité de sanction disciplinaire", isCorrect: false }
        ],
        explanation: "La violation du secret professionnel est une faute grave. L'infirmier qui consulte sans nécessité clinique le dossier d'un patient dont il n'a pas la charge s'expose à : des sanctions disciplinaires (avertissement à révocation), des sanctions pénales (1 an d'emprisonnement et 15 000 € d'amende selon l'article 226-13 du Code pénal), et un signalement à l'Ordre infirmier. Les traces numériques permettent d'identifier les consultations illicites."
      },
      {
        text: "Dans quel délai un établissement de santé doit-il répondre à une demande d'accès au dossier médical ?",
        options: [
          { text: "Dans les 8 jours pour les séjours récents, dans les 2 mois pour les séjours anciens", isCorrect: true },
          { text: "Dans les 30 jours calendaires quel que soit l'ancienneté du dossier médical", isCorrect: false },
          { text: "Dans les 48 heures pour tout dossier quelle que soit la date de l'hospitalisation", isCorrect: false },
          { text: "Dans les 15 jours ouvrables à compter de la réception de la demande écrite", isCorrect: false }
        ],
        explanation: "Selon la loi du 4 mars 2002 et ses décrets d'application, le délai de réponse est de 8 jours pour les séjours ayant eu lieu dans les 5 dernières années, et de 2 mois pour les séjours plus anciens. La demande peut être faite directement par le patient, ou par un tiers légalement habilité. L'accès peut être direct (consultation sur place) ou par copie transmise au patient."
      },
      {
        text: "Quel est le rôle du RGPD dans la gestion du dossier patient informatisé en établissement de santé ?",
        options: [
          { text: "Il encadre le traitement des données de santé en imposant sécurité, consentement et droits d'accès", isCorrect: true },
          { text: "Il interdit tout traitement numérique des données médicales dans les établissements de santé", isCorrect: false },
          { text: "Il remplace intégralement la loi du 4 mars 2002 pour les dossiers informatisés", isCorrect: false },
          { text: "Il s'applique uniquement aux données de santé collectées en dehors de l'hôpital", isCorrect: false }
        ],
        explanation: "Le RGPD (Règlement Général sur la Protection des Données, 2018) s'applique aux données de santé qui sont des données sensibles de catégorie spéciale. Il impose : des mesures de sécurité renforcées, un traitement sur base légale (soin), des droits renforcés pour les patients (accès, rectification, effacement limité), et la désignation d'un DPO (Délégué à la Protection des Données) dans les établissements de santé."
      }
    ]
  }
];
