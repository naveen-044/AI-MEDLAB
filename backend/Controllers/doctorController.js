import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { connectDB } from "../db.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    const updateDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updateDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updateDoctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update doctor",
      error: error.message,
    });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    await Doctor.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Doctor Found",
      data: doctor,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to find Doctor",
    });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    await connectDB();
    const { query } = req.query;
    let doctors;

    if (query) {
      doctors = await Doctor.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    return res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: doctors || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: [],
    });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.doctorId;

  try {
    await connectDB();
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });

    return res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
