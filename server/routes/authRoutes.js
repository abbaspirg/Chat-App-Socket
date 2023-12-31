const express = require("express");
const router = express.Router();
const cors = require("cors");
const { api, registerUser, loginUser, logoutUser, getProfile } = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: "https://abbas.co.in",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

router.use("/api", api);

router.use("/register", registerUser);

router.use("/login", loginUser);

router.use("/logout", logoutUser);

router.use("/profile", getProfile);

module.exports = router;
