import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";
import diseaseRoute from "./Routes/disease.js";
import adminRoute from "./Routes/admin.js";
import contactRoute from "./Routes/contact.js";
import forgotPassRoute from "./Routes/forgot-password.js";
import healthRoute from "./Routes/healthPredict.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

process.env.MONGO_URL = process.env.MONGO_URL || '';
process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your_secret_key_here';

const app = express();
const port = process.env.PORT || 8000;

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://ai-medlab-theta.vercel.app", "https://ai-medlab-theta.vercel.app"];
const corsOptions = { origin: allowedOrigins };

app.get("/", (req, res) => {
  res.send("Api is working");
});

//database connection
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/aimedlab');
    console.log("Mongoose connected");
  } catch (error) {
    console.log("Mongoose connection failed", error.message);
  }
};

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute); //domain/api/v1/auth/register or any other request
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/", diseaseRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/", contactRoute);
app.use("/api/v1/", forgotPassRoute);
app.use("/api/v1/", healthRoute);
app.get("/api/v1/ai-health", async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8001"}/health`,
      { signal: AbortSignal.timeout(3_000) },
    );
    const status = await response.json();
    return res.status(response.ok ? 200 : 503).json(status);
  } catch (error) {
    return res.status(503).json({
      status: "unavailable",
      message: "The FastAPI model service is not responding.",
    });
  }
});
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error("Request failed:", error.message);
  const isUploadError = error.name === "MulterError";
  return res.status(isUploadError ? 413 : 400).json({
    success: false,
    message: error.message || "The request could not be processed.",
  });
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log("Server is running on port " + port);
  });
}).catch((error) => {
  console.log("Failed to connect to DB", error);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
