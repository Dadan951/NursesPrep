module.exports = [
  {
    title: "Physiologie cardiaque — cycle cardiaque, débit et pression artérielle",
    description: "Maîtrisez les mécanismes du cycle cardiaque, la régulation du débit cardiaque et les bases de la pression artérielle en physiologie cardiovasculaire.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Physiologie cardiaque",
    difficulty: "Intermédiaire",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Lors de la systole ventriculaire, quelle séquence d'événements se produit dans le ventricule gauche ?",
        options: [
          { text: "Contraction isovolumétrique, puis ouverture de la valve aortique, puis éjection du sang vers l'aorte", isCorrect: true },
          { text: "Ouverture immédiate de la valve aortique, puis contraction isovolumétrique, puis éjection du sang vers l'aorte", isCorrect: false },
          { text: "Contraction isovolumétrique, puis fermeture de la valve mitrale, puis éjection du sang vers l'artère pulmonaire", isCorrect: false },
          { text: "Fermeture de la valve aortique, puis contraction isovolumétrique, puis éjection du sang vers l'artère pulmonaire", isCorrect: false }
        ],
        explanation: "La systole ventriculaire débute par une contraction isovolumétrique (toutes les valves sont fermées, la pression monte sans variation de volume). Quand la pression ventriculaire dépasse la pression aortique (~80 mmHg), la valve aortique s'ouvre et le sang est éjecté vers l'aorte. La valve mitrale se ferme en début de systole, bien avant l'éjection."
      },
      {
        text: "Chez un adulte au repos, le débit cardiaque est estimé à 5 L/min. Si la fréquence cardiaque passe de 70 à 100 bpm sans modification du volume d'éjection systolique, quelle valeur approximative atteint le débit cardiaque ?",
        options: [
          { text: "Environ 7,1 L/min, car le débit est proportionnel à la fréquence cardiaque multiplié par le volume d'éjection systolique", isCorrect: true },
          { text: "Environ 5,0 L/min, car le volume d'éjection systolique compense automatiquement l'augmentation de fréquence", isCorrect: false },
          { text: "Environ 10,0 L/min, car la fréquence double presque et entraîne un doublement du débit cardiaque", isCorrect: false },
          { text: "Environ 3,5 L/min, car l'augmentation de fréquence réduit le temps de remplissage et diminue le débit global", isCorrect: false }
        ],
        explanation: "Le débit cardiaque (DC) = fréquence cardiaque (FC) × volume d'éjection systolique (VES). À 70 bpm, VES = 5000/70 ≈ 71 mL. À 100 bpm, DC = 100 × 71 mL ≈ 7100 mL/min soit environ 7,1 L/min. Le débit augmente proportionnellement à la FC si le VES reste constant (ce qui est une simplification : en réalité, un raccourcissement de la diastole peut réduire le remplissage et donc le VES)."
      },
      {
        text: "La loi de Starling appliquée au cœur stipule que :",
        options: [
          { text: "La force de contraction myocardique augmente avec l'allongement des fibres musculaires cardiaques en fin de diastole", isCorrect: true },
          { text: "La force de contraction myocardique diminue proportionnellement à l'augmentation de la précharge ventriculaire", isCorrect: false },
          { text: "La force de contraction myocardique reste constante quelle que soit la longueur initiale des sarcomères cardiaques", isCorrect: false },
          { text: "La force de contraction myocardique dépend uniquement de la postcharge et non du volume de remplissage ventriculaire", isCorrect: false }
        ],
        explanation: "La loi de Starling (ou loi du cœur) stipule que la force de contraction du myocarde est proportionnelle à la longueur initiale des fibres musculaires cardiaques. Plus le ventricule est rempli en fin de diastole (précharge élevée), plus les fibres sont étirées, et plus la contraction sera puissante. Ce mécanisme intrinsèque permet au cœur d'adapter son débit aux variations de retour veineux."
      },
      {
        text: "La pression artérielle différentielle (ou pression pulsée) se définit comme :",
        options: [
          { text: "La différence entre la pression artérielle systolique et la pression artérielle diastolique, normalement comprise entre 30 et 50 mmHg", isCorrect: true },
          { text: "La différence entre la pression artérielle systolique et la pression artérielle moyenne, normalement inférieure à 10 mmHg", isCorrect: false },
          { text: "La somme de la pression artérielle systolique et de la pression artérielle diastolique, divisée par le nombre de battements cardiaques", isCorrect: false },
          { text: "La différence entre la pression veineuse centrale et la pression artérielle diastolique, normalement comprise entre 10 et 20 mmHg", isCorrect: false }
        ],
        explanation: "La pression pulsée (ou pression différentielle) = pression systolique - pression diastolique. Pour une pression artérielle de 120/80 mmHg, la pression pulsée est de 40 mmHg. Elle est normalement comprise entre 30 et 50 mmHg. Une pression pulsée élargie (> 60 mmHg) peut indiquer une insuffisance aortique ou une artériosclérose ; une pression pulsée pincée (< 25 mmHg) peut indiquer un choc cardiogénique ou un épanchement péricardique."
      },
      {
        text: "Lors de la phase de relaxation isovolumétrique ventriculaire, quelle description est exacte ?",
        options: [
          { text: "Les valves aortique et mitrale sont toutes deux fermées, la pression ventriculaire chute sans variation de volume ventriculaire", isCorrect: true },
          { text: "La valve mitrale s'ouvre en premier, permettant le remplissage passif du ventricule gauche pendant la chute de pression", isCorrect: false },
          { text: "La valve aortique reste ouverte tandis que la valve mitrale se ferme, permettant un reflux sanguin de l'aorte vers le ventricule", isCorrect: false },
          { text: "Les deux valves sont ouvertes simultanément, permettant un transit sanguin rapide de l'oreillette vers l'aorte sans remplissage ventriculaire", isCorrect: false }
        ],
        explanation: "La relaxation isovolumétrique est la phase qui suit la fermeture de la valve aortique (au début de la diastole) et précède l'ouverture de la valve mitrale. Durant cette phase, les deux valves sont fermées, le myocarde se relâche et la pression intraventriculaire chute rapidement, sans modification du volume ventriculaire. Lorsque la pression ventriculaire devient inférieure à la pression auriculaire, la valve mitrale s'ouvre et le remplissage passif commence."
      },
      {
        text: "Quel mécanisme explique principalement la régulation à court terme de la pression artérielle lors d'un passage brutal de la position allongée à la position debout ?",
        options: [
          { text: "Le baroréflexe sino-carotidien et aortique, qui détecte la chute tensionnelle et active le système sympathique pour augmenter la FC et la vasoconstriction", isCorrect: true },
          { text: "Le système rénine-angiotensine-aldostérone, qui augmente rapidement la volémie pour compenser la chute tensionnelle orthostatique", isCorrect: false },
          { text: "La libération d'hormone antidiurétique par l'hypophyse postérieure, qui induit une rétention hydrique compensatrice immédiate", isCorrect: false },
          { text: "L'activation des chémorécepteurs centraux, qui détectent la baisse de perfusion cérébrale et augmentent la ventilation pour corriger la pression artérielle", isCorrect: false }
        ],
        explanation: "Le baroréflexe est le principal mécanisme de régulation rapide (secondes) de la pression artérielle. Les barorécepteurs des sinus carotidiens et de la crosse aortique détectent la baisse de pression lors du passage en orthostatisme. Ils activent le système nerveux sympathique (tachycardie, vasoconstriction, augmentation de l'inotropisme) et inhibent le parasympathique. Le SRAA et l'ADH agissent en heures à jours, pas en secondes."
      },
      {
        text: "Le volume télédiastolique (VTD) du ventricule gauche chez un adulte sain au repos est approximativement de :",
        options: [
          { text: "120 à 130 mL, représentant le volume maximal de sang contenu dans le ventricule gauche en fin de remplissage diastolique", isCorrect: true },
          { text: "60 à 70 mL, représentant le volume moyen éjecté à chaque systole ventriculaire gauche au repos", isCorrect: false },
          { text: "200 à 250 mL, représentant la capacité anatomique maximale théorique du ventricule gauche en conditions normales", isCorrect: false },
          { text: "40 à 50 mL, représentant le volume résiduel minimal restant dans le ventricule gauche après une éjection maximale", isCorrect: false }
        ],
        explanation: "Le VTD est le volume en fin de diastole (remplissage maximum), normalement de 120 à 130 mL dans le ventricule gauche au repos. Le VES (volume d'éjection systolique) est d'environ 70 mL (fraction d'éjection ≈ 55-65%). Le volume télésystolique (VTS, volume résiduel après systole) est d'environ 50-60 mL. La fraction d'éjection = VES/VTD × 100 doit être > 55% pour être considérée normale."
      },
      {
        text: "La postcharge ventriculaire correspond à :",
        options: [
          { text: "La résistance que le ventricule doit vaincre pour éjecter le sang, principalement déterminée par les résistances vasculaires périphériques et la pression aortique", isCorrect: true },
          { text: "Le volume de sang qui revient au ventricule en fin de diastole, déterminé par le retour veineux et la compliance ventriculaire", isCorrect: false },
          { text: "La contractilité intrinsèque du myocarde, indépendante des conditions de charge, mesurée par la fraction d'éjection au repos", isCorrect: false },
          { text: "La pression générée dans l'oreillette gauche qui s'oppose au remplissage ventriculaire lors de la phase de relaxation isovolumétrique", isCorrect: false }
        ],
        explanation: "La postcharge est la force que le ventricule doit développer pour éjecter le sang contre la résistance vasculaire. Elle est principalement déterminée par les résistances artérielles périphériques (RAP) et la pression aortique. Une augmentation de la postcharge (ex. : HTA, sténose aortique) augmente la consommation d'oxygène myocardique et peut réduire le VES. La précharge correspond au volume de remplissage (point 3) et l'inotropisme est la contractilité intrinsèque."
      }
    ]
  },
  {
    title: "Lecture de l'ECG — onde P, QRS, T et troubles du rythme courants",
    description: "Apprenez à interpréter les éléments fondamentaux de l'électrocardiogramme et à identifier les troubles du rythme les plus fréquents en pratique infirmière.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Lecture de l'ECG",
    difficulty: "Intermédiaire",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Sur un ECG standard, que représente l'onde P ?",
        options: [
          { text: "La dépolarisation des oreillettes, qui déclenche la contraction auriculaire et précède normalement chaque complexe QRS", isCorrect: true },
          { text: "La repolarisation des oreillettes, masquée par le complexe QRS et responsable de la relaxation auriculaire après contraction", isCorrect: false },
          { text: "La dépolarisation du nœud auriculo-ventriculaire, mesurée entre l'onde P et le complexe QRS sur l'intervalle PR", isCorrect: false },
          { text: "La dépolarisation initiale des ventricules, correspondant à l'activation du faisceau de His et des branches droite et gauche", isCorrect: false }
        ],
        explanation: "L'onde P représente la dépolarisation auriculaire (activation électrique des oreillettes de l'oreillette droite vers l'oreillette gauche). Elle précède chaque QRS en rythme sinusal normal. Sa durée est normalement < 0,12 s et son amplitude < 2,5 mm en D2. La repolarisation auriculaire (onde Ta) est effectivement masquée par le complexe QRS. L'intervalle PR (0,12-0,20 s) mesure le délai de conduction auriculo-ventriculaire."
      },
      {
        text: "Quelle est la durée normale du complexe QRS chez un adulte en rythme sinusal ?",
        options: [
          { text: "Inférieure à 0,12 seconde (120 ms), correspondant à une dépolarisation ventriculaire rapide et synchrone via le réseau de Purkinje", isCorrect: true },
          { text: "Entre 0,20 et 0,30 seconde (200-300 ms), correspondant à l'ensemble du cycle ventriculaire systolique et diastolique", isCorrect: false },
          { text: "Inférieure à 0,20 seconde (200 ms), correspondant au délai de conduction auriculo-ventriculaire mesuré entre l'onde P et le QRS", isCorrect: false },
          { text: "Entre 0,12 et 0,20 seconde (120-200 ms), correspondant à la propagation lente de l'influx dans le nœud auriculo-ventriculaire", isCorrect: false }
        ],
        explanation: "Le complexe QRS représente la dépolarisation ventriculaire. Sa durée normale est < 0,12 s (120 ms) ou < 3 petits carreaux sur un ECG à vitesse standard (25 mm/s). Un QRS élargi (≥ 0,12 s) évoque un bloc de branche droit ou gauche, ou une conduction aberrante. L'intervalle PR (délai AV) est normalement entre 0,12 et 0,20 s. L'intervalle QT couvre l'ensemble de la systole électrique ventriculaire (QRS + ST + T)."
      },
      {
        text: "En rythme sinusal normal, la fréquence cardiaque se calcule sur l'ECG en divisant :",
        options: [
          { text: "1500 par le nombre de petits carreaux (ou 300 par le nombre de grands carreaux) séparant deux ondes R consécutives", isCorrect: true },
          { text: "600 par le nombre de grands carreaux séparant deux ondes P consécutives, en tenant compte uniquement des dérivations précordiales", isCorrect: false },
          { text: "3000 par le nombre de petits carreaux séparant deux complexes QRS consécutifs, à condition que le papier défile à 50 mm/s", isCorrect: false },
          { text: "Le nombre total de complexes QRS sur une dérivation longue de 10 secondes, multiplié par 10 pour obtenir la valeur en battements par heure", isCorrect: false }
        ],
        explanation: "À une vitesse de défilement standard de 25 mm/s, chaque petit carreau = 0,04 s et chaque grand carreau = 0,20 s. La FC se calcule en divisant 300 par le nombre de grands carreaux entre deux ondes R (ou 1500 par le nombre de petits carreaux). La méthode alternative consiste à compter les QRS sur une dérivation longue de 6 secondes et multiplier par 10. À 50 mm/s, le diviseur devient 600 (grands carreaux) ou 3000 (petits carreaux)."
      },
      {
        text: "L'onde T sur l'ECG correspond à :",
        options: [
          { text: "La repolarisation ventriculaire, normalement positive dans les dérivations où le QRS est dominant, avec une durée et une amplitude variables selon les dérivations", isCorrect: true },
          { text: "La dépolarisation ventriculaire tardive, correspondant à l'activation des fibres de Purkinje sous-endocardiques en fin de QRS", isCorrect: false },
          { text: "La repolarisation auriculaire, survenant après l'onde P et normalement masquée par le complexe QRS lors d'un rythme sinusal normal", isCorrect: false },
          { text: "La période réfractaire absolue des ventricules, durant laquelle aucun potentiel d'action supplémentaire ne peut être déclenché par un stimulus externe", isCorrect: false }
        ],
        explanation: "L'onde T représente la repolarisation ventriculaire (retour au potentiel de repos après la dépolarisation). Elle est normalement positive dans les dérivations où le QRS est positif (D1, D2, aVF, V4-V6) et négative en aVR. Une onde T inversée dans des dérivations inattendues peut signer une ischémie myocardique, une hypertrophie ou des troubles métaboliques. La repolarisation auriculaire (onde Ta) est bien masquée par le QRS."
      },
      {
        text: "La fibrillation auriculaire (FA) se reconnaît à l'ECG par :",
        options: [
          { text: "L'absence d'ondes P identifiables remplacées par une ligne de base anarchique (trémulation), associée à des complexes QRS irrégulièrement irréguliers", isCorrect: true },
          { text: "La présence d'ondes P régulières et identiques à une fréquence de 300 bpm, conduites en bloc alternant 2:1 avec un QRS fin régulier", isCorrect: false },
          { text: "Des complexes QRS larges et polymorphes sur une ligne de base anarchique, sans ondes P identifiables, à une fréquence de 300 bpm ou plus", isCorrect: false },
          { text: "Des complexes QRS identiques et réguliers à une fréquence de 150 bpm, précédés d'ondes P négatives en D2 et positives en aVR", isCorrect: false }
        ],
        explanation: "La FA est caractérisée par une activité auriculaire désorganisée (disparition des ondes P, remplacées par des oscillations rapides irrégulières à 350-600 cycles/min) et une réponse ventriculaire irrégulièrement irrégulière avec des QRS fins (sauf en cas de bloc de branche associé). Le flutter auriculaire présente des ondes F à 300 bpm (aspect en dents de scie) avec une conduction généralement 2:1 (QRS à 150 bpm). La FV donne des complexes polymorphes à > 300/min."
      },
      {
        text: "Un bloc auriculo-ventriculaire (BAV) du premier degré est défini par :",
        options: [
          { text: "Un intervalle PR supérieur à 0,20 seconde (200 ms) sur tous les complexes, avec chaque onde P suivie d'un complexe QRS (conduction AV préservée mais ralentie)", isCorrect: true },
          { text: "Un allongement progressif de l'intervalle PR aboutissant à une onde P non conduite, suivie d'un retour à un PR court (cycle de Wenckebach)", isCorrect: false },
          { text: "Une onde P sur deux non suivie d'un complexe QRS, l'intervalle PR des complexes conduits restant constant et dans les limites normales", isCorrect: false },
          { text: "Une dissociation complète entre les ondes P et les complexes QRS, chacun ayant sa propre fréquence indépendante sans rapport entre eux", isCorrect: false }
        ],
        explanation: "Le BAV du 1er degré est un simple retard de conduction auriculo-ventriculaire : l'intervalle PR > 0,20 s (> 5 petits carreaux) mais chaque onde P est suivie d'un QRS. Il n'y a pas de bloc à proprement parler. Le BAV du 2ème degré type Mobitz I (Wenckebach) montre un allongement progressif du PR jusqu'à une onde P bloquée. Le Mobitz II a un PR constant avec des ondes P bloquées intermittentes. Le BAV du 3ème degré est la dissociation complète."
      },
      {
        text: "L'extrasystole ventriculaire (ESV) se caractérise à l'ECG par :",
        options: [
          { text: "Un complexe QRS large (≥ 0,12 s), d'aspect bizarre, survenant prématurément, non précédé d'onde P, suivi d'une pause compensatrice complète", isCorrect: true },
          { text: "Un complexe QRS fin survenant prématurément, précédé d'une onde P ectopique de morphologie différente, sans pause compensatrice significative", isCorrect: false },
          { text: "Un complexe QRS large survenant de façon régulière à une fréquence de 150 bpm, précédé d'ondes P sinusales normales non conduites", isCorrect: false },
          { text: "Un complexe QRS fin survenant prématurément, non précédé d'onde P, avec un intervalle PR raccourci à 0,10 s, suivi d'une pause compensatrice incomplète", isCorrect: false }
        ],
        explanation: "L'ESV résulte d'un foyer ectopique ventriculaire qui se dépolarise spontanément. La conduction ventriculaire emprunte un chemin anormal (non via le réseau de Purkinje normal), d'où un QRS large (≥ 0,12 s) et d'aspect bizarre. Il n'y a pas d'onde P précédente car l'impulsion ne vient pas du nœud sinusal. La pause compensatrice est complète car le nœud sinusal n'est généralement pas réinitialisé. L'extrasystole supraventriculaire (ESA) donne un QRS fin précédé d'une onde P ectopique."
      },
      {
        text: "La tachycardie sinusale se définit par une fréquence cardiaque supérieure à 100 bpm avec :",
        options: [
          { text: "Des ondes P de morphologie normale précédant chaque QRS avec un intervalle PR normal, le nœud sinusal étant l'origine de chaque impulsion", isCorrect: true },
          { text: "Des ondes P absentes ou rétrogrades, le foyer ectopique jonctionnel ayant pris le relais du nœud sinusal à une fréquence accélérée", isCorrect: false },
          { text: "Des ondes P de morphologie anormale sans relation fixe avec les complexes QRS, le nœud AV assurant un rythme d'échappement ventriculaire", isCorrect: false },
          { text: "Des complexes QRS larges réguliers à 150 bpm sans ondes P identifiables, provenant d'un foyer ventriculaire ectopique automatique accéléré", isCorrect: false }
        ],
        explanation: "La tachycardie sinusale est une accélération du rythme sinusal normal (> 100 bpm au repos). Le nœud sinusal reste le pacemaker : les ondes P sont de morphologie normale (positives en D2, négatives en aVR), précèdent chaque QRS et l'intervalle PR est normal (0,12-0,20 s). Elle est le plus souvent réactionnelle (fièvre, douleur, déshydratation, anémie, stress, médicaments). Elle ne nécessite pas de traitement spécifique mais exige de traiter la cause sous-jacente."
      }
    ]
  },
  {
    title: "Physiologie respiratoire — mécanique ventilatoire, volumes et échanges gazeux",
    description: "Comprenez les mécanismes de la respiration, les volumes pulmonaires de référence et les processus d'échanges gazeux alvéolo-capillaires essentiels en soins infirmiers.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Physiologie respiratoire",
    difficulty: "Intermédiaire",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Lors de l'inspiration calme, la mécanique ventilatoire implique principalement :",
        options: [
          { text: "La contraction du diaphragme et des muscles intercostaux externes, augmentant le volume thoracique et créant une dépression pleurale qui entraîne l'entrée d'air", isCorrect: true },
          { text: "La relaxation passive du diaphragme et des muscles intercostaux, réduisant le volume thoracique et créant une surpression permettant l'entrée d'air", isCorrect: false },
          { text: "La contraction des muscles abdominaux et intercostaux internes, diminuant le volume thoracique pour aspirer l'air par différence de pression", isCorrect: false },
          { text: "L'activation du centre pneumotaxique bulbaire, qui contracte les muscles accessoires pour augmenter uniquement le diamètre antéropostérieur du thorax", isCorrect: false }
        ],
        explanation: "L'inspiration est un phénomène actif nécessitant la contraction du diaphragme (principal muscle inspiratoire, il s'aplatit et descend) et des muscles intercostaux externes (qui élèvent les côtes). Cette contraction augmente les trois diamètres du thorax (vertical, antéropostérieur, transversal), créant une dépression intrathoracique qui entraîne l'air dans les poumons. L'expiration calme est passive (élasticité pulmonaire). Les muscles abdominaux et intercostaux internes sont actifs lors de l'expiration forcée."
      },
      {
        text: "Le volume courant (VC) d'un adulte sain au repos est approximativement de :",
        options: [
          { text: "500 mL, représentant le volume d'air mobilisé lors de chaque cycle respiratoire calme au repos sans effort particulier", isCorrect: true },
          { text: "1200 mL, représentant le volume d'air supplémentaire qu'on peut inspirer au-delà d'une inspiration courante normale", isCorrect: false },
          { text: "150 mL, représentant le volume d'air contenu dans les voies aériennes de conduction sans participation aux échanges gazeux", isCorrect: false },
          { text: "3500 mL, représentant le volume total d'air pouvant être expiré après une inspiration maximale forcée par rapport à une expiration calme", isCorrect: false }
        ],
        explanation: "Le volume courant (VC) est d'environ 500 mL au repos chez un adulte sain. Le volume de réserve inspiratoire (VRI) est ~ 1500-2000 mL (air supplémentaire inspiré en forcé). L'espace mort anatomique est ~ 150 mL (voies aériennes de conduction sans échanges gazeux). La capacité vitale (CV) est ~ 4500-5000 mL (VRI + VC + VRE). La ventilation alvéolaire = (VC - espace mort) × FR = (500 - 150) × 15 = 5250 mL/min en réalité."
      },
      {
        text: "Les échanges gazeux alvéolo-capillaires se font par :",
        options: [
          { text: "Diffusion passive selon les gradients de pression partielle, l'O2 passant de l'alvéole vers le sang et le CO2 du sang vers l'alvéole", isCorrect: true },
          { text: "Transport actif consommant de l'ATP, l'O2 étant pompé activement dans les globules rouges et le CO2 expulsé activement vers l'alvéole", isCorrect: false },
          { text: "Filtration selon les gradients de pression hydrostatique, identique aux mécanismes rénaux de filtration glomérulaire et de réabsorption tubulaire", isCorrect: false },
          { text: "Osmose bidirectionnelle entre le plasma sanguin et le liquide alvéolaire, régulée par la concentration en surfactant pulmonaire des pneumocytes de type II", isCorrect: false }
        ],
        explanation: "Les échanges gazeux se font par diffusion passive selon les gradients de pression partielle à travers la membrane alvéolo-capillaire (extrêmement fine, ~ 0,5 μm). La pO2 alvéolaire (~ 100 mmHg) > pO2 sang veineux (~ 40 mmHg) → O2 diffuse de l'alvéole vers le capillaire. La pCO2 sang veineux (~ 46 mmHg) > pCO2 alvéolaire (~ 40 mmHg) → CO2 diffuse du capillaire vers l'alvéole. Ce processus ne consomme pas d'énergie."
      },
      {
        text: "La capacité résiduelle fonctionnelle (CRF) représente :",
        options: [
          { text: "Le volume d'air restant dans les poumons en fin d'expiration calme, correspondant à la somme du volume de réserve expiratoire et du volume résiduel", isCorrect: true },
          { text: "Le volume maximal d'air pouvant être expiré après une inspiration maximale, utilisé comme indicateur de la fonction pulmonaire globale", isCorrect: false },
          { text: "Le volume d'air inspiré en plus lors d'une inspiration forcée maximale au-delà d'une inspiration courante normale au repos", isCorrect: false },
          { text: "La somme du volume courant et du volume résiduel, représentant le volume minimal incompressible toujours présent dans les poumons", isCorrect: false }
        ],
        explanation: "La CRF = VRE (Volume de Réserve Expiratoire, ~ 1000-1200 mL) + VR (Volume Résiduel, ~ 1200 mL) ≈ 2200-2400 mL. C'est le volume d'air présent en fin d'expiration calme, représentant la position d'équilibre entre les forces élastiques pulmonaires (rétraction vers l'intérieur) et les forces thoraciques (expansion vers l'extérieur). La capacité vitale = VRI + VC + VRE. La capacité pulmonaire totale = CV + VR. La CRF joue un rôle tampon pour éviter les variations excessives de pO2 et pCO2."
      },
      {
        text: "Le rôle du surfactant pulmonaire est de :",
        options: [
          { text: "Réduire la tension superficielle à la surface des alvéoles, prévenant leur collapsus et permettant une expansion uniforme lors de l'inspiration", isCorrect: true },
          { text: "Augmenter la tension superficielle alvéolaire pour maintenir les alvéoles ouvertes contre les forces de rétraction élastique du parenchyme pulmonaire", isCorrect: false },
          { text: "Faciliter le transport de l'O2 à travers la membrane alvéolo-capillaire en augmentant la solubilité des gaz dans le film liquidien alvéolaire", isCorrect: false },
          { text: "Neutraliser les agents pathogènes inhalés grâce à ses propriétés antibactériennes, en complément du mucus produit par les cellules caliciformes bronchiques", isCorrect: false }
        ],
        explanation: "Le surfactant est produit par les pneumocytes de type II à partir de 28-32 semaines de gestation. Il est composé principalement de phospholipides (DPPC) et réduit la tension superficielle à la surface alvéolaire selon la loi de Laplace (P = 2T/r). En diminuant la tension de surface, il : 1) prévient le collapsus alvéolaire en fin d'expiration, 2) permet une réexpansion plus facile lors de l'inspiration, 3) stabilise les alvéoles de tailles différentes. Son absence chez le prématuré cause la maladie des membranes hyalines (détresse respiratoire néonatale)."
      },
      {
        text: "La régulation de la ventilation est principalement assurée par des chémorécepteurs sensibles à :",
        options: [
          { text: "La pCO2 (via le pH du LCR) pour les chémorécepteurs centraux, et à la pO2, la pCO2 et le pH pour les chémorécepteurs périphériques carotidiens et aortiques", isCorrect: true },
          { text: "La pO2 exclusivement pour les chémorécepteurs centraux bulbaires, et à la pCO2 uniquement pour les chémorécepteurs carotidiens et aortiques périphériques", isCorrect: false },
          { text: "La pression artérielle systémique et la fréquence cardiaque, qui modulent directement les centres respiratoires bulbaires via des barorécepteurs pulmonaires", isCorrect: false },
          { text: "La concentration en bicarbonates plasmatiques et l'osmolarité sanguine, détectées par des osmorécepteurs hypothalamiques régulant la fréquence respiratoire", isCorrect: false }
        ],
        explanation: "Les chémorécepteurs centraux (bulbe rachidien) sont très sensibles aux variations de pH du LCR, reflétant la pCO2 (CO2 diffuse librement la barrière hémato-encéphalique et acidifie le LCR). Ce sont les régulateurs principaux en conditions normales. Les chémorécepteurs périphériques (glomus carotidiens et aortiques) répondent à la pO2 basse (< 60 mmHg), à l'hypercapnie et à l'acidose. En BPCO, la sensibilité au CO2 peut être diminuée et la pO2 devient le principal stimulant (hypoxic drive)."
      },
      {
        text: "La ventilation alvéolaire efficace est calculée en tenant compte de l'espace mort anatomique. Pour une fréquence respiratoire de 15/min et un volume courant de 500 mL (espace mort = 150 mL), la ventilation alvéolaire est :",
        options: [
          { text: "5250 mL/min, soit (500 - 150) × 15, car seul le volume atteignant les alvéoles (350 mL par cycle) participe aux échanges gazeux", isCorrect: true },
          { text: "7500 mL/min, soit 500 × 15, car le volume courant total participe intégralement aux échanges gazeux à chaque cycle respiratoire", isCorrect: false },
          { text: "2250 mL/min, soit 150 × 15, car seul l'air contenu dans l'espace mort anatomique subit un renouvellement complet à chaque cycle", isCorrect: false },
          { text: "4500 mL/min, soit (500 - 200) × 15, l'espace mort physiologique global incluant les alvéoles non perfusées étant estimé à 200 mL au repos", isCorrect: false }
        ],
        explanation: "La ventilation alvéolaire (VA) = (VC - espace mort anatomique) × FR = (500 - 150) × 15 = 350 × 15 = 5250 mL/min. L'espace mort anatomique (~ 150 mL) est le volume d'air dans les voies aériennes de conduction (nez, pharynx, trachée, bronches jusqu'aux bronchioles terminales) qui n'atteint pas les alvéoles et ne participe pas aux échanges gazeux. La ventilation totale (VE) = VC × FR = 500 × 15 = 7500 mL/min. La différence (2250 mL/min) est la ventilation de l'espace mort, inefficace pour les échanges."
      },
      {
        text: "L'hémoglobine transporte l'oxygène sous forme :",
        options: [
          { text: "Principalement combinée à l'hémoglobine (oxyhémoglobine, 98% de l'O2 transporté) et très minoritairement dissoute dans le plasma (2% de l'O2 transporté)", isCorrect: true },
          { text: "Principalement dissoute dans le plasma sanguin (80% de l'O2 transporté) et secondairement liée à l'hémoglobine sous forme d'oxyhémoglobine (20%)", isCorrect: false },
          { text: "Exclusivement sous forme de bicarbonates érythrocytaires, comme le CO2, grâce à l'anhydrase carbonique présente dans les globules rouges", isCorrect: false },
          { text: "En proportion égale entre la forme combinée à l'hémoglobine et la forme dissoute dans le plasma, chaque forme contribuant à environ 50% du transport total", isCorrect: false }
        ],
        explanation: "L'O2 est transporté à 98-99% sous forme d'oxyhémoglobine (combiné à l'hémoglobine sur les groupements hème contenant du Fe2+, chaque hémoglobine fixant 4 molécules d'O2) et seulement 1-2% dissous dans le plasma. La solubilité de l'O2 dans le sang est très faible (0,003 mL/mmHg/dL). Le CO2, lui, est transporté à ~ 70% sous forme de bicarbonates (HCO3-), ~ 23% combiné à l'hémoglobine (carbhémoglobine) et ~ 7% dissous dans le plasma. La courbe de dissociation de l'oxyhémoglobine en S explique les variations de saturation selon la pO2."
      }
    ]
  },
  {
    title: "Physiologie neurologique — potentiel d'action, synapse et arc réflexe",
    description: "Explorez les bases électrophysiologiques du neurone, les mécanismes synaptiques et l'organisation des voies réflexes indispensables à la compréhension neurologique en soins infirmiers.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Physiologie neurologique",
    difficulty: "Intermédiaire",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "Le potentiel de repos d'un neurone est maintenu à environ -70 mV grâce à :",
        options: [
          { text: "La pompe Na+/K+-ATPase qui expulse 3 Na+ et importe 2 K+ par cycle, créant un gradient ionique transmembranaire qui établit la négativité intracellulaire", isCorrect: true },
          { text: "La pompe Ca2+/H+-ATPase qui expulse le calcium intracellulaire et importe des protons, acidifiant l'intérieur du neurone pour maintenir la négativité", isCorrect: false },
          { text: "Les canaux potassiques à rectification entrante qui maintiennent un flux entrant de K+ continu, augmentant la négativité intracellulaire de façon passive", isCorrect: false },
          { text: "L'échangeur Na+/Ca2+ qui expulse le sodium extracellulaire en échange du calcium intracellulaire, maintenant ainsi le potentiel de repos membranaire", isCorrect: false }
        ],
        explanation: "La pompe Na+/K+-ATPase est l'élément fondamental du potentiel de repos. Elle expulse activement 3 Na+ vers l'extérieur et importe 2 K+ vers l'intérieur, consommant 1 ATP par cycle. Ce déséquilibre crée des gradients de concentration : [Na+] élevé à l'extérieur, [K+] élevé à l'intérieur. Le potentiel de repos (~ -70 mV) résulte de l'équilibre entre ces gradients de concentration et les gradients électriques. Les canaux K+ de fuite jouent également un rôle en permettant une sortie passive de K+ selon son gradient de concentration."
      },
      {
        text: "Lors de la dépolarisation membranaire au cours d'un potentiel d'action, quelle séquence ionique est correcte ?",
        options: [
          { text: "Ouverture des canaux Na+ voltage-dépendants avec entrée massive de Na+ (dépolarisation rapide), puis inactivation des canaux Na+ et ouverture des canaux K+ (repolarisation)", isCorrect: true },
          { text: "Ouverture des canaux K+ voltage-dépendants avec sortie massive de K+ (dépolarisation rapide), puis ouverture des canaux Na+ et fermeture des canaux K+ (repolarisation)", isCorrect: false },
          { text: "Ouverture des canaux Ca2+ voltage-dépendants avec entrée de Ca2+ (dépolarisation lente), puis fermeture des canaux Ca2+ et ouverture des canaux Cl- (repolarisation)", isCorrect: false },
          { text: "Fermeture des canaux Na+ de fuite et ouverture des canaux Na+ voltage-dépendants (dépolarisation lente), puis inactivation de l'échangeur Na+/K+ (repolarisation)", isCorrect: false }
        ],
        explanation: "Le potentiel d'action suit une séquence précise : 1) Dépolarisation (phase rapide, montante) : ouverture des canaux Na+ voltage-dépendants → entrée massive de Na+ → le potentiel monte de -70 mV vers +30 mV. 2) Repolarisation : inactivation des canaux Na+ ET ouverture retardée des canaux K+ voltage-dépendants → sortie de K+ → retour vers -70 mV. 3) Hyperpolarisation transitoire (afterpotential négatif) : les canaux K+ se ferment lentement. La pompe Na+/K+ restaure ensuite les gradients ioniques."
      },
      {
        text: "La période réfractaire absolue d'un neurone correspond à :",
        options: [
          { text: "La période durant laquelle les canaux Na+ sont inactivés et aucun nouveau potentiel d'action ne peut être déclenché quelle que soit l'intensité du stimulus", isCorrect: true },
          { text: "La période durant laquelle un potentiel d'action peut être déclenché mais uniquement par un stimulus de plus forte intensité que le seuil normal habituel", isCorrect: false },
          { text: "La période de repos entre deux potentiels d'action, durant laquelle la pompe Na+/K+ restaure les gradients ioniques avant le prochain stimulus", isCorrect: false },
          { text: "La période hyperpolarisée suivant la repolarisation, durant laquelle les canaux K+ sont encore ouverts et rendent le neurone temporairement inexcitable", isCorrect: false }
        ],
        explanation: "La période réfractaire absolue correspond à l'inactivation des canaux Na+ voltage-dépendants (ils sont dans un état inactivé, différent de l'état fermé au repos). Durant cette phase, aucun stimulus, même très intense, ne peut déclencher un nouveau potentiel d'action. Elle dure environ 1-2 ms et coïncide principalement avec la dépolarisation et le début de la repolarisation. La période réfractaire relative (décrite dans la réponse B) correspond à la phase d'hyperpolarisation (canaux K+ encore ouverts). Ces périodes réfractaires assurent le sens unidirectionnel de la propagation du PA."
      },
      {
        text: "À la synapse chimique, la transmission de l'influx nerveux implique :",
        options: [
          { text: "La libération de neurotransmetteurs par exocytose des vésicules synaptiques sous l'effet de l'entrée de Ca2+, puis fixation sur des récepteurs post-synaptiques spécifiques", isCorrect: true },
          { text: "Le passage direct du courant ionique de la cellule pré-synaptique vers la cellule post-synaptique via des jonctions communicantes (gap junctions) protéiques", isCorrect: false },
          { text: "La diffusion passive des ions Na+ et K+ à travers la fente synaptique, créant directement un potentiel post-synaptique excitateur ou inhibiteur selon leur direction", isCorrect: false },
          { text: "La libération de neurotransmetteurs par endocytose inversée sous l'effet de la sortie de K+, puis liaison sur des autorécepteurs pré-synaptiques de régulation", isCorrect: false }
        ],
        explanation: "La synapse chimique fonctionne en plusieurs étapes : 1) Arrivée du PA dans le bouton terminal pré-synaptique. 2) Dépolarisation membranaire → ouverture des canaux Ca2+ voltage-dépendants → entrée de Ca2+. 3) Le Ca2+ déclenche la fusion des vésicules synaptiques avec la membrane pré-synaptique (exocytose). 4) Les neurotransmetteurs diffusent dans la fente synaptique (20-40 nm). 5) Liaison sur des récepteurs post-synaptiques → modification de la conductance ionique → PPSE ou PPSI. Les synapses électriques (gap junctions) permettent la transmission directe sans médiateur."
      },
      {
        text: "Un potentiel post-synaptique inhibiteur (PPSI) est généralement produit par :",
        options: [
          { text: "L'ouverture de canaux Cl- ou K+ post-synaptiques, hyperpolarisant la membrane post-synaptique et éloignant le potentiel membranaire du seuil de déclenchement du PA", isCorrect: true },
          { text: "L'ouverture de canaux Na+ et Ca2+ post-synaptiques, dépolarisant la membrane post-synaptique vers le seuil de déclenchement du potentiel d'action", isCorrect: false },
          { text: "La fermeture des canaux K+ de fuite post-synaptiques, augmentant la résistance membranaire et facilitant la propagation du signal électrique vers le corps cellulaire", isCorrect: false },
          { text: "L'activation de la pompe Na+/K+-ATPase post-synaptique, qui hyperpolarise rapidement la membrane pour prévenir l'intégration des signaux excitateurs convergents", isCorrect: false }
        ],
        explanation: "Le PPSI résulte de l'ouverture de canaux ioniques qui hyperpolarisent la membrane post-synaptique (éloignement du seuil de ~ -55 mV) : 1) Canaux Cl- : entrée de Cl- (ion négatif entrant) → hyperpolarisation (exemple : GABA-A, glycine). 2) Canaux K+ : sortie de K+ → hyperpolarisation (exemple : GABA-B via protéines G). Le PPSE, à l'inverse, résulte de l'ouverture de canaux Na+ et/ou Ca2+ qui dépolarisent la membrane vers le seuil (glutamate, acétylcholine). L'intégration synaptique consiste en la sommation spatiale et temporelle des PPSE et PPSI au niveau du cône axonique."
      },
      {
        text: "L'arc réflexe monosynaptique (comme le réflexe myotatique rotulien) implique les éléments suivants dans l'ordre :",
        options: [
          { text: "Récepteur fuseau neuromusculaire → neurone afférent Ia → synapse directe sur motoneurone α → effecteur musculaire, sans interneurone intercalé", isCorrect: true },
          { text: "Récepteur cutané → neurone afférent C → interneurone inhibiteur → motoneurone γ → effecteur musculaire, avec intégration dans la corne dorsale", isCorrect: false },
          { text: "Récepteur tendineux de Golgi → neurone afférent Ib → interneurone excitateur → motoneurone α → effecteur musculaire, protégeant le muscle contre l'étirement", isCorrect: false },
          { text: "Récepteur articulaire → neurone afférent II → synapse dans le tronc cérébral → neurone efférent descendant → effecteur musculaire, via la voie pyramidale", isCorrect: false }
        ],
        explanation: "Le réflexe myotatique (d'étirement) est le seul réflexe spinal véritablement monosynaptique. L'étirement du muscle active les fuseaux neuromusculaires → potentiel d'action dans les fibres afférentes Ia (grande vitesse de conduction) → synapse directe sur le motoneurone α dans la corne antérieure de la moelle → contraction réflexe du muscle étiré. C'est ce réflexe qui est testé par le choc sur le tendon rotulien (extension du genou). Le réflexe myotatique inverse (réflexe tendineux de Golgi) implique un interneurone inhibiteur (réflexe disynaptique)."
      },
      {
        text: "La vitesse de conduction de l'influx nerveux dans les fibres myélinisées est plus rapide que dans les fibres amyéliniques car :",
        options: [
          { text: "La myéline isole la membrane axonale entre les nœuds de Ranvier, forçant le potentiel d'action à sauter de nœud en nœud (conduction saltatoire), ce qui est beaucoup plus rapide", isCorrect: true },
          { text: "La myéline augmente la résistance membranaire de l'axone tout le long de sa surface, ralentissant la dépolarisation et permettant une meilleure intégration du signal", isCorrect: false },
          { text: "La myéline contient des canaux Na+ supplémentaires distribués uniformément le long de l'axone, augmentant la densité des sites de régénération du potentiel d'action", isCorrect: false },
          { text: "La myéline réduit la capacitance membranaire de l'axone, ce qui ralentit la propagation passive du courant mais compense par une fréquence de génération des PA plus élevée", isCorrect: false }
        ],
        explanation: "La myéline (produite par les cellules de Schwann dans le SNP, les oligodendrocytes dans le SNC) isole l'axone en réduisant la fuite ionique entre les nœuds de Ranvier. Les canaux Na+ voltage-dépendants sont concentrés aux nœuds de Ranvier (espace entre les gaines de myéline, tous les ~ 1 mm). Le courant se propage passivement et rapidement sous la myéline jusqu'au nœud suivant où il régénère le PA (conduction saltatoire). Vitesse : fibres Aα myélinisées ~ 70-120 m/s vs fibres C amyéliniques ~ 0,5-2 m/s. La myélinisation réduit aussi la consommation d'énergie (la pompe Na+/K+ n'agit qu'aux nœuds)."
      },
      {
        text: "Le neurotransmetteur principal des jonctions neuromusculaires du muscle squelettique est :",
        options: [
          { text: "L'acétylcholine, libérée dans la fente synaptique et se fixant sur les récepteurs nicotiniques post-synaptiques de la plaque motrice pour provoquer la contraction musculaire", isCorrect: true },
          { text: "La noradrénaline, libérée dans la fente synaptique et se fixant sur les récepteurs adrénergiques β2 de la plaque motrice pour déclencher la contraction musculaire", isCorrect: false },
          { text: "Le glutamate, libéré dans la fente synaptique et se fixant sur les récepteurs NMDA post-synaptiques de la plaque motrice pour dépolariser la cellule musculaire", isCorrect: false },
          { text: "La dopamine, libérée dans la fente synaptique et se fixant sur les récepteurs D1 post-synaptiques de la plaque motrice pour moduler la force de contraction musculaire", isCorrect: false }
        ],
        explanation: "L'acétylcholine (ACh) est le neurotransmetteur exclusif de la jonction neuromusculaire (JNM) du muscle squelettique. Elle est synthétisée dans le bouton terminal, stockée dans des vésicules et libérée par exocytose Ca2+-dépendante. Elle se fixe sur les récepteurs nicotiniques (récepteurs-canaux ionotropes) de la plaque motrice → entrée de Na+ → dépolarisation de la membrane musculaire → propagation du PA musculaire → libération de Ca2+ du réticulum sarcoplasmique → contraction. L'ACh est ensuite dégradée par l'acétylcholinestérase. Les anticholinestérasiques (néostigmine) et les curares (bloqueurs) agissent à ce niveau."
      }
    ]
  },
  {
    title: "Système nerveux autonome — sympathique, parasympathique et régulation",
    description: "Comprenez l'organisation du système nerveux autonome, les effets opposés de ses deux divisions et leur rôle dans la régulation homéostatique des grandes fonctions vitales.",
    semester: "Semestre 1",
    category: "UE 2.2 - Cycles de la vie et grandes fonctions",
    chapter: "Système nerveux autonome",
    difficulty: "Intermédiaire",
    duration: 20,
    isPublished: true,
    questions: [
      {
        text: "La principale différence anatomique entre le système nerveux sympathique et parasympathique concerne la longueur des neurones pré- et post-ganglionnaires :",
        options: [
          { text: "Le sympathique a des neurones pré-ganglionnaires courts et post-ganglionnaires longs (ganglions paravertébraux proches de la moelle) ; le parasympathique a des pré-ganglionnaires longs et post-ganglionnaires courts (ganglions intraorganiques)", isCorrect: true },
          { text: "Le sympathique a des neurones pré-ganglionnaires longs et post-ganglionnaires courts (ganglions intraorganiques) ; le parasympathique a des pré-ganglionnaires courts et post-ganglionnaires longs", isCorrect: false },
          { text: "Les deux systèmes ont des neurones pré-ganglionnaires de longueur identique, mais le sympathique utilise deux synapses ganglionnaires contre une seule pour le parasympathique", isCorrect: false },
          { text: "Les deux systèmes ont des neurones post-ganglionnaires courts, mais le sympathique possède des ganglions dans la paroi des organes cibles et le parasympathique des ganglions vertébraux", isCorrect: false }
        ],
        explanation: "Organisation anatomique : Sympathique (thoraco-lombaire, T1-L2) : neurone pré-ganglionnaire COURT (myélinisé, Ach) → ganglion sympathique paravertébral ou prévertébral (proche de la moelle) → neurone post-ganglionnaire LONG (amyélinisé, noradrénaline) vers l'organe cible. Parasympathique (crânio-sacral, III/VII/IX/X et S2-S4) : neurone pré-ganglionnaire LONG (myélinisé, Ach) → ganglion dans ou près de l'organe cible → neurone post-ganglionnaire TRÈS COURT (Ach). Cette organisation explique la diffusion large des effets sympathiques vs les effets localisés du parasympathique."
      },
      {
        text: "L'acétylcholine est le neurotransmetteur utilisé par les neurones :",
        options: [
          { text: "Pré-ganglionnaires des deux systèmes (sympathique et parasympathique), ET post-ganglionnaires parasympathiques ; les neurones post-ganglionnaires sympathiques utilisent la noradrénaline", isCorrect: true },
          { text: "Post-ganglionnaires des deux systèmes uniquement, les neurones pré-ganglionnaires des deux systèmes utilisant la noradrénaline comme médiateur principal", isCorrect: false },
          { text: "Post-ganglionnaires parasympathiques uniquement, tous les autres neurones autonomes (pré- et post-ganglionnaires sympathiques) utilisant la noradrénaline", isCorrect: false },
          { text: "Pré-ganglionnaires sympathiques uniquement, les neurones pré-ganglionnaires parasympathiques utilisant le VIP (peptide intestinal vasoactif) comme médiateur principal", isCorrect: false }
        ],
        explanation: "Distribution des neurotransmetteurs autonomes : 1) Tous les neurones pré-ganglionnaires (sympathiques ET parasympathiques) utilisent l'acétylcholine (Ach) agissant sur des récepteurs nicotiniques ganglionnaires. 2) Neurones post-ganglionnaires PARASYMPATHIQUES : Ach agissant sur des récepteurs muscariniques des organes cibles. 3) Neurones post-ganglionnaires SYMPATHIQUES : noradrénaline (NA) agissant sur des récepteurs adrénergiques α et β. Exception notable : les neurones sympathiques innervant les glandes sudoripares eccrines utilisent l'Ach (récepteurs muscariniques). La médullosurrénale libère de l'adrénaline (80%) et de la NA (20%) directement dans le sang."
      },
      {
        text: "La stimulation sympathique produit les effets suivants sur le cœur et les vaisseaux :",
        options: [
          { text: "Augmentation de la fréquence cardiaque (effet chronotrope +), de la force de contraction (effet inotrope +), et vasoconstriction artériolaire périphérique via les récepteurs α1", isCorrect: true },
          { text: "Diminution de la fréquence cardiaque (effet chronotrope -), augmentation de la force de contraction (effet inotrope +), et vasodilatation artériolaire périphérique via les récepteurs β2", isCorrect: false },
          { text: "Augmentation de la fréquence cardiaque (effet chronotrope +), diminution de la force de contraction (effet inotrope -), et vasoconstriction veineuse sélective via les récepteurs α2", isCorrect: false },
          { text: "Diminution de la fréquence cardiaque (effet chronotrope -), diminution de la force de contraction (effet inotrope -), et vasodilatation artériolaire et veineuse via les récepteurs β1", isCorrect: false }
        ],
        explanation: "Le système sympathique prépare l'organisme à la réaction de lutte ou fuite (fight or flight). Sur le système cardiovasculaire : Récepteurs β1 cardiaques → tachycardie (chronotrope +), augmentation de la conduction AV (dromotrope +), augmentation de la contractilité (inotrope +) → augmentation du débit cardiaque. Récepteurs α1 vasculaires → vasoconstriction artériolaire → augmentation des résistances périphériques → augmentation de la PA. Récepteurs β2 dans certains territoires (muscles, coronaires) → vasodilatation locale pour améliorer la perfusion des organes actifs."
      },
      {
        text: "La stimulation parasympathique (via le nerf vague X) sur le cœur provoque :",
        options: [
          { text: "Une bradycardie par hyperpolarisation des cellules du nœud sinusal via les récepteurs muscariniques M2 et l'activation de canaux K+ (courant IKACh)", isCorrect: true },
          { text: "Une tachycardie par dépolarisation des cellules du nœud sinusal via les récepteurs muscariniques M3 et l'inhibition des canaux Ca2+ de type L", isCorrect: false },
          { text: "Une bradycardie par blocage des canaux Na+ du nœud sinusal via les récepteurs nicotiniques ganglionnaires et l'inhibition de la dépolarisation spontanée", isCorrect: false },
          { text: "Une augmentation de la contractilité ventriculaire via les récepteurs muscariniques M2 et l'activation de la voie AMPc/protéine kinase A", isCorrect: false }
        ],
        explanation: "Le nerf vague (X) est le principal nerf parasympathique cardiaque. L'Ach libérée se fixe sur les récepteurs muscariniques M2 (couplés aux protéines Gi) au niveau du nœud sinusal et AV. Via la protéine Gi, l'Ach : 1) Inhibe l'adénylate cyclase → diminution de l'AMPc → réduction des courants If (pacemaker) et ICaL. 2) Active des canaux K+ spécifiques (IKACh) → sortie de K+ → hyperpolarisation → ralentissement ou arrêt de la dépolarisation spontanée → bradycardie. Le vague a peu d'effet sur la contractilité ventriculaire (faible innervation parasympathique des ventricules)."
      },
      {
        text: "Le réflexe barorécepteur (baroréflexe) en réponse à une hypertension artérielle soudaine implique :",
        options: [
          { text: "Activation des barorécepteurs → augmentation du tonus vagal (bradycardie) ET diminution du tonus sympathique (vasodilatation) → retour à la normotension", isCorrect: true },
          { text: "Activation des barorécepteurs → augmentation du tonus sympathique (tachycardie) ET libération de rénine rénale (vasoconstriction) → maintien de l'hypertension", isCorrect: false },
          { text: "Activation des barorécepteurs → libération de vasopressine (ADH) hypothalamique ET activation du SRAA → augmentation de la volémie pour compenser la hausse tensionnelle", isCorrect: false },
          { text: "Activation des barorécepteurs → activation des chémorécepteurs centraux → augmentation de la ventilation → alcalose respiratoire compensant l'hypertension artérielle", isCorrect: false }
        ],
        explanation: "Le baroréflexe est un mécanisme de rétroaction négative rapide (arc réflexe avec centre dans le bulbe/NTS). En cas d'hypertension soudaine : 1) Les barorécepteurs des sinus carotidiens et crosse aortique augmentent leur fréquence de décharge. 2) Voies afférentes (IX et X) vers le noyau du tractus solitaire (NTS) bulbaire. 3) Réponses efférentes : a) Augmentation du tonus parasympathique vagal → bradycardie (réduction du débit cardiaque). b) Diminution du tonus sympathique → vasodilatation et réduction de l'inotropisme. Ces effets combinés réduisent la PA vers la normale en quelques secondes."
      },
      {
        text: "La médullosurrénale peut être considérée comme un ganglion sympathique modifié car :",
        options: [
          { text: "Ses cellules chromaffines sont des neurones post-ganglionnaires sympathiques modifiés, innervées directement par des fibres pré-ganglionnaires cholinergiques et sécrétant des catécholamines dans le sang", isCorrect: true },
          { text: "Ses cellules corticales produisent du cortisol et de l'aldostérone sous contrôle du système parasympathique, agissant comme relais entre les deux systèmes autonomes", isCorrect: false },
          { text: "Ses cellules chromaffines reçoivent une innervation post-ganglionnaires adrénergique et sécrètent de l'acétylcholine directement dans la circulation sanguine systémique", isCorrect: false },
          { text: "Ses cellules médullaires sont des neurones pré-ganglionnaires parasympathiques qui synthétisent le GABA et modulent la réponse sympathique générale de l'organisme", isCorrect: false }
        ],
        explanation: "Embryologiquement, les cellules chromaffines de la médullosurrénale dérivent des mêmes cellules de la crête neurale que les neurones sympathiques post-ganglionnaires. Comme les ganglions sympathiques, elles reçoivent une innervation pré-ganglionnaire cholinergique directe (fibres splanchniques). Sous stimulation sympathique, elles libèrent de l'adrénaline (80%) et de la noradrénaline (20%) directement dans la circulation sanguine (rôle hormonal). Elles manquent d'axone et de dendrites (d'où leur statut de neurones 'modifiés'). La cortex surrénale (couches glomérulée, fasciculée, réticulaire) produit les hormones stéroïdiennes sous contrôle hypophysaire."
      },
      {
        text: "Les récepteurs β2-adrénergiques, activés par l'adrénaline en situation de stress, produisent les effets suivants sur les bronches et les vaisseaux des muscles squelettiques :",
        options: [
          { text: "Bronchodilatation et vasodilatation musculaire, optimisant l'apport en oxygène lors de la réponse de lutte ou fuite par relaxation du muscle lisse", isCorrect: true },
          { text: "Bronchoconstriction et vasoconstriction musculaire, réduisant la consommation d'oxygène des territoires non essentiels pendant la réponse au stress", isCorrect: false },
          { text: "Bronchodilatation et vasoconstriction musculaire, augmentant la ventilation tout en redistribuant le flux sanguin vers les organes vitaux centraux", isCorrect: false },
          { text: "Bronchoconstriction et vasodilatation musculaire, réduisant l'apport en O2 alvéolaire tout en augmentant la perfusion musculaire lors du stress intense", isCorrect: false }
        ],
        explanation: "Les récepteurs β2 sont couplés aux protéines Gs → activation de l'adénylate cyclase → augmentation de l'AMPc → activation de la PKA → phosphorylation de la myosine kinase du muscle lisse → RELAXATION du muscle lisse. Effets physiologiques des β2 : 1) Bronches : bronchodilatation → augmentation du débit aérien vers les alvéoles. 2) Vaisseaux des muscles squelettiques : vasodilatation → augmentation de la perfusion musculaire. 3) Utérus : relaxation (tocolyse). Ces effets préparent l'organisme à l'activité physique. Les β2-agonistes (salbutamol) sont utilisés comme bronchodilatateurs dans l'asthme et la BPCO."
      },
      {
        text: "La régulation de la fonction pupillaire par le système nerveux autonome est caractérisée par :",
        options: [
          { text: "La stimulation sympathique provoque la mydriase (dilatation) via le muscle dilatateur de l'iris (α1) ; la stimulation parasympathique provoque le myosis (constriction) via le muscle sphincter de l'iris (M3)", isCorrect: true },
          { text: "La stimulation parasympathique provoque la mydriase (dilatation) via le muscle dilatateur de l'iris (β2) ; la stimulation sympathique provoque le myosis (constriction) via le muscle sphincter (α1)", isCorrect: false },
          { text: "La stimulation sympathique provoque le myosis (constriction) via le muscle sphincter de l'iris (α2) ; la stimulation parasympathique provoque la mydriase (dilatation) via le muscle dilatateur (M2)", isCorrect: false },
          { text: "Les deux systèmes agissent de façon synergique sur le muscle ciliaire uniquement, sans influence directe sur l'iris ; la régulation pupillaire est exclusivement réflexe et indépendante du SNA", isCorrect: false }
        ],
        explanation: "L'iris contient deux muscles lisses antagonistes contrôlés par le SNA : 1) Muscle sphincter (circulaire) : innervé par le parasympathique (nerf oculomoteur III via ganglion ciliaire, récepteurs M3) → contraction → MYOSIS (pupille étroite, réflexe photomoteur, accommodation). 2) Muscle dilatateur (radial) : innervé par le sympathique (fibres post-ganglionnaires cervicales supérieures, récepteurs α1) → contraction → MYDRIASE (pupille large, réaction de stress). En clinique : atropine (anti-M3) → mydriase ; pilocarpine (agoniste M3) → myosis ; phénylephrine (agoniste α1) → mydriase. Le syndrome de Claude Bernard-Horner (lésion sympathique) donne myosis + ptosis + énophtalmie."
      }
    ]
  }
];
