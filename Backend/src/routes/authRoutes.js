const express = require("express");
const passport = require("passport");
const router = express.Router();
const { registerUser, loginUser, googleCallback, googleAuth, logout, forgotPassword, resetPassword } = require("../controllers/authController");

// POST /api/auth/signup
router.post("/signup", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/google (Frontend Google Login component ke liye)
router.post("/google", googleAuth);

// POST /api/auth/logout
router.post("/logout", logout);

// POST /api/auth/forget-password
router.post("/forget-password", forgotPassword);

// Put api/auth/reset-password
router.put("/reset-password/:token", resetPassword);

// Goggle login page par redirect krne ke liye (Traditional redirect)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login", session: false }),
  googleCallback
);

module.exports = router;