// UE 2.7 - Défaillances organiques et processus dégénératifs (Semestre 3)
module.exports = [
  {
    title: "Insuffisances organiques — cardiaque, rénale, respiratoire et hépatique",
    description: "Évaluation des connaissances sur les grandes insuffisances d'organe : physiopathologie, signes cliniques, surveillance infirmière et prise en charge.",
    semester: "Semestre 3",
    category: "UE 2.7 - Défaillances organiques et processus dégénératifs",
    chapter: "Insuffisances organiques — cardiaque, rénale, respiratoire et hépatique",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Dans l'insuffisance cardiaque gauche décompensée, quel signe clinique est le plus directement lié à l'élévation de la pression capillaire pulmonaire ?",
        options: [
          { text: "L'œdème des membres inférieurs prenant le godet, bilatéral et symétrique, survenant en fin de journée", isCorrect: false },
          { text: "L'orthopnée obligeant le patient à dormir en position assise ou avec plusieurs oreillers pour respirer", isCorrect: false },
          { text: "L'œdème pulmonaire aigu avec crépitants bilatéraux, dyspnée intense et expectoration mousseuse rosée", isCorrect: true },
          { text: "L'hépatomégalie douloureuse avec reflux hépato-jugulaire positif et turgescence des veines jugulaires", isCorrect: false }
        ],
        explanation: "L'OAP est la conséquence directe de l'hypertension capillaire pulmonaire : le liquide transsude dans les alvéoles, provoquant une dyspnée sévère, des râles crépitants et une expectoration mousseuse rosée. Les autres signes appartiennent plutôt à l'insuffisance droite ou à une forme moins aiguë."
      },
      {
        text: "Quel paramètre biologique est le marqueur de référence pour évaluer la sévérité d'une insuffisance cardiaque chronique et guider le traitement ?",
        options: [
          { text: "La troponine T ultrasensible, qui reflète la nécrose myocardique active et oriente vers un syndrome coronarien aigu associé", isCorrect: false },
          { text: "Le BNP ou NT-proBNP, peptide natriurétique sécrété par les ventricules sous l'effet de la surcharge en pression ou en volume", isCorrect: true },
          { text: "La CRP ultrasensible, marqueur inflammatoire élevé en cas de cardiomyopathie inflammatoire ou d'endocardite sous-jacente", isCorrect: false },
          { text: "La créatinine sérique, qui renseigne sur le retentissement rénal du bas débit cardiaque chronique en aval du cœur", isCorrect: false }
        ],
        explanation: "Le BNP (ou NT-proBNP) est le biomarqueur spécifique de l'insuffisance cardiaque. Il est sécrété par les cardiomyocytes en réponse à la distension pariétale et son taux est corrélé à la sévérité et au pronostic. Les autres marqueurs ont leur utilité mais ne sont pas spécifiques de l'IC."
      },
      {
        text: "Lors de la surveillance infirmière d'un patient sous diurétiques de l'anse pour insuffisance cardiaque, quel déséquilibre électrolytique doit être surveillé en priorité ?",
        options: [
          { text: "L'hypernatrémie secondaire à la rétention hydrique compensatrice déclenchée par la perte sodée urinaire induite", isCorrect: false },
          { text: "L'hyperkaliémie par redistribution cellulaire favorisée par l'alcalose métabolique induite par les diurétiques thiazidiques", isCorrect: false },
          { text: "L'hypokaliémie par fuite urinaire potassique, pouvant induire des troubles du rythme graves et potentialiser la digitale", isCorrect: true },
          { text: "L'hypercalcémie par mobilisation osseuse compensatrice activée lors des variations brutales de la volémie sous traitement", isCorrect: false }
        ],
        explanation: "Les diurétiques de l'anse (furosémide) provoquent une fuite urinaire de potassium, entraînant une hypokaliémie. Celle-ci est dangereuse car elle favorise les arythmies cardiaques et potentialise la toxicité des digitaliques. La surveillance régulière de la kaliémie est donc primordiale."
      },
      {
        text: "Dans l'insuffisance rénale chronique terminale, quelle complication métabolique nécessite une correction en urgence car elle peut provoquer des troubles cardiaques létaux ?",
        options: [
          { text: "L'acidose métabolique chronique par défaut d'élimination des ions H+ et de réabsorption des bicarbonates filtrés", isCorrect: false },
          { text: "L'hyperkaliémie par défaut d'élimination rénale du potassium, pouvant provoquer des arythmies ventriculaires mortelles", isCorrect: true },
          { text: "L'hyperphosphorémie par défaut d'élimination du phosphore, favorisant les calcifications vasculaires et l'ostéodystrophie rénale", isCorrect: false },
          { text: "L'anémie normochrome normocytaire par défaut de synthèse de l'érythropoïétine par le parenchyme rénal défaillant", isCorrect: false }
        ],
        explanation: "L'hyperkaliémie est la complication la plus urgente de l'IRC terminale. L'excès de potassium modifie la repolarisation cellulaire cardiaque et peut provoquer des arythmies ventriculaires graves (fibrillation ventriculaire, arrêt cardiaque). Elle nécessite une prise en charge immédiate (gluconate de calcium, résines, dialyse)."
      },
      {
        text: "Quel critère biologique définit le stade G5 de l'insuffisance rénale chronique selon la classification KDIGO ?",
        options: [
          { text: "Un débit de filtration glomérulaire estimé compris entre 15 et 29 mL/min/1,73 m², correspondant à une IRC sévère", isCorrect: false },
          { text: "Une protéinurie supérieure à 3 g/24h associée à un syndrome néphrotique avec hypoalbuminémie et œdèmes diffus", isCorrect: false },
          { text: "Un débit de filtration glomérulaire estimé inférieur à 15 mL/min/1,73 m², correspondant à l'insuffisance rénale terminale", isCorrect: true },
          { text: "Une créatinine sérique supérieure à 500 µmol/L associée à une anurie et une urée sanguine dépassant 30 mmol/L", isCorrect: false }
        ],
        explanation: "Selon la classification KDIGO, le stade G5 (terminal) est défini par un DFG estimé < 15 mL/min/1,73 m². C'est à ce stade qu'un traitement de suppléance (dialyse ou transplantation) devient nécessaire. Le stade G4 correspond à un DFG entre 15 et 29."
      },
      {
        text: "Dans l'insuffisance respiratoire chronique par BPCO, quelle adaptation physiologique à long terme peut paradoxalement être aggravée par une oxygénothérapie à fort débit ?",
        options: [
          { text: "La polyglobulie compensatrice, qui serait inhibée par une PaO2 normalisée, entraînant une anémie relative démasquée", isCorrect: false },
          { text: "La vasoconstriction pulmonaire hypoxique, qui disparaîtrait sous O2 et aggraverait le shunt intrapulmonaire existant", isCorrect: false },
          { text: "La commande ventilatoire hypoxique, qui disparaîtrait sous O2 à fort débit, entraînant une hypoventilation et une hypercapnie", isCorrect: true },
          { text: "La rétention hydrosodée compensatrice, qui serait aggravée par la vasodilatation rénale induite par l'oxygénothérapie prolongée", isCorrect: false }
        ],
        explanation: "Chez les patients BPCO hypercapniques chroniques, la commande ventilatoire dépend de l'hypoxie (le stimulus CO2 étant émoussé). Une oxygénothérapie à débit élevé supprime ce drive hypoxique, provoquant une hypoventilation alvéolaire et une aggravation de l'hypercapnie. L'O2 doit être titré à 1-2 L/min visant une SpO2 entre 88 et 92%."
      },
      {
        text: "Quel signe clinique est caractéristique de l'insuffisance hépatocellulaire sévère et traduit un défaut de synthèse hépatique des facteurs de coagulation ?",
        options: [
          { text: "L'astérixis (flapping tremor), signe neurologique de l'encéphalopathie hépatique lié à l'accumulation d'ammoniac circulant", isCorrect: false },
          { text: "L'hypoprothrombinémie avec allongement du TP, favorisant les saignements muqueux, ecchymoses et hémorragies digestives", isCorrect: true },
          { text: "L'ictère cholestatique avec prurit, selles décolorées et urines foncées par défaut d'élimination biliaire du métabolisme hépatique", isCorrect: false },
          { text: "L'ascite par hypoalbuminémie et hypertension portale, avec matité déclive et signe du flot à la percussion abdominale", isCorrect: false }
        ],
        explanation: "Le foie synthétise les facteurs de coagulation (II, V, VII, X, protéine C et S). En cas d'insuffisance hépatocellulaire, le taux de prothrombine (TP) chute, entraînant un risque hémorragique majeur. Le TP est d'ailleurs un marqueur pronostique de l'IHC. Les autres signes sont réels mais reflètent d'autres mécanismes."
      },
      {
        text: "Dans la prise en charge infirmière d'un patient en hémodialyse chronique, quelle consigne diététique est prioritaire entre deux séances ?",
        options: [
          { text: "Augmenter les apports protidiques à 1,5 g/kg/j pour compenser les pertes protéiques lors des séances d'hémodialyse", isCorrect: false },
          { text: "Limiter les apports hydriques à 500-700 mL/j entre les séances pour éviter une surcharge hydrosodée interdialytique", isCorrect: true },
          { text: "Enrichir l'alimentation en potassium pour compenser les pertes électrolytiques induites par chaque séance de dialyse", isCorrect: false },
          { text: "Augmenter les apports en vitamine D active pour compenser le défaut de transformation rénale du cholécalciférol inactif", isCorrect: false }
        ],
        explanation: "Entre deux séances de dialyse, les reins ne peuvent plus éliminer l'eau ni le sodium. Une prise de poids interdialytique excessive (> 2-3 kg) expose au risque d'œdème pulmonaire. La restriction hydrique (< 500-700 mL/j en plus des urines résiduelles) est donc la consigne diététique la plus urgente à respecter."
      }
    ]
  },
  {
    title: "Maladies dégénératives — Alzheimer, Parkinson et sclérose en plaques",
    description: "Connaissances sur les pathologies neurodégénératives : mécanismes, signes cliniques, évolution et rôle infirmier dans l'accompagnement des patients et des aidants.",
    semester: "Semestre 3",
    category: "UE 2.7 - Défaillances organiques et processus dégénératifs",
    chapter: "Maladies dégénératives — Alzheimer, Parkinson et sclérose en plaques",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel mécanisme physiopathologique est à l'origine de la maladie d'Alzheimer et constitue la cible principale des recherches thérapeutiques actuelles ?",
        options: [
          { text: "La dégénérescence des neurones dopaminergiques de la substance noire et l'accumulation de corps de Lewy intraneuronaux", isCorrect: false },
          { text: "L'accumulation de plaques amyloïdes extracellulaires et de dégénérescences neurofibrillaires intraneuronales de protéine Tau", isCorrect: true },
          { text: "La démyélinisation des axones des neurones centraux avec formation de plaques sclérotiques disseminées dans le SNC", isCorrect: false },
          { text: "La perte progressive des motoneurones de la corne antérieure et des voies corticospinales par mécanisme excitotoxique", isCorrect: false }
        ],
        explanation: "La maladie d'Alzheimer est caractérisée par deux lésions anatomopathologiques : les plaques séniles (dépôts extracellulaires de peptide bêta-amyloïde) et les dégénérescences neurofibrillaires (accumulation intraneuronale de protéine Tau hyperphosphorylée). Ces lésions entraînent la mort neuronale et l'atrophie cérébrale progressive."
      },
      {
        text: "Dans la maladie d'Alzheimer, quel type de mémoire est atteint en premier et de façon prédominante aux stades initiaux ?",
        options: [
          { text: "La mémoire procédurale, qui régit l'apprentissage des gestes et des automatismes comme conduire ou jouer d'un instrument", isCorrect: false },
          { text: "La mémoire sémantique, qui stocke les connaissances générales sur le monde et les concepts abstraits du langage", isCorrect: false },
          { text: "La mémoire épisodique antérograde, qui enregistre les événements récents et nouveaux vécus par la personne", isCorrect: true },
          { text: "La mémoire implicite de conditionnement, qui associe des stimuli environnementaux à des réponses émotionnelles automatisées", isCorrect: false }
        ],
        explanation: "La maladie d'Alzheimer débute classiquement par une atteinte de la mémoire épisodique antérograde : le patient ne se souvient plus des événements récents (ce qu'il a mangé, une conversation de la veille) alors qu'il conserve longtemps les souvenirs anciens. La mémoire procédurale est la plus longtemps préservée."
      },
      {
        text: "Dans la maladie de Parkinson, quelle triade clinique est caractéristique et permet le diagnostic clinique selon les critères de la UK Brain Bank ?",
        options: [
          { text: "Aphasie, apraxie et agnosie, formant le syndrome aphaso-apraxo-agnosique des démences corticales dégénératives", isCorrect: false },
          { text: "Tremblement de repos, rigidité plastique en roue dentée et akinésie ou bradykinésie, constituant le syndrome parkinsonien", isCorrect: true },
          { text: "Syndrome cérébelleux, nystagmus et dysarthrie scandée, formant la triade de la sclérose en plaques cérébelleuse", isCorrect: false },
          { text: "Syndrome pyramidal, spasticité et signe de Babinski bilatéral, évoquant une atteinte des voies corticospinales bilatérales", isCorrect: false }
        ],
        explanation: "La triade parkinsonienne (tremblement de repos, rigidité, akinésie/bradykinésie) est pathognomonique. Le tremblement est lent (4-6 Hz), au repos, de type émiettement de pain. La rigidité est plastique en tuyau de plomb avec signe de la roue dentée. L'akinésie se manifeste par une lenteur d'initiation et d'exécution des mouvements."
      },
      {
        text: "Quel risque majeur de complication est lié à la dysphagie dans la maladie de Parkinson évoluée et nécessite une surveillance infirmière rigoureuse ?",
        options: [
          { text: "Le risque de déshydratation sévère par refus alimentaire lié à l'aphagie totale survenant aux stades terminaux tardifs", isCorrect: false },
          { text: "Le risque de pneumonie d'inhalation par fausses routes alimentaires répétées liées à la dysfonction oro-pharyngée", isCorrect: true },
          { text: "Le risque de perforation œsophagienne liée aux spasmes musculaires de la paroi œsophagienne dans les stades avancés", isCorrect: false },
          { text: "Le risque d'hémorragie digestive haute par ulcération gastrique secondaire à la prise prolongée de lévodopa au long cours", isCorrect: false }
        ],
        explanation: "La dysphagie parkinsonienne expose aux fausses routes alimentaires et liquidiennes, pouvant provoquer une pneumonie d'inhalation (aspiration), complication grave et fréquente cause de décès. L'infirmière doit surveiller la déglutition, adapter la texture des aliments, positionner le patient, et alerter en cas de toux, voix mouillée ou infection respiratoire."
      },
      {
        text: "Dans la sclérose en plaques (SEP), quel mécanisme physiopathologique est responsable des poussées et des déficits neurologiques ?",
        options: [
          { text: "La dégénérescence progressive des cellules de Schwann dans les nerfs périphériques avec dépôts d'immunoglobulines autour des axones", isCorrect: false },
          { text: "La démyélinisation focale auto-immune dans la substance blanche du SNC ralentissant ou bloquant la conduction nerveuse", isCorrect: true },
          { text: "L'ischémie focale des territoires médullaires par microangiopathie thrombotique liée à une vascularite auto-immune du SNC", isCorrect: false },
          { text: "L'accumulation de protéines anormales dans les oligodendrocytes perturbant leur métabolisme et entraînant leur apoptose", isCorrect: false }
        ],
        explanation: "La SEP est une maladie auto-immune dans laquelle les lymphocytes T attaquent la myéline du SNC. Cette démyélinisation focale (plaques) ralentit ou bloque la conduction nerveuse, provoquant les déficits neurologiques. La remyélinisation partielle peut expliquer la récupération après une poussée. La dégénérescence axonale progressive est responsable du handicap cumulatif."
      },
      {
        text: "Quel signe clinique évocateur de SEP, lié à la sensibilité à la chaleur, est appelé signe de l'heure du bain ou phénomène d'Uhthoff ?",
        options: [
          { text: "L'apparition d'une diplopie binoculaire lors de l'exposition à la chaleur, liée à une atteinte du nerf moteur oculaire commun", isCorrect: false },
          { text: "L'aggravation temporaire des déficits neurologiques existants lors d'une élévation de la température corporelle ou ambiante", isCorrect: true },
          { text: "La survenue de spasmes musculaires douloureux dans les membres inférieurs lors de l'immersion dans un bain chaud prolongé", isCorrect: false },
          { text: "L'apparition de paresthésies en ceinture thoracique lors de la prise de bain, liées à une irritation des racines postérieures", isCorrect: false }
        ],
        explanation: "Le phénomène d'Uhthoff est caractéristique de la SEP : toute élévation de température (bain chaud, fièvre, effort) aggrave temporairement les symptômes existants. Ceci s'explique par la sensibilité accrue des fibres démyélinisées à la chaleur, qui bloque davantage la conduction nerveuse. C'est un argument diagnostique important."
      },
      {
        text: "Dans la prise en charge infirmière d'un patient atteint de maladie d'Alzheimer à un stade modéré, quelle approche est recommandée pour gérer les troubles du comportement ?",
        options: [
          { text: "Administrer systématiquement une benzodiazépine lors de chaque épisode d'agitation pour calmer le patient rapidement", isCorrect: false },
          { text: "Recourir prioritairement aux approches non médicamenteuses : validation, diversion, environnement sécurisé et routines stables", isCorrect: true },
          { text: "Raisonner et argumenter avec le patient pour lui démontrer l'irrationalité de ses craintes et corriger ses fausses croyances", isCorrect: false },
          { text: "Isoler le patient dans sa chambre lors des épisodes d'agitation pour éviter la contamination émotionnelle des autres résidents", isCorrect: false }
        ],
        explanation: "Les recommandations HAS préconisent les approches non médicamenteuses en première intention pour les troubles du comportement dans la maladie d'Alzheimer. La technique de validation (accepter la réalité émotionnelle du patient), la diversion, les activités adaptées et la stabilité de l'environnement sont plus efficaces et moins risquées que la sédation médicamenteuse."
      },
      {
        text: "Quel traitement médicamenteux constitue la base du traitement symptomatique de la maladie de Parkinson et agit en compensant le déficit dopaminergique ?",
        options: [
          { text: "Les anticholinestérasiques de type donépézil, qui augmentent la disponibilité de l'acétylcholine dans les synapses nigro-striées", isCorrect: false },
          { text: "La lévodopa associée à un inhibiteur de la décarboxylase périphérique, précurseur de la dopamine traversant la barrière hémato-encéphalique", isCorrect: true },
          { text: "Les inhibiteurs sélectifs de la recapture de la sérotonine (ISRS), qui potentialisent la transmission sérotoninergique des ganglions de la base", isCorrect: false },
          { text: "Les agonistes des récepteurs NMDA de type amantadine, qui bloquent la transmission glutamatergique excitatrice des voies striato-thalamiques", isCorrect: false }
        ],
        explanation: "La lévodopa (L-DOPA), associée à un inhibiteur de la décarboxylase périphérique (carbidopa ou bensérazide), est le traitement de référence de la maladie de Parkinson. Elle traverse la barrière hémato-encéphalique et est convertie en dopamine dans le cerveau, compensant le déficit en dopamine des neurones nigro-striés détruits."
      }
    ]
  },
  {
    title: "Diabète et complications — surveillance infirmière et éducation thérapeutique",
    description: "Évaluation des connaissances sur le diabète de type 1 et 2, leurs complications aiguës et chroniques, ainsi que le rôle infirmier dans la surveillance glycémique et l'éducation thérapeutique.",
    semester: "Semestre 3",
    category: "UE 2.7 - Défaillances organiques et processus dégénératifs",
    chapter: "Diabète et complications — surveillance infirmière et éducation thérapeutique",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Quel mécanisme physiopathologique distingue fondamentalement le diabète de type 1 du diabète de type 2 ?",
        options: [
          { text: "Dans le DT1 il y a une insulinorésistance hépatique majeure, alors que dans le DT2 il y a une destruction auto-immune des cellules bêta", isCorrect: false },
          { text: "Dans le DT1 la destruction auto-immune des cellules bêta pancréatiques provoque un déficit absolu en insuline dès le début", isCorrect: true },
          { text: "Dans le DT1 l'hyperglycémie est liée à un excès de glucagon pancréatique, alors que dans le DT2 elle est liée à un déficit insulinique", isCorrect: false },
          { text: "Dans le DT1 l'insulinorésistance périphérique est totale et irréversible, alors que dans le DT2 elle est partielle et corrigeable", isCorrect: false }
        ],
        explanation: "Le DT1 est une maladie auto-immune : les lymphocytes T détruisent les cellules bêta des îlots de Langerhans, entraînant un déficit absolu et définitif en insuline. L'insulinothérapie est donc vitale. Le DT2 associe une insulinorésistance périphérique et un déficit insulinosécrétoire progressif, sans destruction auto-immune initiale."
      },
      {
        text: "Quels sont les critères biologiques de diagnostic du diabète selon les recommandations de la Haute Autorité de Santé (HAS) ?",
        options: [
          { text: "Une glycémie à jeun ≥ 1,10 g/L ou une HbA1c ≥ 6 % confirmées sur deux dosages successifs réalisés à distance", isCorrect: false },
          { text: "Une glycémie à jeun ≥ 1,26 g/L (7 mmol/L) ou une glycémie ≥ 2 g/L à n'importe quel moment, confirmées sur deux dosages", isCorrect: true },
          { text: "Une glycémie post-prandiale à 2h ≥ 1,80 g/L lors d'une hyperglycémie provoquée orale avec 100 g de glucose ingéré", isCorrect: false },
          { text: "Une HbA1c ≥ 7,5 % associée à une glycémie à jeun ≥ 1 g/L lors de deux dosages réalisés à au moins 3 mois d'intervalle", isCorrect: false }
        ],
        explanation: "Selon les critères diagnostiques OMS/HAS, le diabète est défini par : une glycémie à jeun ≥ 1,26 g/L (7 mmol/L) ou une glycémie aléatoire ≥ 2 g/L (11,1 mmol/L) avec symptômes, ou une HGPO avec glycémie ≥ 2 g/L à 2h, ou une HbA1c ≥ 6,5 %. Tout résultat doit être confirmé sur un deuxième prélèvement sauf si symptômes évidents."
      },
      {
        text: "Un patient diabétique de type 1 présente des nausées, vomissements, douleurs abdominales, haleine fruitée et troubles de la conscience. Quelle complication aiguë faut-il évoquer en priorité ?",
        options: [
          { text: "Un coma hyperosmolaire hyperglycémique, survenant surtout chez le diabétique de type 2 âgé, avec hyperglycémie majeure sans cétose", isCorrect: false },
          { text: "Une acidocétose diabétique liée au déficit insulinique absolu provoquant une lipolyse massive avec cétogenèse et acidose métabolique", isCorrect: true },
          { text: "Une hypoglycémie sévère avec neuroglycopénie et signes adrénergiques, nécessitant une injection de glucagon en urgence", isCorrect: false },
          { text: "Un coma lactatémique par accumulation d'acide lactique secondaire à une perfusion prolongée de soluté glucosé hypertonique", isCorrect: false }
        ],
        explanation: "L'acidocétose diabétique (ACD) survient quasi exclusivement dans le DT1 par déficit absolu en insuline. L'absence d'insuline entraîne une lipolyse massive, une cétogenèse hépatique et une acidose métabolique. Les signes évocateurs sont : haleine cétonique (acétonémie), vomissements, douleurs abdominales, dyspnée de Kussmaul, troubles de conscience et pH < 7,30."
      },
      {
        text: "Lors de la surveillance d'un patient en acidocétose diabétique traité par insuline IV, quel risque électrolytique doit être anticipé et surveillé en continu ?",
        options: [
          { text: "L'hypernatrémie secondaire à la correction de l'hyperglycémie entraînant un transfert d'eau intracellulaire vers l'espace extracellulaire", isCorrect: false },
          { text: "L'hypokaliémie induite par l'insulinothérapie et la correction de l'acidose, qui font entrer le potassium dans les cellules", isCorrect: true },
          { text: "L'hypercalcémie par mobilisation des réserves osseuses secondaire à l'acidose métabolique sévère et à la carence insulinique", isCorrect: false },
          { text: "L'hypermagnésémie par réabsorption tubulaire rénale accrue lors de la réhydratation par soluté salé isotonique abondant", isCorrect: false }
        ],
        explanation: "L'insuline favorise l'entrée du potassium dans les cellules. En ACD, la kaliémie peut sembler normale ou élevée initialement (acidose), mais s'effondre rapidement avec l'insulinothérapie et la correction de l'acidose. La surveillance horaire de la kaliémie et la supplémentation potassique dès que la kaliémie < 5 mmol/L sont indispensables pour éviter les arythmies cardiaques."
      },
      {
        text: "Quelle complication microvasculaire chronique du diabète est la première cause de cécité acquise de l'adulte en âge de travailler dans les pays développés ?",
        options: [
          { text: "La cataracte diabétique, opacification du cristallin accélérée par le dépôt de sorbitol secondaire à l'hyperglycémie chronique", isCorrect: false },
          { text: "La rétinopathie diabétique, par microangiopathie rétinienne avec néovascularisation et risque de décollement de rétine hémorragique", isCorrect: true },
          { text: "La neuropathie optique ischémique antérieure, par occlusion des artérioles ciliaires postérieures alimentant la tête du nerf optique", isCorrect: false },
          { text: "Le glaucome à angle ouvert, favorisé par l'augmentation de la pression intra-oculaire liée à la néovascularisation de l'angle irien", isCorrect: false }
        ],
        explanation: "La rétinopathie diabétique est la première cause de cécité chez l'adulte en âge de travailler dans les pays industrialisés. Elle résulte de la microangiopathie rétinienne (épaississement de la membrane basale, occlusions capillaires, néovascularisation). Le dépistage par fond d'œil annuel est obligatoire pour les diabétiques."
      },
      {
        text: "Dans le cadre de l'éducation thérapeutique du patient (ETP) diabétique, quel élément de surveillance quotidienne est prioritaire pour prévenir le pied diabétique ?",
        options: [
          { text: "La mesure de la pression artérielle aux deux bras chaque matin pour dépister précocement une artériopathie des membres inférieurs", isCorrect: false },
          { text: "L'inspection quotidienne des pieds à la recherche de plaies, rougeurs, fissures ou mycoses, avec utilisation d'un miroir si nécessaire", isCorrect: true },
          { text: "Le contrôle du poids corporel chaque semaine pour ajuster la ration calorique et maintenir un indice de masse corporelle optimal", isCorrect: false },
          { text: "Le dosage de la microalbuminurie mensuel pour dépister précocement la néphropathie diabétique débutante avant l'apparition de plaies", isCorrect: false }
        ],
        explanation: "La neuropathie périphérique diabétique entraîne une perte de sensibilité des pieds. Le patient ne ressent plus les blessures ou points de pression. L'inspection quotidienne des pieds (espace inter-orteils, plante, talon) permet de dépister précocement toute lésion avant qu'elle évolue vers une plaie chronique ou une gangrène, première cause d'amputation non traumatique."
      },
      {
        text: "Quel objectif glycémique d'HbA1c est recommandé par la HAS pour un diabétique de type 2 adulte sans complication majeure ni fragilité ?",
        options: [
          { text: "Une HbA1c inférieure à 6,5 %, objectif strict applicable à tout patient diabétique de type 2 dès le diagnostic pour prévenir les complications", isCorrect: false },
          { text: "Une HbA1c inférieure à 7 %, représentant le compromis entre le bénéfice sur les complications et le risque hypoglycémique", isCorrect: true },
          { text: "Une HbA1c inférieure à 8 %, objectif adapté aux patients âgés fragiles ou ayant des antécédents cardiovasculaires graves récents", isCorrect: false },
          { text: "Une HbA1c inférieure à 9 %, objectif de sécurité applicable à tous les diabétiques de type 2 sous bithérapie orale maximale", isCorrect: false }
        ],
        explanation: "La HAS recommande pour la majorité des patients DT2 sans complication et sans fragilité particulière un objectif d'HbA1c < 7 %. L'objectif est individualisé : < 6,5 % si DT2 récent sous métformine seule sans risque hypoglycémique, et relevé à < 8 % ou < 9 % pour les personnes âgées fragiles ou avec espérance de vie limitée."
      },
      {
        text: "Dans la prise en charge d'une hypoglycémie légère à modérée (glycémie < 0,70 g/L) chez un patient diabétique conscient et capable d'avaler, quelle est la règle des 15 recommandée ?",
        options: [
          { text: "Administrer 15 unités d'insuline rapide pour stabiliser la glycémie, puis contrôler la glycémie à 15 minutes et donner 15 g de glucides lents", isCorrect: false },
          { text: "Ingérer 15 g de glucides rapides, contrôler la glycémie après 15 minutes et répéter si nécessaire jusqu'à normalisation de la glycémie", isCorrect: true },
          { text: "Perfuser 150 mL de sérum glucosé à 30 % en IV sur 15 minutes, puis contrôler la glycémie capillaire toutes les 15 minutes", isCorrect: false },
          { text: "Injecter 1 mg de glucagon en sous-cutané, attendre 15 minutes pour contrôler la glycémie, puis donner 15 g de glucides mixtes", isCorrect: false }
        ],
        explanation: "La règle des 15 est la conduite à tenir standard pour l'hypoglycémie légère à modérée chez un patient conscient : ingérer 15 g de glucides rapides (3 morceaux de sucre, 150 mL de jus de fruit ou de soda sucré), contrôler la glycémie après 15 minutes et recommencer si glycémie encore < 0,70 g/L. Une collation de glucides lents est ensuite recommandée."
      }
    ]
  }
];
