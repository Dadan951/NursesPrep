module.exports = [
  {
    title: "Télémédecine — téléconsultation, téléexpertise et cadre réglementaire",
    description: "Quiz sur la télémédecine : définitions, actes, cadre légal et pratiques infirmières associées.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: 11,
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle loi française a posé le cadre juridique fondateur de la télémédecine en définissant ses actes ?",
        options: [
          { text: "La loi HPST du 21 juillet 2009", isCorrect: true },
          { text: "La loi Informatique et Libertés de 1978", isCorrect: false },
          { text: "La loi de modernisation du système de santé de 2016", isCorrect: false },
          { text: "La loi relative aux droits des malades de 2002", isCorrect: false }
        ],
        explanation: "La loi HPST (Hôpital, Patients, Santé, Territoires) de 2009 a défini la télémédecine et ses cinq actes constitutifs dans l'article L.6316-1 du Code de la santé publique."
      },
      {
        text: "Lequel de ces actes est reconnu comme un acte de télémédecine au sens réglementaire français ?",
        options: [
          { text: "La téléexpertise entre deux professionnels de santé", isCorrect: true },
          { text: "L'envoi d'un courriel entre un médecin et un patient", isCorrect: false },
          { text: "La consultation téléphonique sans support vidéo", isCorrect: false },
          { text: "La diffusion d'un webinaire de formation médicale", isCorrect: false }
        ],
        explanation: "La téléexpertise est l'un des cinq actes de télémédecine reconnus : elle permet à un professionnel de solliciter à distance l'avis d'un ou plusieurs confrères sur la base d'informations médicales liées à la prise en charge d'un patient."
      },
      {
        text: "La téléconsultation exige que le médecin consultant ait eu, au préalable, quelle condition vis-à-vis du patient ?",
        options: [
          { text: "Une consultation physique antérieure chez le médecin traitant désigné", isCorrect: true },
          { text: "Une autorisation écrite de la CPAM avant chaque acte réalisé", isCorrect: false },
          { text: "Un accord préalable du directeur de l'établissement concerné", isCorrect: false },
          { text: "Un abonnement actif à une plateforme agréée par l'ARS locale", isCorrect: false }
        ],
        explanation: "En règle générale, la téléconsultation nécessite qu'une consultation physique ait eu lieu préalablement avec le médecin traitant, afin de s'assurer de la continuité et de la qualité des soins (principe de « connaissance antérieure du patient »)."
      },
      {
        text: "Quel est le rôle principal de l'infirmier lors d'une téléconsultation assistée en structure de soins ?",
        options: [
          { text: "Faciliter l'examen clinique à distance et relayer les données au médecin", isCorrect: true },
          { text: "Rédiger l'ordonnance validée par le médecin téléconsultant distant", isCorrect: false },
          { text: "Facturer l'acte de téléconsultation auprès de l'assurance maladie", isCorrect: false },
          { text: "Décider seul de la pertinence du recours à la téléconsultation médicale", isCorrect: false }
        ],
        explanation: "L'infirmier joue un rôle d'assistant lors de la téléconsultation : il prépare le patient, recueille les constantes, facilite la communication et peut réaliser des gestes d'examen guidés par le médecin à distance."
      },
      {
        text: "La téléassistance médicale se distingue de la téléconsultation car elle consiste à :",
        options: [
          { text: "Assister à distance un professionnel réalisant un acte médical ou de soin", isCorrect: true },
          { text: "Surveiller à domicile des paramètres vitaux de façon automatisée", isCorrect: false },
          { text: "Permettre au patient de consulter son dossier médical en ligne", isCorrect: false },
          { text: "Transmettre les images radiologiques d'un site à un autre centre", isCorrect: false }
        ],
        explanation: "La téléassistance médicale permet à un professionnel médical d'assister à distance un autre professionnel en train d'accomplir un acte (ex. : aide chirurgicale ou guidage lors d'un geste technique)."
      },
      {
        text: "Quel organisme agrée en France les plateformes de télémédecine utilisées dans le secteur public ?",
        options: [
          { text: "L'Agence Régionale de Santé (ARS) compétente selon le territoire", isCorrect: true },
          { text: "La Direction Générale de la Santé (DGS) au niveau national", isCorrect: false },
          { text: "La Haute Autorité de Santé (HAS) via un label qualité national", isCorrect: false },
          { text: "L'Ordre National des Médecins (CNOM) pour chaque région française", isCorrect: false }
        ],
        explanation: "Les ARS sont chargées d'organiser et d'autoriser les activités de télémédecine sur leur territoire dans le cadre des programmes régionaux de télémédecine définis par le Code de la santé publique."
      },
      {
        text: "Lequel de ces éléments est obligatoire pour garantir la conformité d'une téléconsultation médicale ?",
        options: [
          { text: "Le consentement éclairé et explicite du patient pour l'acte réalisé", isCorrect: true },
          { text: "La présence physique d'un interne ou d'un étudiant infirmier formé", isCorrect: false },
          { text: "L'utilisation exclusive d'un équipement fourni par l'Assurance maladie", isCorrect: false },
          { text: "La validation préalable de l'acte par le médecin conseil de la CPAM", isCorrect: false }
        ],
        explanation: "Le consentement éclairé du patient est une exigence fondamentale pour tout acte de télémédecine. Il doit être informé des conditions de la consultation à distance et accepter explicitement ce mode de prise en charge."
      },
      {
        text: "La télésurveillance médicale a pour objet principal de :",
        options: [
          { text: "Collecter des données physiologiques à domicile pour adapter la thérapeutique", isCorrect: true },
          { text: "Permettre aux infirmiers de prescrire des soins sans déplacement médical", isCorrect: false },
          { text: "Remplacer les consultations spécialisées dans les zones rurales isolées", isCorrect: false },
          { text: "Transmettre des ordonnances sécurisées entre pharmaciens et médecins", isCorrect: false }
        ],
        explanation: "La télésurveillance médicale permet au médecin d'interpréter à distance des données recueillies chez le patient (constantes, paramètres biologiques) afin d'adapter la prise en charge sans déplacement systématique."
      }
    ]
  },
  {
    title: "Réseaux sociaux et e-réputation — risques professionnels et bonnes pratiques",
    description: "Quiz sur les enjeux des réseaux sociaux pour les professionnels de santé : secret médical, e-réputation et comportements responsables.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: 12,
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Publier sur un réseau social une photo de patient identifiable sans son accord expose l'infirmier à :",
        options: [
          { text: "Des poursuites pénales pour violation du secret professionnel", isCorrect: true },
          { text: "Une simple mise en garde verbale du conseil de l'Ordre infirmier", isCorrect: false },
          { text: "Un rappel à l'ordre administratif sans conséquence disciplinaire réelle", isCorrect: false },
          { text: "Une suspension temporaire de son compte sur la plateforme concernée", isCorrect: false }
        ],
        explanation: "La divulgation d'informations sur un patient, même indirectement identifiable, constitue une violation du secret professionnel (article 226-13 du Code pénal) pouvant entraîner des sanctions pénales et disciplinaires."
      },
      {
        text: "Qu'entend-on par « e-réputation » dans le contexte professionnel de santé ?",
        options: [
          { text: "L'image perçue d'un professionnel à travers ses traces numériques en ligne", isCorrect: true },
          { text: "La réputation acquise lors de formations continues en e-learning santé", isCorrect: false },
          { text: "Le classement officiel d'un établissement par des organismes de certification", isCorrect: false },
          { text: "Le niveau de confiance accordé à un logiciel de santé par les autorités", isCorrect: false }
        ],
        explanation: "L'e-réputation désigne l'ensemble de l'image d'une personne ou d'un professionnel construite à partir de ses activités et publications numériques : commentaires, photos, statuts, avis de patients, etc."
      },
      {
        text: "Un étudiant infirmier partage sur Instagram des détails d'un cas clinique en masquant le nom. Cette pratique est :",
        options: [
          { text: "Toujours risquée car le patient peut rester identifiable par d'autres éléments", isCorrect: true },
          { text: "Autorisée si le cas est anonymisé en supprimant le nom et le prénom uniquement", isCorrect: false },
          { text: "Permise à des fins pédagogiques dans le cadre d'une formation initiale", isCorrect: false },
          { text: "Admise si le partage est limité aux contacts validés comme professionnels", isCorrect: false }
        ],
        explanation: "L'anonymisation partielle (suppression du seul nom) ne suffit pas : âge, date d'hospitalisation, pathologie rare et contexte peuvent permettre une ré-identification. Le secret professionnel s'applique à tout élément permettant d'identifier une personne."
      },
      {
        text: "Quel principe fondamental doit guider la communication professionnelle d'un infirmier sur les réseaux sociaux ?",
        options: [
          { text: "La distinction claire entre sphère professionnelle et sphère personnelle", isCorrect: true },
          { text: "La promotion active de son établissement pour améliorer son attractivité", isCorrect: false },
          { text: "La publication régulière d'actualités médicales pour valoriser son expertise", isCorrect: false },
          { text: "Le partage d'expériences de soins pour humaniser l'image soignante globale", isCorrect: false }
        ],
        explanation: "Le professionnel de santé doit maintenir une frontière nette entre vie professionnelle et vie personnelle en ligne. Tout contenu lié aux patients, à l'établissement ou aux collègues doit respecter le secret professionnel et l'obligation de réserve."
      },
      {
        text: "La CNIL recommande aux professionnels de santé utilisant les réseaux sociaux de :",
        options: [
          { text: "Vérifier et restreindre les paramètres de confidentialité de leurs comptes", isCorrect: true },
          { text: "Déclarer toute activité sur les réseaux sociaux auprès de leur direction", isCorrect: false },
          { text: "Utiliser uniquement des plateformes certifiées par le ministère de la Santé", isCorrect: false },
          { text: "Désactiver leurs comptes personnels pendant la durée de leur contrat professionnel", isCorrect: false }
        ],
        explanation: "La CNIL conseille aux utilisateurs de maîtriser les paramètres de confidentialité de leurs comptes pour contrôler qui peut accéder à leurs publications et éviter la diffusion incontrôlée d'informations sensibles."
      },
      {
        text: "Un commentaire négatif sur les soins reçus, publié par un patient sur un forum public, constitue pour l'infirmier :",
        options: [
          { text: "Une atteinte potentielle à sa réputation nécessitant une réponse mesurée", isCorrect: true },
          { text: "Un motif légal de plainte immédiate auprès du conseil de l'Ordre infirmier", isCorrect: false },
          { text: "Une infraction pénale qualifiée de diffamation sanctionnée automatiquement", isCorrect: false },
          { text: "Un élément sans conséquence car les avis en ligne n'ont aucune valeur légale", isCorrect: false }
        ],
        explanation: "Un commentaire négatif peut nuire à la réputation professionnelle. La réponse appropriée est mesurée, professionnelle et respectueuse du secret médical. La diffamation est possible si les propos sont faux, mais cela doit être évalué au cas par cas."
      },
      {
        text: "Lequel de ces comportements constitue une bonne pratique numérique pour un professionnel infirmier ?",
        options: [
          { text: "Ne jamais accepter en contact des patients actuels ou anciens sur ses réseaux", isCorrect: true },
          { text: "Partager des articles médicaux en identifiant les patients concernés comme exemples", isCorrect: false },
          { text: "Publier des selfies en tenue professionnelle pour humaniser l'image soignante", isCorrect: false },
          { text: "Rejoindre des groupes privés de patients pour mieux comprendre leurs besoins", isCorrect: false }
        ],
        explanation: "Il est recommandé de ne pas établir de liens sur les réseaux sociaux avec des patients afin de préserver la relation thérapeutique, éviter les conflits d'intérêts et protéger à la fois le patient et le professionnel."
      },
      {
        text: "Le « droit à l'oubli » numérique permet à un professionnel de santé de :",
        options: [
          { text: "Demander la suppression de contenus le concernant dans certaines conditions légales", isCorrect: true },
          { text: "Effacer automatiquement tous ses messages après 30 jours sur toute plateforme", isCorrect: false },
          { text: "Obliger un moteur de recherche à supprimer tout contenu jugé défavorable", isCorrect: false },
          { text: "Retirer ses publications passées sans aucune condition ni délai légal prévu", isCorrect: false }
        ],
        explanation: "Le droit à l'oubli, consacré par le RGPD, permet de demander la suppression ou le déréférencement de données personnelles sous certaines conditions (données inexactes, traitement illicite, etc.). Ce n'est pas un droit absolu et chaque demande est examinée individuellement."
      }
    ]
  },
  {
    title: "Prescription électronique — traçabilité, alertes et sécurisation",
    description: "Quiz sur la prescription médicale électronique : cadre réglementaire, systèmes d'alertes, traçabilité et sécurité des données.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: 13,
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "La prescription électronique améliore la sécurité médicamenteuse principalement en :",
        options: [
          { text: "Réduisant les erreurs liées à l'illisibilité des prescriptions manuscrites", isCorrect: true },
          { text: "Permettant à l'infirmier de modifier la posologie en cas d'oubli du médecin", isCorrect: false },
          { text: "Supprimant totalement la nécessité d'une double vérification infirmière", isCorrect: false },
          { text: "Garantissant que toutes les interactions médicamenteuses sont détectées en aval", isCorrect: false }
        ],
        explanation: "L'illisibilité des ordonnances manuscrites est une source reconnue d'erreurs médicamenteuses. La prescription électronique normalise la saisie et rend les informations claires, réduisant ainsi ce type d'erreurs."
      },
      {
        text: "Quel type d'alerte un logiciel de prescription peut-il générer automatiquement pour le prescripteur ?",
        options: [
          { text: "Une alerte d'interaction médicamenteuse entre deux molécules co-prescrites", isCorrect: true },
          { text: "Une alerte financière sur le coût excessif d'une prescription pour le patient", isCorrect: false },
          { text: "Une alerte d'incompatibilité de personnalité entre le médecin et le pharmacien", isCorrect: false },
          { text: "Une alerte administrative signalant un retard dans la saisie du dossier médical", isCorrect: false }
        ],
        explanation: "Les logiciels de prescription électronique intègrent des bases de données pharmacologiques permettant de détecter en temps réel les interactions médicamenteuses, les contre-indications, les allergies et les surdosages potentiels."
      },
      {
        text: "La traçabilité de l'administration d'un médicament dans un logiciel de soins implique que l'infirmier doit :",
        options: [
          { text: "Valider chaque administration avec son identifiant personnel dans le système", isCorrect: true },
          { text: "Imprimer une feuille de traçabilité signée à remettre au médecin traitant", isCorrect: false },
          { text: "Demander au patient de signer électroniquement après chaque prise médicamenteuse", isCorrect: false },
          { text: "Informer le pharmacien par messagerie après chaque administration effectuée", isCorrect: false }
        ],
        explanation: "La traçabilité informatique de l'administration médicamenteuse exige que chaque infirmier s'identifie avec ses propres codes d'accès pour valider l'acte. Cela garantit la responsabilité individuelle et la fiabilité de l'historique."
      },
      {
        text: "Qu'est-ce que le « Plan médicament » électronique dans un logiciel de soins infirmiers ?",
        options: [
          { text: "Le récapitulatif informatisé de toutes les prescriptions actives d'un patient", isCorrect: true },
          { text: "Le document comptable regroupant les coûts des traitements prescrits en HDJ", isCorrect: false },
          { text: "La liste des médicaments en rupture de stock signalée par la pharmacie centrale", isCorrect: false },
          { text: "Le formulaire électronique de demande d'accès à un médicament hors AMM", isCorrect: false }
        ],
        explanation: "Le plan médicament électronique est une vue synthétique et chronologique de toutes les prescriptions en cours pour un patient, intégrant les horaires d'administration, les voies, les doses et l'état de validation de chaque prise."
      },
      {
        text: "La prescription nominative sécurisée des stupéfiants en milieu hospitalier exige :",
        options: [
          { text: "Un ordonnancier sécurisé numéroté ou son équivalent électronique certifié", isCorrect: true },
          { text: "La présence simultanée de deux médecins au moment de la prescription validée", isCorrect: false },
          { text: "Une autorisation préalable de l'ANSM pour chaque prescription individuelle", isCorrect: false },
          { text: "La signature manuscrite du patient avant toute délivrance par la pharmacie", isCorrect: false }
        ],
        explanation: "Les stupéfiants font l'objet d'une réglementation spécifique : la prescription doit être rédigée sur ordonnance sécurisée numérotée (ou son équivalent électronique homologué) pour assurer la traçabilité et prévenir les abus."
      },
      {
        text: "En cas de panne du logiciel de prescription électronique, la procédure de secours recommandée est :",
        options: [
          { text: "Utiliser la procédure dégradée papier définie par le protocole de l'établissement", isCorrect: true },
          { text: "Suspendre toutes les administrations jusqu'au retour du système informatique", isCorrect: false },
          { text: "Demander au médecin de réécrire toutes les prescriptions par SMS sécurisé", isCorrect: false },
          { text: "Utiliser le système d'un autre service de soins le temps de la restauration", isCorrect: false }
        ],
        explanation: "Les établissements disposent de procédures dégradées papier pour les situations de panne informatique. Ces protocoles permettent d'assurer la continuité des soins en toute sécurité jusqu'au rétablissement du système."
      },
      {
        text: "Quel est l'intérêt principal de la «  réconciliation médicamenteuse » facilitée par l'outil électronique ?",
        options: [
          { text: "Comparer le traitement habituel du patient avec les prescriptions hospitalières", isCorrect: true },
          { text: "Vérifier que le médecin a respecté les recommandations des référentiels publiés", isCorrect: false },
          { text: "Calculer automatiquement le coût total du traitement pour le remboursement", isCorrect: false },
          { text: "Synchroniser les prescriptions entre tous les services d'un même établissement", isCorrect: false }
        ],
        explanation: "La réconciliation médicamenteuse consiste à comparer de façon structurée le traitement suivi par le patient avant l'hospitalisation avec les prescriptions réalisées à l'admission, afin d'identifier et corriger toute divergence non intentionnelle."
      },
      {
        text: "Qui est habilité à saisir une prescription médicale dans le logiciel de soins d'un établissement ?",
        options: [
          { text: "Le médecin ou le chirurgien-dentiste habilité selon la réglementation en vigueur", isCorrect: true },
          { text: "L'infirmier coordinateur de soins sous délégation écrite du cadre de santé", isCorrect: false },
          { text: "Tout membre de l'équipe soignante après validation par le médecin référent", isCorrect: false },
          { text: "Le pharmacien hospitalier pour les médicaments à dispensation contrôlée uniquement", isCorrect: false }
        ],
        explanation: "La prescription médicale est un acte médical réservé au médecin (et au chirurgien-dentiste ou sage-femme dans leur champ de compétence). L'infirmier ne peut pas prescrire, même sous délégation informelle ; il exécute et trace l'administration."
      }
    ]
  },
  {
    title: "Intelligence artificielle en santé — applications, limites et enjeux éthiques",
    description: "Quiz sur l'IA en santé : outils cliniques, aide à la décision, biais algorithmiques et responsabilité professionnelle.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: 14,
    difficulty: "hard",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "En imagerie médicale, l'intelligence artificielle est principalement utilisée pour :",
        options: [
          { text: "Aider à détecter des anomalies et à classifier des images radiologiques", isCorrect: true },
          { text: "Remplacer le radiologue dans l'interprétation définitive des clichés réalisés", isCorrect: false },
          { text: "Éliminer la nécessité de contrôle de qualité des équipements d'imagerie", isCorrect: false },
          { text: "Réduire la dose de rayonnements reçus par le patient lors des examens", isCorrect: false }
        ],
        explanation: "L'IA en imagerie médicale joue un rôle d'aide à la détection (anomalies, lésions cancéreuses, fractures) et de classification d'images. Elle assiste le radiologue mais ne se substitue pas à son jugement clinique final."
      },
      {
        text: "Un algorithme d'IA utilisé pour prédire le risque de réhospitalisation présente un biais si :",
        options: [
          { text: "Il a été entraîné sur une population non représentative des patients réels actuels", isCorrect: true },
          { text: "Il est plus rapide que l'évaluation clinique réalisée par un infirmier expérimenté", isCorrect: false },
          { text: "Il intègre des données provenant de plusieurs établissements de santé différents", isCorrect: false },
          { text: "Il nécessite une validation manuelle par le médecin avant toute décision clinique", isCorrect: false }
        ],
        explanation: "Un biais algorithmique survient lorsque les données d'entraînement ne représentent pas fidèlement la population cible (biais de sélection, sous-représentation de certains groupes). Cela produit des prédictions inexactes ou discriminatoires."
      },
      {
        text: "Le règlement européen sur l'IA (AI Act) classe les outils d'IA médicaux selon :",
        options: [
          { text: "Un niveau de risque allant de minimal à inacceptable pour chaque application", isCorrect: true },
          { text: "La vitesse de traitement des données patient en millisecondes par algorithme", isCorrect: false },
          { text: "Le coût de développement et de déploiement de chaque solution commerciale", isCorrect: false },
          { text: "La nationalité du fabricant et le pays de commercialisation de l'outil", isCorrect: false }
        ],
        explanation: "L'AI Act européen adopte une approche fondée sur le risque : les applications d'IA médicale sont généralement classées comme « à haut risque », ce qui implique des exigences strictes de transparence, de robustesse et de supervision humaine."
      },
      {
        text: "Qu'est-ce que le principe d'«explicabilité» (XAI) en intelligence artificielle médicale ?",
        options: [
          { text: "La capacité d'un algorithme à justifier ses prédictions de manière compréhensible", isCorrect: true },
          { text: "L'obligation pour le fabricant de publier le code source de son logiciel médical", isCorrect: false },
          { text: "La possibilité pour le patient de contester les diagnostics posés par une IA", isCorrect: false },
          { text: "La transparence financière sur les coûts d'implémentation des solutions d'IA", isCorrect: false }
        ],
        explanation: "L'IA explicable (Explainable AI — XAI) désigne des algorithmes capables de fournir des explications compréhensibles par les cliniciens sur les raisons de leurs prédictions, ce qui est crucial pour maintenir la confiance et permettre la supervision médicale."
      },
      {
        text: "Lorsqu'un outil d'IA recommande une décision thérapeutique, la responsabilité médicale incombe :",
        options: [
          { text: "Au médecin qui prend la décision finale, indépendamment de l'outil utilisé", isCorrect: true },
          { text: "Au fabricant de l'algorithme si la recommandation s'avère cliniquement incorrecte", isCorrect: false },
          { text: "À l'établissement de santé qui a autorisé le déploiement de cet outil d'IA", isCorrect: false },
          { text: "À l'infirmier qui a saisi les données utilisées par l'algorithme pour décider", isCorrect: false }
        ],
        explanation: "En droit médical français, la responsabilité de la décision thérapeutique appartient au professionnel de santé qui la prend. L'IA est un outil d'aide ; le médecin reste responsable même s'il s'est appuyé sur une recommandation algorithmique."
      },
      {
        text: "Les chatbots de santé destinés aux patients présentent comme limite principale :",
        options: [
          { text: "L'incapacité à évaluer la gravité réelle d'une situation clinique complexe", isCorrect: true },
          { text: "L'absence de capacité à répondre en plusieurs langues différentes disponibles", isCorrect: false },
          { text: "Le coût trop élevé pour être déployés dans les établissements publics actuels", isCorrect: false },
          { text: "L'impossibilité technique d'être accessibles depuis un smartphone personnel", isCorrect: false }
        ],
        explanation: "Les chatbots santé peuvent fournir des informations générales mais ne peuvent pas évaluer finement une situation clinique complexe, percevoir des signes non verbaux ou prendre en compte le contexte global du patient comme le ferait un professionnel de santé."
      },
      {
        text: "L'enjeu éthique majeur du partage de données de santé pour entraîner des algorithmes d'IA est :",
        options: [
          { text: "Garantir le consentement et la protection de la vie privée des personnes concernées", isCorrect: true },
          { text: "Assurer que les algorithmes développés restent la propriété des hôpitaux publics", isCorrect: false },
          { text: "Vérifier que les chercheurs utilisent uniquement des données issues de CHU certifiés", isCorrect: false },
          { text: "S'assurer que les données sont stockées sur des serveurs locaux et non étrangers", isCorrect: false }
        ],
        explanation: "L'entraînement des algorithmes d'IA nécessite de grandes quantités de données de santé sensibles. L'enjeu éthique central est le respect du consentement des patients, la protection de la vie privée et la conformité au RGPD et aux référentiels HDS."
      },
      {
        text: "Un infirmier utilisant un outil d'aide à la décision clinique basé sur l'IA doit avant tout :",
        options: [
          { text: "Maintenir son jugement clinique critique face aux recommandations de l'outil", isCorrect: true },
          { text: "Suivre systématiquement les recommandations de l'IA pour optimiser les soins", isCorrect: false },
          { text: "Signaler chaque utilisation de l'outil à la direction des soins infirmiers", isCorrect: false },
          { text: "Vérifier que l'outil est validé par la HAS avant toute utilisation clinique régulière", isCorrect: false }
        ],
        explanation: "L'infirmier doit conserver son raisonnement clinique autonome et ne pas déléguer aveuglément sa décision à un outil algorithmique. L'IA est une aide, pas un substitut au jugement professionnel. L'esprit critique reste indispensable."
      }
    ]
  },
  {
    title: "Communication interprofessionnelle — outils collaboratifs et réunions de synthèse",
    description: "Quiz sur la communication entre professionnels de santé : transmissions ciblées, outils collaboratifs numériques et réunions pluridisciplinaires.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: 15,
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "La méthode SAED (ou SBAR en anglais) est utilisée en soins infirmiers pour :",
        options: [
          { text: "Structurer une communication orale urgente entre professionnels de santé", isCorrect: true },
          { text: "Organiser l'ordre de priorité des soins lors d'une prise en charge complexe", isCorrect: false },
          { text: "Documenter les soins infirmiers dans le dossier patient informatisé obligatoire", isCorrect: false },
          { text: "Évaluer le niveau de douleur d'un patient selon quatre critères standardisés", isCorrect: false }
        ],
        explanation: "SAED (Situation, Antécédents, Évaluation, Demande) est un outil de communication structurée permettant de transmettre rapidement et efficacement des informations critiques entre soignants, notamment lors d'une dégradation de l'état du patient."
      },
      {
        text: "Les transmissions ciblées en soins infirmiers se composent obligatoirement de :",
        options: [
          { text: "Une cible, des données, des actions et des résultats documentés avec précision", isCorrect: true },
          { text: "Un titre, un résumé, une conclusion et une signature numérique validée", isCorrect: false },
          { text: "Un diagnostic infirmier, un objectif, une évaluation et un plan de soins", isCorrect: false },
          { text: "Une observation, une analyse, une décision et un suivi à 24 heures prévu", isCorrect: false }
        ],
        explanation: "La structure des transmissions ciblées (méthode DAR) comprend : la Cible (problème identifié), les Données (observations), les Actions (interventions réalisées) et les Résultats (évaluation des actions). Elles permettent une communication concise et tracée."
      },
      {
        text: "Une messagerie sécurisée de santé (MSS) garantit principalement :",
        options: [
          { text: "Le chiffrement et la confidentialité des échanges de données médicales sensibles", isCorrect: true },
          { text: "La rapidité de transmission des résultats biologiques entre services hospitaliers", isCorrect: false },
          { text: "L'archivage automatique de tous les échanges dans le dossier patient partagé", isCorrect: false },
          { text: "La compatibilité des échanges entre tous les logiciels de soins existants", isCorrect: false }
        ],
        explanation: "La messagerie sécurisée de santé (type MSSanté) assure le chiffrement de bout en bout des messages et pièces jointes médicales, garantissant la confidentialité conformément aux exigences du Code de la santé publique et du RGPD."
      },
      {
        text: "La réunion de concertation pluridisciplinaire (RCP) en oncologie a pour objectif principal :",
        options: [
          { text: "Décider collégialement de la stratégie thérapeutique pour chaque patient discuté", isCorrect: true },
          { text: "Former les soignants aux nouvelles thérapies ciblées disponibles en oncologie", isCorrect: false },
          { text: "Évaluer les compétences des infirmiers dans la prise en charge des patients", isCorrect: false },
          { text: "Informer les patients des décisions prises par l'équipe médicale compétente", isCorrect: false }
        ],
        explanation: "La RCP est une réunion pluridisciplinaire obligatoire en oncologie où des spécialistes (oncologue, chirurgien, radiologue, etc.) discutent et décident collégialement de la meilleure stratégie thérapeutique pour chaque patient selon les référentiels."
      },
      {
        text: "Un outil collaboratif partagé (type agenda commun, tableau de bord) améliore la coordination en :",
        options: [
          { text: "Rendant les informations essentielles accessibles à tous les membres de l'équipe", isCorrect: true },
          { text: "Supprimant le besoin de transmissions orales entre les équipes de soins", isCorrect: false },
          { text: "Permettant à chaque soignant de modifier les prescriptions médicales validées", isCorrect: false },
          { text: "Remplaçant les réunions d'équipe hebdomadaires par des échanges écrits seuls", isCorrect: false }
        ],
        explanation: "Les outils collaboratifs partagés (tableaux de bord, plannings communs, plateformes de communication) améliorent la coordination en centralisant les informations pertinentes pour l'ensemble de l'équipe, sans supprimer les transmissions humaines indispensables."
      },
      {
        text: "Lors d'une réunion de synthèse pluridisciplinaire, le rôle de l'infirmier est de :",
        options: [
          { text: "Apporter son observation clinique et sa connaissance quotidienne du patient", isCorrect: true },
          { text: "Valider les prescriptions médicales proposées par les médecins participants", isCorrect: false },
          { text: "Rédiger le compte-rendu de réunion et le signer au nom de l'équipe médicale", isCorrect: false },
          { text: "Décider de l'orientation du patient en accord avec l'assistante sociale présente", isCorrect: false }
        ],
        explanation: "L'infirmier apporte une contribution précieuse en réunion de synthèse grâce à son observation clinique continue du patient (comportement, douleur, état psychologique, autonomie). Sa vision quotidienne complète celle des autres professionnels."
      },
      {
        text: "La continuité des soins entre deux équipes successives repose essentiellement sur :",
        options: [
          { text: "Des transmissions structurées, complètes et tracées dans le dossier patient", isCorrect: true },
          { text: "La mémoire individuelle de chaque soignant concernant l'état du patient", isCorrect: false },
          { text: "Des réunions quotidiennes obligatoires de deux heures entre toutes les équipes", isCorrect: false },
          { text: "L'appel téléphonique systématique au médecin traitant à chaque changement", isCorrect: false }
        ],
        explanation: "La continuité des soins repose sur des transmissions structurées (ciblées, SOAP ou DAR) tracées dans le dossier patient informatisé, accessibles à tous les soignants concernés. La mémoire individuelle est insuffisante et risquée."
      },
      {
        text: "La « check-list » sécurité chirurgicale de l'OMS est un exemple d'outil de communication interprofessionnelle car elle :",
        options: [
          { text: "Impose une vérification collective et verbalisée entre tous les membres du bloc", isCorrect: true },
          { text: "Remplace le dossier anesthésique en centralisant toutes les données du patient", isCorrect: false },
          { text: "Permet au chirurgien de déléguer la vérification à l'infirmier circulant seul", isCorrect: false },
          { text: "S'applique uniquement aux interventions classées comme chirurgie à haut risque", isCorrect: false }
        ],
        explanation: "La check-list « Sécurité du patient au bloc opératoire » de l'OMS est un protocole de communication interprofessionnelle structuré : chaque item est verbalisé et validé collectivement par le chirurgien, l'anesthésiste et l'infirmier de bloc, réduisant les erreurs évitables."
      }
    ]
  }
];
