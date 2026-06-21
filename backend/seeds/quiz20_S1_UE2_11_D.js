module.exports = [
  {
    title: "Antihypertenseurs",
    description: "IEC, ARA2, bêtabloquants, inhibiteurs calciques et diurétiques dans la prise en charge de l'hypertension artérielle.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Antihypertenseurs — IEC, ARA2, bêtabloquants, inhibiteurs calciques et diurétiques",
    difficulty: "medium",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action principal des inhibiteurs de l'enzyme de conversion (IEC) ?",
        options: [
          { text: "Blocage des récepteurs AT1 de l'angiotensine II", isCorrect: false },
          { text: "Inhibition de la conversion de l'angiotensine I en angiotensine II", isCorrect: true },
          { text: "Blocage des canaux calciques de type L au niveau cardiaque", isCorrect: false },
          { text: "Inhibition de la réabsorption du sodium au tubule distal", isCorrect: false }
        ],
        explanation: "Les IEC (ex : énalapril, ramipril) bloquent l'enzyme de conversion, empêchant la formation d'angiotensine II (vasoconstricteur), ce qui entraîne une vasodilatation et une baisse de la pression artérielle."
      },
      {
        text: "Un patient traité par IEC présente une toux sèche persistante. Quelle est la conduite infirmière appropriée ?",
        options: [
          { text: "Doubler la dose pour renforcer l'effet antihypertenseur obtenu", isCorrect: false },
          { text: "Administrer un antitussif et surveiller l'évolution clinique du patient", isCorrect: false },
          { text: "Signaler ce signe au médecin car il peut justifier un changement de classe", isCorrect: true },
          { text: "Rassurer le patient car cet effet disparaît spontanément en 48 heures", isCorrect: false }
        ],
        explanation: "La toux sèche est un effet indésirable caractéristique des IEC, lié à l'accumulation de bradykinines. Elle peut justifier le passage aux ARA2 (sartans), qui ne provoquent pas cet effet."
      },
      {
        text: "Quelle surveillance biologique est prioritaire chez un patient débutant un traitement par ARA2 ?",
        options: [
          { text: "Glycémie à jeun et hémoglobine glyquée HbA1c", isCorrect: false },
          { text: "Kaliémie et fonction rénale (créatinine, urée)", isCorrect: true },
          { text: "Bilan hépatique complet (ASAT, ALAT, GGT)", isCorrect: false },
          { text: "NFS et bilan d'hémostase (TP, TCA, plaquettes)", isCorrect: false }
        ],
        explanation: "Les ARA2 (ex : losartan, valsartan) peuvent provoquer une hyperkaliémie et une insuffisance rénale aiguë, notamment en association avec des diurétiques ou des AINS. La kaliémie et la créatinine sont surveillées."
      },
      {
        text: "Chez un patient diabétique avec hypertension artérielle, quelle classe d'antihypertenseurs est à utiliser avec précaution car elle peut masquer les signes d'hypoglycémie ?",
        options: [
          { text: "Les inhibiteurs calciques (amlodipine, nifédipine)", isCorrect: false },
          { text: "Les inhibiteurs de l'enzyme de conversion (IEC)", isCorrect: false },
          { text: "Les bêtabloquants (aténolol, bisoprolol)", isCorrect: true },
          { text: "Les antagonistes des récepteurs à l'angiotensine II", isCorrect: false }
        ],
        explanation: "Les bêtabloquants masquent les signes adrénergiques de l'hypoglycémie (tachycardie, tremblements). Seule la sueur froide reste présente. Ils sont à utiliser avec précaution chez le diabétique insulino-traité."
      },
      {
        text: "Quel inhibiteur calcique agit préférentiellement sur la vasodilatation périphérique avec peu d'effet inotrope négatif ?",
        options: [
          { text: "Le vérapamil (classe IV des antiarythmiques)", isCorrect: false },
          { text: "Le diltiazem (action cardiaque et vasculaire mixte)", isCorrect: false },
          { text: "L'amlodipine (dihydropyridine à longue durée d'action)", isCorrect: true },
          { text: "Le bisoprolol (bêtabloquant cardiosélectif de référence)", isCorrect: false }
        ],
        explanation: "L'amlodipine appartient aux dihydropyridines : elle agit principalement sur la vasodilatation périphérique avec un effet minime sur la conduction cardiaque, contrairement au vérapamil et au diltiazem."
      },
      {
        text: "Un patient sous diurétiques thiazidiques présente des crampes musculaires et une faiblesse. Quel bilan biologique suspectez-vous anormal ?",
        options: [
          { text: "Hyperkaliémie (kaliémie supérieure à 5,5 mmol/L)", isCorrect: false },
          { text: "Hypokaliémie (kaliémie inférieure à 3,5 mmol/L)", isCorrect: true },
          { text: "Hypercalcémie (calcémie supérieure à 2,6 mmol/L)", isCorrect: false },
          { text: "Hypernatrémie (natrémie supérieure à 145 mmol/L)", isCorrect: false }
        ],
        explanation: "Les diurétiques thiazidiques (hydrochlorothiazide) augmentent l'élimination du potassium, provoquant une hypokaliémie responsable de crampes, faiblesse musculaire et troubles du rythme cardiaque."
      },
      {
        text: "Quelle association médicamenteuse est contre-indiquée entre antihypertenseurs car elle peut provoquer une hypotension sévère ?",
        options: [
          { text: "IEC + diurétique thiazidique en début de traitement", isCorrect: false },
          { text: "IEC + ARA2 (double blocage du système rénine-angiotensine)", isCorrect: true },
          { text: "Bêtabloquant + diurétique de l'anse en cas d'insuffisance cardiaque", isCorrect: false },
          { text: "Inhibiteur calcique + diurétique thiazidique en monothérapie", isCorrect: false }
        ],
        explanation: "L'association IEC + ARA2 constitue un double blocage du système rénine-angiotensine-aldostérone (SRAA). Elle majore le risque d'hypotension, d'hyperkaliémie et d'insuffisance rénale aiguë et est contre-indiquée."
      },
      {
        text: "Lors de l'administration d'un antihypertenseur, quelle mesure infirmière est systématiquement réalisée avant la prise ?",
        options: [
          { text: "Mesure de la fréquence respiratoire et de la saturation en O2", isCorrect: false },
          { text: "Mesure de la pression artérielle selon le protocole en vigueur", isCorrect: true },
          { text: "Mesure de la glycémie capillaire avant chaque administration", isCorrect: false },
          { text: "Mesure du poids corporel et calcul de l'index de masse corporelle", isCorrect: false }
        ],
        explanation: "Avant toute administration d'antihypertenseur, l'infirmier(e) mesure la pression artérielle. Si elle est trop basse (selon le seuil défini dans la prescription), le médecin doit être contacté avant d'administrer."
      }
    ]
  },
  {
    title: "Médicaments cardiaques",
    description: "Digoxine, antiarythmiques et dérivés nitrés : mécanismes, indications et surveillance infirmière.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Médicaments cardiaques — digoxine, antiarythmiques et dérivés nitrés",
    difficulty: "medium",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action de la digoxine sur le myocarde ?",
        options: [
          { text: "Blocage des canaux calciques voltage-dépendants de type L", isCorrect: false },
          { text: "Inhibition de la pompe Na+/K+-ATPase augmentant le calcium intracellulaire", isCorrect: true },
          { text: "Activation des récepteurs bêta-1 adrénergiques cardiaques", isCorrect: false },
          { text: "Blocage des canaux sodiques rapides de la membrane cellulaire", isCorrect: false }
        ],
        explanation: "La digoxine inhibe la pompe Na+/K+-ATPase, entraînant une accumulation de sodium intracellulaire, puis une entrée de calcium via l'échangeur Na+/Ca2+. L'augmentation du calcium améliore la contraction myocardique (effet inotrope positif)."
      },
      {
        text: "Quels sont les signes précoces d'une intoxication à la digoxine à surveiller ?",
        options: [
          { text: "Hypertension artérielle, tachycardie et agitation psychomotrice", isCorrect: false },
          { text: "Nausées, vomissements, troubles visuels (halos jaunes ou verts)", isCorrect: true },
          { text: "Bronchospasme, hypoglycémie et bradycardie réflexe intense", isCorrect: false },
          { text: "Œdèmes des membres inférieurs et prise de poids rapide", isCorrect: false }
        ],
        explanation: "Les signes d'intoxication digitalique sont digestifs (nausées, vomissements, anorexie), visuels (xanthopsie — vision jaune/verte, halos) et cardiaques (bradycardie, blocs, arythmies). Ils nécessitent un arrêt immédiat et un dosage plasmatique."
      },
      {
        text: "Avant d'administrer la digoxine, quelle mesure est indispensable ?",
        options: [
          { text: "Vérifier la tension artérielle et la saturation en oxygène", isCorrect: false },
          { text: "Contrôler la fréquence cardiaque et ne pas l'administrer si FC < 60 bpm", isCorrect: true },
          { text: "Vérifier la glycémie capillaire et l'état de conscience du patient", isCorrect: false },
          { text: "Mesurer la diurèse des 24 heures et le bilan entrées-sorties", isCorrect: false }
        ],
        explanation: "La digoxine a un effet chronotrope négatif (bradycardie). Si la FC est inférieure à 60 bpm, l'administration est contre-indiquée et le médecin doit être averti. Cette vérification est une règle absolue."
      },
      {
        text: "Dans quelle classe des antiarythmiques de Vaughan Williams se classent les bêtabloquants ?",
        options: [
          { text: "Classe I : bloqueurs des canaux sodiques rapides", isCorrect: false },
          { text: "Classe II : bloqueurs des récepteurs bêta-adrénergiques", isCorrect: true },
          { text: "Classe III : bloqueurs des canaux potassiques (prolongent QT)", isCorrect: false },
          { text: "Classe IV : bloqueurs des canaux calciques cardiaques", isCorrect: false }
        ],
        explanation: "La classification de Vaughan Williams divise les antiarythmiques en 4 classes. Les bêtabloquants (aténolol, métoprolol) sont la classe II, agissant en bloquant les récepteurs bêta-1 adrénergiques du nœud sinusal et auriculo-ventriculaire."
      },
      {
        text: "L'amiodarone est un antiarythmique de classe III. Quel est son principal effet indésirable à long terme nécessitant une surveillance régulière ?",
        options: [
          { text: "Néphrotoxicité avec insuffisance rénale chronique progressive", isCorrect: false },
          { text: "Hépatotoxicité et troubles thyroïdiens (hypo ou hyperthyroïdie)", isCorrect: true },
          { text: "Myopathie proximale avec élévation des CPK sériques", isCorrect: false },
          { text: "Aplasie médullaire avec pancytopénie grave menaçant le pronostic", isCorrect: false }
        ],
        explanation: "L'amiodarone contient de l'iode et peut induire une dysthyroïdie (hypo ou hyperthyroïdie), une pneumopathie interstitielle, une hépatotoxicité et une photosensibilisation. La TSH, les transaminases et la radiographie thoracique sont surveillées."
      },
      {
        text: "Quel dérivé nitré est utilisé en urgence pour soulager rapidement un angor et par quelle voie d'administration ?",
        options: [
          { text: "Isosorbide dinitrate per os en comprimé à avaler avec de l'eau", isCorrect: false },
          { text: "Trinitrine (nitroglycérine) en spray sublingual ou comprimé sublingual", isCorrect: true },
          { text: "Molsidomine per os en comprimé à libération prolongée", isCorrect: false },
          { text: "Isosorbide mononitrate en patch transdermique à coller sur le thorax", isCorrect: false }
        ],
        explanation: "La trinitrine (nitroglycérine) par voie sublinguale (spray ou comprimé) agit en 1 à 3 minutes. Elle provoque une vasodilatation veineuse et artérielle, réduisant la précharge et l'ischémie myocardique lors d'un épisode angineux aigu."
      },
      {
        text: "Pourquoi les patients sous dérivés nitrés sont-ils informés d'alterner le site des patchs transdermiques ?",
        options: [
          { text: "Pour éviter les réactions allergiques locales et la nécrose cutanée", isCorrect: false },
          { text: "Pour prévenir la tolérance et permettre une absorption cutanée optimale", isCorrect: true },
          { text: "Pour respecter les zones autorisées selon la prescription médicale", isCorrect: false },
          { text: "Pour faciliter le retrait du patch sans douleur lors du changement", isCorrect: false }
        ],
        explanation: "L'alternance des sites permet d'éviter les irritations cutanées locales et surtout le phénomène de tolérance aux dérivés nitrés. Une période sans nitrates (patch-free interval nocturne) est également préconisée pour maintenir l'efficacité."
      },
      {
        text: "Quel signe doit alerter l'infirmier(e) lors d'une perfusion d'antiarythmique intraveineux ?",
        options: [
          { text: "Légère augmentation de la fréquence cardiaque à 85 bpm", isCorrect: false },
          { text: "Modification du rythme cardiaque ou allongement de l'intervalle QT", isCorrect: true },
          { text: "Légère élévation de la pression artérielle systolique à 135 mmHg", isCorrect: false },
          { text: "Sensation de chaleur transitoire au point de perfusion veineux", isCorrect: false }
        ],
        explanation: "Lors d'une perfusion d'antiarythmique, le patient doit être sous monitoring continu. Un allongement de l'intervalle QT peut induire des torsades de pointes, une arythmie ventriculaire grave potentiellement mortelle nécessitant l'arrêt immédiat."
      }
    ]
  },
  {
    title: "Psychotropes",
    description: "Anxiolytiques, antidépresseurs, neuroleptiques et hypnotiques : pharmacologie, indications et précautions infirmières.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Psychotropes — anxiolytiques, antidépresseurs, neuroleptiques et hypnotiques",
    difficulty: "medium",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action des benzodiazépines (anxiolytiques) ?",
        options: [
          { text: "Inhibition de la recapture de la sérotonine au niveau synaptique", isCorrect: false },
          { text: "Potentialisation de l'effet inhibiteur du GABA sur les neurones", isCorrect: true },
          { text: "Blocage des récepteurs dopaminergiques D2 mésolimbiques", isCorrect: false },
          { text: "Inhibition de la monoamine oxydase et augmentation des monoamines", isCorrect: false }
        ],
        explanation: "Les benzodiazépines (diazépam, alprazolam, lorazépam) se fixent sur le récepteur GABA-A et potentialisent l'action inhibitrice du GABA en augmentant la fréquence d'ouverture des canaux chlorure, entraînant un effet anxiolytique, sédatif et anticonvulsivant."
      },
      {
        text: "Quelle est la principale précaution à respecter lors de l'administration d'une benzodiazépine à un patient âgé ?",
        options: [
          { text: "Administrer la dose habituelle adulte car le métabolisme est équivalent", isCorrect: false },
          { text: "Réduire les doses et surveiller le risque de chute et de confusion", isCorrect: true },
          { text: "Associer systématiquement un antidote pour prévenir toute surdosage", isCorrect: false },
          { text: "Préférer la voie intraveineuse pour une meilleure prévisibilité du pic", isCorrect: false }
        ],
        explanation: "Chez le sujet âgé, les benzodiazépines entraînent un risque majeur de chutes, de confusion, de somnolence et de dépression respiratoire (critères de Beers). Les doses sont réduites et la durée de prescription est limitée."
      },
      {
        text: "Les antidépresseurs inhibiteurs sélectifs de la recapture de la sérotonine (ISRS) nécessitent un délai avant leur efficacité thérapeutique. Quel est ce délai habituel ?",
        options: [
          { text: "Efficacité immédiate dès la première prise (dans les 24 heures)", isCorrect: false },
          { text: "Efficacité observable après 2 à 4 semaines de traitement continu", isCorrect: true },
          { text: "Efficacité progressive sur 3 à 6 mois de traitement régulier", isCorrect: false },
          { text: "Efficacité uniquement lors d'une administration intraveineuse initiale", isCorrect: false }
        ],
        explanation: "Les ISRS (fluoxétine, sertraline, paroxétine) nécessitent 2 à 4 semaines pour exercer un effet antidépresseur complet. Ce délai est lié à l'adaptation progressive des récepteurs sérotoninergiques. Le patient doit être informé pour favoriser l'observance."
      },
      {
        text: "Quel risque grave doit être surveillé lors de l'initiation d'un traitement antidépresseur chez un patient déprimé ?",
        options: [
          { text: "Hyperglycémie sévère et coma hyperosmolaire non cétosique", isCorrect: false },
          { text: "Levée d'inhibition psychomotrice avec risque suicidaire majoré", isCorrect: true },
          { text: "Insuffisance rénale aiguë par néphrotoxicité directe du médicament", isCorrect: false },
          { text: "Aplasie médullaire avec risque infectieux et hémorragique grave", isCorrect: false }
        ],
        explanation: "En début de traitement antidépresseur, la levée d'inhibition survient avant l'amélioration de l'humeur : le patient récupère de l'énergie mais reste déprimé, ce qui peut majorer le risque de passage à l'acte suicidaire. Une surveillance rapprochée s'impose."
      },
      {
        text: "Quel effet indésirable caractéristique des neuroleptiques (antipsychotiques) est décrit par des mouvements involontaires du visage, de la langue et des membres ?",
        options: [
          { text: "Le syndrome extrapyramidal de type parkinsonisme médicamenteux", isCorrect: false },
          { text: "Les dyskinésies tardives après usage prolongé de neuroleptiques", isCorrect: true },
          { text: "L'akathisie avec impatience motrice intense et impossibilité de rester assis", isCorrect: false },
          { text: "La dystonie aiguë avec contracture douloureuse des muscles oculaires", isCorrect: false }
        ],
        explanation: "Les dyskinésies tardives apparaissent après plusieurs mois ou années de traitement neuroleptique. Elles se manifestent par des mouvements involontaires oro-faciaux (mâchonnement, grimaces) et des membres. Elles peuvent être irréversibles à l'arrêt du traitement."
      },
      {
        text: "Qu'est-ce que le syndrome malin des neuroleptiques et quelle est sa prise en charge immédiate ?",
        options: [
          { text: "Réaction allergique légère : antihistaminiques et surveillance ambulatoire", isCorrect: false },
          { text: "Urgence vitale : hyperthermie, rigidité, arrêt du neuroleptique, réanimation", isCorrect: true },
          { text: "Complication chronique : adaptation progressive de la posologie du traitement", isCorrect: false },
          { text: "Syndrome bénin géré par une réduction de moitié de la dose quotidienne", isCorrect: false }
        ],
        explanation: "Le syndrome malin des neuroleptiques est une urgence vitale rare mais grave : hyperthermie majeure, rigidité musculaire, troubles de la conscience, instabilité neurovégétative et élévation des CPK. L'arrêt immédiat du neuroleptique et la réanimation sont indispensables."
      },
      {
        text: "Quelle classe de médicaments hypnotiques est préférée chez le sujet âgé pour limiter les effets indésirables ?",
        options: [
          { text: "Les benzodiazépines à longue durée d'action (diazépam, nitrazépam)", isCorrect: false },
          { text: "Les antihistaminiques sédatifs disponibles sans ordonnance en pharmacie", isCorrect: false },
          { text: "Les hypnotiques non benzodiazépiniques à courte demi-vie (zolpidem, zopiclone)", isCorrect: true },
          { text: "Les barbituriques à faible dose pour un effet sédatif progressif et doux", isCorrect: false }
        ],
        explanation: "Le zolpidem et la zopiclone (apparentés aux benzodiazépines) ont une demi-vie courte, réduisant les effets résiduels diurnes. Cependant, même ces molécules sont à utiliser avec précaution chez le sujet âgé et limitées à 4 semaines maximum."
      },
      {
        text: "Un patient sous antidépresseurs ISRS se plaint de nausées intenses depuis le début du traitement. Quelle information lui transmettez-vous ?",
        options: [
          { text: "Arrêter immédiatement le traitement car c'est un signe d'allergie grave", isCorrect: false },
          { text: "Les nausées sont fréquentes en début de traitement et s'atténuent en quelques semaines", isCorrect: true },
          { text: "Doubler la dose de médicament pour accélérer l'adaptation digestive", isCorrect: false },
          { text: "Passer à un autre antidépresseur car les ISRS sont contre-indiqués ici", isCorrect: false }
        ],
        explanation: "Les nausées sont un effet indésirable fréquent et transitoire des ISRS en début de traitement. Elles sont liées à la stimulation des récepteurs sérotoninergiques digestifs. Elles diminuent généralement après 1 à 2 semaines. Prendre le médicament au moment du repas peut aider."
      }
    ]
  },
  {
    title: "Corticoïdes",
    description: "Mécanismes d'action, indications thérapeutiques, effets indésirables et règles de sevrage des corticoïdes.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Corticoïdes — mécanismes, indications, effets indésirables et sevrage",
    difficulty: "medium",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action principal des corticoïdes au niveau cellulaire ?",
        options: [
          { text: "Blocage des récepteurs membranaires aux prostaglandines inflammatoires", isCorrect: false },
          { text: "Liaison à des récepteurs intracellulaires modulant la transcription génique", isCorrect: true },
          { text: "Inhibition directe des enzymes COX-1 et COX-2 de l'acide arachidonique", isCorrect: false },
          { text: "Activation des leucocytes et potentialisation de la réponse immunitaire", isCorrect: false }
        ],
        explanation: "Les corticoïdes (cortisol, prednisolone, dexaméthasone) pénètrent dans la cellule et se lient à des récepteurs glucocorticoïdes intracytoplasmiques. Le complexe hormone-récepteur migre vers le noyau et module la transcription de nombreux gènes pro et anti-inflammatoires."
      },
      {
        text: "Pourquoi les corticoïdes per os doivent-ils être pris le matin de préférence au petit-déjeuner ?",
        options: [
          { text: "Pour améliorer l'absorption digestive et éviter les ulcères gastriques", isCorrect: false },
          { text: "Pour respecter le rythme circadien du cortisol et limiter la freination de l'axe", isCorrect: true },
          { text: "Pour faciliter l'observance en associant la prise à un repas habituel", isCorrect: false },
          { text: "Pour éviter les insomnies liées à l'effet stimulant des corticoïdes nocturnes", isCorrect: false }
        ],
        explanation: "Le cortisol naturel est sécrété selon un rythme circadien avec un pic le matin. Prendre les corticoïdes le matin mime ce rythme et minimise la freination de l'axe hypothalamo-hypophyso-surrénalien, réduisant ainsi le risque d'insuffisance surrénalienne."
      },
      {
        text: "Lequel de ces effets indésirables est caractéristique d'une corticothérapie prolongée ?",
        options: [
          { text: "Hypoglycémie sévère avec risque de coma hypoglycémique nocturne", isCorrect: false },
          { text: "Syndrome de Cushing iatrogène (obésité facio-tronculaire, vergetures)", isCorrect: true },
          { text: "Hypokaliémie sévère réfractaire aux supplémentations potassiques orales", isCorrect: false },
          { text: "Thrombopénie avec risque hémorragique et purpura thrombopénique", isCorrect: false }
        ],
        explanation: "Le syndrome de Cushing iatrogène résulte d'un excès de glucocorticoïdes exogènes : obésité facio-tronculaire (faciès lunaire, bosse de bison), vergetures pourpres, amyotrophie des membres, hypertension, hyperglycémie et ostéoporose."
      },
      {
        text: "Quel risque infectieux particulier doit être anticipé chez un patient immunodéprimé par corticothérapie prolongée ?",
        options: [
          { text: "Infection à Clostridium difficile liée aux antibiotiques associés", isCorrect: false },
          { text: "Infections opportunistes : pneumocystose, candidose, tuberculose", isCorrect: true },
          { text: "Infections virales respiratoires banales sans gravité particulière", isCorrect: false },
          { text: "Infections cutanées superficielles limitées à l'impétigo bactérien", isCorrect: false }
        ],
        explanation: "La corticothérapie prolongée entraîne une immunodépression profonde favorisant les infections opportunistes : pneumocystose (PCP), candidose systémique, réactivation d'une tuberculose, herpès ou zona grave. Une prophylaxie par cotrimoxazole est parfois prescrite."
      },
      {
        text: "Pourquoi l'arrêt brutal d'une corticothérapie prolongée est-il dangereux ?",
        options: [
          { text: "Risque de rebond inflammatoire uniquement sans atteinte surrénalienne", isCorrect: false },
          { text: "Risque d'insuffisance surrénalienne aiguë car l'axe HHS est freiné", isCorrect: true },
          { text: "Risque d'hypercorticisme rebond par hypersécrétion d'ACTH endogène", isCorrect: false },
          { text: "Risque de syndrome de sevrage sans danger vital si décroissance rapide", isCorrect: false }
        ],
        explanation: "Sous corticothérapie prolongée, l'axe hypothalamo-hypophyso-surrénalien (HHS) est freiné par rétrocontrôle négatif. Les surrénales s'atrophient et ne produisent plus de cortisol endogène. L'arrêt brutal peut provoquer une insuffisance surrénalienne aiguë menaçant le pronostic vital."
      },
      {
        text: "Quelle surveillance glycémique est nécessaire chez un patient diabétique débutant une corticothérapie ?",
        options: [
          { text: "Aucune surveillance particulière car les corticoïdes n'affectent pas la glycémie", isCorrect: false },
          { text: "Surveillance renforcée avec adaptation du traitement antidiabétique si nécessaire", isCorrect: true },
          { text: "Surveillance uniquement en cas de diabète de type 1 insulino-requérant", isCorrect: false },
          { text: "Surveillance hebdomadaire uniquement lors de la première semaine du traitement", isCorrect: false }
        ],
        explanation: "Les corticoïdes stimulent la néoglucogenèse hépatique et induisent une résistance à l'insuline, provoquant une hyperglycémie (diabète cortico-induit). Chez le diabétique connu, un renforcement de la surveillance glycémique et une adaptation du traitement antidiabétique sont nécessaires."
      },
      {
        text: "Quelle mesure préventive non médicamenteuse est recommandée chez un patient sous corticothérapie prolongée pour prévenir l'ostéoporose ?",
        options: [
          { text: "Repos strict au lit pour éviter les fractures de contrainte osseuse", isCorrect: false },
          { text: "Activité physique adaptée, apports calciques et vitamine D suffisants", isCorrect: true },
          { text: "Régime hyperprotéiné exclusif pour maintenir la masse osseuse résiduelle", isCorrect: false },
          { text: "Immobilisation préventive des articulations portantes par attelles orthopédiques", isCorrect: false }
        ],
        explanation: "La corticothérapie prolongée cause une ostéoporose par inhibition de la formation osseuse et augmentation de la résorption. Les mesures préventives incluent l'activité physique en charge, des apports en calcium (1 à 1,5 g/j) et en vitamine D, et parfois des bisphosphonates."
      },
      {
        text: "Quel signe clinique doit alerter l'infirmier(e) chez un patient sous corticothérapie et peut indiquer une complication gastroduodénale ?",
        options: [
          { text: "Céphalées persistantes et troubles visuels bilatéraux progressifs", isCorrect: false },
          { text: "Douleurs épigastriques, méléna ou hématémèse nécessitant évaluation médicale", isCorrect: true },
          { text: "Douleurs articulaires diffuses et raideur matinale des articulations", isCorrect: false },
          { text: "Prurit généralisé sans lésion cutanée visible à l'examen infirmier", isCorrect: false }
        ],
        explanation: "Les corticoïdes favorisent les ulcères gastroduodénaux en inhibant la synthèse des prostaglandines protectrices de la muqueuse. Des douleurs épigastriques, une hématémèse ou un méléna sont des signes d'alerte qui nécessitent une évaluation médicale urgente."
      }
    ]
  },
  {
    title: "Médicaments à risque",
    description: "Identification des médicaments à risque, précautions infirmières spécifiques et protocoles de double vérification.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: "Médicaments à risque — liste, précautions infirmières et double vérification",
    difficulty: "medium",
    duration: 16,
    isPublished: true,
    questions: [
      {
        text: "Parmi les classes suivantes, laquelle est systématiquement classée comme médicament à haut risque selon l'ANSM et l'ISMP ?",
        options: [
          { text: "Les antidouleurs de palier I (paracétamol, ibuprofène, aspirine)", isCorrect: false },
          { text: "Les insulines et les anticoagulants injectables (héparine, HBPM)", isCorrect: true },
          { text: "Les vitamines et compléments alimentaires en supplémentation courante", isCorrect: false },
          { text: "Les antiacides et protecteurs gastriques en prise ponctuelle", isCorrect: false }
        ],
        explanation: "L'ISMP (Institute for Safe Medication Practices) et l'ANSM listent les médicaments à haut risque incluant : insulines, anticoagulants (héparine, AVK, HBPM), chlorure de potassium concentré, opioïdes, agents de chimiothérapie et électrolytes concentrés."
      },
      {
        text: "Qu'est-ce que la règle des '5B' (ou '5 R') en sécurité médicamenteuse ?",
        options: [
          { text: "Bon traçage, Bonne rédaction, Bon stockage, Bonne livraison, Bon retour", isCorrect: false },
          { text: "Bon médicament, Bonne dose, Bon patient, Bonne voie, Bon moment", isCorrect: true },
          { text: "Bon prescripteur, Bon dispensateur, Bon receveur, Bon circuit, Bon délai", isCorrect: false },
          { text: "Bon accord, Bonne ordonnance, Bon profil, Bonne conformité, Bonne date", isCorrect: false }
        ],
        explanation: "La règle des 5B (5 Rights en anglais) est un standard de sécurité infirmier : Bon médicament — Bonne dose — Bon patient — Bonne voie d'administration — Bon moment. Elle est systématiquement appliquée avant chaque administration médicamenteuse."
      },
      {
        text: "Dans quel cas la double vérification indépendante (DVI) est-elle obligatoire en milieu hospitalier ?",
        options: [
          { text: "Pour tout médicament administré par voie orale en unité conventionnelle", isCorrect: false },
          { text: "Pour les médicaments à haut risque (insuline, héparine, potassium IV concentré)", isCorrect: true },
          { text: "Uniquement pour les médicaments prescrits par voie intraveineuse lente", isCorrect: false },
          { text: "Pour tout médicament nouveau introduit dans l'ordonnance du patient", isCorrect: false }
        ],
        explanation: "La double vérification indépendante (DVI) est recommandée pour les médicaments à haut risque : insuline, héparine non fractionnée IV, chlorure de potassium concentré, opioïdes par voie intraveineuse et chimiothérapies. Deux professionnels vérifient séparément avant l'administration."
      },
      {
        text: "Quel risque grave est associé à l'administration rapide de chlorure de potassium (KCl) concentré par voie intraveineuse directe ?",
        options: [
          { text: "Hypoglycémie sévère avec risque de coma et de convulsions", isCorrect: false },
          { text: "Arrêt cardiaque par hyperkaliémie aiguë et fibrillation ventriculaire", isCorrect: true },
          { text: "Insuffisance rénale aiguë par précipitation dans les tubules rénaux", isCorrect: false },
          { text: "Encéphalopathie aiguë par œdème cérébral osmotique brutal", isCorrect: false }
        ],
        explanation: "Le chlorure de potassium concentré ne doit JAMAIS être injecté en IV directe. Une administration rapide provoque une hyperkaliémie aiguë entraînant un arrêt cardiaque par fibrillation ventriculaire. Il doit être dilué et administré à débit contrôlé sous monitoring cardio-vasculaire."
      },
      {
        text: "Comment l'infirmier(e) identifie-t-il/elle correctement le patient avant l'administration d'un médicament à risque ?",
        options: [
          { text: "En demandant au patient de confirmer verbalement son numéro de chambre", isCorrect: false },
          { text: "En vérifiant le bracelet d'identification et en demandant le nom et la date de naissance", isCorrect: true },
          { text: "En consultant le tableau au poste infirmier et le nom sur la porte de chambre", isCorrect: false },
          { text: "En reconnaissant visuellement le patient après plusieurs jours de soins", isCorrect: false }
        ],
        explanation: "L'identification du patient doit se faire avec deux éléments de concordance : vérification du bracelet d'identitovigilance + question ouverte demandant au patient de dire son nom et sa date de naissance. Cette règle est absolue avant tout médicament à risque."
      },
      {
        text: "Lors de la préparation d'une seringue d'héparine non fractionnée, quelle précaution est prioritaire ?",
        options: [
          { text: "Vérifier la date de péremption mais pas nécessairement la concentration", isCorrect: false },
          { text: "Confirmer la concentration prescrite et calculer le débit avec une double vérification", isCorrect: true },
          { text: "Préparer la seringue 2 heures à l'avance pour optimiser l'organisation infirmière", isCorrect: false },
          { text: "Utiliser une voie centrale exclusive car l'héparine est irritante en périphérique", isCorrect: false }
        ],
        explanation: "L'héparine non fractionnée existe en plusieurs concentrations (5 000, 25 000 UI/mL). Une erreur de concentration ou de calcul de débit peut entraîner une hémorragie grave ou une inefficacité thérapeutique. La double vérification du calcul et de la concentration est obligatoire."
      },
      {
        text: "Qu'est-ce qu'une erreur médicamenteuse évitée (near miss) et pourquoi doit-elle être déclarée ?",
        options: [
          { text: "Une erreur survenue sans conséquence ; inutile de la déclarer si aucune suite", isCorrect: false },
          { text: "Une erreur interceptée avant d'atteindre le patient ; sa déclaration améliore la sécurité", isCorrect: true },
          { text: "Une erreur de dispensation par le pharmacien sans implication infirmière", isCorrect: false },
          { text: "Une erreur administrative de dossier sans lien avec l'administration médicamenteuse", isCorrect: false }
        ],
        explanation: "Un near miss (presque-accident) est une erreur interceptée avant d'atteindre le patient. Sa déclaration dans le système de signalement des événements indésirables (SIGNALEMENT.SOCIAL-SANTE.GOUV.FR) est essentielle pour identifier les défaillances systémiques et améliorer les pratiques."
      },
      {
        text: "Quel est le rôle infirmier spécifique lors de la préparation d'un médicament à haut risque en unité de soins intensifs ?",
        options: [
          { text: "Déléguer la préparation à l'aide-soignant sous supervision directe attentive", isCorrect: false },
          { text: "Appliquer les protocoles institutionnels, documenter et réaliser une DVI systématique", isCorrect: true },
          { text: "Préparer à l'avance plusieurs seringues pour anticiper les besoins nocturnes", isCorrect: false },
          { text: "Utiliser exclusivement des médicaments pré-dilués par la pharmacie hospitalière", isCorrect: false }
        ],
        explanation: "En unité de soins intensifs, pour les médicaments à haut risque, l'infirmier(e) doit : respecter les protocoles validés, réaliser une double vérification indépendante, documenter la préparation et l'administration, et signaler toute anomalie. La traçabilité est une obligation légale et éthique."
      }
    ]
  }
];
