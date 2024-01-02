const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  api,
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleOuth,
} = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

router.use("/api", api);

router.use("/register", registerUser);

router.use("/login", loginUser);

router.use("/logout", logoutUser);

router.use("/profile", getProfile);

router.use("/googleOuuth", googleOuth);

module.exports = router;
