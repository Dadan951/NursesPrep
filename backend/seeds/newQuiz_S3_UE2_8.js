module.exports = [
  {
    title: "Obstructions respiratoires — asthme, BPCO et embolie pulmonaire",
    description: "Maîtrisez la physiopathologie, la clinique et la prise en charge des principales obstructions des voies respiratoires : asthme, BPCO et embolie pulmonaire.",
    semester: "Semestre 3",
    category: "UE 2.8 - Processus obstructifs",
    chapter: "Obstructions respiratoires",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Quel mécanisme physiopathologique est commun à l'asthme et à la BPCO, mais avec des caractéristiques distinctes dans chaque pathologie ?",
        options: [
          { text: "L'obstruction bronchique : réversible et d'origine inflammatoire allergique dans l'asthme, fixe et liée à la destruction alvéolaire dans la BPCO", isCorrect: true },
          { text: "L'hyperréactivité bronchique : permanente et irréversible dans l'asthme, intermittente et réversible sous bronchodilatateur dans la BPCO", isCorrect: false },
          { text: "La destruction des cellules ciliées : progressive et irréversible dans l'asthme, aiguë et réversible sous corticothérapie dans la BPCO", isCorrect: false },
          { text: "L'hypersécrétion muqueuse : déclenchée par un allergène spécifique dans la BPCO, liée au tabac et permanente dans l'asthme", isCorrect: false }
        ],
        explanation: "L'obstruction bronchique est centrale dans les deux pathologies. Dans l'asthme, elle est majoritairement réversible, d'origine inflammatoire (éosinophiles, IgE) et souvent allergique. Dans la BPCO, elle est fixe, résultant de la destruction alvéolaire (emphysème) et du remodelage bronchique lié au tabac, avec un VEMS/CV < 0,70 non réversible après bronchodilatateur."
      },
      {
        text: "Parmi les signes suivants, lequel oriente vers un asthme aigu grave (AAG) nécessitant une hospitalisation immédiate ?",
        options: [
          { text: "Fréquence respiratoire à 28/min, impossibilité de finir une phrase en une seule expiration, SpO2 à 91 % et débit de pointe < 50 % de la théorique", isCorrect: true },
          { text: "Sifflements expiratoires bilatéraux, toux sèche nocturne récurrente, SpO2 à 96 % et débit de pointe entre 60 et 80 % de la théorique", isCorrect: false },
          { text: "Légère dyspnée d'effort, expectoration claire, fréquence respiratoire à 18/min et débit de pointe à 75 % de la théorique", isCorrect: false },
          { text: "Toux productive matinale, dyspnée au premier étage, SpO2 à 94 % au repos et débit de pointe entre 50 et 70 % de la théorique", isCorrect: false }
        ],
        explanation: "L'asthme aigu grave se caractérise par une polypnée > 25/min, une impossibilité de parler en phrases complètes (dyspnée de repos), une SpO2 < 92 % et un DEP < 50 % de la valeur théorique. Ces critères justifient une prise en charge hospitalière urgente avec bronchodilatateurs nébulisés, corticoïdes systémiques et oxygénothérapie."
      },
      {
        text: "Quelle classification est utilisée pour évaluer la sévérité de la BPCO en pratique clinique, et sur quel paramètre fonctionnel repose-t-elle principalement ?",
        options: [
          { text: "La classification GOLD, basée sur le VEMS post-bronchodilatateur exprimé en pourcentage de la valeur théorique prédite", isCorrect: true },
          { text: "La classification MRC, basée sur la capacité vitale forcée (CVF) mesurée lors d'une spirométrie de repos non médicamentée", isCorrect: false },
          { text: "La classification de Sadoul, basée sur la pression artérielle en oxygène (PaO2) mesurée à l'état basal en air ambiant", isCorrect: false },
          { text: "La classification NYHA, basée sur la tolérance à l'effort évaluée lors d'un test de marche de six minutes standardisé", isCorrect: false }
        ],
        explanation: "La classification GOLD (Global Initiative for Chronic Obstructive Lung Disease) stratifie la sévérité de la BPCO en 4 stades selon le VEMS post-bronchodilatateur : GOLD 1 ≥ 80 %, GOLD 2 entre 50 et 79 %, GOLD 3 entre 30 et 49 %, GOLD 4 < 30 % de la théorique. Elle guide les décisions thérapeutiques."
      },
      {
        text: "Quel est le principal facteur déclenchant des exacerbations aiguës de BPCO, et quelle est la prise en charge infirmière prioritaire lors de l'arrivée du patient ?",
        options: [
          { text: "Les infections respiratoires virales ou bactériennes : évaluer la détresse respiratoire, installer en position demi-assise et administrer l'oxygène titré pour maintenir une SpO2 entre 88 et 92 %", isCorrect: true },
          { text: "L'exposition aux allergènes domestiques : installer en décubitus latéral, administrer des antihistaminiques par voie intraveineuse et surveiller le débit de pointe toutes les heures", isCorrect: false },
          { text: "Le stress émotionnel intense et prolongé : administrer une benzodiazépine pour lever le bronchospasme réflexe et surveiller la fréquence cardiaque en continu", isCorrect: false },
          { text: "La pollution atmosphérique extérieure : placer le patient en isolement protecteur, administrer des corticoïdes inhalés à forte dose et réaliser un bilan allergologique urgent", isCorrect: false }
        ],
        explanation: "Les infections (virales surtout, bactériennes secondairement) déclenchent 70 à 80 % des exacerbations de BPCO. La priorité infirmière est l'évaluation de la détresse respiratoire, la position demi-assise et une oxygénothérapie contrôlée visant une SpO2 entre 88 et 92 % pour éviter la dépression du centre respiratoire chez ces patients hypercapniques chroniques."
      },
      {
        text: "Quelle triade clinique classique évoque une embolie pulmonaire, et quel examen para-clinique confirme le diagnostic en première intention ?",
        options: [
          { text: "Dyspnée brutale, douleur thoracique latéralisée et hémoptysie : l'angio-scanner thoracique spiralé avec injection de produit de contraste est l'examen de référence", isCorrect: true },
          { text: "Toux productive, fièvre à 39 °C et crépitants basaux : la radiographie thoracique de face est l'examen diagnostique de première intention recommandé", isCorrect: false },
          { text: "Orthopnée, crépitants bibasaux et turgescence jugulaire : l'échocardiographie transthoracique en urgence est l'examen diagnostique initial recommandé", isCorrect: false },
          { text: "Sibilants expiratoires, cyanose des extrémités et surdité de la base gauche : la bronchoscopie souple est l'examen de première intention pour visualiser l'obstruction", isCorrect: false }
        ],
        explanation: "La triade classique de l'embolie pulmonaire associe dyspnée brutale (90 % des cas), douleur thoracique pleurétique et hémoptysie (inconstante). L'angio-scanner thoracique (angio-TDM) est l'examen de référence car il visualise directement le ou les thrombus dans les artères pulmonaires, avec une sensibilité > 90 % et une spécificité > 95 %."
      },
      {
        text: "Quel score valide est utilisé en pratique clinique pour évaluer la probabilité pré-test d'embolie pulmonaire avant de prescrire un dosage des D-dimères ?",
        options: [
          { text: "Le score de Wells pour l'embolie pulmonaire, qui intègre la fréquence cardiaque, une chirurgie récente, des signes de TVP et l'absence d'autre diagnostic plus probable", isCorrect: true },
          { text: "Le score CHADS2-VASc, qui évalue le risque thromboembolique artériel chez les patients porteurs de fibrillation auriculaire non valvulaire", isCorrect: false },
          { text: "Le score de Caprini, qui stratifie le risque de thrombose veineuse postopératoire dans un contexte chirurgical programmé", isCorrect: false },
          { text: "Le score CURB-65, qui évalue la sévérité des pneumonies communautaires et guide l'indication d'hospitalisation en réanimation", isCorrect: false }
        ],
        explanation: "Le score de Wells pour l'EP attribue des points à des critères cliniques (FC > 100/min, immobilisation récente, signes de TVP, hémoptysie, néoplasie active, EP ou TVP antérieure, absence de diagnostic alternatif probable). Un score faible avec D-dimères négatifs permet d'exclure l'EP sans imagerie. Un score élevé indique directement l'angio-TDM."
      },
      {
        text: "Dans la prise en charge d'une embolie pulmonaire grave avec état de choc, quelle est la thérapeutique de recours lorsque l'anticoagulation seule est insuffisante ?",
        options: [
          { text: "La thrombolyse systémique par alteplase (rt-PA) intraveineuse, qui lyse le thrombus en urgence et restaure la perfusion pulmonaire et la fonction ventriculaire droite", isCorrect: true },
          { text: "L'embolectomie chirurgicale programmée sous circulation extracorporelle réalisée dans les 72 heures suivant le diagnostic confirmé par angio-scanner", isCorrect: false },
          { text: "L'anticoagulation par héparine non fractionnée à dose curative en continu à la seringue électrique, sans recours à une procédure interventionnelle complémentaire", isCorrect: false },
          { text: "La mise en place d'un filtre cave permanent par voie fémorale pour prévenir toute récidive embolique dans les 24 premières heures", isCorrect: false }
        ],
        explanation: "En cas d'embolie pulmonaire à haut risque (état de choc ou arrêt cardiorespiratoire), la thrombolyse par rt-PA (alteplase 100 mg IV en 2 heures) est indiquée en urgence. Elle permet une lyse rapide du thrombus, réduisant les résistances pulmonaires et soulageant le ventricule droit. L'embolectomie chirurgicale ou par cathéter est réservée aux contre-indications à la thrombolyse."
      },
      {
        text: "Quel signe gazométrique caractérise spécifiquement l'embolie pulmonaire non massive à la phase aiguë, et comment l'expliquer ?",
        options: [
          { text: "Une hypoxémie avec hypocapnie (PaO2 basse et PaCO2 basse), liée à la polypnée réflexe qui augmente l'élimination du CO2 malgré l'effet espace mort", isCorrect: true },
          { text: "Une hypoxémie avec hypercapnie (PaO2 basse et PaCO2 haute), traduisant une hypoventilation alvéolaire globale par obstruction bronchique centrale bilatérale", isCorrect: false },
          { text: "Une normoxémie avec hypercapnie (PaO2 normale et PaCO2 haute), reflétant une compensation rénale par rétention de bicarbonates depuis plusieurs semaines", isCorrect: false },
          { text: "Une alcalose métabolique compensée avec normoxémie, résultant de vomissements répétés et d'une déshydratation extracellulaire associée à l'épisode aigu", isCorrect: false }
        ],
        explanation: "L'embolie pulmonaire non massive provoque une hypoxémie par effet espace mort (zones ventilées mais non perfusées) et un effet shunt (redistribution du flux). La polypnée réflexe hyperventile les zones saines, abaissant la PaCO2. On observe donc classiquement une hypoxémie associée à une hypocapnie, traduisant une alcalose respiratoire aiguë."
      }
    ]
  },
  {
    title: "Obstructions cardiovasculaires — SCA, AVC et artériopathie",
    description: "Approfondissez les mécanismes, la sémiologie et la gestion infirmière des obstructions vasculaires majeures : syndromes coronariens aigus, accidents vasculaires cérébraux et artériopathie oblitérante.",
    semester: "Semestre 3",
    category: "UE 2.8 - Processus obstructifs",
    chapter: "Obstructions cardiovasculaires",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Quelle différence physiopathologique fondamentale distingue le SCA avec sus-décalage du segment ST (STEMI) du SCA sans sus-décalage (NSTEMI) ?",
        options: [
          { text: "Dans le STEMI, la plaque athéromateuse rupturée entraîne une occlusion coronaire totale et aiguë ; dans le NSTEMI, l'occlusion est partielle ou transitoire, laissant un flux résiduel", isCorrect: true },
          { text: "Dans le STEMI, la nécrose myocardique est sous-endocardique et réversible ; dans le NSTEMI, elle est transmurale et définitive dès la première heure", isCorrect: false },
          { text: "Dans le STEMI, le mécanisme est un spasme coronarien isolé sans rupture de plaque ; dans le NSTEMI, une thrombose sur sténose stable obstrue totalement la lumière", isCorrect: false },
          { text: "Dans le STEMI, les troponines restent négatives car la nécrose est prévenue par la reperfusion spontanée ; dans le NSTEMI, elles s'élèvent immédiatement dès la première heure", isCorrect: false }
        ],
        explanation: "Le STEMI résulte d'une occlusion coronaire totale et brutale par thrombose sur rupture de plaque, provoquant une nécrose transmurale progressive. Le NSTEMI implique une occlusion incomplète ou une thrombose spontanément partiellement lysée, avec un flux résiduel permettant de limiter la nécrose. Cette distinction conditionne l'urgence de la revascularisation (coronarographie immédiate dans le STEMI)."
      },
      {
        text: "Parmi les éléments suivants, lesquels constituent des critères de reperfusion myocardique après une thrombolyse pour STEMI, attendus dans les 60 à 90 minutes ?",
        options: [
          { text: "Régression du sus-décalage ST de plus de 50 %, disparition ou atténuation de la douleur thoracique et survenue d'arythmies de reperfusion (rythme idioventriculaire accéléré)", isCorrect: true },
          { text: "Normalisation complète de l'ECG avec disparition totale du sus-décalage, absence d'arythmie et augmentation immédiate de la fraction d'éjection ventriculaire gauche", isCorrect: false },
          { text: "Élévation des troponines ultrasensibles au-dessus de la valeur normale, bradycardie sinusale persistante et apparition d'une onde Q de nécrose en dérivations concordantes", isCorrect: false },
          { text: "Chute de la pression artérielle systolique en dessous de 90 mmHg, tachycardie sinusale réflexe et augmentation du segment PR en dérivations frontales", isCorrect: false }
        ],
        explanation: "Les critères indirects de reperfusion après thrombolyse incluent la régression du sus-décalage ST > 50 %, la sédation de la douleur et les arythmies de reperfusion (rythme idioventriculaire accéléré, extrasystoles ventriculaires). Ces signes surviennent dans les 60 à 90 minutes. Leur absence impose un transfert urgent pour coronarographie de sauvetage."
      },
      {
        text: "Quel est le rôle infirmier spécifique lors de la prise en charge initiale d'un patient présentant une douleur thoracique évocatrice de SCA aux urgences ?",
        options: [
          { text: "Réaliser un ECG 18 dérivations dans les 10 minutes, poser deux voies veineuses périphériques, prélever un bilan biologique incluant troponines et bilan de coagulation, et surveiller la pression artérielle en continu", isCorrect: true },
          { text: "Administrer immédiatement de l'aspirine à 500 mg per os sans attendre le résultat de l'ECG, installer le patient en décubitus strict et préparer une perfusion de morphine intraveineuse", isCorrect: false },
          { text: "Préparer le patient pour une coronarographie urgente sans réaliser d'ECG préalable, et administrer de l'héparine non fractionnée en bolus intraveineux selon le poids", isCorrect: false },
          { text: "Installer le patient en position allongée stricte, mesurer la SpO2 et administrer de l'oxygène systématiquement à 6 litres/minute quel que soit le niveau de saturation", isCorrect: false }
        ],
        explanation: "La priorité infirmière est l'ECG 12 (ou 18) dérivations dans les 10 minutes afin de dépister un STEMI. En parallèle, deux VVP sont posées pour les traitements urgents, un bilan biologique avec troponines ultrasensibles, NFS, coagulation est prélevé, et la surveillance continue (ECG, TA, SpO2) est mise en place. L'oxygénothérapie n'est indiquée que si SpO2 < 90 %."
      },
      {
        text: "Quelle est la distinction clinique essentielle entre un AVC ischémique et un AVC hémorragique, et pourquoi est-elle déterminante pour la prise en charge ?",
        options: [
          { text: "Cliniquement, les deux sont indiscernables ; seule l'imagerie (scanner cérébral sans injection) permet de les différencier, car la thrombolyse est contre-indiquée en cas d'hémorragie", isCorrect: true },
          { text: "L'AVC hémorragique se manifeste toujours par une céphalée explosive et une perte de connaissance immédiate, permettant de l'identifier cliniquement sans recourir à l'imagerie", isCorrect: false },
          { text: "L'AVC ischémique présente systématiquement un scanner cérébral anormal dès les premières minutes, alors que l'AVC hémorragique est toujours normal à la phase aiguë", isCorrect: false },
          { text: "La thrombolyse est indiquée dans les deux types d'AVC dans les 4,5 premières heures si les critères d'âge et de pression artérielle sont respectés", isCorrect: false }
        ],
        explanation: "Les déficits neurologiques focaux (hémiplégie, aphasie, troubles visuels) sont cliniquement similaires dans les deux types d'AVC. Le scanner cérébral sans injection est réalisé en urgence car il met en évidence une hyperdensité spontanée en cas d'hémorragie. Cette distinction est absolument nécessaire avant toute thrombolyse, formellement contre-indiquée en cas d'hémorragie intracérébrale."
      },
      {
        text: "Quels sont les critères d'éligibilité à la thrombolyse par rt-PA dans l'AVC ischémique, concernant la fenêtre thérapeutique et les contre-indications majeures ?",
        options: [
          { text: "Délai inférieur à 4,5 heures depuis le début des symptômes, absence d'hémorragie au scanner, pression artérielle contrôlée en dessous de 185/110 mmHg et absence de traitement anticoagulant efficace en cours", isCorrect: true },
          { text: "Délai inférieur à 6 heures depuis le début des symptômes, présence d'une occlusion visible à l'angio-IRM, quel que soit le niveau de pression artérielle et le traitement anticoagulant en cours", isCorrect: false },
          { text: "Délai inférieur à 3 heures uniquement, absence de déficit neurologique antérieur, pression artérielle systolique inférieure à 140 mmHg et âge obligatoirement inférieur à 80 ans", isCorrect: false },
          { text: "Délai inférieur à 24 heures depuis le début des symptômes, score NIHSS supérieur à 25, absence de diabète et traitement antiagrégeant plaquettaire en cours autorisé", isCorrect: false }
        ],
        explanation: "La thrombolyse IV par alteplase (rt-PA) est recommandée dans l'AVC ischémique si le délai symptômes-traitement est inférieur à 4,5 heures, s'il n'y a pas d'hémorragie au scanner, si la TA est < 185/110 mmHg (après correction si nécessaire) et en l'absence de traitement anticoagulant efficace ou d'antécédent d'AVC récent, de chirurgie majeure dans les 14 jours ou de thrombopénie."
      },
      {
        text: "Quel score clinique est utilisé en urgence pour évaluer la sévérité neurologique d'un AVC, et quels domaines évalue-t-il ?",
        options: [
          { text: "Le score NIHSS (National Institutes of Health Stroke Scale), qui évalue le niveau de conscience, le regard conjugué, les champs visuels, la motricité des membres, la sensibilité et le langage", isCorrect: true },
          { text: "Le score de Glasgow, qui évalue l'ouverture des yeux, la réponse verbale et la réponse motrice pour quantifier l'altération de la conscience toutes causes confondues", isCorrect: false },
          { text: "Le score mRS (modified Rankin Scale), qui évalue le handicap fonctionnel résiduel à 3 mois après l'AVC pour orienter vers la rééducation ou le retour à domicile", isCorrect: false },
          { text: "Le score FAST (Face Arm Speech Time), qui évalue la déviation faciale, la chute du membre supérieur et les troubles du langage pour une détection pré-hospitalière", isCorrect: false }
        ],
        explanation: "Le NIHSS est l'échelle de référence en phase aiguë d'AVC. Il explore 11 items (conscience, regard, vision, paralysie faciale, motricité des 4 membres, ataxie, sensibilité, langage, dysarthrie, extinction). Un score entre 0 et 42 guide les décisions thérapeutiques et pronostiques. Le FAST est utile en pré-hospitalier mais le NIHSS est indispensable à l'arrivée en unité neurovasculaire."
      },
      {
        text: "Comment définit-on l'artériopathie oblitérante des membres inférieurs (AOMI) par l'index de pression systolique (IPS), et à quel stade devient-elle symptomatique ?",
        options: [
          { text: "L'AOMI est définie par un IPS < 0,90 ; elle devient symptomatique (claudication intermittente) au stade II de Leriche et Fontaine, lorsque la sténose dépasse 50 à 70 % de la lumière artérielle", isCorrect: true },
          { text: "L'AOMI est définie par un IPS > 1,30 ; elle devient symptomatique dès le stade I avec des douleurs de repos nocturnes et un orteil cyanosé à l'examen clinique", isCorrect: false },
          { text: "L'AOMI est définie par un IPS entre 0,90 et 1,10 ; elle devient symptomatique au stade IV avec une claudication intermittente apparaissant après 500 mètres de marche", isCorrect: false },
          { text: "L'AOMI est définie par une absence de pouls fémoral à la palpation ; elle est asymptomatique jusqu'au stade III où apparaît une nécrose distale des orteils", isCorrect: false }
        ],
        explanation: "L'IPS (rapport pression cheville/pression humérale) est mesuré par Doppler. Un IPS < 0,90 définit l'AOMI. La classification de Leriche et Fontaine comporte 4 stades : I (asymptomatique), II (claudication intermittente à l'effort), III (douleurs de repos), IV (troubles trophiques : ulcère ou gangrène). La symptomatologie apparaît à partir du stade II."
      },
      {
        text: "Quels sont les signes cliniques évocateurs d'ischémie aiguë de membre (IAM) et quelle est la conduite à tenir infirmière immédiate ?",
        options: [
          { text: "Les 6P : Douleur (Pain), Pâleur, Paralysie, Paresthésies, Pouls aboli et Poïkilothermie (froideur) ; alerter immédiatement le médecin, ne pas surélever le membre et préparer l'anticoagulation d'urgence", isCorrect: true },
          { text: "Œdème bilatéral des membres inférieurs, dilatation veineuse superficielle, peau luisante et érythème diffus ; surélever le membre à 30 degrés et appliquer de la glace pour limiter l'inflammation", isCorrect: false },
          { text: "Crampes nocturnes récidivantes, fourmillements plantaires, diminution de la pilosité du mollet et peau fine ; programmer une échographie Doppler en consultation programmée sous 72 heures", isCorrect: false },
          { text: "Claudication intermittente après 200 mètres, sensation de pesanteur du mollet, pouls fémoral perçu et IPS à 0,75 ; conseiller l'arrêt du tabac et prescrire un traitement antiagrégant en ambulatoire", isCorrect: false }
        ],
        explanation: "L'ischémie aiguë de membre est une urgence vasculaire caractérisée par les 6P. Le membre est pâle, froid, douloureux, avec abolition des pouls, paralysie et paresthésies. La conduite infirmière immédiate est d'alerter le médecin, de ne pas surélever le membre (aggrave l'ischémie distale), d'éviter tout froid ou chaleur directe, et de préparer l'héparinothérapie en attente de revascularisation chirurgicale ou endovasculaire urgente."
      }
    ]
  },
  {
    title: "Obstructions digestives et urinaires — occlusions et lithiases",
    description: "Comprenez la physiopathologie, le tableau clinique et la prise en charge infirmière des obstructions digestives (occlusions intestinales) et urinaires (coliques néphrétiques, lithiases).",
    semester: "Semestre 3",
    category: "UE 2.8 - Processus obstructifs",
    chapter: "Obstructions digestives et urinaires",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle distinction clinique et physiopathologique sépare l'occlusion intestinale mécanique de l'occlusion intestinale fonctionnelle (iléus paralytique) ?",
        options: [
          { text: "L'occlusion mécanique résulte d'un obstacle physique (bride, strangulation, tumeur) avec arrêt du transit et météorisme asymétrique ; l'iléus paralytique est une paralysie diffuse du péristaltisme sans obstacle, souvent post-opératoire", isCorrect: true },
          { text: "L'occlusion mécanique survient toujours au niveau du côlon et est indolore ; l'iléus paralytique touche exclusivement l'intestin grêle et s'accompagne de douleurs intenses et continues", isCorrect: false },
          { text: "L'occlusion mécanique est réversible spontanément en 48 heures sans intervention ; l'iléus paralytique nécessite systématiquement une chirurgie en urgence dans les 6 premières heures", isCorrect: false },
          { text: "L'occlusion mécanique se traite exclusivement par laparotomie exploratrice ; l'iléus paralytique se traite exclusivement par laparoscopie diagnostique et lavage péritonéal", isCorrect: false }
        ],
        explanation: "L'occlusion mécanique implique un obstacle physique (bride post-opératoire la plus fréquente, volvulus, hernie étranglée, tumeur obstructive) avec arrêt brutal des matières et des gaz. L'iléus paralytique est une paralysie du péristaltisme sans obstacle physique, survenant après chirurgie abdominale, péritonite, hypokaliémie ou prise de morphiniques. Le traitement diffère : chirurgical pour la mécanique, médical pour le fonctionnel."
      },
      {
        text: "Quels sont les quatre signes cardinaux de l'occlusion intestinale aiguë et comment varient-ils selon le niveau de l'obstruction ?",
        options: [
          { text: "Douleurs abdominales, vomissements, arrêt des matières et des gaz, et météorisme : les vomissements sont précoces et bilieux dans l'occlusion haute ; l'arrêt du transit est prédominant dans l'occlusion basse", isCorrect: true },
          { text: "Diarrhées profuses, rectorragies, fièvre à 39 °C et contracture abdominale : ces signes sont plus sévères dans l'occlusion haute que dans l'occlusion colique basse", isCorrect: false },
          { text: "Ictère, hépatomégalie, ascite et amaigrissement : ces signes caractérisent l'occlusion par compression extrinsèque d'origine hépatique ou pancréatique", isCorrect: false },
          { text: "Dysphagie, pyrosis, hoquet et régurgitations : ces signes évoquent une obstruction de la jonction gastro-œsophagienne par un mégaœsophage ou un anneau de Schatzki", isCorrect: false }
        ],
        explanation: "Les 4 signes cardinaux sont : douleurs abdominales (coliques ou continues en cas de strangulation), vomissements (précoces et abondants dans l'obstruction haute du grêle, tardifs et fécaloïdes dans l'occlusion colique), arrêt des matières et des gaz, et météorisme (diffus et central dans les occlusions du grêle, cadrant dans les occlusions coliques)."
      },
      {
        text: "Quelle complication grave doit être systématiquement recherchée dans une occlusion intestinale par strangulation, et quels signes cliniques l'évoquent ?",
        options: [
          { text: "La nécrose ischémique intestinale, évoquée par des douleurs continues et intenses (non calmées par les antalgiques), une défense ou contracture abdominale, une fièvre et une tachycardie", isCorrect: true },
          { text: "La perforation d'ulcère gastrique associée, évoquée par une hématémèse abondante, un méléna et une chute de la pression artérielle avec tachycardie réflexe", isCorrect: false },
          { text: "Le syndrome de Mallory-Weiss, évoqué par des vomissements répétés avec sang rouge vif dans les vomissures et douleurs rétrosternales intenses à la déglutition", isCorrect: false },
          { text: "L'appendicite aiguë perforée associée, évoquée par une douleur migrant vers la fosse iliaque droite, une défense localisée et une fièvre modérée à 38 °C", isCorrect: false }
        ],
        explanation: "La strangulation (volvulus, hernie étranglée, bride avec torsion) peut provoquer une ischémie puis une nécrose du segment intestinal concerné. Les signes d'alarme sont des douleurs continues et très intenses (contrasting avec les coliques intermittentes de l'occlusion simple), une défense ou contracture (péritonite), une fièvre et une tachycardie. C'est une urgence chirurgicale absolue."
      },
      {
        text: "Quelle est la prise en charge infirmière prioritaire d'un patient admis pour occlusion intestinale aiguë avec vomissements importants et ballonnement abdominal ?",
        options: [
          { text: "Pose d'une sonde naso-gastrique en aspiration douce, voie veineuse périphérique avec remplissage hydroélectrolytique, surveillance des paramètres vitaux et mise en place d'une diète stricte", isCorrect: true },
          { text: "Administration immédiate d'un laxatif osmotique per os, alimentation légère et fractionnée, et surveillance de la reprise du transit toutes les 4 heures", isCorrect: false },
          { text: "Préparation colique par lavage antérograde, alimentation entérale par sonde nasoduodénale et surveillance de la pression abdominale par jaugeage vésical", isCorrect: false },
          { text: "Réalisation d'un toucher rectal en urgence pour désobstruer manuellement le fécalome suspecté, puis hydratation orale progressive et surveillance ambulatoire", isCorrect: false }
        ],
        explanation: "La priorité est la sonde naso-gastrique en aspiration pour décomprimer le tube digestif, lever les vomissements et prévenir l'inhalation. La VVP avec remplissage corrige la déshydratation et les troubles hydroélectrolytiques (hypokaliémie fréquente). La diète stricte interdit toute alimentation per os avant la levée de l'obstruction. Une surveillance continue des constantes vitales dépiste les signes de gravité."
      },
      {
        text: "Quelle est la composition biochimique la plus fréquente des calculs rénaux chez l'adulte, et quel facteur favorisant principal est identifié ?",
        options: [
          { text: "Les calculs d'oxalate de calcium, représentant 70 à 80 % des cas, favorisés par une hypercalciurie, une hyperoxalurie ou une hypocitraturie et une apport hydrique insuffisant", isCorrect: true },
          { text: "Les calculs d'acide urique, représentant 70 à 80 % des cas, favorisés par une hyperuricémie chronique dans le cadre d'une goutte et d'une alimentation riche en purines", isCorrect: false },
          { text: "Les calculs de struvite (phosphate ammoniaco-magnésien), représentant 70 à 80 % des cas, favorisés par les infections urinaires à germes uréasiques répétées", isCorrect: false },
          { text: "Les calculs de cystine, représentant 70 à 80 % des cas, favorisés par une anomalie génétique du transport des acides aminés dibasiques au niveau tubulaire rénal", isCorrect: false }
        ],
        explanation: "Les calculs d'oxalate de calcium (mono- ou dihydraté) constituent 70 à 80 % des lithiases rénales. Leurs facteurs favorisants sont l'hypercalciurie (idiopathique ou secondaire), l'hyperoxalurie alimentaire ou génétique, la hypocitraturie et une diurèse insuffisante (< 1,5 L/j). Les calculs d'acide urique représentent 10 à 15 %, les struvites 5 à 10 % et les cystines moins de 1 %."
      },
      {
        text: "Quel tableau clinique est caractéristique de la colique néphrétique simple et comment la distinguer d'une colique néphrétique compliquée ?",
        options: [
          { text: "Douleur lombaire unilatérale violente et irradiant vers la fosse iliaque et les organes génitaux externes, sans fièvre ni anurie : la forme compliquée associe fièvre, anurie ou rein unique obstrué et constitue une urgence urologique", isCorrect: true },
          { text: "Douleur lombaire bilatérale et symétrique, hématurie macroscopique abondante et fièvre à 38,5 °C : la forme simple ne présente pas d'hématurie et cède spontanément en moins d'une heure", isCorrect: false },
          { text: "Douleur épigastrique irradiant en ceinture, vomissements bilieux et élévation des enzymes pancréatiques : la forme compliquée associe un calcul coralliforme visible à la radiographie sans préparation", isCorrect: false },
          { text: "Douleur lombaire à irradiation ascendante vers l'épaule droite, nausées et ictère conjonctival : la forme simple est traitée par antispasmodiques oraux et la forme compliquée par lithotripsie extracorporelle", isCorrect: false }
        ],
        explanation: "La colique néphrétique typique est une douleur lombaire unilatérale, brutale, paroxystique, irradiant vers la fosse iliaque ipsilatérale, l'aine et les organes génitaux. Elle est apyrétique et sans anurie. La forme compliquée (urgence absolue) associe fièvre (pyélonéphrite obstructive = choc septique potentiel), anurie (rein unique ou lithiase bilatérale) ou insuffisance rénale aiguë, imposant un drainage urgent."
      },
      {
        text: "Quelle est la prise en charge médicale et infirmière d'une colique néphrétique simple en structure d'urgence, selon les recommandations actuelles ?",
        options: [
          { text: "Antalgiques de palier 1 et 2 (paracétamol, kétoprofène AINS en IV), évaluation de la douleur par EVA, hydratation modérée (pas de forcing diurétique), bilan biologique et ECBU, et filtre des urines pour récupérer le calcul", isCorrect: true },
          { text: "Morphine systématique à 0,1 mg/kg IV dès l'arrivée, hyperhydratation intraveineuse à 3 litres en 2 heures pour favoriser l'expulsion du calcul, et lithotripsie en urgence si EVA > 6", isCorrect: false },
          { text: "Sondage vésical immédiat pour mesurer la diurèse, restriction hydrique stricte, antispasmodiques en première intention et bilan urologique complet sous 24 heures", isCorrect: false },
          { text: "Administration de furosémide intraveineux pour forcer la diurèse, antalgiques opioïdes uniquement si EVA > 8, et scanner abdominal injecté systématique en première intention", isCorrect: false }
        ],
        explanation: "La prise en charge de la CNS repose sur les AINS intraveineux (kétoprofène) en première intention pour leur action antalgique et antispasmodique, complétés par du paracétamol. L'hyperhydratation n'est pas recommandée car elle majore la distension pyélocalicielle et la douleur. Le scanner abdominal sans injection est l'imagerie de référence. L'ECBU recherche une infection associée. Le filtre à urines permet d'analyser le calcul éliminé."
      },
      {
        text: "Quelle technique de drainage est indiquée en urgence en cas de pyélonéphrite obstructive avec calcul bloqué à la jonction urétéro-vésicale, et quel est son objectif principal ?",
        options: [
          { text: "La mise en place d'une sonde urétérale (JJ ou double J) ou d'une néphrostomie percutanée, afin de lever l'obstruction, drainer les urines infectées et prévenir le choc septique et la destruction rénale", isCorrect: true },
          { text: "La lithotripsie extracorporelle par ondes de choc en urgence, afin de fragmenter le calcul et permettre son élimination spontanée dans les 48 heures suivant la procédure", isCorrect: false },
          { text: "Le sondage vésical à demeure par sonde de Foley, afin de décomprimer la voie excrétrice et permettre l'élimination du calcul sans intervention urologique complémentaire", isCorrect: false },
          { text: "La néphrectomie partielle laparoscopique en urgence, afin d'enlever le segment rénal infecté et préserver la fonction du rein controlatéral en évitant la diffusion septique", isCorrect: false }
        ],
        explanation: "La pyélonéphrite obstructive est une urgence urologique car l'infection en amont d'un obstacle non drainé peut évoluer vers le choc septique et la destruction irréversible du rein. Le drainage urgent par sonde urétérale JJ (montée sous anesthésie locale) ou néphrostomie percutanée (sous échographie) lève l'obstruction et permet l'évacuation des urines infectées. Une antibiothérapie probabiliste à large spectre est débutée simultanément."
      }
    ]
  }
];
