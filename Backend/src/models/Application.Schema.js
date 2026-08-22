const { application } = require("express");
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    application: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type:String,
        enum: ["Pending", "Viewed", "Shortlisted", "Selected", "Rejected"],
        default: "Pending"
    }
}, {
    timestamps: true
})

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;