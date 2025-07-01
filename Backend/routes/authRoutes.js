const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser); // Admin will use this to create users
router.post("/login", loginUser);       // All roles use this

module.exports = router;
