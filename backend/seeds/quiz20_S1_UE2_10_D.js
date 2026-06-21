module.exports = [
  {
    title: "Résistances bactériennes — mécanismes, BMR/BHR et mesures de contrôle",
    description: "Quiz sur les mécanismes de résistance bactérienne, les bactéries multirésistantes et hautement résistantes, et les mesures de prévention et contrôle en milieu de soins.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 16,
    difficulty: "Intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la principale définition d'une bactérie multirésistante (BMR) ?",
        options: [
          { text: "Bactérie résistante à au moins un antibiotique de première ligne utilisé en thérapeutique", isCorrect: false },
          { text: "Bactérie résistante à plusieurs familles d'antibiotiques, ne laissant que peu d'options thérapeutiques", isCorrect: true },
          { text: "Bactérie résistante uniquement aux bêtalactamines et aux fluoroquinolones par mutation ponctuelle", isCorrect: false },
          { text: "Bactérie naturellement résistante à tous les antibiotiques disponibles sur le marché", isCorrect: false }
        ],
        explanation: "Une BMR est une bactérie résistante à plusieurs familles d'antibiotiques, ne laissant que peu d'options thérapeutiques utilisables en pratique clinique courante."
      },
      {
        text: "Quel mécanisme enzymatique est responsable de la résistance aux bêtalactamines chez Staphylococcus aureus ?",
        options: [
          { text: "Production d'une carbapénémase hydrolysant le noyau bêtalactame de l'antibiotique", isCorrect: false },
          { text: "Modification des protéines liant la pénicilline (PLP) rendant l'antibiotique inefficace", isCorrect: false },
          { text: "Production d'une pénicillinase (bêtalactamase) qui hydrolyse le noyau bêtalactame", isCorrect: true },
          { text: "Surexpression de pompes à efflux expulsant l'antibiotique hors de la cellule", isCorrect: false }
        ],
        explanation: "Staphylococcus aureus produit une pénicillinase (bêtalactamase) qui hydrolyse le noyau bêtalactame de la pénicilline, la rendant inactive. Le SARM utilise en plus une PLP modifiée (PLP2a)."
      },
      {
        text: "Qu'est-ce que le SARM et pourquoi pose-t-il un problème thérapeutique majeur ?",
        options: [
          { text: "Staphylocoque aureus résistant aux macrolides, traitable par les fluoroquinolones de 3e génération", isCorrect: false },
          { text: "Staphylocoque aureus résistant à la méticilline, résistant à toutes les bêtalactamines disponibles", isCorrect: true },
          { text: "Staphylocoque aureus résistant aux aminosides, traitable par les bêtalactamines protégées", isCorrect: false },
          { text: "Staphylocoque aureus résistant aux vancomycines, limitant les options aux carbapénèmes", isCorrect: false }
        ],
        explanation: "Le SARM (Staphylococcus aureus résistant à la méticilline) possède une PLP2a modifiée qui confère une résistance à toutes les bêtalactamines, nécessitant le recours à la vancomycine ou au linézolide."
      },
      {
        text: "Quelle est la différence principale entre une BHR et une BMR en infectiologie ?",
        options: [
          { text: "Les BHR sont résistantes à un seul antibiotique, contrairement aux BMR qui résistent à plusieurs", isCorrect: false },
          { text: "Les BHR sont des bactéries émergentes hautement résistantes, souvent aux carbapénèmes, avec très peu d'options", isCorrect: true },
          { text: "Les BHR touchent uniquement les patients immunodéprimés, contrairement aux BMR plus ubiquitaires", isCorrect: false },
          { text: "Les BHR sont exclusivement des entérocoques, tandis que les BMR peuvent être de toutes espèces", isCorrect: false }
        ],
        explanation: "Les BHR (bactéries hautement résistantes émergentes) comme les EPC (entérobactéries productrices de carbapénémases) ou les ERG sont résistantes aux carbapénèmes, laissant très peu d'options thérapeutiques."
      },
      {
        text: "Quelle mesure est prioritaire pour éviter la transmission d'une BMR dans un service hospitalier ?",
        options: [
          { text: "Administrer un antibiotique prophylactique systématique à tous les patients du service concerné", isCorrect: false },
          { text: "Placer le patient porteur en isolement contact avec hygiène des mains renforcée et port de gants", isCorrect: true },
          { text: "Décontaminer les surfaces du service uniquement lors de la sortie du patient porteur", isCorrect: false },
          { text: "Restreindre les visites familiales et augmenter la fréquence des prélèvements de dépistage", isCorrect: false }
        ],
        explanation: "Les précautions contact (isolement, hygiène des mains, gants et tablier) sont la mesure prioritaire pour prévenir la transmission croisée des BMR/BHR en milieu hospitalier."
      },
      {
        text: "Qu'est-ce qu'un plasmide R et quel rôle joue-t-il dans la résistance bactérienne ?",
        options: [
          { text: "Fragment chromosomique contenant des gènes de résistance transmis uniquement lors de la division cellulaire", isCorrect: false },
          { text: "Molécule d'ADN extrachromosomique portant des gènes de résistance, transférable entre bactéries par conjugaison", isCorrect: true },
          { text: "Protéine membranaire responsable de l'efflux des antibiotiques hors de la cellule bactérienne", isCorrect: false },
          { text: "Bactériophage intégré au génome bactérien contenant des informations de résistance enzymatique", isCorrect: false }
        ],
        explanation: "Un plasmide R est un ADN extrachromosomique portant des gènes de résistance. Il peut être transféré horizontalement entre bactéries (même d'espèces différentes) par conjugaison, transformation ou transduction."
      },
      {
        text: "Quel acronyme désigne les entérobactéries productrices de bêtalactamases à spectre étendu ?",
        options: [
          { text: "ERG — entérobactéries résistantes aux glycopeptides par mutation chromosomique acquise", isCorrect: false },
          { text: "SARM — staphylocoques aureus résistants à la méticilline et aux bêtalactamines", isCorrect: false },
          { text: "EBLSE — entérobactéries productrices de bêtalactamases à spectre étendu", isCorrect: true },
          { text: "EPC — entérobactéries productrices de carbapénémases hydrolysant tous les bêtalactamines", isCorrect: false }
        ],
        explanation: "EBLSE désigne les entérobactéries productrices de bêtalactamases à spectre étendu (BLSE), enzymes hydrolysant pénicillines et céphalosporines de 3e génération, représentant une BMR majeure."
      },
      {
        text: "Quelle est la stratégie recommandée pour limiter la pression de sélection antibiotique à l'hôpital ?",
        options: [
          { text: "Utiliser systématiquement les antibiotiques à large spectre pour couvrir tous les pathogènes possibles", isCorrect: false },
          { text: "Administrer les antibiotiques uniquement en prophylaxie pour éviter les infections nosocomiales", isCorrect: false },
          { text: "Mettre en place un programme de bon usage des antibiotiques (antibiotic stewardship) adapté aux données locales", isCorrect: true },
          { text: "Alterner les familles d'antibiotiques chaque semestre pour prévenir l'émergence de résistances", isCorrect: false }
        ],
        explanation: "Les programmes d'antibiotic stewardship (bon usage des antibiotiques) visent à optimiser l'utilisation des antibiotiques : spectre adapté, durée courte, désescalade thérapeutique, afin de réduire la pression de sélection."
      }
    ]
  },
  {
    title: "Infections digestives — gastro-entérites bactériennes et virales, Clostridium",
    description: "Quiz sur les principales infections digestives : agents pathogènes, mécanismes physiopathologiques, diagnostic et prise en charge des gastro-entérites et de Clostridioides difficile.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 17,
    difficulty: "Intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est le principal agent responsable des gastro-entérites virales épidémiques en collectivité ?",
        options: [
          { text: "Rotavirus, responsable de diarrhées sévères chez l'adulte immunocompétent en hiver", isCorrect: false },
          { text: "Norovirus (anciennement Norwalk), très contagieux et responsable d'épidémies en milieu fermé", isCorrect: true },
          { text: "Adénovirus entérique, principal agent des épidémies saisonnières dans les établissements de soins", isCorrect: false },
          { text: "Astrovirus, responsable de la majorité des gastro-entérites épidémiques chez l'adulte sain", isCorrect: false }
        ],
        explanation: "Le norovirus est le principal responsable des épidémies de gastro-entérites virales en collectivité (EHPAD, hôpitaux, croisières). Très contagieux, résistant aux désinfectants courants, il nécessite des mesures d'hygiène renforcées."
      },
      {
        text: "Quelle bactérie produit une toxine thermostable responsable d'une intoxication alimentaire à début rapide (1-6h) ?",
        options: [
          { text: "Salmonella typhi, par invasion de la muqueuse intestinale et production de toxines thermolabiles", isCorrect: false },
          { text: "Campylobacter jejuni, par adhésion aux entérocytes et production d'entérotoxines thermostables", isCorrect: false },
          { text: "Staphylococcus aureus, produisant une entérotoxine thermostable dans l'aliment contaminé", isCorrect: true },
          { text: "Listeria monocytogenes, par invasion intracellulaire et production de listeriolysine O thermostable", isCorrect: false }
        ],
        explanation: "Staphylococcus aureus produit des entérotoxines thermostables directement dans l'aliment. L'intoxication est rapide (1-6h) car la toxine est préformée. La cuisson détruit la bactérie mais pas la toxine."
      },
      {
        text: "Quel est le mécanisme physiopathologique principal de la diarrhée à Vibrio cholerae ?",
        options: [
          { text: "Invasion de la muqueuse colique entraînant une colite hémorragique avec diarrhée sanglante", isCorrect: false },
          { text: "Production d'une entérotoxine activant l'adénylate cyclase et provoquant une hypersécrétion intestinale", isCorrect: true },
          { text: "Destruction des villosités intestinales par effet cytopathogène direct de la bactérie", isCorrect: false },
          { text: "Libération de cytotoxines lysant les colonocytes et provoquant une colite pseudomembraneuse", isCorrect: false }
        ],
        explanation: "La toxine cholérique active l'adénylate cyclase, augmentant le taux d'AMPc intracellulaire, ce qui provoque une hypersécrétion massive de chlorure et d'eau dans la lumière intestinale (diarrhée en eau de riz)."
      },
      {
        text: "Quelle est la complication redoutée des infections à Escherichia coli O157:H7 (STEC) chez l'enfant ?",
        options: [
          { text: "Méningite bactérienne à point de départ digestif avec bactériémie et dissémination hématogène", isCorrect: false },
          { text: "Syndrome hémolytique et urémique (SHU) par action des shigatoxines sur l'endothélium vasculaire", isCorrect: true },
          { text: "Colite pseudomembraneuse par dysbiose intestinale sévère et prolifération de Clostridioides difficile", isCorrect: false },
          { text: "Péritonite stercorale par perforation colique due à l'invasion de la paroi intestinale par la bactérie", isCorrect: false }
        ],
        explanation: "Les STEC (E. coli producteurs de shigatoxines) peuvent provoquer le syndrome hémolytique et urémique (SHU), caractérisé par une anémie hémolytique, une thrombopénie et une insuffisance rénale aiguë, surtout chez l'enfant."
      },
      {
        text: "Dans quel contexte survient principalement l'infection à Clostridioides difficile (CDI) ?",
        options: [
          { text: "Chez des patients en pleine santé n'ayant reçu aucun traitement antibiotique dans les 3 derniers mois", isCorrect: false },
          { text: "Après une antibiothérapie à large spectre ayant perturbé la flore intestinale normale du patient", isCorrect: true },
          { text: "Suite à une contamination alimentaire par des spores lors d'une consommation de viande mal cuite", isCorrect: false },
          { text: "Chez les patients porteurs d'un déficit immunitaire congénital touchant les lymphocytes T cytotoxiques", isCorrect: false }
        ],
        explanation: "Clostridioides difficile prolifère après une antibiothérapie qui perturbe la flore intestinale de protection. Les spores résistantes persistent dans l'environnement et peuvent contaminer les patients hospitalisés."
      },
      {
        text: "Quelle est la mesure d'hygiène spécifique indispensable pour prévenir la transmission de Clostridioides difficile ?",
        options: [
          { text: "Utiliser une solution hydroalcoolique après chaque soin prodigué au patient porteur de C. difficile", isCorrect: false },
          { text: "Porter uniquement des gants stériles lors des soins au patient porteur, sans autre précaution particulière", isCorrect: false },
          { text: "Pratiquer un lavage des mains au savon car les spores résistent aux solutions hydroalcooliques", isCorrect: true },
          { text: "Décontaminer les surfaces avec un ammonium quaternaire diluté après chaque soin au patient", isCorrect: false }
        ],
        explanation: "Les spores de C. difficile sont résistantes aux solutions hydroalcooliques. Le lavage des mains au savon (friction mécanique) est indispensable. L'environnement doit être désinfecté avec de l'eau de Javel."
      },
      {
        text: "Quel agent bactérien est responsable de la listériose et quelle est sa particularité ?",
        options: [
          { text: "Yersinia enterocolitica, bactérie psychrophile se multipliant au réfrigérateur et touchant les immunodéprimés", isCorrect: false },
          { text: "Listeria monocytogenes, bactérie intracellulaire se multipliant au froid, dangereuse chez la femme enceinte", isCorrect: true },
          { text: "Campylobacter jejuni, bactérie microaérophile touchant les femmes enceintes par voie transplacentaire", isCorrect: false },
          { text: "Brucella melitensis, bactérie intracellulaire transmise par les produits laitiers non pasteurisés uniquement", isCorrect: false }
        ],
        explanation: "Listeria monocytogenes est une bactérie intracellulaire capable de se multiplier à 4°C (psychrophile). Elle est particulièrement dangereuse chez la femme enceinte (risque de fœtopathie, avortement) et les immunodéprimés."
      },
      {
        text: "Quel traitement est recommandé en première intention dans la colite pseudomembraneuse à C. difficile ?",
        options: [
          { text: "Métronidazole ou vancomycine orale selon la sévérité, avec arrêt ou changement de l'antibiotique initial", isCorrect: true },
          { text: "Amoxicilline-acide clavulanique en intraveineux pour couvrir les souches productrices de bêtalactamases", isCorrect: false },
          { text: "Ciprofloxacine orale à forte dose, car les fluoroquinolones restent efficaces sur toutes les souches", isCorrect: false },
          { text: "Traitement symptomatique uniquement avec antidiarrhéiques et réhydratation, sans antibiotique spécifique", isCorrect: false }
        ],
        explanation: "La CDI légère à modérée est traitée par métronidazole oral, la forme sévère par vancomycine orale. La fidaxomicine est une alternative. L'arrêt de l'antibiotique responsable est essentiel."
      }
    ]
  },
  {
    title: "Infections respiratoires — pneumonies, tuberculose et grippe",
    description: "Quiz sur les principales infections respiratoires basses : pneumonies communautaires et nosocomiales, tuberculose pulmonaire et grippe saisonnière, diagnostic et prise en charge.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 18,
    difficulty: "Intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est l'agent pathogène le plus fréquemment responsable des pneumonies communautaires de l'adulte ?",
        options: [
          { text: "Staphylococcus aureus, responsable de pneumonies sévères nécrosantes chez l'adulte jeune sain", isCorrect: false },
          { text: "Streptococcus pneumoniae (pneumocoque), principal agent des pneumonies franche lobaire aiguë", isCorrect: true },
          { text: "Klebsiella pneumoniae, responsable des pneumonies communautaires typiques chez l'adulte sain", isCorrect: false },
          { text: "Haemophilus influenzae, principal responsable des pneumonies chez les adultes non vaccinés", isCorrect: false }
        ],
        explanation: "Streptococcus pneumoniae (pneumocoque) est le principal agent des pneumonies communautaires de l'adulte. Il est responsable de la pneumonie franche lobaire aiguë (PFLA), avec fièvre élevée, expectoration rouillée et condensation alvéolaire."
      },
      {
        text: "Quels sont les critères cliniques évocateurs d'une pneumonie atypique à Mycoplasma pneumoniae ?",
        options: [
          { text: "Début brutal avec fièvre élevée, frissons, douleur pleurale et expectoration purulente abondante", isCorrect: false },
          { text: "Début progressif, fièvre modérée, toux sèche persistante, syndrome grippal et infiltrats bilatéraux", isCorrect: true },
          { text: "Fièvre oscillante, hémoptysie récurrente, caverne pulmonaire et sueurs nocturnes profuses", isCorrect: false },
          { text: "Détresse respiratoire aiguë, opacités diffuses et nécessité de ventilation mécanique rapide", isCorrect: false }
        ],
        explanation: "La pneumonie à Mycoplasma pneumoniae (atypique) se caractérise par un début insidieux, une fièvre modérée, une toux sèche rebelle, des céphalées et une dissociation clinico-radiologique (peu de signes cliniques mais infiltrats étendus)."
      },
      {
        text: "Quel type d'isolement doit être mis en place pour un patient suspect de tuberculose pulmonaire bacillifère ?",
        options: [
          { text: "Isolement de contact avec gants et tablier, chambre seule avec précautions standard renforcées", isCorrect: false },
          { text: "Isolement protecteur avec flux d'air filtré en surpression pour protéger le patient immunodéprimé", isCorrect: false },
          { text: "Isolement aérien avec chambre à pression négative, port de masque FFP2 pour le personnel soignant", isCorrect: true },
          { text: "Isolement gouttelettes avec masque chirurgical et chambre seule sans contrainte de pression d'air", isCorrect: false }
        ],
        explanation: "La tuberculose pulmonaire bacillifère se transmet par voie aérienne (noyaux de Wells). L'isolement aérien en chambre à pression négative et le port de masque FFP2 par le personnel sont obligatoires."
      },
      {
        text: "Quelle est la durée standard du traitement antituberculeux en France pour une primo-infection pulmonaire ?",
        options: [
          { text: "3 mois : isoniazide et rifampicine, sans phase d'attaque à quadrithérapie préalable", isCorrect: false },
          { text: "6 mois : 2 mois de quadrithérapie (RHZE) puis 4 mois de bithérapie (RH)", isCorrect: true },
          { text: "9 mois : 3 mois de trithérapie puis 6 mois de monothérapie par isoniazide en entretien", isCorrect: false },
          { text: "12 mois : 6 mois de quadrithérapie intensive puis 6 mois de bithérapie de consolidation", isCorrect: false }
        ],
        explanation: "Le traitement standard de la tuberculose pulmonaire dure 6 mois : 2 mois de quadrithérapie (Rifampicine, Isoniazide, Pyrazinamide, Ethambutol) puis 4 mois de bithérapie (Rifampicine et Isoniazide)."
      },
      {
        text: "Par quel mécanisme le virus de la grippe (Influenza) modifie-t-il ses propriétés antigéniques chaque année ?",
        options: [
          { text: "Recombinaison génétique par échange de segments entiers avec des souches animales (réassortiment)", isCorrect: false },
          { text: "Dérive antigénique (drift) par accumulation de mutations ponctuelles des gènes HA et NA", isCorrect: true },
          { text: "Intégration de l'ARN viral dans le génome cellulaire avec expression de nouvelles protéines virales", isCorrect: false },
          { text: "Sélection de variants résistants aux anticorps neutralisants par pression immunitaire de la population", isCorrect: false }
        ],
        explanation: "La dérive antigénique (antigenic drift) correspond à l'accumulation de mutations ponctuelles dans les gènes codant pour l'hémagglutinine (HA) et la neuraminidase (NA), permettant au virus d'échapper à l'immunité acquise."
      },
      {
        text: "Quelle est la définition d'une pneumonie acquise sous ventilation mécanique (PAVM) ?",
        options: [
          { text: "Pneumonie survenant dans les 48h suivant l'admission hospitalière chez un patient intubé ou non", isCorrect: false },
          { text: "Pneumonie survenant plus de 48h après l'intubation trachéale et la mise sous ventilation mécanique", isCorrect: true },
          { text: "Pneumonie survenant chez tout patient hospitalisé plus de 5 jours en unité de soins intensifs", isCorrect: false },
          { text: "Pneumonie communautaire grave nécessitant une intubation en urgence à l'admission en réanimation", isCorrect: false }
        ],
        explanation: "La PAVM est une infection nosocomiale définie comme une pneumonie survenant après plus de 48h de ventilation mécanique invasive. Elle est liée à la colonisation des voies aériennes par micro-aspiration des sécrétions oropharyngées."
      },
      {
        text: "Quels patients doivent être prioritairement vaccinés contre la grippe saisonnière selon les recommandations ?",
        options: [
          { text: "Uniquement les nourrissons de moins de 6 mois et les femmes enceintes au premier trimestre", isCorrect: false },
          { text: "Les personnes de plus de 65 ans, porteurs de maladies chroniques et les professionnels de santé", isCorrect: true },
          { text: "Uniquement les immunodéprimés et les patients sous corticothérapie prolongée à forte dose", isCorrect: false },
          { text: "L'ensemble de la population adulte sans critère de priorité, pour atteindre l'immunité collective", isCorrect: false }
        ],
        explanation: "La vaccination antigrippale est recommandée pour les personnes âgées de 65 ans et plus, les patients atteints de maladies chroniques (cardiopathie, diabète, insuffisance respiratoire), les femmes enceintes et les professionnels de santé."
      },
      {
        text: "Quel examen microbiologique est indispensable avant de débuter une antibiothérapie pour pneumonie ?",
        options: [
          { text: "Sérologie pneumococcique pour orienter vers un agent bactérien et guider l'antibiothérapie probabiliste", isCorrect: false },
          { text: "Antigénurie pneumocoque et Legionella, hémocultures et examen cytobactériologique des crachats (ECBC)", isCorrect: true },
          { text: "PCR virale sur prélèvement nasopharyngé uniquement, l'antibiothérapie n'étant pas justifiée en première intention", isCorrect: false },
          { text: "Ponction pleurale systématique pour analyse biochimique et bactériologique du liquide pleural", isCorrect: false }
        ],
        explanation: "Le bilan microbiologique des pneumonies comprend les antigénuries (pneumocoque et Legionella), les hémocultures (en cas de fièvre élevée), et l'ECBC pour orienter l'antibiothérapie et adapter le traitement secondairement."
      }
    ]
  },
  {
    title: "Infections urinaires — agents pathogènes, diagnostic et traitement",
    description: "Quiz sur les infections urinaires : agents pathogènes, classification (cystite, pyélonéphrite, prostatite), diagnostic microbiologique et stratégies thérapeutiques adaptées.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 19,
    difficulty: "Intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est l'agent pathogène le plus fréquemment responsable des infections urinaires communautaires ?",
        options: [
          { text: "Klebsiella pneumoniae, entérobactérie responsable de 30 % des cystites communautaires simples", isCorrect: false },
          { text: "Staphylococcus saprophyticus, principal responsable des cystites simples chez la jeune femme", isCorrect: false },
          { text: "Escherichia coli, responsable de 70 à 80 % des infections urinaires communautaires toutes formes", isCorrect: true },
          { text: "Proteus mirabilis, entérobactérie responsable de la majorité des infections urinaires féminines", isCorrect: false }
        ],
        explanation: "E. coli est responsable de 70 à 80 % des infections urinaires communautaires grâce à ses facteurs de virulence (adhésines, fimbriae de type 1 et P, hémolysines) qui facilitent la colonisation de l'urothélium."
      },
      {
        text: "Quels seuils définissent une bactériurie significative à l'examen cytobactériologique des urines (ECBU) ?",
        options: [
          { text: "Bactériurie ≥ 10² UFC/mL quel que soit le germe et leucocyturie ≥ 10³ leucocytes/mL", isCorrect: false },
          { text: "Bactériurie ≥ 10³ UFC/mL pour les cocci à Gram+ et ≥ 10⁴ UFC/mL pour les entérobactéries", isCorrect: false },
          { text: "Bactériurie ≥ 10⁵ UFC/mL pour les femmes et ≥ 10³ UFC/mL pour les hommes, avec leucocyturie", isCorrect: true },
          { text: "Bactériurie ≥ 10⁶ UFC/mL et leucocyturie ≥ 10⁴/mL pour affirmer une infection urinaire vraie", isCorrect: false }
        ],
        explanation: "Une bactériurie est significative à ≥ 10⁵ UFC/mL chez la femme (sauf cystite aiguë simple : ≥ 10³) et ≥ 10³ UFC/mL chez l'homme, avec une leucocyturie ≥ 10⁴ leucocytes/mL (sauf exception)."
      },
      {
        text: "Qu'est-ce qui distingue une cystite simple d'une pyélonéphrite aiguë sur le plan clinique ?",
        options: [
          { text: "La cystite s'accompagne toujours de fièvre élevée, contrairement à la pyélonéphrite qui reste apyrétique", isCorrect: false },
          { text: "La pyélonéphrite associe des signes systémiques (fièvre, frissons) et une douleur lombaire haute à la cystite", isCorrect: true },
          { text: "La cystite est toujours bactérienne tandis que la pyélonéphrite peut avoir une origine virale ou fongique", isCorrect: false },
          { text: "La pyélonéphrite se manifeste uniquement par des brûlures mictionnelles et une pollakiurie sévère", isCorrect: false }
        ],
        explanation: "La pyélonéphrite aiguë (PNA) se distingue de la cystite par l'atteinte du parenchyme rénal : fièvre élevée, frissons, douleur lombaire unilatérale (signe de Giordano positif), nausées/vomissements et altération de l'état général."
      },
      {
        text: "Quel examen d'imagerie est recommandé en urgence devant une pyélonéphrite aiguë obstructive ?",
        options: [
          { text: "IRM abdominopelvienne avec injection de gadolinium pour visualiser l'obstacle et l'inflammation", isCorrect: false },
          { text: "Echographie rénale et des voies urinaires, éventuellement complétée par un uro-scanner sans injection", isCorrect: true },
          { text: "Urographie intraveineuse (UIV) avec injection d'iode pour étudier la morphologie des voies urinaires", isCorrect: false },
          { text: "Scintigraphie rénale au DMSA pour évaluer la fonction rénale différentielle en urgence", isCorrect: false }
        ],
        explanation: "L'échographie rénale est l'examen de première intention dans la PNA, complétée par un uro-scanner (sans injection en urgence) pour rechercher un obstacle (lithiase, sténose) nécessitant un drainage en urgence."
      },
      {
        text: "Quel est le traitement de première intention recommandé pour une cystite aiguë simple chez la femme adulte ?",
        options: [
          { text: "Amoxicilline-acide clavulanique per os 3 jours car résistance d'E. coli aux autres molécules", isCorrect: false },
          { text: "Fluoroquinolone per os 3 jours, traitement de référence des cystites simples par efficacité prouvée", isCorrect: false },
          { text: "Fosfomycine-trométamol monodose ou nitrofurantoïne 5 jours selon les recommandations HAS", isCorrect: true },
          { text: "Céphalosporine de 3e génération per os 7 jours pour couvrir les souches productrices de BLSE", isCorrect: false }
        ],
        explanation: "Selon les recommandations HAS, le traitement de la cystite simple est la fosfomycine-trométamol (monodose) ou la nitrofurantoïne (5 jours), réservant les fluoroquinolones et C3G aux formes compliquées ou à risque."
      },
      {
        text: "Quelle est la spécificité de la prostatite aiguë bactérienne par rapport aux autres infections urinaires ?",
        options: [
          { text: "Elle touche uniquement les hommes de moins de 40 ans sans facteur de risque urogénital identifiable", isCorrect: false },
          { text: "Elle nécessite une antibiothérapie prolongée (4-6 semaines) car la diffusion dans le parenchyme est difficile", isCorrect: true },
          { text: "Elle guérit spontanément sans antibiothérapie grâce aux défenses immunitaires locales du parenchyme", isCorrect: false },
          { text: "Elle est exclusivement due à des germes sexuellement transmissibles comme Neisseria gonorrhoeae", isCorrect: false }
        ],
        explanation: "La prostatite aiguë bactérienne nécessite une antibiothérapie prolongée de 4 à 6 semaines (fluoroquinolones ou cotrimoxazole), car la diffusion des antibiotiques dans le parenchyme prostatique est limitée par la barrière hémato-prostatique."
      },
      {
        text: "Qu'est-ce qu'une colonisation urinaire (ou bactériurie asymptomatique) et quand doit-elle être traitée ?",
        options: [
          { text: "Présence de bactéries dans les urines avec symptômes ; elle doit toujours être traitée immédiatement", isCorrect: false },
          { text: "Présence de bactéries dans les urines sans symptômes ; elle est traitée chez la femme enceinte et avant chirurgie", isCorrect: true },
          { text: "Présence de bactéries dans les urines sans leucocyturie ; elle ne nécessite aucun traitement en toute situation", isCorrect: false },
          { text: "Contamination lors du prélèvement sans signification pathologique, ne nécessitant pas de traitement", isCorrect: false }
        ],
        explanation: "La bactériurie asymptomatique est traitée uniquement chez la femme enceinte (risque de pyélonéphrite et prématurité) et avant toute intervention urologique programmée. Dans les autres cas, le traitement est déconseillé car il favorise les résistances."
      },
      {
        text: "Quel germe doit faire suspecter une lithiase urinaire ou une anomalie des voies urinaires par ses propriétés biochimiques ?",
        options: [
          { text: "Escherichia coli, par sa production de fimbriae P favorisant la formation de calculs d'oxalate", isCorrect: false },
          { text: "Proteus mirabilis, uréase-positif produisant de l'ammoniac et alcalinisant les urines, favorisant les calculs", isCorrect: true },
          { text: "Enterococcus faecalis, par sa résistance aux antibiotiques et sa capacité à former des biofilms calcifiés", isCorrect: false },
          { text: "Pseudomonas aeruginosa, par sa production de pigments alcalinisant les urines et provoquant des calculs", isCorrect: false }
        ],
        explanation: "Proteus mirabilis produit une uréase qui hydrolyse l'urée en ammoniac, alcalinisant les urines. Ce pH élevé favorise la précipitation de phosphate ammoniaco-magnésien (struvite), formant des calculs de corail."
      }
    ]
  },
  {
    title: "Surveillance épidémiologique — réseaux, signalement et alertes sanitaires",
    description: "Quiz sur les dispositifs de surveillance épidémiologique en France : réseaux sentinelles, système de signalement des maladies à déclaration obligatoire, gestion des alertes et organisation de la veille sanitaire.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 20,
    difficulty: "Intermédiaire",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quelle institution est en charge de la surveillance épidémiologique et de la veille sanitaire en France ?",
        options: [
          { text: "La Haute Autorité de Santé (HAS), autorité indépendante chargée de l'évaluation des soins en France", isCorrect: false },
          { text: "Santé publique France (SPF), agence nationale de santé publique chargée de la veille et surveillance", isCorrect: true },
          { text: "L'Agence nationale de sécurité du médicament (ANSM), chargée du contrôle des médicaments et vaccins", isCorrect: false },
          { text: "L'Agence régionale de santé (ARS), seule compétente pour la surveillance des maladies infectieuses", isCorrect: false }
        ],
        explanation: "Santé publique France (SPF) est l'agence nationale de santé publique créée en 2016. Elle est chargée de la surveillance épidémiologique, de la veille sanitaire, de la gestion des alertes et de l'information scientifique."
      },
      {
        text: "Qu'est-ce qu'une maladie à déclaration obligatoire (MDO) en France ?",
        options: [
          { text: "Toute maladie infectieuse grave nécessitant une hospitalisation immédiate et une prise en charge spécialisée", isCorrect: false },
          { text: "Maladie dont les cas doivent être signalés aux autorités sanitaires par les médecins et biologistes", isCorrect: true },
          { text: "Maladie professionnelle déclarée à la CPAM et à l'inspection du travail par le médecin du travail", isCorrect: false },
          { text: "Infection nosocomiale survenant à l'hôpital et devant être déclarée au CLIN et à la direction", isCorrect: false }
        ],
        explanation: "Les MDO sont des maladies dont les cas doivent être signalés obligatoirement aux autorités sanitaires (ARS, Santé publique France) par les médecins et biologistes. La liste comprend actuellement 35 maladies en France."
      },
      {
        text: "Quel est le rôle des médecins sentinelles du réseau Sentinelles dans la surveillance épidémiologique ?",
        options: [
          { text: "Déclarer obligatoirement toutes les maladies infectieuses diagnostiquées à leur ARS régionale", isCorrect: false },
          { text: "Réaliser des prélèvements microbiologiques systématiques chez tous les patients consultants febriles", isCorrect: false },
          { text: "Signaler en temps réel des syndromes cliniques sentinelles pour détecter précocement les épidémies", isCorrect: true },
          { text: "Effectuer des investigations épidémiologiques de terrain lors des foyers épidémiques identifiés", isCorrect: false }
        ],
        explanation: "Le réseau Sentinelles regroupe des médecins généralistes volontaires qui déclarent en temps réel des syndromes sentinelles (syndromes grippaux, diarrhées aiguës) permettant la détection précoce des épidémies saisonnières."
      },
      {
        text: "Quelle est la différence entre un signalement et une notification dans le cadre des MDO ?",
        options: [
          { text: "Le signalement est réservé au médecin, la notification est réalisée uniquement par le biologiste", isCorrect: false },
          { text: "Le signalement est une alerte immédiate à l'ARS, la notification est une transmission épidémiologique différée", isCorrect: true },
          { text: "Le signalement concerne les maladies bactériennes, la notification est réservée aux infections virales", isCorrect: false },
          { text: "Le signalement est anonyme, tandis que la notification comporte l'identité complète du patient", isCorrect: false }
        ],
        explanation: "Pour les MDO, le signalement est une alerte immédiate à l'ARS (par téléphone ou formulaire urgent) pour les maladies nécessitant une action rapide. La notification est la transmission standardisée de données épidémiologiques à SPF."
      },
      {
        text: "Citez deux exemples de maladies à déclaration obligatoire nécessitant un signalement urgent en France.",
        options: [
          { text: "La grippe saisonnière et la gastro-entérite aiguë, maladies fréquentes à impact collectif majeur", isCorrect: false },
          { text: "La méningite bactérienne et la tuberculose bacillifère, maladies graves nécessitant une action immédiate", isCorrect: true },
          { text: "La varicelle et la mononucléose infectieuse, infections virales à déclaration obligatoire prioritaire", isCorrect: false },
          { text: "La cystite récidivante et la bronchite chronique, infections fréquentes à fort impact sur les soins primaires", isCorrect: false }
        ],
        explanation: "La méningite bactérienne (nécessitant une chimioprophylaxie des contacts) et la tuberculose bacillifère (nécessitant une enquête autour du cas) font partie des MDO nécessitant un signalement urgent à l'ARS."
      },
      {
        text: "Quel organisme international coordonne la surveillance épidémiologique mondiale et gère les alertes sanitaires ?",
        options: [
          { text: "L'ECDC (Centre européen de prévention et contrôle des maladies), compétent uniquement pour l'Europe", isCorrect: false },
          { text: "L'Organisation mondiale de la santé (OMS), coordonnant la surveillance et les alertes sanitaires mondiales", isCorrect: true },
          { text: "L'UNICEF (Fonds des Nations Unies pour l'enfance), chargé des programmes de vaccination mondiaux", isCorrect: false },
          { text: "Le Centre européen de lutte contre les maladies (CELM), compétent pour toutes les alertes mondiales", isCorrect: false }
        ],
        explanation: "L'OMS coordonne la surveillance épidémiologique mondiale via le Règlement sanitaire international (RSI 2005). Elle déclare les Urgences de santé publique de portée internationale (USPPI) comme lors de la pandémie COVID-19."
      },
      {
        text: "Qu'est-ce qu'un cluster épidémique et comment est-il caractérisé dans la surveillance ?",
        options: [
          { text: "Apparition de cas isolés sporadiques sans lien temporel ou géographique dans une population donnée", isCorrect: false },
          { text: "Regroupement de cas plus élevé qu'attendu dans un lieu et une période donnés, suggérant une source commune", isCorrect: true },
          { text: "Toute épidémie affectant plus de 1 000 personnes dans une région sur une période de 30 jours consécutifs", isCorrect: false },
          { text: "Ensemble de cas liés uniquement par un agent pathogène commun identifié par typage moléculaire", isCorrect: false }
        ],
        explanation: "Un cluster épidémique est un regroupement de cas (plus élevé qu'attendu) dans un espace et une période délimités. Il peut indiquer une source commune (contamination alimentaire, hydrique) ou une transmission interhumaine active."
      },
      {
        text: "Quel est le principe du taux d'incidence utilisé en surveillance épidémiologique ?",
        options: [
          { text: "Nombre de cas existants (nouveaux + anciens) dans une population à un instant donné, exprimé pour 100 000 habitants", isCorrect: false },
          { text: "Nombre de nouveaux cas d'une maladie dans une population donnée pendant une période définie", isCorrect: true },
          { text: "Proportion de personnes immunisées dans une population après vaccination ou infection naturelle", isCorrect: false },
          { text: "Rapport entre le nombre de décès et le nombre total de cas confirmés d'une maladie sur une période", isCorrect: false }
        ],
        explanation: "Le taux d'incidence mesure le nombre de nouveaux cas survenant dans une population définie sur une période donnée (généralement exprimé pour 100 000 personnes-années). Il est distinct de la prévalence qui mesure tous les cas existants."
      }
    ]
  }
];
