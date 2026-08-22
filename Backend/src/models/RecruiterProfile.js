const mongoose = require("mongoose");

const recruiterProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    companyName: {
        type:String,
        required: true
    },
    companyWebsite: {
        type: String
    },
    companyLogo: {
        type: String
    },
    companyLocation: {
        type:String
    }
}, {
    timestamps: true
});

const RecruiterProfile = mongoose.model('RecruiterProfile', recruiterProfileSchema);


module.exports = RecruiterProfile;