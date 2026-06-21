// UE 2.11 - Pharmacologie et thérapeutiques — 5 quiz (chapitres 1-5) Semestre 1 IFSI
module.exports = [
  // ─── 1. Pharmacocinétique — absorption et biodisponibilité ────────────────
  {
    "title": "Pharmacocinétique — absorption et biodisponibilité des médicaments",
    "description": "Quiz sur les voies d'administration, les mécanismes d'absorption gastro-intestinale et le concept de biodisponibilité, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Pharmacocinétique — absorption et biodisponibilité des médicaments",
    "difficulty": "medium",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle voie d'administration permet d'éviter l'effet de premier passage hépatique ?",
        "options": [
          { "text": "La voie orale sous forme de comprimé gastro-résistant", "isCorrect": false },
          { "text": "La voie sublinguale absorbée par la muqueuse buccale", "isCorrect": true },
          { "text": "La voie rectale basse absorbée par les veines hémorroïdales sup.", "isCorrect": false },
          { "text": "La voie orale sous forme de solution aqueuse simple", "isCorrect": false }
        ],
        "explanation": "La voie sublinguale permet au principe actif de passer directement dans la circulation systémique via les veines sublinguales, sans transiter par le foie (pas d'effet de premier passage hépatique). La voie rectale haute, en revanche, rejoint la veine porte."
      },
      {
        "text": "Comment se définit la biodisponibilité absolue d'un médicament administré par voie orale ?",
        "options": [
          { "text": "La fraction de la dose qui atteint la circulation systémique inchangée", "isCorrect": true },
          { "text": "La vitesse maximale à laquelle le médicament est absorbé au niveau intestinal", "isCorrect": false },
          { "text": "La quantité totale de médicament éliminée dans les urines en 24 heures", "isCorrect": false },
          { "text": "Le rapport entre la dose orale et la concentration plasmatique maximale", "isCorrect": false }
        ],
        "explanation": "La biodisponibilité absolue (F) est la fraction de la dose administrée qui parvient intacte dans la circulation générale. Elle est calculée en comparant l'AUC orale à l'AUC intraveineuse (référence = 100 %)."
      },
      {
        "text": "Quel facteur diminue principalement l'absorption orale d'un médicament lipophile ?",
        "options": [
          { "text": "Une large surface d'absorption au niveau de l'intestin grêle", "isCorrect": false },
          { "text": "Un pH acide de l'estomac favorisant la forme ionisée du principe actif", "isCorrect": true },
          { "text": "Une forte solubilité aqueuse du principe actif à pH neutre", "isCorrect": false },
          { "text": "Un flux sanguin splanchnique élevé favorisant le gradient de concentration", "isCorrect": false }
        ],
        "explanation": "Les médicaments lipophiles traversent les membranes cellulaires sous leur forme non ionisée. Un pH acide gastrique augmente l'ionisation des bases faibles lipophiles, réduisant ainsi leur absorption. L'absorption intestinale est au contraire facilitée pour les acides faibles en milieu acide."
      },
      {
        "text": "Quel mécanisme de transport est utilisé pour l'absorption intestinale de la vitamine B12 ?",
        "options": [
          { "text": "La diffusion passive selon le gradient de concentration lipidique", "isCorrect": false },
          { "text": "La pinocytose non spécifique par les entérocytes duodénaux", "isCorrect": false },
          { "text": "Le transport actif saturable via la glycoprotéine P intestinale", "isCorrect": false },
          { "text": "L'endocytose médiée par récepteur après liaison au facteur intrinsèque", "isCorrect": true }
        ],
        "explanation": "La vitamine B12 se lie au facteur intrinsèque (glycoprotéine secrétée par les cellules pariétales gastriques), et ce complexe est internalisé par endocytose médiée par récepteurs dans les entérocytes iléaux. Ce mécanisme est saturable et spécifique."
      },
      {
        "text": "Qu'est-ce que l'effet de premier passage hépatique ?",
        "options": [
          { "text": "La biotransformation du médicament par les enzymes intestinales et hépatiques avant d'atteindre la circulation générale", "isCorrect": true },
          { "text": "La fixation irréversible du médicament aux protéines plasmatiques lors du premier passage sanguin", "isCorrect": false },
          { "text": "L'élimination rénale du médicament lors de son premier passage dans les capillaires glomérulaires", "isCorrect": false },
          { "text": "La saturation des récepteurs cibles lors de la première administration du médicament", "isCorrect": false }
        ],
        "explanation": "L'effet de premier passage hépatique désigne le métabolisme pré-systémique subi par un médicament absorbé au niveau intestinal avant d'atteindre la circulation générale. Il implique les enzymes de la paroi intestinale (CYP3A4) et du foie (CYP450), réduisant parfois fortement la biodisponibilité."
      },
      {
        "text": "Pour quelle raison les comprimés gastro-résistants ne doivent-ils pas être écrasés ?",
        "options": [
          { "text": "L'enrobage entérique protège le principe actif de la dégradation acide gastrique", "isCorrect": true },
          { "text": "L'écrasement accélère la dissolution et augmente dangereusement la Cmax plasmatique", "isCorrect": false },
          { "text": "L'enrobage contient des excipients allergènes libérés par l'écrasement mécanique", "isCorrect": false },
          { "text": "L'écrasement empêche le principe actif de franchir la barrière intestinale mucosale", "isCorrect": false }
        ],
        "explanation": "L'enrobage gastro-résistant (polymères acido-résistants comme l'Eudragit®) protège soit le principe actif de l'acidité gastrique (ex. : oméprazole, érythromycine), soit la muqueuse gastrique du principe actif irritant. L'écrasement détruit cet enrobage et expose le médicament au milieu acide."
      },
      {
        "text": "Quelle voie d'administration présente la biodisponibilité la plus élevée et la plus reproductible ?",
        "options": [
          { "text": "La voie transdermique par patch à libération prolongée sur 24 heures", "isCorrect": false },
          { "text": "La voie intramusculaire profonde avec absorption par capillaires musculaires", "isCorrect": false },
          { "text": "La voie intraveineuse directe en bolus ou perfusion continue", "isCorrect": true },
          { "text": "La voie sublinguale avec absorption par la muqueuse buccale richement vascularisée", "isCorrect": false }
        ],
        "explanation": "La voie intraveineuse (IV) est la seule qui offre une biodisponibilité de 100 % par définition, car le médicament est directement introduit dans la circulation générale sans étape d'absorption. Elle permet aussi un contrôle précis de la cinétique."
      },
      {
        "text": "Quel paramètre pharmacocinétique est directement relié à la biodisponibilité d'un médicament ?",
        "options": [
          { "text": "Le volume de distribution apparent (Vd) mesuré après injection IV", "isCorrect": false },
          { "text": "La clairance totale de l'organisme calculée d'après la demi-vie", "isCorrect": false },
          { "text": "L'aire sous la courbe (AUC) des concentrations plasmatiques en fonction du temps", "isCorrect": true },
          { "text": "La concentration minimale efficace (CME) au site d'action pharmacologique", "isCorrect": false }
        ],
        "explanation": "L'AUC (Area Under the Curve) reflète la quantité totale de médicament qui a atteint la circulation systémique sur une période donnée. Le rapport AUC orale / AUC IV × 100 donne la biodisponibilité absolue en pourcentage."
      }
    ]
  },

  // ─── 2. Pharmacocinétique — distribution, liaison protéique et Vd ─────────
  {
    "title": "Pharmacocinétique — distribution, liaison protéique et volume de distribution",
    "description": "Quiz sur la distribution tissulaire des médicaments, la liaison aux protéines plasmatiques et le volume de distribution apparent, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Pharmacocinétique — distribution, liaison protéique et volume de distribution",
    "difficulty": "medium",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle fraction du médicament plasmatique est pharmacologiquement active ?",
        "options": [
          { "text": "La fraction liée à l'albumine, facilement libérée au site d'action", "isCorrect": false },
          { "text": "La fraction liée aux globulines alpha-1 acides glycoprotéines plasmatiques", "isCorrect": false },
          { "text": "La fraction libre non liée aux protéines plasmatiques circulantes", "isCorrect": true },
          { "text": "La fraction totale mesurée par dosage plasmatique conventionnel HPLC", "isCorrect": false }
        ],
        "explanation": "Seule la fraction libre (non liée aux protéines) peut diffuser vers les tissus, atteindre les récepteurs et exercer un effet pharmacologique ou être éliminée. La fraction liée constitue un réservoir circulant inactif temporairement."
      },
      {
        "text": "Qu'indique un volume de distribution apparent (Vd) très élevé (> 500 L) ?",
        "options": [
          { "text": "Le médicament reste principalement dans le compartiment vasculaire sanguin", "isCorrect": false },
          { "text": "Le médicament est massivement séquestré dans les tissus périphériques extravasculaires", "isCorrect": true },
          { "text": "Le médicament est fortement lié aux protéines plasmatiques comme l'albumine", "isCorrect": false },
          { "text": "Le médicament est rapidement éliminé par voie rénale sans distribution tissulaire", "isCorrect": false }
        ],
        "explanation": "Un Vd très élevé signifie que le médicament quitte rapidement le plasma pour se concentrer dans les tissus (graisse, muscles, organes). Par exemple, l'amiodarone a un Vd > 60 L/kg car elle s'accumule dans les tissus adipeux et le foie."
      },
      {
        "text": "Quelle protéine plasmatique est la principale protéine de liaison des médicaments acides faibles ?",
        "options": [
          { "text": "L'alpha-1 glycoprotéine acide (orosomucoïde) circulante", "isCorrect": false },
          { "text": "La transferrine ferrique impliquée dans le transport du fer", "isCorrect": false },
          { "text": "L'albumine sérique synthétisée par le foie", "isCorrect": true },
          { "text": "Les globulines bêta-lipoprotéines de basse densité plasmatiques", "isCorrect": false }
        ],
        "explanation": "L'albumine (35-50 g/L dans le plasma) est la principale protéine de transport des médicaments acides faibles (anti-inflammatoires, anticoagulants coumariniques, sulfamides, furosémide). L'alpha-1 glycoprotéine acide fixe plutôt les bases faibles lipophiles (lidocaïne, propranolol)."
      },
      {
        "text": "Pourquoi l'hypoalbuminémie (ex. : cirrhose hépatique) peut-elle majorer les effets d'un médicament ?",
        "options": [
          { "text": "Elle augmente la clairance rénale totale et accélère l'élimination du médicament", "isCorrect": false },
          { "text": "Elle réduit la fraction libre disponible et diminue les effets thérapeutiques", "isCorrect": false },
          { "text": "Elle augmente la fraction libre plasmatique et expose à un risque de surdosage", "isCorrect": true },
          { "text": "Elle inhibe les enzymes hépatiques CYP450 et bloque le métabolisme de premier passage", "isCorrect": false }
        ],
        "explanation": "En cas d'hypoalbuminémie, la capacité de liaison protéique est réduite : la fraction libre du médicament augmente, amplifiant les effets pharmacologiques et le risque de toxicité. C'est particulièrement critique pour des médicaments à forte liaison protéique (warfarine, phénytoïne)."
      },
      {
        "text": "La barrière hémato-encéphalique (BHE) limite le passage cérébral des médicaments. Quel type moléculaire la franchit le plus facilement ?",
        "options": [
          { "text": "Les molécules ionisées hydrophiles de faible poids moléculaire", "isCorrect": false },
          { "text": "Les molécules lipophiles non ionisées de faible poids moléculaire", "isCorrect": true },
          { "text": "Les protéines porteuses liées à un ligand médicamenteux actif", "isCorrect": false },
          { "text": "Les nanoparticules chargées positivement de diamètre inférieur à 500 nm", "isCorrect": false }
        ],
        "explanation": "La BHE est formée par des jonctions serrées entre les cellules endothéliales cérébrales. Seules les molécules lipophiles, non ionisées et de faible poids moléculaire (< 400-500 Da) peuvent la traverser par diffusion passive. Les transporteurs d'efflux (P-gp) en expulsent également certains médicaments."
      },
      {
        "text": "Quelle est la conséquence pharmacocinétique principale d'une forte lipophilie d'un médicament sur sa distribution ?",
        "options": [
          { "text": "Une distribution limitée au secteur plasmatique avec un Vd faible (< 5 L)", "isCorrect": false },
          { "text": "Une élimination rénale rapide sans accumulation tissulaire notable", "isCorrect": false },
          { "text": "Une accumulation dans les tissus adipeux et une longue demi-vie d'élimination", "isCorrect": true },
          { "text": "Une liaison préférentielle à l'albumine et une fraction libre plasmatique élevée", "isCorrect": false }
        ],
        "explanation": "Les médicaments très lipophiles se partitionnent préférentiellement dans les graisses corporelles, créant un compartiment de stockage. Cela augmente le Vd, prolonge la demi-vie d'élimination et peut entraîner une accumulation lors de traitements répétés (ex. : benzodiazépines liposolubles)."
      },
      {
        "text": "Quel facteur physiologique modifie significativement la distribution des médicaments chez le nouveau-né par rapport à l'adulte ?",
        "options": [
          { "text": "Une masse grasse corporelle plus élevée favorisant la séquestration lipidique", "isCorrect": false },
          { "text": "Une proportion d'eau corporelle totale plus importante et une BHE immature", "isCorrect": true },
          { "text": "Une activité enzymatique CYP3A4 hépatique plus élevée augmentant le métabolisme", "isCorrect": false },
          { "text": "Une albumine sérique en excès augmentant la liaison protéique des médicaments", "isCorrect": false }
        ],
        "explanation": "Le nouveau-né possède une proportion d'eau corporelle totale plus élevée (75-80 % vs 60 % chez l'adulte), un compartiment adipeux réduit, une BHE immature plus perméable et une albuminémie plus faible. Ces facteurs modifient profondément le Vd et la distribution des médicaments."
      },
      {
        "text": "Qu'est-ce que le phénomène de compétition protéique entre deux médicaments ?",
        "options": [
          { "text": "Deux médicaments activent les mêmes récepteurs cibles en se faisant concurrence", "isCorrect": false },
          { "text": "Deux médicaments inhibent mutuellement leur métabolisme hépatique par CYP450", "isCorrect": false },
          { "text": "Un médicament déplace l'autre de ses sites de liaison protéique, augmentant la fraction libre", "isCorrect": true },
          { "text": "Deux médicaments précipitent ensemble lors de leur mélange en perfusion intraveineuse", "isCorrect": false }
        ],
        "explanation": "Lorsque deux médicaments se lient aux mêmes sites protéiques (ex. : albumine), l'un peut déplacer l'autre, augmentant sa fraction libre et le risque de surdosage. Exemple classique : l'aspirine déplace la warfarine de l'albumine, majorant le risque hémorragique."
      }
    ]
  },

  // ─── 3. Pharmacocinétique — métabolisme hépatique et élimination rénale ───
  {
    "title": "Pharmacocinétique — métabolisme hépatique et élimination rénale",
    "description": "Quiz sur les réactions de biotransformation hépatique (phases I et II) et les mécanismes d'excrétion rénale des médicaments, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Pharmacocinétique — métabolisme hépatique et élimination rénale",
    "difficulty": "medium",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel est le principal système enzymatique impliqué dans le métabolisme de phase I des médicaments ?",
        "options": [
          { "text": "Les UDP-glucuronosyltransférases (UGT) microsomales hépatiques", "isCorrect": false },
          { "text": "Le système des monooxygénases à cytochrome P450 (CYP450) hépatiques", "isCorrect": true },
          { "text": "Les sulfotransférases cytosoliques catalysant les réactions de sulfoconjugaison", "isCorrect": false },
          { "text": "Les N-acétyltransférases mitochondriales impliquées dans l'acétylation", "isCorrect": false }
        ],
        "explanation": "Le cytochrome P450 (CYP450) est la principale superfamille d'enzymes de phase I. Ces hémoprotéines microsomales hépatiques catalysent des réactions d'oxydation, de réduction et d'hydrolyse. Les isoformes CYP3A4, CYP2D6 et CYP2C9 métabolisent la majorité des médicaments."
      },
      {
        "text": "Qu'est-ce qu'une réaction de phase II du métabolisme des médicaments ?",
        "options": [
          { "text": "Une réaction d'oxydation par le CYP3A4 produisant un métabolite réactif", "isCorrect": false },
          { "text": "Une réaction de conjugaison ajoutant un groupement polaire pour augmenter la solubilité", "isCorrect": true },
          { "text": "Une réaction de réduction des groupements nitro par les bactéries intestinales", "isCorrect": false },
          { "text": "Une réaction d'hydrolyse des liaisons ester dans le plasma sanguin circulant", "isCorrect": false }
        ],
        "explanation": "Les réactions de phase II (conjugaison) associent un groupement polaire endogène (acide glucuronique, sulfate, acétyle, glutathion) à un médicament ou à son métabolite de phase I. Cela augmente l'hydrophilie et facilite l'excrétion rénale ou biliaire."
      },
      {
        "text": "Un patient sous rifampicine (inducteur enzymatique) reçoit de la warfarine. Quel effet clinique est attendu ?",
        "options": [
          { "text": "Augmentation de l'anticoagulation par inhibition du métabolisme de la warfarine", "isCorrect": false },
          { "text": "Diminution de l'anticoagulation par accélération du métabolisme de la warfarine", "isCorrect": true },
          { "text": "Aucune interaction car la warfarine n'est pas métabolisée par le CYP450", "isCorrect": false },
          { "text": "Risque hémorragique par compétition de liaison protéique entre les deux molécules", "isCorrect": false }
        ],
        "explanation": "La rifampicine est un puissant inducteur enzymatique (CYP2C9, CYP3A4). Elle accélère le métabolisme de la warfarine, réduisant ses concentrations plasmatiques et donc son effet anticoagulant. Le risque est une thrombose. L'arrêt de la rifampicine peut inverser brutalement cet effet."
      },
      {
        "text": "Quelle est la conséquence de l'inhibition du CYP3A4 par le jus de pamplemousse ?",
        "options": [
          { "text": "Réduction des concentrations plasmatiques des médicaments substrats du CYP3A4", "isCorrect": false },
          { "text": "Augmentation des concentrations plasmatiques des médicaments substrats du CYP3A4", "isCorrect": true },
          { "text": "Accélération de l'élimination rénale des médicaments par filtration glomérulaire", "isCorrect": false },
          { "text": "Induction de la glucuroconjugaison hépatique des médicaments substrats", "isCorrect": false }
        ],
        "explanation": "Le jus de pamplemousse contient des furanocoumarines qui inhibent irréversiblement le CYP3A4 intestinal. Cela réduit le métabolisme de premier passage de certains médicaments (statines, inhibiteurs calciques, ciclosporine), augmentant leur biodisponibilité et le risque de toxicité."
      },
      {
        "text": "Quels sont les trois mécanismes rénaux impliqués dans l'élimination d'un médicament ?",
        "options": [
          { "text": "Filtration glomérulaire, réabsorption tubulaire active et sécrétion tubulaire passive", "isCorrect": false },
          { "text": "Filtration glomérulaire, sécrétion tubulaire active et réabsorption tubulaire passive", "isCorrect": true },
          { "text": "Filtration glomérulaire, métabolisme tubulaire oxydatif et excrétion biliaire hépatique", "isCorrect": false },
          { "text": "Filtration glomérulaire, liaison à l'uromoduline tubulaire et précipitation urinaire acide", "isCorrect": false }
        ],
        "explanation": "L'élimination rénale résulte de : (1) filtration glomérulaire (fraction libre filtrée), (2) sécrétion tubulaire active (transporteurs OAT, OCT au niveau proximal) et (3) réabsorption tubulaire passive (médicaments lipophiles non ionisés). L'excrétion nette = filtration + sécrétion − réabsorption."
      },
      {
        "text": "Pourquoi adapte-t-on la posologie de la gentamicine (aminoside) en cas d'insuffisance rénale ?",
        "options": [
          { "text": "La gentamicine est fortement métabolisée par le foie, défaillant en cas d'IR", "isCorrect": false },
          { "text": "La gentamicine est éliminée exclusivement par filtration glomérulaire rénale", "isCorrect": true },
          { "text": "La gentamicine se fixe à l'albumine rénale et s'accumule dans le cortex", "isCorrect": false },
          { "text": "La gentamicine inhibe les transporteurs tubulaires rénaux en cas d'accumulation", "isCorrect": false }
        ],
        "explanation": "Les aminosides sont hydrophiles et éliminés quasi exclusivement par filtration glomérulaire sans métabolisme hépatique. En cas d'insuffisance rénale, la clairance diminue, les concentrations s'élèvent et le risque de néphrotoxicité et d'ototoxicité augmente fortement. La posologie doit être adaptée au DFG."
      },
      {
        "text": "Qu'est-ce que la clairance hépatique d'un médicament (ClH) ?",
        "options": [
          { "text": "Le volume de plasma épuré par unité de temps par le foie par métabolisme et excrétion biliaire", "isCorrect": true },
          { "text": "La quantité totale de médicament transformée en métabolites actifs par heure au niveau hépatique", "isCorrect": false },
          { "text": "La demi-vie de disparition du médicament liée à la seule biotransformation hépatique enzymatique", "isCorrect": false },
          { "text": "Le rapport entre la dose IV et la concentration plasmatique maximale après administration orale", "isCorrect": false }
        ],
        "explanation": "La clairance hépatique (ClH) exprime le volume de plasma totalement épuré du médicament par le foie par unité de temps (mL/min ou L/h). Elle dépend du débit sanguin hépatique, de la fraction libre et de la capacité intrinsèque d'élimination (Clint) des enzymes hépatiques."
      },
      {
        "text": "Quel paramètre pharmacocinétique est directement utilisé pour calculer l'intervalle entre deux prises dans les traitements répétés ?",
        "options": [
          { "text": "Le volume de distribution apparent (Vd) en litres par kilogramme de poids", "isCorrect": false },
          { "text": "La demi-vie d'élimination (t½) du médicament à l'état d'équilibre plasmatique", "isCorrect": true },
          { "text": "L'aire sous la courbe (AUC) après une dose unique administrée par voie orale", "isCorrect": false },
          { "text": "La concentration maximale (Cmax) mesurée après la première dose thérapeutique", "isCorrect": false }
        ],
        "explanation": "La demi-vie d'élimination (t½) est le temps nécessaire pour que la concentration plasmatique diminue de moitié. Elle guide l'espacement des prises : un intervalle d'environ 1 t½ maintient des fluctuations acceptables. L'état d'équilibre (plateau) est atteint après 4-5 t½."
      }
    ]
  },

  // ─── 4. Pharmacodynamie — mécanismes d'action, récepteurs et dose-effet ───
  {
    "title": "Pharmacodynamie — mécanismes d'action, récepteurs et relation dose-effet",
    "description": "Quiz sur les cibles moléculaires des médicaments, les types de récepteurs, et les concepts d'agonisme, d'antagonisme et de relation dose-effet, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Pharmacodynamie — mécanismes d'action, récepteurs et relation dose-effet",
    "difficulty": "medium",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Qu'est-ce qu'un agoniste complet en pharmacologie ?",
        "options": [
          { "text": "Une molécule qui se lie à un récepteur sans provoquer d'effet biologique mesurable", "isCorrect": false },
          { "text": "Une molécule qui se lie à un récepteur et produit l'effet maximal possible sur ce récepteur", "isCorrect": true },
          { "text": "Une molécule qui bloque l'accès d'un agoniste à son récepteur sans activer ce dernier", "isCorrect": false },
          { "text": "Une molécule qui stabilise le récepteur dans sa conformation inactive de repos", "isCorrect": false }
        ],
        "explanation": "Un agoniste complet présente une efficacité intrinsèque maximale (Emax = 100 %) : il active pleinement le récepteur. Il se distingue de l'agoniste partiel (Emax < 100 %) et de l'antagoniste (Emax = 0 %, pas d'activation propre mais blocage compétitif)."
      },
      {
        "text": "Quelle est la principale cible pharmacologique des bêtabloquants (métoprolol, aténolol) ?",
        "options": [
          { "text": "Les récepteurs muscariniques M2 couplés à la protéine Gi du nœud sinusal", "isCorrect": false },
          { "text": "Les récepteurs adrénergiques bêta-1 couplés à la protéine Gs myocardique", "isCorrect": true },
          { "text": "Les canaux calciques voltage-dépendants de type L des cellules myocardiques", "isCorrect": false },
          { "text": "Les récepteurs AT1 de l'angiotensine II des cellules musculaires lisses vasculaires", "isCorrect": false }
        ],
        "explanation": "Les bêtabloquants cardiosélectifs (métoprolol, aténolol) bloquent préférentiellement les récepteurs β1 adrénergiques couplés à la protéine Gs. En réduisant l'activation de l'adénylyl cyclase et l'AMPc intracellulaire, ils diminuent la fréquence cardiaque, la contractilité et la pression artérielle."
      },
      {
        "text": "Qu'est-ce que la DE50 (dose efficace 50) dans une courbe dose-effet ?",
        "options": [
          { "text": "La dose produisant 50 % de l'effet maximal possible dans la population étudiée", "isCorrect": true },
          { "text": "La dose mortelle pour 50 % des animaux dans les études de toxicité aiguë", "isCorrect": false },
          { "text": "La dose minimale produisant un effet détectable sur 50 % des récepteurs ciblés", "isCorrect": false },
          { "text": "La dose à partir de laquelle 50 % des patients présentent un effet indésirable grave", "isCorrect": false }
        ],
        "explanation": "La DE50 (ED50 en anglais) est la dose provoquant 50 % de l'effet maximal (Emax). Elle sert à comparer la puissance relative de médicaments agissant sur la même cible : un médicament à DE50 plus faible est plus puissant. Elle ne renseigne pas sur l'efficacité intrinsèque (Emax)."
      },
      {
        "text": "Quel type de récepteur est directement couplé à un canal ionique (récepteur-canal) ?",
        "options": [
          { "text": "Le récepteur à l'insuline, récepteur tyrosine kinase membranaire dimérique", "isCorrect": false },
          { "text": "Le récepteur GABA-A, canal chlorure ligand-dépendant pentamérique", "isCorrect": true },
          { "text": "Le récepteur aux glucocorticoïdes, récepteur nucléaire intracellulaire cytosolique", "isCorrect": false },
          { "text": "Le récepteur bêta-2 adrénergique, récepteur couplé à la protéine Gs membranaire", "isCorrect": false }
        ],
        "explanation": "Le récepteur GABA-A est un canal ionique (Cl⁻) ligand-dépendant formé de 5 sous-unités. La fixation du GABA (ou des benzodiazépines, barbituriques en site allostérique) ouvre le canal, entraînant une entrée de Cl⁻ et une hyperpolarisation neuronale inhibitrice rapide."
      },
      {
        "text": "Comment se définit l'index thérapeutique (IT) d'un médicament ?",
        "options": [
          { "text": "Le rapport DE50 / DL50, reflétant la marge de sécurité entre efficacité et toxicité létale", "isCorrect": true },
          { "text": "Le rapport Cmax / Cmin calculé à l'état d'équilibre pour les traitements chroniques", "isCorrect": false },
          { "text": "La différence entre la dose thérapeutique maximale et la dose minimale efficace", "isCorrect": false },
          { "text": "Le ratio entre la biodisponibilité orale et la biodisponibilité IV d'un même médicament", "isCorrect": false }
        ],
        "explanation": "L'index thérapeutique (IT = DL50 / DE50) mesure la sécurité relative : un IT élevé indique une large marge entre la dose efficace et la dose létale (ex. : pénicilline IT > 1000). Un IT étroit (lithium, digoxine, aminosides) impose une surveillance plasmatique étroite (TDM)."
      },
      {
        "text": "Qu'est-ce que la tolérance pharmacologique (ou tachyphylaxie) ?",
        "options": [
          { "text": "L'augmentation progressive de l'effet thérapeutique lors d'un traitement prolongé continu", "isCorrect": false },
          { "text": "La réduction de l'effet thérapeutique lors d'administrations répétées nécessitant une dose accrue", "isCorrect": true },
          { "text": "L'apparition d'effets indésirables graves lors de la première administration d'un médicament", "isCorrect": false },
          { "text": "La potentialisation mutuelle des effets de deux médicaments administrés simultanément", "isCorrect": false }
        ],
        "explanation": "La tolérance (ou tachyphylaxie quand elle est rapide) est une diminution de l'effet lors d'expositions répétées, nécessitant d'augmenter la dose. Mécanismes : down-regulation des récepteurs (ex. : bêta-agonistes), désensibilisation, induction enzymatique. Ex. : tolérance aux nitrates, aux opioïdes."
      },
      {
        "text": "Quel est le mécanisme d'action des inhibiteurs de la pompe à protons (oméprazole) ?",
        "options": [
          { "text": "Blocage compétitif réversible des récepteurs H2 à l'histamine des cellules pariétales gastriques", "isCorrect": false },
          { "text": "Inhibition irréversible de la H⁺/K⁺-ATPase par liaison covalente aux résidus cystéine", "isCorrect": true },
          { "text": "Neutralisation chimique directe de l'acide chlorhydrique dans la lumière gastrique", "isCorrect": false },
          { "text": "Stimulation des récepteurs EP3 aux prostaglandines diminuant la sécrétion acide gastrique", "isCorrect": false }
        ],
        "explanation": "Les IPP (oméprazole, pantoprazole) sont des promédicaments activés en milieu acide en un sulfénamide réactif qui forme une liaison covalente irréversible avec les cystéines de la H⁺/K⁺-ATPase des cellules pariétales. Cela bloque la pompe à protons et inhibe la sécrétion acide pendant 24-48h."
      },
      {
        "text": "Qu'appelle-t-on effet placebo en pharmacologie clinique ?",
        "options": [
          { "text": "L'effet d'une substance inerte attribuable aux attentes et au contexte thérapeutique du patient", "isCorrect": true },
          { "text": "L'effet supplémentaire obtenu par une dose supra-thérapeutique dépassant l'Emax du récepteur", "isCorrect": false },
          { "text": "L'effet indésirable inattendu survenant lors d'une première administration médicamenteuse", "isCorrect": false },
          { "text": "La réponse pharmacologique individuelle liée à un polymorphisme génétique enzymatique", "isCorrect": false }
        ],
        "explanation": "L'effet placebo est une réponse thérapeutique (objective ou subjective) provoquée non par la substance pharmacologiquement active mais par des facteurs psychologiques, contextuels et relationnels. Il implique des mécanismes neurobiologiques réels (libération d'endorphines, dopamine). Tout médicament actif comporte aussi une composante placebo."
      }
    ]
  },

  // ─── 5. Interactions médicamenteuses — mécanismes PK et PD ────────────────
  {
    "title": "Interactions médicamenteuses — mécanismes pharmacocinétiques et pharmacodynamiques",
    "description": "Quiz sur les principaux mécanismes d'interactions médicamenteuses (PK et PD), leurs conséquences cliniques et leur prévention, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Interactions médicamenteuses — mécanismes pharmacocinétiques et pharmacodynamiques",
    "difficulty": "hard",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel type d'interaction médicamenteuse est la plus fréquente en pratique clinique ?",
        "options": [
          { "text": "Les interactions pharmacodynamiques par synergie ou antagonisme sur la même cible", "isCorrect": false },
          { "text": "Les interactions pharmacocinétiques portant sur le métabolisme hépatique par CYP450", "isCorrect": true },
          { "text": "Les interactions physicochimiques par précipitation lors des mélanges en perfusion IV", "isCorrect": false },
          { "text": "Les interactions d'absorption par chélation digestive entre médicaments polyanioniques", "isCorrect": false }
        ],
        "explanation": "Les interactions au niveau du métabolisme hépatique (CYP450) sont les plus fréquentes et cliniquement significatives. Elles impliquent l'inhibition ou l'induction enzymatique, modifiant les concentrations plasmatiques des médicaments substrats et pouvant entraîner toxicité ou inefficacité."
      },
      {
        "text": "La clarithromycine (macrolide) est un inhibiteur puissant du CYP3A4. Quel effet attend-on si on l'associe à la simvastatine ?",
        "options": [
          { "text": "Réduction des concentrations de simvastatine et risque de perte d'efficacité hypolipémiante", "isCorrect": false },
          { "text": "Augmentation des concentrations de simvastatine et risque de rhabdomyolyse", "isCorrect": true },
          { "text": "Aucune interaction significative car la simvastatine n'est pas un substrat du CYP3A4", "isCorrect": false },
          { "text": "Induction du CYP3A4 par la simvastatine entraînant une réduction de clarithromycine", "isCorrect": false }
        ],
        "explanation": "La simvastatine est un substrat majeur du CYP3A4. Son association avec des inhibiteurs comme la clarithromycine, l'érythromycine ou les antifongiques azolés augmente fortement ses concentrations plasmatiques, risquant une rhabdomyolyse (lyse musculaire grave). Cette association est contre-indiquée."
      },
      {
        "text": "Quel est le mécanisme de l'interaction entre les antiacides (aluminium) et les fluoroquinolones (ciprofloxacine) ?",
        "options": [
          { "text": "Inhibition des transporteurs intestinaux OCT1 par les ions aluminium trivalents", "isCorrect": false },
          { "text": "Chélation digestive formant un complexe insoluble réduisant l'absorption intestinale", "isCorrect": true },
          { "text": "Induction du CYP1A2 hépatique par les ions aluminium accélérant le métabolisme", "isCorrect": false },
          { "text": "Augmentation du pH gastrique dissolvent l'enrobage entérique de la ciprofloxacine", "isCorrect": false }
        ],
        "explanation": "Les ions métalliques polyvalents (Al³⁺, Mg²⁺, Ca²⁺, Fe²⁺) forment des chélates insolubles avec les fluoroquinolones et les tétracyclines dans le tube digestif, réduisant fortement leur absorption (biodisponibilité divisée par 2 à 5). Il faut espacer les prises d'au moins 2 heures."
      },
      {
        "text": "Quelle interaction pharmacodynamique synergique est intentionnellement exploitée en antibiothérapie ?",
        "options": [
          { "text": "L'association amoxicilline + acide clavulanique inhibant les bêta-lactamases bactériennes", "isCorrect": true },
          { "text": "L'association fluoroquinolone + aminoside pour doublement de l'inhibition du CYP450", "isCorrect": false },
          { "text": "L'association métronidazole + clarithromycine réduisant le volume de distribution", "isCorrect": false },
          { "text": "L'association vancomycine + rifampicine augmentant la liaison protéique plasmatique", "isCorrect": false }
        ],
        "explanation": "L'acide clavulanique n'a pas d'activité antibactérienne propre mais inhibe irréversiblement les bêta-lactamases bactériennes qui dégradent l'amoxicilline. Cette synergie pharmacodynamique restaure l'efficacité de l'amoxicilline contre les germes résistants producteurs de bêta-lactamases (ex. : E. coli, Haemophilus)."
      },
      {
        "text": "Quelle interaction dangereuse peut survenir entre un IMAO (phénelzine) et un opioïde (tramadol) ?",
        "options": [
          { "text": "Une potentialisation anticoagulante conduisant à un risque hémorragique intracérébral", "isCorrect": false },
          { "text": "Un syndrome sérotoninergique grave par accumulation excessive de sérotonine synaptique", "isCorrect": true },
          { "text": "Une hypertension artérielle maligne par inhibition du baroréflexe carotidien", "isCorrect": false },
          { "text": "Une dépression respiratoire par inhibition compétitive des récepteurs mu opioïdes", "isCorrect": false }
        ],
        "explanation": "Le tramadol inhibe la recapture de la sérotonine et de la noradrénaline. Associé à un IMAO (qui bloque la dégradation de la sérotonine), il peut provoquer un syndrome sérotoninergique : hyperthermie, agitation, myoclonies, tachycardie, pouvant être fatal. Cette association est contre-indiquée."
      },
      {
        "text": "Comment les inhibiteurs de la glycoprotéine P (P-gp) influencent-ils la digoxine ?",
        "options": [
          { "text": "Ils réduisent l'absorption intestinale de digoxine en bloquant les transporteurs OATP", "isCorrect": false },
          { "text": "Ils augmentent les concentrations de digoxine en diminuant son efflux intestinal et rénal", "isCorrect": true },
          { "text": "Ils accélèrent le métabolisme hépatique de la digoxine par induction du CYP3A4", "isCorrect": false },
          { "text": "Ils diminuent la liaison de la digoxine à la Na⁺/K⁺-ATPase myocardique cible", "isCorrect": false }
        ],
        "explanation": "La P-glycoprotéine (P-gp, MDR1) est un transporteur d'efflux intestinal et rénal qui limite l'absorption et favorise l'élimination de la digoxine. Les inhibiteurs de P-gp (vérapamil, amiodarone, quinidine) réduisent cet efflux, augmentant la biodisponibilité et les concentrations de digoxine, avec risque de toxicité digitalique."
      },
      {
        "text": "Qu'est-ce qu'une interaction médicamenteuse de type antagonisme pharmacodynamique ?",
        "options": [
          { "text": "Un médicament inhibe le métabolisme d'un autre, augmentant ses concentrations plasmatiques", "isCorrect": false },
          { "text": "Deux médicaments produisent des effets opposés sur la même fonction physiologique", "isCorrect": true },
          { "text": "Un médicament précipite un autre dans la seringue, formant un complexe inactif insoluble", "isCorrect": false },
          { "text": "Un médicament déplace un autre de ses sites de liaison protéique augmentant sa fraction libre", "isCorrect": false }
        ],
        "explanation": "L'antagonisme pharmacodynamique survient quand deux médicaments exercent des effets opposés sur la même cible ou la même voie physiologique. Exemple : les anticoagulants (warfarine) vs la vitamine K — antagonisme direct. Ou bêtabloquants (bradycardie) + atropine (tachycardie) — antagonisme fonctionnel sur la fréquence cardiaque."
      },
      {
        "text": "Quel médicament couramment utilisé en cardiologie est un inhibiteur puissant du CYP2C9 pouvant interagir avec la warfarine ?",
        "options": [
          { "text": "L'amiodarone (Cordarone®), antiarythmique de classe III de Vaughan-Williams", "isCorrect": true },
          { "text": "L'aténolol (Ténormine®), bêtabloquant cardiosélectif hydrophile non métabolisé", "isCorrect": false },
          { "text": "La digoxine (Digoxine Nativelle®), hétéroside cardiotonique substrat de la P-gp", "isCorrect": false },
          { "text": "Le vérapamil (Isoptine®), inhibiteur calcique non dihydropyridinique de type IV", "isCorrect": false }
        ],
        "explanation": "L'amiodarone est un inhibiteur puissant des CYP2C9, CYP3A4 et de la P-gp. Son association avec la warfarine (substrat CYP2C9) augmente fortement les concentrations de warfarine et le risque hémorragique. L'interaction est d'autant plus insidieuse que l'amiodarone a une longue demi-vie (40-55 jours)."
      }
    ]
  }
];
