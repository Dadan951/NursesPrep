const DrugClass = require('../models/DrugClass');
const Drug      = require('../models/Drug');

/* ═══════════════════════════════════════
   DRUG CLASSES
═══════════════════════════════════════ */

// GET /api/drugs/classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await DrugClass.find().sort({ name: 1 });
    // Attach drug count to each class
    const withCount = await Promise.all(
      classes.map(async (c) => {
        const count = await Drug.countDocuments({ drugClass: c._id });
        return { ...c.toObject(), drugCount: count };
      })
    );
    res.json(withCount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/drugs/classes
exports.createClass = async (req, res) => {
  try {
    const { name, description, color, icon } = req.body;
    if (!name) return res.status(400).json({ message: 'Nom requis' });
    const dc = await DrugClass.create({ name, description, color, icon });
    res.status(201).json(dc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/drugs/classes/:id
exports.updateClass = async (req, res) => {
  try {
    const dc = await DrugClass.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!dc) return res.status(404).json({ message: 'Classe introuvable' });
    res.json(dc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/drugs/classes/:id
exports.deleteClass = async (req, res) => {
  try {
    const dc = await DrugClass.findByIdAndDelete(req.params.id);
    if (!dc) return res.status(404).json({ message: 'Classe introuvable' });
    // Cascade delete drugs in this class
    await Drug.deleteMany({ drugClass: req.params.id });
    res.json({ message: 'Classe et médicaments supprimés' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ═══════════════════════════════════════
   DRUGS
═══════════════════════════════════════ */

// GET /api/drugs  — supports ?search= and ?classId=
exports.getDrugs = async (req, res) => {
  try {
    const { search, classId } = req.query;
    const filter = {};
    if (classId) filter.drugClass = classId;
    if (search) filter.$or = [
      { name:        { $regex: search, $options: 'i' } },
      { genericName: { $regex: search, $options: 'i' } },
      { tags:        { $in: [new RegExp(search, 'i')] } },
    ];
    const drugs = await Drug.find(filter)
      .populate('drugClass', 'name color icon')
      .select('name genericName drugClass description tags createdAt')
      .sort({ name: 1 });
    res.json(drugs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/drugs/:id
exports.getDrug = async (req, res) => {
  try {
    const drug = await Drug.findById(req.params.id)
      .populate('drugClass', 'name color icon');
    if (!drug) return res.status(404).json({ message: 'Médicament introuvable' });
    // Sort sections by order
    drug.sections.sort((a, b) => a.order - b.order);
    res.json(drug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/drugs
exports.createDrug = async (req, res) => {
  try {
    const {
      name, genericName, drugClass, description,
      sections, mindMap, attachments, sources, tags,
    } = req.body;

    if (!name)      return res.status(400).json({ message: 'Nom requis' });
    if (!drugClass) return res.status(400).json({ message: 'Classe requise' });

    // Normalise section orders
    const orderedSections = (sections || []).map((s, i) => ({ ...s, order: i }));

    const drug = await Drug.create({
      name, genericName, drugClass, description,
      sections: orderedSections,
      mindMap, attachments, sources, tags,
    });
    const populated = await drug.populate('drugClass', 'name color icon');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/drugs/:id
exports.updateDrug = async (req, res) => {
  try {
    // Normalise section orders if present
    if (req.body.sections) {
      req.body.sections = req.body.sections.map((s, i) => ({ ...s, order: i }));
    }
    const drug = await Drug.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('drugClass', 'name color icon');
    if (!drug) return res.status(404).json({ message: 'Médicament introuvable' });
    res.json(drug);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/drugs/:id
exports.deleteDrug = async (req, res) => {
  try {
    const drug = await Drug.findByIdAndDelete(req.params.id);
    if (!drug) return res.status(404).json({ message: 'Médicament introuvable' });
    res.json({ message: 'Médicament supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
