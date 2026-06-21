module.exports = [
  {
    title: "Physiologie rénale — filtration, réabsorption et sécrétion",
    description: "Quiz sur la filtration glomérulaire, la réabsorption tubulaire et la sécrétion rénale.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Chapitre 6 - Physiologie rénale",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la valeur normale du débit de filtration glomérulaire (DFG) chez l'adulte sain ?",
        options: [
          { text: "Environ 50 mL/min pour les deux reins", isCorrect: false },
          { text: "Environ 125 mL/min pour les deux reins", isCorrect: true },
          { text: "Environ 200 mL/min pour les deux reins", isCorrect: false },
          { text: "Environ 300 mL/min pour les deux reins", isCorrect: false }
        ],
        explanation: "Le DFG normal est d'environ 125 mL/min (soit ~180 L/jour) pour les deux reins. C'est la quantité de plasma filtrée par les glomérules par unité de temps."
      },
      {
        text: "Quelle structure forme la barrière de filtration glomérulaire ?",
        options: [
          { text: "Endothélium capillaire, membrane basale et podocytes", isCorrect: true },
          { text: "Endothélium capillaire, cellules mésangiales et urothélium", isCorrect: false },
          { text: "Épithélium tubulaire, membrane basale et cellules de Kupffer", isCorrect: false },
          { text: "Endothélium capillaire, cellules de Sertoli et péricytes", isCorrect: false }
        ],
        explanation: "La barrière de filtration glomérulaire est composée de l'endothélium fenestré des capillaires, de la membrane basale glomérulaire et des podocytes avec leurs pédicelles formant les fentes de filtration."
      },
      {
        text: "Dans quelle partie du néphron réabsorbe-t-on environ 65 % du sodium filtré ?",
        options: [
          { text: "Dans l'anse de Henlé ascendante épaisse", isCorrect: false },
          { text: "Dans le tube contourné proximal (TCP)", isCorrect: true },
          { text: "Dans le tube contourné distal (TCD)", isCorrect: false },
          { text: "Dans le tube collecteur cortical", isCorrect: false }
        ],
        explanation: "Le tube contourné proximal réabsorbe environ 65 % du sodium filtré (ainsi que l'eau, le glucose, les acides aminés). C'est la principale zone de réabsorption du filtrat glomérulaire."
      },
      {
        text: "Quel mécanisme permet la concentration maximale des urines dans l'anse de Henlé ?",
        options: [
          { text: "La diffusion facilitée du glucose via les SGLT2", isCorrect: false },
          { text: "Le multiplicateur à contre-courant par gradient osmotique", isCorrect: true },
          { text: "La sécrétion active de potassium par les cellules principales", isCorrect: false },
          { text: "La filtration passive du bicarbonate dans la branche ascendante", isCorrect: false }
        ],
        explanation: "L'anse de Henlé fonctionne comme un multiplicateur à contre-courant : la branche descendante est perméable à l'eau, la branche ascendante imperméable à l'eau mais active le transport du NaCl, créant un gradient osmotique médullaire qui permet la concentration des urines."
      },
      {
        text: "Quel est le rôle de l'aldostérone au niveau rénal ?",
        options: [
          { text: "Elle inhibe la réabsorption du sodium dans le tube collecteur", isCorrect: false },
          { text: "Elle stimule la réabsorption du sodium et l'excrétion du potassium", isCorrect: true },
          { text: "Elle stimule la réabsorption de l'eau dans l'anse de Henlé descendante", isCorrect: false },
          { text: "Elle inhibe la sécrétion de rénine par les cellules juxtagloménulaires", isCorrect: false }
        ],
        explanation: "L'aldostérone (hormone minéralocorticoïde) agit sur le tube collecteur et le TCD en stimulant la réabsorption de sodium (via les canaux ENaC) et l'excrétion de potassium, augmentant ainsi la volémie."
      },
      {
        text: "Quelle substance est sécrétée dans la lumière tubulaire pour éliminer les ions H+ ?",
        options: [
          { text: "Le bicarbonate, via l'échangeur Na+/HCO3-", isCorrect: false },
          { text: "L'ammoniac (NH3), transformé en ammonium (NH4+) dans le tubule", isCorrect: true },
          { text: "Le phosphate tricalcique, tampon osseux réabsorbé au niveau rénal", isCorrect: false },
          { text: "Le chlorure, sécrété activement par les cellules intercalaires B", isCorrect: false }
        ],
        explanation: "Les cellules des tubes rénaux produisent de l'ammoniac (NH3) à partir de la glutamine. Dans la lumière tubulaire, NH3 capte un H+ pour former NH4+ (ammonium), qui est excrété dans l'urine, participant à l'élimination de l'acidité."
      },
      {
        text: "Le seuil de réabsorption du glucose est dépassé lorsque la glycémie dépasse environ :",
        options: [
          { text: "0,60 g/L — seuil bas permettant une glycosurie physiologique", isCorrect: false },
          { text: "1,80 g/L — saturation des transporteurs SGLT2 du TCP", isCorrect: true },
          { text: "2,50 g/L — seuil de saturation des transporteurs GLUT2 du TCD", isCorrect: false },
          { text: "3,00 g/L — seuil correspondant au coma hyperosmolaire", isCorrect: false }
        ],
        explanation: "Le seuil rénal du glucose est d'environ 1,80 g/L. Au-delà, la capacité de transport (SGLT2 dans le TCP) est dépassée et du glucose apparaît dans les urines : c'est la glycosurie, signe classique du diabète mal équilibré."
      },
      {
        text: "L'hormone antidiurétique (ADH ou vasopressine) agit principalement sur :",
        options: [
          { text: "L'anse de Henlé descendante en augmentant la perméabilité au NaCl", isCorrect: false },
          { text: "Le tube collecteur en augmentant la perméabilité à l'eau via les aquaporines", isCorrect: true },
          { text: "Le tube contourné proximal en stimulant la réabsorption du bicarbonate", isCorrect: false },
          { text: "Les cellules juxtagloménulaires en stimulant la sécrétion de rénine", isCorrect: false }
        ],
        explanation: "L'ADH (libérée par la post-hypophyse en réponse à l'hyperosmolarité) agit sur les tubes collecteurs en insérant des aquaporines-2 dans la membrane apicale, augmentant la perméabilité à l'eau et permettant sa réabsorption pour concentrer les urines."
      }
    ]
  },
  {
    title: "Physiologie digestive — motricité, sécrétion et absorption",
    description: "Quiz sur la motricité intestinale, les sécrétions digestives et l'absorption des nutriments.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Chapitre 7 - Physiologie digestive",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel type de mouvement intestinal assure le mélange du chyme avec les sucs digestifs ?",
        options: [
          { text: "Le péristaltisme propulsif qui déplace le contenu vers l'aval", isCorrect: false },
          { text: "Les contractions de segmentation qui divisent et mélangent le chyme", isCorrect: true },
          { text: "Le réflexe gastro-colique qui vide le côlon après le repas", isCorrect: false },
          { text: "La migrating motor complex (MMC) qui nettoie le tube digestif à jeun", isCorrect: false }
        ],
        explanation: "Les contractions de segmentation sont des contractions annulaires locales qui divisent le bol alimentaire et le mélangent aux sucs digestifs sans déplacement net, optimisant le contact avec la muqueuse pour l'absorption."
      },
      {
        text: "Quelle cellule gastrique sécrète l'acide chlorhydrique (HCl) ?",
        options: [
          { text: "Les cellules principales (ou pepsigènes) du fundus gastrique", isCorrect: false },
          { text: "Les cellules pariétales (ou oxyntiques) de la muqueuse fundique", isCorrect: true },
          { text: "Les cellules à mucus du collet des glandes gastriques", isCorrect: false },
          { text: "Les cellules G de l'antre gastrique productrices de gastrine", isCorrect: false }
        ],
        explanation: "Les cellules pariétales (oxyntiques) sécrètent HCl via la pompe H+/K+-ATPase et le facteur intrinsèque (nécessaire à l'absorption de la vitamine B12). Les cellules principales sécrètent le pepsinogène."
      },
      {
        text: "Où est principalement absorbé le fer alimentaire dans le tube digestif ?",
        options: [
          { text: "Dans le jéjunum proximal, sous forme ferreux (Fe2+)", isCorrect: false },
          { text: "Dans le duodénum et le jéjunum proximal, sous forme ferreux (Fe2+)", isCorrect: true },
          { text: "Dans l'iléon terminal, couplé à l'absorption de la vitamine B12", isCorrect: false },
          { text: "Dans le côlon ascendant, par absorption passive paracellulaire", isCorrect: false }
        ],
        explanation: "Le fer est absorbé principalement dans le duodénum et le jéjunum proximal. Le fer ferreux (Fe2+) est mieux absorbé que le fer ferrique (Fe3+). L'acidité gastrique et la vitamine C facilitent sa réduction en Fe2+."
      },
      {
        text: "Quel est le rôle de la bile dans la digestion des lipides ?",
        options: [
          { text: "Elle hydrolyse les triglycérides en monoglycérides et acides gras libres", isCorrect: false },
          { text: "Elle émulsionne les graisses et solubilise les produits de lipolyse en micelles", isCorrect: true },
          { text: "Elle active le pancréas exocrine pour libérer les lipases pancréatiques", isCorrect: false },
          { text: "Elle neutralise l'acidité du chyme gastrique entrant dans le duodénum", isCorrect: false }
        ],
        explanation: "La bile (sels biliaires) émulsionne les graisses alimentaires, augmentant la surface de contact pour les lipases. Les produits de la lipolyse (acides gras, monoglycérides) sont solubilisés en micelles mixtes qui facilitent leur absorption par les entérocytes."
      },
      {
        text: "Quelle hormone stimule la sécrétion pancréatique exocrine riche en enzymes ?",
        options: [
          { text: "La sécrétine, libérée par les cellules S du duodénum en réponse à l'acidité", isCorrect: false },
          { text: "La cholécystokinine (CCK), libérée par les cellules I du duodénum en réponse aux graisses", isCorrect: true },
          { text: "La motiline, libérée par les cellules Mo du duodénum à jeun", isCorrect: false },
          { text: "Le glucagon-like peptide 1 (GLP-1), libéré par les cellules L de l'iléon", isCorrect: false }
        ],
        explanation: "La CCK est libérée par les cellules I du duodéno-jéjunum en réponse aux protéines et aux graisses. Elle stimule la sécrétion pancréatique riche en enzymes (lipase, amylase, protéases) et provoque la contraction de la vésicule biliaire."
      },
      {
        text: "Les vitamines liposolubles (A, D, E, K) sont absorbées dans le tube digestif :",
        options: [
          { text: "Dans l'estomac, par diffusion passive à travers la muqueuse gastrique acide", isCorrect: false },
          { text: "Dans l'intestin grêle avec les lipides, via les micelles et les chylomicrons", isCorrect: true },
          { text: "Dans le côlon par fermentation bactérienne et transport actif", isCorrect: false },
          { text: "Dans le duodénum uniquement, par un transporteur spécifique couplé au Na+", isCorrect: false }
        ],
        explanation: "Les vitamines liposolubles sont solubilisées dans les micelles biliaires puis absorbées par les entérocytes de l'intestin grêle avec les lipides. Elles sont ensuite incorporées dans les chylomicrons et transportées par la voie lymphatique."
      },
      {
        text: "Quel mécanisme permet l'absorption des acides aminés issus de la digestion protéique ?",
        options: [
          { text: "Diffusion simple à travers la membrane apicale des entérocytes", isCorrect: false },
          { text: "Transport actif secondaire couplé au sodium via des cotransporteurs", isCorrect: true },
          { text: "Endocytose par pinocytose dans les cellules de la lamina propria", isCorrect: false },
          { text: "Transport via les chylomicrons dans les lymphatiques intestinaux", isCorrect: false }
        ],
        explanation: "Les acides aminés sont absorbés par transport actif secondaire couplé au sodium (cotransporteurs SAAT) à la membrane apicale des entérocytes. Certains di- et tripeptides sont absorbés via le transporteur PepT1 et hydrolysés à l'intérieur de la cellule."
      },
      {
        text: "Où s'effectue principalement la réabsorption de l'eau dans le côlon ?",
        options: [
          { text: "Dans le côlon transverse uniquement, par transport actif de l'eau", isCorrect: false },
          { text: "Dans le côlon droit (ascendant et cæcum), par absorption passive liée au Na+", isCorrect: true },
          { text: "Dans le sigmoïde et le rectum, par cotransport eau-potassium", isCorrect: false },
          { text: "Dans le côlon gauche uniquement, grâce aux bactéries productrices d'osmolytes", isCorrect: false }
        ],
        explanation: "La majeure partie de l'eau colique (~1,3 L/jour) est réabsorbée dans le côlon droit (cæcum et côlon ascendant) suivant l'absorption active du sodium. Le côlon gauche stocke les selles solides avant leur évacuation."
      }
    ]
  },
  {
    title: "Physiologie endocrinienne — axes hypothalamo-hypophysaires et hormones",
    description: "Quiz sur les axes hypothalamo-hypophysaires et la régulation hormonale des grandes fonctions.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Chapitre 8 - Physiologie endocrinienne",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel mécanisme régule principalement la sécrétion hormonale des axes hypothalamo-hypophysaires ?",
        options: [
          { text: "La rétrocontrôle positif permanent des hormones périphériques sur l'hypophyse", isCorrect: false },
          { text: "La rétrocontrôle négatif des hormones périphériques sur l'hypothalamus et l'hypophyse", isCorrect: true },
          { text: "Le rétrocontrôle positif de l'hypophyse sur l'hypothalamus uniquement", isCorrect: false },
          { text: "La stimulation paracrine directe des cellules cibles sans voie hypothalamique", isCorrect: false }
        ],
        explanation: "La régulation des axes endocriniens repose principalement sur le rétrocontrôle négatif (feedback négatif) : les hormones périphériques (ex. cortisol, T3/T4) inhibent la sécrétion des hormones de libération hypothalamiques (ex. CRH, TRH) et des hormones hypophysaires (ex. ACTH, TSH)."
      },
      {
        text: "Quelle hormone hypothalamique stimule la libération de TSH par l'antéhypophyse ?",
        options: [
          { text: "La GnRH (Gonadotropin-Releasing Hormone) synthétisée par les noyaux arqués", isCorrect: false },
          { text: "La TRH (Thyrotropin-Releasing Hormone) synthétisée par le noyau paraventriculaire", isCorrect: true },
          { text: "La CRH (Corticotropin-Releasing Hormone) synthétisée par le noyau supraoptique", isCorrect: false },
          { text: "La GHRH (Growth Hormone-Releasing Hormone) synthétisée par l'éminence médiane", isCorrect: false }
        ],
        explanation: "La TRH (Thyrotropin-Releasing Hormone), sécrétée par l'hypothalamus, stimule l'antéhypophyse pour libérer la TSH (Thyroid-Stimulating Hormone), qui à son tour stimule la thyroïde à produire T3 et T4."
      },
      {
        text: "Quel est le mécanisme d'action des hormones stéroïdiennes (ex. cortisol, estrogènes) ?",
        options: [
          { text: "Liaison à un récepteur membranaire couplé à une protéine G et second messager AMPc", isCorrect: false },
          { text: "Liaison à un récepteur intracellulaire et modulation directe de la transcription génique", isCorrect: true },
          { text: "Liaison à un récepteur tyrosine kinase membranaire activant la cascade MAP kinase", isCorrect: false },
          { text: "Liaison à un canal ionique membranaire ligand-dépendant pour modifier le potentiel", isCorrect: false }
        ],
        explanation: "Les hormones stéroïdiennes sont liposolubles et traversent la membrane cellulaire. Elles se lient à des récepteurs intracellulaires (cytoplasmiques ou nucléaires) qui, activés, se fixent sur des éléments de réponse hormonale de l'ADN et régulent directement la transcription de gènes cibles."
      },
      {
        text: "L'hormone de croissance (GH) exerce ses effets anabolisants principalement via :",
        options: [
          { text: "Une action directe sur les chondrocytes sans intermédiaire hépatique", isCorrect: false },
          { text: "Les IGF-1 (Insulin-like Growth Factors 1) produits par le foie sous l'effet de la GH", isCorrect: true },
          { text: "La prolactine co-libérée avec la GH par les somatotropes hypophysaires", isCorrect: false },
          { text: "L'insuline pancréatique, dont la sécrétion est amplifiée par la GH en postprandial", isCorrect: false }
        ],
        explanation: "La GH stimule le foie (et d'autres tissus) à produire des IGF-1 (Somatomédine C), qui sont les médiateurs des effets anabolisants et de croissance osseuse de la GH. Les IGF-1 exercent aussi un rétrocontrôle négatif sur la GH et la GHRH."
      },
      {
        text: "Quelle glande sécrète le cortisol, et sous la stimulation de quelle hormone hypophysaire ?",
        options: [
          { text: "La médullosurrénale, stimulée par la TSH sécrétée par l'antéhypophyse", isCorrect: false },
          { text: "Le cortex surrénalien (zona fasciculata), stimulé par l'ACTH hypophysaire", isCorrect: true },
          { text: "Le cortex surrénalien (zona glomerulosa), stimulé par l'angiotensine II circulante", isCorrect: false },
          { text: "La médullosurrénale (cellules chromaffines), stimulée par la CRH hypothalamique", isCorrect: false }
        ],
        explanation: "Le cortisol est produit par la zona fasciculata du cortex surrénalien sous l'effet de l'ACTH (Adrénocorticotropine) sécrétée par les corticotropes de l'antéhypophyse. La CRH hypothalamique stimule la libération d'ACTH (axe CRH-ACTH-cortisol)."
      },
      {
        text: "Les hormones thyroïdiennes T3 et T4 ont pour effet métabolique principal de :",
        options: [
          { text: "Diminuer le métabolisme basal en réduisant la thermogenèse cellulaire", isCorrect: false },
          { text: "Augmenter le métabolisme basal et la thermogenèse dans la plupart des tissus", isCorrect: true },
          { text: "Bloquer la lipolyse et favoriser le stockage des triglycérides dans les adipocytes", isCorrect: false },
          { text: "Inhiber la gluconéogenèse hépatique pour prévenir l'hyperglycémie à jeun", isCorrect: false }
        ],
        explanation: "Les hormones thyroïdiennes (T3 principalement active, T4 pro-hormone) augmentent le métabolisme basal en stimulant la consommation d'O2 et la thermogenèse dans la plupart des cellules. Elles favorisent aussi la synthèse protéique, la lipolyse et la sensibilité aux catécholamines."
      },
      {
        text: "Quelle hormone post-hypophysaire est libérée en réponse à une hyperosmolarité plasmatique ?",
        options: [
          { text: "L'ocytocine, libérée par les noyaux paraventriculaires en cas de stress osmotique", isCorrect: false },
          { text: "L'ADH (vasopressine), libérée par les noyaux supraoptiques en cas de déshydratation", isCorrect: true },
          { text: "L'ACTH, libérée par l'antéhypophyse en réponse à la CRH hypothalamique", isCorrect: false },
          { text: "La prolactine, libérée par les lactotropes antéhypophysaires en réponse à la soif", isCorrect: false }
        ],
        explanation: "L'ADH (hormone antidiurétique ou vasopressine) est synthétisée dans les noyaux supraoptiques de l'hypothalamus et stockée dans la post-hypophyse. Elle est libérée en réponse à l'hyperosmolarité (détectée par les osmorécepteurs) ou à l'hypovolémie."
      },
      {
        text: "Dans l'axe gonadotrope, la sécrétion pulsatile de GnRH est essentielle car :",
        options: [
          { text: "Une sécrétion continue de GnRH augmente progressivement la FSH et la LH", isCorrect: false },
          { text: "Une sécrétion continue de GnRH désensibilise les récepteurs hypophysaires et inhibe FSH/LH", isCorrect: true },
          { text: "La pulsatilité est uniquement nécessaire chez la femme pour déclencher l'ovulation", isCorrect: false },
          { text: "La pulsatilité empêche la dégradation enzymatique rapide de la GnRH par les métalloprotéases", isCorrect: false }
        ],
        explanation: "La GnRH doit être sécrétée de façon pulsatile (toutes les 60-90 min) pour maintenir la sensibilité des récepteurs hypophysaires. Une sécrétion continue désensibilise (down-regulation) les récepteurs à GnRH et inhibe la FSH et la LH — principe utilisé dans les agonistes GnRH à longue durée d'action en thérapeutique."
      }
    ]
  },
  {
    title: "Hémostase — vasoconstriction, agrégation plaquettaire et coagulation",
    description: "Quiz sur les trois temps de l'hémostase : vasoconstriction, hémostase primaire et coagulation.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Chapitre 9 - Hémostase",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le premier temps de l'hémostase après une lésion vasculaire ?",
        options: [
          { text: "L'agrégation plaquettaire avec formation du clou plaquettaire primaire", isCorrect: false },
          { text: "La vasoconstriction réflexe locale réduisant le débit sanguin au site lésé", isCorrect: true },
          { text: "L'activation de la voie extrinsèque de la coagulation par le facteur tissulaire", isCorrect: false },
          { text: "La fibrinolyse par activation du plasminogène en plasmine par le tPA", isCorrect: false }
        ],
        explanation: "Le premier temps de l'hémostase est la vasoconstriction réflexe locale, déclenchée par la lésion endothéliale et les médiateurs (sérotonine, thromboxane A2). Elle réduit le débit sanguin local et limite l'hémorragie, permettant aux étapes suivantes de se mettre en place."
      },
      {
        text: "Quelle protéine est indispensable à l'adhésion des plaquettes au collagène sous-endothélial exposé ?",
        options: [
          { text: "La fibrine, produit final de la cascade de coagulation formant le réseau fibreux", isCorrect: false },
          { text: "Le facteur de Willebrand (vWF), qui forme un pont entre le collagène et le récepteur GPIb", isCorrect: true },
          { text: "La thrombine, enzyme protéolytique activant le fibrinogène en fibrine soluble", isCorrect: false },
          { text: "La prostacycline (PGI2), facteur anti-agrégant sécrété par les cellules endothéliales", isCorrect: false }
        ],
        explanation: "Le facteur de Willebrand (vWF) est libéré par l'endothélium lésé et le sous-endothélium. Il se lie au collagène exposé et au récepteur GPIb-IX-V plaquettaire, formant un pont indispensable à l'adhésion plaquettaire initiale, surtout dans les zones à fort débit sanguin."
      },
      {
        text: "Lors de l'activation plaquettaire, quel médiateur amplifie le recrutement d'autres plaquettes ?",
        options: [
          { text: "La prostacycline (PGI2) libérée par les plaquettes activées pour recruter d'autres plaquettes", isCorrect: false },
          { text: "Le thromboxane A2 (TXA2) synthétisé par les plaquettes activées et l'ADP plaquettaire", isCorrect: true },
          { text: "La fibronectine sécrétée par les cellules endothéliales au site de la lésion vasculaire", isCorrect: false },
          { text: "Le FXIII (facteur stabilisant la fibrine) libéré par les granules alpha plaquettaires", isCorrect: false }
        ],
        explanation: "Les plaquettes activées libèrent du TXA2 (puissant vasoconstricteur et pro-agrégant) et de l'ADP (des granules denses), qui amplifient l'activation et le recrutement d'autres plaquettes. La prostacycline (PGI2) endothéliale est au contraire un inhibiteur de l'agrégation."
      },
      {
        text: "Quel facteur de coagulation est activé en premier dans la voie extrinsèque (thromboplastinique) ?",
        options: [
          { text: "Le facteur XII (Hageman), activé par contact avec les surfaces chargées négativement", isCorrect: false },
          { text: "Le facteur VII, activé par son association avec le facteur tissulaire (TF/FT) exposé", isCorrect: true },
          { text: "Le facteur VIII, co-facteur de la ténase intrinsèque activé par la thrombine", isCorrect: false },
          { text: "Le facteur X, point de convergence des deux voies de la coagulation", isCorrect: false }
        ],
        explanation: "Dans la voie extrinsèque, le facteur tissulaire (TF), exposé lors de la lésion vasculaire, forme un complexe avec le facteur VII circulant (qui s'active en FVIIa). Ce complexe TF-FVIIa active ensuite directement le facteur X (et le FIX), déclenchant la cascade de coagulation."
      },
      {
        text: "Quel est le rôle de la vitamine K dans la coagulation ?",
        options: [
          { text: "Elle active directement la thrombine (FIIa) par carboxylation de ses sites actifs", isCorrect: false },
          { text: "Elle permet la carboxylation des facteurs II, VII, IX et X pour leur activation calcique", isCorrect: true },
          { text: "Elle stimule la synthèse hépatique du fibrinogène et du facteur de Willebrand", isCorrect: false },
          { text: "Elle inhibe la fibrinolyse en bloquant l'activateur tissulaire du plasminogène (tPA)", isCorrect: false }
        ],
        explanation: "La vitamine K est un cofacteur essentiel de la carboxylase hépatique qui effectue la γ-carboxylation des résidus glutamiques des facteurs II (prothrombine), VII, IX et X (et des protéines C et S). Cette carboxylation est indispensable à leur fixation aux phospholipides membranaires en présence de Ca2+."
      },
      {
        text: "La thrombine (FIIa) joue un rôle central dans la coagulation car elle :",
        options: [
          { text: "Active uniquement le fibrinogène en fibrine, sans autre rôle dans la cascade", isCorrect: false },
          { text: "Clive le fibrinogène en fibrine, active FVIII, FV, FXIII et stimule les plaquettes", isCorrect: true },
          { text: "Inhibe la cascade de coagulation en dégradant les facteurs activés circulants", isCorrect: false },
          { text: "Active uniquement le facteur XIII pour stabiliser le caillot de fibrine polymérisée", isCorrect: false }
        ],
        explanation: "La thrombine est une enzyme clé avec de multiples actions : elle clive le fibrinogène en monomères de fibrine, active le FXIII (qui stabilise la fibrine), active les facteurs V et VIII (amplification) et stimule directement l'agrégation plaquettaire via les récepteurs PAR."
      },
      {
        text: "Quelle protéine anticoagulante naturelle inhibe la thrombine et le facteur Xa ?",
        options: [
          { text: "La protéine C activée, qui dégrade les facteurs Va et VIIIa par protéolyse", isCorrect: false },
          { text: "L'antithrombine III (ATIII), dont l'action est potentialisée par l'héparine endogène", isCorrect: true },
          { text: "La protéine S, cofacteur de la protéine C dans la dégradation des facteurs Va et VIIIa", isCorrect: false },
          { text: "Le TFPI (inhibiteur de la voie du facteur tissulaire), qui bloque le complexe FVIIa-TF", isCorrect: false }
        ],
        explanation: "L'antithrombine III est le principal anticoagulant naturel. Elle inhibe la thrombine (FIIa) et le facteur Xa (ainsi que IXa, XIa, XIIa) par formation d'un complexe irréversible. Les héparines (médicaments) potentialisent considérablement cette action en modifiant la conformation de l'ATIII."
      },
      {
        text: "La fibrinolyse, processus de dissolution du caillot, est initiée par :",
        options: [
          { text: "L'activation du fibrinogène par la kallicréine circulante au site du caillot", isCorrect: false },
          { text: "La conversion du plasminogène en plasmine par le tPA libéré par l'endothélium", isCorrect: true },
          { text: "La dégradation de la fibrine par le facteur XII activé et la prékallikréine", isCorrect: false },
          { text: "L'activation de l'alpha-2-antiplasmine par les thrombocytes au contact de la fibrine", isCorrect: false }
        ],
        explanation: "La fibrinolyse est initiée par le tPA (activateur tissulaire du plasminogène), libéré par les cellules endothéliales. Le tPA convertit le plasminogène (adsorbé sur la fibrine) en plasmine, une protéase qui dégrade la fibrine en produits de dégradation (D-dimères)."
      }
    ]
  },
  {
    title: "Physiologie de la reproduction — cycle menstruel, ovulation et fécondation",
    description: "Quiz sur le cycle menstruel, l'ovulation, la fécondation et les mécanismes hormonaux associés.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Chapitre 10 - Physiologie de la reproduction",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle hormone déclenche l'ovulation en provoquant le pic ovulatoire au 14e jour du cycle ?",
        options: [
          { text: "La FSH, dont le pic stimule la maturation finale du follicule de De Graaf", isCorrect: false },
          { text: "La LH, dont le pic brutal (LH surge) déclenche la rupture folliculaire et l'ovulation", isCorrect: true },
          { text: "La progestérone, secrétée par le corps jaune après l'ovulation", isCorrect: false },
          { text: "L'estradiol, dont la chute brutale en phase lutéale tardive déclenche l'ovulation", isCorrect: false }
        ],
        explanation: "C'est le pic de LH (LH surge), déclenché par le rétrocontrôle positif de l'estradiol (quand il dépasse un seuil), qui provoque la rupture du follicule mûr (De Graaf) et l'expulsion de l'ovocyte secondaire : c'est l'ovulation, environ 36 heures après le pic de LH."
      },
      {
        text: "Quelle est la durée normale d'un cycle menstruel et quelle est la phase la plus variable ?",
        options: [
          { text: "28 jours en moyenne ; la phase lutéale (J14 à J28) est la plus variable en durée", isCorrect: false },
          { text: "28 jours en moyenne ; la phase folliculaire (J1 à J14) est la plus variable en durée", isCorrect: true },
          { text: "21 jours en moyenne ; la phase lutéale (J7 à J21) est la plus variable en durée", isCorrect: false },
          { text: "35 jours en moyenne ; les deux phases sont également variables selon les cycles", isCorrect: false }
        ],
        explanation: "Le cycle menstruel dure en moyenne 28 jours (pouvant aller de 21 à 35 jours). La phase lutéale (post-ovulatoire) est relativement constante (~14 jours). C'est la phase folliculaire (pré-ovulatoire) qui est variable et explique les différences de durée des cycles entre femmes."
      },
      {
        text: "Sous l'effet de quelle hormone l'endomètre prolifère-t-il durant la phase folliculaire ?",
        options: [
          { text: "La progestérone, secrétée par le corps jaune formé après l'ovulation", isCorrect: false },
          { text: "L'estradiol, sécrété par les cellules de la granulosa du follicule en croissance", isCorrect: true },
          { text: "La FSH, qui agit directement sur les cellules endométriales pour les faire proliférer", isCorrect: false },
          { text: "La prolactine, libérée par l'antéhypophyse sous l'effet de la dopamine", isCorrect: false }
        ],
        explanation: "Durant la phase folliculaire (proliférative), l'estradiol sécrété par les cellules de la granulosa (sous stimulation FSH) et les cellules de la thèque (sous stimulation LH) stimule la prolifération de l'endomètre (épaississement, régénération des glandes utérines)."
      },
      {
        text: "Quel est le rôle de la progestérone en phase lutéale (post-ovulatoire) ?",
        options: [
          { text: "Elle stimule la prolifération de l'endomètre pour épaissir la muqueuse utérine", isCorrect: false },
          { text: "Elle transforme l'endomètre en phase sécrétoire, propice à la nidation de l'embryon", isCorrect: true },
          { text: "Elle inhibe le corps jaune pour déclencher les menstruations si pas de fécondation", isCorrect: false },
          { text: "Elle stimule la maturation des follicules ovariens pour le prochain cycle", isCorrect: false }
        ],
        explanation: "La progestérone, sécrétée par le corps jaune (formé après l'ovulation), transforme l'endomètre en phase sécrétoire : les glandes deviennent tortueuses et sécrètent du glycogène, le stroma se vascularise, préparant l'endomètre à la nidation d'un éventuel embryon."
      },
      {
        text: "Où se produit normalement la fécondation de l'ovocyte par le spermatozoïde ?",
        options: [
          { text: "Dans la cavité utérine, après migration des spermatozoïdes à travers le col utérin", isCorrect: false },
          { text: "Dans le tiers externe de la trompe utérine (ampoule tubaire)", isCorrect: true },
          { text: "Dans l'ovaire, immédiatement après la rupture folliculaire et l'ovulation", isCorrect: false },
          { text: "Dans le col utérin, au contact de la glaire cervicale riche en spermatozoïdes", isCorrect: false }
        ],
        explanation: "La fécondation a lieu physiologiquement dans l'ampoule tubaire (tiers externe de la trompe de Fallope). L'ovocyte est capté par le pavillon et rencontre les spermatozoïdes qui ont traversé le col, l'utérus et la trompe. La nidation a lieu ultérieurement dans l'utérus (~J6-J7 après fécondation)."
      },
      {
        text: "L'hCG (gonadotrophine chorionique humaine) est produite par quel tissu et quel est son rôle ?",
        options: [
          { text: "Par l'antéhypophyse maternelle pour maintenir la sécrétion de FSH et LH en début de grossesse", isCorrect: false },
          { text: "Par le syncytiotrophoblaste embryonnaire pour maintenir le corps jaune et la progestérone", isCorrect: true },
          { text: "Par l'ovaire maternel pour stimuler la maturation folliculaire du prochain cycle", isCorrect: false },
          { text: "Par l'endomètre décidual pour inhiber les contractions myométriales en début de grossesse", isCorrect: false }
        ],
        explanation: "L'hCG est produite par le syncytiotrophoblaste de l'embryon implanté dès J8-J10. Elle agit comme la LH en maintenant le corps jaune et sa sécrétion de progestérone, empêchant ainsi les menstruations et la régression de l'endomètre. L'hCG est le marqueur détecté par les tests de grossesse."
      },
      {
        text: "Combien de spermatozoïdes contient normalement un éjaculat (spermogramme normal) ?",
        options: [
          { text: "Plus de 10 millions de spermatozoïdes au total avec mobilité > 20 %", isCorrect: false },
          { text: "Plus de 39 millions de spermatozoïdes au total avec mobilité progressive > 32 %", isCorrect: true },
          { text: "Plus de 100 millions de spermatozoïdes au total avec vitalité > 80 %", isCorrect: false },
          { text: "Plus de 200 millions de spermatozoïdes au total avec morphologie normale > 60 %", isCorrect: false }
        ],
        explanation: "Selon les critères OMS 2021 : un spermogramme normal comporte ≥ 39 millions de spermatozoïdes par éjaculat total (ou ≥ 16 millions/mL), une mobilité progressive ≥ 30 % à 1h et une vitalité ≥ 54 %. En dessous de ces seuils, on parle d'oligospermie, asthénospermie ou tératospermie."
      },
      {
        text: "Lors de la méiose ovocytaire, à quel stade l'ovocyte est-il bloqué avant l'ovulation ?",
        options: [
          { text: "En prophase I (stade diplotène), jusqu'au déclenchement par le pic de LH", isCorrect: true },
          { text: "En métaphase II, stade atteint uniquement après la fécondation par le spermatozoïde", isCorrect: false },
          { text: "En anaphase I, bloqué jusqu'à la puberté par les hormones folliculaires", isCorrect: false },
          { text: "En télophase II, juste avant l'expulsion du 2e globule polaire dans la trompe", isCorrect: false }
        ],
        explanation: "L'ovocyte primaire est bloqué en prophase I (stade diplotène / vésicule germinative) depuis la vie fœtale jusqu'à la puberté. Sous l'effet du pic de LH, il reprend la méiose et s'arrête en métaphase II au moment de l'ovulation. La méiose II ne s'achève (expulsion du 2e globule polaire) qu'après la fécondation."
      }
    ]
  }
];
