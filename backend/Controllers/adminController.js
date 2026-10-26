import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import { connectDB } from "../db.js";

export const getAllUsers = async (req, res) => {
  try {
    await connectDB();
    const users = await User.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Users Found",
      data: users || [],
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      message: "Users Found",
      data: [],
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteDoctorById = async (req, res) => {
  try {
    await connectDB();
    const id = req.params.id;
    const deletedUser = await Doctor.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    await connectDB();
    const doctors = await Doctor.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: doctors || [],
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: [],
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({});
    return res.status(200).json({
      counts: bookings.length,
      success: true,
      message: "Bookings Found",
      data: bookings || [],
    });
  } catch (err) {
    return res.status(200).json({
      counts: 0,
      success: true,
      message: "Bookings Found",
      data: [],
    });
  }
};

export const updateDoctorApprovalStatus = async (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;

  if (!["pending", "approved", "cancelled"].includes(isApproved)) {
    return res.status(400).json({ message: "Invalid approval status" });
  }

  try {
    await connectDB();
    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    doctor.isApproved = isApproved;
    await doctor.save();

    return res
      .status(200)
      .json({ message: "Approval status updated successfully", doctor });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
