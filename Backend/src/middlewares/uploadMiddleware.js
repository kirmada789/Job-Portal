const multer = require("multer");
const path = require("path");

// Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// File Filter: Sirf PDF allow karne ke liye (Extension aur Mimetype dono check karega)
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Check karega ki file extension .pdf hai ya nahi aur mimetype application/pdf ya octet-stream (kabhi-kabhi postman/browsers bhejte hain) hai ya nahi
    if (ext === ".pdf" && (file.mimetype === "application/pdf" || file.mimetype === "application/octet-stream")) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF resumes are allowed!"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB limit
});

module.exports = upload;