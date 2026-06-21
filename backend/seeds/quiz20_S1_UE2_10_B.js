module.exports = [
  {
    title: "Vaccination — mécanismes, types et calendrier",
    description: "Quiz sur les mécanismes immunologiques de la vaccination, les différents types de vaccins et le calendrier vaccinal français.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Chapitre 6 — Vaccination",
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le principal mécanisme par lequel un vaccin protège l'organisme contre une infection ?",
        options: [
          { text: "Il détruit directement les agents pathogènes présents dans le sang", isCorrect: false },
          { text: "Il stimule la production de mémoire immunitaire spécifique", isCorrect: true },
          { text: "Il renforce la barrière cutanée contre les micro-organismes", isCorrect: false },
          { text: "Il neutralise les toxines bactériennes circulantes en permanence", isCorrect: false }
        ],
        explanation: "La vaccination entraîne une réponse immunitaire adaptative avec création de lymphocytes mémoire B et T. Lors d'une exposition ultérieure à l'agent pathogène, cette mémoire immunitaire permet une réponse rapide et efficace qui prévient la maladie."
      },
      {
        text: "Les vaccins vivants atténués sont contre-indiqués chez les personnes immunodéprimées car :",
        options: [
          { text: "Ils contiennent des adjuvants toxiques pour les sujets fragiles", isCorrect: false },
          { text: "Ils peuvent provoquer une allergie sévère aux conservateurs", isCorrect: false },
          { text: "Le micro-organisme atténué peut se multiplier et causer la maladie", isCorrect: true },
          { text: "Ils inhibent complètement la production d'anticorps propres", isCorrect: false }
        ],
        explanation: "Chez un sujet immunodéprimé, le système immunitaire est incapable de contrôler même un agent atténué. Le vaccin vivant peut alors se multiplier et provoquer une infection vaccinale grave, parfois mortelle. C'est pourquoi seuls les vaccins inactivés sont utilisés chez ces patients."
      },
      {
        text: "Le vaccin contre l'hépatite B est un exemple de vaccin :",
        options: [
          { text: "Vivant atténué à réplication contrôlée en milieu acide", isCorrect: false },
          { text: "Sous-unitaire contenant un antigène protéique recombinant", isCorrect: true },
          { text: "Inactivé entier préparé par chauffage du virus complet", isCorrect: false },
          { text: "Anatoxine dérivée de la toxine bactérienne détoxifiée", isCorrect: false }
        ],
        explanation: "Le vaccin contre l'hépatite B est un vaccin sous-unitaire recombinant : il contient uniquement l'antigène de surface HBs (AgHBs), produit par génie génétique dans des levures. Il ne contient aucune particule virale entière, ce qui le rend très sûr."
      },
      {
        text: "Selon le calendrier vaccinal français, à quel âge est réalisée la primo-vaccination contre la diphtérie, tétanos et poliomyélite (DTP) ?",
        options: [
          { text: "À 2, 4 et 11 mois pour les trois injections principales", isCorrect: true },
          { text: "À 3, 6 et 12 mois pour les trois injections principales", isCorrect: false },
          { text: "À 1, 3 et 6 mois pour les trois injections principales", isCorrect: false },
          { text: "À 2, 6 et 12 mois pour les trois injections principales", isCorrect: false }
        ],
        explanation: "Le calendrier vaccinal français prévoit la primo-vaccination DTP-Ca-Hib-HBV à 2 mois, 4 mois et 11 mois (schéma 2+1). Ce schéma a été simplifié en 2013 par rapport à l'ancien schéma à 3 injections à 2, 3 et 4 mois."
      },
      {
        text: "La notion d'immunité collective (ou de groupe) signifie que :",
        options: [
          { text: "Les individus vaccinés partagent leurs anticorps avec les non-vaccinés", isCorrect: false },
          { text: "Un taux élevé de vaccinés protège indirectement les personnes non vaccinées", isCorrect: true },
          { text: "Un seul vaccin suffit à protéger toute la communauté sans rappels", isCorrect: false },
          { text: "Les vaccins collectifs sont plus efficaces que les vaccins individuels", isCorrect: false }
        ],
        explanation: "L'immunité collective (herd immunity) repose sur le fait que si une proportion suffisante de la population est immunisée, la circulation du pathogène est interrompue. Les personnes non vaccinées (nourrissons, immunodéprimés) sont ainsi protégées indirectement. Le seuil varie selon le R0 de l'agent pathogène."
      },
      {
        text: "Quel vaccin est obligatoire pour les professionnels de santé en France selon la réglementation en vigueur ?",
        options: [
          { text: "Le vaccin contre la grippe saisonnière, annuellement renouvelé", isCorrect: false },
          { text: "Le vaccin contre l'hépatite B, avec vérification de la séroconversion", isCorrect: true },
          { text: "Le vaccin contre la varicelle, quel que soit le statut immunitaire", isCorrect: false },
          { text: "Le vaccin contre la coqueluche, rappel tous les cinq ans", isCorrect: false }
        ],
        explanation: "La vaccination contre l'hépatite B est obligatoire pour les professionnels de santé en France (article L3111-4 du Code de la santé publique). Une vérification du titre d'anticorps anti-HBs est requise pour confirmer la séroconversion. D'autres vaccins sont recommandés (grippe, varicelle, coqueluche) mais non obligatoires."
      },
      {
        text: "Les anatoxines tétanique et diphtérique sont des vaccins dont le principe repose sur :",
        options: [
          { text: "Des bactéries entières tuées par formaldéhyde puis lyophilisées", isCorrect: false },
          { text: "Des toxines bactériennes inactivées chimiquement et non infectieuses", isCorrect: true },
          { text: "Des fragments d'ARN codant pour les protéines de surface bactériennes", isCorrect: false },
          { text: "Des polysaccharides capsulaires conjugués à une protéine porteuse", isCorrect: false }
        ],
        explanation: "Les anatoxines sont des exotoxines bactériennes traitées par le formaldéhyde (ou la chaleur) qui perdent leur pouvoir toxique tout en conservant leurs propriétés antigéniques. L'organisme produit alors des antitoxines neutralisantes qui protègeront lors d'une infection réelle."
      },
      {
        text: "Lors d'une vaccination, le rôle de l'adjuvant contenu dans certains vaccins est de :",
        options: [
          { text: "Conserver le vaccin au froid pendant le transport et le stockage", isCorrect: false },
          { text: "Amplifier et prolonger la réponse immunitaire à l'antigène vaccinal", isCorrect: true },
          { text: "Empêcher la multiplication du micro-organisme dans le vaccin", isCorrect: false },
          { text: "Réduire la douleur au site d'injection lors de l'administration", isCorrect: false }
        ],
        explanation: "Les adjuvants (comme les sels d'aluminium, AS04, MF59) stimulent le système immunitaire inné au site d'injection, amplifiant ainsi la réponse adaptative à l'antigène. Ils permettent d'utiliser des doses d'antigène plus faibles tout en obtenant une meilleure immunogénicité et une réponse plus durable."
      }
    ]
  },
  {
    title: "Hygiène des mains — friction et lavage",
    description: "Quiz sur les techniques de friction hydro-alcoolique, le lavage des mains et leurs indications respectives en soins infirmiers.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Chapitre 7 — Hygiène des mains",
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la technique de référence recommandée pour l'hygiène des mains dans les établissements de soins ?",
        options: [
          { text: "Le lavage simple au savon doux pendant au moins trente secondes", isCorrect: false },
          { text: "La friction hydro-alcoolique avec un produit à base d'alcool", isCorrect: true },
          { text: "Le lavage chirurgical à la brosse stérile avant chaque soin", isCorrect: false },
          { text: "Le rinçage abondant à l'eau chaude sans savon entre les soins", isCorrect: false }
        ],
        explanation: "La friction hydro-alcoolique (SHA) est la technique de référence de l'OMS et de la HAS pour l'hygiène des mains en soins. Elle est plus efficace que le lavage simple, plus rapide (20 à 30 secondes), moins agressive pour la peau et utilisable sans eau ni essuie-mains."
      },
      {
        text: "La durée recommandée pour une friction hydro-alcoolique efficace est de :",
        options: [
          { text: "10 à 15 secondes jusqu'au séchage complet du produit", isCorrect: false },
          { text: "20 à 30 secondes jusqu'au séchage complet du produit", isCorrect: true },
          { text: "45 à 60 secondes jusqu'au séchage complet du produit", isCorrect: false },
          { text: "5 à 10 secondes jusqu'au séchage complet du produit", isCorrect: false }
        ],
        explanation: "La friction doit durer 20 à 30 secondes et couvrir toutes les surfaces des mains selon la technique en 7 étapes de l'OMS. Le produit doit être appliqué en quantité suffisante et frotté jusqu'à séchage complet pour garantir son efficacité virucide, bactéricide et fongicide."
      },
      {
        text: "Dans quelle situation le lavage des mains au savon est-il préférable à la friction hydro-alcoolique ?",
        options: [
          { text: "Avant tout acte invasif comme une injection intramusculaire", isCorrect: false },
          { text: "Lors de soins en contact avec des liquides biologiques abondants", isCorrect: false },
          { text: "En cas de mains visiblement souillées ou après contact avec Clostridioides difficile", isCorrect: true },
          { text: "Avant chaque repas et après chaque utilisation des toilettes", isCorrect: false }
        ],
        explanation: "Le lavage au savon est indiqué quand les mains sont visiblement souillées (sang, sécrétions), après contact avec un patient infecté à Clostridioides difficile (spores résistantes aux alcools), après utilisation des toilettes et avant les repas. Dans ces cas, la friction seule est insuffisante."
      },
      {
        text: "Les 5 moments de l'hygiène des mains définis par l'OMS incluent notamment :",
        options: [
          { text: "Avant et après avoir touché le patient, avant un geste aseptique", isCorrect: true },
          { text: "Avant chaque repas, après chaque soin, avant de quitter le service", isCorrect: false },
          { text: "Après contact sanguin uniquement et avant procédures chirurgicales", isCorrect: false },
          { text: "Au début et à la fin de chaque vacation de travail infirmier", isCorrect: false }
        ],
        explanation: "Les 5 moments de l'OMS sont : (1) avant de toucher le patient, (2) avant un geste aseptique, (3) après risque d'exposition à un liquide biologique, (4) après avoir touché le patient, (5) après avoir touché l'environnement du patient. Ce cadre guide la pratique quotidienne de l'hygiène des mains."
      },
      {
        text: "Pourquoi les bijoux, bracelets et montres doivent-ils être retirés avant les soins ?",
        options: [
          { text: "Ils risquent de rayer la peau du patient lors des manipulations", isCorrect: false },
          { text: "Ils constituent des zones non atteintes lors de l'hygiène des mains", isCorrect: true },
          { text: "Ils peuvent être endommagés par les produits hydro-alcooliques", isCorrect: false },
          { text: "Ils génèrent une charge électrostatique nuisible aux dispositifs médicaux", isCorrect: false }
        ],
        explanation: "Les bijoux, bagues, montres et bracelets créent des zones inaccessibles lors de la friction ou du lavage. Les micro-organismes s'y accumulent et ne sont pas éliminés. Cette règle d'hygiène est fondamentale en soins infirmiers pour garantir l'efficacité de l'hygiène des mains."
      },
      {
        text: "Lors du lavage des mains, l'étape de rinçage doit se faire :",
        options: [
          { text: "Avec de l'eau froide, les doigts pointés vers le haut", isCorrect: false },
          { text: "Avec de l'eau tiède, les doigts pointés vers le bas", isCorrect: true },
          { text: "Avec de l'eau chaude, les mains à plat sous le robinet", isCorrect: false },
          { text: "Avec de l'eau tiède, les mains au-dessus du niveau des coudes", isCorrect: false }
        ],
        explanation: "Le rinçage doit se faire doigts pointés vers le bas pour que l'eau savonneuse s'écoule loin des avant-bras qui sont considérés plus propres. L'eau tiède est préférable car l'eau trop chaude altère la peau et favorise la prolifération bactérienne par rupture de la barrière cutanée."
      },
      {
        text: "Quel est l'effet principal des produits hydro-alcooliques sur les micro-organismes ?",
        options: [
          { text: "Ils inhibent la synthèse de la paroi cellulaire bactérienne uniquement", isCorrect: false },
          { text: "Ils dénaturent les protéines et désorganisent les membranes cellulaires", isCorrect: true },
          { text: "Ils bloquent la réplication de l'ADN des micro-organismes pathogènes", isCorrect: false },
          { text: "Ils forment une pellicule protectrice sur la peau pendant plusieurs heures", isCorrect: false }
        ],
        explanation: "Les alcools (éthanol, isopropanol, n-propanol) agissent par dénaturation des protéines et désorganisation des lipides membranaires des micro-organismes. Cet effet est rapide et non spécifique, ce qui explique leur large spectre d'activité (bactéries, virus enveloppés, champignons)."
      },
      {
        text: "La technique de lavage hygiénique des mains diffère du lavage simple essentiellement par :",
        options: [
          { text: "L'utilisation d'un savon antiseptique et une durée de friction plus longue", isCorrect: true },
          { text: "L'utilisation d'eau stérile et d'une brosse chirurgicale spécifique", isCorrect: false },
          { text: "L'absence de rinçage final pour conserver l'effet antiseptique", isCorrect: false },
          { text: "L'application d'un produit antifongique après séchage complet des mains", isCorrect: false }
        ],
        explanation: "Le lavage hygiénique utilise un savon antiseptique (chlorhexidine, PVP-iode) au lieu d'un savon doux, et la friction dure 1 minute au lieu de 30 secondes. Il est indiqué avant les actes invasifs, les soins aux patients immunodéprimés, ou en renforcement des précautions complémentaires."
      }
    ]
  },
  {
    title: "Précautions standard — EPI et gestion des AES",
    description: "Quiz sur le port des équipements de protection individuelle et la prise en charge des accidents d'exposition au sang.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Chapitre 8 — Précautions standard",
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Les précautions standard s'appliquent :",
        options: [
          { text: "Uniquement aux patients porteurs de maladies infectieuses identifiées", isCorrect: false },
          { text: "À tous les patients quel que soit leur statut infectieux connu ou non", isCorrect: true },
          { text: "Seulement lors des soins techniques invasifs de type chirurgical", isCorrect: false },
          { text: "Aux patients hospitalisés en unités de soins intensifs uniquement", isCorrect: false }
        ],
        explanation: "Les précautions standard s'appliquent à TOUS les patients, systématiquement, indépendamment de leur diagnostic ou de leur statut infectieux connu. Elles reposent sur le principe que tout sang, liquide biologique, sécrétions et excrétion (sauf la sueur) sont potentiellement infectieux."
      },
      {
        text: "Les gants doivent être portés lors des soins infirmiers :",
        options: [
          { text: "Pour tous les soins afin de protéger les mains du soignant en permanence", isCorrect: false },
          { text: "En cas de risque de contact avec du sang ou des liquides biologiques", isCorrect: true },
          { text: "Uniquement lors de pansements et de poses de sondes urinaires", isCorrect: false },
          { text: "Seulement lors de soins aux patients porteurs de bactéries multirésistantes", isCorrect: false }
        ],
        explanation: "Le port de gants est indiqué dès qu'il existe un risque de contact avec du sang, des liquides biologiques, des muqueuses, une peau lésée, ou lors de la manipulation d'objets souillés. Ils ne remplacent pas l'hygiène des mains et doivent être changés entre deux patients et entre deux actes."
      },
      {
        text: "Que doit faire immédiatement un soignant victime d'une piqûre avec une aiguille souillée ?",
        options: [
          { text: "Comprimer la plaie, appliquer un antiseptique puis alerter le médecin", isCorrect: false },
          { text: "Faire saigner la plaie, laver à l'eau et au savon, puis désinfecter", isCorrect: true },
          { text: "Poser un garrot au-dessus de la plaie et aspirer le sang contaminé", isCorrect: false },
          { text: "Appliquer immédiatement de l'alcool pur sans rinçage préalable à l'eau", isCorrect: false }
        ],
        explanation: "La conduite à tenir après un AES (accident d'exposition au sang) est : (1) faire saigner sans sucer, (2) laver immédiatement à l'eau et au savon pendant 5 minutes, (3) rincer abondamment, (4) désinfecter avec un antiseptique (dakin, eau oxygénée, alcool 70°), (5) déclarer l'accident et consulter en urgence dans les 4 heures pour évaluer la prophylaxie post-exposition (VIH, VHB, VHC)."
      },
      {
        text: "Parmi les équipements de protection individuelle suivants, lequel protège contre les projections de liquides biologiques sur les yeux et le visage ?",
        options: [
          { text: "Le masque chirurgical porté correctement sur le nez et la bouche", isCorrect: false },
          { text: "Les lunettes de protection ou l'écran facial (visière de protection)", isCorrect: true },
          { text: "Le surblouse à manches longues attachée dans le dos du soignant", isCorrect: false },
          { text: "Le bonnet de bloc opératoire couvrant les cheveux et le front", isCorrect: false }
        ],
        explanation: "Les projections de liquides biologiques sur les muqueuses oculaires représentent un risque d'AES. Les lunettes de protection ou l'écran facial (visière) sont les EPI dédiés à cette protection. Ils sont indiqués lors de soins à risque de projection : aspirations, pansements abondants, accouchements, endoscopies."
      },
      {
        text: "Après un AES à risque VIH, le délai maximal pour débuter une prophylaxie post-exposition (TPE) est de :",
        options: [
          { text: "72 heures après l'accident pour une efficacité maximale", isCorrect: true },
          { text: "24 heures après l'accident pour une efficacité maximale", isCorrect: false },
          { text: "7 jours après l'accident pour une efficacité maximale", isCorrect: false },
          { text: "48 heures après l'accident pour une efficacité maximale", isCorrect: false }
        ],
        explanation: "La prophylaxie post-exposition (TPE) contre le VIH doit être initiée dans les 4 heures suivant l'AES et au maximum dans les 72 heures. Plus la prise en charge est précoce, plus le TPE est efficace. Au-delà de 72 heures, il n'est plus recommandé. Le traitement dure 28 jours."
      },
      {
        text: "Lors de l'élimination d'une aiguille après usage, la règle absolue est de :",
        options: [
          { text: "Recapuchonner l'aiguille avant de la jeter pour protéger les collègues", isCorrect: false },
          { text: "Jeter immédiatement l'ensemble aiguille-seringue dans un DASRI adapté", isCorrect: true },
          { text: "Séparer l'aiguille de la seringue avec les doigts avant élimination", isCorrect: false },
          { text: "Plier l'aiguille avec une pince afin d'éviter toute blessure accidentelle", isCorrect: false }
        ],
        explanation: "La règle absolue est de ne JAMAIS recapuchonner une aiguille usagée (risque de piqûre majeur). L'ensemble aiguille-seringue doit être jeté immédiatement, sans désassemblage, dans un collecteur pour objets piquants-tranchants (DASRI) selon la réglementation sur les déchets d'activités de soins à risques infectieux."
      },
      {
        text: "La surblouse doit être portée lors de soins pour :",
        options: [
          { text: "Protéger le patient des micro-organismes portés sur les vêtements du soignant", isCorrect: false },
          { text: "Protéger les vêtements du soignant lors de risques de souillures importantes", isCorrect: true },
          { text: "Remplacer le lavage des mains lors des soins à faible risque infectieux", isCorrect: false },
          { text: "Identifier le rôle professionnel du soignant dans le service de soins", isCorrect: false }
        ],
        explanation: "La surblouse protège les vêtements professionnels du soignant contre les projections et souillures lors de soins à risque (soins de nursing, pansements, pose de voie veineuse, etc.). Elle participe également à la protection du patient contre une contamination croisée depuis les vêtements du soignant."
      },
      {
        text: "Quel est le risque moyen de transmission du VIH après un AES percutané avec du sang VIH positif ?",
        options: [
          { text: "Environ 0,3 % par accident avec exposition au sang contaminé", isCorrect: true },
          { text: "Environ 3 % par accident avec exposition au sang contaminé", isCorrect: false },
          { text: "Environ 30 % par accident avec exposition au sang contaminé", isCorrect: false },
          { text: "Environ 0,03 % par accident avec exposition au sang contaminé", isCorrect: false }
        ],
        explanation: "Le risque moyen de transmission du VIH après AES percutané est d'environ 0,3 % (3 pour 1000). Il est de 0,09 % pour une exposition muqueuse. À titre de comparaison, le risque pour le VHB est de 2 à 40 % et pour le VHC de 0,5 à 2 %. Ces données justifient les précautions standard et la prophylaxie post-exposition."
      }
    ]
  },
  {
    title: "Précautions complémentaires — contact, gouttelettes et air",
    description: "Quiz sur les trois types de précautions complémentaires aux précautions standard selon le mode de transmission des agents infectieux.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Chapitre 9 — Précautions complémentaires",
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Les précautions complémentaires de type 'contact' sont indiquées notamment pour :",
        options: [
          { text: "La tuberculose pulmonaire active à bacilles acido-alcoolo-résistants", isCorrect: false },
          { text: "La grippe saisonnière et les infections respiratoires virales", isCorrect: false },
          { text: "Les bactéries multirésistantes comme le SARM et les ERV", isCorrect: true },
          { text: "La rougeole, la varicelle et les maladies à virus herpétiques", isCorrect: false }
        ],
        explanation: "Les précautions contact visent à interrompre les transmissions par contact direct (mains, peau) ou indirect (environnement, surfaces). Elles sont indiquées pour les bactéries multirésistantes (SARM, ERV, EBLSE), Clostridioides difficile, les gastro-entérites virales (norovirus) et certaines infections cutanées (gale, impétigo)."
      },
      {
        text: "Lors de la prise en charge d'un patient en précautions gouttelettes, le soignant doit porter :",
        options: [
          { text: "Un appareil de protection respiratoire de type FFP2 ou FFP3 filtrant", isCorrect: false },
          { text: "Un masque chirurgical, une surblouse et des gants pour tous les soins", isCorrect: true },
          { text: "Un masque chirurgical uniquement lors des contacts rapprochés de moins d'un mètre", isCorrect: false },
          { text: "Un masque FFP2 uniquement lors des actes générant des aérosols potentiels", isCorrect: false }
        ],
        explanation: "En précautions gouttelettes, le soignant porte un masque chirurgical (protection contre les particules > 5 µm), une surblouse à manches longues et des gants. Ces précautions s'appliquent lors des soins au patient et à moins d'un mètre. Elles concernent la grippe, la coqueluche, les méningites bactériennes."
      },
      {
        text: "Quelle est la différence essentielle entre un masque chirurgical et un appareil de protection respiratoire (FFP2) ?",
        options: [
          { text: "Le masque chirurgical protège le porteur ; le FFP2 protège l'environnement", isCorrect: false },
          { text: "Le FFP2 filtre les aérosols submicroniques ; le masque chirurgical non", isCorrect: true },
          { text: "Le FFP2 est à usage unique ; le masque chirurgical peut être réutilisé", isCorrect: false },
          { text: "Le masque chirurgical couvre le nez et la bouche ; le FFP2 couvre seulement la bouche", isCorrect: false }
        ],
        explanation: "Le masque chirurgical protège principalement l'environnement du porteur (barrière aux gouttelettes émises) et protège contre les grosses particules. Le FFP2 (filtering face piece) filtre au moins 94 % des aérosols, y compris les particules < 5 µm (noyaux de gouttelettes). Il protège le porteur contre l'inhalation de particules infectieuses en suspension."
      },
      {
        text: "Les précautions air sont indiquées pour quelle pathologie parmi les suivantes ?",
        options: [
          { text: "L'infection à Clostridioides difficile avec diarrhée abondante", isCorrect: false },
          { text: "La tuberculose pulmonaire active à crachats positifs", isCorrect: true },
          { text: "L'infection urinaire à entérocoque résistant à la vancomycine", isCorrect: false },
          { text: "La grippe A et les infections respiratoires aiguës basses", isCorrect: false }
        ],
        explanation: "Les précautions air concernent les agents infectieux transmis par noyaux de gouttelettes (particules < 5 µm restant en suspension dans l'air) : tuberculose pulmonaire, rougeole, varicelle-zona (forme pulmonaire disséminée). Ces maladies nécessitent une chambre en pression négative et un masque FFP2 pour le soignant."
      },
      {
        text: "Un patient en précautions complémentaires de type contact doit idéalement être placé :",
        options: [
          { text: "En chambre seule avec porte fermée et système de ventilation spécifique", isCorrect: false },
          { text: "En chambre seule ou en cohorte avec d'autres patients porteurs du même germe", isCorrect: true },
          { text: "En salle commune avec un paravent pour isoler son espace de vie", isCorrect: false },
          { text: "En chambre seule sans contrainte particulière sur la ventilation de la pièce", isCorrect: false }
        ],
        explanation: "L'isolement géographique en chambre individuelle est préférable pour les précautions contact. En cas d'impossibilité, un regroupement en cohorte (patients porteurs du même micro-organisme ensemble) est acceptable. Un paravent est insuffisant car il ne prévient pas la transmission via les surfaces et les mains des soignants."
      },
      {
        text: "La signalétique d'isolement affichée sur la porte d'un patient permet de :",
        options: [
          { text: "Informer tous les visiteurs et soignants du type de précautions à respecter", isCorrect: true },
          { text: "Interdire formellement toute visite de la famille et des proches du patient", isCorrect: false },
          { text: "Identifier le diagnostic médical exact du patient pour les autres soignants", isCorrect: false },
          { text: "Remplacer la lecture du dossier infirmier avant d'entrer dans la chambre", isCorrect: false }
        ],
        explanation: "La signalétique d'isolement (panneaux de couleur codée) informe soignants, visiteurs et autres intervenants des précautions à respecter sans divulguer le diagnostic médical (secret médical). Elle indique le type d'EPI nécessaires et les comportements à adopter. Elle ne remplace pas la lecture du dossier mais guide les premiers réflexes."
      },
      {
        text: "Lors des précautions gouttelettes, à quelle distance minimale du patient le port du masque chirurgical est-il obligatoire ?",
        options: [
          { text: "Moins d'un mètre de distance entre le soignant et le patient", isCorrect: true },
          { text: "Moins de deux mètres de distance entre le soignant et le patient", isCorrect: false },
          { text: "Moins de cinquante centimètres de distance entre soignant et patient", isCorrect: false },
          { text: "Dans toute la chambre du patient quelle que soit la distance", isCorrect: false }
        ],
        explanation: "Les gouttelettes (particules > 5 µm) ne restent pas en suspension et se déposent rapidement à moins d'un mètre de la source. Le masque chirurgical est donc obligatoire dès que le soignant est à moins d'un mètre du patient. Au-delà de cette distance, le risque de transmission par gouttelettes est considéré négligeable."
      },
      {
        text: "Les équipements de protection individuelle utilisés en chambre d'isolement doivent être retirés :",
        options: [
          { text: "Dans la chambre du patient après chaque soin puis avant de sortir", isCorrect: false },
          { text: "Dans le sas ou à la sortie de la chambre avant d'entrer dans le couloir", isCorrect: true },
          { text: "Dans le couloir après la sortie de la chambre, loin des autres patients", isCorrect: false },
          { text: "Au poste infirmier après avoir déposé le matériel de soins utilisé", isCorrect: false }
        ],
        explanation: "Les EPI doivent être retirés dans le sas ou à la sortie de la chambre (à la porte), AVANT d'entrer dans le couloir. L'ordre de retrait est important : gants en premiers, puis désinfection des mains, puis surblouse, puis masque en dernier (sauf précautions air). Cet ordre limite la contamination du soignant lors du déhabillage."
      }
    ]
  },
  {
    title: "Infections associées aux soins (IAS)",
    description: "Quiz sur les définitions, l'épidémiologie et les indicateurs de surveillance des infections associées aux soins en France.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Chapitre 10 — Infections associées aux soins",
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Une infection est dite 'associée aux soins' (IAS) si elle survient :",
        options: [
          { text: "Pendant une hospitalisation, uniquement dans un établissement de santé", isCorrect: false },
          { text: "En lien avec tout acte de soin, dans tout lieu où des soins sont dispensés", isCorrect: true },
          { text: "Dans les 24 heures suivant un geste invasif pratiqué par un soignant", isCorrect: false },
          { text: "Exclusivement chez des patients hospitalisés depuis plus de 48 heures", isCorrect: false }
        ],
        explanation: "Depuis 2007, le terme IAS remplace celui d'infection nosocomiale. Une IAS peut survenir dans tout lieu où des soins sont dispensés : hôpital, clinique, EHPAD, cabinet libéral, domicile. Elle doit être en lien avec un acte de soin. Le critère temporel (48h) s'applique spécifiquement aux infections nosocomiales hospitalières."
      },
      {
        text: "Selon les données de la surveillance en France, quel site infectieux est le plus fréquent parmi les IAS en établissements de santé ?",
        options: [
          { text: "Les infections du site opératoire après chirurgie programmée et urgente", isCorrect: false },
          { text: "Les infections urinaires, notamment liées aux sondes vésicales", isCorrect: true },
          { text: "Les bactériémies sur cathéter veineux central en réanimation", isCorrect: false },
          { text: "Les pneumopathies acquises sous ventilation mécanique en soins intensifs", isCorrect: false }
        ],
        explanation: "Les infections urinaires représentent environ 30 % des IAS, ce qui en fait le site le plus fréquent. Elles sont majoritairement liées au sondage vésical (infections liées aux soins). Viennent ensuite les pneumopathies (15-20 %), les infections du site opératoire (15 %) et les bactériémies (5-10 %)."
      },
      {
        text: "Le taux de prévalence des patients infectés lors des enquêtes de prévalence en France est d'environ :",
        options: [
          { text: "Environ 5 % des patients hospitalisés à un jour donné en France", isCorrect: true },
          { text: "Environ 15 % des patients hospitalisés à un jour donné en France", isCorrect: false },
          { text: "Environ 0,5 % des patients hospitalisés à un jour donné en France", isCorrect: false },
          { text: "Environ 25 % des patients hospitalisés à un jour donné en France", isCorrect: false }
        ],
        explanation: "Les enquêtes nationales de prévalence (ENP) conduites par Santé Publique France retrouvent un taux de prévalence d'environ 5 % (4,98 % en 2017). Cela représente environ 400 000 patients par an en France ayant une IAS, avec environ 4 000 décès directement imputables. Ces chiffres justifient les programmes de prévention."
      },
      {
        text: "L'indicateur ICSHA (indicateur de consommation de solutions hydro-alcooliques) mesure :",
        options: [
          { text: "La qualité de la formation des soignants à la technique de friction", isCorrect: false },
          { text: "Le volume de SHA consommé rapporté au nombre de journées d'hospitalisation", isCorrect: true },
          { text: "Le taux d'infections urinaires liées aux sondes dans l'établissement", isCorrect: false },
          { text: "Le pourcentage de soignants ayant adopté la friction hydro-alcoolique", isCorrect: false }
        ],
        explanation: "L'ICSHA est un indicateur de structure/processus qui mesure la consommation en litres de SHA par 1 000 journées d'hospitalisation, comparée à un objectif cible adapté selon le type d'établissement (MCO, SSR, psychiatrie, HAD). Il est utilisé comme proxy du niveau d'hygiène des mains pratiquée dans l'établissement."
      },
      {
        text: "Une bactérie multirésistante (BMR) est définie par sa résistance :",
        options: [
          { text: "À tous les antibiotiques disponibles, rendant toute antibiothérapie impossible", isCorrect: false },
          { text: "À plusieurs familles d'antibiotiques, réduisant les options thérapeutiques", isCorrect: true },
          { text: "Uniquement à la pénicilline, première classe d'antibiotiques découverte", isCorrect: false },
          { text: "À un seul antibiotique de référence par voie intraveineuse uniquement", isCorrect: false }
        ],
        explanation: "Une BMR (bactérie multirésistante) est résistante à au moins une molécule de trois familles d'antibiotiques ou plus, ce qui réduit significativement les options thérapeutiques. Les principales BMR surveillées en France sont : SARM (Staphylococcus aureus résistant à la méticilline), ERV (entérocoque résistant aux glycopeptides), EBLSE et bactéries productrices de carbapénémases."
      },
      {
        text: "Le programme national de prévention des IAS en France est coordonné par :",
        options: [
          { text: "La Haute Autorité de Santé (HAS) via les recommandations de bonnes pratiques", isCorrect: false },
          { text: "Les CPIAS (Centres d'appui pour la prévention des infections associées aux soins)", isCorrect: true },
          { text: "L'Ordre national des infirmiers et les associations professionnelles", isCorrect: false },
          { text: "Les directions des établissements de santé via leurs comités internes", isCorrect: false }
        ],
        explanation: "Les CPIAS (anciennement CCLIN et Antennes régionales de lutte contre les infections nosocomiales) coordonnent au niveau régional la surveillance et la prévention des IAS. Ils s'inscrivent dans le programme national PROPIAS (Programme national d'actions de prévention des infections associées aux soins) piloté par le ministère de la Santé."
      },
      {
        text: "Parmi les patients suivants, lequel présente le plus grand risque de développer une IAS ?",
        options: [
          { text: "Patient de 30 ans hospitalisé 48 heures pour appendicite non compliquée", isCorrect: false },
          { text: "Patient immunodéprimé sous chimiothérapie avec cathéter veineux central", isCorrect: true },
          { text: "Patiente de 25 ans hospitalisée pour accouchement par voie basse normale", isCorrect: false },
          { text: "Patient de 45 ans hospitalisé pour une fracture de jambe sans complication", isCorrect: false }
        ],
        explanation: "Les facteurs de risque d'IAS sont multiples : immunodépression (chimiothérapie, greffe, VIH), présence de dispositifs invasifs (cathéters, sondes), durée d'hospitalisation prolongée, antibiothérapie préalable, extrêmes d'âge, dénutrition. Le patient immunodéprimé avec cathéter central cumule plusieurs facteurs majeurs de risque."
      },
      {
        text: "Le CLIN (Comité de lutte contre les infections nosocomiales) dans un établissement de santé a pour mission principale de :",
        options: [
          { text: "Traiter les infections déclarées et prescrire les antibiothérapies adaptées", isCorrect: false },
          { text: "Définir et coordonner le programme de prévention et de surveillance des IAS", isCorrect: true },
          { text: "Former exclusivement le personnel médical aux techniques d'asepsie chirurgicale", isCorrect: false },
          { text: "Sanctionner les soignants responsables d'infections associées aux soins", isCorrect: false }
        ],
        explanation: "Le CLIN est une instance réglementaire obligatoire dans tout établissement de santé. Il élabore et met en œuvre le programme d'action pour prévenir et surveiller les IAS, coordonne les actions de formation, valide les protocoles d'hygiène et analyse les données de surveillance. Il est pluridisciplinaire (médecins, infirmiers, hygiénistes, pharmaciens, direction)."
      }
    ]
  }
];
