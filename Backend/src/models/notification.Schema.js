const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true // Kis recruiter ko notification bhejna hai
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // Kis seeker ne apply kiya hai (optional)
    },
    message: {
        type: String,
        required: true
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;