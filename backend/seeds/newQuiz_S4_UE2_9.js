module.exports = [
  {
    title: "Oncologie fondamentale — carcinogenèse et classification des tumeurs",
    description: "Comprendre les mécanismes de la carcinogenèse, les différences entre tumeurs bénignes et malignes, et les systèmes de classification utilisés en oncologie.",
    semester: "Semestre 4",
    category: "UE 2.9 - Processus tumoraux",
    chapter: "Carcinogenèse et classification des tumeurs",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle caractéristique distingue fondamentalement une tumeur maligne d'une tumeur bénigne ?",
        options: [
          { text: "La tumeur maligne présente une croissance lente et bien délimitée par une capsule fibreuse", isCorrect: false },
          { text: "La tumeur maligne est capable d'envahir les tissus adjacents et de former des métastases à distance", isCorrect: true },
          { text: "La tumeur maligne est toujours douloureuse et provoque une fièvre persistante dès le début", isCorrect: false },
          { text: "La tumeur maligne se développe exclusivement dans les organes hématopoïétiques comme la moelle osseuse", isCorrect: false }
        ],
        explanation: "La malignité d'une tumeur est définie par sa capacité à envahir localement les tissus adjacents (invasion) et à se disséminer à distance pour former des métastases, contrairement aux tumeurs bénignes qui restent localisées et encapsulées."
      },
      {
        text: "La carcinogenèse chimique se déroule en plusieurs étapes successives. Dans quel ordre correct se succèdent-elles ?",
        options: [
          { text: "Promotion → initiation → progression : la cellule acquiert d'abord une hypersensibilité aux agents chimiques", isCorrect: false },
          { text: "Initiation → promotion → progression : mutation initiale, expansion clonale, puis acquisition de la malignité", isCorrect: true },
          { text: "Progression → promotion → initiation : la tumeur se forme d'abord, puis les mutations s'accumulent rétroactivement", isCorrect: false },
          { text: "Initiation → invasion → métastase : la cellule mutée envahit immédiatement les tissus sans phase de promotion", isCorrect: false }
        ],
        explanation: "La carcinogenèse chimique suit trois étapes : l'initiation (mutation irréversible de l'ADN par un cancérogène), la promotion (expansion clonale des cellules initiées sous l'action d'agents promoteurs) et la progression (accumulation de mutations conférant la malignité et l'invasivité)."
      },
      {
        text: "Qu'est-ce qu'un proto-oncogène dans le contexte de la biologie tumorale ?",
        options: [
          { text: "Un gène suppresseur de tumeur dont l'inactivation bloque la division cellulaire et prévient la prolifération", isCorrect: false },
          { text: "Un gène normal impliqué dans la croissance cellulaire qui, une fois muté, devient un oncogène activateur de prolifération", isCorrect: true },
          { text: "Un gène codant pour des enzymes de réparation de l'ADN dont la surexpression protège contre les mutations", isCorrect: false },
          { text: "Un gène viral inséré dans le génome humain par rétrovirus oncogène et responsable de leucémies virales", isCorrect: false }
        ],
        explanation: "Les proto-oncogènes sont des gènes cellulaires normaux qui régulent la croissance, la différenciation et la survie cellulaire. Leur mutation, amplification ou surexpression les transforme en oncogènes qui stimulent de façon excessive et incontrôlée la prolifération cellulaire."
      },
      {
        text: "Le système TNM est utilisé pour classer les cancers. Que représente la lettre N dans ce système ?",
        options: [
          { text: "Le grade de différenciation cellulaire évalué par anatomopathologie sur la biopsie tumorale", isCorrect: false },
          { text: "Le nombre de mitoses observées par champ microscopique dans la tumeur primitive analysée", isCorrect: false },
          { text: "L'atteinte des ganglions lymphatiques régionaux et l'étendue de l'envahissement ganglionnaire", isCorrect: true },
          { text: "La nécrose intratumorale estimée en pourcentage de la masse totale de la tumeur primitive", isCorrect: false }
        ],
        explanation: "Dans le système TNM : T (Tumeur) décrit la taille et l'extension locale de la tumeur primitive, N (Nœuds lymphatiques, ganglions) évalue l'atteinte ganglionnaire régionale, et M (Métastases) indique la présence ou l'absence de métastases à distance."
      },
      {
        text: "Quelle est la définition d'un carcinome en oncologie ?",
        options: [
          { text: "Une tumeur maligne développée à partir de cellules mésenchymateuses comme les fibroblastes ou les cellules musculaires", isCorrect: false },
          { text: "Une tumeur maligne développée à partir de cellules épithéliales tapissant les organes, glandes ou cavités", isCorrect: true },
          { text: "Une tumeur bénigne de l'épithélium glandulaire sécrétant des hormones en quantité excessive et autonome", isCorrect: false },
          { text: "Une tumeur maligne d'origine hématopoïétique touchant les lymphocytes circulants et les organes lymphoïdes", isCorrect: false }
        ],
        explanation: "Un carcinome est une tumeur maligne d'origine épithéliale (peau, muqueuses, glandes). Les sarcomes sont des tumeurs malignes mésenchymateuses. Les lymphomes et leucémies sont des tumeurs hématopoïétiques. Les adénomes sont des tumeurs bénignes glandulaires."
      },
      {
        text: "Quel rôle joue le gène TP53 dans la prévention du cancer ?",
        options: [
          { text: "Il code pour un récepteur membranaire de facteurs de croissance qui active la signalisation proliférative cellulaire", isCorrect: false },
          { text: "Il stimule l'angiogenèse tumorale en induisant la production de VEGF par les cellules en hypoxie tumorale", isCorrect: false },
          { text: "Il agit comme gardien du génome en induisant l'arrêt du cycle cellulaire ou l'apoptose en cas de lésion ADN", isCorrect: true },
          { text: "Il inhibe la télomérase pour limiter le nombre de divisions cellulaires dans les tissus à renouvellement rapide", isCorrect: false }
        ],
        explanation: "TP53 est le principal gène suppresseur de tumeur. La protéine p53 détecte les lésions de l'ADN et déclenche soit la réparation, soit l'arrêt du cycle cellulaire en G1, soit l'apoptose. Sa mutation est retrouvée dans plus de 50 % des cancers humains."
      },
      {
        text: "Quelle est la différence entre une métastase et une récidive locale d'un cancer ?",
        options: [
          { text: "La récidive locale est toujours plus grave et de moins bon pronostic que la formation de métastases à distance", isCorrect: false },
          { text: "La métastase est une dissémination à distance via le sang ou la lymphe ; la récidive locale est une repousse au site initial", isCorrect: true },
          { text: "La métastase concerne uniquement les cancers de stade IV tandis que la récidive survient exclusivement aux stades I et II", isCorrect: false },
          { text: "La récidive locale et la métastase sont des termes synonymes désignant la même réapparition tumorale après traitement", isCorrect: false }
        ],
        explanation: "La récidive locale désigne la réapparition de la tumeur au même site anatomique après traitement supposément curatif. La métastase est une lésion secondaire formée à distance du site primitif par dissémination de cellules tumorales via la circulation sanguine ou lymphatique."
      },
      {
        text: "Comment appelle-t-on la capacité des cellules tumorales à se détacher de la tumeur primitive et à coloniser un organe distant ?",
        options: [
          { text: "L'angiogenèse tumorale : formation de nouveaux vaisseaux sanguins nourriciers au sein de la masse tumorale", isCorrect: false },
          { text: "La dysplasie cellulaire : altération de la différenciation cellulaire observable à l'examen anatomopathologique", isCorrect: false },
          { text: "La cascade métastatique : processus multi-étapes d'invasion, intravasation, transport, extravasation et colonisation", isCorrect: true },
          { text: "La transformation maligne : conversion d'une cellule normale en cellule tumorale sous l'effet de mutations oncogéniques", isCorrect: false }
        ],
        explanation: "La cascade métastatique comprend : détachement des cellules tumorales, invasion de la matrice extracellulaire, intravasation (entrée dans un vaisseau), survie en circulation, extravasation (sortie du vaisseau) et colonisation du tissu cible pour former une métastase."
      }
    ]
  },
  {
    title: "Traitements anticancéreux — chirurgie, radiothérapie et chimiothérapie",
    description: "Maîtriser les modalités thérapeutiques utilisées en oncologie, leurs mécanismes d'action, leurs indications et leurs principales toxicités.",
    semester: "Semestre 4",
    category: "UE 2.9 - Processus tumoraux",
    chapter: "Traitements anticancéreux",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Quel est le principe d'action principal des agents alkylants utilisés en chimiothérapie anticancéreuse ?",
        options: [
          { text: "Ils inhibent la topoisomérase II et empêchent le relâchement des superhélices d'ADN lors de la réplication cellulaire", isCorrect: false },
          { text: "Ils forment des liaisons covalentes avec les bases de l'ADN, provoquant des ponts inter-brins qui bloquent la réplication", isCorrect: true },
          { text: "Ils bloquent la polymérisation de la tubuline et empêchent la formation du fuseau mitotique lors de la mitose", isCorrect: false },
          { text: "Ils inhibent la dihydrofolate réductase et bloquent la synthèse des précurseurs nucléotidiques indispensables à l'ADN", isCorrect: false }
        ],
        explanation: "Les agents alkylants (cyclophosphamide, cisplatine, carmustine) créent des liaisons covalentes entre les brins d'ADN (pontages inter-brins ou intra-brins), empêchant la séparation des brins et donc la réplication de l'ADN. Les cellules ne peuvent plus se diviser et entrent en apoptose."
      },
      {
        text: "En radiothérapie externe, quel mécanisme biologique explique principalement la mort des cellules tumorales irradiées ?",
        options: [
          { text: "La dénaturation thermique des protéines membranaires suite à l'échauffement local des tissus irradiés", isCorrect: false },
          { text: "L'induction de cassures simple-brin et double-brin de l'ADN par les rayonnements ionisants directs ou via les radicaux libres", isCorrect: true },
          { text: "L'activation des lymphocytes T cytotoxiques par libération d'antigènes tumoraux sous l'effet du rayonnement", isCorrect: false },
          { text: "La destruction des vaisseaux tumoraux par embolisation provoquée par les particules ionisantes administrées localement", isCorrect: false }
        ],
        explanation: "Les rayonnements ionisants agissent principalement en induisant des cassures double-brin de l'ADN, directement ou via la radiolyse de l'eau produisant des radicaux libres. Les cellules incapables de réparer ces lésions entrent en mort mitotique ou en apoptose. L'oxygène potentialise cet effet (effet oxygène)."
      },
      {
        text: "Quelle est la différence fondamentale entre une chirurgie à visée curative et une chirurgie palliative en oncologie ?",
        options: [
          { text: "La chirurgie curative est réservée aux patients de moins de 65 ans ; la chirurgie palliative concerne les patients âgés", isCorrect: false },
          { text: "La chirurgie curative vise l'exérèse complète R0 avec intention de guérison ; la palliative améliore la qualité de vie sans guérir", isCorrect: true },
          { text: "La chirurgie curative n'est pratiquée qu'en cas de tumeur localisée ; la palliative traite toujours les métastases à distance", isCorrect: false },
          { text: "La chirurgie curative inclut systématiquement un curage ganglionnaire extensif ; la palliative se limite à la tumeur primitive", isCorrect: false }
        ],
        explanation: "La chirurgie curative vise une résection complète avec marges saines (R0) dans le but de guérir le patient. La chirurgie palliative ne vise pas la guérison mais soulage des symptômes (occlusion, saignement, douleur) pour améliorer la qualité de vie, même en cas de maladie métastatique non résécable."
      },
      {
        text: "Les taxanes (paclitaxel, docétaxel) exercent leur effet anticancéreux en ciblant quel mécanisme cellulaire ?",
        options: [
          { text: "Ils intercalent leurs molécules entre les bases de l'ADN et bloquent la progression de l'ARN polymérase lors de la transcription", isCorrect: false },
          { text: "Ils stabilisent les microtubules en inhibant leur dépolymérisation, bloquant ainsi le fuseau mitotique en métaphase", isCorrect: true },
          { text: "Ils inhibent la synthèse des purines en bloquant l'enzyme HPRT indispensable à la voie de récupération des bases azotées", isCorrect: false },
          { text: "Ils inhibent les inhibiteurs des CDK et accélèrent la progression anormale du cycle cellulaire jusqu'à la catastrophe mitotique", isCorrect: false }
        ],
        explanation: "Les taxanes se lient à la tubuline polymérisée et empêchent la dépolymérisation des microtubules. Le fuseau mitotique, incapable de se restructurer, reste bloqué, ce qui empêche la séparation des chromosomes en anaphase et provoque l'arrêt en métaphase puis l'apoptose."
      },
      {
        text: "La radiothérapie fractionnée consiste à administrer la dose totale en plusieurs séances. Quel en est le principal avantage biologique ?",
        options: [
          { text: "Elle permet d'augmenter la dose totale délivrée sans limite en multipliant le nombre de séances indéfiniment", isCorrect: false },
          { text: "Elle favorise la réparation des tissus sains entre les séances tout en maintenant l'efficacité sur les cellules tumorales moins réparantes", isCorrect: true },
          { text: "Elle supprime la nécessité de calculer la dose équivalente et simplifie la dosimétrie pour le physicien médical", isCorrect: false },
          { text: "Elle réduit le temps total de traitement et permet de terminer la radiothérapie en une à deux semaines maximum", isCorrect: false }
        ],
        explanation: "Le fractionnement exploite la différence de capacité de réparation entre tissus sains et tissu tumoral. Entre les séances, les cellules saines réparent mieux leurs lésions sub-létales que les cellules tumorales. Cela permet d'administrer des doses tumoricides tout en épargnant les organes critiques adjacents."
      },
      {
        text: "La chimiothérapie néo-adjuvante est administrée avant la chirurgie. Quel est son principal objectif thérapeutique ?",
        options: [
          { text: "Elle vise à éliminer les dernières cellules résiduelles après une exérèse chirurgicale jugée macroscopiquement complète", isCorrect: false },
          { text: "Elle permet de réduire la masse tumorale pour faciliter la chirurgie et traiter précocement les micrométastases potentielles", isCorrect: true },
          { text: "Elle sert à tester la sensibilité de la tumeur aux cytotoxiques uniquement à des fins de recherche et d'essai clinique", isCorrect: false },
          { text: "Elle est administrée en urgence pour stopper une progression rapide avant que le bilan d'extension soit complété", isCorrect: false }
        ],
        explanation: "La chimiothérapie néo-adjuvante précède la chirurgie pour réduire la taille tumorale (downstaging), permettre une chirurgie conservatrice, traiter d'emblée les micrométastases et évaluer la réponse au traitement in vivo. Elle s'oppose à la chimiothérapie adjuvante administrée après la chirurgie."
      },
      {
        text: "Qu'est-ce que la toxicité hématologique des chimiothérapies et pourquoi survient-elle préférentiellement à J10-J14 ?",
        options: [
          { text: "Elle correspond à une destruction des cellules sanguines par dépôt de complexes immuns induits par les cytotoxiques circulants", isCorrect: false },
          { text: "Elle résulte de la destruction des progéniteurs médullaires à renouvellement rapide, dont la durée de vie est d'environ 10-14 jours", isCorrect: true },
          { text: "Elle est causée par une hémolyse intravasculaire directe due à la toxicité chimique des métabolites des cytotoxiques", isCorrect: false },
          { text: "Elle correspond à une dysfonction splénique induisant une séquestration des éléments figurés du sang en excès", isCorrect: false }
        ],
        explanation: "Les chimiothérapies détruisent préférentiellement les cellules à division rapide, dont les progéniteurs hématopoïétiques. Le nadir (point le plus bas des cellules sanguines) survient à J10-J14 car c'est le délai de disparition des cellules matures déjà en circulation au moment de la perfusion, après épuisement des progéniteurs détruits."
      },
      {
        text: "Quel est le mécanisme d'action des thérapies ciblées anti-HER2 comme le trastuzumab (Herceptin) ?",
        options: [
          { text: "Le trastuzumab est un inhibiteur de la tyrosine kinase intracellulaire de HER2 administré par voie orale quotidienne", isCorrect: false },
          { text: "Le trastuzumab est un anticorps monoclonal ciblant le domaine extracellulaire de HER2, bloquant la signalisation proliférative", isCorrect: true },
          { text: "Le trastuzumab est un agent alkylant couplé à un anticorps anti-HER2 qui délivre une charge cytotoxique directement dans la cellule", isCorrect: false },
          { text: "Le trastuzumab est un inhibiteur de mTOR qui bloque la voie PI3K en aval de tous les récepteurs HER de la famille ErbB", isCorrect: false }
        ],
        explanation: "Le trastuzumab est un anticorps monoclonal humanisé qui se fixe sur le domaine IV extracellulaire du récepteur HER2, bloquant sa signalisation proliférative. Il induit également une cytotoxicité cellulaire dépendante des anticorps (ADCC). Il est indiqué dans les cancers du sein et gastriques surexprimant HER2."
      }
    ]
  },
  {
    title: "Soins infirmiers en oncologie — effets secondaires et soutien du patient",
    description: "Identifier les principaux effets secondaires des traitements anticancéreux, maîtriser leur prévention et prise en charge infirmière, et assurer un soutien global au patient atteint de cancer.",
    semester: "Semestre 4",
    category: "UE 2.9 - Processus tumoraux",
    chapter: "Soins infirmiers en oncologie",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Une patiente sous chimiothérapie se plaint de nausées et vomissements sévères depuis 48 heures. Quelle classe médicamenteuse antiémétique est la plus efficace pour les vomissements chimio-induits ?",
        options: [
          { text: "Les antihistaminiques H1 comme la métopimazine, utilisés en première intention pour tous types de vomissements chimio-induits", isCorrect: false },
          { text: "Les antagonistes des récepteurs 5-HT3 (sétrons) comme l'ondansétron, associés aux corticoïdes pour les protocoles hautement émétisants", isCorrect: true },
          { text: "Les benzodiazépines comme le lorazépam, utilisées seules en première intention pour leur action centrale antiémétique directe", isCorrect: false },
          { text: "Les inhibiteurs de la pompe à protons comme l'oméprazole, qui protègent la muqueuse gastrique des dommages chimio-induits", isCorrect: false }
        ],
        explanation: "Les antagonistes des récepteurs 5-HT3 (ondansétron, granisétron) sont les antiémétiques de référence pour les vomissements chimio-induits aigus. Ils sont associés aux corticoïdes (dexaméthasone) et, pour les protocoles hautement émétisants, aux antagonistes des récepteurs NK1 (aprépitant) en prophylaxie trimédicamenteuse."
      },
      {
        text: "Quel est le rôle infirmier prioritaire lors du nadir (J10-J14) d'une chimiothérapie myélosuppressive ?",
        options: [
          { text: "Encourager le patient à reprendre une activité physique intense pour stimuler la production médullaire et accélérer la récupération", isCorrect: false },
          { text: "Surveiller les signes d'infection, appliquer les mesures d'isolement protecteur et éduquer à la prévention des infections", isCorrect: true },
          { text: "Administrer systématiquement une transfusion de concentrés érythrocytaires pour corriger l'anémie avant tout signe clinique", isCorrect: false },
          { text: "Programmer une nouvelle cure de chimiothérapie à demi-dose pour maintenir la pression thérapeutique sur les cellules tumorales", isCorrect: false }
        ],
        explanation: "Au nadir, le patient est en aplasie avec risque majeur d'infection (neutropénie fébrile). Le rôle infirmier prioritaire est de surveiller la température (fièvre > 38,5°C = urgence), appliquer les mesures de protection (chambre protégée, hygiène rigoureuse) et éduquer le patient à reconnaître les signes d'alarme nécessitant un appel immédiat."
      },
      {
        text: "Une mucite de grade 3 est diagnostiquée chez un patient sous chimiothérapie. Quelle prise en charge infirmière est adaptée ?",
        options: [
          { text: "Bains de bouche à la chlorhexidine concentrée toutes les heures et alimentation normale pour maintenir les apports caloriques", isCorrect: false },
          { text: "Bains de bouche pluriquotidiens au bicarbonate, alimentation liquide ou mixée, antalgiques adaptés et surveillance nutritionnelle", isCorrect: true },
          { text: "Arrêt de toute alimentation orale pendant 48 heures et instauration immédiate d'une nutrition parentérale totale exclusive", isCorrect: false },
          { text: "Application locale de corticoïdes en gel pour réduire l'inflammation et poursuite de l'alimentation solide sans restriction", isCorrect: false }
        ],
        explanation: "La mucite de grade 3 (ulcérations sévères, alimentation orale impossible ou très limitée) nécessite des soins de bouche fréquents au sérum physiologique ou bicarbonate, une adaptation de l'alimentation (liquide ou mixée), une antalgie adaptée (palier II ou III), une surveillance nutritionnelle et parfois une nutrition entérale."
      },
      {
        text: "Comment l'infirmière évalue-t-elle le risque de neutropénie fébrile chez un patient sous chimiothérapie ?",
        options: [
          { text: "En mesurant uniquement la température corporelle deux fois par jour et en notifiant le médecin si elle dépasse 37,8°C", isCorrect: false },
          { text: "En contrôlant régulièrement la numération formule sanguine, notamment le taux de polynucléaires neutrophiles et la température", isCorrect: true },
          { text: "En évaluant quotidiennement l'état cutané du patient à la recherche de lésions favorisant l'entrée de germes pathogènes", isCorrect: false },
          { text: "En dosant hebdomadairement la CRP et l'albumine pour anticiper l'apparition d'un syndrome inflammatoire biologique précoce", isCorrect: false }
        ],
        explanation: "La surveillance de la neutropénie repose sur la NFS avec numération des polynucléaires neutrophiles (PNN). Une neutropénie fébrile est définie par PNN < 0,5 G/L associée à une fièvre ≥ 38,5°C ou deux mesures > 38°C à 1 heure d'intervalle. C'est une urgence thérapeutique nécessitant une antibiothérapie probabiliste immédiate."
      },
      {
        text: "Quel soin infirmier est essentiel pour prévenir les réactions cutanées sévères lors d'une radiothérapie externe du sein ?",
        options: [
          { text: "Appliquer une crème solaire haute protection immédiatement avant chaque séance de radiothérapie pour protéger la peau irradiée", isCorrect: false },
          { text: "Éviter les produits irritants, protéger la zone des frottements, utiliser des émollients doux et surveiller l'évolution cutanée", isCorrect: true },
          { text: "Masser vigoureusement la peau irradiée avec de l'huile de paraffine pour stimuler la circulation locale et prévenir la fibrose", isCorrect: false },
          { text: "Appliquer des pansements occlusifs filmogènes sur toute la surface irradiée dès le premier jour de radiothérapie", isCorrect: false }
        ],
        explanation: "Les soins de peau en radiothérapie comprennent : lavage doux à l'eau tiède et savon neutre, séchage sans frotter, vêtements amples en coton, éviction des produits alcoolisés ou parfumés, protection du soleil, application d'émollients prescrits. En cas de radiodermite avérée, des pansements spécifiques sont utilisés selon le grade."
      },
      {
        text: "Comment l'infirmière doit-elle gérer une extravasation de cytostatique vésicant lors d'une perfusion intraveineuse périphérique ?",
        options: [
          { text: "Augmenter le débit de perfusion pour diluer le produit extravasé dans les tissus et limiter la concentration locale", isCorrect: false },
          { text: "Arrêter immédiatement la perfusion, aspirer sans retirer l'aiguille, appliquer des soins spécifiques selon le protocole et alerter le médecin", isCorrect: true },
          { text: "Retirer immédiatement le cathéter, masser la zone extravasée et appliquer de la chaleur pour favoriser la résorption locale", isCorrect: false },
          { text: "Poursuivre la perfusion en déplaçant le cathéter dans une autre veine et compléter la dose totale prescrite sans délai", isCorrect: false }
        ],
        explanation: "En cas d'extravasation de vésicant : arrêt immédiat de la perfusion, aspiration (sans retirer le cathéter) du maximum de produit, retrait du cathéter après aspiration, délimitation de la zone au marqueur, application du traitement spécifique (antidote selon le produit, chaud ou froid), traçabilité et surveillance prolongée. Le massage est contre-indiqué."
      },
      {
        text: "Quelle approche infirmière est recommandée pour évaluer et prendre en charge la douleur chronique d'un patient en soins palliatifs oncologiques ?",
        options: [
          { text: "Attendre que le patient exprime spontanément sa douleur, car l'évaluation systématique crée une anxiété supplémentaire inutile", isCorrect: false },
          { text: "Évaluer la douleur systématiquement à chaque soin avec une échelle validée, adapter le traitement antalgique et réévaluer l'efficacité", isCorrect: true },
          { text: "Administrer systématiquement des morphiniques à horaires fixes sans évaluation pour prévenir toute survenue douloureuse possible", isCorrect: false },
          { text: "Limiter les antalgiques opioïdes aux patients en fin de vie immédiate pour éviter tout risque de dépendance ou de sédation excessive", isCorrect: false }
        ],
        explanation: "La prise en charge de la douleur chronique repose sur une évaluation systématique et régulière avec des échelles validées (EVA, EN, EN comportementale si patient non communicant), un traitement antalgique adapté selon la loi des paliers OMS, une réévaluation de l'efficacité et des effets indésirables, et une communication pluridisciplinaire."
      },
      {
        text: "Quel aspect du soutien psychologique est spécifiquement du ressort infirmier lors de l'annonce d'un diagnostic de cancer ?",
        options: [
          { text: "Réaliser la consultation d'annonce à la place du médecin pour protéger le patient d'une information médicale traumatisante", isCorrect: false },
          { text: "Assurer la consultation soignante post-annonce pour reformuler, évaluer la compréhension, explorer les émotions et orienter vers des ressources", isCorrect: true },
          { text: "Prescrire des anxiolytiques de façon anticipatoire pour prévenir les réactions de détresse psychologique liées à l'annonce", isCorrect: false },
          { text: "Informer la famille du diagnostic avant le patient pour préparer l'entourage à soutenir le malade lors de l'annonce médicale", isCorrect: false }
        ],
        explanation: "Selon le dispositif d'annonce (Plan Cancer), l'infirmière réalise une consultation soignante dédiée après la consultation médicale d'annonce. Elle reformule l'information, évalue la compréhension du patient, explore ses émotions, identifie ses besoins, présente les ressources disponibles (psychologue, assistante sociale, association) et initie le lien de confiance thérapeutique."
      }
    ]
  }
];
