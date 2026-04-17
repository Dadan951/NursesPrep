const Ticket = require('../models/Ticket');

/* ── User routes ───────────────────────────────────────────────────────────── */

// POST /api/tickets  — create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, message } = req.body;
    if (!subject?.trim() || !message?.trim())
      return res.status(400).json({ message: 'Objet et message requis' });

    const ticket = await Ticket.create({
      user:       req.user._id,
      userName:   req.user.name,
      userEmail:  req.user.email,
      subject:    subject.trim(),
      category:   category || 'question',
      messages:   [{ sender: 'user', senderName: req.user.name, content: message.trim() }],
      isReadByAdmin: false,
      isReadByUser:  true,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET /api/tickets/my  — list own tickets
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tickets/my/:id  — get single own ticket + mark read by user
exports.getMyTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user._id });
    if (!ticket) return res.status(404).json({ message: 'Ticket introuvable' });
    if (!ticket.isReadByUser) { ticket.isReadByUser = true; await ticket.save(); }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tickets/my/:id/reply  — user adds a message
exports.replyToTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user._id });
    if (!ticket) return res.status(404).json({ message: 'Ticket introuvable' });
    if (ticket.status === 'closed')
      return res.status(400).json({ message: 'Ce ticket est fermé' });
    if (!req.body.content?.trim())
      return res.status(400).json({ message: 'Message vide' });

    ticket.messages.push({ sender: 'user', senderName: req.user.name, content: req.body.content.trim() });
    ticket.updatedAt   = new Date();
    ticket.isReadByAdmin = false;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* ── Admin routes ──────────────────────────────────────────────────────────── */

// GET /api/tickets/admin  — list all tickets (optional ?status= filter)
exports.adminGetAll = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    const tickets = await Ticket.find(filter).sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tickets/admin/:id  — get single ticket + mark read by admin
exports.adminGetOne = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket introuvable' });
    if (!ticket.isReadByAdmin) { ticket.isReadByAdmin = true; await ticket.save(); }
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tickets/admin/:id/reply  — admin adds a message
exports.adminReply = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket introuvable' });
    if (!req.body.content?.trim())
      return res.status(400).json({ message: 'Message vide' });

    ticket.messages.push({ sender: 'admin', senderName: 'Support NursesPrep', content: req.body.content.trim() });
    if (ticket.status === 'open') ticket.status = 'in_progress';
    ticket.updatedAt   = new Date();
    ticket.isReadByUser  = false;
    ticket.isReadByAdmin = true;
    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/tickets/admin/:id/status  — update status
exports.adminUpdateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['open', 'in_progress', 'closed'].includes(status))
      return res.status(400).json({ message: 'Statut invalide' });

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!ticket) return res.status(404).json({ message: 'Ticket introuvable' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/tickets/admin/:id
exports.adminDelete = async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: 'Ticket supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
