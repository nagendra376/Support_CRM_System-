const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    ticket_id: {
      type: String,
      required: true,
    },

    note: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
