const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/auth");       // checks token
const isAdmin = require("../middleware/isAdmin");     // NEW FILE (below)

// Only logged-in admin can register new users
router.post("/register", protect, isAdmin, registerUser); 
router.post("/login", loginUser);

module.exports = router;
