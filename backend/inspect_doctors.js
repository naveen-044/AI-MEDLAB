import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import Doctor from "./models/DoctorSchema.js";

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

const inspectDoctors = async () => {
    await connectDB();
    const doctors = await Doctor.find({});
    console.log("Total Doctors:", doctors.length);
    doctors.forEach(d => {
        console.log(`Name: ${d.name}, Parsed Approved: ${d.isApproved}, Raw Approved: ${JSON.stringify(d.isApproved)}`);
    });
    process.exit(0);
};

inspectDoctors();
