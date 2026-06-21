// UE 6.1 - Méthodes de travail et TIC — chapitres 16-20 (Semestre 1 IFSI)
module.exports = [
  // ─── 16. Planification des soins numériques ────────────────────────────────
  {
    title: "Planification des soins numériques — logiciels et coordination",
    description: "Quiz sur les logiciels de planning infirmier, la coordination interprofessionnelle et la traçabilité numérique des soins, Semestre 1 IFSI.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Planification des soins numériques — logiciels de planning et coordination",
    difficulty: "easy",
    duration: 12,
    isPublished: true,
    questions: [
      {
        text: "Quel est le principal avantage d'un logiciel de planning des soins par rapport à un tableau papier ?",
        options: [
          { text: "Il permet la mise à jour en temps réel accessible à toute l'équipe", isCorrect: true },
          { text: "Il supprime définitivement le besoin de transmissions verbales", isCorrect: false },
          { text: "Il garantit l'absence totale de doublons dans les actes réalisés", isCorrect: false },
          { text: "Il remplace automatiquement le dossier patient informatisé", isCorrect: false }
        ],
        explanation: "La mise à jour en temps réel et l'accessibilité partagée sont les atouts majeurs d'un logiciel de planning : toute modification est immédiatement visible par tous les membres de l'équipe, ce qui réduit les erreurs de coordination."
      },
      {
        text: "Dans un logiciel de planification des soins, que désigne la notion de « prescription connectée » ?",
        options: [
          { text: "Une ordonnance envoyée automatiquement à la pharmacie de ville", isCorrect: false },
          { text: "Une prescription saisie par le médecin directement dans le dossier patient partagé", isCorrect: true },
          { text: "Un SMS envoyé au patient pour lui rappeler son traitement", isCorrect: false },
          { text: "Une ordonnance signée électroniquement par l'infirmière référente", isCorrect: false }
        ],
        explanation: "La prescription connectée est intégrée au dossier patient informatisé (DPI) : le médecin saisit directement ses prescriptions dans le système, l'infirmière les consulte et valide les actes réalisés sans ressaisie papier."
      },
      {
        text: "Lequel de ces logiciels est spécifiquement conçu pour la gestion des soins en établissement de santé français ?",
        options: [
          { text: "Crossway / Clinicom (Dedalus)", isCorrect: true },
          { text: "Microsoft Project (Microsoft)", isCorrect: false },
          { text: "Asana / Monday.com (outils généralistes)", isCorrect: false },
          { text: "Google Calendar partagé (Google Workspace)", isCorrect: false }
        ],
        explanation: "Crossway (anciennement Clinicom, édité par Dedalus) est un DPI largement déployé dans les hôpitaux français. Il intègre planning des soins, prescriptions médicales et traçabilité des actes infirmiers."
      },
      {
        text: "Quel indicateur numérique permet de vérifier qu'un soin planifié a bien été réalisé dans le logiciel ?",
        options: [
          { text: "La validation de l'acte avec horodatage et identifiant du soignant", isCorrect: true },
          { text: "La suppression de la tâche dans le planning une fois terminée", isCorrect: false },
          { text: "Un code couleur rouge apposé automatiquement par le système", isCorrect: false },
          { text: "Un message automatique envoyé au cadre de santé par e-mail", isCorrect: false }
        ],
        explanation: "La traçabilité numérique repose sur la validation de l'acte : l'infirmière confirme la réalisation, le logiciel enregistre l'heure exacte et l'identifiant du professionnel, ce qui garantit l'imputabilité et la sécurité des soins."
      },
      {
        text: "Qu'est-ce qu'un chemin clinique (ou care pathway) dans un logiciel de planification ?",
        options: [
          { text: "Un itinéraire géographique tracé pour les soins à domicile", isCorrect: false },
          { text: "Un protocole de soins standardisé planifié sur la durée d'hospitalisation", isCorrect: true },
          { text: "Un graphique montrant l'évolution de la douleur du patient", isCorrect: false },
          { text: "Un agenda partagé entre le patient et son médecin traitant", isCorrect: false }
        ],
        explanation: "Le chemin clinique est une séquence prédéfinie de soins et d'examens planifiés pour une pathologie donnée. Il est intégré dans le logiciel et se décline automatiquement pour chaque patient concerné, assurant standardisation et traçabilité."
      },
      {
        text: "En SSIAD (Service de Soins Infirmiers À Domicile), quel outil numérique facilite la coordination entre les aides-soignants itinérants ?",
        options: [
          { text: "Un logiciel de télégestion avec tablette ou smartphone professionnel", isCorrect: true },
          { text: "Un fax sécurisé envoyé chaque matin par la coordinatrice", isCorrect: false },
          { text: "Un tableau blanc partagé dans les locaux du service", isCorrect: false },
          { text: "Un cahier de liaison laissé chez chaque patient à domicile", isCorrect: false }
        ],
        explanation: "Les logiciels de télégestion (ex. Millésime, Apologic) permettent aux aides-soignants itinérants de consulter leur planning sur tablette, de badger à l'entrée et à la sortie du domicile et de transmettre les observations en temps réel."
      },
      {
        text: "Quelle fonctionnalité d'un logiciel de planning des soins contribue directement à la prévention des erreurs médicamenteuses ?",
        options: [
          { text: "L'affichage de la photo du patient sur chaque fiche de soins", isCorrect: false },
          { text: "La vérification automatique des doublons et des incompatibilités médicamenteuses", isCorrect: true },
          { text: "L'envoi d'un SMS de rappel au patient avant chaque prise de médicament", isCorrect: false },
          { text: "La génération d'un rapport mensuel d'activité pour la direction", isCorrect: false }
        ],
        explanation: "L'aide à la prescription électronique intègre des alertes automatiques en cas de doublon, d'allergie connue ou d'interaction médicamenteuse, réduisant significativement les erreurs par rapport à la prescription papier."
      },
      {
        text: "Dans le cadre de la coordination interprofessionnelle numérique, que permet la messagerie sécurisée de santé (MSSanté) ?",
        options: [
          { text: "L'envoi de données de santé chiffrées entre professionnels habilités", isCorrect: true },
          { text: "La publication d'informations de santé sur un réseau social professionnel", isCorrect: false },
          { text: "L'accès des patients à leurs résultats d'analyses en ligne", isCorrect: false },
          { text: "Le partage de vidéos de formation entre établissements de santé", isCorrect: false }
        ],
        explanation: "MSSanté est le système officiel de messagerie électronique sécurisée pour les professionnels de santé en France. Il garantit la confidentialité des données via le chiffrement et est réservé aux professionnels ayant un compte vérifié."
      }
    ]
  },

  // ─── 17. Gestion documentaire ─────────────────────────────────────────────
  {
    title: "Gestion documentaire — archivage, conservation et destruction",
    description: "Quiz sur l'archivage des dossiers patients, les durées légales de conservation et les procédures de destruction sécurisée, Semestre 1 IFSI.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Gestion documentaire — archivage, durée de conservation et destruction sécurisée",
    difficulty: "medium",
    duration: 12,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la durée légale minimale de conservation du dossier médical d'un patient adulte hospitalisé en France ?",
        options: [
          { text: "5 ans à compter de la dernière consultation ou hospitalisation", isCorrect: false },
          { text: "20 ans à compter de la dernière prise en charge dans l'établissement", isCorrect: true },
          { text: "10 ans à compter de la date de naissance du patient", isCorrect: false },
          { text: "30 ans à compter de la date d'admission initiale dans l'établissement", isCorrect: false }
        ],
        explanation: "Selon l'article R. 1112-7 du Code de la santé publique, le dossier médical doit être conservé pendant 20 ans à compter de la date du dernier séjour ou de la dernière consultation externe du patient dans l'établissement."
      },
      {
        text: "Quelle durée de conservation s'applique au dossier médical d'un patient décédé sans héritier connu ?",
        options: [
          { text: "10 ans à compter de la date du décès du patient", isCorrect: true },
          { text: "5 ans à compter de la clôture du dossier par le médecin", isCorrect: false },
          { text: "20 ans à compter de la dernière prise en charge du patient", isCorrect: false },
          { text: "Destruction immédiate après certification du décès établi", isCorrect: false }
        ],
        explanation: "En cas de décès, la durée de conservation est de 10 ans à compter du décès lorsque aucun héritier n'est connu, pour permettre d'éventuelles actions en responsabilité ou demandes d'accès ultérieures."
      },
      {
        text: "Qu'est-ce qu'un Système d'Archivage Électronique (SAE) homologué dans les établissements de santé ?",
        options: [
          { text: "Un disque dur externe chiffré utilisé par le service informatique", isCorrect: false },
          { text: "Un système garantissant l'intégrité et la pérennité des documents numériques dans le temps", isCorrect: true },
          { text: "Un logiciel de sauvegarde automatique des e-mails professionnels", isCorrect: false },
          { text: "Un serveur partagé accessible uniquement au directeur de l'établissement", isCorrect: false }
        ],
        explanation: "Un SAE certifié (norme NF Z 42-013 / ISO 14641) garantit l'authenticité, l'intégrité, la lisibilité et la disponibilité des documents archivés sur toute la durée légale de conservation, avec une valeur probante reconnue."
      },
      {
        text: "Selon le RGPD, que doit garantir l'établissement concernant les données de santé archivées ?",
        options: [
          { text: "Leur accessibilité gratuite et illimitée à tout citoyen européen", isCorrect: false },
          { text: "Leur exactitude, leur sécurité et leur limitation à la durée nécessaire", isCorrect: true },
          { text: "Leur publication annuelle dans un rapport d'activité public", isCorrect: false },
          { text: "Leur transfert obligatoire vers un serveur basé en France uniquement", isCorrect: false }
        ],
        explanation: "Le RGPD impose plusieurs principes : exactitude des données, sécurité adaptée (confidentialité, intégrité), et limitation de la conservation (les données ne sont gardées que le temps nécessaire à leur finalité légale)."
      },
      {
        text: "Quelle procédure de destruction est obligatoire pour les dossiers papier contenant des données de santé ?",
        options: [
          { text: "Le déchiquetage sécurisé par une société agréée avec certificat de destruction", isCorrect: true },
          { text: "L'incinération dans les poubelles de tri sélectif de l'établissement", isCorrect: false },
          { text: "Le recyclage standard dans les bacs à papier de l'établissement", isCorrect: false },
          { text: "La mise en carton scellée stockée dans une cave pendant dix ans", isCorrect: false }
        ],
        explanation: "Les dossiers papier contenant des données de santé doivent être détruits par déchiquetage sécurisé (niveau P-4 minimum selon DIN 66399), idéalement par une société agréée délivrant un certificat de destruction conforme au RGPD."
      },
      {
        text: "Qu'est-ce que le plan de classement dans une gestion documentaire hospitalière ?",
        options: [
          { text: "Le planning des agents chargés du rangement des archives physiques", isCorrect: false },
          { text: "Une arborescence hiérarchique définissant l'organisation et la codification des documents", isCorrect: true },
          { text: "La liste des documents à détruire en fin d'exercice budgétaire", isCorrect: false },
          { text: "Un tableau de bord mesurant le taux de remplissage des armoires d'archives", isCorrect: false }
        ],
        explanation: "Le plan de classement est le référentiel organisationnel décrivant comment les documents sont catégorisés, codifiés et rangés (physiquement ou numériquement), permettant un accès rapide et systématique à chaque document."
      },
      {
        text: "Dans quel délai un patient peut-il demander l'accès à son dossier médical après une hospitalisation ?",
        options: [
          { text: "Immédiatement et jusqu'à la fin de la durée légale de conservation", isCorrect: true },
          { text: "Uniquement dans les 48 heures suivant sa sortie de l'établissement", isCorrect: false },
          { text: "Seulement après un délai de réflexion de 8 jours imposé par la loi", isCorrect: false },
          { text: "Après validation obligatoire par le médecin responsable du service", isCorrect: false }
        ],
        explanation: "Depuis la loi du 4 mars 2002, le patient peut accéder à son dossier médical à tout moment, sans délai, directement ou via un médecin désigné, et pendant toute la durée légale de conservation (20 ans pour un adulte)."
      },
      {
        text: "Quel organisme public est chargé de contrôler la conformité des traitements de données de santé en France ?",
        options: [
          { text: "La Haute Autorité de Santé (HAS)", isCorrect: false },
          { text: "La Commission Nationale de l'Informatique et des Libertés (CNIL)", isCorrect: true },
          { text: "Le Conseil National de l'Ordre des Médecins (CNOM)", isCorrect: false },
          { text: "L'Agence du Numérique en Santé (ANS)", isCorrect: false }
        ],
        explanation: "La CNIL est l'autorité de contrôle française compétente pour le respect du RGPD et de la loi Informatique et Libertés. Elle peut mener des audits, recevoir des plaintes et prononcer des sanctions en cas de manquement."
      }
    ]
  },

  // ─── 18. Veille professionnelle ───────────────────────────────────────────
  {
    title: "Veille professionnelle — agrégateurs, newsletters et revues infirmières",
    description: "Quiz sur les outils et méthodes de veille professionnelle pour les infirmiers : agrégateurs RSS, newsletters spécialisées et revues scientifiques, Semestre 1 IFSI.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Veille professionnelle — agrégateurs, newsletters et revues infirmières",
    difficulty: "easy",
    duration: 12,
    isPublished: true,
    questions: [
      {
        text: "Qu'est-ce qu'un agrégateur RSS dans le cadre d'une veille professionnelle infirmière ?",
        options: [
          { text: "Un outil centralisant les flux d'actualités de plusieurs sources en un seul endroit", isCorrect: true },
          { text: "Un moteur de recherche spécialisé dans les bases de données médicales", isCorrect: false },
          { text: "Un logiciel de traduction automatique des articles étrangers en français", isCorrect: false },
          { text: "Un réseau social réservé aux professionnels de santé accrédités", isCorrect: false }
        ],
        explanation: "Un agrégateur RSS (ex. Feedly, Inoreader) collecte et affiche en un seul endroit les nouveaux contenus publiés par les sites et revues auxquels on s'est abonné via leurs flux RSS, facilitant une veille régulière et efficace."
      },
      {
        text: "Quelle est la principale revue infirmière française de référence pour la pratique clinique ?",
        options: [
          { text: "La Revue de l'Infirmière (Elsevier Masson)", isCorrect: true },
          { text: "Le Concours Médical (Impact Médecin)", isCorrect: false },
          { text: "The Lancet Nursing (The Lancet Group)", isCorrect: false },
          { text: "Le Quotidien du Médecin (Impact Médecin)", isCorrect: false }
        ],
        explanation: "La Revue de l'Infirmière (éditée par Elsevier Masson) est la principale revue clinique francophone destinée aux infirmiers. Elle publie des articles sur les soins, les protocoles, la formation et l'actualité réglementaire."
      },
      {
        text: "Quelle base de données bibliographique internationale est incontournable pour la recherche en sciences infirmières ?",
        options: [
          { text: "PubMed / MEDLINE (National Library of Medicine)", isCorrect: true },
          { text: "Légifrance (Direction de l'information légale)", isCorrect: false },
          { text: "Google Scholar uniquement (Google Inc.)", isCorrect: false },
          { text: "Wikipédia en version académique (Wikimedia Foundation)", isCorrect: false }
        ],
        explanation: "PubMed / MEDLINE est la base de référence mondiale en médecine et soins infirmiers. Elle indexe des millions d'articles avec résumés et propose un accès gratuit aux textes complets via PubMed Central pour de nombreuses publications."
      },
      {
        text: "Qu'est-ce qu'une newsletter professionnelle dans le contexte de la veille infirmière ?",
        options: [
          { text: "Un bulletin d'information périodique envoyé par e-mail sur un thème professionnel", isCorrect: true },
          { text: "Un forum de discussion entre infirmiers d'un même service hospitalier", isCorrect: false },
          { text: "Un magazine papier envoyé mensuellement par l'Ordre des Infirmiers", isCorrect: false },
          { text: "Un rapport annuel publié par la Haute Autorité de Santé", isCorrect: false }
        ],
        explanation: "Une newsletter professionnelle est une lettre d'information envoyée par e-mail à une fréquence régulière (hebdomadaire, mensuelle) sur des thèmes ciblés : nouvelles recommandations, articles clés, événements professionnels."
      },
      {
        text: "Quelle organisation française publie des recommandations de bonnes pratiques infirmières accessibles en ligne ?",
        options: [
          { text: "La Haute Autorité de Santé (HAS)", isCorrect: true },
          { text: "La Direction Générale des Impôts (DGFiP)", isCorrect: false },
          { text: "L'Institut National de la Statistique et des Études Économiques (INSEE)", isCorrect: false },
          { text: "Le Centre National de la Recherche Scientifique (CNRS)", isCorrect: false }
        ],
        explanation: "La HAS publie sur son site des recommandations de bonnes pratiques, des guides professionnels et des fiches mémo accessibles gratuitement. Elles constituent une source fiable et actualisée pour la pratique infirmière en France."
      },
      {
        text: "Que signifie le sigle « DEAS » dans le contexte de la formation et de la veille infirmière ?",
        options: [
          { text: "Diplôme d'État d'Aide-Soignant, référentiel de compétences aide-soignantes", isCorrect: true },
          { text: "Dispositif Électronique d'Accès aux Soins, plateforme de télémédecine", isCorrect: false },
          { text: "Données Épidémiologiques et Analyses Sanitaires, base de données HAS", isCorrect: false },
          { text: "Direction des Établissements et des Actes de Santé, ministère de la Santé", isCorrect: false }
        ],
        explanation: "Le DEAS est le Diplôme d'État d'Aide-Soignant. Dans le contexte de la veille, connaître les référentiels des métiers proches (AS, IDE, IPA) permet aux infirmiers de comprendre les évolutions de la délégation de tâches et du travail en équipe."
      },
      {
        text: "Comment évaluer la fiabilité d'un article trouvé sur le web dans le cadre d'une veille professionnelle ?",
        options: [
          { text: "En vérifiant l'auteur, la date, la source éditrice et les références bibliographiques", isCorrect: true },
          { text: "En comptant le nombre de likes et de partages sur les réseaux sociaux", isCorrect: false },
          { text: "En s'assurant que le site est bien référencé en première page Google", isCorrect: false },
          { text: "En contactant par téléphone l'auteur de l'article pour confirmation", isCorrect: false }
        ],
        explanation: "La méthode CARS (Credibility, Accuracy, Reasonableness, Support) ou la méthode CRAAP permet d'évaluer un document : qui est l'auteur (credentials), quand a-t-il été publié (actualité), qui édite le site (fiabilité), et y a-t-il des sources citées (exactitude)."
      },
      {
        text: "Quel avantage offre l'inscription à une alerte Google Scholar pour la veille infirmière ?",
        options: [
          { text: "La réception automatique par e-mail des nouvelles publications sur un mot-clé choisi", isCorrect: true },
          { text: "L'accès payant illimité à toutes les revues scientifiques internationales", isCorrect: false },
          { text: "La traduction instantanée de tous les articles en langue française", isCorrect: false },
          { text: "La certification académique des sources consultées par l'utilisateur", isCorrect: false }
        ],
        explanation: "Google Scholar Alerts envoie automatiquement par e-mail les nouvelles publications correspondant à des mots-clés prédéfinis (ex. « soins infirmiers », « prévention escarres »), permettant une veille passive sans connexion manuelle régulière."
      }
    ]
  },

  // ─── 19. Cybersécurité en santé ───────────────────────────────────────────
  {
    title: "Cybersécurité en santé — mots de passe, phishing et incidents",
    description: "Quiz sur la cybersécurité appliquée au secteur de la santé : bonnes pratiques des mots de passe, reconnaissance du phishing et gestion des incidents de sécurité, Semestre 1 IFSI.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Cybersécurité en santé — mots de passe, phishing et gestion des incidents",
    difficulty: "medium",
    duration: 12,
    isPublished: true,
    questions: [
      {
        text: "Selon les recommandations de l'ANSSI, quelle est la longueur minimale recommandée pour un mot de passe robuste ?",
        options: [
          { text: "Au moins 12 caractères mixtes (majuscules, minuscules, chiffres, symboles)", isCorrect: true },
          { text: "Au moins 6 caractères uniquement composés de chiffres faciles à mémoriser", isCorrect: false },
          { text: "Au moins 8 caractères identiques au login pour simplifier la connexion", isCorrect: false },
          { text: "Au moins 20 caractères mais réutilisable sur tous les services numériques", isCorrect: false }
        ],
        explanation: "L'ANSSI recommande un mot de passe d'au moins 12 caractères combinant majuscules, minuscules, chiffres et caractères spéciaux, unique pour chaque service, afin de résister aux attaques par force brute et par dictionnaire."
      },
      {
        text: "Qu'est-ce qu'une attaque par phishing (hameçonnage) dans un contexte hospitalier ?",
        options: [
          { text: "Un e-mail frauduleux imitant un expéditeur légitime pour voler des identifiants", isCorrect: true },
          { text: "Un logiciel espion installé physiquement sur les ordinateurs du service", isCorrect: false },
          { text: "Une attaque visant à saturer le réseau Wi-Fi de l'établissement de santé", isCorrect: false },
          { text: "Un accès non autorisé aux données via un câble branché sur un port USB", isCorrect: false }
        ],
        explanation: "Le phishing consiste à envoyer un e-mail apparemment légitime (faux DRH, fausse direction, faux prestataire) incitant le destinataire à cliquer sur un lien ou saisir ses identifiants sur un faux site, permettant le vol de credentials."
      },
      {
        text: "Quelle procédure doit immédiatement suivre un soignant qui suspecte une infection par ransomware sur son poste de travail ?",
        options: [
          { text: "Déconnecter le poste du réseau et alerter immédiatement le service informatique", isCorrect: true },
          { text: "Redémarrer l'ordinateur et tenter de supprimer manuellement le fichier suspect", isCorrect: false },
          { text: "Continuer à travailler normalement et signaler le problème en fin de journée", isCorrect: false },
          { text: "Envoyer par e-mail le fichier suspect au collègue le plus compétent en informatique", isCorrect: false }
        ],
        explanation: "En cas de ransomware suspecté, la priorité est l'isolation immédiate du poste (débranchement câble réseau ou désactivation Wi-Fi) pour éviter la propagation sur le réseau de l'établissement, suivie d'une alerte urgente à la DSI."
      },
      {
        text: "Que permet un gestionnaire de mots de passe (password manager) dans un contexte professionnel de santé ?",
        options: [
          { text: "Stocker et générer des mots de passe robustes et uniques pour chaque application", isCorrect: true },
          { text: "Partager automatiquement les mots de passe entre tous les membres de l'équipe", isCorrect: false },
          { text: "Supprimer la nécessité de s'authentifier sur les applications hospitalières", isCorrect: false },
          { text: "Créer un mot de passe universel utilisable sur toutes les plateformes de soin", isCorrect: false }
        ],
        explanation: "Un gestionnaire de mots de passe (Bitwarden, KeePass) génère et stocke de façon chiffrée des mots de passe complexes et uniques pour chaque application, accessibles via un unique mot de passe maître fort."
      },
      {
        text: "Qu'est-ce que l'authentification à deux facteurs (2FA) et pourquoi est-elle recommandée en santé ?",
        options: [
          { text: "Elle ajoute une étape de vérification (ex. code SMS) renforçant la sécurité des accès", isCorrect: true },
          { text: "Elle impose deux mots de passe identiques saisis successivement à la connexion", isCorrect: false },
          { text: "Elle permet à deux soignants de partager légalement le même compte applicatif", isCorrect: false },
          { text: "Elle divise la responsabilité des accès entre l'infirmière et le médecin chef", isCorrect: false }
        ],
        explanation: "La 2FA combine quelque chose que vous connaissez (mot de passe) et quelque chose que vous possédez (téléphone pour code OTP, badge). En santé, elle protège l'accès aux DPI et données sensibles même si le mot de passe est compromis."
      },
      {
        text: "Quelle est la politique de bureau propre (clean desk policy) et son intérêt en milieu de soin ?",
        options: [
          { text: "Ne laisser aucun document confidentiel visible et verrouiller son écran à chaque départ", isCorrect: true },
          { text: "Nettoyer physiquement son bureau avec un produit désinfectant chaque matin", isCorrect: false },
          { text: "Ranger les dossiers papier dans un ordre alphabétique standardisé par l'établissement", isCorrect: false },
          { text: "Imprimer les documents et les classer avant la fin de chaque poste de travail", isCorrect: false }
        ],
        explanation: "La politique de bureau propre exige de ne laisser aucun document sensible visible (dossiers, post-it avec mots de passe) et de verrouiller son session informatique dès qu'on quitte son poste, limitant les risques de violation de confidentialité."
      },
      {
        text: "À quel organisme un établissement de santé français doit-il déclarer une violation de données de santé dans les 72 heures ?",
        options: [
          { text: "À la CNIL (Commission Nationale de l'Informatique et des Libertés)", isCorrect: true },
          { text: "À l'ARS (Agence Régionale de Santé) de la région concernée", isCorrect: false },
          { text: "À la HAS (Haute Autorité de Santé) pour inscription au registre national", isCorrect: false },
          { text: "À l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information)", isCorrect: false }
        ],
        explanation: "Conformément à l'article 33 du RGPD, toute violation de données à caractère personnel (dont les données de santé) doit être notifiée à la CNIL dans un délai de 72 heures après sa découverte, sauf si elle est peu susceptible d'engendrer un risque."
      },
      {
        text: "Quel comportement est un signal d'alarme classique d'un e-mail de phishing ?",
        options: [
          { text: "Une adresse d'expéditeur légèrement différente du domaine officiel avec urgence anormale", isCorrect: true },
          { text: "Un e-mail écrit en français parfait sans faute d'orthographe et correctement signé", isCorrect: false },
          { text: "Un e-mail contenant uniquement une pièce jointe PDF en lecture seule", isCorrect: false },
          { text: "Un accusé de réception automatique indiquant que l'e-mail a été chiffré", isCorrect: false }
        ],
        explanation: "Les signaux typiques d'un phishing incluent : adresse d'expéditeur avec caractères substitués (ex. hopita|.fr au lieu de hopital.fr), ton urgent ou menaçant, lien pointant vers un domaine inconnu, demande d'identifiants ou de données bancaires."
      }
    ]
  },

  // ─── 20. Bilan de compétences numériques ──────────────────────────────────
  {
    title: "Bilan de compétences numériques — autoévaluation et formation continue",
    description: "Quiz sur l'autoévaluation des compétences numériques infirmières, les cadres de référence (PIX, e-Santé) et la formation continue en TIC, Semestre 1 IFSI.",
    semester: "Semestre 1",
    category: "UE 6.1 - Méthodes de travail et TIC",
    chapter: "Bilan de compétences numériques — autoévaluation et formation continue",
    difficulty: "medium",
    duration: 12,
    isPublished: true,
    questions: [
      {
        text: "Quel référentiel européen décrit les compétences numériques des citoyens et est utilisé pour l'autoévaluation en santé ?",
        options: [
          { text: "Le DigComp (Digital Competence Framework for Citizens) de la Commission européenne", isCorrect: true },
          { text: "Le référentiel PNNS (Programme National Nutrition Santé) de Santé Publique France", isCorrect: false },
          { text: "Le CECRL (Cadre Européen Commun de Référence pour les Langues) du Conseil de l'Europe", isCorrect: false },
          { text: "Le référentiel ISO 27001 de sécurité des systèmes d'information", isCorrect: false }
        ],
        explanation: "DigComp est le cadre de référence européen décrivant 21 compétences numériques en 5 domaines (information, communication, création, sécurité, résolution de problèmes). Il est adapté aux professionnels de santé via des déclinaisons sectorielles."
      },
      {
        text: "Qu'est-ce que la plateforme PIX et quel est son lien avec les professionnels de santé ?",
        options: [
          { text: "Un service public d'évaluation et de certification des compétences numériques en France", isCorrect: true },
          { text: "Un réseau social professionnel pour les infirmiers libéraux et salariés", isCorrect: false },
          { text: "Un outil de gestion des plannings numériques pour les établissements de santé", isCorrect: false },
          { text: "Une plateforme de e-learning réservée aux étudiants en médecine générale", isCorrect: false }
        ],
        explanation: "PIX (pix.fr) est le service public français de certification des compétences numériques basé sur DigComp. Les professionnels de santé peuvent l'utiliser pour évaluer et attester leurs compétences numériques dans le cadre du DPC ou du CPF."
      },
      {
        text: "Dans le cadre du Développement Professionnel Continu (DPC), quelle proportion des actions peut concerner les compétences numériques ?",
        options: [
          { text: "Toute action numérique contribuant à l'amélioration des pratiques est éligible au DPC", isCorrect: true },
          { text: "Exactement 20 % des heures de DPC annuelles doivent porter sur le numérique", isCorrect: false },
          { text: "Les compétences numériques sont exclues du DPC car non cliniques", isCorrect: false },
          { text: "Uniquement les formations dispensées par les éditeurs de logiciels hospitaliers", isCorrect: false }
        ],
        explanation: "Le DPC intègre toute action visant l'amélioration des pratiques professionnelles, y compris les compétences numériques (utilisation du DPI, télémédecine, cybersécurité). Les formations peuvent être réalisées en présentiel ou en e-learning."
      },
      {
        text: "Qu'est-ce qu'un portfolio numérique (e-portfolio) dans la formation infirmière ?",
        options: [
          { text: "Un dossier numérique personnel regroupant preuves de compétences et réflexions professionnelles", isCorrect: true },
          { text: "Un classeur papier numéroté contenant les résultats de tous les stages cliniques", isCorrect: false },
          { text: "Un logiciel de comptabilité pour gérer les remboursements de formation continue", isCorrect: false },
          { text: "Une base de données nationale centralisant les diplômes de tous les infirmiers", isCorrect: false }
        ],
        explanation: "L'e-portfolio est un espace numérique personnel où l'infirmier(e) rassemble des preuves de compétences (travaux, évaluations, certifications), des réflexions sur sa pratique et son parcours de formation, facilitant l'autoévaluation et la reconnaissance professionnelle."
      },
      {
        text: "Quel outil permet à un infirmier d'identifier ses lacunes numériques avant de construire son plan de formation ?",
        options: [
          { text: "Un questionnaire d'autoévaluation basé sur un référentiel de compétences numériques", isCorrect: true },
          { text: "Un entretien annuel avec le directeur général de l'établissement de santé", isCorrect: false },
          { text: "Un audit réalisé uniquement par le service informatique de l'établissement", isCorrect: false },
          { text: "Un test de vitesse de frappe au clavier standardisé au niveau national", isCorrect: false }
        ],
        explanation: "L'autoévaluation via un questionnaire structuré (type PIX, DigComp ou référentiel interne) permet d'identifier les domaines de compétences maîtrisés et les lacunes, constituant le point de départ d'un plan de développement numérique personnalisé."
      },
      {
        text: "Quel est le rôle d'un référent numérique de proximité (champion digital) dans un service de soins ?",
        options: [
          { text: "Accompagner ses collègues dans l'adoption des outils numériques et remonter les difficultés", isCorrect: true },
          { text: "Remplacer le service informatique pour la maintenance des ordinateurs du service", isCorrect: false },
          { text: "Interdire l'utilisation des smartphones personnels dans le service de soins", isCorrect: false },
          { text: "Former les étudiants en soins infirmiers à la programmation informatique", isCorrect: false }
        ],
        explanation: "Le référent numérique de proximité (ou champion digital) est un soignant formé pour soutenir ses collègues dans l'utilisation des outils numériques, recueillir leurs besoins et difficultés et servir d'interface entre les équipes de soins et la DSI."
      },
      {
        text: "Quel principe de l'andragogie (apprentissage adulte) est particulièrement important pour la formation numérique des infirmiers en exercice ?",
        options: [
          { text: "La formation doit être ancrée dans des situations professionnelles concrètes et immédiatement transférables", isCorrect: true },
          { text: "La formation doit suivre un programme identique pour tous sans adaptation individuelle", isCorrect: false },
          { text: "La formation doit se dérouler obligatoirement en présentiel dans une salle de classe", isCorrect: false },
          { text: "La formation doit évaluer uniquement les connaissances théoriques par QCM en fin de module", isCorrect: false }
        ],
        explanation: "L'andragogie (Malcolm Knowles) souligne que les adultes apprennent mieux quand la formation est directement applicable à leur pratique professionnelle. Pour les infirmiers, les formations numériques sont plus efficaces si elles utilisent les logiciels réels du service."
      },
      {
        text: "Comment le Compte Personnel de Formation (CPF) peut-il être utilisé par un infirmier pour développer ses compétences numériques ?",
        options: [
          { text: "En finançant des formations certifiantes éligibles, dont PIX et des formations en e-santé", isCorrect: true },
          { text: "En finançant uniquement les formations prescrites par l'employeur dans le plan de formation", isCorrect: false },
          { text: "En remplaçant le DPC pour toutes les formations obligatoires des professionnels de santé", isCorrect: false },
          { text: "En finançant des abonnements à des logiciels professionnels de bureautique personnelle", isCorrect: false }
        ],
        explanation: "Le CPF (Mon Compte Formation) permet à chaque salarié de financer des formations certifiantes éligibles (dont PIX, TOSA, formations e-santé inscrites au RNCP ou RS) de manière autonome, en complément du DPC qui cible spécifiquement les pratiques professionnelles de santé."
      }
    ]
  }
];
