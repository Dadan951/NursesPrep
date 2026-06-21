module.exports = [
  {
    title: "Antalgiques palier 1 — Paracétamol, AINS et aspirine",
    description: "Maîtrisez les antalgiques non opioïdes : mécanismes d'action, indications, contre-indications et surveillance du paracétamol, des AINS et de l'aspirine.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: 11,
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action principal du paracétamol ?",
        options: [
          { text: "Inhibition centrale des cyclooxygénases COX-1 et COX-2", isCorrect: false },
          { text: "Inhibition périphérique des cyclooxygénases COX-1 et COX-2", isCorrect: false },
          { text: "Activation des récepteurs opioïdes mu au niveau central", isCorrect: false },
          { text: "Inhibition centrale de la synthèse des prostaglandines", isCorrect: true }
        ],
        explanation: "Le paracétamol agit principalement au niveau central en inhibant la synthèse des prostaglandines. Contrairement aux AINS, il n'inhibe pas significativement les COX périphériques, ce qui explique l'absence d'effet anti-inflammatoire et la bonne tolérance gastrique."
      },
      {
        text: "Quelle est la dose maximale de paracétamol par voie orale chez un adulte de poids normal sans insuffisance hépatique ?",
        options: [
          { text: "2 grammes par 24 heures avec un intervalle de 4 heures", isCorrect: false },
          { text: "3 grammes par 24 heures avec un intervalle de 6 heures", isCorrect: false },
          { text: "4 grammes par 24 heures avec un intervalle de 6 heures", isCorrect: true },
          { text: "6 grammes par 24 heures avec un intervalle de 4 heures", isCorrect: false }
        ],
        explanation: "La dose maximale de paracétamol chez l'adulte est de 4 g par 24 heures, avec un intervalle minimal de 6 heures entre chaque prise (soit 1 g toutes les 6 h). En cas d'insuffisance hépatique, d'alcoolisme ou de dénutrition, la dose est réduite à 2-3 g par 24 heures."
      },
      {
        text: "Quel organe est principalement menacé en cas de surdosage au paracétamol ?",
        options: [
          { text: "Le rein, par nécrose tubulaire aiguë et anurie", isCorrect: false },
          { text: "Le foie, par cytolyse hépatique et insuffisance hépatique", isCorrect: true },
          { text: "Le poumon, par bronchospasme et syndrome de détresse respiratoire", isCorrect: false },
          { text: "Le cœur, par allongement du QT et arythmie ventriculaire", isCorrect: false }
        ],
        explanation: "Le surdosage en paracétamol provoque une hépatotoxicité sévère pouvant aller jusqu'à l'insuffisance hépatique fulminante. L'antidote est la N-acétylcystéine (Fluimucil antidote), à administrer le plus tôt possible après l'intoxication."
      },
      {
        text: "Quel est le mécanisme commun des AINS (anti-inflammatoires non stéroïdiens) ?",
        options: [
          { text: "Inhibition réversible ou irréversible des cyclooxygénases COX-1 et COX-2", isCorrect: true },
          { text: "Blocage des récepteurs de la bradykinine et de l'histamine", isCorrect: false },
          { text: "Inhibition de la phospholipase A2 comme les corticoïdes", isCorrect: false },
          { text: "Activation des canaux potassiques et hyperpolarisation membranaire", isCorrect: false }
        ],
        explanation: "Les AINS inhibent les cyclooxygénases (COX-1 et COX-2), enzymes responsables de la synthèse des prostaglandines à partir de l'acide arachidonique. L'inhibition de COX-1 entraîne les effets gastrotoxiques, tandis que COX-2 est impliqué dans l'inflammation."
      },
      {
        text: "Quelle est la contre-indication absolue des AINS au-delà de 24 semaines de grossesse ?",
        options: [
          { text: "Risque de malformations cardiaques du fœtus au premier trimestre", isCorrect: false },
          { text: "Fermeture prématurée du canal artériel et oligoamnios fœtal", isCorrect: true },
          { text: "Risque d'hémorragie cérébrale maternelle par hypertension", isCorrect: false },
          { text: "Tératogénicité directe sur le système nerveux central fœtal", isCorrect: false }
        ],
        explanation: "Les AINS sont contre-indiqués à partir de 24 semaines d'aménorrhée car ils peuvent provoquer une fermeture prématurée du canal artériel et un oligoamnios fœtal par réduction de la perfusion rénale. Au-delà de 28 SA, ils sont formellement contre-indiqués."
      },
      {
        text: "Comment l'aspirine (acide acétylsalicylique) inhibe-t-elle l'agrégation plaquettaire ?",
        options: [
          { text: "Inhibition réversible de la COX-1 plaquettaire pendant 24 heures", isCorrect: false },
          { text: "Inhibition irréversible de la COX-1 plaquettaire pendant toute leur durée de vie", isCorrect: true },
          { text: "Blocage des récepteurs GP IIb/IIIa à la surface des plaquettes", isCorrect: false },
          { text: "Inhibition de la phosphodiestérase et augmentation de l'AMPc plaquettaire", isCorrect: false }
        ],
        explanation: "L'aspirine inhibe irréversiblement la COX-1 plaquettaire par acétylation, bloquant la synthèse de thromboxane A2 (agrégant plaquettaire). Comme les plaquettes ne peuvent pas synthétiser de nouvelles enzymes, l'effet dure toute leur durée de vie (7-10 jours)."
      },
      {
        text: "Quelle surveillance infirmière est prioritaire lors d'un traitement par AINS ?",
        options: [
          { text: "Surveillance de la glycémie capillaire à jeun et après les repas", isCorrect: false },
          { text: "Surveillance des signes digestifs, rénaux et de la pression artérielle", isCorrect: true },
          { text: "Surveillance de l'électrocardiogramme et du rythme cardiaque", isCorrect: false },
          { text: "Surveillance de la numération formule sanguine hebdomadaire", isCorrect: false }
        ],
        explanation: "Les AINS peuvent provoquer des troubles digestifs (ulcère, hémorragie), une insuffisance rénale aiguë (par réduction du débit de filtration glomérulaire) et une hypertension artérielle. La surveillance porte donc sur les signes digestifs, la diurèse, la créatinine et la pression artérielle."
      },
      {
        text: "Dans quelle situation le paracétamol est-il préférable à l'ibuprofène comme antalgique palier 1 ?",
        options: [
          { text: "Chez un patient avec une cirrhose hépatique compensée sous traitement", isCorrect: false },
          { text: "Chez un patient avec un ulcère gastroduodénal actif sous IPP", isCorrect: true },
          { text: "Chez un patient en état de choc hémorragique avec hypotension", isCorrect: false },
          { text: "Chez un patient en insuffisance hépatique sévère non compensée", isCorrect: false }
        ],
        explanation: "Chez un patient avec un ulcère gastroduodénal actif, le paracétamol est préféré car il n'inhibe pas les COX périphériques et ne présente pas de gastrotoxicité. L'ibuprofène (AINS) est contre-indiqué en cas d'ulcère actif en raison du risque d'hémorragie digestive."
      }
    ]
  },
  {
    title: "Antalgiques paliers 2 et 3 — Tramadol, codéine, morphine et surveillance",
    description: "Approfondissez la connaissance des antalgiques opioïdes : pharmacologie du tramadol, de la codéine et de la morphine, leurs effets indésirables et la surveillance infirmière spécifique.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: 12,
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Comment le tramadol exerce-t-il son effet antalgique ?",
        options: [
          { text: "Par agonisme pur sur les récepteurs opioïdes mu sans autre mécanisme", isCorrect: false },
          { text: "Par agonisme opioïde mu et inhibition de la recapture de sérotonine et noradrénaline", isCorrect: true },
          { text: "Par inhibition des COX centrales et activation des canaux sodiques", isCorrect: false },
          { text: "Par antagonisme NMDA et inhibition des récepteurs kappa opioïdes", isCorrect: false }
        ],
        explanation: "Le tramadol a un double mécanisme : agoniste faible des récepteurs opioïdes mu et inhibiteur de la recapture de sérotonine et noradrénaline (mécanisme monoaminergique). Ce double mécanisme lui confère une efficacité intermédiaire mais aussi un risque de syndrome sérotoninergique."
      },
      {
        text: "Pourquoi la codéine est-elle considérée comme une prodrogue ?",
        options: [
          { text: "Elle est inactive per os et doit être administrée par voie injectable", isCorrect: false },
          { text: "Elle est métabolisée en morphine par le CYP2D6 pour exercer son effet", isCorrect: true },
          { text: "Elle nécessite une activation hépatique par la glucuronoconjugaison", isCorrect: false },
          { text: "Elle est transformée en codéinone active par l'estomac avant absorption", isCorrect: false }
        ],
        explanation: "La codéine est une prodrogue métabolisée en morphine par l'enzyme CYP2D6. Les métaboliseurs ultrarapides (CYP2D6) peuvent présenter une toxicité opioïde sévère, tandis que les métaboliseurs lents ne bénéficient d'aucun effet antalgique. C'est pourquoi la codéine est déconseillée chez l'enfant."
      },
      {
        text: "Quelle est la triade clinique caractéristique d'un surdosage morphinique ?",
        options: [
          { text: "Tachycardie, agitation, mydriase et hyperthermie intense", isCorrect: false },
          { text: "Hypertension, bradycardie, diarrhée et hyperréflexie ostéotendineuse", isCorrect: false },
          { text: "Dépression respiratoire, myosis et troubles de la conscience", isCorrect: true },
          { text: "Bradycardie, hypoglycémie, tremblements et sueurs profuses", isCorrect: false }
        ],
        explanation: "La triade du surdosage opioïde comprend : dépression respiratoire (bradypnée < 12/min), myosis (constriction pupillaire) et troubles de la conscience (somnolence jusqu'au coma). Le traitement est la naloxone (Narcan), antagoniste opioïde, par voie IV ou IM."
      },
      {
        text: "Comment est exprimée l'équianalgésie entre la morphine orale et la morphine injectable (IV) ?",
        options: [
          { text: "La dose IV est égale à la dose orale, sans facteur de conversion", isCorrect: false },
          { text: "La dose IV est le double de la dose orale pour un même effet antalgique", isCorrect: false },
          { text: "La dose orale est environ 3 fois la dose IV pour un même effet antalgique", isCorrect: true },
          { text: "La dose orale est la moitié de la dose IV pour un même effet antalgique", isCorrect: false }
        ],
        explanation: "La biodisponibilité de la morphine orale étant d'environ 30-35 % (effet de premier passage hépatique important), il faut environ 3 fois la dose orale pour obtenir le même effet qu'une dose injectable IV. Par exemple, 30 mg de morphine orale ≈ 10 mg de morphine IV."
      },
      {
        text: "Quelle est la principale différence entre la morphine à libération immédiate (LI) et à libération prolongée (LP) ?",
        options: [
          { text: "La morphine LP a une biodisponibilité supérieure à la morphine LI", isCorrect: false },
          { text: "La morphine LI agit en 30 min et dure 4 h ; la LP agit en 2-4 h et dure 12 h", isCorrect: true },
          { text: "La morphine LP est utilisée pour les accès douloureux, la LI pour le fond", isCorrect: false },
          { text: "La morphine LI peut être broyée pour administration par sonde, pas la LP", isCorrect: false }
        ],
        explanation: "La morphine LI (ex: Actiskénan, Sévrédol) a un délai d'action de 30 min et une durée d'effet de 4 heures : elle est utilisée pour les douleurs de fond en titration ou les accès douloureux. La morphine LP (ex: Moscontin, Skenan LP) a une durée d'action de 12 heures : elle est utilisée pour le traitement de fond. La LP ne doit jamais être broyée."
      },
      {
        text: "Quelle précaution infirmière est essentielle avant chaque administration de morphine ?",
        options: [
          { text: "Mesurer la glycémie capillaire et vérifier l'absence d'hypoglycémie", isCorrect: false },
          { text: "Évaluer la douleur par une échelle validée et vérifier la fréquence respiratoire", isCorrect: true },
          { text: "Contrôler l'électrocardiogramme et vérifier l'absence d'allongement QT", isCorrect: false },
          { text: "Peser le patient et recalculer la dose selon le poids corporel actuel", isCorrect: false }
        ],
        explanation: "Avant chaque administration de morphine, l'infirmière doit évaluer l'intensité de la douleur (EVA, EN) pour justifier l'administration, et vérifier la fréquence respiratoire (FR ≥ 12/min). Une FR < 10/min contre-indique l'administration et nécessite l'appel médical immédiat."
      },
      {
        text: "Quel effet indésirable des opioïdes nécessite une prévention systématique dès l'initiation du traitement ?",
        options: [
          { text: "La constipation, par prescription d'un laxatif osmotique ou stimulant", isCorrect: true },
          { text: "Les nausées, par administration systématique de métopimazine avant chaque prise", isCorrect: false },
          { text: "La rétention urinaire, par sondage vésical préventif systématique", isCorrect: false },
          { text: "Le prurit, par prescription systématique d'antihistaminiques sédatifs", isCorrect: false }
        ],
        explanation: "La constipation est un effet indésirable constant et non résolutif des opioïdes (tolérance absente) : elle doit être prévenue systématiquement dès l'initiation par un laxatif (de préférence osmotique ou stimulant). Les autres effets (nausées, prurit) s'atténuent généralement après quelques jours de traitement."
      },
      {
        text: "Quelle est l'antidote du surdosage aux opioïdes et sa voie d'administration en urgence ?",
        options: [
          { text: "La flumazénil en intraveineuse lente pour antagoniser les récepteurs opioïdes", isCorrect: false },
          { text: "La N-acétylcystéine en perfusion intraveineuse sur 21 heures", isCorrect: false },
          { text: "La naloxone en intraveineuse (0,4 mg répétables) ou intramusculaire", isCorrect: true },
          { text: "Le sugammadex en bolus intraveineux unique selon le poids du patient", isCorrect: false }
        ],
        explanation: "La naloxone (Narcan) est l'antagoniste compétitif pur des récepteurs opioïdes mu. En urgence, elle s'administre en IV (0,1 à 0,4 mg par titration toutes les 2 min) ou en IM. Sa durée d'action étant plus courte que celle de la morphine, une surveillance rapprochée et des réinjections peuvent être nécessaires."
      }
    ]
  },
  {
    title: "Antibiotiques en pratique — Pénicillines, céphalosporines, fluoroquinolones",
    description: "Explorez les grandes familles d'antibiotiques couramment utilisés : mécanismes d'action, spectre, résistances, effets indésirables et règles de bon usage.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: 13,
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action commun aux pénicillines et aux céphalosporines ?",
        options: [
          { text: "Inhibition de la synthèse des protéines ribosomales 30S bactériennes", isCorrect: false },
          { text: "Inhibition de la synthèse de la paroi bactérienne par blocage des PLP", isCorrect: true },
          { text: "Inhibition de la topoisomérase II et IV bloquant la réplication de l'ADN", isCorrect: false },
          { text: "Perturbation de la membrane cytoplasmique bactérienne par détergence", isCorrect: false }
        ],
        explanation: "Les bêta-lactamines (pénicillines et céphalosporines) inhibent la synthèse de la paroi bactérienne en se liant aux protéines de liaison aux pénicillines (PLP), enzymes responsables de la polymérisation du peptidoglycane. Cela conduit à une bactérie fragilisée et à la lyse cellulaire."
      },
      {
        text: "Quel mécanisme de résistance bactérienne est le plus fréquent envers les bêta-lactamines ?",
        options: [
          { text: "Modification des porines membranaires réduisant la perméabilité aux antibiotiques", isCorrect: false },
          { text: "Production de bêta-lactamases hydrolysant le cycle bêta-lactame de l'antibiotique", isCorrect: true },
          { text: "Acquisition de pompes à efflux expulsant l'antibiotique hors de la bactérie", isCorrect: false },
          { text: "Mutation des PLP réduisant l'affinité pour l'antibiotique comme dans le SARM", isCorrect: false }
        ],
        explanation: "La résistance la plus fréquente aux bêta-lactamines est la production de bêta-lactamases, enzymes qui hydrolysent le cycle bêta-lactame et inactivent l'antibiotique. Pour lutter contre ce mécanisme, on associe parfois un inhibiteur de bêta-lactamase (ex : acide clavulanique dans l'amoxicilline-acide clavulanique)."
      },
      {
        text: "Une patiente allergique à la pénicilline peut-elle recevoir une céphalosporine de 3e génération ?",
        options: [
          { text: "Non, la contre-indication est absolue pour toutes les céphalosporines sans exception", isCorrect: false },
          { text: "Oui, sans précaution car il n'existe aucune allergie croisée entre ces familles", isCorrect: false },
          { text: "Avec prudence car l'allergie croisée est estimée à 1-2 %, après bilan allergologique", isCorrect: true },
          { text: "Oui, mais uniquement par voie orale car la voie IV est contre-indiquée", isCorrect: false }
        ],
        explanation: "L'allergie croisée entre pénicillines et céphalosporines est estimée à 1-2 %. En cas d'allergie documentée à la pénicilline, les céphalosporines peuvent être utilisées avec prudence (après bilan allergologique si possible) car les structures chimiques sont différentes. En cas d'allergie anaphylactique sévère aux pénicillines, les carbapénèmes ou autres familles sont préférés."
      },
      {
        text: "Quel est le spectre privilégié des fluoroquinolones (ciprofloxacine, lévofloxacine) ?",
        options: [
          { text: "Cocci Gram positif uniquement (streptocoques, staphylocoques, entérocoques)", isCorrect: false },
          { text: "Large spectre incluant bacilles Gram négatif, germes intracellulaires et certains Gram positif", isCorrect: true },
          { text: "Anaérobies exclusivement avec activité sur Clostridium et Bacteroides fragilis", isCorrect: false },
          { text: "Champignons filamenteux et levures avec activité antifongique puissante", isCorrect: false }
        ],
        explanation: "Les fluoroquinolones ont un large spectre couvrant les bacilles Gram négatif (entérobactéries, Pseudomonas pour ciprofloxacine), les germes intracellulaires (Legionella, Chlamydia, Mycoplasma) et pour les fluoroquinolones de génération récente (lévofloxacine, moxifloxacine), les cocci Gram positif incluant le pneumocoque."
      },
      {
        text: "Quel effet indésirable grave des fluoroquinolones a conduit à des restrictions d'utilisation par l'ANSM ?",
        options: [
          { text: "Hépatotoxicité sévère avec cytolyse et cholestase ictérique réversible", isCorrect: false },
          { text: "Tendinopathies (tendinite, rupture tendineuse) et atteintes du système nerveux", isCorrect: true },
          { text: "Néphrotoxicité cumulative avec insuffisance rénale chronique irréversible", isCorrect: false },
          { text: "Aplasie médullaire et pancytopénie nécessitant une transfusion systématique", isCorrect: false }
        ],
        explanation: "L'ANSM a restreint les indications des fluoroquinolones en raison d'effets indésirables graves et potentiellement irréversibles : tendinopathies (risque de rupture du tendon d'Achille, majoré par les corticoïdes), neuropathies périphériques, troubles psychiatriques et effets sur le système nerveux central. Elles doivent être réservées aux infections sans alternative."
      },
      {
        text: "Que signifie l'acronyme ECBU et pourquoi est-il indispensable avant une antibiothérapie urinaire ?",
        options: [
          { text: "Examen Complet du Bilan Urinaire — évalue la fonction rénale avant traitement", isCorrect: false },
          { text: "Examen Cytobactériologique des Urines — identifie le germe et son antibiogramme", isCorrect: true },
          { text: "Electrophorèse et Culture Bactérienne des Urines — détecte les résistances plasmidiques", isCorrect: false },
          { text: "Examen Cytologique et Biochimique des Urines — dépiste les leucocytes et nitrites", isCorrect: false }
        ],
        explanation: "L'ECBU (Examen Cytobactériologique des Urines) permet d'identifier le micro-organisme responsable de l'infection urinaire et de réaliser un antibiogramme pour connaître les sensibilités et résistances. Il est indispensable pour adapter l'antibiothérapie et éviter de traiter avec un antibiotique inadapté, contribuant ainsi à la lutte contre l'antibiorésistance."
      },
      {
        text: "Quel conseil infirmier est primordial lors de l'administration d'amoxicilline per os ?",
        options: [
          { text: "Prendre le médicament à jeun strict 1 heure avant les repas pour une meilleure absorption", isCorrect: false },
          { text: "Respecter les intervalles de prise et terminer le traitement même en cas d'amélioration", isCorrect: true },
          { text: "Éviter toute exposition au soleil pendant et 48 heures après la fin du traitement", isCorrect: false },
          { text: "Diluer systématiquement les comprimés dans un grand verre d'eau gazeuse", isCorrect: false }
        ],
        explanation: "Il est essentiel de respecter les intervalles de prise (pour maintenir des concentrations efficaces) et de terminer le traitement prescrit, même si les symptômes s'améliorent. Un arrêt prématuré favorise les résistances bactériennes et les rechutes. L'amoxicilline peut être prise avec ou sans nourriture (bonne tolérance digestive)."
      },
      {
        text: "Quel antibiotique est de première intention pour une angine bactérienne à streptocoque A prouvée par test rapide ?",
        options: [
          { text: "Ciprofloxacine per os pendant 5 jours en première intention systématique", isCorrect: false },
          { text: "Amoxicilline per os pendant 6 jours en première intention recommandée", isCorrect: true },
          { text: "Ceftriaxone intramusculaire en dose unique pour les angines sévères", isCorrect: false },
          { text: "Métronidazole per os pendant 7 jours ciblant les anaérobies pharyngés", isCorrect: false }
        ],
        explanation: "Pour une angine bactérienne à streptocoque du groupe A (confirmée par TDR ou culture), l'amoxicilline per os pendant 6 jours est recommandée en première intention (selon les recommandations de la SPILF). En cas d'allergie aux pénicillines, on utilise la céfuroxime (C2G) ou, en cas d'allergie grave, l'azithromycine après antibiogramme."
      }
    ]
  },
  {
    title: "Anticoagulants — Héparine, HBPM, AVK et AOD : mécanismes et surveillance",
    description: "Maîtrisez les différentes classes d'anticoagulants : mécanismes d'action, indications, surveillance biologique et gestion des situations à risque hémorragique.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: 14,
    difficulty: "advanced",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action principal de l'héparine non fractionnée (HNF) ?",
        options: [
          { text: "Inhibition directe du facteur Xa et de la thrombine sans cofacteur protéique", isCorrect: false },
          { text: "Potentialisation de l'antithrombine III inhibant plusieurs facteurs de la coagulation", isCorrect: true },
          { text: "Blocage de la vitamine K et inhibition de la synthèse des facteurs II, VII, IX, X", isCorrect: false },
          { text: "Inhibition directe et réversible de la thrombine par fixation à son site actif", isCorrect: false }
        ],
        explanation: "L'héparine non fractionnée potentialise l'antithrombine III (ATIII), inhibiteur naturel de la coagulation. Le complexe héparine-ATIII inhibe plusieurs facteurs de la coagulation, notamment la thrombine (IIa) et le facteur Xa. Son action est rapide mais nécessite une surveillance par le TCA (temps de céphaline activée)."
      },
      {
        text: "Quel examen biologique est utilisé pour surveiller l'HNF administrée par voie veineuse continue ?",
        options: [
          { text: "L'INR (International Normalized Ratio) mesuré quotidiennement", isCorrect: false },
          { text: "Le TP (taux de prothrombine) exprimé en pourcentage d'activité", isCorrect: false },
          { text: "Le TCA (temps de céphaline activée) avec un ratio cible de 2 à 3", isCorrect: true },
          { text: "L'activité anti-Xa dont la cible est 0,5 à 1 UI/mL en traitement curatif", isCorrect: false }
        ],
        explanation: "L'HNF par voie IV est surveillée par le TCA (temps de céphaline activée). La cible thérapeutique est un ratio TCA patient/TCA témoin entre 2 et 3 (soit 2 à 3 fois la valeur normale). Le premier contrôle est réalisé 4 à 6 heures après le début du traitement, puis toutes les 6 heures jusqu'à stabilisation."
      },
      {
        text: "Quelle est la différence principale entre l'HNF et les héparines de bas poids moléculaire (HBPM) ?",
        options: [
          { text: "L'HNF s'administre uniquement par voie sous-cutanée, les HBPM par IV uniquement", isCorrect: false },
          { text: "Les HBPM ont une demi-vie plus longue, une action anti-Xa prédominante et ne nécessitent pas de surveillance en routine", isCorrect: true },
          { text: "Les HBPM sont contre-indiquées dans la thrombose veineuse profonde et l'embolie pulmonaire", isCorrect: false },
          { text: "L'HNF a une action anti-Xa exclusive tandis que les HBPM inhibent uniquement la thrombine", isCorrect: false }
        ],
        explanation: "Les HBPM (enoxaparine/Lovenox, tinzaparine/Innohep...) ont une demi-vie plus longue (permettant 1 à 2 injections SC/jour), une activité anti-Xa prédominante (faible action anti-IIa) et une meilleure biodisponibilité. En traitement curatif à posologie fixe, elles ne nécessitent pas de surveillance biologique en routine (sauf insuffisance rénale, poids extrêmes, grossesse)."
      },
      {
        text: "Quel est l'antidote de l'héparine en cas d'hémorragie grave ?",
        options: [
          { text: "La vitamine K1 administrée par voie intraveineuse lente en urgence", isCorrect: false },
          { text: "La protamine sulfate neutralisant l'héparine à raison de 1 mg pour 100 UI d'héparine", isCorrect: true },
          { text: "L'andexanet alfa inhibant l'activité anti-Xa des HBPM et des AOD", isCorrect: false },
          { text: "L'idarucizumab se liant au dabigatran pour neutraliser son effet anticoagulant", isCorrect: false }
        ],
        explanation: "La protamine sulfate est l'antidote de l'héparine. Elle forme un complexe ionique stable avec l'héparine, neutralisant son effet anticoagulant. La posologie est de 1 mg de protamine pour 100 UI d'HNF. Elle neutralise moins efficacement les HBPM (neutralisation partielle de l'activité anti-IIa)."
      },
      {
        text: "Quelle est la zone thérapeutique cible de l'INR pour un patient sous AVK pour fibrillation atriale ?",
        options: [
          { text: "INR entre 1,5 et 2,0 pour limiter le risque hémorragique tout en étant efficace", isCorrect: false },
          { text: "INR entre 2,0 et 3,0 comme cible standard pour la plupart des indications", isCorrect: true },
          { text: "INR entre 3,0 et 4,5 pour les prothèses valvulaires mécaniques à haut risque", isCorrect: false },
          { text: "INR entre 4,0 et 5,0 pour les thromboses artérielles récidivantes graves", isCorrect: false }
        ],
        explanation: "Pour la fibrillation atriale, la thrombose veineuse profonde et l'embolie pulmonaire, la zone thérapeutique cible des AVK est un INR entre 2 et 3. Pour les prothèses valvulaires mécaniques à haut risque (mitrale mécanique), la cible peut être entre 2,5 et 3,5. Un INR < 2 expose au risque thromboembolique, un INR > 4-5 expose au risque hémorragique."
      },
      {
        text: "Quel aliment peut modifier l'efficacité des anticoagulants AVK et doit être consommé en quantité constante ?",
        options: [
          { text: "Les produits laitiers riches en calcium modifiant l'absorption intestinale des AVK", isCorrect: false },
          { text: "Les légumes à feuilles vertes riches en vitamine K antagonisant l'effet des AVK", isCorrect: true },
          { text: "Les agrumes riches en vitamine C potentialisant dangereusement l'effet anticoagulant", isCorrect: false },
          { text: "Les viandes rouges riches en fer modifiant le métabolisme hépatique des AVK", isCorrect: false }
        ],
        explanation: "Les AVK (warfarine, acénocoumarol, fluindione) inhibent la synthèse des facteurs vitamine K-dépendants (II, VII, IX, X). Un apport alimentaire variable en vitamine K (légumes verts : épinards, brocolis, choux, haricots verts) modifie leur efficacité. Les patients doivent maintenir un apport en vitamine K constant plutôt que de les supprimer."
      },
      {
        text: "Quel avantage principal des anticoagulants oraux directs (AOD) par rapport aux AVK justifie leur utilisation croissante ?",
        options: [
          { text: "Leur efficacité supérieure dans toutes les indications y compris les prothèses valvulaires", isCorrect: false },
          { text: "Leur réversibilité complète par la vitamine K en cas d'hémorragie grave", isCorrect: false },
          { text: "Leur posologie fixe sans surveillance biologique de routine et peu d'interactions", isCorrect: true },
          { text: "Leur coût moindre et disponibilité en médicament générique dans toutes les pharmacies", isCorrect: false }
        ],
        explanation: "Les AOD (rivaroxaban, apixaban, dabigatran, edoxaban) présentent l'avantage d'une posologie fixe, d'une fenêtre thérapeutique large, de peu d'interactions médicamenteuses et alimentaires, et d'une surveillance biologique non nécessaire en routine. Leur utilisation est cependant contre-indiquée avec les prothèses valvulaires mécaniques."
      },
      {
        text: "Quelle surveillance infirmière est indispensable chez un patient sous anticoagulants ?",
        options: [
          { text: "Surveiller la glycémie capillaire quotidienne et les signes d'hypoglycémie réactionnelle", isCorrect: false },
          { text: "Surveiller les signes hémorragiques (hématomes, épistaxis, méléna, hématurie)", isCorrect: true },
          { text: "Surveiller la pression artérielle toutes les heures et alerter pour toute variation", isCorrect: false },
          { text: "Surveiller la saturation en oxygène et la fréquence respiratoire toutes les 4 heures", isCorrect: false }
        ],
        explanation: "La surveillance infirmière prioritaire sous anticoagulants porte sur la détection des signes hémorragiques : hématomes, saignements des gencives, épistaxis, hématurie (urines rouges), méléna (selles noires), hématémèse, céphalées violentes (hémorragie cérébrale). Toute manifestation doit être signalée au médecin et les résultats INR/TCA surveillés selon prescription."
      }
    ]
  },
  {
    title: "Insulines et antidiabétiques — Types d'insuline, schémas et surveillance glycémique",
    description: "Maîtrisez les différents types d'insuline, les schémas d'insulinothérapie, les antidiabétiques oraux et la surveillance glycémique du patient diabétique.",
    semester: "Semestre 1",
    category: "UE 2.11 - Pharmacologie et thérapeutiques",
    chapter: 15,
    difficulty: "intermediate",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la classification des insulines selon leur durée d'action, de la plus rapide à la plus longue ?",
        options: [
          { text: "Analogue rapide → NPH → analogue lent → insuline régulière humaine", isCorrect: false },
          { text: "Analogue rapide → insuline régulière → NPH → analogue lent", isCorrect: true },
          { text: "Insuline régulière → analogue rapide → analogue lent → insuline NPH", isCorrect: false },
          { text: "NPH → analogue rapide → insuline régulière → analogue ultra-lent", isCorrect: false }
        ],
        explanation: "La classification par ordre de durée d'action croissante est : 1) Analogues rapides (lispro/Humalog, asparte/NovoRapid, glulisine/Apidra) : action en 10-15 min, durée 3-5 h ; 2) Insuline humaine régulière (Actrapid, Umuline rapide) : action en 30 min, durée 6-8 h ; 3) NPH (Insulatard, Umuline NPH) : action en 2-4 h, durée 12-18 h ; 4) Analogues lents (glargine/Lantus, détémir/Levemir, dégludec/Tresiba) : durée 20-42 h."
      },
      {
        text: "Dans un schéma basal-bolus, à quel moment s'administre l'insuline basale (analogue lent) ?",
        options: [
          { text: "Avant chaque repas principal pour couvrir l'hyperglycémie postprandiale", isCorrect: false },
          { text: "En une ou deux injections quotidiennes à heure fixe pour couvrir les besoins basaux", isCorrect: true },
          { text: "Uniquement le matin à jeun en fonction des glycémies capillaires de la nuit", isCorrect: false },
          { text: "En perfusion continue à la pompe à insuline exclusivement sans injection sous-cutanée", isCorrect: false }
        ],
        explanation: "Dans le schéma basal-bolus (schéma intensifié), l'insuline basale (glargine, détémir, dégludec) est administrée en 1 à 2 injections quotidiennes à heure fixe (souvent le soir ou le matin). Elle couvre les besoins insuliniques de base entre les repas et la nuit. Les bolus d'analogue rapide sont injectés avant chaque repas pour couvrir l'hyperglycémie postprandiale."
      },
      {
        text: "Quelle est la voie d'administration standard des insulines pour le traitement du diabète à domicile ?",
        options: [
          { text: "La voie intraveineuse directe à l'aide d'un cathéter court dans une veine périphérique", isCorrect: false },
          { text: "La voie sous-cutanée en rotation sur les sites d'injection recommandés", isCorrect: true },
          { text: "La voie intramusculaire dans le muscle deltoïde avec une aiguille de 16 mm", isCorrect: false },
          { text: "La voie orale sous forme de comprimés gastrorésistants à libération prolongée", isCorrect: false }
        ],
        explanation: "L'insuline est administrée par voie sous-cutanée (SC) à domicile, sur des sites de rotation : abdomen (absorption la plus rapide), cuisses, fesses et bras. La rotation des sites prévient la lipodystrophie. La voie IV est réservée à l'urgence (cétoacidose diabétique) en milieu hospitalier avec l'insuline rapide (insuline humaine régulière ou analogue rapide)."
      },
      {
        text: "Quels sont les signes cliniques d'une hypoglycémie modérée que l'infirmière doit reconnaître ?",
        options: [
          { text: "Polyurie, polydipsie, haleine cétonique et déshydratation progressive", isCorrect: false },
          { text: "Sueurs, tremblements, palpitations, sensation de faim et irritabilité", isCorrect: true },
          { text: "Bradycardie, hypertension, mydriase et hyperréflexie ostéotendineuse", isCorrect: false },
          { text: "Fièvre, rougeur cutanée, tachycardie et pression artérielle effondrée", isCorrect: false }
        ],
        explanation: "L'hypoglycémie (glycémie < 0,70 g/L) se manifeste par des signes adrénergiques (sueurs froides, tremblements, palpitations, pâleur, faim impérieuse) et des signes neuroglycopéniques (difficultés de concentration, irritabilité, confusion). En cas de perte de conscience : glucagon IM ou SC (si IV impossible) et appel du SAMU."
      },
      {
        text: "Comment doit-on traiter une hypoglycémie légère à modérée chez un patient conscient ?",
        options: [
          { text: "Injection de glucagon 1 mg en sous-cutané sans resucrage oral complémentaire", isCorrect: false },
          { text: "Apport de 15 g de glucides rapides puis contrôle glycémique 15 minutes après", isCorrect: true },
          { text: "Perfusion de sérum glucosé 5 % à débit libre jusqu'à disparition des symptômes", isCorrect: false },
          { text: "Attendre que l'hypoglycémie se corrige spontanément sans intervention immédiate", isCorrect: false }
        ],
        explanation: "La règle des 15 s'applique : administrer 15 g de glucides rapides (3 sucres, 150 mL de jus de fruit, 3 cuillères à café de miel ou de sucre) puis contrôler la glycémie capillaire 15 minutes après. Si la glycémie reste < 0,70 g/L, répéter le resucrage. Une fois normalisée, associer un glucide lent si le repas est éloigné."
      },
      {
        text: "Quel antidiabétique oral de première intention est recommandé dans le diabète de type 2 sans contre-indication ?",
        options: [
          { text: "Le glibenclamide, sulfamide hypoglycémiant stimulant la sécrétion d'insuline", isCorrect: false },
          { text: "La metformine, biguanide réduisant la production hépatique de glucose", isCorrect: true },
          { text: "La sitagliptine, inhibiteur de la DPP-4 potentialisant l'action des incrétines", isCorrect: false },
          { text: "L'empagliflozine, inhibiteur du SGLT2 augmentant la glycosurie rénale", isCorrect: false }
        ],
        explanation: "La metformine (Glucophage) est l'antidiabétique oral de première intention dans le diabète de type 2, recommandée par les sociétés savantes (HAS, EASD). Elle réduit la production hépatique de glucose et améliore la sensibilité à l'insuline. Elle ne provoque pas d'hypoglycémie en monothérapie et est neutre sur le poids, voire favorise une légère perte de poids."
      },
      {
        text: "Dans quelle situation la metformine est-elle contre-indiquée de manière absolue ?",
        options: [
          { text: "En cas d'HbA1c supérieure à 9 % nécessitant une insulinothérapie intensive", isCorrect: false },
          { text: "En cas d'insuffisance rénale sévère (DFG < 30 mL/min) par risque d'acidose lactique", isCorrect: true },
          { text: "En cas d'obésité avec IMC > 35 kg/m² car potentialise la prise de poids", isCorrect: false },
          { text: "En cas de diabète de type 1 car inefficace sur les cellules bêta déficitaires", isCorrect: false }
        ],
        explanation: "La metformine est contre-indiquée en cas d'insuffisance rénale sévère (DFG < 30 mL/min) car elle s'accumule et peut provoquer une acidose lactique (complication grave). Elle doit être suspendue 48 h avant et après injection de produit de contraste iodé et en cas d'intervention chirurgicale. Elle est réduite si DFG entre 30-45 mL/min."
      },
      {
        text: "Quel est l'objectif glycémique général de l'HbA1c pour un diabétique de type 2 selon les recommandations de la HAS ?",
        options: [
          { text: "HbA1c inférieure à 6 % pour prévenir toutes les complications micro et macrovasculaires", isCorrect: false },
          { text: "HbA1c inférieure ou égale à 7 % pour la majorité des patients diabétiques de type 2", isCorrect: true },
          { text: "HbA1c entre 8 et 9 % pour tous les patients afin d'éviter les hypoglycémies sévères", isCorrect: false },
          { text: "HbA1c inférieure à 5,5 % pour atteindre la normoglycémie et prévenir l'athérosclérose", isCorrect: false }
        ],
        explanation: "L'objectif général d'HbA1c recommandé par la HAS pour un diabétique de type 2 est ≤ 7 %. Cet objectif peut être individualisé : plus strict (≤ 6,5 %) pour les patients jeunes sans complication, plus souple (≤ 8-9 %) pour les personnes âgées fragiles ou avec comorbidités importantes. L'HbA1c reflète la glycémie moyenne des 2-3 derniers mois."
      }
    ]
  }
];
