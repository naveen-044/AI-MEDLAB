import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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
import { connectDB } from "./db.js";

export { connectDB };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

process.env.MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://naveenkumar:Naveennani@cluster0.ogm15vv.mongodb.net/ai-medlab?retryWrites=true&w=majority";
process.env.JWT_SECRET_KEY =
  process.env.JWT_SECRET_KEY || "aimedlab_super_secret_jwt_key_2026_secured";

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

app.use((req, res, next) => {
  const forwardedUri = req.headers["x-forwarded-uri"];
  const matchedPath = req.headers["x-matched-path"] || req.headers["x-vercel-matched-path"];
  const qIndex = req.url.indexOf("?");
  const query = qIndex !== -1 ? req.url.slice(qIndex) : "";

  const paramMatch = req.url.match(/[?&](?:path|0)=([^&]+)/);
  if (paramMatch) {
    const subPath = decodeURIComponent(paramMatch[1]).replace(/^\/+/, "");
    const cleanQuery = query
      .replace(/([?&])(?:path|0)=[^&]*(&|$)/, "$1")
      .replace(/&&+/g, "&")
      .replace(/[?&]$/, "");
    req.url = `/api/${subPath}${cleanQuery}`;
  } else if (forwardedUri && forwardedUri.startsWith("/api/") && !forwardedUri.endsWith(".js")) {
    req.url = forwardedUri;
  } else if (matchedPath && matchedPath.startsWith("/api/") && !matchedPath.endsWith(".js")) {
    req.url = matchedPath + query;
  }
  next();
});

app.use(async (req, res, next) => {
  if (process.env.MONGO_URL) {
    try {
      await connectDB();
    } catch (e) {}
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.get("/api", (req, res) => {
  res.send("Api is working");
});

app.get("/api/index", (req, res) => {
  res.send("Api is working");
});

app.get("/api/index.js", (req, res) => {
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
mountRoutes("/api");
mountRoutes("");

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
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
  }).catch(() => {});
}

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

export default app;
