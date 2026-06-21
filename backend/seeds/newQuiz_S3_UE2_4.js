// UE 2.4 - Processus traumatiques (Semestre 3)
module.exports = [
  {
    title: "Traumatologie osseuse — fractures, entorses et luxations",
    description: "Comprendre les mécanismes lésionnels, la classification et la prise en charge des traumatismes ostéo-articulaires courants.",
    semester: "Semestre 3",
    category: "UE 2.4 - Processus traumatiques",
    chapter: "Traumatologie osseuse — fractures, entorses et luxations",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la définition d'une fracture ouverte (ou exposée) ?",
        options: [
          { text: "Rupture osseuse avec communication entre le foyer de fracture et le milieu extérieur via une plaie cutanée", isCorrect: true },
          { text: "Rupture osseuse associée à un déplacement important des fragments dans les tissus mous environnants", isCorrect: false },
          { text: "Rupture osseuse survenant sur un os pathologique fragilisé par une tumeur ou une ostéoporose sévère", isCorrect: false },
          { text: "Rupture osseuse intéressant les deux corticales sans atteinte du périoste ni des parties molles", isCorrect: false }
        ],
        explanation: "Une fracture ouverte est caractérisée par une communication entre le foyer de fracture et l'extérieur à travers une solution de continuité cutanée, exposant l'os au risque d'infection."
      },
      {
        text: "Quel signe clinique est pathognomonique d'une fracture diaphysaire déplacée des os longs ?",
        options: [
          { text: "La douleur exquise à la palpation localisée au point de fracture avec irradiation distale", isCorrect: false },
          { text: "La mobilité anormale du membre avec crépitement osseux à la mobilisation passive", isCorrect: true },
          { text: "L'impotence fonctionnelle totale associée à un hématome localisé en regard du foyer", isCorrect: false },
          { text: "L'œdème important et diffus du membre avec augmentation de la chaleur locale cutanée", isCorrect: false }
        ],
        explanation: "La mobilité anormale avec crépitement osseux est pathognomonique d'une fracture déplacée : elle témoigne de la rupture de la continuité osseuse avec déplacement des fragments."
      },
      {
        text: "Selon la classification de Cauchoix-Duparc, quelle est la caractéristique d'une fracture ouverte de stade III ?",
        options: [
          { text: "Plaie punctiforme de l'extérieur vers l'intérieur, sans contusion cutanée notable ni perte de substance", isCorrect: false },
          { text: "Plaie contuse avec risque de nécrose cutanée secondaire mais sans perte de substance immédiate", isCorrect: false },
          { text: "Perte de substance cutanée étendue imposant un geste plastique pour couvrir le foyer de fracture", isCorrect: true },
          { text: "Fracture avec atteinte vasculo-nerveuse associée mettant en jeu la viabilité du membre distal", isCorrect: false }
        ],
        explanation: "Le stade III de Cauchoix-Duparc correspond à une perte de substance cutanée majeure rendant impossible la fermeture cutanée directe, nécessitant une couverture chirurgicale par lambeau ou greffe."
      },
      {
        text: "Qu'est-ce qui distingue une entorse bénigne d'une entorse grave sur le plan anatomique ?",
        options: [
          { text: "L'entorse bénigne atteint un seul faisceau ligamentaire partiellement, l'entorse grave entraîne une rupture ligamentaire totale ou arrachement osseux", isCorrect: true },
          { text: "L'entorse bénigne survient uniquement sur des articulations périphériques, l'entorse grave touche exclusivement les grosses articulations portantes", isCorrect: false },
          { text: "L'entorse bénigne se traite par immobilisation plâtrée courte, l'entorse grave nécessite obligatoirement une réparation chirurgicale immédiate", isCorrect: false },
          { text: "L'entorse bénigne provoque un hématome articulaire limité, l'entorse grave s'accompagne d'un épanchement synovial abondant réactionnel", isCorrect: false }
        ],
        explanation: "L'entorse bénigne correspond à une distension ou déchirure partielle ligamentaire sans instabilité, tandis que l'entorse grave implique une rupture totale ou un arrachement osseux avec instabilité articulaire."
      },
      {
        text: "Dans la luxation de l'épaule antéro-interne (la plus fréquente), quelle position caractéristique adopte le membre supérieur ?",
        options: [
          { text: "Le bras est en abduction forcée, rotation externe, avec le coude fléchi à 90° et l'avant-bras en supination", isCorrect: false },
          { text: "Le bras est en légère abduction, rotation externe irréductible, le moignon de l'épaule présente un aspect en épaulette", isCorrect: true },
          { text: "Le bras est collé au corps en adduction et rotation interne, avec une saillie postérieure de la tête humérale", isCorrect: false },
          { text: "Le bras est en abduction modérée avec une rotation neutre et un raccourcissement apparent du membre supérieur", isCorrect: false }
        ],
        explanation: "La luxation antéro-interne de l'épaule se caractérise par un bras en abduction-rotation externe irréductible, un signe de l'épaulette (saillie acromiale), et une vacuité de la glène à la palpation."
      },
      {
        text: "Quelle complication vasculaire doit être systématiquement recherchée devant une fracture de l'extrémité inférieure du fémur ?",
        options: [
          { text: "La lésion de l'artère fémorale superficielle au niveau du canal de Hunter par le fragment proximal", isCorrect: false },
          { text: "La lésion de l'artère poplitée par le fragment distal bascule en arrière sous l'action des jumeaux", isCorrect: true },
          { text: "La lésion de l'artère tibiale antérieure lors de son passage dans la loge antérieure de jambe", isCorrect: false },
          { text: "La lésion de l'artère iliaque externe par le fragment proximal lors des fractures à grand déplacement", isCorrect: false }
        ],
        explanation: "L'artère poplitée est fixée dans son segment inférieur et peut être lésée par le fragment distal du fémur qui bascule en arrière sous la traction des muscles gastrocnémiens (jumeaux)."
      },
      {
        text: "Quelle est la règle de base pour l'immobilisation provisoire d'une fracture des os longs avant le transport ?",
        options: [
          { text: "Immobiliser uniquement l'articulation la plus proche du foyer de fracture pour éviter tout déplacement secondaire", isCorrect: false },
          { text: "Immobiliser les deux articulations sus- et sous-jacentes au foyer de fracture sans tenter de réduction", isCorrect: true },
          { text: "Immobiliser le foyer de fracture en position de légère flexion afin de détendre les muscles périfocaux", isCorrect: false },
          { text: "Immobiliser uniquement l'articulation distale en position fonctionnelle pour limiter la gêne du patient", isCorrect: false }
        ],
        explanation: "L'immobilisation provisoire d'une fracture doit toujours englober les deux articulations adjacentes (sus- et sous-jacentes) pour neutraliser les forces musculaires qui tendent à déplacer les fragments."
      },
      {
        text: "Quel signe radiologique traduit une fracture en torus (ou boursouflement) typique de l'enfant ?",
        options: [
          { text: "Trait de fracture complet traversant les deux corticales avec déplacement angulaire des fragments osseux", isCorrect: false },
          { text: "Incurvation diaphysaire diffuse sans trait net, témoignant d'une déformation plastique des corticales immatures", isCorrect: false },
          { text: "Condensation et déformation localisée d'une corticale en relief sans trait de fracture net visible", isCorrect: true },
          { text: "Liseré clair sous-périosté décollé sur toute la longueur de la diaphyse avec réaction périostée diffuse", isCorrect: false }
        ],
        explanation: "La fracture en torus est propre à l'os immature de l'enfant : la corticale cède en compression et se déforme en relief (boursouflement) sans qu'il y ait de trait de fracture franc, car l'os est plus plastique."
      }
    ]
  },
  {
    title: "Brûlures — classification, surface corporelle atteinte et soins infirmiers",
    description: "Maîtriser la classification des brûlures, l'évaluation de la surface cutanée brûlée et les principes de prise en charge infirmière en phase aiguë.",
    semester: "Semestre 3",
    category: "UE 2.4 - Processus traumatiques",
    chapter: "Brûlures — classification, surface corporelle atteinte et soins infirmiers",
    difficulty: "medium",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Comment est définie une brûlure du deuxième degré superficiel (ou phlyctène) sur le plan histologique ?",
        options: [
          { text: "Atteinte de l'épiderme seul avec nécrose cellulaire limitée à la couche cornée et la couche de Malpighi", isCorrect: false },
          { text: "Atteinte de l'épiderme en totalité et du derme superficiel avec conservation des annexes cutanées épidermiques", isCorrect: true },
          { text: "Destruction complète de l'épiderme et du derme profond avec atteinte partielle de l'hypoderme sous-jacent", isCorrect: false },
          { text: "Destruction totale de l'épiderme, du derme et de l'hypoderme avec carbonisation des tissus profonds", isCorrect: false }
        ],
        explanation: "Le 2e degré superficiel atteint l'épiderme et le derme superficiel tout en préservant les annexes cutanées (follicules pileux, glandes sudoripares), ce qui permet une cicatrisation spontanée en 10 à 15 jours."
      },
      {
        text: "La règle des neuf de Wallace permet d'évaluer la surface corporelle brûlée. Quelle valeur est attribuée à chaque membre inférieur chez l'adulte ?",
        options: [
          { text: "9 % de la surface corporelle totale, soit 4,5 % pour la cuisse et 4,5 % pour la jambe et le pied", isCorrect: false },
          { text: "18 % de la surface corporelle totale, soit 9 % pour la face antérieure et 9 % pour la face postérieure", isCorrect: true },
          { text: "14 % de la surface corporelle totale, soit 7 % pour le segment crural et 7 % pour le segment jambier", isCorrect: false },
          { text: "27 % de la surface corporelle totale, répartis entre cuisse, jambe, pied et région fessière homolatérale", isCorrect: false }
        ],
        explanation: "Selon la règle des 9 de Wallace chez l'adulte, chaque membre inférieur représente 18 % de la surface corporelle totale (9 % pour la face antérieure et 9 % pour la face postérieure)."
      },
      {
        text: "Quel critère clinique définit la gravité d'une brûlure selon le référentiel Baux et impose une hospitalisation en centre spécialisé ?",
        options: [
          { text: "Un score de Baux simple (âge + % SCB) supérieur ou égal à 60, quel que soit le degré des lésions", isCorrect: false },
          { text: "Un score de Baux simple (âge + % SCB) supérieur ou égal à 100 ou un score de Baux révisé élevé", isCorrect: true },
          { text: "Un score de Baux simple (âge + % SCB) supérieur ou égal à 40 associé à des lésions du 3e degré", isCorrect: false },
          { text: "Un score de Baux simple (âge + % SCB) supérieur ou égal à 80 uniquement chez les patients âgés de plus de 60 ans", isCorrect: false }
        ],
        explanation: "Un score de Baux simple ≥ 100 (âge + % de surface corporelle brûlée) ou un Baux révisé élevé (prenant en compte l'inhalation) oriente vers un pronostic sévère et nécessite une prise en charge en unité spécialisée de brûlologie."
      },
      {
        text: "Quelle est la formule de Parkland utilisée pour le remplissage vasculaire des 24 premières heures chez le brûlé grave ?",
        options: [
          { text: "2 mL × poids (kg) × % SCB de Ringer lactate, la moitié dans les 8 premières heures et l'autre moitié en 16 h", isCorrect: false },
          { text: "4 mL × poids (kg) × % SCB de Ringer lactate, la moitié dans les 8 premières heures et l'autre moitié en 16 h", isCorrect: true },
          { text: "4 mL × poids (kg) × % SCB de sérum salé isotonique 0,9 %, administrés uniformément sur 24 heures", isCorrect: false },
          { text: "3 mL × poids (kg) × % SCB de colloïdes, la moitié dans les 6 premières heures puis le reste en 18 h", isCorrect: false }
        ],
        explanation: "La formule de Parkland préconise 4 mL × poids (kg) × % SCB de Ringer lactate sur 24 h, avec la moitié administrée dans les 8 premières heures (depuis l'heure de la brûlure) et l'autre moitié en 16 h."
      },
      {
        text: "Pourquoi la brûlure du 3e degré est-elle indolore à la stimulation tact ile directe de la zone lésée ?",
        options: [
          { text: "La destruction tissulaire entraîne une libération massive d'endorphines endogènes inhibant la transmission nociceptive locale", isCorrect: false },
          { text: "La destruction totale de l'épiderme et du derme a détruit les terminaisons nerveuses sensitives cutanées", isCorrect: true },
          { text: "La nécrose cutanée crée une barrière eschare imperméable qui empêche la stimulation des nocicepteurs sous-jacents", isCorrect: false },
          { text: "La vasodilatation réflexe locale libère des médiateurs analgésiques qui saturent les récepteurs de la douleur", isCorrect: false }
        ],
        explanation: "La brûlure du 3e degré détruit la totalité des couches cutanées jusqu'au derme profond inclus, emportant ainsi toutes les terminaisons nerveuses sensitives, ce qui rend la zone anesthésiée au toucher."
      },
      {
        text: "Quel est le principal risque infectieux spécifique de la brûlure étendue en phase secondaire (J3 à J21) ?",
        options: [
          { text: "La septicémie à Staphylococcus aureus résistant à la méthicilline provenant d'une contamination croisée nosocomiale", isCorrect: false },
          { text: "L'infection à Pseudomonas aeruginosa colonisant l'escarre et pouvant diffuser vers une septicémie grave", isCorrect: true },
          { text: "La candidose systémique favorisée par l'antibiothérapie préventive prolongée et l'immunodépression relative", isCorrect: false },
          { text: "Le tétanos par contamination tellurique lors de brûlures chimiques survenant en milieu agricole ou industriel", isCorrect: false }
        ],
        explanation: "Pseudomonas aeruginosa est l'agent bactérien le plus redouté en brûlologie : il colonise facilement les zones nécrotiques humides de l'escarre et peut provoquer une septicémie grave avec potentiel de choc septique."
      },
      {
        text: "Quelle surveillance infirmière est prioritaire dans les premières 48 heures chez un brûlé avec inhalation de fumées suspectée ?",
        options: [
          { text: "La surveillance rapprochée de la diurèse horaire, de la pression artérielle et de l'hémoglobinémie en raison des déperditions plasmatiques", isCorrect: false },
          { text: "La surveillance continue de la SpO2, de la fréquence respiratoire et des signes d'obstruction des voies aériennes supérieures", isCorrect: true },
          { text: "La surveillance de la température centrale et des frissons témoignant d'une infection précoce des voies aériennes inférieures", isCorrect: false },
          { text: "La surveillance de la glycémie capillaire et de l'ionogramme sanguin du fait du catabolisme protéique et glucidique intense", isCorrect: false }
        ],
        explanation: "En cas d'inhalation de fumées, l'œdème laryngé peut survenir rapidement dans les premières heures et compromettre la liberté des voies aériennes. La SpO2, la fréquence respiratoire et les signes de détresse respiratoire sont donc la priorité de surveillance."
      },
      {
        text: "Lors de la réalisation d'un pansement de brûlure du 2e degré superficiel, quelle technique est recommandée pour le nettoyage de la plaie ?",
        options: [
          { text: "Friction vigoureuse avec une compresse sèche stérile pour débrider les phlyctènes et préparer le lit de la plaie", isCorrect: false },
          { text: "Nettoyage doux au savon antiseptique ou à l'eau stérile avec rinçage, puis séchage par tamponnement sans friction", isCorrect: true },
          { text: "Application d'alcool à 70° pour désinfecter la surface brûlée suivie d'un rinçage abondant à l'eau stérile froide", isCorrect: false },
          { text: "Irrigation à l'eau oxygénée à 3 % pour détruire les germes anaérobies puis rinçage au sérum physiologique tiède", isCorrect: false }
        ],
        explanation: "Le nettoyage d'une brûlure doit être doux pour ne pas traumatiser davantage les tissus lésés : on utilise un savon doux ou une solution adaptée, avec rinçage à l'eau stérile et séchage par tamponnement pour préserver les tissus viables."
      }
    ]
  },
  {
    title: "Traumatismes crâniens et rachidiens — surveillance neurologique",
    description: "Analyser les mécanismes, la classification et la prise en charge des traumatismes crâniens et rachidiens, avec focus sur la surveillance neurologique infirmière.",
    semester: "Semestre 3",
    category: "UE 2.4 - Processus traumatiques",
    chapter: "Traumatismes crâniens et rachidiens — surveillance neurologique",
    difficulty: "hard",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Selon la classification de Glasgow (GCS), quel score total définit un traumatisme crânien grave ?",
        options: [
          { text: "Un score de Glasgow inférieur ou égal à 8 persistant après stabilisation hémodynamique et correction d'une hypoxie", isCorrect: true },
          { text: "Un score de Glasgow inférieur ou égal à 12 associé à une perte de connaissance initiale de plus de 30 minutes", isCorrect: false },
          { text: "Un score de Glasgow inférieur ou égal à 10 documenté dans les premières heures suivant le traumatisme initial", isCorrect: false },
          { text: "Un score de Glasgow inférieur ou égal à 6 avec absence de réponse motrice aux stimulations nociceptives bilatérales", isCorrect: false }
        ],
        explanation: "Un traumatisme crânien est défini comme grave lorsque le score de Glasgow est ≤ 8 après stabilisation (correction d'une hypoxie ou d'un état de choc), ce seuil témoignant d'une atteinte cérébrale significative avec risque vital."
      },
      {
        text: "Quelle est la signification physiopathologique d'une anisocorie (inégalité pupillaire) apparaissant après un traumatisme crânien ?",
        options: [
          { text: "Elle traduit une atteinte directe du nerf optique homolatéral par le choc, responsable d'une diminution du réflexe photomoteur", isCorrect: false },
          { text: "Elle évoque une compression du III (nerf oculo-moteur) par une hernie temporale liée à un hématome expansif ou un œdème cérébral", isCorrect: true },
          { text: "Elle reflète un spasme vasculaire artériel de l'artère communicante postérieure entraînant une ischémie du tronc cérébral", isCorrect: false },
          { text: "Elle résulte d'une stimulation sympathique bilatérale asymétrique survenant lors d'une hypertension intracrânienne modérée", isCorrect: false }
        ],
        explanation: "Une anisocorie post-traumatique, surtout si la pupille mydriasique est aréactive, signe une compression du III par une hernie uncale (engagement temporal) : le lobe temporal est refoulé et comprime le nerf oculo-moteur commun, signe d'alarme majeur."
      },
      {
        text: "Quelle est la différence physiopathologique entre un hématome extra-dural (HED) et un hématome sous-dural aigu (HSD) ?",
        options: [
          { text: "L'HED résulte d'un saignement veineux lent entre la dure-mère et l'arachnoïde ; l'HSD résulte d'un saignement artériel rapide entre le crâne et la dure-mère", isCorrect: false },
          { text: "L'HED résulte le plus souvent d'un saignement artériel (artère méningée moyenne) entre le crâne et la dure-mère ; l'HSD résulte d'un déchirement veineux entre la dure-mère et l'arachnoïde", isCorrect: true },
          { text: "L'HED résulte d'une contusion du parenchyme cérébral diffuse ; l'HSD résulte d'une rupture des artères corticales en surface", isCorrect: false },
          { text: "L'HED résulte d'un saignement veineux au niveau du sinus longitudinal supérieur ; l'HSD résulte d'une lésion de l'artère sylvienne", isCorrect: false }
        ],
        explanation: "L'HED est classiquement artériel (artère méningée moyenne lésée lors d'une fracture temporale), s'accumule entre l'os et la dure-mère ; l'HSD aigu résulte d'un déchirement des veines ponts reliant le cortex au sinus veineux, entre la dure-mère et l'arachnoïde."
      },
      {
        text: "Qu'est-ce que l'intervalle libre dans le tableau clinique d'un hématome extra-dural et quelle est sa durée habituelle ?",
        options: [
          { text: "Période de confusion post-traumatique immédiate de 5 à 10 minutes suivant le choc, avant l'installation d'un déficit neurologique focal", isCorrect: false },
          { text: "Période de conscience normale apparente après le traumatisme, durant quelques minutes à quelques heures, précédant l'aggravation neurologique", isCorrect: true },
          { text: "Période d'amnésie lacunaire de 24 à 48 heures couvrant les événements entourant le traumatisme crânien léger à modéré", isCorrect: false },
          { text: "Période de stabilisation clinique après neurochirurgie, durant 3 à 5 jours, avant la mobilisation progressive du patient", isCorrect: false }
        ],
        explanation: "L'intervalle libre est un retour apparent à la conscience normale après la perte de connaissance initiale du choc, pouvant durer de quelques minutes à quelques heures, avant que l'hématome expansif ne provoque une dégradation neurologique secondaire."
      },
      {
        text: "Dans la prise en charge pré-hospitalière d'un traumatisme du rachis cervical, quelle mesure est absolument prioritaire avant tout mobilisation du patient ?",
        options: [
          { text: "La pose d'une voie veineuse périphérique de bon calibre pour débuter un remplissage vasculaire préventif contre le choc spinal", isCorrect: false },
          { text: "La réalisation d'un bilan neurologique complet avec testing moteur et sensitif des quatre membres avant tout geste", isCorrect: false },
          { text: "L'immobilisation cervicale par collier rigide adapté à la taille du patient et maintien de l'axe tête-cou-tronc", isCorrect: true },
          { text: "L'administration d'une dose de charge de méthylprednisolone IV selon le protocole NASCIS pour limiter les lésions médullaires", isCorrect: false }
        ],
        explanation: "Devant tout traumatisme rachidien cervical suspecté, l'immobilisation immédiate par collier cervical rigide et le respect strict de l'axe tête-cou-tronc priment sur tout autre geste pour prévenir une lésion médullaire secondaire lors des mobilisations."
      },
      {
        text: "Quel est le mécanisme lésionnel le plus fréquemment responsable des traumatismes cervicaux de type « whiplash » (coup du lapin) ?",
        options: [
          { text: "Compression axiale directe par chute sur le vertex entraînant un tassement des vertèbres cervicales inférieures C5-C6", isCorrect: false },
          { text: "Hyperflexion-hyperextension brusque du rachis cervical lors d'un choc arrière en véhicule, sans contact crânien direct", isCorrect: true },
          { text: "Flexion latérale forcée du rachis cervical lors d'un choc latéral avec fracture des massifs articulaires homolatéraux", isCorrect: false },
          { text: "Rotation cervicale forcée dépas sant les amplitudes physiologiques lors d'une manœuvre de torsion brutale du tronc", isCorrect: false }
        ],
        explanation: "Le whiplash est causé par une accélération-décélération rapide tête-cou lors d'un choc arrière : l'inertie crée une hyperextension puis hyperflexion successives sans impact crânien, lésant les structures disco-ligamentaires cervicales."
      },
      {
        text: "Qu'évalue précisément la composante « Meilleure réponse motrice » (M) de l'échelle de Glasgow et quelle est sa cotation maximale ?",
        options: [
          { text: "Elle évalue la force segmentaire des quatre membres aux stimulations volontaires, cotée de 1 (aucune force) à 5 (force normale)", isCorrect: false },
          { text: "Elle évalue la réponse aux ordres simples et aux stimulations nociceptives (obéit, localise, évite, flexion, extension, nulle), cotée de 1 à 6", isCorrect: true },
          { text: "Elle évalue la qualité des mouvements spontanés du patient au repos et lors des soins infirmiers, cotée de 0 à 6 selon leur complexité", isCorrect: false },
          { text: "Elle évalue la résistance à la mobilisation passive des membres et la présence de spasticité ou de rigidité, cotée de 1 à 5", isCorrect: false }
        ],
        explanation: "La composante M du GCS évalue les réponses motrices aux ordres et à la douleur : M6 (obéit aux ordres), M5 (localise la douleur), M4 (retrait), M3 (flexion stéréotypée), M2 (extension stéréotypée), M1 (aucune réponse), pour un maximum de 6."
      },
      {
        text: "Lors de la surveillance neurologique d'un patient hospitalisé après un traumatisme crânien modéré, quel signe impose une alerte médicale immédiate ?",
        options: [
          { text: "L'apparition de céphalées légères à modérées dans les premières heures suivant le traumatisme sans autres signes associés", isCorrect: false },
          { text: "Une nausée isolée survenant dans les deux heures suivant l'admission, sans vomissement ni modification du score de Glasgow", isCorrect: false },
          { text: "Une dégradation du score de Glasgow de 2 points ou plus par rapport au score de référence établi à l'admission", isCorrect: true },
          { text: "Une agitation ou une désorientation temporo-spatiale persistant au-delà de la sixième heure post-traumatique chez un adulte jeune", isCorrect: false }
        ],
        explanation: "Toute chute du GCS de 2 points ou plus par rapport au score de référence constitue un signe d'alerte neurologique majeur, pouvant témoigner d'un hématome expansif secondaire ou d'un œdème cérébral croissant nécessitant une intervention urgente."
      }
    ]
  }
];
