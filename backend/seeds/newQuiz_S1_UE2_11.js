// UE 2.11 - Pharmacologie et thérapeutiques (Semestre 1)
module.exports = [
  {
    "title": "Pharmacocinétique et pharmacodynamie",
    "description": "Quiz sur les principes fondamentaux de la pharmacocinétique (ADME) et de la pharmacodynamie, destiné aux étudiants IFSI de Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Pharmacocinétique et pharmacodynamie",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle phase de la pharmacocinétique désigne le passage du médicament de son site d'administration vers la circulation sanguine ?",
        "options": [
          {
            "text": "La distribution",
            "isCorrect": false
          },
          {
            "text": "L'absorption",
            "isCorrect": true
          },
          {
            "text": "L'élimination",
            "isCorrect": false
          },
          {
            "text": "Le métabolisme",
            "isCorrect": false
          }
        ],
        "explanation": "L'absorption est la phase durant laquelle le médicament quitte son site d'administration pour rejoindre la circulation systémique. Elle conditionne la biodisponibilité du principe actif."
      },
      {
        "text": "Quel organe est principalement responsable du métabolisme des médicaments ?",
        "options": [
          {
            "text": "Le rein",
            "isCorrect": false
          },
          {
            "text": "Le poumon",
            "isCorrect": false
          },
          {
            "text": "Le foie",
            "isCorrect": true
          },
          {
            "text": "L'intestin grêle",
            "isCorrect": false
          }
        ],
        "explanation": "Le foie est l'organe central du métabolisme médicamenteux grâce à ses enzymes hépatiques (notamment le cytochrome P450), qui transforment les substances actives en métabolites."
      },
      {
        "text": "Qu'est-ce que la biodisponibilité d'un médicament ?",
        "options": [
          {
            "text": "La vitesse à laquelle le médicament est éliminé par le rein",
            "isCorrect": false
          },
          {
            "text": "La fraction de la dose administrée qui atteint la circulation systémique sous forme active",
            "isCorrect": true
          },
          {
            "text": "La capacité du médicament à se lier aux protéines plasmatiques",
            "isCorrect": false
          },
          {
            "text": "Le volume dans lequel le médicament se distribue dans l'organisme",
            "isCorrect": false
          }
        ],
        "explanation": "La biodisponibilité représente la fraction de la dose administrée qui parvient effectivement à la circulation générale sous forme active. Elle est de 100 % par voie intraveineuse."
      },
      {
        "text": "Le terme 'demi-vie' d'un médicament désigne :",
        "options": [
          {
            "text": "Le temps nécessaire pour atteindre la concentration maximale dans le sang",
            "isCorrect": false
          },
          {
            "text": "Le temps nécessaire pour que la concentration plasmatique diminue de moitié",
            "isCorrect": true
          },
          {
            "text": "Le temps nécessaire pour que le médicament soit totalement absorbé",
            "isCorrect": false
          },
          {
            "text": "Le temps entre deux prises successives d'un médicament",
            "isCorrect": false
          }
        ],
        "explanation": "La demi-vie (t½) est le temps nécessaire pour que la concentration plasmatique du médicament soit réduite de moitié. Elle détermine la fréquence des prises et le délai d'élimination."
      },
      {
        "text": "Qu'est-ce qu'un effet agoniste d'un médicament ?",
        "options": [
          {
            "text": "Il se fixe sur un récepteur sans produire d'effet pharmacologique",
            "isCorrect": false
          },
          {
            "text": "Il stimule un récepteur et reproduit ou amplifie l'effet du ligand naturel",
            "isCorrect": true
          },
          {
            "text": "Il inhibe le métabolisme hépatique d'un autre médicament",
            "isCorrect": false
          },
          {
            "text": "Il neutralise chimiquement une substance toxique dans le sang",
            "isCorrect": false
          }
        ],
        "explanation": "Un agoniste se lie à un récepteur et l'active, déclenchant ainsi une réponse physiologique similaire ou supérieure à celle du ligand endogène. Par exemple, la morphine est agoniste des récepteurs opioïdes."
      },
      {
        "text": "Quel paramètre pharmacocinétique représente la capacité du médicament à se répartir dans les tissus ?",
        "options": [
          {
            "text": "La clairance plasmatique",
            "isCorrect": false
          },
          {
            "text": "Le pic de concentration (Cmax)",
            "isCorrect": false
          },
          {
            "text": "Le volume de distribution (Vd)",
            "isCorrect": true
          },
          {
            "text": "L'aire sous la courbe (ASC)",
            "isCorrect": false
          }
        ],
        "explanation": "Le volume de distribution (Vd) reflète la répartition du médicament entre le plasma et les tissus. Un Vd élevé indique une forte fixation tissulaire et une faible concentration plasmatique."
      },
      {
        "text": "L'effet de premier passage hépatique concerne principalement quelle voie d'administration ?",
        "options": [
          {
            "text": "La voie intraveineuse",
            "isCorrect": false
          },
          {
            "text": "La voie sublinguale",
            "isCorrect": false
          },
          {
            "text": "La voie orale",
            "isCorrect": true
          },
          {
            "text": "La voie intramusculaire",
            "isCorrect": false
          }
        ],
        "explanation": "Par voie orale, le médicament absorbé dans l'intestin passe d'abord par le foie via la veine porte avant d'atteindre la circulation générale, ce qui peut réduire significativement sa biodisponibilité."
      },
      {
        "text": "Un médicament antagoniste compétitif agit en :",
        "options": [
          {
            "text": "Augmentant la synthèse du ligand endogène au niveau de la synapse",
            "isCorrect": false
          },
          {
            "text": "Se liant de façon irréversible au récepteur cible sans l'activer",
            "isCorrect": false
          },
          {
            "text": "Occupant le même site récepteur que l'agoniste sans produire d'effet propre",
            "isCorrect": true
          },
          {
            "text": "Stimulant un récepteur différent pour bloquer indirectement l'agoniste",
            "isCorrect": false
          }
        ],
        "explanation": "L'antagoniste compétitif entre en compétition avec l'agoniste pour le même site de fixation sur le récepteur. Il l'occupe sans l'activer, bloquant ainsi l'effet de l'agoniste de manière réversible."
      }
    ]
  },
  {
    "title": "Administration des médicaments et règles de sécurité",
    "description": "Quiz sur les règles d'administration des médicaments, les voies d'abord et la sécurité du circuit du médicament, destiné aux étudiants IFSI de Semestre 1.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Administration des médicaments et règles de sécurité",
    "difficulty": "medium",
    "duration": 15,
    "isPublished": true,
    "questions": [
      {
        "text": "Quelle règle fondamentale doit être vérifiée avant toute administration médicamenteuse ?",
        "options": [
          {
            "text": "Vérifier la température de conservation du médicament dans la pharmacie",
            "isCorrect": false
          },
          {
            "text": "Contrôler les 5 B : Bon médicament, Bonne dose, Bonne voie, Bon patient, Bon moment",
            "isCorrect": true
          },
          {
            "text": "Confirmer l'accord verbal du patient avant chaque injection intraveineuse",
            "isCorrect": false
          },
          {
            "text": "S'assurer que le médecin prescripteur est présent dans le service lors de l'administration",
            "isCorrect": false
          }
        ],
        "explanation": "La règle des 5 B (ou 5 R) est la référence incontournable en sécurité médicamenteuse. Elle permet de prévenir les erreurs d'administration en systématisant les vérifications essentielles avant chaque acte."
      },
      {
        "text": "Pour la voie intraveineuse directe (IVD), à quelle vitesse doit généralement être administré le médicament ?",
        "options": [
          {
            "text": "En moins de 10 secondes pour assurer un effet immédiat et optimal",
            "isCorrect": false
          },
          {
            "text": "En 1 à 2 minutes de façon lente et contrôlée selon les recommandations",
            "isCorrect": true
          },
          {
            "text": "En 30 à 60 minutes pour limiter les effets indésirables systémiques",
            "isCorrect": false
          },
          {
            "text": "En 5 à 10 minutes quel que soit le médicament administré par cette voie",
            "isCorrect": false
          }
        ],
        "explanation": "L'injection intraveineuse directe doit être lente, généralement sur 1 à 2 minutes, afin de prévenir les effets indésirables liés à une concentration plasmatique trop rapide (choc, arythmie, etc.)."
      },
      {
        "text": "Quel document constitue la base légale indispensable avant toute administration d'un médicament par l'infirmier ?",
        "options": [
          {
            "text": "Le compte rendu opératoire signé par le chirurgien",
            "isCorrect": false
          },
          {
            "text": "La fiche de liaison pharmaceutique transmise par la pharmacie",
            "isCorrect": false
          },
          {
            "text": "La prescription médicale écrite, datée, signée et identifiable",
            "isCorrect": true
          },
          {
            "text": "Le protocole de service validé par le cadre de santé",
            "isCorrect": false
          }
        ],
        "explanation": "L'infirmier ne peut administrer un médicament que sur prescription médicale écrite, datée et signée. C'est une exigence légale du Code de la santé publique (article R.4311-7)."
      },
      {
        "text": "Quelle est la voie d'administration recommandée pour une résorption rapide en cas d'urgence absolue ?",
        "options": [
          {
            "text": "La voie sous-cutanée",
            "isCorrect": false
          },
          {
            "text": "La voie intramusculaire",
            "isCorrect": false
          },
          {
            "text": "La voie intraveineuse",
            "isCorrect": true
          },
          {
            "text": "La voie transdermique",
            "isCorrect": false
          }
        ],
        "explanation": "La voie intraveineuse permet une action immédiate car le médicament est directement administré dans la circulation sanguine, sans phase d'absorption. C'est la voie de choix dans les situations d'urgence."
      },
      {
        "text": "Quel angle d'insertion est recommandé pour une injection sous-cutanée (SC) chez un adulte de corpulence normale ?",
        "options": [
          {
            "text": "Un angle de 90° pour atteindre le muscle sous-jacent",
            "isCorrect": false
          },
          {
            "text": "Un angle de 45° en réalisant un pli cutané pour cibler le tissu adipeux",
            "isCorrect": true
          },
          {
            "text": "Un angle de 15° en biseau vers le haut pour rester dans le derme",
            "isCorrect": false
          },
          {
            "text": "Un angle de 30° sans pli cutané pour éviter le saignement",
            "isCorrect": false
          }
        ],
        "explanation": "L'injection sous-cutanée s'effectue à 45° avec un pli cutané afin de déposer le médicament dans le tissu adipeux sous-dermique. Chez les personnes obèses, un angle de 90° peut être utilisé."
      },
      {
        "text": "Que doit faire l'infirmier s'il découvre une erreur médicamenteuse après l'administration ?",
        "options": [
          {
            "text": "Attendre l'apparition de symptômes avant d'informer quiconque pour ne pas alarmer inutilement",
            "isCorrect": false
          },
          {
            "text": "Signaler immédiatement l'erreur au médecin, surveiller le patient et renseigner une déclaration d'événement indésirable",
            "isCorrect": true
          },
          {
            "text": "Informer uniquement le cadre de santé par écrit dans les 48 heures suivant l'incident",
            "isCorrect": false
          },
          {
            "text": "Corriger l'erreur par une seconde administration et ne pas en parler pour protéger le patient",
            "isCorrect": false
          }
        ],
        "explanation": "En cas d'erreur médicamenteuse, l'infirmier doit alerter immédiatement le médecin, surveiller étroitement le patient et déclarer l'événement indésirable via le système de signalement interne et/ou Vigimedic."
      },
      {
        "text": "Parmi ces situations, laquelle contre-indique formellement la voie intramusculaire (IM) ?",
        "options": [
          {
            "text": "Un patient âgé de plus de 75 ans ayant une masse musculaire réduite",
            "isCorrect": false
          },
          {
            "text": "Un patient sous traitement anticoagulant à dose curative",
            "isCorrect": true
          },
          {
            "text": "Un patient ayant une allergie documentée aux pansements adhésifs",
            "isCorrect": false
          },
          {
            "text": "Un patient présentant une fièvre supérieure à 38,5 °C depuis 24 heures",
            "isCorrect": false
          }
        ],
        "explanation": "Le traitement anticoagulant à dose curative contre-indique la voie IM en raison du risque de formation d'hématome intramusculaire, potentiellement expansif et compressif. La voie SC ou IV est alors privilégiée."
      },
      {
        "text": "Lors de la préparation d'une perfusion intraveineuse, quelle mesure d'hygiène est prioritaire ?",
        "options": [
          {
            "text": "Porter des lunettes de protection contre les projections de médicament",
            "isCorrect": false
          },
          {
            "text": "Réaliser un lavage antiseptique des mains et travailler en zone propre",
            "isCorrect": true
          },
          {
            "text": "Désinfecter la surface de travail uniquement si elle est visiblement souillée",
            "isCorrect": false
          },
          {
            "text": "Ouvrir le flacon de soluté sous une hotte à flux laminaire dans tous les cas",
            "isCorrect": false
          }
        ],
        "explanation": "La désinfection des mains par friction hydro-alcoolique (ou lavage antiseptique) est le geste prioritaire avant toute préparation médicamenteuse, afin de prévenir la contamination et les infections associées aux soins."
      }
    ]
  },
  {
    "title": "Classes thérapeutiques — cardiovasculaires, SNC et antalgiques",
    "description": "Quiz avancé sur les principales classes médicamenteuses cardiovasculaires, du système nerveux central et antalgiques, leurs mécanismes d'action et effets indésirables.",
    "semester": "Semestre 1",
    "category": "UE 2.11 - Pharmacologie et thérapeutiques",
    "chapter": "Classes thérapeutiques — cardiovasculaires, SNC et antalgiques",
    "difficulty": "hard",
    "duration": 20,
    "isPublished": true,
    "questions": [
      {
        "text": "Les bêta-bloquants exercent leur effet antihypertenseur principalement en :",
        "options": [
          {
            "text": "Inhibant les canaux calciques des cellules musculaires lisses vasculaires",
            "isCorrect": false
          },
          {
            "text": "Bloquant les récepteurs bêta-adrénergiques du myocarde et réduisant le débit cardiaque",
            "isCorrect": true
          },
          {
            "text": "Stimulant les récepteurs alpha-2 centraux pour diminuer le tonus sympathique",
            "isCorrect": false
          },
          {
            "text": "Antagonisant le système rénine-angiotensine au niveau du rein",
            "isCorrect": false
          }
        ],
        "explanation": "Les bêta-bloquants bloquent les récepteurs bêta-1 cardiaques, réduisant la fréquence et la force de contraction du cœur, ce qui diminue le débit cardiaque et donc la pression artérielle."
      },
      {
        "text": "Quel effet indésirable grave et spécifique doit être surveillé lors d'un traitement par IEC (inhibiteur de l'enzyme de conversion) ?",
        "options": [
          {
            "text": "La bradycardie sévère et les troubles de conduction auriculo-ventriculaire",
            "isCorrect": false
          },
          {
            "text": "La toux sèche persistante et l'angioedème potentiellement fatal",
            "isCorrect": true
          },
          {
            "text": "L'hypokaliémie profonde avec risque de paralysie musculaire",
            "isCorrect": false
          },
          {
            "text": "La rhabdomyolyse avec élévation des enzymes musculaires (CPK)",
            "isCorrect": false
          }
        ],
        "explanation": "Les IEC provoquent une accumulation de bradykinines, responsable d'une toux sèche irritative (effet fréquent) et d'un angioedème (effet rare mais potentiellement fatal par obstruction des voies aériennes)."
      },
      {
        "text": "Les antalgiques de palier II selon l'OMS (ex. : tramadol, codéine) agissent principalement sur :",
        "options": [
          {
            "text": "Les récepteurs NMDA du cortex cérébral pour moduler la douleur chronique",
            "isCorrect": false
          },
          {
            "text": "Les cyclo-oxygénases périphériques COX-1 et COX-2 des tissus enflammés",
            "isCorrect": false
          },
          {
            "text": "Les récepteurs opioïdes centraux mu, kappa et delta de la corne dorsale",
            "isCorrect": true
          },
          {
            "text": "Les canaux sodiques voltage-dépendants des fibres afférentes nociceptives",
            "isCorrect": false
          }
        ],
        "explanation": "Les opioïdes faibles (palier II) agissent sur les récepteurs opioïdes centraux (principalement mu), modulant la transmission et la perception de la douleur au niveau médullaire et supraspinal."
      },
      {
        "text": "Lors d'un surdosage aux benzodiazépines, quel antidote spécifique peut être utilisé ?",
        "options": [
          {
            "text": "La naloxone (Narcan®), antagoniste des récepteurs opioïdes",
            "isCorrect": false
          },
          {
            "text": "La N-acétylcystéine, précurseur du glutathion hépatique",
            "isCorrect": false
          },
          {
            "text": "Le flumazénil (Anexate®), antagoniste compétitif des récepteurs GABA-A",
            "isCorrect": true
          },
          {
            "text": "L'atropine, antagoniste muscarinique du système nerveux autonome",
            "isCorrect": false
          }
        ],
        "explanation": "Le flumazénil est l'antidote spécifique des benzodiazépines. Il entre en compétition avec elles sur les récepteurs GABA-A et lève la dépression du système nerveux central. Sa demi-vie courte nécessite une surveillance prolongée."
      },
      {
        "text": "Quel mécanisme explique l'effet antalgique du paracétamol ?",
        "options": [
          {
            "text": "Il inhibe les cyclo-oxygénases périphériques COX-1 et COX-2 de façon puissante et sélective",
            "isCorrect": false
          },
          {
            "text": "Il active les récepteurs opioïdes mu centraux à faible dose thérapeutique",
            "isCorrect": false
          },
          {
            "text": "Il inhibe centralement la synthèse des prostaglandines et module les voies sérotoninergiques descendantes",
            "isCorrect": true
          },
          {
            "text": "Il bloque les récepteurs NMDA au niveau médullaire et inhibe la sensibilisation centrale",
            "isCorrect": false
          }
        ],
        "explanation": "Le paracétamol agit principalement au niveau central en inhibant la synthèse des prostaglandines dans le SNC et en modulant les voies sérotoninergiques descendantes inhibitrices. Son mécanisme reste partiellement élucidé."
      },
      {
        "text": "Les statines (ex. : atorvastatine) réduisent le cholestérol LDL en :",
        "options": [
          {
            "text": "Augmentant l'excrétion biliaire des acides biliaires dans l'intestin",
            "isCorrect": false
          },
          {
            "text": "Inhibant la HMG-CoA réductase, enzyme clé de la synthèse hépatique du cholestérol",
            "isCorrect": true
          },
          {
            "text": "Activant les récepteurs PPAR-alpha pour stimuler l'oxydation des lipides",
            "isCorrect": false
          },
          {
            "text": "Bloquant l'absorption intestinale du cholestérol alimentaire au niveau des entérocytes",
            "isCorrect": false
          }
        ],
        "explanation": "Les statines inhibent la HMG-CoA réductase, enzyme limitante de la cholestérogénèse hépatique. En réduisant la synthèse intrahépatique, elles induisent une surexpression des récepteurs LDL et augmentent son épuration plasmatique."
      },
      {
        "text": "Quel effet indésirable majeur des antidépresseurs ISRS (ex. : fluoxétine) doit être particulièrement surveillé en début de traitement ?",
        "options": [
          {
            "text": "La sécheresse buccale et la constipation par blocage muscarinique central",
            "isCorrect": false
          },
          {
            "text": "La levée d'inhibition psychomotrice avec risque de passage à l'acte suicidaire",
            "isCorrect": true
          },
          {
            "text": "L'hypertension artérielle par stimulation des récepteurs alpha-1 adrénergiques",
            "isCorrect": false
          },
          {
            "text": "La rétention urinaire par hypertonicité du sphincter urétral interne",
            "isCorrect": false
          }
        ],
        "explanation": "En début de traitement par ISRS, la levée de l'inhibition psychomotrice (énergie retrouvée avant l'amélioration de l'humeur) peut majorer le risque de passage à l'acte suicidaire, justifiant une surveillance rapprochée les premières semaines."
      },
      {
        "text": "Parmi les médicaments suivants, lequel appartient à la classe des antagonistes des récepteurs AT1 de l'angiotensine II (ARA II ou sartans) ?",
        "options": [
          {
            "text": "Le ramipril, utilisé en post-infarctus et dans l'insuffisance cardiaque",
            "isCorrect": false
          },
          {
            "text": "L'amlodipine, inhibiteur calcique de la classe des dihydropyridines",
            "isCorrect": false
          },
          {
            "text": "Le valsartan, indiqué dans l'hypertension et l'insuffisance cardiaque",
            "isCorrect": true
          },
          {
            "text": "La furosémide, diurétique de l'anse utilisé dans l'insuffisance cardiaque",
            "isCorrect": false
          }
        ],
        "explanation": "Le valsartan est un sartan (ARA II) qui bloque sélectivement les récepteurs AT1 de l'angiotensine II, empêchant la vasoconstriction et la rétention sodée. Il est utilisé en alternative aux IEC, notamment en cas de toux."
      }
    ]
  }
];
