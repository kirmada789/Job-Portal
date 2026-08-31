const User = require("../models/user.Schema");
const Job = require("../models/Job.Schema");
const Application = require("../models/Application.Schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
};

async function adminLogin(req, res) {
    try {
        const { password } = req.body;
        const email = req.body.email?.trim().toLowerCase();
        let user = await User.findOne({ email }).select("+password");

        // Temporary Auto-Provisioning fallback for testing
        if (!user && email === "admin@gmail.com") {
            user = new User({
                name: "Master Admin",
                email: email,
                password: password || "admin123",
                role: "admin",
                status: "active"
            });
            await user.save();
            user = await User.findOne({ email }).select("+password");
        }

        if (!user || user.role !== "admin") {
            return res.status(404).json({
                success: false,
                message: "Admin not found!"
            });
        }

        const isMatch = (password === user.password) || (await bcrypt.compare(password, user.password));
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(200).json({
            success: true,
            message: "Admin logged successfully!",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// admin dashboard stats & Overview
async function getAdminDashboard(req, res) {
    try {
        const totalUsers = await User.countDocuments({ role: "seeker" }); // 👈 Yahan sirf seeker count hoga (Yani 2)
        const totalRecruiters = await User.countDocuments({ role: "recruiter" }); // 👈 Yahan sirf recruiter (Yani 1)
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Application.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalRecruiters,
                totalJobs,
                totalApplications
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get all users (Seekers & Recruiters dono fetch honge)
async function getAllUsers(req, res) {
    try {
        const users = await User.find({
            role: { $in: ["seeker", "recruiter"] }
        }).select("-password");
        
        res.status(200).json({
            success: true,
            count: users.length, 
            users 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get all recruiters
async function getAllRecruiters(req, res) {
    try {
        const recruiters = await User.find({
            role: "recruiter"
        }).select("-password");
        res.status(200).json({
            success: true,
            count: recruiters.length, 
            recruiters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get all Jobs
async function gettAllJobs(req, res) {
    try {
        const jobs = await Job.find().populate("postedBy", "name email");
        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// delete User / Recruiter
async function deleteUser(req, res) {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        } 
        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// delete jobs
async function deleteJobs(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }
        await job.deleteOne();
        res.status(200).json({
            success: true,
            message: "Job removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// update user status (eg - active / blocked)
async function updateUserStatus(req, res) {
    try {
        const { status } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = status || user.status;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User status updated to ${status}`, 
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// update Job status (eg active/ closed/ flagged)
async function updateJobStatus(req, res) {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        job.status = status || job.status;
        await job.save();

        res.status(200).json({
            success: true,
            message: `Job status updated to ${status}`, 
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// get all platform application (Fixed strict populate error)
async function getAllApplications(req, res) {
    try {
        const applications = await Application.find()
            .populate("job", "title company")
            .populate("application", "name email"); // Removed invalid 'user' path to prevent 500 error

        res.status(200).json({
            success: true,
            count: applications.length, 
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
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
};