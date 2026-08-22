const mongoose = require("mongoose");

const seekerProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    resume: {
        type: Object // Resume object store karne ke liye (url, publicId)
    },
    skills: {
        type: [String] // Skills ko array of strings mein lena behtar hai
    },
    bio: {
        type: String,
        maxlength: 250
    },
    experienceLevel: {
        type: String,
        enum: ['Fresher', '1-2 years', '3-5 years', '5+ years'],
        default: 'Fresher'
    },
    phone: {
        type: String
    },
    // Nayi fields yahan add ki gayi hain
    experience: [{
        title: String,
        company: String,
        duration: String,
        description: String
    }],
    education: [{
        degree: String,
        school: String,
        year: String
    }]
}, {
    timestamps: true
});

const SeekerProfileSchema = mongoose.model("SeekerProfile", seekerProfileSchema);

module.exports = SeekerProfileSchema;