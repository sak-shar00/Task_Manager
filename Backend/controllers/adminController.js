const User = require("../models/User");
const { protect } = require("../middleware/auth");

const getAllUsersByRole = async (req, res) => {
  try {
    const role = req.params.role; // "employee"
    const users = await User.find({ role });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};

const updateSpecialization = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { specialization: req.body.specialization },
      { new: true }
    );
    res.json({ message: "Updated", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};
const addManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const newManager = new User({
      name,
      email,
      password,
      role: "manager",
    });

    await newManager.save();
    res.status(201).json({ message: "Manager created successfully", user: newManager });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// / Admin/Manager adds employee
const addEmployee = async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const newEmp = new User({ name, email, password, specialization, role: "employee" });
    await newEmp.save();
    res.status(201).json({ message: "Employee added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding employee", error: err.message });
  }
};
const getManagersSummary = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });

    const data = await Promise.all(
      managers.map(async (manager) => {
        const employees = await User.find({ role: "employee", managerId: manager._id });

        const tasks = await Task.find({ assignedBy: manager._id });

        const statusCount = {
          pending: tasks.filter((t) => t.status === "pending").length,
          inprogress: tasks.filter((t) => t.status === "inprogress").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        };

        const empPerf = {};
        tasks.forEach((task) => {
          empPerf[task.assignedTo] = (empPerf[task.assignedTo] || 0) + (task.status === "completed" ? 1 : 0);
        });

        let bestPerformer = null;
        if (Object.keys(empPerf).length > 0) {
          const bestId = Object.entries(empPerf).sort((a, b) => b[1] - a[1])[0][0];
          const emp = await User.findById(bestId);
          bestPerformer = emp?.name || "N/A";
        }

        return {
          managerName: manager.name,
          managerEmail: manager.email,
          totalEmployees: employees.length,
          totalTasks: tasks.length,
          ...statusCount,
          bestPerformer,
        };
      })
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getAllUsersByRole, deleteUser, updateSpecialization,addManager,addEmployee,getManagersSummary };
