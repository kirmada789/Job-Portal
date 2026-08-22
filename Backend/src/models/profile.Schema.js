const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    bio: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    skills: [{
        type: String
    }],
    education: [{
        degree: String,
        school: String,
        year: String
    }],
    experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
    }],
    // GitHub aur Portfolio yahan add kiye gaye hain
    socials: {
        github: { type: String, default: "" },
        portfolio: { type: String, default: "" }
    },
    resume: {
        url: String, // pdf ka link
        publicId: String // cloudinary ya storage provider ka id
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);