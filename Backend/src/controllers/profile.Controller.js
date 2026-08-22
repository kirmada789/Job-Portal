const Profile = require("../models/profile.Schema");
const User = require("../models/user.Schema"); 
const fs = require('fs');
const path = require('path');

async function updateProfile(req, res) {
    try {
        const userId = req.user._id;
        const { name, bio, phone, skills, education, experience, socials, company, location } = req.body;

        // Check user role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Agar user RECRUITER hai, toh User model mein hi details save hongi
        if (user.role === 'recruiter') {
            const updateFields = {};
            if (name !== undefined) updateFields.name = name;
            if (bio !== undefined) updateFields.bio = bio;
            if (phone !== undefined) updateFields.phone = phone;
            if (company !== undefined) updateFields.company = company;
            if (location !== undefined) updateFields.location = location;

            const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true }).select("-password");

            return res.status(200).json({
                success: true,
                message: "Recruiter profile updated successfully in database!",
                profile: { 
                    userId: updatedUser, 
                    bio: updatedUser.bio, 
                    phone: updatedUser.phone, 
                    company: updatedUser.company, 
                    location: updatedUser.location 
                }
            });
        }

        // --- Purana Seeker Logic (Untouched) ---
        if (name !== undefined) {
            await User.findByIdAndUpdate(userId, { name });
        }

        let profile = await Profile.findOne({ userId });

        if (profile) {
            if (bio !== undefined) profile.bio = bio;
            if (phone !== undefined) profile.phone = phone;
            if (skills !== undefined) profile.skills = skills;
            if (education !== undefined) profile.education = education;
            if (experience !== undefined) profile.experience = experience;
            if (socials !== undefined) profile.socials = socials;

            await profile.save();
        } else {
            profile = await Profile.create({
                userId,
                bio,
                phone,
                skills,
                education,
                experience,
                socials
            });
        }

        const updatedProfile = await Profile.findOne({ userId }).populate("userId", "name email role");

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getProfile(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Agar recruiter hai toh User model se data bhejenge
        if (user.role === 'recruiter') {
            return res.status(200).json({
                success: true,
                profile: {
                    userId: user,
                    bio: user.bio,
                    phone: user.phone,
                    company: user.company,
                    location: user.location
                }
            });
        }

        // Seeker logic
        const profile = await Profile.findOne({
            userId: req.user._id
        }).populate("userId", "name email role");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }
        res.status(200).json({
            success: true,
            profile
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// upload resume
async function uploadResume(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file"
            });
        }

        const userId = req.user._id;
        const resumeUrl = `/uploads/${req.file.filename}`;

        let profile = await Profile.findOne({
            userId
        });

        if (profile) {
            profile.resume = {
                url: resumeUrl,
                publicId: req.file.filename
            };
            await profile.save();
        } else {
            profile = await Profile.create({
                userId,
                resume: {
                    url: resumeUrl,
                    publicId: req.file.filename
                }
            });
        }

        res.status(200).json({
            success: true,
            message: "Resume upload successfully!",
            resume: profile.resume
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Recruiter ke liye seeker ki profile ki resume dekhne ka api
async function getSeekerProfileForRecruiter(req, res) {
    try {
        const { seekerId } = req.params;

        const profile = await Profile.findOne({
            userId: seekerId
        }).populate("userId", "name email");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Seeker profile not found"
            });
        }

        res.status(200).json({
            success: true,
            profile 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteResume(req, res) {
    try {
        const userId = req.user._id;
        let profile = await Profile.findOne({ userId });

        if (!profile || !profile.resume || !profile.resume.url) {
            return res.status(404).json({ success: false, message: "Resume not found in database" });
        }

        const filename = path.basename(profile.resume.url);
        const absolutePath = path.join(__dirname, '../../uploads', filename);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
        }

        profile.resume = undefined;
        await profile.save();

        res.status(200).json({
            success: true,
            message: "Resume deleted successfully!"
        });

    } catch (error) {
        console.error("Delete resume error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// koi user ka pura data nikl ne ke liye
async function getUserFullProfile(req, res) {
    try {
        const { userId } = req.params;

        const profile = await Profile.findOne({ userId }).populate("userId", "name email role");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "User profile not found"
            });
        }

        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    updateProfile,
    getProfile,
    uploadResume,
    getSeekerProfileForRecruiter,
    deleteResume,
    getUserFullProfile
};