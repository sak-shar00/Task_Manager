const User = require("../models/User");

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

module.exports = { getAllUsersByRole, deleteUser, updateSpecialization };
