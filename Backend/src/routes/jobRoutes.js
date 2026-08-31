const express = require("express");
const { createJob, getRecruiterJobs, getAllJobs } = require("../controllers/jobController");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Sabhi jobs dekhne ka route (public / logged-in user)
router.get("/get-jobs", getAllJobs);

// Sirf logged-in recruiter ki apni jobs dekhne ka route (👈 Yeh naya add kiya hai)
router.get("/recruiter-jobs", protect, recruiterOnly, getRecruiterJobs);

// Job post karne ka route (pehle token check hoga "protect" se, phir role check hoga "recruiterOnly" se)
router.post("/post-job", protect, recruiterOnly, createJob);

module.exports = router;