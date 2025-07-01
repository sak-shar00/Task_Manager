const express = require("express");
const router = express.Router();
const { createTask, getTasksByManager,  getTasksByEmployee,updateTaskStatus,getManagerAnalytics} = require("../controllers/taskController");

// Create task
router.post("/create", createTask);

// Get tasks assigned by a specific manager
router.get("/manager/:managerId", getTasksByManager);
// Get tasks assigned to a specific employee
router.get("/employee/:employeeId", getTasksByEmployee);
router.put("/update-status/:taskId", updateTaskStatus);
router.get("/manager/:managerId/analytics", getManagerAnalytics);



module.exports = router;
