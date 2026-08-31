const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
    },
    company: {
        type: String,
        required: [true, "Company name is required"],
        trim: true
    },
    location: {
        type: String,
        required: [true, "Job location is required"]
    },
    salary: {
        type: String,
        default: "Negotiable / Not Disclosed"
    },
    jobType: {
        type: String,
        enum: ["Full-time", "Part-time", "Internship", "Contract"],
        default: "Full-time"
    },
    experienceLevel: {
        type: String,
        default: "Mid Level"
    },
    status: {
        type: String,
        enum: ["active", "closed"], // 👈 Admin dwara job active/close manage karne ke liye
        default: "active"
    },
    skills: {
        type: [String],
        default: []
    },
    perks: {
        type: [String],
        default: []
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;