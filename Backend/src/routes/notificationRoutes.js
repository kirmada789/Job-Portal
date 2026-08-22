const express = require("express");
const { getNotifications, markAsRead } = require("../controllers/notificationController");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Sirf recruiter ke liye notifications fetch karne ka route
router.get("/", protect, recruiterOnly, getNotifications);

// Notification read mark karne ka route
router.patch("/:notificationId/read", protect, recruiterOnly, markAsRead);

module.exports = router;