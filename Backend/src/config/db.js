const mongoose = require("mongoose");


async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("connected to DB")
        return mongoose.connection;
    } catch (error) {
        console.error("throw err", error)
        throw error;
    }
    
}

module.exports = connectDB;