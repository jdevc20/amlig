const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Login route
router.post("/login", authController.login);

// Logout route
router.get("/logout", authController.logout);

// 🔥 Add the /me route to check if the user is authenticated
router.get("/me", authController.me);  // New route to check if user is logged in

module.exports = router;
