// UE 2.1 - Biologie fondamentale — 20 quiz (chapitres 1-20) Semestre 1 IFSI
module.exports = [
  // ─── 1. Structure cellulaire ───────────────────────────────────────────────
  {
    "title": "Structure cellulaire — membrane, organites et noyau",
    "description": "Quiz sur la membrane plasmique, les organites cytoplasmiques et le noyau cellulaire, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Structure cellulaire — membrane plasmique, organites et noyau",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel modèle décrit la structure de la membrane plasmique ?",
        "options": [
          { "text": "Le modèle en mosaïque fluide de Singer et Nicolson", "isCorrect": true },
          { "text": "Le modèle en bicouche rigide de Danielli et Davson", "isCorrect": false },
          { "text": "Le modèle en tricouche lipidique de Robertson", "isCorrect": false },
          { "text": "Le modèle en réseau cristallin de Watson et Crick", "isCorrect": false }
        ],
        "explanation": "Le modèle en mosaïque fluide (1972) décrit la membrane comme une bicouche phospholipidique fluide dans laquelle des protéines intégrales et périphériques sont libres de se déplacer latéralement."
      },
      {
        "text": "Quelle est la composition principale de la bicouche lipidique membranaire ?",
        "options": [
          { "text": "Des glycoprotéines transmembranaires et du cholestérol", "isCorrect": false },
          { "text": "Des phospholipides à tête hydrophile et queues hydrophobes", "isCorrect": true },
          { "text": "Des triglycérides et des acides gras saturés libres", "isCorrect": false },
          { "text": "Des sphingomyélines et des lipoprotéines de haute densité", "isCorrect": false }
        ],
        "explanation": "La bicouche est formée de deux feuillets de phospholipides : leurs têtes polaires hydrophiles sont tournées vers les milieux aqueux (extérieur/cytoplasme) et leurs queues acyl hydrophobes se font face au centre."
      },
      {
        "text": "Quel organite est délimité par une double membrane et possède son propre ADN circulaire ?",
        "options": [
          { "text": "Le lysosome", "isCorrect": false },
          { "text": "L'appareil de Golgi", "isCorrect": false },
          { "text": "La mitochondrie", "isCorrect": true },
          { "text": "Le peroxysome", "isCorrect": false }
        ],
        "explanation": "La mitochondrie est entourée de deux membranes (externe et interne) et contient un génome circulaire propre, vestige de son ancêtre bactérien selon la théorie endosymbiotique."
      },
      {
        "text": "Quel organite assure la modification, le tri et l'expédition des protéines néosynthétisées ?",
        "options": [
          { "text": "Le réticulum endoplasmique lisse", "isCorrect": false },
          { "text": "L'appareil de Golgi", "isCorrect": true },
          { "text": "Le noyau cellulaire", "isCorrect": false },
          { "text": "Le centrosome", "isCorrect": false }
        ],
        "explanation": "L'appareil de Golgi reçoit les vésicules du réticulum endoplasmique rugueux, glycosyle et trie les protéines, puis les expédie vers leur destination (membrane, lysosome, sécrétion)."
      },
      {
        "text": "Quelle structure du noyau est responsable de la synthèse des ARN ribosomiques ?",
        "options": [
          { "text": "L'enveloppe nucléaire", "isCorrect": false },
          { "text": "La lamina nucléaire", "isCorrect": false },
          { "text": "Le nucléole", "isCorrect": true },
          { "text": "La chromatine hétérochromatinienne", "isCorrect": false }
        ],
        "explanation": "Le nucléole est une structure intranucléaire non membraneuse où se transcrivent les gènes d'ARNr et où s'assemblent les sous-unités ribosomiques avant leur export vers le cytoplasme."
      },
      {
        "text": "Par quel mécanisme les grosses molécules hydrosolubles entrent-elles dans la cellule sans dépense d'énergie ?",
        "options": [
          { "text": "Par diffusion facilitée via des protéines-canal ou des transporteurs", "isCorrect": true },
          { "text": "Par transport actif primaire couplé à l'hydrolyse d'ATP", "isCorrect": false },
          { "text": "Par endocytose médiée par un récepteur membranaire", "isCorrect": false },
          { "text": "Par osmose à travers la bicouche lipidique", "isCorrect": false }
        ],
        "explanation": "La diffusion facilitée permet le passage passif (selon le gradient) de molécules polaires ou chargées grâce à des protéines intrinsèques (canaux ou perméases), sans consommation d'ATP."
      },
      {
        "text": "Quel rôle jouent les lysosomes dans la cellule ?",
        "options": [
          { "text": "Synthétiser des lipides membranaires par estérification", "isCorrect": false },
          { "text": "Produire de l'ATP par phosphorylation au niveau du substrat", "isCorrect": false },
          { "text": "Dégrader les macromolécules et les organites usés par hydrolyse acide", "isCorrect": true },
          { "text": "Neutraliser les radicaux libres par catalase et peroxydase", "isCorrect": false }
        ],
        "explanation": "Les lysosomes contiennent plus de cinquante hydrolases acides actives à pH 4,5-5 ; ils dégradent protéines, lipides, glucides et acides nucléiques issus de l'endocytose ou de l'autophagie."
      },
      {
        "text": "Quelle protéine du cytosquelette forme les filaments intermédiaires des cellules épithéliales ?",
        "options": [
          { "text": "La tubuline alpha-bêta des microtubules", "isCorrect": false },
          { "text": "L'actine globulaire des microfilaments", "isCorrect": false },
          { "text": "La kératine des filaments intermédiaires épithéliaux", "isCorrect": true },
          { "text": "La myosine II des fibres de stress actomyosine", "isCorrect": false }
        ],
        "explanation": "Les kératines (types I et II) sont les protéines des filaments intermédiaires caractéristiques des cellules épithéliales ; elles confèrent une résistance mécanique aux contraintes de traction."
      }
    ]
  },

  // ─── 2. Division cellulaire ────────────────────────────────────────────────
  {
    "title": "Division cellulaire — mitose, méiose et cycle cellulaire",
    "description": "Quiz sur les phases du cycle cellulaire, les étapes de la mitose et de la méiose, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Division cellulaire — mitose, méiose et cycle cellulaire",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle phase du cycle cellulaire précède immédiatement la mitose ?",
        "options": [
          { "text": "La phase G1 (première croissance)", "isCorrect": false },
          { "text": "La phase S (synthèse de l'ADN)", "isCorrect": false },
          { "text": "La phase G2 (deuxième croissance)", "isCorrect": true },
          { "text": "La phase G0 (quiescence)", "isCorrect": false }
        ],
        "explanation": "La phase G2 suit la réplication de l'ADN (phase S) et précède la mitose (M) ; la cellule vérifie l'intégrité de son ADN dupliqué et prépare les structures nécessaires à la division."
      },
      {
        "text": "Lors de quelle phase de la mitose les chromatides-sœurs se séparent-elles ?",
        "options": [
          { "text": "Lors de la prophase", "isCorrect": false },
          { "text": "Lors de la métaphase", "isCorrect": false },
          { "text": "Lors de l'anaphase", "isCorrect": true },
          { "text": "Lors de la télophase", "isCorrect": false }
        ],
        "explanation": "À l'anaphase, les cohésines retenant les chromatides-sœurs sont clivées par la séparase, et les chromatides sont tirées vers les pôles opposés par les microtubules kinétochoriens."
      },
      {
        "text": "Combien de cellules haploïdes une méiose produit-elle à partir d'une cellule diploïde ?",
        "options": [
          { "text": "Deux cellules haploïdes identiques", "isCorrect": false },
          { "text": "Quatre cellules haploïdes génétiquement différentes", "isCorrect": true },
          { "text": "Deux cellules diploïdes génétiquement différentes", "isCorrect": false },
          { "text": "Quatre cellules diploïdes identiques à la cellule mère", "isCorrect": false }
        ],
        "explanation": "La méiose comprend deux divisions successives (méiose I et méiose II) produisant 4 cellules haploïdes (n), génétiquement diversifiées par le brassage interchromosomique et le crossing-over."
      },
      {
        "text": "Qu'est-ce que le crossing-over (enjambement) en méiose ?",
        "options": [
          { "text": "La séparation des chromosomes homologues en méiose II", "isCorrect": false },
          { "text": "L'échange réciproque de segments entre chromatides non-sœurs", "isCorrect": true },
          { "text": "La condensation maximale des chromosomes en prophase I", "isCorrect": false },
          { "text": "L'alignement des bivalents sur la plaque équatoriale I", "isCorrect": false }
        ],
        "explanation": "Le crossing-over est un échange réciproque de segments d'ADN entre chromatides non-sœurs de chromosomes homologues, survenant en prophase I lors de la synapse ; il génère de nouvelles combinaisons alléliques."
      },
      {
        "text": "Quel point de contrôle (checkpoint) surveille la fixation correcte des kinétochores aux microtubules ?",
        "options": [
          { "text": "Le point de contrôle G1/S (restriction point)", "isCorrect": false },
          { "text": "Le point de contrôle G2/M (dommages ADN)", "isCorrect": false },
          { "text": "Le point de contrôle de l'assemblage du fuseau (SAC)", "isCorrect": true },
          { "text": "Le point de contrôle de taille cellulaire (Start)", "isCorrect": false }
        ],
        "explanation": "Le SAC (Spindle Assembly Checkpoint) retarde l'anaphase tant que tous les kinétochores ne sont pas correctement attachés aux microtubules bipolaires, prévenant ainsi les erreurs de ségrégation chromosomique."
      },
      {
        "text": "Par quel processus le cytoplasme se divise-t-il à la fin de la mitose ?",
        "options": [
          { "text": "Par bourgeonnement asymétrique des membranes de Golgi", "isCorrect": false },
          { "text": "Par fragmentation nucléaire en deux enveloppes distinctes", "isCorrect": false },
          { "text": "Par cytodiérèse grâce à un anneau contractile d'actine-myosine", "isCorrect": true },
          { "text": "Par fusion de vésicules lipidiques sur la plaque équatoriale", "isCorrect": false }
        ],
        "explanation": "La cytodiérèse (ou cytokinèse) est réalisée par la constriction d'un anneau contractile composé d'actine F et de myosine II, localisé dans le plan équatorial et relié à la membrane plasmique."
      },
      {
        "text": "À quelle phase du cycle l'ADN est-il répliqué ?",
        "options": [
          { "text": "En phase G1, avant la croissance cellulaire", "isCorrect": false },
          { "text": "En phase S, par l'ADN polymérase", "isCorrect": true },
          { "text": "En phase G2, après la vérification des dommages", "isCorrect": false },
          { "text": "En phase M, simultanément à la condensation", "isCorrect": false }
        ],
        "explanation": "La réplication de l'ADN se déroule exclusivement en phase S (synthèse) ; chaque chromosome est dupliqué de façon semi-conservative, donnant deux chromatides-sœurs reliées au centromère."
      },
      {
        "text": "Quel est le rôle de la protéine p53 dans le cycle cellulaire ?",
        "options": [
          { "text": "Stimuler la progression vers la mitose en activant les CDK", "isCorrect": false },
          { "text": "Dégrader les cohésines pour permettre la séparation des chromatides", "isCorrect": false },
          { "text": "Activer l'arrêt du cycle et l'apoptose en cas de dommages ADN", "isCorrect": true },
          { "text": "Phosphoryler les histones pour décondenser la chromatine en S", "isCorrect": false }
        ],
        "explanation": "P53 est un facteur de transcription suppresseur de tumeur ; en réponse aux dommages de l'ADN, il induit l'expression de p21 (inhibiteur des CDK) arrêtant le cycle, et peut déclencher l'apoptose si les dommages sont irréparables."
      }
    ]
  },

  // ─── 3. ADN, ARN et synthèse des protéines ────────────────────────────────
  {
    "title": "ADN, ARN et synthèse des protéines",
    "description": "Quiz sur la transcription, la traduction et les différents types d'ARN, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "ADN, ARN et synthèse des protéines — transcription et traduction",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle enzyme synthétise l'ARN à partir du brin matrice d'ADN ?",
        "options": [
          { "text": "L'ADN polymérase III", "isCorrect": false },
          { "text": "La transcriptase inverse virale", "isCorrect": false },
          { "text": "L'ARN polymérase II (ARNpol II)", "isCorrect": true },
          { "text": "La primase ribonucléotidique", "isCorrect": false }
        ],
        "explanation": "Chez les eucaryotes, l'ARN polymérase II transcrit les gènes codant des protéines en ARN pré-messager (pré-ARNm) ; les ARN pol I et III synthétisent respectivement les ARNr et les ARNt/ARN5S."
      },
      {
        "text": "Qu'est-ce que l'épissage (splicing) de l'ARN pré-messager ?",
        "options": [
          { "text": "L'ajout d'une coiffe 7-méthylguanosine en 5'", "isCorrect": false },
          { "text": "L'élimination des introns et la jonction des exons", "isCorrect": true },
          { "text": "L'ajout d'une queue poly-A en 3' par la polymérase A", "isCorrect": false },
          { "text": "La méthylation des adénosines internes de l'ARNm", "isCorrect": false }
        ],
        "explanation": "L'épissage est réalisé par le splicéosome ; il excise précisément les introns non codants et ligature les exons, produisant un ARNm mature prêt à être traduit."
      },
      {
        "text": "Quel composant cellulaire lit l'ARNm et catalyse la formation des liaisons peptidiques ?",
        "options": [
          { "text": "Le splicéosome nucléaire", "isCorrect": false },
          { "text": "Le ribosome (sous-unités 40S et 60S)", "isCorrect": true },
          { "text": "Le protéasome 26S cytosolique", "isCorrect": false },
          { "text": "Le complexe d'initiation eIF2 seul", "isCorrect": false }
        ],
        "explanation": "Le ribosome eucaryote 80S (formé des sous-unités 40S et 60S) décode les codons de l'ARNm et catalyse la transpeptidation via son ARNr peptidyl-transférase 28S."
      },
      {
        "text": "Quel type d'ARN transporte les acides aminés jusqu'au ribosome lors de la traduction ?",
        "options": [
          { "text": "L'ARN ribosomique (ARNr 5,8S)", "isCorrect": false },
          { "text": "L'ARN messager (ARNm)", "isCorrect": false },
          { "text": "L'ARN de transfert (ARNt)", "isCorrect": true },
          { "text": "L'ARN nucléaire hétérogène (ARNhn)", "isCorrect": false }
        ],
        "explanation": "Chaque ARNt possède un anticodon complémentaire d'un codon de l'ARNm et transporte spécifiquement l'acide aminé correspondant ; les aminoacyl-ARNt synthétases assurent cette liaison."
      },
      {
        "text": "Quel codon de l'ARNm initie systématiquement la traduction ?",
        "options": [
          { "text": "UAA (codon stop ambre)", "isCorrect": false },
          { "text": "AUG (codon méthionine initiateur)", "isCorrect": true },
          { "text": "GUG (codon valine)", "isCorrect": false },
          { "text": "CAP (séquence Kozak consensus)", "isCorrect": false }
        ],
        "explanation": "Le codon AUG est le codon d'initiation universel codant la méthionine ; chez les eucaryotes, il est reconnu par le complexe ribosomal 43S associé à l'ARNt-Met initiateur."
      },
      {
        "text": "Qu'appelle-t-on le code génétique dégénéré ?",
        "options": [
          { "text": "Le fait que certains codons ne codent aucun acide aminé", "isCorrect": false },
          { "text": "Le fait qu'un même acide aminé peut être codé par plusieurs codons", "isCorrect": true },
          { "text": "Le fait que le code varie selon les organismes eucaryotes", "isCorrect": false },
          { "text": "Le fait que les introns contiennent des codons non traduits", "isCorrect": false }
        ],
        "explanation": "La dégénérescence du code signifie que la plupart des acides aminés sont codés par 2 à 6 codons synonymes (ex. Leu : 6 codons) ; la redondance porte surtout sur la troisième base du codon."
      },
      {
        "text": "Où se déroule la transcription chez les cellules eucaryotes ?",
        "options": [
          { "text": "Dans le cytoplasme au niveau des ribosomes libres", "isCorrect": false },
          { "text": "Dans le réticulum endoplasmique rugueux", "isCorrect": false },
          { "text": "Dans le noyau au niveau de la chromatine décondensée", "isCorrect": true },
          { "text": "Dans la mitochondrie pour tous les gènes nucléaires", "isCorrect": false }
        ],
        "explanation": "La transcription eucaryote se déroule dans le noyau ; l'ARNm pré-messager y est produit, modifié (coiffe, queue poly-A, épissage) puis exporté vers le cytoplasme pour la traduction."
      },
      {
        "text": "Qu'est-ce qu'un promoteur dans le contexte de la transcription ?",
        "options": [
          { "text": "Une protéine activatrice se fixant sur l'ARN polymérase", "isCorrect": false },
          { "text": "Une séquence d'ADN en amont du gène où se fixe l'ARN polymérase", "isCorrect": true },
          { "text": "Un codon particulier signalant la fin de la transcription", "isCorrect": false },
          { "text": "Un facteur d'épissage reconnaissant les sites donneurs d'intron", "isCorrect": false }
        ],
        "explanation": "Le promoteur est une séquence d'ADN localisée en amont (5') du gène, contenant notamment la boîte TATA ; il recrute les facteurs généraux de transcription et l'ARN polymérase II pour initier la transcription."
      }
    ]
  },

  // ─── 4. Génétique mendélienne ──────────────────────────────────────────────
  {
    "title": "Génétique mendélienne — lois de Mendel et hérédité autosomique",
    "description": "Quiz sur les lois de ségrégation et d'assortiment, la dominance et l'hérédité autosomique, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Génétique mendélienne — lois de Mendel et hérédité autosomique",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est la première loi de Mendel (loi de ségrégation) ?",
        "options": [
          { "text": "Les caractères parentaux se mélangent uniformément dans les hybrides", "isCorrect": false },
          { "text": "Chaque individu porte deux allèles qui se séparent lors de la gamétogenèse", "isCorrect": true },
          { "text": "Les gènes de caractères différents s'associent toujours de façon indépendante", "isCorrect": false },
          { "text": "Les caractères récessifs disparaissent définitivement en F1", "isCorrect": false }
        ],
        "explanation": "La loi de ségrégation stipule que les deux allèles d'un locus se séparent lors de la méiose et qu'un seul allèle est transmis à chaque gamète, puis aux descendants."
      },
      {
        "text": "Lors d'un croisement Aa × Aa, quelle est la proportion attendue de phénotype dominant en F2 ?",
        "options": [
          { "text": "1/4 des descendants", "isCorrect": false },
          { "text": "1/2 des descendants", "isCorrect": false },
          { "text": "3/4 des descendants", "isCorrect": true },
          { "text": "La totalité des descendants", "isCorrect": false }
        ],
        "explanation": "Du croisement Aa × Aa résulte : 1 AA : 2 Aa : 1 aa. Les génotypes AA et Aa expriment le phénotype dominant, soit 3/4 des descendants ; seul aa (1/4) exprime le phénotype récessif."
      },
      {
        "text": "Qu'appelle-t-on la codominance entre deux allèles ?",
        "options": [
          { "text": "L'expression d'un phénotype intermédiaire chez l'hétérozygote", "isCorrect": false },
          { "text": "L'expression simultanée des deux allèles chez l'hétérozygote", "isCorrect": true },
          { "text": "La suppression du phénotype récessif par l'allèle dominant", "isCorrect": false },
          { "text": "L'absence d'expression génique chez les deux homozygotes", "isCorrect": false }
        ],
        "explanation": "La codominance se produit quand les deux allèles s'expriment simultanément et indépendamment chez l'hétérozygote, comme les antigènes A et B du groupe sanguin AB (génotype IAiBIB)."
      },
      {
        "text": "Un individu de génotype AaBb croisé avec aabb : quelle proportion de descendants sera aabb ?",
        "options": [
          { "text": "1/2 des descendants", "isCorrect": false },
          { "text": "1/4 des descendants", "isCorrect": true },
          { "text": "3/4 des descendants", "isCorrect": false },
          { "text": "1/8 des descendants", "isCorrect": false }
        ],
        "explanation": "AaBb produit 4 gamètes équiprobables (AB, Ab, aB, ab) ; aabb ne produit que ab. La combinaison ab × ab = 1/4 des descendants sera aabb (récessif pour les deux loci)."
      },
      {
        "text": "Qu'est-ce que la deuxième loi de Mendel (loi d'assortiment indépendant) ?",
        "options": [
          { "text": "Les allèles d'un même locus se séparent lors de la méiose I", "isCorrect": false },
          { "text": "Les allèles de loci différents se distribuent indépendamment dans les gamètes", "isCorrect": true },
          { "text": "Les caractères acquis par les parents se transmettent aux descendants", "isCorrect": false },
          { "text": "La fréquence des recombinaisons dépend de la distance entre gènes liés", "isCorrect": false }
        ],
        "explanation": "La deuxième loi de Mendel affirme que les allèles de gènes situés sur des chromosomes différents (non liés) se ségrègent indépendamment lors de la méiose, générant toutes les combinaisons possibles."
      },
      {
        "text": "Quel phénomène explique que deux gènes situés sur le même chromosome ne suivent pas toujours la loi d'assortiment indépendant ?",
        "options": [
          { "text": "La non-disjonction chromosomique en méiose I", "isCorrect": false },
          { "text": "La liaison génétique (linkage) et la recombinaison", "isCorrect": true },
          { "text": "L'épistasie entre allèles de loci différents", "isCorrect": false },
          { "text": "La pléiotropie d'un seul gène sur plusieurs caractères", "isCorrect": false }
        ],
        "explanation": "Des gènes liés sur le même chromosome tendent à être transmis ensemble ; la recombinaison (crossing-over) peut les dissocier avec une fréquence proportionnelle à la distance génétique (cM)."
      },
      {
        "text": "Quel type d'hérédité caractérise une maladie autosomique récessive ?",
        "options": [
          { "text": "Transmission uniquement par les mères, à tous les fils", "isCorrect": false },
          { "text": "Transmission par les deux sexes, expression si deux allèles mutés", "isCorrect": true },
          { "text": "Transmission par le père uniquement à toutes les filles", "isCorrect": false },
          { "text": "Expression chez tous les hétérozygotes porteurs sains", "isCorrect": false }
        ],
        "explanation": "Une maladie autosomique récessive touche hommes et femmes également ; elle s'exprime seulement chez les homozygotes (aa) ; les hétérozygotes (Aa) sont porteurs sains et ne la manifestent pas."
      },
      {
        "text": "Qu'est-ce qu'un locus dans le contexte de la génétique ?",
        "options": [
          { "text": "La version alternative d'un gène sur un chromosome homologue", "isCorrect": false },
          { "text": "La position précise d'un gène sur un chromosome donné", "isCorrect": true },
          { "text": "L'ensemble des gènes exprimés dans un tissu particulier", "isCorrect": false },
          { "text": "Le segment non codant séparant deux gènes sur un chromosome", "isCorrect": false }
        ],
        "explanation": "Le locus désigne la position fixe d'un gène sur un chromosome ; des chromosomes homologues portent le même locus pour un gène donné, pouvant avoir des allèles identiques ou différents."
      }
    ]
  },

  // ─── 5. Génétique clinique ─────────────────────────────────────────────────
  {
    "title": "Génétique clinique — mutations, maladies héréditaires et conseil",
    "description": "Quiz sur les types de mutations, les grandes maladies génétiques et les bases du conseil génétique, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Génétique clinique — mutations, maladies héréditaires et conseil génétique",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle mutation consiste en le remplacement d'une seule paire de bases dans la séquence d'ADN ?",
        "options": [
          { "text": "Une mutation par délétion d'un nucléotide", "isCorrect": false },
          { "text": "Une mutation ponctuelle (substitution de base)", "isCorrect": true },
          { "text": "Une mutation par insertion de plusieurs nucléotides", "isCorrect": false },
          { "text": "Une mutation par inversion d'un segment chromosomique", "isCorrect": false }
        ],
        "explanation": "Une mutation ponctuelle est la substitution d'une paire de bases par une autre ; selon sa position, elle peut être synonyme (silencieuse), faux-sens (changement d'acide aminé) ou non-sens (codon stop prématuré)."
      },
      {
        "text": "La mucoviscidose (fibrose kystique) est une maladie autosomique récessive due à une mutation du gène :",
        "options": [
          { "text": "BRCA1 sur le chromosome 17", "isCorrect": false },
          { "text": "CFTR sur le chromosome 7", "isCorrect": true },
          { "text": "HTT sur le chromosome 4", "isCorrect": false },
          { "text": "PKD1 sur le chromosome 16", "isCorrect": false }
        ],
        "explanation": "La mucoviscidose résulte de mutations du gène CFTR (Cystic Fibrosis Transmembrane conductance Regulator) situé en 7q31.2 ; la délétion ΔF508 est la plus fréquente, altérant le transport du chlore."
      },
      {
        "text": "Qu'est-ce qu'une trisomie ?",
        "options": [
          { "text": "La présence d'un chromosome en moins dans une cellule haploïde", "isCorrect": false },
          { "text": "La présence d'un chromosome surnuméraire (2n+1) dans une cellule", "isCorrect": true },
          { "text": "La duplication d'un segment sur un seul chromosome homologue", "isCorrect": false },
          { "text": "La translocation équilibrée entre deux chromosomes non homologues", "isCorrect": false }
        ],
        "explanation": "Une trisomie correspond à la présence de 3 exemplaires d'un chromosome au lieu de 2 (2n+1 = 47 chez l'humain) ; la trisomie 21 (syndrome de Down) est la plus fréquente en clinique."
      },
      {
        "text": "Quelle est la cause chromosomique du syndrome de Turner ?",
        "options": [
          { "text": "Caryotype 47,XXY (trisomie des gonosomes)", "isCorrect": false },
          { "text": "Caryotype 47,XYY (disomie Y surnuméraire)", "isCorrect": false },
          { "text": "Caryotype 45,X0 (monosomie du chromosome X)", "isCorrect": true },
          { "text": "Caryotype 46,XX avec délétion du bras court du X", "isCorrect": false }
        ],
        "explanation": "Le syndrome de Turner (45,X0) est dû à la monosomie du chromosome X ; il affecte les femmes avec petite taille, gonades dysfonctionnelles, aménorrhée primaire et parfois malformations cardiaques."
      },
      {
        "text": "Qu'est-ce qu'une mutation de novo dans le contexte de génétique médicale ?",
        "options": [
          { "text": "Une mutation héritée de deux parents porteurs sains", "isCorrect": false },
          { "text": "Une mutation apparaissant pour la première fois chez un individu sans antécédents familiaux", "isCorrect": true },
          { "text": "Une mutation causée par l'exposition à un agent mutagène connu", "isCorrect": false },
          { "text": "Une mutation réversible retournant à l'allèle sauvage", "isCorrect": false }
        ],
        "explanation": "Une mutation de novo n'est présente ni chez le père ni chez la mère ; elle survient lors de la gamétogenèse ou aux premiers stades du développement embryonnaire et est transmissible aux générations suivantes."
      },
      {
        "text": "Quel mode de transmission caractérise la maladie de Huntington ?",
        "options": [
          { "text": "Autosomique récessive à pénétrance variable", "isCorrect": false },
          { "text": "Autosomique dominante à pénétrance complète", "isCorrect": true },
          { "text": "Liée au chromosome X récessive", "isCorrect": false },
          { "text": "Mitochondriale à transmission maternelle exclusive", "isCorrect": false }
        ],
        "explanation": "La maladie de Huntington est autosomique dominante ; un seul allèle muté (expansion de triplets CAG sur HTT) suffit pour déclencher la maladie ; tous les porteurs développeront la maladie (pénétrance complète)."
      },
      {
        "text": "Quel examen prénatal permet l'analyse directe du caryotype fœtal ?",
        "options": [
          { "text": "L'échographie morphologique du premier trimestre", "isCorrect": false },
          { "text": "Le dosage des marqueurs sériques maternels (triple test)", "isCorrect": false },
          { "text": "L'amniocentèse ou la biopsie de trophoblaste (CVS)", "isCorrect": true },
          { "text": "L'IRM fœtale en coupes axiales", "isCorrect": false }
        ],
        "explanation": "L'amniocentèse (prélèvement de liquide amniotique) ou la biopsie de trophoblaste permettent d'obtenir des cellules fœtales pour réaliser un caryotype ou une analyse moléculaire directe du génome fœtal."
      },
      {
        "text": "Qu'appelle-t-on la pénétrance d'un gène pathologique ?",
        "options": [
          { "text": "La gravité des symptômes chez les individus atteints", "isCorrect": false },
          { "text": "La proportion de porteurs du génotype qui expriment le phénotype", "isCorrect": true },
          { "text": "La fréquence de l'allèle morbide dans la population générale", "isCorrect": false },
          { "text": "Le nombre de gènes modifiant l'expression du gène principal", "isCorrect": false }
        ],
        "explanation": "La pénétrance est la proportion d'individus portant le génotype causal qui manifestent effectivement le phénotype ; une pénétrance incomplète signifie que certains porteurs restent asymptomatiques."
      }
    ]
  },

  // ─── 6. Système osseux ────────────────────────────────────────────────────
  {
    "title": "Système osseux — histologie, remodelage et minéralisation",
    "description": "Quiz sur l'histologie du tissu osseux, les cellules osseuses et le processus de remodelage, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système osseux — histologie osseuse, remodelage et minéralisation",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel type cellulaire est responsable de la synthèse et de la minéralisation de la matrice osseuse ?",
        "options": [
          { "text": "L'ostéoclaste multinucléé", "isCorrect": false },
          { "text": "L'ostéocyte dans sa lacune", "isCorrect": false },
          { "text": "L'ostéoblaste mononucléé actif", "isCorrect": true },
          { "text": "Le chondroblaste du cartilage hyalin", "isCorrect": false }
        ],
        "explanation": "L'ostéoblaste synthétise la matrice organique osseuse (ostéoïde) riche en collagène I, puis la minéralise en y déposant des cristaux d'hydroxyapatite ; l'ostéoblaste inclus dans la matrice devient ostéocyte."
      },
      {
        "text": "Quel sel minéral constitue la phase inorganique principale de l'os ?",
        "options": [
          { "text": "Le phosphate de magnésium (Mg₃(PO₄)₂)", "isCorrect": false },
          { "text": "Le carbonate de calcium (CaCO₃)", "isCorrect": false },
          { "text": "L'hydroxyapatite Ca₁₀(PO₄)₆(OH)₂", "isCorrect": true },
          { "text": "Le fluorapatite Ca₅(PO₄)₃F", "isCorrect": false }
        ],
        "explanation": "L'hydroxyapatite représente environ 65 % de la masse osseuse sèche ; ses cristaux hexagonaux se déposent entre et sur les fibrilles de collagène I, conférant rigidité et résistance à la compression."
      },
      {
        "text": "Quel type de tissu osseux présente une architecture lamellaire avec des ostéons (systèmes de Havers) ?",
        "options": [
          { "text": "L'os spongieux (trabéculaire)", "isCorrect": false },
          { "text": "L'os compact (cortical)", "isCorrect": true },
          { "text": "Le cartilage calcifié épiphysaire", "isCorrect": false },
          { "text": "L'os tressé primaire fœtal", "isCorrect": false }
        ],
        "explanation": "L'os compact est formé d'ostéons concentriques (systèmes de Havers) : lamelles osseuses entourant le canal de Havers contenant vaisseaux et nerfs ; il constitue les diaphyses des os longs."
      },
      {
        "text": "Quelle hormone favorise la résorption osseuse par les ostéoclastes ?",
        "options": [
          { "text": "La calcitonine thyroïdienne", "isCorrect": false },
          { "text": "La parathormone (PTH) parathyroïdienne", "isCorrect": true },
          { "text": "L'ostéocalcine osseuse", "isCorrect": false },
          { "text": "L'hormone de croissance hypophysaire", "isCorrect": false }
        ],
        "explanation": "La PTH stimule indirectement les ostéoclastes (via RANKL produit par les ostéoblastes), augmentant la résorption osseuse et libérant du calcium dans le sang pour normaliser la calcémie."
      },
      {
        "text": "Quel rôle joue la vitamine D dans la minéralisation osseuse ?",
        "options": [
          { "text": "Inhiber la PTH pour bloquer la résorption osseuse", "isCorrect": false },
          { "text": "Activer les ostéoclastes pour libérer le calcium osseux", "isCorrect": false },
          { "text": "Favoriser l'absorption intestinale du calcium et du phosphore", "isCorrect": true },
          { "text": "Synthétiser directement l'hydroxyapatite dans la matrice", "isCorrect": false }
        ],
        "explanation": "La forme active de la vitamine D (1,25-dihydroxycholécalciférol ou calcitriol) stimule l'absorption intestinale du calcium et du phosphore, maintenant les concentrations sériques nécessaires à la minéralisation."
      },
      {
        "text": "Qu'est-ce que l'ostéoporose sur le plan histologique ?",
        "options": [
          { "text": "Un défaut de minéralisation de la matrice osseuse ostéoïde", "isCorrect": false },
          { "text": "Une infection bactérienne de la moelle osseuse rouge", "isCorrect": false },
          { "text": "Une réduction de la masse osseuse par déséquilibre formation/résorption", "isCorrect": true },
          { "text": "Une nécrobiose avasculaire de la tête fémorale", "isCorrect": false }
        ],
        "explanation": "L'ostéoporose est caractérisée par une diminution de la densité minérale osseuse et une détérioration microarchitecturale due à un déséquilibre entre la formation (ostéoblastes) et la résorption (ostéoclastes)."
      },
      {
        "text": "Dans quel type d'os la moelle rouge hématopoïétique est-elle principalement localisée chez l'adulte ?",
        "options": [
          { "text": "Dans les diaphyses des os longs", "isCorrect": false },
          { "text": "Dans la couche superficielle du périoste", "isCorrect": false },
          { "text": "Dans les travées de l'os spongieux des os plats et épiphyses", "isCorrect": true },
          { "text": "Dans le cartilage articulaire des grandes articulations", "isCorrect": false }
        ],
        "explanation": "Chez l'adulte, la moelle osseuse rouge (hématopoïétique) réside dans l'os spongieux des os plats (sternum, côtes, os iliaques) et des épiphyses des os longs ; les diaphyses contiennent de la moelle jaune adipeuse."
      },
      {
        "text": "Quel processus explique la cicatrisation d'une fracture osseuse ?",
        "options": [
          { "text": "La prolifération des ostéoclastes et la résorption du callus", "isCorrect": false },
          { "text": "La migration de chondrocytes puis d'ostéoblastes pour former le cal osseux", "isCorrect": true },
          { "text": "La régénération directe par les cellules endothéliales vasculaires", "isCorrect": false },
          { "text": "La fusion des extrémités fracturées par des ostéocytes activés", "isCorrect": false }
        ],
        "explanation": "La consolidation fracturaire passe par un cal cartilagineux (fibrocartilage puis cartilage hyalin), minéralisé et remodelé par les ostéoblastes en os lamellaire définitif grâce à la vascularisation."
      }
    ]
  },

  // ─── 7. Système musculaire ────────────────────────────────────────────────
  {
    "title": "Système musculaire — structure et contraction musculaire",
    "description": "Quiz sur l'ultrastructure du sarcomère, le couplage excitation-contraction et les types de fibres musculaires, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système musculaire — structure et mécanisme de contraction musculaire",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est l'unité fonctionnelle de base du muscle strié squelettique ?",
        "options": [
          { "text": "La myofibrille entière", "isCorrect": false },
          { "text": "Le sarcomère, délimité par deux stries Z", "isCorrect": true },
          { "text": "La bande A contenant les filaments épais", "isCorrect": false },
          { "text": "La ligne M centrale", "isCorrect": false }
        ],
        "explanation": "Le sarcomère est l'unité contractile répétitive d'une myofibrille, s'étendant d'une strie Z à l'autre ; il contient des filaments épais de myosine II et des filaments fins d'actine F."
      },
      {
        "text": "Quel ion intracellulaire déclenche la contraction musculaire en se liant à la troponine C ?",
        "options": [
          { "text": "Le sodium (Na⁺) entrant lors du potentiel d'action", "isCorrect": false },
          { "text": "Le potassium (K⁺) sortant à la repolarisation", "isCorrect": false },
          { "text": "Le calcium (Ca²⁺) libéré par le réticulum sarcoplasmique", "isCorrect": true },
          { "text": "Le magnésium (Mg²⁺) cofacteur de l'ATPase myosinique", "isCorrect": false }
        ],
        "explanation": "La libération de Ca²⁺ par le réticulum sarcoplasmique (via les récepteurs RyR1) augmente la concentration cytosolique de 0,1 μM à 10 μM ; le Ca²⁺ se lie à la troponine C, démasquant les sites de liaison de la myosine sur l'actine."
      },
      {
        "text": "Quel est le rôle de l'ATP dans le cycle des ponts d'union (cross-bridge) ?",
        "options": [
          { "text": "Stabiliser la liaison actine-myosine pour maintenir la contraction", "isCorrect": false },
          { "text": "Déclencher la libération de calcium par le réticulum sarcoplasmique", "isCorrect": false },
          { "text": "Détacher la tête de myosine de l'actine et réarmer la tête", "isCorrect": true },
          { "text": "Activer la troponine I pour inhiber le complexe troponine-tropomyosine", "isCorrect": false }
        ],
        "explanation": "L'ATP se fixe sur la tête de myosine déjà liée à l'actine, provoquant le détachement. L'hydrolyse d'ATP en ADP+Pi réarme la tête en position haute-énergie, prête à se lier à un nouveau site d'actine."
      },
      {
        "text": "Quelle structure assure la transmission de l'influx nerveux de la membrane plasmique au réticulum sarcoplasmique ?",
        "options": [
          { "text": "Les jonctions communicantes (gap junctions) entre fibres", "isCorrect": false },
          { "text": "Les tubules T (transverses) et la triade sarcoplasmique", "isCorrect": true },
          { "text": "Les plaques motrices et les vésicules synaptiques", "isCorrect": false },
          { "text": "Les filaments de titine reliant myosine et strie Z", "isCorrect": false }
        ],
        "explanation": "Les tubules T (invaginations de la membrane plasmique) transmettent le potentiel d'action vers l'intérieur de la fibre ; à la triade, ils couplent aux citernes terminales du réticulum sarcoplasmique via les dihydropyridine récepteurs (DHPR) et RyR1."
      },
      {
        "text": "Quel type de fibres musculaires est riche en mitochondries et résistant à la fatigue ?",
        "options": [
          { "text": "Les fibres de type IIx (rapides glycolytiques)", "isCorrect": false },
          { "text": "Les fibres de type IIa (rapides oxydatives)", "isCorrect": false },
          { "text": "Les fibres de type I (lentes oxydatives)", "isCorrect": true },
          { "text": "Les fibres de type IIb (rapides glycolytiques pures)", "isCorrect": false }
        ],
        "explanation": "Les fibres de type I (rouges, lentes) ont une densité mitochondriale élevée, un métabolisme oxydatif aérobie et une myosine ATPase lente ; elles sont adaptées aux efforts prolongés et résistent à la fatigue."
      },
      {
        "text": "Quelle est la cause de la rigidité cadavérique (rigor mortis) ?",
        "options": [
          { "text": "La contraction active des fibres par libération de Ca²⁺ post-mortem", "isCorrect": false },
          { "text": "L'épuisement de l'ATP empêchant le détachement actine-myosine", "isCorrect": true },
          { "text": "La déshydratation des myofibrilles après l'arrêt de la circulation", "isCorrect": false },
          { "text": "La dénaturation de la tropomyosine par refroidissement du corps", "isCorrect": false }
        ],
        "explanation": "En l'absence d'ATP post-mortem, les têtes de myosine ne peuvent se détacher de l'actine, créant des ponts d'union permanents et une rigidité musculaire ; la rigidité se lève quand les protéines commencent à se dégrader."
      },
      {
        "text": "Quel neurotransmetteur est libéré à la jonction neuromusculaire pour déclencher la contraction ?",
        "options": [
          { "text": "La noradrénaline des terminaisons sympathiques", "isCorrect": false },
          { "text": "La sérotonine des neurones moteurs spinaux", "isCorrect": false },
          { "text": "L'acétylcholine des motoneurones alpha", "isCorrect": true },
          { "text": "La dopamine des neurones dopaminergiques nigraux", "isCorrect": false }
        ],
        "explanation": "L'acétylcholine (ACh) libérée par les terminaisons des motoneurones alpha se fixe sur les récepteurs nicotiniques (RnAChR) de la plaque motrice, déclenchant un potentiel d'action musculaire."
      },
      {
        "text": "Quelle protéine sarcomérique élastique s'étend du sarcomère à la strie Z et contribue au retour passif de la fibre ?",
        "options": [
          { "text": "La nébuline stabilisant les filaments fins", "isCorrect": false },
          { "text": "La desmine reliant les myofibrilles entre elles", "isCorrect": false },
          { "text": "La titine (connectine) reliant la myosine à la strie Z", "isCorrect": true },
          { "text": "La dystrophine ancrant l'actine à la membrane", "isCorrect": false }
        ],
        "explanation": "La titine est la plus grande protéine connue ; elle relie la ligne M à la strie Z en passant par la zone de la myosine, agissant comme ressort moléculaire qui restaure la longueur de repos après l'étirement du sarcomère."
      }
    ]
  },

  // ─── 8. Anatomie cardiovasculaire ─────────────────────────────────────────
  {
    "title": "Anatomie cardiovasculaire — cœur, artères et veines",
    "description": "Quiz sur la structure du cœur, les cavités cardiaques, les valves et les principaux vaisseaux, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Anatomie cardiovasculaire — cœur, artères et veines principaux",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Dans quelle cavité cardiaque le sang veineux systémique arrive-t-il en premier ?",
        "options": [
          { "text": "Le ventricule droit", "isCorrect": false },
          { "text": "L'oreillette gauche", "isCorrect": false },
          { "text": "L'oreillette droite", "isCorrect": true },
          { "text": "Le ventricule gauche", "isCorrect": false }
        ],
        "explanation": "L'oreillette droite reçoit le sang désoxygéné provenant des veines caves supérieure et inférieure ainsi que du sinus coronaire, avant de l'envoyer vers le ventricule droit."
      },
      {
        "text": "Quelle valve sépare le ventricule droit de l'artère pulmonaire ?",
        "options": [
          { "text": "La valve mitrale (bicuspide)", "isCorrect": false },
          { "text": "La valve aortique (sigmoïde aortique)", "isCorrect": false },
          { "text": "La valve pulmonaire (sigmoïde pulmonaire)", "isCorrect": true },
          { "text": "La valve tricuspide", "isCorrect": false }
        ],
        "explanation": "La valve pulmonaire (semi-lunaire) est positionnée à la sortie du ventricule droit, à l'entrée du tronc pulmonaire ; elle s'ouvre lors de la systole ventriculaire droite et empêche le reflux en diastole."
      },
      {
        "text": "Quelle artère naît directement du ventricule gauche pour distribuer le sang oxygéné au corps ?",
        "options": [
          { "text": "Le tronc pulmonaire", "isCorrect": false },
          { "text": "L'artère carotide commune gauche", "isCorrect": false },
          { "text": "L'aorte ascendante", "isCorrect": true },
          { "text": "L'artère subclavière gauche", "isCorrect": false }
        ],
        "explanation": "L'aorte ascendante naît du ventricule gauche ; elle se prolonge par la crosse aortique donnant le tronc brachio-céphalique, la carotide commune gauche et la subclavière gauche, puis par l'aorte descendante."
      },
      {
        "text": "Par quel vaisseau le sang oxygéné revient-il des poumons vers le cœur ?",
        "options": [
          { "text": "Les veines caves supérieure et inférieure", "isCorrect": false },
          { "text": "Les veines pulmonaires (4 veines)", "isCorrect": true },
          { "text": "Le tronc pulmonaire et ses deux branches", "isCorrect": false },
          { "text": "Les veines bronchiques systémiques", "isCorrect": false }
        ],
        "explanation": "Quatre veines pulmonaires (deux droites, deux gauches) ramènent le sang oxygéné des poumons vers l'oreillette gauche, terminant ainsi la petite circulation (circulation pulmonaire)."
      },
      {
        "text": "Quelle est la différence structurale principale entre une artère et une veine ?",
        "options": [
          { "text": "Les veines n'ont pas d'endothélium, contrairement aux artères", "isCorrect": false },
          { "text": "Les artères ont une paroi plus épaisse et plus musculaire que les veines", "isCorrect": true },
          { "text": "Les artères possèdent des valvules anti-reflux, pas les veines", "isCorrect": false },
          { "text": "Les veines sont uniquement situées en superficie, les artères en profondeur", "isCorrect": false }
        ],
        "explanation": "Les artères supportent une pression élevée (systolique) et possèdent une tunique média riche en cellules musculaires lisses et en fibres élastiques, beaucoup plus développée que celle des veines."
      },
      {
        "text": "Quel nœud génère l'influx électrique initiateur du cycle cardiaque ?",
        "options": [
          { "text": "Le nœud auriculo-ventriculaire (nœud AV)", "isCorrect": false },
          { "text": "Le faisceau de His dans le septum", "isCorrect": false },
          { "text": "Le nœud sinusal (nœud SA) dans l'oreillette droite", "isCorrect": true },
          { "text": "Les fibres de Purkinje dans le myocarde ventriculaire", "isCorrect": false }
        ],
        "explanation": "Le nœud sinusal (nœud sino-auriculaire) est le pacemaker naturel du cœur ; il génère spontanément environ 60-100 impulsions par minute et déclenche chaque cycle cardiaque."
      },
      {
        "text": "Quelle artère coronaire vascularise principalement la paroi antérieure du ventricule gauche ?",
        "options": [
          { "text": "L'artère coronaire droite (ACD)", "isCorrect": false },
          { "text": "L'artère circonflexe (branche de la coronaire gauche)", "isCorrect": false },
          { "text": "L'artère interventriculaire antérieure (IVA)", "isCorrect": true },
          { "text": "L'artère marginale droite (ramus marginalis)", "isCorrect": false }
        ],
        "explanation": "L'IVA (ou artère descendante antérieure gauche — LAD) naît de la coronaire gauche et descend dans le sillon interventriculaire antérieur ; elle vascularise la paroi antérieure du VG, le septum et l'apex."
      },
      {
        "text": "Qu'est-ce que la diastole dans le cycle cardiaque ?",
        "options": [
          { "text": "La contraction simultanée des oreillettes et des ventricules", "isCorrect": false },
          { "text": "L'éjection du sang des ventricules vers les grandes artères", "isCorrect": false },
          { "text": "La période de relaxation et de remplissage des cavités cardiaques", "isCorrect": true },
          { "text": "La fermeture des valves sigmoïdes à la fin de la contraction", "isCorrect": false }
        ],
        "explanation": "La diastole est la phase de relaxation du myocarde ventriculaire ; les valves auriculo-ventriculaires s'ouvrent, permettant le remplissage passif puis actif (contraction auriculaire) des ventricules."
      }
    ]
  },

  // ─── 9. Anatomie respiratoire ──────────────────────────────────────────────
  {
    "title": "Anatomie respiratoire — voies aériennes supérieures et inférieures",
    "description": "Quiz sur les structures des voies aériennes, les poumons et la mécanique ventilatoire, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Anatomie respiratoire — voies aériennes supérieures et inférieures",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle structure cartilagineuse empêche les aliments de pénétrer dans la trachée lors de la déglutition ?",
        "options": [
          { "text": "Le cartilage thyroïde", "isCorrect": false },
          { "text": "L'épiglotte", "isCorrect": true },
          { "text": "Les cordes vocales", "isCorrect": false },
          { "text": "Le cartilage cricoïde", "isCorrect": false }
        ],
        "explanation": "L'épiglotte est un cartilage élastique en forme de feuille qui bascule vers l'arrière lors de la déglutition pour obstruer l'entrée laryngée, dirigeant les aliments vers l'œsophage."
      },
      {
        "text": "Combien de lobes possède le poumon droit chez l'adulte ?",
        "options": [
          { "text": "Deux lobes (supérieur et inférieur)", "isCorrect": false },
          { "text": "Trois lobes (supérieur, moyen et inférieur)", "isCorrect": true },
          { "text": "Quatre lobes séparés par trois scissures", "isCorrect": false },
          { "text": "Un seul lobe sans subdivision scissurale", "isCorrect": false }
        ],
        "explanation": "Le poumon droit est divisé en trois lobes (supérieur, moyen, inférieur) par les scissures horizontale et oblique ; le poumon gauche n'en a que deux (supérieur et inférieur)."
      },
      {
        "text": "À quel niveau anatomique la trachée se divise-t-elle en deux bronches souches ?",
        "options": [
          { "text": "Au niveau de l'angle de Louis (manubrio-sternal)", "isCorrect": false },
          { "text": "À la carène, au niveau de T4-T5", "isCorrect": true },
          { "text": "À l'angle de His entre œsophage et cardia", "isCorrect": false },
          { "text": "Au niveau du cartilage cricoïde en C6", "isCorrect": false }
        ],
        "explanation": "La bifurcation trachéale (carène) se situe vers T4-T5 (angle sternal de Louis) ; la bronche souche droite est plus verticale et courte (risque plus élevé d'inhalation de corps étrangers à droite)."
      },
      {
        "text": "Quel type de cellule produit le surfactant pulmonaire ?",
        "options": [
          { "text": "Les cellules de Clara (cellules Club)", "isCorrect": false },
          { "text": "Les pneumocytes de type I", "isCorrect": false },
          { "text": "Les pneumocytes de type II", "isCorrect": true },
          { "text": "Les cellules mast (mastocytes) alvéolaires", "isCorrect": false }
        ],
        "explanation": "Les pneumocytes de type II (cellules granuleuses) sécrètent le surfactant (dipalmitoylphosphatidylcholine + protéines SP-A, SP-B, SP-C, SP-D) qui réduit la tension de surface alvéolaire et prévient le collapsus."
      },
      {
        "text": "Qu'est-ce que l'espace mort anatomique dans la ventilation ?",
        "options": [
          { "text": "La partie des alvéoles non vascularisée sans échanges gazeux", "isCorrect": false },
          { "text": "Le volume des voies conductives non impliquées dans les échanges", "isCorrect": true },
          { "text": "Le volume résiduel restant après une expiration forcée maximale", "isCorrect": false },
          { "text": "La zone de transition entre bronchioles terminales et respiratoires", "isCorrect": false }
        ],
        "explanation": "L'espace mort anatomique (~150 mL) correspond aux voies aériennes conductrices (nez, pharynx, larynx, trachée, bronches, bronchioles terminales) qui ne participent pas aux échanges gazeux."
      },
      {
        "text": "Quel muscle est le principal moteur de l'inspiration calme ?",
        "options": [
          { "text": "Le muscle sterno-cléido-mastoïdien", "isCorrect": false },
          { "text": "Les muscles intercostaux internes", "isCorrect": false },
          { "text": "Le diaphragme", "isCorrect": true },
          { "text": "Les muscles scalènes", "isCorrect": false }
        ],
        "explanation": "Le diaphragme fournit environ 70 % de l'effort inspiratoire au repos ; sa contraction l'aplatit, augmente le volume thoracique et crée une pression subatmosphérique qui provoque l'entrée d'air."
      },
      {
        "text": "Quelle structure anatomique sépare la plèvre pariétale de la plèvre viscérale ?",
        "options": [
          { "text": "Le médiastin", "isCorrect": false },
          { "text": "La cavité pleurale virtuelle (film liquidien)", "isCorrect": true },
          { "text": "Le fascia endothoracique", "isCorrect": false },
          { "text": "Les espaces intercostaux", "isCorrect": false }
        ],
        "explanation": "La cavité pleurale est un espace virtuel entre les deux feuillets pleuraux contenant un mince film liquidien (~10-20 mL) qui assure le glissement des poumons sur la paroi thoracique."
      },
      {
        "text": "Qu'appelle-t-on la capacité résiduelle fonctionnelle (CRF) ?",
        "options": [
          { "text": "Le volume maximal expiré après une inspiration maximale", "isCorrect": false },
          { "text": "Le volume restant dans les poumons après une expiration normale", "isCorrect": true },
          { "text": "La différence entre la capacité pulmonaire totale et le volume résiduel", "isCorrect": false },
          { "text": "Le volume courant inspiré à chaque respiration de repos", "isCorrect": false }
        ],
        "explanation": "La CRF (~2,5 L) est le volume pulmonaire à la fin d'une expiration normale passée ; elle représente l'équilibre entre la rétraction élastique pulmonaire (vers l'intérieur) et la compliance thoracique (vers l'extérieur)."
      }
    ]
  },

  // ─── 10. Système digestif ─────────────────────────────────────────────────
  {
    "title": "Système digestif — anatomie de l'œsophage au rectum",
    "description": "Quiz sur l'anatomie des segments du tube digestif, leurs fonctions et leurs structures histologiques, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système digestif — anatomie de l'oesophage au rectum",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel sphincter contrôle le passage du bol alimentaire de l'œsophage vers l'estomac ?",
        "options": [
          { "text": "Le sphincter pylorique", "isCorrect": false },
          { "text": "Le sphincter d'Oddi", "isCorrect": false },
          { "text": "Le sphincter œsophagien inférieur (cardia)", "isCorrect": true },
          { "text": "Le sphincter iléo-cæcal", "isCorrect": false }
        ],
        "explanation": "Le sphincter œsophagien inférieur (SOI ou cardia) est une zone de haute pression musculaire lisse à la jonction œsogastrique ; il s'ouvre lors de la déglutition et se ferme pour prévenir le reflux gastro-œsophagien."
      },
      {
        "text": "Quel segment du tube digestif constitue le principal site d'absorption des nutriments ?",
        "options": [
          { "text": "L'estomac", "isCorrect": false },
          { "text": "L'intestin grêle (duodénum-jéjunum-iléon)", "isCorrect": true },
          { "text": "Le côlon transverse", "isCorrect": false },
          { "text": "Le rectum", "isCorrect": false }
        ],
        "explanation": "L'intestin grêle (~6-7 m) est spécialisé dans l'absorption grâce à ses valvules conniventes, villosités et microvillosités (bordure en brosse) qui multiplient la surface d'échange à ~200 m²."
      },
      {
        "text": "Quel organe annexe déverse la bile dans le duodénum via le canal cholédoque ?",
        "options": [
          { "text": "Le pancréas exocrine", "isCorrect": false },
          { "text": "Le foie", "isCorrect": true },
          { "text": "La vésicule biliaire seule", "isCorrect": false },
          { "text": "Le jéjunum proximal", "isCorrect": false }
        ],
        "explanation": "Le foie produit en continu la bile (600-1000 mL/j), qui est stockée dans la vésicule biliaire puis déversée dans le duodénum via le canal cholédoque (qui rejoint aussi le canal pancréatique principal à l'ampoule de Vater)."
      },
      {
        "text": "Quelle couche de la paroi intestinale contient les plexus nerveux d'Auerbach ?",
        "options": [
          { "text": "La muqueuse (épithélium + chorion)", "isCorrect": false },
          { "text": "La sous-muqueuse", "isCorrect": false },
          { "text": "La musculeuse (entre les deux couches musculaires)", "isCorrect": true },
          { "text": "La séreuse péritonéale", "isCorrect": false }
        ],
        "explanation": "Le plexus myentérique d'Auerbach est situé entre les couches musculaires circulaire interne et longitudinale externe ; il régule le péristaltisme et les contractions de la musculeuse digestive."
      },
      {
        "text": "Quelle partie du côlon fait suite à l'appendice vermiforme et au cæcum ?",
        "options": [
          { "text": "Le côlon transverse", "isCorrect": false },
          { "text": "Le côlon descendant", "isCorrect": false },
          { "text": "Le côlon ascendant (droit)", "isCorrect": true },
          { "text": "Le côlon sigmoïde", "isCorrect": false }
        ],
        "explanation": "Le côlon ascendant (côlon droit) fait suite au cæcum, dans lequel débouche l'appendice iléo-cæcal ; il monte vers l'angle colique droit (hépatique) jusqu'à rejoindre le côlon transverse."
      },
      {
        "text": "Quelle cellule gastrique sécrète l'acide chlorhydrique (HCl) ?",
        "options": [
          { "text": "Les cellules principales (chief cells)", "isCorrect": false },
          { "text": "Les cellules G à gastrine", "isCorrect": false },
          { "text": "Les cellules pariétales (bordantes)", "isCorrect": true },
          { "text": "Les cellules à mucus du collet", "isCorrect": false }
        ],
        "explanation": "Les cellules pariétales (ou bordantes) des glandes fundiques sécrètent HCl via une H⁺/K⁺-ATPase (pompe à protons) et le facteur intrinsèque nécessaire à l'absorption de la vitamine B12."
      },
      {
        "text": "Quel est le rôle principal du côlon dans la digestion ?",
        "options": [
          { "text": "Digérer les protéines par des protéases spécifiques du côlon", "isCorrect": false },
          { "text": "Absorber les vitamines liposolubles A, D, E et K", "isCorrect": false },
          { "text": "Réabsorber l'eau et les électrolytes pour former les selles", "isCorrect": true },
          { "text": "Produire la bile pour émulsionner les graisses alimentaires", "isCorrect": false }
        ],
        "explanation": "Le côlon réabsorbe ~1,5 L d'eau par jour (sur les ~2 L entrant depuis l'iléon) ainsi que Na⁺ et Cl⁻, concentrant le contenu luminal en matières fécales solides ; il abrite aussi le microbiote intestinal."
      },
      {
        "text": "À quel niveau anatomique se situe la jonction entre le jéjunum et l'iléon ?",
        "options": [
          { "text": "À l'angle duodéno-jéjunal (angle de Treitz)", "isCorrect": false },
          { "text": "Il n'y a pas de repère anatomique macroscopique précis", "isCorrect": true },
          { "text": "Au niveau de la valvule iléo-cæcale de Bauhin", "isCorrect": false },
          { "text": "Au niveau de l'anneau inguinal profond", "isCorrect": false }
        ],
        "explanation": "La jonction jéjuno-iléale n'a pas de limite anatomique macroscopique nette ; par convention, les 2/5 proximaux de l'intestin grêle forment le jéjunum et les 3/5 distaux l'iléon, avec des différences histologiques progressives."
      }
    ]
  }

  // ─── 11. Système nerveux ──────────────────────────────────────────────────
  {
    "title": "Système nerveux — organisation centrale et périphérique",
    "description": "Quiz sur les divisions du système nerveux, les neurones, les cellules gliales et les grandes voies sensitives et motrices, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système nerveux — organisation centrale et périphérique",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est la fonction principale de la gaine de myéline entourant les axones ?",
        "options": [
          { "text": "Apporter des nutriments et de l'oxygène à l'axone", "isCorrect": false },
          { "text": "Accélérer la conduction nerveuse par conduction saltatoire", "isCorrect": true },
          { "text": "Synthétiser les neurotransmetteurs dans les terminaisons", "isCorrect": false },
          { "text": "Isoler les neurones voisins pour éviter les interférences électriques", "isCorrect": false }
        ],
        "explanation": "La myéline permet la conduction saltatoire : l'influx nerveux saute de nœud de Ranvier en nœud de Ranvier, accélérant la vitesse de conduction jusqu'à 120 m/s et économisant l'énergie (moins de pompage Na⁺/K⁺)."
      },
      {
        "text": "Quelle structure du tronc cérébral relie le cervelet aux hémisphères cérébraux ?",
        "options": [
          { "text": "La moelle allongée (bulbe rachidien)", "isCorrect": false },
          { "text": "Le pont de Varole (protubérance annulaire)", "isCorrect": true },
          { "text": "Le mésencéphale", "isCorrect": false },
          { "text": "Le diencéphale (thalamus et hypothalamus)", "isCorrect": false }
        ],
        "explanation": "Le pont (protubérance) contient de nombreux noyaux relayant les informations corticales vers le cervelet ; il héberge aussi les noyaux des nerfs crâniens V à VIII."
      },
      {
        "text": "Quelle cellule gliale du SNC forme la myéline ?",
        "options": [
          { "text": "Les cellules de Schwann du SNP", "isCorrect": false },
          { "text": "Les oligodendrocytes du SNC", "isCorrect": true },
          { "text": "Les astrocytes fibreux du SNC", "isCorrect": false },
          { "text": "Les cellules microgliales du SNC", "isCorrect": false }
        ],
        "explanation": "Les oligodendrocytes forment la myéline dans le système nerveux central (SNC) ; chacun peut myéliniser jusqu'à 50 axones différents, contrairement aux cellules de Schwann qui n'en myélinisent qu'un seul dans le SNP."
      },
      {
        "text": "Quel signe clinique traduit une lésion du motoneurone central (voie pyramidale) ?",
        "options": [
          { "text": "Une hypotonie et une amyotrophie avec fasciculations", "isCorrect": false },
          { "text": "Une paralysie flasque et aréflexie ostéo-tendineuse", "isCorrect": false },
          { "text": "Une spasticité et hyperréflexie ostéo-tendineuse (syndrome pyramidal)", "isCorrect": true },
          { "text": "Une ataxie cérébelleuse avec dysmétrie et asynergie", "isCorrect": false }
        ],
        "explanation": "La lésion du motoneurone central (faisceau corticospinal) libère le motoneurone inférieur des inhibitions supraspinales, entraînant spasticité, hyperréflexie, signe de Babinski et syndrome pyramidal."
      },
      {
        "text": "Combien de paires de nerfs spinaux le système nerveux périphérique compte-t-il chez l'humain ?",
        "options": [
          { "text": "24 paires de nerfs spinaux", "isCorrect": false },
          { "text": "31 paires de nerfs spinaux", "isCorrect": true },
          { "text": "12 paires de nerfs crâniens seulement", "isCorrect": false },
          { "text": "33 paires de nerfs spinaux", "isCorrect": false }
        ],
        "explanation": "Il existe 31 paires de nerfs spinaux : 8 cervicales, 12 thoraciques, 5 lombaires, 5 sacrées et 1 coccygienne ; chacune naît par une racine antérieure motrice et une racine postérieure sensitive."
      },
      {
        "text": "Quelle région du cerveau est principalement impliquée dans la régulation des émotions et de la mémoire ?",
        "options": [
          { "text": "Le cortex moteur primaire (aire 4 de Brodmann)", "isCorrect": false },
          { "text": "Le cervelet (hémisphères latéraux)", "isCorrect": false },
          { "text": "Le système limbique (hippocampe, amygdale)", "isCorrect": true },
          { "text": "Le cortex visuel primaire (aire 17)", "isCorrect": false }
        ],
        "explanation": "Le système limbique comprend l'hippocampe (mémoire épisodique), l'amygdale (traitement émotionnel), le gyrus cingulaire et d'autres structures impliquées dans les émotions, la motivation et la mémoire."
      },
      {
        "text": "Quelle est la distinction entre système nerveux somatique et système nerveux autonome ?",
        "options": [
          { "text": "Le système somatique contrôle les viscères, l'autonome les muscles squelettiques", "isCorrect": false },
          { "text": "Le système somatique contrôle les muscles striés volontaires, l'autonome les viscères", "isCorrect": true },
          { "text": "Les deux systèmes contrôlent les mêmes effecteurs par des voies différentes", "isCorrect": false },
          { "text": "Le système somatique est uniquement central, l'autonome uniquement périphérique", "isCorrect": false }
        ],
        "explanation": "Le système somatique innerve les muscles striés squelettiques (contrôle volontaire) ; le système autonome (sympathique et parasympathique) contrôle les muscles lisses, le myocarde et les glandes (fonctions végétatives)."
      },
      {
        "text": "Quel neurotransmetteur est libéré par les neurones post-ganglionnaires sympathiques sur leurs organes cibles ?",
        "options": [
          { "text": "L'acétylcholine sur tous les organes cibles", "isCorrect": false },
          { "text": "La sérotonine sur les vaisseaux et le cœur", "isCorrect": false },
          { "text": "La noradrénaline sur la plupart des organes cibles", "isCorrect": true },
          { "text": "Le GABA sur les terminaisons viscérales", "isCorrect": false }
        ],
        "explanation": "Les neurones post-ganglionnaires sympathiques libèrent principalement la noradrénaline (NA) sur leurs organes cibles ; exception : les glandes sudoripares eccrines, qui reçoivent de l'ACh."
      }
    ]
  },

  // ─── 12. Système endocrinien ──────────────────────────────────────────────
  {
    "title": "Système endocrinien — glandes et régulation hormonale",
    "description": "Quiz sur les principales glandes endocrines, leurs hormones et les mécanismes de régulation, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système endocrinien — glandes et régulation hormonale",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel mécanisme assure la régulation des axes hypothalamo-hypophysaires ?",
        "options": [
          { "text": "Une rétroaction positive amplifiant la sécrétion hormonale", "isCorrect": false },
          { "text": "Une rétroaction négative où l'hormone cible inhibe sa propre production", "isCorrect": true },
          { "text": "Une sécrétion tonique sans variation selon le niveau circulant", "isCorrect": false },
          { "text": "Un mécanisme de chronobiologie uniquement circadien", "isCorrect": false }
        ],
        "explanation": "La rétroaction négative (feedback) est le mécanisme fondamental : quand la concentration de l'hormone cible (ex. cortisol) est suffisante, elle inhibe la sécrétion de CRH (hypothalamus) et d'ACTH (hypophyse), maintenant l'homéostasie."
      },
      {
        "text": "Quelle glande endocrine produit l'insuline et le glucagon ?",
        "options": [
          { "text": "Le foie (cellules hépatocytes)", "isCorrect": false },
          { "text": "Le pancréas endocrine (îlots de Langerhans)", "isCorrect": true },
          { "text": "La glande surrénale (corticosurrénale)", "isCorrect": false },
          { "text": "L'hypophyse antérieure (adénohypophyse)", "isCorrect": false }
        ],
        "explanation": "Les îlots de Langerhans du pancréas endocrine contiennent des cellules bêta (insuline), alpha (glucagon), delta (somatostatine) et PP (polypeptide pancréatique) régulant la glycémie."
      },
      {
        "text": "Quel est l'effet principal de l'aldostérone sur le néphron ?",
        "options": [
          { "text": "Inhiber la réabsorption de Na⁺ au tube distal", "isCorrect": false },
          { "text": "Stimuler l'excrétion de Na⁺ au tube collecteur cortical", "isCorrect": false },
          { "text": "Augmenter la réabsorption de Na⁺ et l'excrétion de K⁺ au tube distal", "isCorrect": true },
          { "text": "Stimuler la diurèse en réduisant les aquaporines AQP2", "isCorrect": false }
        ],
        "explanation": "L'aldostérone (minéralocorticoïde surrénalien) augmente l'expression des canaux Na⁺ apicaux (ENaC) et de la Na⁺/K⁺-ATPase basolatérale dans le tubule collecteur cortical, retenant Na⁺ et eau, et excrétant K⁺."
      },
      {
        "text": "Quelle hormone hypophysaire stimule la production de cortisol par la surrénale ?",
        "options": [
          { "text": "La TSH (thyréostimuline)", "isCorrect": false },
          { "text": "La GH (hormone de croissance)", "isCorrect": false },
          { "text": "L'ACTH (corticotrophine)", "isCorrect": true },
          { "text": "La FSH (hormone folliculo-stimulante)", "isCorrect": false }
        ],
        "explanation": "L'ACTH (adrénocorticotrophine), sécrétée par les cellules corticotropes de l'adénohypophyse sous l'action du CRH hypothalamique, stimule la synthèse et la sécrétion de cortisol par la zone fasciculée du cortex surrénalien."
      },
      {
        "text": "Quelle hormone thyroïdienne est la plus active métaboliquement et résulte de la désiodation de la T4 ?",
        "options": [
          { "text": "La thyroxine (T4)", "isCorrect": false },
          { "text": "La calcitonine", "isCorrect": false },
          { "text": "La triiodothyronine (T3)", "isCorrect": true },
          { "text": "La reverse T3 (rT3)", "isCorrect": false }
        ],
        "explanation": "La T3 est biologiquement 4 fois plus active que la T4 ; elle résulte de la désiodation de la T4 en périphérie (foie, rein, muscles) par les déiodinases ; elle se lie aux récepteurs nucléaires TRα et TRβ."
      },
      {
        "text": "Quelle hormone du post-hypophyse (neurohypophyse) favorise la rétention d'eau par le rein ?",
        "options": [
          { "text": "L'ocytocine (OT)", "isCorrect": false },
          { "text": "La prolactine (PRL)", "isCorrect": false },
          { "text": "L'hormone anti-diurétique (ADH/vasopressine)", "isCorrect": true },
          { "text": "L'hormone de croissance (GH/STH)", "isCorrect": false }
        ],
        "explanation": "L'ADH (vasopressine, AVP) est synthétisée dans les noyaux supraoptique et paraventriculaire de l'hypothalamus et libérée par la neurohypophyse ; elle insère les aquaporines AQP2 dans le canal collecteur, augmentant la réabsorption d'eau."
      },
      {
        "text": "Quel est le rôle des hormones stéroïdes par rapport aux hormones peptidiques dans la signalisation cellulaire ?",
        "options": [
          { "text": "Les stéroïdes agissent sur des récepteurs membranaires couplés aux GPCR", "isCorrect": false },
          { "text": "Les stéroïdes traversent la membrane et agissent sur des récepteurs nucléaires", "isCorrect": true },
          { "text": "Les peptides traversent la membrane tandis que les stéroïdes restent en surface", "isCorrect": false },
          { "text": "Les deux types activent la même voie AMPc-protéine kinase A", "isCorrect": false }
        ],
        "explanation": "Les hormones stéroïdes (lipophiles) traversent librement la membrane plasmique et se fixent sur des récepteurs nucléaires (NR), formant un complexe hormone-récepteur qui module directement la transcription génique."
      },
      {
        "text": "Quelle glande endocrine sécrète la mélatonine et est impliquée dans la régulation du rythme circadien ?",
        "options": [
          { "text": "L'hypophyse antérieure", "isCorrect": false },
          { "text": "Le corps pinéal (épiphyse)", "isCorrect": true },
          { "text": "La glande surrénale (médullosurrénale)", "isCorrect": false },
          { "text": "Le thymus", "isCorrect": false }
        ],
        "explanation": "La glande pinéale (épiphyse) sécrète la mélatonine principalement la nuit (inhibée par la lumière via la rétine) ; elle synchronise les rythmes biologiques circadiens avec le cycle lumière-obscurité."
      }
    ]
  },

  // ─── 13. Système rénal ───────────────────────────────────────────────────
  {
    "title": "Système rénal — anatomie du rein, néphron et voies urinaires",
    "description": "Quiz sur la structure rénale, les fonctions du néphron et les voies excrétrices urinaires, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système rénal — anatomie rein, néphron et voies urinaires",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est l'unité fonctionnelle du rein ?",
        "options": [
          { "text": "Le lobe rénal (pyramide de Malpighi + cortex sus-jacent)", "isCorrect": false },
          { "text": "Le néphron (corpuscule rénal + tubule)", "isCorrect": true },
          { "text": "Le calice mineur recueillant l'urine d'une papille", "isCorrect": false },
          { "text": "Le glomérule de Malpighi seul", "isCorrect": false }
        ],
        "explanation": "Le néphron est l'unité fonctionnelle du rein ; chaque rein en contient environ 1 million. Il comprend le corpuscule rénal (glomérule + capsule de Bowman) et le tubule (proximal, anse de Henlé, distal, collecteur)."
      },
      {
        "text": "Quelle force principale pousse le plasma à travers la membrane glomérulaire pour former l'ultrafiltrat ?",
        "options": [
          { "text": "La pression oncotique des protéines plasmatiques", "isCorrect": false },
          { "text": "La pression hydrostatique capillaire glomérulaire", "isCorrect": true },
          { "text": "La pression osmotique du filtrat dans la capsule de Bowman", "isCorrect": false },
          { "text": "La contraction active des podocytes péri-capillaires", "isCorrect": false }
        ],
        "explanation": "La pression hydrostatique capillaire glomérulaire (environ 55 mmHg) est la force motrice de la filtration ; elle est contrebalancée par la pression oncotique plasmatique (~30 mmHg) et la pression capsulaire (~15 mmHg)."
      },
      {
        "text": "Quel segment du néphron est imperméable à l'eau et réabsorbe activement NaCl ?",
        "options": [
          { "text": "La branche descendante fine de l'anse de Henlé", "isCorrect": false },
          { "text": "Le tube proximal convolué", "isCorrect": false },
          { "text": "La branche ascendante large de l'anse de Henlé", "isCorrect": true },
          { "text": "Le tube collecteur médullaire sous ADH", "isCorrect": false }
        ],
        "explanation": "La branche ascendante large (ou segment épais) de l'anse de Henlé est imperméable à l'eau mais réabsorbe activement Na⁺, K⁺ et Cl⁻ via le cotransporteur NKCC2, créant le gradient osmotique médullaire."
      },
      {
        "text": "Quel taux de filtration glomérulaire (DFG) est considéré comme normal chez l'adulte sain ?",
        "options": [
          { "text": "15-29 mL/min/1,73 m² (insuffisance rénale sévère)", "isCorrect": false },
          { "text": "45-59 mL/min/1,73 m² (insuffisance modérée)", "isCorrect": false },
          { "text": "90-120 mL/min/1,73 m² (fonction normale)", "isCorrect": true },
          { "text": "150-180 mL/min/1,73 m² (hyperfiltration)", "isCorrect": false }
        ],
        "explanation": "Un DFG normal est de 90-120 mL/min/1,73 m² ; en dessous de 60 mL/min/1,73 m² pendant plus de 3 mois, on parle d'insuffisance rénale chronique selon les critères KDIGO."
      },
      {
        "text": "Quel segment des voies urinaires recueille l'urine produite par les papilles rénales ?",
        "options": [
          { "text": "Le bassinet (pyélon)", "isCorrect": false },
          { "text": "L'uretère proximal", "isCorrect": false },
          { "text": "Les calices mineurs puis les calices majeurs", "isCorrect": true },
          { "text": "La jonction urétéro-vésicale", "isCorrect": false }
        ],
        "explanation": "Les papilles déversent l'urine dans les calices mineurs, qui se regroupent en calices majeurs, puis dans le bassinet (pelvis rénal), lequel se poursuit dans l'uretère vers la vessie."
      },
      {
        "text": "Quelle est la longueur approximative de l'uretère chez l'adulte ?",
        "options": [
          { "text": "5-10 cm", "isCorrect": false },
          { "text": "25-30 cm", "isCorrect": true },
          { "text": "40-50 cm", "isCorrect": false },
          { "text": "60-70 cm", "isCorrect": false }
        ],
        "explanation": "Chaque uretère mesure environ 25-30 cm de long ; il présente trois rétrécissements physiologiques (jonction pyélo-urétérale, croisement vasculaire iliaque, jonction urétéro-vésicale) où se bloquent préférentiellement les calculs."
      },
      {
        "text": "Par quel mécanisme le rein régule-t-il la pression artérielle via le système rénine-angiotensine ?",
        "options": [
          { "text": "La sécrétion de rénine diminue quand la pression artérielle est basse", "isCorrect": false },
          { "text": "La rénine catalyse la conversion d'angiotensinogène en angiotensine I", "isCorrect": true },
          { "text": "L'angiotensine II provoque une vasodilatation artériolaire directe", "isCorrect": false },
          { "text": "L'aldostérone inhibe la réabsorption sodée pour abaisser la PA", "isCorrect": false }
        ],
        "explanation": "Lors d'une hypotension, les cellules juxtaglomérulaires libèrent la rénine qui clive l'angiotensinogène hépatique en angiotensine I ; l'ECA la convertit en angiotensine II, un puissant vasoconstricteur stimulant l'aldostérone."
      },
      {
        "text": "Quel est le rôle du rein dans la régulation de l'érythropoïèse ?",
        "options": [
          { "text": "Synthétiser l'hémoglobine pour les précurseurs érythroïdes", "isCorrect": false },
          { "text": "Produire l'érythropoïétine (EPO) stimulant la production de globules rouges", "isCorrect": true },
          { "text": "Stocker le fer nécessaire à la synthèse de l'hème", "isCorrect": false },
          { "text": "Détruire les globules rouges sénescents par hémolyse intrarénale", "isCorrect": false }
        ],
        "explanation": "Les cellules péritubulaires interstitielles du cortex rénal produisent l'EPO (érythropoïétine) en réponse à l'hypoxie ; l'EPO stimule la prolifération et la différenciation des précurseurs érythroïdes dans la moelle osseuse."
      }
    ]
  },

  // ─── 14. Système reproducteur ─────────────────────────────────────────────
  {
    "title": "Système reproducteur — anatomie masculine et féminine",
    "description": "Quiz sur l'anatomie des organes génitaux masculins et féminins et les grandes étapes de la gamétogenèse, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Système reproducteur — anatomie mâle et femelle",
    "difficulty": "easy",
    "duration": 12,
    "isPublished": true,
    "questions": [
      {
        "text": "Dans quel organe la spermatogenèse se déroule-t-elle chez l'homme ?",
        "options": [
          { "text": "Dans l'épididyme", "isCorrect": false },
          { "text": "Dans les tubes séminifères du testicule", "isCorrect": true },
          { "text": "Dans la prostate", "isCorrect": false },
          { "text": "Dans les vésicules séminales", "isCorrect": false }
        ],
        "explanation": "La spermatogenèse se déroule dans les tubes séminifères des testicules, à une température de 32-35 °C (d'où la position extra-abdominale du scrotum) ; les cellules de Sertoli soutiennent les spermatocytes en développement."
      },
      {
        "text": "Quelle hormone masculine est principalement produite par les cellules de Leydig du testicule ?",
        "options": [
          { "text": "La FSH (hormone folliculo-stimulante)", "isCorrect": false },
          { "text": "L'inhibine B produite par les cellules de Sertoli", "isCorrect": false },
          { "text": "La testostérone", "isCorrect": true },
          { "text": "La LH (hormone lutéinisante)", "isCorrect": false }
        ],
        "explanation": "Les cellules de Leydig interstitielles sécrètent la testostérone sous stimulation de la LH hypophysaire ; elle régule la spermatogenèse, les caractères sexuels secondaires masculins et la libido."
      },
      {
        "text": "Quel organe féminin est le siège de la maturation folliculaire et de l'ovulation ?",
        "options": [
          { "text": "L'utérus", "isCorrect": false },
          { "text": "La trompe utérine (trompe de Fallope)", "isCorrect": false },
          { "text": "L'ovaire", "isCorrect": true },
          { "text": "Le col utérin", "isCorrect": false }
        ],
        "explanation": "L'ovaire contient les follicules ovariens à différents stades ; la croissance folliculaire (sous FSH) aboutit à l'ovulation (sous pic de LH) au 14e jour d'un cycle de 28 jours, libérant l'ovocyte II dans la trompe."
      },
      {
        "text": "Où se produit la fécondation de l'ovocyte par le spermatozoïde ?",
        "options": [
          { "text": "Dans la cavité utérine", "isCorrect": false },
          { "text": "Dans le tiers externe de la trompe utérine (ampoule)", "isCorrect": true },
          { "text": "Au niveau du col utérin", "isCorrect": false },
          { "text": "Dans l'ovaire juste après l'ovulation", "isCorrect": false }
        ],
        "explanation": "La fécondation a lieu dans l'ampoule de la trompe utérine (1/3 externe) ; le zygote migre ensuite vers l'utérus en se divisant pour s'implanter dans l'endomètre au 6e-7e jour après la fécondation."
      },
      {
        "text": "Quel est le rôle de la prostate chez l'homme ?",
        "options": [
          { "text": "Produire les spermatozoïdes et les stocker", "isCorrect": false },
          { "text": "Sécréter un liquide alcalin participant au sperme", "isCorrect": true },
          { "text": "Produire la testostérone sous contrôle de la LH", "isCorrect": false },
          { "text": "Transporter les spermatozoïdes de l'épididyme à l'urètre", "isCorrect": false }
        ],
        "explanation": "La prostate sécrète un liquide légèrement alcalin (~30 % du volume séminal) contenant du PSA, du zinc, du citrate et des enzymes ; ce liquide neutralise l'acidité vaginale et protège les spermatozoïdes."
      },
      {
        "text": "Quelle structure muqueuse utérine est éliminée lors des menstruations ?",
        "options": [
          { "text": "Le myomètre", "isCorrect": false },
          { "text": "Le périmètre (séreuse péritonéale)", "isCorrect": false },
          { "text": "La couche fonctionnelle de l'endomètre", "isCorrect": true },
          { "text": "La couche basale de l'endomètre", "isCorrect": false }
        ],
        "explanation": "L'endomètre comprend deux couches ; la couche fonctionnelle superficielle se développe sous l'œstrogène, se prépare à l'implantation sous progestérone, puis est éliminée lors des règles si l'implantation n'a pas lieu."
      },
      {
        "text": "Quelle hormone maintient le corps jaune et prolonge sa sécrétion de progestérone lors d'une grossesse ?",
        "options": [
          { "text": "La FSH placentaire", "isCorrect": false },
          { "text": "L'œstradiol ovarien", "isCorrect": false },
          { "text": "La hCG (gonadotrophine chorionique humaine)", "isCorrect": true },
          { "text": "La prolactine hypophysaire", "isCorrect": false }
        ],
        "explanation": "La hCG est produite par le syncytiotrophoblaste dès l'implantation ; elle stimule le corps jaune (comme la LH) pour maintenir la production de progestérone nécessaire à la grossesse jusqu'à ce que le placenta prenne le relais (~10e-12e semaine)."
      },
      {
        "text": "Quel canal relie les testicules à l'urètre prostatique chez l'homme ?",
        "options": [
          { "text": "Le canal déférent (vas deferens)", "isCorrect": true },
          { "text": "Le canal éjaculateur seul", "isCorrect": false },
          { "text": "L'épididyme directement à la prostate", "isCorrect": false },
          { "text": "Le canal de Cowper (glande bulbo-urétrale)", "isCorrect": false }
        ],
        "explanation": "Le canal déférent transporte les spermatozoïdes de la queue de l'épididyme jusqu'à la vésicule séminale où il rejoint son canal excréteur pour former le canal éjaculateur, qui s'abouche dans l'urètre prostatique."
      }
    ]
  },

  // ─── 15. Biochimie des glucides ───────────────────────────────────────────
  {
    "title": "Biochimie des glucides — glycolyse, cycle de Krebs et ATP",
    "description": "Quiz sur les voies du catabolisme glucidique, l'ATP et la bioénergétique cellulaire, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Biochimie des glucides — glycolyse, cycle de Krebs et production d'ATP",
    "difficulty": "hard",
    "duration": 20,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel est le produit final de la glycolyse en conditions aérobies ?",
        "options": [
          { "text": "L'acide lactique (lactate)", "isCorrect": false },
          { "text": "L'acétyl-CoA", "isCorrect": false },
          { "text": "Le pyruvate (acide pyruvique)", "isCorrect": true },
          { "text": "L'oxaloacétate", "isCorrect": false }
        ],
        "explanation": "La glycolyse convertit une molécule de glucose (6C) en deux molécules de pyruvate (3C) en conditions aérobies ; en anaérobie, le pyruvate est réduit en lactate pour régénérer le NAD⁺."
      },
      {
        "text": "Combien de tours du cycle de Krebs sont nécessaires pour oxyder complètement une molécule de glucose ?",
        "options": [
          { "text": "Un seul tour du cycle", "isCorrect": false },
          { "text": "Deux tours du cycle", "isCorrect": true },
          { "text": "Quatre tours du cycle", "isCorrect": false },
          { "text": "Six tours du cycle", "isCorrect": false }
        ],
        "explanation": "Le glucose donne 2 pyruvates → 2 acétyl-CoA (2C chacun) ; chaque acétyl-CoA nécessite un tour complet du cycle de Krebs, donc 2 tours au total pour l'oxydation d'un glucose."
      },
      {
        "text": "Combien d'ATP sont produits au total par l'oxydation complète d'une molécule de glucose en aérobie ?",
        "options": [
          { "text": "2 ATP en tout", "isCorrect": false },
          { "text": "8 ATP en tout", "isCorrect": false },
          { "text": "30-32 ATP en tout", "isCorrect": true },
          { "text": "56 ATP en tout", "isCorrect": false }
        ],
        "explanation": "La valeur consensuelle actuelle est 30-32 ATP par glucose (glycolyse : 2, décarboxylation du pyruvate : 0, cycle de Krebs : 2 GTP, et environ 26-28 ATP de la chaîne respiratoire via NADH/FADH₂)."
      },
      {
        "text": "Quel enzyme de la glycolyse est irréversible et régulé par le fructose-2,6-bisphosphate ?",
        "options": [
          { "text": "La phosphoglucose isomérase (PGI)", "isCorrect": false },
          { "text": "La phosphofructokinase-1 (PFK-1)", "isCorrect": true },
          { "text": "L'hexokinase (HK)", "isCorrect": false },
          { "text": "La pyruvate kinase (PK)", "isCorrect": false }
        ],
        "explanation": "La PFK-1 catalyse la phosphorylation du fructose-6-phosphate en fructose-1,6-bisphosphate ; c'est l'étape limitante de la glycolyse, activée par le F-2,6-BP (signal d'insuline) et inhibée par l'ATP et le citrate."
      },
      {
        "text": "Où le cycle de Krebs se déroule-t-il dans la cellule ?",
        "options": [
          { "text": "Dans le cytosol", "isCorrect": false },
          { "text": "Dans la matrice mitochondriale", "isCorrect": true },
          { "text": "Sur la membrane interne mitochondriale", "isCorrect": false },
          { "text": "Dans le réticulum endoplasmique lisse", "isCorrect": false }
        ],
        "explanation": "Toutes les enzymes du cycle de Krebs (sauf la succinate déshydrogénase, ancrée dans la membrane interne) se trouvent dans la matrice mitochondriale, où se déroule l'oxydation complète de l'acétyl-CoA."
      },
      {
        "text": "Quel est le rôle de l'ATP synthase (complexe V) dans la chaîne respiratoire ?",
        "options": [
          { "text": "Transférer les électrons du NADH à l'oxygène moléculaire", "isCorrect": false },
          { "text": "Pomper des protons de la matrice vers l'espace inter-membranaire", "isCorrect": false },
          { "text": "Utiliser le flux de protons pour synthétiser l'ATP par phosphorylation", "isCorrect": true },
          { "text": "Oxyder le succinate en fumarate via le FAD", "isCorrect": false }
        ],
        "explanation": "L'ATP synthase exploite le gradient électrochimique de protons (force proton-motrice) généré par les complexes I-IV ; le retour des H⁺ vers la matrice via l'ATP synthase libère l'énergie pour phosphoryler l'ADP en ATP."
      },
      {
        "text": "Quelle voie métabolique se déclenche en cas de jeûne pour synthétiser du glucose à partir de précurseurs non glucidiques ?",
        "options": [
          { "text": "La glycogénolyse hépatique", "isCorrect": false },
          { "text": "La néoglucogenèse (gluconéogenèse)", "isCorrect": true },
          { "text": "La voie des pentoses phosphates", "isCorrect": false },
          { "text": "La bêta-oxydation des acides gras", "isCorrect": false }
        ],
        "explanation": "La néoglucogenèse, active principalement dans le foie et le rein, synthétise du glucose à partir du pyruvate, du lactate, du glycérol et des acides aminés glucoformateurs (ex. alanine) lors du jeûne prolongé."
      },
      {
        "text": "Quel sucre est le principal substrat énergétique du cerveau en conditions physiologiques normales ?",
        "options": [
          { "text": "Le fructose circulant", "isCorrect": false },
          { "text": "Le galactose d'origine laitière", "isCorrect": false },
          { "text": "Le glucose sanguin", "isCorrect": true },
          { "text": "L'acide gras à chaîne courte", "isCorrect": false }
        ],
        "explanation": "Le cerveau utilise presque exclusivement le glucose (120 g/j) en conditions normales ; il ne stocke pas de glycogène significatif et dépend en continu de la glycémie, d'où la gravité de l'hypoglycémie cérébrale."
      }
    ]
  },

  // ─── 16. Biochimie des lipides ────────────────────────────────────────────
  {
    "title": "Biochimie des lipides — acides gras, triglycérides et phospholipides",
    "description": "Quiz sur la structure et le métabolisme des lipides majeurs, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Biochimie des lipides — acides gras, triglycérides et phospholipides",
    "difficulty": "hard",
    "duration": 20,
    "isPublished": true,
    "questions": [
      {
        "text": "Qu'est-ce qui différencie un acide gras saturé d'un acide gras insaturé ?",
        "options": [
          { "text": "La longueur de la chaîne carbonée (nombre de carbones)", "isCorrect": false },
          { "text": "La présence ou l'absence de doubles liaisons C=C dans la chaîne", "isCorrect": true },
          { "text": "La présence d'un groupement amine en position oméga", "isCorrect": false },
          { "text": "Le nombre de groupements carboxyle à chaque extrémité", "isCorrect": false }
        ],
        "explanation": "Un acide gras saturé ne contient aucune double liaison (ex. palmitate C16:0) ; un acide gras insaturé en contient au moins une (ex. oléate C18:1, ω9) ; les insaturés ont un point de fusion plus bas."
      },
      {
        "text": "Quelle est la structure chimique d'un triglycéride ?",
        "options": [
          { "text": "Un acide gras lié à un alcool stérolique (cholestérol)", "isCorrect": false },
          { "text": "Trois acides gras estérifiés sur un glycérol", "isCorrect": true },
          { "text": "Un phosphate relié à deux acides gras et une choline", "isCorrect": false },
          { "text": "Une sphyngosine liée à un acide gras et un sucre", "isCorrect": false }
        ],
        "explanation": "Les triglycérides (triacylglycérols) sont des esters de glycérol portant trois acides gras sur les carbones sn-1, sn-2 et sn-3 ; ils constituent la principale forme de stockage de l'énergie lipidique dans les adipocytes."
      },
      {
        "text": "Quelle lipoprotéine transporte les triglycérides d'origine hépatique vers les tissus périphériques ?",
        "options": [
          { "text": "Les HDL (lipoprotéines de haute densité)", "isCorrect": false },
          { "text": "Les chylomicrons d'origine intestinale", "isCorrect": false },
          { "text": "Les VLDL (lipoprotéines de très basse densité)", "isCorrect": true },
          { "text": "Les LDL (lipoprotéines de basse densité)", "isCorrect": false }
        ],
        "explanation": "Les VLDL sont synthétisées par le foie et transportent les triglycérides et le cholestérol vers les tissus périphériques ; en perdant leurs triglycérides (via la LPL), elles deviennent des IDL puis des LDL."
      },
      {
        "text": "Quel est le rôle du cholestérol dans les membranes biologiques ?",
        "options": [
          { "text": "Fournir de l'énergie lors de sa dégradation par les phospholipases", "isCorrect": false },
          { "text": "Réguler la fluidité membranaire et la perméabilité", "isCorrect": true },
          { "text": "Former le squelette de la bicouche à la place des phospholipides", "isCorrect": false },
          { "text": "Activer directement les protéines G membranaires", "isCorrect": false }
        ],
        "explanation": "Le cholestérol s'intercale entre les phospholipides membranaires ; à basse température il augmente la fluidité (évite la cristallisation), à haute température il la réduit, stabilisant ainsi la membrane dans une large gamme thermique."
      },
      {
        "text": "Quelle est la différence structurale entre un phospholipide et un triglycéride ?",
        "options": [
          { "text": "Le phospholipide a trois acides gras, le triglycéride n'en a que deux", "isCorrect": false },
          { "text": "Le phospholipide a un groupement phosphate à la place d'un acide gras en sn-3", "isCorrect": true },
          { "text": "Le triglycéride contient du galactose, pas le phospholipide", "isCorrect": false },
          { "text": "Le phospholipide est entièrement hydrophobe, le triglycéride est amphiphile", "isCorrect": false }
        ],
        "explanation": "Dans un phospholipide, la position sn-3 du glycérol est estérifiée avec un groupement phosphate lié à une tête polaire (choline, sérine, éthanolamine, inositol) ; cette tête hydrophile rend les phospholipides amphiphiles."
      },
      {
        "text": "Où la lipogenèse de novo (synthèse d'acides gras) se déroule-t-elle principalement chez l'humain ?",
        "options": [
          { "text": "Dans la mitochondrie hépatique", "isCorrect": false },
          { "text": "Dans le cytosol du foie et du tissu adipeux", "isCorrect": true },
          { "text": "Dans le réticulum endoplasmique lisse des entérocytes", "isCorrect": false },
          { "text": "Dans les peroxysomes sous stimulation par le glucagon", "isCorrect": false }
        ],
        "explanation": "La lipogenèse de novo se déroule dans le cytosol, principalement dans les hépatocytes et les adipocytes ; l'acétyl-CoA cytosolique (exporté de la mitochondrie sous forme de citrate) est l'unité de base, et l'acide gras synthase (FAS) assemble la chaîne."
      },
      {
        "text": "Qu'est-ce qu'un acide gras essentiel ?",
        "options": [
          { "text": "Un acide gras saturé indispensable à la synthèse des membranes", "isCorrect": false },
          { "text": "Un acide gras que l'organisme ne peut pas synthétiser et doit apporter par l'alimentation", "isCorrect": true },
          { "text": "Un acide gras produit uniquement lors du jeûne prolongé", "isCorrect": false },
          { "text": "Un acide gras à très longue chaîne (C22 et plus)", "isCorrect": false }
        ],
        "explanation": "Les acides gras essentiels (AGE) sont l'acide linoléique (ω6, C18:2) et l'acide alpha-linolénique (ω3, C18:3) ; l'humain ne peut pas introduire de doubles liaisons en position ω6 et ω3 et doit donc les obtenir par l'alimentation."
      },
      {
        "text": "Quel corps cétonique est produit majoritairement lors de la cétogenèse hépatique intense ?",
        "options": [
          { "text": "L'acétone", "isCorrect": false },
          { "text": "L'acétoacétate et le bêta-hydroxybutyrate", "isCorrect": true },
          { "text": "L'acide propionique (propionate)", "isCorrect": false },
          { "text": "Le succinyl-CoA", "isCorrect": false }
        ],
        "explanation": "Les deux principaux corps cétoniques sont l'acétoacétate (environ 30 %) et le bêta-hydroxybutyrate (environ 70 %) ; l'acétone est un sous-produit mineur de la décarboxylation spontanée de l'acétoacétate, responsable de l'haleine caractéristique."
      }
    ]
  },

  // ─── 17. Biochimie des protéines ──────────────────────────────────────────
  {
    "title": "Biochimie des protéines — acides aminés, structure et enzymologie",
    "description": "Quiz sur les acides aminés, les niveaux de structure protéique et les principes de cinétique enzymatique, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Biochimie des protéines — acides aminés, structure et enzymologie",
    "difficulty": "hard",
    "duration": 20,
    "isPublished": true,
    "questions": [
      {
        "text": "Quel lien covalent unit deux acides aminés consécutifs dans une chaîne polypeptidique ?",
        "options": [
          { "text": "La liaison disulfure entre deux cystéines", "isCorrect": false },
          { "text": "La liaison hydrogène entre groupements amide et carbonyle", "isCorrect": false },
          { "text": "La liaison peptidique entre groupement amine et groupement carboxyle", "isCorrect": true },
          { "text": "La liaison ionique entre résidus chargés opposés", "isCorrect": false }
        ],
        "explanation": "La liaison peptidique résulte de la condensation entre le groupement α-carboxyle d'un acide aminé et le groupement α-amine du suivant, avec élimination d'eau ; elle est planes et partiellement à caractère double liaison."
      },
      {
        "text": "Quel niveau de structure protéique correspond aux hélices α et aux feuillets β ?",
        "options": [
          { "text": "La structure primaire", "isCorrect": false },
          { "text": "La structure secondaire", "isCorrect": true },
          { "text": "La structure tertiaire", "isCorrect": false },
          { "text": "La structure quaternaire", "isCorrect": false }
        ],
        "explanation": "La structure secondaire décrit les motifs réguliers locaux de la chaîne polypeptidique stabilisés par des liaisons hydrogène entre atomes du squelette peptidique : principalement hélice α et feuillet β (parallèle ou antiparallèle)."
      },
      {
        "text": "Quelle interaction est principalement responsable du repliement tridimensionnel (structure tertiaire) des protéines globulaires ?",
        "options": [
          { "text": "Les liaisons peptidiques entre résidus non adjacents", "isCorrect": false },
          { "text": "L'effet hydrophobe des résidus apolaires enfouis vers l'intérieur", "isCorrect": true },
          { "text": "Les liaisons covalentes entre résidus d'acides aminés polaires", "isCorrect": false },
          { "text": "Les interactions électrostatiques en surface avec l'eau", "isCorrect": false }
        ],
        "explanation": "L'effet hydrophobe est la force motrice principale du repliement : les résidus non polaires (Val, Ile, Leu, Phe) se regroupent à l'intérieur de la protéine, éloignés de l'eau ; les liaisons H, ioniques et ponts disulfure stabilisent ensuite la structure."
      },
      {
        "text": "Qu'est-ce que le Km (constante de Michaelis) d'une enzyme ?",
        "options": [
          { "text": "La vitesse maximale atteinte quand tous les sites actifs sont saturés", "isCorrect": false },
          { "text": "La concentration en substrat pour laquelle la vitesse est égale à Vmax/2", "isCorrect": true },
          { "text": "La constante d'inhibition d'un inhibiteur compétitif", "isCorrect": false },
          { "text": "L'énergie d'activation nécessaire à la catalyse enzymatique", "isCorrect": false }
        ],
        "explanation": "Le Km est la concentration en substrat [S] pour laquelle v = Vmax/2 ; il est inversement proportionnel à l'affinité de l'enzyme pour son substrat : un Km bas indique une haute affinité."
      },
      {
        "text": "Quel acide aminé forme des ponts disulfure stabilisant la structure tertiaire et quaternaire des protéines ?",
        "options": [
          { "text": "La méthionine (Met)", "isCorrect": false },
          { "text": "La sérine (Ser)", "isCorrect": false },
          { "text": "La cystéine (Cys)", "isCorrect": true },
          { "text": "La tyrosine (Tyr)", "isCorrect": false }
        ],
        "explanation": "Deux résidus cystéine proches dans l'espace peuvent former une liaison disulfure covalente (–S–S–) par oxydation de leurs groupements thiol (–SH) ; ces ponts disulfure renforcent considérablement la stabilité protéique."
      },
      {
        "text": "Quel type d'inhibition enzymatique est réversible et compétitif avec le substrat pour le site actif ?",
        "options": [
          { "text": "L'inhibition non compétitive (se fixe sur un site allostérique)", "isCorrect": false },
          { "text": "L'inhibition mixte (augmente Km et diminue Vmax)", "isCorrect": false },
          { "text": "L'inhibition compétitive (augmente Km apparent sans modifier Vmax)", "isCorrect": true },
          { "text": "L'inhibition irréversible par liaison covalente sur le site actif", "isCorrect": false }
        ],
        "explanation": "L'inhibiteur compétitif ressemble structuralement au substrat et se fixe de façon réversible sur le site actif ; il augmente le Km apparent (affinité apparente réduite) sans modifier Vmax (surmontable par excès de substrat)."
      },
      {
        "text": "Qu'est-ce qu'un isoenzyme (isoenzyme) ?",
        "options": [
          { "text": "Une enzyme dénaturée ayant perdu son activité catalytique", "isCorrect": false },
          { "text": "Une protéine qui transporte les enzymes vers leurs compartiments cibles", "isCorrect": false },
          { "text": "Une forme moléculaire différente d'un même enzyme catalysant la même réaction", "isCorrect": true },
          { "text": "Un cofacteur protéique nécessaire à l'activité d'une autre enzyme", "isCorrect": false }
        ],
        "explanation": "Les isoenzymes catalysent la même réaction chimique mais présentent des propriétés cinétiques ou de régulation différentes ; la LDH (lactate déshydrogénase) a 5 isoformes dont les proportions tissulaires diagnostiques (LDH-1 cardiaque, LDH-5 hépatique)."
      },
      {
        "text": "Combien d'acides aminés essentiels l'alimentation humaine adulte doit-elle apporter ?",
        "options": [
          { "text": "5 acides aminés essentiels", "isCorrect": false },
          { "text": "9 acides aminés essentiels", "isCorrect": true },
          { "text": "14 acides aminés essentiels", "isCorrect": false },
          { "text": "20 acides aminés essentiels", "isCorrect": false }
        ],
        "explanation": "Les 9 acides aminés essentiels chez l'adulte sont : histidine, isoleucine, leucine, lysine, méthionine, phénylalanine, thréonine, tryptophane et valine ; ils ne peuvent pas être synthétisés en quantité suffisante et doivent être apportés par l'alimentation."
      }
    ]
  },

  // ─── 18. Hématologie fondamentale ────────────────────────────────────────
  {
    "title": "Hématologie fondamentale — composition du sang et lignées cellulaires",
    "description": "Quiz sur les éléments figurés du sang, les lignées hématopoïétiques et les indices érythrocytaires, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Hématologie fondamentale — composition du sang et lignées cellulaires",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est la durée de vie moyenne d'un érythrocyte (globule rouge) en circulation ?",
        "options": [
          { "text": "7 à 10 jours", "isCorrect": false },
          { "text": "120 jours environ", "isCorrect": true },
          { "text": "60 jours environ", "isCorrect": false },
          { "text": "180 jours environ", "isCorrect": false }
        ],
        "explanation": "Les érythrocytes vivent environ 120 jours ; ils sont ensuite phagocytés par les macrophages spléniques et hépatiques (système réticulo-endothélial) ; l'hémoglobine est catabolisée en bilirubine."
      },
      {
        "text": "Quel leucocyte est le plus abondant dans le sang périphérique en conditions normales ?",
        "options": [
          { "text": "Les lymphocytes", "isCorrect": false },
          { "text": "Les monocytes", "isCorrect": false },
          { "text": "Les polynucléaires neutrophiles", "isCorrect": true },
          { "text": "Les éosinophiles", "isCorrect": false }
        ],
        "explanation": "Les polynucléaires neutrophiles représentent 50-70 % des leucocytes circulants ; ce sont les premières cellules recrutées lors d'une infection bactérienne et leur augmentation (neutrophilie) traduit souvent une infection aiguë."
      },
      {
        "text": "Quel est le rôle principal de la thrombopoïétine (TPO) dans l'hématopoïèse ?",
        "options": [
          { "text": "Stimuler la prolifération des précurseurs érythroïdes", "isCorrect": false },
          { "text": "Stimuler la maturation des mégacaryocytes et la production de plaquettes", "isCorrect": true },
          { "text": "Activer les monocytes en macrophages tissulaires", "isCorrect": false },
          { "text": "Induire la différenciation des cellules NK", "isCorrect": false }
        ],
        "explanation": "La TPO, produite principalement par le foie, stimule la prolifération et la différenciation des mégacaryocytes ; les plaquettes naissent par fragmentation du cytoplasme mégacaryocytaire (thrombopoïèse)."
      },
      {
        "text": "Quel marqueur biologique reflète la glycémie moyenne des 2-3 derniers mois ?",
        "options": [
          { "text": "La glycémie à jeun plasmatique", "isCorrect": false },
          { "text": "La fructosamine sérique", "isCorrect": false },
          { "text": "L'hémoglobine glyquée (HbA1c)", "isCorrect": true },
          { "text": "L'albumine glyquée", "isCorrect": false }
        ],
        "explanation": "L'HbA1c résulte de la glycation irréversible de l'hémoglobine au fil de la vie de l'érythrocyte (~120 jours) ; elle reflète la glycémie moyenne sur les 2-3 derniers mois et est le marqueur de suivi du diabète."
      },
      {
        "text": "Quelle protéine transporte l'oxygène dans les érythrocytes ?",
        "options": [
          { "text": "La transferrine", "isCorrect": false },
          { "text": "La myoglobine musculaire", "isCorrect": false },
          { "text": "L'hémoglobine (Hb)", "isCorrect": true },
          { "text": "La ferritine intracellulaire", "isCorrect": false }
        ],
        "explanation": "L'hémoglobine est une tétramer de 4 chaînes polypeptidiques (2α + 2β chez l'adulte HbA) chacune portant un groupement hème (Fe²⁺) pouvant fixer un molécule d'O₂ ; une Hb peut donc transporter 4 O₂."
      },
      {
        "text": "Qu'est-ce que le volume globulaire moyen (VGM) ?",
        "options": [
          { "text": "La concentration d'hémoglobine dans un érythrocyte en g/dL", "isCorrect": false },
          { "text": "Le pourcentage d'érythrocytes dans le sang total (hématocrite)", "isCorrect": false },
          { "text": "Le volume moyen d'un érythrocyte exprimé en femtolitres (fL)", "isCorrect": true },
          { "text": "Le poids moyen d'hémoglobine par érythrocyte en picogrammes", "isCorrect": false }
        ],
        "explanation": "Le VGM (valeurs normales : 80-100 fL) indique la taille moyenne des hématies ; une microcytose (VGM < 80 fL) oriente vers une carence en fer ou une thalassémie, une macrocytose (> 100 fL) vers une carence en B12 ou folate."
      },
      {
        "text": "Quel type de leucocyte est principalement impliqué dans les réactions allergiques et les parasitoses ?",
        "options": [
          { "text": "Les polynucléaires basophiles", "isCorrect": false },
          { "text": "Les lymphocytes B mémoire", "isCorrect": false },
          { "text": "Les polynucléaires éosinophiles", "isCorrect": true },
          { "text": "Les monocytes circulants", "isCorrect": false }
        ],
        "explanation": "Les éosinophiles (2-4 % des leucocytes normaux) sont recrutés lors des allergies (IgE-médiées) et des infestations parasitaires ; ils libèrent la protéine basique majeure (MBP) cytotoxique contre les helminthes."
      },
      {
        "text": "Quel facteur de coagulation est déficient dans l'hémophilie A ?",
        "options": [
          { "text": "Le facteur IX (facteur Christmas)", "isCorrect": false },
          { "text": "Le facteur VII (facteur stable)", "isCorrect": false },
          { "text": "Le facteur VIII (facteur anti-hémophilique A)", "isCorrect": true },
          { "text": "Le facteur XI (facteur Rosenthal)", "isCorrect": false }
        ],
        "explanation": "L'hémophilie A est liée au chromosome X (récessive) et résulte d'un déficit en facteur VIII de la coagulation ; elle touche presque exclusivement les hommes et se traduit par des hémarthroses et hémorragies prolongées."
      }
    ]
  },

  // ─── 19. Immunologie fondamentale ────────────────────────────────────────
  {
    "title": "Immunologie fondamentale — immunité innée et adaptative",
    "description": "Quiz sur les mécanismes de la réponse immunitaire innée et adaptative, les cellules immunitaires et les anticorps, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Immunologie fondamentale — immunité innée et adaptative",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle est la caractéristique principale de l'immunité innée par rapport à l'immunité adaptative ?",
        "options": [
          { "text": "L'immunité innée est plus spécifique et génère une mémoire immunologique", "isCorrect": false },
          { "text": "L'immunité innée est non spécifique, immédiate et sans mémoire", "isCorrect": true },
          { "text": "L'immunité innée ne fait intervenir que des lymphocytes B", "isCorrect": false },
          { "text": "L'immunité innée est uniquement humorale (anticorps uniquement)", "isCorrect": false }
        ],
        "explanation": "L'immunité innée est la première ligne de défense ; elle est non spécifique (reconnaît des motifs microbiens conservés via les PRR/TLR), immédiate (minutes à heures) et n'a pas de mémoire immunologique."
      },
      {
        "text": "Quel type cellulaire présente les antigènes aux lymphocytes T via le CMH de classe II ?",
        "options": [
          { "text": "Les lymphocytes B naïfs circulants", "isCorrect": false },
          { "text": "Les cellules dendritiques présentatrices d'antigènes (CPA)", "isCorrect": true },
          { "text": "Les lymphocytes T cytotoxiques CD8⁺", "isCorrect": false },
          { "text": "Les cellules NK du système inné", "isCorrect": false }
        ],
        "explanation": "Les cellules dendritiques (et autres CPA : macrophages, lymphocytes B) présentent les peptides antigéniques via les molécules du CMH-II aux lymphocytes T auxiliaires CD4⁺, initiant la réponse adaptative."
      },
      {
        "text": "Quelle immunoglobuline est la plus abondante dans le sérum humain et assure la défense humorale principale ?",
        "options": [
          { "text": "Les IgM (réponse primaire initiale)", "isCorrect": false },
          { "text": "Les IgA (muqueuses et sécrétions)", "isCorrect": false },
          { "text": "Les IgG (réponse secondaire et mémoire)", "isCorrect": true },
          { "text": "Les IgE (réponses allergiques)", "isCorrect": false }
        ],
        "explanation": "Les IgG représentent 75-80 % des immunoglobulines sériques ; elles sont produites lors des réponses secondaires, ont la plus longue demi-vie (~21 jours), traversent le placenta et neutralisent les pathogènes et toxines."
      },
      {
        "text": "Quel mécanisme permet aux lymphocytes T cytotoxiques CD8⁺ de tuer une cellule infectée ?",
        "options": [
          { "text": "La production d'anticorps spécifiques ciblant la cellule infectée", "isCorrect": false },
          { "text": "La libération de perforines et de granzymes induisant l'apoptose", "isCorrect": true },
          { "text": "La phagocytose directe de la cellule infectée", "isCorrect": false },
          { "text": "L'activation du complément par voie classique", "isCorrect": false }
        ],
        "explanation": "Les CTL CD8⁺ libèrent des perforines (créant des pores dans la membrane de la cellule cible) et des granzymes (sérine protéases) qui pénètrent et activent les caspases, induisant l'apoptose de la cellule infectée."
      },
      {
        "text": "Qu'est-ce que la tolérance immunologique ?",
        "options": [
          { "text": "La résistance à un pathogène après vaccination ou infection", "isCorrect": false },
          { "text": "L'absence de réponse immunitaire contre les antigènes du soi", "isCorrect": true },
          { "text": "L'immunosuppression physiologique lors de la grossesse", "isCorrect": false },
          { "text": "La réponse hypo-immune lors de la prise d'immunosuppresseurs", "isCorrect": false }
        ],
        "explanation": "La tolérance immunitaire centrale (thymus pour T, moelle pour B) élimine les lymphocytes auto-réactifs ; la tolérance périphérique (anergie, Treg) complète ce mécanisme ; une rupture entraîne des maladies auto-immunes."
      },
      {
        "text": "Quel composant du système du complément forme le complexe d'attaque membranaire (CAM) ?",
        "options": [
          { "text": "Les fractions C3a et C5a (anaphylatoxines)", "isCorrect": false },
          { "text": "Les fractions C1q, C1r, C1s (initiation voie classique)", "isCorrect": false },
          { "text": "Les fractions C5b, C6, C7, C8, C9 (CAM)", "isCorrect": true },
          { "text": "Les fractions C3b et C4b (opsonines)", "isCorrect": false }
        ],
        "explanation": "Le CAM (complexe lytique MAC) est formé séquentiellement par C5b-C6-C7-C8 et le polymère C9 ; il s'insère dans la membrane des bactéries ou des cellules cibles et crée un canal transmembranaire provoquant la lyse osmotique."
      },
      {
        "text": "Quel organe lymphoïde primaire est responsable de la maturation des lymphocytes T ?",
        "options": [
          { "text": "La rate", "isCorrect": false },
          { "text": "Les ganglions lymphatiques", "isCorrect": false },
          { "text": "Le thymus", "isCorrect": true },
          { "text": "Les plaques de Peyer intestinales", "isCorrect": false }
        ],
        "explanation": "Le thymus est l'organe primaire de maturation des lymphocytes T ; les thymocytes y subissent la sélection positive (reconnaissance du CMH du soi) et négative (élimination des auto-réactifs) avant de rejoindre la périphérie."
      },
      {
        "text": "Quelle cellule immunitaire innée libère de l'histamine lors d'une réaction allergique immédiate (type I) ?",
        "options": [
          { "text": "Les macrophages M2 tissulaires", "isCorrect": false },
          { "text": "Les lymphocytes Th2 sécrétant des cytokines", "isCorrect": false },
          { "text": "Les mastocytes sensibilisés par les IgE", "isCorrect": true },
          { "text": "Les cellules dendritiques plasmacytoïdes", "isCorrect": false }
        ],
        "explanation": "Les mastocytes fixent les IgE via leurs récepteurs FcεRI ; lors du second contact avec l'allergène, la réticulation des IgE déclenche la dégranulation libérant histamine, sérotonine, leucotriènes et prostaglandines responsables des symptômes allergiques."
      }
    ]
  },

  // ─── 20. Microbiologie générale ───────────────────────────────────────────
  {
    "title": "Microbiologie générale — classification bactérienne, virale et fongique",
    "description": "Quiz sur les principes de classification des microorganismes, leurs structures et leurs modes de pathogénicité, pour les étudiants IFSI Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.1 - Biologie fondamentale",
    "chapter": "Microbiologie générale — classification bactérienne, virale et fongique",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Que détecte la coloration de Gram et quel résultat obtient-on pour les bactéries Gram-positif ?",
        "options": [
          { "text": "La présence d'une capsule polysaccharidique — résultat positif = rouge", "isCorrect": false },
          { "text": "L'épaisseur de la paroi peptidoglycane — Gram+ = violet (crystal violet)", "isCorrect": true },
          { "text": "La présence d'une endotoxine LPS — Gram+ = incolore", "isCorrect": false },
          { "text": "La motilité flagellaire — Gram+ = rose safranine", "isCorrect": false }
        ],
        "explanation": "La coloration de Gram distingue les bactéries selon leur paroi : Gram+ ont une épaisse couche de peptidoglycane qui retient le cristal violet (coloration violette) ; Gram- ont une fine couche et une membrane externe, le cristal violet est décoloré et elles prennent la safranine (rose)."
      },
      {
        "text": "Quelle structure virale contient le génome viral et est entourée par la capside protéique ?",
        "options": [
          { "text": "Le péplos (enveloppe lipidique externe)", "isCorrect": false },
          { "text": "Le nucléoïde viral", "isCorrect": false },
          { "text": "Le nucléocapside (génome + capside)", "isCorrect": true },
          { "text": "Les spicules (glycoprotéines de surface)", "isCorrect": false }
        ],
        "explanation": "La nucléocapside est la structure interne formée du génome viral (ADN ou ARN) entouré par la capside protéique (protomères → capsomères) ; chez les virus enveloppés, elle est entourée du péplos d'origine membranaire cellulaire."
      },
      {
        "text": "Quelle est la différence fondamentale entre une bactérie et un virus sur le plan de la reproduction ?",
        "options": [
          { "text": "Les bactéries utilisent l'ADN, les virus uniquement l'ARN", "isCorrect": false },
          { "text": "Les bactéries se répliquent de façon autonome, les virus nécessitent la cellule hôte", "isCorrect": true },
          { "text": "Les virus se divisent par scissiparité, les bactéries par bourgeonnement", "isCorrect": false },
          { "text": "Les bactéries n'ont pas d'acide nucléique, les virus en ont un seul type", "isCorrect": false }
        ],
        "explanation": "Les bactéries sont des cellules procaryotes autonomes capables de se reproduire par scissiparité dans un milieu nutritif ; les virus sont des parasites intracellulaires obligatoires qui n'ont pas de métabolisme propre et détournent la machinerie cellulaire hôte."
      },
      {
        "text": "Qu'est-ce qu'un champignon dimorphique en microbiologie médicale ?",
        "options": [
          { "text": "Un champignon présentant deux noyaux par cellule", "isCorrect": false },
          { "text": "Un champignon existant sous forme de levure ou de moisissure selon la température", "isCorrect": true },
          { "text": "Un champignon ayant deux phases sexuée et asexuée différentes", "isCorrect": false },
          { "text": "Un champignon pathogène uniquement chez les immunodéprimés", "isCorrect": false }
        ],
        "explanation": "Les champignons dimorphiques (ex. Histoplasma, Candida) existent sous forme de levure à 37 °C (in vivo) et sous forme filamenteuse (moisissure) à 25 °C (environnement) ; ce dimorphisme est souvent lié à la virulence."
      },
      {
        "text": "Quel mécanisme est à l'origine de la résistance aux antibiotiques par production de bêta-lactamase ?",
        "options": [
          { "text": "La modification de la cible (PBP altérée) sans enzyme", "isCorrect": false },
          { "text": "L'efflux actif de l'antibiotique hors de la cellule bactérienne", "isCorrect": false },
          { "text": "L'hydrolyse du cycle bêta-lactame par l'enzyme bêta-lactamase", "isCorrect": true },
          { "text": "La réduction de la perméabilité membranaire par perte de porines", "isCorrect": false }
        ],
        "explanation": "Les bêta-lactamases sont des enzymes bactériennes qui hydrolysent le cycle bêta-lactame des pénicillines et céphalosporines, inactivant ces antibiotiques avant qu'ils n'atteignent leur cible (PBP) ; elles peuvent être inhibées par le clavulanate."
      },
      {
        "text": "Quelle structure bactérienne protège la bactérie contre la phagocytose et contribue à sa virulence ?",
        "options": [
          { "text": "Le flagelle (mobilité bactérienne)", "isCorrect": false },
          { "text": "Le pili (adhésion aux surfaces)", "isCorrect": false },
          { "text": "La capsule polysaccharidique externe", "isCorrect": true },
          { "text": "Le plasmide extrachromosomique", "isCorrect": false }
        ],
        "explanation": "La capsule polysaccharidique (ex. Streptococcus pneumoniae, Klebsiella) masque les motifs reconnus par les phagocytes, inhibe l'opsonisation et la phagocytose, contribuant à la virulence ; elle est la cible de nombreux vaccins conjugués."
      },
      {
        "text": "Quelle est la principale différence entre une infection bactérienne et une infection fongique concernant la paroi cellulaire ?",
        "options": [
          { "text": "Les bactéries ont une paroi en chitine, les champignons en peptidoglycane", "isCorrect": false },
          { "text": "Les bactéries ont une paroi en peptidoglycane, les champignons en chitine et glucanes", "isCorrect": true },
          { "text": "Les bactéries n'ont pas de paroi, les champignons en ont une en cellulose", "isCorrect": false },
          { "text": "Les deux ont une paroi en peptidoglycane mais de composition différente", "isCorrect": false }
        ],
        "explanation": "La paroi bactérienne est composée de peptidoglycane (cible des bêta-lactamines) ; la paroi fongique est composée de chitine (polymère de N-acétylglucosamine) et de bêta-1,3-glucanes (cible des échinocandines)."
      },
      {
        "text": "Qu'est-ce qu'un prion et en quoi diffère-t-il des autres agents infectieux ?",
        "options": [
          { "text": "Un virus à ARN non enveloppé de très petite taille", "isCorrect": false },
          { "text": "Une protéine infectieuse mal repliée sans acide nucléique propre", "isCorrect": true },
          { "text": "Un viroïde composé uniquement d'ARN circulaire nu", "isCorrect": false },
          { "text": "Une bactérie intracellulaire obligatoire sans paroi cellulaire", "isCorrect": false }
        ],
        "explanation": "Les prions sont des protéines PrP normales mal repliées (PrPsc) qui convertissent les PrP normales en forme pathologique ; ils ne contiennent pas d'acide nucléique et sont responsables des encéphalopathies spongiformes (vMCJ, kuru, tremblante du mouton)."
      }
    ]
  }
];
