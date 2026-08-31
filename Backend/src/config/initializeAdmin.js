const User = require("../models/user.Schema");

async function initializeAdmin() {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
        return existingAdmin;
    }

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
        admin.role = "admin";
        admin.status = "active";
        await admin.save();
    } else {
        admin = await User.create({
            name: "Master Admin",
            email: adminEmail,
            password: adminPassword,
            role: "admin",
            status: "active"
        });
    }

    console.log(`Admin initialized: ${admin.email}`);
    return admin;
}

module.exports = initializeAdmin;