module.exports = [
  // ─── Quiz 1 ─── Bactériologie générale
  {
    title: "Bactériologie générale — structure, classification et pouvoir pathogène",
    description: "Maîtriser la structure bactérienne, les grands groupes taxonomiques et les déterminants du pouvoir pathogène des bactéries.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Bactériologie générale — structure, classification et pouvoir pathogène",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle structure bactérienne est mise en évidence par la coloration de Gram ?",
        options: [
          { text: "La paroi cellulaire (peptidoglycane)", isCorrect: true },
          { text: "La membrane cytoplasmique interne", isCorrect: false },
          { text: "Le chromosome bactérien circulaire", isCorrect: false },
          { text: "Les pili de conjugaison bactériens", isCorrect: false }
        ],
        explanation: "La coloration de Gram différencie les bactéries selon leur paroi : les Gram+ retiennent le cristal violet grâce à leur épaisse couche de peptidoglycane, tandis que les Gram− la perdent après décoloration à l'alcool en raison de leur membrane externe lipidique."
      },
      {
        text: "Quel composant confère aux bactéries Gram-négatives leur propriété endotoxinique ?",
        options: [
          { text: "Le lipopolysaccharide (LPS) de la membrane externe", isCorrect: true },
          { text: "L'acide téichoïque de la paroi interne", isCorrect: false },
          { text: "La capsule polysaccharidique externe", isCorrect: false },
          { text: "Les protéines OmpA de la porine externe", isCorrect: false }
        ],
        explanation: "Le lipopolysaccharide (LPS), présent uniquement sur la membrane externe des bactéries Gram-négatives, est l'endotoxine responsable du choc septique. Sa fraction lipide A est la portion biologiquement active déclenchant la réponse inflammatoire systémique."
      },
      {
        text: "Quelle est la fonction principale de la capsule bactérienne dans l'infection ?",
        options: [
          { text: "Protéger la bactérie de la phagocytose par les macrophages", isCorrect: true },
          { text: "Synthétiser les toxines protéiques de la bactérie", isCorrect: false },
          { text: "Permettre les échanges de plasmides entre bactéries", isCorrect: false },
          { text: "Assurer la mobilité de la bactérie vers ses cibles", isCorrect: false }
        ],
        explanation: "La capsule polysaccharidique est un facteur de virulence majeur : elle inhibe l'opsonisation et la phagocytose, permettant à la bactérie d'échapper aux défenses de l'hôte. Streptococcus pneumoniae et Klebsiella pneumoniae en sont de bons exemples."
      },
      {
        text: "Comment se reproduisent principalement les bactéries en phase exponentielle ?",
        options: [
          { text: "Par scissiparité (division binaire transversale)", isCorrect: true },
          { text: "Par bourgeonnement à partir de la paroi externe", isCorrect: false },
          { text: "Par sporulation puis germination successive", isCorrect: false },
          { text: "Par conjugaison entre cellules bactériennes voisines", isCorrect: false }
        ],
        explanation: "La scissiparité est le mode de reproduction asexuée des bactéries : la cellule mère se divise en deux cellules filles identiques après réplication du chromosome circulaire. En conditions optimales, le temps de génération peut être aussi court que 20 minutes (E. coli)."
      },
      {
        text: "Quelle bactérie est responsable de la tuberculose pulmonaire ?",
        options: [
          { text: "Mycobacterium tuberculosis (bacille de Koch)", isCorrect: true },
          { text: "Mycobacterium leprae (bacille de Hansen)", isCorrect: false },
          { text: "Nocardia asteroides (actinomycète aérobie)", isCorrect: false },
          { text: "Corynebacterium diphtheriae (bacille diphthérique)", isCorrect: false }
        ],
        explanation: "Mycobacterium tuberculosis, ou bacille de Koch (BK), est l'agent de la tuberculose. Sa paroi riche en acides mycoliques le rend résistant à la décoloration acide (BAAR : bacille acido-alcoolo-résistant) et lui confère une survie prolongée dans les macrophages."
      },
      {
        text: "Qu'est-ce qu'un plasmide dans le contexte de la résistance bactérienne aux antibiotiques ?",
        options: [
          { text: "Un ADN circulaire extra-chromosomique portant des gènes de résistance", isCorrect: true },
          { text: "Un ARN messager codant pour des pompes à efflux membranaires", isCorrect: false },
          { text: "Une protéine liant les antibiotiques de la famille des bêtalactamines", isCorrect: false },
          { text: "Un transposon intégré dans le chromosome bactérien principal", isCorrect: false }
        ],
        explanation: "Les plasmides sont des éléments génétiques mobiles extra-chromosomiques pouvant porter des gènes de résistance aux antibiotiques. Ils se transmettent horizontalement entre bactéries par conjugaison, transformation ou transduction, contribuant à la diffusion rapide de la résistance."
      },
      {
        text: "Quelle différence fondamentale distingue les bactéries des cellules eucaryotes ?",
        options: [
          { text: "Les bactéries sont dépourvues de noyau délimité par une membrane", isCorrect: true },
          { text: "Les bactéries possèdent des mitochondries fonctionnelles", isCorrect: false },
          { text: "Les bactéries ont des ribosomes 80S identiques aux eucaryotes", isCorrect: false },
          { text: "Les bactéries disposent d'un appareil de Golgi rudimentaire", isCorrect: false }
        ],
        explanation: "Les bactéries sont des procaryotes : leur matériel génétique n'est pas entouré d'une enveloppe nucléaire mais se trouve dans un nucléoïde. Elles possèdent des ribosomes 70S (non 80S), absence d'organites membranaires — ce qui explique leur sensibilité à certains antibiotiques ciblant le ribosome 70S."
      },
      {
        text: "Quel mécanisme bactérien permet la formation de biofilm sur un cathéter vasculaire ?",
        options: [
          { text: "Production d'une matrice polysaccharidique adhésive intercellulaire", isCorrect: true },
          { text: "Synthèse de toxines cytolytiques sur la surface du matériau", isCorrect: false },
          { text: "Sporulation de la bactérie en conditions de stress nutritionnel", isCorrect: false },
          { text: "Hypermutation de la flagelline pour adhérer aux polymères", isCorrect: false }
        ],
        explanation: "Le biofilm est une communauté bactérienne enchâssée dans une matrice de polysaccharides, protéines et ADN extracellulaire. Il protège les bactéries des antibiotiques et du système immunitaire, expliquant la difficulté de traiter les infections sur matériel prothétique (Staphylococcus epidermidis)."
      }
    ]
  },

  // ─── Quiz 2 ─── Virologie générale
  {
    title: "Virologie générale — structure virale, réplication et tropisme",
    description: "Comprendre l'organisation des virus, les étapes de leur cycle réplicatif et les mécanismes déterminant leur tropisme cellulaire.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Virologie générale — structure virale, réplication et tropisme",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la différence structurelle fondamentale entre un virus enveloppé et un virus nu ?",
        options: [
          { text: "Le virus enveloppé possède une bicouche lipidique entourant la capside", isCorrect: true },
          { text: "Le virus enveloppé contient de l'ADN et le virus nu contient de l'ARN", isCorrect: false },
          { text: "Le virus enveloppé se réplique dans le noyau et le virus nu dans le cytoplasme", isCorrect: false },
          { text: "Le virus enveloppé est toujours plus grand que le virus nu correspondant", isCorrect: false }
        ],
        explanation: "L'enveloppe virale est une bicouche lipidique dérivée de la membrane cellulaire de l'hôte, dans laquelle sont insérées des glycoprotéines virales (ex : hémagglutinine du virus grippal). Les virus nus (non enveloppés) sont plus résistants dans l'environnement extérieur et résistent mieux aux désinfectants."
      },
      {
        text: "Quelle étape du cycle viral correspond à l'injection du génome viral dans la cellule hôte ?",
        options: [
          { text: "La pénétration et décapsidation virale intracellulaire", isCorrect: true },
          { text: "La maturation des protéines virales par protéolyse", isCorrect: false },
          { text: "La libération des virions par bourgeonnement membranaire", isCorrect: false },
          { text: "La fixation aux récepteurs cellulaires de surface externe", isCorrect: false }
        ],
        explanation: "Après fixation aux récepteurs de la cellule cible, le virus pénètre (fusion membranaire pour les virus enveloppés, endocytose pour les virus nus) puis se décapside pour libérer son génome dans le cytoplasme ou le noyau. Ces étapes sont des cibles thérapeutiques importantes (ex : inhibiteurs de fusion du VIH)."
      },
      {
        text: "Quel récepteur cellulaire le VIH utilise-t-il principalement pour infecter les lymphocytes T ?",
        options: [
          { text: "Le récepteur CD4 associé aux corécepteurs CCR5/CXCR4", isCorrect: true },
          { text: "Le récepteur ACE2 couplé à la protéine TMPRSS2", isCorrect: false },
          { text: "Le récepteur CD8 présent sur les lymphocytes cytotoxiques", isCorrect: false },
          { text: "Le récepteur toll-like TLR4 des cellules dendritiques", isCorrect: false }
        ],
        explanation: "La glycoprotéine gp120 du VIH se fixe au récepteur CD4 puis à un corécepteur (CCR5 sur les macrophages et lymphocytes T mémoires, CXCR4 sur les lymphocytes T naïfs). Le maraviroc, antagoniste de CCR5, exploite cette connaissance pour bloquer l'entrée du VIH."
      },
      {
        text: "Qu'est-ce qu'un rétrovirus et quel enzyme lui est caractéristique ?",
        options: [
          { text: "Un virus à ARN utilisant une transcriptase inverse pour faire de l'ADN", isCorrect: true },
          { text: "Un virus à ADN utilisant une ARN polymérase ARN-dépendante", isCorrect: false },
          { text: "Un virus à ARN double brin replicant dans le réticulum endoplasmique", isCorrect: false },
          { text: "Un virus à ADN bicaténaire intégrant son génome sans transcription", isCorrect: false }
        ],
        explanation: "Les rétrovirus (VIH, HTLV) possèdent un génome ARN monocaténaire qu'ils convertissent en ADN double brin grâce à la transcriptase inverse (reverse transcriptase). Cet ADN proviral s'intègre ensuite dans le génome de l'hôte via l'intégrase. Ces enzymes sont des cibles majeures des antirétroviraux."
      },
      {
        text: "Quel phénomène explique la variabilité antigénique importante du virus de la grippe ?",
        options: [
          { text: "La dérive (drift) et le saut (shift) antigéniques de l'hémagglutinine", isCorrect: true },
          { text: "L'intégration aléatoire du provirus dans le génome de l'hôte", isCorrect: false },
          { text: "La recombinaison homologue entre génomes de virus différents", isCorrect: false },
          { text: "La méthylation épigénétique des épitopes de surface viraux", isCorrect: false }
        ],
        explanation: "La dérive antigénique (mutations ponctuelles cumulatives) génère des variants saisonniers nécessitant une mise à jour annuelle du vaccin. Le saut antigénique (réassortiment entre deux souches différentes) peut créer des variants pandémiques comme lors de la grippe H1N1 de 2009 (réassortiment entre virus humain, porcin et aviaire)."
      },
      {
        text: "Quelle est la définition d'un virus à tropisme neurotrope ?",
        options: [
          { text: "Un virus qui infecte préférentiellement les cellules du système nerveux", isCorrect: true },
          { text: "Un virus qui provoque des symptômes neurologiques sans infecter le SNC", isCorrect: false },
          { text: "Un virus transmis exclusivement par voie nerveuse périphérique", isCorrect: false },
          { text: "Un virus inhibant la transmission synaptique des neurones moteurs", isCorrect: false }
        ],
        explanation: "Le tropisme viral est déterminé par la présence des récepteurs appropriés sur les cellules cibles. Les virus neurotropes (herpès simplex, virus de la rage, poliovirus) infectent préférentiellement les neurones et/ou les cellules gliales. Le virus de la rage remonte les axones par transport axonal rétrograde jusqu'au SNC."
      },
      {
        text: "Comment l'interféron de type I contribue-t-il à la défense antivirale précoce ?",
        options: [
          { text: "Il induit un état antiviral dans les cellules voisines non encore infectées", isCorrect: true },
          { text: "Il détruit directement les virions extracellulaires par opsonisation", isCorrect: false },
          { text: "Il stimule la production d'anticorps neutralisants par les plasmocytes", isCorrect: false },
          { text: "Il active la voie du complément pour lyser les cellules infectées", isCorrect: false }
        ],
        explanation: "Les interférons de type I (IFN-α et IFN-β), produits par les cellules infectées, se lient aux récepteurs des cellules voisines et induisent l'expression de gènes stimulés par l'interféron (ISG) qui créent un état antiviral : dégradation des ARN viraux, blocage de la traduction, activation des cellules NK."
      },
      {
        text: "Quel virus est responsable de la mononucléose infectieuse (angine de Pfeiffer) ?",
        options: [
          { text: "L'Epstein-Barr virus (EBV), de la famille des Herpesviridae", isCorrect: true },
          { text: "Le cytomégalovirus (CMV), de la famille des Herpesviridae", isCorrect: false },
          { text: "Le virus de l'herpès simplex de type 1 (HSV-1 oral)", isCorrect: false },
          { text: "Le parvovirus B19, responsable du mégalérythème épidémique", isCorrect: false }
        ],
        explanation: "L'EBV infecte les lymphocytes B via le récepteur CD21 (CR2). La mononucléose infectieuse se caractérise par une fièvre, une angine pseudomembraneuse, des adénopathies et un syndrome mononucléosique (hyperlymphocytose avec lymphocytes atypiques). L'EBV est également associé au lymphome de Burkitt et au carcinome nasopharyngé."
      }
    ]
  },

  // ─── Quiz 3 ─── Mycologie et parasitologie
  {
    title: "Mycologie et parasitologie — principaux agents fongiques et parasitaires",
    description: "Identifier les principaux champignons pathogènes et parasites, leur mode de transmission et les infections qu'ils provoquent.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Mycologie et parasitologie — principaux agents fongiques et parasitaires",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle caractéristique biologique distingue les champignons des bactéries ?",
        options: [
          { text: "Les champignons sont des eucaryotes avec noyau et paroi chitineuse", isCorrect: true },
          { text: "Les champignons se reproduisent exclusivement par sporulation binaire", isCorrect: false },
          { text: "Les champignons sont sensibles aux mêmes antibiotiques que les bactéries", isCorrect: false },
          { text: "Les champignons sont dépourvus de membrane cytoplasmique propre", isCorrect: false }
        ],
        explanation: "Les champignons sont des eucaryotes : ils possèdent un noyau délimité, des mitochondries et une paroi à base de chitine (non de peptidoglycane). Leur membrane plasmique contient de l'ergostérol (au lieu du cholestérol des mammifères), cible spécifique des antifongiques azolés et des polyènes (amphotéricine B)."
      },
      {
        text: "Quel champignon est la cause la plus fréquente de candidose invasive en soins intensifs ?",
        options: [
          { text: "Candida albicans, levure commensale des muqueuses digestives", isCorrect: true },
          { text: "Aspergillus fumigatus, moisissure inhalée depuis l'environnement", isCorrect: false },
          { text: "Cryptococcus neoformans, levure encapsulée des sols enrichis", isCorrect: false },
          { text: "Pneumocystis jirovecii, champignon atypique intracellulaire obligatoire", isCorrect: false }
        ],
        explanation: "Candida albicans est un commensal des muqueuses qui devient pathogène lors d'une immunodépression ou d'une rupture des barrières (cathéter, chirurgie abdominale). Sa transition de forme levure à forme filamenteuse (hyphe) est un facteur de virulence clé lui permettant d'envahir les tissus."
      },
      {
        text: "Quel parasite est responsable du paludisme transmis par la piqûre d'anophèle ?",
        options: [
          { text: "Plasmodium falciparum (forme grave), P. vivax, P. ovale, P. malariae", isCorrect: true },
          { text: "Trypanosoma brucei, transmis par la mouche tsé-tsé africaine", isCorrect: false },
          { text: "Leishmania donovani, transmis par la piqûre de phlébotomes", isCorrect: false },
          { text: "Toxoplasma gondii, transmis par oocystes félins et viande crue", isCorrect: false }
        ],
        explanation: "Les Plasmodium sont des protozoaires sporozoaires transmis par la piqûre d'une femelle anophèle infectée. P. falciparum est la forme la plus dangereuse (neuropaludisme, anémie sévère). Le cycle comprend une phase hépatique (schizogonie exo-érythrocytaire) puis une phase érythrocytaire responsable des accès fébriles."
      },
      {
        text: "Quelle infection fongique opportuniste est caractéristique du SIDA avec CD4 < 200/mm³ ?",
        options: [
          { text: "La pneumocystose pulmonaire à Pneumocystis jirovecii (anciennement carinii)", isCorrect: true },
          { text: "La dermatophytose à Trichophyton rubrum des ongles et pieds", isCorrect: false },
          { text: "La candidose oro-pharyngée superficielle (muguet) à C. albicans", isCorrect: false },
          { text: "La cryptococcose disséminée à Cryptococcus neoformans encapsulé", isCorrect: false }
        ],
        explanation: "P. jirovecii provoque une pneumonie interstitielle diffuse (PCP) chez les immunodéprimés sévères (CD4 < 200/mm³). Elle se manifeste par une dyspnée progressive, une toux sèche et une hypoxémie. La prophylaxie par cotrimoxazole est recommandée sous ce seuil. C. neoformans est une autre infection opportuniste mais survient à un stade plus avancé."
      },
      {
        text: "Comment se transmet principalement Toxoplasma gondii à l'être humain ?",
        options: [
          { text: "Par ingestion d'oocystes (selles de chat) ou de kystes dans la viande mal cuite", isCorrect: true },
          { text: "Par piqûre d'un moustique Aedes aegypti portant des sporozoïtes", isCorrect: false },
          { text: "Par contact direct avec des lésions cutanées d'un hôte infecté", isCorrect: false },
          { text: "Par inhalation de spores dans les sols ou déchets organiques", isCorrect: false }
        ],
        explanation: "T. gondii est un protozoaire intracellulaire dont l'hôte définitif est le chat. L'homme se contamine en ingérant des oocystes dans les excréments de chat (jardinage, litière) ou des kystes tissulaires dans la viande crue ou insuffisamment cuite (surtout mouton et porc). La toxoplasmose congénitale (primo-infection pendant la grossesse) peut être grave pour le fœtus."
      },
      {
        text: "Quel est le mécanisme d'action principal de l'amphotéricine B sur les champignons ?",
        options: [
          { text: "Elle se lie à l'ergostérol membranaire et forme des pores cytolytiques", isCorrect: true },
          { text: "Elle inhibe la synthèse de la chitine de la paroi fongique externe", isCorrect: false },
          { text: "Elle bloque le CYP51 fongique et inhibe la synthèse d'ergostérol", isCorrect: false },
          { text: "Elle inhibe la topoisomérase II fongique bloquant la réplication", isCorrect: false }
        ],
        explanation: "L'amphotéricine B (polyène) se fixe à l'ergostérol de la membrane fongique avec haute affinité, créant des pores qui altèrent la perméabilité membranaire et entraînent la mort cellulaire. Son affinité pour le cholestérol des cellules humaines explique sa néphrotoxicité. Les formulations liposomales réduisent cette toxicité."
      },
      {
        text: "Qu'est-ce qu'un dermatophyte et quelle infection provoque-t-il ?",
        options: [
          { text: "Un champignon kératinophile colonisant la peau, les cheveux et les ongles (teignes)", isCorrect: true },
          { text: "Un champignon dimorphe provoquant des pneumonies endémiques sévères", isCorrect: false },
          { text: "Une levure encapsulée responsable de méningites chez l'immunodéprimé", isCorrect: false },
          { text: "Un champignon filamenteux angioinvasif des sinus et poumons profonds", isCorrect: false }
        ],
        explanation: "Les dermatophytes (Trichophyton, Microsporum, Epidermophyton) sont des champignons filamenteux kératinophiles responsables des teignes (tinea capitis), de la teigne inguinale (eczéma marginé de Hebra), du pied d'athlète (tinea pedis) et des onychomycoses. Ils ne pénètrent jamais dans les tissus profonds chez l'immunocompétent."
      },
      {
        text: "Quelle complication grave de l'aspergillose invasive justifie une prophylaxie antifongique ?",
        options: [
          { text: "L'angioinvasion avec infarctus pulmonaire et dissémination cérébroméningée", isCorrect: true },
          { text: "La formation de granulomes caséeux pulmonaires chez l'immunocompétent", isCorrect: false },
          { text: "La colonisation bronchique asymptomatique sans envahissement tissulaire", isCorrect: false },
          { text: "La réaction allergique immédiate IgE-médiée chez les sujets atopiques", isCorrect: false }
        ],
        explanation: "A. fumigatus est un champignon angioinvasif chez les patients neutropéniques profonds (greffes de moelle, hémopathies) : il envahit les vaisseaux pulmonaires, provoque des infarctus hémorragiques et peut se disséminer au cerveau avec une mortalité très élevée. La prophylaxie par posaconazole est recommandée chez les patients à haut risque."
      }
    ]
  },

  // ─── Quiz 4 ─── Mécanismes de l'infection
  {
    title: "Mécanismes de l'infection — chaîne épidémiologique et portes d'entrée",
    description: "Comprendre la chaîne épidémiologique de la transmission des maladies infectieuses et identifier les différentes portes d'entrée des agents pathogènes.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Mécanismes de l'infection — chaîne épidémiologique et portes d'entrée",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quels sont les trois maillons indispensables de la chaîne épidémiologique de transmission ?",
        options: [
          { text: "La source (réservoir), le mode de transmission et l'hôte réceptif", isCorrect: true },
          { text: "L'agent pathogène, la température ambiante et la densité de population", isCorrect: false },
          { text: "La porte d'entrée, la virulence de l'agent et la dose infectieuse", isCorrect: false },
          { text: "Le vecteur arthropode, la saison épidémique et l'âge de l'hôte", isCorrect: false }
        ],
        explanation: "La chaîne épidémiologique comprend : 1) la source/réservoir (humain, animal, environnement), 2) le mode de transmission (contact, gouttelettes, air, vecteur, véhicule), 3) l'hôte réceptif (immunité, âge, comorbidités). Rompre l'un de ces maillons interrompt la transmission — principe fondamental des mesures de prévention en hygiène hospitalière."
      },
      {
        text: "Quelle est la différence entre une transmission par gouttelettes et une transmission aérienne ?",
        options: [
          { text: "Les gouttelettes (>5 µm) retombent vite, les aérosols (<5 µm) restent en suspension", isCorrect: true },
          { text: "Les gouttelettes contaminent les surfaces, les aérosols contaminent les liquides", isCorrect: false },
          { text: "Les gouttelettes nécessitent un vecteur, les aérosols se transmettent par contact", isCorrect: false },
          { text: "Les gouttelettes sont exclusivement respiratoires, les aérosols sont digestifs", isCorrect: false }
        ],
        explanation: "Les gouttelettes de Flügge (>5 µm) tombent rapidement à moins d'un mètre (grippe, COVID-19 en grande partie, méningocoque) — précautions gouttelettes suffisantes. Les aérosols (<5 µm) restent en suspension plusieurs heures et peuvent voyager loin (tuberculose, rougeole, varicelle) — précautions air requises (masque FFP2, chambre à pression négative)."
      },
      {
        text: "Quelle porte d'entrée est principalement utilisée par Salmonella typhi lors de la fièvre typhoïde ?",
        options: [
          { text: "La voie digestive par ingestion d'eau ou d'aliments contaminés", isCorrect: true },
          { text: "La voie cutanée par blessure souillée de terre ou d'excréments", isCorrect: false },
          { text: "La voie respiratoire par inhalation de gouttelettes infectieuses", isCorrect: false },
          { text: "La voie transplacentaire lors d'une bactériémie maternelle active", isCorrect: false }
        ],
        explanation: "S. typhi pénètre par voie orale-fécale via l'ingestion d'eau ou d'aliments souillés par des matières fécales humaines. Après traversée de la muqueuse iléale via les plaques de Peyer, elle gagne le sang (bactériémie) et les organes lymphoïdes. La vaccination et l'accès à l'eau potable sont les principales mesures préventives."
      },
      {
        text: "Qu'est-ce qu'une infection nosocomiale (infections associées aux soins, IAS) ?",
        options: [
          { text: "Une infection contractée lors d'un soin médical, absente à l'admission du patient", isCorrect: true },
          { text: "Une infection due uniquement aux bactéries multirésistantes hospitalières", isCorrect: false },
          { text: "Une infection touchant exclusivement les professionnels de santé exposés", isCorrect: false },
          { text: "Une infection communautaire aggravée par un séjour en milieu hospitalier", isCorrect: false }
        ],
        explanation: "Une IAS survient au cours ou à la suite d'une prise en charge diagnostique ou thérapeutique, et n'était ni présente ni en incubation à l'admission. Le délai minimal conventionnel est de 48h après l'admission. Elles représentent environ 5 à 10 % des hospitalisations en France et peuvent être causées par des bactéries, virus, champignons ou parasites."
      },
      {
        text: "Quel facteur de l'hôte est le plus déterminant dans la susceptibilité aux infections opportunistes ?",
        options: [
          { text: "L'immunodépression cellulaire profonde (déficit en lymphocytes T CD4)", isCorrect: true },
          { text: "La malnutrition protéino-calorique avec déficit en immunoglobulines G", isCorrect: false },
          { text: "L'âge avancé avec diminution de la réponse inflammatoire systémique", isCorrect: false },
          { text: "Le déficit en complément avec absence de complexe d'attaque membranaire", isCorrect: false }
        ],
        explanation: "Le déficit en lymphocytes T CD4 (VIH avancé, greffes, corticothérapie prolongée) est le facteur prédisposant majeur aux infections opportunistes par des agents normalement contrôlés par l'immunité cellulaire (Pneumocystis, Toxoplasma, CMV, Mycobacterium avium complex). Le seuil de CD4 < 200/mm³ est un marqueur clé de risque infectieux."
      },
      {
        text: "Quelle est la définition de la dose infectieuse minimale (DIM) d'un agent pathogène ?",
        options: [
          { text: "La quantité minimale d'agents pathogènes nécessaire pour provoquer une infection", isCorrect: true },
          { text: "La concentration d'antibiotique suffisante pour éradiquer un agent pathogène", isCorrect: false },
          { text: "Le nombre de jours minimum avant l'apparition des premiers symptômes", isCorrect: false },
          { text: "La période pendant laquelle un hôte infecté reste contagieux pour autrui", isCorrect: false }
        ],
        explanation: "La DIM varie considérablement selon les agents : très faible pour Shigella et E. coli O157:H7 (< 100 bactéries), plus élevée pour Vibrio cholerae (~10⁶). Cette notion influence les mesures d'hygiène : une DIM basse impose des précautions renforcées (lavage des mains, isolation). Elle dépend aussi du statut immunitaire de l'hôte."
      },
      {
        text: "Quel est le rôle épidémiologique d'un porteur sain dans la transmission des maladies infectieuses ?",
        options: [
          { text: "Il héberge et excrète l'agent pathogène sans présenter de symptômes cliniques", isCorrect: true },
          { text: "Il est immunisé naturellement et ne peut pas transmettre l'infection à autrui", isCorrect: false },
          { text: "Il développe une infection subclinique qui évolue vers la guérison spontanée", isCorrect: false },
          { text: "Il présente une infection chronique symptomatique à faible taux de transmission", isCorrect: false }
        ],
        explanation: "Le porteur sain (ou asymptomatique) est une source majeure de diffusion car il n'est pas identifié et ne modifie pas son comportement. Exemples : porteurs de méningocoques (10-25 % de la population), porteurs d'Haemophilus influenzae b, ou porteurs asymptomatiques de SARS-CoV-2. Ils représentent un défi majeur pour le contrôle épidémique."
      },
      {
        text: "Quelle mesure barrière est la plus efficace pour prévenir la transmission par contact direct ?",
        options: [
          { text: "L'hygiène des mains par friction hydroalcoolique avant et après chaque soin", isCorrect: true },
          { text: "Le port du masque chirurgical par le patient et les visiteurs entrants", isCorrect: false },
          { text: "La désinfection biquotidienne des surfaces avec un détergent alcalin", isCorrect: false },
          { text: "L'isolement géographique du patient en chambre individuelle hermétique", isCorrect: false }
        ],
        explanation: "La friction hydroalcoolique (SHA) est la mesure numéro un en hygiène hospitalière : elle réduit de 80 % la transmission des agents pathogènes par les mains des soignants. L'OMS recommande les 5 moments de l'hygiène des mains. La SHA est plus efficace que le lavage au savon (sauf si mains souillées) et agit en 20 à 30 secondes."
      }
    ]
  },

  // ─── Quiz 5 ─── Immunité anti-infectieuse
  {
    title: "Immunité anti-infectieuse — réponse innée et adaptative face aux agents pathogènes",
    description: "Comprendre les mécanismes de la réponse immunitaire innée et adaptative mobilisés contre les différents agents infectieux.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: "Immunité anti-infectieuse — réponse innée et adaptative face aux agents pathogènes",
    difficulty: "intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la première ligne de défense de l'immunité innée contre les agents infectieux ?",
        options: [
          { text: "Les barrières physico-chimiques (peau, muqueuses, pH acide, cils vibratiles)", isCorrect: true },
          { text: "Les anticorps préformés de la mémoire immunologique adaptative", isCorrect: false },
          { text: "Les lymphocytes T cytotoxiques CD8 de la réponse cellulaire spécifique", isCorrect: false },
          { text: "Les plasmocytes producteurs d'immunoglobulines de classe G et A", isCorrect: false }
        ],
        explanation: "Les barrières constitutives forment la première ligne : peau intacte (kératine), muqueuses avec mucus et cils (appareil muco-ciliaire respiratoire), pH acide gastrique (HCl), lysozyme des larmes et salive, flore commensale compétitive. Ces barrières empêchent la pénétration des agents pathogènes sans nécessiter de reconnaissance spécifique préalable."
      },
      {
        text: "Quel est le rôle des récepteurs Toll-like (TLR) dans l'immunité innée ?",
        options: [
          { text: "Reconnaître les motifs moléculaires conservés des pathogènes (PAMP) et déclencher l'inflammation", isCorrect: true },
          { text: "Présenter les antigènes peptidiques aux lymphocytes T naïfs du ganglion", isCorrect: false },
          { text: "Sécréter des anticorps neutralisants contre les antigènes bactériens", isCorrect: false },
          { text: "Induire l'apoptose des cellules infectées par des virus intracellulaires", isCorrect: false }
        ],
        explanation: "Les TLR reconnaissent des motifs moléculaires associés aux pathogènes (PAMP) : TLR4 reconnaît le LPS bactérien, TLR3 détecte l'ARN double brin viral, TLR9 reconnaît les CpG bactériens. Cette reconnaissance active NF-κB et déclenche la production de cytokines pro-inflammatoires (IL-1, IL-6, TNF-α) et d'interférons."
      },
      {
        text: "Comment les cellules NK (natural killer) détruisent-elles les cellules infectées par un virus ?",
        options: [
          { text: "En reconnaissant l'absence de CMH I sur les cellules infectées et en induisant l'apoptose", isCorrect: true },
          { text: "En sécrétant des anticorps spécifiques dirigés contre les antigènes viraux", isCorrect: false },
          { text: "En phagocytant directement les virions libres présents dans le milieu extérieur", isCorrect: false },
          { text: "En activant le système du complément par la voie des lectines mannose", isCorrect: false }
        ],
        explanation: "Les cellules NK exercent une surveillance : elles tuent les cellules qui sous-expriment le CMH de classe I (downregulation fréquente lors des infections virales pour échapper aux LT CD8). Elles utilisent des perforines et granzymes pour induire l'apoptose, et peuvent aussi tuer par ADCC (cytotoxicité cellulaire dépendante des anticorps)."
      },
      {
        text: "Quelle est la différence fondamentale entre l'immunité humorale et l'immunité cellulaire ?",
        options: [
          { text: "L'humorale implique des anticorps (LB/plasmocytes), la cellulaire des lymphocytes T effecteurs", isCorrect: true },
          { text: "L'humorale combat les virus intracellulaires, la cellulaire les bactéries extracellulaires", isCorrect: false },
          { text: "L'humorale est non spécifique et rapide, la cellulaire est spécifique et lente", isCorrect: false },
          { text: "L'humorale nécessite une présentation par CMH II, la cellulaire par CMH III", isCorrect: false }
        ],
        explanation: "L'immunité humorale (médiée par les anticorps produits par les plasmocytes issus des lymphocytes B) est efficace contre les pathogènes extracellulaires et les toxines. L'immunité cellulaire (lymphocytes T CD4 auxiliaires et CD8 cytotoxiques) est indispensable contre les agents intracellulaires (virus, mycobactéries, Listeria). Les deux branches coopèrent."
      },
      {
        text: "Quel mécanisme permet aux macrophages d'éliminer les bactéries phagocytées ?",
        options: [
          { text: "La fusion phagosome-lysosome produisant espèces réactives de l'oxygène et enzymes", isCorrect: true },
          { text: "La sécrétion d'immunoglobulines M neutralisantes dans le phagosome formé", isCorrect: false },
          { text: "L'activation du complément intracellulaire par la voie des lectines", isCorrect: false },
          { text: "La présentation des antigènes bactériens au CMH I pour lyse par CD8", isCorrect: false }
        ],
        explanation: "Après phagocytose, la bactérie se retrouve dans un phagosome qui fusionne avec un lysosome (phagolysosme). Les bactéries sont tuées par les dérivés réactifs de l'oxygène (burst oxydatif via NADPH oxydase), le monoxyde d'azote (NO), les enzymes lytiques (lysozyme, protéases) et le pH acide. Certaines bactéries (Mycobacterium, Listeria) ont développé des mécanismes pour échapper à cette destruction."
      },
      {
        text: "Quelle est la fonction des lymphocytes T CD4 auxiliaires (helper) dans la réponse adaptive ?",
        options: [
          { text: "Orchestrer la réponse immune en sécrétant des cytokines activant LB et CD8", isCorrect: true },
          { text: "Lyser directement les cellules infectées grâce aux perforines et granzymes", isCorrect: false },
          { text: "Produire des immunoglobulines de classe IgG et IgA contre les pathogènes", isCorrect: false },
          { text: "Phagocyter les corps apoptotiques des cellules infectées détruites", isCorrect: false }
        ],
        explanation: "Les LT CD4 sont les chefs d'orchestre de la réponse adaptive : selon les cytokines du microenvironnement, ils se différencient en Th1 (activation macrophages/CD8 contre intracellulaires), Th2 (activation LB/IgE contre parasites), Th17 (recrutement neutrophiles contre champignons/bactéries extracellulaires), ou Treg (régulation). Leur déplétion par le VIH explique le SIDA."
      },
      {
        text: "Qu'est-ce que la mémoire immunologique et quel est son intérêt clinique en vaccination ?",
        options: [
          { text: "Des lymphocytes B et T mémoires permettant une réponse secondaire plus rapide et intense", isCorrect: true },
          { text: "La capacité du complément à maintenir une activation chronique après infection", isCorrect: false },
          { text: "La persistance d'anticorps naturels non spécifiques après une infection guérie", isCorrect: false },
          { text: "L'induction d'une tolérance croisée entre pathogènes de la même famille", isCorrect: false }
        ],
        explanation: "Après une primo-infection ou une vaccination, des lymphocytes B et T mémoires à longue durée de vie persistent. Lors d'un second contact avec l'antigène, la réponse secondaire est : plus rapide (quelques heures vs 7-10 jours), plus intense (taux d'anticorps plus élevés), et de meilleure qualité (affinité accrue, switch isotypique vers IgG). C'est le principe de la vaccination et des rappels."
      },
      {
        text: "Quel mécanisme d'évasion immunitaire permet au Staphylococcus aureus d'inhiber la phagocytose ?",
        options: [
          { text: "La protéine A lie les IgG par leur fragment Fc, empêchant l'opsonisation efficace", isCorrect: true },
          { text: "La production de superantigènes activant tous les lymphocytes T de manière spécifique", isCorrect: false },
          { text: "La formation d'un biofilm isolant les bactéries des cellules phagocytaires mobiles", isCorrect: false },
          { text: "La sécrétion de leucocidines lysant uniquement les lymphocytes B activés", isCorrect: false }
        ],
        explanation: "La protéine A (SpA) de S. aureus se fixe au fragment Fc des IgG, les orientant tête-bêche et les rendant incapables de se lier aux récepteurs Fc des phagocytes (FcγR). Cette stratégie empêche l'opsonisation et la phagocytose. S. aureus possède d'autres facteurs d'évasion : leucocidine de Panton-Valentine (destruction des leucocytes), coagulase (fibrine protectrice), TSST-1 (superantigène)."
      }
    ]
  }
];
