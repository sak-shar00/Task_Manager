const Subtask = require("../models/subtask");
const User = require("../models/User");

// Create a subtask
const createSubtask = async (req, res) => {
  try {
    const { title, description, taskId, assignedTo } = req.body;
    const user = await User.findById(assignedTo);
    if (!user) return res.status(404).json({ message: "Assigned user not found" });
    const assigner = await User.findById(req.user._id);
    const newSubtask = new Subtask({
      title,
      description,
      taskId,
      assignedTo,
      assignedToName: user.name,
      assignedBy: assigner._id,
      assignedByName: assigner.name,
    });
    await newSubtask.save();
    res.status(201).json(newSubtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all subtasks for a task
const getSubtasksByTask = async (req, res) => {
  try {
    const subtasks = await Subtask.find({ taskId: req.params.taskId });
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update subtask status
const updateSubtask = async (req, res) => {
  try {
    const subtask = await Subtask.findById(req.params.id);
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    subtask.status = req.body.status || subtask.status;
    await subtask.save();
    res.json(subtask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all subtasks assigned to a user
const getSubtasksByAssignee = async (req, res) => {
  try {
    const subtasks = await Subtask.find({ assignedTo: req.params.userId });
    res.json(subtasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={createSubtask,getSubtasksByTask,updateSubtask, getSubtasksByAssignee };