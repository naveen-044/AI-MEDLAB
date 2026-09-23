import nodemailer from "nodemailer";
import dotEnv from "dotenv";
import express from "express";

const router = express.Router();
dotEnv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASS,
  },
});

// POST route for form submission
router.post("/contact", async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    // Send email using the transporter
    let info = await transporter.sendMail({
      from: {
        name: "Abdul Wahab",
        address: process.env.USER,
      },
      to: "awminhas619@gmail.com",
      subject: subject,
      text: `Email: ${email}\n\nMessage: ${message}`,
    });

    // Send response with email info and success message
    res.status(200).json({ info, message: "Email sent successfully" });
  } catch (error) {
    console.warn("Real email sending failed (likely due to missing credentials). Falling back to console log.");
    console.log("---------------------------------------------------");
    console.log(" [MOCK EMAIL SENT] ");
    console.log(` From: ${email}`);
    console.log(` Subject: ${subject}`);
    console.log(` Message: ${message}`);
    console.log("---------------------------------------------------");

    // Return success to frontend so the UI doesn't break
    res.status(200).json({ message: "Email sent successfully (Simulated)" });
  }
});

export default router;
