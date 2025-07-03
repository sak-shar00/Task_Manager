const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedToName: { type: String },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedByName: { type: String },
  status: {
    type: String,
    enum: ["pending", "inprogress", "completed"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Subtask", subtaskSchema);
