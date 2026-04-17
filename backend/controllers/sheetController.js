const RevisionSheet = require('../models/RevisionSheet');
const User          = require('../models/User');
const Anthropic     = require('@anthropic-ai/sdk');
const pdfParse      = require('pdf-parse');

const SHEET_LIMIT         = 5;
const SHEET_LIMIT_PREMIUM = 10;
const COLOR_SCHEMES = ['blue', 'purple', 'green', 'orange', 'pink'];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function buildPrompt(titleHint, category) {
  return `Tu es un formateur IFSI expert. Génère une fiche de révision structurée et pédagogique à partir du contenu ci-dessous.

Génère une fiche de révision en JSON avec cette structure exacte (sans texte avant ou après) :
{
  "title": "${titleHint || 'Fiche de révision'}",
  "sections": [
    {
      "type": "definition",
      "title": "Définition / Introduction",
      "content": "Explication concise et claire du concept principal."
    },
    {
      "type": "key_points",
      "title": "Points essentiels",
      "items": ["Point clé 1", "Point clé 2", "Point clé 3", "Point clé 4"]
    },
    {
      "type": "schema",
      "title": "Schéma / Étapes",
      "steps": ["Étape 1", "Étape 2", "Étape 3"]
    },
    {
      "type": "remember",
      "title": "À retenir absolument",
      "content": "La notion la plus importante à mémoriser."
    },
    {
      "type": "caution",
      "title": "Points d'attention",
      "items": ["Attention 1", "Attention 2"]
    },
    {
      "type": "values",
      "title": "Valeurs / Chiffres clés",
      "items": ["Valeur 1 : X", "Valeur 2 : Y"]
    }
  ]
}

Règles :
- Utilise UNIQUEMENT les informations du contenu fourni
- Sois concis et pédagogique
- N'inclus pas de section si le contenu ne la justifie pas (min 3 sections, max 6)
- Les items doivent être courts (une ligne max)`;
}

exports.getSheets = async (req, res) => {
  try {
    const sheets = await RevisionSheet.find({ owner: req.user._id })
      .select('-rawText -content')
      .sort('-createdAt');
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSheet = async (req, res) => {
  try {
    const sheet = await RevisionSheet.findOne({ _id: req.params.id, owner: req.user._id });
    if (!sheet) return res.status(404).json({ message: 'Fiche introuvable' });
    res.json(sheet);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.genStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!['pro', 'premium'].includes(user.subscription)) {
      return res.status(403).json({ message: 'Abonnement Pro requis' });
    }
    const limit = user.subscription === 'premium' ? SHEET_LIMIT_PREMIUM : SHEET_LIMIT;
    const today = todayString();
    const used  = user.sheetGen?.date === today ? (user.sheetGen?.count || 0) : 0;
    res.json({ used, limit, remaining: limit - used });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.generate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!['pro', 'premium'].includes(user.subscription)) {
      return res.status(403).json({ message: 'Cette fonctionnalité est réservée aux abonnements Pro et Premium.' });
    }

    const limit = user.subscription === 'premium' ? SHEET_LIMIT_PREMIUM : SHEET_LIMIT;
    const today = todayString();

    if (user.sheetGen?.date !== today) {
      user.sheetGen = { count: 0, date: today };
    }

    if (user.sheetGen.count >= limit) {
      return res.status(429).json({
        message: `Limite journalière atteinte (${limit} fiches/jour). Réessayez demain.`,
        remaining: 0,
      });
    }

    const { title, category, sourceType } = req.body;
    const colorScheme = COLOR_SCHEMES[Math.floor(Math.random() * COLOR_SCHEMES.length)];
    const client      = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt      = buildPrompt(title, category);

    let message;

    // ── Source: plain text ──────────────────────────────────────────────────
    if (sourceType === 'text' || (!req.file && req.body.courseText)) {
      const courseText = req.body.courseText || '';
      if (courseText.trim().length < 30) {
        return res.status(400).json({ message: 'Le texte doit contenir au moins 30 caractères.' });
      }
      message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `COURS :\n${courseText.slice(0, 4000)}\n\n${prompt}`,
        }],
      });

    // ── Source: image (vision) ──────────────────────────────────────────────
    } else if (req.file && req.file.mimetype.startsWith('image/')) {
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Format d\'image non supporté (JPEG, PNG, WebP, GIF).' });
      }
      message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: req.file.mimetype,
                data: req.file.buffer.toString('base64'),
              },
            },
            {
              type: 'text',
              text: `Ce document est un cours ou une prise de notes. Analyse son contenu et génère une fiche de révision.\n\n${prompt}`,
            },
          ],
        }],
      });

    // ── Source: PDF ─────────────────────────────────────────────────────────
    } else if (req.file && req.file.mimetype === 'application/pdf') {
      let extractedText;
      try {
        const pdfData = await pdfParse(req.file.buffer);
        extractedText = pdfData.text;
      } catch {
        return res.status(400).json({ message: 'Impossible de lire ce PDF. Essayez de coller le texte directement.' });
      }
      if (!extractedText || extractedText.trim().length < 30) {
        return res.status(400).json({ message: 'Le PDF ne contient pas assez de texte extractible. Essayez de coller le texte directement.' });
      }
      message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `COURS (extrait du PDF) :\n${extractedText.slice(0, 4000)}\n\n${prompt}`,
        }],
      });

    } else {
      return res.status(400).json({ message: 'Fournissez un texte, une image ou un PDF.' });
    }

    const raw = message.content[0].text.trim();
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Réponse IA invalide');

    const generated = JSON.parse(jsonMatch[0]);

    const sheet = await RevisionSheet.create({
      title:      generated.title || title || 'Fiche de révision',
      category:   category || '',
      rawText:    req.body.courseText || '',
      content:    generated,
      colorScheme,
      owner:      req.user._id,
    });

    user.sheetGen.count += 1;
    await user.save();

    res.status(201).json({ sheet, remaining: limit - user.sheetGen.count });
  } catch (err) {
    if (err instanceof SyntaxError) {
      return res.status(500).json({ message: 'Erreur lors de la génération. Réessayez.' });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSheet = async (req, res) => {
  try {
    const sheet = await RevisionSheet.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!sheet) return res.status(404).json({ message: 'Fiche introuvable' });
    res.json({ message: 'Fiche supprimée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
