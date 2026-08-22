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

// admin login jiska role sirf admin ho

async function adminLogin(req, res) {

    try {
        const { email, password} = req.body;
        const user = await User.findOne({
            email
        });

        if (!user || user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Invalid admin credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message:"Invalid email or password"
            });
        }

        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: "30d"}
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
        })
    }
}

//admin dashboard stats & Overview

async function getAdminDashboard(req, res) {

    try {
        const totalUser = await User.countDocuments({role: "seeker"});
        const totalRecruiters = await User.countDocuments({role: "recruiter"});
        const totalJobs = await Job.countDocuments();
        const totalApplications = await Job.countDocuments();

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
        })
    }
}

// get all seekers (users)

async function getAllUsers(req, res) {

    try {
        const users = await User.find({
            role: "seeker"
        }).select("-password");
        res.status(200).json({
            success: true,
            count: users.length, users 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get all recruiters

async function getAllRecruiters(req, res) {

    try {
        const recruiter = await User.find({
            role: "recruiter"
        }).select("-password");
        res.status(200).json({
            success: true,
            count: recruiters.length, recruiters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
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
        })
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
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// delete jobs

async function deleteJobs(req, res) {

    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                succes: false,
                message: "Job not found"
            });
        }
        await job.deleteOne();
        res.status(200).json({
            success: true,
            message: "Job removed successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// update user status (eg - active / blocked)

async function updateUserStatus(req, res) {
     
    try {
        const {status} = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.status = status || user.status;
        await user. save();

        res.status(200).json({
            success: true,
            message: `User status updated to ${status}`, user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message
        })
    }
}

//update Job status (eg active/ closed/ flagged)

async function updateJobStatus(req, res) {

    try {
        const {status} = req.body;
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
            message: `Job status updated to ${status}`, job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get all platforma application

async function getAllApplications(req, res) {

    try {
        const applications = await Application.find()
        .populate("job", "title company")
        .populate("application", "name email");

        res.status(200).json({
            success: true,
            count: applications.length, applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
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
}