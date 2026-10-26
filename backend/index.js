import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
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

dotenv.config({ path: path.join(__dirname, ".env") });

process.env.MONGO_URL = process.env.MONGO_URL || "";
process.env.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "your_secret_key_here";

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (!process.env.CORS_ORIGIN) return callback(null, true);
    const origins = process.env.CORS_ORIGIN.split(",").map((o) => o.trim());
    if (
      origins.includes("*") ||
      origins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1")
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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

app.use(async (req, res, next) => {
  if (process.env.MONGO_URL) {
    await connectDB();
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.get("/api", (req, res) => {
  res.send("Api is working");
});

const mountRoutes = (prefix) => {
  app.use(`${prefix}/auth`, authRoute);
  app.use(`${prefix}/users`, userRoute);
  app.use(`${prefix}/doctors`, doctorRoute);
  app.use(`${prefix}/reviews`, reviewRoute);
  app.use(`${prefix}/bookings`, bookingRoute);
  app.use(`${prefix}`, diseaseRoute);
  app.use(`${prefix}/admin`, adminRoute);
  app.use(`${prefix}`, contactRoute);
  app.use(`${prefix}`, forgotPassRoute);
  app.use(`${prefix}`, healthRoute);
  app.get(`${prefix}/ai-health`, async (req, res) => {
    try {
      const response = await fetch(
        `${process.env.AI_SERVICE_URL || "http://127.0.0.1:8001"}/health`,
        { signal: AbortSignal.timeout(3_000) },
      );
      const status = await response.json();
      return res.status(response.ok ? 200 : 503).json(status);
    } catch (error) {
      return res.status(200).json({
        status: "available_fallback",
        message: "Running with built-in screening engine.",
      });
    }
  });
};

mountRoutes("/api/v1");
mountRoutes("/v1");

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error("Request failed:", error.message);
  const isUploadError = error.name === "MulterError";
  return res.status(isUploadError ? 413 : 400).json({
    success: false,
    message: error.message || "The request could not be processed.",
  });
});

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(port, () => {
      console.log("Server is running on port " + port);
    });
  }).catch((error) => {
    console.error("Failed to connect to DB", error);
  });
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
