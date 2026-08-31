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
    secure: true,      
    sameSite: "none"   
};

// 1. REGISTER USER (Plain password bhejo, Mongoose schema khud pre-save hook se hash karega)
async function registerUser(req, res) {
    try {
        const { name, email, password, role, companyName } = req.body;

        let user = await User.findOne({ email });

        if (user && user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists and Verified"
            });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpireDate = Date.now() + 10 * 60 * 1000;

        if (!user) {
            user = await User.create({
                name, 
                email, 
                password: password, // 👈 Plain password (Schema hash kar dega)
                role,
                isVerified: false,
                otp: otpCode,
                otpExpire: otpExpireDate
            });

            if (role === "seeker") {
                await SeekerProfileSchema.create({ userId: user._id });
            } else if (role === "recruiter") {
                await RecruiterProfile.create({
                    userId: user._id,
                    companyName: companyName || "Not specified"
                });
            }
        } else {
            user.name = name;
            user.password = password; // 👈 Plain password update (Schema hash kar dega on save)
            user.role = role;
            user.otp = otpCode;
            user.otpExpire = otpExpireDate;
            await user.save();
        }

        await sendEmail({
            email: user.email,
            subject: "Account Verification OTP - JobPortal Nexus",
            message: `Hello ${name},\n\nYour OTP for account verification is: ${otpCode}\nThis OTP is valid for 10 minutes.\n\nRegards,\nJobPortal Nexus`
        });

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email. Please verify to complete registration.",
            email: user.email
        });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error during registration"
        });
    }
}

// 2. VERIFY OTP (Account verify karega, direct token nahi dega)
async function verifyOtp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already verified" });
        }

        if (user.otp !== otp || user.otpExpire < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully! Please login with your credentials."
        });

    } catch (error) {
        console.error("VERIFY OTP ERROR:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// 3. LOGIN USER (Check karega ki verified hai ya nahi)
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

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email with OTP first before logging in."
            });
        }

        if (user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by the admin."
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

        const googleRes = await axios.get(`https://oauth2.googleapis.com/tokeninfo`, {
            params: { id_token: token }
        });
        
        const { email, name } = googleRes.data;

        if (!email) {
            return res.status(400).json({ success: false, message: "Google token does not contain email" });
        }

        let user = await User.findOne({ email });

        if (user && user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by the admin."
            });
        }

        if (!user) {
            const randomPassword = crypto.randomBytes(16).toString("hex");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            const assignedRole = role || "seeker";

            user = await User.create({
                name: name || "Google User",
                email,
                password: hashedPassword,
                role: assignedRole,
                isVerified: true 
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

        if (req.user.status === "blocked") {
            return res.status(403).json({
                success: false,
                message: "Your account has been blocked by the admin."
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

        const frontendUrl = process.env.FRONTEND_URL || "https://frontend-ma5e338m4-skillhub0260-6584.vercel.app";
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
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
    verifyOtp,
    loginUser,
    googleAuth,
    googleCallback,
    logout,
    forgotPassword,
    resetPassword
};