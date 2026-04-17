const Group     = require('../models/Group');
const GroupPost = require('../models/GroupPost');

/* helper — generate a 6-char uppercase code */
function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ── GET /api/groups ─────────────────────────────────────────────────────────
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      $or: [
        { isPrivate: false },
        { members: req.user._id },
        { pendingMembers: req.user._id },
      ]
    })
      .populate('creator', 'name')
      .sort('-createdAt');

    const result = groups.map(g => ({
      ...g.toObject(),
      memberCount: g.members.length,
      isMember:    g.members.some(m => m.toString() === req.user._id.toString()),
      isPending:   (g.pendingMembers || []).some(m => m.toString() === req.user._id.toString()),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/groups ─────────────────────────────────────────────────────────
exports.createGroup = async (req, res) => {
  try {
    const { name, description, isPrivate, category } = req.body;
    const joinCode = genCode(); // always generate

    const group = await Group.create({
      name,
      description,
      isPrivate: !!isPrivate,
      joinCode,
      category: category || 'Général',
      creator: req.user._id,
      members: [req.user._id],
    });

    await group.populate('creator', 'name');
    res.status(201).json({ ...group.toObject(), memberCount: 1, isMember: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/groups/:id ──────────────────────────────────────────────────────
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name')
      .populate('members', 'name')
      .populate('pendingMembers', 'name email');

    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    const isMember  = group.members.some(m => m._id.toString() === req.user._id.toString());
    const isPending = (group.pendingMembers || []).some(m => m._id.toString() === req.user._id.toString());

    if (group.isPrivate && !isMember && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Groupe privé' });
    }

    const isCreator = group.creator._id.toString() === req.user._id.toString();
    const obj = group.toObject();

    // hide pendingMembers from non-creators
    if (!isCreator && req.user.role !== 'admin') delete obj.pendingMembers;

    res.json({ ...obj, isMember, isPending, isCreator });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/groups/join-by-code ────────────────────────────────────────────
// Join any group (public or private) using only its access code
exports.joinByCode = async (req, res) => {
  try {
    const code  = (req.body.code || '').trim().toUpperCase();
    if (!code)  return res.status(400).json({ message: 'Code requis' });

    const group = await Group.findOne({ joinCode: code });
    if (!group) return res.status(404).json({ message: 'Code invalide — aucun groupe trouvé' });

    const uid       = req.user._id.toString();
    const isMember  = group.members.some(m => m.toString() === uid);
    const isPending = (group.pendingMembers || []).some(m => m.toString() === uid);

    if (isMember)  return res.status(400).json({ message: 'Vous êtes déjà membre de ce groupe' });
    if (isPending) return res.status(400).json({ message: 'Votre demande est déjà en attente d\'approbation' });

    if (group.isPrivate) {
      // private → pending approval
      group.pendingMembers.push(req.user._id);
      await group.save();
      return res.json({
        pending:   true,
        groupName: group.name,
        message:   `Demande envoyée — en attente d'approbation par l'admin du groupe`,
      });
    } else {
      // public → direct join
      group.members.push(req.user._id);
      await group.save();
      return res.json({
        pending:   false,
        groupId:   group._id,
        groupName: group.name,
        message:   `Vous avez rejoint "${group.name}" !`,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/groups/:id/join ────────────────────────────────────────────────
// Legacy direct join (public only)
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    const uid      = req.user._id.toString();
    const isMember = group.members.some(m => m.toString() === uid);
    if (isMember) return res.status(400).json({ message: 'Déjà membre' });

    if (group.isPrivate) {
      return res.status(403).json({ message: 'Groupe privé — utilisez la clé d\'accès' });
    }

    group.members.push(req.user._id);
    await group.save();
    res.json({ message: 'Rejoint avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET /api/groups/:id/pending ──────────────────────────────────────────────
exports.getPendingMembers = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('pendingMembers', 'name email');
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    const isCreator = group.creator.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    res.json(group.pendingMembers || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/groups/:id/approve/:userId ─────────────────────────────────────
exports.approveMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    const isCreator = group.creator.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const userId = req.params.userId;
    group.pendingMembers = (group.pendingMembers || []).filter(m => m.toString() !== userId);
    if (!group.members.some(m => m.toString() === userId)) {
      group.members.push(userId);
    }
    await group.save();
    res.json({ message: 'Membre approuvé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/groups/:id/reject/:userId ────────────────────────────────────
exports.rejectMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    const isCreator = group.creator.toString() === req.user._id.toString();
    if (!isCreator && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    group.pendingMembers = (group.pendingMembers || []).filter(m => m.toString() !== req.params.userId);
    await group.save();
    res.json({ message: 'Demande refusée' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── POST /api/groups/:id/leave ───────────────────────────────────────────────
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });

    if (group.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Le créateur ne peut pas quitter le groupe' });
    }

    group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
    await group.save();
    res.json({ message: 'Groupe quitté' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE /api/groups/:id ───────────────────────────────────────────────────
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    if (group.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    await Group.findByIdAndDelete(req.params.id);
    await GroupPost.deleteMany({ group: req.params.id });
    res.json({ message: 'Groupe supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Group posts ──────────────────────────────────────────────────────────────
exports.getPosts = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (group.isPrivate && !isMember) return res.status(403).json({ message: 'Groupe privé' });
    const posts = await GroupPost.find({ group: req.params.id })
      .populate('author', 'name')
      .populate('comments.author', 'name')
      .sort('-createdAt');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Groupe introuvable' });
    const isMember = group.members.some(m => m.toString() === req.user._id.toString());
    if (!isMember) return res.status(403).json({ message: 'Vous devez être membre pour poster' });
    const post = await GroupPost.create({
      group: req.params.id, author: req.user._id,
      content: req.body.content, type: req.body.type || 'text',
    });
    await post.populate('author', 'name');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await GroupPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post introuvable' });
    const liked = post.likes.some(l => l.toString() === req.user._id.toString());
    if (liked) post.likes = post.likes.filter(l => l.toString() !== req.user._id.toString());
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const post = await GroupPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post introuvable' });
    post.comments.push({ author: req.user._id, content: req.body.content });
    await post.save();
    await post.populate('comments.author', 'name');
    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin ────────────────────────────────────────────────────────────────────
exports.adminGetGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('creator', 'name email').sort('-createdAt');
    res.json(groups.map(g => ({
      ...g.toObject(),
      memberCount:  g.members.length,
      pendingCount: (g.pendingMembers || []).length,
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.adminDeleteGroup = async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    await GroupPost.deleteMany({ group: req.params.id });
    res.json({ message: 'Groupe supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
