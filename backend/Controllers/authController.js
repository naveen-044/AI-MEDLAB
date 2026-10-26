import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../db.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15d",
    }
  );
};

export const register = async (req, res) => {
  const { email, password, name, role, photo, gender } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ success: false, message: "Name, email, and password are required" });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {
      return res.status(503).json({
        success: false,
        message: "Unable to connect to MongoDB. In MongoDB Atlas, verify Network Access allows 0.0.0.0/0.",
      });
    }
  }

  try {
    let user = null;

    if (role === "patient" || role === "assistant") {
      user = await User.findOne({ email });
    } else if (role === "doctor") {
      user = await Doctor.findOne({ email });
    }

    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    if (role === "patient" || role === "assistant") {
      user = new User({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    if (role === "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword,
        photo,
        gender,
        role,
      });
    }

    await user.save();
    return res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Internal server error, please try again" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: false, message: "Email and password are required" });
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (e) {
      return res.status(503).json({
        status: false,
        message: "Unable to connect to MongoDB. In MongoDB Atlas, verify Network Access allows 0.0.0.0/0.",
      });
    }
  }

  try {
    let user = null;

    const patient = await User.findOne({ email });
    const doctor = await Doctor.findOne({ email });
    const admin = await User.findOne({ email, role: "admin" });

    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }
    if (admin) {
      user = admin;
    }

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credentials, please try again" });
    }

    const token = generateToken(user);
    const { password: userPassword, role, appointments, ...rest } = user._doc;
    return res.status(200).json({
      status: true,
      message: "Successfully logged in",
      token,
      data: { ...rest },
      role,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message || "Failed to login" });
  }
};
