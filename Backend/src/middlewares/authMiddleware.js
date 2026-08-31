const jwt = require("jsonwebtoken");
const User = require("../models/user.Schema");

// Token check karne ka middleware (Ab ye Cookie aur Header dono check karega)
const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Agar cookie nahi hai, toh Authorization Header check karega (Bearer token)
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, no token found"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, invalid user token"
            });
        }

        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized, token failed"
        });
    }
};

const recruiterOnly = (req, res, next) => {
    if (req.user && req.user.role === "recruiter") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied, only recruiter can post jobs"
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied, only admin can access this route"
        });
    }
};

const recruiterOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "recruiter" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Access denied, only recruiters or admins can view this profile"
        });
    }
};

module.exports = {
    protect,
    recruiterOnly,
    adminOnly,
    recruiterOrAdmin
};