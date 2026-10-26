import mongoose from "mongoose";

let isDbConnected = false;

export const connectDB = async () => {
  if (isDbConnected || mongoose.connection.readyState >= 1) {
    return;
  }
  const mongoUri = process.env.MONGO_URL;
  if (!mongoUri) {
    return;
  }
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 4000 });
    isDbConnected = true;
    console.log("Mongoose connected");
  } catch (error) {
    console.error("Mongoose connection failed:", error.message);
  }
};
