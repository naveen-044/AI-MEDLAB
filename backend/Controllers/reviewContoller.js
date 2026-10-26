import Review from "../models/ReviewSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { connectDB } from "../db.js";

export const getAllReviews = async (req, res) => {
  try {
    await connectDB();
    const reviews = await Review.find({});
    return res
      .status(200)
      .json({ success: true, message: "Successful", data: reviews || [] });
  } catch (error) {
    return res
      .status(200)
      .json({ success: true, message: "Successful", data: [] });
  }
};

export const createReview = async (req, res) => {
  try {
    await connectDB();
    if (!req.body.doctor) req.body.doctor = req.params.doctorId;
    if (!req.body.user) req.body.user = req.userId;

    const newReview = new Review(req.body);
    const savedReview = await newReview.save();
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    return res
      .status(200)
      .json({ success: true, message: "Review Submitted", data: savedReview });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
