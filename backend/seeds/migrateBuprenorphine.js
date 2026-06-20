/**
 * Migration : restructure Buprénorphine (Temgésic®) en 3 parties claires
 * Route : POST /api/admin/migrate-buprenorphine
 */
const Drug = require('../models/Drug');

module.exports = async (req, res) => {
  try {
    const drug = await Drug.findOne({ name: 'Buprénorphine (Temgésic®)' });
    if (!drug) return res.status(404).json({ error: 'Médicament introuvable' });

    drug.description = "Agoniste-antagoniste partiel des récepteurs opioïdes mu (μ). Antalgique puissant de palier III (Temgésic®) et médicament de substitution aux opioïdes (Subutex®, Suboxone®). Caractérisé par un effet plafond sur la dépression respiratoire, une haute affinité pour les récepteurs et une longue durée d'action.";

    drug.sections = [
      {
        title: 'Pharmacologie & Mécanisme d\'action',
        content: `**DCI :** Buprénorphine chlorhydrate
**Noms commerciaux :** Temgésic® (antalgique), Subutex® (substitution), Suboxone® (buprénorphine + naloxone)

**Classe pharmacologique**
Analgésique opioïde — Agoniste partiel μ (mu) et antagoniste κ (kappa). Appartient à la classe des morphiniques palier III pour l'usage antalgique, et à la classe des médicaments de substitution aux opioïdes (MSO) pour le traitement de la dépendance.

**Mécanisme d'action**
Se fixe avec une très haute affinité sur les récepteurs mu opioïdes. En tant qu'agoniste partiel, il produit un effet analgésique puissant mais plafonné : au-delà d'une certaine dose, l'effet ne s'intensifie plus (sécurité relative en cas de surdosage par rapport à la morphine).

La dissociation lente des récepteurs confère une longue durée d'action :
- Temgésic® : 6 à 8 h
- Subutex® : jusqu'à 24 h

En tant qu'antagoniste kappa : peut déclencher un syndrome de sevrage chez les patients opioïdodépendants si la substitution est débutée trop tôt (avant l'apparition des premiers signes de manque).

**Propriétés pharmacocinétiques**
- Biodisponibilité sublinguale : 30 à 55 %
- Métabolisme hépatique (CYP3A4)
- Élimination : fécale (70 %) et urinaire (30 %)
- Demi-vie d'élimination : 24 à 42 h`,
        order: 0,
      },
      {
        title: 'Indications, Posologie & Contre-indications',
        content: `**Indications principales**
- Temgésic® : douleurs sévères à très sévères (post-opératoires, oncologiques, douleurs chroniques réfractaires) — voie sublinguale
- Subutex® : traitement de substitution aux opioïdes (TSO) — prise en charge de la dépendance aux opiacés (héroïne, morphine, codéine…)
- Suboxone® (buprénorphine + naloxone) : TSO avec protection renforcée contre le mésusage injectable

**Posologie adulte**
| Indication | Dose | Fréquence |
|---|---|---|
| Antalgique (Temgésic®) | 0,2 à 0,4 mg | × 3/j sublingual |
| Substitution (Subutex®) | 8 à 24 mg/j | 1 prise/j sublingual |

**Voie d'administration**
Sublinguale exclusive — ne pas avaler (biodisponibilité orale < 10 %). Placer le comprimé sous la langue, laisser fondre 10 à 15 min sans parler ni boire.

**Contre-indications**
- Insuffisance respiratoire sévère non assistée
- Association avec les benzodiazépines ou autres dépresseurs du SNC (risque de dépression respiratoire fatale — association déconseillée ou sous surveillance stricte)
- Association avec un IMAO (délai de 14 jours)
- Allaitement (passage dans le lait maternel)
- Enfant < 6 ans pour Temgésic®`,
        order: 1,
      },
      {
        title: 'Surveillance infirmière & Effets indésirables',
        content: `**Effets indésirables principaux**
- Nausées, vomissements (fréquents en début de traitement)
- Céphalées, somnolence, vertiges
- Constipation (effet de classe opioïde)
- Sueurs, insomnie (syndrome de sevrage si arrêt brutal après usage prolongé)
- Hépatite cytolytique (Subutex® en cas de mésusage IV)
- Dépression respiratoire (rare à doses thérapeutiques, risque majoré si association BZD/alcool/sédatifs)

**Points clés de surveillance infirmière**

Administration :
- Comprimé sublingual : placer sous la langue, laisser fondre entièrement (10-15 min) — ne pas avaler, ne pas mâcher, ne pas boire pendant la dissolution
- Vérifier FR avant chaque administration (alerte si FR < 10/min)

Surveillance des risques :
- Vérifier l'absence de prise concomitante de BZD, alcool ou sédatifs (risque vital)
- Surveiller l'état de conscience et la saturation (SpO₂) chez les patients à risque
- Évaluer la douleur (EVA/EN) 30-60 min après la prise

Initiation du TSO (substitution) :
- Attendre les premiers signes de sevrage (24 à 72 h après la dernière prise d'opioïde) avant d'initier le traitement — sinon risque de sevrage précipité
- Score COWS (Clinical Opiate Withdrawal Scale) recommandé avant initiation

Antidote :
- NALOXONE (Narcan®) — doses répétées souvent nécessaires car la demi-vie de la buprénorphine est bien supérieure à celle de la naloxone
- En cas de surdosage : assistance respiratoire, appel SAMU

Aspects réglementaires :
- Classé stupéfiant → stockage sécurisé obligatoire, comptabilité, ordonnance sécurisée
- Informer le patient : ne jamais partager le traitement, ne pas injecter (risque hépatique et d'OAP)`,
        order: 2,
      },
      {
        title: 'Médias',
        content: 'Schémas et ressources pédagogiques disponibles sur le site de l\'ANSM (ansm.sante.fr) et dans le Vidal. Consulter le RCP (Résumé des Caractéristiques du Produit) pour les informations prescripteur complètes.',
        order: 3,
      },
    ];

    drug.sources = [
      { title: 'ANSM — Monographie Temgésic® / Subutex®', authors: 'ANSM', year: '2024', url: 'https://ansm.sante.fr' },
      { title: 'Vidal — Buprénorphine', authors: 'Vidal', year: '2024', url: 'https://vidal.fr' },
      { title: 'HAS — Médicaments de substitution aux opioïdes', authors: 'HAS', year: '2023', url: 'https://has-sante.fr' },
      { title: 'OFDT — Données sur les TSO en France', authors: 'OFDT', year: '2023', url: 'https://ofdt.fr' },
    ];

    drug.tags = ['opioïde', 'buprénorphine', 'agoniste partiel', 'substitution', 'Subutex', 'douleur chronique', 'antalgique palier III', 'TSO', 'stupéfiant'];

    await drug.save();

    res.json({ success: true, message: `Buprénorphine (Temgésic®) restructuré en 3 parties`, sections: drug.sections.map(s => s.title) });
  } catch (err) {
    console.error('[migrateBuprenorphine]', err);
    res.status(500).json({ success: false, error: err.message });
  }
};
