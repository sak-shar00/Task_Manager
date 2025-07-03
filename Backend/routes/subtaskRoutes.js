const express = require("express");
const router = express.Router();

const {
  createSubtask,
  getSubtasksByTask,
  updateSubtask,
  getSubtasksByAssignee,
} = require("../controllers/subtaskController");

const { protect } = require("../middleware/auth"); // ✅ This must be correctly exported from auth.js

router.post("/", protect, createSubtask);
router.get("/:taskId", protect, getSubtasksByTask);
router.patch("/:id", protect, updateSubtask);
router.get("/assigned/:userId", protect, getSubtasksByAssignee);
router.get("/", protect, async (req, res) => {
  const subtasks = await Subtask.find();
  res.json(subtasks);
});

module.exports = router;
