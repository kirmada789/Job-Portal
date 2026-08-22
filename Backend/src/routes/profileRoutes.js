const express = require("express");
const router = express.Router();
const {
  updateProfile,
  getProfile,
  uploadResume,
  getSeekerProfileForRecruiter,
  deleteResume,
  getUserFullProfile
} = require("../controllers/profile.Controller");
const { protect, recruiterOnly, recruiterOrAdmin } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/resume", protect, upload.single("resume"), uploadResume);
router.get(
  "/seeker/:seekerId",
  protect,
  recruiterOnly,
  getSeekerProfileForRecruiter,
);
router.delete("/resume", protect, deleteResume);

// Ab is route ko sirf Recruiter ya Admin hi access kar payega!
router.get("/user/:userId", protect, recruiterOrAdmin, getUserFullProfile);

module.exports = router;
