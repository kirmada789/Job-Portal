const express = require("express");
const router = express.Router();
const {applyForJob, getJobApplications, getSeekerApplications , updateApplicationStatus } = require("../controllers/applicationController");
const { protect, recruiterOnly } = require("../middlewares/authMiddleware");


router.post("/apply", protect , applyForJob);
router.get("/job/:jobId", protect,recruiterOnly, getJobApplications)
router.get("/my-applications/:userId", protect, getSeekerApplications);
router.patch("/status/:id/update", protect, recruiterOnly, updateApplicationStatus)




module.exports = router;