const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, assignedBy, deadline, priority } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy,
      deadline,
      priority,
    });

    await task.save();
    res.status(201).json({ message: "Task created successfully", task });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Task creation failed", error: err.message });
  }
};
const getTasksByManager = async (req, res) => {
  try {
    const managerId = req.params.managerId;

    const tasks = await Task.find({ assignedBy: managerId }).populate("assignedTo", "name");

    // Include assignedToName in each task for easier frontend use
    const result = tasks.map((task) => ({
      ...task._doc,
      assignedToName: task.assignedTo?.name || "Unassigned",
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

const getTasksByEmployee = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.employeeId }).populate("assignedBy", "name");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Status update failed", error: err.message });
  }
};

const getManagerAnalytics = async (req, res) => {
  try {
    const managerId = req.params.managerId;

    const tasks = await Task.find({ assignedBy: managerId }).populate("assignedTo", "name");

    const statusCount = {
      Pending: 0,
      "In Progress": 0,
      Completed: 0,
    };

    const leaderboard = {};

    tasks.forEach((task) => {
      statusCount[task.status]++;

      const empName = task.assignedTo?.name || "Unknown";

      if (!leaderboard[empName]) leaderboard[empName] = 0;
      if (task.status === "Completed") leaderboard[empName]++;
    });

    res.json({
      totalTasks: tasks.length,
      statusCount,
      leaderboard,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics fetch failed", error: err.message });
  }
};

module.exports = { createTask, getTasksByManager,getTasksByEmployee ,updateTaskStatus,getManagerAnalytics};

