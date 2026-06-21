module.exports = [
  {
    title: "Effets indésirables médicamenteux",
    description: "Classification, facteurs de risque et signalement des effets indésirables médicamenteux en pratique infirmière.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Chapitre 6 - Effets indésirables médicamenteux",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Selon la classification de l'OMS, un effet indésirable de type A (augmented) se caractérise par :",
        options: [
          { text: "Un effet prévisible, dose-dépendant et fréquent", isCorrect: true },
          { text: "Un effet imprévisible, non dose-dépendant et rare", isCorrect: false },
          { text: "Un effet différé apparaissant après l'arrêt du traitement", isCorrect: false },
          { text: "Un effet survenant uniquement chez des sujets génétiquement prédisposés", isCorrect: false }
        ],
        explanation: "Les effets de type A (Augmented) sont des extensions exagérées de l'effet pharmacologique du médicament. Ils sont prévisibles, dose-dépendants, fréquents et généralement réversibles à la réduction de dose."
      },
      {
        text: "Quel organisme est destinataire d'une déclaration de pharmacovigilance en France ?",
        options: [
          { text: "Le Centre Régional de Pharmacovigilance (CRPV) compétent", isCorrect: true },
          { text: "Le Conseil National de l'Ordre des Infirmiers (CNOI)", isCorrect: false },
          { text: "La Direction Générale de la Santé (DGS) uniquement", isCorrect: false },
          { text: "L'Assurance Maladie via le portail Ameli Pro", isCorrect: false }
        ],
        explanation: "Tout professionnel de santé qui suspecte un effet indésirable médicamenteux doit le déclarer au Centre Régional de Pharmacovigilance (CRPV) dont il dépend géographiquement, qui transmet ensuite à l'ANSM."
      },
      {
        text: "Le terme « iatrogénie médicamenteuse » désigne :",
        options: [
          { text: "Tout dommage causé par la prise en charge médicamenteuse d'un patient", isCorrect: true },
          { text: "Uniquement les erreurs médicamenteuses survenant à l'hôpital", isCorrect: false },
          { text: "Les effets indésirables liés exclusivement aux médicaments génériques", isCorrect: false },
          { text: "Les interactions entre deux médicaments de la même classe chimique", isCorrect: false }
        ],
        explanation: "La iatrogénie médicamenteuse englobe l'ensemble des conséquences néfastes liées à la prise en charge médicamenteuse, qu'il s'agisse d'effets indésirables, d'erreurs médicamenteuses ou de mésusage."
      },
      {
        text: "Parmi les facteurs de risque d'effets indésirables médicamenteux, lequel est lié au patient ?",
        options: [
          { text: "Une insuffisance rénale modifiant l'élimination du médicament", isCorrect: true },
          { text: "Un conditionnement similaire entre deux médicaments distincts", isCorrect: false },
          { text: "L'absence de double contrôle lors de la préparation des doses", isCorrect: false },
          { text: "Une prescription rédigée de façon illisible par le médecin", isCorrect: false }
        ],
        explanation: "L'insuffisance rénale est un facteur de risque intrinsèque au patient : elle réduit la clairance des médicaments éliminés par voie rénale, entraînant une accumulation et un risque de toxicité accru."
      },
      {
        text: "Une réaction anaphylactique après injection d'un médicament correspond à un effet indésirable de type :",
        options: [
          { text: "Type B (Bizarre), car imprévisible et indépendant de la dose", isCorrect: true },
          { text: "Type A (Augmented), car proportionnel à la dose administrée", isCorrect: false },
          { text: "Type C (Chronic), car lié à une utilisation prolongée du médicament", isCorrect: false },
          { text: "Type D (Delayed), car il survient plusieurs jours après la prise", isCorrect: false }
        ],
        explanation: "Les réactions anaphylactiques relèvent du type B (Bizarre) : elles sont imprévisibles, non dose-dépendantes, liées à des mécanismes immunologiques ou idiosyncrasiques, et peuvent survenir même pour de faibles doses."
      },
      {
        text: "Quelle information est indispensable dans une déclaration de pharmacovigilance ?",
        options: [
          { text: "Le ou les médicaments suspectés avec leur posologie et durée d'exposition", isCorrect: true },
          { text: "Le numéro de sécurité sociale complet du patient concerné", isCorrect: false },
          { text: "Les coordonnées bancaires du prescripteur pour le remboursement", isCorrect: false },
          { text: "L'avis du laboratoire pharmaceutique fabricant sur l'effet déclaré", isCorrect: false }
        ],
        explanation: "La déclaration doit comporter : le médicament suspecté (DCI, posologie, voie d'administration, durée), l'effet indésirable décrit précisément, les caractéristiques du patient et les coordonnées du déclarant. Le numéro de sécurité sociale complet n'est pas requis."
      },
      {
        text: "Un patient sous anticoagulant présente des hématomes spontanés. L'infirmier doit en priorité :",
        options: [
          { text: "Informer immédiatement le médecin et documenter l'effet observé", isCorrect: true },
          { text: "Interrompre le traitement anticoagulant sans en référer au médecin", isCorrect: false },
          { text: "Rassurer le patient car les hématomes sont toujours bénins", isCorrect: false },
          { text: "Augmenter la surveillance biologique hebdomadaire sans consulter", isCorrect: false }
        ],
        explanation: "Face à un effet indésirable suspecté, l'infirmier doit immédiatement en informer le médecin prescripteur, documenter l'observation dans le dossier de soins et ne jamais modifier ou interrompre un traitement sans prescription médicale."
      },
      {
        text: "Le délai d'imputabilité intrinsèque d'un médicament évalue :",
        options: [
          { text: "La probabilité que le médicament soit responsable de l'effet observé", isCorrect: true },
          { text: "Le délai légal pour déposer une déclaration de pharmacovigilance", isCorrect: false },
          { text: "La durée maximale d'utilisation autorisée par l'AMM du médicament", isCorrect: false },
          { text: "Le temps nécessaire pour observer l'effet thérapeutique attendu", isCorrect: false }
        ],
        explanation: "L'imputabilité intrinsèque évalue, selon des critères chronologiques et sémiologiques, la probabilité que le médicament suspect soit la cause réelle de l'effet indésirable observé chez un patient donné."
      }
    ]
  },
  {
    title: "Circuit du médicament à l'hôpital",
    description: "Prescription, dispensation, administration et traçabilité dans le circuit hospitalier du médicament.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Chapitre 7 - Circuit du médicament à l'hôpital",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "La prescription médicamenteuse hospitalière doit obligatoirement comporter :",
        options: [
          { text: "L'identité du patient, le médicament en DCI, la dose, la voie et la durée", isCorrect: true },
          { text: "Uniquement le nom commercial du médicament et la posologie journalière", isCorrect: false },
          { text: "La signature du cadre de santé en complément de celle du médecin", isCorrect: false },
          { text: "Le numéro de lot du médicament issu de la pharmacie hospitalière", isCorrect: false }
        ],
        explanation: "Une prescription médicamenteuse valide doit mentionner : l'identification du patient et du prescripteur, la date, le médicament en DCI (Dénomination Commune Internationale), la posologie, la voie d'administration, la fréquence et la durée du traitement."
      },
      {
        text: "La dispensation à délivrance nominative (DJIN) consiste à :",
        options: [
          { text: "Préparer des doses individualisées pour chaque patient identifié nominativement", isCorrect: true },
          { text: "Stocker les médicaments en vrac dans l'armoire de soins du service", isCorrect: false },
          { text: "Déléguer la préparation des doses à un aide-soignant formé", isCorrect: false },
          { text: "Délivrer les médicaments directement aux patients sans contrôle infirmier", isCorrect: false }
        ],
        explanation: "La DJIN (Dispensation Journalière Individuelle et Nominative) consiste à ce que la pharmacie prépare et délivre les médicaments pour chaque patient, identifié nominativement, pour une durée définie (généralement 24 heures)."
      },
      {
        text: "Lors de la traçabilité de l'administration d'un médicament, l'infirmier doit enregistrer :",
        options: [
          { text: "L'heure exacte d'administration, le médicament administré et sa signature", isCorrect: true },
          { text: "Uniquement la signature infirmière en fin de poste pour toutes les prises", isCorrect: false },
          { text: "Le nom du médecin prescripteur et l'accord verbal du patient", isCorrect: false },
          { text: "Le numéro de lot du médicament et la date de péremption du flacon", isCorrect: false }
        ],
        explanation: "La traçabilité impose d'enregistrer immédiatement après chaque administration : l'heure réelle d'administration, l'identification du médicament (et du lot pour certains produits), la voie utilisée et la signature de l'infirmier réalisateur."
      },
      {
        text: "Qu'est-ce que la règle des « 5 B » (ou 5 R) appliquée à l'administration médicamenteuse ?",
        options: [
          { text: "Bon patient, bon médicament, bonne dose, bonne voie, bon moment", isCorrect: true },
          { text: "Bon prescripteur, bon pharmacien, bonne infirmière, bonne traçabilité, bon délai", isCorrect: false },
          { text: "Bonne hygiène, bonne étiquette, bonne posologie, bonne durée, bon stock", isCorrect: false },
          { text: "Bon conditionnement, bon rang, bonne armoire, bon ordre, bonne sécurité", isCorrect: false }
        ],
        explanation: "La règle des 5 B garantit la sécurité de l'administration : vérifier que l'on administre le BON médicament, à la BONNE dose, par la BONNE voie, au BON patient et au BON moment. Certains ajoutent la bonne documentation (6e B)."
      },
      {
        text: "Une armoire sécurisée pour stupéfiants à l'hôpital doit être :",
        options: [
          { text: "Fermée à clé, avec un accès nominatif tracé et un registre tenu à jour", isCorrect: true },
          { text: "Accessible librement à tout le personnel soignant du service concerné", isCorrect: false },
          { text: "Réapprovisionnée directement par le laboratoire pharmaceutique fournisseur", isCorrect: false },
          { text: "Placée impérativement dans le bureau médical et non dans la salle de soins", isCorrect: false }
        ],
        explanation: "Les stupéfiants sont soumis à une réglementation stricte : armoire fermée à clé avec accès nominatif, registre de comptabilité obligatoire consignant chaque entrée et sortie, et contrôle régulier des stocks par la pharmacie."
      },
      {
        text: "Une erreur médicamenteuse interceptée avant l'administration doit être :",
        options: [
          { text: "Signalée via le système de déclaration des événements indésirables de l'établissement", isCorrect: true },
          { text: "Gardée confidentielle entre les professionnels impliqués pour éviter les sanctions", isCorrect: false },
          { text: "Notifiée uniquement si le patient a été effectivement exposé au médicament", isCorrect: false },
          { text: "Transmise directement au laboratoire fabricant du médicament concerné", isCorrect: false }
        ],
        explanation: "Même interceptée, toute erreur médicamenteuse (ou quasi-erreur) doit être déclarée dans le système de signalement interne de l'établissement (CREX, REMED). Cela permet une démarche qualité et la prévention d'incidents futurs, sans logique punitive."
      },
      {
        text: "La pharmacie à usage intérieur (PUI) est responsable de :",
        options: [
          { text: "La gestion, la préparation et la dispensation des médicaments à l'hôpital", isCorrect: true },
          { text: "La formation initiale des infirmiers aux techniques d'administration", isCorrect: false },
          { text: "La rédaction des protocoles thérapeutiques validés par la HAS", isCorrect: false },
          { text: "L'achat direct des médicaments auprès des patients en officine de ville", isCorrect: false }
        ],
        explanation: "La PUI assure la gestion des stocks, la préparation (notamment des préparations injectables et des chimiothérapies), le contrôle qualité et la dispensation de tous les médicaments utilisés dans l'établissement hospitalier."
      },
      {
        text: "Que doit faire l'infirmier si une prescription lui semble incorrecte ou dangereuse ?",
        options: [
          { text: "Contacter le médecin prescripteur avant toute administration pour lever le doute", isCorrect: true },
          { text: "Administrer le médicament en notant son désaccord dans le dossier de soins", isCorrect: false },
          { text: "Adapter lui-même la dose en fonction de son expérience professionnelle", isCorrect: false },
          { text: "Demander à un collègue infirmier de valider la prescription à sa place", isCorrect: false }
        ],
        explanation: "L'infirmier a l'obligation de s'assurer de la validité et de la sécurité de toute prescription avant administration. En cas de doute, il doit contacter le prescripteur AVANT d'agir. Il ne peut ni modifier ni ignorer une prescription, ni déléguer cette responsabilité."
      }
    ]
  },
  {
    title: "Administration IV — perfusions et calcul de doses",
    description: "Perfusions intraveineuses, calcul de débit, dosages et prévention des complications liées à la voie IV.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Chapitre 8 - Administration IV — perfusions, débit, calcul de doses et complications",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Un médecin prescrit 500 mL de sérum physiologique à passer en 4 heures en perfusion. Quel est le débit en gouttes par minute (1 mL = 20 gouttes) ?",
        options: [
          { text: "42 gouttes par minute environ", isCorrect: true },
          { text: "20 gouttes par minute environ", isCorrect: false },
          { text: "125 gouttes par minute environ", isCorrect: false },
          { text: "60 gouttes par minute environ", isCorrect: false }
        ],
        explanation: "Calcul : 500 mL × 20 gouttes/mL = 10 000 gouttes. Durée = 4 h × 60 min = 240 min. Débit = 10 000 ÷ 240 = 41,67 ≈ 42 gouttes/min. La formule est : (Volume en mL × facteur de gouttes) ÷ durée en minutes."
      },
      {
        text: "La voie intraveineuse directe (IVD) lente impose une durée d'injection minimale car :",
        options: [
          { text: "Une injection trop rapide peut provoquer des effets toxiques cardiaques ou vasculaires", isCorrect: true },
          { text: "Une injection rapide améliore l'absorption et l'efficacité du médicament", isCorrect: false },
          { text: "La lenteur est exigée uniquement pour les médicaments contenant du glucose", isCorrect: false },
          { text: "La réglementation impose 1 minute d'injection pour tous les médicaments IV", isCorrect: false }
        ],
        explanation: "Une IVD trop rapide peut dépasser la concentration plasmatique toxique du médicament avant sa dilution dans le volume sanguin, entraînant des effets cardio-vasculaires graves (arythmie, hypotension, arrêt cardiaque)."
      },
      {
        text: "La thrombophlébite sur cathéter veineux périphérique se manifeste par :",
        options: [
          { text: "Rougeur, chaleur, induration et douleur le long du trajet veineux", isCorrect: true },
          { text: "Frissons, fièvre et bactériémie sans signes locaux visibles à la ponction", isCorrect: false },
          { text: "Gonflement diffus du membre sans rougeur ni douleur localisée", isCorrect: false },
          { text: "Chute de pression artérielle et tachycardie sans signe local au point de perfusion", isCorrect: false }
        ],
        explanation: "La thrombophlébite sur cathéter se caractérise par des signes locaux inflammatoires : érythème, chaleur, induration palpable et douleur sur le trajet de la veine cathétérisée. Elle impose le retrait immédiat du cathéter et une rotation du site."
      },
      {
        text: "Un médecin prescrit de la dopamine à 5 µg/kg/min pour un patient de 70 kg. La seringue contient 200 mg de dopamine dans 50 mL de G5%. Quel débit régler sur la seringue électrique ?",
        options: [
          { text: "5,25 mL/h environ", isCorrect: true },
          { text: "10,5 mL/h environ", isCorrect: false },
          { text: "2,1 mL/h environ", isCorrect: false },
          { text: "21 mL/h environ", isCorrect: false }
        ],
        explanation: "Étapes : dose = 5 µg/kg/min × 70 kg = 350 µg/min = 21 000 µg/h = 21 mg/h. Concentration = 200 mg/50 mL = 4 mg/mL. Débit = 21 mg/h ÷ 4 mg/mL = 5,25 mL/h."
      },
      {
        text: "Pour prévenir la phlébite sur cathéter veineux périphérique, l'infirmier doit :",
        options: [
          { text: "Changer le cathéter toutes les 72 à 96 heures selon les recommandations", isCorrect: true },
          { text: "Rincer le cathéter avec une solution héparine systématiquement après chaque soin", isCorrect: false },
          { text: "Laisser le cathéter en place aussi longtemps que le patient est hospitalisé", isCorrect: false },
          { text: "Utiliser uniquement la veine jugulaire externe pour les perfusions prolongées", isCorrect: false }
        ],
        explanation: "Les recommandations préconisent de changer le cathéter veineux périphérique toutes les 72 à 96 heures (ou immédiatement en cas de signes d'infection/phlébite) pour réduire le risque de thrombophlébite et d'infection."
      },
      {
        text: "L'extravasation d'un médicament vésicant lors d'une perfusion IV impose :",
        options: [
          { text: "L'arrêt immédiat de la perfusion et l'alerte médicale sans retirer le cathéter", isCorrect: true },
          { text: "La poursuite lente de la perfusion pour diluer le médicament dans les tissus", isCorrect: false },
          { text: "L'application de chaleur locale pour favoriser la résorption du médicament", isCorrect: false },
          { text: "Le retrait immédiat du cathéter et le massage vigoureux du site touché", isCorrect: false }
        ],
        explanation: "En cas d'extravasation d'un médicament vésicant : arrêter immédiatement la perfusion, laisser le cathéter en place (pour aspirer le produit et injecter un antidote si disponible), alerter le médecin, ne pas masser et appliquer du froid (selon le protocole)."
      },
      {
        text: "Quel soluté de perfusion est isotonique au plasma et utilisé pour l'expansion volémique ?",
        options: [
          { text: "Le sérum physiologique à 0,9% de chlorure de sodium (NaCl 0,9%)", isCorrect: true },
          { text: "Le sérum glucosé à 5% utilisé comme apport calorique exclusivement", isCorrect: false },
          { text: "Le sérum glucosé hypertonique à 30% réservé aux hypoglycémies sévères", isCorrect: false },
          { text: "L'eau ppi (Pour Préparations Injectables) diluée dans le sang du patient", isCorrect: false }
        ],
        explanation: "Le NaCl 0,9% (sérum physiologique) est isotonique au plasma (osmolalité ≈ 308 mOsm/L). Il reste dans le secteur extravasculaire et est utilisé pour le remplissage vasculaire. Le G5% distribue dans tous les secteurs et n'est pas un soluté de remplissage."
      },
      {
        text: "Lors de la préparation d'une perfusion, l'infirmier doit vérifier en premier :",
        options: [
          { text: "La concordance entre la prescription médicale et le médicament préparé", isCorrect: true },
          { text: "La température ambiante de la salle de soins avant toute manipulation", isCorrect: false },
          { text: "Le numéro de poste infirmier responsable de la préparation du traitement", isCorrect: false },
          { text: "La compatibilité entre la marque du cathéter et celle de la tubulure choisie", isCorrect: false }
        ],
        explanation: "La première vérification est toujours la concordance entre la prescription médicale et le médicament à préparer (règle des 5 B). Ensuite viennent : la date de péremption, l'intégrité du conditionnement, la limpidité de la solution et la compatibilité des solutés."
      }
    ]
  },
  {
    title: "Voies IM, SC et ID — techniques et précautions",
    description: "Techniques d'injection intramusculaire, sous-cutanée et intradermique, sites anatomiques et précautions infirmières.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Chapitre 9 - Voies IM, SC et ID — techniques, sites et précautions infirmières",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Le site d'injection intramusculaire privilégié chez l'adulte selon les recommandations actuelles est :",
        options: [
          { text: "Le muscle vaste externe de la cuisse ou le muscle deltoïde selon le volume", isCorrect: true },
          { text: "Le quadrant supéro-interne de la fesse pour tous les médicaments injectables", isCorrect: false },
          { text: "Le muscle droit antérieur de la cuisse réservé aux nourrissons uniquement", isCorrect: false },
          { text: "La fosse sous-épineuse de l'omoplate pour les injections de plus de 2 mL", isCorrect: false }
        ],
        explanation: "Le vaste externe de la cuisse est recommandé en première intention chez l'adulte (risque faible de lésion nerveuse ou vasculaire). Le deltoïde est utilisé pour les volumes ≤ 2 mL (vaccins). Le quadrant supéro-externe de la fesse (et non interne) peut être utilisé mais présente un risque de lésion du nerf sciatique."
      },
      {
        text: "L'angle d'introduction de l'aiguille pour une injection sous-cutanée est de :",
        options: [
          { text: "45° en pli cutané ou 90° si l'épaisseur du tissu sous-cutané est suffisante", isCorrect: true },
          { text: "10 à 15° pour traverser uniquement le derme sans atteindre l'hypoderme", isCorrect: false },
          { text: "90° obligatoire quel que soit le poids et la morphologie du patient", isCorrect: false },
          { text: "30° systématique pour tous les médicaments injectés par voie sous-cutanée", isCorrect: false }
        ],
        explanation: "L'injection SC se réalise à 45° en formant un pli cutané chez les patients maigres (épaisseur SC insuffisante), ou à 90° chez les patients avec un tissu sous-cutané abondant. L'objectif est de déposer le médicament dans l'hypoderme sans atteindre le muscle."
      },
      {
        text: "L'intradermoréaction (IDR) à la tuberculine se lit :",
        options: [
          { text: "Entre 48 et 72 heures après l'injection en mesurant l'induration en millimètres", isCorrect: true },
          { text: "Immédiatement après l'injection en observant l'érythème local apparu", isCorrect: false },
          { text: "À 24 heures en mesurant le diamètre de la papule formée à l'injection", isCorrect: false },
          { text: "À 7 jours après l'injection pour observer la réaction retardée complète", isCorrect: false }
        ],
        explanation: "L'IDR à la tuberculine (Mantoux) se lit entre 48 et 72 heures après injection. On mesure l'induration (et non l'érythème) transversalement en millimètres. Un résultat positif est défini par une induration ≥ 5 mm selon le contexte clinique."
      },
      {
        text: "Pour une injection intramusculaire, il est contre-indiqué de :",
        options: [
          { text: "Aspirer systématiquement pour tous les sites IM selon les recommandations actuelles", isCorrect: false },
          { text: "Masser le site d'injection après avoir retiré l'aiguille pour favoriser l'absorption", isCorrect: false },
          { text: "Injecter dans un site présentant une induration, une infection ou un hématome", isCorrect: true },
          { text: "Utiliser une aiguille de longueur adaptée au site et à la morphologie du patient", isCorrect: false }
        ],
        explanation: "Il est contre-indiqué d'injecter dans une zone présentant une induration, un hématome, une infection ou une cicatrice. Les recommandations actuelles (OMS, HAS) préconisent de ne plus aspirer systématiquement avant injection IM aux sites habituels (risque vasculaire faible)."
      },
      {
        text: "Lors d'une injection sous-cutanée d'héparine de bas poids moléculaire (HBPM), l'infirmier doit :",
        options: [
          { text: "Ne pas purger l'air présent dans la seringue pré-remplie avant l'injection", isCorrect: true },
          { text: "Masser énergiquement le site d'injection après retrait de l'aiguille", isCorrect: false },
          { text: "Choisir systématiquement le bras comme unique site d'injection recommandé", isCorrect: false },
          { text: "Aspirer avant l'injection pour vérifier l'absence de reflux sanguin", isCorrect: false }
        ],
        explanation: "Pour les HBPM en seringue pré-remplie : ne pas purger la bulle d'air (elle chasse le produit résiduel dans l'aiguille et réduit le risque d'hématome), ne pas masser (risque d'hématome), alterner les sites (ceinture abdominale à distance de l'ombilic) et ne pas aspirer."
      },
      {
        text: "La technique d'injection intradermique correcte consiste à :",
        options: [
          { text: "Introduire l'aiguille biseau vers le haut à 10-15° pour former une papule", isCorrect: true },
          { text: "Pincer la peau en pli et introduire l'aiguille à 45° dans le derme", isCorrect: false },
          { text: "Introduire l'aiguille perpendiculairement à la peau et injecter lentement", isCorrect: false },
          { text: "Utiliser une aiguille intramusculaire longue pour atteindre le derme profond", isCorrect: false }
        ],
        explanation: "L'injection ID se réalise : peau tendue (sans pli), aiguille courte (4-6 mm) et fine (26-27G), biseau vers le haut, introduction tangentielle à 10-15° dans le derme superficiel. L'injection correcte forme une papule blanche en peau d'orange (environ 6-10 mm de diamètre)."
      },
      {
        text: "La rotation des sites d'injection est particulièrement importante chez le patient diabétique sous insuline pour :",
        options: [
          { text: "Prévenir la lipodystrophie et maintenir une absorption insulinique régulière", isCorrect: true },
          { text: "Éviter les infections cutanées liées à la répétition des injections en même lieu", isCorrect: false },
          { text: "Réduire la douleur liée à l'hypersensibilité cutanée après plusieurs injections", isCorrect: false },
          { text: "Respecter uniquement une contrainte esthétique liée aux cicatrices d'injection", isCorrect: false }
        ],
        explanation: "La rotation des sites prévient la lipodystrophie (lipohypertrophie ou lipoatrophie), qui modifie l'absorption de l'insuline de façon imprévisible. Une absorption irrégulière entraîne une instabilité glycémique, même en cas de bonne observance thérapeutique."
      },
      {
        text: "Quelle longueur d'aiguille est recommandée pour une injection intramusculaire chez un adulte de corpulence normale ?",
        options: [
          { text: "Une aiguille de 40 à 50 mm pour atteindre le tissu musculaire profond", isCorrect: true },
          { text: "Une aiguille de 4 à 6 mm identique à celle utilisée pour l'injection SC", isCorrect: false },
          { text: "Une aiguille de 16 à 25 mm suffisante pour tous les patients adultes", isCorrect: false },
          { text: "Une aiguille de 70 à 90 mm pour les patients en surpoids uniquement", isCorrect: false }
        ],
        explanation: "Pour l'injection IM chez l'adulte de corpulence normale, une aiguille de 40 mm (site deltoïde ou cuisse) à 50 mm (site fessier) est recommandée pour atteindre le tissu musculaire. La longueur est adaptée à la morphologie et au site choisi."
      }
    ]
  },
  {
    title: "Formes orales et autres voies d'administration",
    description: "Comprimés, gélules, formes à libération prolongée, patches transdermiques et voie rectale en pratique infirmière.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Chapitre 10 - Formes orales et autres voies — comprimés, gélules, patches et voie rectale",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Un comprimé à libération prolongée (LP) ne doit pas être écrasé car :",
        options: [
          { text: "Cela détruirait le système de libération et provoquerait une dose toxique immédiate", isCorrect: true },
          { text: "L'écrasement modifie uniquement le goût sans affecter l'efficacité thérapeutique", isCorrect: false },
          { text: "La réglementation interdit l'écrasement pour des raisons de traçabilité uniquement", isCorrect: false },
          { text: "L'écrasement réduirait la dose absorbée par destruction de la molécule active", isCorrect: false }
        ],
        explanation: "Les comprimés LP contiennent une dose totale conçue pour être libérée progressivement sur 12 à 24h. L'écrasement détruit la matrice ou le pelliculage de contrôle de libération, entraînant la libération immédiate de toute la dose et un risque majeur de surdosage (pic toxique)."
      },
      {
        text: "La voie sublinguale est utilisée pour la trinitrine car elle permet :",
        options: [
          { text: "Un passage rapide dans la circulation systémique en évitant l'effet de premier passage hépatique", isCorrect: true },
          { text: "Une absorption lente et prolongée pour un effet antiangineux de longue durée", isCorrect: false },
          { text: "Une action locale sur la muqueuse buccale sans effet systémique recherché", isCorrect: false },
          { text: "Une meilleure tolérance gastrique par rapport à la voie orale classique avalée", isCorrect: false }
        ],
        explanation: "La trinitrine sublinguale est absorbée par les veines sublinguales directement dans la circulation systémique, court-circuitant le premier passage hépatique (qui dégraderait massivement le principe actif). Cela permet un délai d'action très rapide (1-3 minutes) indispensable en crise angineuse."
      },
      {
        text: "L'administration d'un suppositoire nécessite que l'infirmier :",
        options: [
          { text: "Positionne le patient en décubitus latéral gauche et introduise le suppositoire avec doigt ganté", isCorrect: true },
          { text: "Administre le suppositoire immédiatement après une selle pour garantir l'absorption", isCorrect: false },
          { text: "Chauffe le suppositoire à 37°C avant administration pour accélérer la fusion", isCorrect: false },
          { text: "Demande au patient de se lever et marcher 5 minutes après l'administration", isCorrect: false }
        ],
        explanation: "Le patient est placé en décubitus latéral gauche (position de Sims), l'infirmier porte des gants, lubrifie légèrement le suppositoire si nécessaire, et l'introduit côté apex (pointe) en premier, en demandant au patient de rester allongé 10 à 15 minutes pour éviter l'expulsion."
      },
      {
        text: "Un patch transdermique à la morphine doit être appliqué :",
        options: [
          { text: "Sur une peau propre, sèche, non irritée et glabre ou rasée de près", isCorrect: true },
          { text: "Sur une zone musculaire très vascularisée pour accélérer l'absorption cutanée", isCorrect: false },
          { text: "Directement sur la plaie chronique pour un effet antalgique local renforcé", isCorrect: false },
          { text: "Sur une zone chauffée à l'aide d'une bouillotte pour améliorer la diffusion", isCorrect: false }
        ],
        explanation: "Les patches doivent être appliqués sur une peau intacte, propre, sèche, non irritée et non poilue (ou rasée de près). La chaleur locale (fièvre, bouillotte) augmente dangereusement l'absorption transcutanée et peut provoquer un surdosage en opioïde."
      },
      {
        text: "Pourquoi les gélules gastro-résistantes ne doivent-elles pas être ouvertes avant administration ?",
        options: [
          { text: "La capsule protège le principe actif de la dégradation acide gastrique jusqu'à l'intestin", isCorrect: true },
          { text: "L'ouverture libèrerait une odeur désagréable sans affecter l'efficacité du médicament", isCorrect: false },
          { text: "Le contenu en poudre est toxique par inhalation mais actif uniquement par voie orale", isCorrect: false },
          { text: "La réglementation interdit l'ouverture de toute gélule quel que soit son type", isCorrect: false }
        ],
        explanation: "Les gélules gastro-résistantes sont conçues pour libérer le principe actif dans l'intestin grêle (pH alcalin), soit pour protéger un médicament sensible à l'acidité gastrique, soit pour protéger la muqueuse gastrique. Les ouvrir expose le principe actif à la destruction dans l'estomac."
      },
      {
        text: "La voie rectale est préférée à la voie orale dans quelle situation clinique ?",
        options: [
          { text: "Chez un patient présentant des vomissements importants empêchant l'absorption orale", isCorrect: true },
          { text: "Pour obtenir un effet systémique plus rapide qu'avec la voie intraveineuse", isCorrect: false },
          { text: "Lorsque le médicament est disponible uniquement sous forme de comprimé oral", isCorrect: false },
          { text: "Chez tous les patients de plus de 65 ans pour éviter les troubles de déglutition", isCorrect: false }
        ],
        explanation: "La voie rectale est une alternative pertinente lorsque la voie orale est impossible (vomissements, troubles de déglutition, état de conscience altéré) ou non disponible temporairement. Elle est cependant moins fiable que la voie orale en termes d'absorption (variable selon l'état du rectum)."
      },
      {
        text: "Quelle précaution est indispensable lors de l'administration d'un médicament par sonde nasogastrique ?",
        options: [
          { text: "Vérifier le positionnement de la sonde et rincer avant et après chaque médicament", isCorrect: true },
          { text: "Écraser systématiquement tous les médicaments oraux quelle que soit leur forme", isCorrect: false },
          { text: "Mélanger tous les médicaments dans la même seringue pour simplifier l'administration", isCorrect: false },
          { text: "Positionner le patient en décubitus dorsal strict pendant et après l'administration", isCorrect: false }
        ],
        explanation: "Avant toute administration par SNG : vérifier le positionnement de la sonde (aspiration de liquide gastrique, pH < 6, repère centimétrique). Rincer la sonde avant (10-30 mL d'eau), entre chaque médicament et après. Ne jamais mélanger les médicaments entre eux. Maintenir le patient en position semi-assise (30-45°)."
      },
      {
        text: "Un comprimé dispersible (orodispersible) présente l'avantage principal de :",
        options: [
          { text: "Se dissoudre rapidement dans la bouche sans eau, facilitant la prise pour les patients dysphagiques", isCorrect: true },
          { text: "Libérer progressivement la substance active sur 24 heures sans pic plasmatique", isCorrect: false },
          { text: "Présenter une biodisponibilité systémique plus faible pour réduire les effets indésirables", isCorrect: false },
          { text: "Résister à l'acidité gastrique et se dissoudre uniquement dans l'intestin grêle", isCorrect: false }
        ],
        explanation: "Les comprimés orodispersibles (ODT) se désintègrent en quelques secondes au contact de la salive, sans nécessiter d'eau. Ils sont particulièrement utiles chez les patients présentant des troubles de la déglutition (dysphagie), les personnes âgées, les enfants ou les patients sans accès à un verre d'eau."
      }
    ]
  }
];
