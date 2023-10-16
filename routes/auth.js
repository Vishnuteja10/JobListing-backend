const express = require("express");

const router = express.Router();

const User = require("../models/user");

const { register, login } = require("../controllers/authentication");

// Register route

router.route("/register").post(register);

router.route("/login").post(login);


module.exports = router;
