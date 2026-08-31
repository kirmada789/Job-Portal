require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const initializeAdmin = require("./src/config/initializeAdmin");

// 👈 Render ke liye process.env.PORT zaroori hai, local ke liye 8000 fallback hai
const port = process.env.PORT || 8000;

async function startServer() {
    try {
        await connectDB();
        await initializeAdmin();

        app.listen(port, () => {
            console.log(`Server is Running on port ${port}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
}

startServer();