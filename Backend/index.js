require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/config/db");

// 👈 Render ke liye process.env.PORT zaroori hai, local ke liye 8000 fallback hai
const port = process.env.PORT || 8000;

connectDB();

app.listen(port, () => {
    console.log(`Server is Running on port ${port}`);
});