import nodemailer from "nodemailer";
import dotEnv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/UserSchema.js";

const router = express.Router();
dotEnv.config();

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    const secret = process.env.JWT_SECRET_KEY || "your_secret_key_here";
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "1d",
    });

    const clientUrl = (process.env.CLIENT_SITE_URL || "http://localhost:5173").replace(/\/$/, "");
    const resetLink = `${clientUrl}/reset-password/${user._id}/${token}`;

    if (!process.env.USER || !process.env.APP_PASS) {
      return res.status(200).json({
        success: true,
        message: "Password reset link generated successfully",
        resetLink,
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.USER,
        pass: process.env.APP_PASS,
      },
    });

    const mailOptions = {
      from: {
        name: "AI MedLab",
        user: process.env.USER,
      },
      to: email,
      subject: "Password Reset Request",
      text: `Click the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        return res.status(200).json({
          success: true,
          message: "Password reset instructions processed",
        });
      }
      return res.status(200).json({ success: true, message: "Email sent successfully" });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const secret = process.env.JWT_SECRET_KEY || "your_secret_key_here";

  jwt.verify(token, secret, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const updated = await User.findByIdAndUpdate(id, { password: hashPassword });
      if (!updated) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Failed to update password" });
    }
  });
});

export default router;
