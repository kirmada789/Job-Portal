const express = require("express");
const passport = require("passport");
const session = require("express-session");
require("./config/passport");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const profileRoutes = require("./routes/profileRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cors = require("cors");
const app = express();

app.use(cors({
    origin: [
        "https://theejobportal.netlify.app", 
        "https://frontend-ks0lfo1vr-skillhub0260-6584.vercel.app", // 👈 Yahan daal diya tumhara exact Vercel link
        "http://localhost:5173", 
        "http://localhost:3000"
    ],
    credentials: true, // Cookies (JWT) ke liye zaroori hai
    allowedHeaders: ["Content-Type", "Authorization"] // Bearer token header allow karne ke liye
}));

app.use(session({
    secret: process.env.SESSION_SECRET || "someSecretKey",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/seeker", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));

app.use(errorHandler);

module.exports = app;