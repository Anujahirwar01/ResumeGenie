import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
}

export default connectDB;