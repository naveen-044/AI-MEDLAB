import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";
import { connectDB } from "../db.js";

const JWT_SECRET =
  process.env.JWT_SECRET_KEY || "aimedlab_super_secret_jwt_key_2026_secured";

export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorization denied" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.id;
    req.role = decoded.role;
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: "Token is expired" });
    }

    if (req.role === "doctor") {
      await connectDB();
      const doctor = await Doctor.findById(req.userId);
      if (!doctor) {
        return res
          .status(404)
          .json({ success: false, message: "Doctor not found" });
      }
      req.doctorId = doctor._id;
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId;

  try {
    await connectDB();
    let user;

    const patient = await User.findById(userId);
    const doctor = await Doctor.findById(userId);

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    if (!user || !roles.includes(user.role)) {
      return res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid user ID" });
  }
};
