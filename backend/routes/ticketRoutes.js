const express = require("express");
const asyncHandler = require("../utils/async-handler");
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
} = require("../controllers/ticketController");

const router = express.Router();

router.post("/", asyncHandler(createTicket));
router.get("/", asyncHandler(getTickets));
router.get("/:ticket_id", asyncHandler(getTicket));
router.put("/:ticket_id", asyncHandler(updateTicket));

module.exports = router;
