const User = require("../models/user.Schema");
const SeekerProfileSchema = require("../models/SeekerProfile");
const RecruiterProfile = require("../models/RecruiterProfile");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
};

const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,      // Render (HTTPS) ke liye zaroori hai
    sameSite: "none"   // Netlify (Frontend) aur Render (Backend) cross-domain ke liye zaroori hai
};

async function registerUser(req, res) {
    try {
        const { name, email, password, role, companyName } = req.body;

        const userAlreadyExists = await User.findOne({ email });

        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists"
            });
        }
        
        const user = await User.create({
            name, email, password, role
        });

        if (role === "seeker") {
            await SeekerProfileSchema.create({ userId: user._id });
        } else if (role === "recruiter") {
            await RecruiterProfile.create({
                userId: user.id,
                companyName: companyName || "Not specified"
            });
        }

        const token = generateToken(user._id);

        return res.status(201).cookie("token", token, cookieOption).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during registration"
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        const token = generateToken(user._id);

        return res.status(200).cookie("token", token, cookieOption).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token            
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during login"
        });
    }
}

async function googleAuth(req, res) {
    try {
        const { token, role } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: "Google token is missing" });
        }

        // Google ke userinfo endpoint se access token ke zariye user details fetch karein
        const googleRes = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        const { email, name } = googleRes.data;

        if (!email) {
            return res.status(400).json({ success: false, message: "Google token does not contain email" });
        }

        let user = await User.findOne({ email });

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            const assignedRole = role || "seeker";

            user = await User.create({
                name: name || "Google User",
                email,
                password: hashedPassword,
                role: assignedRole
            });

            if (assignedRole === "seeker") {
                await SeekerProfileSchema.create({ userId: user._id });
            } else if (assignedRole === "recruiter") {
                await RecruiterProfile.create({
                    userId: user._id,
                    companyName: "Not specified"
                });
            }
        }

        const jwtToken = generateToken(user._id);

        return res.status(200).cookie("token", jwtToken, cookieOption).json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: jwtToken
        });

    } catch (error) {
        console.error("GOOGLE AUTH ERROR DETAILS:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: error.response?.data?.error_description || error.message || "Google authentication failed"
        });
    }
}

async function googleCallback(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Google authentication failed"
            });
        }

        const token = jwt.sign(
            { id: req.user._id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOption);

        return res.status(200).json({
            success: true,
            message: "Logged in successfully via Google!",
            token,
            user: req.user
        });
    } catch (error) {
        console.error("GOOGLE CALLBACK ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Google callback failed"
        });
    }
}

async function logout(req, res) {
    try {
        return res.status(200).cookie("token", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0)
        }).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found with this email"
            });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `https://theejobportal.netlify.app/reset-password/${resetToken}`;
        const message = `You are receiving this email because you have requested a password reset.\n\nPlease make a Put request to:\n\n${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Token",
                message
            });

            return res.status(200).json({
                success: true,
                message: "Email sent successfully!"
            });
        } catch (error) {
            console.error("EMAIL SENDING ERROR:", error);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({
                success: false,
                message: error.message || "Email could not be sent"
            });
        }
    } catch (error) {
        console.error("SERVER ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function resetPassword(req, res) {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        const { password } = req.body;
        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Please enter a new password"
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    registerUser,
    loginUser,
    googleAuth,
    googleCallback,
    logout,
    forgotPassword,
    resetPassword
};