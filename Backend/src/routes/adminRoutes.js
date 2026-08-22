const express = require("express");
const router = express.Router();

const {
    adminLogin,
    getAdminDashboard,
    getAllUsers,
    getAllRecruiters,
    gettAllJobs,
    deleteUser,
    deleteJobs,
    updateUserStatus,
    updateJobStatus,
    getAllApplications  
} = require("../controllers/adminController");

const {protect, adminOnly } = require("../middlewares/authMiddleware");

// admin login ( public endpoints for admin authentication)
router.post("/login", adminLogin);


// protected admin routes (reequire valid token and admin role)
router.get("/dashboard", protect, adminOnly, getAdminDashboard);
router.get("/users", protect, adminOnly, getAllUsers);
router.get("/recruiters", protect, adminOnly, getAllRecruiters);
router.get("/jobs", protect, adminOnly, gettAllJobs);
router.delete("/users/:id", protect, adminOnly, deleteUser);
router.delete("/jobs/:id", protect, adminOnly, deleteJobs);
router.put("/users/:id/status", protect, adminOnly, updateUserStatus);
router.put("/jobs/:id/status", protect, adminOnly, updateJobStatus);
router.get("/applications", protect, adminOnly, getAllApplications);

module.exports = router;
