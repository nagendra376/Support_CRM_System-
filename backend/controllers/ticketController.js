const Ticket = require("../models/Ticket");
const Note = require("../models/Note");
const ApiError = require("../utils/api-error");
const ApiResponse = require("../utils/api-response");

const VALID_STATUSES = ["Open", "In Progress", "Closed"];

const createTicket = async (req, res) => {
  const { customer_name, customer_email, subject, description } = req.body;

  if (!customer_name || !customer_email || !subject || !description) {
    throw new ApiError(400, "All fields are required");
  }

  const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });
  const lastNumber = lastTicket
    ? Number(lastTicket.ticket_id.replace("TKT-", ""))
    : 0;
  const ticket_id = `TKT-${String(lastNumber + 1).padStart(3, "0")}`;

  const ticket = await Ticket.create({
    ticket_id,
    customer_name,
    customer_email,
    subject,
    description,
  });

  res.status(201).json(
    new ApiResponse(
      201,
      {
        ticket_id: ticket.ticket_id,
        created_at: ticket.createdAt,
      },
      "Ticket created successfully",
    ),
  );
};

const getTickets = async (req, res) => {
  const { search, status } = req.query;
  const query = {};

  if (search) {
    const searchPattern = { $regex: search, $options: "i" };
    query.$or = [
      { customer_name: searchPattern },
      { customer_email: searchPattern },
      { ticket_id: searchPattern },
      { subject: searchPattern },
      { description: searchPattern },
    ];
  }

  if (status) {
    query.status = status;
  }

  const tickets = await Ticket.find(query).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, tickets, "Tickets fetched successfully"));
};

const getTicket = async (req, res) => {
  const ticket_id = decodeURIComponent(req.params.ticket_id).trim();
  const ticket = await Ticket.findOne({
    ticket_id: { $regex: `^${ticket_id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
  });

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  const notes = await Note.find({ ticket_id }).sort({ createdAt: -1 });
  res.json(
    new ApiResponse(200, { ticket, notes }, "Ticket fetched successfully"),
  );
};

const updateTicket = async (req, res) => {
  const ticket_id = decodeURIComponent(req.params.ticket_id).trim();
  const { status, note } = req.body;

  if (status && !VALID_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const ticket = await Ticket.findOne({ ticket_id });

  if (!ticket) {
    throw new ApiError(404, "Ticket not found");
  }

  if (status) {
    ticket.status = status;
    await ticket.save();
  }

  if (note && note.trim()) {
    await Note.create({ ticket_id, note: note.trim() });
  }

  const notes = await Note.find({ ticket_id }).sort({ createdAt: -1 });
  res.json(
    new ApiResponse(200, { ticket, notes }, "Ticket updated successfully"),
  );
};

module.exports = { createTicket, getTickets, getTicket, updateTicket };
