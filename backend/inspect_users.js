import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import User from "./models/UserSchema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/aimedlab');
        console.log("Mongoose connected");
    } catch (error) {
        console.log("Mongoose connection failed", error.message);
        process.exit(1);
    }
};

const inspectUsers = async () => {
    await connectDB();
    const users = await User.find({});
    console.log("Total Users:", users.length);
    users.forEach(u => {
        console.log(`Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`);
    });
    process.exit(0);
};

inspectUsers();
