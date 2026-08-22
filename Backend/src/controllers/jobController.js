const Job = require("../models/Job.Schema");

// naya job post karne ka controller (sirf recruiter ke liye) 
async function createJob(req, res) {
    try {
        const { title, description, company, location, salary, jobType, experienceLevel, skills, perks } = req.body;

        if (!title || !description || !company || !location) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields (Title, Description, Company, Location)"
            });
        }

        // job create karna aur postedBy mein logged-in user ki ID dalna
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
            postedBy: req.user._id // yeh auth middleware se mil rha hai
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

// sabhi jobs dekhne ka controller (seeker / recruiter dono ke liye)
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

        // location filter
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        // job type filter
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
    getAllJobs
};