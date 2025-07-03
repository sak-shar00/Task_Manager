const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getAllUsersByRole, deleteUser, updateSpecialization,addManager, addEmployee, getManagersSummary } = require("../controllers/adminController");

// Fetch all users by role (manager or employee)

// GET /api/users/role/employee
router.get("/role/:role", getAllUsersByRole);
router.get("/users/:role", getAllUsersByRole);  // Full route: /api/admin/users/employee

// POST /api/admin/add-manager
router.post("/add-manager", addManager);

router.get("/managers-summary", protect, getManagersSummary);

// POST /api/admin/add-employee
router.post("/add-employee", addEmployee);




// Delete a user
router.delete("/employee/:id", deleteUser);

// Update specialization
router.put("/employee/:id/specialization", updateSpecialization);

module.exports = router;
