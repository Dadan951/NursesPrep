module.exports = [
  {
    title: "Stérilisation — méthodes, contrôles et traçabilité",
    description: "Maîtriser les méthodes de stérilisation, les indicateurs de contrôle et les exigences de traçabilité en milieu de soins.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 11,
    difficulty: "Intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quelle est la température standard utilisée en autoclave (stérilisation à la vapeur d'eau saturée) pour les dispositifs médicaux thermorésistants ?",
        options: [
          { text: "121 °C pendant 15 minutes ou 134 °C pendant 18 minutes", isCorrect: true },
          { text: "110 °C pendant 30 minutes ou 125 °C pendant 20 minutes", isCorrect: false },
          { text: "140 °C pendant 10 minutes ou 160 °C pendant 12 minutes", isCorrect: false },
          { text: "100 °C pendant 45 minutes ou 115 °C pendant 30 minutes", isCorrect: false }
        ],
        explanation: "La norme EN 13060 fixe deux cycles standards : 121 °C / 15 min (cycle B) et 134 °C / 18 min (cycle universel). La vapeur saturée sous pression est le procédé de référence pour tout matériel thermorésistant."
      },
      {
        text: "Quel indicateur chimique de classe 6 est utilisé pour valider un cycle de stérilisation à la vapeur ?",
        options: [
          { text: "Un indicateur intégrant qui vire à la couleur cible si température, temps et vapeur sont atteints", isCorrect: true },
          { text: "Un indicateur de surface qui change de couleur au simple contact de la chaleur sèche", isCorrect: false },
          { text: "Un indicateur biologique contenant des spores de Bacillus stearothermophilus inactivées", isCorrect: false },
          { text: "Un indicateur colorimétrique qui réagit uniquement à la présence d'oxyde d'éthylène gazeux", isCorrect: false }
        ],
        explanation: "Les indicateurs chimiques de classe 6 (émulateurs de cycle) intègrent les trois paramètres critiques : température, durée et présence de vapeur. Ils ne remplacent pas le test biologique mensuel mais valident chaque charge."
      },
      {
        text: "Qu'est-ce que le test de Bowie-Dick et à quelle fréquence doit-il être réalisé ?",
        options: [
          { text: "Test de pénétration de la vapeur dans les packs poreux, réalisé chaque jour avant la première charge", isCorrect: true },
          { text: "Test de stérilité microbiologique sur spores, réalisé chaque semaine en début de semaine", isCorrect: false },
          { text: "Test de résistance mécanique de l'emballage, réalisé à chaque changement de lot d'emballages", isCorrect: false },
          { text: "Test de calibration des thermomètres, réalisé chaque mois par le service de métrologie", isCorrect: false }
        ],
        explanation: "Le test de Bowie-Dick vérifie que la vapeur pénètre uniformément dans une charge poreuse et que l'air a été correctement évacué. Il doit être effectué chaque matin en cycle vide avant toute stérilisation de matériel."
      },
      {
        text: "Quelle est la durée de péremption standard d'un dispositif médical stérilisé emballé sous sachet pelable en papier/plastique conservé dans de bonnes conditions ?",
        options: [
          { text: "La péremption est liée aux événements (conservation propre et intacte) et non à une durée fixe réglementaire", isCorrect: true },
          { text: "La péremption est fixée à 3 mois quelle que soit la méthode d'emballage utilisée", isCorrect: false },
          { text: "La péremption est fixée à 6 mois et doit être inscrite sur l'étiquette de l'autoclave", isCorrect: false },
          { text: "La péremption est fixée à 12 mois et validée par un indicateur biologique mensuel obligatoire", isCorrect: false }
        ],
        explanation: "Selon le principe event-related sterility (ERS), la stérilité est maintenue tant que l'emballage reste intact, propre et sec. Il n'existe pas de durée réglementaire fixe en France ; c'est l'intégrité de l'emballage qui prime."
      },
      {
        text: "Quelle méthode de stérilisation à basse température est indiquée pour les dispositifs médicaux thermosensibles ?",
        options: [
          { text: "La stérilisation par oxyde d'éthylène (OE) ou par plasma de peroxyde d'hydrogène (H₂O₂)", isCorrect: true },
          { text: "La stérilisation par chaleur sèche à l'étuve à 160 °C pendant 120 minutes minimum", isCorrect: false },
          { text: "La stérilisation par rayonnements gamma réservée aux endoscopes souples réutilisables", isCorrect: false },
          { text: "La désinfection de haut niveau par trempage dans le glutaraldéhyde à 2 % pendant 10 heures", isCorrect: false }
        ],
        explanation: "L'oxyde d'éthylène (EO) et le plasma de peroxyde d'hydrogène (ex. STERRAD) permettent de stériliser des dispositifs fragiles (optiques, plastiques) ne supportant pas les températures d'autoclave. L'OE nécessite une longue dégazage obligatoire."
      },
      {
        text: "Que doit contenir obligatoirement la traçabilité d'un cycle de stérilisation selon les recommandations HAS ?",
        options: [
          { text: "Numéro de lot, date, appareil utilisé, opérateur, résultats des indicateurs et destination des charges", isCorrect: true },
          { text: "Numéro de lot, date et signature de l'infirmière de bloc opératoire uniquement", isCorrect: false },
          { text: "Date, température atteinte et nom du fabricant des dispositifs médicaux traités seulement", isCorrect: false },
          { text: "Numéro de série de l'autoclave, résultat du Bowie-Dick et nom du patient uniquement", isCorrect: false }
        ],
        explanation: "La traçabilité complète d'un cycle de stérilisation doit inclure : identifiant de la charge, numéro de cycle, date et heure, équipement utilisé, opérateur, résultats de tous les indicateurs de contrôle et destination (service ou patient)."
      },
      {
        text: "Quelle est la différence fondamentale entre stérilisation et désinfection de haut niveau ?",
        options: [
          { text: "La stérilisation détruit toutes les formes microbiennes y compris les spores ; la DHN détruit 99,99 % des micro-organismes mais pas forcément toutes les spores", isCorrect: true },
          { text: "La stérilisation n'est efficace que sur les bactéries ; la DHN est efficace sur bactéries et virus mais pas les spores", isCorrect: false },
          { text: "La stérilisation et la désinfection de haut niveau ont un résultat identique sur le plan microbiologique pratique", isCorrect: false },
          { text: "La stérilisation est réservée au bloc opératoire ; la DHN s'applique uniquement en service de réanimation médicale", isCorrect: false }
        ],
        explanation: "La stérilisation garantit une réduction de la charge microbienne avec une probabilité de survie ≤ 10⁻⁶ (niveau de sécurité de stérilité). La DHN (ex. acide peracétique sur endoscopes) réduit fortement la charge mais n'atteint pas ce niveau d'assurance absolue pour les spores résistantes."
      },
      {
        text: "Dans quel ordre s'effectuent les étapes de la filière de retraitement des dispositifs médicaux en stérilisation centrale ?",
        options: [
          { text: "Pré-désinfection → nettoyage → contrôle/conditionnement → stérilisation → stockage et distribution", isCorrect: true },
          { text: "Nettoyage → pré-désinfection → stérilisation → contrôle → stockage et distribution finale", isCorrect: false },
          { text: "Désinfection de haut niveau → nettoyage → conditionnement → stérilisation → contrôle qualité", isCorrect: false },
          { text: "Rinçage → nettoyage → pré-désinfection → stérilisation → contrôle et distribution", isCorrect: false }
        ],
        explanation: "La filière réglementaire (circulaire DGS/5C/DHOS/E2 2001-138) impose : pré-désinfection immédiate au point d'utilisation, puis nettoyage/décontamination, contrôle visuel et fonctionnel, conditionnement, stérilisation puis stockage. La pré-désinfection en amont est indispensable pour la sécurité des personnels."
      }
    ]
  },
  {
    title: "Désinfection et décontamination — niveaux, produits et matériels",
    description: "Distinguer les niveaux de désinfection, identifier les produits adaptés et connaître les règles d'utilisation pour chaque type de matériel.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 12,
    difficulty: "Intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Selon la classification de Spaulding, quelle catégorie regroupe les dispositifs médicaux en contact avec des muqueuses intactes ou la peau lésée ?",
        options: [
          { text: "Dispositifs semi-critiques nécessitant une désinfection de haut niveau (DHN)", isCorrect: true },
          { text: "Dispositifs critiques nécessitant une stérilisation ou une désinfection de très haut niveau", isCorrect: false },
          { text: "Dispositifs non critiques nécessitant une désinfection de bas niveau par essuyage humide", isCorrect: false },
          { text: "Dispositifs inertes ne nécessitant qu'un simple nettoyage à l'eau savonneuse froide", isCorrect: false }
        ],
        explanation: "La classification de Spaulding (1968) distingue : critique (contact tissus stériles → stérilisation), semi-critique (muqueuses/peau lésée → DHN) et non critique (peau saine → désinfection bas niveau). Les endoscopes digestifs sont l'exemple type des dispositifs semi-critiques."
      },
      {
        text: "Quel est le principe actif de référence pour la désinfection des surfaces et des mains en milieu de soins selon les recommandations françaises ?",
        options: [
          { text: "L'alcool éthylique ou isopropylique à 70°, seul ou en association avec un ammonium quaternaire", isCorrect: true },
          { text: "Le glutaraldéhyde à 2 % dilué dans l'eau du robinet à température ambiante standard", isCorrect: false },
          { text: "Le formaldéhyde à 4 % utilisé pour toutes les surfaces y compris les mains des soignants", isCorrect: false },
          { text: "L'eau de Javel concentrée à 9,6° chlorométriques appliquée directement sur la peau intacte", isCorrect: false }
        ],
        explanation: "L'alcool (éthylique 70° ou isopropylique 70°) est le référentiel pour la friction hygiénique des mains (SHA) et la désinfection des petites surfaces. Il est bactéricide, fongicide et virucide mais non sporicide. L'eau de Javel est réservée aux surfaces environnementales."
      },
      {
        text: "Quelle est la concentration recommandée d'eau de Javel pour la désinfection des surfaces souillées par des liquides biologiques ?",
        options: [
          { text: "Une solution à 0,5 % de chlore actif (soit 5 000 ppm) ou eau de Javel diluée au 1/10", isCorrect: true },
          { text: "Une solution à 0,05 % de chlore actif (soit 500 ppm) ou eau de Javel diluée au 1/100", isCorrect: false },
          { text: "Une solution à 5 % de chlore actif (soit 50 000 ppm) ou eau de Javel pure non diluée", isCorrect: false },
          { text: "Une solution à 0,1 % de chlore actif (soit 1 000 ppm) ou eau de Javel diluée au 1/50", isCorrect: false }
        ],
        explanation: "Pour les souillures biologiques (sang, vomissements), la SFHH recommande une solution à 0,5 % de chlore actif (dilution au 1/10 d'une eau de Javel à 2,6 % de chlore actif). Après absorption de la souillure, la surface est traitée puis rincée."
      },
      {
        text: "Qu'est-ce que la pré-désinfection (ou décontamination) d'un dispositif médical et quel est son principal objectif ?",
        options: [
          { text: "Première étape de réduction de la contamination microbienne pour protéger les personnels et faciliter le nettoyage", isCorrect: true },
          { text: "Étape finale qui remplace la stérilisation pour les dispositifs médicaux réutilisables non critiques seulement", isCorrect: false },
          { text: "Traitement réservé aux dispositifs à usage unique avant leur élimination dans la filière DASRI", isCorrect: false },
          { text: "Procédure optionnelle effectuée uniquement si le dispositif est visiblement souillé par du sang frais", isCorrect: false }
        ],
        explanation: "La pré-désinfection (trempage dans un détergent-désinfectant) est obligatoire immédiatement après utilisation pour réduire la charge microbienne, sécuriser le transport et faciliter le nettoyage ultérieur. Elle ne se substitue pas à la stérilisation."
      },
      {
        text: "Quel type de désinfectant est l'acide peracétique (APA) et pour quelle application est-il principalement utilisé ?",
        options: [
          { text: "Désinfectant de haut niveau sporicide utilisé pour la désinfection des endoscopes en endoscopie", isCorrect: true },
          { text: "Désinfectant de bas niveau bactériostatique utilisé pour le nettoyage des sols en milieu hospitalier", isCorrect: false },
          { text: "Antiseptique cutané utilisé pour la désinfection des plaies chirurgicales et des sites d'injection", isCorrect: false },
          { text: "Désinfectant de niveau intermédiaire utilisé uniquement pour la désinfection des surfaces en inox", isCorrect: false }
        ],
        explanation: "L'acide peracétique est un oxydant puissant, bactéricide, fongicide, virucide et sporicide. Il est utilisé dans les laveurs-désinfecteurs d'endoscopes (ex. ANIOS DES) pour la DHN des endoscopes thermosensibles. Il est biodégradable et ne laisse pas de résidu toxique."
      },
      {
        text: "Quel est le principe de la règle 'du plus propre au plus sale' lors d'un bionettoyage ?",
        options: [
          { text: "Commencer par les zones les moins contaminées et finir par les zones les plus souillées pour éviter la recontamination", isCorrect: true },
          { text: "Commencer par les zones les plus sales pour éliminer d'abord le risque maximal de contamination croisée", isCorrect: false },
          { text: "Alterner aléatoirement entre zones propres et sales selon la disponibilité des matériels de nettoyage", isCorrect: false },
          { text: "Appliquer la même technique de nettoyage simultanément sur toutes les zones de la pièce en parallèle", isCorrect: false }
        ],
        explanation: "Le bionettoyage respecte une marche en avant : on commence par les surfaces les moins contaminées (poignées de porte, rebords) avant les zones plus souillées (WC, sanitaires). Cela évite de transporter la contamination vers des zones propres avec le matériel de nettoyage."
      },
      {
        text: "Quelle est la différence entre un antiseptique et un désinfectant ?",
        options: [
          { text: "Un antiseptique s'applique sur les tissus vivants ; un désinfectant s'applique sur les surfaces et objets inertes", isCorrect: true },
          { text: "Un antiseptique détruit toutes les formes microbiennes ; un désinfectant ne réduit que partiellement la charge", isCorrect: false },
          { text: "Un antiseptique est plus concentré qu'un désinfectant et a donc un spectre d'activité plus étroit", isCorrect: false },
          { text: "Un antiseptique est réservé aux surfaces stériles ; un désinfectant traite les surfaces non stériles seulement", isCorrect: false }
        ],
        explanation: "Par définition réglementaire (norme NF EN 14885), un antiseptique est destiné aux tissus vivants (peau, muqueuses, plaies), tandis qu'un désinfectant s'applique sur des surfaces inertes. Un même principe actif (ex. alcool iodé) peut avoir les deux formes à des concentrations différentes."
      },
      {
        text: "Quel paramètre réduit l'efficacité d'un désinfectant chloré (eau de Javel) et doit être contrôlé lors de son utilisation ?",
        options: [
          { text: "La présence de matières organiques, la dilution incorrecte, la lumière et le stockage prolongé au chaud", isCorrect: true },
          { text: "La présence d'eau pure sans sels minéraux et le stockage à basse température inférieure à 4 °C", isCorrect: false },
          { text: "Le contact avec des surfaces métalliques uniquement, sans influence de la température ambiante", isCorrect: false },
          { text: "Le pH neutre de l'eau de dilution et la présence d'ammonium quaternaire en mélange uniquement", isCorrect: false }
        ],
        explanation: "Le chlore actif est inactivé par les matières organiques (sang, protéines), la lumière UV, la chaleur et le vieillissement. L'eau de Javel diluée doit être préparée extemporanément, conservée à l'abri de la lumière et utilisée dans les 24 heures. La présence de matières organiques impose de nettoyer avant de désinfecter."
      }
    ]
  },
  {
    title: "Gestion des DASRI — tri, conditionnement et filière d'élimination",
    description: "Connaître la réglementation relative aux déchets d'activités de soins à risques infectieux, les règles de tri et la filière d'élimination.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 13,
    difficulty: "Intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Selon le décret du 6 novembre 1997, qui est responsable de l'élimination des DASRI produits en établissement de santé ?",
        options: [
          { text: "Le producteur des déchets, c'est-à-dire l'établissement de santé ou le professionnel de santé", isCorrect: true },
          { text: "La collectivité territoriale (commune ou communauté de communes) via le service des ordures ménagères", isCorrect: false },
          { text: "L'Agence Régionale de Santé (ARS) qui mandate un prestataire régional agréé directement", isCorrect: false },
          { text: "Le fabricant du matériel médical à usage unique qui en assure la reprise obligatoire systématique", isCorrect: false }
        ],
        explanation: "Le principe pollueur-payeur s'applique : le décret n° 97-1048 du 6 novembre 1997 fait du producteur (établissement de soins, praticien libéral) le responsable de l'élimination de ses DASRI, de la collecte jusqu'à la destruction finale, avec traçabilité obligatoire."
      },
      {
        text: "Dans quel contenant doivent être éliminés les objets piquants, coupants ou tranchants (PCT) souillés ou non souillés ?",
        options: [
          { text: "Dans un collecteur à aiguilles rigide, étanche et homologué NF X30-500, dès que possible après usage", isCorrect: true },
          { text: "Dans le sac poubelle jaune DASRI dès qu'ils sont recapuchonnés par l'infirmière après le soin", isCorrect: false },
          { text: "Dans le sac poubelle ordinaire noir si les PCT ne sont pas souillés par du sang du patient", isCorrect: false },
          { text: "Dans une boîte en carton hermétique puis dans le sac DASRI jaune dans un délai de 24 heures", isCorrect: false }
        ],
        explanation: "Les PCT doivent être jetés IMMÉDIATEMENT dans un collecteur rigide homologué (norme NF X30-500) sans recapuchonnage. Le recapuchonnage est interdit car il représente la première cause d'AES par piqûre. Le collecteur est rempli aux 3/4 puis fermé définitivement avant élimination."
      },
      {
        text: "Quel est le délai maximal de stockage des DASRI sur le site de production avant enlèvement selon la réglementation française ?",
        options: [
          { text: "72 heures maximum si la quantité produite est supérieure à 5 kg/mois, dans un local dédié verrouillé", isCorrect: true },
          { text: "24 heures maximum quelle que soit la quantité produite et le type d'établissement concerné", isCorrect: false },
          { text: "7 jours maximum si la quantité produite est inférieure à 100 kg/mois en établissement de santé", isCorrect: false },
          { text: "30 jours maximum si les déchets sont conservés dans un congélateur dédié à température négative", isCorrect: false }
        ],
        explanation: "Le décret de 1997 fixe : 72 h de stockage pour une production > 5 kg/mois (hôpitaux), 7 jours pour 5 kg/mois à 5 kg/semaine, et 3 mois pour les producteurs < 5 kg/mois (professionnels libéraux). Le local doit être verrouillé, ventilé et identifié DASRI."
      },
      {
        text: "Quelle filière d'élimination finale est obligatoire pour les DASRI en France ?",
        options: [
          { text: "L'incinération dans des unités agréées ou le prétraitement par banalisation (autoclave DASRI) puis ordures ménagères", isCorrect: true },
          { text: "L'enfouissement dans des centres d'enfouissement technique (CET) de classe 1 ou 2 uniquement", isCorrect: false },
          { text: "Le compostage industriel en unités certifiées ISO 14001 après décontamination chimique préalable", isCorrect: false },
          { text: "Le déversement en station d'épuration agréée après dilution dans l'eau stérile en volume suffisant", isCorrect: false }
        ],
        explanation: "Les DASRI peuvent être incinérés dans des unités d'incinération de déchets dangereux (UIOM agréées) ou banalisés par traitement physico-chimique (autoclave à haute température) qui les rend méconnaissables et non dangereux avant mise en décharge de classe 2. L'enfouissement direct est interdit."
      },
      {
        text: "Un professionnel de santé libéral produisant moins de 5 kg de DASRI par mois doit-il les éliminer seul ou peut-il les regrouper ?",
        options: [
          { text: "Il peut adhérer à un système de collecte de proximité (pharmacie, mairie) dans le cadre du dispositif DASTRI", isCorrect: true },
          { text: "Il doit obligatoirement les éliminer seul via un prestataire privé sans possibilité de regroupement", isCorrect: false },
          { text: "Il peut les mélanger aux ordures ménagères si les PCT sont placés dans un flacon en plastique rigide", isCorrect: false },
          { text: "Il doit les apporter personnellement à l'hôpital le plus proche qui est tenu de les accepter gratuitement", isCorrect: false }
        ],
        explanation: "L'éco-organisme DASTRI (créé en 2012) organise la collecte gratuite des DASRI des professionnels libéraux (< 5 kg/mois) et des patients en auto-traitement via des points de collecte en pharmacies, déchetteries ou mairies. C'est une obligation réglementaire du producteur à coût réduit."
      },
      {
        text: "Quelle couleur identifie les emballages des DASRI selon la réglementation française ?",
        options: [
          { text: "Le jaune pour les DASRI mous (sacs) et le rouge pour certains déchets anatomiques identifiables", isCorrect: true },
          { text: "Le rouge pour tous les DASRI sans distinction de type ou de risque microbiologique associé", isCorrect: false },
          { text: "Le orange pour les DASRI et le noir pour les déchets assimilables aux ordures ménagères normaux", isCorrect: false },
          { text: "Le vert pour les DASRI et le jaune pour les déchets chimiques ou médicamenteux uniquement", isCorrect: false }
        ],
        explanation: "En France, les DASRI mous sont conditionnés en sacs jaunes ou rouges selon les établissements (jaune est le standard européen). Les collecteurs à PCT sont rigides de couleur jaune. Les déchets anatomiques identifiables (membres, placentas) utilisent des emballages rouges et suivent une filière spécifique (crémation)."
      },
      {
        text: "Qu'est-ce qu'un bordereau de suivi des déchets (BSD) DASRI et qui doit le conserver ?",
        options: [
          { text: "Document de traçabilité obligatoire signé par le producteur et le transporteur, conservé 3 ans par chacun", isCorrect: true },
          { text: "Document facultatif émis par le prestataire d'incinération uniquement et conservé 1 an par le prestataire", isCorrect: false },
          { text: "Formulaire interne à l'établissement sans valeur réglementaire, conservé dans le dossier infirmier patient", isCorrect: false },
          { text: "Attestation mensuelle émise par l'ARS certifiant la conformité de l'élimination, conservée 5 ans minimum", isCorrect: false }
        ],
        explanation: "Le bordereau CERFA n° 11352 est obligatoire pour tout enlèvement de DASRI. Il accompagne les déchets du producteur à l'installation de traitement final. Le producteur, le transporteur et l'éliminateur en conservent chacun un exemplaire pendant 3 ans (art. R.1335-8 du CSP)."
      },
      {
        text: "Dans quelle filière doit être éliminé un flacon de médicament cytotoxique usagé produit dans une unité de soins ?",
        options: [
          { text: "Dans la filière des déchets dangereux cytotoxiques (DASRIc), distincte des DASRI classiques, avec traçabilité spécifique", isCorrect: true },
          { text: "Dans les DASRI classiques en sac jaune car tout déchet de soin est assimilé à un DASRI standard", isCorrect: false },
          { text: "Dans les ordures ménagères après neutralisation chimique par du bicarbonate de sodium en poudre", isCorrect: false },
          { text: "Dans le réseau d'égouts après rinçage triple du flacon avec de l'eau distillée stérile uniquement", isCorrect: false }
        ],
        explanation: "Les déchets cytotoxiques (flacons, tubulures, gants de préparation) relèvent d'une filière spéciale car ils présentent un risque cancérogène, mutagène et reprotoxique (CMR). Ils ne peuvent pas être mélangés aux DASRI classiques. Ils sont incinérés dans des fours à haute température (> 1 100 °C) avec traçabilité renforcée."
      }
    ]
  },
  {
    title: "Antibiothérapie 1 — classes d'antibiotiques, spectre et mécanismes d'action",
    description: "Identifier les principales classes d'antibiotiques, leur spectre d'activité et leurs mécanismes d'action pour comprendre les bases de l'antibiothérapie.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 14,
    difficulty: "Intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Quel est le mécanisme d'action commun à toutes les bêta-lactamines (pénicillines, céphalosporines, carbapénèmes) ?",
        options: [
          { text: "Inhibition de la synthèse du peptidoglycane de la paroi bactérienne par liaison aux PLP (protéines liant la pénicilline)", isCorrect: true },
          { text: "Inhibition de la synthèse protéique bactérienne par fixation sur la sous-unité 30S du ribosome procaryote", isCorrect: false },
          { text: "Perturbation de la membrane cytoplasmique bactérienne par insertion dans les phospholipides membranaires", isCorrect: false },
          { text: "Inhibition de la gyrase bactérienne bloquant la réplication et la transcription de l'ADN bactérien", isCorrect: false }
        ],
        explanation: "Les bêta-lactamines inhibent la transpeptidase (PLP) impliquée dans la cross-liaison du peptidoglycane. Sans paroi solide, la bactérie éclate sous l'effet de la pression osmotique. Elles sont bactéricides et actives uniquement sur les bactéries en phase de croissance active."
      },
      {
        text: "Quelle classe d'antibiotiques est caractérisée par un mécanisme d'action inhibant la synthèse protéique au niveau de la sous-unité 50S du ribosome ?",
        options: [
          { text: "Les macrolides (érythromycine, clarithromycine, azithromycine) et les lincosamides (clindamycine)", isCorrect: true },
          { text: "Les aminosides (gentamicine, tobramycine, amikacine) qui fixent la sous-unité 30S irréversiblement", isCorrect: false },
          { text: "Les cyclines (doxycycline, minocycline) qui bloquent l'entrée des ARNt au site A du ribosome 30S", isCorrect: false },
          { text: "Les quinolones (ciprofloxacine, lévofloxacine) qui inhibent la topo-isomérase II et IV bactériennes", isCorrect: false }
        ],
        explanation: "Les macrolides et lincosamides se fixent sur la sous-unité 50S du ribosome bactérien (70S), bloquant la translocation de la chaîne peptidique. Ils sont bactériostatiques et ont un excellent spectre sur les bactéries intracellulaires (Legionella, Mycoplasma, Chlamydia)."
      },
      {
        text: "Quel est le spectre d'activité des aminosides (gentamicine, amikacine) ?",
        options: [
          { text: "Bacilles Gram négatif aérobies et staphylocoques ; actifs en synergie avec les bêta-lactamines sur entérocoques", isCorrect: true },
          { text: "Cocci Gram positif uniquement, en particulier Streptococcus pneumoniae et Staphylococcus aureus", isCorrect: false },
          { text: "Bactéries anaérobies strictes uniquement, en particulier Clostridium et Bacteroides fragilis", isCorrect: false },
          { text: "Mycobactéries et champignons uniquement, sans activité sur les bactéries à Gram positif ou négatif", isCorrect: false }
        ],
        explanation: "Les aminosides ont un large spectre sur les bactéries aérobies à Gram négatif (entérobactéries, Pseudomonas) et les staphylocoques. Ils sont inactifs sur les anaérobies (nécessitent O₂ pour leur transport intracellulaire). Leur association avec les bêta-lactamines est synergique sur les entérocoques et les staphylocoques."
      },
      {
        text: "Comment agissent les fluoroquinolones (ciprofloxacine, lévofloxacine) sur les bactéries ?",
        options: [
          { text: "Inhibition de l'ADN gyrase (topo-isomérase II) et de la topo-isomérase IV, bloquant la réplication et la transcription de l'ADN", isCorrect: true },
          { text: "Inhibition de la synthèse du peptidoglycane par compétition avec le D-Ala-D-Ala du précurseur muramique", isCorrect: false },
          { text: "Chélation du magnésium membranaire entraînant une déstabilisation de la membrane externe bactérienne", isCorrect: false },
          { text: "Inhibition de la dihydrofolate réductase bloquant la synthèse des bases puriques et pyrimidiques bactériennes", isCorrect: false }
        ],
        explanation: "Les fluoroquinolones inhibent deux enzymes essentielles à la réplication bactérienne : la gyrase (cible principale chez les Gram négatif) et la topo-isomérase IV (cible principale chez les Gram positif). Elles sont bactéricides à action concentration-dépendante et atteignent bien les intracellulaires."
      },
      {
        text: "Qu'est-ce qu'une bêta-lactamase et quel est son rôle dans la résistance bactérienne ?",
        options: [
          { text: "Enzyme bactérienne qui hydrolyse le cycle bêta-lactame et inactive l'antibiotique avant qu'il atteigne sa cible", isCorrect: true },
          { text: "Protéine membranaire qui pompe activement les antibiotiques hors de la bactérie par efflux actif", isCorrect: false },
          { text: "Enzyme bactérienne qui modifie les aminosides par acétylation, phosphorylation ou adénylation", isCorrect: false },
          { text: "Mutation chromosomique des PLP qui diminue l'affinité des bêta-lactamines pour leur cible enzymatique", isCorrect: false }
        ],
        explanation: "Les bêta-lactamases hydrolysent le lien amide du cycle bêta-lactame, rendant l'antibiotique inactif. Les inhibiteurs de bêta-lactamases (acide clavulanique, sulbactam, tazobactam) permettent de restaurer l'activité. Les BLSE (bêta-lactamases à spectre élargi) hydrolysent également les céphalosporines de 3e génération."
      },
      {
        text: "Quel antibiotique est indiqué en première intention pour les infections à SARM (Staphylococcus aureus résistant à la méticilline) ?",
        options: [
          { text: "La vancomycine (glycopeptide) ou le linézolide (oxazolidinone) selon la localisation et la gravité", isCorrect: true },
          { text: "L'amoxicilline-acide clavulanique car les inhibiteurs de bêta-lactamases restaurent l'activité contre le SARM", isCorrect: false },
          { text: "La ceftriaxone (céphalosporine de 3e génération) qui reste active sur toutes les souches de SARM connues", isCorrect: false },
          { text: "La ciprofloxacine (fluoroquinolone) en monothérapie car le SARM reste sensible à toutes les quinolones", isCorrect: false }
        ],
        explanation: "Le SARM possède le gène mecA codant une PLP2a de faible affinité pour toutes les bêta-lactamines. La vancomycine reste le traitement de référence (voie IV). Le linézolide est une alternative orale possible. La daptomycine et la téicoplanine sont d'autres options selon les cas cliniques."
      },
      {
        text: "Qu'est-ce que l'effet post-antibiotique et quelle classe d'antibiotiques en bénéficie particulièrement ?",
        options: [
          { text: "Inhibition bactérienne persistant après disparition du médicament, particulièrement marquée pour les aminosides et quinolones", isCorrect: true },
          { text: "Effet rebond de prolifération bactérienne survenant après arrêt des bêta-lactamines en fin de traitement", isCorrect: false },
          { text: "Antagonisme observé lors de l'association de deux antibiotiques bactéricides de classes différentes", isCorrect: false },
          { text: "Augmentation progressive de la CMI lors d'une exposition répétée aux macrolides en cours de traitement", isCorrect: false }
        ],
        explanation: "L'effet post-antibiotique (EPA) est la suppression de la croissance bactérienne après une exposition brève à l'antibiotique, même en dessous de la CMI. Il est marqué pour les aminosides et quinolones (concentration-dépendants), ce qui permet des prises uniques quotidiennes (UDJ) tout aussi efficaces et moins néphrotoxiques."
      },
      {
        text: "Quel est le mécanisme d'action du métronidazole (Flagyl) et quel est son spectre d'activité principal ?",
        options: [
          { text: "Formation de radicaux libres toxiques qui altèrent l'ADN bactérien, actif sur les anaérobies et les protozoaires", isCorrect: true },
          { text: "Inhibition de la synthèse de la paroi fongique par blocage de la 14-alpha-déméthylase du cytochrome P450", isCorrect: false },
          { text: "Blocage de la chaîne respiratoire mitochondriale bactérienne uniquement sur les Gram positif aérobies", isCorrect: false },
          { text: "Inhibition de la synthèse des folates bactériens par compétition avec le PABA comme les sulfamides", isCorrect: false }
        ],
        explanation: "Le métronidazole est activé dans les cellules anaérobies par réduction de son groupement nitro, formant des radicaux cytotoxiques qui fragmentent l'ADN bactérien. Son spectre couvre les anaérobies stricts (Bacteroides, Clostridium) et les protozoaires (Trichomonas, Giardia, amibes)."
      }
    ]
  },
  {
    title: "Antibiothérapie 2 — règles de prescription, durée et suivi biologique",
    description: "Appliquer les règles de bon usage des antibiotiques, comprendre la notion de durée optimale et assurer le suivi biologique des traitements.",
    semester: "Semestre 1",
    category: "UE 2.10 - Infectiologie et hygiène",
    chapter: 15,
    difficulty: "Intermédiaire",
    duration: 15,
    isPublished: true,
    questions: [
      {
        text: "Qu'est-ce que le principe de 'juste prescription' des antibiotiques selon le plan national antibiotiques ?",
        options: [
          { text: "Prescrire le bon antibiotique, à la bonne dose, pour la bonne durée et uniquement si une infection bactérienne est prouvée ou probable", isCorrect: true },
          { text: "Prescrire systématiquement un antibiotique à large spectre pour couvrir tous les germes possibles en prévention", isCorrect: false },
          { text: "Prescrire des associations d'antibiotiques en première intention pour éviter tout risque de résistance primaire", isCorrect: false },
          { text: "Réserver les antibiotiques aux infections nosocomiales uniquement et traiter les infections communautaires par d'autres moyens", isCorrect: false }
        ],
        explanation: "Le bon usage des antibiotiques repose sur 5 critères : bon antibiotique (spectre adapté), bonne dose (PK/PD), bonne voie (IV → oral dès possible), bonne durée (la plus courte possible) et uniquement si infection bactérienne établie. Les antibiotiques sont inutiles sur les infections virales."
      },
      {
        text: "Que signifie réaliser une désescalade antibiotique et quand est-elle indiquée ?",
        options: [
          { text: "Adapter l'antibiothérapie large spectre initiale à un traitement à spectre plus étroit dès l'obtention des résultats microbiologiques", isCorrect: true },
          { text: "Augmenter les doses d'antibiotique en cours de traitement si l'état clinique du patient se dégrade rapidement", isCorrect: false },
          { text: "Arrêter prématurément l'antibiothérapie dès que les symptômes cliniques ont disparu chez le patient", isCorrect: false },
          { text: "Remplacer un antibiotique IV par un antibiotique oral uniquement chez les patients ambulatoires non hospitalisés", isCorrect: false }
        ],
        explanation: "La désescalade consiste à restreindre le spectre antibiotique initial (souvent large et empirique) dès que le germe et son antibiogramme sont connus (48-72h). Elle réduit la pression de sélection, préserve le microbiote et diminue les coûts sans compromettre l'efficacité clinique."
      },
      {
        text: "Quel examen biologique doit être prélevé AVANT de débuter une antibiothérapie pour infection bactérienne grave ?",
        options: [
          { text: "Des hémocultures (au minimum 2 séries) et des prélèvements microbiologiques du site infectieux présumé", isCorrect: true },
          { text: "Une numération formule sanguine (NFS) seule suffit pour décider du type d'antibiotique à utiliser", isCorrect: false },
          { text: "Un dosage de la procalcitonine (PCT) seule suffit pour identifier le germe responsable de l'infection", isCorrect: false },
          { text: "Une radiographie thoracique et une échographie abdominale pour localiser le foyer avant toute prescription", isCorrect: false }
        ],
        explanation: "Avant toute antibiothérapie grave (sepsis, endocardite, méningite), les prélèvements microbiologiques DOIVENT précéder le premier antibiotique. Les hémocultures (2 séries prélevées sur sites différents) et les prélèvements locaux (LCR, urines, pus) guideront la désescalade. Chaque heure de retard en sepsis sévère augmente la mortalité."
      },
      {
        text: "Pourquoi le dosage de la procalcitonine (PCT) est-il utile dans la prise en charge des infections bactériennes ?",
        options: [
          { text: "La PCT s'élève spécifiquement dans les infections bactériennes systémiques et aide à guider la durée de l'antibiothérapie", isCorrect: true },
          { text: "La PCT identifie avec certitude le germe bactérien responsable sans nécessiter de prélèvement microbiologique", isCorrect: false },
          { text: "La PCT est élevée dans toutes les infections (virales et bactériennes) et confirme la nécessité d'une antibiothérapie", isCorrect: false },
          { text: "La PCT mesure l'activité bactéricide de l'antibiotique et permet d'ajuster la posologie au cas par cas", isCorrect: false }
        ],
        explanation: "La procalcitonine est un biomarqueur d'infection bactérienne systémique (sepsis). Elle s'élève peu dans les infections virales. Son suivi (décroissance ≥ 80% ou < 0,5 µg/L) aide à décider l'arrêt de l'antibiothérapie, réduisant les durées de traitement et le risque de résistance émergente."
      },
      {
        text: "Quel suivi biologique doit être réalisé lors d'un traitement par aminosides (gentamicine, amikacine) pour prévenir la toxicité ?",
        options: [
          { text: "Dosages de la créatinine et clairance de la créatinine, et dosage du pic et de la résiduelle de l'aminoside", isCorrect: true },
          { text: "Dosage des transaminases (ASAT/ALAT) et de la bilirubine uniquement pour surveiller la toxicité hépatique", isCorrect: false },
          { text: "Numération formule sanguine (NFS) et plaquettes pour surveiller l'aplasie médullaire spécifique aux aminosides", isCorrect: false },
          { text: "Dosage de la TSH et des hormones thyroïdiennes car les aminosides induisent une dysthyroïdie fréquente", isCorrect: false }
        ],
        explanation: "Les aminosides sont néphrotoxiques et ototoxiques. Le suivi impose : créatinine + clairance (GFR) toutes les 48-72h, dosage de la résiduelle avant la prochaine injection (doit être indétectable pour l'administration en dose unique journalière) et pic 30 min après la fin de la perfusion pour vérifier l'efficacité."
      },
      {
        text: "Quelle est la durée recommandée par les sociétés savantes françaises pour une angine bactérienne à Streptocoque A traitée par amoxicilline ?",
        options: [
          { text: "6 jours d'amoxicilline selon les recommandations HAS 2021 (anciennement 10 jours pour les adultes)", isCorrect: true },
          { text: "3 jours uniquement car l'amoxicilline à dose unique est suffisante pour éradiquer le Streptocoque A", isCorrect: false },
          { text: "14 jours minimum pour éviter le rhumatisme articulaire aigu (RAA) chez les enfants et les adultes", isCorrect: false },
          { text: "21 jours car l'angine bactérienne récidive systématiquement si le traitement est arrêté avant ce délai", isCorrect: false }
        ],
        explanation: "Les recommandations HAS/SPILF 2021 ont réduit la durée du traitement de l'angine streptococcique à 6 jours d'amoxicilline (au lieu de 10 jours), sans diminuer l'efficacité clinique ni le risque de RAA. Cette réduction vise à limiter la pression de sélection antibiotique."
      },
      {
        text: "Qu'est-ce que la concentration minimale inhibitrice (CMI) et comment est-elle utilisée en pratique clinique ?",
        options: [
          { text: "Plus faible concentration d'antibiotique inhibant toute croissance visible in vitro, servant à classer sensible/intermédiaire/résistant", isCorrect: true },
          { text: "Concentration maximale tolérée par le patient sans toxicité, utilisée pour calculer la dose journalière maximale", isCorrect: false },
          { text: "Concentration sanguine à l'équilibre permettant d'éradiquer 90 % des bactéries du foyer infectieux", isCorrect: false },
          { text: "Concentration minimale bactéricide tuant 99,9 % des bactéries, toujours utilisée seule pour décider d'un traitement", isCorrect: false }
        ],
        explanation: "La CMI est déterminée par l'antibiogramme. Elle permet de classer la souche : sensible (S) si la CMI est < au seuil critique, intermédiaire (I) ou résistant (R). Elle guide le choix de l'antibiotique et la posologie (l'objectif est d'atteindre des concentrations plasmatiques plusieurs fois supérieures à la CMI au site infectieux)."
      },
      {
        text: "Quel est le risque principal lié à une antibiothérapie prolongée ou à large spectre sur le microbiote intestinal ?",
        options: [
          { text: "Dysbiose intestinale avec risque de colonisation par Clostridioides difficile et d'infection à C. difficile (ICD)", isCorrect: true },
          { text: "Constipation sévère par augmentation du péristaltisme intestinal due à l'action directe des antibiotiques", isCorrect: false },
          { text: "Malabsorption exclusive des vitamines liposolubles (A, D, E, K) sans impact sur le microbiote bactérien", isCorrect: false },
          { text: "Augmentation du risque de cancer colorectal à court terme par mutation directe des cellules épithéliales", isCorrect: false }
        ],
        explanation: "Les antibiotiques à large spectre détruisent le microbiote protecteur, permettant la prolifération de Clostridioides difficile (ex-Clostridium difficile). L'ICD provoque diarrhées, colites pseudomembraneuses, voire mégacôlon toxique. La prévention passe par la limitation des durées, la désescalade et l'hygiène des mains (SHA inefficace sur C. difficile → savon + eau obligatoire)."
      }
    ]
  }
];
