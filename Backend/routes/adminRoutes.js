const express = require("express");
const router = express.Router();
const { getAllUsersByRole, deleteUser, updateSpecialization } = require("../controllers/adminController");

// Fetch all users by role (manager or employee)

// GET /api/users/role/employee
router.get("/role/:role", getAllUsersByRole);
router.get("/users/:role", getAllUsersByRole);  // Full route: /api/admin/users/employee



// Delete a user
router.delete("/employee/:id", deleteUser);

// Update specialization
router.put("/employee/:id/specialization", updateSpecialization);

module.exports = router;
