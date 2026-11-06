const express = require("express");

const router = express.Router();

const {
    register,
    login
} = require("../controllers/authController");

// Register admin account
router.post("/register", register);

// Login admin account
router.post("/login", login);

module.exports = router;