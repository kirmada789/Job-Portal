const Application = require("../models/Application.Schema");
const Job = require("../models/Job.Schema"); // Job model required to fetch recruiter ID
const Notification = require("../models/notification.Schema"); // Notification model
const sendEmail = require("../utils/sendEmail");

// Apply for job
async function applyForJob(req, res) {
    try {
        const { jobId, userId } = req.body;

        if (!jobId || !userId) {
            return res.status(400).json({
                success: false,
                message: "Job ID and User ID are required"
            });
        }

        const existingApplication = await Application.findOne({
            job: jobId,
            application: userId
        });

        if (existingApplication) {
           return res.status(400).json({
                success: false,
                message: "You have already applied for this job"
            });
        }

        // Job fetch karo taaki pata chale kis recruiter (postedBy) ne job post ki hai
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        const newApplication = new Application({
            job: jobId,
            application: userId,
            status: "Pending"
        });

        await newApplication.save();

        // 🔔 Recruiter ke liye Notification create karne ka logic
        try {
            if (job.postedBy) {
                await Notification.create({
                    recipient: job.postedBy, // Recruiter ID jo job post kiya hai
                    sender: userId,          // Seeker ID jisne apply kiya
                    message: `A candidate applied for your job: ${job.title}`,
                    jobId: jobId
                });
            }
        } catch (notifError) {
            console.error("Failed to create notification:", notifError.message);
        }

        res.status(201).json({
            success: true,
            message: "Applied successfully!",
            application: newApplication
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get applications for jobs 
async function getJobApplications(req, res) {
    try {
        const application = await Application.find({
            job: req.params.jobId
        }).populate("application", "name email");
        res.status(200).json({
            success: true,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Get all applications applied by a specific seeker
async function getSeekerApplications(req, res) {
    try {
        const applications = await Application.find({
            application: req.params.userId
        }).populate("job"); // Isse job ki saari details bhi sath mein mil jayengi
        
        res.status(200).json({
            success: true,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Recruiter update application status
async function updateApplicationStatus(req, res) {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status Value"
            });
        }

        const allowedStatuses = ["Pending", "Viewed", "Shortlisted", "Selected", "Rejected"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Status Value"
            });
        }

        const application = await Application.findById(applicationId).populate("application", "name email");

        if (!application) {
            return res.status(400).json({
                success: false,
                message: "Application not found"
            });
        }

        application.status = status;
        await application.save();

        try {
            const candidateEmail = application.application.email;
            const candidateName = application.application.name;

            await sendEmail({
                email: candidateEmail,
                subject: `Job Application Status Updated: ${status}`,
                message: `Hello ${candidateName},\n\nYour application status has been updated to: ${status}.\n\nBest regards,\nAivon Tech Job Portal Team`
            });
        } catch (error) {
            console.log("Email could not be sent:", error.message);
        }

        return res.status(200).json({
            success: true,
            message: `Application status updated to ${status} successfully`,
            application
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    applyForJob,
    getJobApplications,
    getSeekerApplications,
    updateApplicationStatus
};