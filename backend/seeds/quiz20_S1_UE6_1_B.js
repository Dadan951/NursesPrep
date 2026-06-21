module.exports = [
  {
    title: "Systèmes d'information hospitaliers (SIH)",
    description: "Quiz sur les composants, l'interopérabilité et les enjeux des systèmes d'information hospitaliers.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Systèmes d'information hospitaliers (SIH) — composants, interopérabilité et enjeux",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le rôle principal d'un Système d'Information Hospitalier (SIH) ?",
        options: [
          { text: "Gérer et partager l'ensemble des données médicales et administratives d'un établissement", isCorrect: true },
          { text: "Assurer uniquement la facturation des actes médicaux réalisés en consultation", isCorrect: false },
          { text: "Centraliser les commandes de médicaments auprès des laboratoires pharmaceutiques", isCorrect: false },
          { text: "Planifier les congés du personnel soignant selon les services hospitaliers", isCorrect: false }
        ],
        explanation: "Le SIH a pour mission de gérer, stocker et partager l'ensemble des informations médicales, paramédicales et administratives d'un établissement de santé, facilitant la coordination des soins."
      },
      {
        text: "Qu'est-ce que l'interopérabilité dans le contexte des SIH ?",
        options: [
          { text: "La capacité de différents systèmes informatiques à échanger et utiliser des données de façon cohérente", isCorrect: true },
          { text: "La possibilité pour les patients d'accéder à leur dossier depuis leur domicile", isCorrect: false },
          { text: "L'installation d'un logiciel unique identique dans tous les établissements de France", isCorrect: false },
          { text: "La sécurisation des données par un chiffrement de bout en bout reconnu nationalement", isCorrect: false }
        ],
        explanation: "L'interopérabilité désigne la capacité de systèmes hétérogènes à communiquer et à s'échanger des données de manière cohérente et exploitable, essentielle pour la continuité des soins."
      },
      {
        text: "Quel composant du SIH est dédié à la gestion des dossiers patients informatisés ?",
        options: [
          { text: "Le Dossier Patient Informatisé (DPI)", isCorrect: true },
          { text: "Le Progiciel de Gestion Intégré (PGI) financier", isCorrect: false },
          { text: "Le Système de Radiologie Numérique (PACS) dédié aux images", isCorrect: false },
          { text: "Le Système de Gestion des Ressources Humaines (SGRH)", isCorrect: false }
        ],
        explanation: "Le Dossier Patient Informatisé (DPI) est le composant central du SIH dédié à la gestion des informations cliniques du patient : antécédents, prescriptions, résultats, transmissions infirmières."
      },
      {
        text: "Quel standard est principalement utilisé pour l'interopérabilité des données de santé en France ?",
        options: [
          { text: "HL7 FHIR, standard international d'échange de données de santé structurées", isCorrect: true },
          { text: "XML/JSON générique sans profil spécifique au domaine de la santé", isCorrect: false },
          { text: "DICOM, standard réservé aux images médicales radiologiques uniquement", isCorrect: false },
          { text: "PDF/A, format d'archivage longue durée des documents administratifs", isCorrect: false }
        ],
        explanation: "HL7 FHIR (Fast Healthcare Interoperability Resources) est le standard international de référence pour l'échange de données de santé. DICOM concerne uniquement les images médicales."
      },
      {
        text: "Quel est l'un des principaux enjeux éthiques liés aux SIH ?",
        options: [
          { text: "La protection de la confidentialité des données personnelles de santé des patients", isCorrect: true },
          { text: "La réduction du nombre de professionnels de santé grâce à l'automatisation totale", isCorrect: false },
          { text: "L'augmentation du coût des logiciels pour financer la recherche médicale nationale", isCorrect: false },
          { text: "La standardisation des protocoles de soins pour supprimer toute décision clinique", isCorrect: false }
        ],
        explanation: "La protection des données personnelles de santé est un enjeu éthique et juridique majeur des SIH. Les données de santé sont des données sensibles soumises à des réglementations strictes (RGPD, secret médical)."
      },
      {
        text: "Qu'est-ce que le Programme de Médicalisation des Systèmes d'Information (PMSI) ?",
        options: [
          { text: "Un système de recueil standardisé d'activité médicale pour le financement hospitalier", isCorrect: true },
          { text: "Un programme de formation des médecins à l'utilisation des outils numériques", isCorrect: false },
          { text: "Un dispositif de télémédecine reliant les hôpitaux aux cabinets de ville libéraux", isCorrect: false },
          { text: "Un outil de planification des achats de matériel médical dans les hôpitaux publics", isCorrect: false }
        ],
        explanation: "Le PMSI est un système de recueil standardisé de l'activité médicale hospitalière. Il sert à la tarification à l'activité (T2A) et au financement des établissements de santé français."
      },
      {
        text: "Quelle est la différence entre un SIH et un Espace Numérique de Santé (ENS) ?",
        options: [
          { text: "Le SIH est interne à l'hôpital ; l'ENS est un espace personnel accessible au patient lui-même", isCorrect: true },
          { text: "Le SIH concerne les urgences ; l'ENS est réservé aux consultations de médecine générale", isCorrect: false },
          { text: "Le SIH est public et gratuit ; l'ENS est un service privé soumis à abonnement mensuel", isCorrect: false },
          { text: "Le SIH stocke les images ; l'ENS stocke les résultats biologiques des analyses médicales", isCorrect: false }
        ],
        explanation: "Le SIH est le système interne à l'établissement hospitalier pour gérer son activité. L'ENS (Mon espace santé) est un portail personnel permettant au patient d'accéder à ses données de santé."
      },
      {
        text: "Pourquoi la formation des soignants aux SIH est-elle indispensable ?",
        options: [
          { text: "Pour saisir correctement les données et garantir la fiabilité des informations partagées", isCorrect: true },
          { text: "Pour remplacer les réunions de transmissions orales par des notifications automatiques", isCorrect: false },
          { text: "Pour permettre aux soignants de modifier les prescriptions médicales en cas d'urgence", isCorrect: false },
          { text: "Pour réduire le temps de formation initiale des nouveaux professionnels paramédicaux", isCorrect: false }
        ],
        explanation: "La formation aux SIH est indispensable pour garantir la qualité et la fiabilité des données saisies, condition nécessaire à la continuité et à la sécurité des soins, notamment lors des transmissions."
      }
    ]
  },
  {
    title: "Recherche documentaire en soins infirmiers",
    description: "Quiz sur les bases de données, mots-clés et sources fiables pour la recherche documentaire.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Recherche documentaire — bases de données, mots-clés et sources fiables",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle base de données est la référence internationale pour la recherche en sciences infirmières ?",
        options: [
          { text: "CINAHL (Cumulative Index to Nursing and Allied Health Literature)", isCorrect: true },
          { text: "PubMed, base généraliste des sciences biomédicales et biologiques", isCorrect: false },
          { text: "Cochrane Library, bibliothèque spécialisée dans les revues systématiques", isCorrect: false },
          { text: "EM-Consulte, portail francophone de revues médicales et paramédicales", isCorrect: false }
        ],
        explanation: "CINAHL est la base de données de référence spécialisée en sciences infirmières et disciplines de santé alliées. PubMed est plus généraliste, Cochrane est spécialisée dans les méta-analyses."
      },
      {
        text: "Qu'est-ce qu'un descripteur (ou terme MeSH) dans une recherche documentaire ?",
        options: [
          { text: "Un terme standardisé issu d'un thésaurus pour indexer et rechercher des articles de façon uniforme", isCorrect: true },
          { text: "Un mot-clé libre choisi par le chercheur sans aucune contrainte de vocabulaire normalisé", isCorrect: false },
          { text: "Le titre abrégé d'une revue scientifique reconnue par une instance internationale", isCorrect: false },
          { text: "Un identifiant numérique attribué à chaque article par la base de données PubMed", isCorrect: false }
        ],
        explanation: "Les termes MeSH (Medical Subject Headings) sont des descripteurs standardisés organisés en thésaurus. Ils permettent d'indexer et de retrouver des articles indépendamment du vocabulaire utilisé par les auteurs."
      },
      {
        text: "Quel opérateur booléen permet d'élargir une recherche documentaire en combinant deux concepts ?",
        options: [
          { text: "OR — il retourne les articles contenant l'un ou l'autre des termes recherchés", isCorrect: true },
          { text: "AND — il retourne uniquement les articles contenant les deux termes simultanément", isCorrect: false },
          { text: "NOT — il exclut les articles contenant un terme spécifique de la recherche", isCorrect: false },
          { text: "NEAR — il recherche les termes dans une proximité définie en nombre de mots", isCorrect: false }
        ],
        explanation: "L'opérateur OR élargit la recherche en incluant tous les articles contenant l'un ou l'autre des termes (ou les deux). AND restreint la recherche, NOT exclut des résultats."
      },
      {
        text: "Comment évaluer la fiabilité d'une source d'information en santé trouvée sur internet ?",
        options: [
          { text: "Vérifier l'auteur, la date, les références citées et le comité de relecture de la source", isCorrect: true },
          { text: "Se fier uniquement au nombre de partages sur les réseaux sociaux professionnels", isCorrect: false },
          { text: "Privilégier les sites avec un design moderne et une charte graphique soignée", isCorrect: false },
          { text: "Considérer que tout site se terminant en .com contient des informations vérifiées", isCorrect: false }
        ],
        explanation: "L'évaluation d'une source repose sur des critères de qualité : identification de l'auteur et de ses qualifications, date de publication, références bibliographiques, processus de relecture et organisme éditeur."
      },
      {
        text: "Qu'est-ce que la stratégie PICO dans une recherche documentaire ?",
        options: [
          { text: "Un outil structurant la question clinique en Population, Intervention, Comparaison et Outcome", isCorrect: true },
          { text: "Un protocole de classification des articles selon leur niveau de preuve scientifique", isCorrect: false },
          { text: "Une méthode d'évaluation de la qualité rédactionnelle et stylistique d'un article", isCorrect: false },
          { text: "Un logiciel de gestion bibliographique pour trier et classer les références trouvées", isCorrect: false }
        ],
        explanation: "PICO (Population, Intervention, Comparaison, Outcome) est un cadre qui aide à formuler une question clinique précise avant de lancer une recherche documentaire, améliorant ainsi la pertinence des résultats."
      },
      {
        text: "Quel est l'avantage d'une recherche dans une base de données spécialisée par rapport à un moteur de recherche généraliste ?",
        options: [
          { text: "Elle indexe des articles relus par des pairs, avec des critères de sélection scientifiques rigoureux", isCorrect: true },
          { text: "Elle donne accès gratuitement et immédiatement à tous les textes intégraux des articles", isCorrect: false },
          { text: "Elle propose automatiquement des synthèses rédigées par une intelligence artificielle", isCorrect: false },
          { text: "Elle couvre davantage de sujets et de langues qu'une base de données spécialisée", isCorrect: false }
        ],
        explanation: "Les bases de données spécialisées (PubMed, CINAHL) indexent exclusivement des publications scientifiques soumises à un processus de révision par les pairs (peer-review), garantissant un niveau de rigueur scientifique supérieur aux résultats d'un moteur généraliste."
      },
      {
        text: "Qu'est-ce qu'une revue systématique dans le domaine de la recherche documentaire ?",
        options: [
          { text: "Une synthèse exhaustive et méthodique de l'ensemble des études disponibles sur une question", isCorrect: true },
          { text: "Un article décrivant de façon détaillée un seul cas clinique particulièrement rare", isCorrect: false },
          { text: "Un résumé court d'un article original rédigé par l'auteur principal de l'étude", isCorrect: false },
          { text: "Un éditorial d'opinion publié dans une revue médicale de référence internationale", isCorrect: false }
        ],
        explanation: "Une revue systématique recense, sélectionne et analyse de façon rigoureuse et reproductible l'ensemble des études publiées sur une question clinique précise. Elle représente un niveau de preuve élevé."
      },
      {
        text: "Quel logiciel est couramment utilisé pour gérer une bibliographie dans un travail de recherche ?",
        options: [
          { text: "Zotero, logiciel gratuit et open-source de gestion et de citation de références bibliographiques", isCorrect: true },
          { text: "Notepad++, éditeur de texte avancé pour la rédaction et la mise en page de documents", isCorrect: false },
          { text: "SPSS, logiciel statistique dédié à l'analyse quantitative de données de recherche", isCorrect: false },
          { text: "Mendix, plateforme de développement d'applications de gestion de données hospitalières", isCorrect: false }
        ],
        explanation: "Zotero est un logiciel libre de gestion bibliographique très utilisé en milieu académique. Il permet de collecter, organiser, citer et partager des références bibliographiques dans différents formats (APA, Vancouver, etc.)."
      }
    ]
  },
  {
    title: "Lecture critique d'article scientifique",
    description: "Quiz sur la grille d'analyse et les niveaux de preuve en lecture critique d'article.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Lecture critique d'article — grille d'analyse et niveaux de preuve",
    difficulty: "hard",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel niveau de preuve représente la méta-analyse selon la classification HAS ?",
        options: [
          { text: "Niveau 1 — niveau de preuve le plus élevé dans la hiérarchie des études scientifiques", isCorrect: true },
          { text: "Niveau 2 — niveau intermédiaire correspondant aux essais contrôlés randomisés uniques", isCorrect: false },
          { text: "Niveau 3 — niveau correspondant aux études de cohorte et aux études cas-témoins", isCorrect: false },
          { text: "Niveau 4 — niveau le plus bas correspondant aux avis d'experts et séries de cas", isCorrect: false }
        ],
        explanation: "Selon la classification de la Haute Autorité de Santé (HAS), les méta-analyses et revues systématiques d'essais contrôlés randomisés constituent le niveau de preuve 1, le plus élevé dans la hiérarchie des preuves."
      },
      {
        text: "Dans un article scientifique, que contient la section « Méthodes » ?",
        options: [
          { text: "La population étudiée, le design de l'étude, les outils de mesure et la procédure d'analyse", isCorrect: true },
          { text: "L'interprétation des résultats et leur mise en perspective avec la littérature existante", isCorrect: false },
          { text: "Les données brutes présentées sous forme de tableaux et de figures statistiques", isCorrect: false },
          { text: "Les recommandations pratiques pour appliquer les résultats au contexte clinique quotidien", isCorrect: false }
        ],
        explanation: "La section Méthodes décrit le protocole de recherche : la population étudiée, le type d'étude (design), les critères d'inclusion et d'exclusion, les outils de mesure utilisés et les méthodes d'analyse statistique."
      },
      {
        text: "Qu'est-ce qu'un biais de sélection dans une étude scientifique ?",
        options: [
          { text: "Une erreur systématique liée au mode de recrutement des participants rendant l'échantillon non représentatif", isCorrect: true },
          { text: "Une erreur de calcul statistique introduite lors de l'analyse des données quantitatives collectées", isCorrect: false },
          { text: "Une divergence entre les conclusions des auteurs et celles d'autres études similaires", isCorrect: false },
          { text: "Un conflit d'intérêt financier déclaré par l'auteur principal auprès de l'éditeur de la revue", isCorrect: false }
        ],
        explanation: "Le biais de sélection survient quand la méthode de recrutement des participants introduit une différence systématique entre l'échantillon étudié et la population cible, réduisant la validité externe de l'étude."
      },
      {
        text: "Pourquoi l'abstract (résumé) d'un article ne suffit-il pas pour une lecture critique rigoureuse ?",
        options: [
          { text: "Car il ne présente pas les détails méthodologiques ni les limites permettant d'évaluer la qualité de l'étude", isCorrect: true },
          { text: "Car il est systématiquement rédigé par le comité éditorial et non par les auteurs de l'étude", isCorrect: false },
          { text: "Car il est souvent traduit automatiquement et peut contenir des erreurs de terminologie", isCorrect: false },
          { text: "Car il ne mentionne pas les noms des auteurs ni les conflits d'intérêt déclarés", isCorrect: false }
        ],
        explanation: "L'abstract est une synthèse partielle qui omet souvent les détails méthodologiques essentiels, les biais potentiels et les limites de l'étude, éléments indispensables à une lecture critique complète et rigoureuse."
      },
      {
        text: "Qu'est-ce que la validité interne d'une étude ?",
        options: [
          { text: "La rigueur avec laquelle l'étude mesure ce qu'elle prétend mesurer sans biais majeurs identifiés", isCorrect: true },
          { text: "La possibilité de généraliser les résultats obtenus à d'autres populations ou contextes", isCorrect: false },
          { text: "Le fait que l'étude a été publiée dans une revue classée dans une base de données reconnue", isCorrect: false },
          { text: "La concordance entre les hypothèses initiales et les résultats finaux obtenus par les auteurs", isCorrect: false }
        ],
        explanation: "La validité interne désigne la rigueur méthodologique d'une étude : dans quelle mesure les résultats sont-ils attribuables à la variable étudiée et non à des facteurs de confusion ou à des biais?"
      },
      {
        text: "Qu'est-ce qu'un essai contrôlé randomisé (ECR) ?",
        options: [
          { text: "Une étude où les participants sont répartis au hasard entre un groupe expérimental et un groupe contrôle", isCorrect: true },
          { text: "Une étude qui suit des groupes de participants dans le temps sans intervention des chercheurs", isCorrect: false },
          { text: "Une étude rétrospective comparant des personnes malades à des personnes non malades apparentées", isCorrect: false },
          { text: "Une synthèse narrative d'articles sélectionnés selon les préférences thématiques du chercheur", isCorrect: false }
        ],
        explanation: "L'essai contrôlé randomisé (ECR) est le gold standard des études interventionnelles. La randomisation permet de répartir équitablement les facteurs de confusion entre les groupes, limitant ainsi les biais."
      },
      {
        text: "Que signifie le terme « peer-review » (évaluation par les pairs) ?",
        options: [
          { text: "Un processus d'évaluation anonyme d'un article par des experts du domaine avant publication", isCorrect: true },
          { text: "Une relecture orthographique et stylistique effectuée par l'éditeur avant impression de la revue", isCorrect: false },
          { text: "Une procédure de validation par les autorités sanitaires nationales avant toute publication", isCorrect: false },
          { text: "Un processus de vote des lecteurs pour sélectionner les meilleurs articles de l'année", isCorrect: false }
        ],
        explanation: "Le peer-review est l'évaluation critique et anonyme d'un manuscrit soumis par des experts indépendants du domaine. Ce processus garantit la qualité scientifique et la rigueur méthodologique avant publication."
      },
      {
        text: "Dans une grille d'analyse d'article, pourquoi évalue-t-on les conflits d'intérêt des auteurs ?",
        options: [
          { text: "Pour identifier d'éventuels biais de financement pouvant influencer les résultats et conclusions de l'étude", isCorrect: true },
          { text: "Pour vérifier que les auteurs possèdent les diplômes requis pour publier dans la revue choisie", isCorrect: false },
          { text: "Pour s'assurer que l'étude a été menée dans un établissement universitaire reconnu nationalement", isCorrect: false },
          { text: "Pour contrôler que les auteurs ont obtenu l'accord des participants avant de les inclure", isCorrect: false }
        ],
        explanation: "L'évaluation des conflits d'intérêt (financements par l'industrie pharmaceutique, liens avec des entreprises) est essentielle car ils peuvent introduire un biais favorisant des conclusions orientées en faveur du financeur."
      }
    ]
  },
  {
    title: "RGPD et données de santé",
    description: "Quiz sur les droits des patients et les obligations des soignants face au RGPD.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "RGPD et données de santé — droits des patients et obligations des soignants",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Que signifie l'acronyme RGPD ?",
        options: [
          { text: "Règlement Général sur la Protection des Données personnelles", isCorrect: true },
          { text: "Référentiel de Gestion des Protocoles de Données médicales", isCorrect: false },
          { text: "Registre Général des Prescriptions et Dossiers des patients hospitalisés", isCorrect: false },
          { text: "Règlement de Gouvernance des Professionnels de santé et Données numérisées", isCorrect: false }
        ],
        explanation: "Le RGPD (Règlement Général sur la Protection des Données) est un règlement européen entré en vigueur en mai 2018 qui encadre le traitement des données à caractère personnel dans l'Union Européenne."
      },
      {
        text: "Selon le RGPD, les données de santé sont classifiées dans quelle catégorie ?",
        options: [
          { text: "Données sensibles bénéficiant d'une protection renforcée par rapport aux données ordinaires", isCorrect: true },
          { text: "Données publiques accessibles à toute personne qui en fait la demande officielle", isCorrect: false },
          { text: "Données confidentielles soumises uniquement au secret médical et non au RGPD européen", isCorrect: false },
          { text: "Données personnelles ordinaires traitées selon les mêmes règles que les autres données", isCorrect: false }
        ],
        explanation: "Le RGPD classe les données de santé comme données à caractère personnel sensibles (article 9). Elles bénéficient d'une protection renforcée et leur traitement est en principe interdit sauf exceptions prévues par la loi."
      },
      {
        text: "Quel droit du patient lui permet d'obtenir une copie de ses données de santé détenues par un établissement ?",
        options: [
          { text: "Le droit d'accès, qui permet à toute personne d'obtenir une copie des données la concernant", isCorrect: true },
          { text: "Le droit à l'oubli, qui impose la suppression de toutes les données dès la demande effectuée", isCorrect: false },
          { text: "Le droit à la portabilité, exclusivement réservé aux données collectées avec consentement explicite", isCorrect: false },
          { text: "Le droit d'opposition, qui suspend le traitement des données pendant la durée de l'instruction", isCorrect: false }
        ],
        explanation: "Le droit d'accès (article 15 du RGPD) permet à toute personne de demander et d'obtenir une copie des données personnelles la concernant que détient un organisme, incluant les données de santé dans un délai d'un mois."
      },
      {
        text: "Quelle est la durée légale minimale de conservation du dossier patient dans un établissement de santé ?",
        options: [
          { text: "Vingt ans à compter de la dernière consultation ou du décès du patient concerné", isCorrect: true },
          { text: "Dix ans à compter de la date de création du dossier à l'entrée de l'établissement", isCorrect: false },
          { text: "Cinq ans à compter de la dernière mise à jour effectuée dans le dossier patient informatisé", isCorrect: false },
          { text: "Trente ans pour tous les dossiers sans exception en application du droit européen", isCorrect: false }
        ],
        explanation: "En France, le dossier médical hospitalier doit être conservé pendant 20 ans à compter de la date du dernier séjour ou de la dernière consultation externe, ou 10 ans après le décès du patient si cela représente un délai plus long."
      },
      {
        text: "Qu'est-ce que le consentement éclairé au sens du RGPD dans le cadre des soins ?",
        options: [
          { text: "Une manifestation libre, spécifique, éclairée et non ambiguë d'accord pour un traitement de données", isCorrect: true },
          { text: "La signature d'un formulaire générique d'admission acceptant toutes les conditions de l'établissement", isCorrect: false },
          { text: "Un accord oral donné par le patient lors de son entretien d'admission dans le service", isCorrect: false },
          { text: "Une autorisation tacite accordée par défaut si le patient ne s'y oppose pas expressément", isCorrect: false }
        ],
        explanation: "Selon le RGPD, le consentement doit être libre (sans pression), spécifique (pour chaque finalité), éclairé (après information complète) et non ambigu (acte positif clair). Il peut être retiré à tout moment."
      },
      {
        text: "Quelle autorité française contrôle le respect du RGPD et peut sanctionner les manquements ?",
        options: [
          { text: "La CNIL (Commission Nationale de l'Informatique et des Libertés)", isCorrect: true },
          { text: "L'HAS (Haute Autorité de Santé) compétente pour les établissements hospitaliers accrédités", isCorrect: false },
          { text: "L'ANSM (Agence Nationale de Sécurité du Médicament) pour les données pharmaceutiques", isCorrect: false },
          { text: "Le Conseil National de l'Ordre des Médecins pour les données des professionnels de santé", isCorrect: false }
        ],
        explanation: "La CNIL est l'autorité de contrôle française indépendante chargée de veiller au respect du RGPD et de la loi Informatique et Libertés. Elle peut prononcer des sanctions pouvant atteindre 4% du chiffre d'affaires mondial."
      },
      {
        text: "Quelle obligation s'impose aux soignants lors d'une violation de données de santé (cyberattaque, perte de données) ?",
        options: [
          { text: "Notifier la violation à la CNIL dans les 72 heures et informer les patients concernés si le risque est élevé", isCorrect: true },
          { text: "Régler le problème en interne sans obligation de déclaration si aucun patient n'a subi de préjudice", isCorrect: false },
          { text: "Contacter uniquement le responsable informatique sans démarche administrative obligatoire", isCorrect: false },
          { text: "Attendre l'audit annuel de sécurité pour signaler l'incident dans le rapport d'activité de l'établissement", isCorrect: false }
        ],
        explanation: "En cas de violation de données personnelles, le responsable de traitement doit notifier la CNIL dans les 72 heures. Si le risque pour les personnes est élevé, les patients concernés doivent également être informés directement."
      },
      {
        text: "Que signifie le principe de minimisation des données selon le RGPD ?",
        options: [
          { text: "Ne collecter que les données strictement nécessaires à la finalité poursuivie du traitement", isCorrect: true },
          { text: "Réduire au minimum la durée de conservation des données dans les systèmes d'information", isCorrect: false },
          { text: "Limiter l'accès aux données au seul responsable désigné dans chaque service hospitalier", isCorrect: false },
          { text: "Chiffrer toutes les données dès leur collecte pour minimiser le risque de divulgation", isCorrect: false }
        ],
        explanation: "Le principe de minimisation (article 5 RGPD) impose de ne collecter et de ne traiter que les données adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées."
      }
    ]
  },
  {
    title: "MSSanté et messagerie sécurisée de santé",
    description: "Quiz sur l'utilisation de MSSanté, ses règles d'usage et les échanges interprofessionnels sécurisés.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "MSSanté et messagerie sécurisée — utilisation, règles et échanges interprofessionnels",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Qu'est-ce que MSSanté (Messagerie Sécurisée de Santé) ?",
        options: [
          { text: "Un système de messagerie chiffré permettant l'échange sécurisé de données de santé entre professionnels", isCorrect: true },
          { text: "Un réseau social professionnel réservé aux médecins généralistes et spécialistes de ville", isCorrect: false },
          { text: "Un logiciel de téléconsultation permettant les consultations vidéo entre patient et médecin", isCorrect: false },
          { text: "Un espace de stockage cloud sécurisé pour l'archivage des dossiers patients informatisés", isCorrect: false }
        ],
        explanation: "MSSanté est la Messagerie Sécurisée de Santé, un espace de confiance permettant aux professionnels de santé d'échanger des données médicales sensibles de façon chiffrée et traçable, en conformité avec la réglementation."
      },
      {
        text: "Qui peut disposer d'une adresse de messagerie MSSanté ?",
        options: [
          { text: "Tout professionnel de santé enregistré au Répertoire Partagé des Professionnels de Santé (RPPS)", isCorrect: true },
          { text: "Tout citoyen disposant d'un compte Mon espace santé activé sur le portail national", isCorrect: false },
          { text: "Uniquement les médecins hospitaliers titulaires d'un poste dans un établissement public", isCorrect: false },
          { text: "Les établissements de santé mais pas les professionnels exerçant en cabinet libéral", isCorrect: false }
        ],
        explanation: "L'accès à MSSanté est réservé aux professionnels de santé référencés dans le RPPS (Répertoire Partagé des Professionnels de Santé) ou dans le RASS, attestant de leur statut professionnel enregistré."
      },
      {
        text: "Quel est l'avantage principal de MSSanté par rapport à une messagerie électronique classique ?",
        options: [
          { text: "Le chiffrement de bout en bout garantissant la confidentialité des données de santé échangées", isCorrect: true },
          { text: "La gratuité totale de l'abonnement pour tous les professionnels de santé sans exception", isCorrect: false },
          { text: "La capacité d'envoyer des pièces jointes de taille illimitée sans compression des fichiers", isCorrect: false },
          { text: "L'intégration automatique dans tous les logiciels de gestion de cabinet du marché français", isCorrect: false }
        ],
        explanation: "MSSanté utilise un chiffrement de bout en bout qui garantit que seuls l'expéditeur et le(s) destinataire(s) peuvent lire les messages. Cela assure la confidentialité des données de santé sensibles échangées entre professionnels."
      },
      {
        text: "Dans quel cadre légal l'utilisation de MSSanté est-elle recommandée pour les soignants ?",
        options: [
          { text: "Pour tout échange contenant des données de santé à caractère personnel entre professionnels de santé", isCorrect: true },
          { text: "Uniquement pour les ordonnances numériques transmises aux pharmaciens officinaux de ville", isCorrect: false },
          { text: "Exclusivement pour les demandes d'hospitalisation de patients provenant des urgences", isCorrect: false },
          { text: "Pour les communications administratives internes entre services au sein d'un même hôpital", isCorrect: false }
        ],
        explanation: "MSSanté est recommandée (et souvent exigée par le RGPD et la politique de sécurité des systèmes d'information de santé) pour tout échange de données personnelles de santé entre professionnels, quel que soit le contexte."
      },
      {
        text: "Que doit contenir un message MSSanté pour être conforme aux bonnes pratiques d'échange ?",
        options: [
          { text: "L'identité du patient, l'objet médical précis du message et l'identité de l'expéditeur professionnel", isCorrect: true },
          { text: "Uniquement le numéro de sécurité sociale du patient pour respecter la pseudonymisation", isCorrect: false },
          { text: "Le diagnostic complet, les antécédents familiaux et la liste exhaustive de tous les traitements", isCorrect: false },
          { text: "Une copie intégrale de l'ensemble du dossier patient pour garantir la continuité des soins", isCorrect: false }
        ],
        explanation: "Un message MSSanté conforme doit identifier clairement le patient (nom, prénom, date de naissance), préciser l'objet médical de la communication et être signé par l'expéditeur professionnel identifiable. La minimisation des données s'applique aussi."
      },
      {
        text: "Quel organisme est à l'origine du déploiement et de la gestion de MSSanté ?",
        options: [
          { text: "L'ANS (Agence du Numérique en Santé), opérateur public du numérique en santé", isCorrect: true },
          { text: "La CNIL, autorité de contrôle de la protection des données personnelles en France", isCorrect: false },
          { text: "L'Ordre National des Médecins, responsable de la déontologie médicale professionnelle", isCorrect: false },
          { text: "Le Ministère des Finances, compétent pour les systèmes d'information des services publics", isCorrect: false }
        ],
        explanation: "L'ANS (Agence du Numérique en Santé, anciennement ASIP Santé) est l'organisme public qui porte et opère le dispositif MSSanté, définissant les règles du cadre de confiance et supervisant les opérateurs de messagerie."
      },
      {
        text: "Qu'est-ce que l'espace de confiance MSSanté garantit aux professionnels de santé ?",
        options: [
          { text: "Que l'identité des destinataires est vérifiée et qu'ils exercent bien une profession de santé reconnue", isCorrect: true },
          { text: "Que tous les messages envoyés sont automatiquement intégrés dans le dossier patient informatisé", isCorrect: false },
          { text: "Que les messages peuvent être transférés librement à des tiers sans restriction réglementaire", isCorrect: false },
          { text: "Que la connexion est accessible depuis n'importe quel appareil sans authentification renforcée", isCorrect: false }
        ],
        explanation: "L'espace de confiance MSSanté garantit que tous les détenteurs d'une adresse MSSanté sont des professionnels de santé dont l'identité a été vérifiée via le RPPS, assurant ainsi l'authenticité des échanges entre professionnels."
      },
      {
        text: "Pourquoi un infirmier ne doit-il pas utiliser sa messagerie personnelle (Gmail, Outlook) pour envoyer des données patient ?",
        options: [
          { text: "Car ces messageries ne chiffrent pas les données et hébergent les messages sur des serveurs non certifiés HDS", isCorrect: true },
          { text: "Car ces messageries sont bloquées par les pare-feux des établissements de santé publics", isCorrect: false },
          { text: "Car l'utilisation de messageries personnelles est sanctionnée pénalement par le code pénal", isCorrect: false },
          { text: "Car ces messageries sont incompatibles avec les formats de fichiers médicaux standardisés", isCorrect: false }
        ],
        explanation: "Les messageries personnelles (Gmail, Outlook grand public) ne chiffrent pas de façon conforme les données de santé et leurs serveurs ne sont pas certifiés HDS (Hébergeur de Données de Santé), exposant le professionnel à une violation du RGPD et du secret professionnel."
      }
    ]
  }
];
