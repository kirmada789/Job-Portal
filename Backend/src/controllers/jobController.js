const Job = require("../models/Job.Schema");

// 1. Naya job post karne ka controller (sirf recruiter ke liye) 
async function createJob(req, res) {
    try {
        const { title, description, company, location, salary, jobType, experienceLevel, skills, perks } = req.body;

        if (!title || !description || !company || !location) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields (Title, Description, Company, Location)"
            });
        }

        const job = await Job.create({
            title,
            description,
            company,
            location,
            salary: salary || "Negotiable / Not Disclosed",
            jobType,
            experienceLevel,
            skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
            perks: Array.isArray(perks) ? perks : [],
            postedBy: req.user._id 
        });

        res.status(201).json({
            success: true,
            message: "Job posted Successfully",
            job
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// 2. Sirf logged-in Recruiter ki apni posted jobs dekhne ka controller (👈 Yeh naya add karna hai)
async function getRecruiterJobs(req, res) {
    try {
        const jobs = await Job.find({ postedBy: req.user._id })
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });

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

// 3. Sabhi jobs dekhne ka controller (Public / Seeker ke liye)
async function getAllJobs(req, res) {
    try {
        const { keyword, location, jobType } = req.query;
        let query = {};

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { skills: { $in: [new RegExp(keyword, "i")] } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        if (jobType) {
            query.jobType = jobType;
        }

        const jobs = await Job.find(query)
            .populate("postedBy", "name email")
            .sort({ createdAt: -1 });

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

module.exports = {
    createJob,
    getRecruiterJobs, // 👈 Export karna mat bhoolna
    getAllJobs
};