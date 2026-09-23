import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import User from "./models/UserSchema.js";
import bcrypt from "bcryptjs";

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

const resetAndTest = async () => {
    await connectDB();

    // 1. Reset Password for 'madhu'
    const email = "madhu17@gmail.com";
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash("password123", salt);

    const user = await User.findOneAndUpdate(
        { email: email },
        { $set: { password: hashPassword } },
        { new: true }
    );

    if (!user) {
        console.log("User 'madhu' not found!");
        process.exit(1);
    }
    console.log(`Password for ${user.name} (${user.email}) reset to 'password123'.`);
    process.exit(0);
};

resetAndTest();
