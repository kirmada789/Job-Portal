const express = require("express");
const {createJob, getAllJobs } = require("../controllers/jobController");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

//sabhi jobs dekhne ka route (public / loged- in user)
router.get("/get-jobs", getAllJobs);

// job post karne ka route (phele token check hoga "protect" se, phir role check hoga ("recruiterOnly") se)
router.post("/post-job", protect, recruiterOnly, createJob);

module.exports = router;
